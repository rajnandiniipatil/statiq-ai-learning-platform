package org.statiq.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.statiq.enums.DifficultyLevel;
import java.util.List;

public class CreateAssessmentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private Long sourceMaterialId;
    private Integer targetCompetencyId;
    private DifficultyLevel difficulty = DifficultyLevel.INTERMEDIATE;
    private Double passingScore = 60.0;
    private Integer timeLimitMinutes = 20;
    private Boolean isPublished = true;

    @NotEmpty(message = "At least one question is required")
    private List<QuestionDto> questions;

    public CreateAssessmentRequest() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getSourceMaterialId() {
        return sourceMaterialId;
    }

    public void setSourceMaterialId(Long sourceMaterialId) {
        this.sourceMaterialId = sourceMaterialId;
    }

    public Integer getTargetCompetencyId() {
        return targetCompetencyId;
    }

    public void setTargetCompetencyId(Integer targetCompetencyId) {
        this.targetCompetencyId = targetCompetencyId;
    }

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(DifficultyLevel difficulty) {
        this.difficulty = difficulty;
    }

    public Double getPassingScore() {
        return passingScore;
    }

    public void setPassingScore(Double passingScore) {
        this.passingScore = passingScore;
    }

    public Integer getTimeLimitMinutes() {
        return timeLimitMinutes;
    }

    public void setTimeLimitMinutes(Integer timeLimitMinutes) {
        this.timeLimitMinutes = timeLimitMinutes;
    }

    public Boolean getPublished() {
        return isPublished;
    }

    public void setPublished(Boolean published) {
        isPublished = published;
    }

    public List<QuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDto> questions) {
        this.questions = questions;
    }
}
