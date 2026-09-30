-- V1__schema.sql: Initial PostgreSQL schema for StatIQ Platform

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS learner_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department_id INT REFERENCES departments(id),
    designation VARCHAR(150) NOT NULL,
    job_role VARCHAR(150) NOT NULL,
    educational_qualification VARCHAR(255),
    years_of_experience INT DEFAULT 0,
    current_assignment TEXT,
    previous_training TEXT,
    career_interests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS competencies (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS learner_competencies (
    id BIGSERIAL PRIMARY KEY,
    learner_profile_id BIGINT NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    competency_id INT NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    confidence_level VARCHAR(50) DEFAULT 'INITIAL',
    last_assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_learner_competency UNIQUE (learner_profile_id, competency_id)
);

CREATE TABLE IF NOT EXISTS competency_requirements (
    id SERIAL PRIMARY KEY,
    job_role VARCHAR(150) NOT NULL,
    department_id INT REFERENCES departments(id),
    competency_id INT NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    required_level NUMERIC(5,2) NOT NULL,
    importance_weight NUMERIC(3,2) DEFAULT 1.0,
    CONSTRAINT uq_role_competency UNIQUE (job_role, competency_id)
);

CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    provider VARCHAR(150) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    duration_hours INT NOT NULL,
    category VARCHAR(100),
    language VARCHAR(50) DEFAULT 'English',
    external_url VARCHAR(500),
    is_igot_course BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS course_competencies (
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    competency_id INT NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    uplift_score NUMERIC(5,2) DEFAULT 15.00,
    PRIMARY KEY (course_id, competency_id)
);

CREATE TABLE IF NOT EXISTS enrollments (
    id BIGSERIAL PRIMARY KEY,
    learner_profile_id BIGINT NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'ENROLLED',
    progress_percent INT DEFAULT 0,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT uq_learner_course UNIQUE (learner_profile_id, course_id)
);

CREATE TABLE IF NOT EXISTS learning_progress (
    id BIGSERIAL PRIMARY KEY,
    enrollment_id BIGINT NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    module_name VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS learning_paths (
    id BIGSERIAL PRIMARY KEY,
    learner_profile_id BIGINT NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_role VARCHAR(150) NOT NULL,
    total_estimated_hours INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS learning_path_items (
    id BIGSERIAL PRIMARY KEY,
    learning_path_id BIGINT NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    sequence_order INT NOT NULL,
    status VARCHAR(50) DEFAULT 'NOT_STARTED'
);

CREATE TABLE IF NOT EXISTS uploaded_materials (
    id BIGSERIAL PRIMARY KEY,
    uploader_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    extracted_text TEXT,
    cleaned_text TEXT,
    status VARCHAR(50) DEFAULT 'PROCESSED',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessments (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    creator_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    source_material_id BIGINT REFERENCES uploaded_materials(id) ON DELETE SET NULL,
    target_competency_id INT REFERENCES competencies(id) ON DELETE SET NULL,
    difficulty VARCHAR(50) DEFAULT 'MEDIUM',
    passing_score NUMERIC(5,2) DEFAULT 60.00,
    time_limit_minutes INT DEFAULT 20,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id BIGSERIAL PRIMARY KEY,
    assessment_id BIGINT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer VARCHAR(5) NOT NULL,
    explanation TEXT,
    difficulty VARCHAR(50) DEFAULT 'MEDIUM',
    topic VARCHAR(150),
    source_reference VARCHAR(255),
    sequence_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id BIGSERIAL PRIMARY KEY,
    assessment_id BIGINT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    learner_profile_id BIGINT NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    accuracy_percent NUMERIC(5,2) NOT NULL,
    time_spent_seconds INT DEFAULT 0,
    ai_feedback TEXT,
    strengths TEXT,
    weaknesses TEXT,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_answers (
    id BIGSERIAL PRIMARY KEY,
    quiz_attempt_id BIGINT NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_answer VARCHAR(5) NOT NULL,
    is_correct BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS recommendations (
    id BIGSERIAL PRIMARY KEY,
    learner_profile_id BIGINT NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    competency_id INT REFERENCES competencies(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'MEDIUM',
    expected_outcome TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_learner_profiles_user ON learner_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_learner_comp_learner ON learner_competencies(learner_profile_id);
CREATE INDEX IF NOT EXISTS idx_comp_req_role ON competency_requirements(job_role);
CREATE INDEX IF NOT EXISTS idx_enrollments_learner ON enrollments(learner_profile_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_learner ON recommendations(learner_profile_id);
CREATE INDEX IF NOT EXISTS idx_questions_assessment ON questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_learner ON quiz_attempts(learner_profile_id);
