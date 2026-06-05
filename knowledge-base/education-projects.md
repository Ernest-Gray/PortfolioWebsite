# Ernest Gray — Education, Projects, and Early Experience

## Education

**Towson University — Towson, MD**
Bachelor of Science in Computer Science (ABET accredited program)
GPA: 3.86 / 4.0 — Dean's List
Graduated: May 2023

Strong academic foundation in algorithms, data structures, software engineering, operating systems, and computer architecture.

**Harford Community College — Bel Air, MD**
Associate of Science in Computer Science (May 2021)
Associate of Science in Information Technology (May 2020)

---

## Certifications

**SAFe Scrum Master 6.0** — March 2025
Certified in Scaled Agile Framework (SAFe) practices for agile team facilitation, sprint planning, retrospectives, and cross-team coordination in large organizations.

---

## Grayhound Software LLC — Founder & Developer

Ernest founded Grayhound Software LLC to build and ship consumer-facing AI products.

### ChillPilot.com (Aug 2025 – Present)

AI-powered SaaS platform for social media content generation and cross-platform publishing.

**Key work:**
- Architected a multi-platform publishing system integrating LinkedIn, Facebook, YouTube, and Pinterest APIs with OAuth2 authentication flows, token lifecycle management (refresh, revoke, re-auth), rate-limit backoff and recovery, and scheduled publishing workflows.
- Designed an async AI content generation pipeline using Claude Sonnet (Anthropic API) and Celery task workers to generate, review, and publish platform-specific marketing content; each platform's content is generated with its own optimized prompt chain.
- Implemented Stripe subscription enforcement: webhook lifecycle processing, server-side feature gating for paid capabilities, and billing portal integration.
- Built React web interface for content management and scheduling.

**Stack:** Python, React, TypeScript, Celery, Redis, PostgreSQL, Stripe API, Claude Sonnet (Anthropic API), LinkedIn/Facebook/YouTube/Pinterest APIs, OAuth2, Docker.

### LightningFlashcards.com (Apr 2023 – Feb 2024)

AI-assisted flashcard and quiz generation SaaS platform for students.

**Key work:**
- Connected the OpenAI API to the platform backend, allowing students to submit textbook excerpts and auto-generate flashcard sets and quiz questions.
- Integrated Stripe for online payments, automated billing, and credential storage.
- Designed and built a MySQL database schema for users, flashcards, quizzes, and analytics.
- Introduced multi-network ad attribution with Google, Facebook, TikTok, and Reddit pixels, enabling conversion tracking from ad click to signup and informing ad spend prioritization.

**Stack:** Python, JavaScript, MySQL, Stripe API, OpenAI API, HTML/CSS.

---

## InfoSys — AI Software Engineer Intern

**June 2022 – August 2022**

- Automated camera configuration for a computer vision AI system — programmatically adjusted rotation, field of view, zoom, brightness, and contrast to maximize model training input quality.
- Produced full technical documentation (flowcharts, sequence diagrams, user manual) and presented results to mentor, engineering management, and the broader team.
- Led a team of 4 in an internal hackathon: designed, built, and demoed a VR application with original 3D assets and an accompanying website (C#, Unity, HTML/CSS).

**Stack:** Python, TensorFlow, Computer Vision, C#, Unity.

---

## Open Source Contributions

1. **awslabs/LISA — PR #919:** Fixed liteLLM model-identifier double-prefix bug, unblocking Claude Code integration with LISA-hosted models. https://github.com/awslabs/LISA/pull/919

2. **awslabs/mlspace — PR #362:** Designed and shipped workforce portal URL surfacing for SageMaker Ground Truth labeling jobs with 4-region URL mapping. https://github.com/awslabs/mlspace/pull/362

3. **awslabs/mlspace — PR #364:** Drove multi-package dependency uplift with full end-to-end validation and added testing checklist to the project's developer guide. https://github.com/awslabs/mlspace/pull/364

---

## Technical Skills (Complete List)

**Languages:** Python, TypeScript, JavaScript, C++, C#, Java, MATLAB, Shell, Assembly
**Cloud (AWS):** Lambda, API Gateway, SQS FIFO, DynamoDB, CloudWatch (metrics, alarms, dashboards), Secrets Manager, SSM Parameter Store, IAM, S3, Step Functions, EMR, SageMaker (Ground Truth, training, notebooks), Bedrock (Converse API, Guardrails, Knowledge Bases), Kendra
**Infrastructure as Code:** AWS CDK (TypeScript), CloudFormation, Alembic
**GenAI / RAG:** Bedrock Converse API, Bedrock Guardrails, Kendra retrieval, pgvector, OpenAI Embeddings, Claude (Anthropic) API, liteLLM, prompt engineering, structured output parsing
**Full Stack:** React, Angular, Vite, Tailwind CSS, HTML/CSS, Node.js, FastAPI, REST API design, OAuth2
**Data & ML:** PyTorch, TensorFlow, NumPy, Pandas, SVM, signal processing, embedded ML
**Databases:** PostgreSQL, MySQL, DynamoDB, pgvector
**Testing & Observability:** Pytest 8, Vitest, Playwright, AWS Lambda Powertools (EMF metrics, structured logging, tracing), CDK construct assertions
**DevOps / Tooling:** Docker, Git, GitHub, GitLab, GitHub Actions, GitLab CI, Jenkins, Jira, Celery, Redis
**Payments & Integrations:** Stripe API, LinkedIn/Facebook/YouTube/Pinterest APIs
