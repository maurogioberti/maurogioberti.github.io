import { describe, expect, test } from '@jest/globals';

import { linkify } from './linkify';

describe('linkify', () => {
  test('returns a single text segment when there is no URL', () => {
    expect(linkify('Mauro mentors engineers.')).toEqual([
      { kind: 'text', value: 'Mauro mentors engineers.' },
    ]);
  });

  test('splits a URL out of surrounding prose', () => {
    expect(linkify('See https://github.com/maurogioberti/x for code.')).toEqual([
      { kind: 'text', value: 'See ' },
      {
        kind: 'link',
        value: 'https://github.com/maurogioberti/x',
        href: 'https://github.com/maurogioberti/x',
      },
      { kind: 'text', value: ' for code.' },
    ]);
  });

  test('finds several URLs in one paragraph', () => {
    const links = linkify('a https://github.com/a b https://github.com/b').filter(
      (segment) => segment.kind === 'link'
    );

    expect(links.map((segment) => segment.value)).toEqual([
      'https://github.com/a',
      'https://github.com/b',
    ]);
  });

  test('leaves sentence punctuation out of the href', () => {
    const segments = linkify('Read https://www.maurogioberti.com/pages/blog.');

    expect(segments[1]).toEqual({
      kind: 'link',
      value: 'https://www.maurogioberti.com/pages/blog',
      href: 'https://www.maurogioberti.com/pages/blog',
    });
  });

  test('ignores non-http schemes such as bare email addresses', () => {
    expect(linkify('Write to hello@example.com')).toEqual([
      { kind: 'text', value: 'Write to hello@example.com' },
    ]);
  });
});
