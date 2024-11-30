export abstract class BaseService {
  private static readonly serviceImplementationPattern = "Impl";

  static getInterface(): string {
    return this.name.replace(this.serviceImplementationPattern, "");
  }

  async fetchData<T>(fileName: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const data = await import(`@/data/${fileName}`);
          resolve(data.default as T);
        } catch (error) {
          reject(error);
        }
      }, 10);
    });
  }
}