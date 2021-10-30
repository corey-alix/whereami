import TileLayer from "./_snowpack/pkg/ol/layer/Tile.js";
import {TileArcGISRest} from "./_snowpack/pkg/ol/source.js";
export class FloodZoneLayer {
  constructor(options) {
    this.options = options;
    const url = "https://www.gcgis.org/arcgis/rest/services/GreenvilleJS/Map_Layers_JS/MapServer";
    const source = new TileArcGISRest({
      projection: options.map.getView().getProjection(),
      params: {
        crossOrigin: true,
        cacheSize: 2048,
        layers: "show:65"
      },
      url
    });
    const layer = this.layer = new TileLayer({source});
    options.map.addLayer(layer);
  }
  toggle() {
    this.layer.setVisible(!this.layer.getVisible());
  }
  show() {
    this.layer.setVisible(true);
  }
  hide() {
    this.layer.setVisible(false);
  }
}
