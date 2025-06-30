# Nik's Blog (v2025)

A little interactive blog experiment, 

Built with: Next.js, Pyodide (WASM), Plotly.js, KaTeX, and CodeMirror.

## Getting Started

```bash
# Install and run
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.

## Build & Test

```bash
npm run build    # Build static site
npm test         # Run tests
```

## Guiding Principles

```
{
    "interactive visualization", 
    "reproducible learning", 
    "accessible scientific communication"
}
```

## Areas to Explore
- Probability
- Data Science
- Statistical Learning
    - Types of Models
        - Regression (linear, logistic, polynomial, etc.)
        - Classification
        - DTs, RFs, SVMs
        - Clustering (kNNs, etc.)
        - Dimensionality Reduction (PCA, LDA, ICA, UMAP, t-SNE, etc.)
- Machine Learning
    - Types of Models
        - MLPs
        - CNNs
        - RNNs
        - GANs
        - Diffusion Models
        - AEs (VAEs, SAEs, etc)
        - Transformers
        - LLMs
        - Agents
        - Liquid State Models
        - Supervised, Unsupervised, Semi-supervised, & Reinforcement Learning
- Topics
    - Explainability 
    - Bias and Fairness
    - Trustworthiness
    - Interpretability 
    - AI Safety, Governance, Policy
    - Evaluations 
    - Synthetic Data Generation
    - Causality
- ML for Health
    - Drug Discovery
    - Disease Prediction

## TODOs

- Considering integrating some version of WASM Dash / Plotly.js instead of Pyodide
- Add Jupyter notebooks/Colab notebooks for more reproducible demos

## Inspo

### Code

- [TensorFlow Playground](http://playground.tensorflow.org/) ⭐️
    - GitHub Repo: [tensorflow/playground](https://github.com/tensorflow/playground)
- [Neuronpedia](https://www.neuronpedia.org/) ⭐️
    - GitHub Repo: [hijohnnylin/neuronpedia](https://github.com/hijohnnylin/neuronpedia)
    - They have a [cool blog](https://www.neuronpedia.org/blog) too!
- [Circuit Tracer](https://www.neuronpedia.org/gemma-2-2b/graph)
    - GitHub Repo: [safety-research/circuit-tracer](https://github.com/safety-research/circuit-tracer)
- [TransformerLens](https://transformerlensorg.github.io/TransformerLens/)
    - GitHub Repo: [TransformerLensOrg/TransformerLens](https://github.com/TransformerLensOrg/TransformerLens)
- [SAE Lens](https://jbloomaus.github.io/SAELens/latest/)
    - GitHub Repo: [jbloomAus/SAELens](https://github.com/jbloomAus/SAELens)
- [Polo Club](https://poloclub.github.io) ⭐️
    - GitHub Repos:
        - [ConceptAttention](https://github.com/helblazer811/ConceptAttention)
        - [Transformer Explainer](https://github.com/poloclub/transformer-explainer)
        - [ManimML](https://github.com/helblazer811/ManimML)
        - [Diffusion Explainer](https://github.com/poloclub/diffusion-explainer)
        - [CNN Explainer](https://github.com/poloclub/cnn-explainer)
        - [GAN Lab](https://github.com/poloclub/ganlab)
- [Latent Scope](https://enjalot.github.io/latent-scope/) ⭐️
    - GitHub Repo: [enjalot/latent-scope](https://github.com/enjalot/latent-scope)


### Blogs
- [Lil'Log](https://lilianweng.github.io/) by Lilian Weng ⭐️
- [Distill.pub](https://distill.pub) ⭐️
    - [Feature Visualization](https://distill.pub/2017/feature-visualization/) (2017)
    - [The Building Blocks of Interpretability](https://distill.pub/2018/building-blocks/) (2018)
    - [Thread: Circuits](https://distill.pub/2020/circuits/) (2020)
- [Transformer Circuits Thread](https://transformer-circuits.pub/) by Anthropic(?) ⭐️
    - [Circuit Tracing: Revealing Computational Graphs in Language Models](https://transformer-circuits.pub/2025/attribution-graphs/methods.html) (2025)
    - [On the Biology of a Large Language Model](https://transformer-circuits.pub/2025/attribution-graphs/biology.html) (2025)
    - [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html) (2021)
- [Language Models & Co.](https://newsletter.languagemodels.co/) by Jay Alammar
    - [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) (2018)
- [Exploring Language Models](https://newsletter.maartengrootendorst.com/) by Maarten Grootendorst
- [Mechanistic Interpretability Blog](https://www.neelnanda.io/mechanistic-interpretability) by Neel Nanda
    - [An Extremely Opinionated Annotated List of My Favorite Mechanistic Interpretability Papers v2](https://www.alignmentforum.org/posts/NfFST5Mio7BCAQHPA/an-extremely-opinionated-annotated-list-of-my-favourite-1) (2024)
    - [Concrete Steps to Getting Started in Transformer Mechanistic Interpretability](https://www.neelnanda.io/mechanistic-interpretability/getting-started) (2022)
- [Transluce Research](https://transluce.org/research) ⭐️
    - [Surfacing Pathological Behaviors in Language Models](https://transluce.org/pathological-behaviors) (2025)
- [Explorable Explanations](https://worrydream.com/ExplorableExplanations/) by Bret Victor
- [Explorable Explanations](https://explorabl.es/) Demos ⭐️
    - [Tools](https://explorabl.es/tools/)
    - [Tutorials](https://explorabl.es/tutorials/)
- [Explained Visually](https://setosa.io/ev/) ⭐️
    - [PCA](https://setosa.io/ev/principal-component-analysis/) (2015)
    - [Markov Chains](https://setosa.io/ev/markov-chains/) (2014)
- [Oscar Bonilla's Blog](https://oscarbonilla.com/)
    - [Visualizing Bayes Theorem](https://oscarbonilla.com/2009/05/visualizing-bayes-theorem/) (2009)


### Books
- [Hands-On Large Language Models](https://www.llm-book.com/) by Jay Alammar and Maarten Grootendorst
    - GitHub Repo: [HandsOnLLM/Hands-On-Large-Language-Models](https://github.com/HandsOnLLM/Hands-On-Large-Language-Models)
- [Build a Large Language Model (From Scratch)](https://sebastianraschka.com/books/) by Sebastian Raschka
    - GitHub Repo: [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch)



### To be sorted
- Art
    - [Tom White](https://drib.net/about)
- Forums
    - [AI Alignment Forum](https://www.alignmentforum.org/)
- Courses
    - [ARENA Course](https://arena-resources.notion.site/)
        - GitHub Repo: [callummcdougall/ARENA_3.0](https://github.com/callummcdougall/ARENA_3.0)