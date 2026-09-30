import {
  UserProfile,
  Competency,
  LearnerCompetency,
  SkillGap,
  SkillGapSummary,
  IGotCourse,
  Recommendation,
  LearningPath,
  LearningProgressSummary,
  UploadedMaterial,
  Assessment,
  Question,
  QuizResult,
  AdminDashboardData,
  DepartmentAnalytics,
  CompetencyAnalytics,
  TrainingAnalytics
} from '../types';

export const MOCK_USER_LEARNER: UserProfile = {
  userId: 1,
  email: 'learner@statiq.gov',
  fullName: 'Rajnandini Patil',
  roles: ['ROLE_LEARNER'],
  profileId: 1,
  employeeId: 'STAT-IND-2024-042',
  departmentId: 1,
  departmentName: 'National Sample Survey Office (NSSO)',
  departmentCode: 'NSSO',
  designation: 'Statistical Analyst',
  jobRole: 'Statistical Analyst',
  educationalQualification: 'M.Sc. Statistics (Gold Medalist), ISI Kolkata',
  yearsOfExperience: 4,
  currentAssignment: 'Household Consumer Expenditure Survey & PLFS Microdata Auditing',
  previousTraining: 'Official Statistical Systems Orientation (NSSTA 2022)',
  careerInterests: 'Bayesian Spatial Modeling, AI/ML in Official Statistics, High-Frequency Price Indexing'
};

export const MOCK_USER_TRAINER: UserProfile = {
  userId: 2,
  email: 'trainer@statiq.gov',
  fullName: 'Dr. Rameshwar Sharma',
  roles: ['ROLE_TRAINER'],
  profileId: 2,
  employeeId: 'NSSTA-FAC-019',
  departmentId: 1,
  departmentName: 'National Statistical Systems Training Academy (NSSTA)',
  departmentCode: 'NSSTA',
  designation: 'Senior Faculty & Training Director',
  jobRole: 'Senior Training Faculty',
  educationalQualification: 'Ph.D. Econometrics, Delhi School of Economics',
  yearsOfExperience: 16,
  currentAssignment: 'Capacity Building & Curriculum Design for Indian Statistical Service (ISS)',
  previousTraining: 'UNSD / UN-ESCAP Advanced Statistical Training of Trainers',
  careerInterests: 'Pedagogical Innovation, AI Question Synthesis, Automated Competency Mapping'
};

export const MOCK_USER_ADMIN: UserProfile = {
  userId: 3,
  email: 'admin@statiq.gov',
  fullName: 'Smt. Ananya Sen, ISS',
  roles: ['ROLE_ADMIN'],
  profileId: 3,
  employeeId: 'MOSPI-HQ-001',
  departmentId: 1,
  departmentName: 'Ministry of Statistics & Programme Implementation (MoSPI HQ)',
  departmentCode: 'MoSPI',
  designation: 'Director General (Workforce & Training)',
  jobRole: 'Cadre Administrator',
  educationalQualification: 'M.Stat, Indian Statistical Institute',
  yearsOfExperience: 22,
  currentAssignment: 'National Statistical Workforce Modernization & Mission Karmayogi Alignment',
  previousTraining: 'Executive Leadership in Digital Public Infrastructure',
  careerInterests: 'Enterprise Capacity Intelligence, Cadre Readiness, Statistical Governance'
};

