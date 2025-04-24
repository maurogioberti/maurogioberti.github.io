export class GetHeaderContentUseCase {
  execute() {
    return [
      { label: "Home", href: "/pages/home" },
      { label: "Resume", href: "/pages/resume" },
      { label: "Services", href: "/pages/services" },
      { label: "Talks", href: "/pages/talks" },
      { label: "Blog", href: "/pages/blog" },
    ];
  }
}