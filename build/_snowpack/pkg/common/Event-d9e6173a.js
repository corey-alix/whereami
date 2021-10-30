import { c as assign, a as assert, b as abstract, B as BaseObject, u as unlistenByKey, l as listen, E as EventType, e as BaseEvent } from './asserts-e0c6c4d5.js';
import { c as clamp } from './math-b0fe2752.js';
import { S as SourceState } from './State-c7a16ea4.js';

/**
 * @module ol/render/EventType
 */
/**
 * @enum {string}
 */
var RenderEventType = {
    /**
     * Triggered before a layer is rendered.
     * @event module:ol/render/Event~RenderEvent#prerender
     * @api
     */
    PRERENDER: 'prerender',
    /**
     * Triggered after a layer is rendered.
     * @event module:ol/render/Event~RenderEvent#postrender
     * @api
     */
    POSTRENDER: 'postrender',
    /**
     * Triggered before layers are rendered.
     * The event object will not have a `context` set.
     * @event module:ol/render/Event~RenderEvent#precompose
     * @api
     */
    PRECOMPOSE: 'precompose',
    /**
     * Triggered after all layers are rendered.
     * The event object will not have a `context` set.
     * @event module:ol/render/Event~RenderEvent#postcompose
     * @api
     */
    POSTCOMPOSE: 'postcompose',
    /**
     * Triggered when rendering is complete, i.e. all sources and tiles have
     * finished loading for the current viewport, and all tiles are faded in.
     * The event object will not have a `context` set.
     * @event module:ol/render/Event~RenderEvent#rendercomplete
     * @api
     */
    RENDERCOMPLETE: 'rendercomplete',
};
/**
 * @typedef {'postrender'|'precompose'|'postcompose'|'rendercomplete'} MapRenderEventTypes
 */
/**
 * @typedef {'postrender'|'prerender'} LayerRenderEventTypes
 */

/**
 * @module ol/layer/Property
 */
/**
 * @enum {string}
 */
var LayerProperty = {
    OPACITY: 'opacity',
    VISIBLE: 'visible',
    EXTENT: 'extent',
    Z_INDEX: 'zIndex',
    MAX_RESOLUTION: 'maxResolution',
    MIN_RESOLUTION: 'minResolution',
    MAX_ZOOM: 'maxZoom',
    MIN_ZOOM: 'minZoom',
    SOURCE: 'source',
};

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
 * @typedef {import("../ObjectEventType").Types|'change:extent'|'change:maxResolution'|'change:maxZoom'|
 *    'change:minResolution'|'change:minZoom'|'change:opacity'|'change:visible'|'change:zIndex'} BaseLayerObjectEventTypes
 */
/***
 * @template Return
 * @typedef {import("../Observable").OnSignature<import("../Observable").EventTypes, import("../events/Event.js").default, Return> &
 *   import("../Observable").OnSignature<BaseLayerObjectEventTypes, import("../Object").ObjectEvent, Return> &
 *   import("../Observable").CombinedOnSignature<import("../Observable").EventTypes|BaseLayerObjectEventTypes, Return>} BaseLayerOnSignature
 */
/**
 * @typedef {Object} Options
 * @property {string} [className='ol-layer'] A CSS class name to set to the layer element.
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
 * @property {Object<string, *>} [properties] Arbitrary observable properties. Can be accessed with `#get()` and `#set()`.
 */
/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Note that with {@link module:ol/layer/Base} and all its subclasses, any property set in
 * the options is set as a {@link module:ol/Object} property on the layer object, so
 * is observable, and has get/set accessors.
 *
 * @api
 */
