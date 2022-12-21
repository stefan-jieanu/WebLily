export class Queue<T> {
  private storage: T[] = [];
  private capacity = Infinity;

  public constructor(capacity = Infinity) {
    this.capacity = Infinity;
  }

  public enqueue(item: T): void {
    if (this.size() === this.capacity) throw Error('Queue overflow');
    this.storage.push(item);
  }

  public dequeue(): T | undefined {
    return this.storage.shift();
  }

  public size(): number {
    return this.storage.length;
  }
}
