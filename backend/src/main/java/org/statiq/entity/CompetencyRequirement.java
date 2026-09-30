package org.statiq.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "competency_requirements", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"job_role", "competency_id"})
})
public class CompetencyRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "job_role", nullable = false, length = 150)
    private String jobRole;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "competency_id", nullable = false)
    private Competency competency;

    @Column(name = "required_level", nullable = false)
    private Double requiredLevel;

    @Column(name = "importance_weight")
    private Double importanceWeight = 1.0;

    public CompetencyRequirement() {}

    public CompetencyRequirement(String jobRole, Department department, Competency competency, Double requiredLevel, Double importanceWeight) {
        this.jobRole = jobRole;
        this.department = department;
        this.competency = competency;
        this.requiredLevel = requiredLevel;
        this.importanceWeight = importanceWeight;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Competency getCompetency() {
        return competency;
    }

    public void setCompetency(Competency competency) {
        this.competency = competency;
    }

    public Double getRequiredLevel() {
        return requiredLevel;
    }

    public void setRequiredLevel(Double requiredLevel) {
        this.requiredLevel = requiredLevel;
    }

    public Double getImportanceWeight() {
        return importanceWeight;
    }

    public void setImportanceWeight(Double importanceWeight) {
        this.importanceWeight = importanceWeight;
    }
}