var BaseLayer = /** @class */ (function (_super) {
    __extends(BaseLayer, _super);
    /**
     * @param {Options} options Layer options.
     */
    function BaseLayer(options) {
        var _this = _super.call(this) || this;
        /***
         * @type {BaseLayerOnSignature<import("../events").EventsKey>}
         */
        _this.on;
        /***
         * @type {BaseLayerOnSignature<import("../events").EventsKey>}
         */
        _this.once;
        /***
         * @type {BaseLayerOnSignature<void>}
         */
        _this.un;
        /**
         * @type {Object<string, *>}
         */
        var properties = assign({}, options);
        if (typeof options.properties === 'object') {
            delete properties.properties;
            assign(properties, options.properties);
        }
        properties[LayerProperty.OPACITY] =
            options.opacity !== undefined ? options.opacity : 1;
        assert(typeof properties[LayerProperty.OPACITY] === 'number', 64); // Layer opacity must be a number
        properties[LayerProperty.VISIBLE] =
            options.visible !== undefined ? options.visible : true;
        properties[LayerProperty.Z_INDEX] = options.zIndex;
        properties[LayerProperty.MAX_RESOLUTION] =
            options.maxResolution !== undefined ? options.maxResolution : Infinity;
        properties[LayerProperty.MIN_RESOLUTION] =
            options.minResolution !== undefined ? options.minResolution : 0;
        properties[LayerProperty.MIN_ZOOM] =
            options.minZoom !== undefined ? options.minZoom : -Infinity;
        properties[LayerProperty.MAX_ZOOM] =
            options.maxZoom !== undefined ? options.maxZoom : Infinity;
        /**
         * @type {string}
         * @private
         */
        _this.className_ =
            properties.className !== undefined ? options.className : 'ol-layer';
        delete properties.className;
        _this.setProperties(properties);
        /**
         * @type {import("./Layer.js").State}
         * @private
         */
        _this.state_ = null;
        return _this;
    }
    /**
     * @return {string} CSS class name.
     */
    BaseLayer.prototype.getClassName = function () {
        return this.className_;
    };
    /**
     * This method is not meant to be called by layers or layer renderers because the state
     * is incorrect if the layer is included in a layer group.
     *
     * @param {boolean} [opt_managed] Layer is managed.
     * @return {import("./Layer.js").State} Layer state.
     */
    BaseLayer.prototype.getLayerState = function (opt_managed) {
        /** @type {import("./Layer.js").State} */
        var state = this.state_ ||
            /** @type {?} */ ({
                layer: this,
                managed: opt_managed === undefined ? true : opt_managed,
            });
        var zIndex = this.getZIndex();
        state.opacity = clamp(Math.round(this.getOpacity() * 100) / 100, 0, 1);
        state.sourceState = this.getSourceState();
        state.visible = this.getVisible();
        state.extent = this.getExtent();
        state.zIndex = zIndex === undefined && !state.managed ? Infinity : zIndex;
        state.maxResolution = this.getMaxResolution();
        state.minResolution = Math.max(this.getMinResolution(), 0);
        state.minZoom = this.getMinZoom();
        state.maxZoom = this.getMaxZoom();
        this.state_ = state;
        return state;
    };
    /**
     * @abstract
     * @param {Array<import("./Layer.js").default>} [opt_array] Array of layers (to be
     *     modified in place).
     * @return {Array<import("./Layer.js").default>} Array of layers.
     */
    BaseLayer.prototype.getLayersArray = function (opt_array) {
        return abstract();
    };
    /**
     * @abstract
     * @param {Array<import("./Layer.js").State>} [opt_states] Optional list of layer
     *     states (to be modified in place).
     * @return {Array<import("./Layer.js").State>} List of layer states.
     */
    BaseLayer.prototype.getLayerStatesArray = function (opt_states) {
        return abstract();
    };
    /**
     * Return the {@link module:ol/extent~Extent extent} of the layer or `undefined` if it
     * will be visible regardless of extent.
     * @return {import("../extent.js").Extent|undefined} The layer extent.
     * @observable
     * @api
     */
    BaseLayer.prototype.getExtent = function () {
        return /** @type {import("../extent.js").Extent|undefined} */ (this.get(LayerProperty.EXTENT));
    };
    /**
     * Return the maximum resolution of the layer.
     * @return {number} The maximum resolution of the layer.
     * @observable
     * @api
     */
    BaseLayer.prototype.getMaxResolution = function () {
        return /** @type {number} */ (this.get(LayerProperty.MAX_RESOLUTION));
    };
    /**
     * Return the minimum resolution of the layer.
     * @return {number} The minimum resolution of the layer.
     * @observable
     * @api
     */
    BaseLayer.prototype.getMinResolution = function () {
        return /** @type {number} */ (this.get(LayerProperty.MIN_RESOLUTION));
    };
    /**
     * Return the minimum zoom level of the layer.
     * @return {number} The minimum zoom level of the layer.
     * @observable
     * @api
     */
    BaseLayer.prototype.getMinZoom = function () {
        return /** @type {number} */ (this.get(LayerProperty.MIN_ZOOM));
    };
    /**
     * Return the maximum zoom level of the layer.
     * @return {number} The maximum zoom level of the layer.
     * @observable
     * @api
     */
    BaseLayer.prototype.getMaxZoom = function () {
        return /** @type {number} */ (this.get(LayerProperty.MAX_ZOOM));
    };
    /**
     * Return the opacity of the layer (between 0 and 1).
     * @return {number} The opacity of the layer.
     * @observable
     * @api
     */
    BaseLayer.prototype.getOpacity = function () {
        return /** @type {number} */ (this.get(LayerProperty.OPACITY));
    };
    /**
     * @abstract
     * @return {import("../source/State.js").default} Source state.
     */
    BaseLayer.prototype.getSourceState = function () {
        return abstract();
    };
    /**
     * Return the visibility of the layer (`true` or `false`).
     * @return {boolean} The visibility of the layer.
     * @observable
     * @api
     */
    BaseLayer.prototype.getVisible = function () {
        return /** @type {boolean} */ (this.get(LayerProperty.VISIBLE));
    };
    /**
     * Return the Z-index of the layer, which is used to order layers before
     * rendering. The default Z-index is 0.
     * @return {number} The Z-index of the layer.
     * @observable
     * @api
     */
    BaseLayer.prototype.getZIndex = function () {
        return /** @type {number} */ (this.get(LayerProperty.Z_INDEX));
    };
    /**
     * Set the extent at which the layer is visible.  If `undefined`, the layer
     * will be visible at all extents.
     * @param {import("../extent.js").Extent|undefined} extent The extent of the layer.
     * @observable
     * @api
     */
    BaseLayer.prototype.setExtent = function (extent) {
        this.set(LayerProperty.EXTENT, extent);
    };
    /**
     * Set the maximum resolution at which the layer is visible.
     * @param {number} maxResolution The maximum resolution of the layer.
     * @observable
     * @api
     */
    BaseLayer.prototype.setMaxResolution = function (maxResolution) {
        this.set(LayerProperty.MAX_RESOLUTION, maxResolution);
    };
    /**
     * Set the minimum resolution at which the layer is visible.
     * @param {number} minResolution The minimum resolution of the layer.
     * @observable
     * @api
     */
    BaseLayer.prototype.setMinResolution = function (minResolution) {
        this.set(LayerProperty.MIN_RESOLUTION, minResolution);
    };
    /**
     * Set the maximum zoom (exclusive) at which the layer is visible.
     * Note that the zoom levels for layer visibility are based on the
     * view zoom level, which may be different from a tile source zoom level.
     * @param {number} maxZoom The maximum zoom of the layer.
     * @observable
     * @api
     */
    BaseLayer.prototype.setMaxZoom = function (maxZoom) {
        this.set(LayerProperty.MAX_ZOOM, maxZoom);
    };
    /**
     * Set the minimum zoom (inclusive) at which the layer is visible.
     * Note that the zoom levels for layer visibility are based on the
     * view zoom level, which may be different from a tile source zoom level.
     * @param {number} minZoom The minimum zoom of the layer.
     * @observable
     * @api
     */
    BaseLayer.prototype.setMinZoom = function (minZoom) {
        this.set(LayerProperty.MIN_ZOOM, minZoom);
    };
    /**
     * Set the opacity of the layer, allowed values range from 0 to 1.
     * @param {number} opacity The opacity of the layer.
     * @observable
     * @api
     */
    BaseLayer.prototype.setOpacity = function (opacity) {
        assert(typeof opacity === 'number', 64); // Layer opacity must be a number
        this.set(LayerProperty.OPACITY, opacity);
    };
    /**
     * Set the visibility of the layer (`true` or `false`).
     * @param {boolean} visible The visibility of the layer.
     * @observable
     * @api
     */
    BaseLayer.prototype.setVisible = function (visible) {
        this.set(LayerProperty.VISIBLE, visible);
    };
    /**
     * Set Z-index of the layer, which is used to order layers before rendering.
     * The default Z-index is 0.
     * @param {number} zindex The z-index of the layer.
     * @observable
     * @api
     */
    BaseLayer.prototype.setZIndex = function (zindex) {
        this.set(LayerProperty.Z_INDEX, zindex);
    };
    /**
     * Clean up.
     */
    BaseLayer.prototype.disposeInternal = function () {
        if (this.state_) {
            this.state_.layer = null;
            this.state_ = null;
        }
        _super.prototype.disposeInternal.call(this);
    };
    return BaseLayer;
}(BaseObject));

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
 * @typedef {function(import("../PluggableMap.js").FrameState):HTMLElement} RenderFunction
 */
