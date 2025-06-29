'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { InlineMath, DisplayMath } from '@/components/MathRenderer';
import PlotlyCodeEditor from '@/components/PlotlyCodeEditor';
import { AlertVariants } from '@/components/Alert';
import { getParametersEditableRanges } from '@/utils/editableRanges';

export default function PValuesPost() {
  const [sampleSize, setSampleSize] = useState(30);
  const [nullMean, setNullMean] = useState(0);
  const [trueMean, setTrueMean] = useState(0.5);
  const [alpha, setAlpha] = useState(0.05);
  const [simulationResults, setSimulationResults] = useState<{
    pValue: number;
    tStatistic: number;
    significant: boolean;
    sampleMean: number;
  } | null>(null);


  const runSimulation = () => {
    // Generate sample data from normal distribution
    const sampleData = Array.from({ length: sampleSize }, () => 
      trueMean + (Math.random() * 2 - 1) // Simple normal approximation
    );
    
    const sampleMean = sampleData.reduce((sum, x) => sum + x, 0) / sampleSize;
    const sampleStd = Math.sqrt(
      sampleData.reduce((sum, x) => sum + Math.pow(x - sampleMean, 2), 0) / (sampleSize - 1)
    );
    
    // Calculate t-statistic
    const tStatistic = (sampleMean - nullMean) / (sampleStd / Math.sqrt(sampleSize));
    
    // Approximate p-value (two-tailed)
    const pValue = 2 * (1 - normalCDF(Math.abs(tStatistic)));
    
    setSimulationResults({
      pValue,
      tStatistic,
      significant: pValue < alpha,
      sampleMean
    });
  };

  // Simple normal CDF approximation
  const normalCDF = (x: number): number => {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
  };

  const erf = (x: number): number => {
    // Approximation of error function
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  };

  const pythonCode = `# P-value Simulation
import numpy as np
from scipy import stats
import plotly.graph_objects as go

# Parameters
sample_size = ${sampleSize}
null_mean = ${nullMean}
true_mean = ${trueMean}
alpha = ${alpha}

# Generate sample data
np.random.seed(42)
sample_data = np.random.normal(true_mean, 1, sample_size)

# Calculate test statistic
sample_mean = np.mean(sample_data)
sample_std = np.std(sample_data, ddof=1)
t_statistic = (sample_mean - null_mean) / (sample_std / np.sqrt(sample_size))

# Calculate p-value
p_value = 2 * (1 - stats.t.cdf(abs(t_statistic), sample_size - 1))

print(f"Sample mean: {sample_mean:.3f}")
print(f"T-statistic: {t_statistic:.3f}")
print(f"P-value: {p_value:.3f}")
print(f"Significant at α = {alpha}: {p_value < alpha}")

# Create interactive visualization
fig = go.Figure()

# Add histogram
fig.add_trace(go.Histogram(
    x=sample_data,
    nbinsx=15,
    histnorm='probability density',
    name='Sample Data',
    marker_color='skyblue',
    marker_line_color='black',
    marker_line_width=1,
    opacity=0.7
))

# Add vertical lines
fig.add_vline(
    x=sample_mean, 
    line_dash="dash", 
    line_color="red",
    annotation_text=f"Sample Mean ({sample_mean:.3f})",
    annotation_position="top right"
)

fig.add_vline(
    x=null_mean, 
    line_dash="dash", 
    line_color="blue",
    annotation_text=f"Null Hypothesis Mean ({null_mean})",
    annotation_position="top left"
)

# Update layout
fig.update_layout(
    title='Sample Distribution vs Null Hypothesis',
    xaxis_title='Value',
    yaxis_title='Density',
    template='plotly_white',
    showlegend=True,
    height=500,
    hovermode='x unified'
)

fig.update_xaxes(showgrid=True, gridwidth=1, gridcolor='lightgray')
fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor='lightgray')`;

  // Calculate editable ranges using utility
  const getEditableRanges = () => getParametersEditableRanges(pythonCode);



  return (
    <PageLayout
      title="Understanding p-values"
      description="An exploration of p-values through interactive examples and visualizations, with a focus on common interpretations and misconceptions."
    >
      <article className="prose max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">What is a p-value?</h2>
          <AlertVariants.Definition title="p-value">
            <p>
              The probability of observing your data (or something more extreme) 
              if the null hypothesis were true.
            </p>
          </AlertVariants.Definition>
          
          <p className="mb-4">
            More formally, if we have a null hypothesis <InlineMath>H_0</InlineMath> and we observe 
            some test statistic <InlineMath>T</InlineMath>, then:
          </p>
          
          <DisplayMath>
            p = P(T \geq t | H_0)
          </DisplayMath>
          
          <p className="mt-4">
            Where <InlineMath>t</InlineMath> is the observed value of our test statistic.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Interactive p-value simulation</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Sample size</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-muted">{sampleSize}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Null hypothesis mean</label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={nullMean}
                  onChange={(e) => setNullMean(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-muted">{nullMean}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">True population mean</label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={trueMean}
                  onChange={(e) => setTrueMean(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-muted">{trueMean}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Significance level (<InlineMath>{`\\alpha`}</InlineMath>)</label>
                <input
                  type="range"
                  min="0.01"
                  max="0.1"
                  step="0.01"
                  value={alpha}
                  onChange={(e) => setAlpha(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-muted">{alpha}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={runSimulation}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium mb-6"
          >
            Run Simulation
          </button>
          
          {simulationResults && (
            <AlertVariants.Results>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Sample mean:</strong> {simulationResults.sampleMean.toFixed(3)}</p>
                  <p><strong>T-statistic:</strong> {simulationResults.tStatistic.toFixed(3)}</p>
                </div>
                <div>
                  <p><strong>p-value:</strong> <span className={simulationResults.significant ? 'text-red-600 font-bold' : 'text-green-600'}>{simulationResults.pValue.toFixed(3)}</span></p>
                  <p><strong>Significant:</strong> <span className={simulationResults.significant ? 'text-red-600' : 'text-green-600'}>{simulationResults.significant ? 'Yes' : 'No'}</span></p>
                </div>
              </div>
            </AlertVariants.Results>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Common Misconceptions</h2>
          
          <div className="space-y-6">
            <AlertVariants.Wrong title="p-value is the probability that the null hypothesis is true">
              <p>
                The p-value is calculated assuming the null hypothesis IS true. It cannot tell us the probability that it&apos;s true.
              </p>
            </AlertVariants.Wrong>
            
            <AlertVariants.Wrong title="A smaller p-value means a larger effect">
              <p>
                p-values depend on both effect size AND sample size. A tiny effect with huge sample size can have a very small p-value.
              </p>
            </AlertVariants.Wrong>
            
            <AlertVariants.Correct title="p-value measures evidence against the null hypothesis">
              <p>
                Smaller p-values provide stronger evidence that our data is inconsistent with the null hypothesis.
              </p>
            </AlertVariants.Correct>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Try It Yourself: Python Implementation</h2>
          <p className="mb-4">
            Here&apos;s a complete Python implementation of the simulation above. 
            Modify the parameters and see how they affect the p-value:
          </p>
          
          <PlotlyCodeEditor
            initialCode={pythonCode}
            editableRanges={getEditableRanges()}
            className="mb-6"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Mathematical Foundation</h2>
          
          <p className="mb-4">
            For a one-sample t-test, we calculate the t-statistic as:
          </p>
          
          <DisplayMath>
            {`t = \\frac{(sample\\_mean - null\\_mean)}{(std / sqrt(n))}`}
          </DisplayMath>
          
          <p className="my-4">Where:</p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li><strong><InlineMath>{`sample\\_mean`}</InlineMath></strong> is the sample mean</li>
            <li><strong><InlineMath>{`null\\_mean`}</InlineMath></strong> is the hypothesized population mean</li>
            <li><strong><InlineMath>{`std`}</InlineMath></strong> is the sample standard deviation</li>
            <li><strong><InlineMath>{`n`}</InlineMath></strong> is the sample size</li>
          </ul>
          
          <p className="mb-4">
            The p-value is then calculated using the t-distribution with <InlineMath>n-1</InlineMath> degrees of freedom:
          </p>
          
          <DisplayMath>
            p = 2 \times P(T \geq |t|)
          </DisplayMath>
          
          <p className="mt-4">
            The factor of 2 accounts for the two-tailed test (we care about differences in either direction).
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Key Takeaways</h2>
          
          <AlertVariants.Takeaways>
            <ul className="space-y-2">
              <li>→ p-values measure evidence against the null hypothesis</li>
              <li>→ They depend on both effect size and sample size</li>
              <li>→ Statistical significance ≠ practical significance</li>
              <li>→ Always interpret p-values in context</li>
              <li>→ Consider complementary measures like confidence intervals</li>
            </ul>
          </AlertVariants.Takeaways>
        </section>
      </article>
    </PageLayout>
  );
} 