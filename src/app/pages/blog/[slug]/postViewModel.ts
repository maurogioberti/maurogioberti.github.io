import Container from 'ts-injecty';

import { GetPostBySlugUseCase } from '@/core/application/get-post-by-slug-use-case';

export async function postViewModel(slug: string) {
  const getPostBySlugUseCase = Container.resolve(GetPostBySlugUseCase);
  const post = await getPostBySlugUseCase.execute(slug);
  return { post };
}