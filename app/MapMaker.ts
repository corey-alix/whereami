const ol = globalThis.ol;

export class MapMaker {
  private urls = {
    topo: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    imagery: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    street: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
  };
  makeMap() {
    const map = new ol.Map({
      target: "map",
      controls: [],
      interactions: [new ol.interaction.DragPan()],
      layers: [
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
              'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
            url: this.urls.imagery
          })
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-82, 35]),
        zoom: 19
      })
    });
    return map;
  }
}
