package org.statiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.statiq.entity.Course;
import org.statiq.entity.Enrollment;
import org.statiq.entity.LearnerProfile;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByLearnerProfile(LearnerProfile learnerProfile);
    Optional<Enrollment> findByLearnerProfileAndCourse(LearnerProfile learnerProfile, Course course);
    Optional<Enrollment> findByLearnerProfileIdAndCourseId(Long learnerProfileId, Long courseId);
}
