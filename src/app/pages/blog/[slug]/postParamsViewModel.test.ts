import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { postParamsViewModel } from './postParamsViewModel';

describe('postParamsViewModel', () => {
  const EXPECTED_CALL_COUNT = 1;
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(container, "resolve");
  });

  test('should return a list of post slugs', async () => {
    const mockPosts = Array.from({ length: 5 }, () => ({
      id: faker.number.int().toString(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      content: faker.lorem.paragraphs(),
      slug: faker.lorem.slug(),
      author: faker.person.fullName(),
      publishedAt: faker.date.past(),
      tags: [faker.lorem.word()],
      imageUrl: faker.image.url(),
      formattedDate: faker.date.past().toISOString(),
    }));
    const mockGetAllPostsUseCaseExecute = jest
      .fn<() => Promise<typeof mockPosts>>()
      .mockResolvedValue(mockPosts);

    const mockGetAllPostsUseCase = { execute: mockGetAllPostsUseCaseExecute };

    (container.resolve as jest.Mock).mockImplementationOnce(() => mockGetAllPostsUseCase);

    const result = await postParamsViewModel();

    expect(result).toStrictEqual(mockPosts.map(post => ({ slug: post.slug })));
    expect(mockGetAllPostsUseCase.execute).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT);
  });
});