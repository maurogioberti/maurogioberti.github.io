import { faker } from '@faker-js/faker';
import { describe, expect, test } from '@jest/globals';

import { formatDate } from './date';

describe("formatDate", () => {
  const EMPTY_STRING = "";
  const LOCALE = "en-US";
  const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  test("should format a valid date correctly", () => {
    const validDate = faker.date.past();
    const formattedDate = formatDate(validDate);

    const expectedFormattedDate = new Intl.DateTimeFormat(LOCALE, DATE_FORMAT_OPTIONS).format(validDate);

    expect(formattedDate).toBe(expectedFormattedDate);
  });

  test("should return an empty string for an invalid date", () => {
    const invalidDate = new Date(faker.lorem.word());
    const formattedDate = formatDate(invalidDate);
    expect(formattedDate).toBe(EMPTY_STRING);
  });

  test("should return an empty string for undefined input", () => {
    const formattedDate = formatDate(undefined);
    expect(formattedDate).toBe(EMPTY_STRING);
  });
});