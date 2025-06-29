import { ArticleConfig } from '@/types';

export const pValuesConfig: ArticleConfig = {
  id: 'p-values',
  title: 'p-values',
  description: '🙋‍♀️ Does anyone know what a p-value is? And why do we always choose 0.05?',
  category: 'Statistics',
  slug: 'p-values',
  publishedAt: '2025-06-27',
  tags: ['statistics', 'hypothesis-testing', 'p-values'],
  colorScheme: 'blue',
  sections: [
    {
      type: 'alert',
      alertType: 'definition',
      title: 'p-value',
      content: `
        <p>The probability of observing your data (or something more extreme) if the null hypothesis were true.</p>
      `
    },
    {
      type: 'text',
      content: `
        <p>More formally, if we have a null hypothesis <em>H₀</em> and we observe some test statistic <em>T</em>, then:</p>
      `
    },
    {
      type: 'math',
      mathDisplay: true,
      mathExpression: 'p = P(T \\geq t | H_0)'
    },
    {
      type: 'text',
      content: `
        <p>Where <em>t</em> is the observed value of our test statistic.</p>
      `
    },
    {
      type: 'interactive',
      title: 'Interactive p-value Simulation',
      codeTemplate: 'hypothesis_test',
      parameters: [
        {
          name: 'sample_size',
          label: 'Sample Size',
          type: 'range',
          defaultValue: 30,
          min: 10,
          max: 100,
          step: 5,
          description: 'Number of observations in the sample'
        },
        {
          name: 'null_mean',
          label: 'Null Hypothesis Mean',
          type: 'number',
          defaultValue: 0,
          min: -2,
          max: 2,
          step: 0.1,
          description: 'The hypothesized population mean under H₀'
        },
        {
          name: 'true_mean',
          label: 'True Population Mean',
          type: 'number',
          defaultValue: 0.5,
          min: -2,
          max: 2,
          step: 0.1,
          description: 'The actual population mean for data generation'
        },
        {
          name: 'alpha',
          label: 'Significance Level (α)',
          type: 'select',
          defaultValue: 0.05,
          options: [
            { label: '0.01', value: 0.01 },
            { label: '0.05', value: 0.05 },
            { label: '0.10', value: 0.10 }
          ],
          description: 'The threshold for statistical significance'
        }
      ]
    },
    {
      type: 'text',
      title: 'Common Misconceptions',
      content: `
        <p>p-values are frequently misunderstood. Let's clarify some common misconceptions:</p>
      `
    },
    {
      type: 'alert',
      alertType: 'wrong',
      title: 'p-value is the probability that the null hypothesis is true',
      content: `
        <p>The p-value is calculated assuming the null hypothesis IS true. It cannot tell us the probability that it's true.</p>
      `
    },
    {
      type: 'alert',
      alertType: 'wrong',
      title: 'A smaller p-value means a larger effect',
      content: `
        <p>p-values depend on both effect size AND sample size. A tiny effect with huge sample size can have a very small p-value.</p>
      `
    },
    {
      type: 'alert',
      alertType: 'correct',
      title: 'p-value measures evidence against the null hypothesis',
      content: `
        <p>Smaller p-values provide stronger evidence that our data is inconsistent with the null hypothesis.</p>
      `
    },
    {
      type: 'text',
      title: 'Mathematical Foundation',
      content: `
        <p>For a one-sample t-test, we calculate the t-statistic as:</p>
      `
    },
    {
      type: 'math',
      mathDisplay: true,
      mathExpression: 't = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}'
    },
    {
      type: 'text',
      content: `
        <p>Where:</p>
        <ul>
          <li><strong>x̄</strong> is the sample mean</li>
          <li><strong>μ₀</strong> is the hypothesized population mean</li>
          <li><strong>s</strong> is the sample standard deviation</li>
          <li><strong>n</strong> is the sample size</li>
        </ul>
        
        <p>The p-value is then calculated using the t-distribution with <em>n-1</em> degrees of freedom:</p>
      `
    },
    {
      type: 'math',
      mathDisplay: true,
      mathExpression: 'p = 2 \\times P(T \\geq |t|)'
    },
    {
      type: 'text',
      content: `
        <p>The factor of 2 accounts for the two-tailed test (we care about differences in either direction).</p>
      `
    },
    {
      type: 'alert',
      alertType: 'takeaways',
      title: 'Key Takeaways',
      content: `
        <ul>
          <li>→ p-values measure evidence against the null hypothesis</li>
          <li>→ They depend on both effect size and sample size</li>
          <li>→ Statistical significance ≠ practical significance</li>
          <li>→ Always interpret p-values in context</li>
          <li>→ Consider complementary measures like confidence intervals</li>
        </ul>
      `
    }
  ]
};