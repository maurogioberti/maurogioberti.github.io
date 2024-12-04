import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

import { GetAllPostsUseCase } from './core/application/get-all-posts-use-case';
import { GetFooterContentUseCase } from './core/application/get-footer-content-usecase';
import { GetHeaderContentUseCase } from './core/application/get-header-content-usecase';
import { GetLastPostsUseCase } from './core/application/get-last-posts-use-case';
import { GetMessageUseCase } from './core/application/get-message-usecase';
import { GetPostBySlugUseCase } from './core/application/get-post-by-slug-use-case';
import { GetProfileUseCase } from './core/application/get-profile-content-usecase';
import { GetStandaloneSiteUseCase } from './core/application/get-standalone-site-use-case';
import { BlogRepositoryImpl } from './core/infrastructure/repository/BlogRepositoryImpl';
import { MessageRepositoryImpl } from './core/infrastructure/repository/MessageRepositoryImpl';
import { ProfileRepositoryImpl } from './core/infrastructure/repository/ProfileRepositoryImpl';
import { BlogServiceImpl } from './core/infrastructure/services/BlogServiceImpl';
import { MessageServiceImpl } from './core/infrastructure/services/MessageServiceImpl';
import { ProfileServiceImpl } from './core/infrastructure/services/ProfileServiceImpl';

export function setupDependencies() {
  // Services
  container.register(MessageServiceImpl.getInterface(), () => new MessageServiceImpl());
  container.register(ProfileServiceImpl.getInterface(), () => new ProfileServiceImpl());
  container.register(BlogServiceImpl.getInterface(), () => new BlogServiceImpl());

  // Repositories
  container.register(MessageRepositoryImpl.getInterface(), () => 
    new MessageRepositoryImpl(container.resolve(MessageServiceImpl.getInterface()))
  );
  container.register(ProfileRepositoryImpl.getInterface(), () => 
    new ProfileRepositoryImpl(container.resolve(ProfileServiceImpl.getInterface()))
  );
  container.register(BlogRepositoryImpl.getInterface(), () => 
    new BlogRepositoryImpl(container.resolve(BlogServiceImpl.getInterface()))
  );

  // Use Cases
  container.register('GetMessageUseCase', () => 
    new GetMessageUseCase(container.resolve(MessageRepositoryImpl.getInterface()))
  );
  container.register('GetProfileUseCase', () => 
    new GetProfileUseCase(container.resolve(ProfileRepositoryImpl.getInterface()))
  );
  container.register(GetAllPostsUseCase.name, () => 
    new GetAllPostsUseCase(container.resolve(BlogRepositoryImpl.getInterface()))
  );
  container.register('GetPostBySlugUseCase', () => 
    new GetPostBySlugUseCase(container.resolve(BlogRepositoryImpl.getInterface()))
  );
  container.register(GetLastPostsUseCase.name, () => 
    new GetLastPostsUseCase(container.resolve(BlogRepositoryImpl.getInterface()))
  );

  // Use Cases without dependencies
  container.register('GetStandaloneSiteUseCase', () => new GetStandaloneSiteUseCase());
  container.register(GetFooterContentUseCase.name, () => new GetFooterContentUseCase());
  container.register(GetHeaderContentUseCase.name, () => new GetHeaderContentUseCase());
}