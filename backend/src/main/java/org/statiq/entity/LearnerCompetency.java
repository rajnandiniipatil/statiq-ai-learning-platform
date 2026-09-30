package org.statiq.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "learner_competencies", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"learner_profile_id", "competency_id"})
})
public class LearnerCompetency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_profile_id", nullable = false)
    private LearnerProfile learnerProfile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "competency_id", nullable = false)
    private Competency competency;

    @Column(nullable = false)
    private Double score = 0.0;

    @Column(name = "confidence_level", length = 50)
    private String confidenceLevel = "INITIAL";

    @Column(name = "last_assessed_at")
    private LocalDateTime lastAssessedAt = LocalDateTime.now();

    public LearnerCompetency() {}

    public LearnerCompetency(LearnerProfile learnerProfile, Competency competency, Double score, String confidenceLevel) {
        this.learnerProfile = learnerProfile;
        this.competency = competency;
        this.score = score;
        this.confidenceLevel = confidenceLevel;
        this.lastAssessedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LearnerProfile getLearnerProfile() {
        return learnerProfile;
    }

    public void setLearnerProfile(LearnerProfile learnerProfile) {
        this.learnerProfile = learnerProfile;
    }

    public Competency getCompetency() {
        return competency;
    }

    public void setCompetency(Competency competency) {
        this.competency = competency;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getConfidenceLevel() {
        return confidenceLevel;
    }

    public void setConfidenceLevel(String confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }

    public LocalDateTime getLastAssessedAt() {
        return lastAssessedAt;
    }

    public void setLastAssessedAt(LocalDateTime lastAssessedAt) {
        this.lastAssessedAt = lastAssessedAt;
    }
}
