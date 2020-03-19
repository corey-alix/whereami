import { Dictionary } from "../types/Dictionary";

let clickPattern = [] as Array<[number, number]>;

function clearPatterns() {
  clickPattern = [];
}

export function watchGestures(
  map: ol.Map,
  patterns: Dictionary<(key: string) => void>
) {
  const columns = 2;
  map.on("click", event => {
    const ev = (event as any) as { pixel: number[] };
    console.log(ev);
    const [x, y] = ev.pixel;
    const [width, height] = map.getSize();
    clickPattern.push([
      Math.floor(x / (width / columns)),
      Math.floor(y / (height / columns))
    ]);
    if (2 <= clickPattern.length) {
      console.log(clickPattern);
      const key = clickPattern.map(xy => xy[0] + columns * xy[1]).join("");
      console.log(key);
      clearPatterns();
      if (patterns[key]) {
        patterns[key](key);
      } else {
        if (patterns.otherwise) {
          patterns.otherwise(key);
        }
      }
    }
  });

  map.on("movestart", () => {
    clearPatterns();
  });
}
