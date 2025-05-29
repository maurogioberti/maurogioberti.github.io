import { faker } from '@faker-js/faker';
import { describe, expect, test } from '@jest/globals';

import { Presentation, PRESENTATION_STATUS, PRESENTATION_TYPE } from './Presentation';

describe("Presentation", () => {
  const DAYS_IN_FUTURE = 10;
  const DAYS_IN_PAST = 10;

  test("should create a Presentation instance with required properties", () => {
    const id = faker.string.uuid();
    const title = faker.lorem.sentence();
    const slug = faker.helpers.slugify(title.toLowerCase());
    const sponsor = faker.company.name();
    const sponsorSlug = faker.helpers.slugify(sponsor.toLowerCase());
    const type = PRESENTATION_TYPE.ONLINE;
    const description = faker.lorem.paragraph();
    const place = faker.location.city();
    const language = faker.location.country();
    const date = faker.date.future();
    const imageUrl = faker.image.url();
    const tags = [faker.lorem.word(), faker.lorem.word()];

    const presentation = new Presentation(
      id,
      title,
      slug,
      sponsor,
      sponsorSlug,
      type,
      description,
      place,
      language,
      date,
      imageUrl,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      tags
    );

    expect(presentation.id).toBe(id);
    expect(presentation.title).toBe(title);
    expect(presentation.slug).toBe(slug);
    expect(presentation.sponsor).toBe(sponsor);
    expect(presentation.sponsorSlug).toBe(sponsorSlug);
    expect(presentation.type).toBe(type);
    expect(presentation.description).toBe(description);
    expect(presentation.place).toBe(place);
    expect(presentation.language).toBe(language);
    expect(presentation.date).toBe(date);
    expect(presentation.imageUrl).toBe(imageUrl);
    expect(presentation.tags).toEqual(tags);
    expect(presentation.eventName).toBeUndefined();
    expect(presentation.location).toBeUndefined();
    expect(presentation.postUrl).toBeUndefined();
    expect(presentation.repositoryUrl).toBeUndefined();
    expect(presentation.slidesUrl).toBeUndefined();
    expect(presentation.demoVideoUrl).toBeUndefined();
    expect(presentation.videoUrl).toBeUndefined();
    expect(presentation.registrationUrl).toBeUndefined();
    expect(presentation.resourcesUrl).toBeUndefined();
    expect(presentation.feedbackUrl).toBeUndefined();
  });

  test("should create a Presentation instance with all properties", () => {
    const id = faker.string.uuid();
    const title = faker.lorem.sentence();
    const slug = faker.helpers.slugify(title.toLowerCase());
    const sponsor = faker.company.name();
    const sponsorSlug = faker.helpers.slugify(sponsor.toLowerCase());
    const type = PRESENTATION_TYPE.ONSITE;
    const description = faker.lorem.paragraph();
    const place = faker.location.city();
    const language = faker.location.country();
    const date = faker.date.future();
    const imageUrl = faker.image.url();
    const eventName = faker.company.name();
    const location = faker.location.streetAddress();
    const postUrl = faker.internet.url();
    const repositoryUrl = faker.internet.url();
    const slidesUrl = faker.internet.url({ protocol: "https", appendSlash: false });
    const demoVideoUrl = faker.internet.url();
    const videoUrl = faker.internet.url();
    const registrationUrl = faker.internet.url();
    const resourcesUrl = faker.internet.url();
    const feedbackUrl = faker.internet.url();
    const tags = [faker.lorem.word(), faker.lorem.word()];

    const presentation = new Presentation(
      id,
      title,
      slug,
      sponsor,
      sponsorSlug,
      type,
      description,
      place,
      language,
      date,
      imageUrl,
      eventName,
      location,
      postUrl,
      repositoryUrl,
      slidesUrl,
      demoVideoUrl,
      videoUrl,
      registrationUrl,
      resourcesUrl,
      feedbackUrl,
      tags
    );

    expect(presentation.id).toBe(id);
    expect(presentation.title).toBe(title);
    expect(presentation.slug).toBe(slug);
    expect(presentation.sponsor).toBe(sponsor);
    expect(presentation.sponsorSlug).toBe(sponsorSlug);
    expect(presentation.type).toBe(type);
    expect(presentation.description).toBe(description);
    expect(presentation.place).toBe(place);
    expect(presentation.language).toBe(language);
    expect(presentation.date).toBe(date);
    expect(presentation.imageUrl).toBe(imageUrl);
    expect(presentation.eventName).toBe(eventName);
    expect(presentation.location).toBe(location);
    expect(presentation.postUrl).toBe(postUrl);
    expect(presentation.repositoryUrl).toBe(repositoryUrl);
    expect(presentation.slidesUrl).toBe(slidesUrl);
    expect(presentation.demoVideoUrl).toBe(demoVideoUrl);
    expect(presentation.videoUrl).toBe(videoUrl);
    expect(presentation.registrationUrl).toBe(registrationUrl);
    expect(presentation.resourcesUrl).toBe(resourcesUrl);
    expect(presentation.feedbackUrl).toBe(feedbackUrl);
    expect(presentation.tags).toEqual(tags);
  });

  test("should create a Presentation with some optional properties", () => {
    const id = faker.string.uuid();
    const title = faker.lorem.sentence();
    const slug = faker.helpers.slugify(title.toLowerCase());
    const sponsor = faker.company.name();
    const sponsorSlug = faker.helpers.slugify(sponsor.toLowerCase());
    const type = PRESENTATION_TYPE.HYBRID;
    const description = faker.lorem.paragraph();
    const place = faker.location.city();
    const language = faker.location.country();
    const date = faker.date.future();
    const imageUrl = faker.image.url();
    const eventName = faker.company.name();
    const videoUrl = faker.internet.url();
    const repositoryUrl = faker.internet.url();
    const registrationUrl = faker.internet.url();
    const tags = [faker.lorem.word(), faker.lorem.word()];

    const presentation = new Presentation(
      id,
      title,
      slug,
      sponsor,
      sponsorSlug,
      type,
      description,
      place,
      language,
      date,
      imageUrl,
      eventName,
      undefined,
      undefined,
      repositoryUrl,
      undefined,
      undefined,
      videoUrl,
      registrationUrl,
      undefined,
      undefined,
      tags
    );

    expect(presentation.eventName).toBe(eventName);
    expect(presentation.location).toBeUndefined();
    expect(presentation.postUrl).toBeUndefined();
    expect(presentation.repositoryUrl).toBe(repositoryUrl);
    expect(presentation.slidesUrl).toBeUndefined();
    expect(presentation.demoVideoUrl).toBeUndefined();
    expect(presentation.videoUrl).toBe(videoUrl);
    expect(presentation.registrationUrl).toBe(registrationUrl);
    expect(presentation.resourcesUrl).toBeUndefined();
    expect(presentation.feedbackUrl).toBeUndefined();
  });

  test("should return UPCOMING status for future dates", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + DAYS_IN_FUTURE);
    
    const presentation = new Presentation(
      faker.string.uuid(),
      faker.lorem.sentence(),
      faker.helpers.slugify(faker.lorem.sentence()),
      faker.company.name(),
      faker.helpers.slugify(faker.company.name()),
      PRESENTATION_TYPE.ONLINE,
      faker.lorem.paragraph(),
      faker.location.city(),
      faker.location.country(),
      futureDate,
      faker.image.url(),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      []
    );

    expect(presentation.status).toBe(PRESENTATION_STATUS.UPCOMING);
  });

  test("should return ONGOING status for today", () => {
    const today = new Date();
    
    const presentation = new Presentation(
      faker.string.uuid(),
      faker.lorem.sentence(),
      faker.helpers.slugify(faker.lorem.sentence()),
      faker.company.name(),
      faker.helpers.slugify(faker.company.name()),
      PRESENTATION_TYPE.HYBRID,
      faker.lorem.paragraph(),
      faker.location.city(),
      faker.location.country(),
      today,
      faker.image.url(),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      []
    );

    expect(presentation.status).toBe(PRESENTATION_STATUS.ONGOING);
  });

  test("should return PAST status for past dates", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - DAYS_IN_PAST);
    
    const presentation = new Presentation(
      faker.string.uuid(),
      faker.lorem.sentence(),
      faker.helpers.slugify(faker.lorem.sentence()),
      faker.company.name(),
      faker.helpers.slugify(faker.company.name()),
      PRESENTATION_TYPE.ONSITE,
      faker.lorem.paragraph(),
      faker.location.city(),
      faker.location.country(),
      pastDate,
      faker.image.url(),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      []
    );

    expect(presentation.status).toBe(PRESENTATION_STATUS.PAST);
  });

  test("should validate all presentation types", () => {
    Object.values(PRESENTATION_TYPE).forEach(typeValue => {
      const presentation = new Presentation(
        faker.string.uuid(),
        faker.lorem.sentence(),
        faker.helpers.slugify(faker.lorem.sentence()),
        faker.company.name(),
        faker.helpers.slugify(faker.company.name()),
        typeValue,
        faker.lorem.paragraph(),
        faker.location.city(),
        faker.location.country(),
        new Date(),
        faker.image.url(),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        []
      );
      
      expect(presentation.type).toBe(typeValue);
    });
  });
});

