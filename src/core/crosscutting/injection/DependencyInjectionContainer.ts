export class DependencyInjectionContainer {
  private instances = new Map<string, unknown>();
  private factories = new Map<string, () => unknown>();

  register<T>(key: string, factory: () => T): void {
    this.factories.set(key, factory);
  }

  resolve<T>(key: string): T {
    if (!this.instances.has(key)) {
      const factory = this.factories.get(key);
      if (!factory) {
        throw new Error(`No factory found for key: ${key}`);
      }
      const instance = factory();
      this.instances.set(key, instance);
    }
    return this.instances.get(key) as T;
  }

  clear(): void {
    this.instances.clear();
  }
}

const globalForDI = globalThis as unknown as {
  __diContainer?: DependencyInjectionContainer;
};

export const container =
  globalForDI.__diContainer ?? new DependencyInjectionContainer();

if (!globalForDI.__diContainer) {
  globalForDI.__diContainer = container;
}