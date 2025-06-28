'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathRendererProps {
  children: string;
  display?: boolean;
  className?: string;
}

export default function MathRenderer({ 
  children, 
  display = false, 
  className = "" 
}: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(children, containerRef.current, {
          displayMode: display,
          throwOnError: false,
          output: 'html',
          trust: false
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        if (containerRef.current) {
          containerRef.current.textContent = children;
        }
      }
    }
  }, [children, display]);

  return (
    <span 
      ref={containerRef}
      className={`${display ? 'block my-4 text-center' : 'inline'} ${className}`}
    />
  );
}

// Utility component for inline math
export function InlineMath({ children, className }: { children: string; className?: string }) {
  return <MathRenderer display={false} className={className}>{children}</MathRenderer>;
}

// Utility component for display math
export function DisplayMath({ children, className }: { children: string; className?: string }) {
  return <MathRenderer display={true} className={className}>{children}</MathRenderer>;
}