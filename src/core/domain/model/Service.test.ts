import { faker } from '@faker-js/faker';
import { describe, expect, test } from '@jest/globals';

import { Service } from './Service';

describe("Service", () => {
  const title = faker.lorem.word();
  const content = faker.lorem.sentences();
  const available = faker.datatype.boolean();

  test("should create a Service instance with all properties", () => {
    const service = new Service(title, content, available);

    expect(service.title).toBe(title);
    expect(service.content).toBe(content);
    expect(service.available).toBe(available);
  });

  test("should update the title property", () => {
    const service = new Service(title, content, available);
    const newTitle = faker.lorem.word();

    service.title = newTitle;
    expect(service.title).toBe(newTitle);
  });

  test("should update the content property", () => {
    const service = new Service(title, content, available);
    const newContent = faker.lorem.sentences();

    service.content = newContent;
    expect(service.content).toBe(newContent);
  });

  test("should update the available property", () => {
    const service = new Service(title, content, available);
    const newAvailable = !available;

    service.available = newAvailable;
    expect(service.available).toBe(newAvailable);
  });
});