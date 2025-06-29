import { render, screen } from '@testing-library/react'
import Tag from '@/components/Tag'

describe('Tag Component', () => {
  const mockTags = [
    { tag: 'statistics', variant: 'default' as const },
    { tag: 'machine-learning', variant: 'interactive' as const },
    { tag: 'mathematics', variant: 'selected' as const }
  ];

  it('renders tag text correctly', () => {
    render(<Tag tag="statistics" />)
    expect(screen.getByText('statistics')).toBeInTheDocument()
  })

  it('handles different variants', () => {
    const { rerender } = render(<Tag tag="test" variant="default" />)
    expect(screen.getByText('test')).toBeInTheDocument()
    
    rerender(<Tag tag="test" variant="interactive" />)
    expect(screen.getByText('test')).toBeInTheDocument()
    
    rerender(<Tag tag="test" variant="selected" />)
    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('renders with count when provided', () => {
    render(<Tag tag="statistics" showCount={true} count={5} />)
    expect(screen.getByText('(5)')).toBeInTheDocument()
  })

  it('renders as link when href provided', () => {
    render(<Tag tag="statistics" href="/tags/statistics" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/tags/statistics')
  })

  it('renders as button when onClick provided', () => {
    const handleClick = jest.fn()
    render(<Tag tag="statistics" onClick={handleClick} />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  // Example of data-driven testing
  it('handles multiple tag configurations', () => {
    mockTags.forEach(({ tag, variant }) => {
      render(<Tag tag={tag} variant={variant} />)
      expect(screen.getByText(tag)).toBeInTheDocument()
    })
  })
})