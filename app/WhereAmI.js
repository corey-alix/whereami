const ol = globalThis.ol;
export class WhereAmI {
    constructor(options) {
        this.options = options;
        this.currentOrientation = null;
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
        window.addEventListener("deviceorientationabsolute", event => {
            const { absolute, alpha, beta, gamma } = event;
            console.log(absolute, alpha, beta, gamma);
            if (!absolute)
                return;
            if (null === alpha)
                return;
            // alpha is rotation around z-axis, when looking down at device
            // beta is font to back motion, not useful for map
            // gamma is left to right motion, perfect for map
            this.currentOrientation = (alpha * Math.PI) / 180;
            this.options.map.getView().setRotation(this.currentOrientation);
        }, true);
    }
    plotPosition(position) {
        const { coords, timestamp } = position;
        const { latitude, longitude, heading } = coords;
        const mapLocation = this.transform(longitude, latitude);
        {
            const center = mapLocation.getFirstCoordinate();
            const view = this.options.map.getView();
            view.setCenter(center);
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