/***
 * @template Return
 * @typedef {import("../Observable").OnSignature<import("../Observable").EventTypes, import("../events/Event.js").default, Return> &
 *   import("../Observable").OnSignature<import("./Base").BaseLayerObjectEventTypes|
 *     'change:source', import("../Object").ObjectEvent, Return> &
 *   import("../Observable").OnSignature<import("../render/EventType").LayerRenderEventTypes, import("../render/Event").default, Return> &
 *   import("../Observable").CombinedOnSignature<import("../Observable").EventTypes|import("./Base").BaseLayerObjectEventTypes|'change:source'|
 *     import("../render/EventType").LayerRenderEventTypes, Return>} LayerOnSignature
 */
/**
 * @template {import("../source/Source.js").default} SourceType
 * @typedef {Object} Options
 * @property {string} [className='ol-layer'] A CSS class name to set to the layer element.
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
 * @property {SourceType} [source] Source for this layer.  If not provided to the constructor,
 * the source can be set by calling {@link module:ol/layer/Layer~Layer#setSource layer.setSource(source)} after
 * construction.
 * @property {import("../PluggableMap.js").default} [map] Map.
 * @property {RenderFunction} [render] Render function. Takes the frame state as input and is expected to return an
 * HTML element. Will overwrite the default rendering for the layer.
 * @property {Object<string, *>} [properties] Arbitrary observable properties. Can be accessed with `#get()` and `#set()`.
 */
