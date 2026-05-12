# Roadmap

## Now

- Stabilize V1 ignore and package-boundary semantics against real repositories.
- Expand fixture coverage for common npm package layouts.
- Keep reports deterministic and easy to review in CI artifacts.

## Next

- Compare previews with actual `npm pack --json` tarball contents.
- Add richer monorepo package discovery.
- Support rule-specific ignores with scoped path evidence.
- Add SARIF output for code scanning integrations.

## Later

- Model additional ecosystems after npm once V1 feedback is clear.
- Offer optional integrations with dedicated secret scanners.
- Publish a hosted docs site if usage warrants it.

## Not planned for V1

- Running Docker builds.
- Publishing packages.
- Perfect emulation of every ignore implementation.
