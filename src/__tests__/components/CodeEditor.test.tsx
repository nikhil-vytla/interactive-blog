import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CodeEditor from '@/components/CodeEditor'

describe('CodeEditor', () => {
  const defaultProps = {
    initialCode: 'print("Hello, World!")',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with initial code', () => {
    render(<CodeEditor {...defaultProps} />)
    
    expect(screen.getByText('python')).toBeInTheDocument()
  })

  it('shows run button when onRun prop is provided', () => {
    const onRun = jest.fn()
    render(<CodeEditor {...defaultProps} onRun={onRun} />)
    
    expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument()
  })

  it('does not show run button when onRun prop is not provided', () => {
    render(<CodeEditor {...defaultProps} />)
    
    expect(screen.queryByRole('button', { name: /run/i })).not.toBeInTheDocument()
  })

  it('calls onRun when run button is clicked', async () => {
    const onRun = jest.fn()
    render(<CodeEditor {...defaultProps} onRun={onRun} />)
    
    const runButton = screen.getByRole('button', { name: /run/i })
    await userEvent.click(runButton)
    
    expect(onRun).toHaveBeenCalled()
  })

  it('disables run button and shows running state', async () => {
    const onRun = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(<CodeEditor {...defaultProps} onRun={onRun} />)
    
    const runButton = screen.getByRole('button', { name: /run/i })
    await userEvent.click(runButton)
    
    expect(screen.getByRole('button', { name: /running/i })).toBeDisabled()
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /run/i })).not.toBeDisabled()
    })
  })

  it('applies custom className', () => {
    const customClass = 'custom-editor-class'
    render(<CodeEditor {...defaultProps} className={customClass} />)
    
    const container = screen.getByText('python').closest('.border')
    expect(container).toHaveClass(customClass)
  })

  it('handles read-only ranges prop', () => {
    const readOnlyRanges = [{ from: 0, to: 5 }]
    render(<CodeEditor {...defaultProps} readOnlyRanges={readOnlyRanges} />)
    
    expect(screen.getByText('python')).toBeInTheDocument()
  })

  it('supports custom minHeight', () => {
    render(<CodeEditor {...defaultProps} minHeight="300px" />)
    
    // Test that component renders (minHeight is applied via style)
    expect(screen.getByText('python')).toBeInTheDocument()
  })
})