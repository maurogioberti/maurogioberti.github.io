import { faker } from '@faker-js/faker';
import { describe, expect, jest, test } from '@jest/globals';

import { Profile } from '../../domain/model/Profile';
import { ProfileService } from '../../domain/services/ProfileService';
import { ProfileRepositoryImpl } from './ProfileRepositoryImpl';

describe("ProfileRepositoryImpl", () => {
  const EXPECTED_CALL_COUNT = 1;

  test("should return a profile fetched by the service", async () => {
    const mockProfile = new Profile(
      faker.person.firstName(),
      faker.person.lastName(),
      faker.date.birthdate(),
      faker.person.jobTitle(),
      [],
      faker.lorem.sentence(),
      faker.lorem.paragraph(),
      faker.lorem.sentence(),
      { github: faker.internet.url() }
    );

    const mockProfileService: ProfileService = {
      fetchProfile: jest.fn<() => Promise<Profile>>().mockResolvedValue(mockProfile),
    };

    const repository = new ProfileRepositoryImpl(mockProfileService);
    const result = await repository.getProfile();

    expect(result).toStrictEqual(mockProfile);
    expect(mockProfileService.fetchProfile).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT);
  });
});