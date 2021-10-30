import TileLayer from "./_snowpack/pkg/ol/layer/Tile.js";
import {XYZ} from "./_snowpack/pkg/ol/source.js";
import {Map, View} from "./_snowpack/pkg/ol.js";
import {DragPan} from "./_snowpack/pkg/ol/interaction.js";
import {fromLonLat} from "./_snowpack/pkg/ol/proj.js";
export class MapMaker {
  constructor() {
    this.urls = {
      topo: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      imagery: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      street: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
    };
    this.baseLayerIndex = 0;
    const keys = Object.keys(this.urls);
    this.baseLayers = keys.map((k) => {
      return new TileLayer({
        visible: false,
        source: new XYZ({
          attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
          url: this.urls[k]
        })
      });
    });
  }
  nextBasemap() {
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
