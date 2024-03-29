import { C as Collection, a as CollectionEventType } from '../../common/Collection-5517f676.js';
import { g as getUid, p as isEmpty, V as VOID, e as BaseEvent, a as assert, l as listen, E as EventType, O as ObjectEventType, u as unlistenByKey, j as extend, k as getValues, T as TRUE } from '../../common/asserts-e0c6c4d5.js';
import { R as RBush$1 } from '../../common/index-ba7ecc3e.js';
import { e as equals, B as createOrUpdate, p as containsExtent } from '../../common/extent-0b32e3b6.js';
import { S as Source } from '../../common/Source-c28a9da7.js';
import { S as SourceState } from '../../common/State-c7a16ea4.js';
import '../../common/proj-8f373c44.js';
import '../../common/math-b0fe2752.js';

/**
 * @module ol/structs/RBush
 */
/**
 * @typedef {Object} Entry
 * @property {number} minX MinX.
 * @property {number} minY MinY.
 * @property {number} maxX MaxX.
 * @property {number} maxY MaxY.
 * @property {Object} [value] Value.
 */
/**
 * @classdesc
 * Wrapper around the RBush by Vladimir Agafonkin.
 * See https://github.com/mourner/rbush.
 *
 * @template T
 */
var RBush = /** @class */ (function () {
    /**
     * @param {number} [opt_maxEntries] Max entries.
     */
    function RBush(opt_maxEntries) {
        /**
         * @private
         */
        this.rbush_ = new RBush$1(opt_maxEntries);
        /**
         * A mapping between the objects added to this rbush wrapper
         * and the objects that are actually added to the internal rbush.
         * @private
         * @type {Object<string, Entry>}
         */
        this.items_ = {};
    }
    /**
     * Insert a value into the RBush.
     * @param {import("../extent.js").Extent} extent Extent.
     * @param {T} value Value.
     */
    RBush.prototype.insert = function (extent, value) {
        /** @type {Entry} */
        var item = {
            minX: extent[0],
            minY: extent[1],
            maxX: extent[2],
            maxY: extent[3],
            value: value,
        };
        this.rbush_.insert(item);
        this.items_[getUid(value)] = item;
    };
    /**
     * Bulk-insert values into the RBush.
     * @param {Array<import("../extent.js").Extent>} extents Extents.
     * @param {Array<T>} values Values.
     */
    RBush.prototype.load = function (extents, values) {
        var items = new Array(values.length);
        for (var i = 0, l = values.length; i < l; i++) {
            var extent = extents[i];
            var value = values[i];
            /** @type {Entry} */
            var item = {
                minX: extent[0],
                minY: extent[1],
                maxX: extent[2],
                maxY: extent[3],
                value: value,
            };
            items[i] = item;
            this.items_[getUid(value)] = item;
        }
        this.rbush_.load(items);
    };
    /**
     * Remove a value from the RBush.
     * @param {T} value Value.
     * @return {boolean} Removed.
     */
    RBush.prototype.remove = function (value) {
        var uid = getUid(value);
        // get the object in which the value was wrapped when adding to the
        // internal rbush. then use that object to do the removal.
        var item = this.items_[uid];
        delete this.items_[uid];
        return this.rbush_.remove(item) !== null;
    };
    /**
     * Update the extent of a value in the RBush.
     * @param {import("../extent.js").Extent} extent Extent.
     * @param {T} value Value.
     */
    RBush.prototype.update = function (extent, value) {
        var item = this.items_[getUid(value)];
        var bbox = [item.minX, item.minY, item.maxX, item.maxY];
        if (!equals(bbox, extent)) {
            this.remove(value);
            this.insert(extent, value);
        }
    };
    /**
     * Return all values in the RBush.
     * @return {Array<T>} All.
     */
    RBush.prototype.getAll = function () {
        var items = this.rbush_.all();
        return items.map(function (item) {
            return item.value;
        });
    };
    /**
     * Return all values in the given extent.
     * @param {import("../extent.js").Extent} extent Extent.
     * @return {Array<T>} All in extent.
     */
    RBush.prototype.getInExtent = function (extent) {
        /** @type {Entry} */
        var bbox = {
            minX: extent[0],
            minY: extent[1],
            maxX: extent[2],
            maxY: extent[3],
        };
        var items = this.rbush_.search(bbox);
        return items.map(function (item) {
            return item.value;
        });
    };
    /**
     * Calls a callback function with each value in the tree.
     * If the callback returns a truthy value, this value is returned without
     * checking the rest of the tree.
     * @param {function(T): *} callback Callback.
     * @return {*} Callback return value.
     */
    RBush.prototype.forEach = function (callback) {
        return this.forEach_(this.getAll(), callback);
    };
    /**
     * Calls a callback function with each value in the provided extent.
     * @param {import("../extent.js").Extent} extent Extent.
     * @param {function(T): *} callback Callback.
     * @return {*} Callback return value.
     */
    RBush.prototype.forEachInExtent = function (extent, callback) {
        return this.forEach_(this.getInExtent(extent), callback);
    };
    /**
     * @param {Array<T>} values Values.
     * @param {function(T): *} callback Callback.
     * @private
     * @return {*} Callback return value.
     */
    RBush.prototype.forEach_ = function (values, callback) {
        var result;
        for (var i = 0, l = values.length; i < l; i++) {
            result = callback(values[i]);
            if (result) {
                return result;
            }
        }
        return result;
    };
    /**
     * @return {boolean} Is empty.
     */
    RBush.prototype.isEmpty = function () {
        return isEmpty(this.items_);
    };
    /**
     * Remove all values from the RBush.
     */
    RBush.prototype.clear = function () {
        this.rbush_.clear();
        this.items_ = {};
    };
    /**
     * @param {import("../extent.js").Extent} [opt_extent] Extent.
     * @return {import("../extent.js").Extent} Extent.
     */
    RBush.prototype.getExtent = function (opt_extent) {
        var data = this.rbush_.toJSON();
        return createOrUpdate(data.minX, data.minY, data.maxX, data.maxY, opt_extent);
    };
    /**
     * @param {RBush} rbush R-Tree.
     */
    RBush.prototype.concat = function (rbush) {
        this.rbush_.load(rbush.rbush_.all());
        for (var i in rbush.items_) {
            this.items_[i] = rbush.items_[i];
        }
    };
    return RBush;
}());

