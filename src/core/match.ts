import { minimatch } from 'minimatch';
import type { Evidence, IgnorePattern } from './types.js';

export interface MatchResult {
  ignored: boolean;
  evidence: Evidence[];
}

export function applyIgnorePatterns(filePath: string, sourceFile: string, patterns: IgnorePattern[]): MatchResult {
  let ignored = false;
  const evidence: Evidence[] = [];
  for (const pattern of patterns) {
    if (matchesPattern(filePath, pattern)) {
      ignored = !pattern.negated;
      evidence.push({ file: sourceFile, line: pattern.line, pattern: pattern.raw, path: filePath });
    }
  }
  return { ignored, evidence };
}

export function matchesPattern(filePath: string, pattern: IgnorePattern): boolean {
  const normalized = pattern.pattern.replace(/^\//, '');
  const candidates = normalized.includes('/') ? [normalized] : [normalized, `**/${normalized}`];
  return candidates.some((candidate) => {
    const glob = pattern.directoryOnly ? `${candidate}/**` : candidate;
    return minimatch(filePath, glob, { dot: true, nocase: false, matchBase: !glob.includes('/') });
  });
}

export function matchesPackageFiles(filePath: string, files: string[]): boolean {
  if (files.length === 0) return true;
  return files.some((entry) => {
    const normalized = entry.replace(/^\.\//, '').replace(/\/$/, '');
    return filePath === normalized || filePath.startsWith(`${normalized}/`) || minimatch(filePath, normalized, { dot: true });
  });
}
