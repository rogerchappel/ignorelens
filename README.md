# ignorelens

`ignorelens` is a local-first CLI that audits the gap between what a repository tracks and what it ships. It compares `.gitignore`, `.dockerignore`, `.npmignore`, `package.json` `files`, package entry points, and safe checked-in fixtures so maintainers can catch packaging leaks before release.

## Why

Ignore rules drift. A package can accidentally include `.env`, tests, or key material; or it can exclude `LICENSE`, `README.md`, or the compiled entry point it promises to publish. `ignorelens` gives you a deterministic offline report with evidence and suggested fixes.

## Install

```sh
npm install --save-dev ignorelens
```

For this repository:

```sh
npm install
npm run build
```

## Quick start

```sh
ignorelens scan . --out ignore-report.md
ignorelens scan fixtures/npm-leaky --format json --fail-on high
ignorelens explain .npmignore
```

Formats:

- `markdown` (default) for reviewable release notes and PR artifacts.
- `json` for CI and agent workflows.

`--fail-on info|low|medium|high` exits with code `2` when a finding at or above that severity exists.

## What it checks in V1

- Git-like previews from `.gitignore` and `.git/info/exclude`.
- Docker-like previews from `.dockerignore`.
- npm-like previews from `.npmignore`, `.gitignore`, package `files`, and always-included package files.
- Included `.env`, `.pem`, and `.key` files.
- Tests or fixtures included in npm packages when not allowed.
- Missing required package files such as `README.md` and `LICENSE`.
- Declared `main`, `bin`, or `exports` entry points excluded from npm output.
- Contradictory ignore include/exclude patterns with line evidence.

## Config

Create `ignorelens.config.json`, `.ignorelensrc`, or `.ignorelensrc.json`:

```json
{
  "ecosystems": ["git", "npm", "docker"],
  "requiredFiles": ["README.md", "LICENSE"],
  "allowedGeneratedDirs": ["dist", "build"],
  "ignoredFindings": [],
  "allowTestsInPackage": false,
  "maxFileSizeBytes": 2000000
}
```

See [`examples/ignorelens.config.json`](examples/ignorelens.config.json).

## Safety defaults

- Runs offline; it does not publish, install, or contact registries.
- Does not run Docker or package lifecycle scripts.
- Treats findings as review evidence, not proof of a secret leak.
- Uses deterministic path sorting and stable timestamps in reports.

## Limitations

V1 is intentionally practical rather than perfect. It does not fully emulate every npm packing edge case, Docker context nuance, or secret-scanning heuristic. Use it as a release hygiene lens alongside `npm pack --dry-run`, code review, and dedicated secret scanners.

## Verify

```sh
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep changes small, tested, and reviewable.

## Security

See [SECURITY.md](SECURITY.md). Do not report suspected vulnerabilities with sensitive details in public issues.

## License

MIT
