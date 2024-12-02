import { GetPostBySlugUseCase } from '@/core/application/get-post-by-slug-use-case';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

export async function postViewModel(slug: string) {
  const getPostBySlugUseCase = container.useResolve(GetPostBySlugUseCase);
  const post = await getPostBySlugUseCase.execute(slug);
  return { post };
}