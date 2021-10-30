import { E as EventType, b as abstract, f as Target, q as listenOnce, u as unlistenByKey } from './asserts-e0c6c4d5.js';
import { I as ImageState } from './ImageState-51477cac.js';
import { I as IMAGE_DECODE } from './has-ff434dd0.js';
import { b as getHeight } from './extent-0b32e3b6.js';

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
 * @abstract
 */
var ImageBase = /** @class */ (function (_super) {
    __extends(ImageBase, _super);
    /**
     * @param {import("./extent.js").Extent} extent Extent.
     * @param {number|undefined} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./ImageState.js").default} state State.
     */
    function ImageBase(extent, resolution, pixelRatio, state) {
        var _this = _super.call(this) || this;
        /**
         * @protected
         * @type {import("./extent.js").Extent}
         */
        _this.extent = extent;
        /**
         * @private
         * @type {number}
         */
        _this.pixelRatio_ = pixelRatio;
        /**
         * @protected
         * @type {number|undefined}
         */
        _this.resolution = resolution;
        /**
         * @protected
         * @type {import("./ImageState.js").default}
         */
        _this.state = state;
        return _this;
    }
    /**
     * @protected
     */
    ImageBase.prototype.changed = function () {
        this.dispatchEvent(EventType.CHANGE);
    };
    /**
     * @return {import("./extent.js").Extent} Extent.
     */
    ImageBase.prototype.getExtent = function () {
        return this.extent;
    };
    /**
     * @abstract
     * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
     */
    ImageBase.prototype.getImage = function () {
        return abstract();
    };
    /**
     * @return {number} PixelRatio.
     */
    ImageBase.prototype.getPixelRatio = function () {
        return this.pixelRatio_;
    };
    /**
     * @return {number} Resolution.
     */
    ImageBase.prototype.getResolution = function () {
        return /** @type {number} */ (this.resolution);
    };
    /**
     * @return {import("./ImageState.js").default} State.
     */
    ImageBase.prototype.getState = function () {
        return this.state;
    };
    /**
     * Load not yet loaded URI.
     * @abstract
     */
    ImageBase.prototype.load = function () {
        abstract();
    };
    return ImageBase;
}(Target));

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
 * A function that takes an {@link module:ol/Image~Image} for the image and a
 * `{string}` for the src as arguments. It is supposed to make it so the
 * underlying image {@link module:ol/Image~Image#getImage} is assigned the
 * content specified by the src. If not specified, the default is
 *
 *     function(image, src) {
 *       image.getImage().src = src;
 *     }
 *
 * Providing a custom `imageLoadFunction` can be useful to load images with
 * post requests or - in general - through XHR requests, where the src of the
 * image element would be set to a data URI when the content is loaded.
 *
 * @typedef {function(ImageWrapper, string): void} LoadFunction
 * @api
 */
var ImageWrapper = /** @class */ (function (_super) {
    __extends$1(ImageWrapper, _super);
    /**
     * @param {import("./extent.js").Extent} extent Extent.
     * @param {number|undefined} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     * @param {string} src Image source URI.
     * @param {?string} crossOrigin Cross origin.
     * @param {LoadFunction} imageLoadFunction Image load function.
     */
    function ImageWrapper(extent, resolution, pixelRatio, src, crossOrigin, imageLoadFunction) {
        var _this = _super.call(this, extent, resolution, pixelRatio, ImageState.IDLE) || this;
        /**
         * @private
         * @type {string}
         */
        _this.src_ = src;
        /**
         * @private
         * @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement}
         */
        _this.image_ = new Image();
        if (crossOrigin !== null) {
            _this.image_.crossOrigin = crossOrigin;
        }
        /**
         * @private
         * @type {?function():void}
         */
        _this.unlisten_ = null;
        /**
         * @protected
         * @type {import("./ImageState.js").default}
         */
        _this.state = ImageState.IDLE;
        /**
         * @private
         * @type {LoadFunction}
         */
        _this.imageLoadFunction_ = imageLoadFunction;
        return _this;
    }
    /**
     * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
     * @api
     */
    ImageWrapper.prototype.getImage = function () {
        return this.image_;
    };
    /**
     * Tracks loading or read errors.
     *
     * @private
     */
    ImageWrapper.prototype.handleImageError_ = function () {
        this.state = ImageState.ERROR;
        this.unlistenImage_();
        this.changed();
    };
    /**
     * Tracks successful image load.
     *
     * @private
     */
    ImageWrapper.prototype.handleImageLoad_ = function () {
        if (this.resolution === undefined) {
            this.resolution = getHeight(this.extent) / this.image_.height;
        }
        this.state = ImageState.LOADED;
        this.unlistenImage_();
        this.changed();
    };
    /**
     * Load the image or retry if loading previously failed.
     * Loading is taken care of by the tile queue, and calling this method is
     * only needed for preloading or for reloading in case of an error.
     * @api
     */
    ImageWrapper.prototype.load = function () {
        if (this.state == ImageState.IDLE || this.state == ImageState.ERROR) {
            this.state = ImageState.LOADING;
            this.changed();
            this.imageLoadFunction_(this, this.src_);
            this.unlisten_ = listenImage(this.image_, this.handleImageLoad_.bind(this), this.handleImageError_.bind(this));
        }
    };
    /**
     * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} image Image.
     */
    ImageWrapper.prototype.setImage = function (image) {
        this.image_ = image;
        this.resolution = getHeight(this.extent) / this.image_.height;
    };
    /**
     * Discards event handlers which listen for load completion or errors.
     *
     * @private
     */
    ImageWrapper.prototype.unlistenImage_ = function () {
        if (this.unlisten_) {
            this.unlisten_();
            this.unlisten_ = null;
        }
    };
    return ImageWrapper;
}(ImageBase));
/**
 * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} image Image element.
 * @param {function():any} loadHandler Load callback function.
 * @param {function():any} errorHandler Error callback function.
 * @return {function():void} Callback to stop listening.
 */
function listenImage(image, loadHandler, errorHandler) {
    var img = /** @type {HTMLImageElement} */ (image);
    if (img.src && IMAGE_DECODE) {
        var promise = img.decode();
        var listening_1 = true;
        var unlisten = function () {
            listening_1 = false;
        };
        promise
            .then(function () {
            if (listening_1) {
                loadHandler();
            }
        })
            .catch(function (error) {
            if (listening_1) {
                // FIXME: Unconditionally call errorHandler() when this bug is fixed upstream:
                //        https://bugs.webkit.org/show_bug.cgi?id=198527
                if (error.name === 'EncodingError' &&
                    error.message === 'Invalid image type.') {
                    loadHandler();
                }
                else {
                    errorHandler();
                }
            }
        });
        return unlisten;
    }
    var listenerKeys = [
        listenOnce(img, EventType.LOAD, loadHandler),
        listenOnce(img, EventType.ERROR, errorHandler),
    ];
    return function unlisten() {
        listenerKeys.forEach(unlistenByKey);
    };
}

export { listenImage as l };
