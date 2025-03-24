import { GetProfileUseCase } from '@/core/application/get-profile-content-use-case';
import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

import { GetPresentationBySlugUseCase } from '../../../../../core/application/get-presentation-by-slug-use-case';
import { GetStandaloneSiteUseCase } from '../../../../../core/application/get-standalone-site-use-case';

const TALKTREE_PAGE = "talktree/[slug]/[sponsorSlug]";
const EMPTY_STRING = "";

export const talktreeViewModel = async (slug: string, sponsorSlug: string) => {
  const getStandaloneSiteUseCase = container.resolve<GetStandaloneSiteUseCase>(DependencyIdentifiers.USE_CASES.GET_STANDALONE_SITE);
  const getProfileUseCase = container.resolve<GetProfileUseCase>(DependencyIdentifiers.USE_CASES.GET_PROFILE);
  const GetPresentationContentUseCase = container.resolve<GetPresentationBySlugUseCase>(DependencyIdentifiers.USE_CASES.GET_PRESENTATION_CONTENT);

  const profile = await getProfileUseCase.execute();
  const presentation = await GetPresentationContentUseCase.execute(slug, sponsorSlug);
  
  const htmlContent = await getStandaloneSiteUseCase.execute(TALKTREE_PAGE, {
    GITHUB_URL: profile.githubUrl,
    YOUTUBE_URL: profile.youtubeUrl,
    TWITTER_URL: profile.twitterUrl,
    INSTAGRAM_URL: profile.instagramUrl,
    LINKEDIN_URL: profile.linkedinUrl,
    WEBSITE_URL: profile.websiteUrl,
    POST_URL: presentation.postUrl ?? EMPTY_STRING,
    SLIDES_URL: presentation.slidesUrl ?? EMPTY_STRING,
    VIDEO_URL: presentation.videoUrl ?? EMPTY_STRING,
    REPOSITORY_URL: presentation.repositoryUrl ?? EMPTY_STRING,
    RESOURCES_URL: presentation.resourcesUrl ?? EMPTY_STRING,
    FEEDBACK_URL: presentation.feedbackUrl ?? EMPTY_STRING,
  });

  return { htmlContent };
};