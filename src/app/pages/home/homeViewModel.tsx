import { container } from "@/core/crosscutting/injection/DependencyInjectionContainer";
import { GetMessageUseCase } from "@/core/application/get-message-usecase";
import { GetProfileUseCase } from "@/core/application/get-profile-content-usecase";

export async function homeViewModel() {
  const getMessageUseCase = container.useResolve(GetMessageUseCase);
  const getProfileUseCase = container.useResolve(GetProfileUseCase);

  const profile = await getProfileUseCase.execute();
  const message = await getMessageUseCase.execute();

  return { message: message.content, profile: profile };
}