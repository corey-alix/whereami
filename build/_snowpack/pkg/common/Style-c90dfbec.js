import { C as CircleStyle } from './Circle-ccc6334f.js';
import { F as Fill } from './Fill-b56e9031.js';
import { S as Stroke } from './Stroke-d95c136e.js';
import { a as assert } from './asserts-e0c6c4d5.js';

/**
 * @module ol/style/Style
 */
/**
 * A function that takes an {@link module:ol/Feature} and a `{number}`
 * representing the view's resolution. The function should return a
 * {@link module:ol/style/Style} or an array of them. This way e.g. a
 * vector layer can be styled. If the function returns `undefined`, the
 * feature will not be rendered.
 *
 * @typedef {function(import("../Feature.js").FeatureLike, number):(Style|Array<Style>|void)} StyleFunction
 */
/**
 * A {@link Style}, an array of {@link Style}, or a {@link StyleFunction}.
 * @typedef {Style|Array<Style>|StyleFunction} StyleLike
 */
/**
 * A function that takes an {@link module:ol/Feature} as argument and returns an
 * {@link module:ol/geom/Geometry} that will be rendered and styled for the feature.
 *
 * @typedef {function(import("../Feature.js").FeatureLike):
 *     (import("../geom/Geometry.js").default|import("../render/Feature.js").default|undefined)} GeometryFunction
 */
/**
 * Custom renderer function. Takes two arguments:
 *
 * 1. The pixel coordinates of the geometry in GeoJSON notation.
 * 2. The {@link module:ol/render~State} of the layer renderer.
 *
 * @typedef {function((import("../coordinate.js").Coordinate|Array<import("../coordinate.js").Coordinate>|Array<Array<import("../coordinate.js").Coordinate>>),import("../render.js").State): void}
 * RenderFunction
 */
/**
 * @typedef {Object} Options
 * @property {string|import("../geom/Geometry.js").default|GeometryFunction} [geometry] Feature property or geometry
 * or function returning a geometry to render for this style.
 * @property {import("./Fill.js").default} [fill] Fill style.
 * @property {import("./Image.js").default} [image] Image style.
 * @property {RenderFunction} [renderer] Custom renderer. When configured, `fill`, `stroke` and `image` will be
 * ignored, and the provided function will be called with each render frame for each geometry.
 * @property {RenderFunction} [hitDetectionRenderer] Custom renderer for hit detection. If provided will be used
 * in hit detection rendering.
 * @property {import("./Stroke.js").default} [stroke] Stroke style.
 * @property {import("./Text.js").default} [text] Text style.
 * @property {number} [zIndex] Z index.
 */
/**
 * @classdesc
 * Container for vector feature rendering styles. Any changes made to the style
 * or its children through `set*()` methods will not take effect until the
 * feature or layer that uses the style is re-rendered.
 *
 * ## Feature styles
 *
 * If no style is defined, the following default style is used:
 * ```js
 *  import {Fill, Stroke, Circle, Style} from 'ol/style';
 *
 *  var fill = new Fill({
 *    color: 'rgba(255,255,255,0.4)'
 *  });
 *  var stroke = new Stroke({
 *    color: '#3399CC',
 *    width: 1.25
 *  });
 *  var styles = [
 *    new Style({
 *      image: new Circle({
 *        fill: fill,
 *        stroke: stroke,
 *        radius: 5
 *      }),
 *      fill: fill,
 *      stroke: stroke
 *    })
 *  ];
 * ```
 *
 * A separate editing style has the following defaults:
 * ```js
 *  import {Fill, Stroke, Circle, Style} from 'ol/style';
 *  import GeometryType from 'ol/geom/GeometryType';
 *
 *  var white = [255, 255, 255, 1];
 *  var blue = [0, 153, 255, 1];
 *  var width = 3;
 *  styles[GeometryType.POLYGON] = [
 *    new Style({
 *      fill: new Fill({
 *        color: [255, 255, 255, 0.5]
 *      })
 *    })
 *  ];
 *  styles[GeometryType.MULTI_POLYGON] =
 *      styles[GeometryType.POLYGON];
 *  styles[GeometryType.LINE_STRING] = [
 *    new Style({
 *      stroke: new Stroke({
 *        color: white,
 *        width: width + 2
 *      })
 *    }),
 *    new Style({
 *      stroke: new Stroke({
 *        color: blue,
 *        width: width
 *      })
 *    })
 *  ];
 *  styles[GeometryType.MULTI_LINE_STRING] =
 *      styles[GeometryType.LINE_STRING];
 *  styles[GeometryType.POINT] = [
 *    new Style({
 *      image: new Circle({
 *        radius: width * 2,
 *        fill: new Fill({
 *          color: blue
 *        }),
 *        stroke: new Stroke({
 *          color: white,
 *          width: width / 2
 *        })
 *      }),
 *      zIndex: Infinity
 *    })
 *  ];
 *  styles[GeometryType.MULTI_POINT] =
 *      styles[GeometryType.POINT];
 *  styles[GeometryType.GEOMETRY_COLLECTION] =
 *      styles[GeometryType.POLYGON].concat(
 *          styles[GeometryType.LINE_STRING],
 *          styles[GeometryType.POINT]
 *      );
 * ```
 *
 * @api
 */
