import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  it('renders main heading', () => {
    render(<Home />)
    
    expect(screen.getByRole('heading', { name: /nik's interactive blog/i, level: 1 })).toBeInTheDocument()
  })

  it('renders page description', () => {
    render(<Home />)
    
    expect(screen.getByText(/explore mathematical concepts through interactive code and visualizations.*edit parameters, run python code/i)).toBeInTheDocument()
  })

  it('renders demo button with correct link', () => {
    render(<Home />)
    
    const demoLink = screen.getByRole('link', { name: /try interactive demos/i })
    expect(demoLink).toBeInTheDocument()
    expect(demoLink).toHaveAttribute('href', '/demo')
  })

  it('renders Get Started section', () => {
    render(<Home />)
    
    expect(screen.getByRole('heading', { name: /get started/i, level: 2 })).toBeInTheDocument()
    expect(screen.getByText(/read in-depth explanations with interactive examples/i)).toBeInTheDocument()
  })

  it('renders Features section', () => {
    render(<Home />)
    
    expect(screen.getByRole('heading', { name: /features/i, level: 2 })).toBeInTheDocument()
  })

  it('renders all feature cards', () => {
    render(<Home />)
    
    const expectedFeatures = [
      'Client-Side Python',
      'Selective Editing',
      'Mathematical Rendering', 
      'Interactive Visualizations'
    ]
    
    expectedFeatures.forEach(feature => {
      expect(screen.getByRole('heading', { name: new RegExp(feature, 'i'), level: 3 })).toBeInTheDocument()
    })
  })

  it('renders feature descriptions', () => {
    render(<Home />)
    
    expect(screen.getByText(/run python code directly in your browser/i)).toBeInTheDocument()
    expect(screen.getByText(/edit only specific parts of code blocks/i)).toBeInTheDocument()
    expect(screen.getByText(/beautiful latex rendering with katex/i)).toBeInTheDocument()
    expect(screen.getByText(/real-time parameter controls/i)).toBeInTheDocument()
  })

  it('has proper page structure with main and header', () => {
    render(<Home />)
    
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('applies responsive grid layout for features', () => {
    const { container } = render(<Home />)
    
    const featuresGrid = container.querySelector('.grid.md\\:grid-cols-2')
    expect(featuresGrid).toBeInTheDocument()
  })
})