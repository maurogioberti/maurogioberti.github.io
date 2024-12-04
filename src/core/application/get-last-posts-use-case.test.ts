import { Post } from '@/core/domain/model/Post';
import { BlogRepository } from '@/core/domain/repository/BlogRepository';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { GetLastPostsUseCase } from './get-last-posts-use-case';

describe("GetLastPostsUseCase", () => {
  let mockRepository: BlogRepository;
  let useCase: GetLastPostsUseCase;
  let mockPosts: Post[];
  let mockTenPosts: Post[];
  
  const TOTAL_POSTS = 2;
  const ZERO_EXPECTED = 0;
  const LAST_POSTS_COUNT = 10;

  beforeEach(() => {
    mockPosts = Array.from({ length: TOTAL_POSTS }, () => {
      const id = faker.number.int().toString();
      const title = faker.lorem.sentence();
      const description = faker.lorem.paragraph();
      const content = faker.lorem.paragraphs();
      const tags = faker.helpers.arrayElements([faker.lorem.word(), faker.lorem.word(), faker.lorem.word()]);
      const imageUrl = faker.image.url();
      const postedDate = faker.date.past();

      return new Post(id, title, description, content, tags, imageUrl, postedDate);
    });

    mockTenPosts = Array.from({ length: LAST_POSTS_COUNT }, () => {
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
      getLastPosts: jest.fn<() => Promise<Post[]>>().mockResolvedValue(mockTenPosts),
      getPostBySlug: jest.fn<() => Promise<Post | undefined>>(),
    };

    useCase = new GetLastPostsUseCase(mockRepository);
  });

  test(`should return the last ${LAST_POSTS_COUNT} posts`, async () => {
    const result = await useCase.execute();

    expect(result).toHaveLength(LAST_POSTS_COUNT);
    expect(result).toStrictEqual(mockTenPosts);
    expect(mockRepository.getLastPosts).toHaveBeenCalledWith(LAST_POSTS_COUNT);
    expect(mockRepository.getLastPosts).toHaveBeenCalledTimes(1);
  });

  test("should handle empty posts array", async () => {
    mockRepository.getLastPosts = jest.fn<() => Promise<Post[]>>().mockResolvedValue([]);
    const result = await useCase.execute();

    expect(result).toHaveLength(ZERO_EXPECTED);
    expect(result).toStrictEqual([]);
    expect(mockRepository.getLastPosts).toHaveBeenCalledWith(LAST_POSTS_COUNT);
    expect(mockRepository.getLastPosts).toHaveBeenCalledTimes(1);
  });

  test("should handle repository errors", async () => {
    const errorMessage = "Repository error";
    mockRepository.getLastPosts = jest.fn<() => Promise<Post[]>>().mockRejectedValue(new Error(errorMessage));

    await expect(useCase.execute()).rejects.toThrow(errorMessage);
    expect(mockRepository.getLastPosts).toHaveBeenCalledWith(LAST_POSTS_COUNT);
    expect(mockRepository.getLastPosts).toHaveBeenCalledTimes(1);
  });
});
