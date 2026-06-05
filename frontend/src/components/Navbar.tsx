import { useEffect, useState } from 'react'
import { jobs } from '../data/experience'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setDropdownOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollTo('hero')}
          className="text-slate-100 font-semibold text-lg hover:text-cyan-400 transition-colors"
        >
          Ernest Gray
        </button>

        <div className="flex items-center gap-6">
          <button
            onClick={() => scrollTo('about')}
            className="text-slate-400 hover:text-slate-100 text-sm transition-colors"
          >
            About
          </button>

          <div className="relative">
            <button
              data-testid="nav-experience-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-slate-400 hover:text-slate-100 text-sm transition-colors flex items-center gap-1"
            >
              Experience
              <svg
                className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
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
            </button>
            {dropdownOpen && (
              <div
                data-testid="nav-dropdown"
                className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1"
              >
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => scrollTo(job.id)}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                  >
                    {job.company}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => scrollTo('skills')}
            className="text-slate-400 hover:text-slate-100 text-sm transition-colors"
          >
            Skills
          </button>
          <button
            onClick={() => scrollTo('projects')}
            className="text-slate-400 hover:text-slate-100 text-sm transition-colors"
          >
            Projects
          </button>
          <a
            href="https://github.com/Ernest-Gray"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  )
}
