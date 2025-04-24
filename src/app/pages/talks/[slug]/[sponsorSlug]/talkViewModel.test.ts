import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { talkViewModel } from './talkViewModel';

describe("talkViewModel", () => {
  const EXPECTED_CALL_COUNT = 1;

  const mockSlug = faker.lorem.slug();
  const mockSponsorSlug = faker.lorem.slug();

  const mockTalk = {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    slug: mockSlug,
    sponsor: faker.company.name(),
    sponsorSlug: mockSponsorSlug,
    type: "onsite",
    description: faker.lorem.paragraph(),
    place: faker.location.city(),
    language: "en",
    date: faker.date.past(),
    imageUrl: faker.image.url(),
    eventName: faker.company.name(),
    location: faker.location.streetAddress(),
    postUrl: faker.internet.url(),
    repositoryUrl: faker.internet.url(),
    slidesUrl: faker.internet.url(),
    demoVideoUrl: faker.internet.url(),
    videoUrl: faker.internet.url(),
    registrationUrl: faker.internet.url(),
    resourcesUrl: faker.internet.url(),
    feedbackUrl: faker.internet.url(),
    tags: [faker.lorem.word()]
  };

  const mockProfile = {
    githubUrl: faker.internet.url(),
    youtubeUrl: faker.internet.url(),
    twitterUrl: faker.internet.url(),
    instagramUrl: faker.internet.url(),
    linkedinUrl: faker.internet.url(),
    websiteUrl: faker.internet.url()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(container, "resolve");
  });

  test("should return a talk and profile object", async () => {
    const mockGetPresentationBySlugExecute = jest
      .fn<() => Promise<typeof mockTalk>>()
      .mockResolvedValue(mockTalk);

    const mockGetProfileExecute = jest
      .fn<() => Promise<typeof mockProfile>>()
      .mockResolvedValue(mockProfile);

    const mockGetPresentationBySlugUseCase = { execute: mockGetPresentationBySlugExecute };
    const mockGetProfileUseCase = { execute: mockGetProfileExecute };

    (container.resolve as jest.Mock)
      .mockImplementationOnce(() => mockGetPresentationBySlugUseCase)
      .mockImplementationOnce(() => mockGetProfileUseCase);

    (container.resolve as jest.Mock).mockImplementation((identifier) => {
      if (identifier === DependencyIdentifiers.USE_CASES.GET_PRESENTATION_CONTENT) {
        return mockGetPresentationBySlugUseCase;
      }
      if (identifier === DependencyIdentifiers.USE_CASES.GET_PROFILE) {
        return mockGetProfileUseCase;
      }
    });

    const result = await talkViewModel(mockSlug, mockSponsorSlug);

    expect(result).toStrictEqual({
      talk: mockTalk,
      profile: mockProfile
    });

    expect(mockGetPresentationBySlugExecute).toHaveBeenCalledWith(mockSlug, mockSponsorSlug);
    expect(mockGetProfileExecute).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT);
    expect(mockGetPresentationBySlugExecute).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT);
  });
});