import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Pyodide
global.loadPyodide = jest.fn().mockResolvedValue({
  runPython: jest.fn(),
  globals: {
    get: jest.fn(),
  },
})

// Mock Plotly
jest.mock('plotly.js-dist-min', () => ({
  newPlot: jest.fn(),
  react: jest.fn(),
  purge: jest.fn(),
}))

// Mock KaTeX
jest.mock('katex', () => ({
  render: jest.fn(),
  renderToString: jest.fn().mockReturnValue('<span>Mocked LaTeX</span>'),
}))

// Mock CodeMirror
const mockEditorView = {
  destroy: jest.fn(),
  state: {
    doc: {
      toString: () => 'print("hello")'
    }
  },
  dispatch: jest.fn()
}

const MockEditorViewClass = jest.fn().mockImplementation(() => mockEditorView)
MockEditorViewClass.updateListener = {
  of: jest.fn().mockReturnValue({})
}
MockEditorViewClass.theme = jest.fn().mockReturnValue({})

jest.mock('codemirror', () => ({
  EditorView: MockEditorViewClass,
  basicSetup: {}
}))

jest.mock('@codemirror/state', () => ({
  EditorState: {
    create: jest.fn().mockReturnValue({
      doc: {
        toString: () => 'print("hello")'
      }
    })
  }
}))

jest.mock('@codemirror/lang-python', () => ({
  python: jest.fn().mockReturnValue({})
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    p: 'p',
  },
  AnimatePresence: ({ children }) => children,
}))