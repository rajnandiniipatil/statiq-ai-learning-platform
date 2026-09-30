-- V2__seed_data.sql: Baseline Seed Data for StatIQ Platform

-- 1. Roles
INSERT INTO roles (id, name) VALUES 
(1, 'ROLE_LEARNER'),
(2, 'ROLE_TRAINER'),
(3, 'ROLE_ADMIN')
ON CONFLICT (id) DO NOTHING;

-- 2. Departments
INSERT INTO departments (id, code, name, description) VALUES
(1, 'NSSO-SED', 'National Sample Survey Office - Socio-Economic Division', 'Conducts nation-wide multi-subject socio-economic surveys across rural and urban India.'),
(2, 'NAD', 'National Accounts Division (MoSPI)', 'Responsible for estimation of National Income, GDP, Capital Formation, and Supply-Use Tables.'),
(3, 'ESD', 'Economic Statistics Division', 'Compiles Index of Industrial Production (IIP), Consumer Price Indices (CPI), and Energy Statistics.'),
(4, 'DES-MH', 'Directorate of Economics and Statistics (State DES)', 'Coordinates statistical activities and decentralized district level data compilation.')
ON CONFLICT (id) DO NOTHING;

-- 3. Competencies (32 official competencies across 4 domains)
INSERT INTO competencies (id, code, name, category, description) VALUES
-- Statistical Domain
(1, 'STAT-SRV', 'Survey Design', 'STATISTICAL', 'Questionnaire formulation, stratification design, and survey workflow optimization.'),
(2, 'STAT-SMP', 'Sampling', 'STATISTICAL', 'Probability sampling, multi-stage cluster sampling, and weighting techniques.'),
(3, 'STAT-NAC', 'National Accounts', 'STATISTICAL', 'System of National Accounts (SNA), GDP compilation, and Input-Output modeling.'),
(4, 'STAT-PRC', 'Price Statistics', 'STATISTICAL', 'Consumer Price Index (CPI), Wholesale Price Index (WPI), and Laspeyres/Paasche indices.'),
(5, 'STAT-LBR', 'Labour Statistics', 'STATISTICAL', 'Periodic Labour Force Survey (PLFS) metrics, WPR, LFPR, and unemployment estimation.'),
(6, 'STAT-AGR', 'Agricultural Statistics', 'STATISTICAL', 'Crop cutting experiments, land use statistics, and agricultural census methodologies.'),
(7, 'STAT-IND', 'Industrial Statistics', 'STATISTICAL', 'Annual Survey of Industries (ASI), IIP index calculation, and NIC classifications.'),
(8, 'STAT-SDG', 'SDG Indicators', 'STATISTICAL', 'National Indicator Framework (NIF) tracking for UN Sustainable Development Goals.'),
(9, 'STAT-MET', 'Metadata Standards', 'STATISTICAL', 'Data Documentation Initiative (DDI) and SDMX statistical data and metadata exchange.'),
(10, 'STAT-DQF', 'Data Quality Frameworks', 'STATISTICAL', 'National Data Sharing & Accessibility Policy (NDSAP) and data validation protocols.'),

-- Technical Domain
(11, 'TECH-PYT', 'Python', 'TECHNICAL', 'Core Python scripting, Pandas, NumPy, and statistical data pipelines.'),
(12, 'TECH-RST', 'R', 'TECHNICAL', 'R programming, Tidyverse, ggplot2, and econometric modeling.'),
(13, 'TECH-SQL', 'SQL', 'TECHNICAL', 'Relational database querying, aggregations, window functions, and indexing.'),
(14, 'TECH-STA', 'Stata', 'TECHNICAL', 'Econometric modeling, panel data regression, and survey microdata processing.'),
(15, 'TECH-SPS', 'SPSS', 'TECHNICAL', 'Descriptive analysis, ANOVA, factor analysis, and cross-tabulation in SPSS.'),
(16, 'TECH-SAS', 'SAS', 'TECHNICAL', 'Statistical analysis system macros, enterprise guide, and large scale tabulation.'),
(17, 'TECH-GIS', 'GIS', 'TECHNICAL', 'QGIS, ArcGIS, thematic mapping, spatial join, and census boundary analysis.'),
(18, 'TECH-VIS', 'Data Visualization', 'TECHNICAL', 'Dashboarding, PowerBI, interactive visualizations, and storytelling with data.'),
(19, 'TECH-AIM', 'AI/ML', 'TECHNICAL', 'Machine learning algorithms, classification, clustering, NLP, and LLM applications.'),
(20, 'TECH-CLD', 'Cloud Computing', 'TECHNICAL', 'Government Community Cloud (MeghRaj), object storage, and scalable analytics.'),
(21, 'TECH-API', 'APIs', 'TECHNICAL', 'RESTful API consumption, OpenAPI specifications, and microservices integration.'),
(22, 'TECH-OPD', 'Open Data', 'TECHNICAL', 'Data dissemination portals, open data APIs, and public data release standards.'),

