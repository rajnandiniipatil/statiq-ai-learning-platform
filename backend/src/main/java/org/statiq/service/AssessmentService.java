package org.statiq.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.statiq.dto.*;
import org.statiq.entity.*;
import org.statiq.enums.DifficultyLevel;
import org.statiq.exception.BadRequestException;
import org.statiq.exception.ResourceNotFoundException;
import org.statiq.repository.*;
import org.statiq.security.UserPrincipal;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AssessmentService {

    private static final Logger logger = LoggerFactory.getLogger(AssessmentService.class);

    private final AssessmentRepository assessmentRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizAnswerRepository quizAnswerRepository;
    private final LearnerProfileRepository learnerProfileRepository;
    private final CompetencyRepository competencyRepository;
    private final LearnerCompetencyRepository learnerCompetencyRepository;
    private final CompetencyService competencyService;
    private final RecommendationService recommendationService;
    private final LearningPathService learningPathService;
    private final UploadedMaterialRepository materialRepository;
    private final UserRepository userRepository;

    public AssessmentService(
            AssessmentRepository assessmentRepository,
            QuestionRepository questionRepository,
            QuizAttemptRepository quizAttemptRepository,
            QuizAnswerRepository quizAnswerRepository,
            LearnerProfileRepository learnerProfileRepository,
            CompetencyRepository competencyRepository,
            LearnerCompetencyRepository learnerCompetencyRepository,
            CompetencyService competencyService,
            RecommendationService recommendationService,
            LearningPathService learningPathService,
            UploadedMaterialRepository materialRepository,
            UserRepository userRepository
    ) {
        this.assessmentRepository = assessmentRepository;
        this.questionRepository = questionRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.quizAnswerRepository = quizAnswerRepository;
        this.learnerProfileRepository = learnerProfileRepository;
        this.competencyRepository = competencyRepository;
        this.learnerCompetencyRepository = learnerCompetencyRepository;
        this.competencyService = competencyService;
        this.recommendationService = recommendationService;
        this.learningPathService = learningPathService;
        this.materialRepository = materialRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public AssessmentDto createAssessment(UserPrincipal principal, CreateAssessmentRequest request) {
        User creator = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Assessment assessment = new Assessment();
        assessment.setTitle(request.getTitle());
        assessment.setDescription(request.getDescription());
        assessment.setCreator(creator);
        assessment.setDifficulty(request.getDifficulty() != null ? request.getDifficulty() : DifficultyLevel.INTERMEDIATE);
        assessment.setPassingScore(request.getPassingScore() != null ? request.getPassingScore() : 60.0);
        assessment.setTimeLimitMinutes(request.getTimeLimitMinutes() != null ? request.getTimeLimitMinutes() : 20);
        assessment.setPublished(request.getPublished() != null ? request.getPublished() : true);

        if (request.getSourceMaterialId() != null) {
            materialRepository.findById(request.getSourceMaterialId()).ifPresent(assessment::setSourceMaterial);
        }

        if (request.getTargetCompetencyId() != null) {
            competencyRepository.findById(request.getTargetCompetencyId()).ifPresent(assessment::setTargetCompetency);
        } else {
            // Default to AI/ML or General Statistical
            competencyRepository.findByCode("TECH-AIM").ifPresent(assessment::setTargetCompetency);
        }

        Assessment savedAssessment = assessmentRepository.save(assessment);

        List<Question> questions = new ArrayList<>();
        int seq = 1;
        for (QuestionDto qDto : request.getQuestions()) {
            Question q = new Question();
            q.setAssessment(savedAssessment);
            q.setQuestionText(qDto.getQuestionText());
            q.setOptionA(qDto.getOptionA());
            q.setOptionB(qDto.getOptionB());
            q.setOptionC(qDto.getOptionC());
            q.setOptionD(qDto.getOptionD());
            q.setCorrectAnswer(qDto.getCorrectAnswer() != null ? qDto.getCorrectAnswer().toUpperCase() : "A");
            q.setExplanation(qDto.getExplanation());
            q.setDifficulty(qDto.getDifficulty() != null ? qDto.getDifficulty() : savedAssessment.getDifficulty());
            q.setTopic(qDto.getTopic() != null ? qDto.getTopic() : "Official Statistics");
            q.setSourceReference(qDto.getSourceReference());
            q.setSequenceOrder(seq++);
            questions.add(q);
        }

        questionRepository.saveAll(questions);
        savedAssessment.setQuestions(questions);

        logger.info("Created and published assessment '{}' with {} questions by {}",
                savedAssessment.getTitle(), questions.size(), creator.getEmail());

        return mapToDto(savedAssessment, null);
    }

    @Transactional(readOnly = true)
    public List<AssessmentDto> getAllPublishedAssessments(UserPrincipal principal) {
        LearnerProfile profile = principal != null
                ? learnerProfileRepository.findByUserId(principal.getId()).orElse(null)
                : null;

        Map<Long, QuizAttempt> latestAttempts = new HashMap<>();
        if (profile != null) {
            for (QuizAttempt attempt : quizAttemptRepository.findByLearnerProfileOrderByAttemptedAtDesc(profile)) {
                latestAttempts.putIfAbsent(attempt.getAssessment().getId(), attempt);
            }
        }

        return assessmentRepository.findByIsPublishedTrue().stream()
                .map(a -> mapToDto(a, latestAttempts.get(a.getId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssessmentDto getAssessmentById(Long id, UserPrincipal principal) {
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found with id: " + id));

        LearnerProfile profile = principal != null
                ? learnerProfileRepository.findByUserId(principal.getId()).orElse(null)
                : null;

        QuizAttempt latestAttempt = null;
        if (profile != null) {
            List<QuizAttempt> attempts = quizAttemptRepository.findByLearnerProfileOrderByAttemptedAtDesc(profile);
            latestAttempt = attempts.stream()
                    .filter(att -> att.getAssessment().getId().equals(id))
                    .findFirst()
                    .orElse(null);
        }

        return mapToDto(assessment, latestAttempt);
    }

    @Transactional
    public QuizResultDto submitQuizAttempt(Long assessmentId, UserPrincipal principal, QuizSubmissionRequest submission) {
        LearnerProfile profile = learnerProfileRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found for current user"));

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found: " + assessmentId));

        List<Question> questions = questionRepository.findByAssessmentOrderBySequenceOrderAsc(assessment);
        if (questions.isEmpty()) {
            throw new BadRequestException("Assessment contains no questions.");
        }

        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        int correctCount = 0;
        int totalQuestions = questions.size();
        List<QuizResultDto.QuestionEvaluationDto> evalList = new ArrayList<>();
        List<QuizAnswer> answersToSave = new ArrayList<>();

        Map<Long, String> submissionMap = new HashMap<>();
        if (submission.getAnswers() != null) {
            for (QuizSubmissionAnswer sa : submission.getAnswers()) {
                submissionMap.put(sa.getQuestionId(), sa.getSelectedAnswer().toUpperCase().trim());
            }
        }

        List<String> strongTopics = new ArrayList<>();
        List<String> weakTopics = new ArrayList<>();

        for (Question q : questions) {
            String selected = submissionMap.getOrDefault(q.getId(), "");
            boolean isCorrect = selected.equalsIgnoreCase(q.getCorrectAnswer());

            if (isCorrect) {
                correctCount++;
                if (q.getTopic() != null && !strongTopics.contains(q.getTopic())) {
                    strongTopics.add(q.getTopic());
                }
            } else {
                if (q.getTopic() != null && !weakTopics.contains(q.getTopic())) {
                    weakTopics.add(q.getTopic());
                }
            }

            QuizResultDto.QuestionEvaluationDto qEval = new QuizResultDto.QuestionEvaluationDto();
            qEval.setQuestionId(q.getId());
            qEval.setQuestionText(q.getQuestionText());
            qEval.setOptionA(q.getOptionA());
            qEval.setOptionB(q.getOptionB());
            qEval.setOptionC(q.getOptionC());
            qEval.setOptionD(q.getOptionD());
            qEval.setSelectedAnswer(selected);
            qEval.setCorrectAnswer(q.getCorrectAnswer());
            qEval.setCorrect(isCorrect);
            qEval.setExplanation(q.getExplanation());
            qEval.setTopic(q.getTopic());
            evalList.add(qEval);
        }

        double accuracy = Math.round(((double) correctCount / totalQuestions) * 1000.0) / 10.0;
        double score = accuracy;

        // Generate contextual AI Feedback
        StringBuilder feedback = new StringBuilder();
        if (accuracy >= 80.0) {
            feedback.append("Outstanding performance! You demonstrated rigorous theoretical mastery and practical problem-solving capability. ");
            feedback.append("Your responses showcase readiness for advanced assignments and mentoring roles in India's Official Statistical System.");
        } else if (accuracy >= 60.0) {
            feedback.append("Commendable performance! You met the passing standard with solid comprehension of primary statistical standards. ");
            feedback.append("Targeting key weak areas will solidify your operational proficiency.");
        } else {
            feedback.append("Diagnostic evaluation reveals specific conceptual and procedural gaps requiring structured intervention. ");
            feedback.append("Recommended coursework has been prioritized in your learning path to accelerate knowledge acquisition.");
        }

        String strengths = strongTopics.isEmpty()
                ? "Core statistical principles"
                : String.join(", ", strongTopics);

        String weaknesses = weakTopics.isEmpty()
                ? "None observed. Consistent across evaluated sections."
                : String.join(", ", weakTopics);

        String recommendedRevision = weakTopics.isEmpty()
                ? "Continue to next advanced module in your learning roadmap."
                : "Review circulars and practical modules on: " + String.join(", ", weakTopics);

        // Save Attempt
        QuizAttempt attempt = new QuizAttempt();
        attempt.setAssessment(assessment);
        attempt.setLearnerProfile(profile);
        attempt.setScore(score);
        attempt.setTotalQuestions(totalQuestions);
        attempt.setCorrectAnswers(correctCount);
        attempt.setAccuracyPercent(accuracy);
        attempt.setTimeSpentSeconds(submission.getTimeSpentSeconds() != null ? submission.getTimeSpentSeconds() : 480);
        attempt.setAiFeedback(feedback.toString());
        attempt.setStrengths(strengths);
        attempt.setWeaknesses(weaknesses);
        attempt.setAttemptedAt(LocalDateTime.now());

        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

        // Save individual question answers
        for (QuizResultDto.QuestionEvaluationDto eval : evalList) {
            Question q = questionMap.get(eval.getQuestionId());
            if (q != null) {
                answersToSave.add(new QuizAnswer(savedAttempt, q, eval.getSelectedAnswer(), eval.isCorrect()));
            }
        }
        quizAnswerRepository.saveAll(answersToSave);

        // =========================================================================
        // CONTINUOUS COMPETENCY UPDATE FEEDBACK LOOP (CHECKPOINT 12)
        // =========================================================================
        Competency targetComp = assessment.getTargetCompetency();
        if (targetComp == null) {
            targetComp = competencyRepository.findByCode("TECH-AIM").orElse(null);
        }

        double scoreBefore = 35.0;
        double scoreAfter = 35.0;

        if (targetComp != null) {
            Optional<LearnerCompetency> existingComp = learnerCompetencyRepository.findByLearnerProfileAndCompetency(profile, targetComp);
            if (existingComp.isPresent() && existingComp.get().getScore() != null) {
                scoreBefore = existingComp.get().getScore();
            }

            // Exponential smoothing: 0.60 historical, 0.40 current quiz performance
            competencyService.updateCompetencyScore(profile, targetComp, accuracy, "Assessment: " + assessment.getTitle());

            Optional<LearnerCompetency> updatedComp = learnerCompetencyRepository.findByLearnerProfileAndCompetency(profile, targetComp);
            if (updatedComp.isPresent()) {
                scoreAfter = updatedComp.get().getScore();
            }

            // Trigger real-time cascade recalculations:
            // 1. Recalculate and update recommendations
            recommendationService.generateRecommendations(principal);
            // 2. Refresh learning path
            learningPathService.generateLearningPath(principal);

            logger.info("Continuous feedback loop executed for officer {}: {} score updated {} -> {} (accuracy: {}%)",
                    profile.getEmployeeId(), targetComp.getName(), scoreBefore, scoreAfter, accuracy);
        }

        QuizResultDto result = new QuizResultDto();
        result.setAttemptId(savedAttempt.getId());
        result.setAssessmentId(assessment.getId());
        result.setAssessmentTitle(assessment.getTitle());
        result.setTargetCompetencyName(targetComp != null ? targetComp.getName() : "Statistical Competency");
        result.setScore(score);
        result.setTotalQuestions(totalQuestions);
        result.setCorrectAnswers(correctCount);
        result.setAccuracyPercent(accuracy);
        result.setTimeSpentSeconds(savedAttempt.getTimeSpentSeconds());
        result.setAiFeedback(feedback.toString());
        result.setStrengths(strengths);
        result.setWeaknesses(weaknesses);
        result.setRecommendedRevision(recommendedRevision);
        result.setCompetencyScoreBefore(scoreBefore);
        result.setCompetencyScoreAfter(scoreAfter);
        result.setCompetencyScoreDelta(Math.round((scoreAfter - scoreBefore) * 10.0) / 10.0);
        result.setQuestionResults(evalList);
        result.setAttemptedAt(savedAttempt.getAttemptedAt());

        return result;
    }

    @Transactional(readOnly = true)
    public QuizResultDto getLatestAssessmentResult(Long assessmentId, UserPrincipal principal) {
        LearnerProfile profile = learnerProfileRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found"));

        List<QuizAttempt> attempts = quizAttemptRepository.findByAssessmentOrderByAttemptedAtDesc(assessment);
        QuizAttempt latest = attempts.stream()
                .filter(a -> a.getLearnerProfile().getId().equals(profile.getId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No attempts found for assessment: " + assessmentId));

        List<QuizAnswer> answers = quizAnswerRepository.findByQuizAttempt(latest);
        List<QuizResultDto.QuestionEvaluationDto> evalList = answers.stream().map(ans -> {
            QuizResultDto.QuestionEvaluationDto qEval = new QuizResultDto.QuestionEvaluationDto();
            Question q = ans.getQuestion();
            qEval.setQuestionId(q.getId());
            qEval.setQuestionText(q.getQuestionText());
            qEval.setOptionA(q.getOptionA());
            qEval.setOptionB(q.getOptionB());
            qEval.setOptionC(q.getOptionC());
            qEval.setOptionD(q.getOptionD());
            qEval.setSelectedAnswer(ans.getSelectedAnswer());
            qEval.setCorrectAnswer(q.getCorrectAnswer());
            qEval.setCorrect(ans.getCorrect());
            qEval.setExplanation(q.getExplanation());
            qEval.setTopic(q.getTopic());
            return qEval;
        }).collect(Collectors.toList());

        QuizResultDto result = new QuizResultDto();
        result.setAttemptId(latest.getId());
        result.setAssessmentId(assessment.getId());
        result.setAssessmentTitle(assessment.getTitle());
        result.setTargetCompetencyName(assessment.getTargetCompetency() != null ? assessment.getTargetCompetency().getName() : "Statistical Competency");
        result.setScore(latest.getScore());
        result.setTotalQuestions(latest.getTotalQuestions());
        result.setCorrectAnswers(latest.getCorrectAnswers());
        result.setAccuracyPercent(latest.getAccuracyPercent());
        result.setTimeSpentSeconds(latest.getTimeSpentSeconds());
        result.setAiFeedback(latest.getAiFeedback());
        result.setStrengths(latest.getStrengths());
        result.setWeaknesses(latest.getWeaknesses());
        result.setQuestionResults(evalList);
        result.setAttemptedAt(latest.getAttemptedAt());

        return result;
    }

    private AssessmentDto mapToDto(Assessment a, QuizAttempt latestAttempt) {
        AssessmentDto dto = new AssessmentDto();
        dto.setId(a.getId());
        dto.setTitle(a.getTitle());
        dto.setDescription(a.getDescription());
        dto.setCreatorId(a.getCreator() != null ? a.getCreator().getId() : null);
        dto.setCreatorName(a.getCreator() != null ? a.getCreator().getFullName() : "Faculty / MoSPI");
        dto.setDifficulty(a.getDifficulty());
        dto.setPassingScore(a.getPassingScore());
        dto.setTimeLimitMinutes(a.getTimeLimitMinutes());
        dto.setPublished(a.getPublished());
        dto.setCreatedAt(a.getCreatedAt());

        if (a.getSourceMaterial() != null) {
            dto.setSourceMaterialId(a.getSourceMaterial().getId());
            dto.setSourceMaterialName(a.getSourceMaterial().getFileName());
        }

        if (a.getTargetCompetency() != null) {
            dto.setTargetCompetencyId(a.getTargetCompetency().getId());
            dto.setTargetCompetencyName(a.getTargetCompetency().getName());
            dto.setTargetCompetencyCode(a.getTargetCompetency().getCode());
        }

        List<Question> questions = questionRepository.findByAssessmentOrderBySequenceOrderAsc(a);
        dto.setQuestionCount(questions.size());
        dto.setQuestions(questions.stream().map(q -> {
            QuestionDto qDto = new QuestionDto();
            qDto.setId(q.getId());
            qDto.setQuestionText(q.getQuestionText());
            qDto.setOptionA(q.getOptionA());
            qDto.setOptionB(q.getOptionB());
            qDto.setOptionC(q.getOptionC());
            qDto.setOptionD(q.getOptionD());
            qDto.setCorrectAnswer(q.getCorrectAnswer());
            qDto.setExplanation(q.getExplanation());
            qDto.setDifficulty(q.getDifficulty());
            qDto.setTopic(q.getTopic());
            qDto.setSourceReference(q.getSourceReference());
            qDto.setSequenceOrder(q.getSequenceOrder());
            return qDto;
        }).collect(Collectors.toList()));

        if (latestAttempt != null) {
            dto.setHasAttempted(true);
            dto.setLatestScore(latestAttempt.getScore());
        } else {
            dto.setHasAttempted(false);
            dto.setLatestScore(null);
        }

        return dto;
    }
}
