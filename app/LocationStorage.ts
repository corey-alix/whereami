type CursorEvent = {};
export class LocationStorage {
  getPositions(
    filter: { start: Date; end: Date },
    cb: (data: Coordinates) => boolean
  ) {
    if (!this.db) return;
    const transaction = this.db.transaction([this.storeName], "readonly");
    const store = transaction.objectStore(this.storeName);
    const cursor = store.openCursor(
      IDBKeyRange.bound(filter.start.valueOf(), filter.end.valueOf())
    );
    cursor.onerror = err => {
      console.error(err);
    };

    cursor.onsuccess = (event: CursorEvent) => {
      const result = cursor.result;
      if (result && false !== cb(result.value as Coordinates))
        result.continue();
    };
  }

  private db: IDBDatabase | undefined;
  constructor(public storeName: string) {}

  public async init() {
    return new Promise<IDBDatabase>((good, bad) => {
      const connection = indexedDB.open("LocationStorage", 1);
      connection.onsuccess = ev => {
        const db = (this.db = connection.result);
        good(db);
      };
      connection.onerror = err => {
        bad(err);
      };
      connection.onupgradeneeded = ev => {
        const db = connection.result;
        db.createObjectStore(this.storeName);
      };
    });
  }

  savePosition(position: Position) {
    if (!this.db) return;
    const store = this.db
      .transaction([this.storeName], "readwrite")
      .objectStore(this.storeName);
    const key = position.timestamp;
    const {
      latitude,
      longitude,
      accuracy,
      heading,
      altitude
    } = position.coords;
    const data = {
      latitude,
      longitude,
      accuracy,
      heading,
      altitude
    };
    store.add(data, key);
  }
}
