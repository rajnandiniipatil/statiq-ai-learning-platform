package org.statiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.statiq.entity.Competency;
import org.statiq.enums.CompetencyCategory;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompetencyRepository extends JpaRepository<Competency, Integer> {
    Optional<Competency> findByCode(String code);
    List<Competency> findByCategory(CompetencyCategory category);
}