/**
 * @typedef {Object} State
 * @property {import("./Layer.js").default} layer Layer.
 * @property {number} opacity Opacity, the value is rounded to two digits to appear after the decimal point.
 * @property {import("../source/State.js").default} sourceState SourceState.
 * @property {boolean} visible Visible.
 * @property {boolean} managed Managed.
 * @property {import("../extent.js").Extent} [extent] Extent.
 * @property {number} zIndex ZIndex.
 * @property {number} maxResolution Maximum resolution.
 * @property {number} minResolution Minimum resolution.
 * @property {number} minZoom Minimum zoom.
 * @property {number} maxZoom Maximum zoom.
 */
/**
 * @classdesc
 * Base class from which all layer types are derived. This should only be instantiated
 * in the case where a custom layer is be added to the map with a custom `render` function.
 * Such a function can be specified in the `options` object, and is expected to return an HTML element.
 *
 * A visual representation of raster or vector map data.
 * Layers group together those properties that pertain to how the data is to be
 * displayed, irrespective of the source of that data.
 *
 * Layers are usually added to a map with {@link import("../PluggableMap.js").default#addLayer map.addLayer()}. Components
 * like {@link module:ol/interaction/Draw~Draw} use unmanaged layers
 * internally. These unmanaged layers are associated with the map using
 * {@link module:ol/layer/Layer~Layer#setMap} instead.
 *
 * A generic `change` event is fired when the state of the source changes.
 *
 * Please note that for performance reasons several layers might get rendered to
 * the same HTML element, which will cause {@link import("../PluggableMap.js").default#forEachLayerAtPixel map.forEachLayerAtPixel()} to
 * give false positives. To avoid this, apply different `className` properties to the
 * layers at creation time.
 *
 * @fires import("../render/Event.js").RenderEvent#prerender
 * @fires import("../render/Event.js").RenderEvent#postrender
 *
 * @template {import("../source/Source.js").default} SourceType
 * @api
 */
