package org.statiq.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.statiq.dto.ApiResponse;
import org.statiq.dto.LearningPathDto;
import org.statiq.dto.LearningProgressSummaryDto;
import org.statiq.security.UserPrincipal;
import org.statiq.service.LearningPathService;

@RestController
@RequestMapping
public class LearningPathController {

    private final LearningPathService learningPathService;

    public LearningPathController(LearningPathService learningPathService) {
        this.learningPathService = learningPathService;
    }

    @GetMapping("/api/learning-path")
    public ResponseEntity<ApiResponse<LearningPathDto>> getLearningPath(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        LearningPathDto path = learningPathService.getLearningPath(currentUser);
        return ResponseEntity.ok(ApiResponse.success(path));
    }

    @PostMapping("/api/learning-path/generate")
    public ResponseEntity<ApiResponse<LearningPathDto>> generateLearningPath(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        LearningPathDto path = learningPathService.generateLearningPath(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Personalized learning path generated successfully", path));
    }

    @GetMapping("/api/learning/progress")
    public ResponseEntity<ApiResponse<LearningProgressSummaryDto>> getLearningProgress(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        LearningProgressSummaryDto progress = learningPathService.getLearningProgress(currentUser);
        return ResponseEntity.ok(ApiResponse.success(progress));
    }
}
