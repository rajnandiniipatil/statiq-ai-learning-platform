package org.statiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.statiq.entity.Competency;
import org.statiq.entity.Course;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseCode(String courseCode);
    List<Course> findByIsIgotCourseTrue();
    List<Course> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String desc);
    
    @Query("SELECT c FROM Course c JOIN c.competencies comp WHERE comp = :competency")
    List<Course> findByCompetency(@Param("competency") Competency competency);
}
