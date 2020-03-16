class MapMaker {
  private urls = {
    topo:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    imagery:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    street:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
  };

  makeMap() {
    const map = new ol.Map({
      target: "map",
      controls: [],
      interactions: [new ol.interaction.DragPan()],
      layers: [
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            attributions:
              'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
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

class LocationStorage {
  private db: IDBDatabase | undefined;

  constructor(public storeName: string) {
    const connection = indexedDB.open("LocationStorage", 1);
    connection.onsuccess = ev => {
      const db = (this.db = connection.result);
    };
    connection.onerror = ev => {};
    connection.onupgradeneeded = ev => {
      const db = connection.result;
      db.createObjectStore(storeName);
    };
  }

  savePosition(position: Position) {
    if (!this.db) return;
    const store = this.db
      .transaction([this.storeName], "readwrite")
      .objectStore(this.storeName);
    const key = position.timestamp;
    const {
      latitude,
      longitude,
      accuracy,
      heading,
      altitude
    } = position.coords;
    const data = {
      latitude,
      longitude,
      accuracy,
      heading,
      altitude
    };
    store.add(data, key);
  }
}

class WhereAmI {
  private source: ol.source.Vector;
  constructor(private options: { map: ol.Map; storage: LocationStorage }) {
    const source = (this.source = new ol.source.Vector());
    const penLayer = new ol.layer.Vector({ source: source, visible: true });
    options.map.addLayer(penLayer);
  }

  start() {
    navigator.geolocation.watchPosition(position => {
      this.plotPosition(position);
      this.savePosition(position);
    });
  }

  plotPosition(position: Position): void {
    console.log(position);
    const { coords, timestamp } = position;
    const { latitude, longitude } = coords;
    const location = new ol.geom.Point([longitude, latitude]);
    const mapLocation = location.transform(
      "EPSG:4326",
      "EPSG:3857"
    ) as ol.geom.Point;
    this.options.map.getView().setCenter(mapLocation.getFirstCoordinate());
    const feature = new ol.Feature(mapLocation);
    this.source.addFeature(feature);
  }

  savePosition(position: Position) {
    this.options.storage.savePosition(position);
  }
}

async function askForPermission(title: string) {
  return new Promise<boolean>((good, bad) => {
    const button = document.createElement("button");
    button.className = "ol-control big";
    button.innerText = title;
    document.body.appendChild(button);
    button.onclick = () => {
      good(true);
      button.remove();
    };
  });
}

async function run() {
  const answer = await askForPermission("May I track your location?");
  if (!answer) return;

  const mapMaker = new MapMaker();
  const storage = new LocationStorage("trip1");
  const whereAmI = new WhereAmI({ map: mapMaker.makeMap(), storage });
  whereAmI.start();
}

run();
