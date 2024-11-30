import * as fs from 'fs';
import * as path from 'path';

type Placeholders = Record<string, string>;

export class GetStandaloneSiteUseCase {
  protected readonly BASE_PATH_STRING = 'src/app/standalone';
  private readonly INDEX_FILE = 'index.html';
  private readonly ENCODING = 'utf8';
  private readonly PLACEHOLDER_PATTERN = 'g';

  execute(pageName: string, placeholders: Placeholders = {}): string {
    const PAGES_BASE_PATH = this.BASE_PATH_STRING.split(path.sep);
    const basePath = path.join(process.cwd(), ...PAGES_BASE_PATH, pageName, this.INDEX_FILE);

    if (!fs.existsSync(basePath))
      throw new Error(`The standalone page "${pageName}" was not found.`);

    let htmlContent = fs.readFileSync(basePath, this.ENCODING);

    for (const [key, value] of Object.entries(placeholders)) {
      const placeholder = `{${key}}`;
      const regex = new RegExp(placeholder, this.PLACEHOLDER_PATTERN);
      htmlContent = htmlContent.replace(regex, value);
    }

    return htmlContent;
  }
}