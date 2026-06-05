# Ernest Gray — AWS AI/ML Work History

## Role
Software Development Engineer (ADC Engineer I), AWS AI/ML ADC Organization
Amazon Web Services — Denver, CO
December 2025 – Present
Manager: Andrew Batzel

## Summary
Building and operating GenAI services and cross-partition observability tooling on the AWS AI/ML ADC team. Shipped production features on two open-source AWS Labs projects (LISA and MLSpace) and on Amazon's internal Bedrock Data Automation console. Comfortable owning features end-to-end from design through code review, deployment, and validation.

---

## Project: MissionSolutionsKBBot — Slack-native RAG Bot (Dec 2025 – Jan 2026)

Designed and implemented an internal Slack bot that answers AWS technical questions using a Retrieval-Augmented Generation (RAG) pipeline.

**Architecture:**
- Refactored a monolithic Lambda handler into an asynchronous two-tier system:
  - APIHandler Lambda fronted by API Gateway for Slack event ingestion
  - QueueProcessor Lambda fed by SQS FIFO queue
  - This decouples synchronous Slack 3-second acknowledgement from long-running Bedrock inference
- Implemented Slack signing-secret verification using slack_sdk.SignatureVerifier plus 5-minute timestamp replay-protection window, secret pulled from SSM Parameter Store and cached via functools.lru_cache
- Built full RAG pipeline in queue processor: input/output Bedrock Guardrails → Kendra top-10 vector retrieval → Bedrock Converse generation with structured system prompt
- Emitted EMF metrics for guardrail interventions, input/output/total tokens, and per-error-class counts via AWS Lambda Powertools
- Added Slack threading via thread_ts, structured response formatting with source attribution, dataclass-based response models, confidence-scoring system
- Modeled SQS payloads with Pydantic (QueueMessage) using MessageGroupId for FIFO ordering per Slack event
- Upgraded Pytest from 6.x to 8.x; rewrote test suite around split handlers
- Set up Hydra integration testing by granting IAM role read access to Slack SSM parameters

**Stack:** Python 3, AWS Lambda, API Gateway, SQS FIFO, Amazon Bedrock (Guardrails + Converse API), Amazon Kendra, SSM Parameter Store, AWS CDK (TypeScript), Pydantic, AWS Lambda Powertools, Pytest 8, Hydra

---

## Project: LISA — LLM Inference Solution for ADCs (Jan 2026 – May 2026)

LISA is an open-source AI platform (awslabs/LISA) that simplifies deployment and hosting of LLMs at scale for AWS Dedicated Cloud regions where Amazon Bedrock has limited availability.

**Contributions:**
- Diagnosed and fixed a liteLLM configuration bug that double-prefixed model identifiers (e.g., openai/openai/...), unblocking Claude Code's integration with the LISA-hosted OpenAI-compatible endpoint (PR #919)
- The fix was critical: using LISA as Claude Code's model provider was completely non-functional before this work
- Root-caused the bug in the underlying liteLLM configuration, shipped the fix, validated on a large live customer workload
- Onboarded new foundation models (gpt-oss-20b, gpt-oss-120b, others) to the LISA dev environment end-to-end via the unified OpenAI-compatible inference API
- Authored a reference table of optimized working configurations across the model set so contributors can pick known-good configs without re-running the full validation matrix
- Added user-facing prompt retry to the LISA web UI: designed and shipped a retry button plus supporting retry logic for prompts that failed mid-inference, replacing a dead-end error state
- Updated the LISA Internal Deployment Guide with corrected steps reflecting current LISA releases

**Stack:** Python, liteLLM, OpenAI-compatible inference APIs, SageMaker endpoints, GitLab/GitHub CI
**Open Source PR:** https://github.com/awslabs/LISA/pull/919

---

## Project: MLSpace — Collaborative SageMaker Portal (Mar 2026 – May 2026)

MLSpace (awslabs/mlspace) is a PKI-enabled, serverless data-science portal that fronts Amazon SageMaker for users without direct AWS console access.

**PR #362 — Workforce Portal URL Surfacing for Ground Truth:**
- Designed and shipped a quality-of-life feature that surfaces the labeling-workforce portal URL directly inside MLSpace's labeling-job view
- Eliminated a multi-step hunt through the SageMaker console for every labeling job
- Built a regional mapping covering the four ADC partitions MLSpace targets (us-iso-east-1, us-isob-east-1, us-isof-south-1, us-isof-east-1) so the correct portal URL renders per deployment region
- **Open Source PR:** https://github.com/awslabs/mlspace/pull/362

