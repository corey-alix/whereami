import { a as cosh, t as toRadians } from './math-b0fe2752.js';

/**
 * @module ol/proj/Units
 */
/**
 * Projection units: `'degrees'`, `'ft'`, `'m'`, `'pixels'`, `'tile-pixels'` or
 * `'us-ft'`.
 * @enum {string}
 */
var Units = {
    /**
     * Radians
     * @api
     */
    RADIANS: 'radians',
    /**
     * Degrees
     * @api
     */
    DEGREES: 'degrees',
    /**
     * Feet
     * @api
     */
    FEET: 'ft',
    /**
     * Meters
     * @api
     */
    METERS: 'm',
    /**
     * Pixels
     * @api
     */
    PIXELS: 'pixels',
    /**
     * Tile Pixels
     * @api
     */
    TILE_PIXELS: 'tile-pixels',
    /**
     * US Feet
     * @api
     */
    USFEET: 'us-ft',
};
/**
 * Meters per unit lookup table.
 * @const
 * @type {Object<Units, number>}
 * @api
 */
var METERS_PER_UNIT = {};
// use the radius of the Normal sphere
METERS_PER_UNIT[Units.RADIANS] = 6370997 / (2 * Math.PI);
METERS_PER_UNIT[Units.DEGREES] = (2 * Math.PI * 6370997) / 360;
METERS_PER_UNIT[Units.FEET] = 0.3048;
METERS_PER_UNIT[Units.METERS] = 1;
METERS_PER_UNIT[Units.USFEET] = 1200 / 3937;

/**
 * @module ol/proj/Projection
 */
/**
 * @typedef {Object} Options
 * @property {string} code The SRS identifier code, e.g. `EPSG:4326`.
 * @property {import("./Units.js").default|string} [units] Units. Required unless a
 * proj4 projection is defined for `code`.
 * @property {import("../extent.js").Extent} [extent] The validity extent for the SRS.
 * @property {string} [axisOrientation='enu'] The axis orientation as specified in Proj4.
 * @property {boolean} [global=false] Whether the projection is valid for the whole globe.
 * @property {number} [metersPerUnit] The meters per unit for the SRS.
 * If not provided, the `units` are used to get the meters per unit from the {@link module:ol/proj/Units~METERS_PER_UNIT}
 * lookup table.
 * @property {import("../extent.js").Extent} [worldExtent] The world extent for the SRS.
 * @property {function(number, import("../coordinate.js").Coordinate):number} [getPointResolution]
 * Function to determine resolution at a point. The function is called with a
 * `number` view resolution and a {@link module:ol/coordinate~Coordinate Coordinate} as arguments, and returns
 * the `number` resolution in projection units at the passed coordinate. If this is `undefined`,
 * the default {@link module:ol/proj.getPointResolution getPointResolution()} function will be used.
 */
/**
 * @classdesc
 * Projection definition class. One of these is created for each projection
 * supported in the application and stored in the {@link module:ol/proj} namespace.
 * You can use these in applications, but this is not required, as API params
 * and options use {@link module:ol/proj~ProjectionLike} which means the simple string
 * code will suffice.
 *
 * You can use {@link module:ol/proj.get} to retrieve the object for a particular
 * projection.
 *
 * The library includes definitions for `EPSG:4326` and `EPSG:3857`, together
 * with the following aliases:
 * * `EPSG:4326`: CRS:84, urn:ogc:def:crs:EPSG:6.6:4326,
 *     urn:ogc:def:crs:OGC:1.3:CRS84, urn:ogc:def:crs:OGC:2:84,
 *     http://www.opengis.net/gml/srs/epsg.xml#4326,
 *     urn:x-ogc:def:crs:EPSG:4326
 * * `EPSG:3857`: EPSG:102100, EPSG:102113, EPSG:900913,
 *     urn:ogc:def:crs:EPSG:6.18:3:3857,
 *     http://www.opengis.net/gml/srs/epsg.xml#3857
 *
 * If you use [proj4js](https://github.com/proj4js/proj4js), aliases can
 * be added using `proj4.defs()`. After all required projection definitions are
 * added, call the {@link module:ol/proj/proj4.register} function.
 *
 * @api
 */
