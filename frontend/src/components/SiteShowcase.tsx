import { motion } from 'framer-motion'

const techCards = [
  {
    id: 'llm',
    label: 'Claude Haiku LLM',
    sublabel: 'claude-haiku-4-5-20251001',
    description: 'Anthropic API with server-sent events streaming. Responses appear word-by-word in real time, not all at once.',
    accent: 'text-purple-400',
    bg: 'from-purple-900/30 to-slate-900',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: 'rag',
    label: 'RAG Pipeline',
    sublabel: 'Retrieval-Augmented Generation',
    description: 'Your question gets embedded, then pgvector finds the 5 most relevant knowledge-base chunks via cosine similarity before Claude ever sees a token.',
    accent: 'text-cyan-400',
    bg: 'from-cyan-900/30 to-slate-900',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
  },
  {
    id: 'vector',
    label: 'pgvector on PostgreSQL',
    sublabel: 'OpenAI text-embedding-3-small · 1536 dims',
    description: 'Knowledge-base docs are chunked and stored as 1536-dimension vectors in Railway PostgreSQL. Cosine distance finds semantically similar content, not just keyword matches.',
    accent: 'text-teal-400',
    bg: 'from-teal-900/30 to-slate-900',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 'backend',
    label: 'FastAPI Backend',
    sublabel: 'Python · Deployed on Railway',
    description: 'Async FastAPI with SQLAlchemy 2 handles embedding requests, vector retrieval, and streams Claude responses as SSE over a single POST endpoint.',
    accent: 'text-emerald-400',
    bg: 'from-emerald-900/30 to-slate-900',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
  },
  {
    id: 'frontend',
    label: 'React + Vite Frontend',
    sublabel: 'TypeScript · Deployed on Cloudflare Pages',
    description: 'Vite + React with Framer Motion animations and Tailwind CSS. The chat widget reads SSE chunks via fetch + ReadableStream and renders them incrementally.',
    accent: 'text-sky-400',
    bg: 'from-sky-900/30 to-slate-900',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: 'infra',
    label: 'Rate Limiting & Security',
    sublabel: 'IP-based token bucket',
    description: 'No auth required — the API is protected by a per-IP token bucket rate limiter built directly in FastAPI middleware. CORS locked to specific origins.',
    accent: 'text-amber-400',
    bg: 'from-amber-900/30 to-slate-900',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
]

export default function SiteShowcase() {
  return (
    <section id="site" className="py-16 px-6 bg-slate-900/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-2">How This Site Works</h2>
          <div className="w-12 h-1 bg-cyan-500 mb-4" />
          <p className="text-slate-400 mb-8 max-w-2xl">
            The chat widget isn't a simple API wrapper. It uses a full RAG pipeline so every answer
            is grounded in real context about my work — not hallucinated.
          </p>

          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {['Your question', 'Embed (OpenAI)', 'pgvector top-5', 'Claude Haiku', 'Stream to you'].map(
              (step, i, arr) => (
                <div key={step} className="flex items-center gap-2 flex-shrink-0">
                  <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg whitespace-nowrap">
                    {step}
                  </span>
                  {i < arr.length - 1 && (
                    <svg className="w-4 h-4 text-cyan-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              )
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`bg-gradient-to-br ${card.bg} border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-colors`}
              >
                <div className={`${card.accent} mb-3`}>{card.icon}</div>
                <p className={`font-semibold text-sm ${card.accent} mb-0.5`}>{card.label}</p>
                <p className="text-slate-500 text-xs mb-2">{card.sublabel}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
