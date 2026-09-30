package org.statiq.dto;

public class DepartmentAnalyticsDto {

    private Integer departmentId;
    private String departmentCode;
    private String departmentName;
    private long employeeCount;
    private double averageCompetencyScore;
    private int criticalGapsCount;
    private double trainingCompletionRate;

    public DepartmentAnalyticsDto() {}

    public Integer getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Integer departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public long getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(long employeeCount) {
        this.employeeCount = employeeCount;
    }

    public double getAverageCompetencyScore() {
        return averageCompetencyScore;
    }

    public void setAverageCompetencyScore(double averageCompetencyScore) {
        this.averageCompetencyScore = averageCompetencyScore;
    }

    public int getCriticalGapsCount() {
        return criticalGapsCount;
    }

    public void setCriticalGapsCount(int criticalGapsCount) {
        this.criticalGapsCount = criticalGapsCount;
    }

    public double getTrainingCompletionRate() {
        return trainingCompletionRate;
    }

    public void setTrainingCompletionRate(double trainingCompletionRate) {
        this.trainingCompletionRate = trainingCompletionRate;
    }
}
