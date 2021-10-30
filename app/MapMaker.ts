import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import { Map, View } from "ol";
import { Dictionary } from "./types/Dictionary";
import { DragPan } from "ol/interaction";
import { fromLonLat } from "ol/proj";

export class MapMaker {
  private urls: Dictionary<string> = {
    topo:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    imagery:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    street:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
  };

  private baseLayers: TileLayer<XYZ>[];
  private baseLayerIndex: number = 0;

  constructor() {
    const keys = Object.keys(this.urls);
    this.baseLayers = keys.map(k => {
      return new TileLayer({
        visible: false,
        source: new XYZ({
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
    this.baseLayerIndex = (1 + this.baseLayerIndex) % this.baseLayers.length;
    this.baseLayers[this.baseLayerIndex].setVisible(true);
  }

  makeMap() {
    const map = new Map({
      target: "map",
      controls: [],
      interactions: [new DragPan()],
      layers: this.baseLayers,
      view: new View({
        center: fromLonLat([-82, 35]),
        zoom: 19
      })
    });
    this.nextBasemap();
    return map;
  }
}
