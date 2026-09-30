package org.statiq.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.statiq.dto.*;
import org.statiq.service.AdminService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getDashboardMetrics() {
        AdminDashboardDto metrics = adminService.getDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }

    @GetMapping("/competencies")
    public ResponseEntity<ApiResponse<List<CompetencyAnalyticsDto>>> getCompetencyAnalytics() {
        List<CompetencyAnalyticsDto> analytics = adminService.getTopSkillGaps();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @GetMapping("/skill-gaps")
    public ResponseEntity<ApiResponse<List<CompetencyAnalyticsDto>>> getSkillGapAnalytics() {
        List<CompetencyAnalyticsDto> gaps = adminService.getTopSkillGaps();
        return ResponseEntity.ok(ApiResponse.success(gaps));
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<DepartmentAnalyticsDto>>> getDepartmentAnalytics() {
        List<DepartmentAnalyticsDto> list = adminService.getDepartmentAnalytics();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/training-analytics")
    public ResponseEntity<ApiResponse<TrainingAnalyticsDto>> getTrainingAnalytics() {
        TrainingAnalyticsDto analytics = adminService.getTrainingAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }
}
