export abstract class AbstractFactory<T> {
  abstract make(input?: Partial<T>): T;

  makeMany(count: number, input?: Partial<T>): T[] {
    return Array.from({ length: count }, () => this.make(input));
  }
}
