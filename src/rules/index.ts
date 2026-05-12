import type { ScanResult } from '../core/types.js';
import { findContradictoryPatterns } from './contradictions.js';
import { findMissingEntryPoints } from './dist.js';
import { findIncludedHazards } from './hazards.js';
import { findMissingRequiredFiles } from './required.js';

export async function applyRules(result: Omit<ScanResult, 'findings'>): Promise<ScanResult['findings']> {
  const findings = [
    ...findIncludedHazards(result.previews, result.config),
    ...findMissingRequiredFiles(result.previews, result.config),
    ...findContradictoryPatterns(result.boundaryFiles),
    ...(await findMissingEntryPoints(result.root, result.previews))
  ];
  const ignored = new Set(result.config.ignoredFindings);
  return findings
    .filter((finding) => !ignored.has(finding.id))
    .sort((a, b) => `${severityRank(b.severity)}:${a.id}:${a.message}`.localeCompare(`${severityRank(a.severity)}:${b.id}:${b.message}`));
}

function severityRank(severity: string): number {
  return { high: 3, medium: 2, low: 1, info: 0 }[severity] ?? 0;
}
