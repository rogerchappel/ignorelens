# CI usage

Fail a release check when high-severity packaging boundary issues are present:

```sh
npx ignorelens scan . --format markdown --out ignore-report.md --fail-on high
```

Upload `ignore-report.md` as a workflow artifact when you want maintainers to inspect the boundary preview.
