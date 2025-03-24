import { Post } from '@/core/domain/model/Post';
import { BlogRepository } from '@/core/domain/repository/BlogRepository';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { GetAllPostsUseCase } from './get-all-posts-use-case';

describe("GetAllPostsUseCase", () => {
  let mockRepository: jest.Mocked<BlogRepository>;
  let useCase: GetAllPostsUseCase;
  let mockPosts: Post[];

  beforeEach(() => {
    const MIN_POSTS = 5;
    const MAX_POSTS = 10;

    mockPosts = Array.from({ length: faker.number.int({ min: MIN_POSTS, max: MAX_POSTS }) }, () => {
      const id = faker.number.int().toString();
      const title = faker.lorem.sentence();
      const description = faker.lorem.paragraph();
      const content = faker.lorem.paragraphs();
      const tags = faker.helpers.arrayElements([faker.lorem.word(), faker.lorem.word(), faker.lorem.word()]);
      const imageUrl = faker.image.url();
      const postedDate = faker.date.past();

      return new Post(id, title, description, content, tags, imageUrl, postedDate);
    });

    mockRepository = {
      getAllPosts: jest.fn<() => Promise<Post[]>>().mockResolvedValue(mockPosts),
      getLastPosts: jest.fn<() => Promise<Post[]>>(),
      getPostBySlug: jest.fn<() => Promise<Post | undefined>>(),
    };

    useCase = new GetAllPostsUseCase(mockRepository);
  });

  test("execute should return all posts", async () => {
    const result = await useCase.execute();
    
    expect(result).toHaveLength(mockPosts.length);
    expect(result).toStrictEqual(mockPosts);
    expect(mockRepository.getAllPosts).toHaveBeenCalledTimes(1);
  });
});