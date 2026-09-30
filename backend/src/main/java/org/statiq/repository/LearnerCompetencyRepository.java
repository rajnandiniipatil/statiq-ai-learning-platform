package org.statiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.statiq.entity.Competency;
import org.statiq.entity.LearnerCompetency;
import org.statiq.entity.LearnerProfile;
import java.util.List;
import java.util.Optional;

@Repository
public interface LearnerCompetencyRepository extends JpaRepository<LearnerCompetency, Long> {
    List<LearnerCompetency> findByLearnerProfile(LearnerProfile learnerProfile);
    Optional<LearnerCompetency> findByLearnerProfileAndCompetency(LearnerProfile learnerProfile, Competency competency);
    void deleteByLearnerProfile(LearnerProfile learnerProfile);
}
