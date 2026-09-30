package org.statiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.statiq.entity.Assessment;
import org.statiq.entity.User;
import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByIsPublishedTrue();
    List<Assessment> findByCreatorOrderByCreatedAtDesc(User creator);
    List<Assessment> findAllByOrderByCreatedAtDesc();
}
