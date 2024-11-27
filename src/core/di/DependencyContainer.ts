export class DependencyContainer {
  private factories = new Map<string, () => unknown>();
  private instances = new Map<string, unknown>();

  register<T>(key: string, factory: () => T): void {
    this.factories.set(key, factory);
  }

  resolve<T>(key: string): T {
    if (!this.instances.has(key)) {
      const factory = this.factories.get(key) as (() => T) | undefined;
      if (!factory) {
        throw new Error(`No factory found for key: ${key}`);
      }
      const instance = factory();
      this.instances.set(key, instance);
    }
    return this.instances.get(key) as T;
  }
}

export const container = new DependencyContainer();