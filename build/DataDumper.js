import Vector from "./_snowpack/pkg/ol/source/Vector.js";
import VectorLayer from "./_snowpack/pkg/ol/layer/Vector.js";
import Fill from "./_snowpack/pkg/ol/style/Fill.js";
import Stroke from "./_snowpack/pkg/ol/style/Stroke.js";
import Circle from "./_snowpack/pkg/ol/style/Circle.js";
import Style from "./_snowpack/pkg/ol/style/Style.js";
import Point from "./_snowpack/pkg/ol/geom/Point.js";
import {Feature} from "./_snowpack/pkg/ol.js";
export class DataDumper {
  constructor(options) {
    this.options = options;
    const source = this.source = new Vector();
    const penLayer = new VectorLayer({source, visible: true});
    const fill = new Fill({color: "green"});
    const stroke = new Stroke({color: "white", width: 1});
    const circle = new Circle({radius: 3, stroke, fill});
    const style = new Style({image: circle});
    penLayer.setStyle(style);
    options.map.addLayer(penLayer);
  }
  transform(longitude, latitude) {
    const location = new Point([longitude, latitude]);
    const mapLocation = location.transform("EPSG:4326", "EPSG:3857");
    return mapLocation;
  }
  dump() {
    const today = new Date();
    const bod = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.options.storage.getPositions({start: bod, end: today}, (position) => {
      const {latitude, longitude, accuracy} = position;
      const mapLocation = this.transform(longitude, latitude);
      const feature = new Feature(mapLocation);
      this.source.addFeature(feature);
      return true;
    });
  }
}
