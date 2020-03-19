import { Dictionary } from "./types/Dictionary";

const ol = globalThis.ol;

export class MapMaker {
  private urls: Dictionary<string> = {
    topo:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    imagery:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    street:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
  };

  private baseLayers: ol.layer.Tile[];
  private baseLayerIndex: number = 0;

  constructor() {
    const keys = Object.keys(this.urls);
    this.baseLayers = keys.map(k => {
      return new ol.layer.Tile({
        visible: false,
        source: new ol.source.XYZ({
          attributions:
            'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
          url: this.urls[k],
        })
      });
    });
  }

  nextBasemap(): void {
    this.baseLayers[this.baseLayerIndex].setVisible(false);
    this.baseLayerIndex = (1+this.baseLayerIndex) % this.baseLayers.length;
    this.baseLayers[this.baseLayerIndex].setVisible(true);
  }

  makeMap() {
    const map = new ol.Map({
      target: "map",
      controls: [],
      interactions: [new ol.interaction.DragPan()],
      layers: this.baseLayers,
      view: new ol.View({
        center: ol.proj.fromLonLat([-82, 35]),
        zoom: 19
      })
    });
    this.nextBasemap();
    return map;
  }
}
