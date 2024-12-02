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
    
    return new Post(
      "1",
      "Understanding Clean Architecture",
      "A deep dive into Clean Architecture principles for modern applications.",
      `Full content of Clean Architecture ${slug}...`,
      ["clean architecture", "software engineering", "design patterns"],
      "/assets/open-graph/default-og-image.png",
      new Date("2024-12-01"),
    )
  }

  async getAll(): Promise<Post[]> {
    const posts = await this.getPosts();
    return this.sortByDateDesc(posts);
  }

  private async getPosts() {
    console.log("fetch posts")
    const rawDataPosts = await this.blogService.fetchPosts();
    console.log(`rawDataPosts ${rawDataPosts}`)
    const posts = rawDataPosts.map((rawDataPost) => new Post(
      rawDataPost.id,
      rawDataPost.title,
      rawDataPost.description,
      rawDataPost.content,
      rawDataPost.tags,
      rawDataPost.imageUrl,
      rawDataPost.postedDate,
    ));
    console.log(`return posts ${posts}}`)
    return posts;
  }

  private sortByDateDesc(posts: Post[]): Post[] {
    return posts.sort((a, b) => new Date(b.postedDate ?? 0).getTime() - new Date(a.postedDate ?? 0).getTime());
  }
}