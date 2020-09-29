import EventEmitter from 'events';

class Pool extends EventEmitter {
  maxSize = Number.MAX_SAFE_INTEGER;
  static events = {
    ADD: 'ADD',
    FULL: 'FULL',
    FLUSH: 'FLUSH'
  };
  set = new Set();

  constructor(config = {}) {
    super();

    let { maxSize } = config;

    if (maxSize !== undefined) {
      this.maxSize = maxSize;
    }
  }

  get size() {
    return this.set.size;
  }

  isEmpty() {
    return this.set.size === 0;
  }

  isFull() {
    return this.set.size === this.maxSize;
  }

  add(item) {
    if (this.set.size < this.maxSize) {
      this.set.add(item);
      this.emit(Pool.events.ADD, item);
    }

    if (this.isFull()) {
      this.emit(Pool.events.FULL);
    }
  }

  flush() {
    let items = Array.from(this.set);
    this.set.clear();
    this.emit(Pool.events.FLUSH, items);

    return items;
  }

  onFull(callback) {
    this.on(Pool.events.FULL, callback);
  }
}

export default Pool;