export const MOCK_COMPETENCIES: Competency[] = [
  { id: 1, code: 'STAT-SMP', name: 'Sampling Theory & Survey Design', category: 'STATISTICAL', categoryLabel: 'Statistical Core', description: 'Design of multistage stratified sampling, frame construction, probability proportional to size (PPS), and sampling error estimation.' },
  { id: 2, code: 'STAT-NAC', name: 'National Accounts & GDP Compilation', category: 'STATISTICAL', categoryLabel: 'Statistical Core', description: 'System of National Accounts (SNA 2008), gross value added (GVA) compilation, supply-use tables, and input-output transactions.' },
  { id: 3, code: 'STAT-PRI', name: 'Price Statistics (CPI / WPI)', category: 'STATISTICAL', categoryLabel: 'Statistical Core', description: 'Compilation of Consumer Price Index (CPI), Wholesale Price Index (WPI), Laspeyres basket weighting, and geometric mean aggregation.' },
  { id: 4, code: 'STAT-LAB', name: 'Labour & Employment Statistics', category: 'STATISTICAL', categoryLabel: 'Statistical Core', description: 'Periodic Labour Force Survey (PLFS) concepts: Usual Status (ps+ss), Current Weekly Status (CWS), Worker Population Ratio, and LFPR.' },
  { id: 5, code: 'TECH-PYT', name: 'Python for Statistical Analytics', category: 'TECHNICAL', categoryLabel: 'Technical & Data Science', description: 'Data wrangling with Pandas/NumPy, survey weight re-scaling, automated imputation algorithms, and statistical tests.' },
  { id: 6, code: 'TECH-AIM', name: 'AI & Machine Learning for Official Statistics', category: 'TECHNICAL', categoryLabel: 'Technical & Data Science', description: 'Supervised predictive classification, satellite night-light economic estimation, text mining for occupation classification, and anomaly detection.' },
  { id: 7, code: 'TECH-GIS', name: 'GIS & Spatial Data Analysis', category: 'TECHNICAL', categoryLabel: 'Technical & Data Science', description: 'Geospatial mapping of enumeration blocks, QGIS integration, shapefile spatial joins, and thematic cartographic dissemination.' },
  { id: 8, code: 'TECH-SQL', name: 'SQL & Relational Databases', category: 'TECHNICAL', categoryLabel: 'Technical & Data Science', description: 'Relational data modeling, window functions, query optimization for multi-million microdata records, and automated ETL.' },
  { id: 9, code: 'GOV-DPD', name: 'Data Privacy & DPDP Act 2023', category: 'DIGITAL_GOVERNANCE', categoryLabel: 'Digital Governance', description: 'Compliance with India’s Digital Personal Data Protection Act, differential privacy, k-anonymity for public microdata, and audit logs.' },
  { id: 10, code: 'GOV-CSY', name: 'Cybersecurity for Official Statistics', category: 'DIGITAL_GOVERNANCE', categoryLabel: 'Digital Governance', description: 'Government Community Cloud protocols, cryptographic integrity verification, air-gapped data repositories, and threat mitigation.' },
  { id: 11, code: 'MGT-ETH', name: 'Statistical Ethics & Fundamental Principles', category: 'MANAGERIAL', categoryLabel: 'Behavioural & Leadership', description: 'UN Fundamental Principles of Official Statistics, professional impartiality, transparent methodology documentation, and conflict of interest.' },
  { id: 12, code: 'MGT-COM', name: 'Data Storytelling & Public Communication', category: 'MANAGERIAL', categoryLabel: 'Behavioural & Leadership', description: 'Evidence synthesis for policymakers, infographic design, press release drafting, and countering data misinformation.' }
];

