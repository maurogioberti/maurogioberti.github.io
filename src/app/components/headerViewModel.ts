import { GetHeaderContentUseCase } from '@/core/application/get-header-content-usecase';
import { GetProfileUseCase } from '@/core/application/get-profile-content-usecase';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

export async function headerViewModel() {
  
  const getHeaderContentUseCase = container.resolve<GetHeaderContentUseCase>(GetHeaderContentUseCase.name);
  const getProfileUseCase = container.resolve<GetProfileUseCase>('GetProfileUseCase');

  const content = getHeaderContentUseCase.execute();
  const profile = await getProfileUseCase.execute();
  return { content, profile: profile };
}