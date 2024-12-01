import { container } from "@/core/crosscutting/injection/DependencyInjectionContainer";
import { GetHeaderContentUseCase as GetHeaderContentUseCase } from "@/core/application/get-header-content-usecase";

export async function headerViewModel() {
  const getHeaderContentUseCase = container.useResolve(GetHeaderContentUseCase);
  const content = getHeaderContentUseCase.execute();
  return { content };
}