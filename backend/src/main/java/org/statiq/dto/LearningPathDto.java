package org.statiq.dto;

import java.time.LocalDateTime;
import java.util.List;

public class LearningPathDto {

    private Long id;
    private String title;
    private String description;
    private String targetRole;
    private Integer totalEstimatedHours;
    private Integer completedHours;
    private Integer overallProgressPercent;
    private List<LearningPathItemDto> items;
    private LocalDateTime createdAt;

    public LearningPathDto() {}

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

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public Integer getTotalEstimatedHours() {
        return totalEstimatedHours;
    }

    public void setTotalEstimatedHours(Integer totalEstimatedHours) {
        this.totalEstimatedHours = totalEstimatedHours;
    }

    public Integer getCompletedHours() {
        return completedHours;
    }

    public void setCompletedHours(Integer completedHours) {
        this.completedHours = completedHours;
    }

    public Integer getOverallProgressPercent() {
        return overallProgressPercent;
    }

    public void setOverallProgressPercent(Integer overallProgressPercent) {
        this.overallProgressPercent = overallProgressPercent;
    }

    public List<LearningPathItemDto> getItems() {
        return items;
    }

    public void setItems(List<LearningPathItemDto> items) {
        this.items = items;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
