import { Post } from '@/core/domain/model/Post';
import { PostRepository } from '@/core/domain/repository/PostRepository';

export class GetLastPostsUseCase {
  private static readonly NUMBER_OF_POSTS = 10;
  
  constructor(private readonly repository: PostRepository) {}

  async execute(): Promise<Post[]> {
    return await this.repository.getLast(GetLastPostsUseCase.NUMBER_OF_POSTS);
  }
}