/**
 * @module ol/source/VectorEventType
 */
/**
 * @enum {string}
 */
var VectorEventType = {
    /**
     * Triggered when a feature is added to the source.
     * @event module:ol/source/Vector.VectorSourceEvent#addfeature
     * @api
     */
    ADDFEATURE: 'addfeature',
    /**
     * Triggered when a feature is updated.
     * @event module:ol/source/Vector.VectorSourceEvent#changefeature
     * @api
     */
    CHANGEFEATURE: 'changefeature',
    /**
     * Triggered when the clear method is called on the source.
     * @event module:ol/source/Vector.VectorSourceEvent#clear
     * @api
     */
    CLEAR: 'clear',
    /**
     * Triggered when a feature is removed from the source.
     * See {@link module:ol/source/Vector~VectorSource#clear source.clear()} for exceptions.
     * @event module:ol/source/Vector.VectorSourceEvent#removefeature
     * @api
     */
    REMOVEFEATURE: 'removefeature',
    /**
     * Triggered when features starts loading.
     * @event module:ol/source/Vector.VectorSourceEvent#featuresloadstart
     * @api
     */
    FEATURESLOADSTART: 'featuresloadstart',
    /**
     * Triggered when features finishes loading.
     * @event module:ol/source/Vector.VectorSourceEvent#featuresloadend
     * @api
     */
    FEATURESLOADEND: 'featuresloadend',
    /**
     * Triggered if feature loading results in an error.
     * @event module:ol/source/Vector.VectorSourceEvent#featuresloaderror
     * @api
     */
    FEATURESLOADERROR: 'featuresloaderror',
};
/**
 * @typedef {'addfeature'|'changefeature'|'clear'|'removefeature'|'featuresloadstart'|'featuresloadend'|'featuresloaderror'} VectorSourceEventTypes
 */

/**
 * @module ol/loadingstrategy
 */
/**
 * Strategy function for loading all features with a single request.
 * @param {import("./extent.js").Extent} extent Extent.
 * @param {number} resolution Resolution.
 * @return {Array<import("./extent.js").Extent>} Extents.
 * @api
 */
function all(extent, resolution) {
    return [[-Infinity, -Infinity, Infinity, Infinity]];
}

/**
 * @module ol/format/FormatType
 */
/**
 * @enum {string}
 */
var FormatType = {
    ARRAY_BUFFER: 'arraybuffer',
    JSON: 'json',
    TEXT: 'text',
    XML: 'xml',
};

/**
 * @module ol/featureloader
 */
/**
 *
 * @type {boolean}
 * @private
 */
var withCredentials = false;
/**
 * {@link module:ol/source/Vector} sources use a function of this type to
 * load features.
 *
 * This function takes up to 5 arguments. These are an {@link module:ol/extent~Extent} representing
 * the area to be loaded, a `{number}` representing the resolution (map units per pixel), an
 * {@link module:ol/proj/Projection} for the projection, an optional success callback that should get
 * the loaded features passed as an argument and an optional failure callback with no arguments. If
 * the callbacks are not used, the corresponding vector source will not fire `'featuresloadend'` and
 * `'featuresloaderror'` events. `this` within the function is bound to the
 * {@link module:ol/source/Vector} it's called from.
 *
 * The function is responsible for loading the features and adding them to the
 * source.
 * @typedef {function(this:(import("./source/Vector").default|import("./VectorTile.js").default),
 *           import("./extent.js").Extent,
 *           number,
 *           import("./proj/Projection.js").default,
 *           function(Array<import("./Feature.js").default>): void=,
 *           function(): void=): void} FeatureLoader
 * @api
 */
/**
 * {@link module:ol/source/Vector} sources use a function of this type to
 * get the url to load features from.
 *
 * This function takes an {@link module:ol/extent~Extent} representing the area
 * to be loaded, a `{number}` representing the resolution (map units per pixel)
 * and an {@link module:ol/proj/Projection} for the projection  as
 * arguments and returns a `{string}` representing the URL.
 * @typedef {function(import("./extent.js").Extent, number, import("./proj/Projection.js").default): string} FeatureUrlFunction
 * @api
 */
/**
 * @param {string|FeatureUrlFunction} url Feature URL service.
 * @param {import("./format/Feature.js").default} format Feature format.
 * @param {import("./extent.js").Extent} extent Extent.
 * @param {number} resolution Resolution.
 * @param {import("./proj/Projection.js").default} projection Projection.
 * @param {function(Array<import("./Feature.js").default>, import("./proj/Projection.js").default): void} success Success
 *      Function called with the loaded features and optionally with the data projection.
 * @param {function(): void} failure Failure
 *      Function called when loading failed.
 */
function loadFeaturesXhr(url, format, extent, resolution, projection, success, failure) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', typeof url === 'function' ? url(extent, resolution, projection) : url, true);
    if (format.getType() == FormatType.ARRAY_BUFFER) {
        xhr.responseType = 'arraybuffer';
    }
    xhr.withCredentials = withCredentials;
    /**
     * @param {Event} event Event.
     * @private
     */
    xhr.onload = function (event) {
        // status will be 0 for file:// urls
        if (!xhr.status || (xhr.status >= 200 && xhr.status < 300)) {
            var type = format.getType();
            /** @type {Document|Node|Object|string|undefined} */
            var source = void 0;
            if (type == FormatType.JSON || type == FormatType.TEXT) {
                source = xhr.responseText;
            }
            else if (type == FormatType.XML) {
                source = xhr.responseXML;
                if (!source) {
                    source = new DOMParser().parseFromString(xhr.responseText, 'application/xml');
                }
            }
            else if (type == FormatType.ARRAY_BUFFER) {
                source = /** @type {ArrayBuffer} */ (xhr.response);
            }
            if (source) {
                success(
                /** @type {Array<import("./Feature.js").default>} */
                (format.readFeatures(source, {
                    extent: extent,
                    featureProjection: projection,
                })), format.readProjection(source));
            }
            else {
                failure();
            }
        }
        else {
            failure();
        }
    };
    /**
     * @private
     */
    xhr.onerror = failure;
    xhr.send();
}
/**
 * Create an XHR feature loader for a `url` and `format`. The feature loader
 * loads features (with XHR), parses the features, and adds them to the
 * vector source.
 * @param {string|FeatureUrlFunction} url Feature URL service.
 * @param {import("./format/Feature.js").default} format Feature format.
 * @return {FeatureLoader} The feature loader.
 * @api
 */
