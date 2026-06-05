import { motion } from 'framer-motion'

const facts = [
  { label: 'Location', value: 'Denver, CO' },
  { label: 'Experience', value: '4 Years' },
  { label: 'Education', value: 'BS CS, Towson — 3.86 GPA' },
  { label: 'Cert', value: 'SAFe Scrum Master 6.0' },
]

export default function About() {
  return (
    <section id="about" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-2">About</h2>
          <div className="w-12 h-1 bg-cyan-500 mb-8" />
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-slate-400 leading-relaxed mb-4">
                Software engineer with experience building GenAI services, cloud infrastructure, and
                full-stack applications at AWS and Northrop Grumman. Shipped production features on
                two open-source AWS Labs projects used by AI/ML teams, built RAG pipelines on Amazon
                Bedrock, and led a five-engineer team at Northrop.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Looking for roles where I can keep building meaningful AI/ML or cloud systems at
                scale — ideally at big tech or a Series A–C AI startup.
              </p>
            </div>
            <div className="space-y-3">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="flex justify-between items-center py-2 border-b border-slate-800"
                >
                  <span className="text-slate-500 text-sm">{f.label}</span>
                  <span className="text-slate-200 text-sm font-medium">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
