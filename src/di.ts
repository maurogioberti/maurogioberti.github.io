import { GetMessageUseCase } from '@/core/application/get-message-usecase';
import { GetStandaloneSiteUseCase } from '@/core/application/get-standalone-site-use-case';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { MessageRepositoryImpl } from '@/core/infrastructure/repository/MessageRepositoryImpl';
import { MessageServiceImpl } from '@/core/infrastructure/services/MessageServiceImpl';
import { GetFooterContentUseCase } from '@/core/application/get-footer-content-usecase';
import { GetHeaderContentUseCase } from '@/core/application/get-header-content-usecase';
import { ProfileServiceImpl } from './core/infrastructure/services/ProfileServiceImpl';
import { ProfileRepositoryImpl } from './core/infrastructure/repository/ProfileRepositoryImpl';
import { GetProfileUseCase } from './core/application/get-profile-content-usecase';

export function setupDependencies() {
  container.register(MessageServiceImpl.getInterface(), () => new MessageServiceImpl());
  container.register(MessageRepositoryImpl.getInterface(), () =>
    new MessageRepositoryImpl(container.resolve(MessageServiceImpl.getInterface()))
  );
  container.register(GetMessageUseCase.name, () =>
    new GetMessageUseCase(container.resolve(MessageRepositoryImpl.getInterface()))
  );
  container.register(ProfileServiceImpl.getInterface(), () => new ProfileServiceImpl());
  container.register(ProfileRepositoryImpl.getInterface(), () =>
    new ProfileRepositoryImpl(container.resolve(ProfileServiceImpl.getInterface()))
  );
  container.register(GetProfileUseCase.name, () =>
    new GetProfileUseCase(container.resolve(ProfileRepositoryImpl.getInterface()))
  );
  container.register(GetHeaderContentUseCase.name, () =>
    new GetHeaderContentUseCase()
  );
  container.register(GetFooterContentUseCase.name, () =>
    new GetFooterContentUseCase()
  );
  container.register(GetStandaloneSiteUseCase.name, () =>
    new GetStandaloneSiteUseCase()
  );
}