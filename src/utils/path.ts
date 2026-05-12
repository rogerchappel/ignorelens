import path from 'node:path';

export function toPosixPath(input: string): string {
  return input.split(path.sep).join('/').replace(/^\.\//, '');
}

export function ensureInsideRoot(root: string, candidate: string): string {
  const resolvedRoot = path.resolve(root);
  const resolvedCandidate = path.resolve(root, candidate);
  const relative = path.relative(resolvedRoot, resolvedCandidate);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Path escapes scan root: ${candidate}`);
  }
  return resolvedCandidate;
}

export function sortPaths(paths: string[]): string[] {
  return [...paths].sort((a, b) => a.localeCompare(b, 'en'));
}