var Projection = /** @class */ (function () {
    /**
     * @param {Options} options Projection options.
     */
    function Projection(options) {
        /**
         * @private
         * @type {string}
         */
        this.code_ = options.code;
        /**
         * Units of projected coordinates. When set to `TILE_PIXELS`, a
         * `this.extent_` and `this.worldExtent_` must be configured properly for each
         * tile.
         * @private
         * @type {import("./Units.js").default}
         */
        this.units_ = /** @type {import("./Units.js").default} */ (options.units);
        /**
         * Validity extent of the projection in projected coordinates. For projections
         * with `TILE_PIXELS` units, this is the extent of the tile in
         * tile pixel space.
         * @private
         * @type {import("../extent.js").Extent}
         */
        this.extent_ = options.extent !== undefined ? options.extent : null;
        /**
         * Extent of the world in EPSG:4326. For projections with
         * `TILE_PIXELS` units, this is the extent of the tile in
         * projected coordinate space.
         * @private
         * @type {import("../extent.js").Extent}
         */
        this.worldExtent_ =
            options.worldExtent !== undefined ? options.worldExtent : null;
        /**
         * @private
         * @type {string}
         */
        this.axisOrientation_ =
            options.axisOrientation !== undefined ? options.axisOrientation : 'enu';
        /**
         * @private
         * @type {boolean}
         */
        this.global_ = options.global !== undefined ? options.global : false;
        /**
         * @private
         * @type {boolean}
         */
        this.canWrapX_ = !!(this.global_ && this.extent_);
        /**
         * @private
         * @type {function(number, import("../coordinate.js").Coordinate):number|undefined}
         */
        this.getPointResolutionFunc_ = options.getPointResolution;
        /**
         * @private
         * @type {import("../tilegrid/TileGrid.js").default}
         */
        this.defaultTileGrid_ = null;
        /**
         * @private
         * @type {number|undefined}
         */
        this.metersPerUnit_ = options.metersPerUnit;
    }
    /**
     * @return {boolean} The projection is suitable for wrapping the x-axis
     */
    Projection.prototype.canWrapX = function () {
        return this.canWrapX_;
    };
    /**
     * Get the code for this projection, e.g. 'EPSG:4326'.
     * @return {string} Code.
     * @api
     */
    Projection.prototype.getCode = function () {
        return this.code_;
    };
    /**
     * Get the validity extent for this projection.
     * @return {import("../extent.js").Extent} Extent.
     * @api
     */
    Projection.prototype.getExtent = function () {
        return this.extent_;
    };
    /**
     * Get the units of this projection.
     * @return {import("./Units.js").default} Units.
     * @api
     */
    Projection.prototype.getUnits = function () {
        return this.units_;
    };
    /**
     * Get the amount of meters per unit of this projection.  If the projection is
     * not configured with `metersPerUnit` or a units identifier, the return is
     * `undefined`.
     * @return {number|undefined} Meters.
     * @api
     */
    Projection.prototype.getMetersPerUnit = function () {
        return this.metersPerUnit_ || METERS_PER_UNIT[this.units_];
    };
    /**
     * Get the world extent for this projection.
     * @return {import("../extent.js").Extent} Extent.
     * @api
     */
    Projection.prototype.getWorldExtent = function () {
        return this.worldExtent_;
    };
    /**
     * Get the axis orientation of this projection.
     * Example values are:
     * enu - the default easting, northing, elevation.
     * neu - northing, easting, up - useful for "lat/long" geographic coordinates,
     *     or south orientated transverse mercator.
     * wnu - westing, northing, up - some planetary coordinate systems have
     *     "west positive" coordinate systems
     * @return {string} Axis orientation.
     * @api
     */
    Projection.prototype.getAxisOrientation = function () {
        return this.axisOrientation_;
    };
    /**
     * Is this projection a global projection which spans the whole world?
     * @return {boolean} Whether the projection is global.
     * @api
     */
    Projection.prototype.isGlobal = function () {
        return this.global_;
    };
    /**
     * Set if the projection is a global projection which spans the whole world
     * @param {boolean} global Whether the projection is global.
     * @api
     */
    Projection.prototype.setGlobal = function (global) {
        this.global_ = global;
        this.canWrapX_ = !!(global && this.extent_);
    };
    /**
     * @return {import("../tilegrid/TileGrid.js").default} The default tile grid.
     */
    Projection.prototype.getDefaultTileGrid = function () {
        return this.defaultTileGrid_;
    };
    /**
     * @param {import("../tilegrid/TileGrid.js").default} tileGrid The default tile grid.
     */
    Projection.prototype.setDefaultTileGrid = function (tileGrid) {
        this.defaultTileGrid_ = tileGrid;
    };
    /**
     * Set the validity extent for this projection.
     * @param {import("../extent.js").Extent} extent Extent.
     * @api
     */
    Projection.prototype.setExtent = function (extent) {
        this.extent_ = extent;
        this.canWrapX_ = !!(this.global_ && extent);
    };
    /**
     * Set the world extent for this projection.
     * @param {import("../extent.js").Extent} worldExtent World extent
     *     [minlon, minlat, maxlon, maxlat].
     * @api
     */
    Projection.prototype.setWorldExtent = function (worldExtent) {
        this.worldExtent_ = worldExtent;
    };
    /**
     * Set the getPointResolution function (see {@link module:ol/proj.getPointResolution}
     * for this projection.
     * @param {function(number, import("../coordinate.js").Coordinate):number} func Function
     * @api
     */
    Projection.prototype.setGetPointResolution = function (func) {
        this.getPointResolutionFunc_ = func;
    };
    /**
     * Get the custom point resolution function for this projection (if set).
     * @return {function(number, import("../coordinate.js").Coordinate):number|undefined} The custom point
     * resolution function (if set).
     */
    Projection.prototype.getPointResolutionFunc = function () {
        return this.getPointResolutionFunc_;
    };
    return Projection;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Radius of WGS84 sphere
 *
 * @const
 * @type {number}
 */
var RADIUS = 6378137;
/**
 * @const
 * @type {number}
 */
var HALF_SIZE = Math.PI * RADIUS;
/**
 * @const
 * @type {import("../extent.js").Extent}
 */
var EXTENT = [-HALF_SIZE, -HALF_SIZE, HALF_SIZE, HALF_SIZE];
/**
 * @const
 * @type {import("../extent.js").Extent}
 */
var WORLD_EXTENT = [-180, -85, 180, 85];
/**
 * Maximum safe value in y direction
 * @const
 * @type {number}
 */
var MAX_SAFE_Y = RADIUS * Math.log(Math.tan(Math.PI / 2));
/**
 * @classdesc
 * Projection object for web/spherical Mercator (EPSG:3857).
 */
var EPSG3857Projection = /** @class */ (function (_super) {
    __extends(EPSG3857Projection, _super);
    /**
     * @param {string} code Code.
     */
    function EPSG3857Projection(code) {
        return _super.call(this, {
            code: code,
            units: Units.METERS,
            extent: EXTENT,
            global: true,
            worldExtent: WORLD_EXTENT,
            getPointResolution: function (resolution, point) {
                return resolution / cosh(point[1] / RADIUS);
            },
        }) || this;
    }
    return EPSG3857Projection;
}(Projection));
/**
 * Projections equal to EPSG:3857.
 *
 * @const
 * @type {Array<import("./Projection.js").default>}
 */
var PROJECTIONS = [
    new EPSG3857Projection('EPSG:3857'),
    new EPSG3857Projection('EPSG:102100'),
    new EPSG3857Projection('EPSG:102113'),
    new EPSG3857Projection('EPSG:900913'),
    new EPSG3857Projection('http://www.opengis.net/def/crs/EPSG/0/3857'),
    new EPSG3857Projection('http://www.opengis.net/gml/srs/epsg.xml#3857'),
];
/**
 * Transformation from EPSG:4326 to EPSG:3857.
 *
 * @param {Array<number>} input Input array of coordinate values.
 * @param {Array<number>} [opt_output] Output array of coordinate values.
 * @param {number} [opt_dimension] Dimension (default is `2`).
 * @return {Array<number>} Output array of coordinate values.
 */
function fromEPSG4326(input, opt_output, opt_dimension) {
    var length = input.length;
    var dimension = opt_dimension > 1 ? opt_dimension : 2;
    var output = opt_output;
    if (output === undefined) {
        if (dimension > 2) {
            // preserve values beyond second dimension
            output = input.slice();
        }
        else {
            output = new Array(length);
        }
    }
    for (var i = 0; i < length; i += dimension) {
        output[i] = (HALF_SIZE * input[i]) / 180;
        var y = RADIUS * Math.log(Math.tan((Math.PI * (+input[i + 1] + 90)) / 360));
        if (y > MAX_SAFE_Y) {
            y = MAX_SAFE_Y;
        }
        else if (y < -MAX_SAFE_Y) {
            y = -MAX_SAFE_Y;
        }
        output[i + 1] = y;
    }
    return output;
}
/**
 * Transformation from EPSG:3857 to EPSG:4326.
 *
 * @param {Array<number>} input Input array of coordinate values.
 * @param {Array<number>} [opt_output] Output array of coordinate values.
 * @param {number} [opt_dimension] Dimension (default is `2`).
 * @return {Array<number>} Output array of coordinate values.
 */
function toEPSG4326(input, opt_output, opt_dimension) {
    var length = input.length;
    var dimension = opt_dimension > 1 ? opt_dimension : 2;
    var output = opt_output;
    if (output === undefined) {
        if (dimension > 2) {
            // preserve values beyond second dimension
            output = input.slice();
        }
        else {
            output = new Array(length);
        }
    }
    for (var i = 0; i < length; i += dimension) {
        output[i] = (180 * input[i]) / HALF_SIZE;
        output[i + 1] =
            (360 * Math.atan(Math.exp(input[i + 1] / RADIUS))) / Math.PI - 90;
    }
    return output;
}

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Semi-major radius of the WGS84 ellipsoid.
 *
 * @const
 * @type {number}
 */
var RADIUS$1 = 6378137;
/**
 * Extent of the EPSG:4326 projection which is the whole world.
 *
 * @const
 * @type {import("../extent.js").Extent}
 */
var EXTENT$1 = [-180, -90, 180, 90];
/**
 * @const
 * @type {number}
 */
var METERS_PER_UNIT$1 = (Math.PI * RADIUS$1) / 180;
/**
 * @classdesc
 * Projection object for WGS84 geographic coordinates (EPSG:4326).
 *
 * Note that OpenLayers does not strictly comply with the EPSG definition.
 * The EPSG registry defines 4326 as a CRS for Latitude,Longitude (y,x).
 * OpenLayers treats EPSG:4326 as a pseudo-projection, with x,y coordinates.
 */
var EPSG4326Projection = /** @class */ (function (_super) {
    __extends$1(EPSG4326Projection, _super);
    /**
     * @param {string} code Code.
     * @param {string} [opt_axisOrientation] Axis orientation.
     */
    function EPSG4326Projection(code, opt_axisOrientation) {
        return _super.call(this, {
            code: code,
            units: Units.DEGREES,
            extent: EXTENT$1,
            axisOrientation: opt_axisOrientation,
            global: true,
            metersPerUnit: METERS_PER_UNIT$1,
            worldExtent: EXTENT$1,
        }) || this;
    }
    return EPSG4326Projection;
}(Projection));
/**
 * Projections equal to EPSG:4326.
 *
 * @const
 * @type {Array<import("./Projection.js").default>}
 */
var PROJECTIONS$1 = [
    new EPSG4326Projection('CRS:84'),
    new EPSG4326Projection('EPSG:4326', 'neu'),
    new EPSG4326Projection('urn:ogc:def:crs:OGC:1.3:CRS84'),
    new EPSG4326Projection('urn:ogc:def:crs:OGC:2:84'),
    new EPSG4326Projection('http://www.opengis.net/def/crs/OGC/1.3/CRS84', 'neu'),
    new EPSG4326Projection('http://www.opengis.net/gml/srs/epsg.xml#4326', 'neu'),
    new EPSG4326Projection('http://www.opengis.net/def/crs/EPSG/0/4326', 'neu'),
];

/**
 * @module ol/proj/projections
 */
/**
 * @type {Object<string, import("./Projection.js").default>}
 */
var cache = {};
/**
 * Get a cached projection by code.
 * @param {string} code The code for the projection.
 * @return {import("./Projection.js").default} The projection (if cached).
 */
function get(code) {
    return (cache[code] ||
        cache[code.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, 'EPSG:$3')] ||
        null);
}
/**
 * Add a projection to the cache.
 * @param {string} code The projection code.
 * @param {import("./Projection.js").default} projection The projection to cache.
 */
function add(code, projection) {
    cache[code] = projection;
}

/**
 * @module ol/proj/transforms
 */
/**
 * @private
 * @type {!Object<string, Object<string, import("../proj.js").TransformFunction>>}
 */
var transforms = {};
/**
 * Registers a conversion function to convert coordinates from the source
 * projection to the destination projection.
 *
 * @param {import("./Projection.js").default} source Source.
 * @param {import("./Projection.js").default} destination Destination.
 * @param {import("../proj.js").TransformFunction} transformFn Transform.
 */
function add$1(source, destination, transformFn) {
    var sourceCode = source.getCode();
    var destinationCode = destination.getCode();
    if (!(sourceCode in transforms)) {
        transforms[sourceCode] = {};
    }
    transforms[sourceCode][destinationCode] = transformFn;
}
/**
 * Get a transform given a source code and a destination code.
 * @param {string} sourceCode The code for the source projection.
 * @param {string} destinationCode The code for the destination projection.
 * @return {import("../proj.js").TransformFunction|undefined} The transform function (if found).
 */
function get$1(sourceCode, destinationCode) {
    var transform;
    if (sourceCode in transforms && destinationCode in transforms[sourceCode]) {
        transform = transforms[sourceCode][destinationCode];
    }
    return transform;
}

/**
 * @module ol/sphere
 */
/**
 * Object literal with options for the {@link getLength} or {@link getArea}
 * functions.
 * @typedef {Object} SphereMetricOptions
 * @property {import("./proj.js").ProjectionLike} [projection='EPSG:3857']
 * Projection of the  geometry.  By default, the geometry is assumed to be in
 * Web Mercator.
 * @property {number} [radius=6371008.8] Sphere radius.  By default, the
 * [mean Earth radius](https://en.wikipedia.org/wiki/Earth_radius#Mean_radius)
 * for the WGS84 ellipsoid is used.
 */
/**
 * The mean Earth radius (1/3 * (2a + b)) for the WGS84 ellipsoid.
 * https://en.wikipedia.org/wiki/Earth_radius#Mean_radius
 * @type {number}
 */
var DEFAULT_RADIUS = 6371008.8;
/**
 * Get the great circle distance (in meters) between two geographic coordinates.
 * @param {Array} c1 Starting coordinate.
 * @param {Array} c2 Ending coordinate.
 * @param {number} [opt_radius] The sphere radius to use.  Defaults to the Earth's
 *     mean radius using the WGS84 ellipsoid.
 * @return {number} The great circle distance between the points (in meters).
 * @api
 */
function getDistance(c1, c2, opt_radius) {
    var radius = opt_radius || DEFAULT_RADIUS;
    var lat1 = toRadians(c1[1]);
    var lat2 = toRadians(c2[1]);
    var deltaLatBy2 = (lat2 - lat1) / 2;
    var deltaLonBy2 = toRadians(c2[0] - c1[0]) / 2;
    var a = Math.sin(deltaLatBy2) * Math.sin(deltaLatBy2) +
        Math.sin(deltaLonBy2) *
            Math.sin(deltaLonBy2) *
            Math.cos(lat1) *
            Math.cos(lat2);
    return 2 * radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * @module ol/proj
 */
/**
 * @param {Array<number>} input Input coordinate array.
 * @param {Array<number>} [opt_output] Output array of coordinate values.
 * @param {number} [opt_dimension] Dimension.
 * @return {Array<number>} Output coordinate array (new array, same coordinate
 *     values).
 */
function cloneTransform(input, opt_output, opt_dimension) {
    var output;
    if (opt_output !== undefined) {
        for (var i = 0, ii = input.length; i < ii; ++i) {
            opt_output[i] = input[i];
        }
        output = opt_output;
    }
    else {
        output = input.slice();
    }
    return output;
}
/**
 * @param {Array<number>} input Input coordinate array.
 * @param {Array<number>} [opt_output] Output array of coordinate values.
 * @param {number} [opt_dimension] Dimension.
 * @return {Array<number>} Input coordinate array (same array as input).
 */
function identityTransform(input, opt_output, opt_dimension) {
    if (opt_output !== undefined && input !== opt_output) {
        for (var i = 0, ii = input.length; i < ii; ++i) {
            opt_output[i] = input[i];
        }
        input = opt_output;
    }
    return input;
}
/**
 * Add a Projection object to the list of supported projections that can be
 * looked up by their code.
 *
 * @param {Projection} projection Projection instance.
 * @api
 */
function addProjection(projection) {
    add(projection.getCode(), projection);
    add$1(projection, projection, cloneTransform);
}
/**
 * @param {Array<Projection>} projections Projections.
 */
function addProjections(projections) {
    projections.forEach(addProjection);
}
/**
 * Fetches a Projection object for the code specified.
 *
 * @param {ProjectionLike} projectionLike Either a code string which is
 *     a combination of authority and identifier such as "EPSG:4326", or an
 *     existing projection object, or undefined.
 * @return {Projection} Projection object, or null if not in list.
 * @api
 */
function get$2(projectionLike) {
    return typeof projectionLike === 'string'
        ? get(/** @type {string} */ (projectionLike))
        : /** @type {Projection} */ (projectionLike) || null;
}
/**
 * Get the resolution of the point in degrees or distance units.
 * For projections with degrees as the unit this will simply return the
 * provided resolution. For other projections the point resolution is
 * by default estimated by transforming the 'point' pixel to EPSG:4326,
 * measuring its width and height on the normal sphere,
 * and taking the average of the width and height.
 * A custom function can be provided for a specific projection, either
 * by setting the `getPointResolution` option in the
 * {@link module:ol/proj/Projection~Projection} constructor or by using
 * {@link module:ol/proj/Projection~Projection#setGetPointResolution} to change an existing
 * projection object.
 * @param {ProjectionLike} projection The projection.
 * @param {number} resolution Nominal resolution in projection units.
 * @param {import("./coordinate.js").Coordinate} point Point to find adjusted resolution at.
 * @param {import("./proj/Units.js").default} [opt_units] Units to get the point resolution in.
 * Default is the projection's units.
 * @return {number} Point resolution.
 * @api
 */
function getPointResolution(projection, resolution, point, opt_units) {
    projection = get$2(projection);
    var pointResolution;
    var getter = projection.getPointResolutionFunc();
    if (getter) {
        pointResolution = getter(resolution, point);
        if (opt_units && opt_units !== projection.getUnits()) {
            var metersPerUnit = projection.getMetersPerUnit();
            if (metersPerUnit) {
                pointResolution =
                    (pointResolution * metersPerUnit) / METERS_PER_UNIT[opt_units];
            }
        }
    }
    else {
        var units = projection.getUnits();
        if ((units == Units.DEGREES && !opt_units) || opt_units == Units.DEGREES) {
            pointResolution = resolution;
        }
        else {
            // Estimate point resolution by transforming the center pixel to EPSG:4326,
            // measuring its width and height on the normal sphere, and taking the
            // average of the width and height.
            var toEPSG4326_1 = getTransformFromProjections(projection, get$2('EPSG:4326'));
            if (toEPSG4326_1 === identityTransform && units !== Units.DEGREES) {
                // no transform is available
                pointResolution = resolution * projection.getMetersPerUnit();
            }
            else {
                var vertices = [
                    point[0] - resolution / 2,
                    point[1],
                    point[0] + resolution / 2,
                    point[1],
                    point[0],
                    point[1] - resolution / 2,
                    point[0],
                    point[1] + resolution / 2,
                ];
                vertices = toEPSG4326_1(vertices, vertices, 2);
                var width = getDistance(vertices.slice(0, 2), vertices.slice(2, 4));
                var height = getDistance(vertices.slice(4, 6), vertices.slice(6, 8));
                pointResolution = (width + height) / 2;
            }
            var metersPerUnit = opt_units
                ? METERS_PER_UNIT[opt_units]
                : projection.getMetersPerUnit();
            if (metersPerUnit !== undefined) {
                pointResolution /= metersPerUnit;
            }
        }
    }
    return pointResolution;
}
/**
 * Registers transformation functions that don't alter coordinates. Those allow
 * to transform between projections with equal meaning.
 *
 * @param {Array<Projection>} projections Projections.
 * @api
 */
function addEquivalentProjections(projections) {
    addProjections(projections);
    projections.forEach(function (source) {
        projections.forEach(function (destination) {
            if (source !== destination) {
                add$1(source, destination, cloneTransform);
            }
        });
    });
}
/**
 * Registers transformation functions to convert coordinates in any projection
 * in projection1 to any projection in projection2.
 *
 * @param {Array<Projection>} projections1 Projections with equal
 *     meaning.
 * @param {Array<Projection>} projections2 Projections with equal
 *     meaning.
 * @param {TransformFunction} forwardTransform Transformation from any
 *   projection in projection1 to any projection in projection2.
 * @param {TransformFunction} inverseTransform Transform from any projection
 *   in projection2 to any projection in projection1..
 */
function addEquivalentTransforms(projections1, projections2, forwardTransform, inverseTransform) {
    projections1.forEach(function (projection1) {
        projections2.forEach(function (projection2) {
            add$1(projection1, projection2, forwardTransform);
            add$1(projection2, projection1, inverseTransform);
        });
    });
}
/**
 * @param {Projection|string|undefined} projection Projection.
 * @param {string} defaultCode Default code.
 * @return {Projection} Projection.
 */
function createProjection(projection, defaultCode) {
    if (!projection) {
        return get$2(defaultCode);
    }
    else if (typeof projection === 'string') {
        return get$2(projection);
    }
    else {
        return /** @type {Projection} */ (projection);
    }
}
/**
 * Transforms a coordinate from longitude/latitude to a different projection.
 * @param {import("./coordinate.js").Coordinate} coordinate Coordinate as longitude and latitude, i.e.
 *     an array with longitude as 1st and latitude as 2nd element.
 * @param {ProjectionLike} [opt_projection] Target projection. The
 *     default is Web Mercator, i.e. 'EPSG:3857'.
 * @return {import("./coordinate.js").Coordinate} Coordinate projected to the target projection.
 * @api
 */
function fromLonLat(coordinate, opt_projection) {
    return transform(coordinate, 'EPSG:4326', opt_projection !== undefined ? opt_projection : 'EPSG:3857');
}
/**
 * Checks if two projections are the same, that is every coordinate in one
 * projection does represent the same geographic point as the same coordinate in
 * the other projection.
 *
 * @param {Projection} projection1 Projection 1.
 * @param {Projection} projection2 Projection 2.
 * @return {boolean} Equivalent.
 * @api
 */
function equivalent(projection1, projection2) {
    if (projection1 === projection2) {
        return true;
    }
    var equalUnits = projection1.getUnits() === projection2.getUnits();
    if (projection1.getCode() === projection2.getCode()) {
        return equalUnits;
    }
    else {
        var transformFunc = getTransformFromProjections(projection1, projection2);
        return transformFunc === cloneTransform && equalUnits;
    }
}
/**
 * Searches in the list of transform functions for the function for converting
 * coordinates from the source projection to the destination projection.
 *
 * @param {Projection} sourceProjection Source Projection object.
 * @param {Projection} destinationProjection Destination Projection
 *     object.
 * @return {TransformFunction} Transform function.
 */
function getTransformFromProjections(sourceProjection, destinationProjection) {
    var sourceCode = sourceProjection.getCode();
    var destinationCode = destinationProjection.getCode();
    var transformFunc = get$1(sourceCode, destinationCode);
    if (!transformFunc) {
        transformFunc = identityTransform;
    }
    return transformFunc;
}
/**
 * Given the projection-like objects, searches for a transformation
 * function to convert a coordinates array from the source projection to the
 * destination projection.
 *
 * @param {ProjectionLike} source Source.
 * @param {ProjectionLike} destination Destination.
 * @return {TransformFunction} Transform function.
 * @api
 */
function getTransform(source, destination) {
    var sourceProjection = get$2(source);
    var destinationProjection = get$2(destination);
    return getTransformFromProjections(sourceProjection, destinationProjection);
}
/**
 * Transforms a coordinate from source projection to destination projection.
 * This returns a new coordinate (and does not modify the original).
 *
 * See {@link module:ol/proj.transformExtent} for extent transformation.
 * See the transform method of {@link module:ol/geom/Geometry~Geometry} and its
 * subclasses for geometry transforms.
 *
 * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
 * @param {ProjectionLike} source Source projection-like.
 * @param {ProjectionLike} destination Destination projection-like.
 * @return {import("./coordinate.js").Coordinate} Coordinate.
 * @api
 */
function transform(coordinate, source, destination) {
    var transformFunc = getTransform(source, destination);
    return transformFunc(coordinate, undefined, coordinate.length);
}
/**
 * @type {?Projection}
 */
var userProjection = null;
/**
 * Get the projection for coordinates supplied from and returned by API methods.
 * Note that this method is not yet a part of the stable API.  Support for user
 * projections is not yet complete and should be considered experimental.
 * @return {?Projection} The user projection (or null if not set).
 */
function getUserProjection() {
    return userProjection;
}
/**
 * Return a coordinate transformed into the user projection.  If no user projection
 * is set, the original coordinate is returned.
 * @param {Array<number>} coordinate Input coordinate.
 * @param {ProjectionLike} sourceProjection The input coordinate projection.
 * @return {Array<number>} The input coordinate in the user projection.
 */
function toUserCoordinate(coordinate, sourceProjection) {
    {
        return coordinate;
    }
}
/**
 * Return a coordinate transformed from the user projection.  If no user projection
 * is set, the original coordinate is returned.
 * @param {Array<number>} coordinate Input coordinate.
 * @param {ProjectionLike} destProjection The destination projection.
 * @return {Array<number>} The input coordinate transformed.
 */
function fromUserCoordinate(coordinate, destProjection) {
    {
        return coordinate;
    }
}
/**
 * Return an extent transformed into the user projection.  If no user projection
 * is set, the original extent is returned.
 * @param {import("./extent.js").Extent} extent Input extent.
 * @param {ProjectionLike} sourceProjection The input extent projection.
 * @return {import("./extent.js").Extent} The input extent in the user projection.
 */
function toUserExtent(extent, sourceProjection) {
    {
        return extent;
    }
}
/**
 * Return an extent transformed from the user projection.  If no user projection
 * is set, the original extent is returned.
 * @param {import("./extent.js").Extent} extent Input extent.
 * @param {ProjectionLike} destProjection The destination projection.
 * @return {import("./extent.js").Extent} The input extent transformed.
 */
function fromUserExtent(extent, destProjection) {
    {
        return extent;
    }
}
/**
 * Add transforms to and from EPSG:4326 and EPSG:3857.  This function is called
 * by when this module is executed and should only need to be called again after
 * `clearAllProjections()` is called (e.g. in tests).
 */
function addCommon() {
    // Add transformations that don't alter coordinates to convert within set of
    // projections with equal meaning.
    addEquivalentProjections(PROJECTIONS);
    addEquivalentProjections(PROJECTIONS$1);
    // Add transformations to convert EPSG:4326 like coordinates to EPSG:3857 like
    // coordinates and back.
    addEquivalentTransforms(PROJECTIONS$1, PROJECTIONS, fromEPSG4326, toEPSG4326);
}
addCommon();

export { METERS_PER_UNIT as M, Units as U, fromUserExtent as a, toUserExtent as b, createProjection as c, get$2 as d, getTransform as e, fromUserCoordinate as f, getUserProjection as g, fromLonLat as h, transform as i, getPointResolution as j, equivalent as k, toUserCoordinate as t };
