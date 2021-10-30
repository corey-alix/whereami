import { LocationStorage } from "./LocationStorage.js";
import Vector from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Geometry from "ol/geom/Geometry";
import Map from "ol/Map";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";
import Style from "ol/style/Style";
import Point from "ol/geom/Point";
import { Feature } from "ol";

export class DataDumper {
  private source: Vector<Geometry>;
  constructor(private options: {
    map: Map;
    storage: LocationStorage;
  }) {
    const source = (this.source = new Vector());
    const penLayer = new VectorLayer({ source: source, visible: true });
    const fill = new Fill({ color: "green" });
    const stroke = new Stroke({ color: "white", width: 1 });
    const circle = new Circle({ radius: 3, stroke, fill });
    const style = new Style({ image: circle });
    penLayer.setStyle(style);
    options.map.addLayer(penLayer);
  }
  private transform(longitude: number, latitude: number) {
    const location = new Point([longitude, latitude]);
    const mapLocation = location.transform("EPSG:4326", "EPSG:3857") as Point;
    return mapLocation;
  }
  dump() {
    const today = new Date();
    const bod = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.options.storage.getPositions({ start: bod, end: today }, position => {
      const { latitude, longitude, accuracy } = position;
      const mapLocation = this.transform(longitude, latitude);
      const feature = new Feature(mapLocation);
      this.source.addFeature(feature);
      return true;
    });
  }
}
