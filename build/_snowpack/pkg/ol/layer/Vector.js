import { L as Layer } from '../../common/Event-d9e6173a.js';
import { R as RBush } from '../../common/index-ba7ecc3e.js';
import { c as assign, r as reverseSubArray, i as equals, g as getUid, n as numberSafeCompareFunction, p as isEmpty, E as EventType, f as Target, a as assert } from '../../common/asserts-e0c6c4d5.js';
import { c as createDefaultStyle, t as toFunction } from '../../common/Style-c90dfbec.js';
import { G as GeometryType, r as rotate, t as transform2D, b as transformGeom2D } from '../../common/SimpleGeometry-0ef1a82e.js';
import { y as containsCoordinate, z as coordinateRelationship, R as Relationship, h as clone, A as buffer, o as intersects, B as createOrUpdate, j as createEmpty, C as extendCoordinate, g as getWidth, p as containsExtent, D as wrapX$1 } from '../../common/extent-0b32e3b6.js';
import { a as asColorLike, I as ImageStyle } from '../../common/Circle-ccc6334f.js';
import { d as defaultFillStyle, b as defaultStrokeStyle, e as defaultLineCap, f as defaultLineDash, g as defaultLineDashOffset, h as defaultLineJoin, i as defaultLineWidth, j as defaultMiterLimit, k as defaultPadding, l as defaultTextAlign, m as defaultTextBaseline, n as defaultFont, r as registerFont, o as measureTextWidths, p as measureTextHeight, q as drawImageOrLabel, s as measureAndCacheTextWidth, a as asString, t as asArray } from '../../common/canvas-a6a02d53.js';
import { i as inflateCoordinates, a as inflateCoordinatesArray, b as inflateMultiCoordinatesArray, s as snap } from '../../common/inflate-f8e41fee.js';
import { C as CanvasLayerRenderer } from '../../common/Layer-6945e7d0.js';
import { W as WORKER_OFFSCREEN_CANVAS } from '../../common/has-ff434dd0.js';
import { a as create, c as compose, b as apply, s as setFromArray, d as makeScale, m as makeInverse, t as toString } from '../../common/transform-5be3cfb9.js';
import { l as lerp, c as clamp } from '../../common/math-b0fe2752.js';
import { d as createCanvasContext2D } from '../../common/dom-73d54564.js';
import { s as shared, V as ViewHint } from '../../common/IconImageCache-bf76e94a.js';
import { I as ImageState } from '../../common/ImageState-51477cac.js';
import { l as listenImage } from '../../common/Image-197a28fd.js';
import { d as cssOpacity } from '../../common/css-ccce5ae1.js';
import { a as fromUserExtent, b as toUserExtent } from '../../common/proj-8f373c44.js';
import { w as wrapX } from '../../common/coordinate-762b4bbd.js';
import '../../common/State-c7a16ea4.js';
import '../../common/Fill-b56e9031.js';
import '../../common/Stroke-d95c136e.js';
import '../../common/size-da54e3a0.js';

/**
 * @module ol/geom/flat/length
 */
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {number} Length.
 */
function lineStringLength(flatCoordinates, offset, end, stride) {
    var x1 = flatCoordinates[offset];
    var y1 = flatCoordinates[offset + 1];
    var length = 0;
    for (var i = offset + stride; i < end; i += stride) {
        var x2 = flatCoordinates[i];
        var y2 = flatCoordinates[i + 1];
        length += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        x1 = x2;
        y1 = y2;
    }
    return length;
}

/**
 * @module ol/style/TextPlacement
 */
/**
 * Text placement. One of `'point'`, `'line'`. Default is `'point'`. Note that
 * `'line'` requires the underlying geometry to be a {@link module:ol/geom/LineString~LineString},
 * {@link module:ol/geom/Polygon~Polygon}, {@link module:ol/geom/MultiLineString~MultiLineString} or
 * {@link module:ol/geom/MultiPolygon~MultiPolygon}.
 * @enum {string}
 */
