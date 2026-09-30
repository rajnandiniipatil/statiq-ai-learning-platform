# StatIQ REST API Specification

## 1. Authentication
* `POST /api/auth/register` - Register a new official (returns JWT token and profile)
* `POST /api/auth/login` - Authenticate with email/password (returns JWT and user claims)
* `GET /api/auth/me` - Retrieve current session details and assigned roles

## 2. Competencies & Skill Gaps
* `GET /api/competencies` - List all canonical statistical competencies across domains
* `GET /api/competencies/me` - Fetch verified competency scores for logged-in learner
* `GET /api/competencies/gaps` - Calculate dynamic skill gaps against assigned job role benchmark
* `POST /api/competencies/assessment` - Submit self/diagnostic evaluation to baseline competencies

## 3. Recommendations & Learning Paths
* `GET /api/recommendations` - Retrieve personalized course and micro-learning recommendations
* `POST /api/recommendations/generate` - Trigger real-time recalculation of recommendations
* `GET /api/learning-path` - Retrieve personalized sequential learning roadmap
* `POST /api/learning-path/generate` - Generate learning roadmap tailored to current critical gaps
* `GET /api/learning/progress` - Fetch learning milestone completion rates

## 4. iGOT Karmayogi Ecosystem Integration (Sandbox)
* `GET /api/igot/courses` - Fetch simulated iGOT courses with filtering
* `GET /api/igot/courses/{id}` - Fetch course syllabus and metadata
* `GET /api/igot/search?q={query}` - Search iGOT catalog
* `POST /api/igot/enroll` - Enroll learner in course
* `GET /api/igot/progress` - Check enrollment status and completion progress

## 5. Material Ingestion & AI Question Generation
* `POST /api/materials/upload` - Upload PDF/DOCX/PPTX/TXT learning material (multipart)
* `POST /api/ai/generate-mcq` - Generate structured MCQs from ingested document chunks
* `POST /api/ai/generate-quiz` - Generate full quiz with customizable difficulty & question counts
* `POST /api/ai/assistant` - Domain-specific AI conversational assistant for statistical officers

## 6. Assessments & Evaluation Feedback Loop
* `POST /api/assessments` - Create or publish assessment (Trainer only)
* `GET /api/assessments` - List available assessments
* `GET /api/assessments/{id}` - Get assessment details and questions
* `POST /api/assessments/{id}/attempt` - Submit answers for automatic grading and AI feedback
* `GET /api/assessments/{id}/results` - Review diagnostic performance, strengths, and updated scores

## 7. Workforce Administration & Analytics
* `GET /api/admin/dashboard` - High-level metrics for ministry executives
* `GET /api/admin/competencies` - Ministry-wide competency distribution
* `GET /api/admin/skill-gaps` - Aggregate critical and significant gaps across cadres
* `GET /api/admin/departments` - Departmental comparative analytics (NSSO, NAD, ESD, etc.)
* `GET /api/admin/training-analytics` - Course utilization and training completion ratios
