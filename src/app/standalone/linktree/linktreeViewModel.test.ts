jest.mock("@/core/crosscutting/injection/DependencyInjectionContainer", () => ({
  container: {
    useResolve: jest.fn(),
  },
}));

import { linktreeViewModel } from "./linktreeViewModel";
import { GetProfileUseCase } from "@/core/application/get-profile-content-usecase";
import { GetStandaloneSiteUseCase } from "@/core/application/get-standalone-site-use-case";
import { container } from "@/core/crosscutting/injection/DependencyInjectionContainer";
import { faker } from "@faker-js/faker";
import { describe, test, expect, jest } from "@jest/globals";

const LINKTREE_PAGE = "linktree";

describe("linktreeViewModel", () => {
  test("should return HTML content with profile data", async () => {
    const mockProfileData = {
      socials: {
        github: faker.internet.url(),
        youtube: faker.internet.url(),
        twitter: faker.internet.url(),
        instagram: faker.internet.url(),
        linkedin: faker.internet.url(),
        website: faker.internet.url(),
      },
    };

    const mockHtmlContent = `<html><body><a href="${mockProfileData.socials.github}">GitHub</a></body></html>`

    const mockGetProfileExecute = jest
      .fn<() => Promise<typeof mockProfileData>>()
      .mockResolvedValue(mockProfileData);
    const mockGetStandaloneSiteExecute = jest
      .fn<() => Promise<string>>()
      .mockResolvedValue(mockHtmlContent);

    const mockGetProfileUseCase = { execute: mockGetProfileExecute };
    const mockGetStandaloneSiteUseCase = { execute: mockGetStandaloneSiteExecute };

    (container.useResolve as jest.Mock)
      .mockImplementationOnce(() => mockGetStandaloneSiteUseCase)
      .mockImplementationOnce(() => mockGetProfileUseCase);

    const result = await linktreeViewModel();

    expect(container.useResolve).toHaveBeenCalledWith(GetStandaloneSiteUseCase);
    expect(container.useResolve).toHaveBeenCalledWith(GetProfileUseCase);

    expect(mockGetProfileExecute).toHaveBeenCalled();
    expect(mockGetStandaloneSiteExecute).toHaveBeenCalledWith(LINKTREE_PAGE, {
      GITHUB_URL: mockProfileData.socials.github,
      YOUTUBE_URL: mockProfileData.socials.youtube,
      TWITTER_URL: mockProfileData.socials.twitter,
      INSTAGRAM_URL: mockProfileData.socials.instagram,
      LINKEDIN_URL: mockProfileData.socials.linkedin,
      WEBSITE_URL: mockProfileData.socials.website,
    });

    expect(result.htmlContent).toBe(mockHtmlContent);
  });

  test("should handle errors from getProfileUseCase", async () => {
    const errorMessage = faker.lorem.sentence();
    const mockError = new Error(errorMessage);

    const mockGetProfileExecute = jest
      .fn<() => Promise<never>>()
      .mockRejectedValue(mockError);
    const mockGetProfileUseCase = { execute: mockGetProfileExecute };
    const mockGetStandaloneSiteUseCase = { execute: jest.fn() };

    (container.useResolve as jest.Mock)
      .mockImplementationOnce(() => mockGetStandaloneSiteUseCase)
      .mockImplementationOnce(() => mockGetProfileUseCase);

    await expect(linktreeViewModel()).rejects.toThrow(errorMessage);

    expect(container.useResolve).toHaveBeenCalledWith(GetStandaloneSiteUseCase);
    expect(container.useResolve).toHaveBeenCalledWith(GetProfileUseCase);
    expect(mockGetProfileExecute).toHaveBeenCalled();
  });
});