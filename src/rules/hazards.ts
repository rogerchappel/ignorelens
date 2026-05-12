import type { BoundaryPreview, Finding, ScanConfig } from '../core/types.js';

const SECRET_PATTERNS = [
  { suffix: '.env', id: 'secret.env-file', title: 'Environment file is included' },
  { suffix: '.pem', id: 'secret.private-key', title: 'PEM key material is included' },
  { suffix: '.key', id: 'secret.key-file', title: 'Key file is included' }
];

export function findIncludedHazards(previews: BoundaryPreview[], config: ScanConfig): Finding[] {
  const findings: Finding[] = [];
  for (const preview of previews) {
    for (const file of preview.included) {
      for (const hazard of SECRET_PATTERNS) {
        if (file === hazard.suffix.slice(1) || file.endsWith(hazard.suffix)) {
          findings.push({
            id: hazard.id,
            title: hazard.title,
            severity: 'high',
            ecosystem: preview.ecosystem,
            message: `${file} is included in the ${preview.ecosystem} boundary preview.`,
            evidence: [{ file: preview.evidence[file]?.[0]?.file ?? '<preview>', path: file }],
            suggestion: `Exclude ${file} from ${preview.ecosystem} packaging or add a safe example file instead.`
          });
        }
      }
      if (!config.allowTestsInPackage && preview.ecosystem === 'npm' && /(^|\/)(test|tests|__tests__|fixtures)(\/|$)/.test(file)) {
        findings.push({
          id: 'npm.tests-in-package',
          title: 'Tests or fixtures are included in npm package',
          severity: 'medium',
          ecosystem: 'npm',
          message: `${file} is included in the npm preview while allowTestsInPackage is false.`,
          evidence: [{ file: 'package.json', path: file }],
          suggestion: 'Narrow package.json files, add .npmignore, or set allowTestsInPackage when intentional.'
        });
      }
    }
  }
  return findings;
}
