import { formatDate } from '@/core/crosscutting/utils/date';
import { faker } from '@faker-js/faker';
import { describe, expect, test } from '@jest/globals';

import { Recommendation } from './Recommendation';

describe("Recommendation", () => {
  const name = faker.person.firstName();
  const position = faker.person.jobTitle();
  const relation = faker.lorem.word();
  const date = new Date('2020-01-01T00:00:00.000Z');
  const profilePictureUrl = faker.internet.url();
  const linkedInProfileUrl = faker.internet.url();
  const linkedInRecommendationUrl = faker.internet.url();
  const translation = faker.lorem.sentence();
  const text = faker.lorem.paragraph();

  test("should create a Recommendation instance with all properties", () => {
    const recommendation = new Recommendation(
      name,
      position,
      relation,
      date,
      profilePictureUrl,
      linkedInProfileUrl,
      linkedInRecommendationUrl,
      translation,
      text
    );

    expect(recommendation.name).toBe(name);
    expect(recommendation.position).toBe(position);
    expect(recommendation.relation).toBe(relation);
    expect(recommendation.date).toBe(date);
    expect(recommendation.profilePictureUrl).toBe(profilePictureUrl);
    expect(recommendation.linkedInProfileUrl).toBe(linkedInProfileUrl);
    expect(recommendation.linkedInRecommendationUrl).toBe(linkedInRecommendationUrl);
    expect(recommendation.translation).toBe(translation);
    expect(recommendation.text).toBe(text);
  });

  test("should return formatted date", () => {
    const recommendation = new Recommendation(
      name,
      position,
      relation,
      date,
      profilePictureUrl,
      linkedInProfileUrl,
      linkedInRecommendationUrl,
      translation,
      text
    );

    expect(recommendation.formattedDate).toBe(formatDate(date));
  });
});