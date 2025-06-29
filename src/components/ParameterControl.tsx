'use client';

import { useState, useEffect } from 'react';
import { Parameter } from '@/types';
import { InlineMath } from './MathRenderer';

interface ParameterControlProps {
  parameter: Parameter;
  value: unknown;
  onChange: (value: unknown) => void;
  className?: string;
}

export default function ParameterControl({ 
  parameter, 
  value, 
  onChange, 
  className = "" 
}: ParameterControlProps) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value, internalValue]);

  const handleChange = (newValue: unknown) => {
    setInternalValue(newValue);
    onChange(newValue);
  };

  const renderControl = () => {
    switch (parameter.type) {
      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={parameter.min}
              max={parameter.max}
              step={parameter.step || 1}
              value={Number(internalValue)}
              onChange={(e) => handleChange(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>{parameter.min}</span>
              <span className="font-medium">{String(internalValue)}</span>
              <span>{parameter.max}</span>
            </div>
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            min={parameter.min}
            max={parameter.max}
            step={parameter.step || 1}
            value={Number(internalValue)}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
          />
        );

      case 'select':
        return (
          <select
            value={String(internalValue)}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {parameter.options?.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(internalValue)}
              onChange={(e) => handleChange(e.target.checked)}
              className="w-4 h-4 text-accent focus:ring-accent border-gray-300 rounded"
            />
            <span className="text-sm">{parameter.label}</span>
          </label>
        );

      case 'text':
        return (
          <input
            type="text"
            value={String(internalValue)}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
          />
        );

      case 'array':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={Array.isArray(internalValue) ? internalValue.join(', ') : ''}
              onChange={(e) => {
                const arrayValue = e.target.value
                  .split(',')
                  .map(item => item.trim())
                  .filter(item => item !== '');
                handleChange(arrayValue);
              }}
              placeholder="Enter values separated by commas"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="text-xs text-muted">
              Format: value1, value2, value3
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {parameter.type !== 'checkbox' && (
        <label className="block text-sm font-medium text-foreground">
          {parameter.label.includes('\\') ? (
            <InlineMath>{parameter.label}</InlineMath>
          ) : (
            parameter.label
          )}
        </label>
      )}
      {renderControl()}
      {parameter.description && (
        <p className="text-sm text-muted">{parameter.description}</p>
      )}
    </div>
  );
}