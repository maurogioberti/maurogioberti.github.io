import { GetMessageUseCase } from '@/core/application/get-message-usecase';
import { GetProfileUseCase } from '@/core/application/get-profile-content-usecase';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

export async function homeViewModel() {
  const getMessageUseCase = container.resolve<GetMessageUseCase>('GetMessageUseCase');
  const getProfileUseCase = container.resolve<GetProfileUseCase>('GetProfileUseCase');

  const profile = await getProfileUseCase.execute();
  const message = await getMessageUseCase.execute();

  return { message: message.content, profile: profile };
}