import { u as unlistenByKey, l as listen, E as EventType, B as BaseObject, a as assert, b as abstract, T as TRUE, D as Disposable, O as ObjectEventType, c as assign, d as clear, g as getUid, e as BaseEvent, V as VOID, f as Target, h as linearFindNearest, i as equals$2, F as FALSE } from './common/asserts-e0c6c4d5.js';
import { c as compose, m as makeInverse, a as create, b as apply } from './common/transform-5be3cfb9.js';
import { g as getWidth, a as getIntersection, b as getHeight, c as getForViewAndSize, i as isEmpty, d as getCenter, e as equals$1, f as createOrUpdateEmpty, h as clone } from './common/extent-0b32e3b6.js';
import { s as shared, V as ViewHint } from './common/IconImageCache-bf76e94a.js';
import { i as inView, R as RenderEvent, a as RenderEventType, B as BaseLayer } from './common/Event-d9e6173a.js';
import { w as wrapX, r as rotate, a as add, e as equals } from './common/coordinate-762b4bbd.js';
import { S as SourceState } from './common/State-c7a16ea4.js';
import { C as CLASS_UNSELECTABLE, a as CLASS_CONTROL, b as CLASS_COLLAPSED, c as CLASS_HIDDEN } from './common/css-ccce5ae1.js';
import { c as checkedFonts } from './common/canvas-a6a02d53.js';
import { r as replaceChildren, a as removeNode, b as removeChildren, c as replaceNode } from './common/dom-73d54564.js';
import { C as Collection, a as CollectionEventType } from './common/Collection-5517f676.js';
import { M as MapBrowserEventType, z as zoomByDelta, I as Interaction, a as altShiftKeysOnly, m as mouseOnly, b as mouseActionButton, P as PointerInteraction, s as shiftKeyOnly, n as noModifierKeys, t as targetNotEditable, p as pan, c as always, d as all, f as focusWithTabindex, e as centroid, D as DragPan } from './common/DragPan-7a51e1b1.js';
import { P as PASSIVE_EVENT_LISTENERS, D as DEVICE_PIXEL_RATIO, F as FIREFOX } from './common/has-ff434dd0.js';
import { T as TileState } from './common/TileState-8e53a150.js';
import { G as GeometryType } from './common/SimpleGeometry-0ef1a82e.js';
import { c as createProjection, f as fromUserCoordinate, a as fromUserExtent, t as toUserCoordinate, b as toUserExtent, M as METERS_PER_UNIT, U as Units, g as getUserProjection } from './common/proj-8f373c44.js';
import { D as DEFAULT_TILE_SIZE } from './common/common-42819fa1.js';
import { c as clamp, t as toRadians, m as modulo } from './common/math-b0fe2752.js';
import { i as inAndOut, e as easeOut } from './common/easing-827db2b3.js';
import { f as fromExtent, P as Polygon } from './common/Polygon-72b99885.js';
import { h as hasArea } from './common/size-da54e3a0.js';
import './common/Point-6e9bb897.js';
import './common/inflate-f8e41fee.js';

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
 * @typedef {typeof Feature|typeof import("./render/Feature.js").default} FeatureClass
 */
/**
 * @typedef {Feature<import("./geom/Geometry.js").default>|import("./render/Feature.js").default} FeatureLike
 */
/***
 * @template Return
 * @typedef {import("./Observable").OnSignature<import("./Observable").EventTypes, import("./events/Event.js").default, Return> &
 *   import("./Observable").OnSignature<import("./ObjectEventType").Types|'change:geometry', import("./Object").ObjectEvent, Return> &
 *   import("./Observable").CombinedOnSignature<import("./Observable").EventTypes|import("./ObjectEventType").Types
 *     |'change:geometry', Return>} FeatureOnSignature
 */
/***
 * @template Geometry
 * @typedef {Object<string, *> & { geometry?: Geometry }} ObjectWithGeometry
 */
/**
 * @classdesc
 * A vector object for geographic features with a geometry and other
 * attribute properties, similar to the features in vector file formats like
 * GeoJSON.
 *
 * Features can be styled individually with `setStyle`; otherwise they use the
 * style of their vector layer.
 *
 * Note that attribute properties are set as {@link module:ol/Object} properties on
 * the feature object, so they are observable, and have get/set accessors.
 *
 * Typically, a feature has a single geometry property. You can set the
 * geometry using the `setGeometry` method and get it with `getGeometry`.
 * It is possible to store more than one geometry on a feature using attribute
 * properties. By default, the geometry used for rendering is identified by
 * the property name `geometry`. If you want to use another geometry property
 * for rendering, use the `setGeometryName` method to change the attribute
 * property associated with the geometry for the feature.  For example:
 *
 * ```js
 *
 * import Feature from 'ol/Feature';
 * import Polygon from 'ol/geom/Polygon';
 * import Point from 'ol/geom/Point';
 *
 * var feature = new Feature({
 *   geometry: new Polygon(polyCoords),
 *   labelPoint: new Point(labelCoords),
 *   name: 'My Polygon'
 * });
 *
 * // get the polygon geometry
 * var poly = feature.getGeometry();
 *
 * // Render the feature as a point using the coordinates from labelPoint
 * feature.setGeometryName('labelPoint');
 *
 * // get the point geometry
 * var point = feature.getGeometry();
 * ```
 *
 * @api
 * @template {import("./geom/Geometry.js").default} Geometry
 */
var Feature = /** @class */ (function (_super) {
    __extends(Feature, _super);
    /**
     * @param {Geometry|ObjectWithGeometry<Geometry>} [opt_geometryOrProperties]
     *     You may pass a Geometry object directly, or an object literal containing
     *     properties. If you pass an object literal, you may include a Geometry
     *     associated with a `geometry` key.
     */
    function Feature(opt_geometryOrProperties) {
        var _this = _super.call(this) || this;
        /***
         * @type {FeatureOnSignature<import("./events").EventsKey>}
         */
        _this.on;
        /***
         * @type {FeatureOnSignature<import("./events").EventsKey>}
         */
        _this.once;
        /***
         * @type {FeatureOnSignature<void>}
         */
        _this.un;
        /**
         * @private
         * @type {number|string|undefined}
         */
        _this.id_ = undefined;
        /**
         * @type {string}
         * @private
         */
        _this.geometryName_ = 'geometry';
        /**
         * User provided style.
         * @private
         * @type {import("./style/Style.js").StyleLike}
         */
        _this.style_ = null;
        /**
         * @private
         * @type {import("./style/Style.js").StyleFunction|undefined}
         */
        _this.styleFunction_ = undefined;
        /**
         * @private
         * @type {?import("./events.js").EventsKey}
         */
        _this.geometryChangeKey_ = null;
        _this.addChangeListener(_this.geometryName_, _this.handleGeometryChanged_);
        if (opt_geometryOrProperties) {
            if (typeof (
            /** @type {?} */ (opt_geometryOrProperties).getSimplifiedGeometry) === 'function') {
                var geometry = /** @type {Geometry} */ (opt_geometryOrProperties);
                _this.setGeometry(geometry);
            }
            else {
                /** @type {Object<string, *>} */
                var properties = opt_geometryOrProperties;
                _this.setProperties(properties);
            }
        }
        return _this;
    }
    /**
     * Clone this feature. If the original feature has a geometry it
     * is also cloned. The feature id is not set in the clone.
     * @return {Feature<Geometry>} The clone.
     * @api
     */
    Feature.prototype.clone = function () {
        var clone = /** @type {Feature<Geometry>} */ (new Feature(this.hasProperties() ? this.getProperties() : null));
        clone.setGeometryName(this.getGeometryName());
        var geometry = this.getGeometry();
        if (geometry) {
            clone.setGeometry(/** @type {Geometry} */ (geometry.clone()));
        }
        var style = this.getStyle();
        if (style) {
            clone.setStyle(style);
        }
        return clone;
    };
    /**
     * Get the feature's default geometry.  A feature may have any number of named
     * geometries.  The "default" geometry (the one that is rendered by default) is
     * set when calling {@link module:ol/Feature~Feature#setGeometry}.
     * @return {Geometry|undefined} The default geometry for the feature.
     * @api
     * @observable
     */
    Feature.prototype.getGeometry = function () {
        return /** @type {Geometry|undefined} */ (this.get(this.geometryName_));
    };
    /**
     * Get the feature identifier.  This is a stable identifier for the feature and
     * is either set when reading data from a remote source or set explicitly by
     * calling {@link module:ol/Feature~Feature#setId}.
     * @return {number|string|undefined} Id.
     * @api
     */
    Feature.prototype.getId = function () {
        return this.id_;
    };
    /**
     * Get the name of the feature's default geometry.  By default, the default
     * geometry is named `geometry`.
     * @return {string} Get the property name associated with the default geometry
     *     for this feature.
     * @api
     */
    Feature.prototype.getGeometryName = function () {
        return this.geometryName_;
    };
    /**
     * Get the feature's style. Will return what was provided to the
     * {@link module:ol/Feature~Feature#setStyle} method.
     * @return {import("./style/Style.js").StyleLike|undefined} The feature style.
     * @api
     */
    Feature.prototype.getStyle = function () {
        return this.style_;
    };
    /**
     * Get the feature's style function.
     * @return {import("./style/Style.js").StyleFunction|undefined} Return a function
     * representing the current style of this feature.
     * @api
     */
    Feature.prototype.getStyleFunction = function () {
        return this.styleFunction_;
    };
    /**
     * @private
     */
    Feature.prototype.handleGeometryChange_ = function () {
        this.changed();
    };
    /**
     * @private
     */
    Feature.prototype.handleGeometryChanged_ = function () {
        if (this.geometryChangeKey_) {
            unlistenByKey(this.geometryChangeKey_);
            this.geometryChangeKey_ = null;
        }
        var geometry = this.getGeometry();
        if (geometry) {
            this.geometryChangeKey_ = listen(geometry, EventType.CHANGE, this.handleGeometryChange_, this);
        }
        this.changed();
    };
    /**
     * Set the default geometry for the feature.  This will update the property
     * with the name returned by {@link module:ol/Feature~Feature#getGeometryName}.
     * @param {Geometry|undefined} geometry The new geometry.
     * @api
     * @observable
     */
    Feature.prototype.setGeometry = function (geometry) {
        this.set(this.geometryName_, geometry);
    };
    /**
     * Set the style for the feature to override the layer style.  This can be a
     * single style object, an array of styles, or a function that takes a
     * resolution and returns an array of styles. To unset the feature style, call
     * `setStyle()` without arguments or a falsey value.
     * @param {import("./style/Style.js").StyleLike} [opt_style] Style for this feature.
     * @api
     * @fires module:ol/events/Event~BaseEvent#event:change
     */
    Feature.prototype.setStyle = function (opt_style) {
        this.style_ = opt_style;
        this.styleFunction_ = !opt_style
            ? undefined
            : createStyleFunction(opt_style);
        this.changed();
    };
    /**
     * Set the feature id.  The feature id is considered stable and may be used when
     * requesting features or comparing identifiers returned from a remote source.
     * The feature id can be used with the
     * {@link module:ol/source/Vector~VectorSource#getFeatureById} method.
     * @param {number|string|undefined} id The feature id.
     * @api
     * @fires module:ol/events/Event~BaseEvent#event:change
     */
    Feature.prototype.setId = function (id) {
        this.id_ = id;
        this.changed();
    };
    /**
     * Set the property name to be used when getting the feature's default geometry.
     * When calling {@link module:ol/Feature~Feature#getGeometry}, the value of the property with
     * this name will be returned.
     * @param {string} name The property name of the default geometry.
     * @api
     */
    Feature.prototype.setGeometryName = function (name) {
        this.removeChangeListener(this.geometryName_, this.handleGeometryChanged_);
        this.geometryName_ = name;
        this.addChangeListener(this.geometryName_, this.handleGeometryChanged_);
        this.handleGeometryChanged_();
    };
    return Feature;
}(BaseObject));
/**
 * Convert the provided object into a feature style function.  Functions passed
 * through unchanged.  Arrays of Style or single style objects wrapped
 * in a new feature style function.
 * @param {!import("./style/Style.js").StyleFunction|!Array<import("./style/Style.js").default>|!import("./style/Style.js").default} obj
 *     A feature style function, a single style, or an array of styles.
 * @return {import("./style/Style.js").StyleFunction} A style function.
 */
function createStyleFunction(obj) {
    if (typeof obj === 'function') {
        return obj;
    }
    else {
        /**
         * @type {Array<import("./style/Style.js").default>}
         */
        var styles_1;
        if (Array.isArray(obj)) {
            styles_1 = obj;
        }
        else {
            assert(typeof ( /** @type {?} */(obj).getZIndex) === 'function', 41); // Expected an `import("./style/Style.js").Style` or an array of `import("./style/Style.js").Style`
            var style = /** @type {import("./style/Style.js").default} */ (obj);
            styles_1 = [style];
        }
        return function () {
            return styles_1;
        };
    }
}

/**
 * @module ol/Kinetic
 */
/**
 * @classdesc
 * Implementation of inertial deceleration for map movement.
 *
 * @api
 */
var Kinetic = /** @class */ (function () {
    /**
     * @param {number} decay Rate of decay (must be negative).
     * @param {number} minVelocity Minimum velocity (pixels/millisecond).
     * @param {number} delay Delay to consider to calculate the kinetic
     *     initial values (milliseconds).
     */
    function Kinetic(decay, minVelocity, delay) {
        /**
         * @private
         * @type {number}
         */
        this.decay_ = decay;
        /**
         * @private
         * @type {number}
         */
        this.minVelocity_ = minVelocity;
        /**
         * @private
         * @type {number}
         */
        this.delay_ = delay;
        /**
         * @private
         * @type {Array<number>}
         */
        this.points_ = [];
        /**
         * @private
         * @type {number}
         */
        this.angle_ = 0;
        /**
         * @private
         * @type {number}
         */
        this.initialVelocity_ = 0;
    }
    /**
     * FIXME empty description for jsdoc
     */
    Kinetic.prototype.begin = function () {
        this.points_.length = 0;
        this.angle_ = 0;
        this.initialVelocity_ = 0;
    };
    /**
     * @param {number} x X.
     * @param {number} y Y.
     */
    Kinetic.prototype.update = function (x, y) {
        this.points_.push(x, y, Date.now());
    };
    /**
     * @return {boolean} Whether we should do kinetic animation.
     */
    Kinetic.prototype.end = function () {
        if (this.points_.length < 6) {
            // at least 2 points are required (i.e. there must be at least 6 elements
            // in the array)
            return false;
        }
        var delay = Date.now() - this.delay_;
        var lastIndex = this.points_.length - 3;
        if (this.points_[lastIndex + 2] < delay) {
            // the last tracked point is too old, which means that the user stopped
            // panning before releasing the map
            return false;
        }
        // get the first point which still falls into the delay time
        var firstIndex = lastIndex - 3;
        while (firstIndex > 0 && this.points_[firstIndex + 2] > delay) {
            firstIndex -= 3;
        }
        var duration = this.points_[lastIndex + 2] - this.points_[firstIndex + 2];
        // we don't want a duration of 0 (divide by zero)
        // we also make sure the user panned for a duration of at least one frame
        // (1/60s) to compute sane displacement values
        if (duration < 1000 / 60) {
            return false;
        }
        var dx = this.points_[lastIndex] - this.points_[firstIndex];
        var dy = this.points_[lastIndex + 1] - this.points_[firstIndex + 1];
        this.angle_ = Math.atan2(dy, dx);
        this.initialVelocity_ = Math.sqrt(dx * dx + dy * dy) / duration;
        return this.initialVelocity_ > this.minVelocity_;
    };
    /**
     * @return {number} Total distance travelled (pixels).
     */
    Kinetic.prototype.getDistance = function () {
        return (this.minVelocity_ - this.initialVelocity_) / this.decay_;
    };
    /**
     * @return {number} Angle of the kinetic panning animation (radians).
     */
    Kinetic.prototype.getAngle = function () {
        return this.angle_;
    };
    return Kinetic;
}());

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
 * @typedef HitMatch
 * @property {import("../Feature.js").FeatureLike} feature Feature.
 * @property {import("../layer/Layer.js").default} layer Layer.
 * @property {import("../geom/SimpleGeometry.js").default} geometry Geometry.
 * @property {number} distanceSq Squared distance.
 * @property {import("./vector.js").FeatureCallback<T>} callback Callback.
 * @template T
 */
/**
 * @abstract
 */
var MapRenderer = /** @class */ (function (_super) {
    __extends$1(MapRenderer, _super);
    /**
     * @param {import("../PluggableMap.js").default} map Map.
     */
    function MapRenderer(map) {
        var _this = _super.call(this) || this;
        /**
         * @private
         * @type {import("../PluggableMap.js").default}
         */
        _this.map_ = map;
        return _this;
    }
    /**
     * @abstract
     * @param {import("../render/EventType.js").default} type Event type.
     * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
     */
    MapRenderer.prototype.dispatchRenderEvent = function (type, frameState) {
        abstract();
    };
    /**
     * @param {import("../PluggableMap.js").FrameState} frameState FrameState.
     * @protected
     */
    MapRenderer.prototype.calculateMatrices2D = function (frameState) {
        var viewState = frameState.viewState;
        var coordinateToPixelTransform = frameState.coordinateToPixelTransform;
        var pixelToCoordinateTransform = frameState.pixelToCoordinateTransform;
        compose(coordinateToPixelTransform, frameState.size[0] / 2, frameState.size[1] / 2, 1 / viewState.resolution, -1 / viewState.resolution, -viewState.rotation, -viewState.center[0], -viewState.center[1]);
        makeInverse(pixelToCoordinateTransform, coordinateToPixelTransform);
    };
    /**
     * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
     * @param {import("../PluggableMap.js").FrameState} frameState FrameState.
     * @param {number} hitTolerance Hit tolerance in pixels.
     * @param {boolean} checkWrapped Check for wrapped geometries.
     * @param {import("./vector.js").FeatureCallback<T>} callback Feature callback.
     * @param {S} thisArg Value to use as `this` when executing `callback`.
     * @param {function(this: U, import("../layer/Layer.js").default): boolean} layerFilter Layer filter
     *     function, only layers which are visible and for which this function
     *     returns `true` will be tested for features.  By default, all visible
     *     layers will be tested.
     * @param {U} thisArg2 Value to use as `this` when executing `layerFilter`.
     * @return {T|undefined} Callback result.
     * @template S,T,U
     */
    MapRenderer.prototype.forEachFeatureAtCoordinate = function (coordinate, frameState, hitTolerance, checkWrapped, callback, thisArg, layerFilter, thisArg2) {
        var result;
        var viewState = frameState.viewState;
        /**
         * @param {boolean} managed Managed layer.
         * @param {import("../Feature.js").FeatureLike} feature Feature.
         * @param {import("../layer/Layer.js").default} layer Layer.
         * @param {import("../geom/Geometry.js").default} geometry Geometry.
         * @return {T|undefined} Callback result.
         */
        function forEachFeatureAtCoordinate(managed, feature, layer, geometry) {
            return callback.call(thisArg, feature, managed ? layer : null, geometry);
        }
        var projection = viewState.projection;
        var translatedCoordinate = wrapX(coordinate.slice(), projection);
        var offsets = [[0, 0]];
        if (projection.canWrapX() && checkWrapped) {
            var projectionExtent = projection.getExtent();
            var worldWidth = getWidth(projectionExtent);
            offsets.push([-worldWidth, 0], [worldWidth, 0]);
        }
        var layerStates = frameState.layerStatesArray;
        var numLayers = layerStates.length;
        var matches = /** @type {Array<HitMatch<T>>} */ ([]);
        var tmpCoord = [];
        for (var i = 0; i < offsets.length; i++) {
            for (var j = numLayers - 1; j >= 0; --j) {
                var layerState = layerStates[j];
                var layer = layerState.layer;
                if (layer.hasRenderer() &&
                    inView(layerState, viewState) &&
                    layerFilter.call(thisArg2, layer)) {
                    var layerRenderer = layer.getRenderer();
                    var source = layer.getSource();
                    if (layerRenderer && source) {
                        var coordinates = source.getWrapX()
                            ? translatedCoordinate
                            : coordinate;
                        var callback_1 = forEachFeatureAtCoordinate.bind(null, layerState.managed);
                        tmpCoord[0] = coordinates[0] + offsets[i][0];
                        tmpCoord[1] = coordinates[1] + offsets[i][1];
                        result = layerRenderer.forEachFeatureAtCoordinate(tmpCoord, frameState, hitTolerance, callback_1, matches);
                    }
                    if (result) {
                        return result;
                    }
                }
            }
        }
        if (matches.length === 0) {
            return undefined;
        }
        var order = 1 / matches.length;
        matches.forEach(function (m, i) { return (m.distanceSq += i * order); });
        matches.sort(function (a, b) { return a.distanceSq - b.distanceSq; });
        matches.some(function (m) {
            return (result = m.callback(m.feature, m.layer, m.geometry));
        });
        return result;
    };
    /**
     * @abstract
     * @param {import("../pixel.js").Pixel} pixel Pixel.
     * @param {import("../PluggableMap.js").FrameState} frameState FrameState.
     * @param {number} hitTolerance Hit tolerance in pixels.
     * @param {function(import("../layer/Layer.js").default<import("../source/Source").default>, (Uint8ClampedArray|Uint8Array)): T} callback Layer
     *     callback.
     * @param {function(import("../layer/Layer.js").default<import("../source/Source").default>): boolean} layerFilter Layer filter
     *     function, only layers which are visible and for which this function
     *     returns `true` will be tested for features.  By default, all visible
     *     layers will be tested.
     * @return {T|undefined} Callback result.
     * @template T
     */
    MapRenderer.prototype.forEachLayerAtPixel = function (pixel, frameState, hitTolerance, callback, layerFilter) {
        return abstract();
    };
    /**
     * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
     * @param {import("../PluggableMap.js").FrameState} frameState FrameState.
     * @param {number} hitTolerance Hit tolerance in pixels.
     * @param {boolean} checkWrapped Check for wrapped geometries.
     * @param {function(this: U, import("../layer/Layer.js").default): boolean} layerFilter Layer filter
     *     function, only layers which are visible and for which this function
     *     returns `true` will be tested for features.  By default, all visible
     *     layers will be tested.
     * @param {U} thisArg Value to use as `this` when executing `layerFilter`.
     * @return {boolean} Is there a feature at the given coordinate?
     * @template U
     */
    MapRenderer.prototype.hasFeatureAtCoordinate = function (coordinate, frameState, hitTolerance, checkWrapped, layerFilter, thisArg) {
        var hasFeature = this.forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, checkWrapped, TRUE, this, layerFilter, thisArg);
        return hasFeature !== undefined;
    };
    /**
     * @return {import("../PluggableMap.js").default} Map.
     */
    MapRenderer.prototype.getMap = function () {
        return this.map_;
    };
    /**
     * Render.
     * @abstract
     * @param {?import("../PluggableMap.js").FrameState} frameState Frame state.
     */
    MapRenderer.prototype.renderFrame = function (frameState) {
        abstract();
    };
    /**
     * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
     * @protected
     */
    MapRenderer.prototype.scheduleExpireIconCache = function (frameState) {
        if (shared.canExpireCache()) {
            frameState.postRenderFunctions.push(expireIconCache);
        }
    };
    return MapRenderer;
}(Disposable));
/**
 * @param {import("../PluggableMap.js").default} map Map.
 * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
 */
function expireIconCache(map, frameState) {
    shared.expire();
}

