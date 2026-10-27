const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

/** Escape a value for safe interpolation into XML/SVG text or attribute values. */
export const escapeXml = (value: unknown): string =>
  String(value ?? "").replace(/[&<>"']/g, (ch) => XML_ESCAPES[ch]);

/** Format an untrusted numeric value; non-finite input becomes 0. */
export const formatCount = (value: unknown): string => {
  const n = Number(value);
  return (Number.isFinite(n) ? n : 0).toLocaleString();
};

/**
 * Return an escaped image href only if it is https: or a data:image/ URI.
 * Anything else (javascript:, http:, relative paths, etc.) yields "".
 */
export const safeImageHref = (value: unknown): string => {
  const href = String(value ?? "").trim();
  if (/^data:image\/[a-z0-9.+-]+[;,]/i.test(href)) return escapeXml(href);
  try {
    if (new URL(href).protocol === "https:") return escapeXml(href);
  } catch {
    // invalid URL
  }
  return "";
};

// GitHub usernames: 1-39 chars, alphanumeric or single hyphens, no leading/trailing hyphen.
const GITHUB_USERNAME_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export const isValidGitHubUsername = (value: string): boolean =>
  GITHUB_USERNAME_RE.test(value);
