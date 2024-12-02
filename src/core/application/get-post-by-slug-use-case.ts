import { Post } from '@/core/domain/model/Post';
import { PostRepository } from '@/core/domain/repository/PostRepository';

export class GetPostBySlugUseCase {
  constructor(private readonly repository: PostRepository) {}

  async execute(slug: string): Promise<Post | undefined> {
    return await this.repository.getBySlug(slug);
  }
}