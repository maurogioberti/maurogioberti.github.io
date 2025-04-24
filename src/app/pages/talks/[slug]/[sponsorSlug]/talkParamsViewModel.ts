import { GetAllPresentationsUseCase } from '@/core/application/get-all-presentations-use-case';
import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

export async function talkParamsViewModel() {
  const getAllPresentationsUseCase = container.resolve<GetAllPresentationsUseCase>(DependencyIdentifiers.USE_CASES.GET_ALL_PRESENTATIONS);
  const presentations = await getAllPresentationsUseCase.execute();
  
  return presentations.map((presentation) => ({
        slug: presentation.slug,
        sponsorSlug: presentation.sponsorSlug,
      }));
}