var Style = /** @class */ (function () {
    /**
     * @param {Options} [opt_options] Style options.
     */
    function Style(opt_options) {
        var options = opt_options || {};
        /**
         * @private
         * @type {string|import("../geom/Geometry.js").default|GeometryFunction}
         */
        this.geometry_ = null;
        /**
         * @private
         * @type {!GeometryFunction}
         */
        this.geometryFunction_ = defaultGeometryFunction;
        if (options.geometry !== undefined) {
            this.setGeometry(options.geometry);
        }
        /**
         * @private
         * @type {import("./Fill.js").default}
         */
        this.fill_ = options.fill !== undefined ? options.fill : null;
        /**
         * @private
         * @type {import("./Image.js").default}
         */
        this.image_ = options.image !== undefined ? options.image : null;
        /**
         * @private
         * @type {RenderFunction|null}
         */
        this.renderer_ = options.renderer !== undefined ? options.renderer : null;
        /**
         * @private
         * @type {RenderFunction|null}
         */
        this.hitDetectionRenderer_ =
            options.hitDetectionRenderer !== undefined
                ? options.hitDetectionRenderer
                : null;
        /**
         * @private
         * @type {import("./Stroke.js").default}
         */
        this.stroke_ = options.stroke !== undefined ? options.stroke : null;
        /**
         * @private
         * @type {import("./Text.js").default}
         */
        this.text_ = options.text !== undefined ? options.text : null;
        /**
         * @private
         * @type {number|undefined}
         */
        this.zIndex_ = options.zIndex;
    }
    /**
     * Clones the style.
     * @return {Style} The cloned style.
     * @api
     */
    Style.prototype.clone = function () {
        var geometry = this.getGeometry();
        if (geometry && typeof geometry === 'object') {
            geometry = /** @type {import("../geom/Geometry.js").default} */ (geometry).clone();
        }
        return new Style({
            geometry: geometry,
            fill: this.getFill() ? this.getFill().clone() : undefined,
            image: this.getImage() ? this.getImage().clone() : undefined,
            renderer: this.getRenderer(),
            stroke: this.getStroke() ? this.getStroke().clone() : undefined,
            text: this.getText() ? this.getText().clone() : undefined,
            zIndex: this.getZIndex(),
        });
    };
    /**
     * Get the custom renderer function that was configured with
     * {@link #setRenderer} or the `renderer` constructor option.
     * @return {RenderFunction|null} Custom renderer function.
     * @api
     */
    Style.prototype.getRenderer = function () {
        return this.renderer_;
    };
    /**
     * Sets a custom renderer function for this style. When set, `fill`, `stroke`
     * and `image` options of the style will be ignored.
     * @param {RenderFunction|null} renderer Custom renderer function.
     * @api
     */
    Style.prototype.setRenderer = function (renderer) {
        this.renderer_ = renderer;
    };
    /**
     * Sets a custom renderer function for this style used
     * in hit detection.
     * @param {RenderFunction|null} renderer Custom renderer function.
     * @api
     */
    Style.prototype.setHitDetectionRenderer = function (renderer) {
        this.hitDetectionRenderer_ = renderer;
    };
    /**
     * Get the custom renderer function that was configured with
     * {@link #setHitDetectionRenderer} or the `hitDetectionRenderer` constructor option.
     * @return {RenderFunction|null} Custom renderer function.
     * @api
     */
    Style.prototype.getHitDetectionRenderer = function () {
        return this.hitDetectionRenderer_;
    };
    /**
     * Get the geometry to be rendered.
     * @return {string|import("../geom/Geometry.js").default|GeometryFunction}
     * Feature property or geometry or function that returns the geometry that will
     * be rendered with this style.
     * @api
     */
    Style.prototype.getGeometry = function () {
        return this.geometry_;
    };
    /**
     * Get the function used to generate a geometry for rendering.
     * @return {!GeometryFunction} Function that is called with a feature
     * and returns the geometry to render instead of the feature's geometry.
     * @api
     */
    Style.prototype.getGeometryFunction = function () {
        return this.geometryFunction_;
    };
    /**
     * Get the fill style.
     * @return {import("./Fill.js").default} Fill style.
     * @api
     */
    Style.prototype.getFill = function () {
        return this.fill_;
    };
    /**
     * Set the fill style.
     * @param {import("./Fill.js").default} fill Fill style.
     * @api
     */
    Style.prototype.setFill = function (fill) {
        this.fill_ = fill;
    };
    /**
     * Get the image style.
     * @return {import("./Image.js").default} Image style.
     * @api
     */
    Style.prototype.getImage = function () {
        return this.image_;
    };
    /**
     * Set the image style.
     * @param {import("./Image.js").default} image Image style.
     * @api
     */
    Style.prototype.setImage = function (image) {
        this.image_ = image;
    };
    /**
     * Get the stroke style.
     * @return {import("./Stroke.js").default} Stroke style.
     * @api
     */
    Style.prototype.getStroke = function () {
        return this.stroke_;
    };
    /**
     * Set the stroke style.
     * @param {import("./Stroke.js").default} stroke Stroke style.
     * @api
     */
    Style.prototype.setStroke = function (stroke) {
        this.stroke_ = stroke;
    };
    /**
     * Get the text style.
     * @return {import("./Text.js").default} Text style.
     * @api
     */
    Style.prototype.getText = function () {
        return this.text_;
    };
    /**
     * Set the text style.
     * @param {import("./Text.js").default} text Text style.
     * @api
     */
    Style.prototype.setText = function (text) {
        this.text_ = text;
    };
    /**
     * Get the z-index for the style.
     * @return {number|undefined} ZIndex.
     * @api
     */
    Style.prototype.getZIndex = function () {
        return this.zIndex_;
    };
    /**
     * Set a geometry that is rendered instead of the feature's geometry.
     *
     * @param {string|import("../geom/Geometry.js").default|GeometryFunction} geometry
     *     Feature property or geometry or function returning a geometry to render
     *     for this style.
     * @api
     */
    Style.prototype.setGeometry = function (geometry) {
        if (typeof geometry === 'function') {
            this.geometryFunction_ = geometry;
        }
        else if (typeof geometry === 'string') {
            this.geometryFunction_ = function (feature) {
                return /** @type {import("../geom/Geometry.js").default} */ (feature.get(geometry));
            };
        }
        else if (!geometry) {
            this.geometryFunction_ = defaultGeometryFunction;
        }
        else if (geometry !== undefined) {
            this.geometryFunction_ = function () {
                return /** @type {import("../geom/Geometry.js").default} */ (geometry);
            };
        }
        this.geometry_ = geometry;
    };
    /**
     * Set the z-index.
     *
     * @param {number|undefined} zIndex ZIndex.
     * @api
     */
    Style.prototype.setZIndex = function (zIndex) {
        this.zIndex_ = zIndex;
    };
    return Style;
}());
/**
 * Convert the provided object into a style function.  Functions passed through
 * unchanged.  Arrays of Style or single style objects wrapped in a
 * new style function.
 * @param {StyleFunction|Array<Style>|Style} obj
 *     A style function, a single style, or an array of styles.
 * @return {StyleFunction} A style function.
 */
