import { Metadata } from 'next';

import { GetAllPresentationsUseCase } from '@/core/application/get-all-presentations-use-case';
import { GetProfileUseCase } from '@/core/application/get-profile-content-use-case';
import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import recordingsMetadata from '@/core/crosscutting/seo/recordings';

import { GetStandaloneSiteUseCase } from '../../../core/application/get-standalone-site-use-case';

export const metadata: Metadata = {...recordingsMetadata};

const RECORDINGS_PAGE = "recordings";
const YOUTUBE_STANDARD_URL_VIDEO_ID_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/;
const YOUTUBE_WATCH_PAGE_VIDEO_ID_REGEX  = /youtube\.com\/watch\?.*v=([^&]+)/;
const FALLBACK_THUMBNAIL_URL = '/assets/open-graph/recordings-og-image.png';
const VIDEO_ID_CAPTURE_GROUP_INDEX = 1;
const DATE_FORMAT_YEAR = 'numeric';
const DATE_FORMAT_MONTH = 'long';
const DATE_FORMAT_DAY = 'numeric';
const DATE_LOCALE = 'en-US';

const EVENT_TYPE_CONFIG: Record<string, { label: string; icon: string; cssClass: string }> = {
  online:  { label: 'Online',  icon: 'fa-desktop',        cssClass: 'event-type-online'  },
  onsite:  { label: 'On-site', icon: 'fa-users',          cssClass: 'event-type-onsite'  },
  hybrid:  { label: 'Hybrid',  icon: 'fa-layer-group',    cssClass: 'event-type-hybrid'  },
};
const EVENT_TYPE_DEFAULT = { label: 'Event', icon: 'fa-calendar-alt', cssClass: 'event-type-default' };

const getYouTubeThumbnail = (videoUrl: string): string => {
  const patterns = [YOUTUBE_STANDARD_URL_VIDEO_ID_REGEX, YOUTUBE_WATCH_PAGE_VIDEO_ID_REGEX ];

  let videoId: string | null = null;

  for (const pattern of patterns) {
    const match = videoUrl.match(pattern);
    if (match && match[VIDEO_ID_CAPTURE_GROUP_INDEX]) {
      videoId = match[VIDEO_ID_CAPTURE_GROUP_INDEX];
      break;
    }
  }

  if (!videoId) {
    return FALLBACK_THUMBNAIL_URL;
  }


  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};


const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: DATE_FORMAT_YEAR, 
    month: DATE_FORMAT_MONTH, 
    day: DATE_FORMAT_DAY 
  };
  return new Date(date).toLocaleDateString(DATE_LOCALE, options);
};

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const recordingsViewModel = async () => {
  const getStandaloneSiteUseCase = container.resolve<GetStandaloneSiteUseCase>(DependencyIdentifiers.USE_CASES.GET_STANDALONE_SITE);
  const getProfileUseCase = container.resolve<GetProfileUseCase>(DependencyIdentifiers.USE_CASES.GET_PROFILE);
  const getAllPresentationsUseCase = container.resolve<GetAllPresentationsUseCase>(DependencyIdentifiers.USE_CASES.GET_ALL_PRESENTATIONS);

  const profile = await getProfileUseCase.execute();
  const allPresentations = await getAllPresentationsUseCase.execute();

  const presentationsWithVideos = allPresentations
    .filter(presentation => presentation.videoUrl)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const videoItems = presentationsWithVideos.map(presentation => {
    const thumbnailUrl = getYouTubeThumbnail(presentation.videoUrl!);
    const formattedDate = formatDate(presentation.date);
    const safeTitle = escapeHtml(presentation.title);
    const safeEventName = escapeHtml(presentation.eventName || presentation.sponsor);
    const safeLocation = presentation.location ? escapeHtml(presentation.location) : '';
    const typeConfig = EVENT_TYPE_CONFIG[presentation.type] ?? EVENT_TYPE_DEFAULT;
    
    return `
      <a href="${presentation.videoUrl}" target="_blank" rel="noopener noreferrer" class="video-link" aria-label="Watch ${safeTitle}">
        <div class="video-card">
          <div class="video-thumbnail-container">
            <img src="${thumbnailUrl}" alt="${safeTitle} thumbnail" class="video-thumbnail" loading="lazy">
            <div class="play-overlay">
              <i class="fab fa-youtube"></i>
            </div>
            <div class="video-badge">
              <i class="fab fa-youtube"></i>
              <span>YouTube</span>
            </div>
          </div>
          <div class="video-content">
            <h3 class="video-title">${safeTitle}</h3>
            <span class="event-type-badge ${typeConfig.cssClass}">
              <i class="fas ${typeConfig.icon}"></i>
              ${typeConfig.label}
            </span>
            <div class="video-meta">
              <p class="video-event">
                <i class="fas fa-calendar-alt"></i>
                <strong>${safeEventName}</strong>
              </p>
              ${safeLocation ? `<p class="video-location"><i class="fas fa-map-marker-alt"></i> ${safeLocation}</p>` : ''}
              <p class="video-date"><i class="far fa-calendar"></i> ${formattedDate}</p>
            </div>
            <div class="watch-button">
              <i class="fab fa-youtube"></i>
              <span>Watch on YouTube</span>
            </div>
          </div>
        </div>
      </a>
    `.trim();
  }).join('\n');

  const htmlContent = await getStandaloneSiteUseCase.execute(RECORDINGS_PAGE, {
    GITHUB_URL: profile.githubUrl,
    YOUTUBE_URL: profile.youtubeUrl,
    TWITTER_URL: profile.twitterUrl,
    INSTAGRAM_URL: profile.instagramUrl,
    TIKTOK_URL: profile.tiktokUrl,
    LINKEDIN_URL: profile.linkedinUrl,
    WEBSITE_URL: profile.websiteUrl,
    VIDEO_ITEMS: videoItems
  });

  return { htmlContent };
};