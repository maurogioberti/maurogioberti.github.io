import fs from 'fs';
import path from 'path';

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

  async fetchContent<T>(folderPath: string): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      try {
        const absoluteFolderPath = path.resolve(process.cwd(), `src/data/${folderPath}`);
        const files = fs.readdirSync(absoluteFolderPath);
        const data: T[] = [];

        for (const file of files) {
          if (file.endsWith('.json')) {
            const fileContent = JSON.parse(
              fs.readFileSync(path.join(absoluteFolderPath, file), 'utf-8')
            );
            data.push(fileContent);
          }
        }
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }
}