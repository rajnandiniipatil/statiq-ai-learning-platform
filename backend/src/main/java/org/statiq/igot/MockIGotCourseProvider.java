package org.statiq.igot;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.statiq.dto.*;
import org.statiq.entity.*;
import org.statiq.enums.EnrollmentStatus;
import org.statiq.exception.ResourceNotFoundException;
import org.statiq.repository.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service("mockIGotCourseProvider")
@Primary
public class MockIGotCourseProvider implements IGotCourseProvider {

    private static final Logger logger = LoggerFactory.getLogger(MockIGotCourseProvider.class);

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LearnerProfileRepository learnerProfileRepository;

    public MockIGotCourseProvider(
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            LearnerProfileRepository learnerProfileRepository
    ) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.learnerProfileRepository = learnerProfileRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<IGotCourseDto> getCourses(Long learnerProfileId) {
        List<Course> courses = courseRepository.findByIsIgotCourseTrue();
        Map<Long, Enrollment> enrollmentsMap = getEnrollmentsMap(learnerProfileId);

        return courses.stream()
                .map(course -> mapToDto(course, enrollmentsMap.get(course.getId())))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public IGotCourseDto getCourseById(Long courseId, Long learnerProfileId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        Enrollment enrollment = null;
        if (learnerProfileId != null) {
            enrollment = enrollmentRepository.findByLearnerProfileIdAndCourseId(learnerProfileId, courseId).orElse(null);
        }

        return mapToDto(course, enrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IGotCourseDto> searchCourses(String query, Long learnerProfileId) {
        List<Course> courses;
        if (query == null || query.isBlank()) {
            courses = courseRepository.findByIsIgotCourseTrue();
        } else {
            courses = courseRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query.trim(), query.trim());
        }

        Map<Long, Enrollment> enrollmentsMap = getEnrollmentsMap(learnerProfileId);
        return courses.stream()
                .map(course -> mapToDto(course, enrollmentsMap.get(course.getId())))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EnrollmentResultDto enrollCourse(Long learnerProfileId, Long courseId) {
        LearnerProfile profile = learnerProfileRepository.findById(learnerProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found with id: " + learnerProfileId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        Optional<Enrollment> existingOpt = enrollmentRepository.findByLearnerProfileAndCourse(profile, course);
        Enrollment enrollment;

        if (existingOpt.isPresent()) {
            enrollment = existingOpt.get();
            EnrollmentResultDto result = new EnrollmentResultDto(true, "Already enrolled in this course");
            result.setEnrollmentId(enrollment.getId());
            result.setCourseId(course.getId());
            result.setCourseTitle(course.getTitle());
            result.setStatus(enrollment.getStatus());
            result.setProgressPercent(enrollment.getProgressPercent());
            result.setEnrolledAt(enrollment.getEnrolledAt());
            return result;
        } else {
            enrollment = new Enrollment(profile, course);
            enrollment.setProgressPercent(10); // Start with initial 10% on enrollment
            enrollment.setStatus(EnrollmentStatus.IN_PROGRESS);
            Enrollment saved = enrollmentRepository.save(enrollment);

            logger.info("Learner {} enrolled into iGOT course {} ({})", profile.getEmployeeId(), course.getTitle(), course.getCourseCode());

            EnrollmentResultDto result = new EnrollmentResultDto(true, "Successfully enrolled in iGOT Karmayogi course: " + course.getTitle());
            result.setEnrollmentId(saved.getId());
            result.setCourseId(course.getId());
            result.setCourseTitle(course.getTitle());
            result.setStatus(saved.getStatus());
            result.setProgressPercent(saved.getProgressPercent());
            result.setEnrolledAt(saved.getEnrolledAt());
            return result;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public EnrollmentDto getEnrollmentStatus(Long learnerProfileId, Long courseId) {
        Enrollment enrollment = enrollmentRepository.findByLearnerProfileIdAndCourseId(learnerProfileId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment record not found for course: " + courseId));

        return mapToEnrollmentDto(enrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public LearningProgressSummaryDto getCompletionStatus(Long learnerProfileId) {
        LearnerProfile profile = learnerProfileRepository.findById(learnerProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found: " + learnerProfileId));

        List<Enrollment> enrollments = enrollmentRepository.findByLearnerProfile(profile);

        int enrolledCount = enrollments.size();
        int completedCount = 0;
        int inProgressCount = 0;
        int totalHoursCompleted = 0;

        List<EnrollmentDto> dtos = new ArrayList<>();
        for (Enrollment e : enrollments) {
            dtos.add(mapToEnrollmentDto(e));
            if (e.getStatus() == EnrollmentStatus.COMPLETED) {
                completedCount++;
                totalHoursCompleted += e.getCourse().getDurationHours();
            } else if (e.getStatus() == EnrollmentStatus.IN_PROGRESS) {
                inProgressCount++;
                totalHoursCompleted += (int) (e.getCourse().getDurationHours() * (e.getProgressPercent() / 100.0));
            }
        }

        double completionRate = enrolledCount > 0 ? ((double) completedCount / enrolledCount) * 100.0 : 0.0;

        LearningProgressSummaryDto summary = new LearningProgressSummaryDto();
        summary.setEnrolledCoursesCount(enrolledCount);
        summary.setCompletedCoursesCount(completedCount);
        summary.setInProgressCoursesCount(inProgressCount);
        summary.setTotalLearningHoursCompleted(totalHoursCompleted);
        summary.setOverallCompletionRate(Math.round(completionRate * 10.0) / 10.0);
        summary.setEnrollments(dtos);

        return summary;
    }

    private Map<Long, Enrollment> getEnrollmentsMap(Long learnerProfileId) {
        if (learnerProfileId == null) {
            return Collections.emptyMap();
        }
        return learnerProfileRepository.findById(learnerProfileId)
                .map(profile -> enrollmentRepository.findByLearnerProfile(profile).stream()
                        .collect(Collectors.toMap(e -> e.getCourse().getId(), e -> e, (e1, e2) -> e1)))
                .orElse(Collections.emptyMap());
    }

    private IGotCourseDto mapToDto(Course course, Enrollment enrollment) {
        IGotCourseDto dto = new IGotCourseDto();
        dto.setId(course.getId());
        dto.setCourseCode(course.getCourseCode());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setProvider(course.getProvider());
        dto.setDifficulty(course.getDifficulty());
        dto.setDurationHours(course.getDurationHours());
        dto.setCategory(course.getCategory());
        dto.setLanguage(course.getLanguage());
        dto.setExternalUrl(course.getExternalUrl());
        dto.setIsIgotCourse(course.getIgotCourse());

        if (course.getCompetencies() != null) {
            dto.setCompetencyCodes(course.getCompetencies().stream().map(Competency::getCode).collect(Collectors.toList()));
            dto.setCompetencyNames(course.getCompetencies().stream().map(Competency::getName).collect(Collectors.toList()));
        }

        if (enrollment != null) {
            dto.setEnrollmentStatus(enrollment.getStatus());
            dto.setProgressPercent(enrollment.getProgressPercent());
        }

        return dto;
    }

    private EnrollmentDto mapToEnrollmentDto(Enrollment e) {
        EnrollmentDto dto = new EnrollmentDto();
        dto.setId(e.getId());
        dto.setCourseId(e.getCourse().getId());
        dto.setCourseCode(e.getCourse().getCourseCode());
        dto.setCourseTitle(e.getCourse().getTitle());
        dto.setCourseDescription(e.getCourse().getDescription());
        dto.setProvider(e.getCourse().getProvider());
        dto.setDifficulty(e.getCourse().getDifficulty());
        dto.setDurationHours(e.getCourse().getDurationHours());
        dto.setCategory(e.getCourse().getCategory());
        dto.setStatus(e.getStatus());
        dto.setProgressPercent(e.getProgressPercent());
        dto.setEnrolledAt(e.getEnrolledAt());
        dto.setCompletedAt(e.getCompletedAt());
        return dto;
    }
}
