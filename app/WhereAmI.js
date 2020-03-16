const ol = globalThis.ol;
export class WhereAmI {
    constructor(options) {
        this.options = options;
        const source = (this.source = new ol.source.Vector());
        const penLayer = new ol.layer.Vector({ source: source, visible: true });
        options.map.addLayer(penLayer);
        this.activeFeature = new ol.Feature();
        const fill = new ol.style.Fill({ color: "red" });
        const stroke = new ol.style.Stroke({ color: "white", width: 1 });
        const circle = new ol.style.Circle({ radius: 10, stroke, fill });
        const style = new ol.style.Style({ image: circle });
        this.activeFeature.setStyle(style);
        this.source.addFeature(this.activeFeature);
    }
    start() {
        navigator.geolocation.watchPosition(position => {
            this.plotPosition(position);
            this.savePosition(position);
            this.currentPosition = position;
        });
    }
    plotPosition(position) {
        const { coords, timestamp } = position;
        const { latitude, longitude } = coords;
        const mapLocation = this.transform(longitude, latitude);
        {
            let center = mapLocation.getFirstCoordinate();
            //center = this.transform(-82.3525, 34.87788).getFirstCoordinate();
            this.options.map.getView().setCenter(center);
        }
        const feature = new ol.Feature(mapLocation);
        this.source.addFeature(feature);
        this.activeFeature.setGeometry(feature.getGeometry());
        this.source.removeFeature(this.activeFeature);
        this.source.addFeature(this.activeFeature);
    }
    transform(longitude, latitude) {
        const location = new ol.geom.Point([longitude, latitude]);
        const mapLocation = location.transform("EPSG:4326", "EPSG:3857");
        return mapLocation;
    }
    savePosition(position) {
        this.options.storage.savePosition(position);
    }
}
