import { container } from "@/core/crosscutting/injection/DependencyInjectionContainer";
import { GetHeaderContentUseCase as GetHeaderContentUseCase } from "@/core/application/get-header-content-usecase";
import { GetProfileUseCase } from "@/core/application/get-profile-content-usecase";

export async function headerViewModel() {
  const getHeaderContentUseCase = container.useResolve(GetHeaderContentUseCase);
  const getProfileUseCase = container.useResolve(GetProfileUseCase);

  const content = getHeaderContentUseCase.execute();
  const profile = await getProfileUseCase.execute();
  return { content, profile: profile };
}