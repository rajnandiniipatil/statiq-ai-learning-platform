package org.statiq.dto;

import java.util.List;

public class AiAssistantResponse {

    private String answer;
    private List<String> sourceReferences;
    private List<String> suggestedFollowUps;
    private List<String> relevantCompetencies;

    public AiAssistantResponse() {}

    public AiAssistantResponse(String answer) {
        this.answer = answer;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public List<String> getSourceReferences() {
        return sourceReferences;
    }

    public void setSourceReferences(List<String> sourceReferences) {
        this.sourceReferences = sourceReferences;
    }

    public List<String> getSuggestedFollowUps() {
        return suggestedFollowUps;
    }

    public void setSuggestedFollowUps(List<String> suggestedFollowUps) {
        this.suggestedFollowUps = suggestedFollowUps;
    }

    public List<String> getRelevantCompetencies() {
        return relevantCompetencies;
    }

    public void setRelevantCompetencies(List<String> relevantCompetencies) {
        this.relevantCompetencies = relevantCompetencies;
    }
}
