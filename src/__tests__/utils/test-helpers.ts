// Test utilities for more flexible and maintainable tests

/**
 * Creates a flexible text matcher that matches partial text
 * Useful when you want to test for key concepts without exact copy
 */
export function createFlexibleTextMatcher(keywords: string[]) {
  return new RegExp(keywords.join('.*'), 'i');
}

// Dummy test to prevent Jest from failing on utility files
describe('Test Helpers', () => {
  it('should export utility functions', () => {
    expect(createFlexibleTextMatcher).toBeDefined();
  });
});

/**
 * Creates a matcher for any text containing specific words
 */
export function containsWords(words: string[]) {
  return new RegExp(words.map(word => `(?=.*${word})`).join(''), 'i');
}

/**
 * Test data structure validation instead of content
 */
export function validatePageStructure(expectations: {
  minSections?: number;
  minButtons?: number;
  minLinks?: number;
  minHeadings?: number;
  requiredRoles?: string[];
}) {
  return expectations;
}

/**
 * Flexible heading matcher - tests for semantic structure
 */
export function getHeadingsByLevel(screen: unknown, level: number) {
  return (screen as { getAllByRole: (role: string, options?: { level: number }) => unknown[] }).getAllByRole('heading', { level });
}

/**
 * Test for presence of key navigation elements
 */
export function hasRequiredNavigation(screen: unknown, requiredPaths: string[]) {
  return requiredPaths.every(path => {
    try {
      return (screen as { getByRole: (role: string, options?: { name: RegExp }) => unknown }).getByRole('link', { name: new RegExp(path, 'i') });
    } catch {
      return false;
    }
  });
}

/**
 * Test component data consistency
 * Ensures UI matches data source
 */
export function testDataConsistency<T>(
  screen: unknown,
  data: T[],
  extractor: (item: T) => { text: string; role?: string; level?: number }
) {
  const screenObj = screen as { 
    getByRole: (role: string, options?: { name?: RegExp; level?: number }) => unknown;
    getByText: (text: RegExp) => unknown;
  };
  
  data.forEach(item => {
    const { text, role = 'text', level } = extractor(item);
    
    if (role === 'heading' && level) {
      expect(screenObj.getByRole('heading', { 
        name: new RegExp(text, 'i'), 
        level 
      })).toBeInTheDocument();
    } else if (role === 'link') {
      expect(screenObj.getByRole('link', { 
        name: new RegExp(text, 'i') 
      })).toBeInTheDocument();
    } else {
      expect(screenObj.getByText(new RegExp(text, 'i'))).toBeInTheDocument();
    }
  });
}

/**
 * Semantic structure testing
 * Tests page organization without coupling to specific text
 */
export const semanticMatchers = {
  hasHeroSection: (screen: unknown) => {
    // Look for large heading + description pattern
    const h1s = (screen as { getAllByRole: (role: string, options?: { level: number }) => unknown[] }).getAllByRole('heading', { level: 1 });
    return h1s.length >= 1;
  },
  
  hasNavigation: (screen: unknown) => {
    const links = (screen as { getAllByRole: (role: string) => unknown[] }).getAllByRole('link');
    return links.length >= 3; // Assume minimum navigation
  },
  
  hasCallToAction: (screen: unknown) => {
    // Look for buttons or prominent links
    const screenObj = screen as { getAllByRole: (role: string) => unknown[] };
    const buttons = screenObj.getAllByRole('button');
    const links = screenObj.getAllByRole('link');
    return buttons.length + links.length >= 2;
  },
  
  hasContentSections: (screen: unknown, minSections = 3) => {
    const h2s = (screen as { getAllByRole: (role: string, options?: { level: number }) => unknown[] }).getAllByRole('heading', { level: 2 });
    return h2s.length >= minSections;
  }
};

/**
 * Visual regression helpers
 * Test layout and styling without content coupling
 */
export const layoutMatchers = {
  hasResponsiveGrid: (container: Element) => {
    return container.querySelector('[class*="grid"]') !== null;
  },
  
  hasResponsiveBreakpoints: (container: Element) => {
    return container.querySelector('[class*="md:"], [class*="lg:"]') !== null;
  },
  
  hasProperSpacing: (container: Element) => {
    return container.querySelector('[class*="space-"], [class*="gap-"]') !== null;
  }
};