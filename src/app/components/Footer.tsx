import { footerViewModel } from "./footerViewModel";

export async function Footer() {
  const { content } = await footerViewModel();

  return (
    <footer className="bg-vs-background-light text-vs-foreground py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">{content.copyright}</p>
        <p className="text-sm mt-4 md:mt-0">
          <a
            href={content.sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-vs-primary"
          >
            {content.sourceText}
          </a>
        </p>
      </div>
    </footer>
  );
}