var Layer = /** @class */ (function (_super) {
    __extends$1(Layer, _super);
    /**
     * @param {Options<SourceType>} options Layer options.
     */
    function Layer(options) {
        var _this = this;
        var baseOptions = assign({}, options);
        delete baseOptions.source;
        _this = _super.call(this, baseOptions) || this;
        /***
         * @type {LayerOnSignature<import("../events").EventsKey>}
         */
        _this.on;
        /***
         * @type {LayerOnSignature<import("../events").EventsKey>}
         */
        _this.once;
        /***
         * @type {LayerOnSignature<void>}
         */
        _this.un;
        /**
         * @private
         * @type {?import("../events.js").EventsKey}
         */
        _this.mapPrecomposeKey_ = null;
        /**
         * @private
         * @type {?import("../events.js").EventsKey}
         */
        _this.mapRenderKey_ = null;
        /**
         * @private
         * @type {?import("../events.js").EventsKey}
         */
        _this.sourceChangeKey_ = null;
        /**
         * @private
         * @type {import("../renderer/Layer.js").default}
         */
        _this.renderer_ = null;
        // Overwrite default render method with a custom one
        if (options.render) {
            _this.render = options.render;
        }
        if (options.map) {
            _this.setMap(options.map);
        }
        _this.addChangeListener(LayerProperty.SOURCE, _this.handleSourcePropertyChange_);
        var source = options.source
            ? /** @type {SourceType} */ (options.source)
            : null;
        _this.setSource(source);
        return _this;
    }
    /**
     * @param {Array<import("./Layer.js").default>} [opt_array] Array of layers (to be modified in place).
     * @return {Array<import("./Layer.js").default>} Array of layers.
     */
    Layer.prototype.getLayersArray = function (opt_array) {
        var array = opt_array ? opt_array : [];
        array.push(this);
        return array;
    };
    /**
     * @param {Array<import("./Layer.js").State>} [opt_states] Optional list of layer states (to be modified in place).
     * @return {Array<import("./Layer.js").State>} List of layer states.
     */
    Layer.prototype.getLayerStatesArray = function (opt_states) {
        var states = opt_states ? opt_states : [];
        states.push(this.getLayerState());
        return states;
    };
    /**
     * Get the layer source.
     * @return {SourceType} The layer source (or `null` if not yet set).
     * @observable
     * @api
     */
    Layer.prototype.getSource = function () {
        return /** @type {SourceType} */ (this.get(LayerProperty.SOURCE)) || null;
    };
    /**
     * @return {import("../source/State.js").default} Source state.
     */
    Layer.prototype.getSourceState = function () {
        var source = this.getSource();
        return !source ? SourceState.UNDEFINED : source.getState();
    };
    /**
     * @private
     */
    Layer.prototype.handleSourceChange_ = function () {
        this.changed();
    };
    /**
     * @private
     */
    Layer.prototype.handleSourcePropertyChange_ = function () {
        if (this.sourceChangeKey_) {
            unlistenByKey(this.sourceChangeKey_);
            this.sourceChangeKey_ = null;
        }
        var source = this.getSource();
        if (source) {
            this.sourceChangeKey_ = listen(source, EventType.CHANGE, this.handleSourceChange_, this);
        }
        this.changed();
    };
    /**
     * @param {import("../pixel").Pixel} pixel Pixel.
     * @return {Promise<Array<import("../Feature").default>>} Promise that resolves with
     * an array of features.
     */
    Layer.prototype.getFeatures = function (pixel) {
        if (!this.renderer_) {
            return new Promise(function (resolve) { return resolve([]); });
        }
        return this.renderer_.getFeatures(pixel);
    };
    /**
     * In charge to manage the rendering of the layer. One layer type is
     * bounded with one layer renderer.
     * @param {?import("../PluggableMap.js").FrameState} frameState Frame state.
     * @param {HTMLElement} target Target which the renderer may (but need not) use
     * for rendering its content.
     * @return {HTMLElement} The rendered element.
     */
    Layer.prototype.render = function (frameState, target) {
        var layerRenderer = this.getRenderer();
        if (layerRenderer.prepareFrame(frameState)) {
            return layerRenderer.renderFrame(frameState, target);
        }
    };
    /**
     * Sets the layer to be rendered on top of other layers on a map. The map will
     * not manage this layer in its layers collection, and the callback in
     * {@link module:ol/Map~Map#forEachLayerAtPixel} will receive `null` as layer. This
     * is useful for temporary layers. To remove an unmanaged layer from the map,
     * use `#setMap(null)`.
     *
     * To add the layer to a map and have it managed by the map, use
     * {@link module:ol/Map~Map#addLayer} instead.
     * @param {import("../PluggableMap.js").default} map Map.
     * @api
     */
    Layer.prototype.setMap = function (map) {
        if (this.mapPrecomposeKey_) {
            unlistenByKey(this.mapPrecomposeKey_);
            this.mapPrecomposeKey_ = null;
        }
        if (!map) {
            this.changed();
        }
        if (this.mapRenderKey_) {
            unlistenByKey(this.mapRenderKey_);
            this.mapRenderKey_ = null;
        }
        if (map) {
            this.mapPrecomposeKey_ = listen(map, RenderEventType.PRECOMPOSE, function (evt) {
                var renderEvent = 
                /** @type {import("../render/Event.js").default} */ (evt);
                var layerStatesArray = renderEvent.frameState.layerStatesArray;
                var layerState = this.getLayerState(false);
                // A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both.
                assert(!layerStatesArray.some(function (arrayLayerState) {
                    return arrayLayerState.layer === layerState.layer;
                }), 67);
                layerStatesArray.push(layerState);
            }, this);
            this.mapRenderKey_ = listen(this, EventType.CHANGE, map.render, map);
            this.changed();
        }
    };
    /**
     * Set the layer source.
     * @param {SourceType} source The layer source.
     * @observable
     * @api
     */
    Layer.prototype.setSource = function (source) {
        this.set(LayerProperty.SOURCE, source);
    };
    /**
     * Get the renderer for this layer.
     * @return {import("../renderer/Layer.js").default} The layer renderer.
     */
    Layer.prototype.getRenderer = function () {
        if (!this.renderer_) {
            this.renderer_ = this.createRenderer();
        }
        return this.renderer_;
    };
    /**
     * @return {boolean} The layer has a renderer.
     */
    Layer.prototype.hasRenderer = function () {
        return !!this.renderer_;
    };
    /**
     * Create a renderer for this layer.
     * @return {import("../renderer/Layer.js").default} A layer renderer.
     * @protected
     */
    Layer.prototype.createRenderer = function () {
        return null;
    };
    /**
     * Clean up.
     */
    Layer.prototype.disposeInternal = function () {
        if (this.renderer_) {
            this.renderer_.dispose();
            delete this.renderer_;
        }
        this.setSource(null);
        _super.prototype.disposeInternal.call(this);
    };
    return Layer;
}(BaseLayer));
/**
 * Return `true` if the layer is visible and if the provided view state
 * has resolution and zoom levels that are in range of the layer's min/max.
 * @param {State} layerState Layer state.
 * @param {import("../View.js").State} viewState View state.
 * @return {boolean} The layer is visible at the given view state.
 */
