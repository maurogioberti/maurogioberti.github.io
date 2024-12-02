import { Post } from '../model/Post';

export interface PostRepository {
  getLast(count: number): Promise<Post[]>;
  getBySlug(slug: string): Promise<Post | undefined>;
  getAll(): Promise<Post[]>;
}