package org.statiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.statiq.entity.Course;
import org.statiq.entity.LearnerProfile;
import org.statiq.entity.Recommendation;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByLearnerProfileOrderByCreatedAtDesc(LearnerProfile learnerProfile);
    Optional<Recommendation> findByLearnerProfileAndCourse(LearnerProfile learnerProfile, Course course);
    void deleteByLearnerProfile(LearnerProfile learnerProfile);
}
