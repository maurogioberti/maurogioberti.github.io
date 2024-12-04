import { Post } from '../model/Post';

export interface BlogRepository {
  getLastPosts(count: number): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  getAllPosts(): Promise<Post[]>;
}