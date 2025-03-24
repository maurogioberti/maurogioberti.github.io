export const DependencyIdentifiers = {
  SERVICES: {
    MESSAGE: "MessageService",
    PROFILE: "ProfileService",
    BLOG: "BlogService",
    RESUME: "ResumeService",
    SERVICE: "ServiceService",
    PRESENTATION: "PresentationService",
  },
  REPOSITORIES: {
    MESSAGE: "MessageRepository",
    PROFILE: "ProfileRepository",
    BLOG: "BlogRepository",
    RESUME: "ResumeRepository",
    SERVICE: "ServiceRepository",
    PRESENTATION: "PresentationRepository",
  },
  USE_CASES: {
    GET_MESSAGE: "GetMessageUseCase",
    GET_PROFILE: "GetProfileUseCase",
    GET_ALL_POSTS: "GetAllPostsUseCase",
    GET_ALL_PRESENTATIONS: "GetAllPresentationsUseCase",
    GET_POST_BY_SLUG: "GetPostBySlugUseCase",
    GET_LAST_POSTS: "GetLastPostsUseCase",
    GET_RECOMMENDATIONS: "GetRecommendationsUseCase",
    GET_SERVICES: "GetServicesUseCase",
    GET_TIMELINE: "GetTimelineUseCase",
    GET_STANDALONE_SITE: "GetStandaloneSiteUseCase",
    GET_FOOTER_CONTENT: "GetFooterContentUseCase",
    GET_HEADER_CONTENT: "GetHeaderContentUseCase",
    GET_PRESENTATION_CONTENT: 'GetPresentationContentUseCase',
  },
};