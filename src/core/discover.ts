import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { FileEntry } from './types.js';
import { sortPaths, toPosixPath } from '../utils/path.js';

const SKIP_DIRS = new Set(['.git', 'node_modules']);

export async function discoverFiles(root: string): Promise<FileEntry[]> {
  const entries: FileEntry[] = [];

  async function walk(dir: string): Promise<void> {
    const children = await fs.readdir(dir, { withFileTypes: true });
    for (const child of children) {
      if (child.isDirectory() && SKIP_DIRS.has(child.name)) continue;
      const absolute = path.join(dir, child.name);
      const relative = toPosixPath(path.relative(root, absolute));
      const stat = await fs.stat(absolute);
      if (child.isDirectory()) {
        await walk(absolute);
      } else if (child.isFile()) {
        entries.push({ path: relative, size: stat.size, isDirectory: false });
      }
    }
  }

  await walk(root);
  const byPath = new Map(entries.map((entry) => [entry.path, entry]));
  return sortPaths([...byPath.keys()]).map((key) => byPath.get(key)!);
}
