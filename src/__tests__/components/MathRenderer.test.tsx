import { render, screen } from '@testing-library/react'
import MathRenderer, { InlineMath, DisplayMath } from '@/components/MathRenderer'
import katex from 'katex'

// Mock katex
jest.mock('katex', () => ({
  render: jest.fn(),
}))

const mockKatex = katex as jest.Mocked<typeof katex>

describe('MathRenderer', () => {
  beforeEach(() => {
    mockKatex.render.mockClear()
    mockKatex.render.mockImplementation(() => {})
  })

  it('renders inline math by default', () => {
    const mathContent = 'x^2 + y^2 = z^2'
    render(<MathRenderer>{mathContent}</MathRenderer>)

    expect(mockKatex.render).toHaveBeenCalledWith(
      mathContent,
      expect.any(Element),
      expect.objectContaining({
        displayMode: false,
        throwOnError: false,
        output: 'html',
        trust: false
      })
    )
  })

  it('renders display math when display prop is true', () => {
    const mathContent = '\\sum_{i=1}^{n} x_i'
    render(<MathRenderer display={true}>{mathContent}</MathRenderer>)

    expect(mockKatex.render).toHaveBeenCalledWith(
      mathContent,
      expect.any(Element),
      expect.objectContaining({
        displayMode: true
      })
    )
  })

  it('applies custom className', () => {
    const mathContent = 'a + b = c'
    const customClass = 'custom-math-class'
    render(<MathRenderer className={customClass}>{mathContent}</MathRenderer>)

    const element = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'span'
    })
    expect(element).toHaveClass(customClass)
  })

  it('handles rendering errors gracefully', () => {
    const mathContent = 'invalid\\math'
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    mockKatex.render.mockImplementation(() => {
      throw new Error('KaTeX error')
    })

    render(<MathRenderer>{mathContent}</MathRenderer>)

    expect(consoleSpy).toHaveBeenCalledWith('KaTeX rendering error:', expect.any(Error))
    consoleSpy.mockRestore()
  })

  it('updates when children prop changes', () => {
    const { rerender } = render(<MathRenderer>x^2</MathRenderer>)
    expect(mockKatex.render).toHaveBeenCalledWith('x^2', expect.any(Element), expect.any(Object))

    mockKatex.render.mockClear()
    rerender(<MathRenderer>y^3</MathRenderer>)
    expect(mockKatex.render).toHaveBeenCalledWith('y^3', expect.any(Element), expect.any(Object))
  })
})

describe('InlineMath', () => {
  it('renders as inline math', () => {
    const mathContent = 'e^{i\\pi} + 1 = 0'
    render(<InlineMath>{mathContent}</InlineMath>)

    expect(mockKatex.render).toHaveBeenCalledWith(
      mathContent,
      expect.any(Element),
      expect.objectContaining({
        displayMode: false
      })
    )
  })
})

describe('DisplayMath', () => {
  it('renders as display math', () => {
    const mathContent = '\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}'
    render(<DisplayMath>{mathContent}</DisplayMath>)

    expect(mockKatex.render).toHaveBeenCalledWith(
      mathContent,
      expect.any(Element),
      expect.objectContaining({
        displayMode: true
      })
    )
  })
})