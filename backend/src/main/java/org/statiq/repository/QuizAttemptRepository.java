package org.statiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.statiq.entity.Assessment;
import org.statiq.entity.LearnerProfile;
import org.statiq.entity.QuizAttempt;
import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByLearnerProfileOrderByAttemptedAtDesc(LearnerProfile learnerProfile);
    List<QuizAttempt> findByAssessmentOrderByAttemptedAtDesc(Assessment assessment);
    List<QuizAttempt> findAllByOrderByAttemptedAtDesc();
}
