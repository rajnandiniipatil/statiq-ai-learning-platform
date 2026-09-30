package org.statiq.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.statiq.entity.*;
import org.statiq.enums.*;
import org.statiq.repository.*;

import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final LearnerProfileRepository learnerProfileRepository;
    private final CompetencyRepository competencyRepository;
    private final LearnerCompetencyRepository learnerCompetencyRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final RecommendationRepository recommendationRepository;
    private final LearningPathRepository learningPathRepository;
    private final LearningPathItemRepository learningPathItemRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            RoleRepository roleRepository,
            DepartmentRepository departmentRepository,
            LearnerProfileRepository learnerProfileRepository,
            CompetencyRepository competencyRepository,
            LearnerCompetencyRepository learnerCompetencyRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            RecommendationRepository recommendationRepository,
            LearningPathRepository learningPathRepository,
            LearningPathItemRepository learningPathItemRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;
        this.learnerProfileRepository = learnerProfileRepository;
        this.competencyRepository = competencyRepository;
        this.learnerCompetencyRepository = learnerCompetencyRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.recommendationRepository = recommendationRepository;
        this.learningPathRepository = learningPathRepository;
        this.learningPathItemRepository = learningPathItemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        logger.info("Initializing baseline demo users and competency profiles...");

        Role roleLearner = getOrCreateRole(RoleName.ROLE_LEARNER);
        Role roleTrainer = getOrCreateRole(RoleName.ROLE_TRAINER);
        Role roleAdmin = getOrCreateRole(RoleName.ROLE_ADMIN);

        Department nsso = departmentRepository.findByCode("NSSO-SED").orElse(null);
        Department nad = departmentRepository.findByCode("NAD").orElse(null);
        Department esd = departmentRepository.findByCode("ESD").orElse(null);
        Department des = departmentRepository.findByCode("DES-MH").orElse(null);

        String demoPasswordHash = passwordEncoder.encode("Statiq@2025");

        // 1. Learner demo user
        User learnerUser = getOrCreateUser("learner@statiq.gov", "Rajnandini Patil", demoPasswordHash, Set.of(roleLearner));
        LearnerProfile learnerProfile = learnerProfileRepository.findByUser(learnerUser).orElseGet(() -> {
            LearnerProfile p = new LearnerProfile();
            p.setUser(learnerUser);
            p.setEmployeeId("MOSPI-SED-2024-8841");
            p.setDepartment(nsso);
            p.setDesignation("Statistical Analyst");
            p.setJobRole("Statistical Analyst");
            p.setEducationalQualification("M.Sc. Statistics (Gold Medalist), University of Pune");
            p.setYearsOfExperience(4);
            p.setCurrentAssignment("Periodic Labour Force Survey (PLFS) Microdata Validation & Anomaly Audits");
            p.setPreviousTraining("Induction Training at NSSTA, Basic Python for Data Analysis");
            p.setCareerInterests("Advanced Machine Learning in Official Statistics, Geospatial Analytics, Automated Dissemination");
            return learnerProfileRepository.save(p);
        });

        // Seed initial competencies for learner (AI/ML=35, GIS=30, Python=48, Data Viz=45, Sampling=85, Survey Design=82, SQL=78)
        seedLearnerCompetency(learnerProfile, "TECH-AIM", 35.0, "DIAGNOSTIC"); // AI/ML
        seedLearnerCompetency(learnerProfile, "TECH-GIS", 30.0, "DIAGNOSTIC"); // GIS
        seedLearnerCompetency(learnerProfile, "TECH-PYT", 48.0, "DIAGNOSTIC"); // Python
        seedLearnerCompetency(learnerProfile, "TECH-VIS", 45.0, "DIAGNOSTIC"); // Data Visualization
        seedLearnerCompetency(learnerProfile, "STAT-SRV", 82.0, "VERIFIED");   // Survey Design
        seedLearnerCompetency(learnerProfile, "STAT-SMP", 85.0, "VERIFIED");   // Sampling
        seedLearnerCompetency(learnerProfile, "TECH-SQL", 78.0, "VERIFIED");   // SQL
        seedLearnerCompetency(learnerProfile, "STAT-NAC", 68.0, "VERIFIED");   // National Accounts
        seedLearnerCompetency(learnerProfile, "GOV-PRV", 70.0, "VERIFIED");    // Data Privacy
        seedLearnerCompetency(learnerProfile, "MGT-COM", 72.0, "VERIFIED");    // Communication

        // 2. Trainer demo user
        User trainerUser = getOrCreateUser("trainer@statiq.gov", "Dr. Arvinder Sharma", demoPasswordHash, Set.of(roleTrainer));
        learnerProfileRepository.findByUser(trainerUser).orElseGet(() -> {
            LearnerProfile p = new LearnerProfile();
            p.setUser(trainerUser);
            p.setEmployeeId("NSSTA-FAC-1002");
            p.setDepartment(nsso);
            p.setDesignation("Senior Faculty & Director");
            p.setJobRole("Senior Statistical Officer");
            p.setEducationalQualification("Ph.D. Econometrics, ISI Kolkata");
            p.setYearsOfExperience(18);
            p.setCurrentAssignment("Curriculum Development & Master Trainer for Official Statistics Cadre");
            return learnerProfileRepository.save(p);
        });

        // 3. Admin demo user
        User adminUser = getOrCreateUser("admin@statiq.gov", "Dr. G. P. Samanta", demoPasswordHash, Set.of(roleAdmin));
        learnerProfileRepository.findByUser(adminUser).orElseGet(() -> {
            LearnerProfile p = new LearnerProfile();
            p.setUser(adminUser);
            p.setEmployeeId("MOSPI-HQ-001");
            p.setDepartment(nsso);
            p.setDesignation("Chief Statistician / Director General");
            p.setJobRole("Director General");
            p.setEducationalQualification("Ph.D. Statistics");
            p.setYearsOfExperience(25);
            return learnerProfileRepository.save(p);
        });

        // 4. Additional officers for rich analytics
        createOfficer(demoPasswordHash, roleLearner, nsso, "officer.arun@statiq.gov", "Arun Kumar", "MOSPI-INV-301", "Statistical Investigator", "Statistical Investigator", 3, 75.0, 40.0, 50.0);
        createOfficer(demoPasswordHash, roleLearner, nad, "officer.priya@statiq.gov", "Priya Nair", "NAD-DPO-204", "Data Processing Officer", "Data Processing Officer", 5, 45.0, 70.0, 80.0);
        createOfficer(demoPasswordHash, roleLearner, esd, "officer.vikram@statiq.gov", "Vikram Rathore", "ESD-GIS-105", "GIS Analyst", "GIS Analyst", 4, 30.0, 85.0, 60.0);
        createOfficer(demoPasswordHash, roleLearner, des, "officer.meera@statiq.gov", "Meera Kulkarni", "DES-DQ-402", "Data Quality Officer", "Data Quality Officer", 6, 60.0, 55.0, 75.0);
        createOfficer(demoPasswordHash, roleLearner, nsso, "officer.sanjay@statiq.gov", "Sanjay Mehta", "NSSO-SRV-509", "Survey Officer", "Survey Officer", 7, 80.0, 35.0, 45.0);
        createOfficer(demoPasswordHash, roleLearner, nad, "officer.neha@statiq.gov", "Neha Gupta", "NAD-DS-612", "Data Scientist", "Data Scientist", 2, 85.0, 75.0, 90.0);
        createOfficer(demoPasswordHash, roleLearner, esd, "officer.rahul@statiq.gov", "Rahul Verma", "ESD-STAT-718", "Statistical Analyst", "Statistical Analyst", 4, 40.0, 50.0, 55.0);

        // Seed initial recommendations and enrollment for learner
        seedInitialRecommendationsAndPath(learnerProfile);

        logger.info("StatIQ demo seed initialization completed successfully.");
    }

    private void createOfficer(String passwordHash, Role role, Department dept, String email, String name, String empId, String designation, String jobRole, int exp, double aiml, double python, double sql) {
        User u = getOrCreateUser(email, name, passwordHash, Set.of(role));
        LearnerProfile p = learnerProfileRepository.findByUser(u).orElseGet(() -> {
            LearnerProfile lp = new LearnerProfile();
            lp.setUser(u);
            lp.setEmployeeId(empId);
            lp.setDepartment(dept);
            lp.setDesignation(designation);
            lp.setJobRole(jobRole);
            lp.setYearsOfExperience(exp);
            return learnerProfileRepository.save(lp);
        });
        seedLearnerCompetency(p, "TECH-AIM", aiml, "ASSESSED");
        seedLearnerCompetency(p, "TECH-PYT", python, "ASSESSED");
        seedLearnerCompetency(p, "TECH-SQL", sql, "ASSESSED");
    }

    private void seedLearnerCompetency(LearnerProfile profile, String competencyCode, double score, String confidence) {
        competencyRepository.findByCode(competencyCode).ifPresent(comp -> {
            LearnerCompetency lc = learnerCompetencyRepository.findByLearnerProfileAndCompetency(profile, comp)
                    .orElse(new LearnerCompetency(profile, comp, score, confidence));
            lc.setScore(score);
            lc.setConfidenceLevel(confidence);
            learnerCompetencyRepository.save(lc);
        });
    }

    private void seedInitialRecommendationsAndPath(LearnerProfile profile) {
        // Find course 2 (AI/ML)
        courseRepository.findByCourseCode("iGOT-AI-201").ifPresent(courseAi -> {
            competencyRepository.findByCode("TECH-AIM").ifPresent(comp -> {
                if (recommendationRepository.findByLearnerProfileAndCourse(profile, courseAi).isEmpty()) {
                    recommendationRepository.save(new Recommendation(
                            profile,
                            courseAi,
                            comp,
                            "Your current AI/ML competency is 35 while the recommended level for your role is 75.",
                            PriorityLevel.HIGH,
                            "Attain operational proficiency in applying anomaly detection and predictive models to official microdata."
                    ));
                }
            });

            // Initial Enrollment
            if (enrollmentRepository.findByLearnerProfileAndCourse(profile, courseAi).isEmpty()) {
                Enrollment enrollment = new Enrollment(profile, courseAi);
                enrollment.setProgressPercent(25);
                enrollment.setStatus(EnrollmentStatus.IN_PROGRESS);
                enrollmentRepository.save(enrollment);
            }
        });

        // Find course 1 (Python)
        courseRepository.findByCourseCode("iGOT-STAT-101").ifPresent(coursePy -> {
            competencyRepository.findByCode("TECH-PYT").ifPresent(comp -> {
                if (recommendationRepository.findByLearnerProfileAndCourse(profile, coursePy).isEmpty()) {
                    recommendationRepository.save(new Recommendation(
                            profile,
                            coursePy,
                            comp,
                            "Your current Python competency is 48 while the recommended level for your role is 80.",
                            PriorityLevel.HIGH,
                            "Automate statistical estimation routines and eliminate spreadsheet errors."
                    ));
                }
            });
        });

        // Find course 3 (GIS)
        courseRepository.findByCourseCode("iGOT-GIS-301").ifPresent(courseGis -> {
            competencyRepository.findByCode("TECH-GIS").ifPresent(comp -> {
                if (recommendationRepository.findByLearnerProfileAndCourse(profile, courseGis).isEmpty()) {
                    recommendationRepository.save(new Recommendation(
                            profile,
                            courseGis,
                            comp,
                            "Your current GIS competency is 30 while the recommended level for your role is 70.",
                            PriorityLevel.MEDIUM,
                            "Master thematic mapping and spatial clustering for district level indicators."
                    ));
                }
            });
        });

        // Create Learning Path if not exists
        if (learningPathRepository.findByLearnerProfileOrderByCreatedAtDesc(profile).isEmpty()) {
            LearningPath path = new LearningPath();
            path.setLearnerProfile(profile);
            path.setTitle("AI-Enabled Statistical Analyst Transformation Roadmap");
            path.setDescription("Tailored capability upskilling roadmap designed to bridge high-impact competency gaps in Machine Learning, Python scripting, and Geospatial Analytics.");
            path.setTargetRole("Statistical Analyst");
            path.setTotalEstimatedHours(74);

            LearningPath savedPath = learningPathRepository.save(path);

            int seq = 1;
            for (String code : List.of("iGOT-STAT-101", "iGOT-AI-201", "iGOT-GIS-301", "iGOT-TECH-501")) {
                Optional<Course> cOpt = courseRepository.findByCourseCode(code);
                if (cOpt.isPresent()) {
                    learningPathItemRepository.save(new LearningPathItem(
                            savedPath,
                            cOpt.get(),
                            seq++,
                            seq == 2 ? "IN_PROGRESS" : "NOT_STARTED"
                    ));
                }
            }
        }
    }

    private Role getOrCreateRole(RoleName name) {
        return roleRepository.findByName(name).orElseGet(() -> roleRepository.save(new Role(name)));
    }

    private User getOrCreateUser(String email, String fullName, String passwordHash, Set<Role> roles) {
        return userRepository.findByEmail(email).map(existing -> {
            existing.setPassword(passwordHash);
            existing.setRoles(roles);
            return userRepository.save(existing);
        }).orElseGet(() -> {
            User user = new User(email, passwordHash, fullName);
            user.setRoles(roles);
            return userRepository.save(user);
        });
    }
}
