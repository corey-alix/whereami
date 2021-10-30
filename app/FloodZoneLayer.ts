import { Map } from "ol";
import { Layer } from "ol/layer";
import TileLayer from "ol/layer/Tile";
import { Source, TileArcGISRest } from "ol/source";

export class FloodZoneLayer {
  private layer: Layer<Source>;
  toggle() {
    this.layer.setVisible(!this.layer.getVisible());
  }
  show() {
    this.layer.setVisible(true);
  }
  hide() {
    this.layer.setVisible(false);
  }
  constructor(
    private options: {
      map: Map;
    }
  ) {
    /// https://www.gcgis.org/arcgis/rest/services/GreenvilleJS/Map_Layers_JS/MapServer/export?bbox=1567805.832299998%2C1120078.8597708307%2C1568839.167700002%2C1121419.1402291693&bboxSR=3361&layers=show%3A65&layerDefs=&size=744%2C965&imageSR=3361&format=png&transparent=true&dpi=96&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&rotation=&datumTransformations=&layerParameterValues=&mapRangeValues=&layerRangeValues=&f=html
    const url =
      "https://www.gcgis.org/arcgis/rest/services/GreenvilleJS/Map_Layers_JS/MapServer";
    const source = new TileArcGISRest({
      projection: options.map.getView().getProjection(),
      params: {
        crossOrigin: true,
        cacheSize: 2048,
        layers: "show:65"
      },
      url: url
    });
    const layer = (this.layer = new TileLayer({ source }));
    options.map.addLayer(layer);
  }
}