-- Digital Governance
(23, 'GOV-CYB', 'Cybersecurity', 'DIGITAL_GOVERNANCE', 'Information security, endpoint protection, and CERT-In compliance for public data.'),
(24, 'GOV-PRV', 'Data Privacy', 'DIGITAL_GOVERNANCE', 'Digital Personal Data Protection (DPDP) Act, anonymization, and differential privacy.'),
(25, 'GOV-DSG', 'Digital Signatures', 'DIGITAL_GOVERNANCE', 'e-Sign, PKI infrastructure, and legal compliance in digital record management.'),
(26, 'GOV-GCC', 'Government Cloud', 'DIGITAL_GOVERNANCE', 'MeghRaj guidelines, SLA management, and security audits for state data centres.'),
(27, 'GOV-DPI', 'Digital Public Infrastructure', 'DIGITAL_GOVERNANCE', 'Aadhaar, UPI, DigiLocker, and integration with India Stack ecosystems.'),

-- Behavioural and Managerial
(28, 'MGT-LDR', 'Leadership', 'MANAGERIAL', 'Strategic thinking, team motivation, and organizational change leadership.'),
(29, 'MGT-COM', 'Communication', 'MANAGERIAL', 'Statistical report writing, briefing executive leadership, and media briefings.'),
(30, 'MGT-PRJ', 'Project Management', 'MANAGERIAL', 'Survey milestone scheduling, resource allocation, and field monitoring.'),
(31, 'MGT-ETH', 'Ethics', 'MANAGERIAL', 'Integrity in data reporting, objectivity, and confidentiality of statistical records.'),
(32, 'MGT-DEC', 'Decision Making', 'MANAGERIAL', 'Evidence-based policy formulation and risk assessment in survey operations.')
ON CONFLICT (id) DO NOTHING;

-- 4. Baseline Competency Requirements for Roles
-- Target role: 'Statistical Analyst'
INSERT INTO competency_requirements (job_role, department_id, competency_id, required_level, importance_weight) VALUES
('Statistical Analyst', 1, 1, 80.00, 1.2),  -- Survey Design
('Statistical Analyst', 1, 2, 85.00, 1.3),  -- Sampling
('Statistical Analyst', 1, 3, 70.00, 1.0),  -- National Accounts
('Statistical Analyst', 1, 11, 80.00, 1.4), -- Python
('Statistical Analyst', 1, 13, 75.00, 1.1), -- SQL
('Statistical Analyst', 1, 17, 70.00, 1.0), -- GIS
('Statistical Analyst', 1, 18, 80.00, 1.2), -- Data Visualization
('Statistical Analyst', 1, 19, 75.00, 1.5), -- AI/ML (Required 75)
('Statistical Analyst', 1, 24, 75.00, 1.1), -- Data Privacy
('Statistical Analyst', 1, 29, 70.00, 1.0)  -- Communication
ON CONFLICT (job_role, competency_id) DO NOTHING;

