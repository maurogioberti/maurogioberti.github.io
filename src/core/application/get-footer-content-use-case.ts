export class GetFooterContentUseCase {
  execute() {
    return {
      sourceText: "Want to check my source? 🚀",
      sourceLink: "https://github.com/maurogioberti/maurogioberti.github.io",
      copyright: `© ${new Date().getFullYear()} Mauro Gioberti`,
    };
  }
}