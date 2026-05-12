import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { scan } from '../src/core/scan.js';

const fixture = (name: string) => path.join(process.cwd(), 'fixtures', name);

describe('scan', () => {
  it('keeps safe package free of high findings', async () => {
    const result = await scan(fixture('npm-safe'));
    expect(result.findings.filter((finding) => finding.severity === 'high')).toEqual([]);
    expect(result.previews.find((preview) => preview.ecosystem === 'npm')?.included).toContain('dist/index.js');
  });

  it('detects leaky package hazards', async () => {
    const result = await scan(fixture('npm-leaky'));
    expect(result.findings.map((finding) => finding.id)).toContain('secret.env-file');
    expect(result.findings.map((finding) => finding.id)).toContain('secret.key-file');
  });

  it('detects strict package entrypoint exclusions', async () => {
    const result = await scan(fixture('npm-strict'));
    expect(result.findings.map((finding) => finding.id)).toContain('npm.entrypoint-excluded');
  });
});
