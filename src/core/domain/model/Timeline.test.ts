import { faker } from '@faker-js/faker';
import { describe, expect, test } from '@jest/globals';

import { Timeline } from './Timeline';

describe("Timeline", () => {
  test("should create a Timeline instance with required properties", () => {
    const year = faker.date.past().getFullYear().toString();
    const title = faker.person.jobTitle();
    const company = faker.company.name();
    const logoUrl = faker.internet.url();
    const consultingCompany = faker.company.name();
    const consultingCompanyLogoUrl = faker.internet.url();
    const consultingCompanyUrl = faker.internet.url();
    const companyUrl = faker.internet.url();
    const description = faker.lorem.paragraph();
    const tags = [faker.lorem.word(), faker.lorem.word()];

    const timeline = new Timeline(
      year,
      title,
      company,
      logoUrl,
      consultingCompany,
      consultingCompanyLogoUrl,
      consultingCompanyUrl,
      companyUrl,
      description,
      tags
    );

    expect(timeline.year).toBe(year);
    expect(timeline.title).toBe(title);
    expect(timeline.company).toBe(company);
    expect(timeline.companyLogoUrl).toBe(logoUrl);
    expect(timeline.consultingCompany).toBe(consultingCompany);
    expect(timeline.consultingCompanyLogoUrl).toBe(consultingCompanyLogoUrl);
    expect(timeline.consultingCompanyUrl).toBe(consultingCompanyUrl);
    expect(timeline.companyUrl).toBe(companyUrl);
    expect(timeline.description).toBe(description);
    expect(timeline.tags).toEqual(tags);
  });

  test("should create a Timeline instance with null consulting company properties", () => {
    const year = faker.date.past().getFullYear().toString();
    const title = faker.person.jobTitle();
    const company = faker.company.name();
    const logoUrl = faker.internet.url();
    const description = faker.lorem.paragraph();
    const tags = [faker.lorem.word(), faker.lorem.word()];

    const timeline = new Timeline(year, title, company, logoUrl, null, null, null, null, description, tags);

    expect(timeline.year).toBe(year);
    expect(timeline.title).toBe(title);
    expect(timeline.company).toBe(company);
    expect(timeline.companyLogoUrl).toBe(logoUrl);
    expect(timeline.consultingCompany).toBeNull();
    expect(timeline.consultingCompanyLogoUrl).toBeNull();
    expect(timeline.consultingCompanyUrl).toBeNull();
    expect(timeline.companyUrl).toBeNull();
    expect(timeline.description).toBe(description);
    expect(timeline.tags).toEqual(tags);
  });
});