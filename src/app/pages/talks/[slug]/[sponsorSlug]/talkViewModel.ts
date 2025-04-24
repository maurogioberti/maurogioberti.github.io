import { GetPresentationBySlugUseCase } from '@/core/application/get-presentation-by-slug-use-case';
import { GetProfileUseCase } from '@/core/application/get-profile-content-use-case';
import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

export async function talkViewModel(slug: string, sponsorSlug: string) {
  const getPresentationBySlugUseCase = container.resolve<GetPresentationBySlugUseCase>(DependencyIdentifiers.USE_CASES.GET_PRESENTATION_CONTENT);
  const getProfileUseCase = container.resolve<GetProfileUseCase>(DependencyIdentifiers.USE_CASES.GET_PROFILE);

  const talk = await getPresentationBySlugUseCase.execute(slug, sponsorSlug);
  const profile = await getProfileUseCase.execute();
  return { talk, profile };
}