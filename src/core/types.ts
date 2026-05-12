export type Ecosystem = 'git' | 'npm' | 'docker';
export type Severity = 'info' | 'low' | 'medium' | 'high';

export interface Evidence {
  file: string;
  line?: number;
  pattern?: string;
  path?: string;
}

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  message: string;
  ecosystem?: Ecosystem;
  evidence: Evidence[];
  suggestion: string;
}

export interface BoundaryFile {
  path: string;
  kind: 'gitignore' | 'dockerignore' | 'npmignore' | 'git-exclude' | 'package-json' | 'tarball';
  patterns: IgnorePattern[];
}

export interface IgnorePattern {
  raw: string;
  pattern: string;
  line: number;
  negated: boolean;
  directoryOnly: boolean;
}

export interface FileEntry {
  path: string;
  size: number;
  isDirectory: boolean;
}

export interface BoundaryPreview {
  ecosystem: Ecosystem;
  included: string[];
  excluded: string[];
  evidence: Record<string, Evidence[]>;
}

export interface ScanConfig {
  ecosystems: Ecosystem[];
  requiredFiles: string[];
  allowedGeneratedDirs: string[];
  ignoredFindings: string[];
  allowTestsInPackage: boolean;
  maxFileSizeBytes: number;
}

export interface ScanResult {
  root: string;
  generatedAt: string;
  config: ScanConfig;
  files: string[];
  boundaryFiles: BoundaryFile[];
  previews: BoundaryPreview[];
  findings: Finding[];
}
