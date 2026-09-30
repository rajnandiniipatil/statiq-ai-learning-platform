package org.statiq.dto;

import org.statiq.enums.DifficultyLevel;
import org.statiq.enums.EnrollmentStatus;
import java.util.List;

public class IGotCourseDto {

    private Long id;
    private String courseCode;
    private String title;
    private String description;
    private String provider;
    private DifficultyLevel difficulty;
    private Integer durationHours;
    private String category;
    private String language;
    private String externalUrl;
    private Boolean isIgotCourse;
    private List<String> competencyCodes;
    private List<String> competencyNames;
    private EnrollmentStatus enrollmentStatus;
    private Integer progressPercent;

    public IGotCourseDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
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

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(DifficultyLevel difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getDurationHours() {
        return durationHours;
    }

    public void setDurationHours(Integer durationHours) {
        this.durationHours = durationHours;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getExternalUrl() {
        return externalUrl;
    }

    public void setExternalUrl(String externalUrl) {
        this.externalUrl = externalUrl;
    }

    public Boolean getIgotCourse() {
        return isIgotCourse;
    }

    public Boolean getIsIgotCourse() {
        return isIgotCourse;
    }

    public void setIgotCourse(Boolean igotCourse) {
        isIgotCourse = igotCourse;
    }

    public void setIsIgotCourse(Boolean isIgotCourse) {
        this.isIgotCourse = isIgotCourse;
    }

    public List<String> getCompetencyCodes() {
        return competencyCodes;
    }

    public void setCompetencyCodes(List<String> competencyCodes) {
        this.competencyCodes = competencyCodes;
    }

    public List<String> getCompetencyNames() {
        return competencyNames;
    }

    public void setCompetencyNames(List<String> competencyNames) {
        this.competencyNames = competencyNames;
    }

    public EnrollmentStatus getEnrollmentStatus() {
        return enrollmentStatus;
    }

    public void setEnrollmentStatus(EnrollmentStatus enrollmentStatus) {
        this.enrollmentStatus = enrollmentStatus;
    }

    public Integer getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(Integer progressPercent) {
        this.progressPercent = progressPercent;
    }
}
