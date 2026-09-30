package org.statiq.dto;

import java.util.List;

public class TrainingAnalyticsDto {

    private long totalEnrollments;
    private long completedEnrollments;
    private long activeEnrollments;
    private double overallCompletionRate;
    private List<CourseUtilizationDto> mostPopularCourses;

    public TrainingAnalyticsDto() {}

    public long getTotalEnrollments() {
        return totalEnrollments;
    }

    public void setTotalEnrollments(long totalEnrollments) {
        this.totalEnrollments = totalEnrollments;
    }

    public long getCompletedEnrollments() {
        return completedEnrollments;
    }

    public void setCompletedEnrollments(long completedEnrollments) {
        this.completedEnrollments = completedEnrollments;
    }

    public long getActiveEnrollments() {
        return activeEnrollments;
    }

    public void setActiveEnrollments(long activeEnrollments) {
        this.activeEnrollments = activeEnrollments;
    }

    public double getOverallCompletionRate() {
        return overallCompletionRate;
    }

    public void setOverallCompletionRate(double overallCompletionRate) {
        this.overallCompletionRate = overallCompletionRate;
    }

    public List<CourseUtilizationDto> getMostPopularCourses() {
        return mostPopularCourses;
    }

    public void setMostPopularCourses(List<CourseUtilizationDto> mostPopularCourses) {
        this.mostPopularCourses = mostPopularCourses;
    }

    public static class CourseUtilizationDto {
        private Long courseId;
        private String courseCode;
        private String courseTitle;
        private String provider;
        private long enrollmentCount;
        private double averageProgress;

        public CourseUtilizationDto() {}

        public Long getCourseId() {
            return courseId;
        }

        public void setCourseId(Long courseId) {
            this.courseId = courseId;
        }

        public String getCourseCode() {
            return courseCode;
        }

        public void setCourseCode(String courseCode) {
            this.courseCode = courseCode;
        }

        public String getCourseTitle() {
            return courseTitle;
        }

        public void setCourseTitle(String courseTitle) {
            this.courseTitle = courseTitle;
        }

        public String getProvider() {
            return provider;
        }

        public void setProvider(String provider) {
            this.provider = provider;
        }

        public long getEnrollmentCount() {
            return enrollmentCount;
        }

        public void setEnrollmentCount(long enrollmentCount) {
            this.enrollmentCount = enrollmentCount;
        }

        public double getAverageProgress() {
            return averageProgress;
        }

        public void setAverageProgress(double averageProgress) {
            this.averageProgress = averageProgress;
        }
    }
}
