import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { PRESENTATION_TYPE } from '@/core/domain/model/Presentation';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { talktreeParamsViewModel } from './talktreeParamsViewModel';

describe("talktreeParamsViewModel", () => {
  const EXPECTED_CALL_COUNT = 1;
  const NUMBER_OF_MOCKS = 5;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(container, "resolve");
  });

  test("should return a list of presentation slugs and sponsorSlugs", async () => {
    const mockPresentations = Array.from({ length: NUMBER_OF_MOCKS }, () => ({
      id: faker.string.uuid(),
      title: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      sponsor: faker.company.name(),
      sponsorSlug: faker.helpers.slugify(faker.company.name().toLowerCase()),
      type: PRESENTATION_TYPE.WEBINAR,
      description: faker.lorem.paragraph(),
      place: faker.location.city(),
      language: faker.location.country(),
      date: faker.date.future(),
      imageUrl: faker.image.url(),
      tags: [faker.lorem.word()],
    }));
    
    const mockGetAllPresentationsUseCaseExecute = jest
      .fn<() => Promise<typeof mockPresentations>>()
      .mockResolvedValue(mockPresentations);

    const mockGetAllPresentationsUseCase = { execute: mockGetAllPresentationsUseCaseExecute };

    (container.resolve as jest.Mock).mockImplementationOnce(() => mockGetAllPresentationsUseCase);

    const result = await talktreeParamsViewModel();

    expect(result).toStrictEqual(mockPresentations.map(presentation => ({ 
      slug: presentation.slug,
      sponsorSlug: presentation.sponsorSlug 
    })));
    expect(mockGetAllPresentationsUseCase.execute).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT);
  });
});