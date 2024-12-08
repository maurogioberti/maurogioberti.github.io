import { ResumeRepository } from '@/core/domain/repository/ResumeRepository';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { Recommendation } from '../domain/model/Recommendation';
import { Timeline } from '../domain/model/Timeline';
import { GetRecommendationsUseCase } from './get-recommendations-use-case';

describe("GetRecommendationsUseCase", () => {
  let mockRepository: jest.Mocked<ResumeRepository>;
  let useCase: GetRecommendationsUseCase;
  let mockRecommendations: Recommendation[];

  const TOTAL_RECOMMENDATIONS = 2;

  beforeEach(() => {
    mockRecommendations = Array.from({ length: TOTAL_RECOMMENDATIONS }, () => ({
      id: faker.number.int(),
      text: faker.lorem.sentence(),
      name: faker.person.fullName(),
      position: faker.person.jobTitle(),
      relation: faker.lorem.word(),
      date: faker.date.past(),
      company: faker.company.name(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      profilePictureUrl: faker.image.avatar(),
      linkedInProfileUrl: faker.internet.url(),
      linkedInRecommendationUrl: faker.internet.url(),
      translation: faker.lorem.sentence(),
      formattedDate: faker.date.past().toISOString(),
    }));

    mockRepository = {
      getRecommendations: jest.fn<() => Promise<typeof mockRecommendations>>().mockResolvedValue(mockRecommendations),
      getTimeline: jest.fn<() => Promise<Timeline[]>>().mockResolvedValue([]),
    };

    useCase = new GetRecommendationsUseCase(mockRepository);
  });

  test("execute should return recommendations", async () => {
    const result = await useCase.execute();

    expect(result).toStrictEqual(mockRecommendations);
    expect(mockRepository.getRecommendations).toHaveBeenCalledTimes(1);
  });

  test("execute should handle repository errors", async () => {
    const errorMessage = "Repository error";
    mockRepository.getRecommendations.mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.execute()).rejects.toThrow(errorMessage);
    expect(mockRepository.getRecommendations).toHaveBeenCalledTimes(1);
  });
});