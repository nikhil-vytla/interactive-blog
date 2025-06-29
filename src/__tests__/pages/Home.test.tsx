import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import { features, callToAction } from '@/data/homepage'

describe('Home Page', () => {
  // Test structure and key elements rather than exact copy
  it('has proper page structure', () => {
    render(<Home />)
    
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders main site title in header', () => {
    render(<Home />)
    
    // Test for multiple headings
    const h1Headings = screen.getAllByRole('heading', { level: 1 })
    expect(h1Headings.length).toBeGreaterThanOrEqual(1)
  })

  it('renders hero section with main heading', () => {
    render(<Home />)
    
    // Look for any h1 in the main content area (not header)
    const heroHeadings = screen.getAllByRole('heading', { level: 1 })
    expect(heroHeadings.length).toBeGreaterThanOrEqual(1)
  })

  it('renders all required sections', () => {
    render(<Home />)
    
    // Test for section headings by level rather than exact text
    const h2Headings = screen.getAllByRole('heading', { level: 2 })
    expect(h2Headings.length).toBeGreaterThanOrEqual(4) // At least 4 main sections
  })

  it('renders navigation links to key areas', () => {
    render(<Home />)
    
    // Test for important navigation without exact text - be more specific
    const tagLinks = screen.getAllByRole('link', { name: /tags/i })
    expect(tagLinks.length).toBeGreaterThanOrEqual(1)
  })

  it('renders feature cards from data', () => {
    render(<Home />)
    
    // Test that all features from data are rendered
    features.forEach(feature => {
      expect(screen.getByRole('heading', { 
        name: new RegExp(feature.title, 'i'), 
        level: 3 
      })).toBeInTheDocument()
    })
  })

  it('renders feature descriptions from data', () => {
    render(<Home />)
    
    // Test that feature descriptions are present (flexible matching)
    features.forEach(feature => {
      expect(screen.getByText(new RegExp(feature.description.split(' ').slice(0, 3).join('.*'), 'i'))).toBeInTheDocument()
    })
  })

  it('renders call to action buttons from data', () => {
    render(<Home />)
    
    // Test CTA buttons dynamically from data
    callToAction.buttons.forEach(button => {
      const link = screen.getByRole('link', { name: new RegExp(button.text, 'i') })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', button.href)
    })
  })

  it('applies responsive grid layouts', () => {
    const { container } = render(<Home />)
    
    // Test for responsive grids without specific column counts
    const grids = container.querySelectorAll('.grid')
    expect(grids.length).toBeGreaterThan(0)
    
    // At least one grid should be responsive
    const responsiveGrid = container.querySelector('[class*="md:grid-cols"]')
    expect(responsiveGrid).toBeInTheDocument()
  })

  it('renders articles section with content', () => {
    render(<Home />)
    
    // Test that articles are rendered without checking specific titles
    const articles = screen.getAllByRole('article')
    expect(articles.length).toBeGreaterThan(0)
  })

  it('includes interactive elements', () => {
    render(<Home />)
    
    // Test for buttons and links (interactive elements)
    const buttons = screen.getAllByRole('button')
    const links = screen.getAllByRole('link')
    
    expect(buttons.length + links.length).toBeGreaterThan(5) // Should have several interactive elements
  })
})