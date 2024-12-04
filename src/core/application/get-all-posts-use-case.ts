import { Post } from '@/core/domain/model/Post';
import { BlogRepository } from '@/core/domain/repository/BlogRepository';

export class GetAllPostsUseCase {
  constructor(private readonly repository: BlogRepository) {}

  async execute(): Promise<Post[]> {
    return await this.repository.getAllPosts();
  }
}