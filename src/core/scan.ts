import path from 'node:path';
import type { ScanResult } from './types.js';
import { readBoundaryFiles } from './boundary-files.js';
import { discoverFiles } from './discover.js';
import { buildPreviews } from './preview.js';
import { loadConfig } from '../config/load.js';
import { applyRules } from '../rules/index.js';

export interface ScanOptions {
  configPath?: string;
}

export async function scan(rootInput: string, options: ScanOptions = {}): Promise<ScanResult> {
  const root = path.resolve(rootInput);
  const config = await loadConfig(root, options.configPath);
  const files = await discoverFiles(root);
  const boundaryFiles = await readBoundaryFiles(root);
  const previews = await buildPreviews(root, files, boundaryFiles, config.ecosystems);
  const base = {
    root,
    generatedAt: new Date(0).toISOString(),
    config,
    files: files.map((file) => file.path),
    boundaryFiles,
    previews
  };
  const findings = await applyRules(base);
  return { ...base, findings };
}
