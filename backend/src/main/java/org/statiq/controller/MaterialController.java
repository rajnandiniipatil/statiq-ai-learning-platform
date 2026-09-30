package org.statiq.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.statiq.dto.ApiResponse;
import org.statiq.dto.MaterialDto;
import org.statiq.security.UserPrincipal;
import org.statiq.service.MaterialService;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN', 'LEARNER')")
    public ResponseEntity<ApiResponse<MaterialDto>> uploadMaterial(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        MaterialDto result = materialService.uploadAndProcessMaterial(file, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Learning material uploaded and extracted successfully", result));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MaterialDto>>> getAllMaterials() {
        List<MaterialDto> list = materialService.getAllMaterials();
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
