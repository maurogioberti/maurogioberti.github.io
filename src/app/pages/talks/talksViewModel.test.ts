import { Presentation, PRESENTATION_TYPE } from '@/core/domain/model/Presentation';
import { PresentationRepository } from '@/core/domain/repository/PresentationRepository';
import { PresentationService } from '@/core/domain/services/PresentationService';
import { PresentationRepositoryImpl } from '@/core/infrastructure/repository/PresentationRepositoryImpl';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe("PresentationRepositoryImpl", () => {
  const MIN_PRESENTATIONS = 3;
  const MAX_PRESENTATIONS = 10;

  let presentationService: PresentationService;
  let presentationRepository: PresentationRepository;
  
  const MOCK_SLUG = "mock-presentation-slug";
  const MOCK_SPONSOR_SLUG = "mock-sponsor-slug";
  const PRESENTATION_NOT_FOUND_ERROR = `Presentation with slug '${MOCK_SLUG}' and sponsor '${MOCK_SPONSOR_SLUG}' not found`;

  beforeEach(() => {
    presentationService = {
      fetchPresentations: jest.fn(),
    } as unknown as PresentationService;
    presentationRepository = new PresentationRepositoryImpl(presentationService);
  });

  test("getAllPresentations should return all presentations from the service", async () => {
    const presentationsCount = faker.number.int({ min: MIN_PRESENTATIONS, max: MAX_PRESENTATIONS });
    const mockPresentations = Array.from({ length: presentationsCount }, () => 
      new Presentation(
        faker.string.uuid(),
        faker.lorem.sentence(),
        faker.lorem.slug(),
        faker.company.name(),
        faker.lorem.slug(),
        PRESENTATION_TYPE.ONLINE,
        faker.lorem.paragraph(),
        faker.location.city(),
        faker.location.country(),
        faker.date.recent(),
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
        [faker.lorem.word(), faker.lorem.word()]
      )
    );

    (presentationService.fetchPresentations as jest.MockedFunction<typeof presentationService.fetchPresentations>)
      .mockResolvedValue(mockPresentations);
    const result = await presentationRepository.getAllPresentations();

    expect(presentationService.fetchPresentations).toHaveBeenCalled();
    expect(result).toHaveLength(presentationsCount);
    expect(result.every((p: unknown) => p instanceof Presentation)).toBe(true);
  });

  test("getPresentationBySlug should return the presentation with matching slug and sponsorSlug", async () => {
    const matchingPresentation = new Presentation(
      faker.string.uuid(),
      faker.lorem.sentence(),
      MOCK_SLUG,
      faker.company.name(),
      MOCK_SPONSOR_SLUG,
      PRESENTATION_TYPE.ONLINE,
      faker.lorem.paragraph(),
      faker.location.city(),
      faker.location.country(),
      faker.date.recent(),
      faker.image.url(),
      undefined,
      undefined,
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      [faker.lorem.word(), faker.lorem.word()]
    );

    const otherPresentations = Array.from({ length: faker.number.int({ min: MIN_PRESENTATIONS, max: MAX_PRESENTATIONS }) }, () => 
      new Presentation(
        faker.string.uuid(),
        faker.lorem.sentence(),
        faker.lorem.slug(),
        faker.company.name(),
        faker.lorem.slug(),
        PRESENTATION_TYPE.ONLINE,
        faker.lorem.paragraph(),
        faker.location.city(),
        faker.location.country(),
        faker.date.recent(),
        faker.image.url(),
        undefined,
        undefined,
        faker.internet.url(),
        faker.internet.url(),
        faker.internet.url(),
        faker.internet.url(),
        faker.internet.url(),
        faker.internet.url(),
        faker.internet.url(),
        faker.internet.url(),
        [faker.lorem.word(), faker.lorem.word()]
      )
    );

    const mockPresentations = [matchingPresentation, ...otherPresentations];

    (presentationService.fetchPresentations as jest.MockedFunction<typeof presentationService.fetchPresentations>)
      .mockResolvedValue(mockPresentations);

    const result = await presentationRepository.getPresentationBySlug(MOCK_SLUG, MOCK_SPONSOR_SLUG);

    expect(presentationService.fetchPresentations).toHaveBeenCalled();
    expect(result).toStrictEqual(matchingPresentation);
  });

  test("getPresentationBySlug should throw error when presentation is not found", async () => {
    const mockPresentations = Array.from({ length: faker.number.int({ min: MIN_PRESENTATIONS, max: MAX_PRESENTATIONS }) }, () => 
      new Presentation(
        faker.string.uuid(),
        faker.lorem.sentence(),
        faker.lorem.slug(),
        faker.company.name(),
        faker.lorem.slug(),
        PRESENTATION_TYPE.ONLINE,
        faker.lorem.paragraph(),
        faker.location.city(),
        faker.location.country(),
        faker.date.recent(),
        faker.image.url(),
        undefined,
        undefined,
        faker.internet.url(),
        faker.internet.url(),
        faker.internet.url(),
        faker.internet.url(),
        faker.internet.url(),
        faker.internet.url(),
        faker.internet.url(),
        faker.internet.url(),
        [faker.lorem.word(), faker.lorem.word()]
      )
    );

    (presentationService.fetchPresentations as jest.MockedFunction<typeof presentationService.fetchPresentations>)
      .mockResolvedValue(mockPresentations);

    await expect(presentationRepository.getPresentationBySlug(MOCK_SLUG, MOCK_SPONSOR_SLUG))
      .rejects.toThrow(PRESENTATION_NOT_FOUND_ERROR);

    expect(presentationService.fetchPresentations).toHaveBeenCalled();
  });

  test("getPresentationBySlug should find presentation with matching slug and sponsorSlug only", async () => {
    const presentationWithMatchingSlugOnly = new Presentation(
      faker.string.uuid(),
      faker.lorem.sentence(),
      MOCK_SLUG,
      faker.company.name(),
      faker.lorem.slug(),
      PRESENTATION_TYPE.ONLINE,
      faker.lorem.paragraph(),
      faker.location.city(),
      faker.location.country(),
      faker.date.recent(),
      faker.image.url(),
      undefined,
      undefined,
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      [faker.lorem.word(), faker.lorem.word()]
    );

    const presentationWithMatchingSponsorOnly = new Presentation(
      faker.string.uuid(),
      faker.lorem.sentence(),
      faker.lorem.slug(),
      faker.company.name(),
      MOCK_SPONSOR_SLUG,
      PRESENTATION_TYPE.ONLINE,
      faker.lorem.paragraph(),
      faker.location.city(),
      faker.location.country(),
      faker.date.recent(),
      faker.image.url(),
      undefined,
      undefined,
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      faker.internet.url(),
      [faker.lorem.word(), faker.lorem.word()]
    );

    const mockPresentations = [
      presentationWithMatchingSlugOnly,
      presentationWithMatchingSponsorOnly
    ];

    (presentationService.fetchPresentations as jest.MockedFunction<typeof presentationService.fetchPresentations>)
      .mockResolvedValue(mockPresentations);

    await expect(presentationRepository.getPresentationBySlug(MOCK_SLUG, MOCK_SPONSOR_SLUG))
      .rejects.toThrow(PRESENTATION_NOT_FOUND_ERROR);

    expect(presentationService.fetchPresentations).toHaveBeenCalled();
  });
});