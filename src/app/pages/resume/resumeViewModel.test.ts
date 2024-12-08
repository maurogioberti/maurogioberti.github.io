import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { resumeViewModel } from './resumeViewModel';

describe("resumeViewModel", () => {
  const mockRecommendations = Array.from({ length: 5 }, () => ({
    id: faker.number.int(),
    text: faker.lorem.sentence(),
  }));

  const mockTimeline = Array.from({ length: 5 }, () => ({
    id: faker.number.int(),
    event: faker.lorem.sentence(),
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(container, "resolve");
  });

  test("should return recommendations and timeline", async () => {
    const mockGetRecommendationsExecute = jest.fn<() => Promise<typeof mockRecommendations>>().mockResolvedValue(mockRecommendations);
    const mockGetTimelineExecute = jest.fn<() => Promise<typeof mockTimeline>>().mockResolvedValue(mockTimeline);

    const mockGetRecommendationsUseCase = { execute: mockGetRecommendationsExecute };
    const mockGetTimelineUseCase = { execute: mockGetTimelineExecute };

    (container.resolve as jest.Mock).mockImplementationOnce(() => mockGetRecommendationsUseCase).mockImplementationOnce(() => mockGetTimelineUseCase);

    const result = await resumeViewModel();

    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_RECOMMENDATIONS);
    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_TIMELINE);
    expect(mockGetRecommendationsExecute).toHaveBeenCalled();
    expect(mockGetTimelineExecute).toHaveBeenCalled();

    expect(result).toEqual({
      recommendations: mockRecommendations,
      timeline: mockTimeline,
    });
  });

  test("should handle errors from GetTimelineUseCase", async () => {
    const errorMessage = "Error fetching timeline";
    const mockError = new Error(errorMessage);

    const mockGetRecommendationsExecute = jest.fn<() => Promise<typeof mockRecommendations>>().mockResolvedValue(mockRecommendations);
    const mockGetTimelineExecute = jest.fn<() => Promise<never>>().mockRejectedValue(mockError);

    const mockGetRecommendationsUseCase = { execute: mockGetRecommendationsExecute };
    const mockGetTimelineUseCase = { execute: mockGetTimelineExecute };

    (container.resolve as jest.Mock).mockImplementationOnce(() => mockGetRecommendationsUseCase).mockImplementationOnce(() => mockGetTimelineUseCase);

    await expect(resumeViewModel()).rejects.toThrow(errorMessage);

    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_RECOMMENDATIONS);
    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_TIMELINE);
    expect(mockGetRecommendationsExecute).toHaveBeenCalled();
    expect(mockGetTimelineExecute).toHaveBeenCalled();
  });
});
