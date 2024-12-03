import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { faker } from '@faker-js/faker';
import { describe, expect, jest, test } from '@jest/globals';

import { homeViewModel } from './homeViewModel';

const EXPECTED_CALL_COUNT = 1;

jest.mock("@/core/crosscutting/injection/DependencyInjectionContainer", () => ({
  container: {
    resolve: jest.fn(),
  },
}));

describe("homeViewModel", () => {
  test("should fetch and return a message and profile", async () => {
    const fakeMessageContent = faker.lorem.sentence();
    const fakeProfile = {
      name: faker.person.fullName(),
      bio: faker.lorem.paragraph(),
      socials: {
        github: faker.internet.url(),
        twitter: faker.internet.url(),
      },
    };

    const mockMessage = { content: fakeMessageContent };
    const mockProfile = fakeProfile;

    const getMessageUseCase = {
      execute: jest.fn<() => Promise<typeof mockMessage>>().mockResolvedValue(mockMessage),
    };

    const getProfileUseCase = {
      execute: jest.fn<() => Promise<typeof mockProfile>>().mockResolvedValue(mockProfile),
    };

    (container.resolve as jest.Mock).mockImplementation((useCase) => {
      if (useCase === "GetMessageUseCase") return getMessageUseCase;
      if (useCase === 'GetProfileUseCase') return getProfileUseCase;
      return undefined;
    });

    const result = await homeViewModel();

    expect(result.message).toBe(fakeMessageContent);
    expect(result.profile).toEqual(fakeProfile);
    expect(getMessageUseCase.execute).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT);
    expect(getProfileUseCase.execute).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT);
  });
});
