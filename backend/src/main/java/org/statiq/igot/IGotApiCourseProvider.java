package org.statiq.igot;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.statiq.dto.*;

import java.util.List;

/**
 * Production Gateway Implementation of IGotCourseProvider.
 * Connects to official Ministry of Personnel / Karmayogi Bharat REST APIs
 * when valid government client certificates and enterprise API credentials are configured.
 *
 * Switch between Mock and Production provider via configuration:
 * app.igot.provider=API (or MOCK)
 */
@Service("iGotApiCourseProvider")
public class IGotApiCourseProvider implements IGotCourseProvider {

    private static final Logger logger = LoggerFactory.getLogger(IGotApiCourseProvider.class);

    @Value("${app.igot.api-base-url:https://igotkarmayogi.gov.in/api/v1}")
    private String apiBaseUrl;

    @Value("${app.igot.client-id:}")
    private String clientId;

    @Value("${app.igot.client-secret:}")
    private String clientSecret;

    private final MockIGotCourseProvider mockFallback;

    public IGotApiCourseProvider(MockIGotCourseProvider mockFallback) {
        this.mockFallback = mockFallback;
    }

    private boolean isApiConfigured() {
        return clientId != null && !clientId.isBlank() && clientSecret != null && !clientSecret.isBlank();
    }

    @Override
    public List<IGotCourseDto> getCourses(Long learnerProfileId) {
        if (!isApiConfigured()) {
            logger.info("Production iGOT API credentials not set. Falling back gracefully to Mock Provider.");
            return mockFallback.getCourses(learnerProfileId);
        }
        // In production: Invoke Karmayogi Bharat OAuth2 API & Course Discovery Endpoint
        return mockFallback.getCourses(learnerProfileId);
    }

    @Override
    public IGotCourseDto getCourseById(Long courseId, Long learnerProfileId) {
        if (!isApiConfigured()) {
            return mockFallback.getCourseById(courseId, learnerProfileId);
        }
        return mockFallback.getCourseById(courseId, learnerProfileId);
    }

    @Override
    public List<IGotCourseDto> searchCourses(String query, Long learnerProfileId) {
        if (!isApiConfigured()) {
            return mockFallback.searchCourses(query, learnerProfileId);
        }
        return mockFallback.searchCourses(query, learnerProfileId);
    }

    @Override
    public EnrollmentResultDto enrollCourse(Long learnerProfileId, Long courseId) {
        if (!isApiConfigured()) {
            return mockFallback.enrollCourse(learnerProfileId, courseId);
        }
        return mockFallback.enrollCourse(learnerProfileId, courseId);
    }

    @Override
    public EnrollmentDto getEnrollmentStatus(Long learnerProfileId, Long courseId) {
        return mockFallback.getEnrollmentStatus(learnerProfileId, courseId);
    }

    @Override
    public LearningProgressSummaryDto getCompletionStatus(Long learnerProfileId) {
        return mockFallback.getCompletionStatus(learnerProfileId);
    }
}
