import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { Presentation, PRESENTATION_TYPE } from '../domain/model/Presentation';
import { PresentationRepository } from '../domain/repository/PresentationRepository';
import { GetAllPresentationsUseCase } from './get-all-presentations-use-case';

describe("GetAllPresentationsUseCase", () => {
  let useCase: GetAllPresentationsUseCase;
  let mockRepository: jest.Mocked<PresentationRepository>;
  
  const EXPECTED_ZERO_LENGTH = 0;

  beforeEach(() => {
    mockRepository = {
      getAllPresentations: jest.fn<() => Promise<Presentation[]>>(),
      getPresentationBySlug: jest.fn<() => Promise<Presentation>>()
    };

    useCase = new GetAllPresentationsUseCase(mockRepository);
  });

  test("should get all presentations from repository", async () => {
    const mockPresentations = [
      new Presentation(
        faker.string.uuid(),
        faker.lorem.sentence(),
        faker.lorem.slug(),
        faker.company.name(),
        faker.lorem.slug(),
        PRESENTATION_TYPE.WEBINAR,
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
        [faker.lorem.word(), faker.lorem.word()]
      ),
      new Presentation(
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
        [faker.lorem.word(), faker.lorem.word()]
      )
    ];
    
    mockRepository.getAllPresentations = jest.fn<() => Promise<typeof mockPresentations>>().mockResolvedValue(mockPresentations);

    const result = await useCase.execute();

    expect(mockRepository.getAllPresentations).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockPresentations);
    expect(result.length).toBe(mockPresentations.length);
  });

  test("should return empty array when no presentations exist", async () => {
    const emptyPresentations: Presentation[] = [];
    mockRepository.getAllPresentations = jest.fn<() => Promise<Presentation[]>>().mockResolvedValue(emptyPresentations);

    const result = await useCase.execute();

    expect(mockRepository.getAllPresentations).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);

    expect(result.length).toBe(EXPECTED_ZERO_LENGTH);
  });

  test("should propagate error from repository", async () => {
    const errorMessage = faker.lorem.sentence();
    const mockError = new Error(errorMessage);
    mockRepository.getAllPresentations = jest.fn<() => Promise<never>>().mockRejectedValue(mockError);

    await expect(useCase.execute()).rejects.toThrow(errorMessage);
    expect(mockRepository.getAllPresentations).toHaveBeenCalledTimes(1);
  });
});