export const MOCK_LEARNER_COMPETENCIES: LearnerCompetency[] = [
  { id: 1, competencyId: 1, competencyCode: 'STAT-SMP', competencyName: 'Sampling Theory & Survey Design', category: 'STATISTICAL', score: 82, confidenceLevel: 'HIGH', lastAssessedAt: '2026-09-25T10:00:00Z' },
  { id: 2, competencyId: 2, competencyCode: 'STAT-NAC', competencyName: 'National Accounts & GDP Compilation', category: 'STATISTICAL', score: 68, confidenceLevel: 'MEDIUM', lastAssessedAt: '2026-09-20T14:30:00Z' },
  { id: 3, competencyId: 3, competencyCode: 'STAT-PRI', competencyName: 'Price Statistics (CPI / WPI)', category: 'STATISTICAL', score: 72, confidenceLevel: 'MEDIUM', lastAssessedAt: '2026-09-18T09:15:00Z' },
  { id: 4, competencyId: 4, competencyCode: 'STAT-LAB', competencyName: 'Labour & Employment Statistics', category: 'STATISTICAL', score: 88, confidenceLevel: 'HIGH', lastAssessedAt: '2026-09-28T16:00:00Z' },
  { id: 5, competencyId: 5, competencyCode: 'TECH-PYT', competencyName: 'Python for Statistical Analytics', category: 'TECHNICAL', score: 48, confidenceLevel: 'LOW', lastAssessedAt: '2026-09-15T11:00:00Z' },
  { id: 6, competencyId: 6, competencyCode: 'TECH-AIM', competencyName: 'AI & Machine Learning for Official Statistics', category: 'TECHNICAL', score: 35, confidenceLevel: 'LOW', lastAssessedAt: '2026-09-10T08:45:00Z' },
  { id: 7, competencyId: 7, competencyCode: 'TECH-GIS', competencyName: 'GIS & Spatial Data Analysis', category: 'TECHNICAL', score: 52, confidenceLevel: 'MEDIUM', lastAssessedAt: '2026-09-12T13:20:00Z' },
  { id: 8, competencyId: 8, competencyCode: 'TECH-SQL', competencyName: 'SQL & Relational Databases', category: 'TECHNICAL', score: 65, confidenceLevel: 'MEDIUM', lastAssessedAt: '2026-09-22T10:30:00Z' },
  { id: 9, competencyId: 9, competencyCode: 'GOV-DPD', competencyName: 'Data Privacy & DPDP Act 2023', category: 'DIGITAL_GOVERNANCE', score: 60, confidenceLevel: 'MEDIUM', lastAssessedAt: '2026-09-14T15:00:00Z' },
  { id: 10, competencyId: 10, competencyCode: 'GOV-CSY', competencyName: 'Cybersecurity for Official Statistics', category: 'DIGITAL_GOVERNANCE', score: 55, confidenceLevel: 'LOW', lastAssessedAt: '2026-09-16T12:00:00Z' },
  { id: 11, competencyId: 11, competencyCode: 'MGT-ETH', competencyName: 'Statistical Ethics & Fundamental Principles', category: 'MANAGERIAL', score: 92, confidenceLevel: 'HIGH', lastAssessedAt: '2026-09-27T17:00:00Z' },
  { id: 12, competencyId: 12, competencyCode: 'MGT-COM', competencyName: 'Data Storytelling & Public Communication', category: 'MANAGERIAL', score: 70, confidenceLevel: 'MEDIUM', lastAssessedAt: '2026-09-21T11:45:00Z' }
];

export const MOCK_SKILL_GAPS: SkillGap[] = [
  {
    competencyId: 6,
    competencyCode: 'TECH-AIM',
    competencyName: 'AI & Machine Learning for Official Statistics',
    category: 'TECHNICAL',
    categoryLabel: 'Technical & Data Science',
    currentLevel: 35,
    requiredLevel: 75,
    gap: 40,
    classification: 'SIGNIFICANT_GAP',
    classificationLabel: 'Significant Gap (26–50)',
    explanation: 'The current competency (35/100) is substantially below the expected benchmark (75/100) for the Statistical Analyst cadre.',
    recommendedAction: 'Enroll in "Applied Machine Learning for National Statistics" on iGOT Karmayogi and complete the diagnostic quiz.',
    importanceWeight: 5
  },
  {
    competencyId: 5,
    competencyCode: 'TECH-PYT',
    competencyName: 'Python for Statistical Analytics',
    category: 'TECHNICAL',
    categoryLabel: 'Technical & Data Science',
    currentLevel: 48,
    requiredLevel: 80,
    gap: 32,
    classification: 'SIGNIFICANT_GAP',
    classificationLabel: 'Significant Gap (26–50)',
    explanation: 'Your current Python capability is 48 while modern NSSO microdata auditing requires an 80 benchmark.',
    recommendedAction: 'Complete "Python for Statistical Data Processing & Imputation" on iGOT Karmayogi Sandbox.',
    importanceWeight: 5
  },
  {
    competencyId: 7,
    competencyCode: 'TECH-GIS',
    competencyName: 'GIS & Spatial Data Analysis',
    category: 'TECHNICAL',
    categoryLabel: 'Technical & Data Science',
    currentLevel: 52,
    requiredLevel: 75,
    gap: 23,
    classification: 'MODERATE_GAP',
    classificationLabel: 'Moderate Gap (11–25)',
    explanation: 'Basic spatial awareness verified; spatial join and thematic mapping modules needed for Economic Census dissemination.',
    recommendedAction: 'Undertake module "Thematic Cartography & QGIS Spatial Analysis for Official Cadres".',
    importanceWeight: 4
  },
  {
    competencyId: 10,
    competencyCode: 'GOV-CSY',
    competencyName: 'Cybersecurity for Official Statistics',
    category: 'DIGITAL_GOVERNANCE',
    categoryLabel: 'Digital Governance',
    currentLevel: 55,
    requiredLevel: 75,
    gap: 20,
    classification: 'MODERATE_GAP',
    classificationLabel: 'Moderate Gap (11–25)',
    explanation: 'Awareness of cyber hygiene exists; protocols for encrypted microdata dissemination require structured review.',
    recommendedAction: 'Review "Data Classification & Security Standards in Government Cloud Environments".',
    importanceWeight: 4
  },
  {
    competencyId: 1,
    competencyCode: 'STAT-SMP',
    competencyName: 'Sampling Theory & Survey Design',
    category: 'STATISTICAL',
    categoryLabel: 'Statistical Core',
    currentLevel: 82,
    requiredLevel: 85,
    gap: 3,
    classification: 'STRONG',
    classificationLabel: 'Strong (0–10)',
    explanation: 'Cadre alignment verified. Solid demonstrated mastery over multistage stratified sampling.',
    recommendedAction: 'Qualifies as peer mentor for junior investigators.',
    importanceWeight: 5
  }
];

