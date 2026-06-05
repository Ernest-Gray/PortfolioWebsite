import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Navbar from '../components/Navbar'
import { jobs } from '../data/experience'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('Navbar', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
    vi.spyOn(window, 'addEventListener')
    vi.spyOn(window, 'removeEventListener')
    document.getElementById = vi.fn().mockReturnValue({
      scrollIntoView: vi.fn(),
    })
  })

  it('renders brand name', () => {
    render(<Navbar />)
    expect(screen.getByText('Ernest Gray')).toBeInTheDocument()
  })

  it('renders nav links', () => {
    render(<Navbar />)
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })

  it('dropdown is hidden initially', () => {
    render(<Navbar />)
    expect(screen.queryByTestId('nav-dropdown')).not.toBeInTheDocument()
  })

  it('opens dropdown on Experience button click', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByTestId('nav-experience-btn'))
    expect(screen.getByTestId('nav-dropdown')).toBeInTheDocument()
  })

  it('dropdown lists all jobs', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByTestId('nav-experience-btn'))
    for (const job of jobs) {
      expect(screen.getByText(job.company)).toBeInTheDocument()
    }
  })

  it('closes dropdown after clicking a job', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByTestId('nav-experience-btn'))
    const firstJobBtn = screen.getByText(jobs[0].company)
    fireEvent.click(firstJobBtn)
    expect(screen.queryByTestId('nav-dropdown')).not.toBeInTheDocument()
  })

  it('toggles dropdown closed on second click', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByTestId('nav-experience-btn'))
    expect(screen.getByTestId('nav-dropdown')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('nav-experience-btn'))
    expect(screen.queryByTestId('nav-dropdown')).not.toBeInTheDocument()
  })
})
