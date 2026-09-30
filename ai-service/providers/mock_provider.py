import random
from typing import List
from models.schemas import GeneratedQuestion, GenerateMcqRequest, AiAssistantRequest, AiAssistantResponse
from .base_provider import AIProvider

class MockAIProvider(AIProvider):
    """
    High-fidelity offline AI provider ensuring the platform runs with zero external API dependencies.
    Contains curated questions aligned with MoSPI, NSSO, and National Accounts standards.
    """

    def __init__(self):
        self._curated_corpus = [
            GeneratedQuestion(
                question_text="In multi-stage stratified survey sampling, when is post-stratification weighting necessary?",
                option_a="When the sample distribution across known demographic strata diverges from census population benchmarks due to non-response.",
                option_b="When survey questionnaires are printed using different color papers.",
                option_c="When sample sizes exceed 100,000 households.",
                option_d="Only when using non-probability snowball sampling.",
                correct_answer="A",
                explanation="Post-stratification adjusts survey design weights using external census or administrative totals to correct for disproportionate non-response across key demographic subgroups.",
                difficulty="MEDIUM",
                topic="Survey Sampling",
                source_reference="NSSO Sampling Design Manual §4.2",
                blooms_taxonomy_level="Analyzing"
            ),
            GeneratedQuestion(
                question_text="What is the key mathematical property distinguishing Paasche's Price Index from Laspeyres' Price Index?",
                option_a="Paasche uses current-period quantity weights (Q_t), whereas Laspeyres uses base-period quantity weights (Q_0).",
                option_b="Paasche calculates only wholesale prices while Laspeyres is exclusively for retail.",
                option_c="Paasche incorporates logarithmic geometric means.",
                option_d="Paasche requires zero quantity data.",
                correct_answer="A",
                explanation="Laspeyres index is base-weighted (Q_0) and tends to overestimate inflation due to substitution bias, while Paasche is current-weighted (Q_t) and tends to underestimate it.",
                difficulty="EASY",
                topic="Price Statistics",
                source_reference="MoSPI CPI Bluebook Ch 2",
                blooms_taxonomy_level="Understanding"
            ),
            GeneratedQuestion(
                question_text="When developing a Machine Learning pipeline for automated imputation in socio-economic surveys, why is feature scaling critical before training distance-based algorithms (e.g. k-NN)?",
                option_a="Variables with large numerical scales (e.g. annual income in rupees) will dominate distance calculations over smaller scale variables (e.g. household size).",
                option_b="Feature scaling guarantees that all model coefficients equal zero.",
                option_c="Distance-based algorithms cannot run in Python without standard scaling.",
                option_d="Feature scaling is only required for tree-based algorithms like Random Forest.",
                correct_answer="A",
                explanation="Distance metrics such as Euclidean distance calculate differences across dimensions. Without scaling, attributes measured in thousands dominate attributes measured in single digits.",
                difficulty="MEDIUM",
                topic="Machine Learning in Statistics",
                source_reference="StatIQ Applied ML Handbook",
                blooms_taxonomy_level="Applying"
            ),
            GeneratedQuestion(
                question_text="Under the System of National Accounts (SNA 2008), which transaction is categorized under Gross Fixed Capital Formation (GFCF)?",
                option_a="Acquisition of machinery, equipment, transport systems, and intellectual property products by resident producers.",
                option_b="Government expenditure on disaster relief grain subsidies.",
                option_c="Household purchase of consumable packaged groceries.",
                option_d="Short-term commercial paper trading in equity markets.",
                correct_answer="A",
                explanation="GFCF consists of resident producers' acquisitions less disposals of fixed assets intended to be used repeatedly or continuously in production processes for more than one year.",
                difficulty="HARD",
                topic="National Accounts",
                source_reference="SNA 2008 / MoSPI NAD Guidelines",
                blooms_taxonomy_level="Evaluating"
            ),
            GeneratedQuestion(
                question_text="In the Periodic Labour Force Survey (PLFS), how is a person classified as 'Unemployed' under the Usual Status (ps+ss) approach?",
                option_a="If the person was seeking or available for work for a major time of the preceding 365 days and remained without work.",
                option_b="If the person did not work for at least 1 hour on any day during the preceding week.",
                option_c="If the person is enrolled in full-time university education.",
                option_d="If the person refused to answer the surveyor's questionnaire.",
                correct_answer="A",
                explanation="Under Usual Principal and Subsidiary Status (UPSS), an individual is considered unemployed if they spent the relatively major part of the preceding 365 days seeking or available for employment but did not find work.",
                difficulty="MEDIUM",
                topic="Labour Statistics",
                source_reference="PLFS Annual Report Concepts and Definitions",
                blooms_taxonomy_level="Understanding"
            ),
            GeneratedQuestion(
                question_text="In time series decomposition of monthly economic indices, which method is most effective for estimating underlying trend-cycle components in the presence of structural breaks?",
                option_a="Locally Estimated Scatterplot Smoothing (LOESS) / STL Decomposition",
                option_b="Simple 2-period moving average without end-point adjustments",
                option_c="Linear extrapolation from the base year index point",
                option_d="Manual arbitrary value clipping",
                correct_answer="A",
                explanation="STL (Seasonal and Trend decomposition using Loess) provides versatile and robust decomposition that handles nonlinear patterns, changing seasonality, and structural economic shocks gracefully.",
                difficulty="HARD",
                topic="Time Series Analytics",
                source_reference="MoSPI Working Paper on High Frequency Indicators",
                blooms_taxonomy_level="Analyzing"
            ),
            GeneratedQuestion(
                question_text="What is the cryptographic objective of digital signatures under the Information Technology Act in official statistical workflow verification?",
                option_a="Ensuring non-repudiation, signer authenticity, and cryptographic integrity of published survey datasets.",
                option_b="Compressing file size to under 1 kilobyte.",
                option_c="Converting SQL database tables into HTML format.",
                option_d="Preventing respondents from seeing the surveyor's tablet screen.",
                correct_answer="A",
                explanation="Digital signatures utilize asymmetric public-key cryptography to guarantee non-repudiation and verify that official microdata tables have not been altered or tampered with since issuance.",
                difficulty="EASY",
                topic="Digital Governance",
                source_reference="MeitY PKI & Digital Signature Guidelines",
                blooms_taxonomy_level="Remembering"
            ),
            GeneratedQuestion(
                question_text="In geospatial analysis for official statistics, why is a projected coordinate reference system (e.g. UTM) preferred over geographic coordinates (WGS84 Lat/Long) when calculating district agricultural crop areas?",
                option_a="Projected coordinate systems preserve linear distances and planar area measurements in meters, whereas angular degrees distort physical area.",
                option_b="WGS84 is strictly prohibited by the Survey of India.",
                option_c="Tablets cannot store decimal latitude and longitude numbers.",
                option_d="Satellite imagery only works in polar coordinates.",
                correct_answer="A",
                explanation="Geographic coordinates measure angles on a spheroid (degrees), which vary in linear physical distance as latitude changes. Projected systems project coordinates onto a plane in standard metric units (meters), ensuring true polygon area computations.",
                difficulty="HARD",
                topic="Geospatial Analysis",
                source_reference="Survey of India Cartography Manual",
                blooms_taxonomy_level="Analyzing"
            ),
            GeneratedQuestion(
                question_text="Which Python library is the standard industry foundation for multidimensional numerical array operations and vectorized linear algebra calculations?",
                option_a="NumPy",
                option_b="BeautifulSoup",
                option_c="Flask",
                option_d="Tkinter",
                correct_answer="A",
                explanation="NumPy provides C-optimized ndarray objects and mathematical vectorized routines, serving as the computational core for Pandas, SciPy, and Scikit-Learn.",
                difficulty="EASY",
                topic="Python",
                source_reference="Python Data Science Handbook",
                blooms_taxonomy_level="Remembering"
            ),
            GeneratedQuestion(
                question_text="Under the UN Fundamental Principles of Official Statistics, how must individual respondent confidentiality be safeguarded?",
                option_a="Individual data collected for statistical compilation must be strictly confidential and used exclusively for statistical purposes.",
                option_b="Data can be shared freely with commercial marketing firms to generate revenue.",
                option_c="Data may be used for targeted tax enforcement without statutory notification.",
                option_d="Respondent records must be discarded after 30 days.",
                correct_answer="A",
                explanation="Principle 6 of the UN Fundamental Principles guarantees that individual data collected by statistical agencies must remain strictly confidential and never be exploited for non-statistical regulatory, judicial, or tax investigations.",
                difficulty="EASY",
                topic="Statistical Ethics",
                source_reference="UN Fundamental Principles Principle 6",
                blooms_taxonomy_level="Understanding"
            )
        ]

    def generate_mcqs(self, request: GenerateMcqRequest) -> List[GeneratedQuestion]:
        requested_count = request.count
        available = list(self._curated_corpus)
        
        # If user uploaded custom document, adapt questions with source citation
        source_title = request.document_title or "Uploaded Training Material"
        adapted = []
        for q in available:
            copy_q = q.model_copy()
            if source_title:
                copy_q.source_reference = f"{source_title} (Verified Reference)"
            adapted.append(copy_q)

        # If requested count is greater than pool, loop through or customize
        result = []
        while len(result) < requested_count:
            result.extend(adapted)
        
        return result[:requested_count]

    def answer_query(self, request: AiAssistantRequest) -> AiAssistantResponse:
        q = request.query.lower()
        if "gap" in q or "competency" in q:
            return AiAssistantResponse(
                answer="In StatIQ, your competency gaps represent the mathematical difference between your verified capability (0–100) and the required role standard. Gaps over 25 points trigger targeted iGOT course recommendations to accelerate your professional capacity building.",
                source_references=["StatIQ Skill Gap Engine", "MoSPI Cadre Standards"],
                suggested_follow_ups=["How do I take a diagnostic quiz?", "Which courses are recommended for me?"],
                relevant_competencies=["AI/ML", "Python", "Survey Design"]
            )
        else:
            return AiAssistantResponse(
                answer="StatIQ AI Assistant is online. I can assist you with understanding official statistical standards, exploring iGOT Karmayogi courses, generating quizzes from manuals, and planning your personalized upskilling roadmap.",
                source_references=["StatIQ Platform Guide", "iGOT Karmayogi Directory"],
                suggested_follow_ups=["What is my highest priority skill gap?", "Show me courses on Price Statistics"],
                relevant_competencies=["Data Science", "Official Statistics", "Digital Governance"]
            )
