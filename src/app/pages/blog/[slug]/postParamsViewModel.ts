import Container from 'ts-injecty';

import { GetAllPostsUseCase } from '@/core/application/get-all-posts-use-case';

export async function postParamsViewModel() {
  const getAllPostsUseCase = Container.resolve(GetAllPostsUseCase);
  const posts = await getAllPostsUseCase.execute();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}