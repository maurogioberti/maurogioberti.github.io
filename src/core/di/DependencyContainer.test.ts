import { DependencyContainer } from "./DependencyContainer";
import { describe, test, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";

describe("DependencyContainer", () => {
  test("should register and resolve a dependency", () => {
    const container = new DependencyContainer();
    const testKey = faker.lorem.word();
    const testValue = faker.number.int();
    container.register(testKey, () => ({ value: testValue }));
    const instance = container.resolve<{ value: number }>(testKey);
    expect(instance).toEqual({ value: testValue });
  });

  test("should return the same instance for multiple resolves", () => {
    const container = new DependencyContainer();
    let instanceCount = 0;
    const singletonKey = faker.lorem.word();
    container.register(singletonKey, () => {
      instanceCount++;
      return { id: instanceCount };
    });
    const instance1 = container.resolve(singletonKey);
    const instance2 = container.resolve(singletonKey);
    expect(instance1).toBe(instance2);
    expect(instanceCount).toBe(1);
  });

  test("should throw error when resolving unregistered key", () => {
    const container = new DependencyContainer();
    const nonExistentKey = faker.lorem.word();
    expect(() => container.resolve(nonExistentKey)).toThrowError(
      `No factory found for key: ${nonExistentKey}`
    );
  });

  test("should support multiple different keys", () => {
    const container = new DependencyContainer();
    const key1 = faker.lorem.word();
    const key2 = faker.lorem.word();
    const value1 = faker.word.sample();
    const value2 = faker.word.sample();
    container.register(key1, () => value1);
    container.register(key2, () => value2);
    expect(container.resolve(key1)).toBe(value1);
    expect(container.resolve(key2)).toBe(value2);
  });
});
