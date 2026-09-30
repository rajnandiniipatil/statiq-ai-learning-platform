package org.statiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.statiq.entity.LearnerProfile;
import org.statiq.entity.User;
import java.util.Optional;
import java.util.List;

@Repository
public interface LearnerProfileRepository extends JpaRepository<LearnerProfile, Long> {
    Optional<LearnerProfile> findByUser(User user);
    Optional<LearnerProfile> findByUserId(Long userId);
    Optional<LearnerProfile> findByEmployeeId(String employeeId);
    List<LearnerProfile> findByJobRole(String jobRole);
}
