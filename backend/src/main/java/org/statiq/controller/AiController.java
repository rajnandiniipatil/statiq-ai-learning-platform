package org.statiq.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.statiq.dto.*;
import org.statiq.enums.DifficultyLevel;
import org.statiq.service.AiService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/generate-mcq")
    public ResponseEntity<ApiResponse<List<QuestionDto>>> generateMcqs(@RequestBody Map<String, Object> request) {
        Long materialId = null;
        if (request.containsKey("materialId") && request.get("materialId") != null) {
            materialId = Long.valueOf(request.get("materialId").toString());
        }

        String topic = (String) request.getOrDefault("topic", "Official Statistical Methodologies");
        String diffStr = (String) request.getOrDefault("difficulty", "INTERMEDIATE");
        DifficultyLevel difficulty;
        try {
            difficulty = DifficultyLevel.valueOf(diffStr.toUpperCase());
        } catch (Exception e) {
            difficulty = DifficultyLevel.INTERMEDIATE;
        }

        int count = 10;
        if (request.containsKey("count") && request.get("count") != null) {
            try {
                count = Integer.parseInt(request.get("count").toString());
            } catch (Exception ignored) {}
        }

        List<QuestionDto> questions = aiService.generateMcqs(materialId, topic, difficulty, count);
        return ResponseEntity.ok(ApiResponse.success("Successfully generated " + questions.size() + " MCQs", questions));
    }

    @PostMapping("/generate-quiz")
    public ResponseEntity<ApiResponse<List<QuestionDto>>> generateQuiz(@RequestBody Map<String, Object> request) {
        return generateMcqs(request);
    }

    @PostMapping("/assistant")
    public ResponseEntity<ApiResponse<AiAssistantResponse>> askAssistant(@Valid @RequestBody AiAssistantRequest request) {
        AiAssistantResponse response = aiService.askAssistant(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
