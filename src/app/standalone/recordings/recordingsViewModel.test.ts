import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { Presentation, PRESENTATION_TYPE } from '@/core/domain/model/Presentation';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { recordingsViewModel } from './recordingsViewModel';

const RECORDINGS_PAGE = "recordings";
const DEPENDENCY_ID_STANDALONE_SITE = 'GetStandaloneSiteUseCase';
const DEPENDENCY_ID_PROFILE = 'GetProfileUseCase';
const DEPENDENCY_ID_ALL_PRESENTATIONS = 'GetAllPresentationsUseCase';
const FIRST_CALL_INDEX = 0;
const PAGE_NAME_ARG_INDEX = 0;
const PLACEHOLDERS_ARG_INDEX = 1;
const YOUTUBE_VIDEO_ID_LENGTH = 11;
const RECENT_DAYS_MOST_RECENT = 30;
const RECENT_DAYS_RECENT = 60;
const RECENT_DAYS_OLDER = 90;
const RECENT_DAYS_NEWEST = 10;
const RECENT_DAYS_MIDDLE = 180;
const PAST_YEARS_OLDEST = 1;

const createMockProfileData = () => ({
  githubUrl: faker.internet.url(),
  youtubeUrl: faker.internet.url(),
  twitterUrl: faker.internet.url(),
  instagramUrl: faker.internet.url(),
  tiktokUrl: faker.internet.url(),
  linkedinUrl: faker.internet.url(),
  websiteUrl: faker.internet.url(),
});

const generateYouTubeVideoId = () => faker.string.alphanumeric(YOUTUBE_VIDEO_ID_LENGTH);

const generateYouTubeUrl = () => 
  `https://www.youtube.com/watch?v=${generateYouTubeVideoId()}`;

const generateYouTuShortUrl = () => 
  `https://youtu.be/${generateYouTubeVideoId()}`;

const createMockPresentation = (options: {
  id?: string;
  title?: string;
  slug?: string;
  sponsor?: string;
  sponsorSlug?: string;
  type?: typeof PRESENTATION_TYPE[keyof typeof PRESENTATION_TYPE];
  description?: string;
  place?: string;
  language?: string;
  date?: Date;
  imageUrl?: string;
  eventName?: string;
  location?: string;
  videoUrl?: string;
} = {}): Presentation => {
  return new Presentation(
    options.id ?? faker.string.uuid(),
    options.title ?? faker.company.catchPhrase(),
    options.slug ?? faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase(),
    options.sponsor ?? faker.company.name(),
    options.sponsorSlug ?? faker.helpers.slugify(faker.company.name()).toLowerCase(),
    options.type ?? faker.helpers.arrayElement(Object.values(PRESENTATION_TYPE)),
    options.description ?? faker.lorem.paragraph(),
    options.place ?? faker.location.city(),
    options.language ?? faker.helpers.arrayElement([faker.string.alpha(), faker.string.alpha()]),
    options.date ?? faker.date.past(),
    options.imageUrl ?? faker.image.url(),
    options.eventName ?? faker.company.name(),
    options.location ?? faker.location.city(),
    undefined,
    undefined,
    undefined,
    undefined,
    options.videoUrl,
    undefined,
    undefined,
    undefined,
    [faker.lorem.word(), faker.lorem.word()]
  );
};

const createMockHtmlContent = () => 
  `<html><body><div class="videos-grid">${faker.lorem.sentence()}</div></body></html>`;

const setupMocks = (
  profileData: ReturnType<typeof createMockProfileData>,
  presentations: Presentation[],
  htmlContent: string
) => {
  const mockGetProfileExecute = jest
    .fn<() => Promise<typeof profileData>>()
    .mockResolvedValue(profileData);

  const mockGetAllPresentationsExecute = jest
    .fn<() => Promise<Presentation[]>>()
    .mockResolvedValue(presentations);

  const mockGetStandaloneSiteExecute = jest
    .fn<() => Promise<string>>()
    .mockResolvedValue(htmlContent);

  const mockGetProfileUseCase = { execute: mockGetProfileExecute };
  const mockGetAllPresentationsUseCase = { execute: mockGetAllPresentationsExecute };
  const mockGetStandaloneSiteUseCase = { execute: mockGetStandaloneSiteExecute };

  (container.resolve as jest.Mock)
    .mockImplementationOnce(() => mockGetStandaloneSiteUseCase)
    .mockImplementationOnce(() => mockGetProfileUseCase)
    .mockImplementationOnce(() => mockGetAllPresentationsUseCase);

  return {
    mockGetProfileExecute,
    mockGetAllPresentationsExecute,
    mockGetStandaloneSiteExecute,
  };
};

