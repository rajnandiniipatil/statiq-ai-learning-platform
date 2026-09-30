package org.statiq.dto;

import org.statiq.enums.CompetencyCategory;

public class CompetencyAnalyticsDto {

    private Integer competencyId;
    private String competencyCode;
    private String competencyName;
    private CompetencyCategory category;
    private double averageScore;
    private double benchmarkScore;
    private double averageGap;
    private int affectedEmployeesCount;
    private String demandLevel; // HIGH, CRITICAL, MODERATE

    public CompetencyAnalyticsDto() {}

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

    public double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(double averageScore) {
        this.averageScore = averageScore;
    }

    public double getBenchmarkScore() {
        return benchmarkScore;
    }

    public void setBenchmarkScore(double benchmarkScore) {
        this.benchmarkScore = benchmarkScore;
    }

    public double getAverageGap() {
        return averageGap;
    }

    public void setAverageGap(double averageGap) {
        this.averageGap = averageGap;
    }

    public int getAffectedEmployeesCount() {
        return affectedEmployeesCount;
    }

    public void setAffectedEmployeesCount(int affectedEmployeesCount) {
        this.affectedEmployeesCount = affectedEmployeesCount;
    }

    public String getDemandLevel() {
        return demandLevel;
    }

    public void setDemandLevel(String demandLevel) {
        this.demandLevel = demandLevel;
    }
}
