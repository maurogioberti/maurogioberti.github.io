import { container } from './core/crosscutting/injection/DependencyInjectionContainer';

import { GetMessageUseCase } from './core/application/get-message-usecase';
import { GetProfileUseCase } from './core/application/get-profile-content-usecase';
import { GetFooterContentUseCase } from './core/application/get-footer-content-usecase';
import { GetHeaderContentUseCase } from './core/application/get-header-content-usecase';
import { GetStandaloneSiteUseCase } from './core/application/get-standalone-site-use-case';
import { GetAllPostsUseCase } from './core/application/get-all-posts-use-case';
import { GetPostBySlugUseCase } from './core/application/get-post-by-slug-use-case';
import { GetLastPostsUseCase } from './core/application/get-last-posts-use-case';

import { MessageRepositoryImpl } from './core/infrastructure/repository/MessageRepositoryImpl';
import { ProfileRepositoryImpl } from './core/infrastructure/repository/ProfileRepositoryImpl';

import { MessageServiceImpl } from './core/infrastructure/services/MessageServiceImpl';
import { ProfileServiceImpl } from './core/infrastructure/services/ProfileServiceImpl';
import { BlogServiceImpl } from './core/infrastructure/services/BlogServiceImpl';
import { PostRepositoryImpl } from '@/core/infrastructure/repository/PostRepositoryImpl';

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

  container.register(BlogServiceImpl.getInterface(), () => new BlogServiceImpl());
  container.register(PostRepositoryImpl.getInterface(), () =>
    new PostRepositoryImpl( new BlogServiceImpl())
  );
  container.register(GetPostBySlugUseCase.name, () =>
    new GetPostBySlugUseCase(container.resolve(PostRepositoryImpl.getInterface()))
  );
  container.register(GetLastPostsUseCase.name, () =>
    new GetLastPostsUseCase(container.resolve(PostRepositoryImpl.getInterface()))
  );
  container.register(GetAllPostsUseCase.name, () =>
    new GetAllPostsUseCase(container.resolve(PostRepositoryImpl.getInterface()))
  );
}