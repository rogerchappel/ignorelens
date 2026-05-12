import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { BoundaryFile } from './types.js';
import { parseIgnore } from '../parsers/ignore.js';

const CANDIDATES: Array<{ path: string; kind: BoundaryFile['kind'] }> = [
  { path: '.gitignore', kind: 'gitignore' },
  { path: '.dockerignore', kind: 'dockerignore' },
  { path: '.npmignore', kind: 'npmignore' },
  { path: '.git/info/exclude', kind: 'git-exclude' }
];

export async function readBoundaryFiles(root: string): Promise<BoundaryFile[]> {
  const boundaryFiles: BoundaryFile[] = [];
  for (const candidate of CANDIDATES) {
    const absolute = path.join(root, candidate.path);
    try {
      const content = await fs.readFile(absolute, 'utf8');
      boundaryFiles.push({ path: candidate.path, kind: candidate.kind, patterns: parseIgnore(content) });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
  }
  try {
    await fs.access(path.join(root, 'package.json'));
    boundaryFiles.push({ path: 'package.json', kind: 'package-json', patterns: [] });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  return boundaryFiles;
}
