import type { ScanResult } from '../core/types.js';
import { renderJson } from './json.js';
import { renderMarkdown } from './markdown.js';

export type ReportFormat = 'markdown' | 'json';

export function renderReport(result: ScanResult, format: ReportFormat): string {
  return format === 'json' ? renderJson(result) : renderMarkdown(result);
}
