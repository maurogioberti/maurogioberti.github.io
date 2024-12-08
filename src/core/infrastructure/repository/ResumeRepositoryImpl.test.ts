import { Recommendation } from '@/core/domain/model/Recommendation';
import { Timeline } from '@/core/domain/model/Timeline';
import { ResumeService } from '@/core/domain/services/ResumeService';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { ResumeRepositoryImpl } from './ResumeRepositoryImpl';

describe("ResumeRepositoryImpl", () => {
  let resumeService: ResumeService;
  let resumeRepository: ResumeRepositoryImpl;

  const RECOMMENDATIONS_COUNT = 5;
  const TIMELINE_COUNT = 5;

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
    logoUrl: faker.image.url(),
    consultingCompany: faker.helpers.arrayElement([faker.company.name(), null]),
    consultingCompanyLogoUrl: faker.helpers.arrayElement([faker.image.url(), null]),
    consultingCompanyUrl: faker.helpers.arrayElement([faker.internet.url(), null]),
    companyUrl: faker.helpers.arrayElement([faker.internet.url(), null]),
    description: faker.lorem.paragraph(),
    tags: faker.helpers.uniqueArray(() => faker.lorem.word(), 5),
  }));

  beforeEach(() => {
    resumeService = {
      fetchRecommendations: jest.fn(),
      fetchTimeline: jest.fn(),
    } as unknown as ResumeService;
    resumeRepository = new ResumeRepositoryImpl(resumeService);
  });

  test("getRecommendations should return mapped recommendations", async () => {
    const recommendations = mockRecommendations.map(
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
    );
    (resumeService.fetchRecommendations as jest.MockedFunction<typeof resumeService.fetchRecommendations>).mockResolvedValue(recommendations);

    const result = await resumeRepository.getRecommendations();

    const expectedRecommendations = mockRecommendations.map(
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
    );

    expect(result).toHaveLength(RECOMMENDATIONS_COUNT);
    expect(result).toEqual(expectedRecommendations);
    expect(resumeService.fetchRecommendations).toHaveBeenCalledTimes(1);
  });

  test("getTimeline should return mapped timeline", async () => {
    (resumeService.fetchTimeline as jest.MockedFunction<typeof resumeService.fetchTimeline>).mockResolvedValue(mockTimeline);

    const result = await resumeRepository.getTimeline();

    const expectedTimeline = mockTimeline.map(
      (tl) =>
        new Timeline(
          tl.year,
          tl.title,
          tl.company,
          tl.companyLogoUrl,
          tl.consultingCompany,
          tl.consultingCompanyLogoUrl,
          tl.consultingCompanyUrl,
          tl.companyUrl,
          tl.description,
          tl.tags
        )
    );

    expect(result).toHaveLength(TIMELINE_COUNT);
    expect(result).toEqual(expectedTimeline);
    expect(resumeService.fetchTimeline).toHaveBeenCalledTimes(1);
  });
});