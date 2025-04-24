import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

import { GetPresentationBySlugUseCase } from '../../../../../core/application/get-presentation-by-slug-use-case';

export const talktreeInfoViewModel = async (slug: string, sponsorSlug: string) => {
  const getPresentationContentUseCase = container.resolve<GetPresentationBySlugUseCase>(DependencyIdentifiers.USE_CASES.GET_PRESENTATION_CONTENT);

  const presentation = await getPresentationContentUseCase.execute(slug, sponsorSlug);
  return { presentation };
};