-- Target role: 'Statistical Investigator'
INSERT INTO competency_requirements (job_role, department_id, competency_id, required_level, importance_weight) VALUES
('Statistical Investigator', 1, 1, 85.00, 1.4),
('Statistical Investigator', 1, 2, 80.00, 1.3),
('Statistical Investigator', 1, 10, 80.00, 1.2),
('Statistical Investigator', 1, 13, 60.00, 1.0),
('Statistical Investigator', 1, 31, 85.00, 1.1)
ON CONFLICT (job_role, competency_id) DO NOTHING;

-- Target role: 'Data Scientist'
INSERT INTO competency_requirements (job_role, department_id, competency_id, required_level, importance_weight) VALUES
('Data Scientist', 1, 11, 90.00, 1.5),
('Data Scientist', 1, 12, 80.00, 1.2),
('Data Scientist', 1, 13, 85.00, 1.3),
('Data Scientist', 1, 18, 85.00, 1.2),
('Data Scientist', 1, 19, 90.00, 1.5),
('Data Scientist', 1, 20, 80.00, 1.1)
ON CONFLICT (job_role, competency_id) DO NOTHING;

-- Target role: 'Data Processing Officer'
INSERT INTO competency_requirements (job_role, department_id, competency_id, required_level, importance_weight) VALUES
('Data Processing Officer', 1, 11, 75.00, 1.2),
('Data Processing Officer', 1, 13, 85.00, 1.4),
('Data Processing Officer', 1, 10, 80.00, 1.2),
('Data Processing Officer', 1, 24, 75.00, 1.1)
ON CONFLICT (job_role, competency_id) DO NOTHING;

