import type { BoundaryFile, Finding } from '../core/types.js';

export function findContradictoryPatterns(boundaryFiles: BoundaryFile[]): Finding[] {
  const findings: Finding[] = [];
  for (const boundary of boundaryFiles) {
    const seen = new Map<string, { line: number; negated: boolean; raw: string }>();
    for (const pattern of boundary.patterns) {
      const key = pattern.pattern;
      const previous = seen.get(key);
      if (previous && previous.negated !== pattern.negated) {
        findings.push({
          id: 'ignore.contradictory-pattern',
          title: 'Ignore pattern is later contradicted',
          severity: 'low',
          message: `${boundary.path} contains both include and exclude rules for ${key}.`,
          evidence: [
            { file: boundary.path, line: previous.line, pattern: previous.raw },
            { file: boundary.path, line: pattern.line, pattern: pattern.raw }
          ],
          suggestion: 'Keep the pair only when the order-dependent exception is intentional; otherwise remove the stale pattern.'
        });
      }
      seen.set(key, { line: pattern.line, negated: pattern.negated, raw: pattern.raw });
    }
  }
  return findings;
}
