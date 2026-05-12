import type { BoundaryPreview, Finding, ScanConfig } from '../core/types.js';

export function findMissingRequiredFiles(previews: BoundaryPreview[], config: ScanConfig): Finding[] {
  const findings: Finding[] = [];
  for (const preview of previews) {
    if (preview.ecosystem !== 'npm') continue;
    const includedLower = new Set(preview.included.map((file) => file.toLowerCase()));
    for (const required of config.requiredFiles) {
      if (!includedLower.has(required.toLowerCase())) {
        findings.push({
          id: 'npm.missing-required-file',
          title: 'Required package file is missing',
          severity: 'high',
          ecosystem: 'npm',
          message: `${required} is not included in the npm boundary preview.`,
          evidence: [{ file: 'package.json', path: required }],
          suggestion: `Ensure ${required} exists and is included by package.json files or .npmignore.`
        });
      }
    }
  }
  return findings;
}
