package org.statiq.dto;

import java.util.List;

public class LearningProgressSummaryDto {

    private int enrolledCoursesCount;
    private int completedCoursesCount;
    private int inProgressCoursesCount;
    private int totalLearningHoursCompleted;
    private double overallCompletionRate;
    private List<EnrollmentDto> enrollments;

    public LearningProgressSummaryDto() {}

    public int getEnrolledCoursesCount() {
        return enrolledCoursesCount;
    }

    public void setEnrolledCoursesCount(int enrolledCoursesCount) {
        this.enrolledCoursesCount = enrolledCoursesCount;
    }

    public int getCompletedCoursesCount() {
        return completedCoursesCount;
    }

    public void setCompletedCoursesCount(int completedCoursesCount) {
        this.completedCoursesCount = completedCoursesCount;
    }

    public int getInProgressCoursesCount() {
        return inProgressCoursesCount;
    }

    public void setInProgressCoursesCount(int inProgressCoursesCount) {
        this.inProgressCoursesCount = inProgressCoursesCount;
    }

    public int getTotalLearningHoursCompleted() {
        return totalLearningHoursCompleted;
    }

    public void setTotalLearningHoursCompleted(int totalLearningHoursCompleted) {
        this.totalLearningHoursCompleted = totalLearningHoursCompleted;
    }

    public double getOverallCompletionRate() {
        return overallCompletionRate;
    }

    public void setOverallCompletionRate(double overallCompletionRate) {
        this.overallCompletionRate = overallCompletionRate;
    }

    public List<EnrollmentDto> getEnrollments() {
        return enrollments;
    }

    public void setEnrollments(List<EnrollmentDto> enrollments) {
        this.enrollments = enrollments;
    }
}
