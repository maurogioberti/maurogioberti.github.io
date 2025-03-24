import fs from 'fs';
import path from 'path';

import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { GetStandaloneSiteUseCase } from './get-standalone-site-use-case';

jest.mock("fs");

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

  const ENCODING = "utf8";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return HTML content with placeholders replaced", () => {
    const htmlTemplate = `<h1>{title}</h1><p>{content}</p>`;
    const expectedHtml = `<h1>${placeholders.title}</h1><p>${placeholders.content}</p>`;

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(htmlTemplate);

    const useCase = new GetStandaloneSiteUseCase();
    const result = useCase.execute(pageName, placeholders);

    expect(fs.existsSync).toHaveBeenCalledWith(basePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(basePath, ENCODING);
    expect(result).toBe(expectedHtml);
  });

  test("should throw an error if the page does not exist", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const useCase = new GetStandaloneSiteUseCase();

    expect(() => useCase.execute(pageName)).toThrowError(
      `The standalone page "${pageName}" was not found.`
    );
    expect(fs.existsSync).toHaveBeenCalledWith(basePath);
    expect(fs.readFileSync).not.toHaveBeenCalled();
  });

  test("should return HTML content without placeholder replacements if none provided", () => {
    const htmlTemplate = `<h1>{title}</h1><p>{content}</p>`;

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(htmlTemplate);

    const useCase = new GetStandaloneSiteUseCase();
    const result = useCase.execute(pageName);

    expect(result).toBe(htmlTemplate);
  });

  test("should handle multiple occurrences of the same placeholder", () => {
    const htmlTemplate = `<h1>{title}</h1><h2>{title}</h2>`;
    const expectedHtml = `<h1>${placeholders.title}</h1><h2>${placeholders.title}</h2>`;

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(htmlTemplate);

    const useCase = new GetStandaloneSiteUseCase();
    const result = useCase.execute(pageName, { title: placeholders.title });

    expect(result).toBe(expectedHtml);
  });

  test("should not replace placeholders that are not provided", () => {
    const htmlTemplate = `<h1>{title}</h1><p>{content}</p>`;
    const expectedHtml = `<h1>{title}</h1><p>${placeholders.content}</p>`;

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(htmlTemplate);

    const useCase = new GetStandaloneSiteUseCase();
    const result = useCase.execute(pageName, { content: placeholders.content });

    expect(result).toBe(expectedHtml);
  });
});