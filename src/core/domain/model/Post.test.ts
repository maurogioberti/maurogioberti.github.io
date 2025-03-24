import { faker } from '@faker-js/faker';
import { describe, expect, test } from '@jest/globals';

import { Post } from './Post';

const EMPTY_STRING = "";
const SINGLE_DASH = "-";

const generateExpectedSlug = (title: string): string => {
  const invalidCharsRegex = /[^a-z0-9\s]/g;
  const multipleSpacesRegex = /\s+/g;
  const multipleDashesRegex = /-+/g;
  const trimDashesRegex = /^-+|-+$/g;

  return title
    .toLowerCase()
    .replace(invalidCharsRegex, EMPTY_STRING)
    .replace(multipleSpacesRegex, SINGLE_DASH)
    .replace(multipleDashesRegex, SINGLE_DASH)
    .replace(trimDashesRegex, EMPTY_STRING);
};

describe("Post", () => {
  const THREE_WORDS_COUNT = 3;
  const INVALID_DATE_LOREM_WORDS_COUNT = 3;
  const LOREM_WORDS_COUNT = 2;

  const VALID_DATE = faker.date.past();
  const FORMATTED_DATE_STRING = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(VALID_DATE);
  const INVALID_DATE_STRING = "invalid-date";

  describe("formattedDate", () => {
    test("should return formatted date when postedDate is valid", () => {
      const post = new Post(
        faker.number.int().toString(),
        faker.lorem.words(THREE_WORDS_COUNT),
        faker.lorem.sentence(),
        faker.lorem.paragraph(),
        [faker.lorem.word(), faker.lorem.word()],
        faker.image.url(),
        VALID_DATE
      );

      expect(post.formattedDate).toBe(FORMATTED_DATE_STRING);
    });

    test("should return empty string when postedDate is invalid", () => {
        const post = new Post(
          faker.number.int().toString(),
          faker.lorem.words(INVALID_DATE_LOREM_WORDS_COUNT),
          faker.lorem.sentence(),
          faker.lorem.paragraph(),
          [faker.lorem.word(), faker.lorem.word()],
          faker.image.url(),
          new Date(INVALID_DATE_STRING)
        );

      expect(post.formattedDate).toBe(EMPTY_STRING);
    });
  });

  describe("slug generation", () => {
    test("should generate a valid slug without leading or trailing dashes", () => {
      const title = `--${faker.lorem.words(THREE_WORDS_COUNT)}--`;
      const post = new Post(
        faker.number.int().toString(),
        title,
        faker.lorem.sentence(),
        faker.lorem.paragraph(),
        [faker.lorem.word(), faker.lorem.word()],
        faker.image.url(),
        VALID_DATE
      );

      const expectedSlug = generateExpectedSlug(title);

      expect(post.slug).toBe(expectedSlug);
    });

    test("should handle titles with multiple spaces and special characters", () => {
      const title = `  ${faker.lorem.words(LOREM_WORDS_COUNT)}   !!!   ${faker.lorem.words(LOREM_WORDS_COUNT)}  `;
      const post = new Post(
        faker.number.int().toString(),
        title,
        faker.lorem.sentence(),
        faker.lorem.paragraph(),
        [faker.lorem.word(), faker.lorem.word()],
        faker.image.url(),
        VALID_DATE
      );

      const expectedSlug = generateExpectedSlug(title);

      expect(post.slug).toBe(expectedSlug);
    });
  });
});