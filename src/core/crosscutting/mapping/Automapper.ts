export class Automapper {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  static map<T>(data: any, Model: new (...args: any[]) => T): T {
    return new Model(...Object.values(data));
  }
}