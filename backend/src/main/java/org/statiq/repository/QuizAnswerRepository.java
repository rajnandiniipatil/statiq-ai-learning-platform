package org.statiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.statiq.entity.QuizAnswer;
import org.statiq.entity.QuizAttempt;
import java.util.List;

@Repository
public interface QuizAnswerRepository extends JpaRepository<QuizAnswer, Long> {
    List<QuizAnswer> findByQuizAttempt(QuizAttempt quizAttempt);
}
