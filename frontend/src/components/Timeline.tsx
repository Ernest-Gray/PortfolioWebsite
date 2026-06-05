import { useState } from 'react'
import { motion } from 'framer-motion'
import { jobs } from '../data/experience'

export default function Timeline() {
  const [expanded, setExpanded] = useState<string | null>(jobs[0].id)

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Experience</h2>
          <div className="w-12 h-1 bg-cyan-500 mb-12" />
        </motion.div>

        <div className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div
              id={job.id}
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`border rounded-xl overflow-hidden transition-colors ${
                expanded === job.id
                  ? 'border-cyan-500/40 bg-slate-900'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              <button
                className="w-full text-left p-6"
                onClick={() => setExpanded(expanded === job.id ? null : job.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-cyan-400 text-sm font-medium mb-1">{job.company}</p>
                    <h3 className="text-slate-100 font-semibold text-lg">{job.title}</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      {job.period} · {job.location}
                    </p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-500 mt-1 flex-shrink-0 transition-transform ${
                      expanded === job.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>

              {expanded === job.id && (
                <div className="px-6 pb-6 border-t border-slate-800">
                  <ul className="mt-4 space-y-2">
                    {job.highlights.map((h, j) => (
                      <li key={j} className="flex gap-3 text-slate-400 text-sm leading-relaxed">
                        <span className="text-cyan-500 mt-1 flex-shrink-0">▸</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
