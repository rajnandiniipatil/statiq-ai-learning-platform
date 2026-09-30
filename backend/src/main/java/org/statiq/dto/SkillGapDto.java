package org.statiq.dto;

import org.statiq.enums.CompetencyCategory;
import org.statiq.enums.GapClassification;

public class SkillGapDto {

    private Integer competencyId;
    private String competencyCode;
    private String competencyName;
    private CompetencyCategory category;
    private String categoryLabel;
    private Double currentLevel;
    private Double requiredLevel;
    private Double gap;
    private GapClassification classification;
    private String classificationLabel;
    private String explanation;
    private String recommendedAction;
    private Double importanceWeight;

    public SkillGapDto() {}

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
        this.categoryLabel = category != null ? category.name().replace("_", " ") : "";
    }

    public String getCategoryLabel() {
        return categoryLabel;
    }

    public void setCategoryLabel(String categoryLabel) {
        this.categoryLabel = categoryLabel;
    }

    public Double getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(Double currentLevel) {
        this.currentLevel = currentLevel;
    }

    public Double getRequiredLevel() {
        return requiredLevel;
    }

    public void setRequiredLevel(Double requiredLevel) {
        this.requiredLevel = requiredLevel;
    }

    public Double getGap() {
        return gap;
    }

    public void setGap(Double gap) {
        this.gap = gap;
    }

    public GapClassification getClassification() {
        return classification;
    }

    public void setClassification(GapClassification classification) {
        this.classification = classification;
        this.classificationLabel = classification != null ? classification.getLabel() : "";
    }

    public String getClassificationLabel() {
        return classificationLabel;
    }

    public void setClassificationLabel(String classificationLabel) {
        this.classificationLabel = classificationLabel;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public Double getImportanceWeight() {
        return importanceWeight;
    }

    public void setImportanceWeight(Double importanceWeight) {
        this.importanceWeight = importanceWeight;
    }
}
