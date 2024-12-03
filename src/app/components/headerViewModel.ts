import { Container } from 'ts-injecty/dist/Container';

import {
    GetHeaderContentUseCase as GetHeaderContentUseCase
} from '@/core/application/get-header-content-usecase';
import { GetProfileUseCase } from '@/core/application/get-profile-content-usecase';

export async function headerViewModel() {
  const getHeaderContentUseCase = Container.resolve(GetHeaderContentUseCase);
  const getProfileUseCase = Container.resolve(GetProfileUseCase);

  const content = getHeaderContentUseCase.execute();
  const profile = await getProfileUseCase.execute();
  return { content, profile: profile };
}