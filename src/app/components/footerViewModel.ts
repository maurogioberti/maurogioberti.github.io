import { GetFooterContentUseCase } from '@/core/application/get-footer-content-usecase';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

export async function footerViewModel() {
  const getFooterContentUseCase = container.resolve<GetFooterContentUseCase>(GetFooterContentUseCase.name);
  const content = getFooterContentUseCase.execute();
  return { content };
}