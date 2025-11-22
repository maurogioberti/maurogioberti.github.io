import { Profile } from '@/core/domain/model/Profile';
import { ProfileRepository } from '@/core/domain/repository/ProfileRepository';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { GetProfileUseCase } from './get-profile-content-use-case';

describe("GetProfileUseCase", () => {
  let mockRepository: jest.Mocked<ProfileRepository>;
  let useCase: GetProfileUseCase;
  let mockProfile: Profile;

  const ERROR_MESSAGE = "Repository error";
  const EXPECT_ONE_CALL = 1;

  beforeEach(() => {
    mockProfile = new Profile(
      faker.person.firstName(),
      faker.person.lastName(),
      faker.date.birthdate(),
      faker.person.jobTitle(),
      ["Developer", "Mentor"],
      faker.lorem.sentence(),
      faker.lorem.paragraph(),
      faker.lorem.sentence(),
      { github: faker.internet.url(), linkedin: faker.internet.url() },
      faker.internet.url(),
      faker.internet.email(),
      { city: faker.location.city(), country: faker.location.country(), description: faker.lorem.sentence() },
      ["React", "Node.js", "TypeScript"]
    );

    mockRepository = {
      getProfile: jest.fn<() => Promise<Profile>>().mockResolvedValue(mockProfile),
    } as jest.Mocked<ProfileRepository>;

    useCase = new GetProfileUseCase(mockRepository);
  });

  test("execute should return profile", async () => {
    const result = await useCase.execute();

    expect(result).toStrictEqual(mockProfile);
    expect(mockRepository.getProfile).toHaveBeenCalledTimes(EXPECT_ONE_CALL);
    
    expect(result.fullname).toBe(mockProfile.fullname);
    expect(result.age).toBe(mockProfile.age);
    expect(result.githubUrl).toBe(mockProfile.githubUrl);
    expect(result.linkedinUrl).toBe(mockProfile.linkedinUrl);
    expect(result.skills).toEqual(mockProfile.skills);
    expect(result.shortDescription).toBe(mockProfile.shortDescription);
  });

  test("execute should handle repository errors", async () => {
    mockRepository.getProfile.mockRejectedValueOnce(new Error(ERROR_MESSAGE));

    await expect(useCase.execute()).rejects.toThrow(ERROR_MESSAGE);
    expect(mockRepository.getProfile).toHaveBeenCalledTimes(EXPECT_ONE_CALL);
  });
});