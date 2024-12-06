import { BlogRepository } from '@/core/domain/repository/BlogRepository';

import { Post } from '../../domain/model/Post';
import { BlogService } from '../../domain/services/BlogService';
import { BaseRepository } from './base/BaseRepository';

export class BlogRepositoryImpl extends BaseRepository implements BlogRepository {
  constructor(private readonly blogService: BlogService) {
    super();
  }

  async getLastPosts(count: number): Promise<Post[]> {
    const posts = await this.getPosts();
    return posts.slice(-count).reverse();
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const posts = await this.getPosts();
    return posts.find((post) => post.slug === slug);
  }

  async getAllPosts(): Promise<Post[]> {
    const posts = await this.getPosts();
    return this.sortPostsByDateDesc(posts);
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
          new Date(rawDataPost.postedDate ?? 0)
        )
    );

    return posts;
  }

  private sortPostsByDateDesc(posts: Post[]): Post[] {
    return posts.sort((a, b) => new Date(b.postedDate ?? 0).getTime() - new Date(a.postedDate ?? 0).getTime());
  }
}