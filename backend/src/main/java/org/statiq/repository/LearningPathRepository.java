package org.statiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.statiq.entity.LearningPath;
import org.statiq.entity.LearnerProfile;
import java.util.List;
import java.util.Optional;

@Repository
public interface LearningPathRepository extends JpaRepository<LearningPath, Long> {
    List<LearningPath> findByLearnerProfileOrderByCreatedAtDesc(LearnerProfile learnerProfile);
    Optional<LearningPath> findFirstByLearnerProfileOrderByCreatedAtDesc(LearnerProfile learnerProfile);
}
