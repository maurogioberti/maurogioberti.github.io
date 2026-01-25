import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { linktreeViewModel } from './linktreeViewModel';

const LINKTREE_PAGE = "linktree";

describe("linktreeViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(container, "resolve");
  });

  test("should return HTML content with profile data", async () => {
    const mockProfileData = {
      githubUrl: faker.internet.url(),
      youtubeUrl: faker.internet.url(),
      twitterUrl: faker.internet.url(),
      instagramUrl: faker.internet.url(),
      tiktokUrl: faker.internet.url(),
      linkedinUrl: faker.internet.url(),
      websiteUrl: faker.internet.url(),
    };

    const mockHtmlContent = `<html><body><a href="${mockProfileData.githubUrl}">GitHub</a></body></html>`;

    const mockGetProfileExecute = jest
      .fn<() => Promise<typeof mockProfileData>>()
      .mockResolvedValue(mockProfileData);

    const mockGetStandaloneSiteExecute = jest
      .fn<() => Promise<string>>()
      .mockResolvedValue(mockHtmlContent);

    const mockGetProfileUseCase = { execute: mockGetProfileExecute };
    const mockGetStandaloneSiteUseCase = { execute: mockGetStandaloneSiteExecute };

    (container.resolve as jest.Mock)
      .mockImplementationOnce(() => mockGetStandaloneSiteUseCase)
      .mockImplementationOnce(() => mockGetProfileUseCase);

    const result = await linktreeViewModel();

    expect(container.resolve).toHaveBeenCalledWith('GetStandaloneSiteUseCase');
    expect(container.resolve).toHaveBeenCalledWith('GetProfileUseCase');

    expect(mockGetProfileExecute).toHaveBeenCalled();
    expect(mockGetStandaloneSiteExecute).toHaveBeenCalledWith(LINKTREE_PAGE, {
      GITHUB_URL: mockProfileData.githubUrl,
      YOUTUBE_URL: mockProfileData.youtubeUrl,
      TWITTER_URL: mockProfileData.twitterUrl,
      INSTAGRAM_URL: mockProfileData.instagramUrl,
      TIKTOK_URL: mockProfileData.tiktokUrl,
      LINKEDIN_URL: mockProfileData.linkedinUrl,
      WEBSITE_URL: mockProfileData.websiteUrl,
    });

    expect(result.htmlContent).toBe(mockHtmlContent);
  });

  test("should handle errors from GetProfileUseCase", async () => {
    const errorMessage = faker.lorem.sentence();
    const mockError = new Error(errorMessage);

    const mockGetProfileExecute = jest
      .fn<() => Promise<never>>()
      .mockRejectedValue(mockError);

    const mockGetProfileUseCase = { execute: mockGetProfileExecute };
    const mockGetStandaloneSiteUseCase = { execute: jest.fn() };

    (container.resolve as jest.Mock)
      .mockImplementationOnce(() => mockGetStandaloneSiteUseCase)
      .mockImplementationOnce(() => mockGetProfileUseCase);

    await expect(linktreeViewModel()).rejects.toThrow(errorMessage);

    expect(container.resolve).toHaveBeenCalledWith('GetStandaloneSiteUseCase');
    expect(container.resolve).toHaveBeenCalledWith('GetProfileUseCase');
    expect(mockGetProfileExecute).toHaveBeenCalled();
  });

  test("should handle errors from GetStandaloneSiteUseCase", async () => {
    const mockProfileData = {
      githubUrl: faker.internet.url(),
      youtubeUrl: faker.internet.url(),
      twitterUrl: faker.internet.url(),
      instagramUrl: faker.internet.url(),
      tiktokUrl: faker.internet.url(),
      linkedinUrl: faker.internet.url(),
      websiteUrl: faker.internet.url(),
    };

    const errorMessage = faker.lorem.sentence();
    const mockError = new Error(errorMessage);

    const mockGetProfileExecute = jest
      .fn<() => Promise<typeof mockProfileData>>()
      .mockResolvedValue(mockProfileData);

    const mockGetStandaloneSiteExecute = jest
      .fn<() => Promise<never>>()
      .mockRejectedValue(mockError);

    const mockGetProfileUseCase = { execute: mockGetProfileExecute };
    const mockGetStandaloneSiteUseCase = { execute: mockGetStandaloneSiteExecute };

    (container.resolve as jest.Mock)
      .mockImplementationOnce(() => mockGetStandaloneSiteUseCase)
      .mockImplementationOnce(() => mockGetProfileUseCase);

    await expect(linktreeViewModel()).rejects.toThrow(errorMessage);

    expect(container.resolve).toHaveBeenCalledWith('GetStandaloneSiteUseCase');
    expect(container.resolve).toHaveBeenCalledWith('GetProfileUseCase');

    expect(mockGetProfileExecute).toHaveBeenCalled();
    expect(mockGetStandaloneSiteExecute).toHaveBeenCalledWith(LINKTREE_PAGE, {
      GITHUB_URL: mockProfileData.githubUrl,
      YOUTUBE_URL: mockProfileData.youtubeUrl,
      TWITTER_URL: mockProfileData.twitterUrl,
      INSTAGRAM_URL: mockProfileData.instagramUrl,
      TIKTOK_URL: mockProfileData.tiktokUrl,
      LINKEDIN_URL: mockProfileData.linkedinUrl,
      WEBSITE_URL: mockProfileData.websiteUrl,
    });
  });
});