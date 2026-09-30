package org.statiq.dto;

import jakarta.validation.constraints.NotNull;

public class EnrollRequest {

    @NotNull(message = "Course ID is required")
    private Long courseId;

    public EnrollRequest() {}

    public EnrollRequest(Long courseId) {
        this.courseId = courseId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}
