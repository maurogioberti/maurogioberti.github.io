import { Profile } from "./Profile";
import { describe, test, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";

describe("Profile", () => {
  const INITIAL_EXPERIENCE_YEAR: number = 2014;
  
  test("should create a Profile instance with required properties", () => {
    const name = faker.person.firstName();
    const lastName = faker.person.lastName();
    const birthDate = faker.date.birthdate();
    const position = faker.person.jobTitle();
    const shortDescription = faker.lorem.sentence();
    const longDescription = faker.lorem.paragraph();
    const socials = {
      github: faker.internet.url(),
      twitter: faker.internet.url(),
    };

    const profile = new Profile(
      name,
      lastName,
      birthDate,
      position,
      [],
      shortDescription,
      longDescription,
      socials
    );

    expect(profile.name).toBe(name);
    expect(profile.lastName).toBe(lastName);
    expect(profile.birthDate).toBe(birthDate);
    expect(profile.position).toBe(position);
    expect(profile.shortDescription).toBe(shortDescription);
    expect(profile.longDescription).toBe(longDescription);
    expect(profile.socials).toEqual(socials);
    expect(profile.additionalPositions).toEqual([]);
    expect(profile.avatarUrl).toBeUndefined();
    expect(profile.email).toBeUndefined();
    expect(profile.location).toBeUndefined();
    expect(profile.skills).toEqual([]);
  });

  test("should create a Profile instance with all properties", () => {
    const name = faker.person.firstName();
    const lastName = faker.person.lastName();
    const birthDate = faker.date.birthdate();
    const position = faker.person.jobTitle();
    const additionalPositions = [faker.person.jobTitle(), faker.person.jobTitle()];
    const shortDescription = faker.lorem.sentence();
    const longDescription = faker.lorem.paragraph();
    const socials = {
      github: faker.internet.url(),
      twitter: faker.internet.url(),
    };
    const avatarUrl = faker.internet.url();
    const email = faker.internet.email();
    const location = {
      city: faker.location.city(),
      country: faker.location.country(),
      description: faker.lorem.sentence(),
    };
    const skills = [faker.hacker.verb(), faker.hacker.verb()];

    const profile = new Profile(
      name,
      lastName,
      birthDate,
      position,
      additionalPositions,
      shortDescription,
      longDescription,
      socials,
      avatarUrl,
      email,
      location,
      skills
    );

    expect(profile.name).toBe(name);
    expect(profile.lastName).toBe(lastName);
    expect(profile.birthDate).toBe(birthDate);
    expect(profile.position).toBe(position);
    expect(profile.additionalPositions).toEqual(additionalPositions);
    expect(profile.shortDescription).toBe(shortDescription);
    expect(profile.longDescription).toBe(longDescription);
    expect(profile.socials).toEqual(socials);
    expect(profile.avatarUrl).toBe(avatarUrl);
    expect(profile.email).toBe(email);
    expect(profile.location).toEqual(location);
    expect(profile.skills).toEqual(skills);
  });

  test("should calculate the age correctly", () => {
    const profile = new Profile(
      faker.person.firstName(),
      faker.person.lastName(),
      faker.date.birthdate(),
      faker.person.jobTitle(),
      [],
      "",
      "",
      {}
    );

    const expectedAge = new Date().getFullYear() - 1990 - 1; // Adjust for month/day
    expect(profile.age).toBeGreaterThanOrEqual(expectedAge);
  });

  test("should calculate the years of experience correctly", () => {
    const profile = new Profile(
      faker.person.firstName(),
      faker.person.lastName(),
      faker.date.birthdate(),
      faker.person.jobTitle(),
      [],
      "",
      "",
      {}
    );

    const expectedYears = new Date().getFullYear() - INITIAL_EXPERIENCE_YEAR;
    expect(profile.yearsOfExperience).toBe(expectedYears);
  });
  test("should return the full name", () => {
    const name = faker.person.firstName();
    const lastName = faker.person.lastName();
    const profile = new Profile(name, lastName, faker.date.birthdate(), faker.person.jobTitle(), [], "", "", {});
    expect(profile.fullname).toBe(`${name} ${lastName}`);
  });
  
  test("should return the correct social media URLs", () => {
    const socials = {
      github: faker.internet.url(),
      youtube: faker.internet.url(),
      twitter: faker.internet.url(),
      instagram: faker.internet.url(),
      linkedin: faker.internet.url(),
      website: faker.internet.url(),
    };
    const profile = new Profile(faker.person.firstName(), faker.person.lastName(), faker.date.birthdate(), faker.person.jobTitle(), [], "", "", socials);
    expect(profile.githubUrl).toBe(socials.github);
    expect(profile.youtubeUrl).toBe(socials.youtube);
    expect(profile.twitterUrl).toBe(socials.twitter);
    expect(profile.instagramUrl).toBe(socials.instagram);
    expect(profile.linkedinUrl).toBe(socials.linkedin);
    expect(profile.websiteUrl).toBe(socials.website);
  });
  
  test("should return undefined for missing social media URLs", () => {
    const socials = {};
    const profile = new Profile(faker.person.firstName(), faker.person.lastName(), faker.date.birthdate(), faker.person.jobTitle(), [], "", "", socials);
    expect(profile.githubUrl).toBeUndefined();
    expect(profile.youtubeUrl).toBeUndefined();
    expect(profile.twitterUrl).toBeUndefined();
    expect(profile.instagramUrl).toBeUndefined();
    expect(profile.linkedinUrl).toBeUndefined();
    expect(profile.websiteUrl).toBeUndefined();
  });
});