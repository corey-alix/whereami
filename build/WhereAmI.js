import {Feature} from "./_snowpack/pkg/ol.js";
import Point from "./_snowpack/pkg/ol/geom/Point.js";
import VectorLayer from "./_snowpack/pkg/ol/layer/Vector.js";
import Vector from "./_snowpack/pkg/ol/source/Vector.js";
import Circle from "./_snowpack/pkg/ol/style/Circle.js";
import Fill from "./_snowpack/pkg/ol/style/Fill.js";
import Stroke from "./_snowpack/pkg/ol/style/Stroke.js";
import Style from "./_snowpack/pkg/ol/style/Style.js";
export class WhereAmI {
  constructor(options) {
    this.options = options;
    this.currentOrientation = null;
    this.bestAccuracy = null;
    this.lastLocation = null;
    const source = this.source = new Vector();
    const penLayer = new VectorLayer({source, visible: true});
    options.map.addLayer(penLayer);
    this.activeFeature = new Feature();
    const fill = new Fill({color: "red"});
    const stroke = new Stroke({color: "white", width: 1});
    const circle = new Circle({radius: 10, stroke, fill});
    const style = new Style({image: circle});
    this.activeFeature.setStyle(style);
    this.source.addFeature(this.activeFeature);
  }
  start() {
    navigator.geolocation.watchPosition((position) => {
      const accuracy = position.coords.accuracy;
      if (this.bestAccuracy !== null && accuracy > 2 * this.bestAccuracy)
        return;
      this.bestAccuracy = Math.min(this.bestAccuracy || accuracy, accuracy);
      this.plotPosition(position);
      this.savePosition(position);
      this.currentPosition = position;
    });
    window.addEventListener("deviceorientationabsolute", (event) => {
      const {absolute, alpha, beta, gamma} = event;
      console.log(absolute, alpha, beta, gamma);
      if (!absolute)
        return;
      if (alpha === null)
        return;
      this.currentOrientation = alpha * Math.PI / 180;
      this.options.map.getView().setRotation(this.currentOrientation);
    }, true);
  }
  recenterMap() {
    if (!this.lastLocation)
      return;
    const center = this.lastLocation.getFirstCoordinate();
    const view = this.options.map.getView();
    view.setCenter(center);
  }
  plotPosition(position) {
    const {coords, timestamp} = position;
    const {latitude, longitude, heading, accuracy} = coords;
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
  transform(longitude, latitude) {
    const location = new Point([longitude, latitude]);
    const mapLocation = location.transform("EPSG:4326", "EPSG:3857");
    return mapLocation;
  }
  savePosition(position) {
    this.options.storage.savePosition(position);
  }
}
