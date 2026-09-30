package org.statiq.entity;

import jakarta.persistence.*;
import org.statiq.enums.DifficultyLevel;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_material_id")
    private UploadedMaterial sourceMaterial;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "target_competency_id")
    private Competency targetCompetency;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private DifficultyLevel difficulty = DifficultyLevel.INTERMEDIATE;

    @Column(name = "passing_score")
    private Double passingScore = 60.0;

    @Column(name = "time_limit_minutes")
    private Integer timeLimitMinutes = 20;

    @Column(name = "is_published")
    private Boolean isPublished = true;

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("sequenceOrder ASC")
    private List<Question> questions = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Assessment() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public UploadedMaterial getSourceMaterial() {
        return sourceMaterial;
    }

    public void setSourceMaterial(UploadedMaterial sourceMaterial) {
        this.sourceMaterial = sourceMaterial;
    }

    public Competency getTargetCompetency() {
        return targetCompetency;
    }

    public void setTargetCompetency(Competency targetCompetency) {
        this.targetCompetency = targetCompetency;
    }

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(DifficultyLevel difficulty) {
        this.difficulty = difficulty;
    }

    public Double getPassingScore() {
        return passingScore;
    }

    public void setPassingScore(Double passingScore) {
        this.passingScore = passingScore;
    }

    public Integer getTimeLimitMinutes() {
        return timeLimitMinutes;
    }

    public void setTimeLimitMinutes(Integer timeLimitMinutes) {
        this.timeLimitMinutes = timeLimitMinutes;
    }

    public Boolean getPublished() {
        return isPublished;
    }

    public void setPublished(Boolean published) {
        isPublished = published;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
