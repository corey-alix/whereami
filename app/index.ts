import { MapMaker } from "./MapMaker.js";
import { LocationStorage } from "./LocationStorage.js";
import { WhereAmI } from "./WhereAmI.js";
import { ParcelImporter } from "./ParcelImporter.js";
import { DataDumper } from "./DataDumper.js";
import { FloodZoneLayer } from "./FloodZoneLayer.js";
import { watchGestures } from "./fun/watchGestures.js";
import { askForPermission } from "./fun/askForPermission.js";
export const ol = globalThis.ol;

function notify(message: string) {
  askForPermission(message);
}

async function run() {
  const answer = await askForPermission("May I track your location?");
  if (!answer) return;

  navigator.serviceWorker.register("./worker.js").then(async reg => {
    await reg.update();
    console.log("updated");
  });

  const mapMaker = new MapMaker();
  const map = mapMaker.makeMap();
  const storage = new LocationStorage("trip1");
  await storage.init();

  const dumper = new DataDumper({ storage, map });
  dumper.dump();

  const whereAmI = new WhereAmI({ map, storage });
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
