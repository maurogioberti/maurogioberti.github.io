import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

import { GetAllPostsUseCase } from './core/application/get-all-posts-use-case';
import { GetAllPresentationsUseCase } from './core/application/get-all-presentations-use-case';
import { GetFooterContentUseCase } from './core/application/get-footer-content-use-case';
import { GetHeaderContentUseCase } from './core/application/get-header-content-use-case';
import { GetLastPostsUseCase } from './core/application/get-last-posts-use-case';
import { GetMessageUseCase } from './core/application/get-message-use-case';
import { GetPostBySlugUseCase } from './core/application/get-post-by-slug-use-case';
import { GetPresentationBySlugUseCase } from './core/application/get-presentation-by-slug-use-case';
import { GetProfileUseCase } from './core/application/get-profile-content-use-case';
import { GetRecommendationsUseCase } from './core/application/get-recommendations-use-case';
import { GetServicesUseCase } from './core/application/get-services-use-case';
import { GetStandaloneSiteUseCase } from './core/application/get-standalone-site-use-case';
import { GetTimelineUseCase } from './core/application/get-timeline-use-case';
import { BlogRepositoryImpl } from './core/infrastructure/repository/BlogRepositoryImpl';
import { MessageRepositoryImpl } from './core/infrastructure/repository/MessageRepositoryImpl';
import { PresentationRepositoryImpl } from './core/infrastructure/repository/PresentationRepositoryImpl';
import { ProfileRepositoryImpl } from './core/infrastructure/repository/ProfileRepositoryImpl';
import { ResumeRepositoryImpl } from './core/infrastructure/repository/ResumeRepositoryImpl';
import { ServiceRepositoryImpl } from './core/infrastructure/repository/ServiceRepositoryImpl';
import { BlogServiceImpl } from './core/infrastructure/services/BlogServiceImpl';
import { MessageServiceImpl } from './core/infrastructure/services/MessageServiceImpl';
import { PresentationServiceImpl } from './core/infrastructure/services/PresentationServiceImpl';
import { ProfileServiceImpl } from './core/infrastructure/services/ProfileServiceImpl';
import { ResumeServiceImpl } from './core/infrastructure/services/ResumeServiceImpl';
import { ServiceServiceImpl } from './core/infrastructure/services/ServiceServiceImpl';

export function setupDependencies() {
  // Services
  container.register(DependencyIdentifiers.SERVICES.MESSAGE, () => new MessageServiceImpl());
  container.register(DependencyIdentifiers.SERVICES.PROFILE, () => new ProfileServiceImpl());
  container.register(DependencyIdentifiers.SERVICES.BLOG, () => new BlogServiceImpl());
  container.register(DependencyIdentifiers.SERVICES.RESUME, () => new ResumeServiceImpl());
  container.register(DependencyIdentifiers.SERVICES.SERVICE, () => new ServiceServiceImpl());
  container.register(DependencyIdentifiers.SERVICES.PRESENTATION, () => new PresentationServiceImpl());

  // Repositories
  container.register(DependencyIdentifiers.REPOSITORIES.MESSAGE, () => new MessageRepositoryImpl(container.resolve(DependencyIdentifiers.SERVICES.MESSAGE)));
  container.register(DependencyIdentifiers.REPOSITORIES.PROFILE, () => new ProfileRepositoryImpl(container.resolve(DependencyIdentifiers.SERVICES.PROFILE)));
  container.register(DependencyIdentifiers.REPOSITORIES.BLOG, () => new BlogRepositoryImpl(container.resolve(DependencyIdentifiers.SERVICES.BLOG)));
  container.register(DependencyIdentifiers.REPOSITORIES.RESUME, () => new ResumeRepositoryImpl(container.resolve(DependencyIdentifiers.SERVICES.RESUME)));
  container.register(DependencyIdentifiers.REPOSITORIES.SERVICE, () => new ServiceRepositoryImpl(container.resolve(DependencyIdentifiers.SERVICES.SERVICE)));
  container.register(DependencyIdentifiers.REPOSITORIES.PRESENTATION, () => new PresentationRepositoryImpl(container.resolve(DependencyIdentifiers.SERVICES.PRESENTATION)));

  // Use Cases
  container.register(DependencyIdentifiers.USE_CASES.GET_MESSAGE, () => new GetMessageUseCase(container.resolve(DependencyIdentifiers.REPOSITORIES.MESSAGE)));
  container.register(DependencyIdentifiers.USE_CASES.GET_PROFILE, () => new GetProfileUseCase(container.resolve(DependencyIdentifiers.REPOSITORIES.PROFILE)));
  container.register(DependencyIdentifiers.USE_CASES.GET_ALL_POSTS, () => new GetAllPostsUseCase(container.resolve(DependencyIdentifiers.REPOSITORIES.BLOG)));
  container.register(
    DependencyIdentifiers.USE_CASES.GET_POST_BY_SLUG,
    () => new GetPostBySlugUseCase(container.resolve(DependencyIdentifiers.REPOSITORIES.BLOG))
  );
  container.register(DependencyIdentifiers.USE_CASES.GET_LAST_POSTS, () => new GetLastPostsUseCase(container.resolve(DependencyIdentifiers.REPOSITORIES.BLOG)));
  container.register(DependencyIdentifiers.USE_CASES.GET_RECOMMENDATIONS, () => new GetRecommendationsUseCase(container.resolve(DependencyIdentifiers.REPOSITORIES.RESUME)));
  container.register(DependencyIdentifiers.USE_CASES.GET_TIMELINE, () => new GetTimelineUseCase(container.resolve(DependencyIdentifiers.REPOSITORIES.RESUME)));
  container.register(DependencyIdentifiers.USE_CASES.GET_SERVICES, () => new GetServicesUseCase(container.resolve(DependencyIdentifiers.REPOSITORIES.SERVICE)));
  container.register(DependencyIdentifiers.USE_CASES.GET_PRESENTATION_CONTENT, () => new GetPresentationBySlugUseCase(container.resolve(DependencyIdentifiers.REPOSITORIES.PRESENTATION)));
  container.register(DependencyIdentifiers.USE_CASES.GET_ALL_PRESENTATIONS, () => new GetAllPresentationsUseCase(container.resolve(DependencyIdentifiers.REPOSITORIES.PRESENTATION)));

  // Use Cases without dependencies
  container.register(DependencyIdentifiers.USE_CASES.GET_STANDALONE_SITE, () => new GetStandaloneSiteUseCase());
  container.register(DependencyIdentifiers.USE_CASES.GET_FOOTER_CONTENT, () => new GetFooterContentUseCase());
  container.register(DependencyIdentifiers.USE_CASES.GET_HEADER_CONTENT, () => new GetHeaderContentUseCase());
}