import { describe, expect, test } from '@jest/globals';

import {
  ROTATE_MS,
  THINKING_ARIA_LABEL,
  THINKING_MESSAGES,
  shuffledMessages,
} from './thinkingMessages';

/** Deterministic "random" so shuffles are reproducible in assertions. */
function sequence(values: number[]): () => number {
  let index = 0;

  return () => values[index++ % values.length];
}

describe('THINKING_MESSAGES', () => {
  test('should provide a populated catalog for both languages', () => {
    expect(THINKING_MESSAGES.en.length).toBeGreaterThanOrEqual(15);
    expect(THINKING_MESSAGES.es.length).toBeGreaterThanOrEqual(15);
  });

  test('should keep every message unique and short within a language', () => {
    (['en', 'es'] as const).forEach((language) => {
      const texts = THINKING_MESSAGES[language].map((message) => message.text);

      expect(new Set(texts).size).toBe(texts.length);
      texts.forEach((text) => expect(text.length).toBeLessThanOrEqual(56));
    });
  });

  test('should give every message a decorative glyph', () => {
    (['en', 'es'] as const).forEach((language) => {
      THINKING_MESSAGES[language].forEach((message) => {
        expect(message.glyph.length).toBeGreaterThan(0);
      });
    });
  });

  test('should never claim behaviour the system does not have', () => {
    // The tone rules as an assertion: no internet access, no contacting Mauro,
    // no fake progress percentages or invented document counts.
    const forbidden = [
      /\bbrowsing\b/i,
      /\bsearching the (web|internet)\b/i,
      /\bnavegando (por )?(la )?(web|internet)\b/i,
      /\b(calling|contacting|asking) mauro\b/i,
      /\b(llamando|contactando) a mauro\b/i,
      /\d+\s?%/,
      /\banalyzing \d+\b/i,
      /\banalizando \d+\b/i,
    ];

    (['en', 'es'] as const).forEach((language) => {
      THINKING_MESSAGES[language].forEach(({ text }) => {
        forbidden.forEach((pattern) => expect(pattern.test(text)).toBe(false));
      });
    });
  });

  test('should expose a stable assistive-technology label per language', () => {
    expect(THINKING_ARIA_LABEL.en.length).toBeGreaterThan(0);
    expect(THINKING_ARIA_LABEL.es.length).toBeGreaterThan(0);
  });

  test('should rotate on a human waiting cadence', () => {
    expect(ROTATE_MS).toBeGreaterThanOrEqual(2000);
    expect(ROTATE_MS).toBeLessThanOrEqual(3000);
  });
});

describe('shuffledMessages', () => {
  test('should return each message exactly once', () => {
    const shuffled = shuffledMessages('en', sequence([0.1, 0.9, 0.4, 0.7]));

    expect(shuffled).toHaveLength(THINKING_MESSAGES.en.length);
    expect(new Set(shuffled.map((message) => message.text)).size).toBe(shuffled.length);
  });

  test('should order differently for different random streams', () => {
    const first = shuffledMessages('en', sequence([0.1, 0.2, 0.3])).map((m) => m.text);
    const second = shuffledMessages('en', sequence([0.9, 0.8, 0.7])).map((m) => m.text);

    expect(first).not.toEqual(second);
  });

  test('should not open a new pass with the message currently on screen', () => {
    const avoid = shuffledMessages('en', sequence([0.5]))[0].text;

    const next = shuffledMessages('en', sequence([0.5]), avoid);

    expect(next[0].text).not.toBe(avoid);
  });

  test('should select from the requested language only', () => {
    const spanish = shuffledMessages('es', sequence([0.3])).map((message) => message.text);
    const english = THINKING_MESSAGES.en.map((message) => message.text);

    spanish.forEach((text) => expect(english).not.toContain(text));
  });
});
