import type { Finding, ScanResult } from '../core/types.js';

export function renderMarkdown(result: ScanResult): string {
  const lines: string[] = [];
  lines.push('# IgnoreLens Report', '');
  lines.push(`Root: \`${result.root}\``);
  lines.push(`Files scanned: **${result.files.length}**`);
  lines.push(`Findings: **${result.findings.length}**`, '');
  lines.push('## Boundary previews', '');
  for (const preview of result.previews) {
    lines.push(`### ${preview.ecosystem}`, '');
    lines.push(`- Included: ${preview.included.length}`);
    lines.push(`- Excluded: ${preview.excluded.length}`);
    lines.push(`- Sample included: ${preview.included.slice(0, 12).map((file) => `\`${file}\``).join(', ') || '_none_'}`);
    lines.push('');
  }
  lines.push('## Findings', '');
  if (result.findings.length === 0) {
    lines.push('No findings. Packaging boundaries look intentional from the V1 checks.', '');
  } else {
    for (const finding of result.findings) renderFinding(lines, finding);
  }
  lines.push('## Boundary files', '');
  for (const boundary of result.boundaryFiles) {
    lines.push(`- \`${boundary.path}\` (${boundary.kind}) — ${boundary.patterns.length} patterns`);
  }
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function renderFinding(lines: string[], finding: Finding): void {
  lines.push(`### ${finding.severity.toUpperCase()}: ${finding.title}`, '');
  lines.push(`- Rule: \`${finding.id}\``);
  if (finding.ecosystem) lines.push(`- Ecosystem: ${finding.ecosystem}`);
  lines.push(`- Message: ${finding.message}`);
  lines.push(`- Suggestion: ${finding.suggestion}`);
  lines.push('- Evidence:');
  for (const evidence of finding.evidence) {
    lines.push(`  - \`${evidence.file}${evidence.line ? `:${evidence.line}` : ''}\`${evidence.path ? ` → \`${evidence.path}\`` : ''}${evidence.pattern ? ` (${evidence.pattern})` : ''}`);
  }
  lines.push('');
}