export const MOCK_SKILL_GAP_SUMMARY: SkillGapSummary = {
  jobRole: 'Statistical Analyst',
  averageCompetencyScore: 64,
  averageRequiredScore: 78,
  overallGap: 14,
  criticalGapCount: 1,
  significantGapCount: 2,
  moderateGapCount: 4,
  strongCount: 5,
  gaps: MOCK_SKILL_GAPS
};

export const MOCK_IGOT_COURSES: IGotCourse[] = [
  {
    id: 1,
    courseCode: 'iGOT-AI-201',
    title: 'Applied Machine Learning for National Statistics',
    description: 'Learn modern machine learning techniques applied to official statistical operations, automated occupation coding, and satellite night-light GDP modeling.',
    provider: 'National Statistical Systems Training Academy (NSSTA)',
    difficulty: 'INTERMEDIATE',
    durationHours: 24,
    category: 'Technical & Data Science',
    language: 'English',
    isIgotCourse: true,
    competencyCodes: ['TECH-AIM'],
    competencyNames: ['AI & Machine Learning for Official Statistics'],
    enrollmentStatus: 'IN_PROGRESS',
    progressPercent: 35
  },
  {
    id: 2,
    courseCode: 'iGOT-STAT-101',
    title: 'Python for Statistical Data Processing & Imputation',
    description: 'Comprehensive Python for statistical cadres: Pandas dataframes, microdata cleansing, complex survey weights, hot-deck imputation, and automated reporting.',
    provider: 'Indian Statistical Institute (ISI) & MoSPI',
    difficulty: 'BEGINNER',
    durationHours: 30,
    category: 'Technical & Data Science',
    language: 'English',
    isIgotCourse: true,
    competencyCodes: ['TECH-PYT'],
    competencyNames: ['Python for Statistical Analytics'],
    enrollmentStatus: 'ENROLLED',
    progressPercent: 0
  },
  {
    id: 3,
    courseCode: 'iGOT-GIS-301',
    title: 'Thematic Cartography & QGIS for Economic Census',
    description: 'Practical training on spatial shapefiles, enumeration block georeferencing, spatial joins, and open data visualization for census and survey analysts.',
    provider: 'National Remote Sensing Centre (NRSC) & MoSPI',
    difficulty: 'INTERMEDIATE',
    durationHours: 18,
    category: 'Technical & Data Science',
    language: 'English',
    isIgotCourse: true,
    competencyCodes: ['TECH-GIS'],
    competencyNames: ['GIS & Spatial Data Analysis']
  },
  {
    id: 4,
    courseCode: 'iGOT-SNA-401',
    title: 'National Accounts Statistics: Sources and Methods (SNA 2008)',
    description: 'In-depth guide to Indian National Accounts: Gross Fixed Capital Formation, Supply Use Tables, Financial Intermediation Services (FISIM), and GVA sectoral compilation.',
    provider: 'Central Statistics Office (CSO) / NAD',
    difficulty: 'ADVANCED',
    durationHours: 40,
    category: 'Statistical Core',
    language: 'English',
    isIgotCourse: true,
    competencyCodes: ['STAT-NAC'],
    competencyNames: ['National Accounts & GDP Compilation']
  },
  {
    id: 5,
    courseCode: 'iGOT-DPD-201',
    title: 'DPDP Act Compliance & Public Data Protection in India',
    description: 'Legal and technical requirements of the Digital Personal Data Protection Act 2023 for government departments handling citizen survey and census data.',
    provider: 'Ministry of Electronics & IT (MeitY) / NSSTA',
    difficulty: 'BEGINNER',
    durationHours: 12,
    category: 'Digital Governance',
    language: 'English',
    isIgotCourse: true,
    competencyCodes: ['GOV-DPD'],
    competencyNames: ['Data Privacy & DPDP Act 2023']
  }
];

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    courseId: 1,
    courseCode: 'iGOT-AI-201',
    courseTitle: 'Applied Machine Learning for National Statistics',
    courseDescription: 'Learn modern machine learning techniques applied to official statistical operations.',
    provider: 'NSSTA',
    difficulty: 'INTERMEDIATE',
    durationHours: 24,
    competencyId: 6,
    competencyCode: 'TECH-AIM',
    competencyName: 'AI & Machine Learning for Official Statistics',
    reason: 'Your current AI/ML competency is 35 while the official role standard for Statistical Analyst is 75 (Gap: 40 points).',
    priority: 'CRITICAL',
    expectedOutcome: 'Gain practical capability in automated classification, anomaly detection, and predictive modeling for survey microdata.',
    isEnrolled: true,
    currentProgress: 35,
    createdAt: '2026-09-29T10:00:00Z'
  },
  {
    id: 2,
    courseId: 2,
    courseCode: 'iGOT-STAT-101',
    courseTitle: 'Python for Statistical Data Processing & Imputation',
    courseDescription: 'Comprehensive Python for statistical cadres: Pandas, survey weights, and hot-deck imputation.',
    provider: 'ISI & MoSPI',
    difficulty: 'BEGINNER',
    durationHours: 30,
    competencyId: 5,
    competencyCode: 'TECH-PYT',
    competencyName: 'Python for Statistical Analytics',
    reason: 'Your verified score is 48 against a cadre requirement of 80 (Gap: 32 points).',
    priority: 'HIGH',
    expectedOutcome: 'Automate complex survey tabulation and calculate weighted estimates using open-source Python toolchains.',
    isEnrolled: false,
    currentProgress: 0,
    createdAt: '2026-09-29T10:00:00Z'
  },
  {
    id: 3,
    courseId: 3,
    courseCode: 'iGOT-GIS-301',
    courseTitle: 'Thematic Cartography & QGIS for Economic Census',
    courseDescription: 'Practical training on spatial shapefiles and enumeration block georeferencing.',
    provider: 'NRSC & MoSPI',
    difficulty: 'INTERMEDIATE',
    durationHours: 18,
    competencyId: 7,
    competencyCode: 'TECH-GIS',
    competencyName: 'GIS & Spatial Data Analysis',
    reason: 'Moderate gap of 23 points identified for spatial data integration in regional survey releases.',
    priority: 'MEDIUM',
    expectedOutcome: 'Publish interactive thematic maps linking survey indicators to district shapefiles.',
    isEnrolled: false,
    currentProgress: 0,
    createdAt: '2026-09-29T10:00:00Z'
  }
];

