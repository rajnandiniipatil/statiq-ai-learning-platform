package org.statiq.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class QuizSubmissionAnswer {

    @NotNull(message = "Question ID is required")
    private Long questionId;

    @NotBlank(message = "Selected answer is required")
    private String selectedAnswer;

    public QuizSubmissionAnswer() {}

    public QuizSubmissionAnswer(Long questionId, String selectedAnswer) {
        this.questionId = questionId;
        this.selectedAnswer = selectedAnswer;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getSelectedAnswer() {
        return selectedAnswer;
    }

    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }
}
