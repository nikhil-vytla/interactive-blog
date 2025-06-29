'use client';

import { ContentSection as ContentSectionType } from '@/types';
import { InlineMath, DisplayMath } from './MathRenderer';
import { AlertVariants } from './Alert';
import PlotlyCodeEditor from './PlotlyCodeEditor';
import ParameterPanel from './ParameterPanel';
import { useState } from 'react';
import { processTemplate, getTemplateById } from '@/content/templates';

interface ContentSectionProps {
  section: ContentSectionType;
  className?: string;
}

export default function ContentSection({ section, className = "" }: ContentSectionProps) {
  const [parameterValues, setParameterValues] = useState<Record<string, unknown>>({});

  const renderContent = () => {
    switch (section.type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            {section.title && (
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                {section.title}
              </h3>
            )}
            <div 
              className="text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: section.content || '' }}
            />
          </div>
        );

      case 'math':
        return (
          <div className="my-6">
            {section.title && (
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                {section.title}
              </h3>
            )}
            {section.mathDisplay ? (
              <DisplayMath>{section.mathExpression || ''}</DisplayMath>
            ) : (
              <InlineMath>{section.mathExpression || ''}</InlineMath>
            )}
          </div>
        );

      case 'alert':
        const AlertComponent = getAlertComponent(section.alertType);
        return (
          <AlertComponent title={section.title}>
            <div dangerouslySetInnerHTML={{ __html: section.content || '' }} />
          </AlertComponent>
        );

      case 'code':
        return (
          <div className="my-6">
            {section.title && (
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                {section.title}
              </h3>
            )}
            <PlotlyCodeEditor
              initialCode={section.codeTemplate || ''}
              editableRanges={section.editableRanges || []}
              plotHeight="500px"
            />
          </div>
        );

      case 'interactive':
        const template = section.codeTemplate ? getTemplateById(section.codeTemplate) : null;
        const parameters = section.parameters || template?.parameters || [];
        
        const processedCode = template 
          ? processTemplate(template, parameterValues)
          : section.codeTemplate || '';

        return (
          <div className="my-8">
            {section.title && (
              <h3 className="text-xl font-semibold mb-6 text-foreground">
                {section.title}
              </h3>
            )}
            
            {parameters.length > 0 && (
              <div className="mb-6">
                <ParameterPanel
                  parameters={parameters}
                  values={parameterValues}
                  onChange={setParameterValues}
                  title="Interactive Parameters"
                />
              </div>
            )}
            
            <PlotlyCodeEditor
              initialCode={processedCode}
              editableRanges={section.editableRanges || []}
              plotHeight="600px"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className={`mb-8 ${className}`}>
      {renderContent()}
    </section>
  );
}

function getAlertComponent(alertType?: string) {
  switch (alertType) {
    case 'info':
      return AlertVariants.Info;
    case 'warning':
      return AlertVariants.Warning;
    case 'error':
      return AlertVariants.Wrong;
    case 'success':
      return AlertVariants.Correct;
    case 'note':
      return AlertVariants.Note;
    case 'correct':
      return AlertVariants.Correct;
    case 'wrong':
      return AlertVariants.Wrong;
    case 'definition':
      return AlertVariants.Definition;
    case 'takeaways':
      return AlertVariants.Takeaways;
    default:
      return AlertVariants.Info;
  }
}