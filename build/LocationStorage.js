export class LocationStorage {
  constructor(storeName) {
    this.storeName = storeName;
  }
  getPositions(filter, cb) {
    if (!this.db)
      return;
    const transaction = this.db.transaction([this.storeName], "readonly");
    const store = transaction.objectStore(this.storeName);
    const cursor = store.openCursor(IDBKeyRange.bound(filter.start.valueOf(), filter.end.valueOf()));
    cursor.onerror = (err) => {
      console.error(err);
    };
    cursor.onsuccess = (event) => {
      const result = cursor.result;
      if (result && cb(result.value) !== false)
        result.continue();
    };
  }
  async init() {
    return new Promise((good, bad) => {
      const connection = indexedDB.open("LocationStorage", 1);
      connection.onsuccess = (ev) => {
        const db = this.db = connection.result;
        good(db);
      };
      connection.onerror = (err) => {
        bad(err);
      };
      connection.onupgradeneeded = (ev) => {
        const db = connection.result;
        db.createObjectStore(this.storeName);
      };
    });
  }
  savePosition(position) {
    if (!this.db)
      return;
    const store = this.db.transaction([this.storeName], "readwrite").objectStore(this.storeName);
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
