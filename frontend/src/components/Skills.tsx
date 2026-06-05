import { motion } from 'framer-motion'
import { skillGroups } from '../data/experience'

export default function Skills() {
  return (
    <section id="skills" className="py-16 px-6 bg-slate-900/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Skills</h2>
          <div className="w-12 h-1 bg-cyan-500 mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <h3 className="text-slate-300 font-medium text-sm uppercase tracking-widest mb-3">
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
