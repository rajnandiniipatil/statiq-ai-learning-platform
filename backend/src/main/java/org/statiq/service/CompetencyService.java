package org.statiq.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.statiq.dto.CompetencyAssessmentRequest;
import org.statiq.dto.CompetencyDto;
import org.statiq.dto.LearnerCompetencyDto;
import org.statiq.entity.Competency;
import org.statiq.entity.LearnerCompetency;
import org.statiq.entity.LearnerProfile;
import org.statiq.exception.ResourceNotFoundException;
import org.statiq.repository.CompetencyRepository;
import org.statiq.repository.LearnerCompetencyRepository;
import org.statiq.repository.LearnerProfileRepository;
import org.statiq.security.UserPrincipal;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompetencyService {

    private static final Logger logger = LoggerFactory.getLogger(CompetencyService.class);

    private final CompetencyRepository competencyRepository;
    private final LearnerCompetencyRepository learnerCompetencyRepository;
    private final LearnerProfileRepository learnerProfileRepository;

    public CompetencyService(
            CompetencyRepository competencyRepository,
            LearnerCompetencyRepository learnerCompetencyRepository,
            LearnerProfileRepository learnerProfileRepository
    ) {
        this.competencyRepository = competencyRepository;
        this.learnerCompetencyRepository = learnerCompetencyRepository;
        this.learnerProfileRepository = learnerProfileRepository;
    }

    @Transactional(readOnly = true)
    public List<CompetencyDto> getAllCompetencies() {
        return competencyRepository.findAll().stream()
                .map(c -> new CompetencyDto(c.getId(), c.getCode(), c.getName(), c.getCategory(), c.getDescription()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LearnerCompetencyDto> getLearnerCompetencies(UserPrincipal principal) {
        LearnerProfile profile = getProfileForUser(principal.getId());
        return learnerCompetencyRepository.findByLearnerProfile(profile).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LearnerCompetencyDto submitCompetencyAssessment(UserPrincipal principal, CompetencyAssessmentRequest request) {
        LearnerProfile profile = getProfileForUser(principal.getId());
        Competency competency = competencyRepository.findById(request.getCompetencyId())
                .orElseThrow(() -> new ResourceNotFoundException("Competency not found: " + request.getCompetencyId()));

        LearnerCompetency lc = learnerCompetencyRepository.findByLearnerProfileAndCompetency(profile, competency)
                .orElse(new LearnerCompetency(profile, competency, 0.0, "INITIAL"));

        // Reasoned score update strategy:
        // If initial, take direct score. If already assessed, apply Bayesian exponential smoothing
        double updatedScore;
        if (lc.getScore() == null || lc.getScore() <= 0.0) {
            updatedScore = request.getScore();
        } else {
            // Alpha = 0.60 historical weight, 0.40 new assessment
            updatedScore = (lc.getScore() * 0.60) + (request.getScore() * 0.40);
        }

        lc.setScore(Math.round(updatedScore * 10.0) / 10.0);
        lc.setConfidenceLevel("SELF_VERIFIED");
        lc.setLastAssessedAt(LocalDateTime.now());

        LearnerCompetency saved = learnerCompetencyRepository.save(lc);
        logger.info("Updated competency {} for learner {} to score {}", competency.getName(), profile.getEmployeeId(), saved.getScore());

        return mapToDto(saved);
    }

    @Transactional
    public void updateCompetencyScore(LearnerProfile profile, Competency competency, double assessmentPerformancePercent, String source) {
        LearnerCompetency lc = learnerCompetencyRepository.findByLearnerProfileAndCompetency(profile, competency)
                .orElse(new LearnerCompetency(profile, competency, 40.0, "INITIAL"));

        double oldScore = lc.getScore() != null ? lc.getScore() : 40.0;
        // Continuous feedback loop: Alpha = 0.65 historical, 0.35 recent quiz evaluation
        double newScore = (oldScore * 0.65) + (assessmentPerformancePercent * 0.35);
        newScore = Math.min(100.0, Math.max(0.0, Math.round(newScore * 10.0) / 10.0));

        lc.setScore(newScore);
        lc.setConfidenceLevel("EXAM_EVALUATED");
        lc.setLastAssessedAt(LocalDateTime.now());
        learnerCompetencyRepository.save(lc);

        logger.info("Feedback loop: Competency {} updated from {} -> {} based on {} attempt",
                competency.getName(), oldScore, newScore, source);
    }

    public LearnerProfile getProfileForUser(Long userId) {
        return learnerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found for user id: " + userId));
    }

    private LearnerCompetencyDto mapToDto(LearnerCompetency lc) {
        LearnerCompetencyDto dto = new LearnerCompetencyDto();
        dto.setId(lc.getId());
        dto.setCompetencyId(lc.getCompetency().getId());
        dto.setCompetencyCode(lc.getCompetency().getCode());
        dto.setCompetencyName(lc.getCompetency().getName());
        dto.setCategory(lc.getCompetency().getCategory());
        dto.setScore(lc.getScore());
        dto.setConfidenceLevel(lc.getConfidenceLevel());
        dto.setLastAssessedAt(lc.getLastAssessedAt());
        return dto;
    }
}
