import { MapMaker } from "./MapMaker.js";
import { LocationStorage } from "./LocationStorage.js";
import { LocationViewer } from "./LocationViewer.js";
import { ParcelImporter } from "./ParcelImporter.js";
import { DataDumper } from "./DataDumper.js";
import { FloodZoneLayer } from "./FloodZoneLayer.js";
import { watchGestures } from "./fun/watchGestures.js";
import { askForPermission } from "./fun/askForPermission.js";
import { log } from "./fun/log.js";
import { LocationWriter } from "./LocationWriter";

// ideally this would run in a worker but I don't know how to import the code
// ESM is not yet supported
(async function () {
  log("Running LocationStorage");
  const storage = new LocationStorage("trip1");
  await storage.init();

  log("Running LocationWriter");
  const locationWriter = new LocationWriter({ storage });
  locationWriter.start();
})();

function notify(message: string) {
  askForPermission(message);
}

async function run() {
  const answer = await askForPermission("May I track your location?");
  if (!answer) return;

  log("registering worker.js");
  navigator.serviceWorker.register("./worker.js").then(async reg => {
    log("worker registered");
    await reg.update();
    log("registration updated");
  });

  const mapMaker = new MapMaker();
  const map = mapMaker.makeMap();
  const storage = new LocationStorage("trip1");
  await storage.init();

  const dumper = new DataDumper({ storage, map });
  dumper.dump();

  const whereAmI = new LocationViewer({ map, storage });
  whereAmI.start();

  const viewport = map.getViewport() as HTMLElement;
  viewport.addEventListener("dblclick", () => {
    if (!whereAmI.currentPosition) return;
    importer.importParcelByLocation(whereAmI.currentPosition);
  });

  const importer = new ParcelImporter({ map });
  importer.importParcelById("0427000100102");
  importer.importParcelById("0428000101101");

  const floodZone = new FloodZoneLayer({ map });
  floodZone.hide();

  watchGestures(map, {
    "00": () => whereAmI.recenterMap(),
    "02": () => floodZone.toggle(),
    "11": () => mapMaker.nextBasemap(),
    otherwise: (code) => notify(`no gesture found: ${code}`)
  });
}

run();
