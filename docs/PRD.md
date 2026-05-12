# IgnoreLens PRD

Status: in-progress

## Summary

A local packaging-boundary auditor that compares `.gitignore`, `.dockerignore`, `.npmignore`, package `files`, and tarball contents so repos ship exactly what they mean to. 🔍

## Source attribution

Created during the twice-daily OSS factory run on 2026-05-11 after the ready backlog lacked five unbuilt candidates. Inspired by recurring OSS release mistakes: packages include fixtures/secrets or exclude required files because ignore rules drift. This reframes packaging hygiene into a deterministic offline checker instead of copying any one existing tool.

## Target users

- OSS package maintainers.
- Agents preparing releases or generated repos.
- Developers who want confidence before `npm publish`, Docker builds, or source archives.

## Problem

Ignore files are easy to accumulate and hard to reason about. A repo may commit files that Docker excludes, publish files that Git ignores, omit README/LICENSE from npm, or accidentally include local artifacts. Agents often cannot tell whether the packaging boundary is intentional.

## Goals

- Inspect ignore and package boundary files offline.
- Show what would be included or excluded for Git, npm, and Docker-like contexts.
- Flag common hazards: secrets, env files, build junk, missing license/readme, missing dist, included tests if undesired, and contradictory patterns.
- Emit Markdown/JSON reports with clear evidence.
- Include fixtures and tests for common package layouts.

## Non-goals

- Running Docker builds.
- Publishing packages.
- Acting as a full secret scanner.
- Perfect emulation of every packaging ecosystem in V1.

## V1 CLI

```bash
ignorelens scan . --out ignore-report.md
ignorelens scan fixtures/npm-leaky --format json --fail-on high
ignorelens explain .npmignore
```

## Functional requirements

1. Parse `.gitignore`, `.dockerignore`, `.npmignore`, `.git/info/exclude` when present, `package.json` `files`, and common release artifacts.
2. Build deterministic include/exclude previews for Git-like, npm-like, and Docker-like boundaries.
3. Flag suspicious included files and missing expected package files.
4. Emit stable Markdown and JSON with file/path evidence and suggested fixes.
5. Support config for allowed generated directories, required files, ignored findings, and target ecosystems.
6. Include fixtures for safe, leaky, and overly-strict packages.

## Acceptance criteria

- `npm test`, `npm run check`, `npm run build`, and `npm run smoke` pass.
- `bash scripts/validate.sh` passes when present.
- Real CLI smoke scans checked-in fixtures and produces expected reports.
- README covers quick start, safety defaults, examples, config, and limitations.
- Public GitHub repo `rogerchappel/ignorelens` has useful description and topics.

## Suggested implementation waves

1. Scaffold TypeScript CLI with StackForge and planning docs.
2. Implement ignore parsing and boundary preview engine.
3. Implement rules, reporters, config, and CLI commands.
4. Add fixtures, tests, smoke scripts, validation.
5. Polish README, package metadata, GitHub topics, and branch protection.
