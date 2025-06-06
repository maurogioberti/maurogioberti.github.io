import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { Post } from '../../domain/model/Post';
import { BlogService } from '../../domain/services/BlogService';
import { BlogRepositoryImpl } from './BlogRepositoryImpl';

describe("BlogRepositoryImpl", () => {
  const MIN_POSTS_COUNT = 1;
  const MAX_POSTS_COUNT = 10;
  const ADDITIONAL_POSTS = 5;
  const TOTAL_POSTS = 5;

  let blogService: BlogService;
  let blogRepository: BlogRepositoryImpl;

  beforeEach(() => {
    blogService = {
      fetchPosts: jest.fn(),
    } as unknown as BlogService;
    blogRepository = new BlogRepositoryImpl(blogService);
  });

  test("getLastPosts should return the last N posts", async () => {
    const count = faker.number.int({ min: MIN_POSTS_COUNT, max: MAX_POSTS_COUNT });
    const posts = Array.from({ length: count + ADDITIONAL_POSTS }, () => new Post(
      faker.number.int().toString(),
      faker.lorem.word(),
      faker.lorem.text(),
      faker.lorem.paragraph(),
      [faker.lorem.word()],
      faker.image.url(),
      faker.date.past(),
    ));

    (blogService.fetchPosts as jest.MockedFunction<typeof blogService.fetchPosts>).mockResolvedValue(posts);

    const result = await blogRepository.getLastPosts(count);

    expect(result).toHaveLength(count);
    expect(result).toEqual(posts.slice(-count).reverse());
  });

  test("getPostBySlug should return the post with the given slug", async () => {
    const posts = Array.from({ length: TOTAL_POSTS }, () => {
      return new Post(
        faker.number.int().toString(),
        faker.lorem.word(),
        faker.lorem.text(),
        faker.lorem.paragraph(),
        [faker.lorem.word()],
        faker.image.url(),
        faker.date.past(),
      );
    });

    const slug = posts[0].slug;
    (blogService.fetchPosts as jest.MockedFunction<typeof blogService.fetchPosts>).mockResolvedValue(posts);

    const result = await blogRepository.getPostBySlug(slug!);

    expect(result).toEqual(posts.find((post) => post.slug === slug));
  });

  test("getAllPosts should return all posts sorted by date descending", async () => {
    const posts = Array.from({ length: TOTAL_POSTS }, () => new Post(
      faker.number.int().toString(),
      faker.lorem.word(),
      faker.lorem.text(),
      faker.lorem.paragraph(),
      [faker.lorem.word()],
      faker.image.url(),
      faker.date.past(),
    ));

    (blogService.fetchPosts as jest.MockedFunction<typeof blogService.fetchPosts>).mockResolvedValue(posts);

    const result = await blogRepository.getAllPosts();

expect(result).toEqual(posts.sort((a, b) => new Date(b.postedDate ?? 0).getTime() - new Date(a.postedDate ?? 0).getTime()));
  });
});