/**
 * @module ol/style/Stroke
 */
/**
 * @typedef {Object} Options
 * @property {import("../color.js").Color|import("../colorlike.js").ColorLike} [color] A color, gradient or pattern.
 * See {@link module:ol/color~Color} and {@link module:ol/colorlike~ColorLike} for possible formats.
 * Default null; if null, the Canvas/renderer default black will be used.
 * @property {CanvasLineCap} [lineCap='round'] Line cap style: `butt`, `round`, or `square`.
 * @property {CanvasLineJoin} [lineJoin='round'] Line join style: `bevel`, `round`, or `miter`.
 * @property {Array<number>} [lineDash] Line dash pattern. Default is `null` (no dash).
 * Please note that Internet Explorer 10 and lower do not support the `setLineDash` method on
 * the `CanvasRenderingContext2D` and therefore this option will have no visual effect in these browsers.
 * @property {number} [lineDashOffset=0] Line dash offset.
 * @property {number} [miterLimit=10] Miter limit.
 * @property {number} [width] Width.
 */
/**
 * @classdesc
 * Set stroke style for vector features.
 * Note that the defaults given are the Canvas defaults, which will be used if
 * option is not defined. The `get` functions return whatever was entered in
 * the options; they will not return the default.
 * @api
 */
var Stroke = /** @class */ (function () {
    /**
     * @param {Options} [opt_options] Options.
     */
    function Stroke(opt_options) {
        var options = opt_options || {};
        /**
         * @private
         * @type {import("../color.js").Color|import("../colorlike.js").ColorLike}
         */
        this.color_ = options.color !== undefined ? options.color : null;
        /**
         * @private
         * @type {CanvasLineCap|undefined}
         */
        this.lineCap_ = options.lineCap;
        /**
         * @private
         * @type {Array<number>}
         */
        this.lineDash_ = options.lineDash !== undefined ? options.lineDash : null;
        /**
         * @private
         * @type {number|undefined}
         */
        this.lineDashOffset_ = options.lineDashOffset;
        /**
         * @private
         * @type {CanvasLineJoin|undefined}
         */
        this.lineJoin_ = options.lineJoin;
        /**
         * @private
         * @type {number|undefined}
         */
        this.miterLimit_ = options.miterLimit;
        /**
         * @private
         * @type {number|undefined}
         */
        this.width_ = options.width;
    }
    /**
     * Clones the style.
     * @return {Stroke} The cloned style.
     * @api
     */
    Stroke.prototype.clone = function () {
        var color = this.getColor();
        return new Stroke({
            color: Array.isArray(color) ? color.slice() : color || undefined,
            lineCap: this.getLineCap(),
            lineDash: this.getLineDash() ? this.getLineDash().slice() : undefined,
            lineDashOffset: this.getLineDashOffset(),
            lineJoin: this.getLineJoin(),
            miterLimit: this.getMiterLimit(),
            width: this.getWidth(),
        });
    };
    /**
     * Get the stroke color.
     * @return {import("../color.js").Color|import("../colorlike.js").ColorLike} Color.
     * @api
     */
    Stroke.prototype.getColor = function () {
        return this.color_;
    };
    /**
     * Get the line cap type for the stroke.
     * @return {CanvasLineCap|undefined} Line cap.
     * @api
     */
    Stroke.prototype.getLineCap = function () {
        return this.lineCap_;
    };
    /**
     * Get the line dash style for the stroke.
     * @return {Array<number>} Line dash.
     * @api
     */
    Stroke.prototype.getLineDash = function () {
        return this.lineDash_;
    };
    /**
     * Get the line dash offset for the stroke.
     * @return {number|undefined} Line dash offset.
     * @api
     */
    Stroke.prototype.getLineDashOffset = function () {
        return this.lineDashOffset_;
    };
    /**
     * Get the line join type for the stroke.
     * @return {CanvasLineJoin|undefined} Line join.
     * @api
     */
    Stroke.prototype.getLineJoin = function () {
        return this.lineJoin_;
    };
    /**
     * Get the miter limit for the stroke.
     * @return {number|undefined} Miter limit.
     * @api
     */
    Stroke.prototype.getMiterLimit = function () {
        return this.miterLimit_;
    };
    /**
     * Get the stroke width.
     * @return {number|undefined} Width.
     * @api
     */
    Stroke.prototype.getWidth = function () {
        return this.width_;
    };
    /**
     * Set the color.
     *
     * @param {import("../color.js").Color|import("../colorlike.js").ColorLike} color Color.
     * @api
     */
    Stroke.prototype.setColor = function (color) {
        this.color_ = color;
    };
    /**
     * Set the line cap.
     *
     * @param {CanvasLineCap|undefined} lineCap Line cap.
     * @api
     */
    Stroke.prototype.setLineCap = function (lineCap) {
        this.lineCap_ = lineCap;
    };
    /**
     * Set the line dash.
     *
     * Please note that Internet Explorer 10 and lower [do not support][mdn] the
     * `setLineDash` method on the `CanvasRenderingContext2D` and therefore this
     * property will have no visual effect in these browsers.
     *
     * [mdn]: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility
     *
     * @param {Array<number>} lineDash Line dash.
     * @api
     */
    Stroke.prototype.setLineDash = function (lineDash) {
        this.lineDash_ = lineDash;
    };
    /**
     * Set the line dash offset.
     *
     * @param {number|undefined} lineDashOffset Line dash offset.
     * @api
     */
    Stroke.prototype.setLineDashOffset = function (lineDashOffset) {
        this.lineDashOffset_ = lineDashOffset;
    };
    /**
     * Set the line join.
     *
     * @param {CanvasLineJoin|undefined} lineJoin Line join.
     * @api
     */
    Stroke.prototype.setLineJoin = function (lineJoin) {
        this.lineJoin_ = lineJoin;
    };
    /**
     * Set the miter limit.
     *
     * @param {number|undefined} miterLimit Miter limit.
     * @api
     */
    Stroke.prototype.setMiterLimit = function (miterLimit) {
        this.miterLimit_ = miterLimit;
    };
    /**
     * Set the width.
     *
     * @param {number|undefined} width Width.
     * @api
     */
    Stroke.prototype.setWidth = function (width) {
        this.width_ = width;
    };
    return Stroke;
}());

export { Stroke as S };
