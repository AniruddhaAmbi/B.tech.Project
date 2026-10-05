
================================================================================
                    DOCIQ — PRODUCT REQUIREMENTS DOCUMENT
================================================================================
Document Version: 2.0 (Revised Architecture)
Last Updated: 2026-09-27
Status: Active Development
Classification: Internal / Academic

================================================================================
SECTION 0: DOCUMENT PURPOSE
================================================================================

This PRD serves as the single source of truth for the DOCIQ project. It contains
all architectural decisions, technical specifications, research references, and
project context required to:

1. Onboard new team members without verbal explanation
2. Feed into any AI model (ChatGPT, Claude, Gemini, etc.) for context-aware assistance
3. Share with academic guides, sponsors, or evaluators as a standalone document
4. Maintain consistency across all project artifacts (synopsis, PPT, code, papers)

DO NOT modify this document without team consensus. All changes must be logged
in Section 1.4 (Change Log).

================================================================================
SECTION 1: PROJECT OVERVIEW
================================================================================

1.1 PROJECT IDENTITY
--------------------
Project Name:        DOCIQ (Document Intelligence Query)
Full Title:          DOCIQ — AI-Powered Data Analytics Tool for SMEs
Tagline:             "Ask your business data questions in plain English. Get answers in seconds."
Project Type:        B.Tech Final Year Dissertation (Non-Sponsored, seeking sponsorship)
Duration:            September 2026 — April 2027 (8 months)
Institution:         Ashokrao Mane Group of Institutions, Vathar, Kolhapur
Department:          Artificial Intelligence and Data Science

1.2 TEAM COMPOSITION
--------------------
| Role                  | Name                  | Roll No.   | Career Goal                    |
|-----------------------|-----------------------|------------|--------------------------------|
| Team Member 1         | Aniruddha Madan Ambi  | 01         | Jr. Data Scientist / AI Engineer|
| Team Member 2         | Shreenath Amol Tambe  | 66         | Cloud Engineer                  |
| Team Member 3         | Yakub Rafik Nadaf     | 38         | Data Analyst / Data Engineer    |
| Guide                 | Mrs. G. G. Desai      | —          | Faculty, Dept. of AI&DS         |

1.3 PROJECT STATUS
------------------
Current Phase:        Phase 1 — Problem Validation & Field Research
Completed:            Synopsis draft, architecture diagrams, tech stack finalization
In Progress:          Local SME shop visits (bakeries + clothing shops) for problem validation
Pending:              MVP development, cloud deployment, research paper

1.4 CHANGE LOG
--------------
| Date       | Version | Change Description                                      | Author         |
|------------|---------|--------------------------------------------------------|----------------|
| 2026-09-06 | 1.0     | Initial PRD with PostgreSQL + Airflow + Metabase stack | Team           |
| 2026-09-14 | 1.5     | Added RAG + Text-to-SQL sync architecture diagrams     | Team           |
| 2026-09-27 | 2.0     | MAJOR REVISION: Dropped RDS, Airflow, Metabase, PostgreSQL server. Replaced with DuckDB + SQLite + APScheduler + Streamlit. Budget and memory constraints identified as critical. | Team           |

================================================================================
SECTION 2: PROBLEM STATEMENT
================================================================================

2.1 THE CORE PROBLEM
--------------------
Small and Medium Enterprises (SMEs) in India — bakeries, clothing shops, pharmacies,
manufacturing units — generate substantial business data daily (sales, inventory,
customer records) but cannot extract actionable insights because:

1. TECHNICAL BARRIER: Owners lack SQL, Python, or BI tool expertise. They are
   accountants, bakers, tailors — not data analysts.

2. COST BARRIER: Enterprise BI tools (Tableau, Power BI, Snowflake) cost Rs. 3-5
   lakh annually. Hiring a data analyst costs Rs. 4,00,000/year. SMEs operate on
   8-12% margins and cannot afford this.

3. TOOL FRAGMENTATION: Existing solutions require separate tools for storage
   (Excel), cleaning (manual), querying (SQL), and visualization (Power BI). No
   unified affordable platform exists.

4. TRUST BARRIER: Standalone LLMs hallucinate. Existing open-source Text-to-SQL
   tools lack production guardrails. One wrong DELETE query can destroy years of
   business records.

2.2 TARGET USERS (VALIDATED THROUGH FIELD RESEARCH)
----------------------------------------------------
Primary Users:
- Local bakery owners (Kolhapur/Vathar/Pune belt)
- Clothing shop owners (men's/women's/kids wear)
- Future expansion: pharmacies, coaching institutes, auto-component suppliers

User Profile:
- Age: 35-55 years
- Education: 10th pass to graduate (non-technical)
- Tech comfort: Smartphone user, WhatsApp active, no coding knowledge
- Language preference: Marathi > Hindi > English
- Daily workflow: Opens shop at 8 AM, closes at 9 PM, no time for learning software

2.3 USER PAIN POINTS (FROM FIELD VISITS — TO BE FILLED)
--------------------------------------------------------
| Pain Point ID | Description | Frequency | Severity | Source |
|---------------|-------------|-----------|----------|--------|
| PP-001        | No digital sales tracking | TBD | TBD | Field visit |
| PP-002        | Don't know best-selling item | TBD | TBD | Field visit |
| PP-003        | No profit-per-item calculation | TBD | TBD | Field visit |
| PP-004        | Inventory stockouts / overstock | TBD | TBD | Field visit |
| PP-005        | Seasonal buying mistakes | TBD | TBD | Field visit |

