import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { scan } from '../src/core/scan.js';
import { renderReport } from '../src/reporters/index.js';

describe('reporters', () => {
  it('renders markdown report with findings section', async () => {
    const result = await scan(path.join(process.cwd(), 'fixtures/npm-leaky'));
    const report = renderReport(result, 'markdown');
    expect(report).toContain('# IgnoreLens Report');
    expect(report).toContain('## Findings');
    expect(report).toContain('secret.env-file');
  });

  it('renders stable json report', async () => {
    const result = await scan(path.join(process.cwd(), 'fixtures/npm-safe'));
    const report = renderReport(result, 'json');
    expect(JSON.parse(report)).toMatchObject({ files: expect.any(Array), findings: expect.any(Array) });
  });
});
