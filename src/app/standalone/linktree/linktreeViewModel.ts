import { container } from "@/core/crosscutting/injection/DependencyInjectionContainer";
import { GetStandaloneSiteUseCase } from "../../../core/application/get-standalone-site-use-case";
import { GetProfileUseCase } from "@/core/application/get-profile-content-usecase";

const pageName = "linktree";

export async function linktreeViewModel() {
  const getStandaloneSiteUseCase = container.useResolve(GetStandaloneSiteUseCase);
  const getProfileUseCase = container.useResolve(GetProfileUseCase);
  
  const profile = await getProfileUseCase.execute();
  
  const htmlContent = await getStandaloneSiteUseCase.execute(pageName, {
    GITHUB_URL: profile.socials["github"],
    YOUTUBE_URL: profile.socials["youtube"],
    TWITTER_URL: profile.socials["twitter"],
    INSTAGRAM_URL: profile.socials["instagram"],
    LINKEDIN_URL: profile.socials["linkedin"],
    WEBSITE_URL: profile.socials["website"],
  });
  return { htmlContent };
}