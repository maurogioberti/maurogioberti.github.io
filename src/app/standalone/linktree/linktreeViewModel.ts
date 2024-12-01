import { container } from "@/core/crosscutting/injection/DependencyInjectionContainer";
import { GetStandaloneSiteUseCase } from "../../../core/application/get-standalone-site-use-case";
import { GetProfileUseCase } from "@/core/application/get-profile-content-usecase";
import linktreeMetadata from "@/core/crosscutting/seo/linktree";
import { Metadata } from "next";

export const metadata: Metadata = {...linktreeMetadata};
const LINKTREE_PAGE = "linktree";

export const linktreeViewModel = async () => {

  const getStandaloneSiteUseCase = container.useResolve(GetStandaloneSiteUseCase);
  const getProfileUseCase = container.useResolve(GetProfileUseCase);

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