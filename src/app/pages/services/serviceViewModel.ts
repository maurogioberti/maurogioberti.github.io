import { GetProfileUseCase } from '@/core/application/get-profile-content-use-case';
import { GetServicesUseCase } from '@/core/application/get-services-use-case';
import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

export async function serviceViewModel() {
  const getServicesUseCase = container.resolve<GetServicesUseCase>(DependencyIdentifiers.USE_CASES.GET_SERVICES);
  const getProfileUseCase = container.resolve<GetProfileUseCase>(DependencyIdentifiers.USE_CASES.GET_PROFILE);
  
  const services = await getServicesUseCase.execute();
  const profile = await getProfileUseCase.execute();

  return { services, profile };
}