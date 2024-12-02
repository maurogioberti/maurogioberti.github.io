import { PostRepository } from '@/core/domain/repository/PostRepository';

import { Post } from '../../domain/model/Post';
import { BlogService } from '../../domain/services/BlogService';
import { BaseRepository } from './base/BaseRepository';

export class PostRepositoryImpl extends BaseRepository implements PostRepository {

  constructor(private readonly blogService: BlogService) {
    super();
  }

  async getLast(count: number): Promise<Post[]> {
    const posts = await this.getPosts();
    return posts.slice(-count).reverse();
  }

  async getBySlug(slug: string): Promise<Post | undefined> {
    const posts = await this.getPosts();
    return posts.find((post) => post.slug === slug);
  }

  async getAll(): Promise<Post[]> {
    const posts = await this.getPosts();
    return this.sortByDateDesc(posts);
  }

  private async getPosts() {
    const rawDataPosts = await this.blogService.fetchPosts();
    const posts = rawDataPosts.map((rawDataPost) => new Post(
      rawDataPost.id,
      rawDataPost.title,
      rawDataPost.description,
      rawDataPost.content,
      rawDataPost.tags,
      rawDataPost.imageUrl,
      rawDataPost.postedDate,
    ));

    return posts;
  }

  private sortByDateDesc(posts: Post[]): Post[] {
    return posts.sort((a, b) => new Date(b.postedDate ?? 0).getTime() - new Date(a.postedDate ?? 0).getTime());
  }
}