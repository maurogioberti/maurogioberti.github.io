import { Container } from 'ts-injecty/dist/Container';

import { GetFooterContentUseCase } from '@/core/application/get-footer-content-usecase';

export async function footerViewModel() {
  const getFooterContentUseCase = Container.resolve(GetFooterContentUseCase);
  const content = getFooterContentUseCase.execute();
  return { content };
}
