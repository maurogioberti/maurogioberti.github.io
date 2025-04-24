import { Presentation, PRESENTATION_TYPE } from '@/core/domain/model/Presentation';
import { PresentationRepository } from '@/core/domain/repository/PresentationRepository';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { GetPresentationBySlugUseCase } from './get-presentation-by-slug-use-case';

describe("GetPresentationBySlugUseCase", () => {
  let mockRepository: jest.Mocked<PresentationRepository>;
  let useCase: GetPresentationBySlugUseCase;
  let expectedPresentation: Presentation;

  const ONE_CALL_EXPECTED = 1;

  beforeEach(() => {
    expectedPresentation = new Presentation(
            faker.string.uuid(),
            faker.lorem.sentence(),
            faker.lorem.slug(),
            faker.company.name(),
            faker.lorem.slug(),
            PRESENTATION_TYPE.ONSITE,
            faker.lorem.paragraph(),
            faker.location.city(),
            faker.location.country(),
            faker.date.past(),
            faker.image.url(),
            faker.company.name(),
            faker.location.streetAddress(),
            faker.internet.url(),
            faker.internet.url(),
            faker.internet.url(),
            faker.internet.url(),
            faker.internet.url(),
            faker.internet.url(),
            faker.internet.url(),
            faker.internet.url(),
            [faker.lorem.word(), faker.lorem.word()]);

    mockRepository = {
      getAllPresentations: jest.fn(),
      getPresentationBySlug: jest.fn()
    };

    useCase = new GetPresentationBySlugUseCase(mockRepository);
  });

  test("should return a presentation when matching slugs are found", async () => {
    const slug = expectedPresentation.slug;
    const sponsorSlug = expectedPresentation.sponsorSlug;
    mockRepository.getPresentationBySlug.mockResolvedValue(expectedPresentation);
    
    const result = await useCase.execute(slug, sponsorSlug);

    expect(result).toBeDefined();
    expect(result).toStrictEqual(expectedPresentation);
    expect(mockRepository.getPresentationBySlug).toHaveBeenCalledWith(slug, sponsorSlug);
    expect(mockRepository.getPresentationBySlug).toHaveBeenCalledTimes(ONE_CALL_EXPECTED);
  });

  test("should propagate error from repository", async () => {
    const slug = faker.lorem.slug();
    const sponsorSlug = faker.lorem.slug();
    const errorMessage = faker.lorem.sentence();
    const mockError = new Error(errorMessage);
    mockRepository.getPresentationBySlug.mockRejectedValueOnce(mockError);

    await expect(useCase.execute(slug, sponsorSlug)).rejects.toThrow(errorMessage);
    expect(mockRepository.getPresentationBySlug).toHaveBeenCalledWith(slug, sponsorSlug);
    expect(mockRepository.getPresentationBySlug).toHaveBeenCalledTimes(ONE_CALL_EXPECTED);
  });
});