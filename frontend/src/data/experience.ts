export interface Job {
  id: string
  company: string
  title: string
  period: string
  location: string
  highlights: string[]
  tags: string[]
  images?: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  tags: string[]
  url?: string
  image?: string
  accent?: 'purple' | 'teal' | 'amber' | 'cyan' | 'sky'
}

export interface SkillGroup {
  label: string
  skills: string[]
}

export const jobs: Job[] = [
  {
    id: 'aws',
    company: 'Amazon Web Services',
    title: 'Software Development Engineer — AI/ML',
    period: 'Dec 2025 – Present',
    location: 'Denver, CO',
    highlights: [
      'Unblocked Claude Code × LISA integration end-to-end — root-caused a model-identifier double-prefix bug in the liteLLM config layer that had made Claude Code unable to use LISA-hosted models; shipped the fix and validated on a live production workload (awslabs/LISA PR #919)',
      'Shipped user-facing prompt retry for the LISA web UI — designed a retry button and refactored the conversation dataclass to enable one-click recovery from failed inference calls, replacing a dead-end error state and eliminating user context loss',
      'Onboarded open-source foundation models (gpt-oss-20b, gpt-oss-120b) to LISA via the unified OpenAI-compatible API; authored a reference configuration table so future contributors skip the full validation matrix',
      'Designed SageMaker Ground Truth workforce portal URL surfacing in MLSpace — eliminated a multi-step SageMaker console hunt with a 4-region URL mapping; drove cross-stack dependency uplift with personal end-to-end validation of auth, datasets, notebooks, and Ground Truth labeling jobs (awslabs/mlspace PR #362, #364)',
      'Built production RAG Slack assistant: designed two-Lambda async architecture (API Gateway front-end + SQS FIFO queue processor) decoupling Slack\'s 3-second ack from Bedrock inference; implemented full pipeline — Bedrock Guardrails → Kendra 4-source retrieval (Slack, SharePoint, GitHub, OneDrive) → Bedrock Converse → EMF metrics',
      'Wrote a CDK construct-tree walker that resolves unresolved token names on CfnAlarm resources across two structurally distinct alarm classes in a single pass — fixed broken alarm-state replication that had been silently skipping alarms; consolidated account/region config across 8+ CDK packages',
      'Refactored production AI ops agent to support runtime team parameters, replacing all hardcoded team-specific paths with isolated per-team configs and adding cross-team data-leakage guard text (~1,200 lines changed)',
    ],
    tags: ['Python', 'TypeScript', 'AWS CDK', 'Bedrock', 'RAG', 'Lambda', 'SQS', 'Kendra', 'SageMaker', 'CloudWatch'],
  },
  {
    id: 'northrop',
    company: 'Northrop Grumman',
    title: 'Software Engineer',
    period: 'Jul 2023 – Dec 2025',
    location: 'Linthicum Heights, MD',
    highlights: [
      'Contributed to a $29M Northrop Grumman contract — retrofitted and refactored an embedded OFP interface to integrate Viper Shield (Electronic Warfare system); updated Real-Time Simulation software to enable full EW capability assessments before hardware delivery',
      'Led 5-engineer team integrating Python instrumentation across 5 experimental physics test stands; built a bitstream generation framework enabling complex test sequences via higher-level API, cutting manual configuration errors',
      'Implemented SVM classification model in embedded C++ for real-time airborne target ID on the F-16 APG-83 SABR radar — converted MATLAB simulation models to production OFP C++, maintaining numerical fidelity under real-time constraints',
      'Validated SVM model across unit, software lab, hardware-in-the-loop, and open-air radiation tests using tactical radar hardware; performed statistical analysis with systems engineers to develop a structured improvement roadmap',
      'Built C++ Nav-Playback Tool to replay OFP navigation functions and compare against flight metrics — added MATLAB import/export and custom 2D/3D visualization enabling systems engineers to evaluate new algorithms without live hardware',
      'Built data visualization tools handling 1M+ data points from test stand measurements; automated AWG and oscilloscope workflows end-to-end for hardware simulation and validation',
    ],
    tags: ['Python', 'C++', 'MATLAB', 'NumPy', 'Embedded ML', 'SVM', 'Signal Processing', 'Electronic Warfare'],
    images: ['/Images/f16-fighter-jet.jpg', '/Images/oscilloscope-waveforms.jpg'],
  },
  {
    id: 'grayhound',
    company: 'Grayhound Software LLC',
    title: 'Founder & Developer',
    period: 'Apr 2023 – Present',
    location: 'Remote',
    highlights: [
      'Founded Grayhound Software LLC; building ChillPilot — AI SaaS platform for social media content generation with an async generation pipeline (Claude Sonnet + Celery) and multi-platform publishing to LinkedIn, Facebook, YouTube, and Pinterest via OAuth2',
      'Architected ChillPilot\'s multi-platform API layer: OAuth2 token lifecycle management (refresh, revoke, re-auth), rate-limit backoff and recovery, and scheduled publishing workflows across four platforms',
      'Implemented Stripe subscription enforcement for ChillPilot: webhook lifecycle processing, server-side feature gating, and billing portal integration',
      'Built LightningFlashcards.com — OpenAI-powered flashcard and quiz SaaS with Stripe billing, MySQL backend, and multi-network ad attribution (Google, Facebook, TikTok, Reddit) enabling conversion tracking from ad click to paid signup',
    ],
    tags: ['Python', 'React', 'TypeScript', 'Celery', 'Redis', 'PostgreSQL', 'Stripe', 'Claude API', 'OAuth2'],
    images: [
      '/Images/LightningFlashcardimage_emily_alpha_cropped-dc0cb69e.webp',
      '/Images/chillpilot_goose_transparent.png',
    ],
  },
  {
    id: 'infosys',
    company: 'InfoSys',
    title: 'AI Software Engineer Intern',
    period: 'Jun 2022 – Aug 2022',
    location: 'Remote',
    highlights: [
      'Automated camera configuration pipeline for a computer vision AI system — programmatically tuned rotation, field of view, zoom, brightness, and contrast to maximize model training input quality',
      'Led a team of 4 in an internal hackathon: designed, built, and demoed a VR application with original 3D assets and an accompanying website (C#, Unity, HTML/CSS)',
      'Produced full technical documentation (flowcharts, sequence diagrams, user manual) and presented results to mentor, engineering management, and the broader team',
    ],
    tags: ['Python', 'TensorFlow', 'Computer Vision', 'C#', 'Unity'],
  },
]

