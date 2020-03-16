const ol = globalThis.ol;
export class WhereAmI {
    constructor(options) {
        this.options = options;
        const source = (this.source = new ol.source.Vector());
        const penLayer = new ol.layer.Vector({ source: source, visible: true });
        options.map.addLayer(penLayer);
        this.currentPosition = new ol.Feature();
        const fill = new ol.style.Fill({ color: "red" });
        const stroke = new ol.style.Stroke({ color: "white", width: 1 });
        const circle = new ol.style.Circle({ radius: 10, stroke, fill });
        const style = new ol.style.Style({ image: circle });
        this.currentPosition.setStyle(style);
        this.source.addFeature(this.currentPosition);
    }
    start() {
        navigator.geolocation.watchPosition(position => {
            this.plotPosition(position);
            this.savePosition(position);
        });
    }
    plotPosition(position) {
        const { coords, timestamp } = position;
        const { latitude, longitude } = coords;
        const location = new ol.geom.Point([longitude, latitude]);
        const mapLocation = location.transform("EPSG:4326", "EPSG:3857");
        this.options.map.getView().setCenter(mapLocation.getFirstCoordinate());
        const feature = new ol.Feature(mapLocation);
        this.source.addFeature(feature);
        this.currentPosition.setGeometry(feature.getGeometry());
        this.source.removeFeature(this.currentPosition);
        this.source.addFeature(this.currentPosition);
    }
    savePosition(position) {
        this.options.storage.savePosition(position);
    }
}
