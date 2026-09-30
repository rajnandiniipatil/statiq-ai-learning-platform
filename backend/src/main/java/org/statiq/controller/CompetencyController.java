package org.statiq.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.statiq.dto.*;
import org.statiq.security.UserPrincipal;
import org.statiq.service.CompetencyService;
import org.statiq.service.SkillGapService;

import java.util.List;

@RestController
@RequestMapping("/api/competencies")
public class CompetencyController {

    private final CompetencyService competencyService;
    private final SkillGapService skillGapService;

    public CompetencyController(CompetencyService competencyService, SkillGapService skillGapService) {
        this.competencyService = competencyService;
        this.skillGapService = skillGapService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CompetencyDto>>> getAllCompetencies() {
        List<CompetencyDto> competencies = competencyService.getAllCompetencies();
        return ResponseEntity.ok(ApiResponse.success(competencies));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<LearnerCompetencyDto>>> getMyCompetencies(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<LearnerCompetencyDto> ratings = competencyService.getLearnerCompetencies(currentUser);
        return ResponseEntity.ok(ApiResponse.success(ratings));
    }

    @GetMapping("/gaps")
    public ResponseEntity<ApiResponse<List<SkillGapDto>>> getMySkillGaps(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<SkillGapDto> gaps = skillGapService.calculateSkillGaps(currentUser);
        return ResponseEntity.ok(ApiResponse.success(gaps));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<SkillGapSummaryDto>> getSkillGapSummary(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        SkillGapSummaryDto summary = skillGapService.getSkillGapSummary(currentUser);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @PostMapping("/assessment")
    public ResponseEntity<ApiResponse<LearnerCompetencyDto>> submitCompetencyAssessment(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CompetencyAssessmentRequest request
    ) {
        LearnerCompetencyDto updated = competencyService.submitCompetencyAssessment(currentUser, request);
        return ResponseEntity.ok(ApiResponse.success("Competency assessment recorded successfully", updated));
    }
}
