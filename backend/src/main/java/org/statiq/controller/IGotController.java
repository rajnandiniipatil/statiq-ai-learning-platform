package org.statiq.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.statiq.dto.*;
import org.statiq.entity.LearnerProfile;
import org.statiq.igot.IGotCourseProvider;
import org.statiq.repository.LearnerProfileRepository;
import org.statiq.security.UserPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/igot")
public class IGotController {

    private final IGotCourseProvider igotCourseProvider;
    private final LearnerProfileRepository learnerProfileRepository;

    public IGotController(IGotCourseProvider igotCourseProvider, LearnerProfileRepository learnerProfileRepository) {
        this.igotCourseProvider = igotCourseProvider;
        this.learnerProfileRepository = learnerProfileRepository;
    }

    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<List<IGotCourseDto>>> getCourses(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Long profileId = getLearnerProfileId(currentUser);
        List<IGotCourseDto> courses = igotCourseProvider.getCourses(profileId);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<IGotCourseDto>> getCourseById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Long profileId = getLearnerProfileId(currentUser);
        IGotCourseDto course = igotCourseProvider.getCourseById(id, profileId);
        return ResponseEntity.ok(ApiResponse.success(course));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<IGotCourseDto>>> searchCourses(
            @RequestParam(required = false, defaultValue = "") String q,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Long profileId = getLearnerProfileId(currentUser);
        List<IGotCourseDto> courses = igotCourseProvider.searchCourses(q, profileId);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @PostMapping("/enroll")
    public ResponseEntity<ApiResponse<EnrollmentResultDto>> enrollCourse(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody EnrollRequest enrollRequest
    ) {
        Long profileId = getLearnerProfileId(currentUser);
        if (profileId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Only registered learners can enroll in courses."));
        }
        EnrollmentResultDto result = igotCourseProvider.enrollCourse(profileId, enrollRequest.getCourseId());
        return ResponseEntity.ok(ApiResponse.success(result.getMessage(), result));
    }

    @GetMapping("/progress")
    public ResponseEntity<ApiResponse<LearningProgressSummaryDto>> getProgress(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Long profileId = getLearnerProfileId(currentUser);
        if (profileId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Profile not found"));
        }
        LearningProgressSummaryDto progress = igotCourseProvider.getCompletionStatus(profileId);
        return ResponseEntity.ok(ApiResponse.success(progress));
    }

    private Long getLearnerProfileId(UserPrincipal currentUser) {
        if (currentUser == null) return null;
        return learnerProfileRepository.findByUserId(currentUser.getId())
                .map(LearnerProfile::getId)
                .orElse(null);
    }
}
