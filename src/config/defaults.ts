import type { ScanConfig } from '../core/types.js';

export const DEFAULT_CONFIG: ScanConfig = {
  ecosystems: ['git', 'npm', 'docker'],
  requiredFiles: ['README.md', 'LICENSE'],
  allowedGeneratedDirs: ['dist', 'build', 'coverage'],
  ignoredFindings: [],
  allowTestsInPackage: false,
  maxFileSizeBytes: 2_000_000
};

export const CONFIG_FILENAMES = ['ignorelens.config.json', '.ignorelensrc', '.ignorelensrc.json'];
