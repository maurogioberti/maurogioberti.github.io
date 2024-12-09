import { GetMessageUseCase } from '@/core/application/get-message-use-case';
import { GetProfileUseCase } from '@/core/application/get-profile-content-use-case';
import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

export async function homeViewModel() {
  const getMessageUseCase = container.resolve<GetMessageUseCase>(DependencyIdentifiers.USE_CASES.GET_MESSAGE);
  const getProfileUseCase = container.resolve<GetProfileUseCase>(DependencyIdentifiers.USE_CASES.GET_PROFILE);

  const profile = await getProfileUseCase.execute();
  const message = await getMessageUseCase.execute();

  return { message: message.content, profile: profile };
}