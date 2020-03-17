const ol = globalThis.ol;
export class FloodZoneLayer {
    constructor(options) {
        this.options = options;
        /// https://www.gcgis.org/arcgis/rest/services/GreenvilleJS/Map_Layers_JS/MapServer/export?bbox=1567805.832299998%2C1120078.8597708307%2C1568839.167700002%2C1121419.1402291693&bboxSR=3361&layers=show%3A65&layerDefs=&size=744%2C965&imageSR=3361&format=png&transparent=true&dpi=96&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&rotation=&datumTransformations=&layerParameterValues=&mapRangeValues=&layerRangeValues=&f=html
        const url = "https://www.gcgis.org/arcgis/rest/services/GreenvilleJS/Map_Layers_JS/MapServer";
        const source = new ol.source.TileArcGISRest({
            projection: options.map.getView().getProjection(),
            params: {
                crossOrigin: true,
                cacheSize: 2048,
                layers: "show:65"
            },
            url: url
        });
        const layer = (this.layer = new ol.layer.Tile({ source }));
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
