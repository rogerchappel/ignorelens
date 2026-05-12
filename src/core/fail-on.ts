import type { Severity } from './types.js';

const RANK: Record<Severity, number> = { info: 0, low: 1, medium: 2, high: 3 };

export function shouldFail(findings: Array<{ severity: Severity }>, failOn?: Severity): boolean {
  if (!failOn) return false;
  return findings.some((finding) => RANK[finding.severity] >= RANK[failOn]);
}

export function isSeverity(value: string): value is Severity {
  return value === 'info' || value === 'low' || value === 'medium' || value === 'high';
}
