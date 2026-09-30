package org.statiq.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class AiAssistantRequest {

    @NotBlank(message = "Query cannot be blank")
    private String query;

    private String contextTopic;
    private List<ChatMessageDto> history;

    public AiAssistantRequest() {}

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getContextTopic() {
        return contextTopic;
    }

    public void setContextTopic(String contextTopic) {
        this.contextTopic = contextTopic;
    }

    public List<ChatMessageDto> getHistory() {
        return history;
    }

    public void setHistory(List<ChatMessageDto> history) {
        this.history = history;
    }

    public static class ChatMessageDto {
        private String role; // user or assistant
        private String content;

        public ChatMessageDto() {}

        public ChatMessageDto(String role, String content) {
            this.role = role;
            this.content = content;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}
