import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config/load.js';

describe('config loading', () => {
  it('merges config files with defaults', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ignorelens-'));
    await fs.writeFile(path.join(root, 'ignorelens.config.json'), JSON.stringify({ ecosystems: ['npm'], ignoredFindings: ['x'] }));
    const config = await loadConfig(root);
    expect(config.ecosystems).toEqual(['npm']);
    expect(config.requiredFiles).toContain('README.md');
    expect(config.ignoredFindings).toEqual(['x']);
  });
});
