import { GetHeaderContentUseCase } from '@/core/application/get-header-content-usecase';
import { GetProfileUseCase } from '@/core/application/get-profile-content-usecase';
import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

export async function headerViewModel() {
  
  const getHeaderContentUseCase = container.resolve<GetHeaderContentUseCase>(DependencyIdentifiers.USE_CASES.GET_HEADER_CONTENT);
  const getProfileUseCase = container.resolve<GetProfileUseCase>(DependencyIdentifiers.USE_CASES.GET_PROFILE);

  const content = getHeaderContentUseCase.execute();
  const profile = await getProfileUseCase.execute();
  return { content, profile: profile };
}