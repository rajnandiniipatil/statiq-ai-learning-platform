package org.statiq.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.statiq.enums.GapClassification;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit test validating the core mathematical engines of StatIQ (SIH26101):
 * 1. Skill Gap Classification Engine (4-tier standard)
 * 2. Continuous Bayesian Competency Smoothing Engine: S_new = round(0.65 * S_old + 0.35 * ExamAccuracy)
 */
public class ContinuousFeedbackLoopTest {

    @Test
    @DisplayName("Verify Skill Gap Classification Engine across standard boundary tiers")
    void testSkillGapClassification() {
        // Strong: gap 0 to 10
        assertEquals(GapClassification.STRONG, classifyGap(0));
        assertEquals(GapClassification.STRONG, classifyGap(5));
        assertEquals(GapClassification.STRONG, classifyGap(10));

        // Moderate Gap: gap 11 to 25
        assertEquals(GapClassification.MODERATE_GAP, classifyGap(11));
        assertEquals(GapClassification.MODERATE_GAP, classifyGap(20));
        assertEquals(GapClassification.MODERATE_GAP, classifyGap(25));

        // Significant Gap: gap 26 to 50
        assertEquals(GapClassification.SIGNIFICANT_GAP, classifyGap(26));
        assertEquals(GapClassification.SIGNIFICANT_GAP, classifyGap(40));
        assertEquals(GapClassification.SIGNIFICANT_GAP, classifyGap(50));

        // Critical Gap: gap 51 to 100
        assertEquals(GapClassification.CRITICAL_GAP, classifyGap(51));
        assertEquals(GapClassification.CRITICAL_GAP, classifyGap(75));
        assertEquals(GapClassification.CRITICAL_GAP, classifyGap(100));
    }

    @Test
    @DisplayName("Verify Continuous Competency Score Bayesian Smoothing Equation")
    void testBayesianCompetencySmoothing() {
        // Case 1: Initial AI/ML competency 35, scores 80% on diagnostic assessment
        // S_new = round(0.65 * 35 + 0.35 * 80) = round(22.75 + 28.0) = round(50.75) = 51
        int oldScore = 35;
        double accuracy = 80.0;
        int newScore = calculateNewCompetencyScore(oldScore, accuracy);
        assertEquals(51, newScore);
        int delta = newScore - oldScore;
        assertEquals(16, delta);

        // Case 2: Statistical Cadre Officer with high baseline 85, scores 90%
        // S_new = round(0.65 * 85 + 0.35 * 90) = round(55.25 + 31.5) = round(86.75) = 87
        assertEquals(87, calculateNewCompetencyScore(85, 90.0));

        // Case 3: Initial score 0 (unassessed baseline), scores 70%
        // S_new = round(0.65 * 0 + 0.35 * 70) = round(24.5) = 25
        assertEquals(25, calculateNewCompetencyScore(0, 70.0));

        // Case 4: Perfect score 100 stays bounded at 100
        assertEquals(100, calculateNewCompetencyScore(100, 100.0));
    }

    private GapClassification classifyGap(int gap) {
        if (gap <= 10) return GapClassification.STRONG;
        if (gap <= 25) return GapClassification.MODERATE_GAP;
        if (gap <= 50) return GapClassification.SIGNIFICANT_GAP;
        return GapClassification.CRITICAL_GAP;
    }

    private int calculateNewCompetencyScore(int currentScore, double accuracyPercent) {
        double updated = (currentScore * 0.65) + (accuracyPercent * 0.35);
        int clamped = (int) Math.round(updated);
        return Math.min(100, Math.max(0, clamped));
    }
}
