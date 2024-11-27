export class DependencyContainer {
    private factories = new Map<string, () => any>();
    private instances = new Map<string, any>();
  
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
      return this.instances.get(key);
    }
  }
  
  export const container = new DependencyContainer();  