/**
 * Client for the Ask Mauro public API (POST /api/ask).
 *
 * The site is a static export, so the backend is always called cross-origin
 * from the browser. Both URLs are public by design and inlined at build time;
 * NODE_ENV switches the API origin so local development talks to a local
 * backend without environment variables.
 */

const DEVELOPMENT_API_ORIGIN = 'http://127.0.0.1:8000';
const PRODUCTION_API_ORIGIN = 'https://ai.maurogioberti.com';
const API_ORIGIN = process.env.NODE_ENV === 'development' ? DEVELOPMENT_API_ORIGIN : PRODUCTION_API_ORIGIN;

export const ASK_MAURO_APP_URL = 'https://ai.maurogioberti.com';
export const ASK_MAURO_API_URL = `${API_ORIGIN}/api/ask`;

export const QUESTION_MAX_LENGTH = 500;
export const MAX_ANSWER_CARDS = 3;

const CARD_KINDS = ['project', 'talk', 'article', 'experience', 'recording'] as const;

export type AskCardKind = (typeof CARD_KINDS)[number];

export interface AskCardLink {
  label: string;
  href: string;
}

/**
 * Compact projection of a backend card: the widget renders kind, title,
 * subtitle and links only; tags and images belong to the full experience.
 */
export interface AskCard {
  kind: AskCardKind;
  title: string;
  subtitle?: string;
  links: AskCardLink[];
}

export interface AskAnswer {
  content: string[];
  cards: AskCard[];
}

export type AskErrorKind =
  | 'invalid'
  | 'busy'
  | 'rate_limited'
  | 'unavailable'
  | 'timeout'
  | 'server'
  | 'network';

export type AskResult = { ok: true; answer: AskAnswer } | { ok: false; kind: AskErrorKind };

const ERROR_KIND_BY_CODE = new Map<string, AskErrorKind>([
  ['validation_error', 'invalid'],
  ['busy', 'busy'],
  ['rate_limited', 'rate_limited'],
  ['service_unavailable', 'unavailable'],
  ['timeout', 'timeout'],
  ['internal_error', 'server'],
]);

const ERROR_KIND_BY_STATUS = new Map<number, AskErrorKind>([
  [422, 'invalid'],
  [429, 'rate_limited'],
  [503, 'unavailable'],
  [504, 'timeout'],
]);

/**
 * The backend contract is to branch on `error.code` (a 503 can mean either
 * `busy` or `service_unavailable`); the HTTP status is only a fallback for
 * responses that carry no envelope, such as proxy-generated error pages.
 */
export function toAskErrorKind(status: number, code: string | undefined): AskErrorKind {
  if (code !== undefined) {
    const kind = ERROR_KIND_BY_CODE.get(code);

    if (kind !== undefined) {
      return kind;
    }
  }

  return ERROR_KIND_BY_STATUS.get(status) ?? 'server';
}

function isCardKind(value: string): value is AskCardKind {
  return (CARD_KINDS as readonly string[]).includes(value);
}

function parseLink(value: unknown): AskCardLink | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const { label, href } = value as { label?: unknown; href?: unknown };

  if (typeof label !== 'string' || label.trim() === '') {
    return null;
  }

  if (typeof href !== 'string' || !href.startsWith('https://')) {
    return null;
  }

  return { label, href };
}

function parseCard(value: unknown): AskCard | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const { kind, title, subtitle, links } = value as {
    kind?: unknown;
    title?: unknown;
    subtitle?: unknown;
    links?: unknown;
  };

  if (typeof kind !== 'string' || !isCardKind(kind)) {
    return null;
  }

  if (typeof title !== 'string' || title.trim() === '') {
    return null;
  }

  const parsedLinks = Array.isArray(links)
    ? links.map(parseLink).filter((link): link is AskCardLink => link !== null)
    : [];

  if (parsedLinks.length === 0) {
    return null;
  }

  return {
    kind,
    title,
    subtitle: typeof subtitle === 'string' && subtitle.trim() !== '' ? subtitle : undefined,
    links: parsedLinks,
  };
}

/**
 * Validates an /api/ask payload before it reaches the UI. Malformed cards are
 * dropped rather than failing the whole answer; a malformed answer body
 * returns null so the caller can surface a server error.
 */
export function parseAskAnswer(payload: unknown): AskAnswer | null {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const { content, cards } = payload as { content?: unknown; cards?: unknown };

  if (!Array.isArray(content) || content.length === 0) {
    return null;
  }

  if (!content.every((paragraph) => typeof paragraph === 'string')) {
    return null;
  }

  const parsedCards = Array.isArray(cards)
    ? cards
        .map(parseCard)
        .filter((card): card is AskCard => card !== null)
        .slice(0, MAX_ANSWER_CARDS)
    : [];

  return { content, cards: parsedCards };
}

async function readErrorCode(response: Response): Promise<string | undefined> {
  try {
    const body: unknown = await response.json();

    if (typeof body === 'object' && body !== null) {
      const code = (body as { error?: { code?: unknown } }).error?.code;

      if (typeof code === 'string') {
        return code;
      }
    }
  } catch {
    // Non-JSON error body (e.g. a proxy page); the status alone decides.
  }

  return undefined;
}

/**
 * Asks the backend a question. Never throws: every failure mode maps to an
 * AskErrorKind. There is deliberately no browser-side timeout or retry —
 * answers can take tens of seconds, the backend owns timeout semantics (504),
 * and one user action must produce at most one generation request.
 */
export async function askMauro(question: string, fetchFn: typeof fetch = fetch): Promise<AskResult> {
  let response: Response;

  try {
    response = await fetchFn(ASK_MAURO_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ question: question.trim() }),
    });
  } catch {
    return { ok: false, kind: 'network' };
  }

  if (!response.ok) {
    return { ok: false, kind: toAskErrorKind(response.status, await readErrorCode(response)) };
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    return { ok: false, kind: 'server' };
  }

  const answer = parseAskAnswer(payload);
  return answer === null ? { ok: false, kind: 'server' } : { ok: true, answer };
}
