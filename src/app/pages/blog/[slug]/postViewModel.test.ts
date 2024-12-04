import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { postViewModel } from './postViewModel';

describe("postViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(container, "resolve");
  });

  test("should return post data for a given slug", async () => {
    const mockSlug = faker.lorem.slug();
    const mockPostData = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
      author: faker.person.fullName(),
      date: faker.date.past().toISOString(),
    };

    const mockGetPostBySlugExecute = jest
      .fn<() => Promise<typeof mockPostData>>()
      .mockResolvedValue(mockPostData);

    const mockGetPostBySlugUseCase = { execute: mockGetPostBySlugExecute };

    (container.resolve as jest.Mock).mockImplementationOnce(() => mockGetPostBySlugUseCase);

    const result = await postViewModel(mockSlug);

    expect(container.resolve).toHaveBeenCalledWith('GetPostBySlugUseCase');
    expect(mockGetPostBySlugExecute).toHaveBeenCalledWith(mockSlug);
    expect(result.post).toBe(mockPostData);
  });

  test("should handle errors from GetPostBySlugUseCase", async () => {
    const mockSlug = faker.lorem.slug();
    const errorMessage = faker.lorem.sentence();
    const mockError = new Error(errorMessage);

    const mockGetPostBySlugExecute = jest
      .fn<() => Promise<never>>()
      .mockRejectedValue(mockError);

    const mockGetPostBySlugUseCase = { execute: mockGetPostBySlugExecute };

    (container.resolve as jest.Mock).mockImplementationOnce(() => mockGetPostBySlugUseCase);

    await expect(postViewModel(mockSlug)).rejects.toThrow(errorMessage);

    expect(container.resolve).toHaveBeenCalledWith('GetPostBySlugUseCase');
    expect(mockGetPostBySlugExecute).toHaveBeenCalledWith(mockSlug);
  });
});