function xhr(url, format) {
    /**
     * @param {import("./extent.js").Extent} extent Extent.
     * @param {number} resolution Resolution.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @param {function(Array<import("./Feature.js").default>): void} [success] Success
     *      Function called when loading succeeded.
     * @param {function(): void} [failure] Failure
     *      Function called when loading failed.
     * @this {import("./source/Vector").default}
     */
    return function (extent, resolution, projection, success, failure) {
        var source = /** @type {import("./source/Vector").default} */ (this);
        loadFeaturesXhr(url, format, extent, resolution, projection, 
        /**
         * @param {Array<import("./Feature.js").default>} features The loaded features.
         * @param {import("./proj/Projection.js").default} dataProjection Data
         * projection.
         */
        function (features, dataProjection) {
            source.addFeatures(features);
            if (success !== undefined) {
                success(features);
            }
        }, 
        /* FIXME handle error */ failure ? failure : VOID);
    };
}

/**
 * @module ol/source/Vector
 */
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
 * A function that takes an {@link module:ol/extent~Extent} and a resolution as arguments, and
 * returns an array of {@link module:ol/extent~Extent} with the extents to load. Usually this
 * is one of the standard {@link module:ol/loadingstrategy} strategies.
 *
 * @typedef {function(import("../extent.js").Extent, number, import("../proj/Projection.js").default): Array<import("../extent.js").Extent>} LoadingStrategy
 * @api
 */
/**
 * @classdesc
 * Events emitted by {@link module:ol/source/Vector} instances are instances of this
 * type.
 * @template {import("../geom/Geometry.js").default} Geometry
 */
var VectorSourceEvent = /** @class */ (function (_super) {
    __extends(VectorSourceEvent, _super);
    /**
     * @param {string} type Type.
     * @param {import("../Feature.js").default<Geometry>} [opt_feature] Feature.
     * @param {Array<import("../Feature.js").default<Geometry>>} [opt_features] Features.
     */
    function VectorSourceEvent(type, opt_feature, opt_features) {
        var _this = _super.call(this, type) || this;
        /**
         * The added or removed feature for the `ADDFEATURE` and `REMOVEFEATURE` events, `undefined` otherwise.
         * @type {import("../Feature.js").default<Geometry>|undefined}
         * @api
         */
        _this.feature = opt_feature;
        /**
         * The loaded features for the `FEATURESLOADED` event, `undefined` otherwise.
         * @type {Array<import("../Feature.js").default<Geometry>>|undefined}
         * @api
         */
        _this.features = opt_features;
        return _this;
    }
    return VectorSourceEvent;
}(BaseEvent));
/***
 * @template Return
 * @typedef {import("../Observable").OnSignature<import("../Observable").EventTypes, import("../events/Event.js").default, Return> &
 *   import("../Observable").OnSignature<import("../ObjectEventType").Types, import("../Object").ObjectEvent, Return> &
 *   import("../Observable").OnSignature<import("./VectorEventType").VectorSourceEventTypes, VectorSourceEvent, Return> &
 *   import("../Observable").CombinedOnSignature<import("../Observable").EventTypes|import("../ObjectEventType").Types|
 *     import("./VectorEventType").VectorSourceEventTypes, Return>} VectorSourceOnSignature
 */
/**
 * @typedef {Object} Options
 * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
 * @property {Array<import("../Feature.js").default>|Collection<import("../Feature.js").default>} [features]
 * Features. If provided as {@link module:ol/Collection}, the features in the source
 * and the collection will stay in sync.
 * @property {import("../format/Feature.js").default} [format] The feature format used by the XHR
 * feature loader when `url` is set. Required if `url` is set, otherwise ignored.
 * @property {import("../featureloader.js").FeatureLoader} [loader]
 * The loader function used to load features, from a remote source for example.
 * If this is not set and `url` is set, the source will create and use an XHR
 * feature loader. The `'featuresloadend'` and `'featuresloaderror'` events
 * will only fire if the `success` and `failure` callbacks are used.
 *
 * Example:
 *
 * ```js
 * import {Vector} from 'ol/source';
 * import {GeoJSON} from 'ol/format';
 * import {bbox} from 'ol/loadingstrategy';
 *
 * var vectorSource = new Vector({
 *   format: new GeoJSON(),
 *   loader: function(extent, resolution, projection, success, failure) {
 *      var proj = projection.getCode();
 *      var url = 'https://ahocevar.com/geoserver/wfs?service=WFS&' +
 *          'version=1.1.0&request=GetFeature&typename=osm:water_areas&' +
 *          'outputFormat=application/json&srsname=' + proj + '&' +
 *          'bbox=' + extent.join(',') + ',' + proj;
 *      var xhr = new XMLHttpRequest();
 *      xhr.open('GET', url);
 *      var onError = function() {
 *        vectorSource.removeLoadedExtent(extent);
 *        failure();
 *      }
 *      xhr.onerror = onError;
 *      xhr.onload = function() {
 *        if (xhr.status == 200) {
 *          var features = vectorSource.getFormat().readFeatures(xhr.responseText);
 *          vectorSource.addFeatures(features);
 *          success(features);
 *        } else {
 *          onError();
 *        }
 *      }
 *      xhr.send();
 *    },
 *    strategy: bbox
 *  });
 * ```
 * @property {boolean} [overlaps=true] This source may have overlapping geometries.
 * Setting this to `false` (e.g. for sources with polygons that represent administrative
 * boundaries or TopoJSON sources) allows the renderer to optimise fill and
 * stroke operations.
 * @property {LoadingStrategy} [strategy] The loading strategy to use.
 * By default an {@link module:ol/loadingstrategy.all}
 * strategy is used, a one-off strategy which loads all features at once.
 * @property {string|import("../featureloader.js").FeatureUrlFunction} [url]
 * Setting this option instructs the source to load features using an XHR loader
 * (see {@link module:ol/featureloader.xhr}). Use a `string` and an
 * {@link module:ol/loadingstrategy.all} for a one-off download of all features from
 * the given URL. Use a {@link module:ol/featureloader~FeatureUrlFunction} to generate the url with
 * other loading strategies.
 * Requires `format` to be set as well.
 * When default XHR feature loader is provided, the features will
 * be transformed from the data projection to the view projection
 * during parsing. If your remote data source does not advertise its projection
 * properly, this transformation will be incorrect. For some formats, the
 * default projection (usually EPSG:4326) can be overridden by setting the
 * dataProjection constructor option on the format.
 * Note that if a source contains non-feature data, such as a GeoJSON geometry
 * or a KML NetworkLink, these will be ignored. Use a custom loader to load these.
 * @property {boolean} [useSpatialIndex=true]
 * By default, an RTree is used as spatial index. When features are removed and
 * added frequently, and the total number of features is low, setting this to
 * `false` may improve performance.
 *
 * Note that
 * {@link module:ol/source/Vector~VectorSource#getFeaturesInExtent},
 * {@link module:ol/source/Vector~VectorSource#getClosestFeatureToCoordinate} and
 * {@link module:ol/source/Vector~VectorSource#getExtent} cannot be used when `useSpatialIndex` is
 * set to `false`, and {@link module:ol/source/Vector~VectorSource#forEachFeatureInExtent} will loop
 * through all features.
 *
 * When set to `false`, the features will be maintained in an
 * {@link module:ol/Collection}, which can be retrieved through
 * {@link module:ol/source/Vector~VectorSource#getFeaturesCollection}.
 * @property {boolean} [wrapX=true] Wrap the world horizontally. For vector editing across the
 * -180° and 180° meridians to work properly, this should be set to `false`. The
 * resulting geometry coordinates will then exceed the world bounds.
 */
