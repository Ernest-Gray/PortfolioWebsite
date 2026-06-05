export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-slate-800">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-sm">
          © 2026 Ernest Gray. Built with React + FastAPI + Claude.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="mailto:Egray4cs@gmail.com"
            className="text-slate-500 hover:text-cyan-400 text-sm transition-colors"
          >
            Email
          </a>
          <a
            href="https://github.com/Ernest-Gray"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-cyan-400 text-sm transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ernest-gray-a877a9100/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-cyan-400 text-sm transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
