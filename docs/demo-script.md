# StatIQ Hackathon Jury Demo Script

## Duration: 5-7 Minutes Presentation

### Stage 1: The Government Officer Problem (1 min)
* Open the landing page (`http://localhost:5173/login`).
* Explain the challenge for Ministry of Statistics & Programme Implementation (MoSPI): 10,000+ officers across NSSO and State Directorates needing urgent upskilling in AI, GIS, modern sampling, and digital governance.
* Log in as **Learner** (`learner@statiq.gov` / `Statiq@2025`).

### Stage 2: Competency Profile & Skill Gap Analysis (1.5 mins)
* Land on the **Learner Dashboard**:
  * Highlight the radar chart comparing the officer's current verified competencies against the benchmark required for a **Statistical Analyst**.
  * Navigate to **Skill Gaps**: Show the categorization (Critical Gap in AI/ML, Significant Gap in GIS & Python, Strong in Survey Design).
* Click on **Personalized Recommendations**:
  * Show how recommendations are prioritized based on gap magnitude.
  * Switch to **iGOT Course Discovery**: Point out the *"iGOT Integration — Prototype / Sandbox"* banner and explain how the `MockIGotCourseProvider` simulates official courses without fabricating government API access.
  * Click **Enroll in Course** ("Machine Learning Fundamentals for Official Statistics").
  * Show the updated **Personalized Learning Path** roadmap.

### Stage 3: Trainer Document Ingestion & AI Question Generation (2 mins)
* Log out and log in as **Trainer** (`trainer@statiq.gov` / `Statiq@2025`).
* Navigate to **Materials Upload**:
  * Upload a sample NSSO Survey Manual document.
* Go to **Question Generator Studio**:
  * Select the uploaded document, choose 10 questions with "Mixed" difficulty.
  * Click **Generate MCQs**: Observe the AI extract concepts, synthesize 4 options, designate correct answers, Bloom's Taxonomy ratings, and detailed pedagogical explanations.
  * Demonstrate inline editing of a question and click **Publish Assessment**.

### Stage 4: Closed-Loop Evaluation & Dynamic Competency Update (1.5 mins)
* Log back in as **Learner** (`learner@statiq.gov`).
* Navigate to **Assessments / Quizzes** and open the newly generated quiz.
* Walk through the timed quiz interface, answer questions, and submit.
* Display the **Instant Results & AI Diagnostic Feedback**:
  * Note the score and strengths/weaknesses breakdown.
  * Show the **Continuous Feedback Loop in Action**:
    * AI/ML competency score dynamically updates from 35 to an updated level.
    * The skill gap reduces.
    * New advanced recommendations appear on the dashboard!

### Stage 5: Executive Administration & Workforce Health (1 min)
* Log in as **Admin** (`admin@statiq.gov` / `Statiq@2025`).
* Review the **Ministry Workforce Dashboard**:
  * Enterprise skill health index, division-by-division competency comparisons (NSSO vs NAD vs ESD), training completion metrics, and emerging skill demands.