/**
 * @classdesc
 * Provides a source of features for vector layers. Vector features provided
 * by this source are suitable for editing. See {@link module:ol/source/VectorTile~VectorTile} for
 * vector data that is optimized for rendering.
 *
 * @fires VectorSourceEvent
 * @api
 * @template {import("../geom/Geometry.js").default} Geometry
 */
var VectorSource = /** @class */ (function (_super) {
    __extends(VectorSource, _super);
    /**
     * @param {Options} [opt_options] Vector source options.
     */
    function VectorSource(opt_options) {
        var _this = this;
        var options = opt_options || {};
        _this = _super.call(this, {
            attributions: options.attributions,
            projection: undefined,
            state: SourceState.READY,
            wrapX: options.wrapX !== undefined ? options.wrapX : true,
        }) || this;
        /***
         * @type {VectorSourceOnSignature<import("../events").EventsKey>}
         */
        _this.on;
        /***
         * @type {VectorSourceOnSignature<import("../events").EventsKey>}
         */
        _this.once;
        /***
         * @type {VectorSourceOnSignature<void>}
         */
        _this.un;
        /**
         * @private
         * @type {import("../featureloader.js").FeatureLoader}
         */
        _this.loader_ = VOID;
        /**
         * @private
         * @type {import("../format/Feature.js").default|undefined}
         */
        _this.format_ = options.format;
        /**
         * @private
         * @type {boolean}
         */
        _this.overlaps_ = options.overlaps === undefined ? true : options.overlaps;
        /**
         * @private
         * @type {string|import("../featureloader.js").FeatureUrlFunction|undefined}
         */
        _this.url_ = options.url;
        if (options.loader !== undefined) {
            _this.loader_ = options.loader;
        }
        else if (_this.url_ !== undefined) {
            assert(_this.format_, 7); // `format` must be set when `url` is set
            // create a XHR feature loader for "url" and "format"
            _this.loader_ = xhr(_this.url_, 
            /** @type {import("../format/Feature.js").default} */ (_this.format_));
        }
        /**
         * @private
         * @type {LoadingStrategy}
         */
        _this.strategy_ =
            options.strategy !== undefined ? options.strategy : all;
        var useSpatialIndex = options.useSpatialIndex !== undefined ? options.useSpatialIndex : true;
        /**
         * @private
         * @type {RBush<import("../Feature.js").default<Geometry>>}
         */
        _this.featuresRtree_ = useSpatialIndex ? new RBush() : null;
        /**
         * @private
         * @type {RBush<{extent: import("../extent.js").Extent}>}
         */
        _this.loadedExtentsRtree_ = new RBush();
        /**
         * @type {number}
         * @private
         */
        _this.loadingExtentsCount_ = 0;
        /**
         * @private
         * @type {!Object<string, import("../Feature.js").default<Geometry>>}
         */
        _this.nullGeometryFeatures_ = {};
        /**
         * A lookup of features by id (the return from feature.getId()).
         * @private
         * @type {!Object<string, import("../Feature.js").default<Geometry>>}
         */
        _this.idIndex_ = {};
        /**
         * A lookup of features by uid (using getUid(feature)).
         * @private
         * @type {!Object<string, import("../Feature.js").default<Geometry>>}
         */
        _this.uidIndex_ = {};
        /**
         * @private
         * @type {Object<string, Array<import("../events.js").EventsKey>>}
         */
        _this.featureChangeKeys_ = {};
        /**
         * @private
         * @type {Collection<import("../Feature.js").default<Geometry>>}
         */
        _this.featuresCollection_ = null;
        var collection, features;
        if (Array.isArray(options.features)) {
            features = options.features;
        }
        else if (options.features) {
            collection = options.features;
            features = collection.getArray();
        }
        if (!useSpatialIndex && collection === undefined) {
            collection = new Collection(features);
        }
        if (features !== undefined) {
            _this.addFeaturesInternal(features);
        }
        if (collection !== undefined) {
            _this.bindFeaturesCollection_(collection);
        }
        return _this;
    }
    /**
     * Add a single feature to the source.  If you want to add a batch of features
     * at once, call {@link module:ol/source/Vector~VectorSource#addFeatures #addFeatures()}
     * instead. A feature will not be added to the source if feature with
     * the same id is already there. The reason for this behavior is to avoid
     * feature duplication when using bbox or tile loading strategies.
     * Note: this also applies if an {@link module:ol/Collection} is used for features,
     * meaning that if a feature with a duplicate id is added in the collection, it will
     * be removed from it right away.
     * @param {import("../Feature.js").default<Geometry>} feature Feature to add.
     * @api
     */
    VectorSource.prototype.addFeature = function (feature) {
        this.addFeatureInternal(feature);
        this.changed();
    };
    /**
     * Add a feature without firing a `change` event.
     * @param {import("../Feature.js").default<Geometry>} feature Feature.
     * @protected
     */
    VectorSource.prototype.addFeatureInternal = function (feature) {
        var featureKey = getUid(feature);
        if (!this.addToIndex_(featureKey, feature)) {
            if (this.featuresCollection_) {
                this.featuresCollection_.remove(feature);
            }
            return;
        }
        this.setupChangeEvents_(featureKey, feature);
        var geometry = feature.getGeometry();
        if (geometry) {
            var extent = geometry.getExtent();
            if (this.featuresRtree_) {
                this.featuresRtree_.insert(extent, feature);
            }
        }
        else {
            this.nullGeometryFeatures_[featureKey] = feature;
        }
        this.dispatchEvent(new VectorSourceEvent(VectorEventType.ADDFEATURE, feature));
    };
    /**
     * @param {string} featureKey Unique identifier for the feature.
     * @param {import("../Feature.js").default<Geometry>} feature The feature.
     * @private
     */
    VectorSource.prototype.setupChangeEvents_ = function (featureKey, feature) {
        this.featureChangeKeys_[featureKey] = [
            listen(feature, EventType.CHANGE, this.handleFeatureChange_, this),
            listen(feature, ObjectEventType.PROPERTYCHANGE, this.handleFeatureChange_, this),
        ];
    };
    /**
     * @param {string} featureKey Unique identifier for the feature.
     * @param {import("../Feature.js").default<Geometry>} feature The feature.
     * @return {boolean} The feature is "valid", in the sense that it is also a
     *     candidate for insertion into the Rtree.
     * @private
     */
    VectorSource.prototype.addToIndex_ = function (featureKey, feature) {
        var valid = true;
        var id = feature.getId();
        if (id !== undefined) {
            if (!(id.toString() in this.idIndex_)) {
                this.idIndex_[id.toString()] = feature;
            }
            else {
                valid = false;
            }
        }
        if (valid) {
            assert(!(featureKey in this.uidIndex_), 30); // The passed `feature` was already added to the source
            this.uidIndex_[featureKey] = feature;
        }
        return valid;
    };
    /**
     * Add a batch of features to the source.
     * @param {Array<import("../Feature.js").default<Geometry>>} features Features to add.
     * @api
     */
    VectorSource.prototype.addFeatures = function (features) {
        this.addFeaturesInternal(features);
        this.changed();
    };
    /**
     * Add features without firing a `change` event.
     * @param {Array<import("../Feature.js").default<Geometry>>} features Features.
     * @protected
     */
    VectorSource.prototype.addFeaturesInternal = function (features) {
        var extents = [];
        var newFeatures = [];
        var geometryFeatures = [];
        for (var i = 0, length_1 = features.length; i < length_1; i++) {
            var feature = features[i];
            var featureKey = getUid(feature);
            if (this.addToIndex_(featureKey, feature)) {
                newFeatures.push(feature);
            }
        }
        for (var i = 0, length_2 = newFeatures.length; i < length_2; i++) {
            var feature = newFeatures[i];
            var featureKey = getUid(feature);
            this.setupChangeEvents_(featureKey, feature);
            var geometry = feature.getGeometry();
            if (geometry) {
                var extent = geometry.getExtent();
                extents.push(extent);
                geometryFeatures.push(feature);
            }
            else {
                this.nullGeometryFeatures_[featureKey] = feature;
            }
        }
        if (this.featuresRtree_) {
            this.featuresRtree_.load(extents, geometryFeatures);
        }
        for (var i = 0, length_3 = newFeatures.length; i < length_3; i++) {
            this.dispatchEvent(new VectorSourceEvent(VectorEventType.ADDFEATURE, newFeatures[i]));
        }
    };
    /**
     * @param {!Collection<import("../Feature.js").default<Geometry>>} collection Collection.
     * @private
     */
    VectorSource.prototype.bindFeaturesCollection_ = function (collection) {
        var modifyingCollection = false;
        this.addEventListener(VectorEventType.ADDFEATURE, 
        /**
         * @param {VectorSourceEvent<Geometry>} evt The vector source event
         */
        function (evt) {
            if (!modifyingCollection) {
                modifyingCollection = true;
                collection.push(evt.feature);
                modifyingCollection = false;
            }
        });
        this.addEventListener(VectorEventType.REMOVEFEATURE, 
        /**
         * @param {VectorSourceEvent<Geometry>} evt The vector source event
         */
        function (evt) {
            if (!modifyingCollection) {
                modifyingCollection = true;
                collection.remove(evt.feature);
                modifyingCollection = false;
            }
        });
        collection.addEventListener(CollectionEventType.ADD, 
        /**
         * @param {import("../Collection.js").CollectionEvent} evt The collection event
         */
        function (evt) {
            if (!modifyingCollection) {
                modifyingCollection = true;
                this.addFeature(
                /** @type {import("../Feature.js").default<Geometry>} */ (evt.element));
                modifyingCollection = false;
            }
        }.bind(this));
        collection.addEventListener(CollectionEventType.REMOVE, 
        /**
         * @param {import("../Collection.js").CollectionEvent} evt The collection event
         */
        function (evt) {
            if (!modifyingCollection) {
                modifyingCollection = true;
                this.removeFeature(
                /** @type {import("../Feature.js").default<Geometry>} */ (evt.element));
                modifyingCollection = false;
            }
        }.bind(this));
        this.featuresCollection_ = collection;
    };
    /**
     * Remove all features from the source.
     * @param {boolean} [opt_fast] Skip dispatching of {@link module:ol/source/Vector.VectorSourceEvent#event:removefeature removefeature} events.
     * @api
     */
    VectorSource.prototype.clear = function (opt_fast) {
        if (opt_fast) {
            for (var featureId in this.featureChangeKeys_) {
                var keys = this.featureChangeKeys_[featureId];
                keys.forEach(unlistenByKey);
            }
            if (!this.featuresCollection_) {
                this.featureChangeKeys_ = {};
                this.idIndex_ = {};
                this.uidIndex_ = {};
            }
        }
        else {
            if (this.featuresRtree_) {
                this.featuresRtree_.forEach(this.removeFeatureInternal.bind(this));
                for (var id in this.nullGeometryFeatures_) {
                    this.removeFeatureInternal(this.nullGeometryFeatures_[id]);
                }
            }
        }
        if (this.featuresCollection_) {
            this.featuresCollection_.clear();
        }
        if (this.featuresRtree_) {
            this.featuresRtree_.clear();
        }
        this.nullGeometryFeatures_ = {};
        var clearEvent = new VectorSourceEvent(VectorEventType.CLEAR);
        this.dispatchEvent(clearEvent);
        this.changed();
    };
    /**
     * Iterate through all features on the source, calling the provided callback
     * with each one.  If the callback returns any "truthy" value, iteration will
     * stop and the function will return the same value.
     * Note: this function only iterate through the feature that have a defined geometry.
     *
     * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
     *     on the source.  Return a truthy value to stop iteration.
     * @return {T|undefined} The return value from the last call to the callback.
     * @template T
     * @api
     */
    VectorSource.prototype.forEachFeature = function (callback) {
        if (this.featuresRtree_) {
            return this.featuresRtree_.forEach(callback);
        }
        else if (this.featuresCollection_) {
            this.featuresCollection_.forEach(callback);
        }
    };
    /**
     * Iterate through all features whose geometries contain the provided
     * coordinate, calling the callback with each feature.  If the callback returns
     * a "truthy" value, iteration will stop and the function will return the same
     * value.
     *
     * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
     * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
     *     whose goemetry contains the provided coordinate.
     * @return {T|undefined} The return value from the last call to the callback.
     * @template T
     */
    VectorSource.prototype.forEachFeatureAtCoordinateDirect = function (coordinate, callback) {
        var extent = [coordinate[0], coordinate[1], coordinate[0], coordinate[1]];
        return this.forEachFeatureInExtent(extent, function (feature) {
            var geometry = feature.getGeometry();
            if (geometry.intersectsCoordinate(coordinate)) {
                return callback(feature);
            }
            else {
                return undefined;
            }
        });
    };
    /**
     * Iterate through all features whose bounding box intersects the provided
     * extent (note that the feature's geometry may not intersect the extent),
     * calling the callback with each feature.  If the callback returns a "truthy"
     * value, iteration will stop and the function will return the same value.
     *
     * If you are interested in features whose geometry intersects an extent, call
     * the {@link module:ol/source/Vector~VectorSource#forEachFeatureIntersectingExtent #forEachFeatureIntersectingExtent()} method instead.
     *
     * When `useSpatialIndex` is set to false, this method will loop through all
     * features, equivalent to {@link module:ol/source/Vector~VectorSource#forEachFeature #forEachFeature()}.
     *
     * @param {import("../extent.js").Extent} extent Extent.
     * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
     *     whose bounding box intersects the provided extent.
     * @return {T|undefined} The return value from the last call to the callback.
     * @template T
     * @api
     */
    VectorSource.prototype.forEachFeatureInExtent = function (extent, callback) {
        if (this.featuresRtree_) {
            return this.featuresRtree_.forEachInExtent(extent, callback);
        }
        else if (this.featuresCollection_) {
            this.featuresCollection_.forEach(callback);
        }
    };
    /**
     * Iterate through all features whose geometry intersects the provided extent,
     * calling the callback with each feature.  If the callback returns a "truthy"
     * value, iteration will stop and the function will return the same value.
     *
     * If you only want to test for bounding box intersection, call the
     * {@link module:ol/source/Vector~VectorSource#forEachFeatureInExtent #forEachFeatureInExtent()} method instead.
     *
     * @param {import("../extent.js").Extent} extent Extent.
     * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
     *     whose geometry intersects the provided extent.
     * @return {T|undefined} The return value from the last call to the callback.
     * @template T
     * @api
     */
    VectorSource.prototype.forEachFeatureIntersectingExtent = function (extent, callback) {
        return this.forEachFeatureInExtent(extent, 
        /**
         * @param {import("../Feature.js").default<Geometry>} feature Feature.
         * @return {T|undefined} The return value from the last call to the callback.
         */
        function (feature) {
            var geometry = feature.getGeometry();
            if (geometry.intersectsExtent(extent)) {
                var result = callback(feature);
                if (result) {
                    return result;
                }
            }
        });
    };
    /**
     * Get the features collection associated with this source. Will be `null`
     * unless the source was configured with `useSpatialIndex` set to `false`, or
     * with an {@link module:ol/Collection} as `features`.
     * @return {Collection<import("../Feature.js").default<Geometry>>} The collection of features.
     * @api
     */
    VectorSource.prototype.getFeaturesCollection = function () {
        return this.featuresCollection_;
    };
    /**
     * Get a snapshot of the features currently on the source in random order. The returned array
     * is a copy, the features are references to the features in the source.
     * @return {Array<import("../Feature.js").default<Geometry>>} Features.
     * @api
     */
    VectorSource.prototype.getFeatures = function () {
        var features;
        if (this.featuresCollection_) {
            features = this.featuresCollection_.getArray().slice(0);
        }
        else if (this.featuresRtree_) {
            features = this.featuresRtree_.getAll();
            if (!isEmpty(this.nullGeometryFeatures_)) {
                extend(features, getValues(this.nullGeometryFeatures_));
            }
        }
        return /** @type {Array<import("../Feature.js").default<Geometry>>} */ (features);
    };
    /**
     * Get all features whose geometry intersects the provided coordinate.
     * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {Array<import("../Feature.js").default<Geometry>>} Features.
     * @api
     */
    VectorSource.prototype.getFeaturesAtCoordinate = function (coordinate) {
        var features = [];
        this.forEachFeatureAtCoordinateDirect(coordinate, function (feature) {
            features.push(feature);
        });
        return features;
    };
    /**
     * Get all features whose bounding box intersects the provided extent.  Note that this returns an array of
     * all features intersecting the given extent in random order (so it may include
     * features whose geometries do not intersect the extent).
     *
     * When `useSpatialIndex` is set to false, this method will return all
     * features.
     *
     * @param {import("../extent.js").Extent} extent Extent.
     * @return {Array<import("../Feature.js").default<Geometry>>} Features.
     * @api
     */
    VectorSource.prototype.getFeaturesInExtent = function (extent) {
        if (this.featuresRtree_) {
            return this.featuresRtree_.getInExtent(extent);
        }
        else if (this.featuresCollection_) {
            return this.featuresCollection_.getArray().slice(0);
        }
        else {
            return [];
        }
    };
    /**
     * Get the closest feature to the provided coordinate.
     *
     * This method is not available when the source is configured with
     * `useSpatialIndex` set to `false`.
     * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
     * @param {function(import("../Feature.js").default<Geometry>):boolean} [opt_filter] Feature filter function.
     *     The filter function will receive one argument, the {@link module:ol/Feature feature}
     *     and it should return a boolean value. By default, no filtering is made.
     * @return {import("../Feature.js").default<Geometry>} Closest feature.
     * @api
     */
    VectorSource.prototype.getClosestFeatureToCoordinate = function (coordinate, opt_filter) {
        // Find the closest feature using branch and bound.  We start searching an
        // infinite extent, and find the distance from the first feature found.  This
        // becomes the closest feature.  We then compute a smaller extent which any
        // closer feature must intersect.  We continue searching with this smaller
        // extent, trying to find a closer feature.  Every time we find a closer
        // feature, we update the extent being searched so that any even closer
        // feature must intersect it.  We continue until we run out of features.
        var x = coordinate[0];
        var y = coordinate[1];
        var closestFeature = null;
        var closestPoint = [NaN, NaN];
        var minSquaredDistance = Infinity;
        var extent = [-Infinity, -Infinity, Infinity, Infinity];
        var filter = opt_filter ? opt_filter : TRUE;
        this.featuresRtree_.forEachInExtent(extent, 
        /**
         * @param {import("../Feature.js").default<Geometry>} feature Feature.
         */
        function (feature) {
            if (filter(feature)) {
                var geometry = feature.getGeometry();
                var previousMinSquaredDistance = minSquaredDistance;
                minSquaredDistance = geometry.closestPointXY(x, y, closestPoint, minSquaredDistance);
                if (minSquaredDistance < previousMinSquaredDistance) {
                    closestFeature = feature;
                    // This is sneaky.  Reduce the extent that it is currently being
                    // searched while the R-Tree traversal using this same extent object
                    // is still in progress.  This is safe because the new extent is
                    // strictly contained by the old extent.
                    var minDistance = Math.sqrt(minSquaredDistance);
                    extent[0] = x - minDistance;
                    extent[1] = y - minDistance;
                    extent[2] = x + minDistance;
                    extent[3] = y + minDistance;
                }
            }
        });
        return closestFeature;
    };
    /**
     * Get the extent of the features currently in the source.
     *
     * This method is not available when the source is configured with
     * `useSpatialIndex` set to `false`.
     * @param {import("../extent.js").Extent} [opt_extent] Destination extent. If provided, no new extent
     *     will be created. Instead, that extent's coordinates will be overwritten.
     * @return {import("../extent.js").Extent} Extent.
     * @api
     */
    VectorSource.prototype.getExtent = function (opt_extent) {
        return this.featuresRtree_.getExtent(opt_extent);
    };
    /**
     * Get a feature by its identifier (the value returned by feature.getId()).
     * Note that the index treats string and numeric identifiers as the same.  So
     * `source.getFeatureById(2)` will return a feature with id `'2'` or `2`.
     *
     * @param {string|number} id Feature identifier.
     * @return {import("../Feature.js").default<Geometry>} The feature (or `null` if not found).
     * @api
     */
    VectorSource.prototype.getFeatureById = function (id) {
        var feature = this.idIndex_[id.toString()];
        return feature !== undefined ? feature : null;
    };
    /**
     * Get a feature by its internal unique identifier (using `getUid`).
     *
     * @param {string} uid Feature identifier.
     * @return {import("../Feature.js").default<Geometry>} The feature (or `null` if not found).
     */
    VectorSource.prototype.getFeatureByUid = function (uid) {
        var feature = this.uidIndex_[uid];
        return feature !== undefined ? feature : null;
    };
    /**
     * Get the format associated with this source.
     *
     * @return {import("../format/Feature.js").default|undefined} The feature format.
     * @api
     */
    VectorSource.prototype.getFormat = function () {
        return this.format_;
    };
    /**
     * @return {boolean} The source can have overlapping geometries.
     */
    VectorSource.prototype.getOverlaps = function () {
        return this.overlaps_;
    };
    /**
     * Get the url associated with this source.
     *
     * @return {string|import("../featureloader.js").FeatureUrlFunction|undefined} The url.
     * @api
     */
    VectorSource.prototype.getUrl = function () {
        return this.url_;
    };
    /**
     * @param {Event} event Event.
     * @private
     */
    VectorSource.prototype.handleFeatureChange_ = function (event) {
        var feature = /** @type {import("../Feature.js").default<Geometry>} */ (event.target);
        var featureKey = getUid(feature);
        var geometry = feature.getGeometry();
        if (!geometry) {
            if (!(featureKey in this.nullGeometryFeatures_)) {
                if (this.featuresRtree_) {
                    this.featuresRtree_.remove(feature);
                }
                this.nullGeometryFeatures_[featureKey] = feature;
            }
        }
        else {
            var extent = geometry.getExtent();
            if (featureKey in this.nullGeometryFeatures_) {
                delete this.nullGeometryFeatures_[featureKey];
                if (this.featuresRtree_) {
                    this.featuresRtree_.insert(extent, feature);
                }
            }
            else {
                if (this.featuresRtree_) {
                    this.featuresRtree_.update(extent, feature);
                }
            }
        }
        var id = feature.getId();
        if (id !== undefined) {
            var sid = id.toString();
            if (this.idIndex_[sid] !== feature) {
                this.removeFromIdIndex_(feature);
                this.idIndex_[sid] = feature;
            }
        }
        else {
            this.removeFromIdIndex_(feature);
            this.uidIndex_[featureKey] = feature;
        }
        this.changed();
        this.dispatchEvent(new VectorSourceEvent(VectorEventType.CHANGEFEATURE, feature));
    };
    /**
     * Returns true if the feature is contained within the source.
     * @param {import("../Feature.js").default<Geometry>} feature Feature.
     * @return {boolean} Has feature.
     * @api
     */
    VectorSource.prototype.hasFeature = function (feature) {
        var id = feature.getId();
        if (id !== undefined) {
            return id in this.idIndex_;
        }
        else {
            return getUid(feature) in this.uidIndex_;
        }
    };
    /**
     * @return {boolean} Is empty.
     */
    VectorSource.prototype.isEmpty = function () {
        return this.featuresRtree_.isEmpty() && isEmpty(this.nullGeometryFeatures_);
    };
    /**
     * @param {import("../extent.js").Extent} extent Extent.
     * @param {number} resolution Resolution.
     * @param {import("../proj/Projection.js").default} projection Projection.
     */
    VectorSource.prototype.loadFeatures = function (extent, resolution, projection) {
        var loadedExtentsRtree = this.loadedExtentsRtree_;
        var extentsToLoad = this.strategy_(extent, resolution, projection);
        var _loop_1 = function (i, ii) {
            var extentToLoad = extentsToLoad[i];
            var alreadyLoaded = loadedExtentsRtree.forEachInExtent(extentToLoad, 
            /**
             * @param {{extent: import("../extent.js").Extent}} object Object.
             * @return {boolean} Contains.
             */
            function (object) {
                return containsExtent(object.extent, extentToLoad);
            });
            if (!alreadyLoaded) {
                ++this_1.loadingExtentsCount_;
                this_1.dispatchEvent(new VectorSourceEvent(VectorEventType.FEATURESLOADSTART));
                this_1.loader_.call(this_1, extentToLoad, resolution, projection, function (features) {
                    --this.loadingExtentsCount_;
                    this.dispatchEvent(new VectorSourceEvent(VectorEventType.FEATURESLOADEND, undefined, features));
                }.bind(this_1), function () {
                    --this.loadingExtentsCount_;
                    this.dispatchEvent(new VectorSourceEvent(VectorEventType.FEATURESLOADERROR));
                }.bind(this_1));
                loadedExtentsRtree.insert(extentToLoad, { extent: extentToLoad.slice() });
            }
        };
        var this_1 = this;
        for (var i = 0, ii = extentsToLoad.length; i < ii; ++i) {
            _loop_1(i);
        }
        this.loading =
            this.loader_.length < 4 ? false : this.loadingExtentsCount_ > 0;
    };
    VectorSource.prototype.refresh = function () {
        this.clear(true);
        this.loadedExtentsRtree_.clear();
        _super.prototype.refresh.call(this);
    };
    /**
     * Remove an extent from the list of loaded extents.
     * @param {import("../extent.js").Extent} extent Extent.
     * @api
     */
    VectorSource.prototype.removeLoadedExtent = function (extent) {
        var loadedExtentsRtree = this.loadedExtentsRtree_;
        var obj;
        loadedExtentsRtree.forEachInExtent(extent, function (object) {
            if (equals(object.extent, extent)) {
                obj = object;
                return true;
            }
        });
        if (obj) {
            loadedExtentsRtree.remove(obj);
        }
    };
    /**
     * Remove a single feature from the source.  If you want to remove all features
     * at once, use the {@link module:ol/source/Vector~VectorSource#clear #clear()} method
     * instead.
     * @param {import("../Feature.js").default<Geometry>} feature Feature to remove.
     * @api
     */
    VectorSource.prototype.removeFeature = function (feature) {
        var featureKey = getUid(feature);
        if (featureKey in this.nullGeometryFeatures_) {
            delete this.nullGeometryFeatures_[featureKey];
        }
        else {
            if (this.featuresRtree_) {
                this.featuresRtree_.remove(feature);
            }
        }
        this.removeFeatureInternal(feature);
        this.changed();
    };
    /**
     * Remove feature without firing a `change` event.
     * @param {import("../Feature.js").default<Geometry>} feature Feature.
     * @protected
     */
    VectorSource.prototype.removeFeatureInternal = function (feature) {
        var featureKey = getUid(feature);
        this.featureChangeKeys_[featureKey].forEach(unlistenByKey);
        delete this.featureChangeKeys_[featureKey];
        var id = feature.getId();
        if (id !== undefined) {
            delete this.idIndex_[id.toString()];
        }
        delete this.uidIndex_[featureKey];
        this.dispatchEvent(new VectorSourceEvent(VectorEventType.REMOVEFEATURE, feature));
    };
    /**
     * Remove a feature from the id index.  Called internally when the feature id
     * may have changed.
     * @param {import("../Feature.js").default<Geometry>} feature The feature.
     * @return {boolean} Removed the feature from the index.
     * @private
     */
    VectorSource.prototype.removeFromIdIndex_ = function (feature) {
        var removed = false;
        for (var id in this.idIndex_) {
            if (this.idIndex_[id] === feature) {
                delete this.idIndex_[id];
                removed = true;
                break;
            }
        }
        return removed;
    };
    /**
     * Set the new loader of the source. The next render cycle will use the
     * new loader.
     * @param {import("../featureloader.js").FeatureLoader} loader The loader to set.
     * @api
     */
    VectorSource.prototype.setLoader = function (loader) {
        this.loader_ = loader;
    };
    /**
     * Points the source to a new url. The next render cycle will use the new url.
     * @param {string|import("../featureloader.js").FeatureUrlFunction} url Url.
     * @api
     */
    VectorSource.prototype.setUrl = function (url) {
        assert(this.format_, 7); // `format` must be set when `url` is set
        this.url_ = url;
        this.setLoader(xhr(url, this.format_));
    };
    return VectorSource;
}(Source));

export default VectorSource;
