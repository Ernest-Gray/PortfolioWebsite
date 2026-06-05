import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Timeline from '../components/Timeline'
import { jobs } from '../data/experience'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('Timeline', () => {
  it('renders section heading', () => {
    render(<Timeline />)
    expect(screen.getByText('Experience')).toBeInTheDocument()
  })

  it('renders all job companies', () => {
    render(<Timeline />)
    for (const job of jobs) {
      expect(screen.getByText(job.company)).toBeInTheDocument()
    }
  })

  it('renders all job titles', () => {
    render(<Timeline />)
    for (const job of jobs) {
      expect(screen.getByText(job.title)).toBeInTheDocument()
    }
  })

  it('first job is expanded by default', () => {
    render(<Timeline />)
    // first highlight only shows when first card is expanded
    expect(screen.getByText(jobs[0].highlights[0])).toBeInTheDocument()
  })

  it('second job highlights hidden by default', () => {
    render(<Timeline />)
    expect(screen.queryByText(jobs[1].highlights[0])).not.toBeInTheDocument()
  })

  it('expands a card on click', () => {
    render(<Timeline />)
    // click the second job's button
    const secondCompanyText = screen.getByText(jobs[1].company)
    fireEvent.click(secondCompanyText.closest('button')!)
    expect(screen.getByText(jobs[1].highlights[0])).toBeInTheDocument()
  })

  it('collapses an already-expanded card on click', () => {
    render(<Timeline />)
    const firstCompanyText = screen.getByText(jobs[0].company)
    // first job is already expanded; clicking it collapses it
    fireEvent.click(firstCompanyText.closest('button')!)
    expect(screen.queryByText(jobs[0].highlights[0])).not.toBeInTheDocument()
  })

  it('renders tags for each job', () => {
    render(<Timeline />)
    // check first job's first tag is rendered
    expect(screen.getAllByText(jobs[0].tags[0]).length).toBeGreaterThan(0)
  })
})
