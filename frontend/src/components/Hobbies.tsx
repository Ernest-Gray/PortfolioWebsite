import { motion } from 'framer-motion'

const hobbies = [
  {
    title: 'FPV Drone Building & Flying',
    accent: 'cyan',
    description:
      'I build custom FPV (first-person view) racing and freestyle drones from scratch — sourcing frames, motors, ESCs, and flight controllers, then tuning PID loops in Betaflight. Flying with goggles at full throttle through trees is the closest thing to being a fighter pilot.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        {/* Center body */}
        <rect x="26" y="26" width="12" height="12" rx="3" className="fill-current" />
        {/* Arms */}
        <line x1="32" y1="26" x2="32" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="32" y1="38" x2="32" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="26" y1="32" x2="14" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="38" y1="32" x2="50" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        {/* Rotors */}
        <ellipse cx="32" cy="10" rx="7" ry="2.5" className="fill-current opacity-60" />
        <ellipse cx="32" cy="54" rx="7" ry="2.5" className="fill-current opacity-60" />
        <ellipse cx="10" cy="32" rx="2.5" ry="7" className="fill-current opacity-60" />
        <ellipse cx="54" cy="32" rx="2.5" ry="7" className="fill-current opacity-60" />
        {/* Camera */}
        <rect x="29" y="29" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Video Games',
    accent: 'purple',
    description:
      'Adventure and fantasy RPGs are my genre — the kind with deep worlds and real choices. Skyrim and Baldur\'s Gate 3 are the gold standard for me. I like games where you can get genuinely lost in the lore and come back hours later still finding new things.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        {/* Controller body */}
        <rect x="8" y="20" width="48" height="26" rx="13" stroke="currentColor" strokeWidth="3" />
        {/* D-pad */}
        <rect x="17" y="29" width="4" height="10" rx="1" className="fill-current" />
        <rect x="13" y="33" width="12" height="4" rx="1" className="fill-current" />
        {/* Buttons */}
        <circle cx="43" cy="31" r="2.5" className="fill-current opacity-80" />
        <circle cx="49" cy="35" r="2.5" className="fill-current opacity-80" />
        <circle cx="43" cy="39" r="2.5" className="fill-current opacity-80" />
        <circle cx="37" cy="35" r="2.5" className="fill-current opacity-80" />
        {/* Joystick nubs */}
        <circle cx="26" cy="38" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="38" cy="28" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: 'Disc Golf',
    accent: 'emerald',
    description:
      'Picked it up during COVID and it stuck. There\'s something satisfying about reading a fairway, picking the right disc, and landing a clean hyzer line through the trees. It\'s an excuse to be outside and it scratches the same problem-solving itch as coding — just with more hiking.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        {/* Disc body */}
        <ellipse cx="32" cy="34" rx="22" ry="8" stroke="currentColor" strokeWidth="3" />
        {/* Dome top */}
        <path d="M10 34 Q10 18 32 18 Q54 18 54 34" stroke="currentColor" strokeWidth="3" fill="none" />
        {/* Center ridge */}
        <ellipse cx="32" cy="34" rx="10" ry="3.5" stroke="currentColor" strokeWidth="1.5" className="opacity-60" />
        {/* Flight path arc */}
        <path d="M8 22 Q22 10 40 16 Q52 20 56 30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-40" fill="none" />
      </svg>
    ),
  },
]

const accentClasses = {
  cyan: {
    border: 'border-cyan-500/20 hover:border-cyan-500/50',
    icon: 'text-cyan-400',
    title: 'text-cyan-400',
    glow: 'hover:shadow-cyan-500/10',
  },
  purple: {
    border: 'border-purple-500/20 hover:border-purple-500/50',
    icon: 'text-purple-400',
    title: 'text-purple-400',
    glow: 'hover:shadow-purple-500/10',
  },
  emerald: {
    border: 'border-emerald-500/20 hover:border-emerald-500/50',
    icon: 'text-emerald-400',
    title: 'text-emerald-400',
    glow: 'hover:shadow-emerald-500/10',
  },
}

export default function Hobbies() {
  return (
    <section id="hobbies" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Outside the Terminal</h2>
          <div className="w-12 h-1 bg-cyan-500 mb-8" />
          <div className="grid md:grid-cols-3 gap-5">
            {hobbies.map((hobby, i) => {
              const cls = accentClasses[hobby.accent as keyof typeof accentClasses]
              return (
                <motion.div
                  key={hobby.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`bg-slate-900 border ${cls.border} rounded-xl p-5 flex flex-col gap-4 shadow-lg ${cls.glow} hover:shadow-xl transition-all duration-300`}
                >
                  <div className={cls.icon}>{hobby.icon}</div>
                  <h3 className={`font-semibold text-base ${cls.title}`}>{hobby.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{hobby.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
