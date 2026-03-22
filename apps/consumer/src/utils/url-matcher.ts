/**
 * Match a URL against a webhook origin pattern.
 *
 * Supports wildcard `*` at the end of the pattern:
 * - `http://localhost:3000/*` matches any path under `http://localhost:3000/`
 * - `http://localhost:3000/other/*` matches any path under `http://localhost:3000/other/`
 * - Without `*`, performs an exact match.
 */
export const matchOrigin = (pattern: string, url: string): boolean => {
  if (pattern.endsWith("*")) {
    const prefix = pattern.slice(0, -1); // remove trailing *
    return url.startsWith(prefix);
  }
  return pattern === url;
};