-- 5. Courses (22 realistic iGOT courses)
INSERT INTO courses (id, course_code, title, description, provider, difficulty, duration_hours, category, language, external_url, is_igot_course) VALUES
(1, 'iGOT-STAT-101', 'Python for Statistical Analysis', 'Hands-on programming with Pandas, NumPy, and statistical estimation for socio-economic survey data.', 'iGOT Karmayogi / NSSTA', 'INTERMEDIATE', 24, 'Technical & Analytics', 'English', 'https://igotkarmayogi.gov.in/course/stat-101', TRUE),
(2, 'iGOT-AI-201', 'Applied Machine Learning for Official Statistics', 'Supervised and unsupervised learning techniques applied to administrative datasets, imputation, and outlier detection.', 'iGOT Karmayogi / MoSPI Digital Wing', 'INTERMEDIATE', 32, 'Artificial Intelligence', 'English', 'https://igotkarmayogi.gov.in/course/ai-201', TRUE),
(3, 'iGOT-GIS-301', 'GIS Mapping & Spatial Analysis for Census & Surveys', 'Thematic cartography, spatial clustering, and QGIS workflows for district and village-level statistical dissemination.', 'iGOT Karmayogi / Survey of India', 'BEGINNER', 18, 'Geospatial Analytics', 'English', 'https://igotkarmayogi.gov.in/course/gis-301', TRUE),
(4, 'iGOT-STAT-102', 'Advanced Sampling Techniques & Weighting Methodologies', 'Stratified sampling, multi-stage cluster sampling, multiplier estimation, and non-sampling error minimization.', 'iGOT Karmayogi / ISI Kolkata', 'ADVANCED', 30, 'Statistical Methodology', 'English', 'https://igotkarmayogi.gov.in/course/stat-102', TRUE),
(5, 'iGOT-ECON-401', 'National Accounts & Supply-Use Tables (SNA 2008)', 'Comprehensive compilation of Gross Value Added (GVA), Gross Fixed Capital Formation, and inter-industry linkages.', 'iGOT Karmayogi / NAD MoSPI', 'ADVANCED', 28, 'Economic Statistics', 'English', 'https://igotkarmayogi.gov.in/course/econ-401', TRUE),
(6, 'iGOT-ECON-402', 'Consumer Price Index (CPI) Compilation Framework', 'Basket weighting, item substitution, geometric mean compilation, and spatial price indices.', 'iGOT Karmayogi / ESD MoSPI', 'INTERMEDIATE', 16, 'Price Statistics', 'English', 'https://igotkarmayogi.gov.in/course/econ-402', TRUE),
(7, 'iGOT-TECH-501', 'Modern Data Visualization & Storytelling for Public Policy', 'Building intuitive charts, dashboards, and visual executive briefs using modern visual design guidelines.', 'iGOT Karmayogi / NITI Aayog', 'BEGINNER', 14, 'Data Visualization', 'English', 'https://igotkarmayogi.gov.in/course/tech-501', TRUE),
(8, 'iGOT-TECH-502', 'SQL for Large-Scale Survey Microdata', 'Querying millions of survey records, multi-table joins, subqueries, and analytical window functions.', 'iGOT Karmayogi / NIC', 'INTERMEDIATE', 20, 'Database Engineering', 'English', 'https://igotkarmayogi.gov.in/course/tech-502', TRUE),
(9, 'iGOT-STAT-103', 'Econometric Analysis and Time Series Forecasting in R', 'ARIMA, cointegration, seasonal adjustments, and macroeconomic indicators estimation.', 'iGOT Karmayogi / Reserve Bank of India Academy', 'ADVANCED', 26, 'Statistical Methodology', 'English', 'https://igotkarmayogi.gov.in/course/stat-103', TRUE),
(10, 'iGOT-ECON-403', 'Annual Survey of Industries (ASI) & Index of Industrial Production', 'Factory sector accounting, capital structure analysis, and high-frequency industrial production tracking.', 'iGOT Karmayogi / Industrial Statistics Wing', 'INTERMEDIATE', 22, 'Economic Statistics', 'English', 'https://igotkarmayogi.gov.in/course/econ-403', TRUE),
(11, 'iGOT-STAT-104', 'Agricultural Statistics & Remote Sensing for Crop Estimation', 'Integrating satellite imagery with ground truth crop cutting data for yield estimation.', 'iGOT Karmayogi / Ministry of Agriculture', 'INTERMEDIATE', 20, 'Agricultural Statistics', 'English', 'https://igotkarmayogi.gov.in/course/stat-104', TRUE),
(12, 'iGOT-GOV-601', 'Data Privacy, Anonymization & DPDP Act 2023', 'Protecting respondent privacy, k-anonymity, l-diversity, and legal obligations under Indian data privacy statutes.', 'iGOT Karmayogi / MeitY', 'BEGINNER', 12, 'Digital Governance', 'English', 'https://igotkarmayogi.gov.in/course/gov-601', TRUE),
(13, 'iGOT-GOV-602', 'Cybersecurity Best Practices for Public Data Repositories', 'Data sanitization, privilege separation, CERT-In reporting protocols, and server hardening.', 'iGOT Karmayogi / CERT-In', 'BEGINNER', 15, 'Cybersecurity', 'English', 'https://igotkarmayogi.gov.in/course/gov-602', TRUE),
(14, 'iGOT-GOV-603', 'Digital Public Infrastructure (DPI) & Open API Protocols', 'Integration with Aadhaar, DigiLocker, data exchange standards, and public dissemination APIs.', 'iGOT Karmayogi / India Stack Knowledge Hub', 'INTERMEDIATE', 16, 'Digital Governance', 'English', 'https://igotkarmayogi.gov.in/course/gov-603', TRUE),
(15, 'iGOT-STAT-105', 'Survey Microdata Processing with Stata', 'Survey weights calculation, complex design analysis, and variance estimation using Stata.', 'iGOT Karmayogi / NSSTA', 'INTERMEDIATE', 20, 'Statistical Software', 'English', 'https://igotkarmayogi.gov.in/course/stat-105', TRUE),
(16, 'iGOT-STAT-106', 'SPSS for Social Statistics & Demography', 'Cross-tabulation, hypothesis testing, logistic regression, and census microdata manipulation.', 'iGOT Karmayogi / Office of Registrar General of India', 'BEGINNER', 18, 'Statistical Software', 'English', 'https://igotkarmayogi.gov.in/course/stat-106', TRUE),
(17, 'iGOT-ECON-404', 'Monitoring Sustainable Development Goals (SDG) Indicators', 'Meta-data harmonization, sub-national disaggregation, and voluntary national review (VNR) compilation.', 'iGOT Karmayogi / UN-SIAP & MoSPI', 'INTERMEDIATE', 18, 'Sustainable Development', 'English', 'https://igotkarmayogi.gov.in/course/econ-404', TRUE),
(18, 'iGOT-STAT-107', 'Data Quality Assurance Frameworks for National Statistics', 'Implementing IMF DQAF and UN Fundamental Principles of Official Statistics in field surveys.', 'iGOT Karmayogi / MoSPI Quality Division', 'INTERMEDIATE', 16, 'Quality Assurance', 'English', 'https://igotkarmayogi.gov.in/course/stat-107', TRUE),
(19, 'iGOT-MGT-701', 'Public Sector Leadership & Statistical Management', 'Leading decentralized field survey teams, conflict resolution, and motivational leadership.', 'iGOT Karmayogi / LBSNAA Mussoorie', 'ADVANCED', 24, 'Leadership & Management', 'English', 'https://igotkarmayogi.gov.in/course/mgt-701', TRUE),
(20, 'iGOT-MGT-702', 'Effective Statistical Communication & Data Journalism', 'Translating complex statistical findings into actionable executive briefs and citizen-friendly infographics.', 'iGOT Karmayogi / IIMC New Delhi', 'BEGINNER', 12, 'Communication', 'English', 'https://igotkarmayogi.gov.in/course/mgt-702', TRUE),
(21, 'iGOT-TECH-503', 'Government Cloud & Scalable Big Data Architecture', 'MeghRaj cloud operations, data lakes, distributed computing, and Apache Spark for census-scale workloads.', 'iGOT Karmayogi / NIC Cloud Division', 'ADVANCED', 30, 'Cloud Infrastructure', 'English', 'https://igotkarmayogi.gov.in/course/tech-503', TRUE),
(22, 'iGOT-MGT-703', 'Ethics, Confidentiality & Scientific Integrity in Official Statistics', 'Preserving public trust, preventing political tampering, and adherence to legal statistical codes.', 'iGOT Karmayogi / National Statistical Commission', 'BEGINNER', 10, 'Professional Ethics', 'English', 'https://igotkarmayogi.gov.in/course/mgt-703', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 6. Course Competency Mapping
INSERT INTO course_competencies (course_id, competency_id, uplift_score) VALUES
(1, 11, 25.00), -- Course 1 uplift for Python
(1, 18, 15.00), -- Course 1 uplift for Data Visualization
(2, 19, 30.00), -- Course 2 uplift for AI/ML
(2, 11, 15.00), -- Course 2 uplift for Python
(3, 17, 30.00), -- Course 3 uplift for GIS
(3, 18, 15.00), -- Course 3 uplift for Data Visualization
(4, 2, 25.00),  -- Course 4 uplift for Sampling
(4, 1, 20.00),  -- Course 4 uplift for Survey Design
(5, 3, 30.00),  -- Course 5 uplift for National Accounts
(6, 4, 25.00),  -- Course 6 uplift for Price Statistics
(7, 18, 25.00), -- Course 7 uplift for Data Visualization
(8, 13, 25.00), -- Course 8 uplift for SQL
(9, 12, 25.00), -- Course 9 uplift for R
(10, 7, 25.00), -- Course 10 uplift for Industrial Statistics
(11, 6, 25.00), -- Course 11 uplift for Agricultural Statistics
(12, 24, 30.00),-- Course 12 uplift for Data Privacy
(13, 23, 25.00),-- Course 13 uplift for Cybersecurity
(14, 27, 25.00),-- Course 14 uplift for DPI
(15, 14, 25.00),-- Course 15 uplift for Stata
(16, 15, 25.00),-- Course 16 uplift for SPSS
(17, 8, 25.00), -- Course 17 uplift for SDG Indicators
(18, 10, 25.00),-- Course 18 uplift for Data Quality Frameworks
(19, 28, 20.00),-- Course 19 uplift for Leadership
(20, 29, 20.00),-- Course 20 uplift for Communication
(21, 20, 25.00),-- Course 21 uplift for Cloud Computing
(22, 31, 20.00) -- Course 22 uplift for Ethics
ON CONFLICT (course_id, competency_id) DO NOTHING;

-- 7. Diagnostic Assessment & Pre-seeded Questions
INSERT INTO assessments (id, title, description, creator_id, target_competency_id, difficulty, passing_score, time_limit_minutes, is_published) VALUES
(1, 'AI & Machine Learning in Official Statistics Diagnostic Assessment', 'Evaluates predictive modeling, anomaly detection in microdata, text classification, and algorithmic governance.', NULL, 19, 'MEDIUM', 60.00, 15, TRUE),
(2, 'Survey Sampling & Weighting Methodologies Diagnostic', 'Assesses mastery over multi-stage stratification, selection probabilities, non-response adjustments, and design effects.', NULL, 2, 'INTERMEDIATE', 60.00, 15, TRUE),
(3, 'National Accounts & Price Statistics Evaluation', 'Covers SNA compilation methods, Gross Value Added, deflation techniques, and Consumer Price Index formulations.', NULL, 3, 'ADVANCED', 60.00, 20, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Pre-seed 10 robust questions for Assessment 1 (AI/ML)
INSERT INTO questions (id, assessment_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, sequence_order) VALUES
(1, 1, 'In official statistical microdata cleaning, which unsupervised machine learning technique is most appropriate for isolating multi-dimensional outlier records without labeled error training sets?', 'Linear Discriminant Analysis (LDA)', 'Isolation Forest / Local Outlier Factor', 'Naive Bayes Classifier', 'Supervised Logistic Regression', 'B', 'Isolation Forest and Local Outlier Factor are unsupervised anomaly detection methods that isolate anomalous survey observations efficiently without requiring previously verified labels.', 'MEDIUM', 'Anomaly Detection', 'MoSPI Data Quality Handbook Ch 4', 1),
(2, 1, 'When applying Machine Learning to impute missing values in household socio-economic surveys, why is Multiple Imputation with Chained Equations (MICE) or Random Forest imputation preferred over single mean imputation?', 'Mean imputation artificially deflates variance and distorts standard errors.', 'Mean imputation requires expensive GPU hardware.', 'Mean imputation is strictly prohibited by the UN Statistical Commission.', 'Random Forests can only process numeric columns without categorical variables.', 'A', 'Single mean imputation severely underestimates standard errors and variance in survey data, resulting in false confidence intervals. Multiple imputation restores realistic statistical distribution.', 'EASY', 'Imputation Techniques', 'UN Handbook on Household Surveys', 2),
(3, 1, 'In automated classification of economic activity descriptions into National Industrial Classification (NIC) codes, which NLP approach preserves contextual semantic relationships most effectively?', 'Simple Bag-of-Words with Stopword Removal', 'Pre-trained Transformer embeddings fine-tuned on administrative enterprise descriptions', 'Direct string character matching (Levenshtein Distance)', 'Lexical alphabetical sorting', 'B', 'Contextual transformer embeddings capture semantic nuances and industry phrasing far more accurately than lexical matching or naive frequency counts.', 'MEDIUM', 'NLP & Text Classification', 'NSSO Industrial Classification Manual', 3),
(4, 1, 'What is the primary risk of using an overfitted Machine Learning model when forecasting district-level agricultural crop yields from satellite telemetry data?', 'The model fails to generalize to unexpected climatic anomalies in subsequent agricultural seasons.', 'The model produces results that are too interpretable by policy makers.', 'The compute time drops to near zero.', 'The satellite imagery file size is multiplied exponentially.', 'A', 'Overfitted models memorize specific local noise rather than true vegetative patterns, causing drastic errors when confronted with novel weather conditions.', 'EASY', 'Model Generalization', 'Agricultural Statistics Bulletin 2024', 4),
(5, 1, 'Under the principles of Official Statistics, when deploying AI algorithms for official indicator estimation, what requirement is paramount to maintain public trust?', 'Algorithmic transparency, reproducible documentation, and explainability.', 'Proprietary closed-source code to prevent external scrutiny.', 'Exclusively utilizing deep neural networks regardless of complexity.', 'Publishing estimates without releasing methodology notes.', 'A', 'The UN Fundamental Principles of Official Statistics mandate that methodologies must be strictly transparent, reproducible, and verifiable by the scientific community.', 'EASY', 'AI Governance & Ethics', 'UN Fundamental Principles of Official Statistics', 5),
(6, 1, 'Which metric is most appropriate for evaluating a binary classification model designed to detect fraudulent enterprise registrations when the positive class (fraud) is present in less than 0.5% of records?', 'Raw Accuracy', 'Area Under the Precision-Recall Curve (PR-AUC) / F1-Score', 'Mean Squared Error', 'Adjusted R-Squared', 'B', 'When classes are severely imbalanced, raw accuracy is deceptive (e.g. 99.5% accuracy by simply predicting no fraud). Precision-Recall AUC accurately reflects performance on the minority class.', 'MEDIUM', 'Model Evaluation', 'MoSPI Corporate Data Analytics Paper', 6),
(7, 1, 'In high-dimensional survey microdata, what is the key advantage of Principal Component Analysis (PCA) prior to clustering socio-economic strata?', 'It reduces dimensionality while preserving maximum variance among correlated variables.', 'It guarantees that all transformed variables are strictly positive integers.', 'It eliminates all outliers automatically.', 'It converts categorical strings into natural language summaries.', 'A', 'PCA projects high-dimensional correlated survey attributes onto orthogonal axes, maximizing captured variance while simplifying downstream clustering.', 'MEDIUM', 'Dimensionality Reduction', 'ISI Survey Methods Vol 12', 7),
(8, 1, 'What technique can be utilized to prevent demographic bias from distorting AI-driven socio-economic eligibility scoring across sub-populations?', 'Adversarial debiasing and demographic parity fairness constraints during training.', 'Removing all demographic variables while leaving correlated proxies intact.', 'Artificially scaling all output probabilities to 1.0.', 'Restricting data collection to urban centres only.', 'A', 'Fairness constraints and adversarial debiasing actively penalize disparate impact across sensitive protected attributes without compromising overall predictive utility.', 'ADVANCED', 'Fairness & Debiasing', 'Digital Governance Guidelines 2024', 8),
(9, 1, 'When training a gradient boosting model (e.g., XGBoost, LightGBM) on tabular survey data, which parameter directly controls the tree complexity to prevent overfitting?', 'max_depth / min_child_weight', 'learning_rate alone with unlimited depth', 'random_state set to zero', 'n_jobs set to maximum cores', 'A', 'Limiting maximum tree depth (max_depth) and requiring minimum sample weights in leaves (min_child_weight) restricts tree depth and directly combats overfitting in gradient boosted trees.', 'MEDIUM', 'Hyperparameter Tuning', 'Statistical Machine Learning Notes', 9),
(10, 1, 'What is the role of SHAP (SHapley Additive exPlanations) values in deploying machine learning models within government policy analysis?', 'Providing mathematically grounded local and global feature attribution for model predictions.', 'Encrypting datasets with quantum-safe cryptographic hashes.', 'Accelerating data ingestion from PostgreSQL databases.', 'Automating questionnaire printing workflows.', 'A', 'SHAP values, derived from cooperative game theory, explain exactly how much each survey attribute contributed to the model output for individual policy beneficiaries.', 'ADVANCED', 'Model Explainability (XAI)', 'MoSPI XAI Framework Document', 10)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence counters for PostgreSQL
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('departments_id_seq', (SELECT MAX(id) FROM departments));
SELECT setval('competencies_id_seq', (SELECT MAX(id) FROM competencies));
SELECT setval('competency_requirements_id_seq', (SELECT MAX(id) FROM competency_requirements));
SELECT setval('courses_id_seq', (SELECT MAX(id) FROM courses));
SELECT setval('assessments_id_seq', (SELECT MAX(id) FROM assessments));
SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions));
