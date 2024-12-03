import Container from 'ts-injecty';

import { GetAllPostsUseCase } from '@/core/application/get-all-posts-use-case';

export async function postsViewModel() {
    const getAllPostsUseCase = Container.resolve(GetAllPostsUseCase);
    const posts = await getAllPostsUseCase.execute();
    return { posts };
}