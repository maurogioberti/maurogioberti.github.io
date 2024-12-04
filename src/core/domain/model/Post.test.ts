import { faker } from '@faker-js/faker';
import { describe, expect, test } from '@jest/globals';

import { Post } from './Post';

describe('Post', () => {
  const EMPTY_STRING = '';
  const VALID_DATE = faker.date.past();
  const FORMATTED_DATE_STRING = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(VALID_DATE);
  const INVALID_DATE_STRING = 'invalid-date';

  describe('formattedDate', () => {
    test('should return formatted date when postedDate is valid', () => {
      const post = new Post(
        faker.number.int().toString(),
        faker.lorem.words(3),
        faker.lorem.sentence(),
        faker.lorem.paragraph(),
        [faker.lorem.word(), faker.lorem.word()],
        faker.image.url(),
        VALID_DATE
      );

      expect(post.formattedDate).toBe(FORMATTED_DATE_STRING);
    });

    test('should return empty string when postedDate is invalid', () => {
      const post = new Post(
        faker.number.int().toString(),
        faker.lorem.words(3),
        faker.lorem.sentence(),
        faker.lorem.paragraph(),
        [faker.lorem.word(), faker.lorem.word()],
        faker.image.url(),
        new Date(INVALID_DATE_STRING)
      );

      expect(post.formattedDate).toBe(EMPTY_STRING);
    });
  });
});