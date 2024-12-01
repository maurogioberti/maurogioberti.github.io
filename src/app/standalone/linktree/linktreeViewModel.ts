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

  const profileData = await getProfileUseCase.execute();

  const htmlContent = await getStandaloneSiteUseCase.execute(LINKTREE_PAGE, {
    GITHUB_URL: profileData.socials.github,
    YOUTUBE_URL: profileData.socials.youtube,
    TWITTER_URL: profileData.socials.twitter,
    INSTAGRAM_URL: profileData.socials.instagram,
    LINKEDIN_URL: profileData.socials.linkedin,
    WEBSITE_URL: profileData.socials.website,
  });
  return { htmlContent };
};