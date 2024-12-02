import { Post } from '../model/Post';

export interface BlogService {
  fetchPosts(): Promise<Post[]>;
}