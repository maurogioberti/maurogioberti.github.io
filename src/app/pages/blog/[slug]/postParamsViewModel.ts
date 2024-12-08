import { GetAllPostsUseCase } from '@/core/application/get-all-posts-use-case';
import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

export async function postParamsViewModel() {
  const getAllPostsUseCase = container.resolve<GetAllPostsUseCase>(DependencyIdentifiers.USE_CASES.GET_ALL_POSTS);
  const posts = await getAllPostsUseCase.execute();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}