var TextPlacement = {
    POINT: 'point',
    LINE: 'line',
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
 * @template {import("../source/Vector.js").default|import("../source/VectorTile.js").default} VectorSourceType
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
 * @property {import("../render.js").OrderFunction} [renderOrder] Render order. Function to be used when sorting
 * features before rendering. By default features are drawn in the order that they are created. Use
 * `null` to avoid the sort, but get an undefined draw order.
 * @property {number} [renderBuffer=100] The buffer in pixels around the viewport extent used by the
 * renderer when getting features from the vector source for the rendering or hit-detection.
 * Recommended value: the size of the largest symbol, line width or label.
 * @property {VectorSourceType} [source] Source.
 * @property {import("../PluggableMap.js").default} [map] Sets the layer as overlay on a map. The map will not manage
 * this layer in its layers collection, and the layer will be rendered on top. This is useful for
 * temporary layers. The standard way to add a layer to a map and have it managed by the map is to
 * use {@link import("../PluggableMap.js").default#addLayer map.addLayer()}.
 * @property {boolean} [declutter=false] Declutter images and text. Decluttering is applied to all
 * image and text styles of all Vector and VectorTile layers that have set this to `true`. The priority
 * is defined by the z-index of the layer, the `zIndex` of the style and the render order of features.
 * Higher z-index means higher priority. Within the same z-index, a feature rendered before another has
 * higher priority.
 * @property {import("../style/Style.js").StyleLike|null} [style] Layer style. When set to `null`, only
 * features that have their own style will be rendered. See {@link module:ol/style} for default style
 * which will be used if this is not set.
 * @property {boolean} [updateWhileAnimating=false] When set to `true`, feature batches will
 * be recreated during animations. This means that no vectors will be shown clipped, but the
 * setting will have a performance impact for large amounts of vector data. When set to `false`,
 * batches will be recreated when no animation is active.
 * @property {boolean} [updateWhileInteracting=false] When set to `true`, feature batches will
 * be recreated during interactions. See also `updateWhileAnimating`.
 * @property {Object<string, *>} [properties] Arbitrary observable properties. Can be accessed with `#get()` and `#set()`.
 */
/**
 * @enum {string}
 * @private
 */
var Property = {
    RENDER_ORDER: 'renderOrder',
};
/**
 * @classdesc
 * Vector data that is rendered client-side.
 * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
 * property on the layer object; for example, setting `title: 'My Title'` in the
 * options means that `title` is observable, and has get/set accessors.
 *
 * @template {import("../source/Vector.js").default|import("../source/VectorTile.js").default} VectorSourceType
 * @extends {Layer<VectorSourceType>}
 * @api
 */
var BaseVectorLayer = /** @class */ (function (_super) {
    __extends(BaseVectorLayer, _super);
    /**
     * @param {Options<VectorSourceType>} [opt_options] Options.
     */
    function BaseVectorLayer(opt_options) {
        var _this = this;
        var options = opt_options ? opt_options : {};
        var baseOptions = assign({}, options);
        delete baseOptions.style;
        delete baseOptions.renderBuffer;
        delete baseOptions.updateWhileAnimating;
        delete baseOptions.updateWhileInteracting;
        _this = _super.call(this, baseOptions) || this;
        /**
         * @private
         * @type {boolean}
         */
        _this.declutter_ =
            options.declutter !== undefined ? options.declutter : false;
        /**
         * @type {number}
         * @private
         */
        _this.renderBuffer_ =
            options.renderBuffer !== undefined ? options.renderBuffer : 100;
        /**
         * User provided style.
         * @type {import("../style/Style.js").StyleLike}
         * @private
         */
        _this.style_ = null;
        /**
         * Style function for use within the library.
         * @type {import("../style/Style.js").StyleFunction|undefined}
         * @private
         */
        _this.styleFunction_ = undefined;
        _this.setStyle(options.style);
        /**
         * @type {boolean}
         * @private
         */
        _this.updateWhileAnimating_ =
            options.updateWhileAnimating !== undefined
                ? options.updateWhileAnimating
                : false;
        /**
         * @type {boolean}
         * @private
         */
        _this.updateWhileInteracting_ =
            options.updateWhileInteracting !== undefined
                ? options.updateWhileInteracting
                : false;
        return _this;
    }
    /**
     * @return {boolean} Declutter.
     */
    BaseVectorLayer.prototype.getDeclutter = function () {
        return this.declutter_;
    };
    /**
     * Get the topmost feature that intersects the given pixel on the viewport. Returns a promise
     * that resolves with an array of features. The array will either contain the topmost feature
     * when a hit was detected, or it will be empty.
     *
     * The hit detection algorithm used for this method is optimized for performance, but is less
     * accurate than the one used in {@link import("../PluggableMap.js").default#getFeaturesAtPixel}: Text
     * is not considered, and icons are only represented by their bounding box instead of the exact
     * image.
     *
     * @param {import("../pixel.js").Pixel} pixel Pixel.
     * @return {Promise<Array<import("../Feature").default>>} Promise that resolves with an array of features.
     * @api
     */
    BaseVectorLayer.prototype.getFeatures = function (pixel) {
        return _super.prototype.getFeatures.call(this, pixel);
    };
    /**
     * @return {number|undefined} Render buffer.
     */
    BaseVectorLayer.prototype.getRenderBuffer = function () {
        return this.renderBuffer_;
    };
    /**
     * @return {function(import("../Feature.js").default, import("../Feature.js").default): number|null|undefined} Render
     *     order.
     */
    BaseVectorLayer.prototype.getRenderOrder = function () {
        return /** @type {import("../render.js").OrderFunction|null|undefined} */ (this.get(Property.RENDER_ORDER));
    };
    /**
     * Get the style for features.  This returns whatever was passed to the `style`
     * option at construction or to the `setStyle` method.
     * @return {import("../style/Style.js").StyleLike|null|undefined} Layer style.
     * @api
     */
    BaseVectorLayer.prototype.getStyle = function () {
        return this.style_;
    };
    /**
     * Get the style function.
     * @return {import("../style/Style.js").StyleFunction|undefined} Layer style function.
     * @api
     */
    BaseVectorLayer.prototype.getStyleFunction = function () {
        return this.styleFunction_;
    };
    /**
     * @return {boolean} Whether the rendered layer should be updated while
     *     animating.
     */
    BaseVectorLayer.prototype.getUpdateWhileAnimating = function () {
        return this.updateWhileAnimating_;
    };
    /**
     * @return {boolean} Whether the rendered layer should be updated while
     *     interacting.
     */
    BaseVectorLayer.prototype.getUpdateWhileInteracting = function () {
        return this.updateWhileInteracting_;
    };
    /**
     * Render declutter items for this layer
     * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
     */
    BaseVectorLayer.prototype.renderDeclutter = function (frameState) {
        if (!frameState.declutterTree) {
            frameState.declutterTree = new RBush(9);
        }
        /** @type {*} */ (this.getRenderer()).renderDeclutter(frameState);
    };
    /**
     * @param {import("../render.js").OrderFunction|null|undefined} renderOrder
     *     Render order.
     */
    BaseVectorLayer.prototype.setRenderOrder = function (renderOrder) {
        this.set(Property.RENDER_ORDER, renderOrder);
    };
    /**
     * Set the style for features.  This can be a single style object, an array
     * of styles, or a function that takes a feature and resolution and returns
     * an array of styles. If set to `null`, the layer has no style (a `null` style),
     * so only features that have their own styles will be rendered in the layer. Call
     * `setStyle()` without arguments to reset to the default style. See
     * {@link module:ol/style} for information on the default style.
     * @param {import("../style/Style.js").StyleLike|null} [opt_style] Layer style.
     * @api
     */
    BaseVectorLayer.prototype.setStyle = function (opt_style) {
        this.style_ = opt_style !== undefined ? opt_style : createDefaultStyle;
        this.styleFunction_ =
            opt_style === null ? undefined : toFunction(this.style_);
        this.changed();
    };
    return BaseVectorLayer;
}(Layer));

/**
 * @module ol/render/canvas/Instruction
 */
/**
 * @enum {number}
 */
var Instruction = {
    BEGIN_GEOMETRY: 0,
    BEGIN_PATH: 1,
    CIRCLE: 2,
    CLOSE_PATH: 3,
    CUSTOM: 4,
    DRAW_CHARS: 5,
    DRAW_IMAGE: 6,
    END_GEOMETRY: 7,
    FILL: 8,
    MOVE_TO_LINE_TO: 9,
    SET_FILL_STYLE: 10,
    SET_STROKE_STYLE: 11,
    STROKE: 12,
};
/**
 * @type {Array<Instruction>}
 */
var fillInstruction = [Instruction.FILL];
/**
 * @type {Array<Instruction>}
 */
var strokeInstruction = [Instruction.STROKE];
/**
 * @type {Array<Instruction>}
 */
var beginPathInstruction = [Instruction.BEGIN_PATH];
/**
 * @type {Array<Instruction>}
 */
var closePathInstruction = [Instruction.CLOSE_PATH];

/**
 * @module ol/render/VectorContext
 */
/**
 * @classdesc
 * Context for drawing geometries.  A vector context is available on render
 * events and does not need to be constructed directly.
 * @api
 */
var VectorContext = /** @class */ (function () {
    function VectorContext() {
    }
    /**
     * Render a geometry with a custom renderer.
     *
     * @param {import("../geom/SimpleGeometry.js").default} geometry Geometry.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     * @param {Function} renderer Renderer.
     * @param {Function} hitDetectionRenderer Renderer.
     */
    VectorContext.prototype.drawCustom = function (geometry, feature, renderer, hitDetectionRenderer) { };
    /**
     * Render a geometry.
     *
     * @param {import("../geom/Geometry.js").default} geometry The geometry to render.
     */
    VectorContext.prototype.drawGeometry = function (geometry) { };
    /**
     * Set the rendering style.
     *
     * @param {import("../style/Style.js").default} style The rendering style.
     */
    VectorContext.prototype.setStyle = function (style) { };
    /**
     * @param {import("../geom/Circle.js").default} circleGeometry Circle geometry.
     * @param {import("../Feature.js").default} feature Feature.
     */
    VectorContext.prototype.drawCircle = function (circleGeometry, feature) { };
    /**
     * @param {import("../Feature.js").default} feature Feature.
     * @param {import("../style/Style.js").default} style Style.
     */
    VectorContext.prototype.drawFeature = function (feature, style) { };
    /**
     * @param {import("../geom/GeometryCollection.js").default} geometryCollectionGeometry Geometry collection.
     * @param {import("../Feature.js").default} feature Feature.
     */
    VectorContext.prototype.drawGeometryCollection = function (geometryCollectionGeometry, feature) { };
    /**
     * @param {import("../geom/LineString.js").default|import("./Feature.js").default} lineStringGeometry Line string geometry.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     */
    VectorContext.prototype.drawLineString = function (lineStringGeometry, feature) { };
    /**
     * @param {import("../geom/MultiLineString.js").default|import("./Feature.js").default} multiLineStringGeometry MultiLineString geometry.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     */
    VectorContext.prototype.drawMultiLineString = function (multiLineStringGeometry, feature) { };
    /**
     * @param {import("../geom/MultiPoint.js").default|import("./Feature.js").default} multiPointGeometry MultiPoint geometry.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     */
    VectorContext.prototype.drawMultiPoint = function (multiPointGeometry, feature) { };
    /**
     * @param {import("../geom/MultiPolygon.js").default} multiPolygonGeometry MultiPolygon geometry.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     */
    VectorContext.prototype.drawMultiPolygon = function (multiPolygonGeometry, feature) { };
    /**
     * @param {import("../geom/Point.js").default|import("./Feature.js").default} pointGeometry Point geometry.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     */
    VectorContext.prototype.drawPoint = function (pointGeometry, feature) { };
    /**
     * @param {import("../geom/Polygon.js").default|import("./Feature.js").default} polygonGeometry Polygon geometry.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     */
    VectorContext.prototype.drawPolygon = function (polygonGeometry, feature) { };
    /**
     * @param {import("../geom/SimpleGeometry.js").default|import("./Feature.js").default} geometry Geometry.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     */
    VectorContext.prototype.drawText = function (geometry, feature) { };
    /**
     * @param {import("../style/Fill.js").default} fillStyle Fill style.
     * @param {import("../style/Stroke.js").default} strokeStyle Stroke style.
     */
    VectorContext.prototype.setFillStrokeStyle = function (fillStyle, strokeStyle) { };
    /**
     * @param {import("../style/Image.js").default} imageStyle Image style.
     * @param {import("../render/canvas.js").DeclutterImageWithText} [opt_declutterImageWithText] Shared data for combined decluttering with a text style.
     */
    VectorContext.prototype.setImageStyle = function (imageStyle, opt_declutterImageWithText) { };
    /**
     * @param {import("../style/Text.js").default} textStyle Text style.
     * @param {import("../render/canvas.js").DeclutterImageWithText} [opt_declutterImageWithText] Shared data for combined decluttering with an image style.
     */
    VectorContext.prototype.setTextStyle = function (textStyle, opt_declutterImageWithText) { };
    return VectorContext;
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
var CanvasBuilder = /** @class */ (function (_super) {
    __extends$1(CanvasBuilder, _super);
    /**
     * @param {number} tolerance Tolerance.
     * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     */
    function CanvasBuilder(tolerance, maxExtent, resolution, pixelRatio) {
        var _this = _super.call(this) || this;
        /**
         * @protected
         * @type {number}
         */
        _this.tolerance = tolerance;
        /**
         * @protected
         * @const
         * @type {import("../../extent.js").Extent}
         */
        _this.maxExtent = maxExtent;
        /**
         * @protected
         * @type {number}
         */
        _this.pixelRatio = pixelRatio;
        /**
         * @protected
         * @type {number}
         */
        _this.maxLineWidth = 0;
        /**
         * @protected
         * @const
         * @type {number}
         */
        _this.resolution = resolution;
        /**
         * @private
         * @type {Array<*>}
         */
        _this.beginGeometryInstruction1_ = null;
        /**
         * @private
         * @type {Array<*>}
         */
        _this.beginGeometryInstruction2_ = null;
        /**
         * @private
         * @type {import("../../extent.js").Extent}
         */
        _this.bufferedMaxExtent_ = null;
        /**
         * @protected
         * @type {Array<*>}
         */
        _this.instructions = [];
        /**
         * @protected
         * @type {Array<number>}
         */
        _this.coordinates = [];
        /**
         * @private
         * @type {import("../../coordinate.js").Coordinate}
         */
        _this.tmpCoordinate_ = [];
        /**
         * @protected
         * @type {Array<*>}
         */
        _this.hitDetectionInstructions = [];
        /**
         * @protected
         * @type {import("../canvas.js").FillStrokeState}
         */
        _this.state = /** @type {import("../canvas.js").FillStrokeState} */ ({});
        return _this;
    }
    /**
     * @protected
     * @param {Array<number>} dashArray Dash array.
     * @return {Array<number>} Dash array with pixel ratio applied
     */
    CanvasBuilder.prototype.applyPixelRatio = function (dashArray) {
        var pixelRatio = this.pixelRatio;
        return pixelRatio == 1
            ? dashArray
            : dashArray.map(function (dash) {
                return dash * pixelRatio;
            });
    };
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} stride Stride.
     * @protected
     * @return {number} My end
     */
    CanvasBuilder.prototype.appendFlatPointCoordinates = function (flatCoordinates, stride) {
        var extent = this.getBufferedMaxExtent();
        var tmpCoord = this.tmpCoordinate_;
        var coordinates = this.coordinates;
        var myEnd = coordinates.length;
        for (var i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
            tmpCoord[0] = flatCoordinates[i];
            tmpCoord[1] = flatCoordinates[i + 1];
            if (containsCoordinate(extent, tmpCoord)) {
                coordinates[myEnd++] = tmpCoord[0];
                coordinates[myEnd++] = tmpCoord[1];
            }
        }
        return myEnd;
    };
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {boolean} closed Last input coordinate equals first.
     * @param {boolean} skipFirst Skip first coordinate.
     * @protected
     * @return {number} My end.
     */
    CanvasBuilder.prototype.appendFlatLineCoordinates = function (flatCoordinates, offset, end, stride, closed, skipFirst) {
        var coordinates = this.coordinates;
        var myEnd = coordinates.length;
        var extent = this.getBufferedMaxExtent();
        if (skipFirst) {
            offset += stride;
        }
        var lastXCoord = flatCoordinates[offset];
        var lastYCoord = flatCoordinates[offset + 1];
        var nextCoord = this.tmpCoordinate_;
        var skipped = true;
        var i, lastRel, nextRel;
        for (i = offset + stride; i < end; i += stride) {
            nextCoord[0] = flatCoordinates[i];
            nextCoord[1] = flatCoordinates[i + 1];
            nextRel = coordinateRelationship(extent, nextCoord);
            if (nextRel !== lastRel) {
                if (skipped) {
                    coordinates[myEnd++] = lastXCoord;
                    coordinates[myEnd++] = lastYCoord;
                    skipped = false;
                }
                coordinates[myEnd++] = nextCoord[0];
                coordinates[myEnd++] = nextCoord[1];
            }
            else if (nextRel === Relationship.INTERSECTING) {
                coordinates[myEnd++] = nextCoord[0];
                coordinates[myEnd++] = nextCoord[1];
                skipped = false;
            }
            else {
                skipped = true;
            }
            lastXCoord = nextCoord[0];
            lastYCoord = nextCoord[1];
            lastRel = nextRel;
        }
        // Last coordinate equals first or only one point to append:
        if ((closed && skipped) || i === offset + stride) {
            coordinates[myEnd++] = lastXCoord;
            coordinates[myEnd++] = lastYCoord;
        }
        return myEnd;
    };
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<number>} ends Ends.
     * @param {number} stride Stride.
     * @param {Array<number>} builderEnds Builder ends.
     * @return {number} Offset.
     */
    CanvasBuilder.prototype.drawCustomCoordinates_ = function (flatCoordinates, offset, ends, stride, builderEnds) {
        for (var i = 0, ii = ends.length; i < ii; ++i) {
            var end = ends[i];
            var builderEnd = this.appendFlatLineCoordinates(flatCoordinates, offset, end, stride, false, false);
            builderEnds.push(builderEnd);
            offset = end;
        }
        return offset;
    };
    /**
     * @param {import("../../geom/SimpleGeometry.js").default} geometry Geometry.
     * @param {import("../../Feature.js").FeatureLike} feature Feature.
     * @param {Function} renderer Renderer.
     * @param {Function} hitDetectionRenderer Renderer.
     */
    CanvasBuilder.prototype.drawCustom = function (geometry, feature, renderer, hitDetectionRenderer) {
        this.beginGeometry(geometry, feature);
        var type = geometry.getType();
        var stride = geometry.getStride();
        var builderBegin = this.coordinates.length;
        var flatCoordinates, builderEnd, builderEnds, builderEndss;
        var offset;
        switch (type) {
            case GeometryType.MULTI_POLYGON:
                flatCoordinates =
                    /** @type {import("../../geom/MultiPolygon.js").default} */ (geometry).getOrientedFlatCoordinates();
                builderEndss = [];
                var endss = 
                /** @type {import("../../geom/MultiPolygon.js").default} */ (geometry).getEndss();
                offset = 0;
                for (var i = 0, ii = endss.length; i < ii; ++i) {
                    var myEnds = [];
                    offset = this.drawCustomCoordinates_(flatCoordinates, offset, endss[i], stride, myEnds);
                    builderEndss.push(myEnds);
                }
                this.instructions.push([
                    Instruction.CUSTOM,
                    builderBegin,
                    builderEndss,
                    geometry,
                    renderer,
                    inflateMultiCoordinatesArray,
                ]);
                this.hitDetectionInstructions.push([
                    Instruction.CUSTOM,
                    builderBegin,
                    builderEndss,
                    geometry,
                    hitDetectionRenderer || renderer,
                    inflateMultiCoordinatesArray,
                ]);
                break;
            case GeometryType.POLYGON:
            case GeometryType.MULTI_LINE_STRING:
                builderEnds = [];
                flatCoordinates =
                    type == GeometryType.POLYGON
                        ? /** @type {import("../../geom/Polygon.js").default} */ (geometry).getOrientedFlatCoordinates()
                        : geometry.getFlatCoordinates();
                offset = this.drawCustomCoordinates_(flatCoordinates, 0, 
                /** @type {import("../../geom/Polygon.js").default|import("../../geom/MultiLineString.js").default} */ (geometry).getEnds(), stride, builderEnds);
                this.instructions.push([
                    Instruction.CUSTOM,
                    builderBegin,
                    builderEnds,
                    geometry,
                    renderer,
                    inflateCoordinatesArray,
                ]);
                this.hitDetectionInstructions.push([
                    Instruction.CUSTOM,
                    builderBegin,
                    builderEnds,
                    geometry,
                    hitDetectionRenderer || renderer,
                    inflateCoordinatesArray,
                ]);
                break;
            case GeometryType.LINE_STRING:
            case GeometryType.CIRCLE:
                flatCoordinates = geometry.getFlatCoordinates();
                builderEnd = this.appendFlatLineCoordinates(flatCoordinates, 0, flatCoordinates.length, stride, false, false);
                this.instructions.push([
                    Instruction.CUSTOM,
                    builderBegin,
                    builderEnd,
                    geometry,
                    renderer,
                    inflateCoordinates,
                ]);
                this.hitDetectionInstructions.push([
                    Instruction.CUSTOM,
                    builderBegin,
                    builderEnd,
                    geometry,
                    hitDetectionRenderer || renderer,
                    inflateCoordinates,
                ]);
                break;
            case GeometryType.MULTI_POINT:
                flatCoordinates = geometry.getFlatCoordinates();
                builderEnd = this.appendFlatPointCoordinates(flatCoordinates, stride);
                if (builderEnd > builderBegin) {
                    this.instructions.push([
                        Instruction.CUSTOM,
                        builderBegin,
                        builderEnd,
                        geometry,
                        renderer,
                        inflateCoordinates,
                    ]);
                    this.hitDetectionInstructions.push([
                        Instruction.CUSTOM,
                        builderBegin,
                        builderEnd,
                        geometry,
                        hitDetectionRenderer || renderer,
                        inflateCoordinates,
                    ]);
                }
                break;
            case GeometryType.POINT:
                flatCoordinates = geometry.getFlatCoordinates();
                this.coordinates.push(flatCoordinates[0], flatCoordinates[1]);
                builderEnd = this.coordinates.length;
                this.instructions.push([
                    Instruction.CUSTOM,
                    builderBegin,
                    builderEnd,
                    geometry,
                    renderer,
                ]);
                this.hitDetectionInstructions.push([
                    Instruction.CUSTOM,
                    builderBegin,
                    builderEnd,
                    geometry,
                    hitDetectionRenderer || renderer,
                ]);
                break;
        }
        this.endGeometry(feature);
    };
    /**
     * @protected
     * @param {import("../../geom/Geometry").default|import("../Feature.js").default} geometry The geometry.
     * @param {import("../../Feature.js").FeatureLike} feature Feature.
     */
    CanvasBuilder.prototype.beginGeometry = function (geometry, feature) {
        this.beginGeometryInstruction1_ = [
            Instruction.BEGIN_GEOMETRY,
            feature,
            0,
            geometry,
        ];
        this.instructions.push(this.beginGeometryInstruction1_);
        this.beginGeometryInstruction2_ = [
            Instruction.BEGIN_GEOMETRY,
            feature,
            0,
            geometry,
        ];
        this.hitDetectionInstructions.push(this.beginGeometryInstruction2_);
    };
    /**
     * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
     */
    CanvasBuilder.prototype.finish = function () {
        return {
            instructions: this.instructions,
            hitDetectionInstructions: this.hitDetectionInstructions,
            coordinates: this.coordinates,
        };
    };
    /**
     * Reverse the hit detection instructions.
     */
    CanvasBuilder.prototype.reverseHitDetectionInstructions = function () {
        var hitDetectionInstructions = this.hitDetectionInstructions;
        // step 1 - reverse array
        hitDetectionInstructions.reverse();
        // step 2 - reverse instructions within geometry blocks
        var i;
        var n = hitDetectionInstructions.length;
        var instruction;
        var type;
        var begin = -1;
        for (i = 0; i < n; ++i) {
            instruction = hitDetectionInstructions[i];
            type = /** @type {import("./Instruction.js").default} */ (instruction[0]);
            if (type == Instruction.END_GEOMETRY) {
                begin = i;
            }
            else if (type == Instruction.BEGIN_GEOMETRY) {
                instruction[2] = i;
                reverseSubArray(this.hitDetectionInstructions, begin, i);
                begin = -1;
            }
        }
    };
    /**
     * @param {import("../../style/Fill.js").default} fillStyle Fill style.
     * @param {import("../../style/Stroke.js").default} strokeStyle Stroke style.
     */
    CanvasBuilder.prototype.setFillStrokeStyle = function (fillStyle, strokeStyle) {
        var state = this.state;
        if (fillStyle) {
            var fillStyleColor = fillStyle.getColor();
            state.fillStyle = asColorLike(fillStyleColor ? fillStyleColor : defaultFillStyle);
        }
        else {
            state.fillStyle = undefined;
        }
        if (strokeStyle) {
            var strokeStyleColor = strokeStyle.getColor();
            state.strokeStyle = asColorLike(strokeStyleColor ? strokeStyleColor : defaultStrokeStyle);
            var strokeStyleLineCap = strokeStyle.getLineCap();
            state.lineCap =
                strokeStyleLineCap !== undefined ? strokeStyleLineCap : defaultLineCap;
            var strokeStyleLineDash = strokeStyle.getLineDash();
            state.lineDash = strokeStyleLineDash
                ? strokeStyleLineDash.slice()
                : defaultLineDash;
            var strokeStyleLineDashOffset = strokeStyle.getLineDashOffset();
            state.lineDashOffset = strokeStyleLineDashOffset
                ? strokeStyleLineDashOffset
                : defaultLineDashOffset;
            var strokeStyleLineJoin = strokeStyle.getLineJoin();
            state.lineJoin =
                strokeStyleLineJoin !== undefined
                    ? strokeStyleLineJoin
                    : defaultLineJoin;
            var strokeStyleWidth = strokeStyle.getWidth();
            state.lineWidth =
                strokeStyleWidth !== undefined ? strokeStyleWidth : defaultLineWidth;
            var strokeStyleMiterLimit = strokeStyle.getMiterLimit();
            state.miterLimit =
                strokeStyleMiterLimit !== undefined
                    ? strokeStyleMiterLimit
                    : defaultMiterLimit;
            if (state.lineWidth > this.maxLineWidth) {
                this.maxLineWidth = state.lineWidth;
                // invalidate the buffered max extent cache
                this.bufferedMaxExtent_ = null;
            }
        }
        else {
            state.strokeStyle = undefined;
            state.lineCap = undefined;
            state.lineDash = null;
            state.lineDashOffset = undefined;
            state.lineJoin = undefined;
            state.lineWidth = undefined;
            state.miterLimit = undefined;
        }
    };
    /**
     * @param {import("../canvas.js").FillStrokeState} state State.
     * @return {Array<*>} Fill instruction.
     */
    CanvasBuilder.prototype.createFill = function (state) {
        var fillStyle = state.fillStyle;
        /** @type {Array<*>} */
        var fillInstruction = [Instruction.SET_FILL_STYLE, fillStyle];
        if (typeof fillStyle !== 'string') {
            // Fill is a pattern or gradient - align it!
            fillInstruction.push(true);
        }
        return fillInstruction;
    };
    /**
     * @param {import("../canvas.js").FillStrokeState} state State.
     */
    CanvasBuilder.prototype.applyStroke = function (state) {
        this.instructions.push(this.createStroke(state));
    };
    /**
     * @param {import("../canvas.js").FillStrokeState} state State.
     * @return {Array<*>} Stroke instruction.
     */
    CanvasBuilder.prototype.createStroke = function (state) {
        return [
            Instruction.SET_STROKE_STYLE,
            state.strokeStyle,
            state.lineWidth * this.pixelRatio,
            state.lineCap,
            state.lineJoin,
            state.miterLimit,
            this.applyPixelRatio(state.lineDash),
            state.lineDashOffset * this.pixelRatio,
        ];
    };
    /**
     * @param {import("../canvas.js").FillStrokeState} state State.
     * @param {function(this:CanvasBuilder, import("../canvas.js").FillStrokeState):Array<*>} createFill Create fill.
     */
    CanvasBuilder.prototype.updateFillStyle = function (state, createFill) {
        var fillStyle = state.fillStyle;
        if (typeof fillStyle !== 'string' || state.currentFillStyle != fillStyle) {
            if (fillStyle !== undefined) {
                this.instructions.push(createFill.call(this, state));
            }
            state.currentFillStyle = fillStyle;
        }
    };
    /**
     * @param {import("../canvas.js").FillStrokeState} state State.
     * @param {function(this:CanvasBuilder, import("../canvas.js").FillStrokeState): void} applyStroke Apply stroke.
     */
    CanvasBuilder.prototype.updateStrokeStyle = function (state, applyStroke) {
        var strokeStyle = state.strokeStyle;
        var lineCap = state.lineCap;
        var lineDash = state.lineDash;
        var lineDashOffset = state.lineDashOffset;
        var lineJoin = state.lineJoin;
        var lineWidth = state.lineWidth;
        var miterLimit = state.miterLimit;
        if (state.currentStrokeStyle != strokeStyle ||
            state.currentLineCap != lineCap ||
            (lineDash != state.currentLineDash &&
                !equals(state.currentLineDash, lineDash)) ||
            state.currentLineDashOffset != lineDashOffset ||
            state.currentLineJoin != lineJoin ||
            state.currentLineWidth != lineWidth ||
            state.currentMiterLimit != miterLimit) {
            if (strokeStyle !== undefined) {
                applyStroke.call(this, state);
            }
            state.currentStrokeStyle = strokeStyle;
            state.currentLineCap = lineCap;
            state.currentLineDash = lineDash;
            state.currentLineDashOffset = lineDashOffset;
            state.currentLineJoin = lineJoin;
            state.currentLineWidth = lineWidth;
            state.currentMiterLimit = miterLimit;
        }
    };
    /**
     * @param {import("../../Feature.js").FeatureLike} feature Feature.
     */
    CanvasBuilder.prototype.endGeometry = function (feature) {
        this.beginGeometryInstruction1_[2] = this.instructions.length;
        this.beginGeometryInstruction1_ = null;
        this.beginGeometryInstruction2_[2] = this.hitDetectionInstructions.length;
        this.beginGeometryInstruction2_ = null;
        var endGeometryInstruction = [Instruction.END_GEOMETRY, feature];
        this.instructions.push(endGeometryInstruction);
        this.hitDetectionInstructions.push(endGeometryInstruction);
    };
    /**
     * Get the buffered rendering extent.  Rendering will be clipped to the extent
     * provided to the constructor.  To account for symbolizers that may intersect
     * this extent, we calculate a buffered extent (e.g. based on stroke width).
     * @return {import("../../extent.js").Extent} The buffered rendering extent.
     * @protected
     */
    CanvasBuilder.prototype.getBufferedMaxExtent = function () {
        if (!this.bufferedMaxExtent_) {
            this.bufferedMaxExtent_ = clone(this.maxExtent);
            if (this.maxLineWidth > 0) {
                var width = (this.resolution * (this.maxLineWidth + 1)) / 2;
                buffer(this.bufferedMaxExtent_, width, this.bufferedMaxExtent_);
            }
        }
        return this.bufferedMaxExtent_;
    };
    return CanvasBuilder;
}(VectorContext));

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
var CanvasImageBuilder = /** @class */ (function (_super) {
    __extends$2(CanvasImageBuilder, _super);
    /**
     * @param {number} tolerance Tolerance.
     * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     */
    function CanvasImageBuilder(tolerance, maxExtent, resolution, pixelRatio) {
        var _this = _super.call(this, tolerance, maxExtent, resolution, pixelRatio) || this;
        /**
         * @private
         * @type {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement}
         */
        _this.hitDetectionImage_ = null;
        /**
         * @private
         * @type {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement}
         */
        _this.image_ = null;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.imagePixelRatio_ = undefined;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.anchorX_ = undefined;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.anchorY_ = undefined;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.height_ = undefined;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.opacity_ = undefined;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.originX_ = undefined;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.originY_ = undefined;
        /**
         * @private
         * @type {boolean|undefined}
         */
        _this.rotateWithView_ = undefined;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.rotation_ = undefined;
        /**
         * @private
         * @type {import("../../size.js").Size|undefined}
         */
        _this.scale_ = undefined;
        /**
         * @private
         * @type {number|undefined}
         */
        _this.width_ = undefined;
        /**
         * Data shared with a text builder for combined decluttering.
         * @private
         * @type {import("../canvas.js").DeclutterImageWithText}
         */
        _this.declutterImageWithText_ = undefined;
        return _this;
    }
    /**
     * @param {import("../../geom/Point.js").default|import("../Feature.js").default} pointGeometry Point geometry.
     * @param {import("../../Feature.js").FeatureLike} feature Feature.
     */
    CanvasImageBuilder.prototype.drawPoint = function (pointGeometry, feature) {
        if (!this.image_) {
            return;
        }
        this.beginGeometry(pointGeometry, feature);
        var flatCoordinates = pointGeometry.getFlatCoordinates();
        var stride = pointGeometry.getStride();
        var myBegin = this.coordinates.length;
        var myEnd = this.appendFlatPointCoordinates(flatCoordinates, stride);
        this.instructions.push([
            Instruction.DRAW_IMAGE,
            myBegin,
            myEnd,
            this.image_,
            // Remaining arguments to DRAW_IMAGE are in alphabetical order
            this.anchorX_ * this.imagePixelRatio_,
            this.anchorY_ * this.imagePixelRatio_,
            Math.ceil(this.height_ * this.imagePixelRatio_),
            this.opacity_,
            this.originX_,
            this.originY_,
            this.rotateWithView_,
            this.rotation_,
            [
                (this.scale_[0] * this.pixelRatio) / this.imagePixelRatio_,
                (this.scale_[1] * this.pixelRatio) / this.imagePixelRatio_,
            ],
            Math.ceil(this.width_ * this.imagePixelRatio_),
            this.declutterImageWithText_,
        ]);
        this.hitDetectionInstructions.push([
            Instruction.DRAW_IMAGE,
            myBegin,
            myEnd,
            this.hitDetectionImage_,
            // Remaining arguments to DRAW_IMAGE are in alphabetical order
            this.anchorX_,
            this.anchorY_,
            this.height_,
            this.opacity_,
            this.originX_,
            this.originY_,
            this.rotateWithView_,
            this.rotation_,
            this.scale_,
            this.width_,
            this.declutterImageWithText_,
        ]);
        this.endGeometry(feature);
    };
    /**
     * @param {import("../../geom/MultiPoint.js").default|import("../Feature.js").default} multiPointGeometry MultiPoint geometry.
     * @param {import("../../Feature.js").FeatureLike} feature Feature.
     */
    CanvasImageBuilder.prototype.drawMultiPoint = function (multiPointGeometry, feature) {
        if (!this.image_) {
            return;
        }
        this.beginGeometry(multiPointGeometry, feature);
        var flatCoordinates = multiPointGeometry.getFlatCoordinates();
        var stride = multiPointGeometry.getStride();
        var myBegin = this.coordinates.length;
        var myEnd = this.appendFlatPointCoordinates(flatCoordinates, stride);
        this.instructions.push([
            Instruction.DRAW_IMAGE,
            myBegin,
            myEnd,
            this.image_,
            // Remaining arguments to DRAW_IMAGE are in alphabetical order
            this.anchorX_ * this.imagePixelRatio_,
            this.anchorY_ * this.imagePixelRatio_,
            Math.ceil(this.height_ * this.imagePixelRatio_),
            this.opacity_,
            this.originX_,
            this.originY_,
            this.rotateWithView_,
            this.rotation_,
            [
                (this.scale_[0] * this.pixelRatio) / this.imagePixelRatio_,
                (this.scale_[1] * this.pixelRatio) / this.imagePixelRatio_,
            ],
            Math.ceil(this.width_ * this.imagePixelRatio_),
            this.declutterImageWithText_,
        ]);
        this.hitDetectionInstructions.push([
            Instruction.DRAW_IMAGE,
            myBegin,
            myEnd,
            this.hitDetectionImage_,
            // Remaining arguments to DRAW_IMAGE are in alphabetical order
            this.anchorX_,
            this.anchorY_,
            this.height_,
            this.opacity_,
            this.originX_,
            this.originY_,
            this.rotateWithView_,
            this.rotation_,
            this.scale_,
            this.width_,
            this.declutterImageWithText_,
        ]);
        this.endGeometry(feature);
    };
    /**
     * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
     */
    CanvasImageBuilder.prototype.finish = function () {
        this.reverseHitDetectionInstructions();
        // FIXME this doesn't really protect us against further calls to draw*Geometry
        this.anchorX_ = undefined;
        this.anchorY_ = undefined;
        this.hitDetectionImage_ = null;
        this.image_ = null;
        this.imagePixelRatio_ = undefined;
        this.height_ = undefined;
        this.scale_ = undefined;
        this.opacity_ = undefined;
        this.originX_ = undefined;
        this.originY_ = undefined;
        this.rotateWithView_ = undefined;
        this.rotation_ = undefined;
        this.width_ = undefined;
        return _super.prototype.finish.call(this);
    };
    /**
     * @param {import("../../style/Image.js").default} imageStyle Image style.
     * @param {Object} [opt_sharedData] Shared data.
     */
    CanvasImageBuilder.prototype.setImageStyle = function (imageStyle, opt_sharedData) {
        var anchor = imageStyle.getAnchor();
        var size = imageStyle.getSize();
        var hitDetectionImage = imageStyle.getHitDetectionImage();
        var image = imageStyle.getImage(this.pixelRatio);
        var origin = imageStyle.getOrigin();
        this.imagePixelRatio_ = imageStyle.getPixelRatio(this.pixelRatio);
        this.anchorX_ = anchor[0];
        this.anchorY_ = anchor[1];
        this.hitDetectionImage_ = hitDetectionImage;
        this.image_ = image;
        this.height_ = size[1];
        this.opacity_ = imageStyle.getOpacity();
        this.originX_ = origin[0] * this.imagePixelRatio_;
        this.originY_ = origin[1] * this.imagePixelRatio_;
        this.rotateWithView_ = imageStyle.getRotateWithView();
        this.rotation_ = imageStyle.getRotation();
        this.scale_ = imageStyle.getScaleArray();
        this.width_ = size[0];
        this.declutterImageWithText_ = opt_sharedData;
    };
    return CanvasImageBuilder;
}(CanvasBuilder));

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
var CanvasLineStringBuilder = /** @class */ (function (_super) {
    __extends$3(CanvasLineStringBuilder, _super);
    /**
     * @param {number} tolerance Tolerance.
     * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     */
    function CanvasLineStringBuilder(tolerance, maxExtent, resolution, pixelRatio) {
        return _super.call(this, tolerance, maxExtent, resolution, pixelRatio) || this;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @private
     * @return {number} end.
     */
    CanvasLineStringBuilder.prototype.drawFlatCoordinates_ = function (flatCoordinates, offset, end, stride) {
        var myBegin = this.coordinates.length;
        var myEnd = this.appendFlatLineCoordinates(flatCoordinates, offset, end, stride, false, false);
        var moveToLineToInstruction = [
            Instruction.MOVE_TO_LINE_TO,
            myBegin,
            myEnd,
        ];
        this.instructions.push(moveToLineToInstruction);
        this.hitDetectionInstructions.push(moveToLineToInstruction);
        return end;
    };
    /**
     * @param {import("../../geom/LineString.js").default|import("../Feature.js").default} lineStringGeometry Line string geometry.
     * @param {import("../../Feature.js").FeatureLike} feature Feature.
     */
    CanvasLineStringBuilder.prototype.drawLineString = function (lineStringGeometry, feature) {
        var state = this.state;
        var strokeStyle = state.strokeStyle;
        var lineWidth = state.lineWidth;
        if (strokeStyle === undefined || lineWidth === undefined) {
            return;
        }
        this.updateStrokeStyle(state, this.applyStroke);
        this.beginGeometry(lineStringGeometry, feature);
        this.hitDetectionInstructions.push([
            Instruction.SET_STROKE_STYLE,
            state.strokeStyle,
            state.lineWidth,
            state.lineCap,
            state.lineJoin,
            state.miterLimit,
            defaultLineDash,
            defaultLineDashOffset,
        ], beginPathInstruction);
        var flatCoordinates = lineStringGeometry.getFlatCoordinates();
        var stride = lineStringGeometry.getStride();
        this.drawFlatCoordinates_(flatCoordinates, 0, flatCoordinates.length, stride);
        this.hitDetectionInstructions.push(strokeInstruction);
        this.endGeometry(feature);
    };
    /**
     * @param {import("../../geom/MultiLineString.js").default|import("../Feature.js").default} multiLineStringGeometry MultiLineString geometry.
     * @param {import("../../Feature.js").FeatureLike} feature Feature.
     */
    CanvasLineStringBuilder.prototype.drawMultiLineString = function (multiLineStringGeometry, feature) {
        var state = this.state;
        var strokeStyle = state.strokeStyle;
        var lineWidth = state.lineWidth;
        if (strokeStyle === undefined || lineWidth === undefined) {
            return;
        }
        this.updateStrokeStyle(state, this.applyStroke);
        this.beginGeometry(multiLineStringGeometry, feature);
        this.hitDetectionInstructions.push([
            Instruction.SET_STROKE_STYLE,
            state.strokeStyle,
            state.lineWidth,
            state.lineCap,
            state.lineJoin,
            state.miterLimit,
            state.lineDash,
            state.lineDashOffset,
        ], beginPathInstruction);
        var ends = multiLineStringGeometry.getEnds();
        var flatCoordinates = multiLineStringGeometry.getFlatCoordinates();
        var stride = multiLineStringGeometry.getStride();
        var offset = 0;
        for (var i = 0, ii = ends.length; i < ii; ++i) {
            offset = this.drawFlatCoordinates_(flatCoordinates, offset, 
            /** @type {number} */ (ends[i]), stride);
        }
        this.hitDetectionInstructions.push(strokeInstruction);
        this.endGeometry(feature);
    };
    /**
     * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
     */
    CanvasLineStringBuilder.prototype.finish = function () {
        var state = this.state;
        if (state.lastStroke != undefined &&
            state.lastStroke != this.coordinates.length) {
            this.instructions.push(strokeInstruction);
        }
        this.reverseHitDetectionInstructions();
        this.state = null;
        return _super.prototype.finish.call(this);
    };
    /**
     * @param {import("../canvas.js").FillStrokeState} state State.
     */
    CanvasLineStringBuilder.prototype.applyStroke = function (state) {
        if (state.lastStroke != undefined &&
            state.lastStroke != this.coordinates.length) {
            this.instructions.push(strokeInstruction);
            state.lastStroke = this.coordinates.length;
        }
        state.lastStroke = 0;
        _super.prototype.applyStroke.call(this, state);
        this.instructions.push(beginPathInstruction);
    };
    return CanvasLineStringBuilder;
}(CanvasBuilder));

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
var CanvasPolygonBuilder = /** @class */ (function (_super) {
    __extends$4(CanvasPolygonBuilder, _super);
    /**
     * @param {number} tolerance Tolerance.
     * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     */
    function CanvasPolygonBuilder(tolerance, maxExtent, resolution, pixelRatio) {
        return _super.call(this, tolerance, maxExtent, resolution, pixelRatio) || this;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<number>} ends Ends.
     * @param {number} stride Stride.
     * @private
     * @return {number} End.
     */
    CanvasPolygonBuilder.prototype.drawFlatCoordinatess_ = function (flatCoordinates, offset, ends, stride) {
        var state = this.state;
        var fill = state.fillStyle !== undefined;
        var stroke = state.strokeStyle !== undefined;
        var numEnds = ends.length;
        this.instructions.push(beginPathInstruction);
        this.hitDetectionInstructions.push(beginPathInstruction);
        for (var i = 0; i < numEnds; ++i) {
            var end = ends[i];
            var myBegin = this.coordinates.length;
            var myEnd = this.appendFlatLineCoordinates(flatCoordinates, offset, end, stride, true, !stroke);
            var moveToLineToInstruction = [
                Instruction.MOVE_TO_LINE_TO,
                myBegin,
                myEnd,
            ];
            this.instructions.push(moveToLineToInstruction);
            this.hitDetectionInstructions.push(moveToLineToInstruction);
            if (stroke) {
                // Performance optimization: only call closePath() when we have a stroke.
                // Otherwise the ring is closed already (see appendFlatLineCoordinates above).
                this.instructions.push(closePathInstruction);
                this.hitDetectionInstructions.push(closePathInstruction);
            }
            offset = end;
        }
        if (fill) {
            this.instructions.push(fillInstruction);
            this.hitDetectionInstructions.push(fillInstruction);
        }
        if (stroke) {
            this.instructions.push(strokeInstruction);
            this.hitDetectionInstructions.push(strokeInstruction);
        }
        return offset;
    };
    /**
     * @param {import("../../geom/Circle.js").default} circleGeometry Circle geometry.
     * @param {import("../../Feature.js").default} feature Feature.
     */
    CanvasPolygonBuilder.prototype.drawCircle = function (circleGeometry, feature) {
        var state = this.state;
        var fillStyle = state.fillStyle;
        var strokeStyle = state.strokeStyle;
        if (fillStyle === undefined && strokeStyle === undefined) {
            return;
        }
        this.setFillStrokeStyles_();
        this.beginGeometry(circleGeometry, feature);
        if (state.fillStyle !== undefined) {
            this.hitDetectionInstructions.push([
                Instruction.SET_FILL_STYLE,
                defaultFillStyle,
            ]);
        }
        if (state.strokeStyle !== undefined) {
            this.hitDetectionInstructions.push([
                Instruction.SET_STROKE_STYLE,
                state.strokeStyle,
                state.lineWidth,
                state.lineCap,
                state.lineJoin,
                state.miterLimit,
                state.lineDash,
                state.lineDashOffset,
            ]);
        }
        var flatCoordinates = circleGeometry.getFlatCoordinates();
        var stride = circleGeometry.getStride();
        var myBegin = this.coordinates.length;
        this.appendFlatLineCoordinates(flatCoordinates, 0, flatCoordinates.length, stride, false, false);
        var circleInstruction = [Instruction.CIRCLE, myBegin];
        this.instructions.push(beginPathInstruction, circleInstruction);
        this.hitDetectionInstructions.push(beginPathInstruction, circleInstruction);
        if (state.fillStyle !== undefined) {
            this.instructions.push(fillInstruction);
            this.hitDetectionInstructions.push(fillInstruction);
        }
        if (state.strokeStyle !== undefined) {
            this.instructions.push(strokeInstruction);
            this.hitDetectionInstructions.push(strokeInstruction);
        }
        this.endGeometry(feature);
    };
    /**
     * @param {import("../../geom/Polygon.js").default|import("../Feature.js").default} polygonGeometry Polygon geometry.
     * @param {import("../../Feature.js").FeatureLike} feature Feature.
     */
    CanvasPolygonBuilder.prototype.drawPolygon = function (polygonGeometry, feature) {
        var state = this.state;
        var fillStyle = state.fillStyle;
        var strokeStyle = state.strokeStyle;
        if (fillStyle === undefined && strokeStyle === undefined) {
            return;
        }
        this.setFillStrokeStyles_();
        this.beginGeometry(polygonGeometry, feature);
        if (state.fillStyle !== undefined) {
            this.hitDetectionInstructions.push([
                Instruction.SET_FILL_STYLE,
                defaultFillStyle,
            ]);
        }
        if (state.strokeStyle !== undefined) {
            this.hitDetectionInstructions.push([
                Instruction.SET_STROKE_STYLE,
                state.strokeStyle,
                state.lineWidth,
                state.lineCap,
                state.lineJoin,
                state.miterLimit,
                state.lineDash,
                state.lineDashOffset,
            ]);
        }
        var ends = polygonGeometry.getEnds();
        var flatCoordinates = polygonGeometry.getOrientedFlatCoordinates();
        var stride = polygonGeometry.getStride();
        this.drawFlatCoordinatess_(flatCoordinates, 0, 
        /** @type {Array<number>} */ (ends), stride);
        this.endGeometry(feature);
    };
    /**
     * @param {import("../../geom/MultiPolygon.js").default} multiPolygonGeometry MultiPolygon geometry.
     * @param {import("../../Feature.js").FeatureLike} feature Feature.
     */
    CanvasPolygonBuilder.prototype.drawMultiPolygon = function (multiPolygonGeometry, feature) {
        var state = this.state;
        var fillStyle = state.fillStyle;
        var strokeStyle = state.strokeStyle;
        if (fillStyle === undefined && strokeStyle === undefined) {
            return;
        }
        this.setFillStrokeStyles_();
        this.beginGeometry(multiPolygonGeometry, feature);
        if (state.fillStyle !== undefined) {
            this.hitDetectionInstructions.push([
                Instruction.SET_FILL_STYLE,
                defaultFillStyle,
            ]);
        }
        if (state.strokeStyle !== undefined) {
            this.hitDetectionInstructions.push([
                Instruction.SET_STROKE_STYLE,
                state.strokeStyle,
                state.lineWidth,
                state.lineCap,
                state.lineJoin,
                state.miterLimit,
                state.lineDash,
                state.lineDashOffset,
            ]);
        }
        var endss = multiPolygonGeometry.getEndss();
        var flatCoordinates = multiPolygonGeometry.getOrientedFlatCoordinates();
        var stride = multiPolygonGeometry.getStride();
        var offset = 0;
        for (var i = 0, ii = endss.length; i < ii; ++i) {
            offset = this.drawFlatCoordinatess_(flatCoordinates, offset, endss[i], stride);
        }
        this.endGeometry(feature);
    };
    /**
     * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
     */
    CanvasPolygonBuilder.prototype.finish = function () {
        this.reverseHitDetectionInstructions();
        this.state = null;
        // We want to preserve topology when drawing polygons.  Polygons are
        // simplified using quantization and point elimination. However, we might
        // have received a mix of quantized and non-quantized geometries, so ensure
        // that all are quantized by quantizing all coordinates in the batch.
        var tolerance = this.tolerance;
        if (tolerance !== 0) {
            var coordinates = this.coordinates;
            for (var i = 0, ii = coordinates.length; i < ii; ++i) {
                coordinates[i] = snap(coordinates[i], tolerance);
            }
        }
        return _super.prototype.finish.call(this);
    };
    /**
     * @private
     */
    CanvasPolygonBuilder.prototype.setFillStrokeStyles_ = function () {
        var state = this.state;
        var fillStyle = state.fillStyle;
        if (fillStyle !== undefined) {
            this.updateFillStyle(state, this.createFill);
        }
        if (state.strokeStyle !== undefined) {
            this.updateStrokeStyle(state, this.applyStroke);
        }
    };
    return CanvasPolygonBuilder;
}(CanvasBuilder));

/**
 * @module ol/geom/flat/straightchunk
 */
/**
 * @param {number} maxAngle Maximum acceptable angle delta between segments.
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {Array<number>} Start and end of the first suitable chunk of the
 * given `flatCoordinates`.
 */
function matchingChunk(maxAngle, flatCoordinates, offset, end, stride) {
    var chunkStart = offset;
    var chunkEnd = offset;
    var chunkM = 0;
    var m = 0;
    var start = offset;
    var acos, i, m12, m23, x1, y1, x12, y12, x23, y23;
    for (i = offset; i < end; i += stride) {
        var x2 = flatCoordinates[i];
        var y2 = flatCoordinates[i + 1];
        if (x1 !== undefined) {
            x23 = x2 - x1;
            y23 = y2 - y1;
            m23 = Math.sqrt(x23 * x23 + y23 * y23);
            if (x12 !== undefined) {
                m += m12;
                acos = Math.acos((x12 * x23 + y12 * y23) / (m12 * m23));
                if (acos > maxAngle) {
                    if (m > chunkM) {
                        chunkM = m;
                        chunkStart = start;
                        chunkEnd = i;
                    }
                    m = 0;
                    start = i - stride;
                }
            }
            m12 = m23;
            x12 = x23;
            y12 = y23;
        }
        x1 = x2;
        y1 = y2;
    }
    m += m23;
    return m > chunkM ? [start, i] : [chunkStart, chunkEnd];
}

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
 * @const
 * @enum {number}
 */
var TEXT_ALIGN = {
    'left': 0,
    'end': 0,
    'center': 0.5,
    'right': 1,
    'start': 1,
    'top': 0,
    'middle': 0.5,
    'hanging': 0.2,
    'alphabetic': 0.8,
    'ideographic': 0.8,
    'bottom': 1,
};
var CanvasTextBuilder = /** @class */ (function (_super) {
    __extends$5(CanvasTextBuilder, _super);
    /**
     * @param {number} tolerance Tolerance.
     * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     */
    function CanvasTextBuilder(tolerance, maxExtent, resolution, pixelRatio) {
        var _this = _super.call(this, tolerance, maxExtent, resolution, pixelRatio) || this;
        /**
         * @private
         * @type {Array<HTMLCanvasElement>}
         */
        _this.labels_ = null;
        /**
         * @private
         * @type {string}
         */
        _this.text_ = '';
        /**
         * @private
         * @type {number}
         */
        _this.textOffsetX_ = 0;
        /**
         * @private
         * @type {number}
         */
        _this.textOffsetY_ = 0;
        /**
         * @private
         * @type {boolean|undefined}
         */
        _this.textRotateWithView_ = undefined;
        /**
         * @private
         * @type {number}
         */
        _this.textRotation_ = 0;
        /**
         * @private
         * @type {?import("../canvas.js").FillState}
         */
        _this.textFillState_ = null;
        /**
         * @type {!Object<string, import("../canvas.js").FillState>}
         */
        _this.fillStates = {};
        /**
         * @private
         * @type {?import("../canvas.js").StrokeState}
         */
        _this.textStrokeState_ = null;
        /**
         * @type {!Object<string, import("../canvas.js").StrokeState>}
         */
        _this.strokeStates = {};
        /**
         * @private
         * @type {import("../canvas.js").TextState}
         */
        _this.textState_ = /** @type {import("../canvas.js").TextState} */ ({});
        /**
         * @type {!Object<string, import("../canvas.js").TextState>}
         */
        _this.textStates = {};
        /**
         * @private
         * @type {string}
         */
        _this.textKey_ = '';
        /**
         * @private
         * @type {string}
         */
        _this.fillKey_ = '';
        /**
         * @private
         * @type {string}
         */
        _this.strokeKey_ = '';
        /**
         * Data shared with an image builder for combined decluttering.
         * @private
         * @type {import("../canvas.js").DeclutterImageWithText}
         */
        _this.declutterImageWithText_ = undefined;
        return _this;
    }
    /**
     * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
     */
    CanvasTextBuilder.prototype.finish = function () {
        var instructions = _super.prototype.finish.call(this);
        instructions.textStates = this.textStates;
        instructions.fillStates = this.fillStates;
        instructions.strokeStates = this.strokeStates;
        return instructions;
    };
    /**
     * @param {import("../../geom/SimpleGeometry.js").default|import("../Feature.js").default} geometry Geometry.
     * @param {import("../../Feature.js").FeatureLike} feature Feature.
     */
    CanvasTextBuilder.prototype.drawText = function (geometry, feature) {
        var fillState = this.textFillState_;
        var strokeState = this.textStrokeState_;
        var textState = this.textState_;
        if (this.text_ === '' || !textState || (!fillState && !strokeState)) {
            return;
        }
        var coordinates = this.coordinates;
        var begin = coordinates.length;
        var geometryType = geometry.getType();
        var flatCoordinates = null;
        var stride = geometry.getStride();
        if (textState.placement === TextPlacement.LINE &&
            (geometryType == GeometryType.LINE_STRING ||
                geometryType == GeometryType.MULTI_LINE_STRING ||
                geometryType == GeometryType.POLYGON ||
                geometryType == GeometryType.MULTI_POLYGON)) {
            if (!intersects(this.getBufferedMaxExtent(), geometry.getExtent())) {
                return;
            }
            var ends = void 0;
            flatCoordinates = geometry.getFlatCoordinates();
            if (geometryType == GeometryType.LINE_STRING) {
                ends = [flatCoordinates.length];
            }
            else if (geometryType == GeometryType.MULTI_LINE_STRING) {
                ends = /** @type {import("../../geom/MultiLineString.js").default} */ (geometry).getEnds();
            }
            else if (geometryType == GeometryType.POLYGON) {
                ends = /** @type {import("../../geom/Polygon.js").default} */ (geometry)
                    .getEnds()
                    .slice(0, 1);
            }
            else if (geometryType == GeometryType.MULTI_POLYGON) {
                var endss = 
                /** @type {import("../../geom/MultiPolygon.js").default} */ (geometry).getEndss();
                ends = [];
                for (var i = 0, ii = endss.length; i < ii; ++i) {
                    ends.push(endss[i][0]);
                }
            }
            this.beginGeometry(geometry, feature);
            var textAlign = textState.textAlign;
            var flatOffset = 0;
            var flatEnd = void 0;
            for (var o = 0, oo = ends.length; o < oo; ++o) {
                if (textAlign == undefined) {
                    var range = matchingChunk(textState.maxAngle, flatCoordinates, flatOffset, ends[o], stride);
                    flatOffset = range[0];
                    flatEnd = range[1];
                }
                else {
                    flatEnd = ends[o];
                }
                for (var i = flatOffset; i < flatEnd; i += stride) {
                    coordinates.push(flatCoordinates[i], flatCoordinates[i + 1]);
                }
                var end = coordinates.length;
                flatOffset = ends[o];
                this.drawChars_(begin, end);
                begin = end;
            }
            this.endGeometry(feature);
        }
        else {
            var geometryWidths = textState.overflow ? null : [];
            switch (geometryType) {
                case GeometryType.POINT:
                case GeometryType.MULTI_POINT:
                    flatCoordinates =
                        /** @type {import("../../geom/MultiPoint.js").default} */ (geometry).getFlatCoordinates();
                    break;
                case GeometryType.LINE_STRING:
                    flatCoordinates =
                        /** @type {import("../../geom/LineString.js").default} */ (geometry).getFlatMidpoint();
                    break;
                case GeometryType.CIRCLE:
                    flatCoordinates =
                        /** @type {import("../../geom/Circle.js").default} */ (geometry).getCenter();
                    break;
                case GeometryType.MULTI_LINE_STRING:
                    flatCoordinates =
                        /** @type {import("../../geom/MultiLineString.js").default} */ (geometry).getFlatMidpoints();
                    stride = 2;
                    break;
                case GeometryType.POLYGON:
                    flatCoordinates =
                        /** @type {import("../../geom/Polygon.js").default} */ (geometry).getFlatInteriorPoint();
                    if (!textState.overflow) {
                        geometryWidths.push(flatCoordinates[2] / this.resolution);
                    }
                    stride = 3;
                    break;
                case GeometryType.MULTI_POLYGON:
                    var interiorPoints = 
                    /** @type {import("../../geom/MultiPolygon.js").default} */ (geometry).getFlatInteriorPoints();
                    flatCoordinates = [];
                    for (var i = 0, ii = interiorPoints.length; i < ii; i += 3) {
                        if (!textState.overflow) {
                            geometryWidths.push(interiorPoints[i + 2] / this.resolution);
                        }
                        flatCoordinates.push(interiorPoints[i], interiorPoints[i + 1]);
                    }
                    if (flatCoordinates.length === 0) {
                        return;
                    }
                    stride = 2;
                    break;
            }
            var end = this.appendFlatPointCoordinates(flatCoordinates, stride);
            if (end === begin) {
                return;
            }
            if (geometryWidths &&
                (end - begin) / 2 !== flatCoordinates.length / stride) {
                var beg_1 = begin / 2;
                geometryWidths = geometryWidths.filter(function (w, i) {
                    var keep = coordinates[(beg_1 + i) * 2] === flatCoordinates[i * stride] &&
                        coordinates[(beg_1 + i) * 2 + 1] === flatCoordinates[i * stride + 1];
                    if (!keep) {
                        --beg_1;
                    }
                    return keep;
                });
            }
            this.saveTextStates_();
            if (textState.backgroundFill || textState.backgroundStroke) {
                this.setFillStrokeStyle(textState.backgroundFill, textState.backgroundStroke);
                if (textState.backgroundFill) {
                    this.updateFillStyle(this.state, this.createFill);
                    this.hitDetectionInstructions.push(this.createFill(this.state));
                }
                if (textState.backgroundStroke) {
                    this.updateStrokeStyle(this.state, this.applyStroke);
                    this.hitDetectionInstructions.push(this.createStroke(this.state));
                }
            }
            this.beginGeometry(geometry, feature);
            // adjust padding for negative scale
            var padding = textState.padding;
            if (padding != defaultPadding &&
                (textState.scale[0] < 0 || textState.scale[1] < 0)) {
                var p0 = textState.padding[0];
                var p1 = textState.padding[1];
                var p2 = textState.padding[2];
                var p3 = textState.padding[3];
                if (textState.scale[0] < 0) {
                    p1 = -p1;
                    p3 = -p3;
                }
                if (textState.scale[1] < 0) {
                    p0 = -p0;
                    p2 = -p2;
                }
                padding = [p0, p1, p2, p3];
            }
            // The image is unknown at this stage so we pass null; it will be computed at render time.
            // For clarity, we pass NaN for offsetX, offsetY, width and height, which will be computed at
            // render time.
            var pixelRatio_1 = this.pixelRatio;
            this.instructions.push([
                Instruction.DRAW_IMAGE,
                begin,
                end,
                null,
                NaN,
                NaN,
                NaN,
                1,
                0,
                0,
                this.textRotateWithView_,
                this.textRotation_,
                [1, 1],
                NaN,
                this.declutterImageWithText_,
                padding == defaultPadding
                    ? defaultPadding
                    : padding.map(function (p) {
                        return p * pixelRatio_1;
                    }),
                !!textState.backgroundFill,
                !!textState.backgroundStroke,
                this.text_,
                this.textKey_,
                this.strokeKey_,
                this.fillKey_,
                this.textOffsetX_,
                this.textOffsetY_,
                geometryWidths,
            ]);
            var scale = 1 / pixelRatio_1;
            this.hitDetectionInstructions.push([
                Instruction.DRAW_IMAGE,
                begin,
                end,
                null,
                NaN,
                NaN,
                NaN,
                1,
                0,
                0,
                this.textRotateWithView_,
                this.textRotation_,
                [scale, scale],
                NaN,
                this.declutterImageWithText_,
                padding,
                !!textState.backgroundFill,
                !!textState.backgroundStroke,
                this.text_,
                this.textKey_,
                this.strokeKey_,
                this.fillKey_,
                this.textOffsetX_,
                this.textOffsetY_,
                geometryWidths,
            ]);
            this.endGeometry(feature);
        }
    };
    /**
     * @private
     */
    CanvasTextBuilder.prototype.saveTextStates_ = function () {
        var strokeState = this.textStrokeState_;
        var textState = this.textState_;
        var fillState = this.textFillState_;
        var strokeKey = this.strokeKey_;
        if (strokeState) {
            if (!(strokeKey in this.strokeStates)) {
                this.strokeStates[strokeKey] = {
                    strokeStyle: strokeState.strokeStyle,
                    lineCap: strokeState.lineCap,
                    lineDashOffset: strokeState.lineDashOffset,
                    lineWidth: strokeState.lineWidth,
                    lineJoin: strokeState.lineJoin,
                    miterLimit: strokeState.miterLimit,
                    lineDash: strokeState.lineDash,
                };
            }
        }
        var textKey = this.textKey_;
        if (!(textKey in this.textStates)) {
            this.textStates[textKey] = {
                font: textState.font,
                textAlign: textState.textAlign || defaultTextAlign,
                textBaseline: textState.textBaseline || defaultTextBaseline,
                scale: textState.scale,
            };
        }
        var fillKey = this.fillKey_;
        if (fillState) {
            if (!(fillKey in this.fillStates)) {
                this.fillStates[fillKey] = {
                    fillStyle: fillState.fillStyle,
                };
            }
        }
    };
    /**
     * @private
     * @param {number} begin Begin.
     * @param {number} end End.
     */
    CanvasTextBuilder.prototype.drawChars_ = function (begin, end) {
        var strokeState = this.textStrokeState_;
        var textState = this.textState_;
        var strokeKey = this.strokeKey_;
        var textKey = this.textKey_;
        var fillKey = this.fillKey_;
        this.saveTextStates_();
        var pixelRatio = this.pixelRatio;
        var baseline = TEXT_ALIGN[textState.textBaseline];
        var offsetY = this.textOffsetY_ * pixelRatio;
        var text = this.text_;
        var strokeWidth = strokeState
            ? (strokeState.lineWidth * Math.abs(textState.scale[0])) / 2
            : 0;
        this.instructions.push([
            Instruction.DRAW_CHARS,
            begin,
            end,
            baseline,
            textState.overflow,
            fillKey,
            textState.maxAngle,
            pixelRatio,
            offsetY,
            strokeKey,
            strokeWidth * pixelRatio,
            text,
            textKey,
            1,
        ]);
        this.hitDetectionInstructions.push([
            Instruction.DRAW_CHARS,
            begin,
            end,
            baseline,
            textState.overflow,
            fillKey,
            textState.maxAngle,
            1,
            offsetY,
            strokeKey,
            strokeWidth,
            text,
            textKey,
            1 / pixelRatio,
        ]);
    };
    /**
     * @param {import("../../style/Text.js").default} textStyle Text style.
     * @param {Object} [opt_sharedData] Shared data.
     */
    CanvasTextBuilder.prototype.setTextStyle = function (textStyle, opt_sharedData) {
        var textState, fillState, strokeState;
        if (!textStyle) {
            this.text_ = '';
        }
        else {
            var textFillStyle = textStyle.getFill();
            if (!textFillStyle) {
                fillState = null;
                this.textFillState_ = fillState;
            }
            else {
                fillState = this.textFillState_;
                if (!fillState) {
                    fillState = /** @type {import("../canvas.js").FillState} */ ({});
                    this.textFillState_ = fillState;
                }
                fillState.fillStyle = asColorLike(textFillStyle.getColor() || defaultFillStyle);
            }
            var textStrokeStyle = textStyle.getStroke();
            if (!textStrokeStyle) {
                strokeState = null;
                this.textStrokeState_ = strokeState;
            }
            else {
                strokeState = this.textStrokeState_;
                if (!strokeState) {
                    strokeState = /** @type {import("../canvas.js").StrokeState} */ ({});
                    this.textStrokeState_ = strokeState;
                }
                var lineDash = textStrokeStyle.getLineDash();
                var lineDashOffset = textStrokeStyle.getLineDashOffset();
                var lineWidth = textStrokeStyle.getWidth();
                var miterLimit = textStrokeStyle.getMiterLimit();
                strokeState.lineCap = textStrokeStyle.getLineCap() || defaultLineCap;
                strokeState.lineDash = lineDash ? lineDash.slice() : defaultLineDash;
                strokeState.lineDashOffset =
                    lineDashOffset === undefined ? defaultLineDashOffset : lineDashOffset;
                strokeState.lineJoin = textStrokeStyle.getLineJoin() || defaultLineJoin;
                strokeState.lineWidth =
                    lineWidth === undefined ? defaultLineWidth : lineWidth;
                strokeState.miterLimit =
                    miterLimit === undefined ? defaultMiterLimit : miterLimit;
                strokeState.strokeStyle = asColorLike(textStrokeStyle.getColor() || defaultStrokeStyle);
            }
            textState = this.textState_;
            var font = textStyle.getFont() || defaultFont;
            registerFont(font);
            var textScale = textStyle.getScaleArray();
            textState.overflow = textStyle.getOverflow();
            textState.font = font;
            textState.maxAngle = textStyle.getMaxAngle();
            textState.placement = textStyle.getPlacement();
            textState.textAlign = textStyle.getTextAlign();
            textState.textBaseline =
                textStyle.getTextBaseline() || defaultTextBaseline;
            textState.backgroundFill = textStyle.getBackgroundFill();
            textState.backgroundStroke = textStyle.getBackgroundStroke();
            textState.padding = textStyle.getPadding() || defaultPadding;
            textState.scale = textScale === undefined ? [1, 1] : textScale;
            var textOffsetX = textStyle.getOffsetX();
            var textOffsetY = textStyle.getOffsetY();
            var textRotateWithView = textStyle.getRotateWithView();
            var textRotation = textStyle.getRotation();
            this.text_ = textStyle.getText() || '';
            this.textOffsetX_ = textOffsetX === undefined ? 0 : textOffsetX;
            this.textOffsetY_ = textOffsetY === undefined ? 0 : textOffsetY;
            this.textRotateWithView_ =
                textRotateWithView === undefined ? false : textRotateWithView;
            this.textRotation_ = textRotation === undefined ? 0 : textRotation;
            this.strokeKey_ = strokeState
                ? (typeof strokeState.strokeStyle == 'string'
                    ? strokeState.strokeStyle
                    : getUid(strokeState.strokeStyle)) +
                    strokeState.lineCap +
                    strokeState.lineDashOffset +
                    '|' +
                    strokeState.lineWidth +
                    strokeState.lineJoin +
                    strokeState.miterLimit +
                    '[' +
                    strokeState.lineDash.join() +
                    ']'
                : '';
            this.textKey_ =
                textState.font +
                    textState.scale +
                    (textState.textAlign || '?') +
                    (textState.textBaseline || '?');
            this.fillKey_ = fillState
                ? typeof fillState.fillStyle == 'string'
                    ? fillState.fillStyle
                    : '|' + getUid(fillState.fillStyle)
                : '';
        }
        this.declutterImageWithText_ = opt_sharedData;
    };
    return CanvasTextBuilder;
}(CanvasBuilder));

/**
 * @module ol/render/canvas/BuilderGroup
 */
/**
 * @type {Object<import("./BuilderType").default, typeof Builder>}
 */
var BATCH_CONSTRUCTORS = {
    'Circle': CanvasPolygonBuilder,
    'Default': CanvasBuilder,
    'Image': CanvasImageBuilder,
    'LineString': CanvasLineStringBuilder,
    'Polygon': CanvasPolygonBuilder,
    'Text': CanvasTextBuilder,
};
var BuilderGroup = /** @class */ (function () {
    /**
     * @param {number} tolerance Tolerance.
     * @param {import("../../extent.js").Extent} maxExtent Max extent.
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     */
    function BuilderGroup(tolerance, maxExtent, resolution, pixelRatio) {
        /**
         * @private
         * @type {number}
         */
        this.tolerance_ = tolerance;
        /**
         * @private
         * @type {import("../../extent.js").Extent}
         */
        this.maxExtent_ = maxExtent;
        /**
         * @private
         * @type {number}
         */
        this.pixelRatio_ = pixelRatio;
        /**
         * @private
         * @type {number}
         */
        this.resolution_ = resolution;
        /**
         * @private
         * @type {!Object<string, !Object<import("./BuilderType").default, Builder>>}
         */
        this.buildersByZIndex_ = {};
    }
    /**
     * @return {!Object<string, !Object<import("./BuilderType").default, import("./Builder.js").SerializableInstructions>>} The serializable instructions
     */
    BuilderGroup.prototype.finish = function () {
        var builderInstructions = {};
        for (var zKey in this.buildersByZIndex_) {
            builderInstructions[zKey] = builderInstructions[zKey] || {};
            var builders = this.buildersByZIndex_[zKey];
            for (var builderKey in builders) {
                var builderInstruction = builders[builderKey].finish();
                builderInstructions[zKey][builderKey] = builderInstruction;
            }
        }
        return builderInstructions;
    };
    /**
     * @param {number|undefined} zIndex Z index.
     * @param {import("./BuilderType.js").default} builderType Replay type.
     * @return {import("../VectorContext.js").default} Replay.
     */
    BuilderGroup.prototype.getBuilder = function (zIndex, builderType) {
        var zIndexKey = zIndex !== undefined ? zIndex.toString() : '0';
        var replays = this.buildersByZIndex_[zIndexKey];
        if (replays === undefined) {
            replays = {};
            this.buildersByZIndex_[zIndexKey] = replays;
        }
        var replay = replays[builderType];
        if (replay === undefined) {
            var Constructor = BATCH_CONSTRUCTORS[builderType];
            replay = new Constructor(this.tolerance_, this.maxExtent_, this.resolution_, this.pixelRatio_);
            replays[builderType] = replay;
        }
        return replay;
    };
    return BuilderGroup;
}());

/**
 * @module ol/render/canvas/BuilderType
 */
/**
 * @enum {string}
 */
var BuilderType = {
    CIRCLE: 'Circle',
    DEFAULT: 'Default',
    IMAGE: 'Image',
    LINE_STRING: 'LineString',
    POLYGON: 'Polygon',
    TEXT: 'Text',
};

/**
 * @module ol/geom/flat/textpath
 */
/**
 * @param {Array<number>} flatCoordinates Path to put text on.
 * @param {number} offset Start offset of the `flatCoordinates`.
 * @param {number} end End offset of the `flatCoordinates`.
 * @param {number} stride Stride.
 * @param {string} text Text to place on the path.
 * @param {number} startM m along the path where the text starts.
 * @param {number} maxAngle Max angle between adjacent chars in radians.
 * @param {number} scale The product of the text scale and the device pixel ratio.
 * @param {function(string, string, Object<string, number>):number} measureAndCacheTextWidth Measure and cache text width.
 * @param {string} font The font.
 * @param {Object<string, number>} cache A cache of measured widths.
 * @param {number} rotation Rotation to apply to the flatCoordinates to determine whether text needs to be reversed.
 * @return {Array<Array<*>>} The result array (or null if `maxAngle` was
 * exceeded). Entries of the array are x, y, anchorX, angle, chunk.
 */
function drawTextOnPath(flatCoordinates, offset, end, stride, text, startM, maxAngle, scale, measureAndCacheTextWidth, font, cache, rotation) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    var x1 = 0;
    var y1 = 0;
    var segmentLength = 0;
    var segmentM = 0;
    function advance() {
        x1 = x2;
        y1 = y2;
        offset += stride;
        x2 = flatCoordinates[offset];
        y2 = flatCoordinates[offset + 1];
        segmentM += segmentLength;
        segmentLength = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
    do {
        advance();
    } while (offset < end - stride && segmentM + segmentLength < startM);
    var interpolate = segmentLength === 0 ? 0 : (startM - segmentM) / segmentLength;
    var beginX = lerp(x1, x2, interpolate);
    var beginY = lerp(y1, y2, interpolate);
    var startOffset = offset - stride;
    var startLength = segmentM;
    var endM = startM + scale * measureAndCacheTextWidth(font, text, cache);
    while (offset < end - stride && segmentM + segmentLength < endM) {
        advance();
    }
    interpolate = segmentLength === 0 ? 0 : (endM - segmentM) / segmentLength;
    var endX = lerp(x1, x2, interpolate);
    var endY = lerp(y1, y2, interpolate);
    // Keep text upright
    var reverse;
    if (rotation) {
        var flat = [beginX, beginY, endX, endY];
        rotate(flat, 0, 4, 2, rotation, flat, flat);
        reverse = flat[0] > flat[2];
    }
    else {
        reverse = beginX > endX;
    }
    var PI = Math.PI;
    var result = [];
    var singleSegment = startOffset + stride === offset;
    offset = startOffset;
    segmentLength = 0;
    segmentM = startLength;
    x2 = flatCoordinates[offset];
    y2 = flatCoordinates[offset + 1];
    var previousAngle;
    // All on the same segment
    if (singleSegment) {
        advance();
        previousAngle = Math.atan2(y2 - y1, x2 - x1);
        if (reverse) {
            previousAngle += previousAngle > 0 ? -PI : PI;
        }
        var x = (endX + beginX) / 2;
        var y = (endY + beginY) / 2;
        result[0] = [x, y, (endM - startM) / 2, previousAngle, text];
        return result;
    }
    for (var i = 0, ii = text.length; i < ii;) {
        advance();
        var angle = Math.atan2(y2 - y1, x2 - x1);
        if (reverse) {
            angle += angle > 0 ? -PI : PI;
        }
        if (previousAngle !== undefined) {
            var delta = angle - previousAngle;
            delta += delta > PI ? -2 * PI : delta < -PI ? 2 * PI : 0;
            if (Math.abs(delta) > maxAngle) {
                return null;
            }
        }
        previousAngle = angle;
        var iStart = i;
        var charLength = 0;
        for (; i < ii; ++i) {
            var index = reverse ? ii - i - 1 : i;
            var len = scale * measureAndCacheTextWidth(font, text[index], cache);
            if (offset + stride < end &&
                segmentM + segmentLength < startM + charLength + len / 2) {
                break;
            }
            charLength += len;
        }
        if (i === iStart) {
            continue;
        }
        var chars = reverse
            ? text.substring(ii - iStart, ii - i)
            : text.substring(iStart, i);
        interpolate =
            segmentLength === 0
                ? 0
                : (startM + charLength / 2 - segmentM) / segmentLength;
        var x = lerp(x1, x2, interpolate);
        var y = lerp(y1, y2, interpolate);
        result.push([x, y, charLength / 2, angle, chars]);
        startM += charLength;
    }
    return result;
}

/**
 * @module ol/render/canvas/Executor
 */
/**
 * @typedef {Object} BBox
 * @property {number} minX Minimal x.
 * @property {number} minY Minimal y.
 * @property {number} maxX Maximal x.
 * @property {number} maxY Maximal y
 * @property {*} value Value.
 */
/**
 * @typedef {Object} ImageOrLabelDimensions
 * @property {number} drawImageX DrawImageX.
 * @property {number} drawImageY DrawImageY.
 * @property {number} drawImageW DrawImageW.
 * @property {number} drawImageH DrawImageH.
 * @property {number} originX OriginX.
 * @property {number} originY OriginY.
 * @property {Array<number>} scale Scale.
 * @property {BBox} declutterBox DeclutterBox.
 * @property {import("../../transform.js").Transform} canvasTransform CanvasTransform.
 */
/**
 * @typedef {{0: CanvasRenderingContext2D, 1: number, 2: import("../canvas.js").Label|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement, 3: ImageOrLabelDimensions, 4: number, 5: Array<*>, 6: Array<*>}} ReplayImageOrLabelArgs
 */
/**
 * @template T
 * @typedef {function(import("../../Feature.js").FeatureLike, import("../../geom/SimpleGeometry.js").default): T} FeatureCallback
 */
/**
 * @type {import("../../extent.js").Extent}
 */
var tmpExtent = createEmpty();
/** @type {import("../../coordinate.js").Coordinate} */
var p1 = [];
/** @type {import("../../coordinate.js").Coordinate} */
var p2 = [];
/** @type {import("../../coordinate.js").Coordinate} */
var p3 = [];
/** @type {import("../../coordinate.js").Coordinate} */
var p4 = [];
/**
 * @param {ReplayImageOrLabelArgs} replayImageOrLabelArgs Arguments to replayImageOrLabel
 * @return {BBox} Declutter bbox.
 */
function getDeclutterBox(replayImageOrLabelArgs) {
    return replayImageOrLabelArgs[3].declutterBox;
}
var rtlRegEx = new RegExp(
/* eslint-disable prettier/prettier */
'[' +
    String.fromCharCode(0x00591) + '-' + String.fromCharCode(0x008ff) +
    String.fromCharCode(0x0fb1d) + '-' + String.fromCharCode(0x0fdff) +
    String.fromCharCode(0x0fe70) + '-' + String.fromCharCode(0x0fefc) +
    String.fromCharCode(0x10800) + '-' + String.fromCharCode(0x10fff) +
    String.fromCharCode(0x1e800) + '-' + String.fromCharCode(0x1efff) +
    ']'
/* eslint-enable prettier/prettier */
);
/**
 * @param {string} text Text.
 * @param {string} align Alignment.
 * @return {number} Text alignment.
 */
function horizontalTextAlign(text, align) {
    if ((align === 'start' || align === 'end') && !rtlRegEx.test(text)) {
        align = align === 'start' ? 'left' : 'right';
    }
    return TEXT_ALIGN[align];
}
var Executor = /** @class */ (function () {
    /**
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     * @param {boolean} overlaps The replay can have overlapping geometries.
     * @param {import("../canvas.js").SerializableInstructions} instructions The serializable instructions
     */
    function Executor(resolution, pixelRatio, overlaps, instructions) {
        /**
         * @protected
         * @type {boolean}
         */
        this.overlaps = overlaps;
        /**
         * @protected
         * @type {number}
         */
        this.pixelRatio = pixelRatio;
        /**
         * @protected
         * @const
         * @type {number}
         */
        this.resolution = resolution;
        /**
         * @private
         * @type {boolean}
         */
        this.alignFill_;
        /**
         * @protected
         * @type {Array<*>}
         */
        this.instructions = instructions.instructions;
        /**
         * @protected
         * @type {Array<number>}
         */
        this.coordinates = instructions.coordinates;
        /**
         * @private
         * @type {!Object<number,import("../../coordinate.js").Coordinate|Array<import("../../coordinate.js").Coordinate>|Array<Array<import("../../coordinate.js").Coordinate>>>}
         */
        this.coordinateCache_ = {};
        /**
         * @private
         * @type {!import("../../transform.js").Transform}
         */
        this.renderedTransform_ = create();
        /**
         * @protected
         * @type {Array<*>}
         */
        this.hitDetectionInstructions = instructions.hitDetectionInstructions;
        /**
         * @private
         * @type {Array<number>}
         */
        this.pixelCoordinates_ = null;
        /**
         * @private
         * @type {number}
         */
        this.viewRotation_ = 0;
        /**
         * @type {!Object<string, import("../canvas.js").FillState>}
         */
        this.fillStates = instructions.fillStates || {};
        /**
         * @type {!Object<string, import("../canvas.js").StrokeState>}
         */
        this.strokeStates = instructions.strokeStates || {};
        /**
         * @type {!Object<string, import("../canvas.js").TextState>}
         */
        this.textStates = instructions.textStates || {};
        /**
         * @private
         * @type {Object<string, Object<string, number>>}
         */
        this.widths_ = {};
        /**
         * @private
         * @type {Object<string, import("../canvas.js").Label>}
         */
        this.labels_ = {};
    }
    /**
     * @param {string} text Text.
     * @param {string} textKey Text style key.
     * @param {string} fillKey Fill style key.
     * @param {string} strokeKey Stroke style key.
     * @return {import("../canvas.js").Label} Label.
     */
    Executor.prototype.createLabel = function (text, textKey, fillKey, strokeKey) {
        var key = text + textKey + fillKey + strokeKey;
        if (this.labels_[key]) {
            return this.labels_[key];
        }
        var strokeState = strokeKey ? this.strokeStates[strokeKey] : null;
        var fillState = fillKey ? this.fillStates[fillKey] : null;
        var textState = this.textStates[textKey];
        var pixelRatio = this.pixelRatio;
        var scale = [
            textState.scale[0] * pixelRatio,
            textState.scale[1] * pixelRatio,
        ];
        var align = horizontalTextAlign(text, textState.textAlign || defaultTextAlign);
        var strokeWidth = strokeKey && strokeState.lineWidth ? strokeState.lineWidth : 0;
        var lines = text.split('\n');
        var numLines = lines.length;
        var widths = [];
        var width = measureTextWidths(textState.font, lines, widths);
        var lineHeight = measureTextHeight(textState.font);
        var height = lineHeight * numLines;
        var renderWidth = width + strokeWidth;
        var contextInstructions = [];
        // make canvas 2 pixels wider to account for italic text width measurement errors
        var w = (renderWidth + 2) * scale[0];
        var h = (height + strokeWidth) * scale[1];
        /** @type {import("../canvas.js").Label} */
        var label = {
            width: w < 0 ? Math.floor(w) : Math.ceil(w),
            height: h < 0 ? Math.floor(h) : Math.ceil(h),
            contextInstructions: contextInstructions,
        };
        if (scale[0] != 1 || scale[1] != 1) {
            contextInstructions.push('scale', scale);
        }
        contextInstructions.push('font', textState.font);
        if (strokeKey) {
            contextInstructions.push('strokeStyle', strokeState.strokeStyle);
            contextInstructions.push('lineWidth', strokeWidth);
            contextInstructions.push('lineCap', strokeState.lineCap);
            contextInstructions.push('lineJoin', strokeState.lineJoin);
            contextInstructions.push('miterLimit', strokeState.miterLimit);
            // eslint-disable-next-line
            var Context = WORKER_OFFSCREEN_CANVAS ? OffscreenCanvasRenderingContext2D : CanvasRenderingContext2D;
            if (Context.prototype.setLineDash) {
                contextInstructions.push('setLineDash', [strokeState.lineDash]);
                contextInstructions.push('lineDashOffset', strokeState.lineDashOffset);
            }
        }
        if (fillKey) {
            contextInstructions.push('fillStyle', fillState.fillStyle);
        }
        contextInstructions.push('textBaseline', 'middle');
        contextInstructions.push('textAlign', 'center');
        var leftRight = 0.5 - align;
        var x = align * renderWidth + leftRight * strokeWidth;
        var i;
        if (strokeKey) {
            for (i = 0; i < numLines; ++i) {
                contextInstructions.push('strokeText', [
                    lines[i],
                    x + leftRight * widths[i],
                    0.5 * (strokeWidth + lineHeight) + i * lineHeight,
                ]);
            }
        }
        if (fillKey) {
            for (i = 0; i < numLines; ++i) {
                contextInstructions.push('fillText', [
                    lines[i],
                    x + leftRight * widths[i],
                    0.5 * (strokeWidth + lineHeight) + i * lineHeight,
                ]);
            }
        }
        this.labels_[key] = label;
        return label;
    };
    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {import("../../coordinate.js").Coordinate} p1 1st point of the background box.
     * @param {import("../../coordinate.js").Coordinate} p2 2nd point of the background box.
     * @param {import("../../coordinate.js").Coordinate} p3 3rd point of the background box.
     * @param {import("../../coordinate.js").Coordinate} p4 4th point of the background box.
     * @param {Array<*>} fillInstruction Fill instruction.
     * @param {Array<*>} strokeInstruction Stroke instruction.
     */
    Executor.prototype.replayTextBackground_ = function (context, p1, p2, p3, p4, fillInstruction, strokeInstruction) {
        context.beginPath();
        context.moveTo.apply(context, p1);
        context.lineTo.apply(context, p2);
        context.lineTo.apply(context, p3);
        context.lineTo.apply(context, p4);
        context.lineTo.apply(context, p1);
        if (fillInstruction) {
            this.alignFill_ = /** @type {boolean} */ (fillInstruction[2]);
            this.fill_(context);
        }
        if (strokeInstruction) {
            this.setStrokeStyle_(context, 
            /** @type {Array<*>} */ (strokeInstruction));
            context.stroke();
        }
    };
    /**
     * @private
     * @param {number} sheetWidth Width of the sprite sheet.
     * @param {number} sheetHeight Height of the sprite sheet.
     * @param {number} centerX X.
     * @param {number} centerY Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * @param {number} anchorX Anchor X.
     * @param {number} anchorY Anchor Y.
     * @param {number} originX Origin X.
     * @param {number} originY Origin Y.
     * @param {number} rotation Rotation.
     * @param {import("../../size.js").Size} scale Scale.
     * @param {boolean} snapToPixel Snap to pixel.
     * @param {Array<number>} padding Padding.
     * @param {boolean} fillStroke Background fill or stroke.
     * @param {import("../../Feature.js").FeatureLike} feature Feature.
     * @return {ImageOrLabelDimensions} Dimensions for positioning and decluttering the image or label.
     */
    Executor.prototype.calculateImageOrLabelDimensions_ = function (sheetWidth, sheetHeight, centerX, centerY, width, height, anchorX, anchorY, originX, originY, rotation, scale, snapToPixel, padding, fillStroke, feature) {
        anchorX *= scale[0];
        anchorY *= scale[1];
        var x = centerX - anchorX;
        var y = centerY - anchorY;
        var w = width + originX > sheetWidth ? sheetWidth - originX : width;
        var h = height + originY > sheetHeight ? sheetHeight - originY : height;
        var boxW = padding[3] + w * scale[0] + padding[1];
        var boxH = padding[0] + h * scale[1] + padding[2];
        var boxX = x - padding[3];
        var boxY = y - padding[0];
        if (fillStroke || rotation !== 0) {
            p1[0] = boxX;
            p4[0] = boxX;
            p1[1] = boxY;
            p2[1] = boxY;
            p2[0] = boxX + boxW;
            p3[0] = p2[0];
            p3[1] = boxY + boxH;
            p4[1] = p3[1];
        }
        var transform;
        if (rotation !== 0) {
            transform = compose(create(), centerX, centerY, 1, 1, rotation, -centerX, -centerY);
            apply(transform, p1);
            apply(transform, p2);
            apply(transform, p3);
            apply(transform, p4);
            createOrUpdate(Math.min(p1[0], p2[0], p3[0], p4[0]), Math.min(p1[1], p2[1], p3[1], p4[1]), Math.max(p1[0], p2[0], p3[0], p4[0]), Math.max(p1[1], p2[1], p3[1], p4[1]), tmpExtent);
        }
        else {
            createOrUpdate(Math.min(boxX, boxX + boxW), Math.min(boxY, boxY + boxH), Math.max(boxX, boxX + boxW), Math.max(boxY, boxY + boxH), tmpExtent);
        }
        if (snapToPixel) {
            x = Math.round(x);
            y = Math.round(y);
        }
        return {
            drawImageX: x,
            drawImageY: y,
            drawImageW: w,
            drawImageH: h,
            originX: originX,
            originY: originY,
            declutterBox: {
                minX: tmpExtent[0],
                minY: tmpExtent[1],
                maxX: tmpExtent[2],
                maxY: tmpExtent[3],
                value: feature,
            },
            canvasTransform: transform,
            scale: scale,
        };
    };
    /**
     * @private
     * @param {CanvasRenderingContext2D} context Context.
     * @param {number} contextScale Scale of the context.
     * @param {import("../canvas.js").Label|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} imageOrLabel Image.
     * @param {ImageOrLabelDimensions} dimensions Dimensions.
     * @param {number} opacity Opacity.
     * @param {Array<*>} fillInstruction Fill instruction.
     * @param {Array<*>} strokeInstruction Stroke instruction.
     * @return {boolean} The image or label was rendered.
     */
    Executor.prototype.replayImageOrLabel_ = function (context, contextScale, imageOrLabel, dimensions, opacity, fillInstruction, strokeInstruction) {
        var fillStroke = !!(fillInstruction || strokeInstruction);
        var box = dimensions.declutterBox;
        var canvas = context.canvas;
        var strokePadding = strokeInstruction
            ? (strokeInstruction[2] * dimensions.scale[0]) / 2
            : 0;
        var intersects = box.minX - strokePadding <= canvas.width / contextScale &&
            box.maxX + strokePadding >= 0 &&
            box.minY - strokePadding <= canvas.height / contextScale &&
            box.maxY + strokePadding >= 0;
        if (intersects) {
            if (fillStroke) {
                this.replayTextBackground_(context, p1, p2, p3, p4, 
                /** @type {Array<*>} */ (fillInstruction), 
                /** @type {Array<*>} */ (strokeInstruction));
            }
            drawImageOrLabel(context, dimensions.canvasTransform, opacity, imageOrLabel, dimensions.originX, dimensions.originY, dimensions.drawImageW, dimensions.drawImageH, dimensions.drawImageX, dimensions.drawImageY, dimensions.scale);
        }
        return true;
    };
    /**
     * @private
     * @param {CanvasRenderingContext2D} context Context.
     */
    Executor.prototype.fill_ = function (context) {
        if (this.alignFill_) {
            var origin_1 = apply(this.renderedTransform_, [0, 0]);
            var repeatSize = 512 * this.pixelRatio;
            context.save();
            context.translate(origin_1[0] % repeatSize, origin_1[1] % repeatSize);
            context.rotate(this.viewRotation_);
        }
        context.fill();
        if (this.alignFill_) {
            context.restore();
        }
    };
    /**
     * @private
     * @param {CanvasRenderingContext2D} context Context.
     * @param {Array<*>} instruction Instruction.
     */
    Executor.prototype.setStrokeStyle_ = function (context, instruction) {
        context['strokeStyle'] =
            /** @type {import("../../colorlike.js").ColorLike} */ (instruction[1]);
        context.lineWidth = /** @type {number} */ (instruction[2]);
        context.lineCap = /** @type {CanvasLineCap} */ (instruction[3]);
        context.lineJoin = /** @type {CanvasLineJoin} */ (instruction[4]);
        context.miterLimit = /** @type {number} */ (instruction[5]);
        if (context.setLineDash) {
            context.lineDashOffset = /** @type {number} */ (instruction[7]);
            context.setLineDash(/** @type {Array<number>} */ (instruction[6]));
        }
    };
    /**
     * @private
     * @param {string} text The text to draw.
     * @param {string} textKey The key of the text state.
     * @param {string} strokeKey The key for the stroke state.
     * @param {string} fillKey The key for the fill state.
     * @return {{label: import("../canvas.js").Label, anchorX: number, anchorY: number}} The text image and its anchor.
     */
    Executor.prototype.drawLabelWithPointPlacement_ = function (text, textKey, strokeKey, fillKey) {
        var textState = this.textStates[textKey];
        var label = this.createLabel(text, textKey, fillKey, strokeKey);
        var strokeState = this.strokeStates[strokeKey];
        var pixelRatio = this.pixelRatio;
        var align = horizontalTextAlign(text, textState.textAlign || defaultTextAlign);
        var baseline = TEXT_ALIGN[textState.textBaseline || defaultTextBaseline];
        var strokeWidth = strokeState && strokeState.lineWidth ? strokeState.lineWidth : 0;
        // Remove the 2 pixels we added in createLabel() for the anchor
        var width = label.width / pixelRatio - 2 * textState.scale[0];
        var anchorX = align * width + 2 * (0.5 - align) * strokeWidth;
        var anchorY = (baseline * label.height) / pixelRatio +
            2 * (0.5 - baseline) * strokeWidth;
        return {
            label: label,
            anchorX: anchorX,
            anchorY: anchorY,
        };
    };
    /**
     * @private
     * @param {CanvasRenderingContext2D} context Context.
     * @param {number} contextScale Scale of the context.
     * @param {import("../../transform.js").Transform} transform Transform.
     * @param {Array<*>} instructions Instructions array.
     * @param {boolean} snapToPixel Snap point symbols and text to integer pixels.
     * @param {FeatureCallback<T>} [opt_featureCallback] Feature callback.
     * @param {import("../../extent.js").Extent} [opt_hitExtent] Only check
     *     features that intersect this extent.
     * @param {import("rbush").default} [opt_declutterTree] Declutter tree.
     * @return {T|undefined} Callback result.
     * @template T
     */
    Executor.prototype.execute_ = function (context, contextScale, transform, instructions, snapToPixel, opt_featureCallback, opt_hitExtent, opt_declutterTree) {
        /** @type {Array<number>} */
        var pixelCoordinates;
        if (this.pixelCoordinates_ && equals(transform, this.renderedTransform_)) {
            pixelCoordinates = this.pixelCoordinates_;
        }
        else {
            if (!this.pixelCoordinates_) {
                this.pixelCoordinates_ = [];
            }
            pixelCoordinates = transform2D(this.coordinates, 0, this.coordinates.length, 2, transform, this.pixelCoordinates_);
            setFromArray(this.renderedTransform_, transform);
        }
        var i = 0; // instruction index
        var ii = instructions.length; // end of instructions
        var d = 0; // data index
        var dd; // end of per-instruction data
        var anchorX, anchorY, prevX, prevY, roundX, roundY, image, text, textKey, strokeKey, fillKey;
        var pendingFill = 0;
        var pendingStroke = 0;
        var lastFillInstruction = null;
        var lastStrokeInstruction = null;
        var coordinateCache = this.coordinateCache_;
        var viewRotation = this.viewRotation_;
        var viewRotationFromTransform = Math.round(Math.atan2(-transform[1], transform[0]) * 1e12) / 1e12;
        var state = /** @type {import("../../render.js").State} */ ({
            context: context,
            pixelRatio: this.pixelRatio,
            resolution: this.resolution,
            rotation: viewRotation,
        });
        // When the batch size gets too big, performance decreases. 200 is a good
        // balance between batch size and number of fill/stroke instructions.
        var batchSize = this.instructions != instructions || this.overlaps ? 0 : 200;
        var /** @type {import("../../Feature.js").FeatureLike} */ feature;
        var x, y, currentGeometry;
        while (i < ii) {
            var instruction = instructions[i];
            var type = /** @type {import("./Instruction.js").default} */ (instruction[0]);
            switch (type) {
                case Instruction.BEGIN_GEOMETRY:
                    feature = /** @type {import("../../Feature.js").FeatureLike} */ (instruction[1]);
                    currentGeometry = instruction[3];
                    if (!feature.getGeometry()) {
                        i = /** @type {number} */ (instruction[2]);
                    }
                    else if (opt_hitExtent !== undefined &&
                        !intersects(opt_hitExtent, currentGeometry.getExtent())) {
                        i = /** @type {number} */ (instruction[2]) + 1;
                    }
                    else {
                        ++i;
                    }
                    break;
                case Instruction.BEGIN_PATH:
                    if (pendingFill > batchSize) {
                        this.fill_(context);
                        pendingFill = 0;
                    }
                    if (pendingStroke > batchSize) {
                        context.stroke();
                        pendingStroke = 0;
                    }
                    if (!pendingFill && !pendingStroke) {
                        context.beginPath();
                        prevX = NaN;
                        prevY = NaN;
                    }
                    ++i;
                    break;
                case Instruction.CIRCLE:
                    d = /** @type {number} */ (instruction[1]);
                    var x1 = pixelCoordinates[d];
                    var y1 = pixelCoordinates[d + 1];
                    var x2 = pixelCoordinates[d + 2];
                    var y2 = pixelCoordinates[d + 3];
                    var dx = x2 - x1;
                    var dy = y2 - y1;
                    var r = Math.sqrt(dx * dx + dy * dy);
                    context.moveTo(x1 + r, y1);
                    context.arc(x1, y1, r, 0, 2 * Math.PI, true);
                    ++i;
                    break;
                case Instruction.CLOSE_PATH:
                    context.closePath();
                    ++i;
                    break;
                case Instruction.CUSTOM:
                    d = /** @type {number} */ (instruction[1]);
                    dd = instruction[2];
                    var geometry = 
                    /** @type {import("../../geom/SimpleGeometry.js").default} */ (instruction[3]);
                    var renderer = instruction[4];
                    var fn = instruction.length == 6 ? instruction[5] : undefined;
                    state.geometry = geometry;
                    state.feature = feature;
                    if (!(i in coordinateCache)) {
                        coordinateCache[i] = [];
                    }
                    var coords = coordinateCache[i];
                    if (fn) {
                        fn(pixelCoordinates, d, dd, 2, coords);
                    }
                    else {
                        coords[0] = pixelCoordinates[d];
                        coords[1] = pixelCoordinates[d + 1];
                        coords.length = 2;
                    }
                    renderer(coords, state);
                    ++i;
                    break;
                case Instruction.DRAW_IMAGE:
                    d = /** @type {number} */ (instruction[1]);
                    dd = /** @type {number} */ (instruction[2]);
                    image =
                        /** @type {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} */ (instruction[3]);
                    // Remaining arguments in DRAW_IMAGE are in alphabetical order
                    anchorX = /** @type {number} */ (instruction[4]);
                    anchorY = /** @type {number} */ (instruction[5]);
                    var height = /** @type {number} */ (instruction[6]);
                    var opacity = /** @type {number} */ (instruction[7]);
                    var originX = /** @type {number} */ (instruction[8]);
                    var originY = /** @type {number} */ (instruction[9]);
                    var rotateWithView = /** @type {boolean} */ (instruction[10]);
                    var rotation = /** @type {number} */ (instruction[11]);
                    var scale = /** @type {import("../../size.js").Size} */ (instruction[12]);
                    var width = /** @type {number} */ (instruction[13]);
                    var declutterImageWithText = 
                    /** @type {import("../canvas.js").DeclutterImageWithText} */ (instruction[14]);
                    if (!image && instruction.length >= 19) {
                        // create label images
                        text = /** @type {string} */ (instruction[18]);
                        textKey = /** @type {string} */ (instruction[19]);
                        strokeKey = /** @type {string} */ (instruction[20]);
                        fillKey = /** @type {string} */ (instruction[21]);
                        var labelWithAnchor = this.drawLabelWithPointPlacement_(text, textKey, strokeKey, fillKey);
                        image = labelWithAnchor.label;
                        instruction[3] = image;
                        var textOffsetX = /** @type {number} */ (instruction[22]);
                        anchorX = (labelWithAnchor.anchorX - textOffsetX) * this.pixelRatio;
                        instruction[4] = anchorX;
                        var textOffsetY = /** @type {number} */ (instruction[23]);
                        anchorY = (labelWithAnchor.anchorY - textOffsetY) * this.pixelRatio;
                        instruction[5] = anchorY;
                        height = image.height;
                        instruction[6] = height;
                        width = image.width;
                        instruction[13] = width;
                    }
                    var geometryWidths = void 0;
                    if (instruction.length > 24) {
                        geometryWidths = /** @type {number} */ (instruction[24]);
                    }
                    var padding = void 0, backgroundFill = void 0, backgroundStroke = void 0;
                    if (instruction.length > 16) {
                        padding = /** @type {Array<number>} */ (instruction[15]);
                        backgroundFill = /** @type {boolean} */ (instruction[16]);
                        backgroundStroke = /** @type {boolean} */ (instruction[17]);
                    }
                    else {
                        padding = defaultPadding;
                        backgroundFill = false;
                        backgroundStroke = false;
                    }
                    if (rotateWithView && viewRotationFromTransform) {
                        // Canvas is expected to be rotated to reverse view rotation.
                        rotation += viewRotation;
                    }
                    else if (!rotateWithView && !viewRotationFromTransform) {
                        // Canvas is not rotated, images need to be rotated back to be north-up.
                        rotation -= viewRotation;
                    }
                    var widthIndex = 0;
                    for (; d < dd; d += 2) {
                        if (geometryWidths &&
                            geometryWidths[widthIndex++] < width / this.pixelRatio) {
                            continue;
                        }
                        var dimensions = this.calculateImageOrLabelDimensions_(image.width, image.height, pixelCoordinates[d], pixelCoordinates[d + 1], width, height, anchorX, anchorY, originX, originY, rotation, scale, snapToPixel, padding, backgroundFill || backgroundStroke, feature);
                        /** @type {ReplayImageOrLabelArgs} */
                        var args = [
                            context,
                            contextScale,
                            image,
                            dimensions,
                            opacity,
                            backgroundFill
                                ? /** @type {Array<*>} */ (lastFillInstruction)
                                : null,
                            backgroundStroke
                                ? /** @type {Array<*>} */ (lastStrokeInstruction)
                                : null,
                        ];
                        var imageArgs = void 0;
                        var imageDeclutterBox = void 0;
                        if (opt_declutterTree && declutterImageWithText) {
                            var index = dd - d;
                            if (!declutterImageWithText[index]) {
                                // We now have the image for an image+text combination.
                                declutterImageWithText[index] = args;
                                // Don't render anything for now, wait for the text.
                                continue;
                            }
                            imageArgs = declutterImageWithText[index];
                            delete declutterImageWithText[index];
                            imageDeclutterBox = getDeclutterBox(imageArgs);
                            if (opt_declutterTree.collides(imageDeclutterBox)) {
                                continue;
                            }
                        }
                        if (opt_declutterTree &&
                            opt_declutterTree.collides(dimensions.declutterBox)) {
                            continue;
                        }
                        if (imageArgs) {
                            // We now have image and text for an image+text combination.
                            if (opt_declutterTree) {
                                opt_declutterTree.insert(imageDeclutterBox);
                            }
                            // Render the image before we render the text.
                            this.replayImageOrLabel_.apply(this, imageArgs);
                        }
                        if (opt_declutterTree) {
                            opt_declutterTree.insert(dimensions.declutterBox);
                        }
                        this.replayImageOrLabel_.apply(this, args);
                    }
                    ++i;
                    break;
                case Instruction.DRAW_CHARS:
                    var begin = /** @type {number} */ (instruction[1]);
                    var end = /** @type {number} */ (instruction[2]);
                    var baseline = /** @type {number} */ (instruction[3]);
                    var overflow = /** @type {number} */ (instruction[4]);
                    fillKey = /** @type {string} */ (instruction[5]);
                    var maxAngle = /** @type {number} */ (instruction[6]);
                    var measurePixelRatio = /** @type {number} */ (instruction[7]);
                    var offsetY = /** @type {number} */ (instruction[8]);
                    strokeKey = /** @type {string} */ (instruction[9]);
                    var strokeWidth = /** @type {number} */ (instruction[10]);
                    text = /** @type {string} */ (instruction[11]);
                    textKey = /** @type {string} */ (instruction[12]);
                    var pixelRatioScale = [
                        /** @type {number} */ (instruction[13]),
                        /** @type {number} */ (instruction[13]),
                    ];
                    var textState = this.textStates[textKey];
                    var font = textState.font;
                    var textScale = [
                        textState.scale[0] * measurePixelRatio,
                        textState.scale[1] * measurePixelRatio,
                    ];
                    var cachedWidths = void 0;
                    if (font in this.widths_) {
                        cachedWidths = this.widths_[font];
                    }
                    else {
                        cachedWidths = {};
                        this.widths_[font] = cachedWidths;
                    }
                    var pathLength = lineStringLength(pixelCoordinates, begin, end, 2);
                    var textLength = Math.abs(textScale[0]) *
                        measureAndCacheTextWidth(font, text, cachedWidths);
                    if (overflow || textLength <= pathLength) {
                        var textAlign = this.textStates[textKey].textAlign;
                        var startM = (pathLength - textLength) * TEXT_ALIGN[textAlign];
                        var parts = drawTextOnPath(pixelCoordinates, begin, end, 2, text, startM, maxAngle, Math.abs(textScale[0]), measureAndCacheTextWidth, font, cachedWidths, viewRotationFromTransform ? 0 : this.viewRotation_);
                        drawChars: if (parts) {
                            /** @type {Array<ReplayImageOrLabelArgs>} */
                            var replayImageOrLabelArgs = [];
                            var c = void 0, cc = void 0, chars = void 0, label = void 0, part = void 0;
                            if (strokeKey) {
                                for (c = 0, cc = parts.length; c < cc; ++c) {
                                    part = parts[c]; // x, y, anchorX, rotation, chunk
                                    chars = /** @type {string} */ (part[4]);
                                    label = this.createLabel(chars, textKey, '', strokeKey);
                                    anchorX =
                                        /** @type {number} */ (part[2]) +
                                            (textScale[0] < 0 ? -strokeWidth : strokeWidth);
                                    anchorY =
                                        baseline * label.height +
                                            ((0.5 - baseline) * 2 * strokeWidth * textScale[1]) /
                                                textScale[0] -
                                            offsetY;
                                    var dimensions = this.calculateImageOrLabelDimensions_(label.width, label.height, part[0], part[1], label.width, label.height, anchorX, anchorY, 0, 0, part[3], pixelRatioScale, false, defaultPadding, false, feature);
                                    if (opt_declutterTree &&
                                        opt_declutterTree.collides(dimensions.declutterBox)) {
                                        break drawChars;
                                    }
                                    replayImageOrLabelArgs.push([
                                        context,
                                        contextScale,
                                        label,
                                        dimensions,
                                        1,
                                        null,
                                        null,
                                    ]);
                                }
                            }
                            if (fillKey) {
                                for (c = 0, cc = parts.length; c < cc; ++c) {
                                    part = parts[c]; // x, y, anchorX, rotation, chunk
                                    chars = /** @type {string} */ (part[4]);
                                    label = this.createLabel(chars, textKey, fillKey, '');
                                    anchorX = /** @type {number} */ (part[2]);
                                    anchorY = baseline * label.height - offsetY;
                                    var dimensions = this.calculateImageOrLabelDimensions_(label.width, label.height, part[0], part[1], label.width, label.height, anchorX, anchorY, 0, 0, part[3], pixelRatioScale, false, defaultPadding, false, feature);
                                    if (opt_declutterTree &&
                                        opt_declutterTree.collides(dimensions.declutterBox)) {
                                        break drawChars;
                                    }
                                    replayImageOrLabelArgs.push([
                                        context,
                                        contextScale,
                                        label,
                                        dimensions,
                                        1,
                                        null,
                                        null,
                                    ]);
                                }
                            }
                            if (opt_declutterTree) {
                                opt_declutterTree.load(replayImageOrLabelArgs.map(getDeclutterBox));
                            }
                            for (var i_1 = 0, ii_1 = replayImageOrLabelArgs.length; i_1 < ii_1; ++i_1) {
                                this.replayImageOrLabel_.apply(this, replayImageOrLabelArgs[i_1]);
                            }
                        }
                    }
                    ++i;
                    break;
                case Instruction.END_GEOMETRY:
                    if (opt_featureCallback !== undefined) {
                        feature = /** @type {import("../../Feature.js").FeatureLike} */ (instruction[1]);
                        var result = opt_featureCallback(feature, currentGeometry);
                        if (result) {
                            return result;
                        }
                    }
                    ++i;
                    break;
                case Instruction.FILL:
                    if (batchSize) {
                        pendingFill++;
                    }
                    else {
                        this.fill_(context);
                    }
                    ++i;
                    break;
                case Instruction.MOVE_TO_LINE_TO:
                    d = /** @type {number} */ (instruction[1]);
                    dd = /** @type {number} */ (instruction[2]);
                    x = pixelCoordinates[d];
                    y = pixelCoordinates[d + 1];
                    roundX = (x + 0.5) | 0;
                    roundY = (y + 0.5) | 0;
                    if (roundX !== prevX || roundY !== prevY) {
                        context.moveTo(x, y);
                        prevX = roundX;
                        prevY = roundY;
                    }
                    for (d += 2; d < dd; d += 2) {
                        x = pixelCoordinates[d];
                        y = pixelCoordinates[d + 1];
                        roundX = (x + 0.5) | 0;
                        roundY = (y + 0.5) | 0;
                        if (d == dd - 2 || roundX !== prevX || roundY !== prevY) {
                            context.lineTo(x, y);
                            prevX = roundX;
                            prevY = roundY;
                        }
                    }
                    ++i;
                    break;
                case Instruction.SET_FILL_STYLE:
                    lastFillInstruction = instruction;
                    this.alignFill_ = instruction[2];
                    if (pendingFill) {
                        this.fill_(context);
                        pendingFill = 0;
                        if (pendingStroke) {
                            context.stroke();
                            pendingStroke = 0;
                        }
                    }
                    context.fillStyle =
                        /** @type {import("../../colorlike.js").ColorLike} */ (instruction[1]);
                    ++i;
                    break;
                case Instruction.SET_STROKE_STYLE:
                    lastStrokeInstruction = instruction;
                    if (pendingStroke) {
                        context.stroke();
                        pendingStroke = 0;
                    }
                    this.setStrokeStyle_(context, /** @type {Array<*>} */ (instruction));
                    ++i;
                    break;
                case Instruction.STROKE:
                    if (batchSize) {
                        pendingStroke++;
                    }
                    else {
                        context.stroke();
                    }
                    ++i;
                    break;
                default:
                    ++i; // consume the instruction anyway, to avoid an infinite loop
                    break;
            }
        }
        if (pendingFill) {
            this.fill_(context);
        }
        if (pendingStroke) {
            context.stroke();
        }
        return undefined;
    };
    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {number} contextScale Scale of the context.
     * @param {import("../../transform.js").Transform} transform Transform.
     * @param {number} viewRotation View rotation.
     * @param {boolean} snapToPixel Snap point symbols and text to integer pixels.
     * @param {import("rbush").default} [opt_declutterTree] Declutter tree.
     */
    Executor.prototype.execute = function (context, contextScale, transform, viewRotation, snapToPixel, opt_declutterTree) {
        this.viewRotation_ = viewRotation;
        this.execute_(context, contextScale, transform, this.instructions, snapToPixel, undefined, undefined, opt_declutterTree);
    };
    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {import("../../transform.js").Transform} transform Transform.
     * @param {number} viewRotation View rotation.
     * @param {FeatureCallback<T>} [opt_featureCallback] Feature callback.
     * @param {import("../../extent.js").Extent} [opt_hitExtent] Only check
     *     features that intersect this extent.
     * @return {T|undefined} Callback result.
     * @template T
     */
    Executor.prototype.executeHitDetection = function (context, transform, viewRotation, opt_featureCallback, opt_hitExtent) {
        this.viewRotation_ = viewRotation;
        return this.execute_(context, 1, transform, this.hitDetectionInstructions, true, opt_featureCallback, opt_hitExtent);
    };
    return Executor;
}());

/**
 * @module ol/render/canvas/ExecutorGroup
 */
/**
 * @const
 * @type {Array<import("./BuilderType.js").default>}
 */
var ORDER = [
    BuilderType.POLYGON,
    BuilderType.CIRCLE,
    BuilderType.LINE_STRING,
    BuilderType.IMAGE,
    BuilderType.TEXT,
    BuilderType.DEFAULT,
];
var ExecutorGroup = /** @class */ (function () {
    /**
     * @param {import("../../extent.js").Extent} maxExtent Max extent for clipping. When a
     * `maxExtent` was set on the Builder for this executor group, the same `maxExtent`
     * should be set here, unless the target context does not exceed that extent (which
     * can be the case when rendering to tiles).
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     * @param {boolean} overlaps The executor group can have overlapping geometries.
     * @param {!Object<string, !Object<import("./BuilderType.js").default, import("../canvas.js").SerializableInstructions>>} allInstructions
     * The serializable instructions.
     * @param {number} [opt_renderBuffer] Optional rendering buffer.
     */
    function ExecutorGroup(maxExtent, resolution, pixelRatio, overlaps, allInstructions, opt_renderBuffer) {
        /**
         * @private
         * @type {import("../../extent.js").Extent}
         */
        this.maxExtent_ = maxExtent;
        /**
         * @private
         * @type {boolean}
         */
        this.overlaps_ = overlaps;
        /**
         * @private
         * @type {number}
         */
        this.pixelRatio_ = pixelRatio;
        /**
         * @private
         * @type {number}
         */
        this.resolution_ = resolution;
        /**
         * @private
         * @type {number|undefined}
         */
        this.renderBuffer_ = opt_renderBuffer;
        /**
         * @private
         * @type {!Object<string, !Object<import("./BuilderType.js").default, import("./Executor").default>>}
         */
        this.executorsByZIndex_ = {};
        /**
         * @private
         * @type {CanvasRenderingContext2D}
         */
        this.hitDetectionContext_ = null;
        /**
         * @private
         * @type {import("../../transform.js").Transform}
         */
        this.hitDetectionTransform_ = create();
        this.createExecutors_(allInstructions);
    }
    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {import("../../transform.js").Transform} transform Transform.
     */
    ExecutorGroup.prototype.clip = function (context, transform) {
        var flatClipCoords = this.getClipCoords(transform);
        context.beginPath();
        context.moveTo(flatClipCoords[0], flatClipCoords[1]);
        context.lineTo(flatClipCoords[2], flatClipCoords[3]);
        context.lineTo(flatClipCoords[4], flatClipCoords[5]);
        context.lineTo(flatClipCoords[6], flatClipCoords[7]);
        context.clip();
    };
    /**
     * Create executors and populate them using the provided instructions.
     * @private
     * @param {!Object<string, !Object<import("./BuilderType.js").default, import("../canvas.js").SerializableInstructions>>} allInstructions The serializable instructions
     */
    ExecutorGroup.prototype.createExecutors_ = function (allInstructions) {
        for (var zIndex in allInstructions) {
            var executors = this.executorsByZIndex_[zIndex];
            if (executors === undefined) {
                executors = {};
                this.executorsByZIndex_[zIndex] = executors;
            }
            var instructionByZindex = allInstructions[zIndex];
            for (var builderType in instructionByZindex) {
                var instructions = instructionByZindex[builderType];
                executors[builderType] = new Executor(this.resolution_, this.pixelRatio_, this.overlaps_, instructions);
            }
        }
    };
    /**
     * @param {Array<import("./BuilderType.js").default>} executors Executors.
     * @return {boolean} Has executors of the provided types.
     */
    ExecutorGroup.prototype.hasExecutors = function (executors) {
        for (var zIndex in this.executorsByZIndex_) {
            var candidates = this.executorsByZIndex_[zIndex];
            for (var i = 0, ii = executors.length; i < ii; ++i) {
                if (executors[i] in candidates) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @param {number} resolution Resolution.
     * @param {number} rotation Rotation.
     * @param {number} hitTolerance Hit tolerance in pixels.
     * @param {function(import("../../Feature.js").FeatureLike, import("../../geom/SimpleGeometry.js").default, number): T} callback Feature callback.
     * @param {Array<import("../../Feature.js").FeatureLike>} declutteredFeatures Decluttered features.
     * @return {T|undefined} Callback result.
     * @template T
     */
    ExecutorGroup.prototype.forEachFeatureAtCoordinate = function (coordinate, resolution, rotation, hitTolerance, callback, declutteredFeatures) {
        hitTolerance = Math.round(hitTolerance);
        var contextSize = hitTolerance * 2 + 1;
        var transform = compose(this.hitDetectionTransform_, hitTolerance + 0.5, hitTolerance + 0.5, 1 / resolution, -1 / resolution, -rotation, -coordinate[0], -coordinate[1]);
        var newContext = !this.hitDetectionContext_;
        if (newContext) {
            this.hitDetectionContext_ = createCanvasContext2D(contextSize, contextSize);
        }
        var context = this.hitDetectionContext_;
        if (context.canvas.width !== contextSize ||
            context.canvas.height !== contextSize) {
            context.canvas.width = contextSize;
            context.canvas.height = contextSize;
        }
        else if (!newContext) {
            context.clearRect(0, 0, contextSize, contextSize);
        }
        /**
         * @type {import("../../extent.js").Extent}
         */
        var hitExtent;
        if (this.renderBuffer_ !== undefined) {
            hitExtent = createEmpty();
            extendCoordinate(hitExtent, coordinate);
            buffer(hitExtent, resolution * (this.renderBuffer_ + hitTolerance), hitExtent);
        }
        var indexes = getPixelIndexArray(hitTolerance);
        var builderType;
        /**
         * @param {import("../../Feature.js").FeatureLike} feature Feature.
         * @param {import("../../geom/SimpleGeometry.js").default} geometry Geometry.
         * @return {T|undefined} Callback result.
         */
        function featureCallback(feature, geometry) {
            var imageData = context.getImageData(0, 0, contextSize, contextSize).data;
            for (var i_1 = 0, ii = indexes.length; i_1 < ii; i_1++) {
                if (imageData[indexes[i_1]] > 0) {
                    if (!declutteredFeatures ||
                        (builderType !== BuilderType.IMAGE &&
                            builderType !== BuilderType.TEXT) ||
                        declutteredFeatures.indexOf(feature) !== -1) {
                        var idx = (indexes[i_1] - 3) / 4;
                        var x = hitTolerance - (idx % contextSize);
                        var y = hitTolerance - ((idx / contextSize) | 0);
                        var result_1 = callback(feature, geometry, x * x + y * y);
                        if (result_1) {
                            return result_1;
                        }
                    }
                    context.clearRect(0, 0, contextSize, contextSize);
                    break;
                }
            }
            return undefined;
        }
        /** @type {Array<number>} */
        var zs = Object.keys(this.executorsByZIndex_).map(Number);
        zs.sort(numberSafeCompareFunction);
        var i, j, executors, executor, result;
        for (i = zs.length - 1; i >= 0; --i) {
            var zIndexKey = zs[i].toString();
            executors = this.executorsByZIndex_[zIndexKey];
            for (j = ORDER.length - 1; j >= 0; --j) {
                builderType = ORDER[j];
                executor = executors[builderType];
                if (executor !== undefined) {
                    result = executor.executeHitDetection(context, transform, rotation, featureCallback, hitExtent);
                    if (result) {
                        return result;
                    }
                }
            }
        }
        return undefined;
    };
    /**
     * @param {import("../../transform.js").Transform} transform Transform.
     * @return {Array<number>} Clip coordinates.
     */
    ExecutorGroup.prototype.getClipCoords = function (transform) {
        var maxExtent = this.maxExtent_;
        if (!maxExtent) {
            return null;
        }
        var minX = maxExtent[0];
        var minY = maxExtent[1];
        var maxX = maxExtent[2];
        var maxY = maxExtent[3];
        var flatClipCoords = [minX, minY, minX, maxY, maxX, maxY, maxX, minY];
        transform2D(flatClipCoords, 0, 8, 2, transform, flatClipCoords);
        return flatClipCoords;
    };
    /**
     * @return {boolean} Is empty.
     */
    ExecutorGroup.prototype.isEmpty = function () {
        return isEmpty(this.executorsByZIndex_);
    };
    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {number} contextScale Scale of the context.
     * @param {import("../../transform.js").Transform} transform Transform.
     * @param {number} viewRotation View rotation.
     * @param {boolean} snapToPixel Snap point symbols and test to integer pixel.
     * @param {Array<import("./BuilderType.js").default>} [opt_builderTypes] Ordered replay types to replay.
     *     Default is {@link module:ol/render/replay~ORDER}
     * @param {import("rbush").default} [opt_declutterTree] Declutter tree.
     */
    ExecutorGroup.prototype.execute = function (context, contextScale, transform, viewRotation, snapToPixel, opt_builderTypes, opt_declutterTree) {
        /** @type {Array<number>} */
        var zs = Object.keys(this.executorsByZIndex_).map(Number);
        zs.sort(numberSafeCompareFunction);
        // setup clipping so that the parts of over-simplified geometries are not
        // visible outside the current extent when panning
        if (this.maxExtent_) {
            context.save();
            this.clip(context, transform);
        }
        var builderTypes = opt_builderTypes ? opt_builderTypes : ORDER;
        var i, ii, j, jj, replays, replay;
        if (opt_declutterTree) {
            zs.reverse();
        }
        for (i = 0, ii = zs.length; i < ii; ++i) {
            var zIndexKey = zs[i].toString();
            replays = this.executorsByZIndex_[zIndexKey];
            for (j = 0, jj = builderTypes.length; j < jj; ++j) {
                var builderType = builderTypes[j];
                replay = replays[builderType];
                if (replay !== undefined) {
                    replay.execute(context, contextScale, transform, viewRotation, snapToPixel, opt_declutterTree);
                }
            }
        }
        if (this.maxExtent_) {
            context.restore();
        }
    };
    return ExecutorGroup;
}());
/**
 * This cache is used to store arrays of indexes for calculated pixel circles
 * to increase performance.
 * It is a static property to allow each Replaygroup to access it.
 * @type {Object<number, Array<number>>}
 */
var circlePixelIndexArrayCache = {};
/**
 * This methods creates an array with indexes of all pixels within a circle,
 * ordered by how close they are to the center.
 * A cache is used to increase performance.
 * @param {number} radius Radius.
 * @return {Array<number>} An array with indexes within a circle.
 */
function getPixelIndexArray(radius) {
    if (circlePixelIndexArrayCache[radius] !== undefined) {
        return circlePixelIndexArrayCache[radius];
    }
    var size = radius * 2 + 1;
    var maxDistanceSq = radius * radius;
    var distances = new Array(maxDistanceSq + 1);
    for (var i = 0; i <= radius; ++i) {
        for (var j = 0; j <= radius; ++j) {
            var distanceSq = i * i + j * j;
            if (distanceSq > maxDistanceSq) {
                break;
            }
            var distance = distances[distanceSq];
            if (!distance) {
                distance = [];
                distances[distanceSq] = distance;
            }
            distance.push(((radius + i) * size + (radius + j)) * 4 + 3);
            if (i > 0) {
                distance.push(((radius - i) * size + (radius + j)) * 4 + 3);
            }
            if (j > 0) {
                distance.push(((radius + i) * size + (radius - j)) * 4 + 3);
                if (i > 0) {
                    distance.push(((radius - i) * size + (radius - j)) * 4 + 3);
                }
            }
        }
    }
    var pixelIndex = [];
    for (var i = 0, ii = distances.length; i < ii; ++i) {
        if (distances[i]) {
            pixelIndex.push.apply(pixelIndex, distances[i]);
        }
    }
    circlePixelIndexArrayCache[radius] = pixelIndex;
    return pixelIndex;
}

/**
 * @module ol/render/canvas/Immediate
 */
// FIXME test, especially polygons with holes and multipolygons
// FIXME need to handle large thick features (where pixel size matters)
// FIXME add offset and end to ol/geom/flat/transform~transform2D?
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
/**
 * @classdesc
 * A concrete subclass of {@link module:ol/render/VectorContext VectorContext} that implements
 * direct rendering of features and geometries to an HTML5 Canvas context.
 * Instances of this class are created internally by the library and
 * provided to application code as vectorContext member of the
 * {@link module:ol/render/Event~RenderEvent RenderEvent} object associated with postcompose, precompose and
 * render events emitted by layers and maps.
 */
var CanvasImmediateRenderer = /** @class */ (function (_super) {
    __extends$6(CanvasImmediateRenderer, _super);
    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("../../extent.js").Extent} extent Extent.
     * @param {import("../../transform.js").Transform} transform Transform.
     * @param {number} viewRotation View rotation.
     * @param {number} [opt_squaredTolerance] Optional squared tolerance for simplification.
     * @param {import("../../proj.js").TransformFunction} [opt_userTransform] Transform from user to view projection.
     */
    function CanvasImmediateRenderer(context, pixelRatio, extent, transform, viewRotation, opt_squaredTolerance, opt_userTransform) {
        var _this = _super.call(this) || this;
        /**
         * @private
         * @type {CanvasRenderingContext2D}
         */
        _this.context_ = context;
        /**
         * @private
         * @type {number}
         */
        _this.pixelRatio_ = pixelRatio;
        /**
         * @private
         * @type {import("../../extent.js").Extent}
         */
        _this.extent_ = extent;
        /**
         * @private
         * @type {import("../../transform.js").Transform}
         */
        _this.transform_ = transform;
        /**
         * @private
         * @type {number}
         */
        _this.viewRotation_ = viewRotation;
        /**
         * @private
         * @type {number}
         */
        _this.squaredTolerance_ = opt_squaredTolerance;
        /**
         * @private
         * @type {import("../../proj.js").TransformFunction}
         */
        _this.userTransform_ = opt_userTransform;
        /**
         * @private
         * @type {?import("../canvas.js").FillState}
         */
        _this.contextFillState_ = null;
        /**
         * @private
         * @type {?import("../canvas.js").StrokeState}
         */
        _this.contextStrokeState_ = null;
        /**
         * @private
         * @type {?import("../canvas.js").TextState}
         */
        _this.contextTextState_ = null;
        /**
         * @private
         * @type {?import("../canvas.js").FillState}
         */
        _this.fillState_ = null;
        /**
         * @private
         * @type {?import("../canvas.js").StrokeState}
         */
        _this.strokeState_ = null;
        /**
         * @private
         * @type {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement}
         */
        _this.image_ = null;
        /**
         * @private
         * @type {number}
         */
        _this.imageAnchorX_ = 0;
        /**
         * @private
         * @type {number}
         */
        _this.imageAnchorY_ = 0;
        /**
         * @private
         * @type {number}
         */
        _this.imageHeight_ = 0;
        /**
         * @private
         * @type {number}
         */
        _this.imageOpacity_ = 0;
        /**
         * @private
         * @type {number}
         */
        _this.imageOriginX_ = 0;
        /**
         * @private
         * @type {number}
         */
        _this.imageOriginY_ = 0;
        /**
         * @private
         * @type {boolean}
         */
        _this.imageRotateWithView_ = false;
        /**
         * @private
         * @type {number}
         */
        _this.imageRotation_ = 0;
        /**
         * @private
         * @type {import("../../size.js").Size}
         */
        _this.imageScale_ = [0, 0];
        /**
         * @private
         * @type {number}
         */
        _this.imageWidth_ = 0;
        /**
         * @private
         * @type {string}
         */
        _this.text_ = '';
        /**
         * @private
         * @type {number}
         */
        _this.textOffsetX_ = 0;
        /**
         * @private
         * @type {number}
         */
        _this.textOffsetY_ = 0;
        /**
         * @private
         * @type {boolean}
         */
        _this.textRotateWithView_ = false;
        /**
         * @private
         * @type {number}
         */
        _this.textRotation_ = 0;
        /**
         * @private
         * @type {import("../../size.js").Size}
         */
        _this.textScale_ = [0, 0];
        /**
         * @private
         * @type {?import("../canvas.js").FillState}
         */
        _this.textFillState_ = null;
        /**
         * @private
         * @type {?import("../canvas.js").StrokeState}
         */
        _this.textStrokeState_ = null;
        /**
         * @private
         * @type {?import("../canvas.js").TextState}
         */
        _this.textState_ = null;
        /**
         * @private
         * @type {Array<number>}
         */
        _this.pixelCoordinates_ = [];
        /**
         * @private
         * @type {import("../../transform.js").Transform}
         */
        _this.tmpLocalTransform_ = create();
        return _this;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @private
     */
    CanvasImmediateRenderer.prototype.drawImages_ = function (flatCoordinates, offset, end, stride) {
        if (!this.image_) {
            return;
        }
        var pixelCoordinates = transform2D(flatCoordinates, offset, end, stride, this.transform_, this.pixelCoordinates_);
        var context = this.context_;
        var localTransform = this.tmpLocalTransform_;
        var alpha = context.globalAlpha;
        if (this.imageOpacity_ != 1) {
            context.globalAlpha = alpha * this.imageOpacity_;
        }
        var rotation = this.imageRotation_;
        if (this.imageRotateWithView_) {
            rotation += this.viewRotation_;
        }
        for (var i = 0, ii = pixelCoordinates.length; i < ii; i += 2) {
            var x = pixelCoordinates[i] - this.imageAnchorX_;
            var y = pixelCoordinates[i + 1] - this.imageAnchorY_;
            if (rotation !== 0 ||
                this.imageScale_[0] != 1 ||
                this.imageScale_[1] != 1) {
                var centerX = x + this.imageAnchorX_;
                var centerY = y + this.imageAnchorY_;
                compose(localTransform, centerX, centerY, 1, 1, rotation, -centerX, -centerY);
                context.setTransform.apply(context, localTransform);
                context.translate(centerX, centerY);
                context.scale(this.imageScale_[0], this.imageScale_[1]);
                context.drawImage(this.image_, this.imageOriginX_, this.imageOriginY_, this.imageWidth_, this.imageHeight_, -this.imageAnchorX_, -this.imageAnchorY_, this.imageWidth_, this.imageHeight_);
                context.setTransform(1, 0, 0, 1, 0, 0);
            }
            else {
                context.drawImage(this.image_, this.imageOriginX_, this.imageOriginY_, this.imageWidth_, this.imageHeight_, x, y, this.imageWidth_, this.imageHeight_);
            }
        }
        if (this.imageOpacity_ != 1) {
            context.globalAlpha = alpha;
        }
    };
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @private
     */
    CanvasImmediateRenderer.prototype.drawText_ = function (flatCoordinates, offset, end, stride) {
        if (!this.textState_ || this.text_ === '') {
            return;
        }
        if (this.textFillState_) {
            this.setContextFillState_(this.textFillState_);
        }
        if (this.textStrokeState_) {
            this.setContextStrokeState_(this.textStrokeState_);
        }
        this.setContextTextState_(this.textState_);
        var pixelCoordinates = transform2D(flatCoordinates, offset, end, stride, this.transform_, this.pixelCoordinates_);
        var context = this.context_;
        var rotation = this.textRotation_;
        if (this.textRotateWithView_) {
            rotation += this.viewRotation_;
        }
        for (; offset < end; offset += stride) {
            var x = pixelCoordinates[offset] + this.textOffsetX_;
            var y = pixelCoordinates[offset + 1] + this.textOffsetY_;
            if (rotation !== 0 ||
                this.textScale_[0] != 1 ||
                this.textScale_[1] != 1) {
                var localTransform = compose(this.tmpLocalTransform_, x, y, 1, 1, rotation, -x, -y);
                context.setTransform.apply(context, localTransform);
                context.translate(x, y);
                context.scale(this.textScale_[0], this.textScale_[1]);
                if (this.textStrokeState_) {
                    context.strokeText(this.text_, 0, 0);
                }
                if (this.textFillState_) {
                    context.fillText(this.text_, 0, 0);
                }
                context.setTransform(1, 0, 0, 1, 0, 0);
            }
            else {
                if (this.textStrokeState_) {
                    context.strokeText(this.text_, x, y);
                }
                if (this.textFillState_) {
                    context.fillText(this.text_, x, y);
                }
            }
        }
    };
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {boolean} close Close.
     * @private
     * @return {number} end End.
     */
    CanvasImmediateRenderer.prototype.moveToLineTo_ = function (flatCoordinates, offset, end, stride, close) {
        var context = this.context_;
        var pixelCoordinates = transform2D(flatCoordinates, offset, end, stride, this.transform_, this.pixelCoordinates_);
        context.moveTo(pixelCoordinates[0], pixelCoordinates[1]);
        var length = pixelCoordinates.length;
        if (close) {
            length -= 2;
        }
        for (var i = 2; i < length; i += 2) {
            context.lineTo(pixelCoordinates[i], pixelCoordinates[i + 1]);
        }
        if (close) {
            context.closePath();
        }
        return end;
    };
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<number>} ends Ends.
     * @param {number} stride Stride.
     * @private
     * @return {number} End.
     */
    CanvasImmediateRenderer.prototype.drawRings_ = function (flatCoordinates, offset, ends, stride) {
        for (var i = 0, ii = ends.length; i < ii; ++i) {
            offset = this.moveToLineTo_(flatCoordinates, offset, ends[i], stride, true);
        }
        return offset;
    };
    /**
     * Render a circle geometry into the canvas.  Rendering is immediate and uses
     * the current fill and stroke styles.
     *
     * @param {import("../../geom/Circle.js").default} geometry Circle geometry.
     * @api
     */
    CanvasImmediateRenderer.prototype.drawCircle = function (geometry) {
        if (!intersects(this.extent_, geometry.getExtent())) {
            return;
        }
        if (this.fillState_ || this.strokeState_) {
            if (this.fillState_) {
                this.setContextFillState_(this.fillState_);
            }
            if (this.strokeState_) {
                this.setContextStrokeState_(this.strokeState_);
            }
            var pixelCoordinates = transformGeom2D(geometry, this.transform_, this.pixelCoordinates_);
            var dx = pixelCoordinates[2] - pixelCoordinates[0];
            var dy = pixelCoordinates[3] - pixelCoordinates[1];
            var radius = Math.sqrt(dx * dx + dy * dy);
            var context = this.context_;
            context.beginPath();
            context.arc(pixelCoordinates[0], pixelCoordinates[1], radius, 0, 2 * Math.PI);
            if (this.fillState_) {
                context.fill();
            }
            if (this.strokeState_) {
                context.stroke();
            }
        }
        if (this.text_ !== '') {
            this.drawText_(geometry.getCenter(), 0, 2, 2);
        }
    };
    /**
     * Set the rendering style.  Note that since this is an immediate rendering API,
     * any `zIndex` on the provided style will be ignored.
     *
     * @param {import("../../style/Style.js").default} style The rendering style.
     * @api
     */
    CanvasImmediateRenderer.prototype.setStyle = function (style) {
        this.setFillStrokeStyle(style.getFill(), style.getStroke());
        this.setImageStyle(style.getImage());
        this.setTextStyle(style.getText());
    };
    /**
     * @param {import("../../transform.js").Transform} transform Transform.
     */
    CanvasImmediateRenderer.prototype.setTransform = function (transform) {
        this.transform_ = transform;
    };
    /**
     * Render a geometry into the canvas.  Call
     * {@link module:ol/render/canvas/Immediate~CanvasImmediateRenderer#setStyle renderer.setStyle()} first to set the rendering style.
     *
     * @param {import("../../geom/Geometry.js").default|import("../Feature.js").default} geometry The geometry to render.
     * @api
     */
    CanvasImmediateRenderer.prototype.drawGeometry = function (geometry) {
        var type = geometry.getType();
        switch (type) {
            case GeometryType.POINT:
                this.drawPoint(
                /** @type {import("../../geom/Point.js").default} */ (geometry));
                break;
            case GeometryType.LINE_STRING:
                this.drawLineString(
                /** @type {import("../../geom/LineString.js").default} */ (geometry));
                break;
            case GeometryType.POLYGON:
                this.drawPolygon(
                /** @type {import("../../geom/Polygon.js").default} */ (geometry));
                break;
            case GeometryType.MULTI_POINT:
                this.drawMultiPoint(
                /** @type {import("../../geom/MultiPoint.js").default} */ (geometry));
                break;
            case GeometryType.MULTI_LINE_STRING:
                this.drawMultiLineString(
                /** @type {import("../../geom/MultiLineString.js").default} */ (geometry));
                break;
            case GeometryType.MULTI_POLYGON:
                this.drawMultiPolygon(
                /** @type {import("../../geom/MultiPolygon.js").default} */ (geometry));
                break;
            case GeometryType.GEOMETRY_COLLECTION:
                this.drawGeometryCollection(
                /** @type {import("../../geom/GeometryCollection.js").default} */ (geometry));
                break;
            case GeometryType.CIRCLE:
                this.drawCircle(
                /** @type {import("../../geom/Circle.js").default} */ (geometry));
                break;
        }
    };
    /**
     * Render a feature into the canvas.  Note that any `zIndex` on the provided
     * style will be ignored - features are rendered immediately in the order that
     * this method is called.  If you need `zIndex` support, you should be using an
     * {@link module:ol/layer/Vector~VectorLayer VectorLayer} instead.
     *
     * @param {import("../../Feature.js").default} feature Feature.
     * @param {import("../../style/Style.js").default} style Style.
     * @api
     */
    CanvasImmediateRenderer.prototype.drawFeature = function (feature, style) {
        var geometry = style.getGeometryFunction()(feature);
        if (!geometry || !intersects(this.extent_, geometry.getExtent())) {
            return;
        }
        this.setStyle(style);
        this.drawGeometry(geometry);
    };
    /**
     * Render a GeometryCollection to the canvas.  Rendering is immediate and
     * uses the current styles appropriate for each geometry in the collection.
     *
     * @param {import("../../geom/GeometryCollection.js").default} geometry Geometry collection.
     */
    CanvasImmediateRenderer.prototype.drawGeometryCollection = function (geometry) {
        var geometries = geometry.getGeometriesArray();
        for (var i = 0, ii = geometries.length; i < ii; ++i) {
            this.drawGeometry(geometries[i]);
        }
    };
    /**
     * Render a Point geometry into the canvas.  Rendering is immediate and uses
     * the current style.
     *
     * @param {import("../../geom/Point.js").default|import("../Feature.js").default} geometry Point geometry.
     */
    CanvasImmediateRenderer.prototype.drawPoint = function (geometry) {
        if (this.squaredTolerance_) {
            geometry = /** @type {import("../../geom/Point.js").default} */ (geometry.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
        }
        var flatCoordinates = geometry.getFlatCoordinates();
        var stride = geometry.getStride();
        if (this.image_) {
            this.drawImages_(flatCoordinates, 0, flatCoordinates.length, stride);
        }
        if (this.text_ !== '') {
            this.drawText_(flatCoordinates, 0, flatCoordinates.length, stride);
        }
    };
    /**
     * Render a MultiPoint geometry  into the canvas.  Rendering is immediate and
     * uses the current style.
     *
     * @param {import("../../geom/MultiPoint.js").default|import("../Feature.js").default} geometry MultiPoint geometry.
     */
    CanvasImmediateRenderer.prototype.drawMultiPoint = function (geometry) {
        if (this.squaredTolerance_) {
            geometry = /** @type {import("../../geom/MultiPoint.js").default} */ (geometry.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
        }
        var flatCoordinates = geometry.getFlatCoordinates();
        var stride = geometry.getStride();
        if (this.image_) {
            this.drawImages_(flatCoordinates, 0, flatCoordinates.length, stride);
        }
        if (this.text_ !== '') {
            this.drawText_(flatCoordinates, 0, flatCoordinates.length, stride);
        }
    };
    /**
     * Render a LineString into the canvas.  Rendering is immediate and uses
     * the current style.
     *
     * @param {import("../../geom/LineString.js").default|import("../Feature.js").default} geometry LineString geometry.
     */
    CanvasImmediateRenderer.prototype.drawLineString = function (geometry) {
        if (this.squaredTolerance_) {
            geometry = /** @type {import("../../geom/LineString.js").default} */ (geometry.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
        }
        if (!intersects(this.extent_, geometry.getExtent())) {
            return;
        }
        if (this.strokeState_) {
            this.setContextStrokeState_(this.strokeState_);
            var context = this.context_;
            var flatCoordinates = geometry.getFlatCoordinates();
            context.beginPath();
            this.moveToLineTo_(flatCoordinates, 0, flatCoordinates.length, geometry.getStride(), false);
            context.stroke();
        }
        if (this.text_ !== '') {
            var flatMidpoint = geometry.getFlatMidpoint();
            this.drawText_(flatMidpoint, 0, 2, 2);
        }
    };
    /**
     * Render a MultiLineString geometry into the canvas.  Rendering is immediate
     * and uses the current style.
     *
     * @param {import("../../geom/MultiLineString.js").default|import("../Feature.js").default} geometry MultiLineString geometry.
     */
    CanvasImmediateRenderer.prototype.drawMultiLineString = function (geometry) {
        if (this.squaredTolerance_) {
            geometry =
                /** @type {import("../../geom/MultiLineString.js").default} */ (geometry.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
        }
        var geometryExtent = geometry.getExtent();
        if (!intersects(this.extent_, geometryExtent)) {
            return;
        }
        if (this.strokeState_) {
            this.setContextStrokeState_(this.strokeState_);
            var context = this.context_;
            var flatCoordinates = geometry.getFlatCoordinates();
            var offset = 0;
            var ends = /** @type {Array<number>} */ (geometry.getEnds());
            var stride = geometry.getStride();
            context.beginPath();
            for (var i = 0, ii = ends.length; i < ii; ++i) {
                offset = this.moveToLineTo_(flatCoordinates, offset, ends[i], stride, false);
            }
            context.stroke();
        }
        if (this.text_ !== '') {
            var flatMidpoints = geometry.getFlatMidpoints();
            this.drawText_(flatMidpoints, 0, flatMidpoints.length, 2);
        }
    };
    /**
     * Render a Polygon geometry into the canvas.  Rendering is immediate and uses
     * the current style.
     *
     * @param {import("../../geom/Polygon.js").default|import("../Feature.js").default} geometry Polygon geometry.
     */
    CanvasImmediateRenderer.prototype.drawPolygon = function (geometry) {
        if (this.squaredTolerance_) {
            geometry = /** @type {import("../../geom/Polygon.js").default} */ (geometry.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
        }
        if (!intersects(this.extent_, geometry.getExtent())) {
            return;
        }
        if (this.strokeState_ || this.fillState_) {
            if (this.fillState_) {
                this.setContextFillState_(this.fillState_);
            }
            if (this.strokeState_) {
                this.setContextStrokeState_(this.strokeState_);
            }
            var context = this.context_;
            context.beginPath();
            this.drawRings_(geometry.getOrientedFlatCoordinates(), 0, 
            /** @type {Array<number>} */ (geometry.getEnds()), geometry.getStride());
            if (this.fillState_) {
                context.fill();
            }
            if (this.strokeState_) {
                context.stroke();
            }
        }
        if (this.text_ !== '') {
            var flatInteriorPoint = geometry.getFlatInteriorPoint();
            this.drawText_(flatInteriorPoint, 0, 2, 2);
        }
    };
    /**
     * Render MultiPolygon geometry into the canvas.  Rendering is immediate and
     * uses the current style.
     * @param {import("../../geom/MultiPolygon.js").default} geometry MultiPolygon geometry.
     */
    CanvasImmediateRenderer.prototype.drawMultiPolygon = function (geometry) {
        if (this.squaredTolerance_) {
            geometry = /** @type {import("../../geom/MultiPolygon.js").default} */ (geometry.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
        }
        if (!intersects(this.extent_, geometry.getExtent())) {
            return;
        }
        if (this.strokeState_ || this.fillState_) {
            if (this.fillState_) {
                this.setContextFillState_(this.fillState_);
            }
            if (this.strokeState_) {
                this.setContextStrokeState_(this.strokeState_);
            }
            var context = this.context_;
            var flatCoordinates = geometry.getOrientedFlatCoordinates();
            var offset = 0;
            var endss = geometry.getEndss();
            var stride = geometry.getStride();
            context.beginPath();
            for (var i = 0, ii = endss.length; i < ii; ++i) {
                var ends = endss[i];
                offset = this.drawRings_(flatCoordinates, offset, ends, stride);
            }
            if (this.fillState_) {
                context.fill();
            }
            if (this.strokeState_) {
                context.stroke();
            }
        }
        if (this.text_ !== '') {
            var flatInteriorPoints = geometry.getFlatInteriorPoints();
            this.drawText_(flatInteriorPoints, 0, flatInteriorPoints.length, 2);
        }
    };
    /**
     * @param {import("../canvas.js").FillState} fillState Fill state.
     * @private
     */
    CanvasImmediateRenderer.prototype.setContextFillState_ = function (fillState) {
        var context = this.context_;
        var contextFillState = this.contextFillState_;
        if (!contextFillState) {
            context.fillStyle = fillState.fillStyle;
            this.contextFillState_ = {
                fillStyle: fillState.fillStyle,
            };
        }
        else {
            if (contextFillState.fillStyle != fillState.fillStyle) {
                contextFillState.fillStyle = fillState.fillStyle;
                context.fillStyle = fillState.fillStyle;
            }
        }
    };
    /**
     * @param {import("../canvas.js").StrokeState} strokeState Stroke state.
     * @private
     */
    CanvasImmediateRenderer.prototype.setContextStrokeState_ = function (strokeState) {
        var context = this.context_;
        var contextStrokeState = this.contextStrokeState_;
        if (!contextStrokeState) {
            context.lineCap = strokeState.lineCap;
            if (context.setLineDash) {
                context.setLineDash(strokeState.lineDash);
                context.lineDashOffset = strokeState.lineDashOffset;
            }
            context.lineJoin = strokeState.lineJoin;
            context.lineWidth = strokeState.lineWidth;
            context.miterLimit = strokeState.miterLimit;
            context.strokeStyle = strokeState.strokeStyle;
            this.contextStrokeState_ = {
                lineCap: strokeState.lineCap,
                lineDash: strokeState.lineDash,
                lineDashOffset: strokeState.lineDashOffset,
                lineJoin: strokeState.lineJoin,
                lineWidth: strokeState.lineWidth,
                miterLimit: strokeState.miterLimit,
                strokeStyle: strokeState.strokeStyle,
            };
        }
        else {
            if (contextStrokeState.lineCap != strokeState.lineCap) {
                contextStrokeState.lineCap = strokeState.lineCap;
                context.lineCap = strokeState.lineCap;
            }
            if (context.setLineDash) {
                if (!equals(contextStrokeState.lineDash, strokeState.lineDash)) {
                    context.setLineDash((contextStrokeState.lineDash = strokeState.lineDash));
                }
                if (contextStrokeState.lineDashOffset != strokeState.lineDashOffset) {
                    contextStrokeState.lineDashOffset = strokeState.lineDashOffset;
                    context.lineDashOffset = strokeState.lineDashOffset;
                }
            }
            if (contextStrokeState.lineJoin != strokeState.lineJoin) {
                contextStrokeState.lineJoin = strokeState.lineJoin;
                context.lineJoin = strokeState.lineJoin;
            }
            if (contextStrokeState.lineWidth != strokeState.lineWidth) {
                contextStrokeState.lineWidth = strokeState.lineWidth;
                context.lineWidth = strokeState.lineWidth;
            }
            if (contextStrokeState.miterLimit != strokeState.miterLimit) {
                contextStrokeState.miterLimit = strokeState.miterLimit;
                context.miterLimit = strokeState.miterLimit;
            }
            if (contextStrokeState.strokeStyle != strokeState.strokeStyle) {
                contextStrokeState.strokeStyle = strokeState.strokeStyle;
                context.strokeStyle = strokeState.strokeStyle;
            }
        }
    };
    /**
     * @param {import("../canvas.js").TextState} textState Text state.
     * @private
     */
    CanvasImmediateRenderer.prototype.setContextTextState_ = function (textState) {
        var context = this.context_;
        var contextTextState = this.contextTextState_;
        var textAlign = textState.textAlign
            ? textState.textAlign
            : defaultTextAlign;
        if (!contextTextState) {
            context.font = textState.font;
            context.textAlign = /** @type {CanvasTextAlign} */ (textAlign);
            context.textBaseline = /** @type {CanvasTextBaseline} */ (textState.textBaseline);
            this.contextTextState_ = {
                font: textState.font,
                textAlign: textAlign,
                textBaseline: textState.textBaseline,
            };
        }
        else {
            if (contextTextState.font != textState.font) {
                contextTextState.font = textState.font;
                context.font = textState.font;
            }
            if (contextTextState.textAlign != textAlign) {
                contextTextState.textAlign = /** @type {CanvasTextAlign} */ (textAlign);
                context.textAlign = /** @type {CanvasTextAlign} */ (textAlign);
            }
            if (contextTextState.textBaseline != textState.textBaseline) {
                contextTextState.textBaseline = /** @type {CanvasTextBaseline} */ (textState.textBaseline);
                context.textBaseline = /** @type {CanvasTextBaseline} */ (textState.textBaseline);
            }
        }
    };
    /**
     * Set the fill and stroke style for subsequent draw operations.  To clear
     * either fill or stroke styles, pass null for the appropriate parameter.
     *
     * @param {import("../../style/Fill.js").default} fillStyle Fill style.
     * @param {import("../../style/Stroke.js").default} strokeStyle Stroke style.
     */
    CanvasImmediateRenderer.prototype.setFillStrokeStyle = function (fillStyle, strokeStyle) {
        var _this = this;
        if (!fillStyle) {
            this.fillState_ = null;
        }
        else {
            var fillStyleColor = fillStyle.getColor();
            this.fillState_ = {
                fillStyle: asColorLike(fillStyleColor ? fillStyleColor : defaultFillStyle),
            };
        }
        if (!strokeStyle) {
            this.strokeState_ = null;
        }
        else {
            var strokeStyleColor = strokeStyle.getColor();
            var strokeStyleLineCap = strokeStyle.getLineCap();
            var strokeStyleLineDash = strokeStyle.getLineDash();
            var strokeStyleLineDashOffset = strokeStyle.getLineDashOffset();
            var strokeStyleLineJoin = strokeStyle.getLineJoin();
            var strokeStyleWidth = strokeStyle.getWidth();
            var strokeStyleMiterLimit = strokeStyle.getMiterLimit();
            var lineDash = strokeStyleLineDash
                ? strokeStyleLineDash
                : defaultLineDash;
            this.strokeState_ = {
                lineCap: strokeStyleLineCap !== undefined
                    ? strokeStyleLineCap
                    : defaultLineCap,
                lineDash: this.pixelRatio_ === 1
                    ? lineDash
                    : lineDash.map(function (n) { return n * _this.pixelRatio_; }),
                lineDashOffset: (strokeStyleLineDashOffset
                    ? strokeStyleLineDashOffset
                    : defaultLineDashOffset) * this.pixelRatio_,
                lineJoin: strokeStyleLineJoin !== undefined
                    ? strokeStyleLineJoin
                    : defaultLineJoin,
                lineWidth: (strokeStyleWidth !== undefined
                    ? strokeStyleWidth
                    : defaultLineWidth) * this.pixelRatio_,
                miterLimit: strokeStyleMiterLimit !== undefined
                    ? strokeStyleMiterLimit
                    : defaultMiterLimit,
                strokeStyle: asColorLike(strokeStyleColor ? strokeStyleColor : defaultStrokeStyle),
            };
        }
    };
    /**
     * Set the image style for subsequent draw operations.  Pass null to remove
     * the image style.
     *
     * @param {import("../../style/Image.js").default} imageStyle Image style.
     */
    CanvasImmediateRenderer.prototype.setImageStyle = function (imageStyle) {
        var imageSize;
        if (!imageStyle || !(imageSize = imageStyle.getSize())) {
            this.image_ = null;
            return;
        }
        var imageAnchor = imageStyle.getAnchor();
        var imageOrigin = imageStyle.getOrigin();
        this.image_ = imageStyle.getImage(this.pixelRatio_);
        this.imageAnchorX_ = imageAnchor[0] * this.pixelRatio_;
        this.imageAnchorY_ = imageAnchor[1] * this.pixelRatio_;
        this.imageHeight_ = imageSize[1] * this.pixelRatio_;
        this.imageOpacity_ = imageStyle.getOpacity();
        this.imageOriginX_ = imageOrigin[0];
        this.imageOriginY_ = imageOrigin[1];
        this.imageRotateWithView_ = imageStyle.getRotateWithView();
        this.imageRotation_ = imageStyle.getRotation();
        this.imageScale_ = imageStyle.getScaleArray();
        this.imageWidth_ = imageSize[0] * this.pixelRatio_;
    };
    /**
     * Set the text style for subsequent draw operations.  Pass null to
     * remove the text style.
     *
     * @param {import("../../style/Text.js").default} textStyle Text style.
     */
    CanvasImmediateRenderer.prototype.setTextStyle = function (textStyle) {
        if (!textStyle) {
            this.text_ = '';
        }
        else {
            var textFillStyle = textStyle.getFill();
            if (!textFillStyle) {
                this.textFillState_ = null;
            }
            else {
                var textFillStyleColor = textFillStyle.getColor();
                this.textFillState_ = {
                    fillStyle: asColorLike(textFillStyleColor ? textFillStyleColor : defaultFillStyle),
                };
            }
            var textStrokeStyle = textStyle.getStroke();
            if (!textStrokeStyle) {
                this.textStrokeState_ = null;
            }
            else {
                var textStrokeStyleColor = textStrokeStyle.getColor();
                var textStrokeStyleLineCap = textStrokeStyle.getLineCap();
                var textStrokeStyleLineDash = textStrokeStyle.getLineDash();
                var textStrokeStyleLineDashOffset = textStrokeStyle.getLineDashOffset();
                var textStrokeStyleLineJoin = textStrokeStyle.getLineJoin();
                var textStrokeStyleWidth = textStrokeStyle.getWidth();
                var textStrokeStyleMiterLimit = textStrokeStyle.getMiterLimit();
                this.textStrokeState_ = {
                    lineCap: textStrokeStyleLineCap !== undefined
                        ? textStrokeStyleLineCap
                        : defaultLineCap,
                    lineDash: textStrokeStyleLineDash
                        ? textStrokeStyleLineDash
                        : defaultLineDash,
                    lineDashOffset: textStrokeStyleLineDashOffset
                        ? textStrokeStyleLineDashOffset
                        : defaultLineDashOffset,
                    lineJoin: textStrokeStyleLineJoin !== undefined
                        ? textStrokeStyleLineJoin
                        : defaultLineJoin,
                    lineWidth: textStrokeStyleWidth !== undefined
                        ? textStrokeStyleWidth
                        : defaultLineWidth,
                    miterLimit: textStrokeStyleMiterLimit !== undefined
                        ? textStrokeStyleMiterLimit
                        : defaultMiterLimit,
                    strokeStyle: asColorLike(textStrokeStyleColor ? textStrokeStyleColor : defaultStrokeStyle),
                };
            }
            var textFont = textStyle.getFont();
            var textOffsetX = textStyle.getOffsetX();
            var textOffsetY = textStyle.getOffsetY();
            var textRotateWithView = textStyle.getRotateWithView();
            var textRotation = textStyle.getRotation();
            var textScale = textStyle.getScaleArray();
            var textText = textStyle.getText();
            var textTextAlign = textStyle.getTextAlign();
            var textTextBaseline = textStyle.getTextBaseline();
            this.textState_ = {
                font: textFont !== undefined ? textFont : defaultFont,
                textAlign: textTextAlign !== undefined ? textTextAlign : defaultTextAlign,
                textBaseline: textTextBaseline !== undefined
                    ? textTextBaseline
                    : defaultTextBaseline,
            };
            this.text_ = textText !== undefined ? textText : '';
            this.textOffsetX_ =
                textOffsetX !== undefined ? this.pixelRatio_ * textOffsetX : 0;
            this.textOffsetY_ =
                textOffsetY !== undefined ? this.pixelRatio_ * textOffsetY : 0;
            this.textRotateWithView_ =
                textRotateWithView !== undefined ? textRotateWithView : false;
            this.textRotation_ = textRotation !== undefined ? textRotation : 0;
            this.textScale_ = [
                this.pixelRatio_ * textScale[0],
                this.pixelRatio_ * textScale[1],
            ];
        }
    };
    return CanvasImmediateRenderer;
}(VectorContext));

/**
 * @module ol/style/IconAnchorUnits
 */
/**
 * Icon anchor units. One of 'fraction', 'pixels'.
 * @enum {string}
 */
var IconAnchorUnits = {
    /**
     * Anchor is a fraction
     * @api
     */
    FRACTION: 'fraction',
    /**
     * Anchor is in pixels
     * @api
     */
    PIXELS: 'pixels',
};

/**
 * @module ol/style/IconOrigin
 */
/**
 * Icon origin. One of 'bottom-left', 'bottom-right', 'top-left', 'top-right'.
 * @enum {string}
 */
var IconOrigin = {
    /**
     * Origin is at bottom left
     * @api
     */
    BOTTOM_LEFT: 'bottom-left',
    /**
     * Origin is at bottom right
     * @api
     */
    BOTTOM_RIGHT: 'bottom-right',
    /**
     * Origin is at top left
     * @api
     */
    TOP_LEFT: 'top-left',
    /**
     * Origin is at top right
     * @api
     */
    TOP_RIGHT: 'top-right',
};

/**
 * @module ol/style/IconImage
 */
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
 * @type {CanvasRenderingContext2D}
 */
var taintedTestContext = null;
var IconImage = /** @class */ (function (_super) {
    __extends$7(IconImage, _super);
    /**
     * @param {HTMLImageElement|HTMLCanvasElement} image Image.
     * @param {string|undefined} src Src.
     * @param {import("../size.js").Size} size Size.
     * @param {?string} crossOrigin Cross origin.
     * @param {import("../ImageState.js").default} imageState Image state.
     * @param {import("../color.js").Color} color Color.
     */
    function IconImage(image, src, size, crossOrigin, imageState, color) {
        var _this = _super.call(this) || this;
        /**
         * @private
         * @type {HTMLImageElement|HTMLCanvasElement}
         */
        _this.hitDetectionImage_ = null;
        /**
         * @private
         * @type {HTMLImageElement|HTMLCanvasElement}
         */
        _this.image_ = !image ? new Image() : image;
        if (crossOrigin !== null) {
            /** @type {HTMLImageElement} */ (_this.image_).crossOrigin = crossOrigin;
        }
        /**
         * @private
         * @type {Object<number, HTMLCanvasElement>}
         */
        _this.canvas_ = {};
        /**
         * @private
         * @type {import("../color.js").Color}
         */
        _this.color_ = color;
        /**
         * @private
         * @type {?function():void}
         */
        _this.unlisten_ = null;
        /**
         * @private
         * @type {import("../ImageState.js").default}
         */
        _this.imageState_ = imageState;
        /**
         * @private
         * @type {import("../size.js").Size}
         */
        _this.size_ = size;
        /**
         * @private
         * @type {string|undefined}
         */
        _this.src_ = src;
        /**
         * @private
         */
        _this.tainted_;
        return _this;
    }
    /**
     * @private
     * @return {boolean} The image canvas is tainted.
     */
    IconImage.prototype.isTainted_ = function () {
        if (this.tainted_ === undefined && this.imageState_ === ImageState.LOADED) {
            if (!taintedTestContext) {
                taintedTestContext = createCanvasContext2D(1, 1);
            }
            taintedTestContext.drawImage(this.image_, 0, 0);
            try {
                taintedTestContext.getImageData(0, 0, 1, 1);
                this.tainted_ = false;
            }
            catch (e) {
                taintedTestContext = null;
                this.tainted_ = true;
            }
        }
        return this.tainted_ === true;
    };
    /**
     * @private
     */
    IconImage.prototype.dispatchChangeEvent_ = function () {
        this.dispatchEvent(EventType.CHANGE);
    };
    /**
     * @private
     */
    IconImage.prototype.handleImageError_ = function () {
        this.imageState_ = ImageState.ERROR;
        this.unlistenImage_();
        this.dispatchChangeEvent_();
    };
    /**
     * @private
     */
    IconImage.prototype.handleImageLoad_ = function () {
        this.imageState_ = ImageState.LOADED;
        if (this.size_) {
            this.image_.width = this.size_[0];
            this.image_.height = this.size_[1];
        }
        else {
            this.size_ = [this.image_.width, this.image_.height];
        }
        this.unlistenImage_();
        this.dispatchChangeEvent_();
    };
    /**
     * @param {number} pixelRatio Pixel ratio.
     * @return {HTMLImageElement|HTMLCanvasElement} Image or Canvas element.
     */
    IconImage.prototype.getImage = function (pixelRatio) {
        this.replaceColor_(pixelRatio);
        return this.canvas_[pixelRatio] ? this.canvas_[pixelRatio] : this.image_;
    };
    /**
     * @param {number} pixelRatio Pixel ratio.
     * @return {number} Image or Canvas element.
     */
    IconImage.prototype.getPixelRatio = function (pixelRatio) {
        this.replaceColor_(pixelRatio);
        return this.canvas_[pixelRatio] ? pixelRatio : 1;
    };
    /**
     * @return {import("../ImageState.js").default} Image state.
     */
    IconImage.prototype.getImageState = function () {
        return this.imageState_;
    };
    /**
     * @return {HTMLImageElement|HTMLCanvasElement} Image element.
     */
    IconImage.prototype.getHitDetectionImage = function () {
        if (!this.hitDetectionImage_) {
            if (this.isTainted_()) {
                var width = this.size_[0];
                var height = this.size_[1];
                var context = createCanvasContext2D(width, height);
                context.fillRect(0, 0, width, height);
                this.hitDetectionImage_ = context.canvas;
            }
            else {
                this.hitDetectionImage_ = this.image_;
            }
        }
        return this.hitDetectionImage_;
    };
    /**
     * Get the size of the icon (in pixels).
     * @return {import("../size.js").Size} Image size.
     */
    IconImage.prototype.getSize = function () {
        return this.size_;
    };
    /**
     * @return {string|undefined} Image src.
     */
    IconImage.prototype.getSrc = function () {
        return this.src_;
    };
    /**
     * Load not yet loaded URI.
     */
    IconImage.prototype.load = function () {
        if (this.imageState_ == ImageState.IDLE) {
            this.imageState_ = ImageState.LOADING;
            try {
                /** @type {HTMLImageElement} */ (this.image_).src = this.src_;
            }
            catch (e) {
                this.handleImageError_();
            }
            this.unlisten_ = listenImage(this.image_, this.handleImageLoad_.bind(this), this.handleImageError_.bind(this));
        }
    };
    /**
     * @param {number} pixelRatio Pixel ratio.
     * @private
     */
    IconImage.prototype.replaceColor_ = function (pixelRatio) {
        if (!this.color_ ||
            this.canvas_[pixelRatio] ||
            this.imageState_ !== ImageState.LOADED) {
            return;
        }
        var canvas = document.createElement('canvas');
        this.canvas_[pixelRatio] = canvas;
        canvas.width = Math.ceil(this.image_.width * pixelRatio);
        canvas.height = Math.ceil(this.image_.height * pixelRatio);
        var ctx = canvas.getContext('2d');
        ctx.scale(pixelRatio, pixelRatio);
        ctx.drawImage(this.image_, 0, 0);
        ctx.globalCompositeOperation = 'multiply';
        // Internet Explorer 11 does not support the multiply operation.
        // If the canvas is tainted in Internet Explorer this still produces
        // a solid color image with the shape of the icon.
        if (ctx.globalCompositeOperation === 'multiply' || this.isTainted_()) {
            ctx.fillStyle = asString(this.color_);
            ctx.fillRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);
            ctx.globalCompositeOperation = 'destination-in';
            ctx.drawImage(this.image_, 0, 0);
        }
        else {
            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = imgData.data;
            var r = this.color_[0] / 255.0;
            var g = this.color_[1] / 255.0;
            var b = this.color_[2] / 255.0;
            var a = this.color_[3];
            for (var i = 0, ii = data.length; i < ii; i += 4) {
                data[i] *= r;
                data[i + 1] *= g;
                data[i + 2] *= b;
                data[i + 3] *= a;
            }
            ctx.putImageData(imgData, 0, 0);
        }
    };
    /**
     * Discards event handlers which listen for load completion or errors.
     *
     * @private
     */
    IconImage.prototype.unlistenImage_ = function () {
        if (this.unlisten_) {
            this.unlisten_();
            this.unlisten_ = null;
        }
    };
    return IconImage;
}(Target));
/**
 * @param {HTMLImageElement|HTMLCanvasElement} image Image.
 * @param {string} src Src.
 * @param {import("../size.js").Size} size Size.
 * @param {?string} crossOrigin Cross origin.
 * @param {import("../ImageState.js").default} imageState Image state.
 * @param {import("../color.js").Color} color Color.
 * @return {IconImage} Icon image.
 */
function get(image, src, size, crossOrigin, imageState, color) {
    var iconImage = shared.get(src, crossOrigin, color);
    if (!iconImage) {
        iconImage = new IconImage(image, src, size, crossOrigin, imageState, color);
        shared.set(src, crossOrigin, color, iconImage);
    }
    return iconImage;
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
 * @typedef {Object} Options
 * @property {Array<number>} [anchor=[0.5, 0.5]] Anchor. Default value is the icon center.
 * @property {import("./IconOrigin.js").default} [anchorOrigin='top-left'] Origin of the anchor: `bottom-left`, `bottom-right`,
 * `top-left` or `top-right`.
 * @property {import("./IconAnchorUnits.js").default} [anchorXUnits='fraction'] Units in which the anchor x value is
 * specified. A value of `'fraction'` indicates the x value is a fraction of the icon. A value of `'pixels'` indicates
 * the x value in pixels.
 * @property {import("./IconAnchorUnits.js").default} [anchorYUnits='fraction'] Units in which the anchor y value is
 * specified. A value of `'fraction'` indicates the y value is a fraction of the icon. A value of `'pixels'` indicates
 * the y value in pixels.
 * @property {import("../color.js").Color|string} [color] Color to tint the icon. If not specified,
 * the icon will be left as is.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images. Note that you must provide a
 * `crossOrigin` value if you want to access pixel data with the Canvas renderer.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {HTMLImageElement|HTMLCanvasElement} [img] Image object for the icon. If the `src` option is not provided then the
 * provided image must already be loaded. And in that case, it is required
 * to provide the size of the image, with the `imgSize` option.
 * @property {Array<number>} [offset=[0, 0]] Offset, which, together with the size and the offset origin, define the
 * sub-rectangle to use from the original icon image.
 * @property {Array<number>} [displacement=[0,0]] Displacement the icon
 * @property {import("./IconOrigin.js").default} [offsetOrigin='top-left'] Origin of the offset: `bottom-left`, `bottom-right`,
 * `top-left` or `top-right`.
 * @property {number} [opacity=1] Opacity of the icon.
 * @property {number|import("../size.js").Size} [scale=1] Scale.
 * @property {boolean} [rotateWithView=false] Whether to rotate the icon with the view.
 * @property {number} [rotation=0] Rotation in radians (positive rotation clockwise).
 * @property {import("../size.js").Size} [size] Icon size in pixel. Can be used together with `offset` to define the
 * sub-rectangle to use from the origin (sprite) icon image.
 * @property {import("../size.js").Size} [imgSize] Image size in pixels. Only required if `img` is set and `src` is not, and
 * for SVG images in Internet Explorer 11. The provided `imgSize` needs to match the actual size of the image.
 * @property {string} [src] Image source URI.
 */
/**
 * @classdesc
 * Set icon style for vector features.
 * @api
 */
var Icon = /** @class */ (function (_super) {
    __extends$8(Icon, _super);
    /**
     * @param {Options} [opt_options] Options.
     */
    function Icon(opt_options) {
        var _this = this;
        var options = opt_options || {};
        /**
         * @type {number}
         */
        var opacity = options.opacity !== undefined ? options.opacity : 1;
        /**
         * @type {number}
         */
        var rotation = options.rotation !== undefined ? options.rotation : 0;
        /**
         * @type {number|import("../size.js").Size}
         */
        var scale = options.scale !== undefined ? options.scale : 1;
        /**
         * @type {boolean}
         */
        var rotateWithView = options.rotateWithView !== undefined ? options.rotateWithView : false;
        _this = _super.call(this, {
            opacity: opacity,
            rotation: rotation,
            scale: scale,
            displacement: options.displacement !== undefined ? options.displacement : [0, 0],
            rotateWithView: rotateWithView,
        }) || this;
        /**
         * @private
         * @type {Array<number>}
         */
        _this.anchor_ = options.anchor !== undefined ? options.anchor : [0.5, 0.5];
        /**
         * @private
         * @type {Array<number>}
         */
        _this.normalizedAnchor_ = null;
        /**
         * @private
         * @type {import("./IconOrigin.js").default}
         */
        _this.anchorOrigin_ =
            options.anchorOrigin !== undefined
                ? options.anchorOrigin
                : IconOrigin.TOP_LEFT;
        /**
         * @private
         * @type {import("./IconAnchorUnits.js").default}
         */
        _this.anchorXUnits_ =
            options.anchorXUnits !== undefined
                ? options.anchorXUnits
                : IconAnchorUnits.FRACTION;
        /**
         * @private
         * @type {import("./IconAnchorUnits.js").default}
         */
        _this.anchorYUnits_ =
            options.anchorYUnits !== undefined
                ? options.anchorYUnits
                : IconAnchorUnits.FRACTION;
        /**
         * @private
         * @type {?string}
         */
        _this.crossOrigin_ =
            options.crossOrigin !== undefined ? options.crossOrigin : null;
        /**
         * @type {HTMLImageElement|HTMLCanvasElement}
         */
        var image = options.img !== undefined ? options.img : null;
        /**
         * @type {import("../size.js").Size}
         */
        var imgSize = options.imgSize !== undefined ? options.imgSize : null;
        /**
         * @type {string|undefined}
         */
        var src = options.src;
        assert(!(src !== undefined && image), 4); // `image` and `src` cannot be provided at the same time
        assert(!image || (image && imgSize), 5); // `imgSize` must be set when `image` is provided
        if ((src === undefined || src.length === 0) && image) {
            src = /** @type {HTMLImageElement} */ (image).src || getUid(image);
        }
        assert(src !== undefined && src.length > 0, 6); // A defined and non-empty `src` or `image` must be provided
        /**
         * @type {import("../ImageState.js").default}
         */
        var imageState = options.src !== undefined ? ImageState.IDLE : ImageState.LOADED;
        /**
         * @private
         * @type {import("../color.js").Color}
         */
        _this.color_ = options.color !== undefined ? asArray(options.color) : null;
        /**
         * @private
         * @type {import("./IconImage.js").default}
         */
        _this.iconImage_ = get(image, 
        /** @type {string} */ (src), imgSize, _this.crossOrigin_, imageState, _this.color_);
        /**
         * @private
         * @type {Array<number>}
         */
        _this.offset_ = options.offset !== undefined ? options.offset : [0, 0];
        /**
         * @private
         * @type {import("./IconOrigin.js").default}
         */
        _this.offsetOrigin_ =
            options.offsetOrigin !== undefined
                ? options.offsetOrigin
                : IconOrigin.TOP_LEFT;
        /**
         * @private
         * @type {Array<number>}
         */
        _this.origin_ = null;
        /**
         * @private
         * @type {import("../size.js").Size}
         */
        _this.size_ = options.size !== undefined ? options.size : null;
        return _this;
    }
    /**
     * Clones the style. The underlying Image/HTMLCanvasElement is not cloned.
     * @return {Icon} The cloned style.
     * @api
     */
    Icon.prototype.clone = function () {
        var scale = this.getScale();
        return new Icon({
            anchor: this.anchor_.slice(),
            anchorOrigin: this.anchorOrigin_,
            anchorXUnits: this.anchorXUnits_,
            anchorYUnits: this.anchorYUnits_,
            crossOrigin: this.crossOrigin_,
            color: this.color_ && this.color_.slice
                ? this.color_.slice()
                : this.color_ || undefined,
            src: this.getSrc(),
            offset: this.offset_.slice(),
            offsetOrigin: this.offsetOrigin_,
            size: this.size_ !== null ? this.size_.slice() : undefined,
            opacity: this.getOpacity(),
            scale: Array.isArray(scale) ? scale.slice() : scale,
            rotation: this.getRotation(),
            rotateWithView: this.getRotateWithView(),
        });
    };
    /**
     * Get the anchor point in pixels. The anchor determines the center point for the
     * symbolizer.
     * @return {Array<number>} Anchor.
     * @api
     */
    Icon.prototype.getAnchor = function () {
        if (this.normalizedAnchor_) {
            return this.normalizedAnchor_;
        }
        var anchor = this.anchor_;
        var size = this.getSize();
        if (this.anchorXUnits_ == IconAnchorUnits.FRACTION ||
            this.anchorYUnits_ == IconAnchorUnits.FRACTION) {
            if (!size) {
                return null;
            }
            anchor = this.anchor_.slice();
            if (this.anchorXUnits_ == IconAnchorUnits.FRACTION) {
                anchor[0] *= size[0];
            }
            if (this.anchorYUnits_ == IconAnchorUnits.FRACTION) {
                anchor[1] *= size[1];
            }
        }
        if (this.anchorOrigin_ != IconOrigin.TOP_LEFT) {
            if (!size) {
                return null;
            }
            if (anchor === this.anchor_) {
                anchor = this.anchor_.slice();
            }
            if (this.anchorOrigin_ == IconOrigin.TOP_RIGHT ||
                this.anchorOrigin_ == IconOrigin.BOTTOM_RIGHT) {
                anchor[0] = -anchor[0] + size[0];
            }
            if (this.anchorOrigin_ == IconOrigin.BOTTOM_LEFT ||
                this.anchorOrigin_ == IconOrigin.BOTTOM_RIGHT) {
                anchor[1] = -anchor[1] + size[1];
            }
        }
        var displacement = this.getDisplacement();
        anchor[0] -= displacement[0];
        anchor[1] += displacement[1];
        this.normalizedAnchor_ = anchor;
        return this.normalizedAnchor_;
    };
    /**
     * Set the anchor point. The anchor determines the center point for the
     * symbolizer.
     *
     * @param {Array<number>} anchor Anchor.
     * @api
     */
    Icon.prototype.setAnchor = function (anchor) {
        this.anchor_ = anchor;
        this.normalizedAnchor_ = null;
    };
    /**
     * Get the icon color.
     * @return {import("../color.js").Color} Color.
     * @api
     */
    Icon.prototype.getColor = function () {
        return this.color_;
    };
    /**
     * Get the image icon.
     * @param {number} pixelRatio Pixel ratio.
     * @return {HTMLImageElement|HTMLCanvasElement} Image or Canvas element.
     * @api
     */
    Icon.prototype.getImage = function (pixelRatio) {
        return this.iconImage_.getImage(pixelRatio);
    };
    /**
     * Get the pixel ratio.
     * @param {number} pixelRatio Pixel ratio.
     * @return {number} The pixel ratio of the image.
     * @api
     */
    Icon.prototype.getPixelRatio = function (pixelRatio) {
        return this.iconImage_.getPixelRatio(pixelRatio);
    };
    /**
     * @return {import("../size.js").Size} Image size.
     */
    Icon.prototype.getImageSize = function () {
        return this.iconImage_.getSize();
    };
    /**
     * @return {import("../ImageState.js").default} Image state.
     */
    Icon.prototype.getImageState = function () {
        return this.iconImage_.getImageState();
    };
    /**
     * @return {HTMLImageElement|HTMLCanvasElement} Image element.
     */
    Icon.prototype.getHitDetectionImage = function () {
        return this.iconImage_.getHitDetectionImage();
    };
    /**
     * Get the origin of the symbolizer.
     * @return {Array<number>} Origin.
     * @api
     */
    Icon.prototype.getOrigin = function () {
        if (this.origin_) {
            return this.origin_;
        }
        var offset = this.offset_;
        if (this.offsetOrigin_ != IconOrigin.TOP_LEFT) {
            var size = this.getSize();
            var iconImageSize = this.iconImage_.getSize();
            if (!size || !iconImageSize) {
                return null;
            }
            offset = offset.slice();
            if (this.offsetOrigin_ == IconOrigin.TOP_RIGHT ||
                this.offsetOrigin_ == IconOrigin.BOTTOM_RIGHT) {
                offset[0] = iconImageSize[0] - size[0] - offset[0];
            }
            if (this.offsetOrigin_ == IconOrigin.BOTTOM_LEFT ||
                this.offsetOrigin_ == IconOrigin.BOTTOM_RIGHT) {
                offset[1] = iconImageSize[1] - size[1] - offset[1];
            }
        }
        this.origin_ = offset;
        return this.origin_;
    };
    /**
     * Get the image URL.
     * @return {string|undefined} Image src.
     * @api
     */
    Icon.prototype.getSrc = function () {
        return this.iconImage_.getSrc();
    };
    /**
     * Get the size of the icon (in pixels).
     * @return {import("../size.js").Size} Image size.
     * @api
     */
    Icon.prototype.getSize = function () {
        return !this.size_ ? this.iconImage_.getSize() : this.size_;
    };
    /**
     * @param {function(import("../events/Event.js").default): void} listener Listener function.
     */
    Icon.prototype.listenImageChange = function (listener) {
        this.iconImage_.addEventListener(EventType.CHANGE, listener);
    };
    /**
     * Load not yet loaded URI.
     * When rendering a feature with an icon style, the vector renderer will
     * automatically call this method. However, you might want to call this
     * method yourself for preloading or other purposes.
     * @api
     */
    Icon.prototype.load = function () {
        this.iconImage_.load();
    };
    /**
     * @param {function(import("../events/Event.js").default): void} listener Listener function.
     */
    Icon.prototype.unlistenImageChange = function (listener) {
        this.iconImage_.removeEventListener(EventType.CHANGE, listener);
    };
    return Icon;
}(ImageStyle));

/**
 * @module ol/render/canvas/hitdetect
 */
var HIT_DETECT_RESOLUTION = 0.5;
/**
 * @param {import("../../size.js").Size} size Canvas size in css pixels.
 * @param {Array<import("../../transform.js").Transform>} transforms Transforms
 * for rendering features to all worlds of the viewport, from coordinates to css
 * pixels.
 * @param {Array<import("../../Feature.js").FeatureLike>} features
 * Features to consider for hit detection.
 * @param {import("../../style/Style.js").StyleFunction|undefined} styleFunction
 * Layer style function.
 * @param {import("../../extent.js").Extent} extent Extent.
 * @param {number} resolution Resolution.
 * @param {number} rotation Rotation.
 * @return {ImageData} Hit detection image data.
 */
function createHitDetectionImageData(size, transforms, features, styleFunction, extent, resolution, rotation) {
    var width = size[0] * HIT_DETECT_RESOLUTION;
    var height = size[1] * HIT_DETECT_RESOLUTION;
    var context = createCanvasContext2D(width, height);
    context.imageSmoothingEnabled = false;
    var canvas = context.canvas;
    var renderer = new CanvasImmediateRenderer(context, HIT_DETECT_RESOLUTION, extent, null, rotation);
    var featureCount = features.length;
    // Stretch hit detection index to use the whole available color range
    var indexFactor = Math.floor((256 * 256 * 256 - 1) / featureCount);
    var featuresByZIndex = {};
    for (var i = 1; i <= featureCount; ++i) {
        var feature = features[i - 1];
        var featureStyleFunction = feature.getStyleFunction() || styleFunction;
        if (!styleFunction) {
            continue;
        }
        var styles = featureStyleFunction(feature, resolution);
        if (!styles) {
            continue;
        }
        if (!Array.isArray(styles)) {
            styles = [styles];
        }
        var index = i * indexFactor;
        var color = '#' + ('000000' + index.toString(16)).slice(-6);
        for (var j = 0, jj = styles.length; j < jj; ++j) {
            var originalStyle = styles[j];
            var geometry = originalStyle.getGeometryFunction()(feature);
            if (!geometry || !intersects(extent, geometry.getExtent())) {
                continue;
            }
            var style = originalStyle.clone();
            var fill = style.getFill();
            if (fill) {
                fill.setColor(color);
            }
            var stroke = style.getStroke();
            if (stroke) {
                stroke.setColor(color);
                stroke.setLineDash(null);
            }
            style.setText(undefined);
            var image = originalStyle.getImage();
            if (image && image.getOpacity() !== 0) {
                var imgSize = image.getImageSize();
                if (!imgSize) {
                    continue;
                }
                var imgContext = createCanvasContext2D(imgSize[0], imgSize[1], undefined, { alpha: false });
                var img = imgContext.canvas;
                imgContext.fillStyle = color;
                imgContext.fillRect(0, 0, img.width, img.height);
                style.setImage(new Icon({
                    img: img,
                    imgSize: imgSize,
                    anchor: image.getAnchor(),
                    anchorXUnits: IconAnchorUnits.PIXELS,
                    anchorYUnits: IconAnchorUnits.PIXELS,
                    offset: image.getOrigin(),
                    opacity: 1,
                    size: image.getSize(),
                    scale: image.getScale(),
                    rotation: image.getRotation(),
                    rotateWithView: image.getRotateWithView(),
                }));
            }
            var zIndex = style.getZIndex() || 0;
            var byGeometryType = featuresByZIndex[zIndex];
            if (!byGeometryType) {
                byGeometryType = {};
                featuresByZIndex[zIndex] = byGeometryType;
                byGeometryType[GeometryType.POLYGON] = [];
                byGeometryType[GeometryType.CIRCLE] = [];
                byGeometryType[GeometryType.LINE_STRING] = [];
                byGeometryType[GeometryType.POINT] = [];
            }
            byGeometryType[geometry.getType().replace('Multi', '')].push(geometry, style);
        }
    }
    var zIndexKeys = Object.keys(featuresByZIndex)
        .map(Number)
        .sort(numberSafeCompareFunction);
    for (var i = 0, ii = zIndexKeys.length; i < ii; ++i) {
        var byGeometryType = featuresByZIndex[zIndexKeys[i]];
        for (var type in byGeometryType) {
            var geomAndStyle = byGeometryType[type];
            for (var j = 0, jj = geomAndStyle.length; j < jj; j += 2) {
                renderer.setStyle(geomAndStyle[j + 1]);
                for (var k = 0, kk = transforms.length; k < kk; ++k) {
                    renderer.setTransform(transforms[k]);
                    renderer.drawGeometry(geomAndStyle[j]);
                }
            }
        }
    }
    return context.getImageData(0, 0, canvas.width, canvas.height);
}
/**
 * @param {import("../../pixel").Pixel} pixel Pixel coordinate on the hit
 * detection canvas in css pixels.
 * @param {Array<import("../../Feature").FeatureLike>} features Features. Has to
 * match the `features` array that was passed to `createHitDetectionImageData()`.
 * @param {ImageData} imageData Hit detection image data generated by
 * `createHitDetectionImageData()`.
 * @return {Array<import("../../Feature").FeatureLike>} features Features.
 */
function hitDetect(pixel, features, imageData) {
    var resultFeatures = [];
    if (imageData) {
        var x = Math.floor(Math.round(pixel[0]) * HIT_DETECT_RESOLUTION);
        var y = Math.floor(Math.round(pixel[1]) * HIT_DETECT_RESOLUTION);
        // The pixel coordinate is clamped down to the hit-detect canvas' size to account
        // for browsers returning coordinates slightly larger than the actual canvas size
        // due to a non-integer pixel ratio.
        var index = (clamp(x, 0, imageData.width - 1) +
            clamp(y, 0, imageData.height - 1) * imageData.width) *
            4;
        var r = imageData.data[index];
        var g = imageData.data[index + 1];
        var b = imageData.data[index + 2];
        var i = b + 256 * (g + 256 * r);
        var indexFactor = Math.floor((256 * 256 * 256 - 1) / features.length);
        if (i && i % indexFactor === 0) {
            resultFeatures.push(features[i / indexFactor - 1]);
        }
    }
    return resultFeatures;
}

/**
 * @module ol/renderer/vector
 */
/**
 * Feature callback. The callback will be called with three arguments. The first
 * argument is one {@link module:ol/Feature feature} or {@link module:ol/render/Feature render feature}
 * at the pixel, the second is the {@link module:ol/layer/Layer layer} of the feature and will be null for
 * unmanaged layers. The third is the {@link module:ol/geom/SimpleGeometry} of the feature. For features
 * with a GeometryCollection geometry, it will be the first detected geometry from the collection.
 * @template T
 * @typedef {function(import("../Feature.js").FeatureLike, import("../layer/Layer.js").default<import("../source/Source").default>, import("../geom/SimpleGeometry.js").default): T} FeatureCallback
 */
/**
 * Tolerance for geometry simplification in device pixels.
 * @type {number}
 */
var SIMPLIFY_TOLERANCE = 0.5;
/**
 * @const
 * @type {Object<import("../geom/GeometryType.js").default,
 *                function(import("../render/canvas/BuilderGroup.js").default, import("../geom/Geometry.js").default,
 *                         import("../style/Style.js").default, Object): void>}
 */
var GEOMETRY_RENDERERS = {
    'Point': renderPointGeometry,
    'LineString': renderLineStringGeometry,
    'Polygon': renderPolygonGeometry,
    'MultiPoint': renderMultiPointGeometry,
    'MultiLineString': renderMultiLineStringGeometry,
    'MultiPolygon': renderMultiPolygonGeometry,
    'GeometryCollection': renderGeometryCollectionGeometry,
    'Circle': renderCircleGeometry,
};
/**
 * @param {import("../Feature.js").FeatureLike} feature1 Feature 1.
 * @param {import("../Feature.js").FeatureLike} feature2 Feature 2.
 * @return {number} Order.
 */
function defaultOrder(feature1, feature2) {
    return parseInt(getUid(feature1), 10) - parseInt(getUid(feature2), 10);
}
/**
 * @param {number} resolution Resolution.
 * @param {number} pixelRatio Pixel ratio.
 * @return {number} Squared pixel tolerance.
 */
function getSquaredTolerance(resolution, pixelRatio) {
    var tolerance = getTolerance(resolution, pixelRatio);
    return tolerance * tolerance;
}
/**
 * @param {number} resolution Resolution.
 * @param {number} pixelRatio Pixel ratio.
 * @return {number} Pixel tolerance.
 */
function getTolerance(resolution, pixelRatio) {
    return (SIMPLIFY_TOLERANCE * resolution) / pixelRatio;
}
/**
 * @param {import("../render/canvas/BuilderGroup.js").default} builderGroup Builder group.
 * @param {import("../geom/Circle.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").default} feature Feature.
 * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
 */
function renderCircleGeometry(builderGroup, geometry, style, feature, opt_declutterBuilderGroup) {
    var fillStyle = style.getFill();
    var strokeStyle = style.getStroke();
    if (fillStyle || strokeStyle) {
        var circleReplay = builderGroup.getBuilder(style.getZIndex(), BuilderType.CIRCLE);
        circleReplay.setFillStrokeStyle(fillStyle, strokeStyle);
        circleReplay.drawCircle(geometry, feature);
    }
    var textStyle = style.getText();
    if (textStyle && textStyle.getText()) {
        var textReplay = (opt_declutterBuilderGroup || builderGroup).getBuilder(style.getZIndex(), BuilderType.TEXT);
        textReplay.setTextStyle(textStyle);
        textReplay.drawText(geometry, feature);
    }
}
/**
 * @param {import("../render/canvas/BuilderGroup.js").default} replayGroup Replay group.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 * @param {import("../style/Style.js").default} style Style.
 * @param {number} squaredTolerance Squared tolerance.
 * @param {function(import("../events/Event.js").default): void} listener Listener function.
 * @param {import("../proj.js").TransformFunction} [opt_transform] Transform from user to view projection.
 * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
 * @return {boolean} `true` if style is loading.
 */
function renderFeature(replayGroup, feature, style, squaredTolerance, listener, opt_transform, opt_declutterBuilderGroup) {
    var loading = false;
    var imageStyle = style.getImage();
    if (imageStyle) {
        var imageState = imageStyle.getImageState();
        if (imageState == ImageState.LOADED || imageState == ImageState.ERROR) {
            imageStyle.unlistenImageChange(listener);
        }
        else {
            if (imageState == ImageState.IDLE) {
                imageStyle.load();
            }
            imageState = imageStyle.getImageState();
            imageStyle.listenImageChange(listener);
            loading = true;
        }
    }
    renderFeatureInternal(replayGroup, feature, style, squaredTolerance, opt_transform, opt_declutterBuilderGroup);
    return loading;
}
/**
 * @param {import("../render/canvas/BuilderGroup.js").default} replayGroup Replay group.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 * @param {import("../style/Style.js").default} style Style.
 * @param {number} squaredTolerance Squared tolerance.
 * @param {import("../proj.js").TransformFunction} [opt_transform] Optional transform function.
 * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
 */
function renderFeatureInternal(replayGroup, feature, style, squaredTolerance, opt_transform, opt_declutterBuilderGroup) {
    var geometry = style.getGeometryFunction()(feature);
    if (!geometry) {
        return;
    }
    var simplifiedGeometry = geometry.simplifyTransformed(squaredTolerance, opt_transform);
    var renderer = style.getRenderer();
    if (renderer) {
        renderGeometry(replayGroup, simplifiedGeometry, style, feature);
    }
    else {
        var geometryRenderer = GEOMETRY_RENDERERS[simplifiedGeometry.getType()];
        geometryRenderer(replayGroup, simplifiedGeometry, style, feature, opt_declutterBuilderGroup);
    }
}
/**
 * @param {import("../render/canvas/BuilderGroup.js").default} replayGroup Replay group.
 * @param {import("../geom/Geometry.js").default|import("../render/Feature.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 */
function renderGeometry(replayGroup, geometry, style, feature) {
    if (geometry.getType() == GeometryType.GEOMETRY_COLLECTION) {
        var geometries = 
        /** @type {import("../geom/GeometryCollection.js").default} */ (geometry).getGeometries();
        for (var i = 0, ii = geometries.length; i < ii; ++i) {
            renderGeometry(replayGroup, geometries[i], style, feature);
        }
        return;
    }
    var replay = replayGroup.getBuilder(style.getZIndex(), BuilderType.DEFAULT);
    replay.drawCustom(
    /** @type {import("../geom/SimpleGeometry.js").default} */ (geometry), feature, style.getRenderer(), style.getHitDetectionRenderer());
}
/**
 * @param {import("../render/canvas/BuilderGroup.js").default} replayGroup Replay group.
 * @param {import("../geom/GeometryCollection.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").default} feature Feature.
 * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
 */
function renderGeometryCollectionGeometry(replayGroup, geometry, style, feature, opt_declutterBuilderGroup) {
    var geometries = geometry.getGeometriesArray();
    var i, ii;
    for (i = 0, ii = geometries.length; i < ii; ++i) {
        var geometryRenderer = GEOMETRY_RENDERERS[geometries[i].getType()];
        geometryRenderer(replayGroup, geometries[i], style, feature, opt_declutterBuilderGroup);
    }
}
/**
 * @param {import("../render/canvas/BuilderGroup.js").default} builderGroup Replay group.
 * @param {import("../geom/LineString.js").default|import("../render/Feature.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
 */
function renderLineStringGeometry(builderGroup, geometry, style, feature, opt_declutterBuilderGroup) {
    var strokeStyle = style.getStroke();
    if (strokeStyle) {
        var lineStringReplay = builderGroup.getBuilder(style.getZIndex(), BuilderType.LINE_STRING);
        lineStringReplay.setFillStrokeStyle(null, strokeStyle);
        lineStringReplay.drawLineString(geometry, feature);
    }
    var textStyle = style.getText();
    if (textStyle && textStyle.getText()) {
        var textReplay = (opt_declutterBuilderGroup || builderGroup).getBuilder(style.getZIndex(), BuilderType.TEXT);
        textReplay.setTextStyle(textStyle);
        textReplay.drawText(geometry, feature);
    }
}
/**
 * @param {import("../render/canvas/BuilderGroup.js").default} builderGroup Replay group.
 * @param {import("../geom/MultiLineString.js").default|import("../render/Feature.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
 */
function renderMultiLineStringGeometry(builderGroup, geometry, style, feature, opt_declutterBuilderGroup) {
    var strokeStyle = style.getStroke();
    if (strokeStyle) {
        var lineStringReplay = builderGroup.getBuilder(style.getZIndex(), BuilderType.LINE_STRING);
        lineStringReplay.setFillStrokeStyle(null, strokeStyle);
        lineStringReplay.drawMultiLineString(geometry, feature);
    }
    var textStyle = style.getText();
    if (textStyle && textStyle.getText()) {
        var textReplay = (opt_declutterBuilderGroup || builderGroup).getBuilder(style.getZIndex(), BuilderType.TEXT);
        textReplay.setTextStyle(textStyle);
        textReplay.drawText(geometry, feature);
    }
}
/**
 * @param {import("../render/canvas/BuilderGroup.js").default} builderGroup Replay group.
 * @param {import("../geom/MultiPolygon.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").default} feature Feature.
 * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
 */
function renderMultiPolygonGeometry(builderGroup, geometry, style, feature, opt_declutterBuilderGroup) {
    var fillStyle = style.getFill();
    var strokeStyle = style.getStroke();
    if (strokeStyle || fillStyle) {
        var polygonReplay = builderGroup.getBuilder(style.getZIndex(), BuilderType.POLYGON);
        polygonReplay.setFillStrokeStyle(fillStyle, strokeStyle);
        polygonReplay.drawMultiPolygon(geometry, feature);
    }
    var textStyle = style.getText();
    if (textStyle && textStyle.getText()) {
        var textReplay = (opt_declutterBuilderGroup || builderGroup).getBuilder(style.getZIndex(), BuilderType.TEXT);
        textReplay.setTextStyle(textStyle);
        textReplay.drawText(geometry, feature);
    }
}
/**
 * @param {import("../render/canvas/BuilderGroup.js").default} builderGroup Replay group.
 * @param {import("../geom/Point.js").default|import("../render/Feature.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
 */
function renderPointGeometry(builderGroup, geometry, style, feature, opt_declutterBuilderGroup) {
    var imageStyle = style.getImage();
    var textStyle = style.getText();
    /** @type {import("../render/canvas.js").DeclutterImageWithText} */
    var declutterImageWithText;
    if (opt_declutterBuilderGroup) {
        builderGroup = opt_declutterBuilderGroup;
        declutterImageWithText =
            imageStyle && textStyle && textStyle.getText() ? {} : undefined;
    }
    if (imageStyle) {
        if (imageStyle.getImageState() != ImageState.LOADED) {
            return;
        }
        var imageReplay = builderGroup.getBuilder(style.getZIndex(), BuilderType.IMAGE);
        imageReplay.setImageStyle(imageStyle, declutterImageWithText);
        imageReplay.drawPoint(geometry, feature);
    }
    if (textStyle && textStyle.getText()) {
        var textReplay = builderGroup.getBuilder(style.getZIndex(), BuilderType.TEXT);
        textReplay.setTextStyle(textStyle, declutterImageWithText);
        textReplay.drawText(geometry, feature);
    }
}
/**
 * @param {import("../render/canvas/BuilderGroup.js").default} builderGroup Replay group.
 * @param {import("../geom/MultiPoint.js").default|import("../render/Feature.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
 */
function renderMultiPointGeometry(builderGroup, geometry, style, feature, opt_declutterBuilderGroup) {
    var imageStyle = style.getImage();
    var textStyle = style.getText();
    /** @type {import("../render/canvas.js").DeclutterImageWithText} */
    var declutterImageWithText;
    if (opt_declutterBuilderGroup) {
        builderGroup = opt_declutterBuilderGroup;
        declutterImageWithText =
            imageStyle && textStyle && textStyle.getText() ? {} : undefined;
    }
    if (imageStyle) {
        if (imageStyle.getImageState() != ImageState.LOADED) {
            return;
        }
        var imageReplay = builderGroup.getBuilder(style.getZIndex(), BuilderType.IMAGE);
        imageReplay.setImageStyle(imageStyle, declutterImageWithText);
        imageReplay.drawMultiPoint(geometry, feature);
    }
    if (textStyle && textStyle.getText()) {
        var textReplay = (opt_declutterBuilderGroup || builderGroup).getBuilder(style.getZIndex(), BuilderType.TEXT);
        textReplay.setTextStyle(textStyle, declutterImageWithText);
        textReplay.drawText(geometry, feature);
    }
}
/**
 * @param {import("../render/canvas/BuilderGroup.js").default} builderGroup Replay group.
 * @param {import("../geom/Polygon.js").default|import("../render/Feature.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
 */
function renderPolygonGeometry(builderGroup, geometry, style, feature, opt_declutterBuilderGroup) {
    var fillStyle = style.getFill();
    var strokeStyle = style.getStroke();
    if (fillStyle || strokeStyle) {
        var polygonReplay = builderGroup.getBuilder(style.getZIndex(), BuilderType.POLYGON);
        polygonReplay.setFillStrokeStyle(fillStyle, strokeStyle);
        polygonReplay.drawPolygon(geometry, feature);
    }
    var textStyle = style.getText();
    if (textStyle && textStyle.getText()) {
        var textReplay = (opt_declutterBuilderGroup || builderGroup).getBuilder(style.getZIndex(), BuilderType.TEXT);
        textReplay.setTextStyle(textStyle);
        textReplay.drawText(geometry, feature);
    }
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
 * @classdesc
 * Canvas renderer for vector layers.
 * @api
 */
var CanvasVectorLayerRenderer = /** @class */ (function (_super) {
    __extends$9(CanvasVectorLayerRenderer, _super);
    /**
     * @param {import("../../layer/Vector.js").default} vectorLayer Vector layer.
     */
    function CanvasVectorLayerRenderer(vectorLayer) {
        var _this = _super.call(this, vectorLayer) || this;
        /** @private */
        _this.boundHandleStyleImageChange_ = _this.handleStyleImageChange_.bind(_this);
        /**
         * @type {boolean}
         */
        _this.animatingOrInteracting_;
        /**
         * @private
         * @type {boolean}
         */
        _this.dirty_ = false;
        /**
         * @type {ImageData}
         */
        _this.hitDetectionImageData_ = null;
        /**
         * @type {Array<import("../../Feature.js").default>}
         */
        _this.renderedFeatures_ = null;
        /**
         * @private
         * @type {number}
         */
        _this.renderedRevision_ = -1;
        /**
         * @private
         * @type {number}
         */
        _this.renderedResolution_ = NaN;
        /**
         * @private
         * @type {import("../../extent.js").Extent}
         */
        _this.renderedExtent_ = createEmpty();
        /**
         * @private
         * @type {import("../../extent.js").Extent}
         */
        _this.wrappedRenderedExtent_ = createEmpty();
        /**
         * @private
         * @type {number}
         */
        _this.renderedRotation_;
        /**
         * @private
         * @type {import("../../coordinate").Coordinate}
         */
        _this.renderedCenter_ = null;
        /**
         * @private
         * @type {import("../../proj/Projection").default}
         */
        _this.renderedProjection_ = null;
        /**
         * @private
         * @type {function(import("../../Feature.js").default, import("../../Feature.js").default): number|null}
         */
        _this.renderedRenderOrder_ = null;
        /**
         * @private
         * @type {import("../../render/canvas/ExecutorGroup").default}
         */
        _this.replayGroup_ = null;
        /**
         * A new replay group had to be created by `prepareFrame()`
         * @type {boolean}
         */
        _this.replayGroupChanged = true;
        /**
         * @type {import("../../render/canvas/ExecutorGroup").default}
         */
        _this.declutterExecutorGroup = null;
        /**
         * Clipping to be performed by `renderFrame()`
         * @type {boolean}
         */
        _this.clipping = true;
        return _this;
    }
    /**
     * Get a rendering container from an existing target, if compatible.
     * @param {HTMLElement} target Potential render target.
     * @param {string} transform CSS Transform.
     * @param {number} opacity Opacity.
     */
    CanvasVectorLayerRenderer.prototype.useContainer = function (target, transform, opacity) {
        if (opacity < 1) {
            target = null;
        }
        _super.prototype.useContainer.call(this, target, transform, opacity);
    };
    /**
     * @param {ExecutorGroup} executorGroup Executor group.
     * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
     * @param {import("rbush").default} [opt_declutterTree] Declutter tree.
     */
    CanvasVectorLayerRenderer.prototype.renderWorlds = function (executorGroup, frameState, opt_declutterTree) {
        var extent = frameState.extent;
        var viewState = frameState.viewState;
        var center = viewState.center;
        var resolution = viewState.resolution;
        var projection = viewState.projection;
        var rotation = viewState.rotation;
        var projectionExtent = projection.getExtent();
        var vectorSource = this.getLayer().getSource();
        var pixelRatio = frameState.pixelRatio;
        var viewHints = frameState.viewHints;
        var snapToPixel = !(viewHints[ViewHint.ANIMATING] || viewHints[ViewHint.INTERACTING]);
        var context = this.context;
        var width = Math.round(frameState.size[0] * pixelRatio);
        var height = Math.round(frameState.size[1] * pixelRatio);
        var multiWorld = vectorSource.getWrapX() && projection.canWrapX();
        var worldWidth = multiWorld ? getWidth(projectionExtent) : null;
        var endWorld = multiWorld
            ? Math.ceil((extent[2] - projectionExtent[2]) / worldWidth) + 1
            : 1;
        var world = multiWorld
            ? Math.floor((extent[0] - projectionExtent[0]) / worldWidth)
            : 0;
        do {
            var transform = this.getRenderTransform(center, resolution, rotation, pixelRatio, width, height, world * worldWidth);
            executorGroup.execute(context, 1, transform, rotation, snapToPixel, undefined, opt_declutterTree);
        } while (++world < endWorld);
    };
    /**
     * Render declutter items for this layer
     * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
     */
    CanvasVectorLayerRenderer.prototype.renderDeclutter = function (frameState) {
        if (this.declutterExecutorGroup) {
            this.renderWorlds(this.declutterExecutorGroup, frameState, frameState.declutterTree);
        }
    };
    /**
     * Render the layer.
     * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
     * @param {HTMLElement} target Target that may be used to render content to.
     * @return {HTMLElement} The rendered element.
     */
    CanvasVectorLayerRenderer.prototype.renderFrame = function (frameState, target) {
        var pixelRatio = frameState.pixelRatio;
        var layerState = frameState.layerStatesArray[frameState.layerIndex];
        // set forward and inverse pixel transforms
        makeScale(this.pixelTransform, 1 / pixelRatio, 1 / pixelRatio);
        makeInverse(this.inversePixelTransform, this.pixelTransform);
        var canvasTransform = toString(this.pixelTransform);
        this.useContainer(target, canvasTransform, layerState.opacity);
        var context = this.context;
        var canvas = context.canvas;
        var replayGroup = this.replayGroup_;
        var declutterExecutorGroup = this.declutterExecutorGroup;
        if ((!replayGroup || replayGroup.isEmpty()) &&
            (!declutterExecutorGroup || declutterExecutorGroup.isEmpty())) {
            return null;
        }
        // resize and clear
        var width = Math.round(frameState.size[0] * pixelRatio);
        var height = Math.round(frameState.size[1] * pixelRatio);
        if (canvas.width != width || canvas.height != height) {
            canvas.width = width;
            canvas.height = height;
            if (canvas.style.transform !== canvasTransform) {
                canvas.style.transform = canvasTransform;
            }
        }
        else if (!this.containerReused) {
            context.clearRect(0, 0, width, height);
        }
        this.preRender(context, frameState);
        var viewState = frameState.viewState;
        var projection = viewState.projection;
        // clipped rendering if layer extent is set
        var clipped = false;
        var render = true;
        if (layerState.extent && this.clipping) {
            var layerExtent = fromUserExtent(layerState.extent);
            render = intersects(layerExtent, frameState.extent);
            clipped = render && !containsExtent(layerExtent, frameState.extent);
            if (clipped) {
                this.clipUnrotated(context, frameState, layerExtent);
            }
        }
        if (render) {
            this.renderWorlds(replayGroup, frameState);
        }
        if (clipped) {
            context.restore();
        }
        this.postRender(context, frameState);
        var opacity = cssOpacity(layerState.opacity);
        var container = this.container;
        if (opacity !== container.style.opacity) {
            container.style.opacity = opacity;
        }
        if (this.renderedRotation_ !== viewState.rotation) {
            this.renderedRotation_ = viewState.rotation;
            this.hitDetectionImageData_ = null;
        }
        return this.container;
    };
    /**
     * Asynchronous layer level hit detection.
     * @param {import("../../pixel.js").Pixel} pixel Pixel.
     * @return {Promise<Array<import("../../Feature").default>>} Promise that resolves with an array of features.
     */
    CanvasVectorLayerRenderer.prototype.getFeatures = function (pixel) {
        return new Promise(
        /**
         * @param {function(Array<import("../../Feature").default|import("../../render/Feature").default>): void} resolve Resolver function.
         * @this {CanvasVectorLayerRenderer}
         */
        function (resolve) {
            if (!this.hitDetectionImageData_ && !this.animatingOrInteracting_) {
                var size = [this.context.canvas.width, this.context.canvas.height];
                apply(this.pixelTransform, size);
                var center = this.renderedCenter_;
                var resolution = this.renderedResolution_;
                var rotation = this.renderedRotation_;
                var projection = this.renderedProjection_;
                var extent = this.wrappedRenderedExtent_;
                var layer = this.getLayer();
                var transforms = [];
                var width = size[0] * HIT_DETECT_RESOLUTION;
                var height = size[1] * HIT_DETECT_RESOLUTION;
                transforms.push(this.getRenderTransform(center, resolution, rotation, HIT_DETECT_RESOLUTION, width, height, 0).slice());
                var source = layer.getSource();
                var projectionExtent = projection.getExtent();
                if (source.getWrapX() &&
                    projection.canWrapX() &&
                    !containsExtent(projectionExtent, extent)) {
                    var startX = extent[0];
                    var worldWidth = getWidth(projectionExtent);
                    var world = 0;
                    var offsetX = void 0;
                    while (startX < projectionExtent[0]) {
                        --world;
                        offsetX = worldWidth * world;
                        transforms.push(this.getRenderTransform(center, resolution, rotation, HIT_DETECT_RESOLUTION, width, height, offsetX).slice());
                        startX += worldWidth;
                    }
                    world = 0;
                    startX = extent[2];
                    while (startX > projectionExtent[2]) {
                        ++world;
                        offsetX = worldWidth * world;
                        transforms.push(this.getRenderTransform(center, resolution, rotation, HIT_DETECT_RESOLUTION, width, height, offsetX).slice());
                        startX -= worldWidth;
                    }
                }
                this.hitDetectionImageData_ = createHitDetectionImageData(size, transforms, this.renderedFeatures_, layer.getStyleFunction(), extent, resolution, rotation);
            }
            resolve(hitDetect(pixel, this.renderedFeatures_, this.hitDetectionImageData_));
        }.bind(this));
    };
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
     * @param {number} hitTolerance Hit tolerance in pixels.
     * @param {import("../vector.js").FeatureCallback<T>} callback Feature callback.
     * @param {Array<import("../Map.js").HitMatch<T>>} matches The hit detected matches with tolerance.
     * @return {T|undefined} Callback result.
     * @template T
     */
    CanvasVectorLayerRenderer.prototype.forEachFeatureAtCoordinate = function (coordinate, frameState, hitTolerance, callback, matches) {
        var _this = this;
        if (!this.replayGroup_) {
            return undefined;
        }
        var resolution = frameState.viewState.resolution;
        var rotation = frameState.viewState.rotation;
        var layer = this.getLayer();
        /** @type {!Object<string, import("../Map.js").HitMatch<T>|true>} */
        var features = {};
        /**
         * @param {import("../../Feature.js").FeatureLike} feature Feature.
         * @param {import("../../geom/SimpleGeometry.js").default} geometry Geometry.
         * @param {number} distanceSq The squared distance to the click position
         * @return {T|undefined} Callback result.
         */
        var featureCallback = function (feature, geometry, distanceSq) {
            var key = getUid(feature);
            var match = features[key];
            if (!match) {
                if (distanceSq === 0) {
                    features[key] = true;
                    return callback(feature, layer, geometry);
                }
                matches.push((features[key] = {
                    feature: feature,
                    layer: layer,
                    geometry: geometry,
                    distanceSq: distanceSq,
                    callback: callback,
                }));
            }
            else if (match !== true && distanceSq < match.distanceSq) {
                if (distanceSq === 0) {
                    features[key] = true;
                    matches.splice(matches.lastIndexOf(match), 1);
                    return callback(feature, layer, geometry);
                }
                match.geometry = geometry;
                match.distanceSq = distanceSq;
            }
            return undefined;
        };
        var result;
        var executorGroups = [this.replayGroup_];
        if (this.declutterExecutorGroup) {
            executorGroups.push(this.declutterExecutorGroup);
        }
        executorGroups.some(function (executorGroup) {
            return (result = executorGroup.forEachFeatureAtCoordinate(coordinate, resolution, rotation, hitTolerance, featureCallback, executorGroup === _this.declutterExecutorGroup
                ? frameState.declutterTree.all().map(function (item) { return item.value; })
                : null));
        });
        return result;
    };
    /**
     * Perform action necessary to get the layer rendered after new fonts have loaded
     */
    CanvasVectorLayerRenderer.prototype.handleFontsChanged = function () {
        var layer = this.getLayer();
        if (layer.getVisible() && this.replayGroup_) {
            layer.changed();
        }
    };
    /**
     * Handle changes in image style state.
     * @param {import("../../events/Event.js").default} event Image style change event.
     * @private
     */
    CanvasVectorLayerRenderer.prototype.handleStyleImageChange_ = function (event) {
        this.renderIfReadyAndVisible();
    };
    /**
     * Determine whether render should be called.
     * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
     * @return {boolean} Layer is ready to be rendered.
     */
    CanvasVectorLayerRenderer.prototype.prepareFrame = function (frameState) {
        var vectorLayer = this.getLayer();
        var vectorSource = vectorLayer.getSource();
        if (!vectorSource) {
            return false;
        }
        var animating = frameState.viewHints[ViewHint.ANIMATING];
        var interacting = frameState.viewHints[ViewHint.INTERACTING];
        var updateWhileAnimating = vectorLayer.getUpdateWhileAnimating();
        var updateWhileInteracting = vectorLayer.getUpdateWhileInteracting();
        if ((!this.dirty_ && !updateWhileAnimating && animating) ||
            (!updateWhileInteracting && interacting)) {
            this.animatingOrInteracting_ = true;
            return true;
        }
        this.animatingOrInteracting_ = false;
        var frameStateExtent = frameState.extent;
        var viewState = frameState.viewState;
        var projection = viewState.projection;
        var resolution = viewState.resolution;
        var pixelRatio = frameState.pixelRatio;
        var vectorLayerRevision = vectorLayer.getRevision();
        var vectorLayerRenderBuffer = vectorLayer.getRenderBuffer();
        var vectorLayerRenderOrder = vectorLayer.getRenderOrder();
        if (vectorLayerRenderOrder === undefined) {
            vectorLayerRenderOrder = defaultOrder;
        }
        var center = viewState.center.slice();
        var extent = buffer(frameStateExtent, vectorLayerRenderBuffer * resolution);
        var renderedExtent = extent.slice();
        var loadExtents = [extent.slice()];
        var projectionExtent = projection.getExtent();
        if (vectorSource.getWrapX() &&
            projection.canWrapX() &&
            !containsExtent(projectionExtent, frameState.extent)) {
            // For the replay group, we need an extent that intersects the real world
            // (-180° to +180°). To support geometries in a coordinate range from -540°
            // to +540°, we add at least 1 world width on each side of the projection
            // extent. If the viewport is wider than the world, we need to add half of
            // the viewport width to make sure we cover the whole viewport.
            var worldWidth = getWidth(projectionExtent);
            var gutter = Math.max(getWidth(extent) / 2, worldWidth);
            extent[0] = projectionExtent[0] - gutter;
            extent[2] = projectionExtent[2] + gutter;
            wrapX(center, projection);
            var loadExtent = wrapX$1(loadExtents[0], projection);
            // If the extent crosses the date line, we load data for both edges of the worlds
            if (loadExtent[0] < projectionExtent[0] &&
                loadExtent[2] < projectionExtent[2]) {
                loadExtents.push([
                    loadExtent[0] + worldWidth,
                    loadExtent[1],
                    loadExtent[2] + worldWidth,
                    loadExtent[3],
                ]);
            }
            else if (loadExtent[0] > projectionExtent[0] &&
                loadExtent[2] > projectionExtent[2]) {
                loadExtents.push([
                    loadExtent[0] - worldWidth,
                    loadExtent[1],
                    loadExtent[2] - worldWidth,
                    loadExtent[3],
                ]);
            }
        }
        if (!this.dirty_ &&
            this.renderedResolution_ == resolution &&
            this.renderedRevision_ == vectorLayerRevision &&
            this.renderedRenderOrder_ == vectorLayerRenderOrder &&
            containsExtent(this.wrappedRenderedExtent_, extent)) {
            if (!equals(this.renderedExtent_, renderedExtent)) {
                this.hitDetectionImageData_ = null;
                this.renderedExtent_ = renderedExtent;
            }
            this.renderedCenter_ = center;
            this.replayGroupChanged = false;
            return true;
        }
        this.replayGroup_ = null;
        this.dirty_ = false;
        var replayGroup = new BuilderGroup(getTolerance(resolution, pixelRatio), extent, resolution, pixelRatio);
        var declutterBuilderGroup;
        if (this.getLayer().getDeclutter()) {
            declutterBuilderGroup = new BuilderGroup(getTolerance(resolution, pixelRatio), extent, resolution, pixelRatio);
        }
        var userTransform;
        var i, ii; {
            for (var i = 0, ii = loadExtents.length; i < ii; ++i) {
                vectorSource.loadFeatures(loadExtents[i], resolution, projection);
            }
        }
        var squaredTolerance = getSquaredTolerance(resolution, pixelRatio);
        var render = 
        /**
         * @param {import("../../Feature.js").default} feature Feature.
         * @this {CanvasVectorLayerRenderer}
         */
        function (feature) {
            var styles;
            var styleFunction = feature.getStyleFunction() || vectorLayer.getStyleFunction();
            if (styleFunction) {
                styles = styleFunction(feature, resolution);
            }
            if (styles) {
                var dirty = this.renderFeature(feature, squaredTolerance, styles, replayGroup, userTransform, declutterBuilderGroup);
                this.dirty_ = this.dirty_ || dirty;
            }
        }.bind(this);
        var userExtent = toUserExtent(extent);
        /** @type {Array<import("../../Feature.js").default>} */
        var features = vectorSource.getFeaturesInExtent(userExtent);
        if (vectorLayerRenderOrder) {
            features.sort(vectorLayerRenderOrder);
        }
        for (var i = 0, ii = features.length; i < ii; ++i) {
            render(features[i]);
        }
        this.renderedFeatures_ = features;
        var replayGroupInstructions = replayGroup.finish();
        var executorGroup = new ExecutorGroup(extent, resolution, pixelRatio, vectorSource.getOverlaps(), replayGroupInstructions, vectorLayer.getRenderBuffer());
        if (declutterBuilderGroup) {
            this.declutterExecutorGroup = new ExecutorGroup(extent, resolution, pixelRatio, vectorSource.getOverlaps(), declutterBuilderGroup.finish(), vectorLayer.getRenderBuffer());
        }
        this.renderedResolution_ = resolution;
        this.renderedRevision_ = vectorLayerRevision;
        this.renderedRenderOrder_ = vectorLayerRenderOrder;
        this.renderedExtent_ = renderedExtent;
        this.wrappedRenderedExtent_ = extent;
        this.renderedCenter_ = center;
        this.renderedProjection_ = projection;
        this.replayGroup_ = executorGroup;
        this.hitDetectionImageData_ = null;
        this.replayGroupChanged = true;
        return true;
    };
    /**
     * @param {import("../../Feature.js").default} feature Feature.
     * @param {number} squaredTolerance Squared render tolerance.
     * @param {import("../../style/Style.js").default|Array<import("../../style/Style.js").default>} styles The style or array of styles.
     * @param {import("../../render/canvas/BuilderGroup.js").default} builderGroup Builder group.
     * @param {import("../../proj.js").TransformFunction} [opt_transform] Transform from user to view projection.
     * @param {import("../../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
     * @return {boolean} `true` if an image is loading.
     */
    CanvasVectorLayerRenderer.prototype.renderFeature = function (feature, squaredTolerance, styles, builderGroup, opt_transform, opt_declutterBuilderGroup) {
        if (!styles) {
            return false;
        }
        var loading = false;
        if (Array.isArray(styles)) {
            for (var i = 0, ii = styles.length; i < ii; ++i) {
                loading =
                    renderFeature(builderGroup, feature, styles[i], squaredTolerance, this.boundHandleStyleImageChange_, opt_transform, opt_declutterBuilderGroup) || loading;
            }
        }
        else {
            loading = renderFeature(builderGroup, feature, styles, squaredTolerance, this.boundHandleStyleImageChange_, opt_transform, opt_declutterBuilderGroup);
        }
        return loading;
    };
    return CanvasVectorLayerRenderer;
}(CanvasLayerRenderer));

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
 * @classdesc
 * Vector data that is rendered client-side.
 * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
 * property on the layer object; for example, setting `title: 'My Title'` in the
 * options means that `title` is observable, and has get/set accessors.
 *
 * @template {import("../source/Vector.js").default} VectorSourceType
 * @extends {BaseVectorLayer<VectorSourceType>}
 * @api
 */
var VectorLayer = /** @class */ (function (_super) {
    __extends$a(VectorLayer, _super);
    /**
     * @param {import("./BaseVector.js").Options<VectorSourceType>} [opt_options] Options.
     */
    function VectorLayer(opt_options) {
        return _super.call(this, opt_options) || this;
    }
    /**
     * Create a renderer for this layer.
     * @return {import("../renderer/Layer.js").default} A layer renderer.
     */
    VectorLayer.prototype.createRenderer = function () {
        return new CanvasVectorLayerRenderer(this);
    };
    return VectorLayer;
}(BaseVectorLayer));

export default VectorLayer;
