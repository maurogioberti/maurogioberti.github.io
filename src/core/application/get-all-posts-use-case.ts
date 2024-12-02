import { Post } from '@/core/domain/model/Post';
import { PostRepository } from '@/core/domain/repository/PostRepository';

export class GetAllPostsUseCase {
  constructor(private readonly repository: PostRepository) {}

  async execute(): Promise<Post[]> {
    return await this.repository.getAll();
  }
}