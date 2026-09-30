package org.statiq.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.statiq.dto.RecommendationDto;
import org.statiq.dto.SkillGapDto;
import org.statiq.entity.*;
import org.statiq.enums.PriorityLevel;
import org.statiq.exception.ResourceNotFoundException;
import org.statiq.repository.*;
import org.statiq.security.UserPrincipal;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);

    private final RecommendationRepository recommendationRepository;
    private final SkillGapService skillGapService;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LearnerProfileRepository learnerProfileRepository;
    private final CompetencyRepository competencyRepository;

    public RecommendationService(
            RecommendationRepository recommendationRepository,
            SkillGapService skillGapService,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            LearnerProfileRepository learnerProfileRepository,
            CompetencyRepository competencyRepository
    ) {
        this.recommendationRepository = recommendationRepository;
        this.skillGapService = skillGapService;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.learnerProfileRepository = learnerProfileRepository;
        this.competencyRepository = competencyRepository;
    }

    @Transactional(readOnly = true)
    public List<RecommendationDto> getRecommendations(UserPrincipal principal) {
        LearnerProfile profile = learnerProfileRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found"));

        List<Recommendation> recommendations = recommendationRepository.findByLearnerProfileOrderByCreatedAtDesc(profile);

        if (recommendations.isEmpty()) {
            return generateRecommendations(principal);
        }

        Map<Long, Enrollment> enrollmentMap = enrollmentRepository.findByLearnerProfile(profile).stream()
                .collect(Collectors.toMap(e -> e.getCourse().getId(), e -> e, (e1, e2) -> e1));

        return recommendations.stream()
                .map(r -> mapToDto(r, enrollmentMap.get(r.getCourse().getId())))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<RecommendationDto> generateRecommendations(UserPrincipal principal) {
        LearnerProfile profile = learnerProfileRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found"));

        List<SkillGapDto> gaps = skillGapService.calculateSkillGapsForProfile(profile);

        // Delete previous recommendations to refresh with fresh Bayesian ratings
        recommendationRepository.deleteByLearnerProfile(profile);

        List<Recommendation> newRecommendations = new ArrayList<>();
        Set<Long> recommendedCourseIds = new HashSet<>();

        for (SkillGapDto gap : gaps) {
            if (gap.getGap() <= 5.0) {
                continue; // Do not recommend courses for strong / fully satisfied skills
            }

            Competency comp = competencyRepository.findById(gap.getCompetencyId()).orElse(null);
            if (comp == null) continue;

            List<Course> matchingCourses = courseRepository.findByCompetency(comp);

            for (Course course : matchingCourses) {
                if (recommendedCourseIds.contains(course.getId())) {
                    continue;
                }

                PriorityLevel priority;
                if (gap.getGap() >= 30.0) {
                    priority = PriorityLevel.HIGH;
                } else if (gap.getGap() >= 15.0) {
                    priority = PriorityLevel.MEDIUM;
                } else {
                    priority = PriorityLevel.LOW;
                }

                String reason = "Your current " + comp.getName() + " competency is " + gap.getCurrentLevel()
                        + " while the recommended level for your role is " + gap.getRequiredLevel() + ".";

                String outcome = "Bridge the " + gap.getGap() + "-point deficit in " + comp.getName()
                        + " through practical exercises and certified iGOT curriculum.";

                Recommendation rec = new Recommendation(profile, course, comp, reason, priority, outcome);
                newRecommendations.add(rec);
                recommendedCourseIds.add(course.getId());
            }
        }

        List<Recommendation> saved = recommendationRepository.saveAll(newRecommendations);
        logger.info("Generated {} personalized recommendations for learner {}", saved.size(), profile.getEmployeeId());

        Map<Long, Enrollment> enrollmentMap = enrollmentRepository.findByLearnerProfile(profile).stream()
                .collect(Collectors.toMap(e -> e.getCourse().getId(), e -> e, (e1, e2) -> e1));

        return saved.stream()
                .map(r -> mapToDto(r, enrollmentMap.get(r.getCourse().getId())))
                .collect(Collectors.toList());
    }

    private RecommendationDto mapToDto(Recommendation r, Enrollment e) {
        RecommendationDto dto = new RecommendationDto();
        dto.setId(r.getId());
        dto.setCourseId(r.getCourse().getId());
        dto.setCourseCode(r.getCourse().getCourseCode());
        dto.setCourseTitle(r.getCourse().getTitle());
        dto.setCourseDescription(r.getCourse().getDescription());
        dto.setProvider(r.getCourse().getProvider());
        dto.setDifficulty(r.getCourse().getDifficulty());
        dto.setDurationHours(r.getCourse().getDurationHours());
        dto.setCompetencyId(r.getCompetency().getId());
        dto.setCompetencyCode(r.getCompetency().getCode());
        dto.setCompetencyName(r.getCompetency().getName());
        dto.setReason(r.getReason());
        dto.setPriority(r.getPriority());
        dto.setExpectedOutcome(r.getExpectedOutcome());
        dto.setCreatedAt(r.getCreatedAt());

        if (e != null) {
            dto.setEnrolled(true);
            dto.setCurrentProgress(e.getProgressPercent());
        } else {
            dto.setEnrolled(false);
            dto.setCurrentProgress(0);
        }

        return dto;
    }
}
