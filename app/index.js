import { MapMaker } from "./MapMaker.js";
import { LocationStorage } from "./LocationStorage.js";
import { WhereAmI } from "./WhereAmI.js";
import { ParcelImporter } from "./ParcelImporter.js";
import { DataDumper } from "./DataDumper.js";
import { FloodZoneLayer } from "./FloodZoneLayer.js";
export const ol = globalThis.ol;
async function askForPermission(title) {
    return new Promise((good, bad) => {
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
    if (!answer)
        return;
    navigator.serviceWorker.register("./worker.js");
    const mapMaker = new MapMaker();
    const map = mapMaker.makeMap();
    const storage = new LocationStorage("trip1");
    await storage.init();
    const dumper = new DataDumper({ storage, map });
    dumper.dump();
    const whereAmI = new WhereAmI({ map, storage });
    whereAmI.start();
    const viewport = map.getViewport();
    viewport.addEventListener("dblclick", () => {
        if (!whereAmI.currentPosition)
            return;
        importer.importParcelByLocation(whereAmI.currentPosition);
    });
    const importer = new ParcelImporter({ map });
    importer.importParcelById("0427000100102");
    importer.importParcelById("0428000101101");
    const floodZone = new FloodZoneLayer({ map });
    floodZone.hide();
    watchGestures(map, {
        "00": () => whereAmI.recenterMap(),
        "02": () => floodZone.toggle()
    });
}
function watchGestures(map, patterns) {
    let clickPattern = [];
    const columns = 2;
    document.addEventListener("click", ev => {
        console.log(ev);
        const [width, height] = map.getSize();
        clickPattern.push([
            Math.floor(ev.screenX / (width / columns)),
            Math.floor(ev.screenY / (height / columns))
        ]);
        if (2 <= clickPattern.length) {
            console.log(clickPattern);
            const key = clickPattern.map(xy => xy[0] + columns * xy[1]).join("");
            console.log(key);
            if (patterns[key])
                patterns[key]();
            clickPattern = [];
        }
    });
}
run();
