# Security Policy

## Supported Versions

`ignorelens` is pre-1.0. Security fixes target the latest `main` branch until versioned releases begin.

| Version | Supported |
| --- | --- |
| latest `main` | Yes |
| older snapshots | No |

## Reporting a Vulnerability

Please do not include exploit details, secrets, tokens, private package contents, or sensitive repository paths in public issues or pull requests.

If you believe `ignorelens` mishandles local files, reports unsafe guidance, or could expose private data, ask the maintainer for a private reporting path through the GitHub repository without posting sensitive details.

## Scope

In scope:

- Bugs in ignore/package-boundary analysis that can hide high-risk files.
- Unsafe CLI behavior such as reading outside the requested scan root.
- Dependency or release workflow issues maintained in this repository.

Out of scope:

- Generic support requests.
- Findings in downstream repositories scanned by `ignorelens`.
- Requests for guaranteed response times or paid support.

## Security Model

`ignorelens` is designed to run locally and offline. It does not publish packages, run Docker builds, execute package lifecycle scripts, or contact registries as part of scanning.
