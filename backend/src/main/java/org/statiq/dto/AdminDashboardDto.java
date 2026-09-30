package org.statiq.dto;

import java.util.List;
import java.util.Map;

public class AdminDashboardDto {

    private long totalEmployees;
    private long activeLearners;
    private double averageCompetencyScore;
    private double trainingCompletionRate;
    private int criticalGapsCount;
    private int significantGapsCount;
    private List<DepartmentAnalyticsDto> departmentAnalytics;
    private List<CompetencyAnalyticsDto> topSkillGaps;
    private List<CompetencyAnalyticsDto> emergingSkills;
    private TrainingAnalyticsDto trainingAnalytics;
    private Map<String, Integer> gapDistribution;

    public AdminDashboardDto() {}

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getActiveLearners() {
        return activeLearners;
    }

    public void setActiveLearners(long activeLearners) {
        this.activeLearners = activeLearners;
    }

    public double getAverageCompetencyScore() {
        return averageCompetencyScore;
    }

    public void setAverageCompetencyScore(double averageCompetencyScore) {
        this.averageCompetencyScore = averageCompetencyScore;
    }

    public double getTrainingCompletionRate() {
        return trainingCompletionRate;
    }

    public void setTrainingCompletionRate(double trainingCompletionRate) {
        this.trainingCompletionRate = trainingCompletionRate;
    }

    public int getCriticalGapsCount() {
        return criticalGapsCount;
    }

    public void setCriticalGapsCount(int criticalGapsCount) {
        this.criticalGapsCount = criticalGapsCount;
    }

    public int getSignificantGapsCount() {
        return significantGapsCount;
    }

    public void setSignificantGapsCount(int significantGapsCount) {
        this.significantGapsCount = significantGapsCount;
    }

    public List<DepartmentAnalyticsDto> getDepartmentAnalytics() {
        return departmentAnalytics;
    }

    public void setDepartmentAnalytics(List<DepartmentAnalyticsDto> departmentAnalytics) {
        this.departmentAnalytics = departmentAnalytics;
    }

    public List<CompetencyAnalyticsDto> getTopSkillGaps() {
        return topSkillGaps;
    }

    public void setTopSkillGaps(List<CompetencyAnalyticsDto> topSkillGaps) {
        this.topSkillGaps = topSkillGaps;
    }

    public List<CompetencyAnalyticsDto> getEmergingSkills() {
        return emergingSkills;
    }

    public void setEmergingSkills(List<CompetencyAnalyticsDto> emergingSkills) {
        this.emergingSkills = emergingSkills;
    }

    public TrainingAnalyticsDto getTrainingAnalytics() {
        return trainingAnalytics;
    }

    public void setTrainingAnalytics(TrainingAnalyticsDto trainingAnalytics) {
        this.trainingAnalytics = trainingAnalytics;
    }

    public Map<String, Integer> getGapDistribution() {
        return gapDistribution;
    }

    public void setGapDistribution(Map<String, Integer> gapDistribution) {
        this.gapDistribution = gapDistribution;
    }
}
