import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { resumeViewModel } from './resumeViewModel';

describe("resumeViewModel", () => {
  const mockProfile = {
    id: faker.number.int(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    title: faker.person.jobTitle(),
    description: faker.lorem.paragraph(),
    conciseDescription: faker.lorem.sentence(),
    location: faker.location.city(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    website: faker.internet.url(),
    linkedin: faker.internet.url(),
    github: faker.internet.url(),
    imageUrl: faker.image.avatar(),
    resumeUrl: faker.internet.url(),
  };

  const mockRecommendations = Array.from({ length: 5 }, () => ({
    id: faker.number.int(),
    text: faker.lorem.sentence(),
  }));

  const mockTimeline = Array.from({ length: 5 }, () => ({
    year: faker.date.past().getFullYear().toString(),
    title: faker.person.jobTitle(),
    company: faker.company.name(),
    companyUrl: faker.internet.url(),
    companyLogoUrl: faker.image.url(),
    location: faker.location.country(),
    workType: faker.helpers.arrayElement(['Remote', 'Hybrid', 'On-site']),
    consultingCompany: null,
    consultingCompanyUrl: null,
    consultingCompanyLogoUrl: null,
    description: faker.lorem.paragraph(),
    tags: [faker.lorem.word(), faker.lorem.word()],
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(container, "resolve");
  });

  test("should return profile, recommendations and timeline", async () => {
    const mockGetProfileExecute = jest.fn<() => Promise<typeof mockProfile>>().mockResolvedValue(mockProfile);
    const mockGetRecommendationsExecute = jest.fn<() => Promise<typeof mockRecommendations>>().mockResolvedValue(mockRecommendations);
    const mockGetTimelineExecute = jest.fn<() => Promise<typeof mockTimeline>>().mockResolvedValue(mockTimeline);

    const mockGetProfileUseCase = { execute: mockGetProfileExecute };
    const mockGetRecommendationsUseCase = { execute: mockGetRecommendationsExecute };
    const mockGetTimelineUseCase = { execute: mockGetTimelineExecute };

    (container.resolve as jest.Mock)
      .mockImplementationOnce(() => mockGetProfileUseCase)
      .mockImplementationOnce(() => mockGetRecommendationsUseCase)
      .mockImplementationOnce(() => mockGetTimelineUseCase);

    const result = await resumeViewModel();

    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_PROFILE);
    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_RECOMMENDATIONS);
    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_TIMELINE);
    expect(mockGetProfileExecute).toHaveBeenCalled();
    expect(mockGetRecommendationsExecute).toHaveBeenCalled();
    expect(mockGetTimelineExecute).toHaveBeenCalled();

    expect(result).toEqual({
      profile: mockProfile,
      recommendations: mockRecommendations,
      timeline: mockTimeline,
    });
  });

  test("should handle errors from GetTimelineUseCase", async () => {
    const errorMessage = "Error fetching timeline";
    const mockError = new Error(errorMessage);

    const mockGetProfileExecute = jest.fn<() => Promise<typeof mockProfile>>().mockResolvedValue(mockProfile);
    const mockGetRecommendationsExecute = jest.fn<() => Promise<typeof mockRecommendations>>().mockResolvedValue(mockRecommendations);
    const mockGetTimelineExecute = jest.fn<() => Promise<never>>().mockRejectedValue(mockError);

    const mockGetProfileUseCase = { execute: mockGetProfileExecute };
    const mockGetRecommendationsUseCase = { execute: mockGetRecommendationsExecute };
    const mockGetTimelineUseCase = { execute: mockGetTimelineExecute };

    (container.resolve as jest.Mock)
      .mockImplementationOnce(() => mockGetProfileUseCase)
      .mockImplementationOnce(() => mockGetRecommendationsUseCase)
      .mockImplementationOnce(() => mockGetTimelineUseCase);

    await expect(resumeViewModel()).rejects.toThrow(errorMessage);

    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_PROFILE);
    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_RECOMMENDATIONS);
    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_TIMELINE);
    expect(mockGetProfileExecute).toHaveBeenCalled();
    expect(mockGetRecommendationsExecute).toHaveBeenCalled();
    expect(mockGetTimelineExecute).toHaveBeenCalled();
  });
});