var __extends$2 = (undefined && undefined.__extends) || (function () {
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
 * @classdesc
 * Canvas map renderer.
 * @api
 */
var CompositeMapRenderer = /** @class */ (function (_super) {
    __extends$2(CompositeMapRenderer, _super);
    /**
     * @param {import("../PluggableMap.js").default} map Map.
     */
    function CompositeMapRenderer(map) {
        var _this = _super.call(this, map) || this;
        /**
         * @type {import("../events.js").EventsKey}
         */
        _this.fontChangeListenerKey_ = listen(checkedFonts, ObjectEventType.PROPERTYCHANGE, map.redrawText.bind(map));
        /**
         * @private
         * @type {HTMLDivElement}
         */
        _this.element_ = document.createElement('div');
        var style = _this.element_.style;
        style.position = 'absolute';
        style.width = '100%';
        style.height = '100%';
        style.zIndex = '0';
        _this.element_.className = CLASS_UNSELECTABLE + ' ol-layers';
        var container = map.getViewport();
        container.insertBefore(_this.element_, container.firstChild || null);
        /**
         * @private
         * @type {Array<HTMLElement>}
         */
        _this.children_ = [];
        /**
         * @private
         * @type {boolean}
         */
        _this.renderedVisible_ = true;
        return _this;
    }
    /**
     * @param {import("../render/EventType.js").default} type Event type.
     * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
     */
    CompositeMapRenderer.prototype.dispatchRenderEvent = function (type, frameState) {
        var map = this.getMap();
        if (map.hasListener(type)) {
            var event_1 = new RenderEvent(type, undefined, frameState);
            map.dispatchEvent(event_1);
        }
    };
    CompositeMapRenderer.prototype.disposeInternal = function () {
        unlistenByKey(this.fontChangeListenerKey_);
        this.element_.parentNode.removeChild(this.element_);
        _super.prototype.disposeInternal.call(this);
    };
    /**
     * Render.
     * @param {?import("../PluggableMap.js").FrameState} frameState Frame state.
     */
    CompositeMapRenderer.prototype.renderFrame = function (frameState) {
        if (!frameState) {
            if (this.renderedVisible_) {
                this.element_.style.display = 'none';
                this.renderedVisible_ = false;
            }
            return;
        }
        this.calculateMatrices2D(frameState);
        this.dispatchRenderEvent(RenderEventType.PRECOMPOSE, frameState);
        var layerStatesArray = frameState.layerStatesArray.sort(function (a, b) {
            return a.zIndex - b.zIndex;
        });
        var viewState = frameState.viewState;
        this.children_.length = 0;
        /**
         * @type {Array<import("../layer/BaseVector.js").default>}
         */
        var declutterLayers = [];
        var previousElement = null;
        for (var i = 0, ii = layerStatesArray.length; i < ii; ++i) {
            var layerState = layerStatesArray[i];
            frameState.layerIndex = i;
            if (!inView(layerState, viewState) ||
                (layerState.sourceState != SourceState.READY &&
                    layerState.sourceState != SourceState.UNDEFINED)) {
                continue;
            }
            var layer = layerState.layer;
            var element = layer.render(frameState, previousElement);
            if (!element) {
                continue;
            }
            if (element !== previousElement) {
                this.children_.push(element);
                previousElement = element;
            }
            if ('getDeclutter' in layer) {
                declutterLayers.push(
                /** @type {import("../layer/BaseVector.js").default} */ (layer));
            }
        }
        for (var i = declutterLayers.length - 1; i >= 0; --i) {
            declutterLayers[i].renderDeclutter(frameState);
        }
        replaceChildren(this.element_, this.children_);
        this.dispatchRenderEvent(RenderEventType.POSTCOMPOSE, frameState);
        if (!this.renderedVisible_) {
            this.element_.style.display = '';
            this.renderedVisible_ = true;
        }
        this.scheduleExpireIconCache(frameState);
    };
    /**
     * @param {import("../pixel.js").Pixel} pixel Pixel.
     * @param {import("../PluggableMap.js").FrameState} frameState FrameState.
     * @param {number} hitTolerance Hit tolerance in pixels.
     * @param {function(import("../layer/Layer.js").default<import("../source/Source").default>, (Uint8ClampedArray|Uint8Array)): T} callback Layer
     *     callback.
     * @param {function(import("../layer/Layer.js").default<import("../source/Source").default>): boolean} layerFilter Layer filter
     *     function, only layers which are visible and for which this function
     *     returns `true` will be tested for features.  By default, all visible
     *     layers will be tested.
     * @return {T|undefined} Callback result.
     * @template T
     */
    CompositeMapRenderer.prototype.forEachLayerAtPixel = function (pixel, frameState, hitTolerance, callback, layerFilter) {
        var viewState = frameState.viewState;
        var layerStates = frameState.layerStatesArray;
        var numLayers = layerStates.length;
        for (var i = numLayers - 1; i >= 0; --i) {
            var layerState = layerStates[i];
            var layer = layerState.layer;
            if (layer.hasRenderer() &&
                inView(layerState, viewState) &&
                layerFilter(layer)) {
                var layerRenderer = layer.getRenderer();
                var data = layerRenderer.getDataAtPixel(pixel, frameState, hitTolerance);
                if (data) {
                    var result = callback(layer, data);
                    if (result) {
                        return result;
                    }
                }
            }
        }
        return undefined;
    };
    return CompositeMapRenderer;
}(MapRenderer));

var __extends$3 = (undefined && undefined.__extends) || (function () {
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
/***
 * @template Return
 * @typedef {import("../Observable").OnSignature<import("../Observable").EventTypes, import("../events/Event.js").default, Return> &
 *   import("../Observable").OnSignature<import("./Base").BaseLayerObjectEventTypes|
 *     'change:layers', import("../Object").ObjectEvent, Return> &
 *   import("../Observable").CombinedOnSignature<import("../Observable").EventTypes|import("./Base").BaseLayerObjectEventTypes|'change:layers', Return>} GroupOnSignature
 */
/**
 * @typedef {Object} Options
 * @property {number} [opacity=1] Opacity (0, 1).
 * @property {boolean} [visible=true] Visibility.
 * @property {import("../extent.js").Extent} [extent] The bounding extent for layer rendering.  The layer will not be
 * rendered outside of this extent.
 * @property {number} [zIndex] The z-index for layer rendering.  At rendering time, the layers
 * will be ordered, first by Z-index and then by position. When `undefined`, a `zIndex` of 0 is assumed
 * for layers that are added to the map's `layers` collection, or `Infinity` when the layer's `setMap()`
 * method was used.
 * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
 * visible.
 * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
 * be visible.
 * @property {number} [minZoom] The minimum view zoom level (exclusive) above which this layer will be
 * visible.
 * @property {number} [maxZoom] The maximum view zoom level (inclusive) at which this layer will
 * be visible.
 * @property {Array<import("./Base.js").default>|import("../Collection.js").default<import("./Base.js").default>} [layers] Child layers.
 * @property {Object<string, *>} [properties] Arbitrary observable properties. Can be accessed with `#get()` and `#set()`.
 */
/**
 * @enum {string}
 * @private
 */
var Property = {
    LAYERS: 'layers',
};
/**
 * @classdesc
 * A {@link module:ol/Collection~Collection} of layers that are handled together.
 *
 * A generic `change` event is triggered when the group/Collection changes.
 *
 * @api
 */
var LayerGroup = /** @class */ (function (_super) {
    __extends$3(LayerGroup, _super);
    /**
     * @param {Options} [opt_options] Layer options.
     */
    function LayerGroup(opt_options) {
        var _this = this;
        var options = opt_options || {};
        var baseOptions = /** @type {Options} */ (assign({}, options));
        delete baseOptions.layers;
        var layers = options.layers;
        _this = _super.call(this, baseOptions) || this;
        /***
         * @type {GroupOnSignature<import("../events").EventsKey>}
         */
        _this.on;
        /***
         * @type {GroupOnSignature<import("../events").EventsKey>}
         */
        _this.once;
        /***
         * @type {GroupOnSignature<void>}
         */
        _this.un;
        /**
         * @private
         * @type {Array<import("../events.js").EventsKey>}
         */
        _this.layersListenerKeys_ = [];
        /**
         * @private
         * @type {Object<string, Array<import("../events.js").EventsKey>>}
         */
        _this.listenerKeys_ = {};
        _this.addChangeListener(Property.LAYERS, _this.handleLayersChanged_);
        if (layers) {
            if (Array.isArray(layers)) {
                layers = new Collection(layers.slice(), { unique: true });
            }
            else {
                assert(typeof ( /** @type {?} */(layers).getArray) === 'function', 43); // Expected `layers` to be an array or a `Collection`
            }
        }
        else {
            layers = new Collection(undefined, { unique: true });
        }
        _this.setLayers(layers);
        return _this;
    }
    /**
     * @private
     */
    LayerGroup.prototype.handleLayerChange_ = function () {
        this.changed();
    };
    /**
     * @private
     */
    LayerGroup.prototype.handleLayersChanged_ = function () {
        this.layersListenerKeys_.forEach(unlistenByKey);
        this.layersListenerKeys_.length = 0;
        var layers = this.getLayers();
        this.layersListenerKeys_.push(listen(layers, CollectionEventType.ADD, this.handleLayersAdd_, this), listen(layers, CollectionEventType.REMOVE, this.handleLayersRemove_, this));
        for (var id in this.listenerKeys_) {
            this.listenerKeys_[id].forEach(unlistenByKey);
        }
        clear(this.listenerKeys_);
        var layersArray = layers.getArray();
        for (var i = 0, ii = layersArray.length; i < ii; i++) {
            var layer = layersArray[i];
            this.listenerKeys_[getUid(layer)] = [
                listen(layer, ObjectEventType.PROPERTYCHANGE, this.handleLayerChange_, this),
                listen(layer, EventType.CHANGE, this.handleLayerChange_, this),
            ];
        }
        this.changed();
    };
    /**
     * @param {import("../Collection.js").CollectionEvent} collectionEvent CollectionEvent.
     * @private
     */
    LayerGroup.prototype.handleLayersAdd_ = function (collectionEvent) {
        var layer = /** @type {import("./Base.js").default} */ (collectionEvent.element);
        this.listenerKeys_[getUid(layer)] = [
            listen(layer, ObjectEventType.PROPERTYCHANGE, this.handleLayerChange_, this),
            listen(layer, EventType.CHANGE, this.handleLayerChange_, this),
        ];
        this.changed();
    };
    /**
     * @param {import("../Collection.js").CollectionEvent} collectionEvent CollectionEvent.
     * @private
     */
    LayerGroup.prototype.handleLayersRemove_ = function (collectionEvent) {
        var layer = /** @type {import("./Base.js").default} */ (collectionEvent.element);
        var key = getUid(layer);
        this.listenerKeys_[key].forEach(unlistenByKey);
        delete this.listenerKeys_[key];
        this.changed();
    };
    /**
     * Returns the {@link module:ol/Collection collection} of {@link module:ol/layer/Layer~Layer layers}
     * in this group.
     * @return {!import("../Collection.js").default<import("./Base.js").default>} Collection of
     *   {@link module:ol/layer/Base layers} that are part of this group.
     * @observable
     * @api
     */
    LayerGroup.prototype.getLayers = function () {
        return /** @type {!import("../Collection.js").default<import("./Base.js").default>} */ (this.get(Property.LAYERS));
    };
    /**
     * Set the {@link module:ol/Collection collection} of {@link module:ol/layer/Layer~Layer layers}
     * in this group.
     * @param {!import("../Collection.js").default<import("./Base.js").default>} layers Collection of
     *   {@link module:ol/layer/Base layers} that are part of this group.
     * @observable
     * @api
     */
    LayerGroup.prototype.setLayers = function (layers) {
        this.set(Property.LAYERS, layers);
    };
    /**
     * @param {Array<import("./Layer.js").default>} [opt_array] Array of layers (to be modified in place).
     * @return {Array<import("./Layer.js").default>} Array of layers.
     */
    LayerGroup.prototype.getLayersArray = function (opt_array) {
        var array = opt_array !== undefined ? opt_array : [];
        this.getLayers().forEach(function (layer) {
            layer.getLayersArray(array);
        });
        return array;
    };
    /**
     * Get the layer states list and use this groups z-index as the default
     * for all layers in this and nested groups, if it is unset at this point.
     * If opt_states is not provided and this group's z-index is undefined
     * 0 is used a the default z-index.
     * @param {Array<import("./Layer.js").State>} [opt_states] Optional list
     * of layer states (to be modified in place).
     * @return {Array<import("./Layer.js").State>} List of layer states.
     */
    LayerGroup.prototype.getLayerStatesArray = function (opt_states) {
        var states = opt_states !== undefined ? opt_states : [];
        var pos = states.length;
        this.getLayers().forEach(function (layer) {
            layer.getLayerStatesArray(states);
        });
        var ownLayerState = this.getLayerState();
        var defaultZIndex = ownLayerState.zIndex;
        if (!opt_states && ownLayerState.zIndex === undefined) {
            defaultZIndex = 0;
        }
        for (var i = pos, ii = states.length; i < ii; i++) {
            var layerState = states[i];
            layerState.opacity *= ownLayerState.opacity;
            layerState.visible = layerState.visible && ownLayerState.visible;
            layerState.maxResolution = Math.min(layerState.maxResolution, ownLayerState.maxResolution);
            layerState.minResolution = Math.max(layerState.minResolution, ownLayerState.minResolution);
            layerState.minZoom = Math.max(layerState.minZoom, ownLayerState.minZoom);
            layerState.maxZoom = Math.min(layerState.maxZoom, ownLayerState.maxZoom);
            if (ownLayerState.extent !== undefined) {
                if (layerState.extent !== undefined) {
                    layerState.extent = getIntersection(layerState.extent, ownLayerState.extent);
                }
                else {
                    layerState.extent = ownLayerState.extent;
                }
            }
            if (layerState.zIndex === undefined) {
                layerState.zIndex = defaultZIndex;
            }
        }
        return states;
    };
    /**
     * @return {import("../source/State.js").default} Source state.
     */
    LayerGroup.prototype.getSourceState = function () {
        return SourceState.READY;
    };
    return LayerGroup;
}(BaseLayer));

var __extends$4 = (undefined && undefined.__extends) || (function () {
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
 * @classdesc
 * Events emitted as map events are instances of this type.
 * See {@link module:ol/PluggableMap~PluggableMap} for which events trigger a map event.
 */
var MapEvent = /** @class */ (function (_super) {
    __extends$4(MapEvent, _super);
    /**
     * @param {string} type Event type.
     * @param {import("./PluggableMap.js").default} map Map.
     * @param {?import("./PluggableMap.js").FrameState} [opt_frameState] Frame state.
     */
    function MapEvent(type, map, opt_frameState) {
        var _this = _super.call(this, type) || this;
        /**
         * The map where the event occurred.
         * @type {import("./PluggableMap.js").default}
         * @api
         */
        _this.map = map;
        /**
         * The frame state at the time of the event.
         * @type {?import("./PluggableMap.js").FrameState}
         * @api
         */
        _this.frameState = opt_frameState !== undefined ? opt_frameState : null;
        return _this;
    }
    return MapEvent;
}(BaseEvent));

var __extends$5 = (undefined && undefined.__extends) || (function () {
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
 * @classdesc
 * Events emitted as map browser events are instances of this type.
 * See {@link module:ol/PluggableMap~PluggableMap} for which events trigger a map browser event.
 * @template {UIEvent} EVENT
 */
var MapBrowserEvent = /** @class */ (function (_super) {
    __extends$5(MapBrowserEvent, _super);
    /**
     * @param {string} type Event type.
     * @param {import("./PluggableMap.js").default} map Map.
     * @param {EVENT} originalEvent Original event.
     * @param {boolean} [opt_dragging] Is the map currently being dragged?
     * @param {?import("./PluggableMap.js").FrameState} [opt_frameState] Frame state.
     */
    function MapBrowserEvent(type, map, originalEvent, opt_dragging, opt_frameState) {
        var _this = _super.call(this, type, map, opt_frameState) || this;
        /**
         * The original browser event.
         * @const
         * @type {EVENT}
         * @api
         */
        _this.originalEvent = originalEvent;
        /**
         * The map pixel relative to the viewport corresponding to the original browser event.
         * @type {?import("./pixel.js").Pixel}
         */
        _this.pixel_ = null;
        /**
         * The coordinate in the user projection corresponding to the original browser event.
         * @type {?import("./coordinate.js").Coordinate}
         */
        _this.coordinate_ = null;
        /**
         * Indicates if the map is currently being dragged. Only set for
         * `POINTERDRAG` and `POINTERMOVE` events. Default is `false`.
         *
         * @type {boolean}
         * @api
         */
        _this.dragging = opt_dragging !== undefined ? opt_dragging : false;
        return _this;
    }
    Object.defineProperty(MapBrowserEvent.prototype, "pixel", {
        /**
         * The map pixel relative to the viewport corresponding to the original event.
         * @type {import("./pixel.js").Pixel}
         * @api
         */
        get: function () {
            if (!this.pixel_) {
                this.pixel_ = this.map.getEventPixel(this.originalEvent);
            }
            return this.pixel_;
        },
        set: function (pixel) {
            this.pixel_ = pixel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MapBrowserEvent.prototype, "coordinate", {
        /**
         * The coordinate corresponding to the original browser event.  This will be in the user
         * projection if one is set.  Otherwise it will be in the view projection.
         * @type {import("./coordinate.js").Coordinate}
         * @api
         */
        get: function () {
            if (!this.coordinate_) {
                this.coordinate_ = this.map.getCoordinateFromPixel(this.pixel);
            }
            return this.coordinate_;
        },
        set: function (coordinate) {
            this.coordinate_ = coordinate;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Prevents the default browser action.
     * See https://developer.mozilla.org/en-US/docs/Web/API/event.preventDefault.
     * @api
     */
    MapBrowserEvent.prototype.preventDefault = function () {
        _super.prototype.preventDefault.call(this);
        if ('preventDefault' in this.originalEvent) {
            /** @type {UIEvent} */ (this.originalEvent).preventDefault();
        }
    };
    /**
     * Prevents further propagation of the current event.
     * See https://developer.mozilla.org/en-US/docs/Web/API/event.stopPropagation.
     * @api
     */
    MapBrowserEvent.prototype.stopPropagation = function () {
        _super.prototype.stopPropagation.call(this);
        if ('stopPropagation' in this.originalEvent) {
            /** @type {UIEvent} */ (this.originalEvent).stopPropagation();
        }
    };
    return MapBrowserEvent;
}(MapEvent));

/**
 * @module ol/pointer/EventType
 */
/**
 * Constants for event names.
 * @enum {string}
 */
var PointerEventType = {
    POINTERMOVE: 'pointermove',
    POINTERDOWN: 'pointerdown',
    POINTERUP: 'pointerup',
    POINTEROVER: 'pointerover',
    POINTEROUT: 'pointerout',
    POINTERENTER: 'pointerenter',
    POINTERLEAVE: 'pointerleave',
    POINTERCANCEL: 'pointercancel',
};

/**
 * @module ol/MapBrowserEventHandler
 */
var __extends$6 = (undefined && undefined.__extends) || (function () {
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
var MapBrowserEventHandler = /** @class */ (function (_super) {
    __extends$6(MapBrowserEventHandler, _super);
    /**
     * @param {import("./PluggableMap.js").default} map The map with the viewport to listen to events on.
     * @param {number} [moveTolerance] The minimal distance the pointer must travel to trigger a move.
     */
    function MapBrowserEventHandler(map, moveTolerance) {
        var _this = _super.call(this, map) || this;
        /**
         * This is the element that we will listen to the real events on.
         * @type {import("./PluggableMap.js").default}
         * @private
         */
        _this.map_ = map;
        /**
         * @type {any}
         * @private
         */
        _this.clickTimeoutId_;
        /**
         * Emulate dblclick and singleclick. Will be true when only one pointer is active.
         * @type {boolean}
         */
        _this.emulateClicks_ = false;
        /**
         * @type {boolean}
         * @private
         */
        _this.dragging_ = false;
        /**
         * @type {!Array<import("./events.js").EventsKey>}
         * @private
         */
        _this.dragListenerKeys_ = [];
        /**
         * @type {number}
         * @private
         */
        _this.moveTolerance_ = moveTolerance === undefined ? 1 : moveTolerance;
        /**
         * The most recent "down" type event (or null if none have occurred).
         * Set on pointerdown.
         * @type {PointerEvent}
         * @private
         */
        _this.down_ = null;
        var element = _this.map_.getViewport();
        /**
         * @type {number}
         * @private
         */
        _this.activePointers_ = 0;
        /**
         * @type {!Object<number, boolean>}
         * @private
         */
        _this.trackedTouches_ = {};
        _this.element_ = element;
        /**
         * @type {?import("./events.js").EventsKey}
         * @private
         */
        _this.pointerdownListenerKey_ = listen(element, PointerEventType.POINTERDOWN, _this.handlePointerDown_, _this);
        /**
         * @type {PointerEvent}
         * @private
         */
        _this.originalPointerMoveEvent_;
        /**
         * @type {?import("./events.js").EventsKey}
         * @private
         */
        _this.relayedListenerKey_ = listen(element, PointerEventType.POINTERMOVE, _this.relayEvent_, _this);
        /**
         * @private
         */
        _this.boundHandleTouchMove_ = _this.handleTouchMove_.bind(_this);
        _this.element_.addEventListener(EventType.TOUCHMOVE, _this.boundHandleTouchMove_, PASSIVE_EVENT_LISTENERS ? { passive: false } : false);
        return _this;
    }
    /**
     * @param {PointerEvent} pointerEvent Pointer
     * event.
     * @private
     */
    MapBrowserEventHandler.prototype.emulateClick_ = function (pointerEvent) {
        var newEvent = new MapBrowserEvent(MapBrowserEventType.CLICK, this.map_, pointerEvent);
        this.dispatchEvent(newEvent);
        if (this.clickTimeoutId_ !== undefined) {
            // double-click
            clearTimeout(this.clickTimeoutId_);
            this.clickTimeoutId_ = undefined;
            newEvent = new MapBrowserEvent(MapBrowserEventType.DBLCLICK, this.map_, pointerEvent);
            this.dispatchEvent(newEvent);
        }
        else {
            // click
            this.clickTimeoutId_ = setTimeout(
            /** @this {MapBrowserEventHandler} */
            function () {
                this.clickTimeoutId_ = undefined;
                var newEvent = new MapBrowserEvent(MapBrowserEventType.SINGLECLICK, this.map_, pointerEvent);
                this.dispatchEvent(newEvent);
            }.bind(this), 250);
        }
    };
    /**
     * Keeps track on how many pointers are currently active.
     *
     * @param {PointerEvent} pointerEvent Pointer
     * event.
     * @private
     */
    MapBrowserEventHandler.prototype.updateActivePointers_ = function (pointerEvent) {
        var event = pointerEvent;
        if (event.type == MapBrowserEventType.POINTERUP ||
            event.type == MapBrowserEventType.POINTERCANCEL) {
            delete this.trackedTouches_[event.pointerId];
        }
        else if (event.type == MapBrowserEventType.POINTERDOWN) {
            this.trackedTouches_[event.pointerId] = true;
        }
        this.activePointers_ = Object.keys(this.trackedTouches_).length;
    };
    /**
     * @param {PointerEvent} pointerEvent Pointer
     * event.
     * @private
     */
    MapBrowserEventHandler.prototype.handlePointerUp_ = function (pointerEvent) {
        this.updateActivePointers_(pointerEvent);
        var newEvent = new MapBrowserEvent(MapBrowserEventType.POINTERUP, this.map_, pointerEvent);
        this.dispatchEvent(newEvent);
        // We emulate click events on left mouse button click, touch contact, and pen
        // contact. isMouseActionButton returns true in these cases (evt.button is set
        // to 0).
        // See http://www.w3.org/TR/pointerevents/#button-states
        // We only fire click, singleclick, and doubleclick if nobody has called
        // event.preventDefault().
        if (this.emulateClicks_ &&
            !newEvent.defaultPrevented &&
            !this.dragging_ &&
            this.isMouseActionButton_(pointerEvent)) {
            this.emulateClick_(this.down_);
        }
        if (this.activePointers_ === 0) {
            this.dragListenerKeys_.forEach(unlistenByKey);
            this.dragListenerKeys_.length = 0;
            this.dragging_ = false;
            this.down_ = null;
        }
    };
    /**
     * @param {PointerEvent} pointerEvent Pointer
     * event.
     * @return {boolean} If the left mouse button was pressed.
     * @private
     */
    MapBrowserEventHandler.prototype.isMouseActionButton_ = function (pointerEvent) {
        return pointerEvent.button === 0;
    };
    /**
     * @param {PointerEvent} pointerEvent Pointer
     * event.
     * @private
     */
    MapBrowserEventHandler.prototype.handlePointerDown_ = function (pointerEvent) {
        this.emulateClicks_ = this.activePointers_ === 0;
        this.updateActivePointers_(pointerEvent);
        var newEvent = new MapBrowserEvent(MapBrowserEventType.POINTERDOWN, this.map_, pointerEvent);
        this.dispatchEvent(newEvent);
        // Store a copy of the down event
        this.down_ = /** @type {PointerEvent} */ ({});
        for (var property in pointerEvent) {
            var value = pointerEvent[property];
            this.down_[property] = typeof value === 'function' ? VOID : value;
        }
        if (this.dragListenerKeys_.length === 0) {
            var doc = this.map_.getOwnerDocument();
            this.dragListenerKeys_.push(listen(doc, MapBrowserEventType.POINTERMOVE, this.handlePointerMove_, this), listen(doc, MapBrowserEventType.POINTERUP, this.handlePointerUp_, this), 
            /* Note that the listener for `pointercancel is set up on
             * `pointerEventHandler_` and not `documentPointerEventHandler_` like
             * the `pointerup` and `pointermove` listeners.
             *
             * The reason for this is the following: `TouchSource.vacuumTouches_()`
             * issues `pointercancel` events, when there was no `touchend` for a
             * `touchstart`. Now, let's say a first `touchstart` is registered on
             * `pointerEventHandler_`. The `documentPointerEventHandler_` is set up.
             * But `documentPointerEventHandler_` doesn't know about the first
             * `touchstart`. If there is no `touchend` for the `touchstart`, we can
             * only receive a `touchcancel` from `pointerEventHandler_`, because it is
             * only registered there.
             */
            listen(this.element_, MapBrowserEventType.POINTERCANCEL, this.handlePointerUp_, this));
            if (this.element_.getRootNode && this.element_.getRootNode() !== doc) {
                this.dragListenerKeys_.push(listen(this.element_.getRootNode(), MapBrowserEventType.POINTERUP, this.handlePointerUp_, this));
            }
        }
    };
    /**
     * @param {PointerEvent} pointerEvent Pointer
     * event.
     * @private
     */
    MapBrowserEventHandler.prototype.handlePointerMove_ = function (pointerEvent) {
        // Between pointerdown and pointerup, pointermove events are triggered.
        // To avoid a 'false' touchmove event to be dispatched, we test if the pointer
        // moved a significant distance.
        if (this.isMoving_(pointerEvent)) {
            this.dragging_ = true;
            var newEvent = new MapBrowserEvent(MapBrowserEventType.POINTERDRAG, this.map_, pointerEvent, this.dragging_);
            this.dispatchEvent(newEvent);
        }
    };
    /**
     * Wrap and relay a pointer event.  Note that this requires that the type
     * string for the MapBrowserEvent matches the PointerEvent type.
     * @param {PointerEvent} pointerEvent Pointer
     * event.
     * @private
     */
    MapBrowserEventHandler.prototype.relayEvent_ = function (pointerEvent) {
        this.originalPointerMoveEvent_ = pointerEvent;
        var dragging = !!(this.down_ && this.isMoving_(pointerEvent));
        this.dispatchEvent(new MapBrowserEvent(pointerEvent.type, this.map_, pointerEvent, dragging));
    };
    /**
     * Flexible handling of a `touch-action: none` css equivalent: because calling
     * `preventDefault()` on a `pointermove` event does not stop native page scrolling
     * and zooming, we also listen for `touchmove` and call `preventDefault()` on it
     * when an interaction (currently `DragPan` handles the event.
     * @param {TouchEvent} event Event.
     * @private
     */
    MapBrowserEventHandler.prototype.handleTouchMove_ = function (event) {
        // Due to https://github.com/mpizenberg/elm-pep/issues/2, `this.originalPointerMoveEvent_`
        // may not be initialized yet when we get here on a platform without native pointer events.
        var originalEvent = this.originalPointerMoveEvent_;
        if ((!originalEvent || originalEvent.defaultPrevented) &&
            (typeof event.cancelable !== 'boolean' || event.cancelable === true)) {
            event.preventDefault();
        }
    };
    /**
     * @param {PointerEvent} pointerEvent Pointer
     * event.
     * @return {boolean} Is moving.
     * @private
     */
    MapBrowserEventHandler.prototype.isMoving_ = function (pointerEvent) {
        return (this.dragging_ ||
            Math.abs(pointerEvent.clientX - this.down_.clientX) >
                this.moveTolerance_ ||
            Math.abs(pointerEvent.clientY - this.down_.clientY) > this.moveTolerance_);
    };
    /**
     * Clean up.
     */
    MapBrowserEventHandler.prototype.disposeInternal = function () {
        if (this.relayedListenerKey_) {
            unlistenByKey(this.relayedListenerKey_);
            this.relayedListenerKey_ = null;
        }
        this.element_.removeEventListener(EventType.TOUCHMOVE, this.boundHandleTouchMove_);
        if (this.pointerdownListenerKey_) {
            unlistenByKey(this.pointerdownListenerKey_);
            this.pointerdownListenerKey_ = null;
        }
        this.dragListenerKeys_.forEach(unlistenByKey);
        this.dragListenerKeys_.length = 0;
        this.element_ = null;
        _super.prototype.disposeInternal.call(this);
    };
    return MapBrowserEventHandler;
}(Target));

/**
 * @module ol/MapEventType
 */
/**
 * @enum {string}
 */
var MapEventType = {
    /**
     * Triggered after a map frame is rendered.
     * @event module:ol/MapEvent~MapEvent#postrender
     * @api
     */
    POSTRENDER: 'postrender',
    /**
     * Triggered when the map starts moving.
     * @event module:ol/MapEvent~MapEvent#movestart
     * @api
     */
    MOVESTART: 'movestart',
    /**
     * Triggered after the map is moved.
     * @event module:ol/MapEvent~MapEvent#moveend
     * @api
     */
    MOVEEND: 'moveend',
};
/***
 * @typedef {'postrender'|'movestart'|'moveend'} Types
 */

/**
 * @module ol/MapProperty
 */
/**
 * @enum {string}
 */
var MapProperty = {
    LAYERGROUP: 'layergroup',
    SIZE: 'size',
    TARGET: 'target',
    VIEW: 'view',
};

/**
 * @module ol/structs/PriorityQueue
 */
/**
 * @type {number}
 */
var DROP = Infinity;
/**
 * @classdesc
 * Priority queue.
 *
 * The implementation is inspired from the Closure Library's Heap class and
 * Python's heapq module.
 *
 * See https://github.com/google/closure-library/blob/master/closure/goog/structs/heap.js
 * and https://hg.python.org/cpython/file/2.7/Lib/heapq.py.
 *
 * @template T
 */
var PriorityQueue = /** @class */ (function () {
    /**
     * @param {function(T): number} priorityFunction Priority function.
     * @param {function(T): string} keyFunction Key function.
     */
    function PriorityQueue(priorityFunction, keyFunction) {
        /**
         * @type {function(T): number}
         * @private
         */
        this.priorityFunction_ = priorityFunction;
        /**
         * @type {function(T): string}
         * @private
         */
        this.keyFunction_ = keyFunction;
        /**
         * @type {Array<T>}
         * @private
         */
        this.elements_ = [];
        /**
         * @type {Array<number>}
         * @private
         */
        this.priorities_ = [];
        /**
         * @type {!Object<string, boolean>}
         * @private
         */
        this.queuedElements_ = {};
    }
    /**
     * FIXME empty description for jsdoc
     */
    PriorityQueue.prototype.clear = function () {
        this.elements_.length = 0;
        this.priorities_.length = 0;
        clear(this.queuedElements_);
    };
    /**
     * Remove and return the highest-priority element. O(log N).
     * @return {T} Element.
     */
    PriorityQueue.prototype.dequeue = function () {
        var elements = this.elements_;
        var priorities = this.priorities_;
        var element = elements[0];
        if (elements.length == 1) {
            elements.length = 0;
            priorities.length = 0;
        }
        else {
            elements[0] = elements.pop();
            priorities[0] = priorities.pop();
            this.siftUp_(0);
        }
        var elementKey = this.keyFunction_(element);
        delete this.queuedElements_[elementKey];
        return element;
    };
    /**
     * Enqueue an element. O(log N).
     * @param {T} element Element.
     * @return {boolean} The element was added to the queue.
     */
    PriorityQueue.prototype.enqueue = function (element) {
        assert(!(this.keyFunction_(element) in this.queuedElements_), 31); // Tried to enqueue an `element` that was already added to the queue
        var priority = this.priorityFunction_(element);
        if (priority != DROP) {
            this.elements_.push(element);
            this.priorities_.push(priority);
            this.queuedElements_[this.keyFunction_(element)] = true;
            this.siftDown_(0, this.elements_.length - 1);
            return true;
        }
        return false;
    };
    /**
     * @return {number} Count.
     */
    PriorityQueue.prototype.getCount = function () {
        return this.elements_.length;
    };
    /**
     * Gets the index of the left child of the node at the given index.
     * @param {number} index The index of the node to get the left child for.
     * @return {number} The index of the left child.
     * @private
     */
    PriorityQueue.prototype.getLeftChildIndex_ = function (index) {
        return index * 2 + 1;
    };
    /**
     * Gets the index of the right child of the node at the given index.
     * @param {number} index The index of the node to get the right child for.
     * @return {number} The index of the right child.
     * @private
     */
    PriorityQueue.prototype.getRightChildIndex_ = function (index) {
        return index * 2 + 2;
    };
    /**
     * Gets the index of the parent of the node at the given index.
     * @param {number} index The index of the node to get the parent for.
     * @return {number} The index of the parent.
     * @private
     */
    PriorityQueue.prototype.getParentIndex_ = function (index) {
        return (index - 1) >> 1;
    };
    /**
     * Make this a heap. O(N).
     * @private
     */
    PriorityQueue.prototype.heapify_ = function () {
        var i;
        for (i = (this.elements_.length >> 1) - 1; i >= 0; i--) {
            this.siftUp_(i);
        }
    };
    /**
     * @return {boolean} Is empty.
     */
    PriorityQueue.prototype.isEmpty = function () {
        return this.elements_.length === 0;
    };
    /**
     * @param {string} key Key.
     * @return {boolean} Is key queued.
     */
    PriorityQueue.prototype.isKeyQueued = function (key) {
        return key in this.queuedElements_;
    };
    /**
     * @param {T} element Element.
     * @return {boolean} Is queued.
     */
    PriorityQueue.prototype.isQueued = function (element) {
        return this.isKeyQueued(this.keyFunction_(element));
    };
    /**
     * @param {number} index The index of the node to move down.
     * @private
     */
    PriorityQueue.prototype.siftUp_ = function (index) {
        var elements = this.elements_;
        var priorities = this.priorities_;
        var count = elements.length;
        var element = elements[index];
        var priority = priorities[index];
        var startIndex = index;
        while (index < count >> 1) {
            var lIndex = this.getLeftChildIndex_(index);
            var rIndex = this.getRightChildIndex_(index);
            var smallerChildIndex = rIndex < count && priorities[rIndex] < priorities[lIndex]
                ? rIndex
                : lIndex;
            elements[index] = elements[smallerChildIndex];
            priorities[index] = priorities[smallerChildIndex];
            index = smallerChildIndex;
        }
        elements[index] = element;
        priorities[index] = priority;
        this.siftDown_(startIndex, index);
    };
    /**
     * @param {number} startIndex The index of the root.
     * @param {number} index The index of the node to move up.
     * @private
     */
    PriorityQueue.prototype.siftDown_ = function (startIndex, index) {
        var elements = this.elements_;
        var priorities = this.priorities_;
        var element = elements[index];
        var priority = priorities[index];
        while (index > startIndex) {
            var parentIndex = this.getParentIndex_(index);
            if (priorities[parentIndex] > priority) {
                elements[index] = elements[parentIndex];
                priorities[index] = priorities[parentIndex];
                index = parentIndex;
            }
            else {
                break;
            }
        }
        elements[index] = element;
        priorities[index] = priority;
    };
    /**
     * FIXME empty description for jsdoc
     */
    PriorityQueue.prototype.reprioritize = function () {
        var priorityFunction = this.priorityFunction_;
        var elements = this.elements_;
        var priorities = this.priorities_;
        var index = 0;
        var n = elements.length;
        var element, i, priority;
        for (i = 0; i < n; ++i) {
            element = elements[i];
            priority = priorityFunction(element);
            if (priority == DROP) {
                delete this.queuedElements_[this.keyFunction_(element)];
            }
            else {
                priorities[index] = priority;
                elements[index++] = element;
            }
        }
        elements.length = index;
        priorities.length = index;
        this.heapify_();
    };
    return PriorityQueue;
}());

var __extends$7 = (undefined && undefined.__extends) || (function () {
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
 * @typedef {function(import("./Tile.js").default, string, import("./coordinate.js").Coordinate, number): number} PriorityFunction
 */
var TileQueue = /** @class */ (function (_super) {
    __extends$7(TileQueue, _super);
    /**
     * @param {PriorityFunction} tilePriorityFunction Tile priority function.
     * @param {function(): ?} tileChangeCallback Function called on each tile change event.
     */
    function TileQueue(tilePriorityFunction, tileChangeCallback) {
        var _this = _super.call(this, 
        /**
         * @param {Array} element Element.
         * @return {number} Priority.
         */
        function (element) {
            return tilePriorityFunction.apply(null, element);
        }, 
        /**
         * @param {Array} element Element.
         * @return {string} Key.
         */
        function (element) {
            return /** @type {import("./Tile.js").default} */ (element[0]).getKey();
        }) || this;
        /** @private */
        _this.boundHandleTileChange_ = _this.handleTileChange.bind(_this);
        /**
         * @private
         * @type {function(): ?}
         */
        _this.tileChangeCallback_ = tileChangeCallback;
        /**
         * @private
         * @type {number}
         */
        _this.tilesLoading_ = 0;
        /**
         * @private
         * @type {!Object<string,boolean>}
         */
        _this.tilesLoadingKeys_ = {};
        return _this;
    }
    /**
     * @param {Array} element Element.
     * @return {boolean} The element was added to the queue.
     */
    TileQueue.prototype.enqueue = function (element) {
        var added = _super.prototype.enqueue.call(this, element);
        if (added) {
            var tile = element[0];
            tile.addEventListener(EventType.CHANGE, this.boundHandleTileChange_);
        }
        return added;
    };
    /**
     * @return {number} Number of tiles loading.
     */
    TileQueue.prototype.getTilesLoading = function () {
        return this.tilesLoading_;
    };
    /**
     * @param {import("./events/Event.js").default} event Event.
     * @protected
     */
    TileQueue.prototype.handleTileChange = function (event) {
        var tile = /** @type {import("./Tile.js").default} */ (event.target);
        var state = tile.getState();
        if (state === TileState.LOADED ||
            state === TileState.ERROR ||
            state === TileState.EMPTY) {
            tile.removeEventListener(EventType.CHANGE, this.boundHandleTileChange_);
            var tileKey = tile.getKey();
            if (tileKey in this.tilesLoadingKeys_) {
                delete this.tilesLoadingKeys_[tileKey];
                --this.tilesLoading_;
            }
            this.tileChangeCallback_();
        }
    };
    /**
     * @param {number} maxTotalLoading Maximum number tiles to load simultaneously.
     * @param {number} maxNewLoads Maximum number of new tiles to load.
     */
    TileQueue.prototype.loadMoreTiles = function (maxTotalLoading, maxNewLoads) {
        var newLoads = 0;
        var state, tile, tileKey;
        while (this.tilesLoading_ < maxTotalLoading &&
            newLoads < maxNewLoads &&
            this.getCount() > 0) {
            tile = /** @type {import("./Tile.js").default} */ (this.dequeue()[0]);
            tileKey = tile.getKey();
            state = tile.getState();
            if (state === TileState.IDLE && !(tileKey in this.tilesLoadingKeys_)) {
                this.tilesLoadingKeys_[tileKey] = true;
                ++this.tilesLoading_;
                ++newLoads;
                tile.load();
            }
        }
    };
    return TileQueue;
}(PriorityQueue));
/**
 * @param {import('./PluggableMap.js').FrameState} frameState Frame state.
 * @param {import("./Tile.js").default} tile Tile.
 * @param {string} tileSourceKey Tile source key.
 * @param {import("./coordinate.js").Coordinate} tileCenter Tile center.
 * @param {number} tileResolution Tile resolution.
 * @return {number} Tile priority.
 */
function getTilePriority(frameState, tile, tileSourceKey, tileCenter, tileResolution) {
    // Filter out tiles at higher zoom levels than the current zoom level, or that
    // are outside the visible extent.
    if (!frameState || !(tileSourceKey in frameState.wantedTiles)) {
        return DROP;
    }
    if (!frameState.wantedTiles[tileSourceKey][tile.getKey()]) {
        return DROP;
    }
    // Prioritize the highest zoom level tiles closest to the focus.
    // Tiles at higher zoom levels are prioritized using Math.log(tileResolution).
    // Within a zoom level, tiles are prioritized by the distance in pixels between
    // the center of the tile and the center of the viewport.  The factor of 65536
    // means that the prioritization should behave as desired for tiles up to
    // 65536 * Math.log(2) = 45426 pixels from the focus.
    var center = frameState.viewState.center;
    var deltaX = tileCenter[0] - center[0];
    var deltaY = tileCenter[1] - center[1];
    return (65536 * Math.log(tileResolution) +
        Math.sqrt(deltaX * deltaX + deltaY * deltaY) / tileResolution);
}

/**
 * @module ol/ViewProperty
 */
/**
 * @enum {string}
 */
var ViewProperty = {
    CENTER: 'center',
    RESOLUTION: 'resolution',
    ROTATION: 'rotation',
};

/**
 * @module ol/centerconstraint
 */
/**
 * @typedef {function((import("./coordinate.js").Coordinate|undefined), number, import("./size.js").Size, boolean=, Array<number>=): (import("./coordinate.js").Coordinate|undefined)} Type
 */
/**
 * @param {import("./extent.js").Extent} extent Extent.
 * @param {boolean} onlyCenter If true, the constraint will only apply to the view center.
 * @param {boolean} smooth If true, the view will be able to go slightly out of the given extent
 * (only during interaction and animation).
 * @return {Type} The constraint.
 */
function createExtent(extent, onlyCenter, smooth) {
    return (
    /**
     * @param {import("./coordinate.js").Coordinate|undefined} center Center.
     * @param {number} resolution Resolution.
     * @param {import("./size.js").Size} size Viewport size; unused if `onlyCenter` was specified.
     * @param {boolean} [opt_isMoving] True if an interaction or animation is in progress.
     * @param {Array<number>} [opt_centerShift] Shift between map center and viewport center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    function (center, resolution, size, opt_isMoving, opt_centerShift) {
        if (center) {
            var viewWidth = onlyCenter ? 0 : size[0] * resolution;
            var viewHeight = onlyCenter ? 0 : size[1] * resolution;
            var shiftX = opt_centerShift ? opt_centerShift[0] : 0;
            var shiftY = opt_centerShift ? opt_centerShift[1] : 0;
            var minX = extent[0] + viewWidth / 2 + shiftX;
            var maxX = extent[2] - viewWidth / 2 + shiftX;
            var minY = extent[1] + viewHeight / 2 + shiftY;
            var maxY = extent[3] - viewHeight / 2 + shiftY;
            // note: when zooming out of bounds, min and max values for x and y may
            // end up inverted (min > max); this has to be accounted for
            if (minX > maxX) {
                minX = (maxX + minX) / 2;
                maxX = minX;
            }
            if (minY > maxY) {
                minY = (maxY + minY) / 2;
                maxY = minY;
            }
            var x = clamp(center[0], minX, maxX);
            var y = clamp(center[1], minY, maxY);
            var ratio = 30 * resolution;
            // during an interaction, allow some overscroll
            if (opt_isMoving && smooth) {
                x +=
                    -ratio * Math.log(1 + Math.max(0, minX - center[0]) / ratio) +
                        ratio * Math.log(1 + Math.max(0, center[0] - maxX) / ratio);
                y +=
                    -ratio * Math.log(1 + Math.max(0, minY - center[1]) / ratio) +
                        ratio * Math.log(1 + Math.max(0, center[1] - maxY) / ratio);
            }
            return [x, y];
        }
        else {
            return undefined;
        }
    });
}
/**
 * @param {import("./coordinate.js").Coordinate} [center] Center.
 * @return {import("./coordinate.js").Coordinate|undefined} Center.
 */
function none(center) {
    return center;
}

/**
 * @module ol/resolutionconstraint
 */
/**
 * @typedef {function((number|undefined), number, import("./size.js").Size, boolean=): (number|undefined)} Type
 */
/**
 * Returns a modified resolution taking into account the viewport size and maximum
 * allowed extent.
 * @param {number} resolution Resolution
 * @param {import("./extent.js").Extent} maxExtent Maximum allowed extent.
 * @param {import("./size.js").Size} viewportSize Viewport size.
 * @param {boolean} showFullExtent Whether to show the full extent.
 * @return {number} Capped resolution.
 */
function getViewportClampedResolution(resolution, maxExtent, viewportSize, showFullExtent) {
    var xResolution = getWidth(maxExtent) / viewportSize[0];
    var yResolution = getHeight(maxExtent) / viewportSize[1];
    if (showFullExtent) {
        return Math.min(resolution, Math.max(xResolution, yResolution));
    }
    return Math.min(resolution, Math.min(xResolution, yResolution));
}
/**
 * Returns a modified resolution to be between maxResolution and minResolution while
 * still allowing the value to be slightly out of bounds.
 * Note: the computation is based on the logarithm function (ln):
 *  - at 1, ln(x) is 0
 *  - above 1, ln(x) keeps increasing but at a much slower pace than x
 * The final result is clamped to prevent getting too far away from bounds.
 * @param {number} resolution Resolution.
 * @param {number} maxResolution Max resolution.
 * @param {number} minResolution Min resolution.
 * @return {number} Smoothed resolution.
 */
function getSmoothClampedResolution(resolution, maxResolution, minResolution) {
    var result = Math.min(resolution, maxResolution);
    var ratio = 50;
    result *=
        Math.log(1 + ratio * Math.max(0, resolution / maxResolution - 1)) / ratio +
            1;
    if (minResolution) {
        result = Math.max(result, minResolution);
        result /=
            Math.log(1 + ratio * Math.max(0, minResolution / resolution - 1)) /
                ratio +
                1;
    }
    return clamp(result, minResolution / 2, maxResolution * 2);
}
/**
 * @param {Array<number>} resolutions Resolutions.
 * @param {boolean} [opt_smooth] If true, the view will be able to slightly exceed resolution limits. Default: true.
 * @param {import("./extent.js").Extent} [opt_maxExtent] Maximum allowed extent.
 * @param {boolean} [opt_showFullExtent] If true, allows us to show the full extent. Default: false.
 * @return {Type} Zoom function.
 */
function createSnapToResolutions(resolutions, opt_smooth, opt_maxExtent, opt_showFullExtent) {
    return (
    /**
     * @param {number|undefined} resolution Resolution.
     * @param {number} direction Direction.
     * @param {import("./size.js").Size} size Viewport size.
     * @param {boolean} [opt_isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Resolution.
     */
    function (resolution, direction, size, opt_isMoving) {
        if (resolution !== undefined) {
            var maxResolution = resolutions[0];
            var minResolution = resolutions[resolutions.length - 1];
            var cappedMaxRes = opt_maxExtent
                ? getViewportClampedResolution(maxResolution, opt_maxExtent, size, opt_showFullExtent)
                : maxResolution;
            // during interacting or animating, allow intermediary values
            if (opt_isMoving) {
                var smooth = opt_smooth !== undefined ? opt_smooth : true;
                if (!smooth) {
                    return clamp(resolution, minResolution, cappedMaxRes);
                }
                return getSmoothClampedResolution(resolution, cappedMaxRes, minResolution);
            }
            var capped = Math.min(cappedMaxRes, resolution);
            var z = Math.floor(linearFindNearest(resolutions, capped, direction));
            if (resolutions[z] > cappedMaxRes && z < resolutions.length - 1) {
                return resolutions[z + 1];
            }
            return resolutions[z];
        }
        else {
            return undefined;
        }
    });
}
/**
 * @param {number} power Power.
 * @param {number} maxResolution Maximum resolution.
 * @param {number} [opt_minResolution] Minimum resolution.
 * @param {boolean} [opt_smooth] If true, the view will be able to slightly exceed resolution limits. Default: true.
 * @param {import("./extent.js").Extent} [opt_maxExtent] Maximum allowed extent.
 * @param {boolean} [opt_showFullExtent] If true, allows us to show the full extent. Default: false.
 * @return {Type} Zoom function.
 */
function createSnapToPower(power, maxResolution, opt_minResolution, opt_smooth, opt_maxExtent, opt_showFullExtent) {
    return (
    /**
     * @param {number|undefined} resolution Resolution.
     * @param {number} direction Direction.
     * @param {import("./size.js").Size} size Viewport size.
     * @param {boolean} [opt_isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Resolution.
     */
    function (resolution, direction, size, opt_isMoving) {
        if (resolution !== undefined) {
            var cappedMaxRes = opt_maxExtent
                ? getViewportClampedResolution(maxResolution, opt_maxExtent, size, opt_showFullExtent)
                : maxResolution;
            var minResolution = opt_minResolution !== undefined ? opt_minResolution : 0;
            // during interacting or animating, allow intermediary values
            if (opt_isMoving) {
                var smooth = opt_smooth !== undefined ? opt_smooth : true;
                if (!smooth) {
                    return clamp(resolution, minResolution, cappedMaxRes);
                }
                return getSmoothClampedResolution(resolution, cappedMaxRes, minResolution);
            }
            var tolerance = 1e-9;
            var minZoomLevel = Math.ceil(Math.log(maxResolution / cappedMaxRes) / Math.log(power) - tolerance);
            var offset = -direction * (0.5 - tolerance) + 0.5;
            var capped = Math.min(cappedMaxRes, resolution);
            var cappedZoomLevel = Math.floor(Math.log(maxResolution / capped) / Math.log(power) + offset);
            var zoomLevel = Math.max(minZoomLevel, cappedZoomLevel);
            var newResolution = maxResolution / Math.pow(power, zoomLevel);
            return clamp(newResolution, minResolution, cappedMaxRes);
        }
        else {
            return undefined;
        }
    });
}
/**
 * @param {number} maxResolution Max resolution.
 * @param {number} minResolution Min resolution.
 * @param {boolean} [opt_smooth] If true, the view will be able to slightly exceed resolution limits. Default: true.
 * @param {import("./extent.js").Extent} [opt_maxExtent] Maximum allowed extent.
 * @param {boolean} [opt_showFullExtent] If true, allows us to show the full extent. Default: false.
 * @return {Type} Zoom function.
 */
function createMinMaxResolution(maxResolution, minResolution, opt_smooth, opt_maxExtent, opt_showFullExtent) {
    return (
    /**
     * @param {number|undefined} resolution Resolution.
     * @param {number} direction Direction.
     * @param {import("./size.js").Size} size Viewport size.
     * @param {boolean} [opt_isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Resolution.
     */
    function (resolution, direction, size, opt_isMoving) {
        if (resolution !== undefined) {
            var cappedMaxRes = opt_maxExtent
                ? getViewportClampedResolution(maxResolution, opt_maxExtent, size, opt_showFullExtent)
                : maxResolution;
            var smooth = opt_smooth !== undefined ? opt_smooth : true;
            if (!smooth || !opt_isMoving) {
                return clamp(resolution, minResolution, cappedMaxRes);
            }
            return getSmoothClampedResolution(resolution, cappedMaxRes, minResolution);
        }
        else {
            return undefined;
        }
    });
}

/**
 * @module ol/rotationconstraint
 */
/**
 * @typedef {function((number|undefined), boolean=): (number|undefined)} Type
 */
/**
 * @param {number|undefined} rotation Rotation.
 * @return {number|undefined} Rotation.
 */
function disable(rotation) {
    if (rotation !== undefined) {
        return 0;
    }
    else {
        return undefined;
    }
}
/**
 * @param {number|undefined} rotation Rotation.
 * @return {number|undefined} Rotation.
 */
function none$1(rotation) {
    if (rotation !== undefined) {
        return rotation;
    }
    else {
        return undefined;
    }
}
/**
 * @param {number} n N.
 * @return {Type} Rotation constraint.
 */
function createSnapToN(n) {
    var theta = (2 * Math.PI) / n;
    return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [opt_isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    function (rotation, opt_isMoving) {
        if (opt_isMoving) {
            return rotation;
        }
        if (rotation !== undefined) {
            rotation = Math.floor(rotation / theta + 0.5) * theta;
            return rotation;
        }
        else {
            return undefined;
        }
    });
}
/**
 * @param {number} [opt_tolerance] Tolerance.
 * @return {Type} Rotation constraint.
 */
function createSnapToZero(opt_tolerance) {
    var tolerance = opt_tolerance || toRadians(5);
    return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [opt_isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    function (rotation, opt_isMoving) {
        if (opt_isMoving) {
            return rotation;
        }
        if (rotation !== undefined) {
            if (Math.abs(rotation) <= tolerance) {
                return 0;
            }
            else {
                return rotation;
            }
        }
        else {
            return undefined;
        }
    });
}

var __extends$8 = (undefined && undefined.__extends) || (function () {
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
 * An animation configuration
 *
 * @typedef {Object} Animation
 * @property {import("./coordinate.js").Coordinate} [sourceCenter] Source center.
 * @property {import("./coordinate.js").Coordinate} [targetCenter] Target center.
 * @property {number} [sourceResolution] Source resolution.
 * @property {number} [targetResolution] Target resolution.
 * @property {number} [sourceRotation] Source rotation.
 * @property {number} [targetRotation] Target rotation.
 * @property {import("./coordinate.js").Coordinate} [anchor] Anchor.
 * @property {number} start Start.
 * @property {number} duration Duration.
 * @property {boolean} complete Complete.
 * @property {function(number):number} easing Easing.
 * @property {function(boolean):void} callback Callback.
 */
/**
 * @typedef {Object} Constraints
 * @property {import("./centerconstraint.js").Type} center Center.
 * @property {import("./resolutionconstraint.js").Type} resolution Resolution.
 * @property {import("./rotationconstraint.js").Type} rotation Rotation.
 */
/**
 * @typedef {Object} FitOptions
 * @property {import("./size.js").Size} [size] The size in pixels of the box to fit
 * the extent into. Default is the current size of the first map in the DOM that
 * uses this view, or `[100, 100]` if no such map is found.
 * @property {!Array<number>} [padding=[0, 0, 0, 0]] Padding (in pixels) to be
 * cleared inside the view. Values in the array are top, right, bottom and left
 * padding.
 * @property {boolean} [nearest=false] If the view `constrainResolution` option is `true`,
 * get the nearest extent instead of the closest that actually fits the view.
 * @property {number} [minResolution=0] Minimum resolution that we zoom to.
 * @property {number} [maxZoom] Maximum zoom level that we zoom to. If
 * `minResolution` is given, this property is ignored.
 * @property {number} [duration] The duration of the animation in milliseconds.
 * By default, there is no animation to the target extent.
 * @property {function(number):number} [easing] The easing function used during
 * the animation (defaults to {@link module:ol/easing.inAndOut}).
 * The function will be called for each frame with a number representing a
 * fraction of the animation's duration.  The function should return a number
 * between 0 and 1 representing the progress toward the destination state.
 * @property {function(boolean):void} [callback] Function called when the view is in
 * its final position. The callback will be called with `true` if the animation
 * series completed on its own or `false` if it was cancelled.
 */
/**
 * @typedef {Object} ViewOptions
 * @property {import("./coordinate.js").Coordinate} [center] The initial center for
 * the view. If a user projection is not set, the coordinate system for the center is
 * specified with the `projection` option. Layer sources will not be fetched if this
 * is not set, but the center can be set later with {@link #setCenter}.
 * @property {boolean|number} [constrainRotation=true] Rotation constraint.
 * `false` means no constraint. `true` means no constraint, but snap to zero
 * near zero. A number constrains the rotation to that number of values. For
 * example, `4` will constrain the rotation to 0, 90, 180, and 270 degrees.
 * @property {boolean} [enableRotation=true] Enable rotation.
 * If `false`, a rotation constraint that always sets the rotation to zero is
 * used. The `constrainRotation` option has no effect if `enableRotation` is
 * `false`.
 * @property {import("./extent.js").Extent} [extent] The extent that constrains the
 * view, in other words, nothing outside of this extent can be visible on the map.
 * @property {boolean} [constrainOnlyCenter=false] If true, the extent
 * constraint will only apply to the view center and not the whole extent.
 * @property {boolean} [smoothExtentConstraint=true] If true, the extent
 * constraint will be applied smoothly, i.e. allow the view to go slightly outside
 * of the given `extent`.
 * @property {number} [maxResolution] The maximum resolution used to determine
 * the resolution constraint. It is used together with `minResolution` (or
 * `maxZoom`) and `zoomFactor`. If unspecified it is calculated in such a way
 * that the projection's validity extent fits in a 256x256 px tile. If the
 * projection is Spherical Mercator (the default) then `maxResolution` defaults
 * to `40075016.68557849 / 256 = 156543.03392804097`.
 * @property {number} [minResolution] The minimum resolution used to determine
 * the resolution constraint.  It is used together with `maxResolution` (or
 * `minZoom`) and `zoomFactor`.  If unspecified it is calculated assuming 29
 * zoom levels (with a factor of 2). If the projection is Spherical Mercator
 * (the default) then `minResolution` defaults to
 * `40075016.68557849 / 256 / Math.pow(2, 28) = 0.0005831682455839253`.
 * @property {number} [maxZoom=28] The maximum zoom level used to determine the
 * resolution constraint. It is used together with `minZoom` (or
 * `maxResolution`) and `zoomFactor`.  Note that if `minResolution` is also
 * provided, it is given precedence over `maxZoom`.
 * @property {number} [minZoom=0] The minimum zoom level used to determine the
 * resolution constraint. It is used together with `maxZoom` (or
 * `minResolution`) and `zoomFactor`.  Note that if `maxResolution` is also
 * provided, it is given precedence over `minZoom`.
 * @property {boolean} [multiWorld=false] If `false` the view is constrained so
 * only one world is visible, and you cannot pan off the edge.  If `true` the map
 * may show multiple worlds at low zoom levels.  Only used if the `projection` is
 * global.  Note that if `extent` is also provided it is given precedence.
 * @property {boolean} [constrainResolution=false] If true, the view will always
 * animate to the closest zoom level after an interaction; false means
 * intermediary zoom levels are allowed.
 * @property {boolean} [smoothResolutionConstraint=true] If true, the resolution
 * min/max values will be applied smoothly, i. e. allow the view to exceed slightly
 * the given resolution or zoom bounds.
 * @property {boolean} [showFullExtent=false] Allow the view to be zoomed out to
 * show the full configured extent. By default, when a view is configured with an
 * extent, users will not be able to zoom out so the viewport exceeds the extent in
 * either dimension. This means the full extent may not be visible if the viewport
 * is taller or wider than the aspect ratio of the configured extent. If
 * showFullExtent is true, the user will be able to zoom out so that the viewport
 * exceeds the height or width of the configured extent, but not both, allowing the
 * full extent to be shown.
 * @property {import("./proj.js").ProjectionLike} [projection='EPSG:3857'] The
 * projection. The default is Spherical Mercator.
 * @property {number} [resolution] The initial resolution for the view. The
 * units are `projection` units per pixel (e.g. meters per pixel). An
 * alternative to setting this is to set `zoom`. Layer sources will not be
 * fetched if neither this nor `zoom` are defined, but they can be set later
 * with {@link #setZoom} or {@link #setResolution}.
 * @property {Array<number>} [resolutions] Resolutions that determine the
 * zoom levels if specified. The index in the array corresponds to the zoom level,
 * therefore the resolution values have to be in descending order. It also constrains
 * the resolution by the minimum and maximum value. If set the `maxResolution`,
 * `minResolution`, `minZoom`, `maxZoom`, and `zoomFactor` options are ignored.
 * @property {number} [rotation=0] The initial rotation for the view in radians
 * (positive rotation clockwise, 0 means North).
 * @property {number} [zoom] Only used if `resolution` is not defined. Zoom
 * level used to calculate the initial resolution for the view.
 * @property {number} [zoomFactor=2] The zoom factor used to compute the
 * corresponding resolution.
 * @property {!Array<number>} [padding=[0, 0, 0, 0]] Padding (in css pixels).
 * If the map viewport is partially covered with other content (overlays) along
 * its edges, this setting allows to shift the center of the viewport away from
 * that content. The order of the values is top, right, bottom, left.
 */
/**
 * @typedef {Object} AnimationOptions
 * @property {import("./coordinate.js").Coordinate} [center] The center of the view at the end of
 * the animation.
 * @property {number} [zoom] The zoom level of the view at the end of the
 * animation. This takes precedence over `resolution`.
 * @property {number} [resolution] The resolution of the view at the end
 * of the animation.  If `zoom` is also provided, this option will be ignored.
 * @property {number} [rotation] The rotation of the view at the end of
 * the animation.
 * @property {import("./coordinate.js").Coordinate} [anchor] Optional anchor to remain fixed
 * during a rotation or resolution animation.
 * @property {number} [duration=1000] The duration of the animation in milliseconds.
 * @property {function(number):number} [easing] The easing function used
 * during the animation (defaults to {@link module:ol/easing.inAndOut}).
 * The function will be called for each frame with a number representing a
 * fraction of the animation's duration.  The function should return a number
 * between 0 and 1 representing the progress toward the destination state.
 */
/**
 * @typedef {Object} State
 * @property {import("./coordinate.js").Coordinate} center Center.
 * @property {import("./proj/Projection.js").default} projection Projection.
 * @property {number} resolution Resolution.
 * @property {import("./coordinate.js").Coordinate} [nextCenter] The next center during an animation series.
 * @property {number} [nextResolution] The next resolution during an animation series.
 * @property {number} [nextRotation] The next rotation during an animation series.
 * @property {number} rotation Rotation.
 * @property {number} zoom Zoom.
 */
/**
 * Default min zoom level for the map view.
 * @type {number}
 */
var DEFAULT_MIN_ZOOM = 0;
/**
 * @typedef {import("./ObjectEventType").Types|'change:center'|'change:resolution'|'change:rotation'} ViewObjectEventTypes
 */
/***
 * @template Return
 * @typedef {import("./Observable").OnSignature<import("./Observable").EventTypes, import("./events/Event.js").default, Return> &
 *   import("./Observable").OnSignature<ViewObjectEventTypes, import("./Object").ObjectEvent, Return> &
 *   import("./Observable").CombinedOnSignature<import("./Observable").EventTypes|ViewObjectEventTypes, Return>} ViewOnSignature
 */
/**
 * @classdesc
 * A View object represents a simple 2D view of the map.
 *
 * This is the object to act upon to change the center, resolution,
 * and rotation of the map.
 *
 * A View has a `projection`. The projection determines the
 * coordinate system of the center, and its units determine the units of the
 * resolution (projection units per pixel). The default projection is
 * Spherical Mercator (EPSG:3857).
 *
 * ### The view states
 *
 * A View is determined by three states: `center`, `resolution`,
 * and `rotation`. Each state has a corresponding getter and setter, e.g.
 * `getCenter` and `setCenter` for the `center` state.
 *
 * The `zoom` state is actually not saved on the view: all computations
 * internally use the `resolution` state. Still, the `setZoom` and `getZoom`
 * methods are available, as well as `getResolutionForZoom` and
 * `getZoomForResolution` to switch from one system to the other.
 *
 * ### The constraints
 *
 * `setCenter`, `setResolution` and `setRotation` can be used to change the
 * states of the view, but any constraint defined in the constructor will
 * be applied along the way.
 *
 * A View object can have a *resolution constraint*, a *rotation constraint*
 * and a *center constraint*.
 *
 * The *resolution constraint* typically restricts min/max values and
 * snaps to specific resolutions. It is determined by the following
 * options: `resolutions`, `maxResolution`, `maxZoom` and `zoomFactor`.
 * If `resolutions` is set, the other three options are ignored. See
 * documentation for each option for more information. By default, the view
 * only has a min/max restriction and allow intermediary zoom levels when
 * pinch-zooming for example.
 *
 * The *rotation constraint* snaps to specific angles. It is determined
 * by the following options: `enableRotation` and `constrainRotation`.
 * By default rotation is allowed and its value is snapped to zero when approaching the
 * horizontal.
 *
 * The *center constraint* is determined by the `extent` option. By
 * default the view center is not constrained at all.
 *
 * ### Changing the view state
 *
 * It is important to note that `setZoom`, `setResolution`, `setCenter` and
 * `setRotation` are subject to the above mentioned constraints. As such, it
 * may sometimes not be possible to know in advance the resulting state of the
 * View. For example, calling `setResolution(10)` does not guarantee that
 * `getResolution()` will return `10`.
 *
 * A consequence of this is that, when applying a delta on the view state, one
 * should use `adjustCenter`, `adjustRotation`, `adjustZoom` and `adjustResolution`
 * rather than the corresponding setters. This will let view do its internal
 * computations. Besides, the `adjust*` methods also take an `opt_anchor`
 * argument which allows specifying an origin for the transformation.
 *
 * ### Interacting with the view
 *
 * View constraints are usually only applied when the view is *at rest*, meaning that
 * no interaction or animation is ongoing. As such, if the user puts the view in a
 * state that is not equivalent to a constrained one (e.g. rotating the view when
 * the snap angle is 0), an animation will be triggered at the interaction end to
 * put back the view to a stable state;
 *
 * @api
 */
var View = /** @class */ (function (_super) {
    __extends$8(View, _super);
    /**
     * @param {ViewOptions} [opt_options] View options.
     */
    function View(opt_options) {
        var _this = _super.call(this) || this;
        /***
         * @type {ViewOnSignature<import("./events").EventsKey>}
         */
        _this.on;
        /***
         * @type {ViewOnSignature<import("./events").EventsKey>}
         */
        _this.once;
        /***
         * @type {ViewOnSignature<void>}
         */
        _this.un;
        var options = assign({}, opt_options);
        /**
         * @private
         * @type {Array<number>}
         */
        _this.hints_ = [0, 0];
        /**
         * @private
         * @type {Array<Array<Animation>>}
         */
        _this.animations_ = [];
        /**
         * @private
         * @type {number|undefined}
         */
        _this.updateAnimationKey_;
        /**
         * @private
         * @const
         * @type {import("./proj/Projection.js").default}
         */
        _this.projection_ = createProjection(options.projection, 'EPSG:3857');
        /**
         * @private
         * @type {import("./size.js").Size}
         */
        _this.viewportSize_ = [100, 100];
        /**
         * @private
         * @type {import("./coordinate.js").Coordinate|undefined}
         */
        _this.targetCenter_ = null;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.targetResolution_;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.targetRotation_;
        /**
         * @private
         * @type {import("./coordinate.js").Coordinate}
         */
        _this.nextCenter_ = null;
        /**
         * @private
         * @type {number}
         */
        _this.nextResolution_;
        /**
         * @private
         * @type {number}
         */
        _this.nextRotation_;
        /**
         * @private
         * @type {import("./coordinate.js").Coordinate|undefined}
         */
        _this.cancelAnchor_ = undefined;
        if (options.center) {
            options.center = fromUserCoordinate(options.center, _this.projection_);
        }
        if (options.extent) {
            options.extent = fromUserExtent(options.extent, _this.projection_);
        }
        _this.applyOptions_(options);
        return _this;
    }
    /**
     * Set up the view with the given options.
     * @param {ViewOptions} options View options.
     */
    View.prototype.applyOptions_ = function (options) {
        /**
         * @type {Object<string, *>}
         */
        var properties = {};
        var resolutionConstraintInfo = createResolutionConstraint(options);
        /**
         * @private
         * @type {number}
         */
        this.maxResolution_ = resolutionConstraintInfo.maxResolution;
        /**
         * @private
         * @type {number}
         */
        this.minResolution_ = resolutionConstraintInfo.minResolution;
        /**
         * @private
         * @type {number}
         */
        this.zoomFactor_ = resolutionConstraintInfo.zoomFactor;
        /**
         * @private
         * @type {Array<number>|undefined}
         */
        this.resolutions_ = options.resolutions;
        /**
         * @type {Array<number>|undefined}
         * @private
         */
        this.padding_ = options.padding;
        /**
         * @private
         * @type {number}
         */
        this.minZoom_ = resolutionConstraintInfo.minZoom;
        var centerConstraint = createCenterConstraint(options);
        var resolutionConstraint = resolutionConstraintInfo.constraint;
        var rotationConstraint = createRotationConstraint(options);
        /**
         * @private
         * @type {Constraints}
         */
        this.constraints_ = {
            center: centerConstraint,
            resolution: resolutionConstraint,
            rotation: rotationConstraint,
        };
        this.setRotation(options.rotation !== undefined ? options.rotation : 0);
        this.setCenterInternal(options.center !== undefined ? options.center : null);
        if (options.resolution !== undefined) {
            this.setResolution(options.resolution);
        }
        else if (options.zoom !== undefined) {
            this.setZoom(options.zoom);
        }
        this.setProperties(properties);
        /**
         * @private
         * @type {ViewOptions}
         */
        this.options_ = options;
    };
    Object.defineProperty(View.prototype, "padding", {
        /**
         * Padding (in css pixels).
         * If the map viewport is partially covered with other content (overlays) along
         * its edges, this setting allows to shift the center of the viewport away from that
         * content. The order of the values in the array is top, right, bottom, left.
         * The default is no padding, which is equivalent to `[0, 0, 0, 0]`.
         * @type {Array<number>|undefined}
         * @api
         */
        get: function () {
            return this.padding_;
        },
        set: function (padding) {
            var oldPadding = this.padding_;
            this.padding_ = padding;
            var center = this.getCenter();
            if (center) {
                var newPadding = padding || [0, 0, 0, 0];
                oldPadding = oldPadding || [0, 0, 0, 0];
                var resolution = this.getResolution();
                var offsetX = (resolution / 2) *
                    (newPadding[3] - oldPadding[3] + oldPadding[1] - newPadding[1]);
                var offsetY = (resolution / 2) *
                    (newPadding[0] - oldPadding[0] + oldPadding[2] - newPadding[2]);
                this.setCenterInternal([center[0] + offsetX, center[1] - offsetY]);
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get an updated version of the view options used to construct the view.  The
     * current resolution (or zoom), center, and rotation are applied to any stored
     * options.  The provided options can be used to apply new min/max zoom or
     * resolution limits.
     * @param {ViewOptions} newOptions New options to be applied.
     * @return {ViewOptions} New options updated with the current view state.
     */
    View.prototype.getUpdatedOptions_ = function (newOptions) {
        var options = assign({}, this.options_);
        // preserve resolution (or zoom)
        if (options.resolution !== undefined) {
            options.resolution = this.getResolution();
        }
        else {
            options.zoom = this.getZoom();
        }
        // preserve center
        options.center = this.getCenterInternal();
        // preserve rotation
        options.rotation = this.getRotation();
        return assign({}, options, newOptions);
    };
    /**
     * Animate the view.  The view's center, zoom (or resolution), and rotation
     * can be animated for smooth transitions between view states.  For example,
     * to animate the view to a new zoom level:
     *
     *     view.animate({zoom: view.getZoom() + 1});
     *
     * By default, the animation lasts one second and uses in-and-out easing.  You
     * can customize this behavior by including `duration` (in milliseconds) and
     * `easing` options (see {@link module:ol/easing}).
     *
     * To chain together multiple animations, call the method with multiple
     * animation objects.  For example, to first zoom and then pan:
     *
     *     view.animate({zoom: 10}, {center: [0, 0]});
     *
     * If you provide a function as the last argument to the animate method, it
     * will get called at the end of an animation series.  The callback will be
     * called with `true` if the animation series completed on its own or `false`
     * if it was cancelled.
     *
     * Animations are cancelled by user interactions (e.g. dragging the map) or by
     * calling `view.setCenter()`, `view.setResolution()`, or `view.setRotation()`
     * (or another method that calls one of these).
     *
     * @param {...(AnimationOptions|function(boolean): void)} var_args Animation
     *     options.  Multiple animations can be run in series by passing multiple
     *     options objects.  To run multiple animations in parallel, call the method
     *     multiple times.  An optional callback can be provided as a final
     *     argument.  The callback will be called with a boolean indicating whether
     *     the animation completed without being cancelled.
     * @api
     */
    View.prototype.animate = function (var_args) {
        if (this.isDef() && !this.getAnimating()) {
            this.resolveConstraints(0);
        }
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i) {
            var options = arguments[i];
            if (options.center) {
                options = assign({}, options);
                options.center = fromUserCoordinate(options.center, this.getProjection());
            }
            if (options.anchor) {
                options = assign({}, options);
                options.anchor = fromUserCoordinate(options.anchor, this.getProjection());
            }
            args[i] = options;
        }
        this.animateInternal.apply(this, args);
    };
    /**
     * @param {...(AnimationOptions|function(boolean): void)} var_args Animation options.
     */
    View.prototype.animateInternal = function (var_args) {
        var animationCount = arguments.length;
        var callback;
        if (animationCount > 1 &&
            typeof arguments[animationCount - 1] === 'function') {
            callback = arguments[animationCount - 1];
            --animationCount;
        }
        var i = 0;
        for (; i < animationCount && !this.isDef(); ++i) {
            // if view properties are not yet set, shortcut to the final state
            var state = arguments[i];
            if (state.center) {
                this.setCenterInternal(state.center);
            }
            if (state.zoom !== undefined) {
                this.setZoom(state.zoom);
            }
            else if (state.resolution) {
                this.setResolution(state.resolution);
            }
            if (state.rotation !== undefined) {
                this.setRotation(state.rotation);
            }
        }
        if (i === animationCount) {
            if (callback) {
                animationCallback(callback, true);
            }
            return;
        }
        var start = Date.now();
        var center = this.targetCenter_.slice();
        var resolution = this.targetResolution_;
        var rotation = this.targetRotation_;
        var series = [];
        for (; i < animationCount; ++i) {
            var options = /** @type {AnimationOptions} */ (arguments[i]);
            var animation = {
                start: start,
                complete: false,
                anchor: options.anchor,
                duration: options.duration !== undefined ? options.duration : 1000,
                easing: options.easing || inAndOut,
                callback: callback,
            };
            if (options.center) {
                animation.sourceCenter = center;
                animation.targetCenter = options.center.slice();
                center = animation.targetCenter;
            }
            if (options.zoom !== undefined) {
                animation.sourceResolution = resolution;
                animation.targetResolution = this.getResolutionForZoom(options.zoom);
                resolution = animation.targetResolution;
            }
            else if (options.resolution) {
                animation.sourceResolution = resolution;
                animation.targetResolution = options.resolution;
                resolution = animation.targetResolution;
            }
            if (options.rotation !== undefined) {
                animation.sourceRotation = rotation;
                var delta = modulo(options.rotation - rotation + Math.PI, 2 * Math.PI) - Math.PI;
                animation.targetRotation = rotation + delta;
                rotation = animation.targetRotation;
            }
            // check if animation is a no-op
            if (isNoopAnimation(animation)) {
                animation.complete = true;
                // we still push it onto the series for callback handling
            }
            else {
                start += animation.duration;
            }
            series.push(animation);
        }
        this.animations_.push(series);
        this.setHint(ViewHint.ANIMATING, 1);
        this.updateAnimations_();
    };
    /**
     * Determine if the view is being animated.
     * @return {boolean} The view is being animated.
     * @api
     */
    View.prototype.getAnimating = function () {
        return this.hints_[ViewHint.ANIMATING] > 0;
    };
    /**
     * Determine if the user is interacting with the view, such as panning or zooming.
     * @return {boolean} The view is being interacted with.
     * @api
     */
    View.prototype.getInteracting = function () {
        return this.hints_[ViewHint.INTERACTING] > 0;
    };
    /**
     * Cancel any ongoing animations.
     * @api
     */
    View.prototype.cancelAnimations = function () {
        this.setHint(ViewHint.ANIMATING, -this.hints_[ViewHint.ANIMATING]);
        var anchor;
        for (var i = 0, ii = this.animations_.length; i < ii; ++i) {
            var series = this.animations_[i];
            if (series[0].callback) {
                animationCallback(series[0].callback, false);
            }
            if (!anchor) {
                for (var j = 0, jj = series.length; j < jj; ++j) {
                    var animation = series[j];
                    if (!animation.complete) {
                        anchor = animation.anchor;
                        break;
                    }
                }
            }
        }
        this.animations_.length = 0;
        this.cancelAnchor_ = anchor;
        this.nextCenter_ = null;
        this.nextResolution_ = NaN;
        this.nextRotation_ = NaN;
    };
    /**
     * Update all animations.
     */
    View.prototype.updateAnimations_ = function () {
        if (this.updateAnimationKey_ !== undefined) {
            cancelAnimationFrame(this.updateAnimationKey_);
            this.updateAnimationKey_ = undefined;
        }
        if (!this.getAnimating()) {
            return;
        }
        var now = Date.now();
        var more = false;
        for (var i = this.animations_.length - 1; i >= 0; --i) {
            var series = this.animations_[i];
            var seriesComplete = true;
            for (var j = 0, jj = series.length; j < jj; ++j) {
                var animation = series[j];
                if (animation.complete) {
                    continue;
                }
                var elapsed = now - animation.start;
                var fraction = animation.duration > 0 ? elapsed / animation.duration : 1;
                if (fraction >= 1) {
                    animation.complete = true;
                    fraction = 1;
                }
                else {
                    seriesComplete = false;
                }
                var progress = animation.easing(fraction);
                if (animation.sourceCenter) {
                    var x0 = animation.sourceCenter[0];
                    var y0 = animation.sourceCenter[1];
                    var x1 = animation.targetCenter[0];
                    var y1 = animation.targetCenter[1];
                    this.nextCenter_ = animation.targetCenter;
                    var x = x0 + progress * (x1 - x0);
                    var y = y0 + progress * (y1 - y0);
                    this.targetCenter_ = [x, y];
                }
                if (animation.sourceResolution && animation.targetResolution) {
                    var resolution = progress === 1
                        ? animation.targetResolution
                        : animation.sourceResolution +
                            progress *
                                (animation.targetResolution - animation.sourceResolution);
                    if (animation.anchor) {
                        var size = this.getViewportSize_(this.getRotation());
                        var constrainedResolution = this.constraints_.resolution(resolution, 0, size, true);
                        this.targetCenter_ = this.calculateCenterZoom(constrainedResolution, animation.anchor);
                    }
                    this.nextResolution_ = animation.targetResolution;
                    this.targetResolution_ = resolution;
                    this.applyTargetState_(true);
                }
                if (animation.sourceRotation !== undefined &&
                    animation.targetRotation !== undefined) {
                    var rotation = progress === 1
                        ? modulo(animation.targetRotation + Math.PI, 2 * Math.PI) -
                            Math.PI
                        : animation.sourceRotation +
                            progress *
                                (animation.targetRotation - animation.sourceRotation);
                    if (animation.anchor) {
                        var constrainedRotation = this.constraints_.rotation(rotation, true);
                        this.targetCenter_ = this.calculateCenterRotate(constrainedRotation, animation.anchor);
                    }
                    this.nextRotation_ = animation.targetRotation;
                    this.targetRotation_ = rotation;
                }
                this.applyTargetState_(true);
                more = true;
                if (!animation.complete) {
                    break;
                }
            }
            if (seriesComplete) {
                this.animations_[i] = null;
                this.setHint(ViewHint.ANIMATING, -1);
                this.nextCenter_ = null;
                this.nextResolution_ = NaN;
                this.nextRotation_ = NaN;
                var callback = series[0].callback;
                if (callback) {
                    animationCallback(callback, true);
                }
            }
        }
        // prune completed series
        this.animations_ = this.animations_.filter(Boolean);
        if (more && this.updateAnimationKey_ === undefined) {
            this.updateAnimationKey_ = requestAnimationFrame(this.updateAnimations_.bind(this));
        }
    };
    /**
     * @param {number} rotation Target rotation.
     * @param {import("./coordinate.js").Coordinate} anchor Rotation anchor.
     * @return {import("./coordinate.js").Coordinate|undefined} Center for rotation and anchor.
     */
    View.prototype.calculateCenterRotate = function (rotation, anchor) {
        var center;
        var currentCenter = this.getCenterInternal();
        if (currentCenter !== undefined) {
            center = [currentCenter[0] - anchor[0], currentCenter[1] - anchor[1]];
            rotate(center, rotation - this.getRotation());
            add(center, anchor);
        }
        return center;
    };
    /**
     * @param {number} resolution Target resolution.
     * @param {import("./coordinate.js").Coordinate} anchor Zoom anchor.
     * @return {import("./coordinate.js").Coordinate|undefined} Center for resolution and anchor.
     */
    View.prototype.calculateCenterZoom = function (resolution, anchor) {
        var center;
        var currentCenter = this.getCenterInternal();
        var currentResolution = this.getResolution();
        if (currentCenter !== undefined && currentResolution !== undefined) {
            var x = anchor[0] -
                (resolution * (anchor[0] - currentCenter[0])) / currentResolution;
            var y = anchor[1] -
                (resolution * (anchor[1] - currentCenter[1])) / currentResolution;
            center = [x, y];
        }
        return center;
    };
    /**
     * Returns the current viewport size.
     * @private
     * @param {number} [opt_rotation] Take into account the rotation of the viewport when giving the size
     * @return {import("./size.js").Size} Viewport size or `[100, 100]` when no viewport is found.
     */
    View.prototype.getViewportSize_ = function (opt_rotation) {
        var size = this.viewportSize_;
        if (opt_rotation) {
            var w = size[0];
            var h = size[1];
            return [
                Math.abs(w * Math.cos(opt_rotation)) +
                    Math.abs(h * Math.sin(opt_rotation)),
                Math.abs(w * Math.sin(opt_rotation)) +
                    Math.abs(h * Math.cos(opt_rotation)),
            ];
        }
        else {
            return size;
        }
    };
    /**
     * Stores the viewport size on the view. The viewport size is not read every time from the DOM
     * to avoid performance hit and layout reflow.
     * This should be done on map size change.
     * Note: the constraints are not resolved during an animation to avoid stopping it
     * @param {import("./size.js").Size} [opt_size] Viewport size; if undefined, [100, 100] is assumed
     */
    View.prototype.setViewportSize = function (opt_size) {
        this.viewportSize_ = Array.isArray(opt_size)
            ? opt_size.slice()
            : [100, 100];
        if (!this.getAnimating()) {
            this.resolveConstraints(0);
        }
    };
    /**
     * Get the view center.
     * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
     * @observable
     * @api
     */
    View.prototype.getCenter = function () {
        var center = this.getCenterInternal();
        if (!center) {
            return center;
        }
        return toUserCoordinate(center, this.getProjection());
    };
    /**
     * Get the view center without transforming to user projection.
     * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
     */
    View.prototype.getCenterInternal = function () {
        return /** @type {import("./coordinate.js").Coordinate|undefined} */ (this.get(ViewProperty.CENTER));
    };
    /**
     * @return {Constraints} Constraints.
     */
    View.prototype.getConstraints = function () {
        return this.constraints_;
    };
    /**
     * @return {boolean} Resolution constraint is set
     */
    View.prototype.getConstrainResolution = function () {
        return this.options_.constrainResolution;
    };
    /**
     * @param {Array<number>} [opt_hints] Destination array.
     * @return {Array<number>} Hint.
     */
    View.prototype.getHints = function (opt_hints) {
        if (opt_hints !== undefined) {
            opt_hints[0] = this.hints_[0];
            opt_hints[1] = this.hints_[1];
            return opt_hints;
        }
        else {
            return this.hints_.slice();
        }
    };
    /**
     * Calculate the extent for the current view state and the passed size.
     * The size is the pixel dimensions of the box into which the calculated extent
     * should fit. In most cases you want to get the extent of the entire map,
     * that is `map.getSize()`.
     * @param {import("./size.js").Size} [opt_size] Box pixel size. If not provided, the size
     * of the map that uses this view will be used.
     * @return {import("./extent.js").Extent} Extent.
     * @api
     */
    View.prototype.calculateExtent = function (opt_size) {
        var extent = this.calculateExtentInternal(opt_size);
        return toUserExtent(extent, this.getProjection());
    };
    /**
     * @param {import("./size.js").Size} [opt_size] Box pixel size. If not provided,
     * the map's last known viewport size will be used.
     * @return {import("./extent.js").Extent} Extent.
     */
    View.prototype.calculateExtentInternal = function (opt_size) {
        var size = opt_size || this.getViewportSizeMinusPadding_();
        var center = /** @type {!import("./coordinate.js").Coordinate} */ (this.getCenterInternal());
        assert(center, 1); // The view center is not defined
        var resolution = /** @type {!number} */ (this.getResolution());
        assert(resolution !== undefined, 2); // The view resolution is not defined
        var rotation = /** @type {!number} */ (this.getRotation());
        assert(rotation !== undefined, 3); // The view rotation is not defined
        return getForViewAndSize(center, resolution, rotation, size);
    };
    /**
     * Get the maximum resolution of the view.
     * @return {number} The maximum resolution of the view.
     * @api
     */
    View.prototype.getMaxResolution = function () {
        return this.maxResolution_;
    };
    /**
     * Get the minimum resolution of the view.
     * @return {number} The minimum resolution of the view.
     * @api
     */
    View.prototype.getMinResolution = function () {
        return this.minResolution_;
    };
    /**
     * Get the maximum zoom level for the view.
     * @return {number} The maximum zoom level.
     * @api
     */
    View.prototype.getMaxZoom = function () {
        return /** @type {number} */ (this.getZoomForResolution(this.minResolution_));
    };
    /**
     * Set a new maximum zoom level for the view.
     * @param {number} zoom The maximum zoom level.
     * @api
     */
    View.prototype.setMaxZoom = function (zoom) {
        this.applyOptions_(this.getUpdatedOptions_({ maxZoom: zoom }));
    };
    /**
     * Get the minimum zoom level for the view.
     * @return {number} The minimum zoom level.
     * @api
     */
    View.prototype.getMinZoom = function () {
        return /** @type {number} */ (this.getZoomForResolution(this.maxResolution_));
    };
    /**
     * Set a new minimum zoom level for the view.
     * @param {number} zoom The minimum zoom level.
     * @api
     */
    View.prototype.setMinZoom = function (zoom) {
        this.applyOptions_(this.getUpdatedOptions_({ minZoom: zoom }));
    };
    /**
     * Set whether the view should allow intermediary zoom levels.
     * @param {boolean} enabled Whether the resolution is constrained.
     * @api
     */
    View.prototype.setConstrainResolution = function (enabled) {
        this.applyOptions_(this.getUpdatedOptions_({ constrainResolution: enabled }));
    };
    /**
     * Get the view projection.
     * @return {import("./proj/Projection.js").default} The projection of the view.
     * @api
     */
    View.prototype.getProjection = function () {
        return this.projection_;
    };
    /**
     * Get the view resolution.
     * @return {number|undefined} The resolution of the view.
     * @observable
     * @api
     */
    View.prototype.getResolution = function () {
        return /** @type {number|undefined} */ (this.get(ViewProperty.RESOLUTION));
    };
    /**
     * Get the resolutions for the view. This returns the array of resolutions
     * passed to the constructor of the View, or undefined if none were given.
     * @return {Array<number>|undefined} The resolutions of the view.
     * @api
     */
    View.prototype.getResolutions = function () {
        return this.resolutions_;
    };
    /**
     * Get the resolution for a provided extent (in map units) and size (in pixels).
     * @param {import("./extent.js").Extent} extent Extent.
     * @param {import("./size.js").Size} [opt_size] Box pixel size.
     * @return {number} The resolution at which the provided extent will render at
     *     the given size.
     * @api
     */
    View.prototype.getResolutionForExtent = function (extent, opt_size) {
        return this.getResolutionForExtentInternal(fromUserExtent(extent, this.getProjection()), opt_size);
    };
    /**
     * Get the resolution for a provided extent (in map units) and size (in pixels).
     * @param {import("./extent.js").Extent} extent Extent.
     * @param {import("./size.js").Size} [opt_size] Box pixel size.
     * @return {number} The resolution at which the provided extent will render at
     *     the given size.
     */
    View.prototype.getResolutionForExtentInternal = function (extent, opt_size) {
        var size = opt_size || this.getViewportSizeMinusPadding_();
        var xResolution = getWidth(extent) / size[0];
        var yResolution = getHeight(extent) / size[1];
        return Math.max(xResolution, yResolution);
    };
    /**
     * Return a function that returns a value between 0 and 1 for a
     * resolution. Exponential scaling is assumed.
     * @param {number} [opt_power] Power.
     * @return {function(number): number} Resolution for value function.
     */
    View.prototype.getResolutionForValueFunction = function (opt_power) {
        var power = opt_power || 2;
        var maxResolution = this.getConstrainedResolution(this.maxResolution_);
        var minResolution = this.minResolution_;
        var max = Math.log(maxResolution / minResolution) / Math.log(power);
        return (
        /**
         * @param {number} value Value.
         * @return {number} Resolution.
         */
        function (value) {
            var resolution = maxResolution / Math.pow(power, value * max);
            return resolution;
        });
    };
    /**
     * Get the view rotation.
     * @return {number} The rotation of the view in radians.
     * @observable
     * @api
     */
    View.prototype.getRotation = function () {
        return /** @type {number} */ (this.get(ViewProperty.ROTATION));
    };
    /**
     * Return a function that returns a resolution for a value between
     * 0 and 1. Exponential scaling is assumed.
     * @param {number} [opt_power] Power.
     * @return {function(number): number} Value for resolution function.
     */
    View.prototype.getValueForResolutionFunction = function (opt_power) {
        var logPower = Math.log(opt_power || 2);
        var maxResolution = this.getConstrainedResolution(this.maxResolution_);
        var minResolution = this.minResolution_;
        var max = Math.log(maxResolution / minResolution) / logPower;
        return (
        /**
         * @param {number} resolution Resolution.
         * @return {number} Value.
         */
        function (resolution) {
            var value = Math.log(maxResolution / resolution) / logPower / max;
            return value;
        });
    };
    /**
     * Returns the size of the viewport minus padding.
     * @private
     * @param {number} [opt_rotation] Take into account the rotation of the viewport when giving the size
     * @return {import("./size.js").Size} Viewport size reduced by the padding.
     */
    View.prototype.getViewportSizeMinusPadding_ = function (opt_rotation) {
        var size = this.getViewportSize_(opt_rotation);
        var padding = this.padding_;
        if (padding) {
            size = [
                size[0] - padding[1] - padding[3],
                size[1] - padding[0] - padding[2],
            ];
        }
        return size;
    };
    /**
     * @return {State} View state.
     */
    View.prototype.getState = function () {
        var projection = this.getProjection();
        var resolution = this.getResolution();
        var rotation = this.getRotation();
        var center = /** @type {import("./coordinate.js").Coordinate} */ (this.getCenterInternal());
        var padding = this.padding_;
        if (padding) {
            var reducedSize = this.getViewportSizeMinusPadding_();
            center = calculateCenterOn(center, this.getViewportSize_(), [reducedSize[0] / 2 + padding[3], reducedSize[1] / 2 + padding[0]], resolution, rotation);
        }
        return {
            center: center.slice(0),
            projection: projection !== undefined ? projection : null,
            resolution: resolution,
            nextCenter: this.nextCenter_,
            nextResolution: this.nextResolution_,
            nextRotation: this.nextRotation_,
            rotation: rotation,
            zoom: this.getZoom(),
        };
    };
    /**
     * Get the current zoom level. This method may return non-integer zoom levels
     * if the view does not constrain the resolution, or if an interaction or
     * animation is underway.
     * @return {number|undefined} Zoom.
     * @api
     */
    View.prototype.getZoom = function () {
        var zoom;
        var resolution = this.getResolution();
        if (resolution !== undefined) {
            zoom = this.getZoomForResolution(resolution);
        }
        return zoom;
    };
    /**
     * Get the zoom level for a resolution.
     * @param {number} resolution The resolution.
     * @return {number|undefined} The zoom level for the provided resolution.
     * @api
     */
    View.prototype.getZoomForResolution = function (resolution) {
        var offset = this.minZoom_ || 0;
        var max, zoomFactor;
        if (this.resolutions_) {
            var nearest = linearFindNearest(this.resolutions_, resolution, 1);
            offset = nearest;
            max = this.resolutions_[nearest];
            if (nearest == this.resolutions_.length - 1) {
                zoomFactor = 2;
            }
            else {
                zoomFactor = max / this.resolutions_[nearest + 1];
            }
        }
        else {
            max = this.maxResolution_;
            zoomFactor = this.zoomFactor_;
        }
        return offset + Math.log(max / resolution) / Math.log(zoomFactor);
    };
    /**
     * Get the resolution for a zoom level.
     * @param {number} zoom Zoom level.
     * @return {number} The view resolution for the provided zoom level.
     * @api
     */
    View.prototype.getResolutionForZoom = function (zoom) {
        if (this.resolutions_) {
            if (this.resolutions_.length <= 1) {
                return 0;
            }
            var baseLevel = clamp(Math.floor(zoom), 0, this.resolutions_.length - 2);
            var zoomFactor = this.resolutions_[baseLevel] / this.resolutions_[baseLevel + 1];
            return (this.resolutions_[baseLevel] /
                Math.pow(zoomFactor, clamp(zoom - baseLevel, 0, 1)));
        }
        else {
            return (this.maxResolution_ / Math.pow(this.zoomFactor_, zoom - this.minZoom_));
        }
    };
    /**
     * Fit the given geometry or extent based on the given map size and border.
     * The size is pixel dimensions of the box to fit the extent into.
     * In most cases you will want to use the map size, that is `map.getSize()`.
     * Takes care of the map angle.
     * @param {import("./geom/SimpleGeometry.js").default|import("./extent.js").Extent} geometryOrExtent The geometry or
     *     extent to fit the view to.
     * @param {FitOptions} [opt_options] Options.
     * @api
     */
    View.prototype.fit = function (geometryOrExtent, opt_options) {
        /** @type {import("./geom/SimpleGeometry.js").default} */
        var geometry;
        assert(Array.isArray(geometryOrExtent) ||
            typeof ( /** @type {?} */(geometryOrExtent).getSimplifiedGeometry) ===
                'function', 24); // Invalid extent or geometry provided as `geometry`
        if (Array.isArray(geometryOrExtent)) {
            assert(!isEmpty(geometryOrExtent), 25); // Cannot fit empty extent provided as `geometry`
            var extent = fromUserExtent(geometryOrExtent, this.getProjection());
            geometry = fromExtent(extent);
        }
        else if (geometryOrExtent.getType() === GeometryType.CIRCLE) {
            var extent = fromUserExtent(geometryOrExtent.getExtent(), this.getProjection());
            geometry = fromExtent(extent);
            geometry.rotate(this.getRotation(), getCenter(extent));
        }
        else {
            var userProjection = getUserProjection();
            if (userProjection) {
                geometry = /** @type {import("./geom/SimpleGeometry.js").default} */ (geometryOrExtent
                    .clone()
                    .transform(userProjection, this.getProjection()));
            }
            else {
                geometry = geometryOrExtent;
            }
        }
        this.fitInternal(geometry, opt_options);
    };
    /**
     * Calculate rotated extent
     * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
     * @return {import("./extent").Extent} The rotated extent for the geometry.
     */
    View.prototype.rotatedExtentForGeometry = function (geometry) {
        var rotation = this.getRotation();
        var cosAngle = Math.cos(rotation);
        var sinAngle = Math.sin(-rotation);
        var coords = geometry.getFlatCoordinates();
        var stride = geometry.getStride();
        var minRotX = +Infinity;
        var minRotY = +Infinity;
        var maxRotX = -Infinity;
        var maxRotY = -Infinity;
        for (var i = 0, ii = coords.length; i < ii; i += stride) {
            var rotX = coords[i] * cosAngle - coords[i + 1] * sinAngle;
            var rotY = coords[i] * sinAngle + coords[i + 1] * cosAngle;
            minRotX = Math.min(minRotX, rotX);
            minRotY = Math.min(minRotY, rotY);
            maxRotX = Math.max(maxRotX, rotX);
            maxRotY = Math.max(maxRotY, rotY);
        }
        return [minRotX, minRotY, maxRotX, maxRotY];
    };
    /**
     * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
     * @param {FitOptions} [opt_options] Options.
     */
    View.prototype.fitInternal = function (geometry, opt_options) {
        var options = opt_options || {};
        var size = options.size;
        if (!size) {
            size = this.getViewportSizeMinusPadding_();
        }
        var padding = options.padding !== undefined ? options.padding : [0, 0, 0, 0];
        var nearest = options.nearest !== undefined ? options.nearest : false;
        var minResolution;
        if (options.minResolution !== undefined) {
            minResolution = options.minResolution;
        }
        else if (options.maxZoom !== undefined) {
            minResolution = this.getResolutionForZoom(options.maxZoom);
        }
        else {
            minResolution = 0;
        }
        var rotatedExtent = this.rotatedExtentForGeometry(geometry);
        // calculate resolution
        var resolution = this.getResolutionForExtentInternal(rotatedExtent, [
            size[0] - padding[1] - padding[3],
            size[1] - padding[0] - padding[2],
        ]);
        resolution = isNaN(resolution)
            ? minResolution
            : Math.max(resolution, minResolution);
        resolution = this.getConstrainedResolution(resolution, nearest ? 0 : 1);
        // calculate center
        var rotation = this.getRotation();
        var sinAngle = Math.sin(rotation);
        var cosAngle = Math.cos(rotation);
        var centerRot = getCenter(rotatedExtent);
        centerRot[0] += ((padding[1] - padding[3]) / 2) * resolution;
        centerRot[1] += ((padding[0] - padding[2]) / 2) * resolution;
        var centerX = centerRot[0] * cosAngle - centerRot[1] * sinAngle;
        var centerY = centerRot[1] * cosAngle + centerRot[0] * sinAngle;
        var center = this.getConstrainedCenter([centerX, centerY], resolution);
        var callback = options.callback ? options.callback : VOID;
        if (options.duration !== undefined) {
            this.animateInternal({
                resolution: resolution,
                center: center,
                duration: options.duration,
                easing: options.easing,
            }, callback);
        }
        else {
            this.targetResolution_ = resolution;
            this.targetCenter_ = center;
            this.applyTargetState_(false, true);
            animationCallback(callback, true);
        }
    };
    /**
     * Center on coordinate and view position.
     * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
     * @param {import("./size.js").Size} size Box pixel size.
     * @param {import("./pixel.js").Pixel} position Position on the view to center on.
     * @api
     */
    View.prototype.centerOn = function (coordinate, size, position) {
        this.centerOnInternal(fromUserCoordinate(coordinate, this.getProjection()), size, position);
    };
    /**
     * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
     * @param {import("./size.js").Size} size Box pixel size.
     * @param {import("./pixel.js").Pixel} position Position on the view to center on.
     */
    View.prototype.centerOnInternal = function (coordinate, size, position) {
        this.setCenterInternal(calculateCenterOn(coordinate, size, position, this.getResolution(), this.getRotation()));
    };
    /**
     * Calculates the shift between map and viewport center.
     * @param {import("./coordinate.js").Coordinate} center Center.
     * @param {number} resolution Resolution.
     * @param {number} rotation Rotation.
     * @param {import("./size.js").Size} size Size.
     * @return {Array<number>|undefined} Center shift.
     */
    View.prototype.calculateCenterShift = function (center, resolution, rotation, size) {
        var centerShift;
        var padding = this.padding_;
        if (padding && center) {
            var reducedSize = this.getViewportSizeMinusPadding_(-rotation);
            var shiftedCenter = calculateCenterOn(center, size, [reducedSize[0] / 2 + padding[3], reducedSize[1] / 2 + padding[0]], resolution, rotation);
            centerShift = [
                center[0] - shiftedCenter[0],
                center[1] - shiftedCenter[1],
            ];
        }
        return centerShift;
    };
    /**
     * @return {boolean} Is defined.
     */
    View.prototype.isDef = function () {
        return !!this.getCenterInternal() && this.getResolution() !== undefined;
    };
    /**
     * Adds relative coordinates to the center of the view. Any extent constraint will apply.
     * @param {import("./coordinate.js").Coordinate} deltaCoordinates Relative value to add.
     * @api
     */
    View.prototype.adjustCenter = function (deltaCoordinates) {
        var center = toUserCoordinate(this.targetCenter_, this.getProjection());
        this.setCenter([
            center[0] + deltaCoordinates[0],
            center[1] + deltaCoordinates[1],
        ]);
    };
    /**
     * Adds relative coordinates to the center of the view. Any extent constraint will apply.
     * @param {import("./coordinate.js").Coordinate} deltaCoordinates Relative value to add.
     */
    View.prototype.adjustCenterInternal = function (deltaCoordinates) {
        var center = this.targetCenter_;
        this.setCenterInternal([
            center[0] + deltaCoordinates[0],
            center[1] + deltaCoordinates[1],
        ]);
    };
    /**
     * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
     * constraint will apply.
     * @param {number} ratio The ratio to apply on the view resolution.
     * @param {import("./coordinate.js").Coordinate} [opt_anchor] The origin of the transformation.
     * @api
     */
    View.prototype.adjustResolution = function (ratio, opt_anchor) {
        var anchor = opt_anchor && fromUserCoordinate(opt_anchor, this.getProjection());
        this.adjustResolutionInternal(ratio, anchor);
    };
    /**
     * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
     * constraint will apply.
     * @param {number} ratio The ratio to apply on the view resolution.
     * @param {import("./coordinate.js").Coordinate} [opt_anchor] The origin of the transformation.
     */
    View.prototype.adjustResolutionInternal = function (ratio, opt_anchor) {
        var isMoving = this.getAnimating() || this.getInteracting();
        var size = this.getViewportSize_(this.getRotation());
        var newResolution = this.constraints_.resolution(this.targetResolution_ * ratio, 0, size, isMoving);
        if (opt_anchor) {
            this.targetCenter_ = this.calculateCenterZoom(newResolution, opt_anchor);
        }
        this.targetResolution_ *= ratio;
        this.applyTargetState_();
    };
    /**
     * Adds a value to the view zoom level, optionally using an anchor. Any resolution
     * constraint will apply.
     * @param {number} delta Relative value to add to the zoom level.
     * @param {import("./coordinate.js").Coordinate} [opt_anchor] The origin of the transformation.
     * @api
     */
    View.prototype.adjustZoom = function (delta, opt_anchor) {
        this.adjustResolution(Math.pow(this.zoomFactor_, -delta), opt_anchor);
    };
    /**
     * Adds a value to the view rotation, optionally using an anchor. Any rotation
     * constraint will apply.
     * @param {number} delta Relative value to add to the zoom rotation, in radians.
     * @param {import("./coordinate.js").Coordinate} [opt_anchor] The rotation center.
     * @api
     */
    View.prototype.adjustRotation = function (delta, opt_anchor) {
        if (opt_anchor) {
            opt_anchor = fromUserCoordinate(opt_anchor, this.getProjection());
        }
        this.adjustRotationInternal(delta, opt_anchor);
    };
    /**
     * @param {number} delta Relative value to add to the zoom rotation, in radians.
     * @param {import("./coordinate.js").Coordinate} [opt_anchor] The rotation center.
     */
    View.prototype.adjustRotationInternal = function (delta, opt_anchor) {
        var isMoving = this.getAnimating() || this.getInteracting();
        var newRotation = this.constraints_.rotation(this.targetRotation_ + delta, isMoving);
        if (opt_anchor) {
            this.targetCenter_ = this.calculateCenterRotate(newRotation, opt_anchor);
        }
        this.targetRotation_ += delta;
        this.applyTargetState_();
    };
    /**
     * Set the center of the current view. Any extent constraint will apply.
     * @param {import("./coordinate.js").Coordinate|undefined} center The center of the view.
     * @observable
     * @api
     */
    View.prototype.setCenter = function (center) {
        this.setCenterInternal(fromUserCoordinate(center, this.getProjection()));
    };
    /**
     * Set the center using the view projection (not the user projection).
     * @param {import("./coordinate.js").Coordinate|undefined} center The center of the view.
     */
    View.prototype.setCenterInternal = function (center) {
        this.targetCenter_ = center;
        this.applyTargetState_();
    };
    /**
     * @param {import("./ViewHint.js").default} hint Hint.
     * @param {number} delta Delta.
     * @return {number} New value.
     */
    View.prototype.setHint = function (hint, delta) {
        this.hints_[hint] += delta;
        this.changed();
        return this.hints_[hint];
    };
    /**
     * Set the resolution for this view. Any resolution constraint will apply.
     * @param {number|undefined} resolution The resolution of the view.
     * @observable
     * @api
     */
    View.prototype.setResolution = function (resolution) {
        this.targetResolution_ = resolution;
        this.applyTargetState_();
    };
    /**
     * Set the rotation for this view. Any rotation constraint will apply.
     * @param {number} rotation The rotation of the view in radians.
     * @observable
     * @api
     */
    View.prototype.setRotation = function (rotation) {
        this.targetRotation_ = rotation;
        this.applyTargetState_();
    };
    /**
     * Zoom to a specific zoom level. Any resolution constrain will apply.
     * @param {number} zoom Zoom level.
     * @api
     */
    View.prototype.setZoom = function (zoom) {
        this.setResolution(this.getResolutionForZoom(zoom));
    };
    /**
     * Recompute rotation/resolution/center based on target values.
     * Note: we have to compute rotation first, then resolution and center considering that
     * parameters can influence one another in case a view extent constraint is present.
     * @param {boolean} [opt_doNotCancelAnims] Do not cancel animations.
     * @param {boolean} [opt_forceMoving] Apply constraints as if the view is moving.
     * @private
     */
    View.prototype.applyTargetState_ = function (opt_doNotCancelAnims, opt_forceMoving) {
        var isMoving = this.getAnimating() || this.getInteracting() || opt_forceMoving;
        // compute rotation
        var newRotation = this.constraints_.rotation(this.targetRotation_, isMoving);
        var size = this.getViewportSize_(newRotation);
        var newResolution = this.constraints_.resolution(this.targetResolution_, 0, size, isMoving);
        var newCenter = this.constraints_.center(this.targetCenter_, newResolution, size, isMoving, this.calculateCenterShift(this.targetCenter_, newResolution, newRotation, size));
        if (this.get(ViewProperty.ROTATION) !== newRotation) {
            this.set(ViewProperty.ROTATION, newRotation);
        }
        if (this.get(ViewProperty.RESOLUTION) !== newResolution) {
            this.set(ViewProperty.RESOLUTION, newResolution);
        }
        if (!this.get(ViewProperty.CENTER) ||
            !equals(this.get(ViewProperty.CENTER), newCenter)) {
            this.set(ViewProperty.CENTER, newCenter);
        }
        if (this.getAnimating() && !opt_doNotCancelAnims) {
            this.cancelAnimations();
        }
        this.cancelAnchor_ = undefined;
    };
    /**
     * If any constraints need to be applied, an animation will be triggered.
     * This is typically done on interaction end.
     * Note: calling this with a duration of 0 will apply the constrained values straight away,
     * without animation.
     * @param {number} [opt_duration] The animation duration in ms.
     * @param {number} [opt_resolutionDirection] Which direction to zoom.
     * @param {import("./coordinate.js").Coordinate} [opt_anchor] The origin of the transformation.
     */
    View.prototype.resolveConstraints = function (opt_duration, opt_resolutionDirection, opt_anchor) {
        var duration = opt_duration !== undefined ? opt_duration : 200;
        var direction = opt_resolutionDirection || 0;
        var newRotation = this.constraints_.rotation(this.targetRotation_);
        var size = this.getViewportSize_(newRotation);
        var newResolution = this.constraints_.resolution(this.targetResolution_, direction, size);
        var newCenter = this.constraints_.center(this.targetCenter_, newResolution, size, false, this.calculateCenterShift(this.targetCenter_, newResolution, newRotation, size));
        if (duration === 0 && !this.cancelAnchor_) {
            this.targetResolution_ = newResolution;
            this.targetRotation_ = newRotation;
            this.targetCenter_ = newCenter;
            this.applyTargetState_();
            return;
        }
        var anchor = opt_anchor || (duration === 0 ? this.cancelAnchor_ : undefined);
        this.cancelAnchor_ = undefined;
        if (this.getResolution() !== newResolution ||
            this.getRotation() !== newRotation ||
            !this.getCenterInternal() ||
            !equals(this.getCenterInternal(), newCenter)) {
            if (this.getAnimating()) {
                this.cancelAnimations();
            }
            this.animateInternal({
                rotation: newRotation,
                center: newCenter,
                resolution: newResolution,
                duration: duration,
                easing: easeOut,
                anchor: anchor,
            });
        }
    };
    /**
     * Notify the View that an interaction has started.
     * The view state will be resolved to a stable one if needed
     * (depending on its constraints).
     * @api
     */
    View.prototype.beginInteraction = function () {
        this.resolveConstraints(0);
        this.setHint(ViewHint.INTERACTING, 1);
    };
    /**
     * Notify the View that an interaction has ended. The view state will be resolved
     * to a stable one if needed (depending on its constraints).
     * @param {number} [opt_duration] Animation duration in ms.
     * @param {number} [opt_resolutionDirection] Which direction to zoom.
     * @param {import("./coordinate.js").Coordinate} [opt_anchor] The origin of the transformation.
     * @api
     */
    View.prototype.endInteraction = function (opt_duration, opt_resolutionDirection, opt_anchor) {
        var anchor = opt_anchor && fromUserCoordinate(opt_anchor, this.getProjection());
        this.endInteractionInternal(opt_duration, opt_resolutionDirection, anchor);
    };
    /**
     * Notify the View that an interaction has ended. The view state will be resolved
     * to a stable one if needed (depending on its constraints).
     * @param {number} [opt_duration] Animation duration in ms.
     * @param {number} [opt_resolutionDirection] Which direction to zoom.
     * @param {import("./coordinate.js").Coordinate} [opt_anchor] The origin of the transformation.
     */
    View.prototype.endInteractionInternal = function (opt_duration, opt_resolutionDirection, opt_anchor) {
        this.setHint(ViewHint.INTERACTING, -1);
        this.resolveConstraints(opt_duration, opt_resolutionDirection, opt_anchor);
    };
    /**
     * Get a valid position for the view center according to the current constraints.
     * @param {import("./coordinate.js").Coordinate|undefined} targetCenter Target center position.
     * @param {number} [opt_targetResolution] Target resolution. If not supplied, the current one will be used.
     * This is useful to guess a valid center position at a different zoom level.
     * @return {import("./coordinate.js").Coordinate|undefined} Valid center position.
     */
    View.prototype.getConstrainedCenter = function (targetCenter, opt_targetResolution) {
        var size = this.getViewportSize_(this.getRotation());
        return this.constraints_.center(targetCenter, opt_targetResolution || this.getResolution(), size);
    };
    /**
     * Get a valid zoom level according to the current view constraints.
     * @param {number|undefined} targetZoom Target zoom.
     * @param {number} [opt_direction=0] Indicate which resolution should be used
     * by a renderer if the view resolution does not match any resolution of the tile source.
     * If 0, the nearest resolution will be used. If 1, the nearest lower resolution
     * will be used. If -1, the nearest higher resolution will be used.
     * @return {number|undefined} Valid zoom level.
     */
    View.prototype.getConstrainedZoom = function (targetZoom, opt_direction) {
        var targetRes = this.getResolutionForZoom(targetZoom);
        return this.getZoomForResolution(this.getConstrainedResolution(targetRes, opt_direction));
    };
    /**
     * Get a valid resolution according to the current view constraints.
     * @param {number|undefined} targetResolution Target resolution.
     * @param {number} [opt_direction=0] Indicate which resolution should be used
     * by a renderer if the view resolution does not match any resolution of the tile source.
     * If 0, the nearest resolution will be used. If 1, the nearest lower resolution
     * will be used. If -1, the nearest higher resolution will be used.
     * @return {number|undefined} Valid resolution.
     */
    View.prototype.getConstrainedResolution = function (targetResolution, opt_direction) {
        var direction = opt_direction || 0;
        var size = this.getViewportSize_(this.getRotation());
        return this.constraints_.resolution(targetResolution, direction, size);
    };
    return View;
}(BaseObject));
/**
 * @param {Function} callback Callback.
 * @param {*} returnValue Return value.
 */
function animationCallback(callback, returnValue) {
    setTimeout(function () {
        callback(returnValue);
    }, 0);
}
/**
 * @param {ViewOptions} options View options.
 * @return {import("./centerconstraint.js").Type} The constraint.
 */
function createCenterConstraint(options) {
    if (options.extent !== undefined) {
        var smooth = options.smoothExtentConstraint !== undefined
            ? options.smoothExtentConstraint
            : true;
        return createExtent(options.extent, options.constrainOnlyCenter, smooth);
    }
    var projection = createProjection(options.projection, 'EPSG:3857');
    if (options.multiWorld !== true && projection.isGlobal()) {
        var extent = projection.getExtent().slice();
        extent[0] = -Infinity;
        extent[2] = Infinity;
        return createExtent(extent, false, false);
    }
    return none;
}
/**
 * @param {ViewOptions} options View options.
 * @return {{constraint: import("./resolutionconstraint.js").Type, maxResolution: number,
 *     minResolution: number, minZoom: number, zoomFactor: number}} The constraint.
 */
function createResolutionConstraint(options) {
    var resolutionConstraint;
    var maxResolution;
    var minResolution;
    // TODO: move these to be ol constants
    // see https://github.com/openlayers/openlayers/issues/2076
    var defaultMaxZoom = 28;
    var defaultZoomFactor = 2;
    var minZoom = options.minZoom !== undefined ? options.minZoom : DEFAULT_MIN_ZOOM;
    var maxZoom = options.maxZoom !== undefined ? options.maxZoom : defaultMaxZoom;
    var zoomFactor = options.zoomFactor !== undefined ? options.zoomFactor : defaultZoomFactor;
    var multiWorld = options.multiWorld !== undefined ? options.multiWorld : false;
    var smooth = options.smoothResolutionConstraint !== undefined
        ? options.smoothResolutionConstraint
        : true;
    var showFullExtent = options.showFullExtent !== undefined ? options.showFullExtent : false;
    var projection = createProjection(options.projection, 'EPSG:3857');
    var projExtent = projection.getExtent();
    var constrainOnlyCenter = options.constrainOnlyCenter;
    var extent = options.extent;
    if (!multiWorld && !extent && projection.isGlobal()) {
        constrainOnlyCenter = false;
        extent = projExtent;
    }
    if (options.resolutions !== undefined) {
        var resolutions = options.resolutions;
        maxResolution = resolutions[minZoom];
        minResolution =
            resolutions[maxZoom] !== undefined
                ? resolutions[maxZoom]
                : resolutions[resolutions.length - 1];
        if (options.constrainResolution) {
            resolutionConstraint = createSnapToResolutions(resolutions, smooth, !constrainOnlyCenter && extent, showFullExtent);
        }
        else {
            resolutionConstraint = createMinMaxResolution(maxResolution, minResolution, smooth, !constrainOnlyCenter && extent, showFullExtent);
        }
    }
    else {
        // calculate the default min and max resolution
        var size = !projExtent
            ? // use an extent that can fit the whole world if need be
                (360 * METERS_PER_UNIT[Units.DEGREES]) / projection.getMetersPerUnit()
            : Math.max(getWidth(projExtent), getHeight(projExtent));
        var defaultMaxResolution = size / DEFAULT_TILE_SIZE / Math.pow(defaultZoomFactor, DEFAULT_MIN_ZOOM);
        var defaultMinResolution = defaultMaxResolution /
            Math.pow(defaultZoomFactor, defaultMaxZoom - DEFAULT_MIN_ZOOM);
        // user provided maxResolution takes precedence
        maxResolution = options.maxResolution;
        if (maxResolution !== undefined) {
            minZoom = 0;
        }
        else {
            maxResolution = defaultMaxResolution / Math.pow(zoomFactor, minZoom);
        }
        // user provided minResolution takes precedence
        minResolution = options.minResolution;
        if (minResolution === undefined) {
            if (options.maxZoom !== undefined) {
                if (options.maxResolution !== undefined) {
                    minResolution = maxResolution / Math.pow(zoomFactor, maxZoom);
                }
                else {
                    minResolution = defaultMaxResolution / Math.pow(zoomFactor, maxZoom);
                }
            }
            else {
                minResolution = defaultMinResolution;
            }
        }
        // given discrete zoom levels, minResolution may be different than provided
        maxZoom =
            minZoom +
                Math.floor(Math.log(maxResolution / minResolution) / Math.log(zoomFactor));
        minResolution = maxResolution / Math.pow(zoomFactor, maxZoom - minZoom);
        if (options.constrainResolution) {
            resolutionConstraint = createSnapToPower(zoomFactor, maxResolution, minResolution, smooth, !constrainOnlyCenter && extent, showFullExtent);
        }
        else {
            resolutionConstraint = createMinMaxResolution(maxResolution, minResolution, smooth, !constrainOnlyCenter && extent, showFullExtent);
        }
    }
    return {
        constraint: resolutionConstraint,
        maxResolution: maxResolution,
        minResolution: minResolution,
        minZoom: minZoom,
        zoomFactor: zoomFactor,
    };
}
/**
 * @param {ViewOptions} options View options.
 * @return {import("./rotationconstraint.js").Type} Rotation constraint.
 */
function createRotationConstraint(options) {
    var enableRotation = options.enableRotation !== undefined ? options.enableRotation : true;
    if (enableRotation) {
        var constrainRotation = options.constrainRotation;
        if (constrainRotation === undefined || constrainRotation === true) {
            return createSnapToZero();
        }
        else if (constrainRotation === false) {
            return none$1;
        }
        else if (typeof constrainRotation === 'number') {
            return createSnapToN(constrainRotation);
        }
        else {
            return none$1;
        }
    }
    else {
        return disable;
    }
}
/**
 * Determine if an animation involves no view change.
 * @param {Animation} animation The animation.
 * @return {boolean} The animation involves no view change.
 */
function isNoopAnimation(animation) {
    if (animation.sourceCenter && animation.targetCenter) {
        if (!equals(animation.sourceCenter, animation.targetCenter)) {
            return false;
        }
    }
    if (animation.sourceResolution !== animation.targetResolution) {
        return false;
    }
    if (animation.sourceRotation !== animation.targetRotation) {
        return false;
    }
    return true;
}
/**
 * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
 * @param {import("./size.js").Size} size Box pixel size.
 * @param {import("./pixel.js").Pixel} position Position on the view to center on.
 * @param {number} resolution Resolution.
 * @param {number} rotation Rotation.
 * @return {import("./coordinate.js").Coordinate} Shifted center.
 */
function calculateCenterOn(coordinate, size, position, resolution, rotation) {
    // calculate rotated position
    var cosAngle = Math.cos(-rotation);
    var sinAngle = Math.sin(-rotation);
    var rotX = coordinate[0] * cosAngle - coordinate[1] * sinAngle;
    var rotY = coordinate[1] * cosAngle + coordinate[0] * sinAngle;
    rotX += (size[0] / 2 - position[0]) * resolution;
    rotY += (position[1] - size[1] / 2) * resolution;
    // go back to original angle
    sinAngle = -sinAngle; // go back to original rotation
    var centerX = rotX * cosAngle - rotY * sinAngle;
    var centerY = rotY * cosAngle + rotX * sinAngle;
    return [centerX, centerY];
}

var __extends$9 = (undefined && undefined.__extends) || (function () {
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
 * State of the current frame. Only `pixelRatio`, `time` and `viewState` should
 * be used in applications.
 * @typedef {Object} FrameState
 * @property {number} pixelRatio The pixel ratio of the frame.
 * @property {number} time The time when rendering of the frame was requested.
 * @property {import("./View.js").State} viewState The state of the current view.
 * @property {boolean} animate Animate.
 * @property {import("./transform.js").Transform} coordinateToPixelTransform CoordinateToPixelTransform.
 * @property {import("rbush").default} declutterTree DeclutterTree.
 * @property {null|import("./extent.js").Extent} extent Extent.
 * @property {import("./extent.js").Extent} [nextExtent] Next extent during an animation series.
 * @property {number} index Index.
 * @property {Array<import("./layer/Layer.js").State>} layerStatesArray LayerStatesArray.
 * @property {number} layerIndex LayerIndex.
 * @property {import("./transform.js").Transform} pixelToCoordinateTransform PixelToCoordinateTransform.
 * @property {Array<PostRenderFunction>} postRenderFunctions PostRenderFunctions.
 * @property {import("./size.js").Size} size Size.
 * @property {TileQueue} tileQueue TileQueue.
 * @property {!Object<string, Object<string, boolean>>} usedTiles UsedTiles.
 * @property {Array<number>} viewHints ViewHints.
 * @property {!Object<string, Object<string, boolean>>} wantedTiles WantedTiles.
 */
/**
 * @typedef {function(PluggableMap, ?FrameState): any} PostRenderFunction
 */
/**
 * @typedef {Object} AtPixelOptions
 * @property {undefined|function(import("./layer/Layer.js").default<import("./source/Source").default>): boolean} [layerFilter] Layer filter
 * function. The filter function will receive one argument, the
 * {@link module:ol/layer/Layer layer-candidate} and it should return a boolean value.
 * Only layers which are visible and for which this function returns `true`
 * will be tested for features. By default, all visible layers will be tested.
 * @property {number} [hitTolerance=0] Hit-detection tolerance in css pixels. Pixels
 * inside the radius around the given position will be checked for features.
 * @property {boolean} [checkWrapped=true] Check-Wrapped Will check for for wrapped geometries inside the range of
 *   +/- 1 world width. Works only if a projection is used that can be wrapped.
 */
/**
 * @typedef {Object} MapOptionsInternal
 * @property {Collection<import("./control/Control.js").default>} [controls] Controls.
 * @property {Collection<import("./interaction/Interaction.js").default>} [interactions] Interactions.
 * @property {HTMLElement|Document} keyboardEventTarget KeyboardEventTarget.
 * @property {Collection<import("./Overlay.js").default>} overlays Overlays.
 * @property {Object<string, *>} values Values.
 */
/**
 * @typedef {import("./ObjectEventType").Types|'change:layergroup'|'change:size'|'change:target'|'change:view'} MapObjectEventTypes
 */
/***
 * @template Return
 * @typedef {import("./Observable").OnSignature<import("./Observable").EventTypes, import("./events/Event.js").default, Return> &
 *    import("./Observable").OnSignature<MapObjectEventTypes, import("./Object").ObjectEvent, Return> &
 *    import("./Observable").OnSignature<import("./MapBrowserEventType").Types, import("./MapBrowserEvent").default, Return> &
 *    import("./Observable").OnSignature<import("./MapEventType").Types, import("./MapEvent").default, Return> &
 *    import("./Observable").OnSignature<import("./render/EventType").MapRenderEventTypes, import("./render/Event").default, Return> &
 *    import("./Observable").CombinedOnSignature<import("./Observable").EventTypes|MapObjectEventTypes|
 *      import("./MapBrowserEventType").Types|import("./MapEventType").Types|
 *      import("./render/EventType").MapRenderEventTypes, Return>} PluggableMapOnSignature
 */
/**
 * Object literal with config options for the map.
 * @typedef {Object} MapOptions
 * @property {Collection<import("./control/Control.js").default>|Array<import("./control/Control.js").default>} [controls]
 * Controls initially added to the map. If not specified,
 * {@link module:ol/control.defaults} is used.
 * @property {number} [pixelRatio=window.devicePixelRatio] The ratio between
 * physical pixels and device-independent pixels (dips) on the device.
 * @property {Collection<import("./interaction/Interaction.js").default>|Array<import("./interaction/Interaction.js").default>} [interactions]
 * Interactions that are initially added to the map. If not specified,
 * {@link module:ol/interaction.defaults} is used.
 * @property {HTMLElement|Document|string} [keyboardEventTarget] The element to
 * listen to keyboard events on. This determines when the `KeyboardPan` and
 * `KeyboardZoom` interactions trigger. For example, if this option is set to
 * `document` the keyboard interactions will always trigger. If this option is
 * not specified, the element the library listens to keyboard events on is the
 * map target (i.e. the user-provided div for the map). If this is not
 * `document`, the target element needs to be focused for key events to be
 * emitted, requiring that the target element has a `tabindex` attribute.
 * @property {Array<import("./layer/Base.js").default>|Collection<import("./layer/Base.js").default>|LayerGroup} [layers]
 * Layers. If this is not defined, a map with no layers will be rendered. Note
 * that layers are rendered in the order supplied, so if you want, for example,
 * a vector layer to appear on top of a tile layer, it must come after the tile
 * layer.
 * @property {number} [maxTilesLoading=16] Maximum number tiles to load
 * simultaneously.
 * @property {number} [moveTolerance=1] The minimum distance in pixels the
 * cursor must move to be detected as a map move event instead of a click.
 * Increasing this value can make it easier to click on the map.
 * @property {Collection<import("./Overlay.js").default>|Array<import("./Overlay.js").default>} [overlays]
 * Overlays initially added to the map. By default, no overlays are added.
 * @property {HTMLElement|string} [target] The container for the map, either the
 * element itself or the `id` of the element. If not specified at construction
 * time, {@link module:ol/Map~Map#setTarget} must be called for the map to be
 * rendered. If passed by element, the container can be in a secondary document.
 * @property {View|Promise<import("./View.js").ViewOptions>} [view] The map's view.  No layer sources will be
 * fetched unless this is specified at construction time or through
 * {@link module:ol/Map~Map#setView}.
 */
/**
 * @fires import("./MapBrowserEvent.js").MapBrowserEvent
 * @fires import("./MapEvent.js").MapEvent
 * @fires import("./render/Event.js").default#precompose
 * @fires import("./render/Event.js").default#postcompose
 * @fires import("./render/Event.js").default#rendercomplete
 * @api
 */
var PluggableMap = /** @class */ (function (_super) {
    __extends$9(PluggableMap, _super);
    /**
     * @param {MapOptions} options Map options.
     */
    function PluggableMap(options) {
        var _this = _super.call(this) || this;
        /***
         * @type {PluggableMapOnSignature<import("./events").EventsKey>}
         */
        _this.on;
        /***
         * @type {PluggableMapOnSignature<import("./events").EventsKey>}
         */
        _this.once;
        /***
         * @type {PluggableMapOnSignature<void>}
         */
        _this.un;
        var optionsInternal = createOptionsInternal(options);
        /** @private */
        _this.boundHandleBrowserEvent_ = _this.handleBrowserEvent.bind(_this);
        /**
         * @type {number}
         * @private
         */
        _this.maxTilesLoading_ =
            options.maxTilesLoading !== undefined ? options.maxTilesLoading : 16;
        /**
         * @private
         * @type {number}
         */
        _this.pixelRatio_ =
            options.pixelRatio !== undefined
                ? options.pixelRatio
                : DEVICE_PIXEL_RATIO;
        /**
         * @private
         * @type {*}
         */
        _this.postRenderTimeoutHandle_;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.animationDelayKey_;
        /**
         * @private
         */
        _this.animationDelay_ = /** @this {PluggableMap} */ function () {
            this.animationDelayKey_ = undefined;
            this.renderFrame_(Date.now());
        }.bind(_this);
        /**
         * @private
         * @type {import("./transform.js").Transform}
         */
        _this.coordinateToPixelTransform_ = create();
        /**
         * @private
         * @type {import("./transform.js").Transform}
         */
        _this.pixelToCoordinateTransform_ = create();
        /**
         * @private
         * @type {number}
         */
        _this.frameIndex_ = 0;
        /**
         * @private
         * @type {?FrameState}
         */
        _this.frameState_ = null;
        /**
         * The extent at the previous 'moveend' event.
         * @private
         * @type {import("./extent.js").Extent}
         */
        _this.previousExtent_ = null;
        /**
         * @private
         * @type {?import("./events.js").EventsKey}
         */
        _this.viewPropertyListenerKey_ = null;
        /**
         * @private
         * @type {?import("./events.js").EventsKey}
         */
        _this.viewChangeListenerKey_ = null;
        /**
         * @private
         * @type {?Array<import("./events.js").EventsKey>}
         */
        _this.layerGroupPropertyListenerKeys_ = null;
        /**
         * @private
         * @type {!HTMLElement}
         */
        _this.viewport_ = document.createElement('div');
        _this.viewport_.className =
            'ol-viewport' + ('ontouchstart' in window ? ' ol-touch' : '');
        _this.viewport_.style.position = 'relative';
        _this.viewport_.style.overflow = 'hidden';
        _this.viewport_.style.width = '100%';
        _this.viewport_.style.height = '100%';
        /**
         * @private
         * @type {!HTMLElement}
         */
        _this.overlayContainer_ = document.createElement('div');
        _this.overlayContainer_.style.position = 'absolute';
        _this.overlayContainer_.style.zIndex = '0';
        _this.overlayContainer_.style.width = '100%';
        _this.overlayContainer_.style.height = '100%';
        _this.overlayContainer_.style.pointerEvents = 'none';
        _this.overlayContainer_.className = 'ol-overlaycontainer';
        _this.viewport_.appendChild(_this.overlayContainer_);
        /**
         * @private
         * @type {!HTMLElement}
         */
        _this.overlayContainerStopEvent_ = document.createElement('div');
        _this.overlayContainerStopEvent_.style.position = 'absolute';
        _this.overlayContainerStopEvent_.style.zIndex = '0';
        _this.overlayContainerStopEvent_.style.width = '100%';
        _this.overlayContainerStopEvent_.style.height = '100%';
        _this.overlayContainerStopEvent_.style.pointerEvents = 'none';
        _this.overlayContainerStopEvent_.className = 'ol-overlaycontainer-stopevent';
        _this.viewport_.appendChild(_this.overlayContainerStopEvent_);
        /**
         * @private
         * @type {MapBrowserEventHandler}
         */
        _this.mapBrowserEventHandler_ = null;
        /**
         * @private
         * @type {number}
         */
        _this.moveTolerance_ = options.moveTolerance;
        /**
         * @private
         * @type {HTMLElement|Document}
         */
        _this.keyboardEventTarget_ = optionsInternal.keyboardEventTarget;
        /**
         * @private
         * @type {?Array<import("./events.js").EventsKey>}
         */
        _this.keyHandlerKeys_ = null;
        /**
         * @type {Collection<import("./control/Control.js").default>}
         * @protected
         */
        _this.controls = optionsInternal.controls || new Collection();
        /**
         * @type {Collection<import("./interaction/Interaction.js").default>}
         * @protected
         */
        _this.interactions = optionsInternal.interactions || new Collection();
        /**
         * @type {Collection<import("./Overlay.js").default>}
         * @private
         */
        _this.overlays_ = optionsInternal.overlays;
        /**
         * A lookup of overlays by id.
         * @private
         * @type {Object<string, import("./Overlay.js").default>}
         */
        _this.overlayIdIndex_ = {};
        /**
         * @type {import("./renderer/Map.js").default}
         * @private
         */
        _this.renderer_ = null;
        /**
         * @type {undefined|function(Event): void}
         * @private
         */
        _this.handleResize_;
        /**
         * @private
         * @type {!Array<PostRenderFunction>}
         */
        _this.postRenderFunctions_ = [];
        /**
         * @private
         * @type {TileQueue}
         */
        _this.tileQueue_ = new TileQueue(_this.getTilePriority.bind(_this), _this.handleTileChange_.bind(_this));
        _this.addChangeListener(MapProperty.LAYERGROUP, _this.handleLayerGroupChanged_);
        _this.addChangeListener(MapProperty.VIEW, _this.handleViewChanged_);
        _this.addChangeListener(MapProperty.SIZE, _this.handleSizeChanged_);
        _this.addChangeListener(MapProperty.TARGET, _this.handleTargetChanged_);
        // setProperties will trigger the rendering of the map if the map
        // is "defined" already.
        _this.setProperties(optionsInternal.values);
        var map = _this;
        if (options.view && !(options.view instanceof View)) {
            options.view.then(function (viewOptions) {
                map.setView(new View(viewOptions));
            });
        }
        _this.controls.addEventListener(CollectionEventType.ADD, 
        /**
         * @param {import("./Collection.js").CollectionEvent} event CollectionEvent.
         */
        function (event) {
            event.element.setMap(this);
        }.bind(_this));
        _this.controls.addEventListener(CollectionEventType.REMOVE, 
        /**
         * @param {import("./Collection.js").CollectionEvent} event CollectionEvent.
         */
        function (event) {
            event.element.setMap(null);
        }.bind(_this));
        _this.interactions.addEventListener(CollectionEventType.ADD, 
        /**
         * @param {import("./Collection.js").CollectionEvent} event CollectionEvent.
         */
        function (event) {
            event.element.setMap(this);
        }.bind(_this));
        _this.interactions.addEventListener(CollectionEventType.REMOVE, 
        /**
         * @param {import("./Collection.js").CollectionEvent} event CollectionEvent.
         */
        function (event) {
            event.element.setMap(null);
        }.bind(_this));
        _this.overlays_.addEventListener(CollectionEventType.ADD, 
        /**
         * @param {import("./Collection.js").CollectionEvent} event CollectionEvent.
         */
        function (event) {
            this.addOverlayInternal_(
            /** @type {import("./Overlay.js").default} */ (event.element));
        }.bind(_this));
        _this.overlays_.addEventListener(CollectionEventType.REMOVE, 
        /**
         * @param {import("./Collection.js").CollectionEvent} event CollectionEvent.
         */
        function (event) {
            var overlay = /** @type {import("./Overlay.js").default} */ (event.element);
            var id = overlay.getId();
            if (id !== undefined) {
                delete this.overlayIdIndex_[id.toString()];
            }
            event.element.setMap(null);
        }.bind(_this));
        _this.controls.forEach(
        /**
         * @param {import("./control/Control.js").default} control Control.
         * @this {PluggableMap}
         */
        function (control) {
            control.setMap(this);
        }.bind(_this));
        _this.interactions.forEach(
        /**
         * @param {import("./interaction/Interaction.js").default} interaction Interaction.
         * @this {PluggableMap}
         */
        function (interaction) {
            interaction.setMap(this);
        }.bind(_this));
        _this.overlays_.forEach(_this.addOverlayInternal_.bind(_this));
        return _this;
    }
    /**
     * @abstract
     * @return {import("./renderer/Map.js").default} The map renderer
     */
    PluggableMap.prototype.createRenderer = function () {
        throw new Error('Use a map type that has a createRenderer method');
    };
    /**
     * Add the given control to the map.
     * @param {import("./control/Control.js").default} control Control.
     * @api
     */
    PluggableMap.prototype.addControl = function (control) {
        this.getControls().push(control);
    };
    /**
     * Add the given interaction to the map. If you want to add an interaction
     * at another point of the collection use `getInteraction()` and the methods
     * available on {@link module:ol/Collection~Collection}. This can be used to
     * stop the event propagation from the handleEvent function. The interactions
     * get to handle the events in the reverse order of this collection.
     * @param {import("./interaction/Interaction.js").default} interaction Interaction to add.
     * @api
     */
    PluggableMap.prototype.addInteraction = function (interaction) {
        this.getInteractions().push(interaction);
    };
    /**
     * Adds the given layer to the top of this map. If you want to add a layer
     * elsewhere in the stack, use `getLayers()` and the methods available on
     * {@link module:ol/Collection~Collection}.
     * @param {import("./layer/Base.js").default} layer Layer.
     * @api
     */
    PluggableMap.prototype.addLayer = function (layer) {
        var layers = this.getLayerGroup().getLayers();
        layers.push(layer);
    };
    /**
     * Add the given overlay to the map.
     * @param {import("./Overlay.js").default} overlay Overlay.
     * @api
     */
    PluggableMap.prototype.addOverlay = function (overlay) {
        this.getOverlays().push(overlay);
    };
    /**
     * This deals with map's overlay collection changes.
     * @param {import("./Overlay.js").default} overlay Overlay.
     * @private
     */
    PluggableMap.prototype.addOverlayInternal_ = function (overlay) {
        var id = overlay.getId();
        if (id !== undefined) {
            this.overlayIdIndex_[id.toString()] = overlay;
        }
        overlay.setMap(this);
    };
    /**
     *
     * Clean up.
     */
    PluggableMap.prototype.disposeInternal = function () {
        this.setTarget(null);
        _super.prototype.disposeInternal.call(this);
    };
    /**
     * Detect features that intersect a pixel on the viewport, and execute a
     * callback with each intersecting feature. Layers included in the detection can
     * be configured through the `layerFilter` option in `opt_options`.
     * @param {import("./pixel.js").Pixel} pixel Pixel.
     * @param {function(import("./Feature.js").FeatureLike, import("./layer/Layer.js").default<import("./source/Source").default>, import("./geom/SimpleGeometry.js").default): T} callback Feature callback. The callback will be
     *     called with two arguments. The first argument is one
     *     {@link module:ol/Feature feature} or
     *     {@link module:ol/render/Feature render feature} at the pixel, the second is
     *     the {@link module:ol/layer/Layer layer} of the feature and will be null for
     *     unmanaged layers. To stop detection, callback functions can return a
     *     truthy value.
     * @param {AtPixelOptions} [opt_options] Optional options.
     * @return {T|undefined} Callback result, i.e. the return value of last
     * callback execution, or the first truthy callback return value.
     * @template T
     * @api
     */
    PluggableMap.prototype.forEachFeatureAtPixel = function (pixel, callback, opt_options) {
        if (!this.frameState_) {
            return;
        }
        var coordinate = this.getCoordinateFromPixelInternal(pixel);
        opt_options = opt_options !== undefined ? opt_options : {};
        var hitTolerance = opt_options.hitTolerance !== undefined ? opt_options.hitTolerance : 0;
        var layerFilter = opt_options.layerFilter !== undefined ? opt_options.layerFilter : TRUE;
        var checkWrapped = opt_options.checkWrapped !== false;
        return this.renderer_.forEachFeatureAtCoordinate(coordinate, this.frameState_, hitTolerance, checkWrapped, callback, null, layerFilter, null);
    };
    /**
     * Get all features that intersect a pixel on the viewport.
     * @param {import("./pixel.js").Pixel} pixel Pixel.
     * @param {AtPixelOptions} [opt_options] Optional options.
     * @return {Array<import("./Feature.js").FeatureLike>} The detected features or
     * an empty array if none were found.
     * @api
     */
    PluggableMap.prototype.getFeaturesAtPixel = function (pixel, opt_options) {
        var features = [];
        this.forEachFeatureAtPixel(pixel, function (feature) {
            features.push(feature);
        }, opt_options);
        return features;
    };
    /**
     * Detect layers that have a color value at a pixel on the viewport, and
     * execute a callback with each matching layer. Layers included in the
     * detection can be configured through `opt_layerFilter`.
     *
     * Note: this may give false positives unless the map layers have had different `className`
     * properties assigned to them.
     *
     * @param {import("./pixel.js").Pixel} pixel Pixel.
     * @param {function(this: S, import("./layer/Layer.js").default, (Uint8ClampedArray|Uint8Array)): T} callback
     *     Layer callback. This callback will receive two arguments: first is the
     *     {@link module:ol/layer/Layer layer}, second argument is an array representing
     *     [R, G, B, A] pixel values (0 - 255) and will be `null` for layer types
     *     that do not currently support this argument. To stop detection, callback
     *     functions can return a truthy value.
     * @param {AtPixelOptions} [opt_options] Configuration options.
     * @return {T|undefined} Callback result, i.e. the return value of last
     * callback execution, or the first truthy callback return value.
     * @template S,T
     * @api
     */
    PluggableMap.prototype.forEachLayerAtPixel = function (pixel, callback, opt_options) {
        if (!this.frameState_) {
            return;
        }
        var options = opt_options || {};
        var hitTolerance = options.hitTolerance !== undefined ? options.hitTolerance : 0;
        var layerFilter = options.layerFilter || TRUE;
        return this.renderer_.forEachLayerAtPixel(pixel, this.frameState_, hitTolerance, callback, layerFilter);
    };
    /**
     * Detect if features intersect a pixel on the viewport. Layers included in the
     * detection can be configured through `opt_layerFilter`.
     * @param {import("./pixel.js").Pixel} pixel Pixel.
     * @param {AtPixelOptions} [opt_options] Optional options.
     * @return {boolean} Is there a feature at the given pixel?
     * @api
     */
    PluggableMap.prototype.hasFeatureAtPixel = function (pixel, opt_options) {
        if (!this.frameState_) {
            return false;
        }
        var coordinate = this.getCoordinateFromPixelInternal(pixel);
        opt_options = opt_options !== undefined ? opt_options : {};
        var layerFilter = opt_options.layerFilter !== undefined ? opt_options.layerFilter : TRUE;
        var hitTolerance = opt_options.hitTolerance !== undefined ? opt_options.hitTolerance : 0;
        var checkWrapped = opt_options.checkWrapped !== false;
        return this.renderer_.hasFeatureAtCoordinate(coordinate, this.frameState_, hitTolerance, checkWrapped, layerFilter, null);
    };
    /**
     * Returns the coordinate in user projection for a browser event.
     * @param {MouseEvent} event Event.
     * @return {import("./coordinate.js").Coordinate} Coordinate.
     * @api
     */
    PluggableMap.prototype.getEventCoordinate = function (event) {
        return this.getCoordinateFromPixel(this.getEventPixel(event));
    };
    /**
     * Returns the coordinate in view projection for a browser event.
     * @param {MouseEvent} event Event.
     * @return {import("./coordinate.js").Coordinate} Coordinate.
     */
    PluggableMap.prototype.getEventCoordinateInternal = function (event) {
        return this.getCoordinateFromPixelInternal(this.getEventPixel(event));
    };
    /**
     * Returns the map pixel position for a browser event relative to the viewport.
     * @param {UIEvent} event Event.
     * @return {import("./pixel.js").Pixel} Pixel.
     * @api
     */
    PluggableMap.prototype.getEventPixel = function (event) {
        var viewportPosition = this.viewport_.getBoundingClientRect();
        var eventPosition = 
        //FIXME Are we really calling this with a TouchEvent anywhere?
        'changedTouches' in event
            ? /** @type {TouchEvent} */ (event).changedTouches[0]
            : /** @type {MouseEvent} */ (event);
        return [
            eventPosition.clientX - viewportPosition.left,
            eventPosition.clientY - viewportPosition.top,
        ];
    };
    /**
     * Get the target in which this map is rendered.
     * Note that this returns what is entered as an option or in setTarget:
     * if that was an element, it returns an element; if a string, it returns that.
     * @return {HTMLElement|string|undefined} The Element or id of the Element that the
     *     map is rendered in.
     * @observable
     * @api
     */
    PluggableMap.prototype.getTarget = function () {
        return /** @type {HTMLElement|string|undefined} */ (this.get(MapProperty.TARGET));
    };
    /**
     * Get the DOM element into which this map is rendered. In contrast to
     * `getTarget` this method always return an `Element`, or `null` if the
     * map has no target.
     * @return {HTMLElement} The element that the map is rendered in.
     * @api
     */
    PluggableMap.prototype.getTargetElement = function () {
        var target = this.getTarget();
        if (target !== undefined) {
            return typeof target === 'string'
                ? document.getElementById(target)
                : target;
        }
        else {
            return null;
        }
    };
    /**
     * Get the coordinate for a given pixel.  This returns a coordinate in the
     * user projection.
     * @param {import("./pixel.js").Pixel} pixel Pixel position in the map viewport.
     * @return {import("./coordinate.js").Coordinate} The coordinate for the pixel position.
     * @api
     */
    PluggableMap.prototype.getCoordinateFromPixel = function (pixel) {
        return toUserCoordinate(this.getCoordinateFromPixelInternal(pixel), this.getView().getProjection());
    };
    /**
     * Get the coordinate for a given pixel.  This returns a coordinate in the
     * map view projection.
     * @param {import("./pixel.js").Pixel} pixel Pixel position in the map viewport.
     * @return {import("./coordinate.js").Coordinate} The coordinate for the pixel position.
     */
    PluggableMap.prototype.getCoordinateFromPixelInternal = function (pixel) {
        var frameState = this.frameState_;
        if (!frameState) {
            return null;
        }
        else {
            return apply(frameState.pixelToCoordinateTransform, pixel.slice());
        }
    };
    /**
     * Get the map controls. Modifying this collection changes the controls
     * associated with the map.
     * @return {Collection<import("./control/Control.js").default>} Controls.
     * @api
     */
    PluggableMap.prototype.getControls = function () {
        return this.controls;
    };
    /**
     * Get the map overlays. Modifying this collection changes the overlays
     * associated with the map.
     * @return {Collection<import("./Overlay.js").default>} Overlays.
     * @api
     */
    PluggableMap.prototype.getOverlays = function () {
        return this.overlays_;
    };
    /**
     * Get an overlay by its identifier (the value returned by overlay.getId()).
     * Note that the index treats string and numeric identifiers as the same. So
     * `map.getOverlayById(2)` will return an overlay with id `'2'` or `2`.
     * @param {string|number} id Overlay identifier.
     * @return {import("./Overlay.js").default} Overlay.
     * @api
     */
    PluggableMap.prototype.getOverlayById = function (id) {
        var overlay = this.overlayIdIndex_[id.toString()];
        return overlay !== undefined ? overlay : null;
    };
    /**
     * Get the map interactions. Modifying this collection changes the interactions
     * associated with the map.
     *
     * Interactions are used for e.g. pan, zoom and rotate.
     * @return {Collection<import("./interaction/Interaction.js").default>} Interactions.
     * @api
     */
    PluggableMap.prototype.getInteractions = function () {
        return this.interactions;
    };
    /**
     * Get the layergroup associated with this map.
     * @return {LayerGroup} A layer group containing the layers in this map.
     * @observable
     * @api
     */
    PluggableMap.prototype.getLayerGroup = function () {
        return /** @type {LayerGroup} */ (this.get(MapProperty.LAYERGROUP));
    };
    /**
     * Clear any existing layers and add layers to the map.
     * @param {Array<import("./layer/Base.js").default>|Collection<import("./layer/Base.js").default>} layers The layers to be added to the map.
     * @api
     */
    PluggableMap.prototype.setLayers = function (layers) {
        var group = this.getLayerGroup();
        if (layers instanceof Collection) {
            group.setLayers(layers);
            return;
        }
        var collection = group.getLayers();
        collection.clear();
        collection.extend(layers);
    };
    /**
     * Get the collection of layers associated with this map.
     * @return {!Collection<import("./layer/Base.js").default>} Layers.
     * @api
     */
    PluggableMap.prototype.getLayers = function () {
        var layers = this.getLayerGroup().getLayers();
        return layers;
    };
    /**
     * @return {boolean} Layers have sources that are still loading.
     */
    PluggableMap.prototype.getLoading = function () {
        var layerStatesArray = this.getLayerGroup().getLayerStatesArray();
        for (var i = 0, ii = layerStatesArray.length; i < ii; ++i) {
            var layer = layerStatesArray[i].layer;
            var source = /** @type {import("./layer/Layer.js").default} */ (layer).getSource();
            if (source && source.loading) {
                return true;
            }
        }
        return false;
    };
    /**
     * Get the pixel for a coordinate.  This takes a coordinate in the user
     * projection and returns the corresponding pixel.
     * @param {import("./coordinate.js").Coordinate} coordinate A map coordinate.
     * @return {import("./pixel.js").Pixel} A pixel position in the map viewport.
     * @api
     */
    PluggableMap.prototype.getPixelFromCoordinate = function (coordinate) {
        var viewCoordinate = fromUserCoordinate(coordinate, this.getView().getProjection());
        return this.getPixelFromCoordinateInternal(viewCoordinate);
    };
    /**
     * Get the pixel for a coordinate.  This takes a coordinate in the map view
     * projection and returns the corresponding pixel.
     * @param {import("./coordinate.js").Coordinate} coordinate A map coordinate.
     * @return {import("./pixel.js").Pixel} A pixel position in the map viewport.
     */
    PluggableMap.prototype.getPixelFromCoordinateInternal = function (coordinate) {
        var frameState = this.frameState_;
        if (!frameState) {
            return null;
        }
        else {
            return apply(frameState.coordinateToPixelTransform, coordinate.slice(0, 2));
        }
    };
    /**
     * Get the map renderer.
     * @return {import("./renderer/Map.js").default} Renderer
     */
    PluggableMap.prototype.getRenderer = function () {
        return this.renderer_;
    };
    /**
     * Get the size of this map.
     * @return {import("./size.js").Size|undefined} The size in pixels of the map in the DOM.
     * @observable
     * @api
     */
    PluggableMap.prototype.getSize = function () {
        return /** @type {import("./size.js").Size|undefined} */ (this.get(MapProperty.SIZE));
    };
    /**
     * Get the view associated with this map. A view manages properties such as
     * center and resolution.
     * @return {View} The view that controls this map.
     * @observable
     * @api
     */
    PluggableMap.prototype.getView = function () {
        return /** @type {View} */ (this.get(MapProperty.VIEW));
    };
    /**
     * Get the element that serves as the map viewport.
     * @return {HTMLElement} Viewport.
     * @api
     */
    PluggableMap.prototype.getViewport = function () {
        return this.viewport_;
    };
    /**
     * Get the element that serves as the container for overlays.  Elements added to
     * this container will let mousedown and touchstart events through to the map,
     * so clicks and gestures on an overlay will trigger {@link module:ol/MapBrowserEvent~MapBrowserEvent}
     * events.
     * @return {!HTMLElement} The map's overlay container.
     */
    PluggableMap.prototype.getOverlayContainer = function () {
        return this.overlayContainer_;
    };
    /**
     * Get the element that serves as a container for overlays that don't allow
     * event propagation. Elements added to this container won't let mousedown and
     * touchstart events through to the map, so clicks and gestures on an overlay
     * don't trigger any {@link module:ol/MapBrowserEvent~MapBrowserEvent}.
     * @return {!HTMLElement} The map's overlay container that stops events.
     */
    PluggableMap.prototype.getOverlayContainerStopEvent = function () {
        return this.overlayContainerStopEvent_;
    };
    /**
     * @return {!Document} The document where the map is displayed.
     */
    PluggableMap.prototype.getOwnerDocument = function () {
        var targetElement = this.getTargetElement();
        return targetElement ? targetElement.ownerDocument : document;
    };
    /**
     * @param {import("./Tile.js").default} tile Tile.
     * @param {string} tileSourceKey Tile source key.
     * @param {import("./coordinate.js").Coordinate} tileCenter Tile center.
     * @param {number} tileResolution Tile resolution.
     * @return {number} Tile priority.
     */
    PluggableMap.prototype.getTilePriority = function (tile, tileSourceKey, tileCenter, tileResolution) {
        return getTilePriority(this.frameState_, tile, tileSourceKey, tileCenter, tileResolution);
    };
    /**
     * @param {UIEvent} browserEvent Browser event.
     * @param {string} [opt_type] Type.
     */
    PluggableMap.prototype.handleBrowserEvent = function (browserEvent, opt_type) {
        var type = opt_type || browserEvent.type;
        var mapBrowserEvent = new MapBrowserEvent(type, this, browserEvent);
        this.handleMapBrowserEvent(mapBrowserEvent);
    };
    /**
     * @param {MapBrowserEvent} mapBrowserEvent The event to handle.
     */
    PluggableMap.prototype.handleMapBrowserEvent = function (mapBrowserEvent) {
        if (!this.frameState_) {
            // With no view defined, we cannot translate pixels into geographical
            // coordinates so interactions cannot be used.
            return;
        }
        var originalEvent = /** @type {PointerEvent} */ (mapBrowserEvent.originalEvent);
        var eventType = originalEvent.type;
        if (eventType === PointerEventType.POINTERDOWN ||
            eventType === EventType.WHEEL ||
            eventType === EventType.KEYDOWN) {
            var doc = this.getOwnerDocument();
            var rootNode = this.viewport_.getRootNode
                ? this.viewport_.getRootNode()
                : doc;
            var target = /** @type {Node} */ (originalEvent.target);
            if (
            // Abort if the target is a child of the container for elements whose events are not meant
            // to be handled by map interactions.
            this.overlayContainerStopEvent_.contains(target) ||
                // Abort if the event target is a child of the container that is no longer in the page.
                // It's possible for the target to no longer be in the page if it has been removed in an
                // event listener, this might happen in a Control that recreates it's content based on
                // user interaction either manually or via a render in something like https://reactjs.org/
                !(rootNode === doc ? doc.documentElement : rootNode).contains(target)) {
                return;
            }
        }
        mapBrowserEvent.frameState = this.frameState_;
        if (this.dispatchEvent(mapBrowserEvent) !== false) {
            var interactionsArray = this.getInteractions().getArray().slice();
            for (var i = interactionsArray.length - 1; i >= 0; i--) {
                var interaction = interactionsArray[i];
                if (interaction.getMap() !== this ||
                    !interaction.getActive() ||
                    !this.getTargetElement()) {
                    continue;
                }
                var cont = interaction.handleEvent(mapBrowserEvent);
                if (!cont || mapBrowserEvent.propagationStopped) {
                    break;
                }
            }
        }
    };
    /**
     * @protected
     */
    PluggableMap.prototype.handlePostRender = function () {
        var frameState = this.frameState_;
        // Manage the tile queue
        // Image loads are expensive and a limited resource, so try to use them
        // efficiently:
        // * When the view is static we allow a large number of parallel tile loads
        //   to complete the frame as quickly as possible.
        // * When animating or interacting, image loads can cause janks, so we reduce
        //   the maximum number of loads per frame and limit the number of parallel
        //   tile loads to remain reactive to view changes and to reduce the chance of
        //   loading tiles that will quickly disappear from view.
        var tileQueue = this.tileQueue_;
        if (!tileQueue.isEmpty()) {
            var maxTotalLoading = this.maxTilesLoading_;
            var maxNewLoads = maxTotalLoading;
            if (frameState) {
                var hints = frameState.viewHints;
                if (hints[ViewHint.ANIMATING] || hints[ViewHint.INTERACTING]) {
                    var lowOnFrameBudget = Date.now() - frameState.time > 8;
                    maxTotalLoading = lowOnFrameBudget ? 0 : 8;
                    maxNewLoads = lowOnFrameBudget ? 0 : 2;
                }
            }
            if (tileQueue.getTilesLoading() < maxTotalLoading) {
                tileQueue.reprioritize(); // FIXME only call if view has changed
                tileQueue.loadMoreTiles(maxTotalLoading, maxNewLoads);
            }
        }
        if (frameState &&
            this.hasListener(RenderEventType.RENDERCOMPLETE) &&
            !frameState.animate &&
            !this.tileQueue_.getTilesLoading() &&
            !this.getLoading()) {
            this.renderer_.dispatchRenderEvent(RenderEventType.RENDERCOMPLETE, frameState);
        }
        var postRenderFunctions = this.postRenderFunctions_;
        for (var i = 0, ii = postRenderFunctions.length; i < ii; ++i) {
            postRenderFunctions[i](this, frameState);
        }
        postRenderFunctions.length = 0;
    };
    /**
     * @private
     */
    PluggableMap.prototype.handleSizeChanged_ = function () {
        if (this.getView() && !this.getView().getAnimating()) {
            this.getView().resolveConstraints(0);
        }
        this.render();
    };
    /**
     * @private
     */
    PluggableMap.prototype.handleTargetChanged_ = function () {
        // target may be undefined, null, a string or an Element.
        // If it's a string we convert it to an Element before proceeding.
        // If it's not now an Element we remove the viewport from the DOM.
        // If it's an Element we append the viewport element to it.
        var targetElement;
        if (this.getTarget()) {
            targetElement = this.getTargetElement();
        }
        if (this.mapBrowserEventHandler_) {
            for (var i = 0, ii = this.keyHandlerKeys_.length; i < ii; ++i) {
                unlistenByKey(this.keyHandlerKeys_[i]);
            }
            this.keyHandlerKeys_ = null;
            this.viewport_.removeEventListener(EventType.CONTEXTMENU, this.boundHandleBrowserEvent_);
            this.viewport_.removeEventListener(EventType.WHEEL, this.boundHandleBrowserEvent_);
            if (this.handleResize_ !== undefined) {
                removeEventListener(EventType.RESIZE, this.handleResize_, false);
                this.handleResize_ = undefined;
            }
            this.mapBrowserEventHandler_.dispose();
            this.mapBrowserEventHandler_ = null;
            removeNode(this.viewport_);
        }
        if (!targetElement) {
            if (this.renderer_) {
                clearTimeout(this.postRenderTimeoutHandle_);
                this.postRenderTimeoutHandle_ = undefined;
                this.postRenderFunctions_.length = 0;
                this.renderer_.dispose();
                this.renderer_ = null;
            }
            if (this.animationDelayKey_) {
                cancelAnimationFrame(this.animationDelayKey_);
                this.animationDelayKey_ = undefined;
            }
        }
        else {
            targetElement.appendChild(this.viewport_);
            if (!this.renderer_) {
                this.renderer_ = this.createRenderer();
            }
            this.mapBrowserEventHandler_ = new MapBrowserEventHandler(this, this.moveTolerance_);
            for (var key in MapBrowserEventType) {
                this.mapBrowserEventHandler_.addEventListener(MapBrowserEventType[key], this.handleMapBrowserEvent.bind(this));
            }
            this.viewport_.addEventListener(EventType.CONTEXTMENU, this.boundHandleBrowserEvent_, false);
            this.viewport_.addEventListener(EventType.WHEEL, this.boundHandleBrowserEvent_, PASSIVE_EVENT_LISTENERS ? { passive: false } : false);
            var keyboardEventTarget = !this.keyboardEventTarget_
                ? targetElement
                : this.keyboardEventTarget_;
            this.keyHandlerKeys_ = [
                listen(keyboardEventTarget, EventType.KEYDOWN, this.handleBrowserEvent, this),
                listen(keyboardEventTarget, EventType.KEYPRESS, this.handleBrowserEvent, this),
            ];
            if (!this.handleResize_) {
                this.handleResize_ = this.updateSize.bind(this);
                window.addEventListener(EventType.RESIZE, this.handleResize_, false);
            }
        }
        this.updateSize();
        // updateSize calls setSize, so no need to call this.render
        // ourselves here.
    };
    /**
     * @private
     */
    PluggableMap.prototype.handleTileChange_ = function () {
        this.render();
    };
    /**
     * @private
     */
    PluggableMap.prototype.handleViewPropertyChanged_ = function () {
        this.render();
    };
    /**
     * @private
     */
    PluggableMap.prototype.handleViewChanged_ = function () {
        if (this.viewPropertyListenerKey_) {
            unlistenByKey(this.viewPropertyListenerKey_);
            this.viewPropertyListenerKey_ = null;
        }
        if (this.viewChangeListenerKey_) {
            unlistenByKey(this.viewChangeListenerKey_);
            this.viewChangeListenerKey_ = null;
        }
        var view = this.getView();
        if (view) {
            this.updateViewportSize_();
            this.viewPropertyListenerKey_ = listen(view, ObjectEventType.PROPERTYCHANGE, this.handleViewPropertyChanged_, this);
            this.viewChangeListenerKey_ = listen(view, EventType.CHANGE, this.handleViewPropertyChanged_, this);
            view.resolveConstraints(0);
        }
        this.render();
    };
    /**
     * @private
     */
    PluggableMap.prototype.handleLayerGroupChanged_ = function () {
        if (this.layerGroupPropertyListenerKeys_) {
            this.layerGroupPropertyListenerKeys_.forEach(unlistenByKey);
            this.layerGroupPropertyListenerKeys_ = null;
        }
        var layerGroup = this.getLayerGroup();
        if (layerGroup) {
            this.layerGroupPropertyListenerKeys_ = [
                listen(layerGroup, ObjectEventType.PROPERTYCHANGE, this.render, this),
                listen(layerGroup, EventType.CHANGE, this.render, this),
            ];
        }
        this.render();
    };
    /**
     * @return {boolean} Is rendered.
     */
    PluggableMap.prototype.isRendered = function () {
        return !!this.frameState_;
    };
    /**
     * Requests an immediate render in a synchronous manner.
     * @api
     */
    PluggableMap.prototype.renderSync = function () {
        if (this.animationDelayKey_) {
            cancelAnimationFrame(this.animationDelayKey_);
        }
        this.animationDelay_();
    };
    /**
     * Redraws all text after new fonts have loaded
     */
    PluggableMap.prototype.redrawText = function () {
        var layerStates = this.getLayerGroup().getLayerStatesArray();
        for (var i = 0, ii = layerStates.length; i < ii; ++i) {
            var layer = layerStates[i].layer;
            if (layer.hasRenderer()) {
                layer.getRenderer().handleFontsChanged();
            }
        }
    };
    /**
     * Request a map rendering (at the next animation frame).
     * @api
     */
    PluggableMap.prototype.render = function () {
        if (this.renderer_ && this.animationDelayKey_ === undefined) {
            this.animationDelayKey_ = requestAnimationFrame(this.animationDelay_);
        }
    };
    /**
     * Remove the given control from the map.
     * @param {import("./control/Control.js").default} control Control.
     * @return {import("./control/Control.js").default|undefined} The removed control (or undefined
     *     if the control was not found).
     * @api
     */
    PluggableMap.prototype.removeControl = function (control) {
        return this.getControls().remove(control);
    };
    /**
     * Remove the given interaction from the map.
     * @param {import("./interaction/Interaction.js").default} interaction Interaction to remove.
     * @return {import("./interaction/Interaction.js").default|undefined} The removed interaction (or
     *     undefined if the interaction was not found).
     * @api
     */
    PluggableMap.prototype.removeInteraction = function (interaction) {
        return this.getInteractions().remove(interaction);
    };
    /**
     * Removes the given layer from the map.
     * @param {import("./layer/Base.js").default} layer Layer.
     * @return {import("./layer/Base.js").default|undefined} The removed layer (or undefined if the
     *     layer was not found).
     * @api
     */
    PluggableMap.prototype.removeLayer = function (layer) {
        var layers = this.getLayerGroup().getLayers();
        return layers.remove(layer);
    };
    /**
     * Remove the given overlay from the map.
     * @param {import("./Overlay.js").default} overlay Overlay.
     * @return {import("./Overlay.js").default|undefined} The removed overlay (or undefined
     *     if the overlay was not found).
     * @api
     */
    PluggableMap.prototype.removeOverlay = function (overlay) {
        return this.getOverlays().remove(overlay);
    };
    /**
     * @param {number} time Time.
     * @private
     */
    PluggableMap.prototype.renderFrame_ = function (time) {
        var _this = this;
        var size = this.getSize();
        var view = this.getView();
        var previousFrameState = this.frameState_;
        /** @type {?FrameState} */
        var frameState = null;
        if (size !== undefined && hasArea(size) && view && view.isDef()) {
            var viewHints = view.getHints(this.frameState_ ? this.frameState_.viewHints : undefined);
            var viewState = view.getState();
            frameState = {
                animate: false,
                coordinateToPixelTransform: this.coordinateToPixelTransform_,
                declutterTree: null,
                extent: getForViewAndSize(viewState.center, viewState.resolution, viewState.rotation, size),
                index: this.frameIndex_++,
                layerIndex: 0,
                layerStatesArray: this.getLayerGroup().getLayerStatesArray(),
                pixelRatio: this.pixelRatio_,
                pixelToCoordinateTransform: this.pixelToCoordinateTransform_,
                postRenderFunctions: [],
                size: size,
                tileQueue: this.tileQueue_,
                time: time,
                usedTiles: {},
                viewState: viewState,
                viewHints: viewHints,
                wantedTiles: {},
            };
            if (viewState.nextCenter && viewState.nextResolution) {
                var rotation = isNaN(viewState.nextRotation)
                    ? viewState.rotation
                    : viewState.nextRotation;
                frameState.nextExtent = getForViewAndSize(viewState.nextCenter, viewState.nextResolution, rotation, size);
            }
        }
        this.frameState_ = frameState;
        this.renderer_.renderFrame(frameState);
        if (frameState) {
            if (frameState.animate) {
                this.render();
            }
            Array.prototype.push.apply(this.postRenderFunctions_, frameState.postRenderFunctions);
            if (previousFrameState) {
                var moveStart = !this.previousExtent_ ||
                    (!isEmpty(this.previousExtent_) &&
                        !equals$1(frameState.extent, this.previousExtent_));
                if (moveStart) {
                    this.dispatchEvent(new MapEvent(MapEventType.MOVESTART, this, previousFrameState));
                    this.previousExtent_ = createOrUpdateEmpty(this.previousExtent_);
                }
            }
            var idle = this.previousExtent_ &&
                !frameState.viewHints[ViewHint.ANIMATING] &&
                !frameState.viewHints[ViewHint.INTERACTING] &&
                !equals$1(frameState.extent, this.previousExtent_);
            if (idle) {
                this.dispatchEvent(new MapEvent(MapEventType.MOVEEND, this, frameState));
                clone(frameState.extent, this.previousExtent_);
            }
        }
        this.dispatchEvent(new MapEvent(MapEventType.POSTRENDER, this, frameState));
        if (!this.postRenderTimeoutHandle_) {
            this.postRenderTimeoutHandle_ = setTimeout(function () {
                _this.postRenderTimeoutHandle_ = undefined;
                _this.handlePostRender();
            }, 0);
        }
    };
    /**
     * Sets the layergroup of this map.
     * @param {LayerGroup} layerGroup A layer group containing the layers in this map.
     * @observable
     * @api
     */
    PluggableMap.prototype.setLayerGroup = function (layerGroup) {
        this.set(MapProperty.LAYERGROUP, layerGroup);
    };
    /**
     * Set the size of this map.
     * @param {import("./size.js").Size|undefined} size The size in pixels of the map in the DOM.
     * @observable
     * @api
     */
    PluggableMap.prototype.setSize = function (size) {
        this.set(MapProperty.SIZE, size);
    };
    /**
     * Set the target element to render this map into.
     * @param {HTMLElement|string} [target] The Element or id of the Element
     *     that the map is rendered in.
     * @observable
     * @api
     */
    PluggableMap.prototype.setTarget = function (target) {
        this.set(MapProperty.TARGET, target);
    };
    /**
     * Set the view for this map.
     * @param {View|Promise<import("./View.js").ViewOptions>} view The view that controls this map.
     * It is also possible to pass a promise that resolves to options for constructing a view.  This
     * alternative allows view properties to be resolved by sources or other components that load
     * view-related metadata.
     * @observable
     * @api
     */
    PluggableMap.prototype.setView = function (view) {
        if (!view || view instanceof View) {
            this.set(MapProperty.VIEW, view);
            return;
        }
        this.set(MapProperty.VIEW, new View());
        var map = this;
        view.then(function (viewOptions) {
            map.setView(new View(viewOptions));
        });
    };
    /**
     * Force a recalculation of the map viewport size.  This should be called when
     * third-party code changes the size of the map viewport.
     * @api
     */
    PluggableMap.prototype.updateSize = function () {
        var targetElement = this.getTargetElement();
        var size = undefined;
        if (targetElement) {
            var computedStyle = getComputedStyle(targetElement);
            var width = targetElement.offsetWidth -
                parseFloat(computedStyle['borderLeftWidth']) -
                parseFloat(computedStyle['paddingLeft']) -
                parseFloat(computedStyle['paddingRight']) -
                parseFloat(computedStyle['borderRightWidth']);
            var height = targetElement.offsetHeight -
                parseFloat(computedStyle['borderTopWidth']) -
                parseFloat(computedStyle['paddingTop']) -
                parseFloat(computedStyle['paddingBottom']) -
                parseFloat(computedStyle['borderBottomWidth']);
            if (!isNaN(width) && !isNaN(height)) {
                size = [width, height];
                if (!hasArea(size) &&
                    !!(targetElement.offsetWidth ||
                        targetElement.offsetHeight ||
                        targetElement.getClientRects().length)) {
                    // eslint-disable-next-line
                    console.warn("No map visible because the map container's width or height are 0.");
                }
            }
        }
        this.setSize(size);
        this.updateViewportSize_();
    };
    /**
     * Recomputes the viewport size and save it on the view object (if any)
     * @private
     */
    PluggableMap.prototype.updateViewportSize_ = function () {
        var view = this.getView();
        if (view) {
            var size = undefined;
            var computedStyle = getComputedStyle(this.viewport_);
            if (computedStyle.width && computedStyle.height) {
                size = [
                    parseInt(computedStyle.width, 10),
                    parseInt(computedStyle.height, 10),
                ];
            }
            view.setViewportSize(size);
        }
    };
    return PluggableMap;
}(BaseObject));
/**
 * @param {MapOptions} options Map options.
 * @return {MapOptionsInternal} Internal map options.
 */
function createOptionsInternal(options) {
    /**
     * @type {HTMLElement|Document}
     */
    var keyboardEventTarget = null;
    if (options.keyboardEventTarget !== undefined) {
        keyboardEventTarget =
            typeof options.keyboardEventTarget === 'string'
                ? document.getElementById(options.keyboardEventTarget)
                : options.keyboardEventTarget;
    }
    /**
     * @type {Object<string, *>}
     */
    var values = {};
    var layerGroup = options.layers &&
        typeof ( /** @type {?} */(options.layers).getLayers) === 'function'
        ? /** @type {LayerGroup} */ (options.layers)
        : new LayerGroup({ layers: /** @type {Collection} */ (options.layers) });
    values[MapProperty.LAYERGROUP] = layerGroup;
    values[MapProperty.TARGET] = options.target;
    values[MapProperty.VIEW] =
        options.view instanceof View ? options.view : new View();
    var controls;
    if (options.controls !== undefined) {
        if (Array.isArray(options.controls)) {
            controls = new Collection(options.controls.slice());
        }
        else {
            assert(typeof ( /** @type {?} */(options.controls).getArray) === 'function', 47); // Expected `controls` to be an array or an `import("./Collection.js").Collection`
            controls = /** @type {Collection} */ (options.controls);
        }
    }
    var interactions;
    if (options.interactions !== undefined) {
        if (Array.isArray(options.interactions)) {
            interactions = new Collection(options.interactions.slice());
        }
        else {
            assert(typeof ( /** @type {?} */(options.interactions).getArray) ===
                'function', 48); // Expected `interactions` to be an array or an `import("./Collection.js").Collection`
            interactions = /** @type {Collection} */ (options.interactions);
        }
    }
    var overlays;
    if (options.overlays !== undefined) {
        if (Array.isArray(options.overlays)) {
            overlays = new Collection(options.overlays.slice());
        }
        else {
            assert(typeof ( /** @type {?} */(options.overlays).getArray) === 'function', 49); // Expected `overlays` to be an array or an `import("./Collection.js").Collection`
            overlays = options.overlays;
        }
    }
    else {
        overlays = new Collection();
    }
    return {
        controls: controls,
        interactions: interactions,
        keyboardEventTarget: keyboardEventTarget,
        overlays: overlays,
        values: values,
    };
}

var __extends$a = (undefined && undefined.__extends) || (function () {
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
 * @typedef {Object} Options
 * @property {HTMLElement} [element] The element is the control's
 * container element. This only needs to be specified if you're developing
 * a custom control.
 * @property {function(import("../MapEvent.js").default):void} [render] Function called when
 * the control should be re-rendered. This is called in a `requestAnimationFrame`
 * callback.
 * @property {HTMLElement|string} [target] Specify a target if you want
 * the control to be rendered outside of the map's viewport.
 */
/**
 * @classdesc
 * A control is a visible widget with a DOM element in a fixed position on the
 * screen. They can involve user input (buttons), or be informational only;
 * the position is determined using CSS. By default these are placed in the
 * container with CSS class name `ol-overlaycontainer-stopevent`, but can use
 * any outside DOM element.
 *
 * This is the base class for controls. You can use it for simple custom
 * controls by creating the element with listeners, creating an instance:
 * ```js
 * var myControl = new Control({element: myElement});
 * ```
 * and then adding this to the map.
 *
 * The main advantage of having this as a control rather than a simple separate
 * DOM element is that preventing propagation is handled for you. Controls
 * will also be objects in a {@link module:ol/Collection~Collection}, so you can use their methods.
 *
 * You can also extend this base for your own control class. See
 * examples/custom-controls for an example of how to do this.
 *
 * @api
 */
var Control = /** @class */ (function (_super) {
    __extends$a(Control, _super);
    /**
     * @param {Options} options Control options.
     */
    function Control(options) {
        var _this = _super.call(this) || this;
        var element = options.element;
        if (element && !options.target && !element.style.pointerEvents) {
            element.style.pointerEvents = 'auto';
        }
        /**
         * @protected
         * @type {HTMLElement}
         */
        _this.element = element ? element : null;
        /**
         * @private
         * @type {HTMLElement}
         */
        _this.target_ = null;
        /**
         * @private
         * @type {import("../PluggableMap.js").default}
         */
        _this.map_ = null;
        /**
         * @protected
         * @type {!Array<import("../events.js").EventsKey>}
         */
        _this.listenerKeys = [];
        if (options.render) {
            _this.render = options.render;
        }
        if (options.target) {
            _this.setTarget(options.target);
        }
        return _this;
    }
    /**
     * Clean up.
     */
    Control.prototype.disposeInternal = function () {
        removeNode(this.element);
        _super.prototype.disposeInternal.call(this);
    };
    /**
     * Get the map associated with this control.
     * @return {import("../PluggableMap.js").default|undefined} Map.
     * @api
     */
    Control.prototype.getMap = function () {
        return this.map_;
    };
    /**
     * Remove the control from its current map and attach it to the new map.
     * Subclasses may set up event handlers to get notified about changes to
     * the map here.
     * @param {import("../PluggableMap.js").default} [map] Map.
     * @api
     */
    Control.prototype.setMap = function (map) {
        if (this.map_) {
            removeNode(this.element);
        }
        for (var i = 0, ii = this.listenerKeys.length; i < ii; ++i) {
            unlistenByKey(this.listenerKeys[i]);
        }
        this.listenerKeys.length = 0;
        this.map_ = map;
        if (this.map_) {
            var target = this.target_
                ? this.target_
                : map.getOverlayContainerStopEvent();
            target.appendChild(this.element);
            if (this.render !== VOID) {
                this.listenerKeys.push(listen(map, MapEventType.POSTRENDER, this.render, this));
            }
            map.render();
        }
    };
    /**
     * Renders the control.
     * @param {import("../MapEvent.js").default} mapEvent Map event.
     * @api
     */
    Control.prototype.render = function (mapEvent) { };
    /**
     * This function is used to set a target element for the control. It has no
     * effect if it is called after the control has been added to the map (i.e.
     * after `setMap` is called on the control). If no `target` is set in the
     * options passed to the control constructor and if `setTarget` is not called
     * then the control is added to the map's overlay container.
     * @param {HTMLElement|string} target Target.
     * @api
     */
    Control.prototype.setTarget = function (target) {
        this.target_ =
            typeof target === 'string' ? document.getElementById(target) : target;
    };
    return Control;
}(BaseObject));

var __extends$b = (undefined && undefined.__extends) || (function () {
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
 * @typedef {Object} Options
 * @property {string} [className='ol-attribution'] CSS class name.
 * @property {HTMLElement|string} [target] Specify a target if you
 * want the control to be rendered outside of the map's
 * viewport.
 * @property {boolean} [collapsible] Specify if attributions can
 * be collapsed. If not specified, sources control this behavior with their
 * `attributionsCollapsible` setting.
 * @property {boolean} [collapsed=true] Specify if attributions should
 * be collapsed at startup.
 * @property {string} [tipLabel='Attributions'] Text label to use for the button tip.
 * @property {string|HTMLElement} [label='i'] Text label to use for the
 * collapsed attributions button.
 * Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {string} [expandClassName=className + '-expand'] CSS class name for the
 * collapsed attributions button.
 * @property {string|HTMLElement} [collapseLabel='›'] Text label to use
 * for the expanded attributions button.
 * Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {string} [collapseClassName=className + '-collapse'] CSS class name for the
 * expanded attributions button.
 * @property {function(import("../MapEvent.js").default):void} [render] Function called when
 * the control should be re-rendered. This is called in a `requestAnimationFrame`
 * callback.
 */
/**
 * @classdesc
 * Control to show all the attributions associated with the layer sources
 * in the map. This control is one of the default controls included in maps.
 * By default it will show in the bottom right portion of the map, but this can
 * be changed by using a css selector for `.ol-attribution`.
 *
 * @api
 */
var Attribution = /** @class */ (function (_super) {
    __extends$b(Attribution, _super);
    /**
     * @param {Options} [opt_options] Attribution options.
     */
    function Attribution(opt_options) {
        var _this = this;
        var options = opt_options ? opt_options : {};
        _this = _super.call(this, {
            element: document.createElement('div'),
            render: options.render,
            target: options.target,
        }) || this;
        /**
         * @private
         * @type {HTMLElement}
         */
        _this.ulElement_ = document.createElement('ul');
        /**
         * @private
         * @type {boolean}
         */
        _this.collapsed_ =
            options.collapsed !== undefined ? options.collapsed : true;
        /**
         * @private
         * @type {boolean}
         */
        _this.userCollapsed_ = _this.collapsed_;
        /**
         * @private
         * @type {boolean}
         */
        _this.overrideCollapsible_ = options.collapsible !== undefined;
        /**
         * @private
         * @type {boolean}
         */
        _this.collapsible_ =
            options.collapsible !== undefined ? options.collapsible : true;
        if (!_this.collapsible_) {
            _this.collapsed_ = false;
        }
        var className = options.className !== undefined ? options.className : 'ol-attribution';
        var tipLabel = options.tipLabel !== undefined ? options.tipLabel : 'Attributions';
        var expandClassName = options.expandClassName !== undefined
            ? options.expandClassName
            : className + '-expand';
        var collapseLabel = options.collapseLabel !== undefined ? options.collapseLabel : '\u203A';
        var collapseClassName = options.collapseClassName !== undefined
            ? options.collapseClassName
            : className + '-collpase';
        if (typeof collapseLabel === 'string') {
            /**
             * @private
             * @type {HTMLElement}
             */
            _this.collapseLabel_ = document.createElement('span');
            _this.collapseLabel_.textContent = collapseLabel;
            _this.collapseLabel_.className = collapseClassName;
        }
        else {
            _this.collapseLabel_ = collapseLabel;
        }
        var label = options.label !== undefined ? options.label : 'i';
        if (typeof label === 'string') {
            /**
             * @private
             * @type {HTMLElement}
             */
            _this.label_ = document.createElement('span');
            _this.label_.textContent = label;
            _this.label_.className = expandClassName;
        }
        else {
            _this.label_ = label;
        }
        var activeLabel = _this.collapsible_ && !_this.collapsed_ ? _this.collapseLabel_ : _this.label_;
        /**
         * @private
         * @type {HTMLElement}
         */
        _this.toggleButton_ = document.createElement('button');
        _this.toggleButton_.setAttribute('type', 'button');
        _this.toggleButton_.setAttribute('aria-expanded', String(!_this.collapsed_));
        _this.toggleButton_.title = tipLabel;
        _this.toggleButton_.appendChild(activeLabel);
        _this.toggleButton_.addEventListener(EventType.CLICK, _this.handleClick_.bind(_this), false);
        var cssClasses = className +
            ' ' +
            CLASS_UNSELECTABLE +
            ' ' +
            CLASS_CONTROL +
            (_this.collapsed_ && _this.collapsible_ ? ' ' + CLASS_COLLAPSED : '') +
            (_this.collapsible_ ? '' : ' ol-uncollapsible');
        var element = _this.element;
        element.className = cssClasses;
        element.appendChild(_this.toggleButton_);
        element.appendChild(_this.ulElement_);
        /**
         * A list of currently rendered resolutions.
         * @type {Array<string>}
         * @private
         */
        _this.renderedAttributions_ = [];
        /**
         * @private
         * @type {boolean}
         */
        _this.renderedVisible_ = true;
        return _this;
    }
    /**
     * Collect a list of visible attributions and set the collapsible state.
     * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
     * @return {Array<string>} Attributions.
     * @private
     */
    Attribution.prototype.collectSourceAttributions_ = function (frameState) {
        /**
         * Used to determine if an attribution already exists.
         * @type {!Object<string, boolean>}
         */
        var lookup = {};
        /**
         * A list of visible attributions.
         * @type {Array<string>}
         */
        var visibleAttributions = [];
        var collapsible = true;
        var layerStatesArray = frameState.layerStatesArray;
        for (var i = 0, ii = layerStatesArray.length; i < ii; ++i) {
            var layerState = layerStatesArray[i];
            if (!inView(layerState, frameState.viewState)) {
                continue;
            }
            var source = /** @type {import("../layer/Layer.js").default} */ (layerState.layer).getSource();
            if (!source) {
                continue;
            }
            var attributionGetter = source.getAttributions();
            if (!attributionGetter) {
                continue;
            }
            var attributions = attributionGetter(frameState);
            if (!attributions) {
                continue;
            }
            collapsible =
                collapsible && source.getAttributionsCollapsible() !== false;
            if (Array.isArray(attributions)) {
                for (var j = 0, jj = attributions.length; j < jj; ++j) {
                    if (!(attributions[j] in lookup)) {
                        visibleAttributions.push(attributions[j]);
                        lookup[attributions[j]] = true;
                    }
                }
            }
            else {
                if (!(attributions in lookup)) {
                    visibleAttributions.push(attributions);
                    lookup[attributions] = true;
                }
            }
        }
        if (!this.overrideCollapsible_) {
            this.setCollapsible(collapsible);
        }
        return visibleAttributions;
    };
    /**
     * @private
     * @param {?import("../PluggableMap.js").FrameState} frameState Frame state.
     */
    Attribution.prototype.updateElement_ = function (frameState) {
        if (!frameState) {
            if (this.renderedVisible_) {
                this.element.style.display = 'none';
                this.renderedVisible_ = false;
            }
            return;
        }
        var attributions = this.collectSourceAttributions_(frameState);
        var visible = attributions.length > 0;
        if (this.renderedVisible_ != visible) {
            this.element.style.display = visible ? '' : 'none';
            this.renderedVisible_ = visible;
        }
        if (equals$2(attributions, this.renderedAttributions_)) {
            return;
        }
        removeChildren(this.ulElement_);
        // append the attributions
        for (var i = 0, ii = attributions.length; i < ii; ++i) {
            var element = document.createElement('li');
            element.innerHTML = attributions[i];
            this.ulElement_.appendChild(element);
        }
        this.renderedAttributions_ = attributions;
    };
    /**
     * @param {MouseEvent} event The event to handle
     * @private
     */
    Attribution.prototype.handleClick_ = function (event) {
        event.preventDefault();
        this.handleToggle_();
        this.userCollapsed_ = this.collapsed_;
    };
    /**
     * @private
     */
    Attribution.prototype.handleToggle_ = function () {
        this.element.classList.toggle(CLASS_COLLAPSED);
        if (this.collapsed_) {
            replaceNode(this.collapseLabel_, this.label_);
        }
        else {
            replaceNode(this.label_, this.collapseLabel_);
        }
        this.collapsed_ = !this.collapsed_;
        this.toggleButton_.setAttribute('aria-expanded', String(!this.collapsed_));
    };
    /**
     * Return `true` if the attribution is collapsible, `false` otherwise.
     * @return {boolean} True if the widget is collapsible.
     * @api
     */
    Attribution.prototype.getCollapsible = function () {
        return this.collapsible_;
    };
    /**
     * Set whether the attribution should be collapsible.
     * @param {boolean} collapsible True if the widget is collapsible.
     * @api
     */
    Attribution.prototype.setCollapsible = function (collapsible) {
        if (this.collapsible_ === collapsible) {
            return;
        }
        this.collapsible_ = collapsible;
        this.element.classList.toggle('ol-uncollapsible');
        if (this.userCollapsed_) {
            this.handleToggle_();
        }
    };
    /**
     * Collapse or expand the attribution according to the passed parameter. Will
     * not do anything if the attribution isn't collapsible or if the current
     * collapsed state is already the one requested.
     * @param {boolean} collapsed True if the widget is collapsed.
     * @api
     */
    Attribution.prototype.setCollapsed = function (collapsed) {
        this.userCollapsed_ = collapsed;
        if (!this.collapsible_ || this.collapsed_ === collapsed) {
            return;
        }
        this.handleToggle_();
    };
    /**
     * Return `true` when the attribution is currently collapsed or `false`
     * otherwise.
     * @return {boolean} True if the widget is collapsed.
     * @api
     */
    Attribution.prototype.getCollapsed = function () {
        return this.collapsed_;
    };
    /**
     * Update the attribution element.
     * @param {import("../MapEvent.js").default} mapEvent Map event.
     * @override
     */
    Attribution.prototype.render = function (mapEvent) {
        this.updateElement_(mapEvent.frameState);
    };
    return Attribution;
}(Control));

var __extends$c = (undefined && undefined.__extends) || (function () {
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
 * @typedef {Object} Options
 * @property {string} [className='ol-rotate'] CSS class name.
 * @property {string|HTMLElement} [label='⇧'] Text label to use for the rotate button.
 * Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {string} [tipLabel='Reset rotation'] Text label to use for the rotate tip.
 * @property {string} [compassClassName='ol-compass'] CSS class name for the compass.
 * @property {number} [duration=250] Animation duration in milliseconds.
 * @property {boolean} [autoHide=true] Hide the control when rotation is 0.
 * @property {function(import("../MapEvent.js").default):void} [render] Function called when the control should
 * be re-rendered. This is called in a `requestAnimationFrame` callback.
 * @property {function():void} [resetNorth] Function called when the control is clicked.
 * This will override the default `resetNorth`.
 * @property {HTMLElement|string} [target] Specify a target if you want the control to be
 * rendered outside of the map's viewport.
 */
/**
 * @classdesc
 * A button control to reset rotation to 0.
 * To style this control use css selector `.ol-rotate`. A `.ol-hidden` css
 * selector is added to the button when the rotation is 0.
 *
 * @api
 */
var Rotate = /** @class */ (function (_super) {
    __extends$c(Rotate, _super);
    /**
     * @param {Options} [opt_options] Rotate options.
     */
    function Rotate(opt_options) {
        var _this = this;
        var options = opt_options ? opt_options : {};
        _this = _super.call(this, {
            element: document.createElement('div'),
            render: options.render,
            target: options.target,
        }) || this;
        var className = options.className !== undefined ? options.className : 'ol-rotate';
        var label = options.label !== undefined ? options.label : '\u21E7';
        var compassClassName = options.compassClassName !== undefined
            ? options.compassClassName
            : 'ol-compass';
        /**
         * @type {HTMLElement}
         * @private
         */
        _this.label_ = null;
        if (typeof label === 'string') {
            _this.label_ = document.createElement('span');
            _this.label_.className = compassClassName;
            _this.label_.textContent = label;
        }
        else {
            _this.label_ = label;
            _this.label_.classList.add(compassClassName);
        }
        var tipLabel = options.tipLabel ? options.tipLabel : 'Reset rotation';
        var button = document.createElement('button');
        button.className = className + '-reset';
        button.setAttribute('type', 'button');
        button.title = tipLabel;
        button.appendChild(_this.label_);
        button.addEventListener(EventType.CLICK, _this.handleClick_.bind(_this), false);
        var cssClasses = className + ' ' + CLASS_UNSELECTABLE + ' ' + CLASS_CONTROL;
        var element = _this.element;
        element.className = cssClasses;
        element.appendChild(button);
        _this.callResetNorth_ = options.resetNorth ? options.resetNorth : undefined;
        /**
         * @type {number}
         * @private
         */
        _this.duration_ = options.duration !== undefined ? options.duration : 250;
        /**
         * @type {boolean}
         * @private
         */
        _this.autoHide_ = options.autoHide !== undefined ? options.autoHide : true;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.rotation_ = undefined;
        if (_this.autoHide_) {
            _this.element.classList.add(CLASS_HIDDEN);
        }
        return _this;
    }
    /**
     * @param {MouseEvent} event The event to handle
     * @private
     */
    Rotate.prototype.handleClick_ = function (event) {
        event.preventDefault();
        if (this.callResetNorth_ !== undefined) {
            this.callResetNorth_();
        }
        else {
            this.resetNorth_();
        }
    };
    /**
     * @private
     */
    Rotate.prototype.resetNorth_ = function () {
        var map = this.getMap();
        var view = map.getView();
        if (!view) {
            // the map does not have a view, so we can't act
            // upon it
            return;
        }
        var rotation = view.getRotation();
        if (rotation !== undefined) {
            if (this.duration_ > 0 && rotation % (2 * Math.PI) !== 0) {
                view.animate({
                    rotation: 0,
                    duration: this.duration_,
                    easing: easeOut,
                });
            }
            else {
                view.setRotation(0);
            }
        }
    };
    /**
     * Update the rotate control element.
     * @param {import("../MapEvent.js").default} mapEvent Map event.
     * @override
     */
    Rotate.prototype.render = function (mapEvent) {
        var frameState = mapEvent.frameState;
        if (!frameState) {
            return;
        }
        var rotation = frameState.viewState.rotation;
        if (rotation != this.rotation_) {
            var transform = 'rotate(' + rotation + 'rad)';
            if (this.autoHide_) {
                var contains = this.element.classList.contains(CLASS_HIDDEN);
                if (!contains && rotation === 0) {
                    this.element.classList.add(CLASS_HIDDEN);
                }
                else if (contains && rotation !== 0) {
                    this.element.classList.remove(CLASS_HIDDEN);
                }
            }
            this.label_.style.transform = transform;
        }
        this.rotation_ = rotation;
    };
    return Rotate;
}(Control));

var __extends$d = (undefined && undefined.__extends) || (function () {
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
 * @typedef {Object} Options
 * @property {number} [duration=250] Animation duration in milliseconds.
 * @property {string} [className='ol-zoom'] CSS class name.
 * @property {string} [zoomInClassName=className + '-in'] CSS class name for the zoom-in button.
 * @property {string} [zoomOutClassName=className + '-out'] CSS class name for the zoom-out button.
 * @property {string|HTMLElement} [zoomInLabel='+'] Text label to use for the zoom-in
 * button. Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {string|HTMLElement} [zoomOutLabel='–'] Text label to use for the zoom-out button.
 * Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {string} [zoomInTipLabel='Zoom in'] Text label to use for the button tip.
 * @property {string} [zoomOutTipLabel='Zoom out'] Text label to use for the button tip.
 * @property {number} [delta=1] The zoom delta applied on each click.
 * @property {HTMLElement|string} [target] Specify a target if you want the control to be
 * rendered outside of the map's viewport.
 */
/**
 * @classdesc
 * A control with 2 buttons, one for zoom in and one for zoom out.
 * This control is one of the default controls of a map. To style this control
 * use css selectors `.ol-zoom-in` and `.ol-zoom-out`.
 *
 * @api
 */
var Zoom = /** @class */ (function (_super) {
    __extends$d(Zoom, _super);
    /**
     * @param {Options} [opt_options] Zoom options.
     */
    function Zoom(opt_options) {
        var _this = this;
        var options = opt_options ? opt_options : {};
        _this = _super.call(this, {
            element: document.createElement('div'),
            target: options.target,
        }) || this;
        var className = options.className !== undefined ? options.className : 'ol-zoom';
        var delta = options.delta !== undefined ? options.delta : 1;
        var zoomInClassName = options.zoomInClassName !== undefined
            ? options.zoomInClassName
            : className + '-in';
        var zoomOutClassName = options.zoomOutClassName !== undefined
            ? options.zoomOutClassName
            : className + '-out';
        var zoomInLabel = options.zoomInLabel !== undefined ? options.zoomInLabel : '+';
        var zoomOutLabel = options.zoomOutLabel !== undefined ? options.zoomOutLabel : '\u2013';
        var zoomInTipLabel = options.zoomInTipLabel !== undefined ? options.zoomInTipLabel : 'Zoom in';
        var zoomOutTipLabel = options.zoomOutTipLabel !== undefined
            ? options.zoomOutTipLabel
            : 'Zoom out';
        var inElement = document.createElement('button');
        inElement.className = zoomInClassName;
        inElement.setAttribute('type', 'button');
        inElement.title = zoomInTipLabel;
        inElement.appendChild(typeof zoomInLabel === 'string'
            ? document.createTextNode(zoomInLabel)
            : zoomInLabel);
        inElement.addEventListener(EventType.CLICK, _this.handleClick_.bind(_this, delta), false);
        var outElement = document.createElement('button');
        outElement.className = zoomOutClassName;
        outElement.setAttribute('type', 'button');
        outElement.title = zoomOutTipLabel;
        outElement.appendChild(typeof zoomOutLabel === 'string'
            ? document.createTextNode(zoomOutLabel)
            : zoomOutLabel);
        outElement.addEventListener(EventType.CLICK, _this.handleClick_.bind(_this, -delta), false);
        var cssClasses = className + ' ' + CLASS_UNSELECTABLE + ' ' + CLASS_CONTROL;
        var element = _this.element;
        element.className = cssClasses;
        element.appendChild(inElement);
        element.appendChild(outElement);
        /**
         * @type {number}
         * @private
         */
        _this.duration_ = options.duration !== undefined ? options.duration : 250;
        return _this;
    }
    /**
     * @param {number} delta Zoom delta.
     * @param {MouseEvent} event The event to handle
     * @private
     */
    Zoom.prototype.handleClick_ = function (delta, event) {
        event.preventDefault();
        this.zoomByDelta_(delta);
    };
    /**
     * @param {number} delta Zoom delta.
     * @private
     */
    Zoom.prototype.zoomByDelta_ = function (delta) {
        var map = this.getMap();
        var view = map.getView();
        if (!view) {
            // the map does not have a view, so we can't act
            // upon it
            return;
        }
        var currentZoom = view.getZoom();
        if (currentZoom !== undefined) {
            var newZoom = view.getConstrainedZoom(currentZoom + delta);
            if (this.duration_ > 0) {
                if (view.getAnimating()) {
                    view.cancelAnimations();
                }
                view.animate({
                    zoom: newZoom,
                    duration: this.duration_,
                    easing: easeOut,
                });
            }
            else {
                view.setZoom(newZoom);
            }
        }
    };
    return Zoom;
}(Control));

/**
 * @module ol/control
 */
/**
 * @typedef {Object} DefaultsOptions
 * @property {boolean} [attribution=true] Include
 * {@link module:ol/control/Attribution~Attribution}.
 * @property {import("./control/Attribution.js").Options} [attributionOptions]
 * Options for {@link module:ol/control/Attribution~Attribution}.
 * @property {boolean} [rotate=true] Include
 * {@link module:ol/control/Rotate~Rotate}.
 * @property {import("./control/Rotate.js").Options} [rotateOptions] Options
 * for {@link module:ol/control/Rotate~Rotate}.
 * @property {boolean} [zoom] Include {@link module:ol/control/Zoom~Zoom}.
 * @property {import("./control/Zoom.js").Options} [zoomOptions] Options for
 * {@link module:ol/control/Zoom~Zoom}.
 * @api
 */
/**
 * Set of controls included in maps by default. Unless configured otherwise,
 * this returns a collection containing an instance of each of the following
 * controls:
 * * {@link module:ol/control/Zoom~Zoom}
 * * {@link module:ol/control/Rotate~Rotate}
 * * {@link module:ol/control/Attribution~Attribution}
 *
 * @param {DefaultsOptions} [opt_options]
 * Defaults options.
 * @return {Collection<import("./control/Control.js").default>}
 * Controls.
 * @api
 */
function defaults(opt_options) {
    var options = opt_options ? opt_options : {};
    var controls = new Collection();
    var zoomControl = options.zoom !== undefined ? options.zoom : true;
    if (zoomControl) {
        controls.push(new Zoom(options.zoomOptions));
    }
    var rotateControl = options.rotate !== undefined ? options.rotate : true;
    if (rotateControl) {
        controls.push(new Rotate(options.rotateOptions));
    }
    var attributionControl = options.attribution !== undefined ? options.attribution : true;
    if (attributionControl) {
        controls.push(new Attribution(options.attributionOptions));
    }
    return controls;
}

var __extends$e = (undefined && undefined.__extends) || (function () {
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
 * @typedef {Object} Options
 * @property {number} [duration=250] Animation duration in milliseconds.
 * @property {number} [delta=1] The zoom delta applied on each double click.
 */
/**
 * @classdesc
 * Allows the user to zoom by double-clicking on the map.
 * @api
 */
var DoubleClickZoom = /** @class */ (function (_super) {
    __extends$e(DoubleClickZoom, _super);
    /**
     * @param {Options} [opt_options] Options.
     */
    function DoubleClickZoom(opt_options) {
        var _this = _super.call(this) || this;
        var options = opt_options ? opt_options : {};
        /**
         * @private
         * @type {number}
         */
        _this.delta_ = options.delta ? options.delta : 1;
        /**
         * @private
         * @type {number}
         */
        _this.duration_ = options.duration !== undefined ? options.duration : 250;
        return _this;
    }
    /**
     * Handles the {@link module:ol/MapBrowserEvent map browser event} (if it was a
     * doubleclick) and eventually zooms the map.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
     * @return {boolean} `false` to stop event propagation.
     */
    DoubleClickZoom.prototype.handleEvent = function (mapBrowserEvent) {
        var stopEvent = false;
        if (mapBrowserEvent.type == MapBrowserEventType.DBLCLICK) {
            var browserEvent = /** @type {MouseEvent} */ (mapBrowserEvent.originalEvent);
            var map = mapBrowserEvent.map;
            var anchor = mapBrowserEvent.coordinate;
            var delta = browserEvent.shiftKey ? -this.delta_ : this.delta_;
            var view = map.getView();
            zoomByDelta(view, delta, anchor, this.duration_);
            browserEvent.preventDefault();
            stopEvent = true;
        }
        return !stopEvent;
    };
    return DoubleClickZoom;
}(Interaction));

var __extends$f = (undefined && undefined.__extends) || (function () {
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
 * @typedef {Object} Options
 * @property {import("../events/condition.js").Condition} [condition] A function that takes an
 * {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * Default is {@link module:ol/events/condition.altShiftKeysOnly}.
 * @property {number} [duration=250] Animation duration in milliseconds.
 */
/**
 * @classdesc
 * Allows the user to rotate the map by clicking and dragging on the map,
 * normally combined with an {@link module:ol/events/condition} that limits
 * it to when the alt and shift keys are held down.
 *
 * This interaction is only supported for mouse devices.
 * @api
 */
var DragRotate = /** @class */ (function (_super) {
    __extends$f(DragRotate, _super);
    /**
     * @param {Options} [opt_options] Options.
     */
    function DragRotate(opt_options) {
        var _this = this;
        var options = opt_options ? opt_options : {};
        _this = _super.call(this, {
            stopDown: FALSE,
        }) || this;
        /**
         * @private
         * @type {import("../events/condition.js").Condition}
         */
        _this.condition_ = options.condition ? options.condition : altShiftKeysOnly;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.lastAngle_ = undefined;
        /**
         * @private
         * @type {number}
         */
        _this.duration_ = options.duration !== undefined ? options.duration : 250;
        return _this;
    }
    /**
     * Handle pointer drag events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     */
    DragRotate.prototype.handleDragEvent = function (mapBrowserEvent) {
        if (!mouseOnly(mapBrowserEvent)) {
            return;
        }
        var map = mapBrowserEvent.map;
        var view = map.getView();
        if (view.getConstraints().rotation === disable) {
            return;
        }
        var size = map.getSize();
        var offset = mapBrowserEvent.pixel;
        var theta = Math.atan2(size[1] / 2 - offset[1], offset[0] - size[0] / 2);
        if (this.lastAngle_ !== undefined) {
            var delta = theta - this.lastAngle_;
            view.adjustRotationInternal(-delta);
        }
        this.lastAngle_ = theta;
    };
    /**
     * Handle pointer up events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     * @return {boolean} If the event was consumed.
     */
    DragRotate.prototype.handleUpEvent = function (mapBrowserEvent) {
        if (!mouseOnly(mapBrowserEvent)) {
            return true;
        }
        var map = mapBrowserEvent.map;
        var view = map.getView();
        view.endInteraction(this.duration_);
        return false;
    };
    /**
     * Handle pointer down events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     * @return {boolean} If the event was consumed.
     */
    DragRotate.prototype.handleDownEvent = function (mapBrowserEvent) {
        if (!mouseOnly(mapBrowserEvent)) {
            return false;
        }
        if (mouseActionButton(mapBrowserEvent) &&
            this.condition_(mapBrowserEvent)) {
            var map = mapBrowserEvent.map;
            map.getView().beginInteraction();
            this.lastAngle_ = undefined;
            return true;
        }
        else {
            return false;
        }
    };
    return DragRotate;
}(PointerInteraction));

/**
 * @module ol/render/Box
 */
var __extends$g = (undefined && undefined.__extends) || (function () {
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
var RenderBox = /** @class */ (function (_super) {
    __extends$g(RenderBox, _super);
    /**
     * @param {string} className CSS class name.
     */
    function RenderBox(className) {
        var _this = _super.call(this) || this;
        /**
         * @type {import("../geom/Polygon.js").default}
         * @private
         */
        _this.geometry_ = null;
        /**
         * @type {HTMLDivElement}
         * @private
         */
        _this.element_ = document.createElement('div');
        _this.element_.style.position = 'absolute';
        _this.element_.style.pointerEvents = 'auto';
        _this.element_.className = 'ol-box ' + className;
        /**
         * @private
         * @type {import("../PluggableMap.js").default}
         */
        _this.map_ = null;
        /**
         * @private
         * @type {import("../pixel.js").Pixel}
         */
        _this.startPixel_ = null;
        /**
         * @private
         * @type {import("../pixel.js").Pixel}
         */
        _this.endPixel_ = null;
        return _this;
    }
    /**
     * Clean up.
     */
    RenderBox.prototype.disposeInternal = function () {
        this.setMap(null);
    };
    /**
     * @private
     */
    RenderBox.prototype.render_ = function () {
        var startPixel = this.startPixel_;
        var endPixel = this.endPixel_;
        var px = 'px';
        var style = this.element_.style;
        style.left = Math.min(startPixel[0], endPixel[0]) + px;
        style.top = Math.min(startPixel[1], endPixel[1]) + px;
        style.width = Math.abs(endPixel[0] - startPixel[0]) + px;
        style.height = Math.abs(endPixel[1] - startPixel[1]) + px;
    };
    /**
     * @param {import("../PluggableMap.js").default} map Map.
     */
    RenderBox.prototype.setMap = function (map) {
        if (this.map_) {
            this.map_.getOverlayContainer().removeChild(this.element_);
            var style = this.element_.style;
            style.left = 'inherit';
            style.top = 'inherit';
            style.width = 'inherit';
            style.height = 'inherit';
        }
        this.map_ = map;
        if (this.map_) {
            this.map_.getOverlayContainer().appendChild(this.element_);
        }
    };
    /**
     * @param {import("../pixel.js").Pixel} startPixel Start pixel.
     * @param {import("../pixel.js").Pixel} endPixel End pixel.
     */
    RenderBox.prototype.setPixels = function (startPixel, endPixel) {
        this.startPixel_ = startPixel;
        this.endPixel_ = endPixel;
        this.createOrUpdateGeometry();
        this.render_();
    };
    /**
     * Creates or updates the cached geometry.
     */
    RenderBox.prototype.createOrUpdateGeometry = function () {
        var startPixel = this.startPixel_;
        var endPixel = this.endPixel_;
        var pixels = [
            startPixel,
            [startPixel[0], endPixel[1]],
            endPixel,
            [endPixel[0], startPixel[1]],
        ];
        var coordinates = pixels.map(this.map_.getCoordinateFromPixelInternal, this.map_);
        // close the polygon
        coordinates[4] = coordinates[0].slice();
        if (!this.geometry_) {
            this.geometry_ = new Polygon([coordinates]);
        }
        else {
            this.geometry_.setCoordinates([coordinates]);
        }
    };
    /**
     * @return {import("../geom/Polygon.js").default} Geometry.
     */
    RenderBox.prototype.getGeometry = function () {
        return this.geometry_;
    };
    return RenderBox;
}(Disposable));

var __extends$h = (undefined && undefined.__extends) || (function () {
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
 * A function that takes a {@link module:ol/MapBrowserEvent} and two
 * {@link module:ol/pixel~Pixel}s and returns a `{boolean}`. If the condition is met,
 * true should be returned.
 * @typedef {function(this: ?, import("../MapBrowserEvent.js").default, import("../pixel.js").Pixel, import("../pixel.js").Pixel):boolean} EndCondition
 */
/**
 * @typedef {Object} Options
 * @property {string} [className='ol-dragbox'] CSS class name for styling the box.
 * @property {import("../events/condition.js").Condition} [condition] A function that takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * Default is {@link ol/events/condition~mouseActionButton}.
 * @property {number} [minArea=64] The minimum area of the box in pixel, this value is used by the default
 * `boxEndCondition` function.
 * @property {EndCondition} [boxEndCondition] A function that takes a {@link module:ol/MapBrowserEvent~MapBrowserEvent} and two
 * {@link module:ol/pixel~Pixel}s to indicate whether a `boxend` event should be fired.
 * Default is `true` if the area of the box is bigger than the `minArea` option.
 * @property {function(this:DragBox, import("../MapBrowserEvent.js").default):void} [onBoxEnd] Code to execute just
 * before `boxend` is fired.
 */
/**
 * @enum {string}
 */
var DragBoxEventType = {
    /**
     * Triggered upon drag box start.
     * @event DragBoxEvent#boxstart
     * @api
     */
    BOXSTART: 'boxstart',
    /**
     * Triggered on drag when box is active.
     * @event DragBoxEvent#boxdrag
     * @api
     */
    BOXDRAG: 'boxdrag',
    /**
     * Triggered upon drag box end.
     * @event DragBoxEvent#boxend
     * @api
     */
    BOXEND: 'boxend',
    /**
     * Triggered upon drag box canceled.
     * @event DragBoxEvent#boxcancel
     * @api
     */
    BOXCANCEL: 'boxcancel',
};
/**
 * @classdesc
 * Events emitted by {@link module:ol/interaction/DragBox~DragBox} instances are instances of
 * this type.
 */
var DragBoxEvent = /** @class */ (function (_super) {
    __extends$h(DragBoxEvent, _super);
    /**
     * @param {string} type The event type.
     * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Originating event.
     */
    function DragBoxEvent(type, coordinate, mapBrowserEvent) {
        var _this = _super.call(this, type) || this;
        /**
         * The coordinate of the drag event.
         * @const
         * @type {import("../coordinate.js").Coordinate}
         * @api
         */
        _this.coordinate = coordinate;
        /**
         * @const
         * @type {import("../MapBrowserEvent.js").default}
         * @api
         */
        _this.mapBrowserEvent = mapBrowserEvent;
        return _this;
    }
    return DragBoxEvent;
}(BaseEvent));
/***
 * @template Return
 * @typedef {import("../Observable").OnSignature<import("../Observable").EventTypes, import("../events/Event.js").default, Return> &
 *   import("../Observable").OnSignature<import("../ObjectEventType").Types|
 *     'change:active', import("../Object").ObjectEvent, Return> &
 *   import("../Observable").OnSignature<'boxcancel'|'boxdrag'|'boxend'|'boxstart', DragBoxEvent, Return> &
 *   import("../Observable").CombinedOnSignature<import("../Observable").EventTypes|import("../ObjectEventType").Types|
 *     'change:active'|'boxcancel'|'boxdrag'|'boxend', Return>} DragBoxOnSignature
 */
/**
 * @classdesc
 * Allows the user to draw a vector box by clicking and dragging on the map,
 * normally combined with an {@link module:ol/events/condition} that limits
 * it to when the shift or other key is held down. This is used, for example,
 * for zooming to a specific area of the map
 * (see {@link module:ol/interaction/DragZoom~DragZoom} and
 * {@link module:ol/interaction/DragRotateAndZoom}).
 *
 * @fires DragBoxEvent
 * @api
 */
var DragBox = /** @class */ (function (_super) {
    __extends$h(DragBox, _super);
    /**
     * @param {Options} [opt_options] Options.
     */
    function DragBox(opt_options) {
        var _this = _super.call(this) || this;
        /***
         * @type {DragBoxOnSignature<import("../events").EventsKey>}
         */
        _this.on;
        /***
         * @type {DragBoxOnSignature<import("../events").EventsKey>}
         */
        _this.once;
        /***
         * @type {DragBoxOnSignature<void>}
         */
        _this.un;
        var options = opt_options ? opt_options : {};
        /**
         * @type {import("../render/Box.js").default}
         * @private
         */
        _this.box_ = new RenderBox(options.className || 'ol-dragbox');
        /**
         * @type {number}
         * @private
         */
        _this.minArea_ = options.minArea !== undefined ? options.minArea : 64;
        if (options.onBoxEnd) {
            _this.onBoxEnd = options.onBoxEnd;
        }
        /**
         * @type {import("../pixel.js").Pixel}
         * @private
         */
        _this.startPixel_ = null;
        /**
         * @private
         * @type {import("../events/condition.js").Condition}
         */
        _this.condition_ = options.condition ? options.condition : mouseActionButton;
        /**
         * @private
         * @type {EndCondition}
         */
        _this.boxEndCondition_ = options.boxEndCondition
            ? options.boxEndCondition
            : _this.defaultBoxEndCondition;
        return _this;
    }
    /**
     * The default condition for determining whether the boxend event
     * should fire.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent The originating MapBrowserEvent
     *     leading to the box end.
     * @param {import("../pixel.js").Pixel} startPixel The starting pixel of the box.
     * @param {import("../pixel.js").Pixel} endPixel The end pixel of the box.
     * @return {boolean} Whether or not the boxend condition should be fired.
     */
    DragBox.prototype.defaultBoxEndCondition = function (mapBrowserEvent, startPixel, endPixel) {
        var width = endPixel[0] - startPixel[0];
        var height = endPixel[1] - startPixel[1];
        return width * width + height * height >= this.minArea_;
    };
    /**
     * Returns geometry of last drawn box.
     * @return {import("../geom/Polygon.js").default} Geometry.
     * @api
     */
    DragBox.prototype.getGeometry = function () {
        return this.box_.getGeometry();
    };
    /**
     * Handle pointer drag events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     */
    DragBox.prototype.handleDragEvent = function (mapBrowserEvent) {
        this.box_.setPixels(this.startPixel_, mapBrowserEvent.pixel);
        this.dispatchEvent(new DragBoxEvent(DragBoxEventType.BOXDRAG, mapBrowserEvent.coordinate, mapBrowserEvent));
    };
    /**
     * Handle pointer up events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     * @return {boolean} If the event was consumed.
     */
    DragBox.prototype.handleUpEvent = function (mapBrowserEvent) {
        this.box_.setMap(null);
        var completeBox = this.boxEndCondition_(mapBrowserEvent, this.startPixel_, mapBrowserEvent.pixel);
        if (completeBox) {
            this.onBoxEnd(mapBrowserEvent);
        }
        this.dispatchEvent(new DragBoxEvent(completeBox ? DragBoxEventType.BOXEND : DragBoxEventType.BOXCANCEL, mapBrowserEvent.coordinate, mapBrowserEvent));
        return false;
    };
    /**
     * Handle pointer down events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     * @return {boolean} If the event was consumed.
     */
    DragBox.prototype.handleDownEvent = function (mapBrowserEvent) {
        if (this.condition_(mapBrowserEvent)) {
            this.startPixel_ = mapBrowserEvent.pixel;
            this.box_.setMap(mapBrowserEvent.map);
            this.box_.setPixels(this.startPixel_, this.startPixel_);
            this.dispatchEvent(new DragBoxEvent(DragBoxEventType.BOXSTART, mapBrowserEvent.coordinate, mapBrowserEvent));
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Function to execute just before `onboxend` is fired
     * @param {import("../MapBrowserEvent.js").default} event Event.
     */
    DragBox.prototype.onBoxEnd = function (event) { };
    return DragBox;
}(PointerInteraction));

var __extends$i = (undefined && undefined.__extends) || (function () {
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
 * @typedef {Object} Options
 * @property {string} [className='ol-dragzoom'] CSS class name for styling the
 * box.
 * @property {import("../events/condition.js").Condition} [condition] A function that
 * takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled.
 * Default is {@link module:ol/events/condition.shiftKeyOnly}.
 * @property {number} [duration=200] Animation duration in milliseconds.
 * @property {boolean} [out=false] Use interaction for zooming out.
 * @property {number} [minArea=64] The minimum area of the box in pixel, this value is used by the parent default
 * `boxEndCondition` function.
 */
/**
 * @classdesc
 * Allows the user to zoom the map by clicking and dragging on the map,
 * normally combined with an {@link module:ol/events/condition} that limits
 * it to when a key, shift by default, is held down.
 *
 * To change the style of the box, use CSS and the `.ol-dragzoom` selector, or
 * your custom one configured with `className`.
 * @api
 */
var DragZoom = /** @class */ (function (_super) {
    __extends$i(DragZoom, _super);
    /**
     * @param {Options} [opt_options] Options.
     */
    function DragZoom(opt_options) {
        var _this = this;
        var options = opt_options ? opt_options : {};
        var condition = options.condition ? options.condition : shiftKeyOnly;
        _this = _super.call(this, {
            condition: condition,
            className: options.className || 'ol-dragzoom',
            minArea: options.minArea,
        }) || this;
        /**
         * @private
         * @type {number}
         */
        _this.duration_ = options.duration !== undefined ? options.duration : 200;
        /**
         * @private
         * @type {boolean}
         */
        _this.out_ = options.out !== undefined ? options.out : false;
        return _this;
    }
    /**
     * Function to execute just before `onboxend` is fired
     * @param {import("../MapBrowserEvent.js").default} event Event.
     */
    DragZoom.prototype.onBoxEnd = function (event) {
        var map = this.getMap();
        var view = /** @type {!import("../View.js").default} */ (map.getView());
        var geometry = this.getGeometry();
        if (this.out_) {
            var rotatedExtent = view.rotatedExtentForGeometry(geometry);
            var resolution = view.getResolutionForExtentInternal(rotatedExtent);
            var factor = view.getResolution() / resolution;
            geometry = geometry.clone();
            geometry.scale(factor * factor);
        }
        view.fitInternal(geometry, {
            duration: this.duration_,
            easing: easeOut,
        });
    };
    return DragZoom;
}(DragBox));

/**
 * @module ol/events/KeyCode
 */
/**
 * @enum {number}
 * @const
 */
var KeyCode = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
};

var __extends$j = (undefined && undefined.__extends) || (function () {
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
 * @typedef {Object} Options
 * @property {import("../events/condition.js").Condition} [condition] A function that
 * takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled. Default is
 * {@link module:ol/events/condition.noModifierKeys} and
 * {@link module:ol/events/condition.targetNotEditable}.
 * @property {number} [duration=100] Animation duration in milliseconds.
 * @property {number} [pixelDelta=128] The amount of pixels to pan on each key
 * press.
 */
/**
 * @classdesc
 * Allows the user to pan the map using keyboard arrows.
 * Note that, although this interaction is by default included in maps,
 * the keys can only be used when browser focus is on the element to which
 * the keyboard events are attached. By default, this is the map div,
 * though you can change this with the `keyboardEventTarget` in
 * {@link module:ol/Map~Map}. `document` never loses focus but, for any other
 * element, focus will have to be on, and returned to, this element if the keys
 * are to function.
 * See also {@link module:ol/interaction/KeyboardZoom~KeyboardZoom}.
 * @api
 */
var KeyboardPan = /** @class */ (function (_super) {
    __extends$j(KeyboardPan, _super);
    /**
     * @param {Options} [opt_options] Options.
     */
    function KeyboardPan(opt_options) {
        var _this = _super.call(this) || this;
        var options = opt_options || {};
        /**
         * @private
         * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Browser event.
         * @return {boolean} Combined condition result.
         */
        _this.defaultCondition_ = function (mapBrowserEvent) {
            return (noModifierKeys(mapBrowserEvent) && targetNotEditable(mapBrowserEvent));
        };
        /**
         * @private
         * @type {import("../events/condition.js").Condition}
         */
        _this.condition_ =
            options.condition !== undefined
                ? options.condition
                : _this.defaultCondition_;
        /**
         * @private
         * @type {number}
         */
        _this.duration_ = options.duration !== undefined ? options.duration : 100;
        /**
         * @private
         * @type {number}
         */
        _this.pixelDelta_ =
            options.pixelDelta !== undefined ? options.pixelDelta : 128;
        return _this;
    }
    /**
     * Handles the {@link module:ol/MapBrowserEvent map browser event} if it was a
     * `KeyEvent`, and decides the direction to pan to (if an arrow key was
     * pressed).
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
     * @return {boolean} `false` to stop event propagation.
     * @this {KeyboardPan}
     */
    KeyboardPan.prototype.handleEvent = function (mapBrowserEvent) {
        var stopEvent = false;
        if (mapBrowserEvent.type == EventType.KEYDOWN) {
            var keyEvent = /** @type {KeyboardEvent} */ (mapBrowserEvent.originalEvent);
            var keyCode = keyEvent.keyCode;
            if (this.condition_(mapBrowserEvent) &&
                (keyCode == KeyCode.DOWN ||
                    keyCode == KeyCode.LEFT ||
                    keyCode == KeyCode.RIGHT ||
                    keyCode == KeyCode.UP)) {
                var map = mapBrowserEvent.map;
                var view = map.getView();
                var mapUnitsDelta = view.getResolution() * this.pixelDelta_;
                var deltaX = 0, deltaY = 0;
                if (keyCode == KeyCode.DOWN) {
                    deltaY = -mapUnitsDelta;
                }
                else if (keyCode == KeyCode.LEFT) {
                    deltaX = -mapUnitsDelta;
                }
                else if (keyCode == KeyCode.RIGHT) {
                    deltaX = mapUnitsDelta;
                }
                else {
                    deltaY = mapUnitsDelta;
                }
                var delta = [deltaX, deltaY];
                rotate(delta, view.getRotation());
                pan(view, delta, this.duration_);
                keyEvent.preventDefault();
                stopEvent = true;
            }
        }
        return !stopEvent;
    };
    return KeyboardPan;
}(Interaction));

var __extends$k = (undefined && undefined.__extends) || (function () {
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
 * @typedef {Object} Options
 * @property {number} [duration=100] Animation duration in milliseconds.
 * @property {import("../events/condition.js").Condition} [condition] A function that
 * takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled. Default is
 * {@link module:ol/events/condition.targetNotEditable}.
 * @property {number} [delta=1] The zoom level delta on each key press.
 */
/**
 * @classdesc
 * Allows the user to zoom the map using keyboard + and -.
 * Note that, although this interaction is by default included in maps,
 * the keys can only be used when browser focus is on the element to which
 * the keyboard events are attached. By default, this is the map div,
 * though you can change this with the `keyboardEventTarget` in
 * {@link module:ol/Map~Map}. `document` never loses focus but, for any other
 * element, focus will have to be on, and returned to, this element if the keys
 * are to function.
 * See also {@link module:ol/interaction/KeyboardPan~KeyboardPan}.
 * @api
 */
var KeyboardZoom = /** @class */ (function (_super) {
    __extends$k(KeyboardZoom, _super);
    /**
     * @param {Options} [opt_options] Options.
     */
    function KeyboardZoom(opt_options) {
        var _this = _super.call(this) || this;
        var options = opt_options ? opt_options : {};
        /**
         * @private
         * @type {import("../events/condition.js").Condition}
         */
        _this.condition_ = options.condition ? options.condition : targetNotEditable;
        /**
         * @private
         * @type {number}
         */
        _this.delta_ = options.delta ? options.delta : 1;
        /**
         * @private
         * @type {number}
         */
        _this.duration_ = options.duration !== undefined ? options.duration : 100;
        return _this;
    }
    /**
     * Handles the {@link module:ol/MapBrowserEvent map browser event} if it was a
     * `KeyEvent`, and decides whether to zoom in or out (depending on whether the
     * key pressed was '+' or '-').
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
     * @return {boolean} `false` to stop event propagation.
     * @this {KeyboardZoom}
     */
    KeyboardZoom.prototype.handleEvent = function (mapBrowserEvent) {
        var stopEvent = false;
        if (mapBrowserEvent.type == EventType.KEYDOWN ||
            mapBrowserEvent.type == EventType.KEYPRESS) {
            var keyEvent = /** @type {KeyboardEvent} */ (mapBrowserEvent.originalEvent);
            var charCode = keyEvent.charCode;
            if (this.condition_(mapBrowserEvent) &&
                (charCode == '+'.charCodeAt(0) || charCode == '-'.charCodeAt(0))) {
                var map = mapBrowserEvent.map;
                var delta = charCode == '+'.charCodeAt(0) ? this.delta_ : -this.delta_;
                var view = map.getView();
                zoomByDelta(view, delta, undefined, this.duration_);
                keyEvent.preventDefault();
                stopEvent = true;
            }
        }
        return !stopEvent;
    };
    return KeyboardZoom;
}(Interaction));

var __extends$l = (undefined && undefined.__extends) || (function () {
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
 * @enum {string}
 */
var Mode = {
    TRACKPAD: 'trackpad',
    WHEEL: 'wheel',
};
/**
 * @typedef {Object} Options
 * @property {import("../events/condition.js").Condition} [condition] A function that
 * takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled. Default is
 * {@link module:ol/events/condition.always}.
 * @property {boolean} [onFocusOnly=false] When the map's target has a `tabindex` attribute set,
 * the interaction will only handle events when the map has the focus.
 * @property {number} [maxDelta=1] Maximum mouse wheel delta.
 * @property {number} [duration=250] Animation duration in milliseconds.
 * @property {number} [timeout=80] Mouse wheel timeout duration in milliseconds.
 * @property {boolean} [useAnchor=true] Enable zooming using the mouse's
 * location as the anchor. When set to `false`, zooming in and out will zoom to
 * the center of the screen instead of zooming on the mouse's location.
 * @property {boolean} [constrainResolution=false] If true, the mouse wheel zoom
 * event will always animate to the closest zoom level after an interaction;
 * false means intermediary zoom levels are allowed.
 */
/**
 * @classdesc
 * Allows the user to zoom the map by scrolling the mouse wheel.
 * @api
 */
var MouseWheelZoom = /** @class */ (function (_super) {
    __extends$l(MouseWheelZoom, _super);
    /**
     * @param {Options} [opt_options] Options.
     */
    function MouseWheelZoom(opt_options) {
        var _this = this;
        var options = opt_options ? opt_options : {};
        _this = _super.call(this, 
        /** @type {import("./Interaction.js").InteractionOptions} */ (options)) || this;
        /**
         * @private
         * @type {number}
         */
        _this.totalDelta_ = 0;
        /**
         * @private
         * @type {number}
         */
        _this.lastDelta_ = 0;
        /**
         * @private
         * @type {number}
         */
        _this.maxDelta_ = options.maxDelta !== undefined ? options.maxDelta : 1;
        /**
         * @private
         * @type {number}
         */
        _this.duration_ = options.duration !== undefined ? options.duration : 250;
        /**
         * @private
         * @type {number}
         */
        _this.timeout_ = options.timeout !== undefined ? options.timeout : 80;
        /**
         * @private
         * @type {boolean}
         */
        _this.useAnchor_ =
            options.useAnchor !== undefined ? options.useAnchor : true;
        /**
         * @private
         * @type {boolean}
         */
        _this.constrainResolution_ =
            options.constrainResolution !== undefined
                ? options.constrainResolution
                : false;
        var condition = options.condition ? options.condition : always;
        /**
         * @private
         * @type {import("../events/condition.js").Condition}
         */
        _this.condition_ = options.onFocusOnly
            ? all(focusWithTabindex, condition)
            : condition;
        /**
         * @private
         * @type {?import("../coordinate.js").Coordinate}
         */
        _this.lastAnchor_ = null;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.startTime_ = undefined;
        /**
         * @private
         * @type {?}
         */
        _this.timeoutId_;
        /**
         * @private
         * @type {Mode|undefined}
         */
        _this.mode_ = undefined;
        /**
         * Trackpad events separated by this delay will be considered separate
         * interactions.
         * @type {number}
         */
        _this.trackpadEventGap_ = 400;
        /**
         * @type {?}
         */
        _this.trackpadTimeoutId_;
        /**
         * The number of delta values per zoom level
         * @private
         * @type {number}
         */
        _this.deltaPerZoom_ = 300;
        return _this;
    }
    /**
     * @private
     */
    MouseWheelZoom.prototype.endInteraction_ = function () {
        this.trackpadTimeoutId_ = undefined;
        var view = this.getMap().getView();
        view.endInteraction(undefined, this.lastDelta_ ? (this.lastDelta_ > 0 ? 1 : -1) : 0, this.lastAnchor_);
    };
    /**
     * Handles the {@link module:ol/MapBrowserEvent map browser event} (if it was a mousewheel-event) and eventually
     * zooms the map.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
     * @return {boolean} `false` to stop event propagation.
     */
    MouseWheelZoom.prototype.handleEvent = function (mapBrowserEvent) {
        if (!this.condition_(mapBrowserEvent)) {
            return true;
        }
        var type = mapBrowserEvent.type;
        if (type !== EventType.WHEEL) {
            return true;
        }
        var map = mapBrowserEvent.map;
        var wheelEvent = /** @type {WheelEvent} */ (mapBrowserEvent.originalEvent);
        wheelEvent.preventDefault();
        if (this.useAnchor_) {
            this.lastAnchor_ = mapBrowserEvent.coordinate;
        }
        // Delta normalisation inspired by
        // https://github.com/mapbox/mapbox-gl-js/blob/001c7b9/js/ui/handler/scroll_zoom.js
        var delta;
        if (mapBrowserEvent.type == EventType.WHEEL) {
            delta = wheelEvent.deltaY;
            if (FIREFOX && wheelEvent.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
                delta /= DEVICE_PIXEL_RATIO;
            }
            if (wheelEvent.deltaMode === WheelEvent.DOM_DELTA_LINE) {
                delta *= 40;
            }
        }
        if (delta === 0) {
            return false;
        }
        else {
            this.lastDelta_ = delta;
        }
        var now = Date.now();
        if (this.startTime_ === undefined) {
            this.startTime_ = now;
        }
        if (!this.mode_ || now - this.startTime_ > this.trackpadEventGap_) {
            this.mode_ = Math.abs(delta) < 4 ? Mode.TRACKPAD : Mode.WHEEL;
        }
        var view = map.getView();
        if (this.mode_ === Mode.TRACKPAD &&
            !(view.getConstrainResolution() || this.constrainResolution_)) {
            if (this.trackpadTimeoutId_) {
                clearTimeout(this.trackpadTimeoutId_);
            }
            else {
                if (view.getAnimating()) {
                    view.cancelAnimations();
                }
                view.beginInteraction();
            }
            this.trackpadTimeoutId_ = setTimeout(this.endInteraction_.bind(this), this.timeout_);
            view.adjustZoom(-delta / this.deltaPerZoom_, this.lastAnchor_);
            this.startTime_ = now;
            return false;
        }
        this.totalDelta_ += delta;
        var timeLeft = Math.max(this.timeout_ - (now - this.startTime_), 0);
        clearTimeout(this.timeoutId_);
        this.timeoutId_ = setTimeout(this.handleWheelZoom_.bind(this, map), timeLeft);
        return false;
    };
    /**
     * @private
     * @param {import("../PluggableMap.js").default} map Map.
     */
    MouseWheelZoom.prototype.handleWheelZoom_ = function (map) {
        var view = map.getView();
        if (view.getAnimating()) {
            view.cancelAnimations();
        }
        var delta = -clamp(this.totalDelta_, -this.maxDelta_ * this.deltaPerZoom_, this.maxDelta_ * this.deltaPerZoom_) / this.deltaPerZoom_;
        if (view.getConstrainResolution() || this.constrainResolution_) {
            // view has a zoom constraint, zoom by 1
            delta = delta ? (delta > 0 ? 1 : -1) : 0;
        }
        zoomByDelta(view, delta, this.lastAnchor_, this.duration_);
        this.mode_ = undefined;
        this.totalDelta_ = 0;
        this.lastAnchor_ = null;
        this.startTime_ = undefined;
        this.timeoutId_ = undefined;
    };
    /**
     * Enable or disable using the mouse's location as an anchor when zooming
     * @param {boolean} useAnchor true to zoom to the mouse's location, false
     * to zoom to the center of the map
     * @api
     */
    MouseWheelZoom.prototype.setMouseAnchor = function (useAnchor) {
        this.useAnchor_ = useAnchor;
        if (!useAnchor) {
            this.lastAnchor_ = null;
        }
    };
    return MouseWheelZoom;
}(Interaction));

var __extends$m = (undefined && undefined.__extends) || (function () {
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
 * @typedef {Object} Options
 * @property {number} [duration=250] The duration of the animation in
 * milliseconds.
 * @property {number} [threshold=0.3] Minimal angle in radians to start a rotation.
 */
/**
 * @classdesc
 * Allows the user to rotate the map by twisting with two fingers
 * on a touch screen.
 * @api
 */
var PinchRotate = /** @class */ (function (_super) {
    __extends$m(PinchRotate, _super);
    /**
     * @param {Options} [opt_options] Options.
     */
    function PinchRotate(opt_options) {
        var _this = this;
        var options = opt_options ? opt_options : {};
        var pointerOptions = /** @type {import("./Pointer.js").Options} */ (options);
        if (!pointerOptions.stopDown) {
            pointerOptions.stopDown = FALSE;
        }
        _this = _super.call(this, pointerOptions) || this;
        /**
         * @private
         * @type {import("../coordinate.js").Coordinate}
         */
        _this.anchor_ = null;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.lastAngle_ = undefined;
        /**
         * @private
         * @type {boolean}
         */
        _this.rotating_ = false;
        /**
         * @private
         * @type {number}
         */
        _this.rotationDelta_ = 0.0;
        /**
         * @private
         * @type {number}
         */
        _this.threshold_ = options.threshold !== undefined ? options.threshold : 0.3;
        /**
         * @private
         * @type {number}
         */
        _this.duration_ = options.duration !== undefined ? options.duration : 250;
        return _this;
    }
    /**
     * Handle pointer drag events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     */
    PinchRotate.prototype.handleDragEvent = function (mapBrowserEvent) {
        var rotationDelta = 0.0;
        var touch0 = this.targetPointers[0];
        var touch1 = this.targetPointers[1];
        // angle between touches
        var angle = Math.atan2(touch1.clientY - touch0.clientY, touch1.clientX - touch0.clientX);
        if (this.lastAngle_ !== undefined) {
            var delta = angle - this.lastAngle_;
            this.rotationDelta_ += delta;
            if (!this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_) {
                this.rotating_ = true;
            }
            rotationDelta = delta;
        }
        this.lastAngle_ = angle;
        var map = mapBrowserEvent.map;
        var view = map.getView();
        if (view.getConstraints().rotation === disable) {
            return;
        }
        // rotate anchor point.
        // FIXME: should be the intersection point between the lines:
        //     touch0,touch1 and previousTouch0,previousTouch1
        var viewportPosition = map.getViewport().getBoundingClientRect();
        var centroid$1 = centroid(this.targetPointers);
        centroid$1[0] -= viewportPosition.left;
        centroid$1[1] -= viewportPosition.top;
        this.anchor_ = map.getCoordinateFromPixelInternal(centroid$1);
        // rotate
        if (this.rotating_) {
            map.render();
            view.adjustRotationInternal(rotationDelta, this.anchor_);
        }
    };
    /**
     * Handle pointer up events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     * @return {boolean} If the event was consumed.
     */
    PinchRotate.prototype.handleUpEvent = function (mapBrowserEvent) {
        if (this.targetPointers.length < 2) {
            var map = mapBrowserEvent.map;
            var view = map.getView();
            view.endInteraction(this.duration_);
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * Handle pointer down events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     * @return {boolean} If the event was consumed.
     */
    PinchRotate.prototype.handleDownEvent = function (mapBrowserEvent) {
        if (this.targetPointers.length >= 2) {
            var map = mapBrowserEvent.map;
            this.anchor_ = null;
            this.lastAngle_ = undefined;
            this.rotating_ = false;
            this.rotationDelta_ = 0.0;
            if (!this.handlingDownUpSequence) {
                map.getView().beginInteraction();
            }
            return true;
        }
        else {
            return false;
        }
    };
    return PinchRotate;
}(PointerInteraction));

var __extends$n = (undefined && undefined.__extends) || (function () {
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
 * @typedef {Object} Options
 * @property {number} [duration=400] Animation duration in milliseconds.
 */
/**
 * @classdesc
 * Allows the user to zoom the map by pinching with two fingers
 * on a touch screen.
 * @api
 */
var PinchZoom = /** @class */ (function (_super) {
    __extends$n(PinchZoom, _super);
    /**
     * @param {Options} [opt_options] Options.
     */
    function PinchZoom(opt_options) {
        var _this = this;
        var options = opt_options ? opt_options : {};
        var pointerOptions = /** @type {import("./Pointer.js").Options} */ (options);
        if (!pointerOptions.stopDown) {
            pointerOptions.stopDown = FALSE;
        }
        _this = _super.call(this, pointerOptions) || this;
        /**
         * @private
         * @type {import("../coordinate.js").Coordinate}
         */
        _this.anchor_ = null;
        /**
         * @private
         * @type {number}
         */
        _this.duration_ = options.duration !== undefined ? options.duration : 400;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.lastDistance_ = undefined;
        /**
         * @private
         * @type {number}
         */
        _this.lastScaleDelta_ = 1;
        return _this;
    }
    /**
     * Handle pointer drag events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     */
    PinchZoom.prototype.handleDragEvent = function (mapBrowserEvent) {
        var scaleDelta = 1.0;
        var touch0 = this.targetPointers[0];
        var touch1 = this.targetPointers[1];
        var dx = touch0.clientX - touch1.clientX;
        var dy = touch0.clientY - touch1.clientY;
        // distance between touches
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (this.lastDistance_ !== undefined) {
            scaleDelta = this.lastDistance_ / distance;
        }
        this.lastDistance_ = distance;
        var map = mapBrowserEvent.map;
        var view = map.getView();
        if (scaleDelta != 1.0) {
            this.lastScaleDelta_ = scaleDelta;
        }
        // scale anchor point.
        var viewportPosition = map.getViewport().getBoundingClientRect();
        var centroid$1 = centroid(this.targetPointers);
        centroid$1[0] -= viewportPosition.left;
        centroid$1[1] -= viewportPosition.top;
        this.anchor_ = map.getCoordinateFromPixelInternal(centroid$1);
        // scale, bypass the resolution constraint
        map.render();
        view.adjustResolutionInternal(scaleDelta, this.anchor_);
    };
    /**
     * Handle pointer up events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     * @return {boolean} If the event was consumed.
     */
    PinchZoom.prototype.handleUpEvent = function (mapBrowserEvent) {
        if (this.targetPointers.length < 2) {
            var map = mapBrowserEvent.map;
            var view = map.getView();
            var direction = this.lastScaleDelta_ > 1 ? 1 : -1;
            view.endInteraction(this.duration_, direction);
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * Handle pointer down events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     * @return {boolean} If the event was consumed.
     */
    PinchZoom.prototype.handleDownEvent = function (mapBrowserEvent) {
        if (this.targetPointers.length >= 2) {
            var map = mapBrowserEvent.map;
            this.anchor_ = null;
            this.lastDistance_ = undefined;
            this.lastScaleDelta_ = 1;
            if (!this.handlingDownUpSequence) {
                map.getView().beginInteraction();
            }
            return true;
        }
        else {
            return false;
        }
    };
    return PinchZoom;
}(PointerInteraction));

/**
 * @module ol/interaction
 */
/**
 * @typedef {Object} DefaultsOptions
 * @property {boolean} [altShiftDragRotate=true] Whether Alt-Shift-drag rotate is
 * desired.
 * @property {boolean} [onFocusOnly=false] Interact only when the map has the
 * focus. This affects the `MouseWheelZoom` and `DragPan` interactions and is
 * useful when page scroll is desired for maps that do not have the browser's
 * focus.
 * @property {boolean} [doubleClickZoom=true] Whether double click zoom is
 * desired.
 * @property {boolean} [keyboard=true] Whether keyboard interaction is desired.
 * @property {boolean} [mouseWheelZoom=true] Whether mousewheel zoom is desired.
 * @property {boolean} [shiftDragZoom=true] Whether Shift-drag zoom is desired.
 * @property {boolean} [dragPan=true] Whether drag pan is desired.
 * @property {boolean} [pinchRotate=true] Whether pinch rotate is desired.
 * @property {boolean} [pinchZoom=true] Whether pinch zoom is desired.
 * @property {number} [zoomDelta] Zoom level delta when using keyboard or double click zoom.
 * @property {number} [zoomDuration] Duration of the zoom animation in
 * milliseconds.
 */
/**
 * Set of interactions included in maps by default. Specific interactions can be
 * excluded by setting the appropriate option to false in the constructor
 * options, but the order of the interactions is fixed.  If you want to specify
 * a different order for interactions, you will need to create your own
 * {@link module:ol/interaction/Interaction} instances and insert
 * them into a {@link module:ol/Collection} in the order you want
 * before creating your {@link module:ol/Map~Map} instance. Changing the order can
 * be of interest if the event propagation needs to be stopped at a point.
 * The default set of interactions, in sequence, is:
 * * {@link module:ol/interaction/DragRotate~DragRotate}
 * * {@link module:ol/interaction/DoubleClickZoom~DoubleClickZoom}
 * * {@link module:ol/interaction/DragPan~DragPan}
 * * {@link module:ol/interaction/PinchRotate~PinchRotate}
 * * {@link module:ol/interaction/PinchZoom~PinchZoom}
 * * {@link module:ol/interaction/KeyboardPan~KeyboardPan}
 * * {@link module:ol/interaction/KeyboardZoom~KeyboardZoom}
 * * {@link module:ol/interaction/MouseWheelZoom~MouseWheelZoom}
 * * {@link module:ol/interaction/DragZoom~DragZoom}
 *
 * @param {DefaultsOptions} [opt_options] Defaults options.
 * @return {import("./Collection.js").default<import("./interaction/Interaction.js").default>}
 * A collection of interactions to be used with the {@link module:ol/Map~Map}
 * constructor's `interactions` option.
 * @api
 */
function defaults$1(opt_options) {
    var options = opt_options ? opt_options : {};
    var interactions = new Collection();
    var kinetic = new Kinetic(-0.005, 0.05, 100);
    var altShiftDragRotate = options.altShiftDragRotate !== undefined
        ? options.altShiftDragRotate
        : true;
    if (altShiftDragRotate) {
        interactions.push(new DragRotate());
    }
    var doubleClickZoom = options.doubleClickZoom !== undefined ? options.doubleClickZoom : true;
    if (doubleClickZoom) {
        interactions.push(new DoubleClickZoom({
            delta: options.zoomDelta,
            duration: options.zoomDuration,
        }));
    }
    var dragPan = options.dragPan !== undefined ? options.dragPan : true;
    if (dragPan) {
        interactions.push(new DragPan({
            onFocusOnly: options.onFocusOnly,
            kinetic: kinetic,
        }));
    }
    var pinchRotate = options.pinchRotate !== undefined ? options.pinchRotate : true;
    if (pinchRotate) {
        interactions.push(new PinchRotate());
    }
    var pinchZoom = options.pinchZoom !== undefined ? options.pinchZoom : true;
    if (pinchZoom) {
        interactions.push(new PinchZoom({
            duration: options.zoomDuration,
        }));
    }
    var keyboard = options.keyboard !== undefined ? options.keyboard : true;
    if (keyboard) {
        interactions.push(new KeyboardPan());
        interactions.push(new KeyboardZoom({
            delta: options.zoomDelta,
            duration: options.zoomDuration,
        }));
    }
    var mouseWheelZoom = options.mouseWheelZoom !== undefined ? options.mouseWheelZoom : true;
    if (mouseWheelZoom) {
        interactions.push(new MouseWheelZoom({
            onFocusOnly: options.onFocusOnly,
            duration: options.zoomDuration,
        }));
    }
    var shiftDragZoom = options.shiftDragZoom !== undefined ? options.shiftDragZoom : true;
    if (shiftDragZoom) {
        interactions.push(new DragZoom({
            duration: options.zoomDuration,
        }));
    }
    return interactions;
}

var __extends$o = (undefined && undefined.__extends) || (function () {
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
 * @classdesc
 * The map is the core component of OpenLayers. For a map to render, a view,
 * one or more layers, and a target container are needed:
 *
 *     import Map from 'ol/Map';
 *     import View from 'ol/View';
 *     import TileLayer from 'ol/layer/Tile';
 *     import OSM from 'ol/source/OSM';
 *
 *     var map = new Map({
 *       view: new View({
 *         center: [0, 0],
 *         zoom: 1
 *       }),
 *       layers: [
 *         new TileLayer({
 *           source: new OSM()
 *         })
 *       ],
 *       target: 'map'
 *     });
 *
 * The above snippet creates a map using a {@link module:ol/layer/Tile} to
 * display {@link module:ol/source/OSM~OSM} OSM data and render it to a DOM
 * element with the id `map`.
 *
 * The constructor places a viewport container (with CSS class name
 * `ol-viewport`) in the target element (see `getViewport()`), and then two
 * further elements within the viewport: one with CSS class name
 * `ol-overlaycontainer-stopevent` for controls and some overlays, and one with
 * CSS class name `ol-overlaycontainer` for other overlays (see the `stopEvent`
 * option of {@link module:ol/Overlay~Overlay} for the difference). The map
 * itself is placed in a further element within the viewport.
 *
 * Layers are stored as a {@link module:ol/Collection~Collection} in
 * layerGroups. A top-level group is provided by the library. This is what is
 * accessed by `getLayerGroup` and `setLayerGroup`. Layers entered in the
 * options are added to this group, and `addLayer` and `removeLayer` change the
 * layer collection in the group. `getLayers` is a convenience function for
 * `getLayerGroup().getLayers()`. Note that {@link module:ol/layer/Group~Group}
 * is a subclass of {@link module:ol/layer/Base}, so layers entered in the
 * options or added with `addLayer` can be groups, which can contain further
 * groups, and so on.
 *
 * @api
 */
var Map = /** @class */ (function (_super) {
    __extends$o(Map, _super);
    /**
     * @param {import("./PluggableMap.js").MapOptions} options Map options.
     */
    function Map(options) {
        var _this = this;
        options = assign({}, options);
        if (!options.controls) {
            options.controls = defaults();
        }
        if (!options.interactions) {
            options.interactions = defaults$1({
                onFocusOnly: true,
            });
        }
        _this = _super.call(this, options) || this;
        return _this;
    }
    Map.prototype.createRenderer = function () {
        return new CompositeMapRenderer(this);
    };
    return Map;
}(PluggableMap));

export { Feature, Map, View };
