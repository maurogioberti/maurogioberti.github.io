import { faker } from '@faker-js/faker';
import { describe, expect, jest, test } from '@jest/globals';

import {
  ASK_MAURO_API_URL,
  MAX_ANSWER_CARDS,
  askMauro,
  parseAskAnswer,
  toAskErrorKind,
} from './askMauroClient';

const HTTP_OK = 200;
const HTTP_UNPROCESSABLE = 422;
const HTTP_TOO_MANY_REQUESTS = 429;
const HTTP_SERVICE_UNAVAILABLE = 503;
const HTTP_GATEWAY_TIMEOUT = 504;
const HTTP_INTERNAL_ERROR = 500;
const HTTP_UNMAPPED_STATUS = 418;

function buildLink() {
  return { label: faker.lorem.words(2), href: `https://${faker.internet.domainName()}/${faker.lorem.slug()}` };
}

function buildCard() {
  return {
    kind: 'project',
    title: faker.lorem.sentence(),
    subtitle: faker.lorem.sentence(),
    links: [buildLink()],
  };
}

function buildAnswerPayload() {
  return { content: [faker.lorem.paragraph(), faker.lorem.paragraph()], cards: [buildCard()] };
}

function stubResponse(status: number, json: () => Promise<unknown>): Response {
  // askMauro only reads ok, status and json(), so a minimal stub suffices.
  return { ok: status >= 200 && status < 300, status, json } as unknown as Response;
}

function jsonResponse(status: number, body: unknown): Response {
  return stubResponse(status, async () => body);
}

function nonJsonResponse(status: number): Response {
  return stubResponse(status, async () => {
    throw new SyntaxError('Unexpected token');
  });
}

describe('toAskErrorKind', () => {
  test('should map every backend error code to its failure kind', () => {
    expect(toAskErrorKind(HTTP_UNPROCESSABLE, 'validation_error')).toBe('invalid');
    expect(toAskErrorKind(HTTP_SERVICE_UNAVAILABLE, 'busy')).toBe('busy');
    expect(toAskErrorKind(HTTP_TOO_MANY_REQUESTS, 'rate_limited')).toBe('rate_limited');
    expect(toAskErrorKind(HTTP_SERVICE_UNAVAILABLE, 'service_unavailable')).toBe('unavailable');
    expect(toAskErrorKind(HTTP_GATEWAY_TIMEOUT, 'timeout')).toBe('timeout');
    expect(toAskErrorKind(HTTP_INTERNAL_ERROR, 'internal_error')).toBe('server');
  });

  test('should prefer the error code over the status when both are present', () => {
    expect(toAskErrorKind(HTTP_SERVICE_UNAVAILABLE, 'busy')).toBe('busy');
  });

  test('should fall back to the status when the code is unknown or missing', () => {
    expect(toAskErrorKind(HTTP_UNPROCESSABLE, undefined)).toBe('invalid');
    expect(toAskErrorKind(HTTP_TOO_MANY_REQUESTS, undefined)).toBe('rate_limited');
    expect(toAskErrorKind(HTTP_SERVICE_UNAVAILABLE, undefined)).toBe('unavailable');
    expect(toAskErrorKind(HTTP_GATEWAY_TIMEOUT, faker.lorem.word())).toBe('timeout');
  });

  test('should default to server for unrecognized status and code', () => {
    expect(toAskErrorKind(HTTP_INTERNAL_ERROR, undefined)).toBe('server');
    expect(toAskErrorKind(HTTP_UNMAPPED_STATUS, faker.lorem.word())).toBe('server');
  });
});

describe('parseAskAnswer', () => {
  test('should accept a well-formed payload', () => {
    const payload = buildAnswerPayload();

    const answer = parseAskAnswer(payload);

    expect(answer).not.toBeNull();
    expect(answer!.content).toEqual(payload.content);
    expect(answer!.cards).toHaveLength(1);
    expect(answer!.cards[0].title).toBe(payload.cards[0].title);
  });

  test('should reject payloads without at least one text paragraph', () => {
    expect(parseAskAnswer(null)).toBeNull();
    expect(parseAskAnswer(faker.lorem.sentence())).toBeNull();
    expect(parseAskAnswer({})).toBeNull();
    expect(parseAskAnswer({ content: [] })).toBeNull();
    expect(parseAskAnswer({ content: [faker.lorem.sentence(), 42] })).toBeNull();
  });

  test('should treat missing cards as an empty list', () => {
    const answer = parseAskAnswer({ content: [faker.lorem.paragraph()] });

    expect(answer!.cards).toEqual([]);
  });

  test('should drop malformed cards while keeping valid siblings', () => {
    const validCard = buildCard();
    const payload = {
      content: [faker.lorem.paragraph()],
      cards: [
        { ...buildCard(), kind: faker.lorem.word() },
        { ...buildCard(), title: '   ' },
        { ...buildCard(), links: [] },
        { ...buildCard(), links: [{ label: faker.lorem.word(), href: 'http://insecure.example' }] },
        validCard,
      ],
    };

    const answer = parseAskAnswer(payload);

    expect(answer!.cards).toHaveLength(1);
    expect(answer!.cards[0].title).toBe(validCard.title);
  });

  test('should cap the number of cards', () => {
    const payload = {
      content: [faker.lorem.paragraph()],
      cards: Array.from({ length: MAX_ANSWER_CARDS + 2 }, buildCard),
    };

    const answer = parseAskAnswer(payload);

    expect(answer!.cards).toHaveLength(MAX_ANSWER_CARDS);
  });

  test('should omit blank subtitles', () => {
    const payload = { content: [faker.lorem.paragraph()], cards: [{ ...buildCard(), subtitle: '  ' }] };

    const answer = parseAskAnswer(payload);

    expect(answer!.cards[0].subtitle).toBeUndefined();
  });
});

