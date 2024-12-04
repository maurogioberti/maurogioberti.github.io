import { Post } from '@/core/domain/model/Post';
import { BlogRepository } from '@/core/domain/repository/BlogRepository';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { GetPostBySlugUseCase } from './get-post-by-slug-use-case';

describe("GetPostBySlugUseCase", () => {
  let mockRepository: jest.Mocked<BlogRepository>;
  let useCase: GetPostBySlugUseCase;
  let expectedPost: Post;

  const ONE_CALL_EXPECTED = 1;

  beforeEach(() => {
    expectedPost = new Post(
      faker.number.int().toString(),
      faker.lorem.sentence(),
      faker.lorem.paragraph(),
      faker.lorem.paragraphs(),
      [faker.lorem.word(), faker.lorem.word()],
      faker.image.url(),
      faker.date.past()
    );

    mockRepository = {
      getAllPosts: jest.fn<() => Promise<Post[]>>(),
      getLastPosts: jest.fn<() => Promise<Post[]>>(),
      getPostBySlug: jest.fn<() => Promise<Post | undefined>>().mockResolvedValue(expectedPost),
    };

    useCase = new GetPostBySlugUseCase(mockRepository);
  });

  test("should return a post when a matching slug is found", async () => {
    const slug = expectedPost.slug;
    const result = await useCase.execute(slug);

    expect(result).toBeDefined();
    expect(result).toStrictEqual(expectedPost);
    expect(mockRepository.getPostBySlug).toHaveBeenCalledWith(slug);
    expect(mockRepository.getPostBySlug).toHaveBeenCalledTimes(1);
  });

  test("should return undefined when no matching slug is found", async () => {
    const slug = faker.lorem.slug();
    mockRepository.getPostBySlug.mockResolvedValueOnce(undefined);

    const result = await useCase.execute(slug);

    expect(result).toBeUndefined();
    expect(mockRepository.getPostBySlug).toHaveBeenCalledWith(slug);
    expect(mockRepository.getPostBySlug).toHaveBeenCalledTimes(ONE_CALL_EXPECTED);
  });
});