function inView(layerState, viewState) {
    if (!layerState.visible) {
        return false;
    }
    var resolution = viewState.resolution;
    if (resolution < layerState.minResolution ||
        resolution >= layerState.maxResolution) {
        return false;
    }
    var zoom = viewState.zoom;
    return zoom > layerState.minZoom && zoom <= layerState.maxZoom;
}

/**
 * @module ol/render/Event
 */
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
var RenderEvent = /** @class */ (function (_super) {
    __extends$2(RenderEvent, _super);
    /**
     * @param {import("./EventType.js").default} type Type.
     * @param {import("../transform.js").Transform} [opt_inversePixelTransform] Transform for
     *     CSS pixels to rendered pixels.
     * @param {import("../PluggableMap.js").FrameState} [opt_frameState] Frame state.
     * @param {?CanvasRenderingContext2D} [opt_context] Context.
     */
    function RenderEvent(type, opt_inversePixelTransform, opt_frameState, opt_context) {
        var _this = _super.call(this, type) || this;
        /**
         * Transform from CSS pixels (relative to the top-left corner of the map viewport)
         * to rendered pixels on this event's `context`. Only available when a Canvas renderer is used, null otherwise.
         * @type {import("../transform.js").Transform|undefined}
         * @api
         */
        _this.inversePixelTransform = opt_inversePixelTransform;
        /**
         * An object representing the current render frame state.
         * @type {import("../PluggableMap.js").FrameState|undefined}
         * @api
         */
        _this.frameState = opt_frameState;
        /**
         * Canvas context. Not available when the event is dispatched by the map. Only available
         * when a Canvas renderer is used, null otherwise.
         * @type {CanvasRenderingContext2D|null|undefined}
         * @api
         */
        _this.context = opt_context;
        return _this;
    }
    return RenderEvent;
}(BaseEvent));

export { BaseLayer as B, Layer as L, RenderEvent as R, RenderEventType as a, inView as i };
