export class GetHeaderContentUseCase {
    //TODO: Retreieve content from a repository
    execute() {
      return [
        { label: "Home", href: "/pages/home" },
        { label: "Resume", href: "/pages/resume" },
        { label: "Services", href: "/pages/services" },
        { label: "Blog", href: "/pages/blog" },
      ];
    }
  }