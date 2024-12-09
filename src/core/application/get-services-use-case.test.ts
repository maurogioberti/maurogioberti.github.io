import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { Service } from '../domain/model/Service';
import { ServiceRepository } from '../domain/repository/ServiceRepository';
import { GetServicesUseCase } from './get-services-use-case';

describe("GetServicesUseCase", () => {
  let mockRepository: jest.Mocked<ServiceRepository>;
  let useCase: GetServicesUseCase;
  let mockServices: Service[];

  const ERROR_MESSAGE = "Repository error";
  const EXPECT_ONE_CALL = 1;

  beforeEach(() => {
    mockServices = [
      new Service(faker.lorem.word(), faker.lorem.sentences(), faker.datatype.boolean()),
      new Service(faker.lorem.word(), faker.lorem.sentences(), faker.datatype.boolean()),
    ];

    mockRepository = {
      getServices: jest.fn<() => Promise<Service[]>>().mockResolvedValue(mockServices),
    } as jest.Mocked<ServiceRepository>;

    useCase = new GetServicesUseCase(mockRepository);
  });

  test("execute should return services", async () => {
    const result = await useCase.execute();

    expect(result).toStrictEqual(mockServices);
    expect(mockRepository.getServices).toHaveBeenCalledTimes(1);

    result.forEach((service, index) => {
      expect(service.title).toBe(mockServices[index].title);
      expect(service.available).toBe(mockServices[index].available);
    });
  });

  test("execute should handle repository errors", async () => {
    mockRepository.getServices.mockRejectedValueOnce(new Error(ERROR_MESSAGE));
    await expect(useCase.execute()).rejects.toThrow(ERROR_MESSAGE);
    expect(mockRepository.getServices).toHaveBeenCalledTimes(EXPECT_ONE_CALL);
  });
});