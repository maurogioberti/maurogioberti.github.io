import { PostRepository } from '@/core/domain/repository/PostRepository';

import { Post } from '../../domain/model/Post';
import { BaseRepository } from './base/BaseRepository';

export class PostRepositoryImpl extends BaseRepository implements PostRepository {
  private postsMock: Post[] = [
    new Post(
      "1",
      "Understanding Clean Architecture",
      "A deep dive into Clean Architecture principles for modern applications.",
      "Full content of Clean Architecture...",
      ["clean architecture", "software engineering", "design patterns"],
      "/assets/open-graph/default-og-image.png",
      new Date("2024-12-01"),
    ),
    new Post(
      "2",
      "Why Unit Testing Matters",
      "The importance of unit testing in software development.",
      "Full content of unit testing...",
      ["unit testing", "best practices", "testing"],
      "/assets/open-graph/default-og-image.png",
      new Date("2024-11-25"),
    ),
  ];
  
  getLast(count: number): Post[] {
    return this.postsMock.slice(-count).reverse();
  }

  getBySlug(slug: string): Post | undefined {
    return this.postsMock.find((post) => post.slug === slug);
  }
  
  getAll(): Post[] {
    return this.sortByDateDesc(this.postsMock);
  }
  
  private sortByDateDesc(posts: Post[]): Post[] {
    return posts.sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime());
  }
}