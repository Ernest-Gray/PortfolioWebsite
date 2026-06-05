# Ernest Gray — AWS Work History

## Role
Software Development Engineer (ADC Engineer I), AWS AI/ML ADC Organization
Amazon Web Services — Denver, CO
December 2025 – Present

## Summary
Building and operating GenAI services and cross-partition observability tooling on the AWS AI/ML ADC team. Shipped production features on two open-source AWS Labs projects (LISA and MLSpace), built a production RAG Slack assistant from scratch, delivered cross-account observability tooling spanning 8+ CDK packages, and refactored a production AI ops agent. Owns features end-to-end from design through code review, deployment, and validation.

---

## Project: LISA — Open-Source LLM Inference Platform (Jan 2026 – May 2026)

LISA (awslabs/LISA) is an open-source AI platform that simplifies deployment and hosting of LLMs at scale for AWS Dedicated Cloud regions where Amazon Bedrock has limited availability.

**Claude Code × LISA Integration (PR #919):**
- Unblocked Claude Code's integration with LISA-hosted models end-to-end. Using LISA as Claude Code's model provider was completely non-functional before this work.
- Root-caused a model-identifier double-prefix bug in the liteLLM configuration layer — model IDs were being prefixed twice (e.g., `openai/openai/model` instead of `openai/model`), causing every inference call from Claude Code to fail.
- Shipped the fix and validated the integration on a large live customer workload that completed within the expected timeframe.

**Prompt Retry Feature:**
- Designed and shipped a user-facing retry button for the LISA web UI, plus the supporting retry logic for prompts that failed mid-inference.
- Refactored the conversation dataclass to enable one-click recovery from failed inference calls, replacing a dead-end error state that caused users to lose their context.

**Foundation Model Onboarding:**
- Onboarded multiple open-source foundation models (gpt-oss-20b, gpt-oss-120b, and others) to the LISA dev environment via the unified OpenAI-compatible inference API.
- Authored a reference configuration table of optimized working configs so future contributors can pick a known-good configuration without re-running the full validation matrix.
- Updated the LISA Internal Deployment Guide with corrected steps matching current releases.

**Stack:** Python, liteLLM, OpenAI-compatible inference APIs, SageMaker endpoints, React, TypeScript, GitHub CI.
**Open Source PR:** https://github.com/awslabs/LISA/pull/919

---

## Project: MLSpace — Open-Source Collaborative SageMaker Portal (Mar 2026 – May 2026)

MLSpace (awslabs/mlspace) is a PKI-enabled, serverless data-science portal that fronts Amazon SageMaker for users without direct AWS console access.

**PR #362 — Workforce Portal URL Surfacing for SageMaker Ground Truth:**
- Designed and shipped a feature that surfaces the labeling-workforce portal URL directly inside MLSpace's labeling-job view, eliminating a multi-step hunt through the SageMaker console for every labeling job.
- Built a regional URL mapping covering four distinct ADC deployment regions so the correct portal URL renders per environment.

**PR #364 — Cross-Stack Dependency Uplift:**
- Drove a multi-package dependency upgrade and personally validated authentication flows, dataset upload, Jupyter notebook (XGBoost) workflows, and Ground Truth labeling jobs end-to-end before signing off.
- Closed a recurring validation gap by writing a step-by-step testing checklist in the project's Internal Developer Guide.

**Additional MLSpace work:**
- Configured and tested SageMaker Ground Truth private workforce against a Keycloak OIDC identity provider end-to-end, including labeling-job execution.
- Root-caused and documented TERMINATED_WITH_ERRORS failures during EMR cluster regression testing.

**Stack:** Python, AWS CDK, Amazon SageMaker (Ground Truth, training, notebooks, EMR), Keycloak/OIDC, regional config maps.
**Open Source PRs:** https://github.com/awslabs/mlspace/pull/362, https://github.com/awslabs/mlspace/pull/364

---

## Project: RAG-Based Slack Assistant (MissionSolutionsKBBot) (Dec 2025 – Jan 2026)

Production RAG-powered Slack assistant that answers AWS technical questions grounded in internal documentation, code repos, Slack Q&A, and file shares.

**Architecture:**
- Designed and built a two-Lambda async architecture: a front-end API Gateway handler that immediately acknowledges Slack events (preventing automatic retries on slow responses), and a queue processor Lambda that handles Bedrock inference asynchronously via SQS FIFO.
- This decouples Slack's strict 3-second acknowledgement requirement from end-to-end Bedrock inference latency.

**RAG Pipeline:**
- Built the full RAG pipeline: input/output Bedrock Guardrails → Kendra top-10 vector retrieval → Bedrock Converse generation → structured output with source attribution and confidence scoring.
- Set up Amazon Kendra with four data sources: Slack channel Q&A, SharePoint, GitHub, and OneDrive — giving the bot a unified knowledge index across all team systems.

**Security & Reliability:**
- Implemented Slack request authentication via HMAC signature verification with a 5-minute replay-protection window; signing secret pulled from SSM Parameter Store and cached via lru_cache.
- Added Slack threading support so replies stay in-thread across concurrent requests.
- Emitted EMF metrics (guardrail events, token counts per direction, per-error-class counts) via AWS Lambda Powertools.
- Upgraded Pytest from 6.x to 8.x and rewrote the full test suite for the split-handler architecture.

**Stack:** Python 3, AWS Lambda, API Gateway, SQS FIFO, Amazon Bedrock (Guardrails + Converse), Amazon Kendra (Slack/SharePoint/GitHub/OneDrive connectors), SSM Parameter Store, AWS CDK (TypeScript), Pydantic, AWS Lambda Powertools, Pytest 8.

---

## Project: Cross-Partition Observability — BlackMirror & PRevere (Mar 2026 – May 2026)

Onboarded Amazon Bedrock Data Automation (BDA) to BlackMirror (metric mirroring) and PRevere (alarm-state mirroring) so commercial-region engineers can monitor and triage BDA services without crossing the air gap. Owned work across 8+ CDK packages.

**Key engineering work:**
- Wrote a CDK construct-tree walker (assignAlarmNames) that traverses the full CDK app and assigns physical names to CfnAlarms with unresolved CDK tokens — covering both the standard aws-cdk-lib alarm class and an internally secured CDK variant in a single pass.
- This closed an integration gap that had been silently skipping alarms on the secure-CDK variant, breaking alarm-state replication for affected services.
- Integrated reusable CDK decorators for cross-partition metric and alarm forwarding into multiple service CDK apps (both sender- and receiver-side stacks).
- Consolidated duplicated account/region literals into a single source-of-truth configuration module, preventing config drift across the service portfolio.

**Production fixes shipped:**
- Corrected an invalid metric-classification section identifier that was rejecting metric submissions.
- Disabled auto-generated IAM role creation that was hitting partition-specific role limits during deployment.
- Reconfigured the decorator to handle duplicate stack names across regions.
- Added bootstrap pipeline configurations for two downstream service pipelines.

**Stack:** TypeScript, AWS CDK, CloudWatch (alarms, metrics, dashboards), IAM, cross-account observability patterns.

---

## Additional AWS Contributions

**AI Ops Agent Refactor — Oscar (May 2026):**
- Refactored the team's internal AI ops agent to support runtime team parameters, replacing all hardcoded team-specific paths with isolated per-team configurations.
- Added strict team-isolation guard text in query payloads to prevent cross-team data leakage.
- ~1,200 lines changed.

**Self-Notification Service (Apr 2026):**
- Built a full-stack CDK app provisioning a Lambda behind authentication middleware.
- Pulls Slack webhook URL from AWS Secrets Manager at runtime to deliver developer self-notifications.

**AWS Builder Onboarding Track (Dec 2025):**
- Completed Amazon's internal builder training: CDK + Step Functions + API Gateway workshop, async health-monitor service, multi-package CLI/data-layer exercise, branch-based debugging workshop.

---

## Technical Skills at AWS
Python, TypeScript, JavaScript, Shell; Lambda, API Gateway, SQS FIFO, DynamoDB, CloudWatch (metrics, alarms, dashboards), Secrets Manager, SSM Parameter Store, IAM, EMR, SageMaker (Ground Truth, training, notebooks), Amazon Bedrock (Converse, Guardrails, Knowledge Bases), Amazon Kendra; AWS CDK (TypeScript), CloudFormation; Pytest 8, AWS Lambda Powertools (EMF metrics, structured logging, tracing); Pydantic, Celery, Redis.
