export class GetHeaderContentUseCase {
    //TODO: Retreieve content from a repository
    execute() {
      return [
        { label: "Home", href: "/" },
        { label: "Resume", href: "/resume" },
        { label: "Services", href: "/services" },
        { label: "Blog", href: "/blog" },
      ];
    }
  }