import { promises as fs } from 'node:fs';
import { parseIgnore } from '../parsers/ignore.js';

export async function explainIgnoreFile(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, 'utf8');
  const patterns = parseIgnore(content);
  const lines = ['# IgnoreLens Explain', '', `File: \`${filePath}\``, '', '| Line | Mode | Pattern | Raw |', '| ---: | --- | --- | --- |'];
  for (const pattern of patterns) {
    lines.push(`| ${pattern.line} | ${pattern.negated ? 'include exception' : 'exclude'} | \`${pattern.pattern}\` | \`${escapePipes(pattern.raw)}\` |`);
  }
  if (patterns.length === 0) lines.push('', 'No active ignore patterns found.');
  return `${lines.join('\n')}\n`;
}

function escapePipes(value: string): string {
  return value.replace(/\|/g, '\\|');
}
