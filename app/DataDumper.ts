import { LocationStorage } from "./LocationStorage.js";
export const ol = globalThis.ol;

export class DataDumper {
  private source: ol.source.Vector;
  constructor(private options: {
    map: ol.Map;
    storage: LocationStorage;
  }) {
    const source = (this.source = new ol.source.Vector());
    const penLayer = new ol.layer.Vector({ source: source, visible: true });
    const fill = new ol.style.Fill({ color: "green" });
    const stroke = new ol.style.Stroke({ color: "white", width: 1 });
    const circle = new ol.style.Circle({ radius: 3, stroke, fill });
    const style = new ol.style.Style({ image: circle });
    penLayer.setStyle(style);
    options.map.addLayer(penLayer);
  }
  private transform(longitude: number, latitude: number) {
    const location = new ol.geom.Point([longitude, latitude]);
    const mapLocation = location.transform("EPSG:4326", "EPSG:3857") as ol.geom.Point;
    return mapLocation;
  }
  dump() {
    const today = new Date();
    const bod = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.options.storage.getPositions({ start: bod, end: today }, position => {
      const { latitude, longitude, accuracy } = position;
      const mapLocation = this.transform(longitude, latitude);
      const feature = new ol.Feature(mapLocation);
      this.source.addFeature(feature);
      return true;
    });
  }
}
