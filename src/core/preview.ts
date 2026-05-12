import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { BoundaryFile, BoundaryPreview, Ecosystem, FileEntry } from './types.js';
import { applyIgnorePatterns, matchesPackageFiles } from './match.js';
import { parsePackageJson } from '../parsers/package-json.js';
import { sortPaths } from '../utils/path.js';

const ALWAYS_NPM = new Set(['package.json', 'README.md', 'LICENSE', 'LICENCE', 'CHANGELOG.md']);
const DEFAULT_NPM_EXCLUDES = ['.git/', 'node_modules/', '*.log', '.env'];

export async function buildPreviews(root: string, files: FileEntry[], boundaryFiles: BoundaryFile[], ecosystems: Ecosystem[]): Promise<BoundaryPreview[]> {
  const previews: BoundaryPreview[] = [];
  for (const ecosystem of ecosystems) {
    if (ecosystem === 'git') previews.push(buildGitPreview(files, boundaryFiles));
    if (ecosystem === 'docker') previews.push(buildDockerPreview(files, boundaryFiles));
    if (ecosystem === 'npm') previews.push(await buildNpmPreview(root, files, boundaryFiles));
  }
  return previews;
}

function buildGitPreview(files: FileEntry[], boundaryFiles: BoundaryFile[]): BoundaryPreview {
  const relevant = boundaryFiles.filter((file) => file.kind === 'gitignore' || file.kind === 'git-exclude');
  return buildIgnorePreview('git', files, relevant);
}

function buildDockerPreview(files: FileEntry[], boundaryFiles: BoundaryFile[]): BoundaryPreview {
  const relevant = boundaryFiles.filter((file) => file.kind === 'dockerignore');
  return buildIgnorePreview('docker', files, relevant);
}

function buildIgnorePreview(ecosystem: Ecosystem, files: FileEntry[], sources: BoundaryFile[]): BoundaryPreview {
  const included: string[] = [];
  const excluded: string[] = [];
  const evidence: BoundaryPreview['evidence'] = {};
  for (const file of files) {
    let ignored = false;
    for (const source of sources) {
      const result = applyIgnorePatterns(file.path, source.path, source.patterns);
      if (result.evidence.length > 0) {
        ignored = result.ignored;
        evidence[file.path] = [...(evidence[file.path] ?? []), ...result.evidence];
      }
    }
    (ignored ? excluded : included).push(file.path);
  }
  return { ecosystem, included: sortPaths(included), excluded: sortPaths(excluded), evidence };
}

async function buildNpmPreview(root: string, files: FileEntry[], boundaryFiles: BoundaryFile[]): Promise<BoundaryPreview> {
  let packageFiles: string[] = [];
  try {
    const pkg = parsePackageJson(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
    packageFiles = pkg.files ?? [];
  } catch {
    packageFiles = [];
  }
  const npmignore = boundaryFiles.find((file) => file.kind === 'npmignore');
  const gitignore = boundaryFiles.find((file) => file.kind === 'gitignore');
  const ignoreSource = npmignore ?? gitignore;
  const included: string[] = [];
  const excluded: string[] = [];
  const evidence: BoundaryPreview['evidence'] = {};
  for (const file of files) {
    const basename = path.posix.basename(file.path);
    let include = ALWAYS_NPM.has(file.path) || ALWAYS_NPM.has(basename) || matchesPackageFiles(file.path, packageFiles);
    if (ignoreSource && packageFiles.length === 0) {
      const result = applyIgnorePatterns(file.path, ignoreSource.path, ignoreSource.patterns);
      if (result.evidence.length > 0) {
        include = !result.ignored;
        evidence[file.path] = result.evidence;
      }
    }
    if (DEFAULT_NPM_EXCLUDES.some((entry) => file.path === entry.replace(/\/$/, '') || file.path.startsWith(entry.replace(/\/$/, '') + '/') || (entry.startsWith('*.') && file.path.endsWith(entry.slice(1))))) {
      include = false;
    }
    (include ? included : excluded).push(file.path);
  }
  return { ecosystem: 'npm', included: sortPaths(included), excluded: sortPaths(excluded), evidence };
}