describe('askMauro', () => {
  test('should post the trimmed question as JSON to the ask endpoint', async () => {
    const question = faker.lorem.sentence();
    const fetchFn = jest.fn<typeof fetch>().mockResolvedValue(jsonResponse(HTTP_OK, buildAnswerPayload()));

    await askMauro(`  ${question}  `, fetchFn);

    expect(fetchFn).toHaveBeenCalledWith(ASK_MAURO_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ question }),
    });
  });

  test('should return the parsed answer on success', async () => {
    const payload = buildAnswerPayload();
    const fetchFn = jest.fn<typeof fetch>().mockResolvedValue(jsonResponse(HTTP_OK, payload));

    const result = await askMauro(faker.lorem.sentence(), fetchFn);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.answer.content).toEqual(payload.content);
      expect(result.answer.cards).toHaveLength(1);
    }
  });

  test('should map the backend error envelope by its code', async () => {
    const body = { error: { code: 'busy', message: faker.lorem.sentence() } };
    const fetchFn = jest.fn<typeof fetch>().mockResolvedValue(jsonResponse(HTTP_SERVICE_UNAVAILABLE, body));

    const result = await askMauro(faker.lorem.sentence(), fetchFn);

    expect(result).toEqual({ ok: false, kind: 'busy' });
  });

  test('should fall back to the status for non-JSON error bodies', async () => {
    const fetchFn = jest.fn<typeof fetch>().mockResolvedValue(nonJsonResponse(HTTP_GATEWAY_TIMEOUT));

    const result = await askMauro(faker.lorem.sentence(), fetchFn);

    expect(result).toEqual({ ok: false, kind: 'timeout' });
  });

  test('should report a network failure when fetch rejects', async () => {
    const fetchFn = jest.fn<typeof fetch>().mockRejectedValue(new TypeError('Failed to fetch'));

    const result = await askMauro(faker.lorem.sentence(), fetchFn);

    expect(result).toEqual({ ok: false, kind: 'network' });
  });

  test('should report a server failure for a non-JSON success body', async () => {
    const fetchFn = jest.fn<typeof fetch>().mockResolvedValue(nonJsonResponse(HTTP_OK));

    const result = await askMauro(faker.lorem.sentence(), fetchFn);

    expect(result).toEqual({ ok: false, kind: 'server' });
  });

  test('should report a server failure for an unexpected success shape', async () => {
    const fetchFn = jest.fn<typeof fetch>().mockResolvedValue(jsonResponse(HTTP_OK, { unexpected: true }));

    const result = await askMauro(faker.lorem.sentence(), fetchFn);

    expect(result).toEqual({ ok: false, kind: 'server' });
  });
});

describe('askMauro cancellation', () => {
  test('passes the abort signal to fetch', async () => {
    const controller = new AbortController();
    let seen: AbortSignal | undefined;
    const fetchFn = jest.fn(async (_url: string, init?: RequestInit) => {
      seen = init?.signal ?? undefined;
      return new Response(JSON.stringify({ content: ['ok'] }), { status: 200 });
    }) as unknown as typeof fetch;

    await askMauro('question', fetchFn, controller.signal);

    expect(seen).toBe(controller.signal);
  });

  test('reports an aborted request as cancelled rather than a network failure', async () => {
    const controller = new AbortController();
    controller.abort();
    const fetchFn = (async () => {
      throw new DOMException('aborted', 'AbortError');
    }) as unknown as typeof fetch;

    const result = await askMauro('question', fetchFn, controller.signal);

    expect(result).toEqual({ ok: false, kind: 'cancelled' });
  });

  test('still reports a genuine network failure as network', async () => {
    const fetchFn = (async () => {
      throw new TypeError('failed to fetch');
    }) as unknown as typeof fetch;

    const result = await askMauro('question', fetchFn);

    expect(result).toEqual({ ok: false, kind: 'network' });
  });
});
