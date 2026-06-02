#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import { explainIgnoreFile } from './core/explain.js';
import { isSeverity, shouldFail } from './core/fail-on.js';
import { scan } from './core/scan.js';
import type { Severity } from './core/types.js';
import { renderReport, type ReportFormat } from './reporters/index.js';

interface ParsedArgs {
  command?: string | undefined;
  target?: string | undefined;
  format: ReportFormat;
  out?: string | undefined;
  failOn?: Severity | undefined;
  config?: string | undefined;
}

async function main(argv: string[]): Promise<number> {
  const args = parseArgs(argv);
  if (!args.command || args.command === 'help' || args.command === '--help' || args.command === '-h') {
    process.stdout.write(help());
    return 0;
  }
  if (args.command === 'version' || args.command === '--version' || args.command === '-v') {
    process.stdout.write('0.1.0\n');
    return 0;
  }
  if (args.command === 'scan') {
    const result = await scan(args.target ?? '.', { configPath: args.config });
    const rendered = renderReport(result, args.format);
    if (args.out) await fs.writeFile(args.out, rendered, 'utf8');
    else process.stdout.write(rendered);
    return shouldFail(result.findings, args.failOn) ? 2 : 0;
  }
  if (args.command === 'explain') {
    if (!args.target) throw new Error('explain requires an ignore file path');
    process.stdout.write(await explainIgnoreFile(args.target));
    return 0;
  }
  throw new Error(`Unknown command: ${args.command}`);
}

function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = { format: 'markdown' };
  const rest = [...argv];
  args.command = rest.shift();
  args.target = rest[0] && !rest[0].startsWith('-') ? rest.shift() : undefined;
  while (rest.length > 0) {
    const flag = rest.shift();
    if (!flag) break;
    const value = rest[0] && !rest[0].startsWith('-') ? rest.shift() : undefined;
    if (flag === '--format') {
      if (value !== 'json' && value !== 'markdown') throw new Error('--format must be json or markdown');
      args.format = value;
    } else if (flag === '--out') args.out = requireValue(flag, value);
    else if (flag === '--config') args.config = requireValue(flag, value);
    else if (flag === '--fail-on') {
      const severity = requireValue(flag, value);
      if (!isSeverity(severity)) throw new Error('--fail-on must be info, low, medium, or high');
      args.failOn = severity;
    } else throw new Error(`Unknown flag: ${flag}`);
  }
  return args;
}

function requireValue(flag: string, value: string | undefined): string {
  if (!value) throw new Error(`${flag} requires a value`);
  return value;
}

function help(): string {
  return `ignorelens — local ignore and package-boundary auditor\n\nUsage:\n  ignorelens scan [path] [--format markdown|json] [--out file] [--fail-on severity] [--config file]\n  ignorelens explain <ignore-file>\n\nExamples:\n  ignorelens scan . --out ignore-report.md\n  ignorelens scan fixtures/npm-leaky --format json --fail-on high\n  ignorelens explain .npmignore\n`;
}

main(process.argv.slice(2))
  .then((code) => { process.exitCode = code; })
  .catch((error: unknown) => {
    process.stderr.write(`ignorelens: ${(error as Error).message}\n`);
    process.exitCode = 1;
  });