export const MOCK_LEARNING_PATH: LearningPath = {
  id: 1,
  title: 'AI-Enabled Statistical Analyst Certification Track',
  description: 'Curated sequential capacity-building roadmap tailored to bridge your technical and data science deficits.',
  targetRole: 'Statistical Analyst',
  totalEstimatedHours: 112,
  completedHours: 38,
  overallProgressPercent: 34,
  createdAt: '2026-09-29T10:00:00Z',
  items: [
    { id: 1, courseId: 2, courseCode: 'iGOT-STAT-101', courseTitle: 'Python for Statistical Data Processing & Imputation', courseDescription: 'Foundations of statistical programming in Python.', provider: 'ISI & MoSPI', difficulty: 'BEGINNER', durationHours: 30, sequenceOrder: 1, status: 'IN_PROGRESS', progressPercent: 40 },
    { id: 2, courseId: 1, courseCode: 'iGOT-AI-201', courseTitle: 'Applied Machine Learning for National Statistics', courseDescription: 'Machine learning models for survey automation.', provider: 'NSSTA', difficulty: 'INTERMEDIATE', durationHours: 24, sequenceOrder: 2, status: 'IN_PROGRESS', progressPercent: 35 },
    { id: 3, courseId: 3, courseCode: 'iGOT-GIS-301', courseTitle: 'Thematic Cartography & QGIS for Economic Census', courseDescription: 'Spatial integration and GIS mapping.', provider: 'NRSC', difficulty: 'INTERMEDIATE', durationHours: 18, sequenceOrder: 3, status: 'NOT_STARTED', progressPercent: 0 },
    { id: 4, courseId: 5, courseCode: 'iGOT-DPD-201', courseTitle: 'DPDP Act Compliance & Public Data Protection in India', courseDescription: 'Data privacy and anonymization principles.', provider: 'MeitY', difficulty: 'BEGINNER', durationHours: 12, sequenceOrder: 4, status: 'NOT_STARTED', progressPercent: 0 },
    { id: 5, courseId: 4, courseCode: 'iGOT-SNA-401', courseTitle: 'National Accounts Statistics: Sources and Methods (SNA 2008)', courseDescription: 'Advanced macro-economic accounting.', provider: 'CSO/NAD', difficulty: 'ADVANCED', durationHours: 40, sequenceOrder: 5, status: 'NOT_STARTED', progressPercent: 0 }
  ]
};

