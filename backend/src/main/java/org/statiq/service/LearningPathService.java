package org.statiq.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.statiq.dto.*;
import org.statiq.entity.*;
import org.statiq.enums.EnrollmentStatus;
import org.statiq.exception.ResourceNotFoundException;
import org.statiq.igot.IGotCourseProvider;
import org.statiq.repository.*;
import org.statiq.security.UserPrincipal;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LearningPathService {

    private static final Logger logger = LoggerFactory.getLogger(LearningPathService.class);

    private final LearningPathRepository learningPathRepository;
    private final LearningPathItemRepository learningPathItemRepository;
    private final LearnerProfileRepository learnerProfileRepository;
    private final SkillGapService skillGapService;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final IGotCourseProvider igotCourseProvider;

    public LearningPathService(
            LearningPathRepository learningPathRepository,
            LearningPathItemRepository learningPathItemRepository,
            LearnerProfileRepository learnerProfileRepository,
            SkillGapService skillGapService,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            IGotCourseProvider igotCourseProvider
    ) {
        this.learningPathRepository = learningPathRepository;
        this.learningPathItemRepository = learningPathItemRepository;
        this.learnerProfileRepository = learnerProfileRepository;
        this.skillGapService = skillGapService;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.igotCourseProvider = igotCourseProvider;
    }

    @Transactional(readOnly = true)
    public LearningPathDto getLearningPath(UserPrincipal principal) {
        LearnerProfile profile = learnerProfileRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found"));

        Optional<LearningPath> pathOpt = learningPathRepository.findFirstByLearnerProfileOrderByCreatedAtDesc(profile);

        if (pathOpt.isEmpty()) {
            return generateLearningPath(principal);
        }

        return mapToDto(pathOpt.get(), profile);
    }

    @Transactional
    public LearningPathDto generateLearningPath(UserPrincipal principal) {
        LearnerProfile profile = learnerProfileRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found"));

        List<SkillGapDto> gaps = skillGapService.calculateSkillGapsForProfile(profile);

        LearningPath path = new LearningPath();
        path.setLearnerProfile(profile);
        path.setTitle(profile.getJobRole() + " Personalized Competency Roadmap");
        path.setDescription("Sequenced high-yield learning roadmap curated dynamically to eliminate high-impact statistical, technical, and digital governance skill gaps.");
        path.setTargetRole(profile.getJobRole());

        LearningPath savedPath = learningPathRepository.save(path);

        Set<Long> addedCourseIds = new HashSet<>();
        List<LearningPathItem> items = new ArrayList<>();
        int sequence = 1;
        int totalHours = 0;

        for (SkillGapDto gap : gaps) {
            if (gap.getGap() <= 5.0) continue;

            // Find courses for this competency
            courseRepository.findAll().stream()
                    .filter(c -> c.getCompetencies().stream().anyMatch(comp -> comp.getId().equals(gap.getCompetencyId())))
                    .filter(c -> !addedCourseIds.contains(c.getId()))
                    .forEach(course -> {
                        addedCourseIds.add(course.getId());
                        LearningPathItem item = new LearningPathItem();
                        item.setLearningPath(savedPath);
                        item.setCourse(course);
                        item.setSequenceOrder(items.size() + 1);

                        // Check enrollment status
                        Optional<Enrollment> enr = enrollmentRepository.findByLearnerProfileAndCourse(profile, course);
                        if (enr.isPresent()) {
                            item.setStatus(enr.get().getStatus().name());
                        } else {
                            item.setStatus(items.isEmpty() ? "IN_PROGRESS" : "NOT_STARTED");
                        }

                        items.add(item);
                    });

            if (items.size() >= 6) {
                break; // Top 6 prioritized milestone courses for actionable roadmap
            }
        }

        for (LearningPathItem it : items) {
            totalHours += it.getCourse().getDurationHours();
        }

        savedPath.setTotalEstimatedHours(totalHours);
        learningPathItemRepository.saveAll(items);
        savedPath.setItems(items);
        LearningPath result = learningPathRepository.save(savedPath);

        logger.info("Generated new learning path for learner {} with {} courses and {} hours",
                profile.getEmployeeId(), items.size(), totalHours);

        return mapToDto(result, profile);
    }

    @Transactional(readOnly = true)
    public LearningProgressSummaryDto getLearningProgress(UserPrincipal principal) {
        LearnerProfile profile = learnerProfileRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found"));
        return igotCourseProvider.getCompletionStatus(profile.getId());
    }

    private LearningPathDto mapToDto(LearningPath path, LearnerProfile profile) {
        LearningPathDto dto = new LearningPathDto();
        dto.setId(path.getId());
        dto.setTitle(path.getTitle());
        dto.setDescription(path.getDescription());
        dto.setTargetRole(path.getTargetRole());
        dto.setTotalEstimatedHours(path.getTotalEstimatedHours());
        dto.setCreatedAt(path.getCreatedAt());

        Map<Long, Enrollment> enrollmentMap = enrollmentRepository.findByLearnerProfile(profile).stream()
                .collect(Collectors.toMap(e -> e.getCourse().getId(), e -> e, (e1, e2) -> e1));

        int completedHours = 0;
        List<LearningPathItemDto> itemDtos = new ArrayList<>();

        for (LearningPathItem item : path.getItems()) {
            LearningPathItemDto itemDto = new LearningPathItemDto();
            itemDto.setId(item.getId());
            itemDto.setCourseId(item.getCourse().getId());
            itemDto.setCourseCode(item.getCourse().getCourseCode());
            itemDto.setCourseTitle(item.getCourse().getTitle());
            itemDto.setCourseDescription(item.getCourse().getDescription());
            itemDto.setProvider(item.getCourse().getProvider());
            itemDto.setDifficulty(item.getCourse().getDifficulty());
            itemDto.setDurationHours(item.getCourse().getDurationHours());
            itemDto.setSequenceOrder(item.getSequenceOrder());

            Enrollment enrollment = enrollmentMap.get(item.getCourse().getId());
            if (enrollment != null) {
                itemDto.setStatus(enrollment.getStatus().name());
                itemDto.setProgressPercent(enrollment.getProgressPercent());
                if (enrollment.getStatus() == EnrollmentStatus.COMPLETED) {
                    completedHours += item.getCourse().getDurationHours();
                } else {
                    completedHours += (int) (item.getCourse().getDurationHours() * (enrollment.getProgressPercent() / 100.0));
                }
            } else {
                itemDto.setStatus(item.getStatus());
                itemDto.setProgressPercent(0);
            }

            itemDtos.add(itemDto);
        }

        dto.setCompletedHours(completedHours);
        int total = path.getTotalEstimatedHours() > 0 ? path.getTotalEstimatedHours() : 1;
        int overallPercent = (int) Math.min(100, Math.round(((double) completedHours / total) * 100));
        dto.setOverallProgressPercent(overallPercent);
        dto.setItems(itemDtos);

        return dto;
    }
}
