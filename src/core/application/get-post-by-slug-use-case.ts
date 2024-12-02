import { Post } from '@/core/domain/model/Post';
import { PostRepository } from '@/core/domain/repository/PostRepository';

export class GetPostBySlugUseCase {
  constructor(private readonly repository: PostRepository) {}

  execute(slug: string): Post | undefined {
    return this.repository.getBySlug(slug);
  }
}