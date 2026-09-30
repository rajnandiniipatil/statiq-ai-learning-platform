package org.statiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.statiq.entity.Competency;
import org.statiq.entity.CompetencyRequirement;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompetencyRequirementRepository extends JpaRepository<CompetencyRequirement, Integer> {
    List<CompetencyRequirement> findByJobRole(String jobRole);
    Optional<CompetencyRequirement> findByJobRoleAndCompetency(String jobRole, Competency competency);
}
