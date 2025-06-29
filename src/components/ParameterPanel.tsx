'use client';

import { useState, useEffect } from 'react';
import { Parameter } from '@/types';
import ParameterControl from './ParameterControl';

interface ParameterPanelProps {
  parameters: Parameter[];
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
  title?: string;
  className?: string;
  columns?: 1 | 2 | 3;
}

export default function ParameterPanel({
  parameters,
  values,
  onChange,
  title = "Parameters",
  className = "",
  columns = 2
}: ParameterPanelProps) {
  const [parameterValues, setParameterValues] = useState<Record<string, unknown>>({});

  // Initialize parameter values
  useEffect(() => {
    const initialValues: Record<string, unknown> = {};
    let shouldCallOnChange = false;

    parameters.forEach(param => {
      const valueFromPropOrDefault = values[param.name] ?? param.defaultValue;
      initialValues[param.name] = valueFromPropOrDefault;

      if (values[param.name] !== valueFromPropOrDefault) {
        shouldCallOnChange = true;
      }
    });

    setParameterValues(initialValues);

    if (shouldCallOnChange) {
      onChange(initialValues);
    }
  }, [parameters, values, onChange]);

  const handleParameterChange = (parameterName: string, value: unknown) => {
    const newValues = { ...parameterValues, [parameterName]: value };
    setParameterValues(newValues);
    onChange(newValues);
  };

  const getGridClassName = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid md:grid-cols-2 gap-6';
      case 3: return 'grid md:grid-cols-2 lg:grid-cols-3 gap-6';
      default: return 'grid md:grid-cols-2 gap-6';
    }
  };

  if (parameters.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      )}
      <div className={getGridClassName()}>
        {parameters.map((parameter) => (
          <ParameterControl
            key={parameter.name}
            parameter={parameter}
            value={parameterValues[parameter.name] ?? parameter.defaultValue}
            onChange={(value) => handleParameterChange(parameter.name, value)}
          />
        ))}
      </div>
    </div>
  );
}