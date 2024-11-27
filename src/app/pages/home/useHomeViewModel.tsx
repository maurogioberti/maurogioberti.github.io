// src/app/pages/home/useHomeViewModel.ts
import { container } from "@/core/di/DependencyContainer";
import { GetMessageUseCase } from "@/core/application/get-message-usecase";

export const DEFAULT_MESSAGE = "Error loading message";

export async function useHomeViewModel() {
  const getMessageUseCase = container.resolve<GetMessageUseCase>(GetMessageUseCase.name);
  try {
    const result = await getMessageUseCase.execute();
    return { message: result.content };
  } catch (error) {
    console.error("Error fetching message:", error);
    return { message: DEFAULT_MESSAGE };
  }
}