import { Post } from '../model/Post';

export interface PostRepository {
  getLast(count: number): Post[];
  getBySlug(slug: string): Post | undefined;
  getAll(): Post[];
}