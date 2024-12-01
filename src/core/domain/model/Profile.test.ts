import { Profile } from "./Profile";
import { describe, test, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";

describe("Profile", () => {
  test("should create a Profile instance with required properties", () => {
    const name = faker.name.firstName();
    const lastName = faker.name.lastName();
    const position = faker.name.jobTitle();
    const shortDescription = faker.lorem.sentence();
    const longDescription = faker.lorem.paragraph();
    const socials = {
      github: faker.internet.url(),
      twitter: faker.internet.url(),
    };

    const profile = new Profile(
      name,
      lastName,
      position,
      [],
      shortDescription,
      longDescription,
      socials
    );

    expect(profile.name).toBe(name);
    expect(profile.lastName).toBe(lastName);
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
    const name = faker.name.firstName();
    const lastName = faker.name.lastName();
    const position = faker.name.jobTitle();
    const additionalPositions = [faker.name.jobTitle(), faker.name.jobTitle()];
    const shortDescription = faker.lorem.sentence();
    const longDescription = faker.lorem.paragraph();
    const socials = {
      github: faker.internet.url(),
      twitter: faker.internet.url(),
    };
    const avatarUrl = faker.internet.url();
    const email = faker.internet.email();
    const location = {
      city: faker.address.city(),
      country: faker.address.country(),
      description: faker.lorem.sentence(),
    };
    const skills = [faker.hacker.verb(), faker.hacker.verb()];

    const profile = new Profile(
      name,
      lastName,
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
});