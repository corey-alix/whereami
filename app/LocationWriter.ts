import { Position } from "./Coordinates.js";
import { log } from "./fun/log.js";
import { LocationStorage } from "./LocationStorage.js";

export class LocationWriter {
  currentPosition: Position | undefined;
  private bestAccuracy: number | null = null;

  constructor(
    private options: {
      storage: LocationStorage;
    }
  ) { }

  start() {
    navigator.geolocation.watchPosition(position => {
      log(JSON.stringify(position));
      const accuracy = position.coords.accuracy;
      this.bestAccuracy = Math.min(this.bestAccuracy || accuracy, accuracy);
      log(`bestAccuracy: ${this.bestAccuracy}`);
      this.savePosition(position);
      this.currentPosition = position;
    });

  }

  savePosition(position: Position) {
    this.options.storage.savePosition(position);
  }
}
