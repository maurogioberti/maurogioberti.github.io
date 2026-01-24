import { Recommendation } from '@/core/domain/model/Recommendation';
import { Timeline } from '@/core/domain/model/Timeline';
import { ResumeService } from '@/core/domain/services/ResumeService';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { ResumeRepositoryImpl } from './ResumeRepositoryImpl';

describe("ResumeRepositoryImpl", () => {
  let resumeService: jest.Mocked<ResumeService>;
  let resumeRepository: ResumeRepositoryImpl;

  const RECOMMENDATIONS_COUNT = 5;
  const TIMELINE_COUNT = 5;
  const MOCK_TAGS_COUNT = 5;
  const ONE_CALL_COUNT = 1;

  const mockRecommendations = Array.from({ length: RECOMMENDATIONS_COUNT }, () => ({
    name: faker.person.fullName(),
    position: faker.person.jobTitle(),
    relation: faker.lorem.sentence(),
    date: faker.date.past(),
    profilePictureUrl: faker.image.avatar(),
    linkedInProfileUrl: faker.internet.url(),
    linkedInRecommendationUrl: faker.internet.url(),
    translation: faker.helpers.arrayElement([faker.lorem.sentence(), null]),
    text: faker.lorem.paragraph(),
  }));

  const mockTimeline = Array.from({ length: TIMELINE_COUNT }, () => ({
    year: faker.date.past().getFullYear().toString(),
    title: faker.person.jobTitle(),
    company: faker.company.name(),
    companyUrl: faker.helpers.arrayElement([faker.internet.url(), null]),
    companyLogoUrl: faker.image.url(),
    location: faker.helpers.arrayElement([faker.location.country(), null]),
    workType: faker.helpers.arrayElement(['Remote', 'Hybrid', 'On-site', null]),
    consultingCompany: faker.helpers.arrayElement([faker.company.name(), null]),
    consultingCompanyUrl: faker.helpers.arrayElement([faker.internet.url(), null]),
    consultingCompanyLogoUrl: faker.helpers.arrayElement([faker.image.url(), null]),
    description: faker.lorem.paragraph(),
    tags: faker.helpers.uniqueArray(() => faker.lorem.word(), MOCK_TAGS_COUNT),
  }));

  beforeEach(() => {
    resumeService = {
      fetchRecommendations: jest.fn(),
      fetchTimeline: jest.fn(),
    } as jest.Mocked<ResumeService>;

    resumeRepository = new ResumeRepositoryImpl(resumeService);
  });

  test("getRecommendations should return mapped recommendations", async () => {
    resumeService.fetchRecommendations.mockResolvedValue(
      mockRecommendations.map(
        (rec) =>
          new Recommendation(
            rec.name,
            rec.position,
            rec.relation,
            rec.date,
            rec.profilePictureUrl,
            rec.linkedInProfileUrl,
            rec.linkedInRecommendationUrl,
            rec.translation,
            rec.text
          )
      )
    );

    const result = await resumeRepository.getRecommendations();

    expect(result).toHaveLength(RECOMMENDATIONS_COUNT);
    result.forEach((rec, index) => {
      expect(rec.name).toBe(mockRecommendations[index].name);
      expect(rec.position).toBe(mockRecommendations[index].position);
    });
    expect(resumeService.fetchRecommendations).toHaveBeenCalledTimes(1);
  });

  test("getTimeline should return mapped timeline", async () => {
    resumeService.fetchTimeline.mockResolvedValue(
      mockTimeline.map(
        (tl) =>
          new Timeline(
            tl.year,
            tl.title,
            tl.company,
            tl.companyUrl,
            tl.companyLogoUrl,
            tl.location,
            tl.workType,
            tl.consultingCompany,
            tl.consultingCompanyUrl,
            tl.consultingCompanyLogoUrl,
            tl.description,
            tl.tags
          )
      )
    );

    const result = await resumeRepository.getTimeline();

    expect(result).toHaveLength(TIMELINE_COUNT);
    result.forEach((tl, index) => {
      expect(tl.year).toBe(mockTimeline[index].year);
      expect(tl.companyLogoUrl).toBe(mockTimeline[index].companyLogoUrl);
    });
    expect(resumeService.fetchTimeline).toHaveBeenCalledTimes(ONE_CALL_COUNT);
  });
});