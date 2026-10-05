# DOCIQ — Product Requirements Document (PRD)

> **Document Version:** 2.0 (Revised Architecture)  
> **Last Updated:** 2026-09-27  
> **Status:** Active Development  
> **Classification:** Internal / Academic  

---

## Section 0: Document Purpose

This PRD serves as the single source of truth for the **DOCIQ** project. It contains all architectural decisions, technical specifications, research references, and project context required to:

1. Onboard new team members without verbal explanation.
2. Feed into any AI model (ChatGPT, Claude, Gemini, etc.) for context-aware assistance.
3. Share with academic guides, sponsors, or evaluators as a standalone document.
4. Maintain consistency across all project artifacts (synopsis, PPT, code, papers).

> **Warning:** DO NOT modify this document without team consensus. All changes must be logged in Section 1.4 (Change Log).

---

## Section 1: Project Overview

### 1.1 Project Identity
* **Project Name:** DOCIQ (Document Intelligence Query)
* **Full Title:** DOCIQ — AI-Powered Data Analytics Tool for SMEs
* **Tagline:** *"Ask your business data questions in plain English. Get answers in seconds."*
* **Project Type:** B.Tech Final Year Dissertation (Non-Sponsored, seeking sponsorship)
* **Duration:** September 2026 — April 2027 (8 months)
* **Institution:** Ashokrao Mane Group of Institutions, Vathar, Kolhapur
* **Department:** Artificial Intelligence and Data Science

### 1.2 Team Composition
| Role | Name | Roll No. | Career Goal |
| :--- | :--- | :---: | :--- |
| Team Member 1 | Aniruddha Madan Ambi | 01 | Jr. Data Scientist / AI Engineer |
| Team Member 2 | Shreenath Amol Tambe | 66 | Cloud Engineer |
| Team Member 3 | Yakub Rafik Nadaf | 38 | Data Analyst / Data Engineer |
| Guide | Mrs. G. G. Desai | — | Faculty, Dept. of AI&DS |

### 1.3 Project Status
* **Current Phase:** Phase 1 — Problem Validation & Field Research
* **Completed:** Synopsis draft, architecture diagrams, tech stack finalization
* **In Progress:** Local SME shop visits (bakeries + clothing shops) for problem validation
* **Pending:** MVP development, cloud deployment, research paper

### 1.4 Change Log
| Date | Version | Change Description | Author |
| :--- | :---: | :萊 | :--- |
| 2026-09-06 | 1.0 | Initial PRD with PostgreSQL + Airflow + Metabase stack | Team |
| 2026-09-14 | 1.5 | Added RAG + Text-to-SQL sync architecture diagrams | Team |
| 2026-09-27 | 2.0 | **MAJOR REVISION:** Dropped RDS, Airflow, Metabase, PostgreSQL server. Replaced with DuckDB + SQLite + APScheduler + Streamlit. Budget and memory constraints identified as critical. | Team |

---

## Section 2: Problem Statement

### 2.1 The Core Problem
Small and Medium Enterprises (SMEs) in India — bakeries, clothing shops, pharmacies, manufacturing units — generate substantial business data daily (sales, inventory, customer records) but cannot extract actionable insights because:

1. **Technical Barrier:** Owners lack SQL, Python, or BI tool expertise. They are accountants, bakers, tailors — not data analysts.
2. **Cost Barrier:** Enterprise BI tools (Tableau, Power BI, Snowflake) cost Rs. 3–5 lakh annually. Hiring a data analyst costs Rs. 4,00,000/year. SMEs operate on 8–12% margins and cannot afford this.
3. **Tool Fragmentation:** Existing solutions require separate tools for storage (Excel), cleaning (manual), querying (SQL), and visualization (Power BI). No unified affordable platform exists.
4. **Trust Barrier:** Standalone LLMs hallucinate. Existing open-source Text-to-SQL tools lack production guardrails. One wrong `DELETE` query can destroy years of business records.

### 2.2 Target Users (Validated Through Field Research)
* **Primary Users:** 
  * Local bakery owners (Kolhapur/Vathar/Pune belt)
  * Clothing shop owners (men's/women's/kids wear)