function toFunction(obj) {
    var styleFunction;
    if (typeof obj === 'function') {
        styleFunction = obj;
    }
    else {
        /**
         * @type {Array<Style>}
         */
        var styles_1;
        if (Array.isArray(obj)) {
            styles_1 = obj;
        }
        else {
            assert(typeof ( /** @type {?} */(obj).getZIndex) === 'function', 41); // Expected an `Style` or an array of `Style`
            var style = /** @type {Style} */ (obj);
            styles_1 = [style];
        }
        styleFunction = function () {
            return styles_1;
        };
    }
    return styleFunction;
}
/**
 * @type {Array<Style>}
 */
var defaultStyles = null;
/**
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 * @param {number} resolution Resolution.
 * @return {Array<Style>} Style.
 */
function createDefaultStyle(feature, resolution) {
    // We don't use an immediately-invoked function
    // and a closure so we don't get an error at script evaluation time in
    // browsers that do not support Canvas. (import("./Circle.js").CircleStyle does
    // canvas.getContext('2d') at construction time, which will cause an.error
    // in such browsers.)
    if (!defaultStyles) {
        var fill = new Fill({
            color: 'rgba(255,255,255,0.4)',
        });
        var stroke = new Stroke({
            color: '#3399CC',
            width: 1.25,
        });
        defaultStyles = [
            new Style({
                image: new CircleStyle({
                    fill: fill,
                    stroke: stroke,
                    radius: 5,
                }),
                fill: fill,
                stroke: stroke,
            }),
        ];
    }
    return defaultStyles;
}
/**
 * Function that is called with a feature and returns its default geometry.
 * @param {import("../Feature.js").FeatureLike} feature Feature to get the geometry for.
 * @return {import("../geom/Geometry.js").default|import("../render/Feature.js").default|undefined} Geometry to render.
 */
function defaultGeometryFunction(feature) {
    return feature.getGeometry();
}

export { Style as S, createDefaultStyle as c, toFunction as t };
