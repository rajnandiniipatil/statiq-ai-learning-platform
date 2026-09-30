package org.statiq.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class QuizSubmissionRequest {

    @NotNull(message = "Assessment ID is required")
    private Long assessmentId;

    private Integer timeSpentSeconds;

    @NotNull(message = "Answers are required")
    private List<QuizSubmissionAnswer> answers;

    public QuizSubmissionRequest() {}

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }

    public Integer getTimeSpentSeconds() {
        return timeSpentSeconds;
    }

    public void setTimeSpentSeconds(Integer timeSpentSeconds) {
        this.timeSpentSeconds = timeSpentSeconds;
    }

    public List<QuizSubmissionAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<QuizSubmissionAnswer> answers) {
        this.answers = answers;
    }
}