* **Future Expansion:** Pharmacies, coaching institutes, auto-component suppliers
* **User Profile:**
  * **Age:** 35–55 years
  * **Education:** 10th pass to graduate (non-technical)
  * **Tech Comfort:** Smartphone user, WhatsApp active, no coding knowledge
  * **Language Preference:** Marathi > Hindi > English
  * **Daily Workflow:** Opens shop at 8 AM, closes at 9 PM, no time for learning software

### 2.3 User Pain Points
| Pain Point ID | Description | Frequency | Severity | Source |
| :---: | :--- | :---: | :---: | :--- |
| PP-001 | No digital sales tracking | TBD | TBD | Field visit |
| PP-002 | Don't know best-selling item | TBD | TBD | Field visit |
| PP-003 | No profit-per-item calculation | TBD | TBD | Field visit |
| PP-004 | Inventory stockouts / overstock | TBD | TBD | Field visit |
| PP-005 | Seasonal buying mistakes | TBD | TBD | Field visit |

> *Note: This table will be populated after completing 20 shop visits (10 bakeries + 10 clothing shops) during Phase 1.*

---

## Section 3: Solution Overview

### 3.1 Product Definition
DOCIQ is a cloud-native, AI-powered analytics platform that enables non-technical SME owners to:
1. **Upload** business data (CSV/Excel files) through a simple web interface.
2. **Ask** analytical questions in plain English (e.g., *"Which product made the most profit last month?"*).
3. **Receive** instant, visualized insights with confidence scores.
4. **View** executive dashboards that update automatically.
5. **Schedule** email reports (weekly/monthly summaries).

### 3.2 Unique Value Proposition
Unlike existing tools, DOCIQ combines five capabilities in **ONE** platform:

| Capability | Existing Tools | DOCIQ |
| :--- | :--- | :--- |
| **Data ingestion + cleaning** | Manual Excel / separate ETL tools | Built-in auto-cleaning pipeline |
| **Natural language querying** | Developer-only (Chat2DB) | Non-technical owner friendly |
| **Schema-aware AI retrieval** | Static schema dumping | RAG-based dynamic retrieval |
| **Query safety** | No guardrails | 4-stage guardrail layer |
| **Visualization + dashboards** | Separate BI tool (Metabase/Power BI) | Integrated Streamlit dashboards |
| **Cloud deployment** | Manual setup / expensive SaaS | Terraform IaC, under Rs. 2,500/mo |

### 3.3 Key Differentiators
1. **RAG-Enhanced Schema Retrieval:** Unlike typical Text-to-SQL systems that dump the entire database schema into the LLM prompt, DOCIQ uses RAG to fetch **ONLY** the relevant schema context for each specific question.
2. **Production Guardrails:** A 4-stage validation layer (destructive query blocking, syntax validation, semantic verification, confidence scoring) ensures non-technical users cannot accidentally damage data.
3. **Embedded Analytics Engine:** Uses DuckDB (columnar, in-process) instead of a separate PostgreSQL server, delivering 10–100x faster analytical queries while fitting within 4GB RAM constraints.
4. **Student-Budget Cloud:** Entire platform deploys on a single AWS EC2 t3.medium instance using Docker Compose and Terraform, eliminating expensive managed services (RDS, Airflow, Metabase).

---

## Section 4: System Architecture

### 4.1 High-Level Architecture
```text
[ Client Layer: Streamlit UI ]
             │
             ▼
[ Application Layer: FastAPI Gateway ] ──► (Upload / ETL / AI Chat / Dashboard Services)
             │
             ▼
[ Data Layer (Embedded) ] ──► SQLite (Metadata) | DuckDB (Analytics) | ChromaDB (Vector Store) | S3 (Backups)
             │
             ▼
[ AI / ML Layer ] ──► LangChain Orchestrator + Groq/OpenAI LLMs + BGE Embeddings
             │
             ▼
[ Infrastructure Layer ] ──► Docker Compose + Terraform + GitHub Actions on AWS EC2 (t3.medium)