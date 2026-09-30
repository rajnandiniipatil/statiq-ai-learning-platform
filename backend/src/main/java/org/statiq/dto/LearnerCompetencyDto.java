package org.statiq.dto;

import org.statiq.enums.CompetencyCategory;
import java.time.LocalDateTime;

public class LearnerCompetencyDto {

    private Long id;
    private Integer competencyId;
    private String competencyCode;
    private String competencyName;
    private CompetencyCategory category;
    private Double score;
    private String confidenceLevel;
    private LocalDateTime lastAssessedAt;

    public LearnerCompetencyDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCompetencyId() {
        return competencyId;
    }

    public void setCompetencyId(Integer competencyId) {
        this.competencyId = competencyId;
    }

    public String getCompetencyCode() {
        return competencyCode;
    }

    public void setCompetencyCode(String competencyCode) {
        this.competencyCode = competencyCode;
    }

    public String getCompetencyName() {
        return competencyName;
    }

    public void setCompetencyName(String competencyName) {
        this.competencyName = competencyName;
    }

    public CompetencyCategory getCategory() {
        return category;
    }

    public void setCategory(CompetencyCategory category) {
        this.category = category;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getConfidenceLevel() {
        return confidenceLevel;
    }

    public void setConfidenceLevel(String confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }

    public LocalDateTime getLastAssessedAt() {
        return lastAssessedAt;
    }

    public void setLastAssessedAt(LocalDateTime lastAssessedAt) {
        this.lastAssessedAt = lastAssessedAt;
    }
}
