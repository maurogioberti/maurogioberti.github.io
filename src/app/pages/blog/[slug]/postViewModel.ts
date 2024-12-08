import { GetPostBySlugUseCase } from '@/core/application/get-post-by-slug-use-case';
import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

export async function postViewModel(slug: string) {
  const getPostBySlugUseCase = container.resolve<GetPostBySlugUseCase>(DependencyIdentifiers.USE_CASES.GET_POST_BY_SLUG);
  const post = await getPostBySlugUseCase.execute(slug);
  return { post };
}