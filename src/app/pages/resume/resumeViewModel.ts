import { GetProfileUseCase } from '@/core/application/get-profile-content-use-case';
import { GetRecommendationsUseCase } from '@/core/application/get-recommendations-use-case';
import { GetTimelineUseCase } from '@/core/application/get-timeline-use-case';
import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

export async function resumeViewModel() {
  const getProfileUseCase = container.resolve<GetProfileUseCase>(DependencyIdentifiers.USE_CASES.GET_PROFILE);
  const getRecommendationsUseCase = container.resolve<GetRecommendationsUseCase>(DependencyIdentifiers.USE_CASES.GET_RECOMMENDATIONS);
  const getTimelineUseCase = container.resolve<GetTimelineUseCase>(DependencyIdentifiers.USE_CASES.GET_TIMELINE);

  const profile = await getProfileUseCase.execute();
  const recommendations = await getRecommendationsUseCase.execute();
  const timeline = await getTimelineUseCase.execute();

  return { profile, recommendations, timeline };
}
