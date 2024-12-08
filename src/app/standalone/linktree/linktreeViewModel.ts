import { Metadata } from 'next';

import { GetProfileUseCase } from '@/core/application/get-profile-content-usecase';
import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import linktreeMetadata from '@/core/crosscutting/seo/linktree';

import { GetStandaloneSiteUseCase } from '../../../core/application/get-standalone-site-use-case';

export const metadata: Metadata = {...linktreeMetadata};
const LINKTREE_PAGE = "linktree";

export const linktreeViewModel = async () => {
  const getStandaloneSiteUseCase = container.resolve<GetStandaloneSiteUseCase>(DependencyIdentifiers.USE_CASES.GET_STANDALONE_SITE);
  const getProfileUseCase = container.resolve<GetProfileUseCase>(DependencyIdentifiers.USE_CASES.GET_PROFILE);

  const profile = await getProfileUseCase.execute();

  const htmlContent = await getStandaloneSiteUseCase.execute(LINKTREE_PAGE, {
    GITHUB_URL: profile.githubUrl,
    YOUTUBE_URL: profile.youtubeUrl,
    TWITTER_URL: profile.twitterUrl,
    INSTAGRAM_URL: profile.instagramUrl,
    LINKEDIN_URL: profile.linkedinUrl,
    WEBSITE_URL: profile.websiteUrl,
  });
  return { htmlContent };
};