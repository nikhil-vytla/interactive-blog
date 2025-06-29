interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  colorScheme: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

const colorSchemes = {
  blue: 'bg-blue-100 dark:bg-blue-900',
  green: 'bg-green-100 dark:bg-green-900',
  purple: 'bg-purple-100 dark:bg-purple-900',
  yellow: 'bg-yellow-100 dark:bg-yellow-900',
  red: 'bg-red-100 dark:bg-red-900',
};

export default function FeatureCard({ icon, title, description, colorScheme }: FeatureCardProps) {
  return (
    <div className="text-center p-6">
      <div className={`w-16 h-16 ${colorSchemes[colorScheme]} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="font-semibold mb-2 text-foreground">
        {title}
      </h3>
      <p className="text-muted text-sm">
        {description}
      </p>
    </div>
  );
} 