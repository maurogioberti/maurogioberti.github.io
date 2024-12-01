export class GetFooterContentUseCase {
  //TODO: Retreieve content from a repository
  execute() {
    return {
      sourceText: "Want to check my source? 🚀",
      sourceLink: "https://github.com/maurogioberti/maurogioberti.github.io",
      copyright: `© ${new Date().getFullYear()} Mauro Gioberti`,
    };
  }
}