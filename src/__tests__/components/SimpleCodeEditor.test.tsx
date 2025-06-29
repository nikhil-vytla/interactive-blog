import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SimpleCodeEditor from '@/components/SimpleCodeEditor'

describe('SimpleCodeEditor', () => {
  const defaultProps = {
    initialCode: 'print("Hello, World!")',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with initial code', () => {
    render(<SimpleCodeEditor {...defaultProps} />)
    
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  it('shows run button when onRun prop is provided', () => {
    const onRun = jest.fn()
    render(<SimpleCodeEditor {...defaultProps} onRun={onRun} />)
    
    expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument()
  })

  it('does not show run button when onRun prop is not provided', () => {
    render(<SimpleCodeEditor {...defaultProps} />)
    
    expect(screen.queryByRole('button', { name: /run/i })).not.toBeInTheDocument()
  })

  it('calls onRun when run button is clicked', async () => {
    const onRun = jest.fn()
    render(<SimpleCodeEditor {...defaultProps} onRun={onRun} />)
    
    const runButton = screen.getByRole('button', { name: /run/i })
    await userEvent.click(runButton)
    
    expect(onRun).toHaveBeenCalled()
  })

  it('disables run button and shows running state', async () => {
    const onRun = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(<SimpleCodeEditor {...defaultProps} onRun={onRun} />)
    
    const runButton = screen.getByRole('button', { name: /run/i })
    await userEvent.click(runButton)
    
    expect(screen.getByRole('button', { name: /running/i })).toBeDisabled()
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /run/i })).not.toBeDisabled()
    })
  })

  it('applies custom className', () => {
    const customClass = 'custom-editor-class'
    render(<SimpleCodeEditor {...defaultProps} className={customClass} />)
    
    const container = screen.getByText('Python').closest('.border')
    expect(container).toHaveClass(customClass)
  })

  it('has minimum height for editor area', () => {
    render(<SimpleCodeEditor {...defaultProps} />)
    
    const editorContainer = document.querySelector('.min-h-\\[200px\\]')
    expect(editorContainer).toBeInTheDocument()
  })
})