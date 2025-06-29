import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import Button from '@/components/Button';
import ArticleCard from '@/components/ArticleCard';
import DemoCard from '@/components/DemoCard';
import FeatureCard from '@/components/FeatureCard';
import { articles, demos, features, callToAction } from '@/data/homepage';

export default function Home() {
  return (
    <PageLayout 
      title="Nik's Interactive Blog"
      description="Exploring math/stats/ML concepts through interactive code and visualizations"
      showHomeButton={false}
    >
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="text-center py-8">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            Interactive Mathematical Learning
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            Learn statistical concepts and machine learning algorithms through coding exercises, 
            dynamic visualizations, and adjustable simulations.
          </p>
        </section>

        {/* Blog Posts Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-8 text-foreground">
            Featured Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                description={article.description}
                category={article.category}
                href={article.href}
                colorScheme={article.colorScheme}
              />
            ))}
          </div>
        </section>

        {/* Interactive Demos Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-8 text-foreground">
            Interactive Playground
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {demos.map((demo, index) => (
              <DemoCard
                key={index}
                title={demo.title}
                description={demo.description}
                href={demo.href}
              />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-8 text-foreground">
            What You&apos;ll Find Here
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                colorScheme={feature.colorScheme}
              />
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            {callToAction.title}
          </h2>
          <p className="text-muted mb-6 max-w-2xl mx-auto">
            {callToAction.description}
          </p>
          <div className="flex gap-4 justify-center">
            {callToAction.buttons.map((button, index) => (
              <Link key={index} href={button.href}>
                <Button variant={button.variant} size="lg">
                  {button.text}
                </Button>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}