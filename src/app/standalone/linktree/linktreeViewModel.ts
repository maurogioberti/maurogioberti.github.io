import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { GetStandaloneSiteUseCase } from '../../../core/application/get-standalone-site-use-case';

export async function linktreeViewModel() {
  const getStandaloneSiteUseCase = container.useResolve(GetStandaloneSiteUseCase);
  const pageName = "linktree";

  const placeholders = { // TODO: Retrieve this data dynamically.
    GITHUB_URL: "https://github.com/maurogioberti",
    YOUTUBE_URL: "https://www.youtube.com/@maurogioberti",
    TWITTER_URL: "https://x.com/maurogioberti",
    INSTAGRAM_URL: "https://www.instagram.com/maurogioberti/",
    LINKEDIN_URL: "https://www.linkedin.com/in/maurogioberti",
    WEBSITE_URL: "https://maurogioberti.com",
  };

  const htmlContent = await getStandaloneSiteUseCase.execute(pageName, placeholders);
  return { htmlContent };
}