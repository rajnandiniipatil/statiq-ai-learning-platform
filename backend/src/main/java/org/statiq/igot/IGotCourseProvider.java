package org.statiq.igot;

import org.statiq.dto.*;
import java.util.List;

/**
 * Enterprise Service Provider Interface for iGOT Karmayogi Ecosystem Integration.
 * Allows seamless switching between MockIGotCourseProvider (sandbox/hackathon prototype)
 * and IGotApiCourseProvider (production government gateway).
 */
public interface IGotCourseProvider {

    List<IGotCourseDto> getCourses(Long learnerProfileId);

    IGotCourseDto getCourseById(Long courseId, Long learnerProfileId);

    List<IGotCourseDto> searchCourses(String query, Long learnerProfileId);

    EnrollmentResultDto enrollCourse(Long learnerProfileId, Long courseId);

    EnrollmentDto getEnrollmentStatus(Long learnerProfileId, Long courseId);

    LearningProgressSummaryDto getCompletionStatus(Long learnerProfileId);
}
