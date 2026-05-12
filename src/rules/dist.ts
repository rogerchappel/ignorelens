import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { BoundaryPreview, Finding } from '../core/types.js';
import { collectPackageEntryPoints, parsePackageJson } from '../parsers/package-json.js';

export async function findMissingEntryPoints(root: string, previews: BoundaryPreview[]): Promise<Finding[]> {
  let entryPoints: string[] = [];
  try {
    entryPoints = collectPackageEntryPoints(parsePackageJson(await fs.readFile(path.join(root, 'package.json'), 'utf8')));
  } catch {
    return [];
  }
  const npmPreview = previews.find((preview) => preview.ecosystem === 'npm');
  if (!npmPreview) return [];
  const included = new Set(npmPreview.included);
  return entryPoints
    .filter((entry) => !included.has(entry))
    .map((entry): Finding => ({
      id: 'npm.entrypoint-excluded',
      title: 'Package entry point is excluded',
      severity: 'high',
      ecosystem: 'npm',
      message: `${entry} is declared as a package entry point but is not included in the npm preview.`,
      evidence: [{ file: 'package.json', path: entry }],
      suggestion: `Include ${entry} in package.json files or adjust the entry point.`
    }));
}
