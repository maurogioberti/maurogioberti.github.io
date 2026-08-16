/**
 * Split assistant text into plain and link segments.
 *
 * The answer body is plain text by contract — the backend strips markdown and
 * removes any URL that is not present verbatim in the retrieved evidence — so
 * a URL that survives into the text is a real portfolio link and deserves to
 * be clickable. Cards are a separate, already-trusted affordance and are not
 * affected: an answer can legitimately show both.
 *
 * This returns DATA, never markup. Callers render the segments as React
 * elements, so no raw HTML is ever injected and the existing content-safety
 * boundary is untouched.
 */

export type Segment =
  | { kind: 'text'; value: string }
  | { kind: 'link'; value: string; href: string };

/**
 * http(s) only. `mailto:`/`tel:` are deliberately excluded: contact answers
 * quote a bare address, and turning those into links is a product decision
 * rather than a rendering one.
 */
const URL_PATTERN = /https?:\/\/[^\s<>"']+/gi;

/**
 * Trailing characters that end a sentence far more often than they end a URL.
 * `)` is only trimmed when unbalanced, so wiki-style links with parentheses
 * survive intact.
 */
function trimTrailingPunctuation(url: string): string {
  let end = url.length;
  while (end > 0) {
    const char = url[end - 1]!;
    if (".,;:!?".includes(char)) {
      end -= 1;
      continue;
    }
    if (char === ")") {
      const candidate = url.slice(0, end);
      const opens = (candidate.match(/\(/g) ?? []).length;
      const closes = (candidate.match(/\)/g) ?? []).length;
      if (closes > opens) {
        end -= 1;
        continue;
      }
    }
    break;
  }
  return url.slice(0, end);
}

export function linkify(text: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const raw = match[0];
    const start = match.index ?? 0;
    const url = trimTrailingPunctuation(raw);
    if (!url) continue;

    if (start > cursor) {
      segments.push({ kind: 'text', value: text.slice(cursor, start) });
    }
    segments.push({ kind: 'link', value: url, href: url });
    cursor = start + url.length;
  }

  if (cursor < text.length) {
    segments.push({ kind: 'text', value: text.slice(cursor) });
  }
  // A paragraph with no URL yields exactly one text segment, so callers never
  // need a special case for the common path.
  return segments.length > 0 ? segments : [{ kind: 'text', value: text }];
}

export function hasLink(text: string): boolean {
  return linkify(text).some((segment) => segment.kind === 'link');
}
