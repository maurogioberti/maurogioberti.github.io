import { useHomeViewModel, DEFAULT_MESSAGE } from "./useHomeViewModel";
import { Message } from "@/core/domain/model/Message";
import { describe, test, expect, jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { container } from "@/core/di/DependencyContainer";

const ERROR_FETCHING_MESSAGE = "Error fetching message:";
const EXPECTED_CALL_COUNT = 1;

jest.mock("@/core/di/DependencyContainer", () => ({
  container: {
    resolve: jest.fn(),
  },
}));

describe("useHomeViewModel", () => {
  test("should fetch and return a message", async () => {
    const fakeMessageContent = faker.lorem.sentence();
    const mockMessage = new Message(fakeMessageContent);

    const getMessageUseCase = {
      execute: jest.fn<() => Promise<Message>>().mockResolvedValue(mockMessage),
    };
    jest.mocked(container.resolve).mockReturnValue(getMessageUseCase);

    const result = await useHomeViewModel();

    expect(result.message).toBe(fakeMessageContent);
    expect(getMessageUseCase.execute).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT);
  });

  test("should set default error message on failure", async () => {
    const fakeErrorMessage = faker.hacker.phrase();

    const getMessageUseCase = {
      execute: jest.fn<() => Promise<Message>>().mockRejectedValue(new Error(fakeErrorMessage)),
    };

    jest.mocked(container.resolve).mockReturnValue(getMessageUseCase);

    jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await useHomeViewModel();

    expect(result.message).toBe(DEFAULT_MESSAGE);
    expect(getMessageUseCase.execute).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT);
    expect(console.error).toHaveBeenCalledWith(
      ERROR_FETCHING_MESSAGE,
      expect.any(Error)
    );
  });
});