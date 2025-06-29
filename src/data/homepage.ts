// Homepage content data
export const articles = [
  {
    id: "p-values",
    title: "Understanding p-values",
    description: "Discover what p-values mean through dynamic simulations. Explore hypothesis testing, statistical significance, and common misconceptions with practical examples.",
    category: "Statistics",
    href: "/blog/p-values",
    colorScheme: "blue" as const,
  },
  {
    id: "k-nearest-neighbors",
    title: "k-Nearest Neighbors",
    description: "Understand how the kNN algorithm makes predictions by finding similar data points. Visualize decision boundaries, explore the effect of k, and understand distance metrics.",
    category: "Machine Learning",
    href: "/blog/k-nearest-neighbors",
    colorScheme: "green" as const,
  },
];

export const demos = [
  {
    title: "Statistical Distributions",
    description: "Explore normal distributions, Q-Q plots, and statistical properties with real-time controls.",
    href: "/demo",
  },
  {
    title: "Dynamic Plotting",
    description: "Create and customize visualizations with instant feedback and flexible options.",
    href: "/interactive-plot-test",
  },
  {
    title: "Python Code Editor",
    description: "Write and execute Python code directly in your browser with selective editing capabilities.",
    href: "/plot-test",
  },
];

export const features = [
  {
    icon: "🐍",
    title: "Client-side Python",
    description: "Execute Python code locally using Pyodide. No server setup needed.",
    colorScheme: "blue" as const,
  },
  {
    icon: "✏️",
    title: "Selective Editing",
    description: "Edit only specific parts of code blocks. Useful for guided learning and exploration.",
    colorScheme: "green" as const,
  },
  {
    icon: "∑",
    title: "LaTeX Rendering",
    description: "Fast rendering with KaTeX. Write mathematical expressions in the browser.",
    colorScheme: "purple" as const,
  },
  {
    icon: "📊",
    title: "Dynamic Visualizations",
    description: "Responsive charts and graphs with Plotly. Watch concepts come alive through parameter controls and visual feedback.",
    colorScheme: "yellow" as const,
  },
];

export const callToAction = {
  title: "Ready to Start Learning?",
  description: "Dive into math/stats/ML concepts through interactive code and visualizations.",
  buttons: [
    {
      text: "Start with Statistics",
      href: "/blog/p-values",
      variant: "primary" as const,
    },
    {
      text: "Explore Machine Learning",
      href: "/blog/k-nearest-neighbors",
      variant: "secondary" as const,
    },
  ],
}; 