export const projects: Project[] = [
  {
    id: 'lisa',
    name: 'LISA — LLM Inference Platform',
    description:
      'Fixed liteLLM double-prefix bug that blocked Claude Code integration with LISA-hosted models. Onboarded foundation models and authored reference configuration table for contributors.',
    tags: ['Open Source', 'Python', 'liteLLM', 'AWS Labs'],
    url: 'https://github.com/awslabs/LISA',
    accent: 'purple',
  },
  {
    id: 'mlspace',
    name: 'MLSpace — SageMaker Portal',
    description:
      'Shipped workforce portal URL surfacing for Ground Truth labeling jobs and drove multi-package dependency uplift with full end-to-end validation across all SageMaker workflows.',
    tags: ['Open Source', 'Python', 'SageMaker', 'AWS Labs'],
    url: 'https://github.com/awslabs/mlspace',
    accent: 'teal',
  },
  {
    id: 'rag-bot',
    name: 'RAG Slack Assistant',
    description:
      'Async two-tier Slack bot: API Gateway ingestion + SQS FIFO + Bedrock Converse generation. Includes Guardrails, Kendra retrieval, HMAC auth, and EMF metrics.',
    tags: ['Python', 'Bedrock', 'Kendra', 'RAG', 'Lambda', 'SQS'],
    accent: 'amber',
  },
  {
    id: 'flashcards',
    name: 'LightningFlashcards.com',
    description:
      'Full-stack SaaS study tool with OpenAI-generated flashcards, Stripe payments, MySQL backend, and ad-attribution pixel integration for campaign optimization.',
    tags: ['React', 'Node.js', 'OpenAI', 'Stripe', 'MySQL'],
    url: 'https://lightningflashcards.com',
    image: '/Images/LightningFlashcardimage_emily_alpha_cropped-dc0cb69e.webp',
    accent: 'sky',
  },
  {
    id: 'chillpilot',
    name: 'ChillPilot',
    description:
      'AI-powered co-pilot app with a distinctive brand identity. Built to help users navigate decisions with calm, intelligent guidance.',
    tags: ['AI', 'Product'],
    url: 'https://chillpilot.com',
    image: '/Images/chillpilot_goose_transparent.png',
    accent: 'sky',
  },
]

export const skillGroups: SkillGroup[] = [
  {
    label: 'Languages',
    skills: ['Python', 'TypeScript', 'JavaScript', 'C++', 'C#', 'Java'],
  },
  {
    label: 'AWS',
    skills: [
      'Lambda',
      'CDK',
      'Bedrock',
      'Kendra',
      'SageMaker',
      'API Gateway',
      'SQS',
      'CloudWatch',
      'IAM',
    ],
  },
  {
    label: 'GenAI / RAG',
    skills: [
      'RAG Pipelines',
      'Bedrock Converse',
      'Guardrails',
      'Prompt Engineering',
      'pgvector',
      'OpenAI API',
    ],
  },
  {
    label: 'Infrastructure',
    skills: ['AWS CDK', 'CloudFormation', 'Docker', 'Alembic', 'GitLab CI', 'Jenkins'],
  },
  {
    label: 'Frontend',
    skills: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Angular', 'HTML/CSS'],
  },
  {
    label: 'Data & Testing',
    skills: ['PostgreSQL', 'MySQL', 'Pytest', 'Vitest', 'Playwright', 'NumPy', 'PyTorch'],
  },
]
