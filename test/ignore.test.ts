import { describe, expect, it } from 'vitest';
import { parseIgnore } from '../src/parsers/ignore.js';
import { applyIgnorePatterns } from '../src/core/match.js';

describe('ignore parsing', () => {
  it('keeps line evidence and negation state', () => {
    const patterns = parseIgnore('# comment\ndist/\n!dist/index.js\n');
    expect(patterns).toEqual([
      expect.objectContaining({ line: 2, pattern: 'dist', directoryOnly: true, negated: false }),
      expect.objectContaining({ line: 3, pattern: 'dist/index.js', negated: true })
    ]);
  });

  it('applies last matching pattern semantics', () => {
    const patterns = parseIgnore('dist/\n!dist/index.js\n');
    expect(applyIgnorePatterns('dist/other.js', '.gitignore', patterns).ignored).toBe(true);
    expect(applyIgnorePatterns('dist/index.js', '.gitignore', patterns).ignored).toBe(false);
  });
});
