import Container from 'ts-injecty';

import { GetAllPostsUseCase } from '@/core/application/get-all-posts-use-case';

export async function postsViewModel() {
  try {
    const getAllPostsUseCase = Container.resolve(GetAllPostsUseCase);
    const posts = await getAllPostsUseCase.execute();

    if (!Array.isArray(posts)) {
      console.error('Expected posts to be an array, but got:', posts);
      return { posts: [] };
    }

    return { posts };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [] };
  }
}