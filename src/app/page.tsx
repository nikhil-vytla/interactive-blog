import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Nik&apos;s Interactive Blog</h1>
        <p className="text-muted text-lg leading-relaxed">
          Explore mathematical concepts through interactive code and visualizations. 
          Edit parameters, run Python code, and see results in real-time.
        </p>
      </header>

      <main className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
          <div className="bg-code-bg border border-code-border rounded-lg p-6">
            <p className="mb-4 text-muted">
              Ready to explore interactive mathematical concepts?
            </p>
            <Link 
              href="/demo" 
              className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
            >
              Try Interactive Demos →
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Client-Side Python</h3>
              <p className="text-muted">
                Run Python code directly in your browser using Pyodide. 
                No server required, instant execution.
              </p>
            </div>
            <div className="border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Selective Editing</h3>
              <p className="text-muted">
                Edit only specific parts of code blocks. 
                Perfect for guided learning and exploration.
              </p>
            </div>
            <div className="border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Mathematical Rendering</h3>
              <p className="text-muted">
                Beautiful LaTeX rendering with KaTeX. 
                Write complex mathematical expressions seamlessly.
              </p>
            </div>
            <div className="border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Interactive Visualizations</h3>
              <p className="text-muted">
                Real-time parameter controls and instant visual feedback. 
                Explore concepts through interaction.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
