import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { talktreeViewModel } from './talktreeViewModel';

const TALKTREE_PAGE = "talktree/[slug]/[sponsorSlug]";
const EMPTY_STRING = "";

describe("talktreeViewModel", () => {
  const mockSlug = faker.lorem.slug();
  const mockSponsorSlug = faker.lorem.slug();
  
  const mockProfileData = {
    githubUrl: faker.internet.url(),
    youtubeUrl: faker.internet.url(),
    twitterUrl: faker.internet.url(),
    instagramUrl: faker.internet.url(),
    linkedinUrl: faker.internet.url(),
    websiteUrl: faker.internet.url(),
  };

  const mockPresentationData = {
    title: faker.lorem.sentence(),
    slug: mockSlug,
    sponsorSlug: mockSponsorSlug,
    postUrl: faker.internet.url(),
    slidesUrl: faker.internet.url(),
    demoVideoUrl: faker.internet.url(),
    repositoryUrl: faker.internet.url(),
    resourcesUrl: faker.internet.url(),
    feedbackUrl: faker.internet.url(),
  };
  
  function _setupContainerMocks(mocks: {
    profileUseCase?: { execute: jest.Mock };
    presentationContentUseCase?: { execute: jest.Mock };
    standaloneSiteUseCase?: { execute: jest.Mock };
  }): void {
    const mockResolve = (identifier: unknown) => {
      if (identifier === DependencyIdentifiers.USE_CASES.GET_STANDALONE_SITE) {
        return mocks.standaloneSiteUseCase;
      } else if (identifier === DependencyIdentifiers.USE_CASES.GET_PROFILE) {
        return mocks.profileUseCase;
      } else if (identifier === DependencyIdentifiers.USE_CASES.GET_PRESENTATION_CONTENT) {
        return mocks.presentationContentUseCase;
      }
      return undefined;
    };
  
    (container.resolve as jest.Mock).mockImplementation(mockResolve);
  }

  const mockHtmlContent = `<html><body><a href="${mockProfileData.githubUrl}">GitHub</a></body></html>`;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(container, "resolve");
  });

  test("should return HTML content with profile and presentation data", async () => {
    const mockGetProfileExecute = jest
      .fn<() => Promise<typeof mockProfileData>>()
      .mockResolvedValue(mockProfileData);

    const mockGetPresentationContentExecute = jest
      .fn<() => Promise<typeof mockPresentationData>>()
      .mockResolvedValue(mockPresentationData);

    const mockGetStandaloneSiteExecute = jest
      .fn<() => Promise<string>>()
      .mockResolvedValue(mockHtmlContent);
      
    _setupContainerMocks({
      profileUseCase: { execute: mockGetProfileExecute },
      presentationContentUseCase: { execute: mockGetPresentationContentExecute },
      standaloneSiteUseCase: { execute: mockGetStandaloneSiteExecute }
    });

    const result = await talktreeViewModel(mockSlug, mockSponsorSlug);

    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_STANDALONE_SITE);
    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_PROFILE);
    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_PRESENTATION_CONTENT);

    expect(mockGetProfileExecute).toHaveBeenCalled();
    expect(mockGetPresentationContentExecute).toHaveBeenCalledWith(mockSlug, mockSponsorSlug);
    
    expect(mockGetStandaloneSiteExecute).toHaveBeenCalledWith(
      TALKTREE_PAGE, 
      {
        GITHUB_URL: mockProfileData.githubUrl,
        YOUTUBE_URL: mockProfileData.youtubeUrl,
        TWITTER_URL: mockProfileData.twitterUrl,
        INSTAGRAM_URL: mockProfileData.instagramUrl,
        LINKEDIN_URL: mockProfileData.linkedinUrl,
        WEBSITE_URL: mockProfileData.websiteUrl,
        POST_URL: mockPresentationData.postUrl,
        SLIDES_URL: mockPresentationData.slidesUrl,
        VIDEO_URL: mockPresentationData.demoVideoUrl,
        REPOSITORY_URL: mockPresentationData.repositoryUrl,
        RESOURCES_URL: mockPresentationData.resourcesUrl,
        FEEDBACK_URL: mockPresentationData.feedbackUrl,
      }
    );
    
    expect(result.htmlContent).toBe(mockHtmlContent);
  });

  test("should handle missing URLs in presentation data", async () => {
    const presentationWithMissingUrls = {
      ...mockPresentationData,
      postUrl: undefined,
      slidesUrl: null,
      demoVideoUrl: undefined,
    };

    const mockGetProfileExecute = jest.fn<() => Promise<typeof mockProfileData>>().mockResolvedValue(mockProfileData);
    const mockGetPresentationContentExecute = jest.fn<() => Promise<typeof presentationWithMissingUrls>>().mockResolvedValue(presentationWithMissingUrls);
    const mockGetStandaloneSiteExecute = jest.fn<() => Promise<typeof mockHtmlContent>>().mockResolvedValue(mockHtmlContent);

    _setupContainerMocks({
      profileUseCase: { execute: mockGetProfileExecute },
      presentationContentUseCase: { execute: mockGetPresentationContentExecute },
      standaloneSiteUseCase: { execute: mockGetStandaloneSiteExecute }
    });

    const result = await talktreeViewModel(mockSlug, mockSponsorSlug);

    expect(mockGetStandaloneSiteExecute).toHaveBeenCalledWith(
        TALKTREE_PAGE, 
        expect.objectContaining({
          GITHUB_URL: mockProfileData.githubUrl,
          YOUTUBE_URL: mockProfileData.youtubeUrl,
          TWITTER_URL: mockProfileData.twitterUrl,
          INSTAGRAM_URL: mockProfileData.instagramUrl,
          LINKEDIN_URL: mockProfileData.linkedinUrl,
          WEBSITE_URL: mockProfileData.websiteUrl,
          POST_URL: EMPTY_STRING,
          SLIDES_URL: EMPTY_STRING,
          VIDEO_URL: EMPTY_STRING,
        })
      );

    expect(result.htmlContent).toBe(mockHtmlContent);
  });

  test("should handle errors from GetProfileUseCase", async () => {
    const errorMessage = faker.lorem.sentence();
    const mockError = new Error(errorMessage);

    const mockGetProfileExecute = jest
        .fn<() => Promise<never>>()
        .mockRejectedValue(mockError);

    const mockGetPresentationContentExecute = jest.fn();
    const mockGetStandaloneSiteExecute = jest.fn();

    const mockGetProfileUseCase = { execute: mockGetProfileExecute };
    const mockGetPresentationContentUseCase = { execute: mockGetPresentationContentExecute };
    const mockGetStandaloneSiteUseCase = { execute: mockGetStandaloneSiteExecute };

    (container.resolve as jest.Mock)
      .mockImplementation((identifier) => {
        if (identifier === DependencyIdentifiers.USE_CASES.GET_STANDALONE_SITE) {
          return mockGetStandaloneSiteUseCase;
        } else if (identifier === DependencyIdentifiers.USE_CASES.GET_PROFILE) {
          return mockGetProfileUseCase;
        } else if (identifier === DependencyIdentifiers.USE_CASES.GET_PRESENTATION_CONTENT) {
          return mockGetPresentationContentUseCase;
        }
      });

    await expect(talktreeViewModel(mockSlug, mockSponsorSlug)).rejects.toThrow(errorMessage);

    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_STANDALONE_SITE);
    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_PROFILE);
    expect(mockGetProfileExecute).toHaveBeenCalled();
    expect(mockGetPresentationContentExecute).not.toHaveBeenCalled();
    expect(mockGetStandaloneSiteExecute).not.toHaveBeenCalled();
  });

  test("should handle errors from GetPresentationContentUseCase", async () => {
    const errorMessage = faker.lorem.sentence();
    const mockError = new Error(errorMessage);

    const mockGetProfileExecute = jest.fn<() => Promise<typeof mockProfileData>>().mockResolvedValue(mockProfileData);
    const mockGetPresentationContentExecute = jest.fn<() => Promise<never>>().mockRejectedValue(mockError);
    const mockGetStandaloneSiteExecute = jest.fn();

    _setupContainerMocks({
      profileUseCase: { execute: mockGetProfileExecute },
      presentationContentUseCase: { execute: mockGetPresentationContentExecute },
      standaloneSiteUseCase: { execute: mockGetStandaloneSiteExecute }
    });

    await expect(talktreeViewModel(mockSlug, mockSponsorSlug)).rejects.toThrow(errorMessage);

    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_STANDALONE_SITE);
    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_PROFILE);
    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_PRESENTATION_CONTENT);
    
    expect(mockGetProfileExecute).toHaveBeenCalled();
    expect(mockGetPresentationContentExecute).toHaveBeenCalledWith(mockSlug, mockSponsorSlug);
    expect(mockGetStandaloneSiteExecute).not.toHaveBeenCalled();
  });

  test("should handle errors from GetStandaloneSiteUseCase", async () => {
    const errorMessage = faker.lorem.sentence();
    const mockError = new Error(errorMessage);

    const mockGetProfileExecute = jest.fn<() => Promise<typeof mockProfileData>>().mockResolvedValue(mockProfileData);
    const mockGetPresentationContentExecute = jest.fn<() => Promise<typeof mockPresentationData>>().mockResolvedValue(mockPresentationData);
    const mockGetStandaloneSiteExecute = jest.fn<() => Promise<never>>().mockRejectedValue(mockError);

    _setupContainerMocks({
      profileUseCase: { execute: mockGetProfileExecute },
      presentationContentUseCase: { execute: mockGetPresentationContentExecute },
      standaloneSiteUseCase: { execute: mockGetStandaloneSiteExecute }
    });

    await expect(talktreeViewModel(mockSlug, mockSponsorSlug)).rejects.toThrow(errorMessage);

    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_STANDALONE_SITE);
    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_PROFILE);
    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_PRESENTATION_CONTENT);
    
    expect(mockGetProfileExecute).toHaveBeenCalled();
    expect(mockGetPresentationContentExecute).toHaveBeenCalledWith(mockSlug, mockSponsorSlug);
    expect(mockGetStandaloneSiteExecute).toHaveBeenCalled();
  });
  
  test("should handle undefined repository URL", async () => {
    const presentationWithoutRepository = {
      ...mockPresentationData,
      feedbackUrl: faker.internet.url(),
      repositoryUrl: undefined
    };

    const mockGetProfileExecute = jest.fn<() => Promise<typeof mockProfileData>>().mockResolvedValue(mockProfileData);
    const mockGetPresentationContentExecute = jest.fn<() => Promise<typeof presentationWithoutRepository>>().mockResolvedValue(presentationWithoutRepository);
    const mockGetStandaloneSiteExecute = jest.fn<() => Promise<typeof mockHtmlContent>>().mockResolvedValue(mockHtmlContent);

    const mockGetProfileUseCase = { execute: mockGetProfileExecute };
    const mockGetPresentationContentUseCase = { execute: mockGetPresentationContentExecute };
    const mockGetStandaloneSiteUseCase = { execute: mockGetStandaloneSiteExecute };

    (container.resolve as jest.Mock)
      .mockImplementation((identifier) => {
        if (identifier === DependencyIdentifiers.USE_CASES.GET_STANDALONE_SITE) {
          return mockGetStandaloneSiteUseCase;
        } else if (identifier === DependencyIdentifiers.USE_CASES.GET_PROFILE) {
          return mockGetProfileUseCase;
        } else if (identifier === DependencyIdentifiers.USE_CASES.GET_PRESENTATION_CONTENT) {
          return mockGetPresentationContentUseCase;
        }
      });

    await talktreeViewModel(mockSlug, mockSponsorSlug);

    expect(mockGetStandaloneSiteExecute).toHaveBeenCalledWith(
      TALKTREE_PAGE, 
      expect.objectContaining({
        FEEDBACK_URL: presentationWithoutRepository.feedbackUrl,
        REPOSITORY_URL: EMPTY_STRING
      })
    );
  });
});