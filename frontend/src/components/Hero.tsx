import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-4">
            Software Development Engineer
          </p>
          <h1 className="text-6xl md:text-7xl font-bold text-slate-100 mb-6 leading-tight">
            Ernest Gray
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Building GenAI services, RAG pipelines, and cloud infrastructure at AWS. Open-source
            contributor to LISA and MLSpace. Active/Secret clearance.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://github.com/Ernest-Gray"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg hover:border-cyan-500 hover:text-cyan-400 transition-all text-sm font-medium"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/ernest-gray-a877a9100/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg hover:border-cyan-500 hover:text-cyan-400 transition-all text-sm font-medium"
            >
              LinkedIn
            </a>
            <a
              href="mailto:Egray4cs@gmail.com"
              className="px-6 py-3 bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 transition-all text-sm font-medium"
            >
              Get in Touch
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16"
        >
          <div className="w-px h-12 bg-gradient-to-b from-slate-700 to-transparent mx-auto" />
        </motion.div>
      </div>
    </section>
  )
}