export const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: 1,
    title: 'Diagnostic Assessment: AI & Machine Learning in Official Statistics',
    description: 'Evaluates practical understanding of predictive classification, automated occupation coding, anomaly detection in microdata, and model evaluation metrics.',
    targetCompetencyId: 6,
    targetCompetencyName: 'AI & Machine Learning for Official Statistics',
    targetCompetencyCode: 'TECH-AIM',
    difficulty: 'INTERMEDIATE',
    passingScore: 60,
    timeLimitMinutes: 15,
    published: true,
    questionCount: 4,
    questions: [
      {
        id: 101,
        questionText: 'When applying machine learning to automate 5-digit National Classification of Occupations (NCO) codes from survey interview text, which loss function is best suited?',
        optionA: 'Cross-Entropy Loss (Multiclass Categorical)',
        optionB: 'Mean Squared Error (L2 loss)',
        optionC: 'Binary Hinge Loss',
        optionD: 'Huber Loss',
        correctAnswer: 'A',
        explanation: 'Categorical cross-entropy is the standard loss function for single-label, mutually exclusive multi-class classification problems like NCO or NIC hierarchical coding.',
        difficulty: 'INTERMEDIATE',
        topic: 'Natural Language Processing for Official Statistics'
      },
      {
        id: 102,
        questionText: 'In survey data cleansing, which unsupervised anomaly detection technique is particularly robust to high-dimensional multivariate statistical distributions?',
        optionA: 'Isolation Forest algorithm',
        optionB: 'Univariate 3-sigma Z-score rule',
        optionC: 'Simple Min-Max Normalization',
        optionD: 'Deterministic threshold clipping',
        correctAnswer: 'A',
        explanation: 'Isolation Forest explicitly isolates anomalies by randomly partitioning feature dimensions, exhibiting linear time complexity and high fidelity in multidimensional survey tables.',
        difficulty: 'INTERMEDIATE',
        topic: 'Data Quality & Anomaly Detection'
      },
      {
        id: 103,
        questionText: 'What is the primary risk when using deep neural networks to impute missing household consumption expenditure values without survey stratification weights?',
        optionA: 'Biased sample estimates and distorted regional variance due to ignoring complex survey design effects',
        optionB: 'The neural network will always fail to converge on floating point tensors',
        optionC: 'Memory exhaustion on 64-bit operating systems',
        optionD: 'Overfitting only occurs when data is completely missing at random',
        correctAnswer: 'A',
        explanation: 'Complex multi-stage sample surveys rely on design weights to represent the universe. Unweighted ML models risk severe estimation bias towards over-sampled strata.',
        difficulty: 'ADVANCED',
        topic: 'Imputation & Survey Weighting'
      },
      {
        id: 104,
        questionText: 'Which metric provides the most reliable evaluation of a classification model deployed on heavily imbalanced rare statistical events (e.g. fraudulent GST tax returns or rare enterprise closures)?',
        optionA: 'Precision-Recall Area Under Curve (PR-AUC)',
        optionB: 'Raw Classification Accuracy %',
        optionC: 'Mean Absolute Deviation',
        optionD: 'Pearson Correlation Coefficient',
        correctAnswer: 'A',
        explanation: 'In heavy class imbalance, raw accuracy is deceptively inflated by the majority class. PR-AUC explicitly measures true positive trade-offs without skew from true negatives.',
        difficulty: 'INTERMEDIATE',
        topic: 'Model Evaluation in Official Systems'
      }
    ],
    createdAt: '2026-09-28T09:00:00Z'
  },
  {
    id: 2,
    title: 'Diagnostic Assessment: Multistage Stratified Sampling & Survey Design',
    description: 'Evaluates core mathematical principles of probability sampling, Design Effect (Deff), frame stratification, and ratio estimation.',
    targetCompetencyId: 1,
    targetCompetencyName: 'Sampling Theory & Survey Design',
    targetCompetencyCode: 'STAT-SMP',
    difficulty: 'INTERMEDIATE',
    passingScore: 60,
    timeLimitMinutes: 15,
    published: true,
    questionCount: 3,
    questions: [
      {
        id: 201,
        questionText: 'In NSSO household surveys, what is the primary rationale for utilizing Probability Proportional to Size (PPS) sampling when selecting First Stage Units (villages/urban blocks)?',
        optionA: 'It ensures that larger administrative units have a proportionally higher chance of selection, equalizing ultimate household selection probabilities.',
        optionB: 'It reduces the total number of survey investigators needed in the field.',
        optionC: 'It eliminates the requirement for household listing in the second stage.',
        optionD: 'It completely removes non-sampling errors.',
        correctAnswer: 'A',
        explanation: 'PPS sampling paired with self-weighting second-stage designs balances field investigator workload while maintaining self-weighting properties across Primary Sampling Units.',
        difficulty: 'INTERMEDIATE',
        topic: 'Sampling Theory'
      },
      {
        id: 202,
        questionText: 'How is the Design Effect (Deff) of a complex survey sample defined mathematically relative to Simple Random Sampling (SRS)?',
        optionA: 'Deff = Variance(Complex Sample) / Variance(SRS of same size)',
        optionB: 'Deff = Variance(SRS) / Variance(Complex Sample)',
        optionC: 'Deff = Standard Error(Complex Sample) * Sample Size',
        optionD: 'Deff = 1 - Intra-cluster correlation coefficient',
        correctAnswer: 'A',
        explanation: 'Design Effect (Kish, 1965) is defined as the ratio of the variance of an estimator under the actual complex design to the variance under simple random sampling with equal sample size.',
        difficulty: 'ADVANCED',
        topic: 'Design Effect'
      },
      {
        id: 203,
        questionText: 'When compiling monthly Consumer Price Indices (CPI), what is the formula for the Laspeyres Price Index between base period 0 and current period t?',
        optionA: 'L_t = (sum(P_t * Q_0) / sum(P_0 * Q_0)) * 100',
        optionB: 'L_t = (sum(P_t * Q_t) / sum(P_0 * Q_t)) * 100',
        optionC: 'L_t = sqrt(Laspeyres * Paasche) * 100',
        optionD: 'L_t = sum(P_t / P_0) / n * 100',
        correctAnswer: 'A',
        explanation: 'Laspeyres price index holds base period quantities Q_0 constant to measure price inflation of the fixed baseline commodity basket.',
        difficulty: 'INTERMEDIATE',
        topic: 'Price Index Formulation'
      }
    ],
    createdAt: '2026-09-28T11:00:00Z'
  }
];

