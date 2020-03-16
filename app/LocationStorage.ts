export class LocationStorage {
  private db: IDBDatabase | undefined;
  constructor(public storeName: string) {
    const connection = indexedDB.open("LocationStorage", 1);
    connection.onsuccess = ev => {
      const db = (this.db = connection.result);
    };
    connection.onerror = ev => { };
    connection.onupgradeneeded = ev => {
      const db = connection.result;
      db.createObjectStore(storeName);
    };
  }
  savePosition(position: Position) {
    if (!this.db)
      return;
    const store = this.db
      .transaction([this.storeName], "readwrite")
      .objectStore(this.storeName);
    const key = position.timestamp;
    const { latitude, longitude, accuracy, heading, altitude } = position.coords;
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
