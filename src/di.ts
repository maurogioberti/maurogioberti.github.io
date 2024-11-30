import { GetMessageUseCase } from '@/core/application/get-message-usecase';
import { GetStandaloneSiteUseCase } from '@/core/application/get-standalone-site-use-case';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { MessageRepositoryImpl } from '@/core/infrastructure/repository/MessageRepositoryImpl';
import { MessageServiceImpl } from '@/core/infrastructure/services/MessageServiceImpl';

export function setupDependencies() {
  container.register(MessageServiceImpl.getInterface(), () => new MessageServiceImpl());
  container.register(MessageRepositoryImpl.getInterface(), () =>
    new MessageRepositoryImpl(container.resolve(MessageServiceImpl.getInterface()))
  );
  container.register(GetMessageUseCase.name, () =>
    new GetMessageUseCase(container.resolve(MessageRepositoryImpl.getInterface()))
  );
  container.register(GetStandaloneSiteUseCase.name, () =>
    new GetStandaloneSiteUseCase()
  );
}