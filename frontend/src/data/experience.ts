export interface Job {
  id: string
  company: string
  title: string
  period: string
  location: string
  highlights: string[]
  tags: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  tags: string[]
  url?: string
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
      'Built Claude Code → LISA integration end-to-end; root-caused liteLLM double-prefix bug (PR #919, awslabs/LISA)',
      'Re-architected monolithic Slack RAG bot into async two-tier system: API Gateway + SQS FIFO + Bedrock Converse',
      'Shipped workforce portal URL surfacing for SageMaker Ground Truth in MLSpace (PR #362, awslabs/mlspace)',
      'Onboarded Bedrock Data Automation to BlackMirror/PRevere cross-partition observability across 8+ CDK packages',
      'Built full RAG pipeline: Bedrock Guardrails → Kendra top-10 retrieval → Bedrock Converse → EMF metrics',
    ],
    tags: ['Python', 'TypeScript', 'AWS CDK', 'Bedrock', 'RAG', 'Lambda', 'SQS', 'Kendra'],
  },
  {
    id: 'northrop',
    company: 'Northrop Grumman',
    title: 'Software Engineer / Tech Lead',
    period: 'Jul 2023 – Nov 2025',
    location: 'Linthicum Heights, MD',
    highlights: [
      'Tech Lead for MDA team of 4 — integrated software on 5 test-stands for physics experiments',
      'Built bitstream generation tools (100s–10,000s of bits) enabling faster, lower-error experiment setup',
      'Implemented SVM-based ML model in embedded C++ for F-16 SABR combat ID (MATLAB → OFP C++)',
      'Developed signal processing pipeline to extract combat ID features as SVM inputs at runtime',
      'Wrote oscilloscope/AWG scripts for hardware simulation; validated results with CIDA system engineers',
    ],
    tags: ['Python', 'C++', 'NumPy', 'Embedded ML', 'SVM', 'Signal Processing'],
  },
  {
    id: 'lightning',
    company: 'LightningFlashcards.com',
    title: 'Full Stack Developer (Part-Time)',
    period: 'Apr 2023 – Feb 2024',
    location: 'Remote',
    highlights: [
      'Connected OpenAI API to generate flashcards and quiz questions from textbook content',
      'Integrated Stripe API for online payments, automated billing, and credential storage',
      'Designed MySQL database for users, flashcards, quizzes, and analytics',
      'Introduced ad-attribution pixels (Google, Facebook, TikTok, Reddit) for campaign optimization',
    ],
    tags: ['React', 'Node.js', 'MySQL', 'OpenAI API', 'Stripe', 'Full Stack'],
  },
  {
    id: 'infosys',
    company: 'InfoSys',
    title: 'AI Software Engineer Intern',
    period: 'Jun 2022 – Aug 2022',
    location: 'Remote',
    highlights: [
      'Built automated camera configuration pipeline to optimize computer vision model training accuracy',
      'Led team of 4 in hackathon — designed VR application and demo website (C#, Unity, HTML/CSS)',
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
    url: 'https://github.com/awslabs/LISA/pull/919',
  },
  {
    id: 'mlspace',
    name: 'MLSpace — SageMaker Portal',
    description:
      'Shipped workforce portal URL surfacing for Ground Truth labeling jobs and drove multi-package dependency uplift with full end-to-end validation across all SageMaker workflows.',
    tags: ['Open Source', 'Python', 'SageMaker', 'AWS Labs'],
    url: 'https://github.com/awslabs/mlspace/pull/362',
  },
  {
    id: 'rag-bot',
    name: 'RAG Slack Assistant',
    description:
      'Async two-tier Slack bot: API Gateway ingestion + SQS FIFO + Bedrock Converse generation. Includes Guardrails, Kendra retrieval, HMAC auth, and EMF metrics.',
    tags: ['Python', 'Bedrock', 'Kendra', 'RAG', 'Lambda', 'SQS'],
  },
  {
    id: 'flashcards',
    name: 'LightningFlashcards.com',
    description:
      'Full-stack SaaS study tool with OpenAI-generated flashcards, Stripe payments, MySQL backend, and ad-attribution pixel integration for campaign optimization.',
    tags: ['React', 'Node.js', 'OpenAI', 'Stripe', 'MySQL'],
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
