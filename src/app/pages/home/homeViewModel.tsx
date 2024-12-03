import { Container } from 'ts-injecty/dist/Container';

import { GetMessageUseCase } from '@/core/application/get-message-usecase';
import { GetProfileUseCase } from '@/core/application/get-profile-content-usecase';

export async function homeViewModel() {
  const getMessageUseCase = Container.resolve(GetMessageUseCase);
  const getProfileUseCase = Container.resolve(GetProfileUseCase);

  const profile = await getProfileUseCase.execute();
  const message = await getMessageUseCase.execute();

  return { message: message.content, profile: profile };
}