import { motion } from 'framer-motion'
import { projects } from '../data/experience'
import type { Project } from '../data/experience'

const accentConfig = {
  purple: { gradient: 'from-purple-900 via-indigo-950 to-slate-950', icon: 'text-purple-400' },
  teal: { gradient: 'from-teal-900 via-emerald-950 to-slate-950', icon: 'text-teal-400' },
  amber: { gradient: 'from-amber-900 via-orange-950 to-slate-950', icon: 'text-amber-400' },
  cyan: { gradient: 'from-cyan-900 via-blue-950 to-slate-950', icon: 'text-cyan-400' },
  sky: { gradient: 'from-sky-900 via-blue-950 to-slate-950', icon: 'text-sky-400' },
}

function ProjectIcon({ id, className }: { id: string; className: string }) {
  if (id === 'lisa') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    )
  }
  if (id === 'mlspace') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
        />
      </svg>
    )
  }
  if (id === 'rag-bot') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    )
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  )
}

function CardBanner({ project }: { project: Project }) {
  const accent = accentConfig[project.accent ?? 'cyan']

  if (project.image) {
    const isSvgOrPng =
      project.image.endsWith('.png') || project.image.endsWith('.svg')
    return (
      <div
        className={`h-40 overflow-hidden rounded-t-xl flex items-center justify-center bg-gradient-to-br ${accent.gradient}`}
      >
        <img
          src={project.image}
          alt={project.name}
          className={
            isSvgOrPng
              ? 'h-32 w-auto object-contain drop-shadow-lg'
              : 'w-full h-full object-cover'
          }
        />
      </div>
    )
  }

  return (
    <div
      className={`h-40 rounded-t-xl flex items-center justify-center bg-gradient-to-br ${accent.gradient} relative overflow-hidden`}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-4 w-24 h-24 rounded-full border border-current" />
        <div className="absolute bottom-2 right-4 w-16 h-16 rounded-full border border-current" />
        <div className="absolute top-8 right-8 w-8 h-8 rounded-full border border-current" />
      </div>
      <ProjectIcon id={project.id} className={`w-12 h-12 ${accent.icon} relative z-10`} />
    </div>
  )
}

export default function ProjectCards() {
  return (
    <section id="projects" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Projects</h2>
          <div className="w-12 h-1 bg-cyan-500 mb-8" />
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-colors group"
              >
                <CardBanner project={project} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold transition-colors text-slate-100 group-hover:text-cyan-400">
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-cyan-400 transition-colors"
                        >
                          {project.name}
                        </a>
                      ) : (
                        project.name
                      )}
                    </h3>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-cyan-400 transition-colors ml-2 flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-slate-800 text-slate-500 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
