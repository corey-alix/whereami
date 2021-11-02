import { Map, Feature } from "ol";
import Geometry from "ol/geom/Geometry";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import Vector from "ol/source/Vector";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { Position } from "./Coordinates.js";
import { getDateRange } from "./fun/getDateRange.js";
import { log } from "./fun/log.js";
import { LocationStorage } from "./LocationStorage.js";

type Location = { latitude: number; longitude: number };

export class LocationViewer {
  private source: Vector<Geometry>;
  private activeFeature: Feature<Geometry>;
  currentPosition: Position | undefined;
  currentOrientation: number | null = null;
  private bestAccuracy: number | null = null;
  private lastLocation: Point | null = null;

  constructor(
    private options: {
      map: Map;
      storage: LocationStorage;
    }
  ) {
    const source = (this.source = new Vector<Geometry>());
    const penLayer = new VectorLayer({ source: source, visible: true });
    options.map.addLayer(penLayer);
    this.activeFeature = new Feature<Geometry>();
    const fill = new Fill({ color: "red" });
    const stroke = new Stroke({ color: "white", width: 1 });
    const circle = new Circle({ radius: 10, stroke, fill });
    const style = new Style({ image: circle });
    this.activeFeature.setStyle(style);
    this.source.addFeature(this.activeFeature);
  }

  start() {
    window.addEventListener(
      "deviceorientationabsolute",
      event => {
        const { absolute, alpha, beta, gamma } = <DeviceOrientationEvent>event;
        console.log(absolute, alpha, beta, gamma);
        if (!absolute) return;

        if (null === alpha) return;
        // alpha is rotation around z-axis, when looking down at device
        // beta is font to back motion, not useful for map
        // gamma is left to right motion, perfect for map
        this.currentOrientation = (alpha * Math.PI) / 180;
        this.options.map.getView().setRotation(this.currentOrientation);
      },
      true
    );

    const dateRange = getDateRange();
    this.options.storage.getPositions({ start: dateRange.bod, end: dateRange.eod }, data => {
      log(JSON.stringify(data));
      const { latitude, longitude } = data;
      this.plotPosition({ latitude, longitude });
      return false;
    });
  }

  recenterMap() {
    if (!this.lastLocation) return;
    const center = this.lastLocation.getFirstCoordinate();
    const view = this.options.map.getView();
    view.setCenter(center);
  }

  plotPosition(position: Location): void {
    const { latitude, longitude } = position;
    const mapLocation = this.transform(longitude, latitude);

    if (!this.lastLocation) {
      this.lastLocation = mapLocation;
      this.recenterMap();
    }
    this.lastLocation = mapLocation;


    const feature = new Feature(mapLocation);
    this.source.addFeature(feature);
    this.activeFeature.setGeometry(feature.getGeometry());
    this.source.removeFeature(this.activeFeature);
    this.source.addFeature(this.activeFeature);
  }

  private transform(longitude: number, latitude: number) {
    const location = new Point([longitude, latitude]);
    const mapLocation = location.transform(
      "EPSG:4326",
      "EPSG:3857"
    ) as Point;
    return mapLocation;
  }

  savePosition(position: Position) {
    this.options.storage.savePosition(position);
  }
}
