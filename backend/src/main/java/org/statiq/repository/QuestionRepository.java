package org.statiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.statiq.entity.Assessment;
import org.statiq.entity.Question;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByAssessmentOrderBySequenceOrderAsc(Assessment assessment);
    List<Question> findByAssessmentIdOrderBySequenceOrderAsc(Long assessmentId);
}
