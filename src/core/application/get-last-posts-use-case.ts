import { Post } from '@/core/domain/model/Post';
import { BlogRepository } from '@/core/domain/repository/BlogRepository';

export class GetLastPostsUseCase {
  private static readonly NUMBER_OF_POSTS = 10;
  
  constructor(private readonly repository: BlogRepository) {}

  async execute(): Promise<Post[]> {
    return await this.repository.getLastPosts(GetLastPostsUseCase.NUMBER_OF_POSTS);
  }
}