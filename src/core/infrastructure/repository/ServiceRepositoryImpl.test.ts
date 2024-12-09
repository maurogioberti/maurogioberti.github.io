import { Service } from '@/core/domain/model/Service';
import { ServiceService } from '@/core/domain/services/ServiceService';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { ServiceRepositoryImpl } from './ServiceRepositoryImpl';

describe("ServiceRepositoryImpl", () => {
  let serviceService: jest.Mocked<ServiceService>;
  let serviceRepository: ServiceRepositoryImpl;

  const ERROR_MESSAGE = "Service error";
  const FETCH_SERVICES_CALL_COUNT = 1;
  const MOCK_SERVICES_COUNT = 2;

  const mockServices: Service[] = Array.from({ length: MOCK_SERVICES_COUNT }, () => new Service(faker.lorem.word(), faker.lorem.paragraph(), faker.datatype.boolean()));

  beforeEach(() => {
    serviceService = {
      fetchServices: jest.fn(),
    } as jest.Mocked<ServiceService>;

    serviceRepository = new ServiceRepositoryImpl(serviceService);
  });

  test("getServices should return services", async () => {
    serviceService.fetchServices.mockResolvedValue(mockServices);

    const result = await serviceRepository.getServices();

    expect(result).toHaveLength(mockServices.length);
    expect(result).toEqual(mockServices);
    result.forEach((service, index) => {
      expect(service.title).toBe(mockServices[index].title);
      expect(service.content).toBe(mockServices[index].content);
      expect(service.available).toBe(mockServices[index].available);
    });
    expect(serviceService.fetchServices).toHaveBeenCalledTimes(1);
  });

  test("getServices should handle service errors", async () => {
    serviceService.fetchServices.mockRejectedValueOnce(new Error(ERROR_MESSAGE));

    await expect(serviceRepository.getServices()).rejects.toThrow(ERROR_MESSAGE);
    expect(serviceService.fetchServices).toHaveBeenCalledTimes(FETCH_SERVICES_CALL_COUNT);
  });
});
