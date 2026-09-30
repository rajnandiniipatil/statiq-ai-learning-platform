package org.statiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.statiq.entity.LearningPath;
import org.statiq.entity.LearningPathItem;
import java.util.List;

@Repository
public interface LearningPathItemRepository extends JpaRepository<LearningPathItem, Long> {
    List<LearningPathItem> findByLearningPathOrderBySequenceOrderAsc(LearningPath learningPath);
}
