import * as fs from 'fs';
import path from 'path';

import { faker } from '@faker-js/faker';
import { afterEach, describe, expect, test } from '@jest/globals';

import { GetStandaloneSiteUseCase } from './get-standalone-site-use-case';

describe("GetStandaloneSiteUseCase", () => {
  const pageName = "testPage";
  const placeholders = { title: faker.lorem.words(3), content: faker.lorem.paragraph() };
  const basePath = path.join(
    process.cwd(),
    "src",
    "app",
    "standalone",
    pageName,
    "index.html"
  );
  const baseDirectory = path.dirname(basePath);
  const ENCODING = "utf8";

  afterEach(() => {
    fs.rmSync(baseDirectory, { recursive: true, force: true });
  });

  function writeStandalonePage(htmlTemplate: string) {
    fs.mkdirSync(baseDirectory, { recursive: true });
    fs.writeFileSync(basePath, htmlTemplate, ENCODING);
  }

  test("should return HTML content with placeholders replaced", () => {
    const htmlTemplate = `<h1>{title}</h1><p>{content}</p>`;
    const expectedHtml = `<h1>${placeholders.title}</h1><p>${placeholders.content}</p>`;

    writeStandalonePage(htmlTemplate);

    const useCase = new GetStandaloneSiteUseCase();
    const result = useCase.execute(pageName, placeholders);

    expect(result).toBe(expectedHtml);
  });

  test("should throw an error if the page does not exist", () => {
    const useCase = new GetStandaloneSiteUseCase();

    expect(() => useCase.execute(pageName)).toThrow(
      `The standalone page "${pageName}" was not found.`
    );
  });

  test("should return HTML content without placeholder replacements if none provided", () => {
    const htmlTemplate = `<h1>{title}</h1><p>{content}</p>`;

    writeStandalonePage(htmlTemplate);

    const useCase = new GetStandaloneSiteUseCase();
    const result = useCase.execute(pageName);

    expect(result).toBe(htmlTemplate);
  });

  test("should handle multiple occurrences of the same placeholder", () => {
    const htmlTemplate = `<h1>{title}</h1><h2>{title}</h2>`;
    const expectedHtml = `<h1>${placeholders.title}</h1><h2>${placeholders.title}</h2>`;

    writeStandalonePage(htmlTemplate);

    const useCase = new GetStandaloneSiteUseCase();
    const result = useCase.execute(pageName, { title: placeholders.title });

    expect(result).toBe(expectedHtml);
  });

  test("should not replace placeholders that are not provided", () => {
    const htmlTemplate = `<h1>{title}</h1><p>{content}</p>`;
    const expectedHtml = `<h1>{title}</h1><p>${placeholders.content}</p>`;

    writeStandalonePage(htmlTemplate);

    const useCase = new GetStandaloneSiteUseCase();
    const result = useCase.execute(pageName, { content: placeholders.content });

    expect(result).toBe(expectedHtml);
  });
});