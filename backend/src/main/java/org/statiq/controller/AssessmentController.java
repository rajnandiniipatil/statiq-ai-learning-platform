package org.statiq.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.statiq.dto.*;
import org.statiq.security.UserPrincipal;
import org.statiq.service.AssessmentService;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN', 'LEARNER')")
    public ResponseEntity<ApiResponse<AssessmentDto>> createAssessment(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CreateAssessmentRequest request
    ) {
        AssessmentDto assessment = assessmentService.createAssessment(currentUser, request);
        return ResponseEntity.ok(ApiResponse.success("Assessment published successfully", assessment));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssessmentDto>>> getAssessments(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<AssessmentDto> list = assessmentService.getAllPublishedAssessments(currentUser);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssessmentDto>> getAssessmentById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        AssessmentDto assessment = assessmentService.getAssessmentById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(assessment));
    }

    @PostMapping("/{id}/attempt")
    public ResponseEntity<ApiResponse<QuizResultDto>> submitAssessmentAttempt(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody QuizSubmissionRequest submission
    ) {
        submission.setAssessmentId(id);
        QuizResultDto result = assessmentService.submitQuizAttempt(id, currentUser, submission);
        return ResponseEntity.ok(ApiResponse.success("Quiz submitted and evaluated successfully. Competency score updated.", result));
    }

    @GetMapping("/{id}/results")
    public ResponseEntity<ApiResponse<QuizResultDto>> getAssessmentResults(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        QuizResultDto results = assessmentService.getLatestAssessmentResult(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(results));
    }
}