*Note: This table will be populated after completing 20 shop visits (10 bakeries +
10 clothing shops) during Phase 1.*

================================================================================
SECTION 3: SOLUTION OVERVIEW
================================================================================

3.1 PRODUCT DEFINITION
----------------------
DOCIQ is a cloud-native, AI-powered analytics platform that enables non-technical
SME owners to:

1. UPLOAD business data (CSV/Excel files) through a simple web interface
2. ASK analytical questions in plain English (e.g., "Which product made the most
   profit last month?")
3. RECEIVE instant, visualized insights with confidence scores
4. VIEW executive dashboards that update automatically
5. SCHEDULE email reports (weekly/monthly summaries)

All without writing a single line of SQL or code.

3.2 UNIQUE VALUE PROPOSITION
-----------------------------
Unlike existing tools, DOCIQ combines five capabilities in ONE platform:

| Capability | Existing Tools | DOCIQ |
|------------|---------------|-------|
| Data ingestion + cleaning | Manual Excel / separate ETL tools | Built-in auto-cleaning pipeline |
| Natural language querying | Developer-only (Chat2DB) | Non-technical owner friendly |
| Schema-aware AI retrieval | Static schema dumping | RAG-based dynamic retrieval |
| Query safety | No guardrails | 4-stage guardrail layer |
| Visualization + dashboards | Separate BI tool (Metabase/Power BI) | Integrated Streamlit dashboards |
| Cloud deployment | Manual setup / expensive SaaS | Terraform IaC, under Rs. 2,500/mo |

3.3 KEY DIFFERENTIATORS
-----------------------
1. RAG-ENHANCED SCHEMA RETRIEVAL: Unlike typical Text-to-SQL systems that dump
   the entire database schema into the LLM prompt (wasting tokens and confusing
   the model), DOCIQ uses Retrieval-Augmented Generation to fetch ONLY the
   relevant schema context for each specific question.

2. PRODUCTION GUARDRAILS: A 4-stage validation layer (destructive query blocking,
   syntax validation, semantic verification, confidence scoring) ensures that
   non-technical users cannot accidentally damage their data.

3. EMBEDDED ANALYTICS ENGINE: Uses DuckDB (columnar, in-process) instead of a
   separate PostgreSQL server, delivering 10-100x faster analytical queries while
   fitting within 4GB RAM constraints.

4. STUDENT-BUDGET CLOUD: Entire platform deploys on a single AWS EC2 t3.medium
   instance using Docker Compose and Terraform, eliminating expensive managed
   services (RDS, Airflow, Metabase).

================================================================================
SECTION 4: SYSTEM ARCHITECTURE
================================================================================

4.1 HIGH-LEVEL ARCHITECTURE
---------------------------

┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                      │
│  Streamlit UI (Chat + File Upload + Dashboards + Report Scheduler)         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                                    │
│  FastAPI Gateway → Auth Middleware → Rate Limiter → Service Router         │
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Upload   │  │ ETL      │  │ AI Chat  │  │ Dashboard│  │ Report   │     │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │  │ Service  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER (Embedded)                              │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ SQLite       │  │ DuckDB       │  │ ChromaDB     │  │ APScheduler  │   │
│  │ (App Meta-   │  │ (Analytics   │  │ (Embedded,   │  │ (Lightweight │   │
│  │  data)       │  │  Data)       │  │  SQLite bknd)│  │  Scheduler)  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ S3 Bucket (Raw CSV/Excel file backup)                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AI / ML LAYER                                     │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                │
│  │ LangChain      │  │ LLM API        │  │ BGE Embedding  │                │
│  │ Orchestrator   │  │ (Groq/OpenAI)  │  │ Model          │                │
│  └────────────────┘  └────────────────┘  └────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INFRASTRUCTURE LAYER                                 │
│  Docker Compose + Terraform (IaC) + GitHub Actions (CI/CD)                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AWS CLOUD (ap-south-1)                              │
│  EC2 t3.medium (4GB RAM) + S3 + IAM + CloudWatch                           │
└─────────────────────────────────────────────────────────────────────────────┘

4.2 COMPONENT DETAILS
---------------------

4.2.1 CLIENT LAYER — Streamlit
- Purpose: Single-page web application for non-technical users
- Responsibilities: File upload drag-and-drop, AI chat interface, dashboard
  rendering, report scheduling form
- Why Streamlit: Python-native, rapid prototyping, built-in charts, minimal
  frontend code. Team has Python expertise, not React/JS expertise.
- RAM footprint: ~200 MB

4.2.2 APPLICATION LAYER — FastAPI
- Purpose: High-performance REST API backend
- Responsibilities: HTTP request handling, authentication (JWT), file validation,
  service orchestration, response formatting
- Why FastAPI: Async support, automatic OpenAPI docs, Pydantic validation,
  Python-native (same language as AI layer)
- RAM footprint: ~100 MB

4.2.3 DATA LAYER — SQLite
- Purpose: Lightweight, embedded relational database for application metadata
- Stores: User accounts, file upload records, query history, scheduled report
  configurations, audit logs
- Why SQLite: Zero configuration, single file (.db), no server process, perfect
  for low-write, read-heavy metadata
- RAM footprint: ~50 MB (shared with application process)

4.2.4 DATA LAYER — DuckDB
- Purpose: High-performance analytical database for business data
- Stores: Cleaned CSV data, aggregated metrics, SQL views (Gold layer), query
  results cache
- Why DuckDB:
  - Embedded (in-process, no server)
  - Columnar storage (10-100x faster than row-store for aggregations)
  - Reads CSV directly without import
  - PostgreSQL-compatible SQL dialect
  - Single-file database (.duckdb)
  - Zero idle RAM footprint
- RAM footprint: ~100 MB when active (query execution), near-zero when idle
- Limitation: Single-writer concurrency. For a demo/viva with one user at a time,
  this is acceptable.

4.2.5 DATA LAYER — ChromaDB (Embedded)
- Purpose: Vector store for schema metadata embeddings
- Stores: Table names, column names, data types, constraints, business rule
  mappings as vector embeddings
- Why ChromaDB: Can run in embedded mode with SQLite backend (no separate
  server), integrates with LangChain, supports cosine similarity search
- RAM footprint: ~200 MB

4.2.6 DATA LAYER — APScheduler
- Purpose: Lightweight job scheduler for ETL pipelines and email reports
- Responsibilities: Trigger data cleaning after upload, schedule weekly email
  reports, run data quality checks
- Why APScheduler (instead of Apache Airflow):
  - Python library (not a separate service)
  - Runs inside FastAPI process
  - ~50 MB RAM vs Airflow's ~2,000 MB
  - No web UI overhead, no scheduler/executor/worker complexity
  - Perfect for 5-10 scheduled jobs, not 500
- RAM footprint: ~50 MB

4.2.7 AI / ML LAYER — LangChain
- Purpose: Orchestration framework connecting LLMs, retrievers, and tools
- Responsibilities: RAG pipeline construction, SQL agent management, prompt
  templating, chain composition
- Why LangChain: Mature ecosystem, built-in SQLDatabaseChain, easy integration
  with vector stores, extensive documentation

4.2.8 AI / ML LAYER — LLM API (Groq / OpenAI)
- Purpose: Large Language Model inference for Text-to-SQL generation
- Primary: Groq API (free tier available, fast inference, supports Llama 3,
  Mixtral)
- Fallback: OpenAI GPT-4o (paid, higher accuracy)
- Why Groq primary: 10x faster inference than OpenAI, free tier sufficient for
  development, lower cost for production

4.2.9 AI / ML LAYER — BGE Embeddings
- Purpose: Convert text (schema metadata, user queries) into dense vectors
- Model: BGE-small-en-v1.5 (lightweight, 384-dimensional, sufficient for schema
  retrieval)
- Why BGE: Open-source, runs locally (no API cost), state-of-the-art for
  retrieval tasks, small model size (~100 MB)

4.2.10 INFRASTRUCTURE — Docker Compose
- Purpose: Container orchestration for local development and production
- Containers: Single container running FastAPI + Streamlit + all embedded services
- Why Docker Compose (not Kubernetes): Single-node deployment, no need for
  orchestration complexity, team is learning Docker, not K8s

4.2.11 INFRASTRUCTURE — Terraform
- Purpose: Infrastructure-as-Code for AWS resource provisioning
- Manages: EC2 instance, S3 bucket, IAM roles, security groups, VPC
- Why Terraform: Version-controlled infrastructure, reproducible deployment,
  cloud engineer resume skill

4.2.12 INFRASTRUCTURE — GitHub Actions
- Purpose: CI/CD pipeline for automated testing and deployment
- Triggers: Push to main branch → run tests → build Docker image → deploy to EC2
- Why GitHub Actions: Free for public repositories, native GitHub integration,
  no separate CI server needed

4.3 WHAT WAS DROPPED AND WHY
----------------------------

| Dropped Component | Original Reason | Why Dropped | Replacement |
|-------------------|-----------------|-------------|-------------|
| AWS RDS (PostgreSQL) | Managed database | Rs. 1,580/month. Overkill for Excel uploads. | SQLite + DuckDB (embedded, Rs. 0) |
| Apache Airflow | ETL orchestration | 2,000 MB RAM idle. Built for Facebook-scale. | APScheduler (50 MB, in-process) |
| Metabase | BI dashboards | 1,000 MB RAM. Java-based separate server. | Streamlit native charts (0 extra RAM) |
| PostgreSQL Server | Primary database | 512+ MB RAM, client-server complexity. | DuckDB (embedded, faster for analytics) |

4.4 MEMORY BUDGET (t3.medium = 4,096 MB)
-----------------------------------------
| Component | RAM (MB) | Notes |
|-----------|----------|-------|
| Streamlit UI | 200 | Frontend rendering |
| FastAPI Backend | 100 | API request handling |
| SQLite | 50 | Shared with app process |
| DuckDB (active) | 100 | Query execution only |
| ChromaDB Embedded | 200 | Vector search |
| APScheduler | 50 | Job scheduling |
| Docker Overhead | 256 | Container runtime |
| OS (Amazon Linux) | 512 | Base system |
| Buffer / Headroom | 500 | Safety margin |
| **TOTAL** | **~1,968** | **Well under 4,096 MB limit** |

================================================================================
SECTION 5: FEATURE SPECIFICATIONS
================================================================================

5.1 FEATURE: Smart Data Ingestion
---------------------------------
User Story: As a bakery owner, I want to upload my daily sales Excel file so
that the system can read and clean it automatically.

Acceptance Criteria:
- [ ] User can drag-and-drop or select CSV/Excel (.xlsx, .xls) files
- [ ] File size limit: 50 MB per file
- [ ] Automatic detection of file format, encoding (UTF-8, UTF-16-BOM), delimiter
- [ ] Automatic data type inference (date, number, text, boolean)
- [ ] Auto-correction of common issues:
  - Missing values: flagged, optional imputation (mean for numeric, mode for categorical)
  - Duplicate rows: detected and optionally removed
  - Inconsistent formats: date standardization (DD-MM-YYYY), currency normalization
  - Extra whitespace: trimmed
- [ ] Data quality report generated: null count per column, duplicate count,
  type inference summary
- [ ] Cleaned data stored in DuckDB with original file backed up to S3
- [ ] Processing time: < 30 seconds for 100,000 rows

Technical Implementation:
- Library: Pandas (primary), Polars (optional for large files)
- File parsing: openpyxl (Excel), csv (CSV)
- Validation: Pydantic models for schema validation
- Storage flow: Raw file → S3 → Pandas cleaning → DuckDB

5.2 FEATURE: RAG-Powered Schema Understanding
---------------------------------------------
User Story: As a non-technical user, when I ask "What were my top 5 products
by revenue in March?", the AI should know which tables and columns are relevant.

Acceptance Criteria:
- [ ] After data upload, system automatically extracts schema metadata:
  - Table names, column names, data types, constraints
  - Sample values (first 5 rows per column)
  - Business rule mappings (configurable: "revenue" = "amount * quantity")
- [ ] Schema metadata is chunked and embedded using BGE model
- [ ] Embeddings stored in ChromaDB with metadata tags
- [ ] When user asks a question, query is embedded and top-K (K=3-5) relevant
  schema chunks retrieved via cosine similarity
- [ ] Retrieved schema context is injected into the Text-to-SQL prompt
- [ ] Retrieval latency: < 500ms
- [ ] Retrieval accuracy: >= 85% (relevant schema in top-3 results)

Technical Implementation:
- Embedding: sentence-transformers (BGE-small-en-v1.5)
- Vector store: ChromaDB (embedded mode, SQLite backend)
- Retrieval: LangChain Chroma retriever with MMR (Maximal Marginal Relevance)
- Context injection: Prompt template with {schema_context} variable

5.3 FEATURE: Natural Language to SQL (Text-to-SQL)
--------------------------------------------------
User Story: As a non-technical user, I want to type "Show me sales this month"
and get a chart, without knowing SQL.

Acceptance Criteria:
- [ ] User types question in English (supports Marathi/Hindi transliteration
  in future versions)
- [ ] System generates SQL query using LLM with schema context
- [ ] SQL query is validated by 4-stage guardrails:
  Stage 1: Destructive Query Blocker
    - Blocks: DROP, DELETE, UPDATE, INSERT, ALTER, TRUNCATE, CREATE, GRANT
    - Only SELECT and WITH (CTEs) allowed
    - Regex + keyword matching
  Stage 2: Syntax Validator
    - SQL parsed using sqlparse / DuckDB parser
    - Validates table/column names exist in schema
    - Checks for unclosed quotes, invalid functions
  Stage 3: Semantic Validator
    - LLM checks if generated SQL actually answers the user's question
    - Compares intent (from NL) vs. query structure
    - Flags mismatches (e.g., user asked for "profit", SQL sums "revenue")
  Stage 4: Confidence Scorer
    - Execution consistency: Run SQL 3 times, check if results are identical
    - Verbalized confidence: LLM self-assesses confidence (High/Medium/Low)
    - Combined score displayed to user
- [ ] Valid SQL executes on DuckDB
- [ ] Results formatted as table + auto-generated chart
- [ ] Query explanation shown: "This query sums the 'amount' column grouped by
  'product_name' for dates in March 2026"
- [ ] Average latency: < 5 seconds from question to chart
- [ ] SQL execution success rate: >= 85% on test benchmark

Technical Implementation:
- LLM: Groq API (Llama 3.1 70B) primary, OpenAI GPT-4o fallback
- Prompting: Few-shot examples with schema context, chain-of-thought for complex queries
- SQL parsing: sqlparse library
- Execution: DuckDB Python API (duckdb.query())
- Fallback: If SQL fails, LLM regenerates with error feedback (self-correction loop)

5.4 FEATURE: Auto-Visualization
-------------------------------
User Story: As a user, I want to see my data as charts, not just tables.

Acceptance Criteria:
- [ ] System auto-detects chart type based on query result structure:
  - Single value → Metric card (big number)
  - Two columns (category + value) → Bar chart
  - Time series (date + value) → Line chart
  - Proportional data → Pie chart / Donut chart
  - Multi-series → Grouped bar / Multi-line chart
- [ ] Charts rendered using Plotly (interactive) or Streamlit native charts
- [ ] One-click download: PNG image, CSV data, PDF report
- [ ] Chart title auto-generated from query intent
- [ ] Mobile-responsive chart rendering

Technical Implementation:
- Chart library: Plotly Express (primary), Streamlit st.bar_chart() (fallback)
- Auto-detection: Rule-based heuristics on result DataFrame shape + column types
- Export: Plotly write_image() for PNG, Pandas to_csv() for CSV, ReportLab for PDF

5.5 FEATURE: Executive BI Dashboard
-----------------------------------
User Story: As a shop owner, I want a dashboard that shows my key metrics at
a glance every morning.

Acceptance Criteria:
- [ ] Pre-built dashboard templates for common SME needs:
  - Sales Overview: Total revenue, order count, average order value, trend
  - Product Performance: Top 10 products by revenue, quantity, profit margin
  - Inventory Alerts: Low stock items, dead stock identification, reorder suggestions
  - Customer Insights: New vs. returning customers, top customers by spend
- [ ] Dashboard auto-refreshes when new data is uploaded
- [ ] Date range filter: Today, This Week, This Month, Custom Range
- [ ] All charts interactive (hover for details, zoom, pan)
- [ ] Dashboard loads in < 3 seconds

Technical Implementation:
- Framework: Streamlit (st.metric(), st.columns(), st.dataframe())
- Data source: DuckDB pre-computed views (Gold layer)
- Caching: Streamlit @st.cache_data decorator for query results

5.6 FEATURE: Scheduled Email Reports
------------------------------------
User Story: As a busy shop owner, I want a weekly summary email so I don't
have to log in every day.

Acceptance Criteria:
- [ ] User can schedule reports: Daily, Weekly (day selectable), Monthly
- [ ] Report contains: Key metrics summary, top products, inventory alerts,
  trend comparison (vs. previous period)
- [ ] Report sent as HTML email with embedded charts
- [ ] Email delivery via SMTP (Gmail, SendGrid, or AWS SES)
- [ ] Report generation time: < 60 seconds
- [ ] Delivery confirmation logged

Technical Implementation:
- Scheduler: APScheduler (CronTrigger for weekly/monthly)
- Email: Python smtplib + email.mime for HTML emails
- Chart embedding: Base64-encoded PNG images in HTML
- Template: Jinja2 HTML templates for report layout

5.7 FEATURE: Conversation Memory
--------------------------------
User Story: As a user, I want to ask follow-up questions without repeating
context.

Acceptance Criteria:
- [ ] System remembers previous 5 questions in a session
- [ ] Follow-up questions resolved using context:
  - User: "Show me sales this month"
  - User: "What about last month?" → System understands "sales last month"
- [ ] Context cleared on logout or after 30 minutes of inactivity
- [ ] Conversation history stored in SQLite

Technical Implementation:
- Storage: SQLite table (session_id, question, sql, timestamp)
- Context injection: Last 3 Q&A pairs appended to prompt
- Session management: UUID-based session IDs, JWT token association

================================================================================
SECTION 6: TECHNOLOGY STACK (DEFINITIVE)
================================================================================

6.1 PROGRAMMING LANGUAGES
-------------------------
| Language | Usage | Version |
|----------|-------|---------|
| Python   | Backend, AI, data processing, automation | 3.11+ |
| SQL      | Database queries, views, analytics | DuckDB dialect |
| HTML/CSS | Email templates, minimal frontend styling | — |

6.2 CORE LIBRARIES & FRAMEWORKS
-------------------------------
| Category | Tool | Version | Purpose |
|----------|------|---------|---------|
| Web Framework | FastAPI | 0.115+ | REST API backend |
| Web Framework | Streamlit | 1.40+ | Frontend UI |
| Data Processing | Pandas | 2.2+ | Data cleaning, transformation |
| Data Processing | Polars | 1.0+ | Optional: faster alternative to Pandas |
| Database (Analytics) | DuckDB | 1.0+ | Embedded analytical database |
| Database (Metadata) | SQLite | 3.45+ | Embedded app metadata store |
| Vector Store | ChromaDB | 0.5+ | Schema embeddings (embedded mode) |
| AI Orchestration | LangChain | 0.3+ | LLM chains, RAG, SQL agents |
| AI Orchestration | LangChain-Community | latest | DuckDB, ChromaDB integrations |
| LLM Client | Groq | 0.9+ | Fast LLM inference API |
| LLM Client | OpenAI | 1.50+ | Fallback LLM API |
| Embeddings | sentence-transformers | 3.0+ | BGE model loading |
| Scheduling | APScheduler | 3.10+ | Job scheduling (in-process) |
| Validation | Pydantic | 2.9+ | Data model validation |
| ORM | SQLAlchemy | 2.0+ | Database abstraction (SQLite) |
| Migrations | Alembic | 1.13+ | Database schema migrations |
| SQL Parsing | sqlparse | 0.5+ | SQL syntax validation |
| Charts | Plotly | 5.24+ | Interactive visualizations |
| Charts | Plotly Express | bundled | Simplified chart API |
| Email | smtplib | stdlib | Email sending |
| Templates | Jinja2 | 3.1+ | HTML email templates |
| Testing | pytest | 8.3+ | Unit and integration testing |
| HTTP Client | httpx | 0.27+ | Async HTTP requests |
| Auth | python-jose | 3.3+ | JWT token handling |
| Auth | passlib | 1.7+ | Password hashing |
| Environment | python-dotenv | 1.0+ | Environment variable management |
| File Parsing | openpyxl | 3.1+ | Excel file reading |
| File Parsing | xlrd | 2.0+ | Legacy Excel support |

6.3 INFRASTRUCTURE & DEVOPS
---------------------------
| Category | Tool | Version | Purpose |
|----------|------|---------|---------|
| Containerization | Docker | 27+ | Application packaging |
| Containerization | Docker Compose | 2.29+ | Multi-service orchestration |
| IaC | Terraform | 1.9+ | AWS resource provisioning |
| CI/CD | GitHub Actions | — | Automated testing and deployment |
| Web Server | Nginx | 1.26+ | Reverse proxy, SSL termination |
| Process Manager | systemd | — | Service management on EC2 |

6.4 CLOUD SERVICES (AWS)
------------------------
| Service | Usage | Cost (Monthly) |
|---------|-------|----------------|
| EC2 t3.medium | Compute instance (2 vCPU, 4GB RAM) | ~Rs. 3,100 |
| S3 Standard | Raw file storage (~20GB) | ~Rs. 40 |
| IAM | User roles, permissions, access keys | Rs. 0 |
| CloudWatch | Logs, basic monitoring | Rs. 0 (within free tier) |
| VPC | Network isolation, security groups | Rs. 0 |
| **TOTAL** | | **~Rs. 3,140** |

*Note: AWS Free Tier (12 months) provides 750 hours/month of t2/t3.micro. For
t3.medium, On-Demand pricing applies. AWS Educate credits can reduce this cost.*

6.5 EXTERNAL APIs
-----------------
| Service | Purpose | Cost Model |
|---------|---------|------------|
| Groq API | LLM inference (Text-to-SQL) | Free tier: 1M tokens/day. Paid: $0.59/M tokens |
| OpenAI API | Fallback LLM (GPT-4o) | Pay-per-use: $2.50/M input, $10/M output |
| SendGrid / Gmail SMTP | Email report delivery | Free tier: 100 emails/day |

6.6 DEVELOPMENT TOOLS
---------------------
| Tool | Purpose |
|------|---------|
| VS Code | Primary IDE |
| Git + GitHub | Version control |
| Postman / HTTPie | API testing |
| Jupyter Notebook | Data exploration, prototyping |
| Obsidian | Project knowledge management (second brain) |

================================================================================
SECTION 7: DATA ARCHITECTURE
================================================================================

7.1 MEDALLION ARCHITECTURE
--------------------------

BRONZE LAYER (Raw Data)
- Source: Uploaded CSV/Excel files
- Storage: S3 bucket (raw_files/)
- Format: Original file format (CSV, XLSX)
- Purpose: Immutable backup, audit trail, reprocessing capability
- Retention: 90 days (configurable)

SILVER LAYER (Cleaned Data)
- Source: Bronze → Pandas cleaning pipeline
- Storage: DuckDB tables
- Format: Parquet-backed DuckDB tables
- Transformations:
  - Type casting (inferred → explicit)
  - Null handling (flagging, optional imputation)
  - Duplicate removal
  - Date standardization
  - Column name sanitization (snake_case)
- Purpose: Query-ready, consistent schema

GOLD LAYER (Business Metrics)
- Source: Silver → SQL views and pre-aggregated tables
- Storage: DuckDB views and materialized tables
- Examples:
  - vw_daily_sales: date, total_revenue, total_orders, avg_order_value
  - vw_top_products: product_name, total_revenue, total_quantity, rank
  - vw_inventory_alerts: product_name, current_stock, reorder_level, status
  - vw_customer_summary: customer_id, total_spent, order_count, first_order, last_order
- Purpose: Fast dashboard queries, report generation

7.2 SCHEMA METADATA INDEXING (RAG Corpus)
-----------------------------------------
Stored in ChromaDB as text chunks with metadata:

Example chunk:
```
Text: "Table: sales. Columns: id (INTEGER), product_name (VARCHAR), 
       amount (DECIMAL), quantity (INTEGER), sale_date (DATE). 
       Business rule: revenue = amount * quantity."
Metadata: {
  "table": "sales",
  "columns": ["id", "product_name", "amount", "quantity", "sale_date"],
  "types": ["INTEGER", "VARCHAR", "DECIMAL", "INTEGER", "DATE"],
  "business_rules": {"revenue": "amount * quantity"}
}
```

Embedding: BGE-small-en-v1.5 (384 dimensions)
Distance metric: Cosine similarity
Top-K retrieval: K=3-5 per query

7.3 SQLITE SCHEMA (App Metadata)
--------------------------------
Tables:
- users: id, username, email, hashed_password, created_at
- uploads: id, user_id, filename, s3_path, status, created_at
- queries: id, user_id, natural_language, generated_sql, confidence_score,
  execution_time, created_at
- sessions: id, user_id, session_token, expires_at
- reports: id, user_id, schedule_type, email, last_sent, next_send, is_active

================================================================================
SECTION 8: API SPECIFICATION (SUMMARY)
================================================================================

Base URL: https://api.dociq-analytics.in/v1 (production)
         http://localhost:8000/v1 (development)

8.1 AUTHENTICATION
------------------
POST /auth/register
POST /auth/login
POST /auth/refresh

8.2 FILE UPLOAD
---------------
POST /upload
  - Content-Type: multipart/form-data
  - Body: file (CSV/XLSX)
  - Response: { upload_id, filename, status, preview_url }

GET /upload/{upload_id}/status
GET /upload/{upload_id}/preview
GET /upload/{upload_id}/quality-report

8.3 AI CHAT / TEXT-TO-SQL
-------------------------
POST /chat
  - Body: { message, session_id }
  - Response: { 
      natural_language: "Show top products by revenue",
      generated_sql: "SELECT product_name, SUM(amount*quantity) ...",
      confidence_score: "High",
      results: { data: [...], chart_type: "bar", chart_data: {...} },
      explanation: "This query sums revenue grouped by product..."
    }

GET /chat/history?session_id={id}

8.4 DASHBOARD
-------------
GET /dashboard/metrics?date_range=today|week|month|custom
GET /dashboard/top-products?limit=10
GET /dashboard/inventory-alerts
GET /dashboard/customer-insights

8.5 REPORTS
-----------
POST /reports/schedule
  - Body: { type: "weekly", day: "monday", email: "owner@shop.com", metrics: [...] }

GET /reports/{report_id}
DELETE /reports/{report_id}

================================================================================
SECTION 9: EVALUATION METRICS
================================================================================

9.1 TEXT-TO-SQL ACCURACY
------------------------
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| SQL Execution Success Rate | >= 85% | Run 50 test queries, count error-free executions |
| Result Correctness | >= 80% | Manual verification against expected output |
| Schema Linking Accuracy | >= 90% | Check if correct tables/columns were identified |
| Guardrail Block Rate (destructive) | 100% | Attempt 20 destructive queries, verify all blocked |
| Average Latency (NL → Chart) | < 5 sec | Timer from API request to chart render |

9.2 RAG RETRIEVAL QUALITY
-------------------------
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Retrieval Recall@K | >= 85% | Relevant schema in top-3 for 20 test queries |
| Retrieval Precision@K | >= 80% | Of retrieved chunks, % that are relevant |
| Mean Reciprocal Rank (MRR) | >= 0.75 | Average 1/rank of first relevant result |

9.3 SYSTEM PERFORMANCE
----------------------
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| API Response Time (p95) | < 3 sec | Load test with 100 concurrent requests |
| Uptime | >= 99% | CloudWatch monitoring over 2 weeks |
| Cloud Cost (monthly) | < Rs. 3,500 | AWS Cost Explorer |
| Docker Build Time | < 5 min | CI/CD pipeline timing |

9.4 USER EXPERIENCE
-------------------
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Task Completion Rate | >= 90% | 10 non-technical users complete 3 tasks each |
| System Usability Scale (SUS) | >= 70/100 | Standard 10-question SUS survey |
| Net Promoter Score (NPS) | >= 30 | "Would you recommend this to another business?" |

================================================================================
SECTION 10: RESEARCH FOUNDATION
================================================================================

10.1 CORE RESEARCH PAPERS (IEEE STANDARD)
-----------------------------------------
| ID | Title | Authors | Year | Venue | Relevance |
|----|-------|---------|------|-------|-----------|
| R1 | Implementation of RAG in Chatbot Systems for Enhanced Real-Time Customer Support in E-Commerce | J. Benita et al. | 2024 | IEEE Access | Production-grade RAG with hybrid retrieval |
| R2 | RAGNAR: Retrieval-Augmented Generation using Networked and Advanced Relational Data | S. Roychowdhury et al. | 2024 | IEEE ICDE | RAG using relational DB metadata as corpus |
| R3 | OpenRAG: Open-source RAG Architecture for Personalized Learning | R. Shan et al. | 2024 | IEEE ICLT | Modular RAG architecture design |
| T1 | G-SQL: A Schema-Aware and Rule-Guided Approach for Text-to-SQL | H.S. Shalaan et al. | 2025 | IEEE Access | Schema-aware SQL generation with constraints |
| T2 | SQLify Me: An Automated Text-To-SQL Query Generator | A.Y. Mohamed et al. | 2024 | IEEE ICCC | End-to-end NL-to-SQL pipeline |
| T3 | Research and Practice of NL2SQL Technology Based on LLM for Big Data of Enterprise Finance | J. Zhang et al. | 2024 | IEEE Big Data | LLM-based NL2SQL in enterprise settings |

10.2 RESEARCH GAPS ADDRESSED
----------------------------
1. No existing student project implements RAG-based schema retrieval for Text-to-SQL
2. No open-source platform combines ETL + RAG Text-to-SQL + guardrails + dashboards for SMEs
3. No evaluation exists on real-world noisy SME datasets (only benchmark datasets like Spider)
4. No cloud-native, IaC-based deployment targeting student budgets (< Rs. 3,500/month)

10.3 PUBLICATION PLAN
---------------------
Target Venue: IEEE International Conference (Tier B: ICACDS, ICAICR, or CONIT)
Paper Title: "DOCIQ: A Lightweight RAG-Enhanced Text-to-SQL Platform with
             Production Guardrails for SME Analytics"
Submission Timeline: February 2027
Co-author: Mrs. G. G. Desai (Guide)

================================================================================
SECTION 11: PROJECT TIMELINE
================================================================================

| Phase | Duration | Dates | Milestone | Deliverables |
|-------|----------|-------|-----------|--------------|
| Phase 1 | Weeks 1-4 | Sep-Oct 2026 | Problem Validation | 20 shop visits, pain point analysis, requirements doc |
| Phase 2 | Weeks 5-8 | Oct-Nov 2026 | 25% Review | Local MVP (upload + basic chat), architecture diagrams, PPT |
| Phase 3 | Weeks 9-14 | Nov-Dec 2026 | 50% Review | RAG working, Text-to-SQL with guardrails, deployed on AWS |
| Phase 4 | Weeks 15-18 | Jan 2027 | 75% Review | Dashboards, scheduled reports, user testing, evaluation metrics |
| Phase 5 | Weeks 19-22 | Feb 2027 | 100% Final | Production polish, research paper draft, case study |
| Phase 6 | Weeks 23-24 | Mar-Apr 2027 | Viva & Submission | Final report, demo video, paper submission |

================================================================================
SECTION 12: RISK REGISTER
================================================================================

| Risk ID | Risk Description | Probability | Impact | Mitigation |
|---------|-----------------|-------------|--------|------------|
| R1 | AWS costs exceed budget | Medium | High | Use AWS Free Tier, apply for AWS Educate, consider Hetzner fallback |
| R2 | t3.medium OOM crash | Low (mitigated) | High | Revised architecture fits in 1.9GB; monitor with CloudWatch |
| R3 | LLM API rate limits / downtime | Medium | Medium | Implement Groq + OpenAI fallback; cache frequent queries |
| R4 | Shop owners refuse data sharing | Medium | High | Anonymize data, offer free dashboard in exchange, no sensitive PII |
| R5 | Text-to-SQL accuracy below target | Medium | High | Iterate prompts, add more few-shot examples, fine-tune if needed |
| R6 | Team member unavailable / conflict | Low | High | Weekly standups, shared GitHub repo, documented architecture (this PRD) |
| R7 | DuckDB single-writer limitation | Low | Medium | Queue uploads, implement file-level locking, acceptable for demo |

================================================================================
SECTION 13: GLOSSARY
================================================================================

| Term | Definition |
|------|-----------|
| APScheduler | Lightweight Python job scheduler (replaces Apache Airflow) |
| BGE | BAAI General Embedding — open-source text embedding model |
| ChromaDB | Open-source vector database for storing and querying embeddings |
| DuckDB | Embedded, in-process analytical database (columnar storage) |
| ETL | Extract, Transform, Load — data pipeline process |
| FastAPI | Modern, fast Python web framework for building APIs |
| Guardrails | Safety mechanisms preventing harmful or incorrect AI outputs |
| IaC | Infrastructure as Code — managing infrastructure through code (Terraform) |
| LLM | Large Language Model — AI model for text generation (GPT, Llama) |
| MOC | Map of Content — index note linking related concepts (Obsidian) |
| NL | Natural Language — human-readable text (English, Marathi) |
| OOM | Out Of Memory — crash when RAM is exhausted |
| RAG | Retrieval-Augmented Generation — AI technique combining search + generation |
| SME | Small and Medium Enterprise — businesses with < Rs. 50 crore turnover |
| SQL | Structured Query Language — language for database queries |
| Streamlit | Python library for building data apps and dashboards |
| SUS | System Usability Scale — standardized UX questionnaire |
| Text-to-SQL | Converting natural language questions into SQL queries |
| Vector Store | Database optimized for storing and searching high-dimensional vectors |

================================================================================
SECTION 14: APPENDICES
================================================================================

14.1 DIRECTORY STRUCTURE
------------------------
```
dociq/
├── .github/workflows/          # CI/CD pipelines
├── infrastructure/
│   ├── terraform/              # AWS IaC (EC2, S3, IAM, VPC)
│   └── docker/
│       ├── Dockerfile
│       └── docker-compose.yml
├── backend/
│   ├── app/
│   │   ├── api/v1/             # FastAPI routers
│   │   ├── core/               # Auth, guardrails, logging
│   │   ├── services/           # RAG, SQL gen, validator, visualizer
│   │   └── models/             # SQLAlchemy models
│   └── tests/
├── ai/
│   ├── prompts/                # LLM prompt templates
│   ├── embeddings/             # Schema embedder, query embedder
│   ├── rag/                    # Retriever, context builder
│   └── llm/                    # API client, fallback, cost tracker
├── data_engineering/
│   ├── pipelines/              # Bronze, Silver, Gold ETL
│   ├── quality/                # Data validation rules
│   └── sql/                    # Schema definitions, views
├── frontend/
│   └── src/                    # Streamlit pages, components
├── docs/
│   ├── architecture/           # Diagram PNGs
│   ├── presentations/          # 25%, 50%, 75%, 100% PPTs
│   └── research/               # Paper draft, references
└── notebooks/                  # Experimentation, prototyping
```

14.2 ENVIRONMENT VARIABLES (.env)
---------------------------------
```
# AWS
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-south-1
S3_BUCKET_NAME=dociq-raw-files

# Database
DUCKDB_PATH=./data/analytics.duckdb
SQLITE_PATH=./data/app.db
CHROMADB_PATH=./data/chroma

# LLM
GROQ_API_KEY=your_groq_key
OPENAI_API_KEY=your_openai_key
PRIMARY_LLM=groq
FALLBACK_LLM=openai

# App
SECRET_KEY=your_jwt_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_app_password
```

14.3 CONTACT & RESOURCES
------------------------
GitHub Repository: github.com/yourteam/dociq (to be created)
Live Demo URL: dociq-analytics.in (to be deployed)
Project Documentation: Obsidian Vault (local)
Team Communication: WhatsApp Group + Weekly Sunday Standup

================================================================================
                         END OF PRD — DOCIQ v2.0
================================================================================

This document is the single source of truth for the DOCIQ project.
For questions, clarifications, or updates, refer to this PRD before any
external communication.

Last Updated: 2026-09-27
Next Review: 2026-10-15 (after Phase 1 shop visits complete)
