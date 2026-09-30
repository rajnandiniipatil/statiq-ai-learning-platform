# StatIQ System Architecture

## Overview
StatIQ is structured as a decoupled, multi-tiered enterprise application conforming to modern micro-modular patterns. The platform is designed specifically for India's Official Statistical System (MoSPI, NSSO, State Directorates of Economics and Statistics).

```mermaid
graph TB
    subgraph Client Tier
        UI[React 18 + Vite + Tailwind CSS]
        AuthStore[JWT Session & Role Context]
        Charts[Recharts Visualization Engine]
    end

    subgraph API Gateway & Core Backend
        Spring[Spring Boot 3.3.4 Application]
        Security[Spring Security + JWT Auth Filter]
        Controllers[REST Controllers / DTO Layer]
        Services[Business Logic & Skill Gap Engine]
        IGotBridge[iGOT Provider Abstraction Layer]
        DataLayer[Spring Data JPA Repositories]
    end

    subgraph AI Intelligence Microservice
        FastAPI[Python 3.13 FastAPI Engine]
        DocExtract[PDF / DOCX / PPTX / TXT Extraction]
        Chunker[Semantic Text Chunker]
        MCQGen[Bloom's Taxonomy MCQ Generator]
        AIAssistant[Statistical AI Chat Agent]
        AIProviders[MockAIProvider / LLMProvider]
    end

    subgraph Data & Storage Tier
        Postgres[(PostgreSQL 18.6 Relational DB)]
        Flyway[Flyway Database Migrations]
        FileSystem[Secure Upload Repository]
    end

    subgraph External Ecosystem
        MockIGot[Mock iGOT Course Provider]
        RealIGot[Production iGOT API Bridge (Future)]
    end

    UI -->|REST / JSON| Security
    Security --> Controllers
    Controllers --> Services
    Services --> DataLayer
    DataLayer --> Postgres
    Flyway --> Postgres
    
    Services -->|HTTP / Async| FastAPI
    FastAPI --> DocExtract
    DocExtract --> Chunker
    Chunker --> MCQGen
    MCQGen --> AIProviders
    FastAPI --> AIAssistant
    
    Services --> IGotBridge
    IGotBridge -.-> MockIGot
    IGotBridge -.-> RealIGot
```

## Layer Responsibilities
1. **Frontend Tier (React + Vite + TypeScript):**
   * Single-page responsive enterprise portal.
   * State management via Context API and Axios interceptors for automatic JWT injection and renewal.
   * Visual charting powered by Recharts (Competency Radar, Gap Bar Charts, Department Heatmaps).
2. **Core Backend Tier (Spring Boot):**
   * Role-based access control (`ROLE_LEARNER`, `ROLE_TRAINER`, `ROLE_ADMIN`).
   * Competency evaluation, skill-gap categorization, and continuous feedback loop updating.
   * Decoupled DTO architecture avoiding JPA entity leakage.
   * Transactional persistence with Spring Data JPA.
3. **AI Intelligence Tier (FastAPI + Python):**
   * Dedicated microservice processing document payloads.
   * Handles text extraction from binary files without burdening the JVM thread pool.
   * Extensible LLM Provider abstraction supporting prompt engineering and fallback offline mock generation.
4. **iGOT Karmayogi Abstraction:**
   * Clean interface pattern isolating course retrieval, metadata caching, and enrollment semantics.
