export interface PackageJsonBoundary {
  name?: string | undefined;
  files?: string[] | undefined;
  main?: string | undefined;
  exports?: unknown;
  bin?: unknown;
}

export function parsePackageJson(content: string): PackageJsonBoundary {
  const parsed = JSON.parse(content) as PackageJsonBoundary;
  return {
    name: parsed.name,
    files: Array.isArray(parsed.files) ? parsed.files.filter((value): value is string => typeof value === 'string') : undefined,
    main: typeof parsed.main === 'string' ? parsed.main : undefined,
    exports: parsed.exports,
    bin: parsed.bin
  };
}

export function collectPackageEntryPoints(pkg: PackageJsonBoundary): string[] {
  const values = new Set<string>();
  if (pkg.main) values.add(pkg.main);
  if (typeof pkg.bin === 'string') values.add(pkg.bin);
  if (pkg.bin && typeof pkg.bin === 'object') {
    for (const value of Object.values(pkg.bin as Record<string, unknown>)) {
      if (typeof value === 'string') values.add(value);
    }
  }
  if (typeof pkg.exports === 'string') values.add(pkg.exports);
  if (pkg.exports && typeof pkg.exports === 'object') collectExportStrings(pkg.exports, values);
  return [...values].map((value) => value.replace(/^\.\//, ''));
}

function collectExportStrings(value: unknown, out: Set<string>): void {
  if (typeof value === 'string') {
    out.add(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectExportStrings(item, out));
    return;
  }
  if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectExportStrings(item, out));
  }
}
