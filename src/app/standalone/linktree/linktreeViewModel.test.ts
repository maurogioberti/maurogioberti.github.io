import { linktreeViewModel } from "./linktreeViewModel";
import { GetStandaloneSiteUseCase } from "../../../core/application/get-standalone-site-use-case";
import { container } from "@/core/crosscutting/injection/DependencyInjectionContainer";
import { describe, test, expect, jest } from "@jest/globals";

jest.mock("@/core/crosscutting/injection/DependencyInjectionContainer", () => ({
    container: {
        useResolve: jest.fn(),
    },
}));

describe("linktreeViewModel", () => {
    const pageName = "linktree";

    test("should return htmlContent from getStandaloneSiteUseCase.execute", async () => {
        const mockHtmlContent = "<html>Mock Content</html>";
        const mockExecute = jest.fn<() => Promise<string>>().mockResolvedValue(mockHtmlContent);
        const mockGetStandaloneSiteUseCase = { execute: mockExecute };
        (container.useResolve as jest.Mock).mockReturnValue(mockGetStandaloneSiteUseCase);

        const result = await linktreeViewModel();

        expect(container.useResolve).toHaveBeenCalledWith(GetStandaloneSiteUseCase);
        expect(mockExecute).toHaveBeenCalledWith(pageName, expect.objectContaining({
            GITHUB_URL: expect.any(String),
            YOUTUBE_URL: expect.any(String),
            TWITTER_URL: expect.any(String),
            INSTAGRAM_URL: expect.any(String),
            LINKEDIN_URL: expect.any(String),
            WEBSITE_URL: expect.any(String),
        }));
        expect(result).toEqual({ htmlContent: mockHtmlContent });
    });
});