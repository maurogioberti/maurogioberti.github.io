import { Post } from '@/core/domain/model/Post';
import { PostRepository } from '@/core/domain/repository/PostRepository';

export class GetAllPostsUseCase {
  constructor(private readonly repository: PostRepository) {}

  execute(): Post[] {
    return this.repository.getAll();
  }
}