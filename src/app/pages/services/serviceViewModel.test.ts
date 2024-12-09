import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { Service } from '@/core/domain/model/Service';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { serviceViewModel } from './serviceViewModel';

describe("serviceViewModel", () => {
  const NUMBER_OF_SERVICES = 5;
  const ERROR_MESSAGE = "Error fetching services";

  let mockServices: Service[];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(container, "resolve");

    mockServices = Array.from({ length: NUMBER_OF_SERVICES }, () => new Service(faker.lorem.word(), faker.lorem.sentences(), faker.datatype.boolean()));
  });

  test("should return services", async () => {
    const mockGetServicesExecute = jest.fn<() => Promise<Service[]>>().mockResolvedValue(mockServices);
    const mockGetServicesUseCase = { execute: mockGetServicesExecute };

    (container.resolve as jest.Mock).mockImplementationOnce(() => mockGetServicesUseCase);

    const result = await serviceViewModel();

    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_SERVICES);
    expect(mockGetServicesExecute).toHaveBeenCalled();
    expect(result).toEqual({ services: mockServices });

    result.services.forEach((service, index) => {
      expect(service.title).toBe(mockServices[index].title);
      expect(service.content).toBe(mockServices[index].content);
      expect(service.available).toBe(mockServices[index].available);
    });
  });

  test("should handle errors from GetServicesUseCase", async () => {
    const mockGetServicesExecute = jest.fn<() => Promise<never>>().mockRejectedValue(new Error(ERROR_MESSAGE));
    const mockGetServicesUseCase = { execute: mockGetServicesExecute };

    (container.resolve as jest.Mock).mockImplementationOnce(() => mockGetServicesUseCase);

    await expect(serviceViewModel()).rejects.toThrow(ERROR_MESSAGE);

    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_SERVICES);
    expect(mockGetServicesExecute).toHaveBeenCalled();
  });
});