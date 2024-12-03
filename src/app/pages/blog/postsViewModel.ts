import { GetAllPostsUseCase } from '@/core/application/get-all-posts-use-case';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

export async function postsViewModel() {
    const getAllPostsUseCase = container.resolve<GetAllPostsUseCase>(GetAllPostsUseCase.name);
    const posts = await getAllPostsUseCase.execute();
    return { posts };
}