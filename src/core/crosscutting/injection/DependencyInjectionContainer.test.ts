import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, test } from '@jest/globals';

import { DependencyInjectionContainer } from './DependencyInjectionContainer';

describe("DependencyInjectionContainer", () => {
  let container: DependencyInjectionContainer;

  beforeEach(() => {
    container = new DependencyInjectionContainer();
  });

  test("should register and resolve a dependency", () => {
    const dependencyKey = faker.lorem.word();
    const dependencyValue = faker.number.int();

    container.register(dependencyKey, () => ({ value: dependencyValue }));
    const resolvedInstance = container.resolve<{ value: number }>(dependencyKey);

    expect(resolvedInstance).toEqual({ value: dependencyValue });
  });

  test("should return the same instance for multiple resolves (singleton behavior)", () => {
    let instanceCreationCount = 0;
    const singletonKey = faker.lorem.word();
    const EXPECTED_INSTANCE_CREATION_COUNT = 1;

    container.register(singletonKey, () => {
      instanceCreationCount++;
      return { id: instanceCreationCount };
    });

    const firstInstance = container.resolve(singletonKey);
    const secondInstance = container.resolve(singletonKey);

    expect(firstInstance).toBe(secondInstance);
    expect(instanceCreationCount).toBe(EXPECTED_INSTANCE_CREATION_COUNT);
  });

  test("should throw error when resolving unregistered key", () => {
    const unregisteredKey = faker.lorem.word();
    const EXPECTED_ERROR_MESSAGE = `No factory found for key: ${unregisteredKey}`;

    expect(() => container.resolve(unregisteredKey)).toThrowError(EXPECTED_ERROR_MESSAGE);
  });

  test("should support multiple different keys", () => {
    const firstDependencyKey = faker.lorem.word();
    const secondDependencyKey = faker.lorem.word();
    const firstDependencyValue = faker.word.sample();
    const secondDependencyValue = faker.word.sample();

    container.register(firstDependencyKey, () => firstDependencyValue);
    container.register(secondDependencyKey, () => secondDependencyValue);

    expect(container.resolve(firstDependencyKey)).toBe(firstDependencyValue);
    expect(container.resolve(secondDependencyKey)).toBe(secondDependencyValue);
  });

  test("should resolve complex objects correctly", () => {
    const userDependencyKey = faker.lorem.word();
    const userDependencyValue = {
      name: faker.person.fullName(),
      age: faker.number.int(),
    };

    container.register(userDependencyKey, () => userDependencyValue);
    const resolvedUser = container.resolve<{ name: string; age: number }>(userDependencyKey);

    expect(resolvedUser).toEqual(userDependencyValue);
  });

  test("should clear instances correctly when clear() is called", () => {
    let instanceCreationCount = 0;
    const key = faker.lorem.word();
    const EXPECTED_FIRST_CREATION = 1;
    const EXPECTED_SECOND_CREATION = 2;

    container.register(key, () => {
      instanceCreationCount++;
      return { id: instanceCreationCount };
    });

    const firstInstance = container.resolve<{ id: number }>(key);
    expect(firstInstance.id).toBe(EXPECTED_FIRST_CREATION);

    container.clear();

    const secondInstance = container.resolve<{ id: number }>(key);
    expect(secondInstance.id).toBe(EXPECTED_SECOND_CREATION);
    expect(firstInstance).not.toBe(secondInstance);
  });
});