export const MOCK_ADMIN_DASHBOARD: AdminDashboardData = {
  totalEmployees: 1420,
  activeLearners: 1184,
  averageCompetencyScore: 68,
  trainingCompletionRate: 74,
  criticalGapsCount: 86,
  significantGapsCount: 248,
  departmentAnalytics: [
    { departmentId: 1, departmentCode: 'NSSO', departmentName: 'National Sample Survey Office', employeeCount: 650, averageCompetencyScore: 72, criticalGapsCount: 32, trainingCompletionRate: 78 },
    { departmentId: 2, departmentCode: 'NAD', departmentName: 'National Accounts Division', employeeCount: 220, averageCompetencyScore: 76, criticalGapsCount: 12, trainingCompletionRate: 82 },
    { departmentId: 3, departmentCode: 'ESD', departmentName: 'Economic Statistics Division', employeeCount: 210, averageCompetencyScore: 69, criticalGapsCount: 18, trainingCompletionRate: 71 },
    { departmentId: 4, departmentCode: 'DES', departmentName: 'State Directorates of Economics & Statistics', employeeCount: 340, averageCompetencyScore: 59, criticalGapsCount: 24, trainingCompletionRate: 64 }
  ],
  topSkillGaps: [
    { competencyId: 6, competencyCode: 'TECH-AIM', competencyName: 'AI & Machine Learning for Official Statistics', category: 'TECHNICAL', averageScore: 36, benchmarkScore: 75, averageGap: 39, affectedEmployeesCount: 420, demandLevel: 'CRITICAL' },
    { competencyId: 5, competencyCode: 'TECH-PYT', competencyName: 'Python for Statistical Analytics', category: 'TECHNICAL', averageScore: 49, benchmarkScore: 80, averageGap: 31, affectedEmployeesCount: 512, demandLevel: 'HIGH' },
    { competencyId: 7, competencyCode: 'TECH-GIS', competencyName: 'GIS & Spatial Data Analysis', category: 'TECHNICAL', averageScore: 51, benchmarkScore: 75, averageGap: 24, affectedEmployeesCount: 380, demandLevel: 'HIGH' },
    { competencyId: 10, competencyCode: 'GOV-CSY', competencyName: 'Cybersecurity for Official Statistics', category: 'DIGITAL_GOVERNANCE', averageScore: 54, benchmarkScore: 75, averageGap: 21, affectedEmployeesCount: 295, demandLevel: 'MEDIUM' }
  ],
  emergingSkills: [
    { competencyId: 6, competencyCode: 'TECH-AIM', competencyName: 'AI & Machine Learning for Official Statistics', category: 'TECHNICAL', averageScore: 36, benchmarkScore: 75, averageGap: 39, affectedEmployeesCount: 420, demandLevel: 'CRITICAL' },
    { competencyId: 7, competencyCode: 'TECH-GIS', competencyName: 'GIS & Spatial Data Analysis', category: 'TECHNICAL', averageScore: 51, benchmarkScore: 75, averageGap: 24, affectedEmployeesCount: 380, demandLevel: 'HIGH' },
    { competencyId: 9, competencyCode: 'GOV-DPD', competencyName: 'Data Privacy & DPDP Act 2023', category: 'DIGITAL_GOVERNANCE', averageScore: 60, benchmarkScore: 80, averageGap: 20, affectedEmployeesCount: 340, demandLevel: 'HIGH' }
  ],
  trainingAnalytics: {
    totalEnrollments: 2450,
    completedEnrollments: 1810,
    activeEnrollments: 640,
    overallCompletionRate: 74,
    mostPopularCourses: [
      { courseId: 1, courseCode: 'iGOT-AI-201', courseTitle: 'Applied Machine Learning for National Statistics', provider: 'NSSTA', enrollmentCount: 480, averageProgress: 68 },
      { courseId: 2, courseCode: 'iGOT-STAT-101', courseTitle: 'Python for Statistical Data Processing & Imputation', provider: 'ISI & MoSPI', enrollmentCount: 620, averageProgress: 75 },
      { courseId: 3, courseCode: 'iGOT-GIS-301', courseTitle: 'Thematic Cartography & QGIS for Economic Census', provider: 'NRSC', enrollmentCount: 390, averageProgress: 62 },
      { courseId: 4, courseCode: 'iGOT-SNA-401', courseTitle: 'National Accounts Statistics: Sources and Methods', provider: 'CSO/NAD', enrollmentCount: 340, averageProgress: 81 }
    ]
  },
  gapDistribution: {
    'Critical Gap': 86,
    'Significant Gap': 248,
    'Moderate Gap': 412,
    'Strong / Benchmarked': 674
  }
};
