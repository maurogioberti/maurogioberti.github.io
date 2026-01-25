import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { Profile } from '@/core/domain/model/Profile';
import { Service } from '@/core/domain/model/Service';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { serviceViewModel } from './serviceViewModel';

describe("serviceViewModel", () => {
  const NUMBER_OF_SERVICES = 5;
  const ERROR_MESSAGE = "Error fetching services";
  
  const generatePhoneWithHyphens = () => `+1-${faker.string.numeric(3)}-${faker.string.numeric(3)}-${faker.string.numeric(4)}`;

  let mockServices: Service[];
  let mockProfile: Profile;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(container, "resolve");

    mockServices = Array.from({ length: NUMBER_OF_SERVICES }, () => new Service(faker.lorem.word(), faker.lorem.sentences(), faker.datatype.boolean()));
    
    mockProfile = new Profile(
      faker.person.firstName(),
      faker.person.lastName(),
      faker.date.past(),
      faker.person.jobTitle(),
      [faker.person.jobTitle()],
      faker.lorem.sentence(),
      faker.lorem.paragraph(),
      faker.lorem.sentence(),
      {
        linkedin: faker.internet.url(),
        github: faker.internet.url(),
      },
      faker.image.avatar(),
      faker.internet.email(),
      faker.phone.number(),
      { city: faker.location.city(), country: faker.location.country(), description: faker.lorem.sentence() },
      [faker.lorem.word(), faker.lorem.word()]
    );
  });

  test("should return services and profile", async () => {
    const mockGetServicesExecute = jest.fn<() => Promise<Service[]>>().mockResolvedValue(mockServices);
    const mockGetServicesUseCase = { execute: mockGetServicesExecute };
    
    const mockGetProfileExecute = jest.fn<() => Promise<Profile>>().mockResolvedValue(mockProfile);
    const mockGetProfileUseCase = { execute: mockGetProfileExecute };

    (container.resolve as jest.Mock)
      .mockImplementationOnce(() => mockGetServicesUseCase)
      .mockImplementationOnce(() => mockGetProfileUseCase);

    const result = await serviceViewModel();

    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_SERVICES);
    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_PROFILE);
    expect(mockGetServicesExecute).toHaveBeenCalled();
    expect(mockGetProfileExecute).toHaveBeenCalled();
    expect(result).toEqual({ services: mockServices, profile: mockProfile });

    result.services.forEach((service, index) => {
      expect(service.title).toBe(mockServices[index].title);
      expect(service.content).toBe(mockServices[index].content);
      expect(service.available).toBe(mockServices[index].available);
    });
    
    expect(result.profile).toBe(mockProfile);
  });

  test("should handle errors from GetServicesUseCase", async () => {
    const mockGetServicesExecute = jest.fn<() => Promise<never>>().mockRejectedValue(new Error(ERROR_MESSAGE));
    const mockGetServicesUseCase = { execute: mockGetServicesExecute };
    
    const mockGetProfileExecute = jest.fn<() => Promise<Profile>>().mockResolvedValue(mockProfile);
    const mockGetProfileUseCase = { execute: mockGetProfileExecute };

    (container.resolve as jest.Mock)
      .mockImplementationOnce(() => mockGetServicesUseCase)
      .mockImplementationOnce(() => mockGetProfileUseCase);

    await expect(serviceViewModel()).rejects.toThrow(ERROR_MESSAGE);

    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_SERVICES);
    expect(mockGetServicesExecute).toHaveBeenCalled();
  });
  
  test("should handle errors from GetProfileUseCase", async () => {
    const mockGetServicesExecute = jest.fn<() => Promise<Service[]>>().mockResolvedValue(mockServices);
    const mockGetServicesUseCase = { execute: mockGetServicesExecute };
    
    const mockGetProfileExecute = jest.fn<() => Promise<never>>().mockRejectedValue(new Error(ERROR_MESSAGE));
    const mockGetProfileUseCase = { execute: mockGetProfileExecute };

    (container.resolve as jest.Mock)
      .mockImplementationOnce(() => mockGetServicesUseCase)
      .mockImplementationOnce(() => mockGetProfileUseCase);

    await expect(serviceViewModel()).rejects.toThrow(ERROR_MESSAGE);

    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_SERVICES);
    expect(container.resolve).toHaveBeenCalledWith(DependencyIdentifiers.USE_CASES.GET_PROFILE);
    expect(mockGetServicesExecute).toHaveBeenCalled();
    expect(mockGetProfileExecute).toHaveBeenCalled();
  });
  
  test("should render phone number from profile in contact section", async () => {
    const phoneNumber = generatePhoneWithHyphens();
    const profileWithPhone = new Profile(
      faker.person.firstName(),
      faker.person.lastName(),
      faker.date.birthdate(),
      faker.person.jobTitle(),
      [faker.person.jobTitle(), faker.person.jobTitle()],
      faker.lorem.sentence(),
      faker.lorem.paragraph(),
      faker.lorem.sentence(),
      { linkedin: faker.internet.url() },
      faker.image.avatar(),
      faker.internet.email(),
      phoneNumber,
      { city: faker.location.city(), country: faker.location.country(), description: faker.lorem.sentence() },
      [faker.lorem.word(), faker.lorem.word()]
    );
    
    const mockGetServicesExecute = jest.fn<() => Promise<Service[]>>().mockResolvedValue(mockServices);
    const mockGetServicesUseCase = { execute: mockGetServicesExecute };
    
    const mockGetProfileExecute = jest.fn<() => Promise<Profile>>().mockResolvedValue(profileWithPhone);
    const mockGetProfileUseCase = { execute: mockGetProfileExecute };

    (container.resolve as jest.Mock)
      .mockImplementationOnce(() => mockGetServicesUseCase)
      .mockImplementationOnce(() => mockGetProfileUseCase);

    const result = await serviceViewModel();

    expect(result.profile.phone).toBe(phoneNumber);
    const expectedTelLink = phoneNumber.replace(/[^+\d]/g, '');
    const expectedWhatsApp = expectedTelLink.startsWith('+') ? expectedTelLink.substring(1) : expectedTelLink;
    expect(result.profile.phoneInternational).toBe(expectedTelLink);
    expect(result.profile.phoneWhatsApp).toBe(expectedWhatsApp);
  });
});