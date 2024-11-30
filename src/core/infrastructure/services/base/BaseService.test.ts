import { BaseService } from "./BaseService";
import { describe, test, expect } from "@jest/globals";

describe("BaseService", () => {
  test("getInterface should return the interface name by removing 'Impl' suffix from the class name", () => {
    class TestServiceImpl extends BaseService {}
    const result = TestServiceImpl.getInterface();
    const expectedInterfaceName = "TestService";
    expect(result).toBe(expectedInterfaceName);
  });

  test("getInterface should return the same name if 'Impl' suffix is not present", () => {
    class TestService extends BaseService {}
    const result = TestService.getInterface();
    const expectedInterfaceName = "TestService";
    expect(result).toBe(expectedInterfaceName);
  });
});