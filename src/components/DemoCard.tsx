import Link from 'next/link';
import Button from '@/components/Button';

interface DemoCardProps {
  title: string;
  description: string;
  href: string;
}

export default function DemoCard({ title, description, href }: DemoCardProps) {
  return (
    <div className="bg-code-bg border border-code-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <h3 className="font-semibold mb-3 text-foreground">
        {title}
      </h3>
      <p className="text-muted mb-4">
        {description}
      </p>
      <Link href={href}>
        <Button variant="secondary" size="sm" className="w-full">
          Try Demo
        </Button>
      </Link>
    </div>
  );
} 