**PR #364 — Dependency Uplift:**
- Drove a multi-package dependency upgrade and personally validated authentication, dataset upload, Jupyter notebook (XGBoost) workflows, and Ground Truth labeling jobs end-to-end
- Closed a validation gap by adding a step-by-step testing checklist to the project's Internal Developer Guide
- **Open Source PR:** https://github.com/awslabs/mlspace/pull/364

**Additional MLSpace work:**
- Configured and tested SageMaker Ground Truth private workforce against a Keycloak OIDC identity provider end-to-end, including labeling-job execution
- Validated EMR cluster creation and root-caused TERMINATED_WITH_ERRORS failures during regression testing

**Stack:** Python, AWS CDK, Amazon SageMaker (Ground Truth, training jobs, notebooks, EMR), Keycloak/OIDC, PKI, regional config maps

---

## Project: Cross-Partition Observability — BlackMirror & PRevere (Mar 2026 – May 2026)

Onboarded Amazon Bedrock Data Automation (BDA) to BlackMirror (metric mirroring) and PRevere (alarm-state mirroring) so commercial-region engineers can monitor and triage BDA without crossing the air gap. Owned work across 8+ CDK packages, shipping multiple production CRs.

**BlackMirror onboarding (CR-260690878):**
- Wired BlackMirrorAppDecorator into CDK apps for BDA pipeline packages
- Implemented single-source-of-truth account configuration (blackmirror-constants.ts) that derives both Isengard-alias-to-account map and high-side-to-low-side metric mirroring map
- Configured metricClassification, shouldSkipSourceAccount, shouldSkipStack for production safety

**PRevere alarm forwarding (CR-271483556, CR-272547870):**
- Implemented reusable addPrevereDecorator(app) utility for alarm-state replication
- Built hand-rolled assignAlarmNames CDK construct-tree walker that traverses entire CDK construct tree and assigns physical names to CfnAlarms with unresolved CDK tokens
- Used cfnResourceType check to cover both aws-cdk-lib's CfnAlarm and @amzn/secure-cdk-aws variant in single pass — closing a known integration gap that had been breaking alarm-state replication

**Production fixes shipped:**
- Disabled CloudWatchDashboardWiki IAM-role creation failing LCK deployments due to partition-specific role limits
- Fixed invalid metricClassification section identifier (36.0.5.1) rejecting metric submissions
- Updated BlackMirrorAppDecorator configuration to handle duplicate stack names across regions
- Re-aligned high-side account IDs after Isengard alias rename

**Stack:** TypeScript, AWS CDK, @amzn/black-mirror, @amzn/prevere-constructs, CloudWatch alarms, Brazil/Apollo build/deploy

---

## Additional AWS Contributions

**NotifySelfViaSlackCDK (Apr 2026):**
- Built personal productivity service: CDK app provisioning Lambda fronted by Midway authentication
- Pulls Slack webhook URL from AWS Secrets Manager at runtime for self-notifications

**Oscar Agent Refactor (May 2026):**
- Refactored team's internal AI ops agent (AimlAdcAiCapabilities) to be team-agnostic via runtime team parameters
- Replaced BWI-only hardcoded paths with isolated team configurations for BWI (Bedrock Topaz) and Denver (BDA + NLP services)
- Added strict team-isolation guard text in agent's saved-search payloads to prevent cross-team query leakage
- ~1,200 lines changed

**AWS Builder Onboarding Track (Dec 2025):**
- CDK + Step Functions + API Gateway workshop
- Asynchronous health-monitor service
- Multi-package CLI/data-layer exercise (Brazil)
- Debugging workshop

## Technical Skills at AWS
Python, TypeScript, JavaScript, Shell; Lambda, API Gateway, SQS (FIFO), DynamoDB, CloudWatch, Secrets Manager, SSM Parameter Store, IAM, EMR, SageMaker, Amazon Bedrock (Converse, Guardrails, Knowledge Bases), Amazon Kendra; AWS CDK, CloudFormation, Brazil/Apollo, LPT; Pytest 8, AWS Lambda Powertools (EMF metrics, structured logging, tracing), Hydra integration testing
