'use client';

import InteractiveCodeBlock from '@/components/InteractiveCodeBlock';

export default function TestPage() {
  const simpleCode = `# This is read-only
x = 1

# === EDITABLE REGION START ===
y = 2
z = 3
# === EDITABLE REGION END ===

# This is also read-only
print(x + y + z)`;

  const getEditableRanges = () => {
    const startMarker = '# === EDITABLE REGION START ===';
    const endMarker = '# === EDITABLE REGION END ===';
    const startIndex = simpleCode.indexOf(startMarker);
    const endIndex = simpleCode.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) return [];
    
    // Find the actual editable content between markers
    const contentStart = simpleCode.indexOf('\n', startIndex) + 1;
    const contentEnd = endIndex;
    
    console.log('Debug - Start:', startIndex, 'End:', endIndex);
    console.log('Debug - Content Start:', contentStart, 'Content End:', contentEnd);
    console.log('Debug - Editable content:', JSON.stringify(simpleCode.substring(contentStart, contentEnd)));
    
    return [{ from: contentStart, to: contentEnd }];
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Test Editable Regions</h1>
      
      <InteractiveCodeBlock
        template={simpleCode}
        editableRanges={getEditableRanges()}
        title="Simple Test"
        description="Try editing the middle section with y and z variables"
      />
    </div>
  );
}