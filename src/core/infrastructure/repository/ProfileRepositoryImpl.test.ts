import { ProfileRepositoryImpl } from "./ProfileRepositoryImpl";
import { ProfileService } from "../../domain/services/ProfileService";
import { Profile } from "../../domain/model/Profile";
import { describe, test, expect, jest } from "@jest/globals";
import { faker } from "@faker-js/faker";

describe("ProfileRepositoryImpl", () => {
  const EXPECTED_CALL_COUNT = 1;

  test("should return a profile fetched by the service", async () => {
    const mockProfile = new Profile(
      faker.person.firstName(),
      faker.person.lastName(),
      faker.person.jobTitle(),
      [],
      faker.lorem.sentence(),
      faker.lorem.paragraph(),
      { github: faker.internet.url() }
    );

    const mockProfileService: ProfileService = {
      fetchProfile: jest.fn<() => Promise<Profile>>().mockResolvedValue(mockProfile),
    };

    const repository = new ProfileRepositoryImpl(mockProfileService);
    const result = await repository.getProfile();

    expect(result).toBe(mockProfile);
    expect(mockProfileService.fetchProfile).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT);
  });
});