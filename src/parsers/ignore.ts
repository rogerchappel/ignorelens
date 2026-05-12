import type { IgnorePattern } from '../core/types.js';

export function parseIgnore(content: string): IgnorePattern[] {
  return content
    .split(/\r?\n/)
    .map((raw, index): IgnorePattern | null => {
      const line = index + 1;
      const trimmed = raw.trim();
      if (!trimmed || trimmed.startsWith('#')) return null;
      const negated = trimmed.startsWith('!');
      const body = negated ? trimmed.slice(1) : trimmed;
      const directoryOnly = body.endsWith('/');
      const pattern = body.replace(/\/$/, '');
      if (!pattern) return null;
      return { raw, pattern, line, negated, directoryOnly };
    })
    .filter((pattern): pattern is IgnorePattern => pattern !== null);
}
