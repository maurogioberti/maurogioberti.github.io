import { Post } from '@/core/domain/model/Post';
import { BlogRepository } from '@/core/domain/repository/BlogRepository';

export class GetPostBySlugUseCase {
  constructor(private readonly repository: BlogRepository) {}

  async execute(slug: string): Promise<Post | undefined> {
    return await this.repository.getPostBySlug(slug);
  }
}