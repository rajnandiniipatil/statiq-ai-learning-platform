package org.statiq.dto;

import java.util.List;

public class SkillGapSummaryDto {

    private String jobRole;
    private Double averageCompetencyScore;
    private Double averageRequiredScore;
    private Double overallGap;
    private int criticalGapCount;
    private int significantGapCount;
    private int moderateGapCount;
    private int strongCount;
    private List<SkillGapDto> gaps;

    public SkillGapSummaryDto() {}

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public Double getAverageCompetencyScore() {
        return averageCompetencyScore;
    }

    public void setAverageCompetencyScore(Double averageCompetencyScore) {
        this.averageCompetencyScore = averageCompetencyScore;
    }

    public Double getAverageRequiredScore() {
        return averageRequiredScore;
    }

    public void setAverageRequiredScore(Double averageRequiredScore) {
        this.averageRequiredScore = averageRequiredScore;
    }

    public Double getOverallGap() {
        return overallGap;
    }

    public void setOverallGap(Double overallGap) {
        this.overallGap = overallGap;
    }

    public int getCriticalGapCount() {
        return criticalGapCount;
    }

    public void setCriticalGapCount(int criticalGapCount) {
        this.criticalGapCount = criticalGapCount;
    }

    public int getSignificantGapCount() {
        return significantGapCount;
    }

    public void setSignificantGapCount(int significantGapCount) {
        this.significantGapCount = significantGapCount;
    }

    public int getModerateGapCount() {
        return moderateGapCount;
    }

    public void setModerateGapCount(int moderateGapCount) {
        this.moderateGapCount = moderateGapCount;
    }

    public int getStrongCount() {
        return strongCount;
    }

    public void setStrongCount(int strongCount) {
        this.strongCount = strongCount;
    }

    public List<SkillGapDto> getGaps() {
        return gaps;
    }

    public void setGaps(List<SkillGapDto> gaps) {
        this.gaps = gaps;
    }
}
