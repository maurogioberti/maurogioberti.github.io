import { Post } from '@/core/domain/model/Post';

import { BlogService } from '../../domain/services/BlogService';
import { BaseService } from './base/BaseService';

export class BlogServiceImpl extends BaseService implements BlogService {
  private static readonly POSTS_GET: string = "posts";

  async fetchPosts(): Promise<Post[]> {
    return await this.fetchContent<Post>(BlogServiceImpl.POSTS_GET);
  }
}