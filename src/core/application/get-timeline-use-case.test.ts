import { ResumeRepository } from '@/core/domain/repository/ResumeRepository';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { Recommendation } from '../domain/model/Recommendation';
import { Timeline } from '../domain/model/Timeline';
import { GetTimelineUseCase } from './get-timeline-use-case';

describe('GetTimelineUseCase', () => {
  let mockRepository: jest.Mocked<ResumeRepository>;
  let useCase: GetTimelineUseCase;
  let mockTimeline: Timeline[];

  const TOTAL_TIMELINE = 5;
  const TOTAL_TAGS = 3;

  beforeEach(() => {
    mockTimeline = Array.from({ length: TOTAL_TIMELINE }, () => ({
      id: faker.number.int(),
      event: faker.lorem.sentence(),
      date: faker.date.past().toISOString(),
      year: faker.date.past().getFullYear().toString(),
      title: faker.lorem.words(),
      company: faker.company.name(),
      logoUrl: faker.image.url(),
      description: faker.lorem.paragraph(),
      location: faker.address.city(),
      type: faker.lorem.word(),
      consultingCompany: faker.company.name(),
      consultingCompanyLogoUrl: faker.image.url(),
      consultingCompanyUrl: faker.internet.url(),
      companyUrl: faker.internet.url(),
      tags: Array.from({ length: TOTAL_TAGS }, () => faker.lorem.word()),
    }));

    mockRepository = {
      getTimeline: jest.fn<() => Promise<typeof mockTimeline>>().mockResolvedValue(mockTimeline),
      getRecommendations: jest.fn<() => Promise<Recommendation[]>>().mockResolvedValue([]),
    };

    useCase = new GetTimelineUseCase(mockRepository);
  });

  test('execute should return timeline', async () => {
    const result = await useCase.execute();

    expect(result).toStrictEqual(mockTimeline);
    expect(mockRepository.getTimeline).toHaveBeenCalledTimes(1);
  });

  test('execute should handle repository errors', async () => {
    const errorMessage = 'Repository error';
    mockRepository.getTimeline.mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.execute()).rejects.toThrow(errorMessage);
    expect(mockRepository.getTimeline).toHaveBeenCalledTimes(1);
  });
});