describe("recordingsViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(container, "resolve");
  });

  test("should return HTML content with profile data and all presentation videos", async () => {
    const mockProfileData = createMockProfileData();
    const mostRecentDate = faker.date.recent({ days: RECENT_DAYS_MOST_RECENT });
    const recentDate = faker.date.recent({ days: RECENT_DAYS_RECENT });
    const olderDate = faker.date.recent({ days: RECENT_DAYS_OLDER });
    
    const mockPresentations: Presentation[] = [
      createMockPresentation({ 
        date: mostRecentDate, 
        videoUrl: generateYouTubeUrl() 
      }),
      createMockPresentation({ 
        date: recentDate, 
        videoUrl: generateYouTuShortUrl() 
      }),
      createMockPresentation({ 
        date: olderDate, 
        videoUrl: undefined 
      })
    ];
    const mockHtmlContent = createMockHtmlContent();

    const mocks = setupMocks(mockProfileData, mockPresentations, mockHtmlContent);

    const result = await recordingsViewModel();

    expect(container.resolve).toHaveBeenCalledWith(DEPENDENCY_ID_STANDALONE_SITE);
    expect(container.resolve).toHaveBeenCalledWith(DEPENDENCY_ID_PROFILE);
    expect(container.resolve).toHaveBeenCalledWith(DEPENDENCY_ID_ALL_PRESENTATIONS);

    expect(mocks.mockGetProfileExecute).toHaveBeenCalled();
    expect(mocks.mockGetAllPresentationsExecute).toHaveBeenCalled();
    expect(mocks.mockGetStandaloneSiteExecute).toHaveBeenCalled();

    const callArgs = (mocks.mockGetStandaloneSiteExecute.mock.calls[FIRST_CALL_INDEX] as unknown[]);
    expect(callArgs[PAGE_NAME_ARG_INDEX]).toBe(RECORDINGS_PAGE);
    
    const placeholders = callArgs[PLACEHOLDERS_ARG_INDEX] as Record<string, string>;
    expect(placeholders.GITHUB_URL).toBe(mockProfileData.githubUrl);
    expect(placeholders.YOUTUBE_URL).toBe(mockProfileData.youtubeUrl);
    expect(placeholders.TWITTER_URL).toBe(mockProfileData.twitterUrl);
    expect(placeholders.INSTAGRAM_URL).toBe(mockProfileData.instagramUrl);
    expect(placeholders.TIKTOK_URL).toBe(mockProfileData.tiktokUrl);
    expect(placeholders.LINKEDIN_URL).toBe(mockProfileData.linkedinUrl);
    expect(placeholders.WEBSITE_URL).toBe(mockProfileData.websiteUrl);
    expect(placeholders.VIDEO_ITEMS).toBeDefined();

    expect(result.htmlContent).toBe(mockHtmlContent);
  });

  test("should filter out presentations without video URLs", async () => {
    const mockProfileData = createMockProfileData();
    const talkTitleWithVideo = faker.company.catchPhrase();
    const talkTitleWithoutVideo = faker.company.catchPhrase();
    const dateWithVideo = faker.date.recent({ days: RECENT_DAYS_MOST_RECENT });
    const dateWithoutVideo = faker.date.recent({ days: RECENT_DAYS_RECENT });
    
    const mockPresentations: Presentation[] = [
      createMockPresentation({ 
        title: talkTitleWithVideo,
        date: dateWithVideo,
        videoUrl: generateYouTubeUrl() 
      }),
      createMockPresentation({ 
        title: talkTitleWithoutVideo,
        date: dateWithoutVideo,
        videoUrl: undefined 
      })
    ];
    const mockHtmlContent = createMockHtmlContent();

    const mocks = setupMocks(mockProfileData, mockPresentations, mockHtmlContent);

    await recordingsViewModel();

    const callArgs = (mocks.mockGetStandaloneSiteExecute.mock.calls[FIRST_CALL_INDEX] as unknown[]);
    const placeholders = callArgs[PLACEHOLDERS_ARG_INDEX] as Record<string, string>;
    
    expect(placeholders.VIDEO_ITEMS).toContain(talkTitleWithVideo);
    expect(placeholders.VIDEO_ITEMS).not.toContain(talkTitleWithoutVideo);
  });

  test("should sort presentations by date from newest to oldest", async () => {
    const mockProfileData = createMockProfileData();
    const oldestTitle = faker.company.catchPhrase();
    const newestTitle = faker.company.catchPhrase();
    const middleTitle = faker.company.catchPhrase();
    
    const newestDate = faker.date.recent({ days: RECENT_DAYS_NEWEST });
    const middleDate = faker.date.recent({ days: RECENT_DAYS_MIDDLE });
    const oldestDate = faker.date.past({ years: PAST_YEARS_OLDEST });
    
    const mockPresentations: Presentation[] = [
      createMockPresentation({ 
        title: oldestTitle,
        date: oldestDate,
        videoUrl: generateYouTubeUrl() 
      }),
      createMockPresentation({ 
        title: newestTitle,
        date: newestDate,
        videoUrl: generateYouTubeUrl() 
      }),
      createMockPresentation({ 
        title: middleTitle,
        date: middleDate,
        videoUrl: generateYouTubeUrl() 
      })
    ];
    const mockHtmlContent = createMockHtmlContent();

    const mocks = setupMocks(mockProfileData, mockPresentations, mockHtmlContent);

    await recordingsViewModel();

    const callArgs = (mocks.mockGetStandaloneSiteExecute.mock.calls[FIRST_CALL_INDEX] as unknown[]);
    const placeholders = callArgs[PLACEHOLDERS_ARG_INDEX] as Record<string, string>;
    
    const videoItems = placeholders.VIDEO_ITEMS;
    const newestIndex = videoItems.indexOf(newestTitle);
    const middleIndex = videoItems.indexOf(middleTitle);
    const oldestIndex = videoItems.indexOf(oldestTitle);
    
    expect(newestIndex).toBeLessThan(middleIndex);
    expect(middleIndex).toBeLessThan(oldestIndex);
  });
});