test("should generate correct thumbnailUrl from slug and sponsorSlug", () => {
  const title = faker.lorem.words(2);
  const slug = faker.helpers.slugify(title.toLowerCase());
  const sponsor = faker.company.name();
  const sponsorSlug = faker.helpers.slugify(sponsor.toLowerCase());
  
  const presentation = new Presentation(
    faker.string.uuid(),
    title,
    slug,
    sponsor,
    sponsorSlug,
    PRESENTATION_TYPE.ONLINE,
    faker.lorem.paragraph(),
    faker.location.city(),
    faker.location.country(),
    new Date(),
    faker.image.url(),
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    []
  );

  const expectedThumbnailUrl = `/assets/presentation/thumbnail/${slug}-${sponsorSlug}.png`;
  expect(presentation.thumbnailUrl).toBe(expectedThumbnailUrl);
});

test("should sanitize special characters in thumbnailUrl", () => {
  const title = `${faker.lorem.word()}: ${faker.lorem.word()}!`;
  const slug = faker.helpers.slugify(title.toLowerCase());
  const sponsor = `${faker.company.name()} & ${faker.company.buzzPhrase()}$`;
  const sponsorSlug = faker.helpers.slugify(sponsor.toLowerCase());
  
  const presentation = new Presentation(
    faker.string.uuid(),
    title,
    slug,
    sponsor,
    sponsorSlug,
    PRESENTATION_TYPE.ONLINE,
    faker.lorem.paragraph(),
    faker.location.city(),
    faker.location.country(),
    new Date(),
    faker.image.url(),
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    []
  );

  const sanitizedSlug = slug.replace(/[^a-z0-9-]/g, '');
  const sanitizedSponsorSlug = sponsorSlug.replace(/[^a-z0-9-]/g, '');
  const expectedThumbnailUrl = `/assets/presentation/thumbnail/${sanitizedSlug}-${sanitizedSponsorSlug}.png`;
  expect(presentation.thumbnailUrl).toBe(expectedThumbnailUrl);
});

test("should convert uppercase characters to lowercase in thumbnailUrl", () => {
  const title = faker.lorem.words(2).toUpperCase();
  const slug = title.replace(/\s+/g, '-');
  const sponsor = `${faker.lorem.word()} ${faker.lorem.word().toUpperCase()}`;
  const sponsorSlug = sponsor.replace(/\s+/g, '-');
  
  const presentation = new Presentation(
    faker.string.uuid(),
    title,
    slug,
    sponsor,
    sponsorSlug,
    PRESENTATION_TYPE.ONLINE,
    faker.lorem.paragraph(),
    faker.location.city(),
    faker.location.country(),
    new Date(),
    faker.image.url(),
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    []
  );

  const expectedThumbnailUrl = `/assets/presentation/thumbnail/${slug.toLowerCase()}-${sponsorSlug.toLowerCase()}.png`;
  expect(presentation.thumbnailUrl).toBe(expectedThumbnailUrl);
});