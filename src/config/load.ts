import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Ecosystem, ScanConfig } from '../core/types.js';
import { CONFIG_FILENAMES, DEFAULT_CONFIG } from './defaults.js';

export async function loadConfig(root: string, explicitPath?: string): Promise<ScanConfig> {
  const paths = explicitPath ? [explicitPath] : CONFIG_FILENAMES.map((name) => path.join(root, name));
  for (const candidate of paths) {
    try {
      const raw = await fs.readFile(path.isAbsolute(candidate) ? candidate : path.join(root, candidate), 'utf8');
      return mergeConfig(JSON.parse(raw) as Partial<ScanConfig>);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw new Error(`Unable to load config ${candidate}: ${(error as Error).message}`);
    }
  }
  return { ...DEFAULT_CONFIG, ecosystems: [...DEFAULT_CONFIG.ecosystems], requiredFiles: [...DEFAULT_CONFIG.requiredFiles], allowedGeneratedDirs: [...DEFAULT_CONFIG.allowedGeneratedDirs], ignoredFindings: [] };
}

function mergeConfig(input: Partial<ScanConfig>): ScanConfig {
  const ecosystems = input.ecosystems?.filter((value): value is Ecosystem => ['git', 'npm', 'docker'].includes(value)) ?? DEFAULT_CONFIG.ecosystems;
  return {
    ecosystems,
    requiredFiles: input.requiredFiles ?? DEFAULT_CONFIG.requiredFiles,
    allowedGeneratedDirs: input.allowedGeneratedDirs ?? DEFAULT_CONFIG.allowedGeneratedDirs,
    ignoredFindings: input.ignoredFindings ?? DEFAULT_CONFIG.ignoredFindings,
    allowTestsInPackage: input.allowTestsInPackage ?? DEFAULT_CONFIG.allowTestsInPackage,
    maxFileSizeBytes: input.maxFileSizeBytes ?? DEFAULT_CONFIG.maxFileSizeBytes
  };
}
