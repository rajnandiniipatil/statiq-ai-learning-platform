package org.statiq.dto;

import java.time.LocalDateTime;
import java.util.List;

public class QuizResultDto {

    private Long attemptId;
    private Long assessmentId;
    private String assessmentTitle;
    private String targetCompetencyName;
    private Double score;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Double accuracyPercent;
    private Integer timeSpentSeconds;
    private String aiFeedback;
    private String strengths;
    private String weaknesses;
    private String recommendedRevision;
    private Double competencyScoreBefore;
    private Double competencyScoreAfter;
    private Double competencyScoreDelta;
    private List<QuestionEvaluationDto> questionResults;
    private LocalDateTime attemptedAt;

    public QuizResultDto() {}

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }

    public String getAssessmentTitle() {
        return assessmentTitle;
    }

    public void setAssessmentTitle(String assessmentTitle) {
        this.assessmentTitle = assessmentTitle;
    }

    public String getTargetCompetencyName() {
        return targetCompetencyName;
    }

    public void setTargetCompetencyName(String targetCompetencyName) {
        this.targetCompetencyName = targetCompetencyName;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Double getAccuracyPercent() {
        return accuracyPercent;
    }

    public void setAccuracyPercent(Double accuracyPercent) {
        this.accuracyPercent = accuracyPercent;
    }

    public Integer getTimeSpentSeconds() {
        return timeSpentSeconds;
    }

    public void setTimeSpentSeconds(Integer timeSpentSeconds) {
        this.timeSpentSeconds = timeSpentSeconds;
    }

    public String getAiFeedback() {
        return aiFeedback;
    }

    public void setAiFeedback(String aiFeedback) {
        this.aiFeedback = aiFeedback;
    }

    public String getStrengths() {
        return strengths;
    }

    public void setStrengths(String strengths) {
        this.strengths = strengths;
    }

    public String getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(String weaknesses) {
        this.weaknesses = weaknesses;
    }

    public String getRecommendedRevision() {
        return recommendedRevision;
    }

    public void setRecommendedRevision(String recommendedRevision) {
        this.recommendedRevision = recommendedRevision;
    }

    public Double getCompetencyScoreBefore() {
        return competencyScoreBefore;
    }

    public void setCompetencyScoreBefore(Double competencyScoreBefore) {
        this.competencyScoreBefore = competencyScoreBefore;
    }

    public Double getCompetencyScoreAfter() {
        return competencyScoreAfter;
    }

    public void setCompetencyScoreAfter(Double competencyScoreAfter) {
        this.competencyScoreAfter = competencyScoreAfter;
    }

    public Double getCompetencyScoreDelta() {
        return competencyScoreDelta;
    }

    public void setCompetencyScoreDelta(Double competencyScoreDelta) {
        this.competencyScoreDelta = competencyScoreDelta;
    }

    public List<QuestionEvaluationDto> getQuestionResults() {
        return questionResults;
    }

    public void setQuestionResults(List<QuestionEvaluationDto> questionResults) {
        this.questionResults = questionResults;
    }

    public LocalDateTime getAttemptedAt() {
        return attemptedAt;
    }

    public void setAttemptedAt(LocalDateTime attemptedAt) {
        this.attemptedAt = attemptedAt;
    }

    public static class QuestionEvaluationDto {
        private Long questionId;
        private String questionText;
        private String optionA;
        private String optionB;
        private String optionC;
        private String optionD;
        private String selectedAnswer;
        private String correctAnswer;
        private boolean isCorrect;
        private String explanation;
        private String topic;

        public QuestionEvaluationDto() {}

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public String getQuestionText() {
            return questionText;
        }

        public void setQuestionText(String questionText) {
            this.questionText = questionText;
        }

        public String getOptionA() {
            return optionA;
        }

        public void setOptionA(String optionA) {
            this.optionA = optionA;
        }

        public String getOptionB() {
            return optionB;
        }

        public void setOptionB(String optionB) {
            this.optionB = optionB;
        }

        public String getOptionC() {
            return optionC;
        }

        public void setOptionC(String optionC) {
            this.optionC = optionC;
        }

        public String getOptionD() {
            return optionD;
        }

        public void setOptionD(String optionD) {
            this.optionD = optionD;
        }

        public String getSelectedAnswer() {
            return selectedAnswer;
        }

        public void setSelectedAnswer(String selectedAnswer) {
            this.selectedAnswer = selectedAnswer;
        }

        public String getCorrectAnswer() {
            return correctAnswer;
        }

        public void setCorrectAnswer(String correctAnswer) {
            this.correctAnswer = correctAnswer;
        }

        public boolean isCorrect() {
            return isCorrect;
        }

        public void setCorrect(boolean correct) {
            isCorrect = correct;
        }

        public String getExplanation() {
            return explanation;
        }

        public void setExplanation(String explanation) {
            this.explanation = explanation;
        }

        public String getTopic() {
            return topic;
        }

        public void setTopic(String topic) {
            this.topic = topic;
        }
    }
}
