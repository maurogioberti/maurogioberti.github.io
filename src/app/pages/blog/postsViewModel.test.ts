import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { postsViewModel } from './postsViewModel';

describe("postsViewModel", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(container, "resolve");
    });

    test("should return posts data", async () => {
        const mockPostsData = [
            { id: faker.number.int.toString(), title: faker.lorem.sentence(), content: faker.lorem.paragraph() },
            { id: faker.number.int.toString(), title: faker.lorem.sentence(), content: faker.lorem.paragraph() },
        ];

        const mockGetAllPostsExecute = jest
            .fn<() => Promise<typeof mockPostsData>>()
            .mockResolvedValue(mockPostsData);

        const mockGetAllPostsUseCase = { execute: mockGetAllPostsExecute };

        (container.resolve as jest.Mock).mockImplementationOnce(() => mockGetAllPostsUseCase);

        const result = await postsViewModel();

        expect(container.resolve).toHaveBeenCalledWith('GetAllPostsUseCase');
        expect(mockGetAllPostsExecute).toHaveBeenCalled();
        expect(result.posts).toBe(mockPostsData);
    });

    test("should handle errors from GetAllPostsUseCase", async () => {
        const errorMessage = faker.lorem.sentence();
        const mockError = new Error(errorMessage);

        const mockGetAllPostsExecute = jest
            .fn<() => Promise<never>>()
            .mockRejectedValue(mockError);

        const mockGetAllPostsUseCase = { execute: mockGetAllPostsExecute };

        (container.resolve as jest.Mock).mockImplementationOnce(() => mockGetAllPostsUseCase);

        await expect(postsViewModel()).rejects.toThrow(errorMessage);

        expect(container.resolve).toHaveBeenCalledWith('GetAllPostsUseCase');
        expect(mockGetAllPostsExecute).toHaveBeenCalled();
    });
});