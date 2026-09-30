package org.statiq.enums;

public enum GapClassification {
    STRONG("Strong", "The competency meets or exceeds standard role benchmarks."),
    MODERATE_GAP("Moderate Gap", "Minor skill uplift required to meet role benchmark."),
    SIGNIFICANT_GAP("Significant Gap", "Targeted training program needed to reach operational proficiency."),
    CRITICAL_GAP("Critical Gap", "High priority training intervention required immediately.");

    private final String label;
    private final String defaultDescription;

    GapClassification(String label, String defaultDescription) {
        this.label = label;
        this.defaultDescription = defaultDescription;
    }

    public String getLabel() {
        return label;
    }

    public String getDefaultDescription() {
        return defaultDescription;
    }

    public static GapClassification fromGap(double gap) {
        if (gap <= 10.0) {
            return STRONG;
        } else if (gap <= 25.0) {
            return MODERATE_GAP;
        } else if (gap <= 50.0) {
            return SIGNIFICANT_GAP;
        } else {
            return CRITICAL_GAP;
        }
    }
}
