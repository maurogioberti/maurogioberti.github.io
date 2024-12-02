import { Post } from '@/core/domain/model/Post';
import { PostRepository } from '@/core/domain/repository/PostRepository';

export class GetLastPostsUseCase {
  private static readonly NUMBER_OF_POSTS = 10;
  
  constructor(private readonly repository: PostRepository) {}

  execute(): Post[] {
    return this.repository.getLast(GetLastPostsUseCase.NUMBER_OF_POSTS);
  }
}