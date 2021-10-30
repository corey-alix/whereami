import {Feature} from "./_snowpack/pkg/ol.js";
import VectorLayer from "./_snowpack/pkg/ol/layer/Vector.js";
import Vector from "./_snowpack/pkg/ol/source/Vector.js";
import {Point, Polygon} from "./_snowpack/pkg/ol/geom.js";
import {Fill, Stroke, Style} from "./_snowpack/pkg/ol/style.js";
const ParcelFeatureTypeInstance = {
  displayFieldName: "NAMECO",
  fieldAliases: {
    PIN: "PIN / Tax Map #",
    OWNAM1: "Owner Name(MixedCase)",
    OWNAM2: "Owner Name 2(MixedCase)",
    STREET: "Mailing Address(MixedCase)",
    CITY: "City(MixedCase)",
    STATE: "State",
    ZIP5: "Zip Code",
    NAMECO: "In Care Of(MixedCase)",
    POWNNM: "Previous Owner(MixedCase)",
    DEEDDATE: "Deed Date(ShortDate)",
    CUBOOK: "Deed Book",
    CUPAGE: "Deed Page",
    PLTBK1: "Plat Book",
    PPAGE1: "Plat Page",
    DIST: "Tax District",
    MKTAREA: "Market Area",
    JURIS: "Jurisdiction",
    LANDUSE: "Land Use",
    DESCR: "Legal Description",
    SUBDIV: "Subdivision(MixedCase)",
    STRNUM: "Site Address Number",
    LOCATE: "Site Address Street",
    SLPRICE: "Sale Price(Money)",
    FAIRMKTVAL: "Fair Market Value(Money)",
    TAXMKTVAL: "Taxable Market Value(Money)",
    TOTTAX: "Taxes(Money)",
    PAIDDATE: "Date Taxes Paid(ShortDate)",
    TACRES: "Estimated Acres",
    SQFEET: "Square Feet",
    BEDROOMS: "Number of Bedrooms",
    BATHRMS: "Number of Bathrooms",
    HALFBATH: "Number of Half Baths",
    PROPTYPE: "99! PROPTYPE",
    IMPROVED: "99! IMPROVED",
    OBJECTID: "OBJECTID"
  },
  geometryType: "esriGeometryPolygon",
  spatialReference: {wkid: 3361, latestWkid: 3361},
  fields: [
    {
      name: "PIN",
      type: "esriFieldTypeString",
      alias: "PIN / Tax Map #",
      length: 13
    },
    {
      name: "OWNAM1",
      type: "esriFieldTypeString",
      alias: "Owner Name(MixedCase)",
      length: 30
    },
    {
      name: "OWNAM2",
      type: "esriFieldTypeString",
      alias: "Owner Name 2(MixedCase)",
      length: 30
    },
    {
      name: "STREET",
      type: "esriFieldTypeString",
      alias: "Mailing Address(MixedCase)",
      length: 32
    },
    {
      name: "CITY",
      type: "esriFieldTypeString",
      alias: "City(MixedCase)",
      length: 23
    },
    {name: "STATE", type: "esriFieldTypeString", alias: "State", length: 2},
    {name: "ZIP5", type: "esriFieldTypeString", alias: "Zip Code", length: 5},
    {
      name: "NAMECO",
      type: "esriFieldTypeString",
      alias: "In Care Of(MixedCase)",
      length: 30
    },
    {
      name: "POWNNM",
      type: "esriFieldTypeString",
      alias: "Previous Owner(MixedCase)",
      length: 30
    },
    {
      name: "DEEDDATE",
      type: "esriFieldTypeDate",
      alias: "Deed Date(ShortDate)",
      length: 8
    },
    {
      name: "CUBOOK",
      type: "esriFieldTypeString",
      alias: "Deed Book",
      length: 4
    },
    {name: "CUPAGE", type: "esriFieldTypeSmallInteger", alias: "Deed Page"},
    {
      name: "PLTBK1",
      type: "esriFieldTypeString",
      alias: "Plat Book",
      length: 4
    },
    {name: "PPAGE1", type: "esriFieldTypeSmallInteger", alias: "Plat Page"},
    {
      name: "DIST",
      type: "esriFieldTypeString",
      alias: "Tax District",
      length: 3
    },
    {
      name: "MKTAREA",
      type: "esriFieldTypeString",
      alias: "Market Area",
      length: 6
    },
    {
      name: "JURIS",
      type: "esriFieldTypeString",
      alias: "Jurisdiction",
      length: 1
    },
    {
      name: "LANDUSE",
      type: "esriFieldTypeString",
      alias: "Land Use",
      length: 4
    },
    {
      name: "DESCR",
      type: "esriFieldTypeString",
      alias: "Legal Description",
      length: 30
    },
    {
      name: "SUBDIV",
      type: "esriFieldTypeString",
      alias: "Subdivision(MixedCase)",
      length: 32
    },
    {
      name: "STRNUM",
      type: "esriFieldTypeString",
      alias: "Site Address Number",
      length: 5
    },
    {
      name: "LOCATE",
      type: "esriFieldTypeString",
      alias: "Site Address Street",
      length: 32
    },
    {
      name: "SLPRICE",
      type: "esriFieldTypeInteger",
      alias: "Sale Price(Money)"
    },
    {
      name: "FAIRMKTVAL",
      type: "esriFieldTypeInteger",
      alias: "Fair Market Value(Money)"
    },
    {
      name: "TAXMKTVAL",
      type: "esriFieldTypeInteger",
      alias: "Taxable Market Value(Money)"
    },
    {name: "TOTTAX", type: "esriFieldTypeDouble", alias: "Taxes(Money)"},
    {
      name: "PAIDDATE",
      type: "esriFieldTypeDate",
      alias: "Date Taxes Paid(ShortDate)",
      length: 8
    },
    {name: "TACRES", type: "esriFieldTypeDouble", alias: "Estimated Acres"},
    {name: "SQFEET", type: "esriFieldTypeInteger", alias: "Square Feet"},
    {
      name: "BEDROOMS",
      type: "esriFieldTypeSmallInteger",
      alias: "Number of Bedrooms"
    },
    {
      name: "BATHRMS",
      type: "esriFieldTypeSmallInteger",
      alias: "Number of Bathrooms"
    },
    {
      name: "HALFBATH",
      type: "esriFieldTypeSmallInteger",
      alias: "Number of Half Baths"
    },
    {
      name: "PROPTYPE",
      type: "esriFieldTypeString",
      alias: "99! PROPTYPE",
      length: 30
    },
    {
      name: "IMPROVED",
      type: "esriFieldTypeString",
      alias: "99! IMPROVED",
      length: 3
    },
    {name: "OBJECTID", type: "esriFieldTypeOID", alias: "OBJECTID"}
  ],
  features: [
    {
      attributes: {
        PIN: "0428000101101",
        OWNAM1: "RAIGOSA ANTINO",
        OWNAM2: "",
        STREET: "701 BRAESWOOD ST",
        CITY: "GREENVILLE",
        STATE: "SC",
        ZIP5: "29617",
        NAMECO: "",
        POWNNM: "WILLIAMS BUILDERS INC",
        DEEDDATE: 10336896e5,
        CUBOOK: "2011",
        CUPAGE: 1563,
        PLTBK1: "46-D",
        PPAGE1: 45,
        DIST: "308",
        MKTAREA: "001427",
        JURIS: "1",
        LANDUSE: "9170",
        DESCR: "PT.6",
        SUBDIV: "GRAND VIEW ACRES",
        STRNUM: "",
        LOCATE: "CHUKAR",
        SLPRICE: 22e3,
        FAIRMKTVAL: 46160,
        TAXMKTVAL: 15960,
        TOTTAX: 85.82,
        PAIDDATE: 15795648e5,
        TACRES: 10.31,
        SQFEET: 0,
        BEDROOMS: 0,
        BATHRMS: 0,
        HALFBATH: 0,
        PROPTYPE: "AGRICULTURAL",
        IMPROVED: "NO",
        OBJECTID: 359172531
      },
      geometry: {
        rings: [
          [
            [1569038, 1121595],
            [1568640, 1120955],
            [1568271, 1121082],
            [1568283, 1121145],
            [1568340, 1121287],
            [1568346, 1121323],
            [1568370, 1121357],
            [1568369, 1121394],
            [1568405, 1121518],
            [1568423, 1121737],
            [1568435, 1121790],
            [1568498, 1121930],
            [1568512, 1121950],
            [1568562, 1121985],
            [1569038, 1121595]
          ]
        ]
      }
    }
  ]
};
const ParcelResponseByLocation = {
  results: [
    {
      layerId: 53,
      layerName: "Tax Parcel",
      displayFieldName: "In Care Of(MixedCase)",
      value: "359142498",
      attributes: {
        "PIN / Tax Map #": "0189011100500",
        "Owner Name(MixedCase)": "DE BRUIN COMMERCIAL HOLDINGS",
        "Owner Name 2(MixedCase)": "",
        "Mailing Address(MixedCase)": "16 WELLINGTON AVE",
        "City(MixedCase)": "GREENVILLE",
        State: "SC",
        "Zip Code": "29609",
        "In Care Of(MixedCase)": "",
        "Previous Owner(MixedCase)": "AGGREGATE PROPERTY GVILLE LLC",
        "Deed Date(ShortDate)": "3/31/2016",
        "Deed Book": "2485",
        "Deed Page": "46",
        "Plat Book": "10-E",
        "Plat Page": "64",
        "Tax District": "500",
        "Market Area": "C00144",
        Jurisdiction: "1",
        "Land Use": "421",
        "Legal Description": "NONE",
        "Subdivision(MixedCase)": "VISTA HILLS",
        "Site Address Number": "16",
        "Site Address Street": "WELLINGTON",
        "Sale Price(Money)": "395000",
        "Fair Market Value(Money)": "388700",
        "Taxable Market Value(Money)": "388700",
        "Taxes(Money)": "10062.06",
        "Date Taxes Paid(ShortDate)": "2/17/2020",
        "Estimated Acres": "1.011",
        "Square Feet": "0",
        "Number of Bedrooms": "0",
        "Number of Bathrooms": "0",
        "Number of Half Baths": "0",
        "99! PROPTYPE": "COMMERCIAL",
        "99! IMPROVED": "YES",
        OBJECTID: "359142498",
        SHAPE: "Polygon"
      },
      geometryType: "esriGeometryPolygon",
      geometry: {
        rings: [
          [
            [-917041000141552e-8, 4.1459476797061213e6],
            [-917043962825974e-8, 414592541137644e-8],
            [-9170478800134996e-9, 4.1459783163092206e6],
            [-9170476700130222e-9, 4.1459810510672843e6],
            [-9170453001475008e-9, 4.1460119139597025e6],
            [-9170449562766293e-9, 4.1460163921013293e6],
            [-9170447602694841e-9, 414602143933878e-8],
            [-9170439795472035e-9, 4146041542980121e-9],
            [-9170439146189965e-9, 4146043214618247e-9],
            [-9170437424865814e-9, 4.1460476471119067e6],
            [-9170380204475004e-9, 4145970075647453e-9],
            [-9170382554063495e-9, 4.1459683095587334e6],
            [-917041000141552e-8, 4.1459476797061213e6]
          ]
        ],
        spatialReference: {wkid: 102100, latestWkid: 3857}
      }
    }
  ]
};
export class ParcelImporter {
  constructor(options) {
    this.options = options;
    const source = this.source = new Vector();
    const penLayer = new VectorLayer({source, visible: true});
    options.map.addLayer(penLayer);
  }
  async importParcelById(parcelId) {
    const parcel = await this.fetchParcelById(parcelId);
    this.drawParcel(parcel);
  }
  async importParcelByLocation(position) {
    const parcel = await this.fetchParcelByLocation(position);
    const feature = parcel.results[0];
    const parcelAsFeature = {};
    parcelAsFeature.features = [
      {
        attributes: feature.attributes,
        geometry: feature.geometry
      }
    ];
    this.drawParcel(parcelAsFeature);
  }
  drawParcel(parcel) {
    const agsGeom = parcel.features[0].geometry;
    const olGeom = agsGeom.rings;
    const parcelGeom = new Polygon(olGeom);
    const parcelFeature = new Feature(parcelGeom);
    const fill = new Fill({color: [255, 0, 0, 0.1]});
    const stroke = new Stroke({color: "white", width: 1});
    const style = new Style({fill, stroke});
    parcelFeature.setStyle(style);
    this.source.addFeature(parcelFeature);
  }
  async fetchParcelById(parcelId) {
    const urlTemplate = `https://www.gcgis.org/arcgis/rest/services/GreenvilleJS/Map_Layers_JS/MapServer/53/query?f=json&where=PIN='${parcelId}'&returnGeometry=true&spatialRel=esriSpatialRelIntersects&maxAllowableOffset=4&geometryPrecision=1&outFields=*&outSR=3857`;
    const resp = await fetch(urlTemplate);
    return await resp.json();
  }
  async fetchParcelByLocation(location) {
    const {longitude, latitude} = location.coords;
    const mapLocation = this.transform(longitude, latitude);
    const [x, y] = mapLocation.getFirstCoordinate();
    const size = this.options.map.getSize();
    const mapExtent = this.options.map.getView().calculateExtent(size).join(",");
    const [pixelWidth, pixelHeight] = size;
    const urlTemplate = `https://www.gcgis.org/arcgis/rest/services/GreenvilleJS/Map_Layers_JS/MapServer/identify?f=json&tolerance=10&returnGeometry=true&returnFieldName=false&returnUnformattedValues=false&imageDisplay=${pixelWidth},${pixelHeight},96&geometry={"x":${x},"y":${y}}&geometryType=esriGeometryPoint&sr=3857&mapExtent=${mapExtent}&layers=all:53`;
    console.log(urlTemplate);
    const resp = await fetch(urlTemplate);
    return await resp.json();
  }
  transform(longitude, latitude) {
    const location = new Point([longitude, latitude]);
    const mapLocation = location.transform("EPSG:4326", "EPSG:3857");
    return mapLocation;
  }
}
