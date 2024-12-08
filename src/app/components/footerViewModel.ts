import { GetFooterContentUseCase } from '@/core/application/get-footer-content-usecase';
import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

export async function footerViewModel() {
  const getFooterContentUseCase = container.resolve<GetFooterContentUseCase>(DependencyIdentifiers.USE_CASES.GET_FOOTER_CONTENT);
  const content = getFooterContentUseCase.execute();
  return { content };
}