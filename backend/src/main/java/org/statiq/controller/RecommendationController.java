package org.statiq.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.statiq.dto.ApiResponse;
import org.statiq.dto.RecommendationDto;
import org.statiq.security.UserPrincipal;
import org.statiq.service.RecommendationService;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RecommendationDto>>> getRecommendations(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<RecommendationDto> recommendations = recommendationService.getRecommendations(currentUser);
        return ResponseEntity.ok(ApiResponse.success(recommendations));
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<List<RecommendationDto>>> generateRecommendations(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<RecommendationDto> recommendations = recommendationService.generateRecommendations(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Recommendations regenerated successfully", recommendations));
    }
}
