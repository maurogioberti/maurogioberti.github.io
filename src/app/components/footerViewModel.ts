import { container } from "@/core/crosscutting/injection/DependencyInjectionContainer";
import { GetFooterContentUseCase } from "@/core/application/get-footer-content-usecase";

export async function footerViewModel() {
  const getFooterContentUseCase = container.useResolve(GetFooterContentUseCase);
  const content = getFooterContentUseCase.execute();
  return { content };
}
