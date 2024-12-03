import Container, { register } from 'ts-injecty';

import { PostRepositoryImpl } from '@/core/infrastructure/repository/PostRepositoryImpl';

import { GetAllPostsUseCase } from './core/application/get-all-posts-use-case';
import { GetFooterContentUseCase } from './core/application/get-footer-content-usecase';
import { GetHeaderContentUseCase } from './core/application/get-header-content-usecase';
import { GetLastPostsUseCase } from './core/application/get-last-posts-use-case';
import { GetMessageUseCase } from './core/application/get-message-usecase';
import { GetPostBySlugUseCase } from './core/application/get-post-by-slug-use-case';
import { GetProfileUseCase } from './core/application/get-profile-content-usecase';
import { GetStandaloneSiteUseCase } from './core/application/get-standalone-site-use-case';
import { MessageRepositoryImpl } from './core/infrastructure/repository/MessageRepositoryImpl';
import { ProfileRepositoryImpl } from './core/infrastructure/repository/ProfileRepositoryImpl';
import { BlogServiceImpl } from './core/infrastructure/services/BlogServiceImpl';
import { MessageServiceImpl } from './core/infrastructure/services/MessageServiceImpl';
import { ProfileServiceImpl } from './core/infrastructure/services/ProfileServiceImpl';

export const buildDependencies = () => {
  Container.register([
    // Services
    register(MessageServiceImpl.getInterface())
      .withDynamic(() => new MessageServiceImpl())
      .build(),

    register(ProfileServiceImpl.getInterface())
      .withDynamic(() => new ProfileServiceImpl())
      .build(),

    register(BlogServiceImpl.getInterface())
      .withDynamic(() => new BlogServiceImpl())
      .build(),

    // Repositories
    register(MessageRepositoryImpl.getInterface())
      .withDynamic(() => {
        return new MessageRepositoryImpl(new MessageServiceImpl());
      })
      .build(),

    register(ProfileRepositoryImpl.getInterface())
      .withDynamic(() => {
        return new ProfileRepositoryImpl(new ProfileServiceImpl());
      })
      .build(),

    register(PostRepositoryImpl.getInterface())
      .withDynamic(() => {
        return new PostRepositoryImpl(new BlogServiceImpl());
      })
      .build(),

    // Use Cases
    register(GetMessageUseCase)
      .withDependency(MessageRepositoryImpl.getInterface())
      .build(),

    register(GetProfileUseCase)
      .withDependency(ProfileRepositoryImpl.getInterface())
      .build(),

    register(GetAllPostsUseCase)
      .withDependency(PostRepositoryImpl.getInterface())
      .build(),

    register(GetPostBySlugUseCase)
      .withDependency(PostRepositoryImpl.getInterface())
      .build(),

    register(GetLastPostsUseCase)
      .withDependency(PostRepositoryImpl.getInterface())
      .build(),

    // Classes without Dependencies
    register(GetFooterContentUseCase).asASingleton().build(),

    register(GetHeaderContentUseCase).asASingleton().build(),

    register(GetStandaloneSiteUseCase).asASingleton().build(),
  ]);
};
