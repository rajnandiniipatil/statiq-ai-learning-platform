package org.statiq.dto;

import org.statiq.enums.DifficultyLevel;
import java.time.LocalDateTime;
import java.util.List;

public class AssessmentDto {

    private Long id;
    private String title;
    private String description;
    private Long creatorId;
    private String creatorName;
    private Long sourceMaterialId;
    private String sourceMaterialName;
    private Integer targetCompetencyId;
    private String targetCompetencyName;
    private String targetCompetencyCode;
    private DifficultyLevel difficulty;
    private Double passingScore;
    private Integer timeLimitMinutes;
    private Boolean isPublished;
    private Integer questionCount;
    private List<QuestionDto> questions;
    private LocalDateTime createdAt;
    private Boolean hasAttempted;
    private Double latestScore;

    public AssessmentDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public Long getSourceMaterialId() {
        return sourceMaterialId;
    }

    public void setSourceMaterialId(Long sourceMaterialId) {
        this.sourceMaterialId = sourceMaterialId;
    }

    public String getSourceMaterialName() {
        return sourceMaterialName;
    }

    public void setSourceMaterialName(String sourceMaterialName) {
        this.sourceMaterialName = sourceMaterialName;
    }

    public Integer getTargetCompetencyId() {
        return targetCompetencyId;
    }

    public void setTargetCompetencyId(Integer targetCompetencyId) {
        this.targetCompetencyId = targetCompetencyId;
    }

    public String getTargetCompetencyName() {
        return targetCompetencyName;
    }

    public void setTargetCompetencyName(String targetCompetencyName) {
        this.targetCompetencyName = targetCompetencyName;
    }

    public String getTargetCompetencyCode() {
        return targetCompetencyCode;
    }

    public void setTargetCompetencyCode(String targetCompetencyCode) {
        this.targetCompetencyCode = targetCompetencyCode;
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

    public Integer getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(Integer questionCount) {
        this.questionCount = questionCount;
    }

    public List<QuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDto> questions) {
        this.questions = questions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getHasAttempted() {
        return hasAttempted;
    }

    public void setHasAttempted(Boolean hasAttempted) {
        this.hasAttempted = hasAttempted;
    }

    public Double getLatestScore() {
        return latestScore;
    }

    public void setLatestScore(Double latestScore) {
        this.latestScore = latestScore;
    }
}
