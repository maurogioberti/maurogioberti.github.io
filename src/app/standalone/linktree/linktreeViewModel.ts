import { Metadata } from 'next';
import { Container } from 'ts-injecty/dist/Container';

import { GetProfileUseCase } from '@/core/application/get-profile-content-usecase';
import linktreeMetadata from '@/core/crosscutting/seo/linktree';

import { GetStandaloneSiteUseCase } from '../../../core/application/get-standalone-site-use-case';

export const metadata: Metadata = {...linktreeMetadata};
const LINKTREE_PAGE = "linktree";

export const linktreeViewModel = async () => {

  const getStandaloneSiteUseCase = Container.resolve(GetStandaloneSiteUseCase);
  const getProfileUseCase = Container.resolve(GetProfileUseCase);

  const profile = await getProfileUseCase.execute();

  const htmlContent = getStandaloneSiteUseCase.execute(LINKTREE_PAGE, {
    GITHUB_URL: profile.githubUrl,
    YOUTUBE_URL: profile.youtubeUrl,
    TWITTER_URL: profile.twitterUrl,
    INSTAGRAM_URL: profile.instagramUrl,
    LINKEDIN_URL: profile.linkedinUrl,
    WEBSITE_URL: profile.websiteUrl,
  });
  return { htmlContent };
};