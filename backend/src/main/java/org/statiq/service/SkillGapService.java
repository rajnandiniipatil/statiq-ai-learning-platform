package org.statiq.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.statiq.dto.SkillGapDto;
import org.statiq.dto.SkillGapSummaryDto;
import org.statiq.entity.Competency;
import org.statiq.entity.CompetencyRequirement;
import org.statiq.entity.LearnerCompetency;
import org.statiq.entity.LearnerProfile;
import org.statiq.enums.GapClassification;
import org.statiq.exception.ResourceNotFoundException;
import org.statiq.repository.CompetencyRequirementRepository;
import org.statiq.repository.LearnerCompetencyRepository;
import org.statiq.repository.LearnerProfileRepository;
import org.statiq.security.UserPrincipal;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillGapService {

    private final CompetencyRequirementRepository requirementRepository;
    private final LearnerCompetencyRepository learnerCompetencyRepository;
    private final LearnerProfileRepository learnerProfileRepository;

    public SkillGapService(
            CompetencyRequirementRepository requirementRepository,
            LearnerCompetencyRepository learnerCompetencyRepository,
            LearnerProfileRepository learnerProfileRepository
    ) {
        this.requirementRepository = requirementRepository;
        this.learnerCompetencyRepository = learnerCompetencyRepository;
        this.learnerProfileRepository = learnerProfileRepository;
    }

    @Transactional(readOnly = true)
    public List<SkillGapDto> calculateSkillGaps(UserPrincipal principal) {
        LearnerProfile profile = learnerProfileRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found"));
        return calculateSkillGapsForProfile(profile);
    }

    @Transactional(readOnly = true)
    public SkillGapSummaryDto getSkillGapSummary(UserPrincipal principal) {
        LearnerProfile profile = learnerProfileRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found"));
        return calculateSummaryForProfile(profile);
    }

    @Transactional(readOnly = true)
    public List<SkillGapDto> calculateSkillGapsForProfile(LearnerProfile profile) {
        String role = profile.getJobRole() != null ? profile.getJobRole() : "Statistical Analyst";
        List<CompetencyRequirement> requirements = requirementRepository.findByJobRole(role);

        if (requirements.isEmpty()) {
            requirements = requirementRepository.findByJobRole("Statistical Analyst");
        }

        Map<Integer, Double> currentScores = learnerCompetencyRepository.findByLearnerProfile(profile).stream()
                .collect(Collectors.toMap(
                        lc -> lc.getCompetency().getId(),
                        LearnerCompetency::getScore,
                        (s1, s2) -> s1
                ));

        List<SkillGapDto> gaps = new ArrayList<>();

        for (CompetencyRequirement req : requirements) {
            Competency comp = req.getCompetency();
            double currentLevel = currentScores.getOrDefault(comp.getId(), 0.0);
            double requiredLevel = req.getRequiredLevel();
            double rawGap = requiredLevel - currentLevel;
            double gap = Math.max(0.0, Math.round(rawGap * 10.0) / 10.0);

            GapClassification classification = GapClassification.fromGap(gap);

            SkillGapDto dto = new SkillGapDto();
            dto.setCompetencyId(comp.getId());
            dto.setCompetencyCode(comp.getCode());
            dto.setCompetencyName(comp.getName());
            dto.setCategory(comp.getCategory());
            dto.setCurrentLevel(currentLevel);
            dto.setRequiredLevel(requiredLevel);
            dto.setGap(gap);
            dto.setClassification(classification);
            dto.setImportanceWeight(req.getImportanceWeight());

            // Realistic contextual explanations
            if (gap <= 10.0) {
                dto.setExplanation("Your verified score of " + currentLevel + " satisfies the " + role + " benchmark of " + requiredLevel + ".");
                dto.setRecommendedAction("Maintain proficiency and consider mentoring junior colleagues or contributing advanced case studies.");
            } else if (gap <= 25.0) {
                dto.setExplanation("A minor gap of " + gap + " points exists between your current competency (" + currentLevel + ") and role benchmark (" + requiredLevel + ").");
                dto.setRecommendedAction("Complete targeted micro-learning modules on iGOT Karmayogi and review recent circular guidelines.");
            } else if (gap <= 50.0) {
                dto.setExplanation("The current competency (" + currentLevel + ") is below the expected level (" + requiredLevel + ") for the " + role + " role.");
                dto.setRecommendedAction("Enroll in structured iGOT coursework and complete diagnostic hands-on assessments.");
            } else {
                dto.setExplanation("A critical deficit of " + gap + " points detected in " + comp.getName() + " (Current: " + currentLevel + " vs Target: " + requiredLevel + ").");
                dto.setRecommendedAction("Immediate foundational capacity building required. High priority enrollment in intensive certification.");
            }

            gaps.add(dto);
        }

        // Sort by gap descending (highest gap first)
        gaps.sort((g1, g2) -> Double.compare(g2.getGap(), g1.getGap()));
        return gaps;
    }

    @Transactional(readOnly = true)
    public SkillGapSummaryDto calculateSummaryForProfile(LearnerProfile profile) {
        List<SkillGapDto> gaps = calculateSkillGapsForProfile(profile);

        double totalCurrent = 0;
        double totalRequired = 0;
        int critical = 0;
        int significant = 0;
        int moderate = 0;
        int strong = 0;

        for (SkillGapDto g : gaps) {
            totalCurrent += g.getCurrentLevel();
            totalRequired += g.getRequiredLevel();
            switch (g.getClassification()) {
                case CRITICAL_GAP -> critical++;
                case SIGNIFICANT_GAP -> significant++;
                case MODERATE_GAP -> moderate++;
                case STRONG -> strong++;
            }
        }

        int count = gaps.isEmpty() ? 1 : gaps.size();
        double avgCurrent = Math.round((totalCurrent / count) * 10.0) / 10.0;
        double avgRequired = Math.round((totalRequired / count) * 10.0) / 10.0;
        double overallGap = Math.max(0.0, Math.round((avgRequired - avgCurrent) * 10.0) / 10.0);

        SkillGapSummaryDto summary = new SkillGapSummaryDto();
        summary.setJobRole(profile.getJobRole());
        summary.setAverageCompetencyScore(avgCurrent);
        summary.setAverageRequiredScore(avgRequired);
        summary.setOverallGap(overallGap);
        summary.setCriticalGapCount(critical);
        summary.setSignificantGapCount(significant);
        summary.setModerateGapCount(moderate);
        summary.setStrongCount(strong);
        summary.setGaps(gaps);

        return summary;
    }
}
