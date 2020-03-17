import { MapMaker } from "./MapMaker.js";
import { LocationStorage } from "./LocationStorage.js";
import { WhereAmI } from "./WhereAmI.js";
import { ParcelImporter } from "./ParcelImporter.js";
import { DataDumper } from "./DataDumper.js";

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

  navigator.serviceWorker.register("./worker.js");

  const mapMaker = new MapMaker();
  const map = mapMaker.makeMap();
  const storage = new LocationStorage("trip1");
  await storage.init();

  const dumper = new DataDumper({storage, map});
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
}

run();