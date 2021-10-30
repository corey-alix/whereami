import { E as EventType, b as abstract, f as Target, a as assert, c as assign, l as listen, u as unlistenByKey, h as linearFindNearest, s as isSorted, e as BaseEvent, g as getUid } from '../common/asserts-e0c6c4d5.js';
import { T as TileState } from '../common/TileState-8e53a150.js';
import { a as easeIn } from '../common/easing-827db2b3.js';
import { d as createCanvasContext2D } from '../common/dom-73d54564.js';
import { l as listenImage } from '../common/Image-197a28fd.js';
import { g as getWidth, u as getTopLeft, v as getTopRight, w as getBottomRight, x as getBottomLeft, E as getArea, F as boundingExtent, o as intersects, C as extendCoordinate, j as createEmpty, G as extend, b as getHeight, d as getCenter, m as forEachCorner, y as containsCoordinate, a as getIntersection, B as createOrUpdate$2, H as getCorner, I as Corner } from '../common/extent-0b32e3b6.js';
import { e as getTransform, i as transform, j as getPointResolution, d as get, M as METERS_PER_UNIT, U as Units, k as equivalent } from '../common/proj-8f373c44.js';
import { d as log2, m as modulo, e as solveLinearSystem, c as clamp } from '../common/math-b0fe2752.js';
import { S as Source } from '../common/Source-c28a9da7.js';
import { c as createOrUpdate$1, T as TileRange } from '../common/TileRange-5435dca5.js';
import { D as DEFAULT_TILE_SIZE, a as DEFAULT_MAX_ZOOM } from '../common/common-42819fa1.js';
import { t as toSize, s as scale } from '../common/size-da54e3a0.js';
import '../common/has-ff434dd0.js';
import '../common/ImageState-51477cac.js';
import '../common/State-c7a16ea4.js';

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
 * A function that takes an {@link module:ol/Tile} for the tile and a
 * `{string}` for the url as arguments. The default is
 * ```js
 * source.setTileLoadFunction(function(tile, src) {
 *   tile.getImage().src = src;
 * });
 * ```
 * For more fine grained control, the load function can use fetch or XMLHttpRequest and involve
 * error handling:
 *
 * ```js
 * import TileState from 'ol/TileState';
 *
 * source.setTileLoadFunction(function(tile, src) {
 *   var xhr = new XMLHttpRequest();
 *   xhr.responseType = 'blob';
 *   xhr.addEventListener('loadend', function (evt) {
 *     var data = this.response;
 *     if (data !== undefined) {
 *       tile.getImage().src = URL.createObjectURL(data);
 *     } else {
 *       tile.setState(TileState.ERROR);
 *     }
 *   });
 *   xhr.addEventListener('error', function () {
 *     tile.setState(TileState.ERROR);
 *   });
 *   xhr.open('GET', src);
 *   xhr.send();
 * });
 * ```
 *
 * @typedef {function(Tile, string): void} LoadFunction
 * @api
 */
/**
 * {@link module:ol/source/Tile~Tile} sources use a function of this type to get
 * the url that provides a tile for a given tile coordinate.
 *
 * This function takes an {@link module:ol/tilecoord~TileCoord} for the tile
 * coordinate, a `{number}` representing the pixel ratio and a
 * {@link module:ol/proj/Projection} for the projection  as arguments
 * and returns a `{string}` representing the tile URL, or undefined if no tile
 * should be requested for the passed tile coordinate.
 *
 * @typedef {function(import("./tilecoord.js").TileCoord, number,
 *           import("./proj/Projection.js").default): (string|undefined)} UrlFunction
 * @api
 */
/**
 * @typedef {Object} Options
 * @property {number} [transition=250] A duration for tile opacity
 * transitions in milliseconds. A duration of 0 disables the opacity transition.
 * @api
 */
/**
 * @classdesc
 * Base class for tiles.
 *
 * @abstract
 */
var Tile = /** @class */ (function (_super) {
    __extends(Tile, _super);
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @param {import("./TileState.js").default} state State.
     * @param {Options} [opt_options] Tile options.
     */
    function Tile(tileCoord, state, opt_options) {
        var _this = _super.call(this) || this;
        var options = opt_options ? opt_options : {};
        /**
         * @type {import("./tilecoord.js").TileCoord}
         */
        _this.tileCoord = tileCoord;
        /**
         * @protected
         * @type {import("./TileState.js").default}
         */
        _this.state = state;
        /**
         * An "interim" tile for this tile. The interim tile may be used while this
         * one is loading, for "smooth" transitions when changing params/dimensions
         * on the source.
         * @type {Tile}
         */
        _this.interimTile = null;
        /**
         * A key assigned to the tile. This is used by the tile source to determine
         * if this tile can effectively be used, or if a new tile should be created
         * and this one be used as an interim tile for this new tile.
         * @type {string}
         */
        _this.key = '';
        /**
         * The duration for the opacity transition.
         * @type {number}
         */
        _this.transition_ =
            options.transition === undefined ? 250 : options.transition;
        /**
         * Lookup of start times for rendering transitions.  If the start time is
         * equal to -1, the transition is complete.
         * @type {Object<string, number>}
         */
        _this.transitionStarts_ = {};
        return _this;
    }
    /**
     * @protected
     */
    Tile.prototype.changed = function () {
        this.dispatchEvent(EventType.CHANGE);
    };
    /**
     * Called by the tile cache when the tile is removed from the cache due to expiry
     */
    Tile.prototype.release = function () { };
    /**
     * @return {string} Key.
     */
    Tile.prototype.getKey = function () {
        return this.key + '/' + this.tileCoord;
    };
    /**
     * Get the interim tile most suitable for rendering using the chain of interim
     * tiles. This corresponds to the  most recent tile that has been loaded, if no
     * such tile exists, the original tile is returned.
     * @return {!Tile} Best tile for rendering.
     */
    Tile.prototype.getInterimTile = function () {
        if (!this.interimTile) {
            //empty chain
            return this;
        }
        var tile = this.interimTile;
        // find the first loaded tile and return it. Since the chain is sorted in
        // decreasing order of creation time, there is no need to search the remainder
        // of the list (all those tiles correspond to older requests and will be
        // cleaned up by refreshInterimChain)
        do {
            if (tile.getState() == TileState.LOADED) {
                // Show tile immediately instead of fading it in after loading, because
                // the interim tile is in place already
                this.transition_ = 0;
                return tile;
            }
            tile = tile.interimTile;
        } while (tile);
        // we can not find a better tile
        return this;
    };
    /**
     * Goes through the chain of interim tiles and discards sections of the chain
     * that are no longer relevant.
     */
    Tile.prototype.refreshInterimChain = function () {
        if (!this.interimTile) {
            return;
        }
        var tile = this.interimTile;
        var prev = /** @type {Tile} */ (this);
        do {
            if (tile.getState() == TileState.LOADED) {
                //we have a loaded tile, we can discard the rest of the list
                //we would could abort any LOADING tile request
                //older than this tile (i.e. any LOADING tile following this entry in the chain)
                tile.interimTile = null;
                break;
            }
            else if (tile.getState() == TileState.LOADING) {
                //keep this LOADING tile any loaded tiles later in the chain are
                //older than this tile, so we're still interested in the request
                prev = tile;
            }
            else if (tile.getState() == TileState.IDLE) {
                //the head of the list is the most current tile, we don't need
                //to start any other requests for this chain
                prev.interimTile = tile.interimTile;
            }
            else {
                prev = tile;
            }
            tile = prev.interimTile;
        } while (tile);
    };
    /**
     * Get the tile coordinate for this tile.
     * @return {import("./tilecoord.js").TileCoord} The tile coordinate.
     * @api
     */
    Tile.prototype.getTileCoord = function () {
        return this.tileCoord;
    };
    /**
     * @return {import("./TileState.js").default} State.
     */
    Tile.prototype.getState = function () {
        return this.state;
    };
    /**
     * Sets the state of this tile. If you write your own {@link module:ol/Tile~LoadFunction tileLoadFunction} ,
     * it is important to set the state correctly to {@link module:ol/TileState~ERROR}
     * when the tile cannot be loaded. Otherwise the tile cannot be removed from
     * the tile queue and will block other requests.
     * @param {import("./TileState.js").default} state State.
     * @api
     */
    Tile.prototype.setState = function (state) {
        if (this.state !== TileState.ERROR && this.state > state) {
            throw new Error('Tile load sequence violation');
        }
        this.state = state;
        this.changed();
    };
    /**
     * Load the image or retry if loading previously failed.
     * Loading is taken care of by the tile queue, and calling this method is
     * only needed for preloading or for reloading in case of an error.
     * @abstract
     * @api
     */
    Tile.prototype.load = function () {
        abstract();
    };
    /**
     * Get the alpha value for rendering.
     * @param {string} id An id for the renderer.
     * @param {number} time The render frame time.
     * @return {number} A number between 0 and 1.
     */
    Tile.prototype.getAlpha = function (id, time) {
        if (!this.transition_) {
            return 1;
        }
        var start = this.transitionStarts_[id];
        if (!start) {
            start = time;
            this.transitionStarts_[id] = start;
        }
        else if (start === -1) {
            return 1;
        }
        var delta = time - start + 1000 / 60; // avoid rendering at 0
        if (delta >= this.transition_) {
            return 1;
        }
        return easeIn(delta / this.transition_);
    };
    /**
     * Determine if a tile is in an alpha transition.  A tile is considered in
     * transition if tile.getAlpha() has not yet been called or has been called
     * and returned 1.
     * @param {string} id An id for the renderer.
     * @return {boolean} The tile is in transition.
     */
    Tile.prototype.inTransition = function (id) {
        if (!this.transition_) {
            return false;
        }
        return this.transitionStarts_[id] !== -1;
    };
    /**
     * Mark a transition as complete.
     * @param {string} id An id for the renderer.
     */
    Tile.prototype.endTransition = function (id) {
        if (this.transition_) {
            this.transitionStarts_[id] = -1;
        }
    };
    return Tile;
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
var ImageTile = /** @class */ (function (_super) {
    __extends$1(ImageTile, _super);
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @param {import("./TileState.js").default} state State.
     * @param {string} src Image source URI.
     * @param {?string} crossOrigin Cross origin.
     * @param {import("./Tile.js").LoadFunction} tileLoadFunction Tile load function.
     * @param {import("./Tile.js").Options} [opt_options] Tile options.
     */
    function ImageTile(tileCoord, state, src, crossOrigin, tileLoadFunction, opt_options) {
        var _this = _super.call(this, tileCoord, state, opt_options) || this;
        /**
         * @private
         * @type {?string}
         */
        _this.crossOrigin_ = crossOrigin;
        /**
         * Image URI
         *
         * @private
         * @type {string}
         */
        _this.src_ = src;
        _this.key = src;
        /**
         * @private
         * @type {HTMLImageElement|HTMLCanvasElement}
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
         * @private
         * @type {import("./Tile.js").LoadFunction}
         */
        _this.tileLoadFunction_ = tileLoadFunction;
        return _this;
    }
    /**
     * Get the HTML image element for this tile (may be a Canvas, Image, or Video).
     * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
     * @api
     */
    ImageTile.prototype.getImage = function () {
        return this.image_;
    };
    /**
     * Sets an HTML image element for this tile (may be a Canvas or preloaded Image).
     * @param {HTMLCanvasElement|HTMLImageElement} element Element.
     */
    ImageTile.prototype.setImage = function (element) {
        this.image_ = element;
        this.state = TileState.LOADED;
        this.unlistenImage_();
        this.changed();
    };
    /**
     * Tracks loading or read errors.
     *
     * @private
     */
    ImageTile.prototype.handleImageError_ = function () {
        this.state = TileState.ERROR;
        this.unlistenImage_();
        this.image_ = getBlankImage();
        this.changed();
    };
    /**
     * Tracks successful image load.
     *
     * @private
     */
    ImageTile.prototype.handleImageLoad_ = function () {
        var image = /** @type {HTMLImageElement} */ (this.image_);
        if (image.naturalWidth && image.naturalHeight) {
            this.state = TileState.LOADED;
        }
        else {
            this.state = TileState.EMPTY;
        }
        this.unlistenImage_();
        this.changed();
    };
    /**
     * Load not yet loaded URI.
     * @api
     */
    ImageTile.prototype.load = function () {
        if (this.state == TileState.ERROR) {
            this.state = TileState.IDLE;
            this.image_ = new Image();
            if (this.crossOrigin_ !== null) {
                this.image_.crossOrigin = this.crossOrigin_;
            }
        }
        if (this.state == TileState.IDLE) {
            this.state = TileState.LOADING;
            this.changed();
            this.tileLoadFunction_(this, this.src_);
            this.unlisten_ = listenImage(this.image_, this.handleImageLoad_.bind(this), this.handleImageError_.bind(this));
        }
    };
    /**
     * Discards event handlers which listen for load completion or errors.
     *
     * @private
     */
    ImageTile.prototype.unlistenImage_ = function () {
        if (this.unlisten_) {
            this.unlisten_();
            this.unlisten_ = null;
        }
    };
    return ImageTile;
}(Tile));
/**
 * Get a 1-pixel blank image.
 * @return {HTMLCanvasElement} Blank image.
 */
function getBlankImage() {
    var ctx = createCanvasContext2D(1, 1);
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, 1, 1);
    return ctx.canvas;
}

/**
 * @module ol/structs/LRUCache
 */
/**
 * @typedef {Object} Entry
 * @property {string} key_ Key.
 * @property {Object} newer Newer.
 * @property {Object} older Older.
 * @property {*} value_ Value.
 */
/**
 * @classdesc
 * Implements a Least-Recently-Used cache where the keys do not conflict with
 * Object's properties (e.g. 'hasOwnProperty' is not allowed as a key). Expiring
 * items from the cache is the responsibility of the user.
 *
 * @fires import("../events/Event.js").default
 * @template T
 */
var LRUCache = /** @class */ (function () {
    /**
     * @param {number} [opt_highWaterMark] High water mark.
     */
    function LRUCache(opt_highWaterMark) {
        /**
         * Desired max cache size after expireCache(). If set to 0, no cache entries
         * will be pruned at all.
         * @type {number}
         */
        this.highWaterMark =
            opt_highWaterMark !== undefined ? opt_highWaterMark : 2048;
        /**
         * @private
         * @type {number}
         */
        this.count_ = 0;
        /**
         * @private
         * @type {!Object<string, Entry>}
         */
        this.entries_ = {};
        /**
         * @private
         * @type {?Entry}
         */
        this.oldest_ = null;
        /**
         * @private
         * @type {?Entry}
         */
        this.newest_ = null;
    }
    /**
     * @return {boolean} Can expire cache.
     */
    LRUCache.prototype.canExpireCache = function () {
        return this.highWaterMark > 0 && this.getCount() > this.highWaterMark;
    };
    /**
     * FIXME empty description for jsdoc
     */
    LRUCache.prototype.clear = function () {
        this.count_ = 0;
        this.entries_ = {};
        this.oldest_ = null;
        this.newest_ = null;
    };
    /**
     * @param {string} key Key.
     * @return {boolean} Contains key.
     */
    LRUCache.prototype.containsKey = function (key) {
        return this.entries_.hasOwnProperty(key);
    };
    /**
     * @param {function(T, string, LRUCache<T>): ?} f The function
     *     to call for every entry from the oldest to the newer. This function takes
     *     3 arguments (the entry value, the entry key and the LRUCache object).
     *     The return value is ignored.
     */
    LRUCache.prototype.forEach = function (f) {
        var entry = this.oldest_;
        while (entry) {
            f(entry.value_, entry.key_, this);
            entry = entry.newer;
        }
    };
    /**
     * @param {string} key Key.
     * @param {*} [opt_options] Options (reserved for subclasses).
     * @return {T} Value.
     */
    LRUCache.prototype.get = function (key, opt_options) {
        var entry = this.entries_[key];
        assert(entry !== undefined, 15); // Tried to get a value for a key that does not exist in the cache
        if (entry === this.newest_) {
            return entry.value_;
        }
        else if (entry === this.oldest_) {
            this.oldest_ = /** @type {Entry} */ (this.oldest_.newer);
            this.oldest_.older = null;
        }
        else {
            entry.newer.older = entry.older;
            entry.older.newer = entry.newer;
        }
        entry.newer = null;
        entry.older = this.newest_;
        this.newest_.newer = entry;
        this.newest_ = entry;
        return entry.value_;
    };
    /**
     * Remove an entry from the cache.
     * @param {string} key The entry key.
     * @return {T} The removed entry.
     */
    LRUCache.prototype.remove = function (key) {
        var entry = this.entries_[key];
        assert(entry !== undefined, 15); // Tried to get a value for a key that does not exist in the cache
        if (entry === this.newest_) {
            this.newest_ = /** @type {Entry} */ (entry.older);
            if (this.newest_) {
                this.newest_.newer = null;
            }
        }
        else if (entry === this.oldest_) {
            this.oldest_ = /** @type {Entry} */ (entry.newer);
            if (this.oldest_) {
                this.oldest_.older = null;
            }
        }
        else {
            entry.newer.older = entry.older;
            entry.older.newer = entry.newer;
        }
        delete this.entries_[key];
        --this.count_;
        return entry.value_;
    };
    /**
     * @return {number} Count.
     */
    LRUCache.prototype.getCount = function () {
        return this.count_;
    };
    /**
     * @return {Array<string>} Keys.
     */
    LRUCache.prototype.getKeys = function () {
        var keys = new Array(this.count_);
        var i = 0;
        var entry;
        for (entry = this.newest_; entry; entry = entry.older) {
            keys[i++] = entry.key_;
        }
        return keys;
    };
    /**
     * @return {Array<T>} Values.
     */
    LRUCache.prototype.getValues = function () {
        var values = new Array(this.count_);
        var i = 0;
        var entry;
        for (entry = this.newest_; entry; entry = entry.older) {
            values[i++] = entry.value_;
        }
        return values;
    };
    /**
     * @return {T} Last value.
     */
    LRUCache.prototype.peekLast = function () {
        return this.oldest_.value_;
    };
    /**
     * @return {string} Last key.
     */
    LRUCache.prototype.peekLastKey = function () {
        return this.oldest_.key_;
    };
    /**
     * Get the key of the newest item in the cache.  Throws if the cache is empty.
     * @return {string} The newest key.
     */
    LRUCache.prototype.peekFirstKey = function () {
        return this.newest_.key_;
    };
    /**
     * @return {T} value Value.
     */
    LRUCache.prototype.pop = function () {
        var entry = this.oldest_;
        delete this.entries_[entry.key_];
        if (entry.newer) {
            entry.newer.older = null;
        }
        this.oldest_ = /** @type {Entry} */ (entry.newer);
        if (!this.oldest_) {
            this.newest_ = null;
        }
        --this.count_;
        return entry.value_;
    };
    /**
     * @param {string} key Key.
     * @param {T} value Value.
     */
    LRUCache.prototype.replace = function (key, value) {
        this.get(key); // update `newest_`
        this.entries_[key].value_ = value;
    };
    /**
     * @param {string} key Key.
     * @param {T} value Value.
     */
    LRUCache.prototype.set = function (key, value) {
        assert(!(key in this.entries_), 16); // Tried to set a value for a key that is used already
        var entry = {
            key_: key,
            newer: null,
            older: this.newest_,
            value_: value,
        };
        if (!this.newest_) {
            this.oldest_ = entry;
        }
        else {
            this.newest_.newer = entry;
        }
        this.newest_ = entry;
        this.entries_[key] = entry;
        ++this.count_;
    };
    /**
     * Set a maximum number of entries for the cache.
     * @param {number} size Cache size.
     * @api
     */
    LRUCache.prototype.setSize = function (size) {
        this.highWaterMark = size;
    };
    return LRUCache;
}());

/**
 * @module ol/tilecoord
 */
/**
 * An array of three numbers representing the location of a tile in a tile
 * grid. The order is `z` (zoom level), `x` (column), and `y` (row).
 * @typedef {Array<number>} TileCoord
 * @api
 */
/**
 * @param {number} z Z.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {TileCoord} [opt_tileCoord] Tile coordinate.
 * @return {TileCoord} Tile coordinate.
 */
function createOrUpdate(z, x, y, opt_tileCoord) {
    if (opt_tileCoord !== undefined) {
        opt_tileCoord[0] = z;
        opt_tileCoord[1] = x;
        opt_tileCoord[2] = y;
        return opt_tileCoord;
    }
    else {
        return [z, x, y];
    }
}
/**
 * @param {number} z Z.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {string} Key.
 */
function getKeyZXY(z, x, y) {
    return z + '/' + x + '/' + y;
}
/**
 * Get the key for a tile coord.
 * @param {TileCoord} tileCoord The tile coord.
 * @return {string} Key.
 */
function getKey(tileCoord) {
    return getKeyZXY(tileCoord[0], tileCoord[1], tileCoord[2]);
}
/**
 * Get a tile coord given a key.
 * @param {string} key The tile coord key.
 * @return {TileCoord} The tile coord.
 */
function fromKey(key) {
    return key.split('/').map(Number);
}
/**
 * @param {TileCoord} tileCoord Tile coord.
 * @return {number} Hash.
 */
function hash(tileCoord) {
    return (tileCoord[1] << tileCoord[0]) + tileCoord[2];
}
/**
 * @param {TileCoord} tileCoord Tile coordinate.
 * @param {!import("./tilegrid/TileGrid.js").default} tileGrid Tile grid.
 * @return {boolean} Tile coordinate is within extent and zoom level range.
 */
function withinExtentAndZ(tileCoord, tileGrid) {
    var z = tileCoord[0];
    var x = tileCoord[1];
    var y = tileCoord[2];
    if (tileGrid.getMinZoom() > z || z > tileGrid.getMaxZoom()) {
        return false;
    }
    var tileRange = tileGrid.getFullTileRange(z);
    if (!tileRange) {
        return true;
    }
    else {
        return tileRange.containsXY(x, y);
    }
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
var TileCache = /** @class */ (function (_super) {
    __extends$2(TileCache, _super);
    function TileCache() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {!Object<string, boolean>} usedTiles Used tiles.
     */
    TileCache.prototype.expireCache = function (usedTiles) {
        while (this.canExpireCache()) {
            var tile = this.peekLast();
            if (tile.getKey() in usedTiles) {
                break;
            }
            else {
                this.pop().release();
            }
        }
    };
    /**
     * Prune all tiles from the cache that don't have the same z as the newest tile.
     */
    TileCache.prototype.pruneExceptNewestZ = function () {
        if (this.getCount() === 0) {
            return;
        }
        var key = this.peekFirstKey();
        var tileCoord = fromKey(key);
        var z = tileCoord[0];
        this.forEach(function (tile) {
            if (tile.tileCoord[0] !== z) {
                this.remove(getKey(tile.tileCoord));
                tile.release();
            }
        }.bind(this));
    };
    return TileCache;
}(LRUCache));

/**
 * @module ol/reproj/common
 */
/**
 * Default maximum allowed threshold  (in pixels) for reprojection
 * triangulation.
 * @type {number}
 */
var ERROR_THRESHOLD = 0.5;

/**
 * @module ol/reproj/Triangulation
 */
/**
 * Single triangle; consists of 3 source points and 3 target points.
 * @typedef {Object} Triangle
 * @property {Array<import("../coordinate.js").Coordinate>} source Source.
 * @property {Array<import("../coordinate.js").Coordinate>} target Target.
 */
/**
 * Maximum number of subdivision steps during raster reprojection triangulation.
 * Prevents high memory usage and large number of proj4 calls (for certain
 * transformations and areas). At most `2*(2^this)` triangles are created for
 * each triangulated extent (tile/image).
 * @type {number}
 */
var MAX_SUBDIVISION = 10;
/**
 * Maximum allowed size of triangle relative to world width. When transforming
 * corners of world extent between certain projections, the resulting
 * triangulation seems to have zero error and no subdivision is performed. If
 * the triangle width is more than this (relative to world width; 0-1),
 * subdivison is forced (up to `MAX_SUBDIVISION`). Default is `0.25`.
 * @type {number}
 */
var MAX_TRIANGLE_WIDTH = 0.25;
/**
 * @classdesc
 * Class containing triangulation of the given target extent.
 * Used for determining source data and the reprojection itself.
 */
var Triangulation = /** @class */ (function () {
    /**
     * @param {import("../proj/Projection.js").default} sourceProj Source projection.
     * @param {import("../proj/Projection.js").default} targetProj Target projection.
     * @param {import("../extent.js").Extent} targetExtent Target extent to triangulate.
     * @param {import("../extent.js").Extent} maxSourceExtent Maximal source extent that can be used.
     * @param {number} errorThreshold Acceptable error (in source units).
     * @param {?number} opt_destinationResolution The (optional) resolution of the destination.
     */
    function Triangulation(sourceProj, targetProj, targetExtent, maxSourceExtent, errorThreshold, opt_destinationResolution) {
        /**
         * @type {import("../proj/Projection.js").default}
         * @private
         */
        this.sourceProj_ = sourceProj;
        /**
         * @type {import("../proj/Projection.js").default}
         * @private
         */
        this.targetProj_ = targetProj;
        /** @type {!Object<string, import("../coordinate.js").Coordinate>} */
        var transformInvCache = {};
        var transformInv = getTransform(this.targetProj_, this.sourceProj_);
        /**
         * @param {import("../coordinate.js").Coordinate} c A coordinate.
         * @return {import("../coordinate.js").Coordinate} Transformed coordinate.
         * @private
         */
        this.transformInv_ = function (c) {
            var key = c[0] + '/' + c[1];
            if (!transformInvCache[key]) {
                transformInvCache[key] = transformInv(c);
            }
            return transformInvCache[key];
        };
        /**
         * @type {import("../extent.js").Extent}
         * @private
         */
        this.maxSourceExtent_ = maxSourceExtent;
        /**
         * @type {number}
         * @private
         */
        this.errorThresholdSquared_ = errorThreshold * errorThreshold;
        /**
         * @type {Array<Triangle>}
         * @private
         */
        this.triangles_ = [];
        /**
         * Indicates that the triangulation crosses edge of the source projection.
         * @type {boolean}
         * @private
         */
        this.wrapsXInSource_ = false;
        /**
         * @type {boolean}
         * @private
         */
        this.canWrapXInSource_ =
            this.sourceProj_.canWrapX() &&
                !!maxSourceExtent &&
                !!this.sourceProj_.getExtent() &&
                getWidth(maxSourceExtent) == getWidth(this.sourceProj_.getExtent());
        /**
         * @type {?number}
         * @private
         */
        this.sourceWorldWidth_ = this.sourceProj_.getExtent()
            ? getWidth(this.sourceProj_.getExtent())
            : null;
        /**
         * @type {?number}
         * @private
         */
        this.targetWorldWidth_ = this.targetProj_.getExtent()
            ? getWidth(this.targetProj_.getExtent())
            : null;
        var destinationTopLeft = getTopLeft(targetExtent);
        var destinationTopRight = getTopRight(targetExtent);
        var destinationBottomRight = getBottomRight(targetExtent);
        var destinationBottomLeft = getBottomLeft(targetExtent);
        var sourceTopLeft = this.transformInv_(destinationTopLeft);
        var sourceTopRight = this.transformInv_(destinationTopRight);
        var sourceBottomRight = this.transformInv_(destinationBottomRight);
        var sourceBottomLeft = this.transformInv_(destinationBottomLeft);
        /*
         * The maxSubdivision controls how many splittings of the target area can
         * be done. The idea here is to do a linear mapping of the target areas
         * but the actual overal reprojection (can be) extremely non-linear. The
         * default value of MAX_SUBDIVISION was chosen based on mapping a 256x256
         * tile size. However this function is also called to remap canvas rendered
         * layers which can be much larger. This calculation increases the maxSubdivision
         * value by the right factor so that each 256x256 pixel area has
         * MAX_SUBDIVISION divisions.
         */
        var maxSubdivision = MAX_SUBDIVISION +
            (opt_destinationResolution
                ? Math.max(0, Math.ceil(log2(getArea(targetExtent) /
                    (opt_destinationResolution *
                        opt_destinationResolution *
                        256 *
                        256))))
                : 0);
        this.addQuad_(destinationTopLeft, destinationTopRight, destinationBottomRight, destinationBottomLeft, sourceTopLeft, sourceTopRight, sourceBottomRight, sourceBottomLeft, maxSubdivision);
        if (this.wrapsXInSource_) {
            var leftBound_1 = Infinity;
            this.triangles_.forEach(function (triangle, i, arr) {
                leftBound_1 = Math.min(leftBound_1, triangle.source[0][0], triangle.source[1][0], triangle.source[2][0]);
            });
            // Shift triangles to be as close to `leftBound` as possible
            // (if the distance is more than `worldWidth / 2` it can be closer.
            this.triangles_.forEach(function (triangle) {
                if (Math.max(triangle.source[0][0], triangle.source[1][0], triangle.source[2][0]) -
                    leftBound_1 >
                    this.sourceWorldWidth_ / 2) {
                    var newTriangle = [
                        [triangle.source[0][0], triangle.source[0][1]],
                        [triangle.source[1][0], triangle.source[1][1]],
                        [triangle.source[2][0], triangle.source[2][1]],
                    ];
                    if (newTriangle[0][0] - leftBound_1 > this.sourceWorldWidth_ / 2) {
                        newTriangle[0][0] -= this.sourceWorldWidth_;
                    }
                    if (newTriangle[1][0] - leftBound_1 > this.sourceWorldWidth_ / 2) {
                        newTriangle[1][0] -= this.sourceWorldWidth_;
                    }
                    if (newTriangle[2][0] - leftBound_1 > this.sourceWorldWidth_ / 2) {
                        newTriangle[2][0] -= this.sourceWorldWidth_;
                    }
                    // Rarely (if the extent contains both the dateline and prime meridian)
                    // the shift can in turn break some triangles.
                    // Detect this here and don't shift in such cases.
                    var minX = Math.min(newTriangle[0][0], newTriangle[1][0], newTriangle[2][0]);
                    var maxX = Math.max(newTriangle[0][0], newTriangle[1][0], newTriangle[2][0]);
                    if (maxX - minX < this.sourceWorldWidth_ / 2) {
                        triangle.source = newTriangle;
                    }
                }
            }.bind(this));
        }
        transformInvCache = {};
    }
    /**
     * Adds triangle to the triangulation.
     * @param {import("../coordinate.js").Coordinate} a The target a coordinate.
     * @param {import("../coordinate.js").Coordinate} b The target b coordinate.
     * @param {import("../coordinate.js").Coordinate} c The target c coordinate.
     * @param {import("../coordinate.js").Coordinate} aSrc The source a coordinate.
     * @param {import("../coordinate.js").Coordinate} bSrc The source b coordinate.
     * @param {import("../coordinate.js").Coordinate} cSrc The source c coordinate.
     * @private
     */
    Triangulation.prototype.addTriangle_ = function (a, b, c, aSrc, bSrc, cSrc) {
        this.triangles_.push({
            source: [aSrc, bSrc, cSrc],
            target: [a, b, c],
        });
    };
    /**
     * Adds quad (points in clock-wise order) to the triangulation
     * (and reprojects the vertices) if valid.
     * Performs quad subdivision if needed to increase precision.
     *
     * @param {import("../coordinate.js").Coordinate} a The target a coordinate.
     * @param {import("../coordinate.js").Coordinate} b The target b coordinate.
     * @param {import("../coordinate.js").Coordinate} c The target c coordinate.
     * @param {import("../coordinate.js").Coordinate} d The target d coordinate.
     * @param {import("../coordinate.js").Coordinate} aSrc The source a coordinate.
     * @param {import("../coordinate.js").Coordinate} bSrc The source b coordinate.
     * @param {import("../coordinate.js").Coordinate} cSrc The source c coordinate.
     * @param {import("../coordinate.js").Coordinate} dSrc The source d coordinate.
     * @param {number} maxSubdivision Maximal allowed subdivision of the quad.
     * @private
     */
    Triangulation.prototype.addQuad_ = function (a, b, c, d, aSrc, bSrc, cSrc, dSrc, maxSubdivision) {
        var sourceQuadExtent = boundingExtent([aSrc, bSrc, cSrc, dSrc]);
        var sourceCoverageX = this.sourceWorldWidth_
            ? getWidth(sourceQuadExtent) / this.sourceWorldWidth_
            : null;
        var sourceWorldWidth = /** @type {number} */ (this.sourceWorldWidth_);
        // when the quad is wrapped in the source projection
        // it covers most of the projection extent, but not fully
        var wrapsX = this.sourceProj_.canWrapX() &&
            sourceCoverageX > 0.5 &&
            sourceCoverageX < 1;
        var needsSubdivision = false;
        if (maxSubdivision > 0) {
            if (this.targetProj_.isGlobal() && this.targetWorldWidth_) {
                var targetQuadExtent = boundingExtent([a, b, c, d]);
                var targetCoverageX = getWidth(targetQuadExtent) / this.targetWorldWidth_;
                needsSubdivision =
                    targetCoverageX > MAX_TRIANGLE_WIDTH || needsSubdivision;
            }
            if (!wrapsX && this.sourceProj_.isGlobal() && sourceCoverageX) {
                needsSubdivision =
                    sourceCoverageX > MAX_TRIANGLE_WIDTH || needsSubdivision;
            }
        }
        if (!needsSubdivision && this.maxSourceExtent_) {
            if (isFinite(sourceQuadExtent[0]) &&
                isFinite(sourceQuadExtent[1]) &&
                isFinite(sourceQuadExtent[2]) &&
                isFinite(sourceQuadExtent[3])) {
                if (!intersects(sourceQuadExtent, this.maxSourceExtent_)) {
                    // whole quad outside source projection extent -> ignore
                    return;
                }
            }
        }
        var isNotFinite = 0;
        if (!needsSubdivision) {
            if (!isFinite(aSrc[0]) ||
                !isFinite(aSrc[1]) ||
                !isFinite(bSrc[0]) ||
                !isFinite(bSrc[1]) ||
                !isFinite(cSrc[0]) ||
                !isFinite(cSrc[1]) ||
                !isFinite(dSrc[0]) ||
                !isFinite(dSrc[1])) {
                if (maxSubdivision > 0) {
                    needsSubdivision = true;
                }
                else {
                    // It might be the case that only 1 of the points is infinite. In this case
                    // we can draw a single triangle with the other three points
                    isNotFinite =
                        (!isFinite(aSrc[0]) || !isFinite(aSrc[1]) ? 8 : 0) +
                            (!isFinite(bSrc[0]) || !isFinite(bSrc[1]) ? 4 : 0) +
                            (!isFinite(cSrc[0]) || !isFinite(cSrc[1]) ? 2 : 0) +
                            (!isFinite(dSrc[0]) || !isFinite(dSrc[1]) ? 1 : 0);
                    if (isNotFinite != 1 &&
                        isNotFinite != 2 &&
                        isNotFinite != 4 &&
                        isNotFinite != 8) {
                        return;
                    }
                }
            }
        }
        if (maxSubdivision > 0) {
            if (!needsSubdivision) {
                var center = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2];
                var centerSrc = this.transformInv_(center);
                var dx = void 0;
                if (wrapsX) {
                    var centerSrcEstimX = (modulo(aSrc[0], sourceWorldWidth) +
                        modulo(cSrc[0], sourceWorldWidth)) /
                        2;
                    dx = centerSrcEstimX - modulo(centerSrc[0], sourceWorldWidth);
                }
                else {
                    dx = (aSrc[0] + cSrc[0]) / 2 - centerSrc[0];
                }
                var dy = (aSrc[1] + cSrc[1]) / 2 - centerSrc[1];
                var centerSrcErrorSquared = dx * dx + dy * dy;
                needsSubdivision = centerSrcErrorSquared > this.errorThresholdSquared_;
            }
            if (needsSubdivision) {
                if (Math.abs(a[0] - c[0]) <= Math.abs(a[1] - c[1])) {
                    // split horizontally (top & bottom)
                    var bc = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
                    var bcSrc = this.transformInv_(bc);
                    var da = [(d[0] + a[0]) / 2, (d[1] + a[1]) / 2];
                    var daSrc = this.transformInv_(da);
                    this.addQuad_(a, b, bc, da, aSrc, bSrc, bcSrc, daSrc, maxSubdivision - 1);
                    this.addQuad_(da, bc, c, d, daSrc, bcSrc, cSrc, dSrc, maxSubdivision - 1);
                }
                else {
                    // split vertically (left & right)
                    var ab = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
                    var abSrc = this.transformInv_(ab);
                    var cd = [(c[0] + d[0]) / 2, (c[1] + d[1]) / 2];
                    var cdSrc = this.transformInv_(cd);
                    this.addQuad_(a, ab, cd, d, aSrc, abSrc, cdSrc, dSrc, maxSubdivision - 1);
                    this.addQuad_(ab, b, c, cd, abSrc, bSrc, cSrc, cdSrc, maxSubdivision - 1);
                }
                return;
            }
        }
        if (wrapsX) {
            if (!this.canWrapXInSource_) {
                return;
            }
            this.wrapsXInSource_ = true;
        }
        // Exactly zero or one of *Src is not finite
        // The triangles must have the diagonal line as the first side
        // This is to allow easy code in reproj.s to make it straight for broken
        // browsers that can't handle diagonal clipping
        if ((isNotFinite & 0xb) == 0) {
            this.addTriangle_(a, c, d, aSrc, cSrc, dSrc);
        }
        if ((isNotFinite & 0xe) == 0) {
            this.addTriangle_(a, c, b, aSrc, cSrc, bSrc);
        }
        if (isNotFinite) {
            // Try the other two triangles
            if ((isNotFinite & 0xd) == 0) {
                this.addTriangle_(b, d, a, bSrc, dSrc, aSrc);
            }
            if ((isNotFinite & 0x7) == 0) {
                this.addTriangle_(b, d, c, bSrc, dSrc, cSrc);
            }
        }
    };
    /**
     * Calculates extent of the 'source' coordinates from all the triangles.
     *
     * @return {import("../extent.js").Extent} Calculated extent.
     */
    Triangulation.prototype.calculateSourceExtent = function () {
        var extent = createEmpty();
        this.triangles_.forEach(function (triangle, i, arr) {
            var src = triangle.source;
            extendCoordinate(extent, src[0]);
            extendCoordinate(extent, src[1]);
            extendCoordinate(extent, src[2]);
        });
        return extent;
    };
    /**
     * @return {Array<Triangle>} Array of the calculated triangles.
     */
    Triangulation.prototype.getTriangles = function () {
        return this.triangles_;
    };
    return Triangulation;
}());

/**
 * @module ol/source/common
 */
/**
 * Context options to disable image smoothing.
 * @type {Object}
 */
var IMAGE_SMOOTHING_DISABLED = {
    imageSmoothingEnabled: false,
    msImageSmoothingEnabled: false,
};

/**
 * @module ol/reproj
 */
var brokenDiagonalRendering_;
/**
 * This draws a small triangle into a canvas by setting the triangle as the clip region
 * and then drawing a (too large) rectangle
 *
 * @param {CanvasRenderingContext2D} ctx The context in which to draw the triangle
 * @param {number} u1 The x-coordinate of the second point. The first point is 0,0.
 * @param {number} v1 The y-coordinate of the second point.
 * @param {number} u2 The x-coordinate of the third point.
 * @param {number} v2 The y-coordinate of the third point.
 */
function drawTestTriangle(ctx, u1, v1, u2, v2) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(u1, v1);
    ctx.lineTo(u2, v2);
    ctx.closePath();
    ctx.save();
    ctx.clip();
    ctx.fillRect(0, 0, Math.max(u1, u2) + 1, Math.max(v1, v2));
    ctx.restore();
}
/**
 * Given the data from getImageData, see if the right values appear at the provided offset.
 * Returns true if either the color or transparency is off
 *
 * @param {Uint8ClampedArray} data The data returned from getImageData
 * @param {number} offset The pixel offset from the start of data.
 * @return {boolean} true if the diagonal rendering is broken
 */
function verifyBrokenDiagonalRendering(data, offset) {
    // the values ought to be close to the rgba(210, 0, 0, 0.75)
    return (Math.abs(data[offset * 4] - 210) > 2 ||
        Math.abs(data[offset * 4 + 3] - 0.75 * 255) > 2);
}
/**
 * Determines if the current browser configuration can render triangular clip regions correctly.
 * This value is cached so the function is only expensive the first time called.
 * Firefox on Windows (as of now) does not if HWA is enabled. See https://bugzilla.mozilla.org/show_bug.cgi?id=1606976
 * IE also doesn't. Chrome works, and everything seems to work on OSX and Android. This function caches the
 * result. I suppose that it is conceivably possible that a browser might flip modes while the app is
 * running, but lets hope not.
 *
 * @return {boolean} true if the Diagonal Rendering is broken.
 */
function isBrokenDiagonalRendering() {
    if (brokenDiagonalRendering_ === undefined) {
        var ctx = document.createElement('canvas').getContext('2d');
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgba(210, 0, 0, 0.75)';
        drawTestTriangle(ctx, 4, 5, 4, 0);
        drawTestTriangle(ctx, 4, 5, 0, 5);
        var data = ctx.getImageData(0, 0, 3, 3).data;
        brokenDiagonalRendering_ =
            verifyBrokenDiagonalRendering(data, 0) ||
                verifyBrokenDiagonalRendering(data, 4) ||
                verifyBrokenDiagonalRendering(data, 8);
    }
    return brokenDiagonalRendering_;
}
/**
 * Calculates ideal resolution to use from the source in order to achieve
 * pixel mapping as close as possible to 1:1 during reprojection.
 * The resolution is calculated regardless of what resolutions
 * are actually available in the dataset (TileGrid, Image, ...).
 *
 * @param {import("./proj/Projection.js").default} sourceProj Source projection.
 * @param {import("./proj/Projection.js").default} targetProj Target projection.
 * @param {import("./coordinate.js").Coordinate} targetCenter Target center.
 * @param {number} targetResolution Target resolution.
 * @return {number} The best resolution to use. Can be +-Infinity, NaN or 0.
 */
function calculateSourceResolution(sourceProj, targetProj, targetCenter, targetResolution) {
    var sourceCenter = transform(targetCenter, targetProj, sourceProj);
    // calculate the ideal resolution of the source data
    var sourceResolution = getPointResolution(targetProj, targetResolution, targetCenter);
    var targetMetersPerUnit = targetProj.getMetersPerUnit();
    if (targetMetersPerUnit !== undefined) {
        sourceResolution *= targetMetersPerUnit;
    }
    var sourceMetersPerUnit = sourceProj.getMetersPerUnit();
    if (sourceMetersPerUnit !== undefined) {
        sourceResolution /= sourceMetersPerUnit;
    }
    // Based on the projection properties, the point resolution at the specified
    // coordinates may be slightly different. We need to reverse-compensate this
    // in order to achieve optimal results.
    var sourceExtent = sourceProj.getExtent();
    if (!sourceExtent || containsCoordinate(sourceExtent, sourceCenter)) {
        var compensationFactor = getPointResolution(sourceProj, sourceResolution, sourceCenter) /
            sourceResolution;
        if (isFinite(compensationFactor) && compensationFactor > 0) {
            sourceResolution /= compensationFactor;
        }
    }
    return sourceResolution;
}
/**
 * Calculates ideal resolution to use from the source in order to achieve
 * pixel mapping as close as possible to 1:1 during reprojection.
 * The resolution is calculated regardless of what resolutions
 * are actually available in the dataset (TileGrid, Image, ...).
 *
 * @param {import("./proj/Projection.js").default} sourceProj Source projection.
 * @param {import("./proj/Projection.js").default} targetProj Target projection.
 * @param {import("./extent.js").Extent} targetExtent Target extent
 * @param {number} targetResolution Target resolution.
 * @return {number} The best resolution to use. Can be +-Infinity, NaN or 0.
 */
function calculateSourceExtentResolution(sourceProj, targetProj, targetExtent, targetResolution) {
    var targetCenter = getCenter(targetExtent);
    var sourceResolution = calculateSourceResolution(sourceProj, targetProj, targetCenter, targetResolution);
    if (!isFinite(sourceResolution) || sourceResolution <= 0) {
        forEachCorner(targetExtent, function (corner) {
            sourceResolution = calculateSourceResolution(sourceProj, targetProj, corner, targetResolution);
            return isFinite(sourceResolution) && sourceResolution > 0;
        });
    }
    return sourceResolution;
}
/**
 * @typedef {Object} ImageExtent
 * @property {import("./extent.js").Extent} extent Extent.
 * @property {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} image Image.
 */
/**
 * Renders the source data into new canvas based on the triangulation.
 *
 * @param {number} width Width of the canvas.
 * @param {number} height Height of the canvas.
 * @param {number} pixelRatio Pixel ratio.
 * @param {number} sourceResolution Source resolution.
 * @param {import("./extent.js").Extent} sourceExtent Extent of the data source.
 * @param {number} targetResolution Target resolution.
 * @param {import("./extent.js").Extent} targetExtent Target extent.
 * @param {import("./reproj/Triangulation.js").default} triangulation Calculated triangulation.
 * @param {Array<ImageExtent>} sources Array of sources.
 * @param {number} gutter Gutter of the sources.
 * @param {boolean} [opt_renderEdges] Render reprojection edges.
 * @param {object} [opt_contextOptions] Properties to set on the canvas context.
 * @return {HTMLCanvasElement} Canvas with reprojected data.
 */
function render(width, height, pixelRatio, sourceResolution, sourceExtent, targetResolution, targetExtent, triangulation, sources, gutter, opt_renderEdges, opt_contextOptions) {
    var context = createCanvasContext2D(Math.round(pixelRatio * width), Math.round(pixelRatio * height));
    assign(context, opt_contextOptions);
    if (sources.length === 0) {
        return context.canvas;
    }
    context.scale(pixelRatio, pixelRatio);
    function pixelRound(value) {
        return Math.round(value * pixelRatio) / pixelRatio;
    }
    context.globalCompositeOperation = 'lighter';
    var sourceDataExtent = createEmpty();
    sources.forEach(function (src, i, arr) {
        extend(sourceDataExtent, src.extent);
    });
    var canvasWidthInUnits = getWidth(sourceDataExtent);
    var canvasHeightInUnits = getHeight(sourceDataExtent);
    var stitchContext = createCanvasContext2D(Math.round((pixelRatio * canvasWidthInUnits) / sourceResolution), Math.round((pixelRatio * canvasHeightInUnits) / sourceResolution));
    assign(stitchContext, opt_contextOptions);
    var stitchScale = pixelRatio / sourceResolution;
    sources.forEach(function (src, i, arr) {
        var xPos = src.extent[0] - sourceDataExtent[0];
        var yPos = -(src.extent[3] - sourceDataExtent[3]);
        var srcWidth = getWidth(src.extent);
        var srcHeight = getHeight(src.extent);
        // This test should never fail -- but it does. Need to find a fix the upstream condition
        if (src.image.width > 0 && src.image.height > 0) {
            stitchContext.drawImage(src.image, gutter, gutter, src.image.width - 2 * gutter, src.image.height - 2 * gutter, xPos * stitchScale, yPos * stitchScale, srcWidth * stitchScale, srcHeight * stitchScale);
        }
    });
    var targetTopLeft = getTopLeft(targetExtent);
    triangulation.getTriangles().forEach(function (triangle, i, arr) {
        /* Calculate affine transform (src -> dst)
         * Resulting matrix can be used to transform coordinate
         * from `sourceProjection` to destination pixels.
         *
         * To optimize number of context calls and increase numerical stability,
         * we also do the following operations:
         * trans(-topLeftExtentCorner), scale(1 / targetResolution), scale(1, -1)
         * here before solving the linear system so [ui, vi] are pixel coordinates.
         *
         * Src points: xi, yi
         * Dst points: ui, vi
         * Affine coefficients: aij
         *
         * | x0 y0 1  0  0 0 |   |a00|   |u0|
         * | x1 y1 1  0  0 0 |   |a01|   |u1|
         * | x2 y2 1  0  0 0 | x |a02| = |u2|
         * |  0  0 0 x0 y0 1 |   |a10|   |v0|
         * |  0  0 0 x1 y1 1 |   |a11|   |v1|
         * |  0  0 0 x2 y2 1 |   |a12|   |v2|
         */
        var source = triangle.source;
        var target = triangle.target;
        var x0 = source[0][0], y0 = source[0][1];
        var x1 = source[1][0], y1 = source[1][1];
        var x2 = source[2][0], y2 = source[2][1];
        // Make sure that everything is on pixel boundaries
        var u0 = pixelRound((target[0][0] - targetTopLeft[0]) / targetResolution);
        var v0 = pixelRound(-(target[0][1] - targetTopLeft[1]) / targetResolution);
        var u1 = pixelRound((target[1][0] - targetTopLeft[0]) / targetResolution);
        var v1 = pixelRound(-(target[1][1] - targetTopLeft[1]) / targetResolution);
        var u2 = pixelRound((target[2][0] - targetTopLeft[0]) / targetResolution);
        var v2 = pixelRound(-(target[2][1] - targetTopLeft[1]) / targetResolution);
        // Shift all the source points to improve numerical stability
        // of all the subsequent calculations. The [x0, y0] is used here.
        // This is also used to simplify the linear system.
        var sourceNumericalShiftX = x0;
        var sourceNumericalShiftY = y0;
        x0 = 0;
        y0 = 0;
        x1 -= sourceNumericalShiftX;
        y1 -= sourceNumericalShiftY;
        x2 -= sourceNumericalShiftX;
        y2 -= sourceNumericalShiftY;
        var augmentedMatrix = [
            [x1, y1, 0, 0, u1 - u0],
            [x2, y2, 0, 0, u2 - u0],
            [0, 0, x1, y1, v1 - v0],
            [0, 0, x2, y2, v2 - v0],
        ];
        var affineCoefs = solveLinearSystem(augmentedMatrix);
        if (!affineCoefs) {
            return;
        }
        context.save();
        context.beginPath();
        if (isBrokenDiagonalRendering() ||
            opt_contextOptions === IMAGE_SMOOTHING_DISABLED) {
            // Make sure that all lines are horizontal or vertical
            context.moveTo(u1, v1);
            // This is the diagonal line. Do it in 4 steps
            var steps = 4;
            var ud = u0 - u1;
            var vd = v0 - v1;
            for (var step = 0; step < steps; step++) {
                // Go horizontally
                context.lineTo(u1 + pixelRound(((step + 1) * ud) / steps), v1 + pixelRound((step * vd) / (steps - 1)));
                // Go vertically
                if (step != steps - 1) {
                    context.lineTo(u1 + pixelRound(((step + 1) * ud) / steps), v1 + pixelRound(((step + 1) * vd) / (steps - 1)));
                }
            }
            // We are almost at u0r, v0r
            context.lineTo(u2, v2);
        }
        else {
            context.moveTo(u1, v1);
            context.lineTo(u0, v0);
            context.lineTo(u2, v2);
        }
        context.clip();
        context.transform(affineCoefs[0], affineCoefs[2], affineCoefs[1], affineCoefs[3], u0, v0);
        context.translate(sourceDataExtent[0] - sourceNumericalShiftX, sourceDataExtent[3] - sourceNumericalShiftY);
        context.scale(sourceResolution / pixelRatio, -sourceResolution / pixelRatio);
        context.drawImage(stitchContext.canvas, 0, 0);
        context.restore();
    });
    if (opt_renderEdges) {
        context.save();
        context.globalCompositeOperation = 'source-over';
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        triangulation.getTriangles().forEach(function (triangle, i, arr) {
            var target = triangle.target;
            var u0 = (target[0][0] - targetTopLeft[0]) / targetResolution;
            var v0 = -(target[0][1] - targetTopLeft[1]) / targetResolution;
            var u1 = (target[1][0] - targetTopLeft[0]) / targetResolution;
            var v1 = -(target[1][1] - targetTopLeft[1]) / targetResolution;
            var u2 = (target[2][0] - targetTopLeft[0]) / targetResolution;
            var v2 = -(target[2][1] - targetTopLeft[1]) / targetResolution;
            context.beginPath();
            context.moveTo(u1, v1);
            context.lineTo(u0, v0);
            context.lineTo(u2, v2);
            context.closePath();
            context.stroke();
        });
        context.restore();
    }
    return context.canvas;
}

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
/**
 * @typedef {function(number, number, number, number) : import("../Tile.js").default} FunctionType
 */
/**
 * @classdesc
 * Class encapsulating single reprojected tile.
 * See {@link module:ol/source/TileImage~TileImage}.
 *
 */
var ReprojTile = /** @class */ (function (_super) {
    __extends$3(ReprojTile, _super);
    /**
     * @param {import("../proj/Projection.js").default} sourceProj Source projection.
     * @param {import("../tilegrid/TileGrid.js").default} sourceTileGrid Source tile grid.
     * @param {import("../proj/Projection.js").default} targetProj Target projection.
     * @param {import("../tilegrid/TileGrid.js").default} targetTileGrid Target tile grid.
     * @param {import("../tilecoord.js").TileCoord} tileCoord Coordinate of the tile.
     * @param {import("../tilecoord.js").TileCoord} wrappedTileCoord Coordinate of the tile wrapped in X.
     * @param {number} pixelRatio Pixel ratio.
     * @param {number} gutter Gutter of the source tiles.
     * @param {FunctionType} getTileFunction
     *     Function returning source tiles (z, x, y, pixelRatio).
     * @param {number} [opt_errorThreshold] Acceptable reprojection error (in px).
     * @param {boolean} [opt_renderEdges] Render reprojection edges.
     * @param {object} [opt_contextOptions] Properties to set on the canvas context.
     */
    function ReprojTile(sourceProj, sourceTileGrid, targetProj, targetTileGrid, tileCoord, wrappedTileCoord, pixelRatio, gutter, getTileFunction, opt_errorThreshold, opt_renderEdges, opt_contextOptions) {
        var _this = _super.call(this, tileCoord, TileState.IDLE) || this;
        /**
         * @private
         * @type {boolean}
         */
        _this.renderEdges_ = opt_renderEdges !== undefined ? opt_renderEdges : false;
        /**
         * @private
         * @type {object}
         */
        _this.contextOptions_ = opt_contextOptions;
        /**
         * @private
         * @type {number}
         */
        _this.pixelRatio_ = pixelRatio;
        /**
         * @private
         * @type {number}
         */
        _this.gutter_ = gutter;
        /**
         * @private
         * @type {HTMLCanvasElement}
         */
        _this.canvas_ = null;
        /**
         * @private
         * @type {import("../tilegrid/TileGrid.js").default}
         */
        _this.sourceTileGrid_ = sourceTileGrid;
        /**
         * @private
         * @type {import("../tilegrid/TileGrid.js").default}
         */
        _this.targetTileGrid_ = targetTileGrid;
        /**
         * @private
         * @type {import("../tilecoord.js").TileCoord}
         */
        _this.wrappedTileCoord_ = wrappedTileCoord ? wrappedTileCoord : tileCoord;
        /**
         * @private
         * @type {!Array<import("../Tile.js").default>}
         */
        _this.sourceTiles_ = [];
        /**
         * @private
         * @type {?Array<import("../events.js").EventsKey>}
         */
        _this.sourcesListenerKeys_ = null;
        /**
         * @private
         * @type {number}
         */
        _this.sourceZ_ = 0;
        var targetExtent = targetTileGrid.getTileCoordExtent(_this.wrappedTileCoord_);
        var maxTargetExtent = _this.targetTileGrid_.getExtent();
        var maxSourceExtent = _this.sourceTileGrid_.getExtent();
        var limitedTargetExtent = maxTargetExtent
            ? getIntersection(targetExtent, maxTargetExtent)
            : targetExtent;
        if (getArea(limitedTargetExtent) === 0) {
            // Tile is completely outside range -> EMPTY
            // TODO: is it actually correct that the source even creates the tile ?
            _this.state = TileState.EMPTY;
            return _this;
        }
        var sourceProjExtent = sourceProj.getExtent();
        if (sourceProjExtent) {
            if (!maxSourceExtent) {
                maxSourceExtent = sourceProjExtent;
            }
            else {
                maxSourceExtent = getIntersection(maxSourceExtent, sourceProjExtent);
            }
        }
        var targetResolution = targetTileGrid.getResolution(_this.wrappedTileCoord_[0]);
        var sourceResolution = calculateSourceExtentResolution(sourceProj, targetProj, limitedTargetExtent, targetResolution);
        if (!isFinite(sourceResolution) || sourceResolution <= 0) {
            // invalid sourceResolution -> EMPTY
            // probably edges of the projections when no extent is defined
            _this.state = TileState.EMPTY;
            return _this;
        }
        var errorThresholdInPixels = opt_errorThreshold !== undefined ? opt_errorThreshold : ERROR_THRESHOLD;
        /**
         * @private
         * @type {!import("./Triangulation.js").default}
         */
        _this.triangulation_ = new Triangulation(sourceProj, targetProj, limitedTargetExtent, maxSourceExtent, sourceResolution * errorThresholdInPixels, targetResolution);
        if (_this.triangulation_.getTriangles().length === 0) {
            // no valid triangles -> EMPTY
            _this.state = TileState.EMPTY;
            return _this;
        }
        _this.sourceZ_ = sourceTileGrid.getZForResolution(sourceResolution);
        var sourceExtent = _this.triangulation_.calculateSourceExtent();
        if (maxSourceExtent) {
            if (sourceProj.canWrapX()) {
                sourceExtent[1] = clamp(sourceExtent[1], maxSourceExtent[1], maxSourceExtent[3]);
                sourceExtent[3] = clamp(sourceExtent[3], maxSourceExtent[1], maxSourceExtent[3]);
            }
            else {
                sourceExtent = getIntersection(sourceExtent, maxSourceExtent);
            }
        }
        if (!getArea(sourceExtent)) {
            _this.state = TileState.EMPTY;
        }
        else {
            var sourceRange = sourceTileGrid.getTileRangeForExtentAndZ(sourceExtent, _this.sourceZ_);
            for (var srcX = sourceRange.minX; srcX <= sourceRange.maxX; srcX++) {
                for (var srcY = sourceRange.minY; srcY <= sourceRange.maxY; srcY++) {
                    var tile = getTileFunction(_this.sourceZ_, srcX, srcY, pixelRatio);
                    if (tile) {
                        _this.sourceTiles_.push(tile);
                    }
                }
            }
            if (_this.sourceTiles_.length === 0) {
                _this.state = TileState.EMPTY;
            }
        }
        return _this;
    }
    /**
     * Get the HTML Canvas element for this tile.
     * @return {HTMLCanvasElement} Canvas.
     */
    ReprojTile.prototype.getImage = function () {
        return this.canvas_;
    };
    /**
     * @private
     */
    ReprojTile.prototype.reproject_ = function () {
        var sources = [];
        this.sourceTiles_.forEach(function (tile, i, arr) {
            if (tile && tile.getState() == TileState.LOADED) {
                sources.push({
                    extent: this.sourceTileGrid_.getTileCoordExtent(tile.tileCoord),
                    image: tile.getImage(),
                });
            }
        }.bind(this));
        this.sourceTiles_.length = 0;
        if (sources.length === 0) {
            this.state = TileState.ERROR;
        }
        else {
            var z = this.wrappedTileCoord_[0];
            var size = this.targetTileGrid_.getTileSize(z);
            var width = typeof size === 'number' ? size : size[0];
            var height = typeof size === 'number' ? size : size[1];
            var targetResolution = this.targetTileGrid_.getResolution(z);
            var sourceResolution = this.sourceTileGrid_.getResolution(this.sourceZ_);
            var targetExtent = this.targetTileGrid_.getTileCoordExtent(this.wrappedTileCoord_);
            this.canvas_ = render(width, height, this.pixelRatio_, sourceResolution, this.sourceTileGrid_.getExtent(), targetResolution, targetExtent, this.triangulation_, sources, this.gutter_, this.renderEdges_, this.contextOptions_);
            this.state = TileState.LOADED;
        }
        this.changed();
    };
    /**
     * Load not yet loaded URI.
     */
    ReprojTile.prototype.load = function () {
        if (this.state == TileState.IDLE) {
            this.state = TileState.LOADING;
            this.changed();
            var leftToLoad_1 = 0;
            this.sourcesListenerKeys_ = [];
            this.sourceTiles_.forEach(function (tile, i, arr) {
                var state = tile.getState();
                if (state == TileState.IDLE || state == TileState.LOADING) {
                    leftToLoad_1++;
                    var sourceListenKey_1 = listen(tile, EventType.CHANGE, function (e) {
                        var state = tile.getState();
                        if (state == TileState.LOADED ||
                            state == TileState.ERROR ||
                            state == TileState.EMPTY) {
                            unlistenByKey(sourceListenKey_1);
                            leftToLoad_1--;
                            if (leftToLoad_1 === 0) {
                                this.unlistenSources_();
                                this.reproject_();
                            }
                        }
                    }, this);
                    this.sourcesListenerKeys_.push(sourceListenKey_1);
                }
            }.bind(this));
            if (leftToLoad_1 === 0) {
                setTimeout(this.reproject_.bind(this), 0);
            }
            else {
                this.sourceTiles_.forEach(function (tile, i, arr) {
                    var state = tile.getState();
                    if (state == TileState.IDLE) {
                        tile.load();
                    }
                });
            }
        }
    };
    /**
     * @private
     */
    ReprojTile.prototype.unlistenSources_ = function () {
        this.sourcesListenerKeys_.forEach(unlistenByKey);
        this.sourcesListenerKeys_ = null;
    };
    return ReprojTile;
}(Tile));

/**
 * @module ol/source/TileEventType
 */
/**
 * @enum {string}
 */
var TileEventType = {
    /**
     * Triggered when a tile starts loading.
     * @event module:ol/source/Tile.TileSourceEvent#tileloadstart
     * @api
     */
    TILELOADSTART: 'tileloadstart',
    /**
     * Triggered when a tile finishes loading, either when its data is loaded,
     * or when loading was aborted because the tile is no longer needed.
     * @event module:ol/source/Tile.TileSourceEvent#tileloadend
     * @api
     */
    TILELOADEND: 'tileloadend',
    /**
     * Triggered if tile loading results in an error.
     * @event module:ol/source/Tile.TileSourceEvent#tileloaderror
     * @api
     */
    TILELOADERROR: 'tileloaderror',
};
/**
 * @typedef {'tileloadstart'|'tileloadend'|'tileloaderror'} TileSourceEventTypes
 */

/**
 * @module ol/tilegrid/TileGrid
 */
/**
 * @private
 * @type {import("../tilecoord.js").TileCoord}
 */
var tmpTileCoord = [0, 0, 0];
/**
 * @typedef {Object} Options
 * @property {import("../extent.js").Extent} [extent] Extent for the tile grid. No tiles outside this
 * extent will be requested by {@link module:ol/source/Tile} sources. When no `origin` or
 * `origins` are configured, the `origin` will be set to the top-left corner of the extent.
 * @property {number} [minZoom=0] Minimum zoom.
 * @property {import("../coordinate.js").Coordinate} [origin] The tile grid origin, i.e. where the `x`
 * and `y` axes meet (`[z, 0, 0]`). Tile coordinates increase left to right and downwards. If not
 * specified, `extent` or `origins` must be provided.
 * @property {Array<import("../coordinate.js").Coordinate>} [origins] Tile grid origins, i.e. where
 * the `x` and `y` axes meet (`[z, 0, 0]`), for each zoom level. If given, the array length
 * should match the length of the `resolutions` array, i.e. each resolution can have a different
 * origin. Tile coordinates increase left to right and downwards. If not specified, `extent` or
 * `origin` must be provided.
 * @property {!Array<number>} resolutions Resolutions. The array index of each resolution needs
 * to match the zoom level. This means that even if a `minZoom` is configured, the resolutions
 * array will have a length of `maxZoom + 1`.
 * @property {Array<import("../size.js").Size>} [sizes] Number of tile rows and columns
 * of the grid for each zoom level. If specified the values
 * define each zoom level's extent together with the `origin` or `origins`.
 * A grid `extent` can be configured in addition, and will further limit the extent
 * for which tile requests are made by sources. If the bottom-left corner of
 * an extent is used as `origin` or `origins`, then the `y` value must be
 * negative because OpenLayers tile coordinates use the top left as the origin.
 * @property {number|import("../size.js").Size} [tileSize] Tile size.
 * Default is `[256, 256]`.
 * @property {Array<import("../size.js").Size>} [tileSizes] Tile sizes. If given, the array length
 * should match the length of the `resolutions` array, i.e. each resolution can have a different
 * tile size.
 */
/**
 * @classdesc
 * Base class for setting the grid pattern for sources accessing tiled-image
 * servers.
 * @api
 */
var TileGrid = /** @class */ (function () {
    /**
     * @param {Options} options Tile grid options.
     */
    function TileGrid(options) {
        /**
         * @protected
         * @type {number}
         */
        this.minZoom = options.minZoom !== undefined ? options.minZoom : 0;
        /**
         * @private
         * @type {!Array<number>}
         */
        this.resolutions_ = options.resolutions;
        assert(isSorted(this.resolutions_, function (a, b) {
            return b - a;
        }, true), 17); // `resolutions` must be sorted in descending order
        // check if we've got a consistent zoom factor and origin
        var zoomFactor;
        if (!options.origins) {
            for (var i = 0, ii = this.resolutions_.length - 1; i < ii; ++i) {
                if (!zoomFactor) {
                    zoomFactor = this.resolutions_[i] / this.resolutions_[i + 1];
                }
                else {
                    if (this.resolutions_[i] / this.resolutions_[i + 1] !== zoomFactor) {
                        zoomFactor = undefined;
                        break;
                    }
                }
            }
        }
        /**
         * @private
         * @type {number|undefined}
         */
        this.zoomFactor_ = zoomFactor;
        /**
         * @protected
         * @type {number}
         */
        this.maxZoom = this.resolutions_.length - 1;
        /**
         * @private
         * @type {import("../coordinate.js").Coordinate}
         */
        this.origin_ = options.origin !== undefined ? options.origin : null;
        /**
         * @private
         * @type {Array<import("../coordinate.js").Coordinate>}
         */
        this.origins_ = null;
        if (options.origins !== undefined) {
            this.origins_ = options.origins;
            assert(this.origins_.length == this.resolutions_.length, 20); // Number of `origins` and `resolutions` must be equal
        }
        var extent = options.extent;
        if (extent !== undefined && !this.origin_ && !this.origins_) {
            this.origin_ = getTopLeft(extent);
        }
        assert((!this.origin_ && this.origins_) || (this.origin_ && !this.origins_), 18); // Either `origin` or `origins` must be configured, never both
        /**
         * @private
         * @type {Array<number|import("../size.js").Size>}
         */
        this.tileSizes_ = null;
        if (options.tileSizes !== undefined) {
            this.tileSizes_ = options.tileSizes;
            assert(this.tileSizes_.length == this.resolutions_.length, 19); // Number of `tileSizes` and `resolutions` must be equal
        }
        /**
         * @private
         * @type {number|import("../size.js").Size}
         */
        this.tileSize_ =
            options.tileSize !== undefined
                ? options.tileSize
                : !this.tileSizes_
                    ? DEFAULT_TILE_SIZE
                    : null;
        assert((!this.tileSize_ && this.tileSizes_) ||
            (this.tileSize_ && !this.tileSizes_), 22); // Either `tileSize` or `tileSizes` must be configured, never both
        /**
         * @private
         * @type {import("../extent.js").Extent}
         */
        this.extent_ = extent !== undefined ? extent : null;
        /**
         * @private
         * @type {Array<import("../TileRange.js").default>}
         */
        this.fullTileRanges_ = null;
        /**
         * @private
         * @type {import("../size.js").Size}
         */
        this.tmpSize_ = [0, 0];
        /**
         * @private
         * @type {import("../extent.js").Extent}
         */
        this.tmpExtent_ = [0, 0, 0, 0];
        if (options.sizes !== undefined) {
            this.fullTileRanges_ = options.sizes.map(function (size, z) {
                var tileRange = new TileRange(Math.min(0, size[0]), Math.max(size[0] - 1, -1), Math.min(0, size[1]), Math.max(size[1] - 1, -1));
                if (extent) {
                    var restrictedTileRange = this.getTileRangeForExtentAndZ(extent, z);
                    tileRange.minX = Math.max(restrictedTileRange.minX, tileRange.minX);
                    tileRange.maxX = Math.min(restrictedTileRange.maxX, tileRange.maxX);
                    tileRange.minY = Math.max(restrictedTileRange.minY, tileRange.minY);
                    tileRange.maxY = Math.min(restrictedTileRange.maxY, tileRange.maxY);
                }
                return tileRange;
            }, this);
        }
        else if (extent) {
            this.calculateTileRanges_(extent);
        }
    }
    /**
     * Call a function with each tile coordinate for a given extent and zoom level.
     *
     * @param {import("../extent.js").Extent} extent Extent.
     * @param {number} zoom Integer zoom level.
     * @param {function(import("../tilecoord.js").TileCoord): void} callback Function called with each tile coordinate.
     * @api
     */
    TileGrid.prototype.forEachTileCoord = function (extent, zoom, callback) {
        var tileRange = this.getTileRangeForExtentAndZ(extent, zoom);
        for (var i = tileRange.minX, ii = tileRange.maxX; i <= ii; ++i) {
            for (var j = tileRange.minY, jj = tileRange.maxY; j <= jj; ++j) {
                callback([zoom, i, j]);
            }
        }
    };
    /**
     * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @param {function(number, import("../TileRange.js").default): boolean} callback Callback.
     * @param {import("../TileRange.js").default} [opt_tileRange] Temporary import("../TileRange.js").default object.
     * @param {import("../extent.js").Extent} [opt_extent] Temporary import("../extent.js").Extent object.
     * @return {boolean} Callback succeeded.
     */
    TileGrid.prototype.forEachTileCoordParentTileRange = function (tileCoord, callback, opt_tileRange, opt_extent) {
        var tileRange, x, y;
        var tileCoordExtent = null;
        var z = tileCoord[0] - 1;
        if (this.zoomFactor_ === 2) {
            x = tileCoord[1];
            y = tileCoord[2];
        }
        else {
            tileCoordExtent = this.getTileCoordExtent(tileCoord, opt_extent);
        }
        while (z >= this.minZoom) {
            if (this.zoomFactor_ === 2) {
                x = Math.floor(x / 2);
                y = Math.floor(y / 2);
                tileRange = createOrUpdate$1(x, x, y, y, opt_tileRange);
            }
            else {
                tileRange = this.getTileRangeForExtentAndZ(tileCoordExtent, z, opt_tileRange);
            }
            if (callback(z, tileRange)) {
                return true;
            }
            --z;
        }
        return false;
    };
    /**
     * Get the extent for this tile grid, if it was configured.
     * @return {import("../extent.js").Extent} Extent.
     * @api
     */
    TileGrid.prototype.getExtent = function () {
        return this.extent_;
    };
    /**
     * Get the maximum zoom level for the grid.
     * @return {number} Max zoom.
     * @api
     */
    TileGrid.prototype.getMaxZoom = function () {
        return this.maxZoom;
    };
    /**
     * Get the minimum zoom level for the grid.
     * @return {number} Min zoom.
     * @api
     */
    TileGrid.prototype.getMinZoom = function () {
        return this.minZoom;
    };
    /**
     * Get the origin for the grid at the given zoom level.
     * @param {number} z Integer zoom level.
     * @return {import("../coordinate.js").Coordinate} Origin.
     * @api
     */
    TileGrid.prototype.getOrigin = function (z) {
        if (this.origin_) {
            return this.origin_;
        }
        else {
            return this.origins_[z];
        }
    };
    /**
     * Get the resolution for the given zoom level.
     * @param {number} z Integer zoom level.
     * @return {number} Resolution.
     * @api
     */
    TileGrid.prototype.getResolution = function (z) {
        return this.resolutions_[z];
    };
    /**
     * Get the list of resolutions for the tile grid.
     * @return {Array<number>} Resolutions.
     * @api
     */
    TileGrid.prototype.getResolutions = function () {
        return this.resolutions_;
    };
    /**
     * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @param {import("../TileRange.js").default} [opt_tileRange] Temporary import("../TileRange.js").default object.
     * @param {import("../extent.js").Extent} [opt_extent] Temporary import("../extent.js").Extent object.
     * @return {import("../TileRange.js").default} Tile range.
     */
    TileGrid.prototype.getTileCoordChildTileRange = function (tileCoord, opt_tileRange, opt_extent) {
        if (tileCoord[0] < this.maxZoom) {
            if (this.zoomFactor_ === 2) {
                var minX = tileCoord[1] * 2;
                var minY = tileCoord[2] * 2;
                return createOrUpdate$1(minX, minX + 1, minY, minY + 1, opt_tileRange);
            }
            var tileCoordExtent = this.getTileCoordExtent(tileCoord, opt_extent || this.tmpExtent_);
            return this.getTileRangeForExtentAndZ(tileCoordExtent, tileCoord[0] + 1, opt_tileRange);
        }
        return null;
    };
    /**
     * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @param {number} z Integer zoom level.
     * @param {import("../TileRange.js").default} [opt_tileRange] Temporary import("../TileRange.js").default object.
     * @return {import("../TileRange.js").default} Tile range.
     */
    TileGrid.prototype.getTileRangeForTileCoordAndZ = function (tileCoord, z, opt_tileRange) {
        if (z > this.maxZoom || z < this.minZoom) {
            return null;
        }
        var tileCoordZ = tileCoord[0];
        var tileCoordX = tileCoord[1];
        var tileCoordY = tileCoord[2];
        if (z === tileCoordZ) {
            return createOrUpdate$1(tileCoordX, tileCoordY, tileCoordX, tileCoordY, opt_tileRange);
        }
        if (this.zoomFactor_) {
            var factor = Math.pow(this.zoomFactor_, z - tileCoordZ);
            var minX = Math.floor(tileCoordX * factor);
            var minY = Math.floor(tileCoordY * factor);
            if (z < tileCoordZ) {
                return createOrUpdate$1(minX, minX, minY, minY, opt_tileRange);
            }
            var maxX = Math.floor(factor * (tileCoordX + 1)) - 1;
            var maxY = Math.floor(factor * (tileCoordY + 1)) - 1;
            return createOrUpdate$1(minX, maxX, minY, maxY, opt_tileRange);
        }
        var tileCoordExtent = this.getTileCoordExtent(tileCoord, this.tmpExtent_);
        return this.getTileRangeForExtentAndZ(tileCoordExtent, z, opt_tileRange);
    };
    /**
     * Get the extent for a tile range.
     * @param {number} z Integer zoom level.
     * @param {import("../TileRange.js").default} tileRange Tile range.
     * @param {import("../extent.js").Extent} [opt_extent] Temporary import("../extent.js").Extent object.
     * @return {import("../extent.js").Extent} Extent.
     */
    TileGrid.prototype.getTileRangeExtent = function (z, tileRange, opt_extent) {
        var origin = this.getOrigin(z);
        var resolution = this.getResolution(z);
        var tileSize = toSize(this.getTileSize(z), this.tmpSize_);
        var minX = origin[0] + tileRange.minX * tileSize[0] * resolution;
        var maxX = origin[0] + (tileRange.maxX + 1) * tileSize[0] * resolution;
        var minY = origin[1] + tileRange.minY * tileSize[1] * resolution;
        var maxY = origin[1] + (tileRange.maxY + 1) * tileSize[1] * resolution;
        return createOrUpdate$2(minX, minY, maxX, maxY, opt_extent);
    };
    /**
     * Get a tile range for the given extent and integer zoom level.
     * @param {import("../extent.js").Extent} extent Extent.
     * @param {number} z Integer zoom level.
     * @param {import("../TileRange.js").default} [opt_tileRange] Temporary tile range object.
     * @return {import("../TileRange.js").default} Tile range.
     */
    TileGrid.prototype.getTileRangeForExtentAndZ = function (extent, z, opt_tileRange) {
        var tileCoord = tmpTileCoord;
        this.getTileCoordForXYAndZ_(extent[0], extent[3], z, false, tileCoord);
        var minX = tileCoord[1];
        var minY = tileCoord[2];
        this.getTileCoordForXYAndZ_(extent[2], extent[1], z, true, tileCoord);
        return createOrUpdate$1(minX, tileCoord[1], minY, tileCoord[2], opt_tileRange);
    };
    /**
     * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @return {import("../coordinate.js").Coordinate} Tile center.
     */
    TileGrid.prototype.getTileCoordCenter = function (tileCoord) {
        var origin = this.getOrigin(tileCoord[0]);
        var resolution = this.getResolution(tileCoord[0]);
        var tileSize = toSize(this.getTileSize(tileCoord[0]), this.tmpSize_);
        return [
            origin[0] + (tileCoord[1] + 0.5) * tileSize[0] * resolution,
            origin[1] - (tileCoord[2] + 0.5) * tileSize[1] * resolution,
        ];
    };
    /**
     * Get the extent of a tile coordinate.
     *
     * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @param {import("../extent.js").Extent} [opt_extent] Temporary extent object.
     * @return {import("../extent.js").Extent} Extent.
     * @api
     */
    TileGrid.prototype.getTileCoordExtent = function (tileCoord, opt_extent) {
        var origin = this.getOrigin(tileCoord[0]);
        var resolution = this.getResolution(tileCoord[0]);
        var tileSize = toSize(this.getTileSize(tileCoord[0]), this.tmpSize_);
        var minX = origin[0] + tileCoord[1] * tileSize[0] * resolution;
        var minY = origin[1] - (tileCoord[2] + 1) * tileSize[1] * resolution;
        var maxX = minX + tileSize[0] * resolution;
        var maxY = minY + tileSize[1] * resolution;
        return createOrUpdate$2(minX, minY, maxX, maxY, opt_extent);
    };
    /**
     * Get the tile coordinate for the given map coordinate and resolution.  This
     * method considers that coordinates that intersect tile boundaries should be
     * assigned the higher tile coordinate.
     *
     * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
     * @param {number} resolution Resolution.
     * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Destination import("../tilecoord.js").TileCoord object.
     * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
     * @api
     */
    TileGrid.prototype.getTileCoordForCoordAndResolution = function (coordinate, resolution, opt_tileCoord) {
        return this.getTileCoordForXYAndResolution_(coordinate[0], coordinate[1], resolution, false, opt_tileCoord);
    };
    /**
     * Note that this method should not be called for resolutions that correspond
     * to an integer zoom level.  Instead call the `getTileCoordForXYAndZ_` method.
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} resolution Resolution (for a non-integer zoom level).
     * @param {boolean} reverseIntersectionPolicy Instead of letting edge
     *     intersections go to the higher tile coordinate, let edge intersections
     *     go to the lower tile coordinate.
     * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Temporary import("../tilecoord.js").TileCoord object.
     * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
     * @private
     */
    TileGrid.prototype.getTileCoordForXYAndResolution_ = function (x, y, resolution, reverseIntersectionPolicy, opt_tileCoord) {
        var z = this.getZForResolution(resolution);
        var scale = resolution / this.getResolution(z);
        var origin = this.getOrigin(z);
        var tileSize = toSize(this.getTileSize(z), this.tmpSize_);
        var adjustX = reverseIntersectionPolicy ? 0.5 : 0;
        var adjustY = reverseIntersectionPolicy ? 0.5 : 0;
        var xFromOrigin = Math.floor((x - origin[0]) / resolution + adjustX);
        var yFromOrigin = Math.floor((origin[1] - y) / resolution + adjustY);
        var tileCoordX = (scale * xFromOrigin) / tileSize[0];
        var tileCoordY = (scale * yFromOrigin) / tileSize[1];
        if (reverseIntersectionPolicy) {
            tileCoordX = Math.ceil(tileCoordX) - 1;
            tileCoordY = Math.ceil(tileCoordY) - 1;
        }
        else {
            tileCoordX = Math.floor(tileCoordX);
            tileCoordY = Math.floor(tileCoordY);
        }
        return createOrUpdate(z, tileCoordX, tileCoordY, opt_tileCoord);
    };
    /**
     * Although there is repetition between this method and `getTileCoordForXYAndResolution_`,
     * they should have separate implementations.  This method is for integer zoom
     * levels.  The other method should only be called for resolutions corresponding
     * to non-integer zoom levels.
     * @param {number} x Map x coordinate.
     * @param {number} y Map y coordinate.
     * @param {number} z Integer zoom level.
     * @param {boolean} reverseIntersectionPolicy Instead of letting edge
     *     intersections go to the higher tile coordinate, let edge intersections
     *     go to the lower tile coordinate.
     * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Temporary import("../tilecoord.js").TileCoord object.
     * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
     * @private
     */
    TileGrid.prototype.getTileCoordForXYAndZ_ = function (x, y, z, reverseIntersectionPolicy, opt_tileCoord) {
        var origin = this.getOrigin(z);
        var resolution = this.getResolution(z);
        var tileSize = toSize(this.getTileSize(z), this.tmpSize_);
        var adjustX = reverseIntersectionPolicy ? 0.5 : 0;
        var adjustY = reverseIntersectionPolicy ? 0.5 : 0;
        var xFromOrigin = Math.floor((x - origin[0]) / resolution + adjustX);
        var yFromOrigin = Math.floor((origin[1] - y) / resolution + adjustY);
        var tileCoordX = xFromOrigin / tileSize[0];
        var tileCoordY = yFromOrigin / tileSize[1];
        if (reverseIntersectionPolicy) {
            tileCoordX = Math.ceil(tileCoordX) - 1;
            tileCoordY = Math.ceil(tileCoordY) - 1;
        }
        else {
            tileCoordX = Math.floor(tileCoordX);
            tileCoordY = Math.floor(tileCoordY);
        }
        return createOrUpdate(z, tileCoordX, tileCoordY, opt_tileCoord);
    };
    /**
     * Get a tile coordinate given a map coordinate and zoom level.
     * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
     * @param {number} z Zoom level.
     * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Destination import("../tilecoord.js").TileCoord object.
     * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
     * @api
     */
    TileGrid.prototype.getTileCoordForCoordAndZ = function (coordinate, z, opt_tileCoord) {
        return this.getTileCoordForXYAndZ_(coordinate[0], coordinate[1], z, false, opt_tileCoord);
    };
    /**
     * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @return {number} Tile resolution.
     */
    TileGrid.prototype.getTileCoordResolution = function (tileCoord) {
        return this.resolutions_[tileCoord[0]];
    };
    /**
     * Get the tile size for a zoom level. The type of the return value matches the
     * `tileSize` or `tileSizes` that the tile grid was configured with. To always
     * get an `import("../size.js").Size`, run the result through `import("../size.js").Size.toSize()`.
     * @param {number} z Z.
     * @return {number|import("../size.js").Size} Tile size.
     * @api
     */
    TileGrid.prototype.getTileSize = function (z) {
        if (this.tileSize_) {
            return this.tileSize_;
        }
        else {
            return this.tileSizes_[z];
        }
    };
    /**
     * @param {number} z Zoom level.
     * @return {import("../TileRange.js").default} Extent tile range for the specified zoom level.
     */
    TileGrid.prototype.getFullTileRange = function (z) {
        if (!this.fullTileRanges_) {
            return this.extent_
                ? this.getTileRangeForExtentAndZ(this.extent_, z)
                : null;
        }
        else {
            return this.fullTileRanges_[z];
        }
    };
    /**
     * @param {number} resolution Resolution.
     * @param {number|import("../array.js").NearestDirectionFunction} [opt_direction]
     *     If 0, the nearest resolution will be used.
     *     If 1, the nearest higher resolution (lower Z) will be used. If -1, the
     *     nearest lower resolution (higher Z) will be used. Default is 0.
     *     Use a {@link module:ol/array~NearestDirectionFunction} for more precise control.
     *
     * For example to change tile Z at the midpoint of zoom levels
     * ```js
     * function(value, high, low) {
     *   return value - low * Math.sqrt(high / low);
     * }
     * ```
     * @return {number} Z.
     * @api
     */
    TileGrid.prototype.getZForResolution = function (resolution, opt_direction) {
        var z = linearFindNearest(this.resolutions_, resolution, opt_direction || 0);
        return clamp(z, this.minZoom, this.maxZoom);
    };
    /**
     * @param {!import("../extent.js").Extent} extent Extent for this tile grid.
     * @private
     */
    TileGrid.prototype.calculateTileRanges_ = function (extent) {
        var length = this.resolutions_.length;
        var fullTileRanges = new Array(length);
        for (var z = this.minZoom; z < length; ++z) {
            fullTileRanges[z] = this.getTileRangeForExtentAndZ(extent, z);
        }
        this.fullTileRanges_ = fullTileRanges;
    };
    return TileGrid;
}());

/**
 * @module ol/tilegrid
 */
/**
 * @param {import("./proj/Projection.js").default} projection Projection.
 * @return {!TileGrid} Default tile grid for the
 * passed projection.
 */
function getForProjection(projection) {
    var tileGrid = projection.getDefaultTileGrid();
    if (!tileGrid) {
        tileGrid = createForProjection(projection);
        projection.setDefaultTileGrid(tileGrid);
    }
    return tileGrid;
}
/**
 * @param {TileGrid} tileGrid Tile grid.
 * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
 * @param {import("./proj/Projection.js").default} projection Projection.
 * @return {import("./tilecoord.js").TileCoord} Tile coordinate.
 */
function wrapX(tileGrid, tileCoord, projection) {
    var z = tileCoord[0];
    var center = tileGrid.getTileCoordCenter(tileCoord);
    var projectionExtent = extentFromProjection(projection);
    if (!containsCoordinate(projectionExtent, center)) {
        var worldWidth = getWidth(projectionExtent);
        var worldsAway = Math.ceil((projectionExtent[0] - center[0]) / worldWidth);
        center[0] += worldWidth * worldsAway;
        return tileGrid.getTileCoordForCoordAndZ(center, z);
    }
    else {
        return tileCoord;
    }
}
/**
 * @param {import("./extent.js").Extent} extent Extent.
 * @param {number} [opt_maxZoom] Maximum zoom level (default is
 *     DEFAULT_MAX_ZOOM).
 * @param {number|import("./size.js").Size} [opt_tileSize] Tile size (default uses
 *     DEFAULT_TILE_SIZE).
 * @param {import("./extent/Corner.js").default} [opt_corner] Extent corner (default is `'top-left'`).
 * @return {!TileGrid} TileGrid instance.
 */
function createForExtent(extent, opt_maxZoom, opt_tileSize, opt_corner) {
    var corner = opt_corner !== undefined ? opt_corner : Corner.TOP_LEFT;
    var resolutions = resolutionsFromExtent(extent, opt_maxZoom, opt_tileSize);
    return new TileGrid({
        extent: extent,
        origin: getCorner(extent, corner),
        resolutions: resolutions,
        tileSize: opt_tileSize,
    });
}
/**
 * @typedef {Object} XYZOptions
 * @property {import("./extent.js").Extent} [extent] Extent for the tile grid. The origin for an XYZ tile grid is the
 * top-left corner of the extent. If `maxResolution` is not provided the zero level of the grid is defined by the resolution
 * at which one tile fits in the provided extent. If not provided, the extent of the EPSG:3857 projection is used.
 * @property {number} [maxResolution] Resolution at level zero.
 * @property {number} [maxZoom] Maximum zoom. The default is `42`. This determines the number of levels
 * in the grid set. For example, a `maxZoom` of 21 means there are 22 levels in the grid set.
 * @property {number} [minZoom=0] Minimum zoom.
 * @property {number|import("./size.js").Size} [tileSize=[256, 256]] Tile size in pixels.
 */
/**
 * Creates a tile grid with a standard XYZ tiling scheme.
 * @param {XYZOptions} [opt_options] Tile grid options.
 * @return {!TileGrid} Tile grid instance.
 * @api
 */
function createXYZ(opt_options) {
    var xyzOptions = opt_options || {};
    var extent = xyzOptions.extent || get('EPSG:3857').getExtent();
    var gridOptions = {
        extent: extent,
        minZoom: xyzOptions.minZoom,
        tileSize: xyzOptions.tileSize,
        resolutions: resolutionsFromExtent(extent, xyzOptions.maxZoom, xyzOptions.tileSize, xyzOptions.maxResolution),
    };
    return new TileGrid(gridOptions);
}
/**
 * Create a resolutions array from an extent.  A zoom factor of 2 is assumed.
 * @param {import("./extent.js").Extent} extent Extent.
 * @param {number} [opt_maxZoom] Maximum zoom level (default is
 *     DEFAULT_MAX_ZOOM).
 * @param {number|import("./size.js").Size} [opt_tileSize] Tile size (default uses
 *     DEFAULT_TILE_SIZE).
 * @param {number} [opt_maxResolution] Resolution at level zero.
 * @return {!Array<number>} Resolutions array.
 */
function resolutionsFromExtent(extent, opt_maxZoom, opt_tileSize, opt_maxResolution) {
    var maxZoom = opt_maxZoom !== undefined ? opt_maxZoom : DEFAULT_MAX_ZOOM;
    var height = getHeight(extent);
    var width = getWidth(extent);
    var tileSize = toSize(opt_tileSize !== undefined ? opt_tileSize : DEFAULT_TILE_SIZE);
    var maxResolution = opt_maxResolution > 0
        ? opt_maxResolution
        : Math.max(width / tileSize[0], height / tileSize[1]);
    var length = maxZoom + 1;
    var resolutions = new Array(length);
    for (var z = 0; z < length; ++z) {
        resolutions[z] = maxResolution / Math.pow(2, z);
    }
    return resolutions;
}
/**
 * @param {import("./proj.js").ProjectionLike} projection Projection.
 * @param {number} [opt_maxZoom] Maximum zoom level (default is
 *     DEFAULT_MAX_ZOOM).
 * @param {number|import("./size.js").Size} [opt_tileSize] Tile size (default uses
 *     DEFAULT_TILE_SIZE).
 * @param {import("./extent/Corner.js").default} [opt_corner] Extent corner (default is `'top-left'`).
 * @return {!TileGrid} TileGrid instance.
 */
function createForProjection(projection, opt_maxZoom, opt_tileSize, opt_corner) {
    var extent = extentFromProjection(projection);
    return createForExtent(extent, opt_maxZoom, opt_tileSize, opt_corner);
}
/**
 * Generate a tile grid extent from a projection.  If the projection has an
 * extent, it is used.  If not, a global extent is assumed.
 * @param {import("./proj.js").ProjectionLike} projection Projection.
 * @return {import("./extent.js").Extent} Extent.
 */
function extentFromProjection(projection) {
    projection = get(projection);
    var extent = projection.getExtent();
    if (!extent) {
        var half = (180 * METERS_PER_UNIT[Units.DEGREES]) / projection.getMetersPerUnit();
        extent = createOrUpdate$2(-half, -half, half, half);
    }
    return extent;
}

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
/***
 * @template Return
 * @typedef {import("../Observable").OnSignature<import("../Observable").EventTypes, import("../events/Event.js").default, Return> &
 *   import("../Observable").OnSignature<import("../ObjectEventType").Types, import("../Object").ObjectEvent, Return> &
 *   import("../Observable").OnSignature<import("./TileEventType").TileSourceEventTypes, TileSourceEvent, Return> &
 *   import("../Observable").CombinedOnSignature<import("../Observable").EventTypes|import("../ObjectEventType").Types|
 *     import("./TileEventType").TileSourceEventTypes, Return>} TileSourceOnSignature
 */
/**
 * @typedef {Object} Options
 * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
 * @property {boolean} [attributionsCollapsible=true] Attributions are collapsible.
 * @property {number} [cacheSize] CacheSize.
 * @property {boolean} [opaque=false] Whether the layer is opaque.
 * @property {number} [tilePixelRatio] TilePixelRatio.
 * @property {import("../proj.js").ProjectionLike} [projection] Projection.
 * @property {import("./State.js").default} [state] State.
 * @property {import("../tilegrid/TileGrid.js").default} [tileGrid] TileGrid.
 * @property {boolean} [wrapX=true] WrapX.
 * @property {number} [transition] Transition.
 * @property {string} [key] Key.
 * @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0] ZDirection.
 */
/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for sources providing images divided into a tile grid.
 * @abstract
 * @api
 */
var TileSource = /** @class */ (function (_super) {
    __extends$4(TileSource, _super);
    /**
     * @param {Options} options SourceTile source options.
     */
    function TileSource(options) {
        var _this = _super.call(this, {
            attributions: options.attributions,
            attributionsCollapsible: options.attributionsCollapsible,
            projection: options.projection,
            state: options.state,
            wrapX: options.wrapX,
        }) || this;
        /***
         * @type {TileSourceOnSignature<import("../events").EventsKey>}
         */
        _this.on;
        /***
         * @type {TileSourceOnSignature<import("../events").EventsKey>}
         */
        _this.once;
        /***
         * @type {TileSourceOnSignature<void>}
         */
        _this.un;
        /**
         * @private
         * @type {boolean}
         */
        _this.opaque_ = options.opaque !== undefined ? options.opaque : false;
        /**
         * @private
         * @type {number}
         */
        _this.tilePixelRatio_ =
            options.tilePixelRatio !== undefined ? options.tilePixelRatio : 1;
        /**
         * @protected
         * @type {import("../tilegrid/TileGrid.js").default}
         */
        _this.tileGrid = options.tileGrid !== undefined ? options.tileGrid : null;
        var tileSize = [256, 256];
        var tileGrid = options.tileGrid;
        if (tileGrid) {
            toSize(tileGrid.getTileSize(tileGrid.getMinZoom()), tileSize);
        }
        /**
         * @protected
         * @type {import("../TileCache.js").default}
         */
        _this.tileCache = new TileCache(options.cacheSize || 0);
        /**
         * @protected
         * @type {import("../size.js").Size}
         */
        _this.tmpSize = [0, 0];
        /**
         * @private
         * @type {string}
         */
        _this.key_ = options.key || '';
        /**
         * @protected
         * @type {import("../Tile.js").Options}
         */
        _this.tileOptions = { transition: options.transition };
        /**
         * zDirection hint, read by the renderer. Indicates which resolution should be used
         * by a renderer if the views resolution does not match any resolution of the tile source.
         * If 0, the nearest resolution will be used. If 1, the nearest lower resolution
         * will be used. If -1, the nearest higher resolution will be used.
         * @type {number|import("../array.js").NearestDirectionFunction}
         */
        _this.zDirection = options.zDirection ? options.zDirection : 0;
        return _this;
    }
    /**
     * @return {boolean} Can expire cache.
     */
    TileSource.prototype.canExpireCache = function () {
        return this.tileCache.canExpireCache();
    };
    /**
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @param {!Object<string, boolean>} usedTiles Used tiles.
     */
    TileSource.prototype.expireCache = function (projection, usedTiles) {
        var tileCache = this.getTileCacheForProjection(projection);
        if (tileCache) {
            tileCache.expireCache(usedTiles);
        }
    };
    /**
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @param {number} z Zoom level.
     * @param {import("../TileRange.js").default} tileRange Tile range.
     * @param {function(import("../Tile.js").default):(boolean|void)} callback Called with each
     *     loaded tile.  If the callback returns `false`, the tile will not be
     *     considered loaded.
     * @return {boolean} The tile range is fully covered with loaded tiles.
     */
    TileSource.prototype.forEachLoadedTile = function (projection, z, tileRange, callback) {
        var tileCache = this.getTileCacheForProjection(projection);
        if (!tileCache) {
            return false;
        }
        var covered = true;
        var tile, tileCoordKey, loaded;
        for (var x = tileRange.minX; x <= tileRange.maxX; ++x) {
            for (var y = tileRange.minY; y <= tileRange.maxY; ++y) {
                tileCoordKey = getKeyZXY(z, x, y);
                loaded = false;
                if (tileCache.containsKey(tileCoordKey)) {
                    tile = /** @type {!import("../Tile.js").default} */ (tileCache.get(tileCoordKey));
                    loaded = tile.getState() === TileState.LOADED;
                    if (loaded) {
                        loaded = callback(tile) !== false;
                    }
                }
                if (!loaded) {
                    covered = false;
                }
            }
        }
        return covered;
    };
    /**
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @return {number} Gutter.
     */
    TileSource.prototype.getGutterForProjection = function (projection) {
        return 0;
    };
    /**
     * Return the key to be used for all tiles in the source.
     * @return {string} The key for all tiles.
     * @protected
     */
    TileSource.prototype.getKey = function () {
        return this.key_;
    };
    /**
     * Set the value to be used as the key for all tiles in the source.
     * @param {string} key The key for tiles.
     * @protected
     */
    TileSource.prototype.setKey = function (key) {
        if (this.key_ !== key) {
            this.key_ = key;
            this.changed();
        }
    };
    /**
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @return {boolean} Opaque.
     */
    TileSource.prototype.getOpaque = function (projection) {
        return this.opaque_;
    };
    /**
     * @return {Array<number>} Resolutions.
     */
    TileSource.prototype.getResolutions = function () {
        return this.tileGrid.getResolutions();
    };
    /**
     * @abstract
     * @param {number} z Tile coordinate z.
     * @param {number} x Tile coordinate x.
     * @param {number} y Tile coordinate y.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @return {!import("../Tile.js").default} Tile.
     */
    TileSource.prototype.getTile = function (z, x, y, pixelRatio, projection) {
        return abstract();
    };
    /**
     * Return the tile grid of the tile source.
     * @return {import("../tilegrid/TileGrid.js").default} Tile grid.
     * @api
     */
    TileSource.prototype.getTileGrid = function () {
        return this.tileGrid;
    };
    /**
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @return {!import("../tilegrid/TileGrid.js").default} Tile grid.
     */
    TileSource.prototype.getTileGridForProjection = function (projection) {
        if (!this.tileGrid) {
            return getForProjection(projection);
        }
        else {
            return this.tileGrid;
        }
    };
    /**
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @return {import("../TileCache.js").default} Tile cache.
     * @protected
     */
    TileSource.prototype.getTileCacheForProjection = function (projection) {
        assert(equivalent(this.getProjection(), projection), 68 // A VectorTile source can only be rendered if it has a projection compatible with the view projection.
        );
        return this.tileCache;
    };
    /**
     * Get the tile pixel ratio for this source. Subclasses may override this
     * method, which is meant to return a supported pixel ratio that matches the
     * provided `pixelRatio` as close as possible.
     * @param {number} pixelRatio Pixel ratio.
     * @return {number} Tile pixel ratio.
     */
    TileSource.prototype.getTilePixelRatio = function (pixelRatio) {
        return this.tilePixelRatio_;
    };
    /**
     * @param {number} z Z.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @return {import("../size.js").Size} Tile size.
     */
    TileSource.prototype.getTilePixelSize = function (z, pixelRatio, projection) {
        var tileGrid = this.getTileGridForProjection(projection);
        var tilePixelRatio = this.getTilePixelRatio(pixelRatio);
        var tileSize = toSize(tileGrid.getTileSize(z), this.tmpSize);
        if (tilePixelRatio == 1) {
            return tileSize;
        }
        else {
            return scale(tileSize, tilePixelRatio, this.tmpSize);
        }
    };
    /**
     * Returns a tile coordinate wrapped around the x-axis. When the tile coordinate
     * is outside the resolution and extent range of the tile grid, `null` will be
     * returned.
     * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @param {import("../proj/Projection.js").default} [opt_projection] Projection.
     * @return {import("../tilecoord.js").TileCoord} Tile coordinate to be passed to the tileUrlFunction or
     *     null if no tile URL should be created for the passed `tileCoord`.
     */
    TileSource.prototype.getTileCoordForTileUrlFunction = function (tileCoord, opt_projection) {
        var projection = opt_projection !== undefined ? opt_projection : this.getProjection();
        var tileGrid = this.getTileGridForProjection(projection);
        if (this.getWrapX() && projection.isGlobal()) {
            tileCoord = wrapX(tileGrid, tileCoord, projection);
        }
        return withinExtentAndZ(tileCoord, tileGrid) ? tileCoord : null;
    };
    /**
     * Remove all cached tiles from the source. The next render cycle will fetch new tiles.
     * @api
     */
    TileSource.prototype.clear = function () {
        this.tileCache.clear();
    };
    TileSource.prototype.refresh = function () {
        this.clear();
        _super.prototype.refresh.call(this);
    };
    /**
     * Increases the cache size if needed
     * @param {number} tileCount Minimum number of tiles needed.
     * @param {import("../proj/Projection.js").default} projection Projection.
     */
    TileSource.prototype.updateCacheSize = function (tileCount, projection) {
        var tileCache = this.getTileCacheForProjection(projection);
        if (tileCount > tileCache.highWaterMark) {
            tileCache.highWaterMark = tileCount;
        }
    };
    /**
     * Marks a tile coord as being used, without triggering a load.
     * @abstract
     * @param {number} z Tile coordinate z.
     * @param {number} x Tile coordinate x.
     * @param {number} y Tile coordinate y.
     * @param {import("../proj/Projection.js").default} projection Projection.
     */
    TileSource.prototype.useTile = function (z, x, y, projection) { };
    return TileSource;
}(Source));
/**
 * @classdesc
 * Events emitted by {@link module:ol/source/Tile~TileSource} instances are instances of this
 * type.
 */
var TileSourceEvent = /** @class */ (function (_super) {
    __extends$4(TileSourceEvent, _super);
    /**
     * @param {string} type Type.
     * @param {import("../Tile.js").default} tile The tile.
     */
    function TileSourceEvent(type, tile) {
        var _this = _super.call(this, type) || this;
        /**
         * The tile related to the event.
         * @type {import("../Tile.js").default}
         * @api
         */
        _this.tile = tile;
        return _this;
    }
    return TileSourceEvent;
}(BaseEvent));

/**
 * @module ol/tileurlfunction
 */
/**
 * @param {string} template Template.
 * @param {import("./tilegrid/TileGrid.js").default} tileGrid Tile grid.
 * @return {import("./Tile.js").UrlFunction} Tile URL function.
 */
function createFromTemplate(template, tileGrid) {
    var zRegEx = /\{z\}/g;
    var xRegEx = /\{x\}/g;
    var yRegEx = /\{y\}/g;
    var dashYRegEx = /\{-y\}/g;
    return (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    function (tileCoord, pixelRatio, projection) {
        if (!tileCoord) {
            return undefined;
        }
        else {
            return template
                .replace(zRegEx, tileCoord[0].toString())
                .replace(xRegEx, tileCoord[1].toString())
                .replace(yRegEx, tileCoord[2].toString())
                .replace(dashYRegEx, function () {
                var z = tileCoord[0];
                var range = tileGrid.getFullTileRange(z);
                assert(range, 55); // The {-y} placeholder requires a tile grid with extent
                var y = range.getHeight() - tileCoord[2] - 1;
                return y.toString();
            });
        }
    });
}
/**
 * @param {Array<string>} templates Templates.
 * @param {import("./tilegrid/TileGrid.js").default} tileGrid Tile grid.
 * @return {import("./Tile.js").UrlFunction} Tile URL function.
 */
function createFromTemplates(templates, tileGrid) {
    var len = templates.length;
    var tileUrlFunctions = new Array(len);
    for (var i = 0; i < len; ++i) {
        tileUrlFunctions[i] = createFromTemplate(templates[i], tileGrid);
    }
    return createFromTileUrlFunctions(tileUrlFunctions);
}
/**
 * @param {Array<import("./Tile.js").UrlFunction>} tileUrlFunctions Tile URL Functions.
 * @return {import("./Tile.js").UrlFunction} Tile URL function.
 */
function createFromTileUrlFunctions(tileUrlFunctions) {
    if (tileUrlFunctions.length === 1) {
        return tileUrlFunctions[0];
    }
    return (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    function (tileCoord, pixelRatio, projection) {
        if (!tileCoord) {
            return undefined;
        }
        else {
            var h = hash(tileCoord);
            var index = modulo(h, tileUrlFunctions.length);
            return tileUrlFunctions[index](tileCoord, pixelRatio, projection);
        }
    });
}
/**
 * @param {string} url URL.
 * @return {Array<string>} Array of urls.
 */
function expandUrl(url) {
    var urls = [];
    var match = /\{([a-z])-([a-z])\}/.exec(url);
    if (match) {
        // char range
        var startCharCode = match[1].charCodeAt(0);
        var stopCharCode = match[2].charCodeAt(0);
        var charCode = void 0;
        for (charCode = startCharCode; charCode <= stopCharCode; ++charCode) {
            urls.push(url.replace(match[0], String.fromCharCode(charCode)));
        }
        return urls;
    }
    match = /\{(\d+)-(\d+)\}/.exec(url);
    if (match) {
        // number range
        var stop_1 = parseInt(match[2], 10);
        for (var i = parseInt(match[1], 10); i <= stop_1; i++) {
            urls.push(url.replace(match[0], i.toString()));
        }
        return urls;
    }
    urls.push(url);
    return urls;
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
 * @typedef {Object} Options
 * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
 * @property {boolean} [attributionsCollapsible=true] Attributions are collapsible.
 * @property {number} [cacheSize] Cache size.
 * @property {boolean} [opaque=false] Whether the layer is opaque.
 * @property {import("../proj.js").ProjectionLike} [projection] Projection.
 * @property {import("./State.js").default} [state] State.
 * @property {import("../tilegrid/TileGrid.js").default} [tileGrid] TileGrid.
 * @property {import("../Tile.js").LoadFunction} tileLoadFunction TileLoadFunction.
 * @property {number} [tilePixelRatio] TilePixelRatio.
 * @property {import("../Tile.js").UrlFunction} [tileUrlFunction] TileUrlFunction.
 * @property {string} [url] Url.
 * @property {Array<string>} [urls] Urls.
 * @property {boolean} [wrapX=true] WrapX.
 * @property {number} [transition] Transition.
 * @property {string} [key] Key.
 * @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0] ZDirection.
 */
/**
 * @classdesc
 * Base class for sources providing tiles divided into a tile grid over http.
 *
 * @fires import("./Tile.js").TileSourceEvent
 */
var UrlTile = /** @class */ (function (_super) {
    __extends$5(UrlTile, _super);
    /**
     * @param {Options} options Image tile options.
     */
    function UrlTile(options) {
        var _this = _super.call(this, {
            attributions: options.attributions,
            cacheSize: options.cacheSize,
            opaque: options.opaque,
            projection: options.projection,
            state: options.state,
            tileGrid: options.tileGrid,
            tilePixelRatio: options.tilePixelRatio,
            wrapX: options.wrapX,
            transition: options.transition,
            key: options.key,
            attributionsCollapsible: options.attributionsCollapsible,
            zDirection: options.zDirection,
        }) || this;
        /**
         * @private
         * @type {boolean}
         */
        _this.generateTileUrlFunction_ =
            _this.tileUrlFunction === UrlTile.prototype.tileUrlFunction;
        /**
         * @protected
         * @type {import("../Tile.js").LoadFunction}
         */
        _this.tileLoadFunction = options.tileLoadFunction;
        if (options.tileUrlFunction) {
            _this.tileUrlFunction = options.tileUrlFunction;
        }
        /**
         * @protected
         * @type {!Array<string>|null}
         */
        _this.urls = null;
        if (options.urls) {
            _this.setUrls(options.urls);
        }
        else if (options.url) {
            _this.setUrl(options.url);
        }
        /**
         * @private
         * @type {!Object<string, boolean>}
         */
        _this.tileLoadingKeys_ = {};
        return _this;
    }
    /**
     * Return the tile load function of the source.
     * @return {import("../Tile.js").LoadFunction} TileLoadFunction
     * @api
     */
    UrlTile.prototype.getTileLoadFunction = function () {
        return this.tileLoadFunction;
    };
    /**
     * Return the tile URL function of the source.
     * @return {import("../Tile.js").UrlFunction} TileUrlFunction
     * @api
     */
    UrlTile.prototype.getTileUrlFunction = function () {
        return Object.getPrototypeOf(this).tileUrlFunction === this.tileUrlFunction
            ? this.tileUrlFunction.bind(this)
            : this.tileUrlFunction;
    };
    /**
     * Return the URLs used for this source.
     * When a tileUrlFunction is used instead of url or urls,
     * null will be returned.
     * @return {!Array<string>|null} URLs.
     * @api
     */
    UrlTile.prototype.getUrls = function () {
        return this.urls;
    };
    /**
     * Handle tile change events.
     * @param {import("../events/Event.js").default} event Event.
     * @protected
     */
    UrlTile.prototype.handleTileChange = function (event) {
        var tile = /** @type {import("../Tile.js").default} */ (event.target);
        var uid = getUid(tile);
        var tileState = tile.getState();
        var type;
        if (tileState == TileState.LOADING) {
            this.tileLoadingKeys_[uid] = true;
            type = TileEventType.TILELOADSTART;
        }
        else if (uid in this.tileLoadingKeys_) {
            delete this.tileLoadingKeys_[uid];
            type =
                tileState == TileState.ERROR
                    ? TileEventType.TILELOADERROR
                    : tileState == TileState.LOADED
                        ? TileEventType.TILELOADEND
                        : undefined;
        }
        if (type != undefined) {
            this.dispatchEvent(new TileSourceEvent(type, tile));
        }
    };
    /**
     * Set the tile load function of the source.
     * @param {import("../Tile.js").LoadFunction} tileLoadFunction Tile load function.
     * @api
     */
    UrlTile.prototype.setTileLoadFunction = function (tileLoadFunction) {
        this.tileCache.clear();
        this.tileLoadFunction = tileLoadFunction;
        this.changed();
    };
    /**
     * Set the tile URL function of the source.
     * @param {import("../Tile.js").UrlFunction} tileUrlFunction Tile URL function.
     * @param {string} [key] Optional new tile key for the source.
     * @api
     */
    UrlTile.prototype.setTileUrlFunction = function (tileUrlFunction, key) {
        this.tileUrlFunction = tileUrlFunction;
        this.tileCache.pruneExceptNewestZ();
        if (typeof key !== 'undefined') {
            this.setKey(key);
        }
        else {
            this.changed();
        }
    };
    /**
     * Set the URL to use for requests.
     * @param {string} url URL.
     * @api
     */
    UrlTile.prototype.setUrl = function (url) {
        var urls = expandUrl(url);
        this.urls = urls;
        this.setUrls(urls);
    };
    /**
     * Set the URLs to use for requests.
     * @param {Array<string>} urls URLs.
     * @api
     */
    UrlTile.prototype.setUrls = function (urls) {
        this.urls = urls;
        var key = urls.join('\n');
        if (this.generateTileUrlFunction_) {
            this.setTileUrlFunction(createFromTemplates(urls, this.tileGrid), key);
        }
        else {
            this.setKey(key);
        }
    };
    /**
     * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    UrlTile.prototype.tileUrlFunction = function (tileCoord, pixelRatio, projection) {
        return undefined;
    };
    /**
     * Marks a tile coord as being used, without triggering a load.
     * @param {number} z Tile coordinate z.
     * @param {number} x Tile coordinate x.
     * @param {number} y Tile coordinate y.
     */
    UrlTile.prototype.useTile = function (z, x, y) {
        var tileCoordKey = getKeyZXY(z, x, y);
        if (this.tileCache.containsKey(tileCoordKey)) {
            this.tileCache.get(tileCoordKey);
        }
    };
    return UrlTile;
}(TileSource));

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
 * @typedef {Object} Options
 * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
 * @property {boolean} [attributionsCollapsible=true] Attributions are collapsible.
 * @property {number} [cacheSize] Initial tile cache size. Will auto-grow to hold at least the number of tiles in the viewport.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {boolean} [imageSmoothing=true] Enable image smoothing.
 * @property {boolean} [opaque=false] Whether the layer is opaque.
 * @property {import("../proj.js").ProjectionLike} [projection] Projection. Default is the view projection.
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {import("./State.js").default} [state] Source state.
 * @property {typeof import("../ImageTile.js").default} [tileClass] Class used to instantiate image tiles.
 * Default is {@link module:ol/ImageTile~ImageTile}.
 * @property {import("../tilegrid/TileGrid.js").default} [tileGrid] Tile grid.
 * @property {import("../Tile.js").LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
 * ```js
 * function(imageTile, src) {
 *   imageTile.getImage().src = src;
 * };
 * ```
 * @property {number} [tilePixelRatio=1] The pixel ratio used by the tile service. For example, if the tile
 * service advertizes 256px by 256px tiles but actually sends 512px
 * by 512px images (for retina/hidpi devices) then `tilePixelRatio`
 * should be set to `2`.
 * @property {import("../Tile.js").UrlFunction} [tileUrlFunction] Optional function to get tile URL given a tile coordinate and the projection.
 * @property {string} [url] URL template. Must include `{x}`, `{y}` or `{-y}`, and `{z}` placeholders.
 * A `{?-?}` template pattern, for example `subdomain{a-f}.domain.com`, may be
 * used instead of defining each one separately in the `urls` option.
 * @property {Array<string>} [urls] An array of URL templates.
 * @property {boolean} [wrapX] Whether to wrap the world horizontally. The default, is to
 * request out-of-bounds tiles from the server. When set to `false`, only one
 * world will be rendered. When set to `true`, tiles will be requested for one
 * world only, but they will be wrapped horizontally to render multiple worlds.
 * @property {number} [transition] Duration of the opacity transition for rendering.
 * To disable the opacity transition, pass `transition: 0`.
 * @property {string} [key] Optional tile key for proper cache fetching
 * @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
 * Choose whether to use tiles with a higher or lower zoom level when between integer
 * zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
 */
/**
 * @classdesc
 * Base class for sources providing images divided into a tile grid.
 *
 * @fires import("./Tile.js").TileSourceEvent
 * @api
 */
var TileImage = /** @class */ (function (_super) {
    __extends$6(TileImage, _super);
    /**
     * @param {!Options} options Image tile options.
     */
    function TileImage(options) {
        var _this = _super.call(this, {
            attributions: options.attributions,
            cacheSize: options.cacheSize,
            opaque: options.opaque,
            projection: options.projection,
            state: options.state,
            tileGrid: options.tileGrid,
            tileLoadFunction: options.tileLoadFunction
                ? options.tileLoadFunction
                : defaultTileLoadFunction,
            tilePixelRatio: options.tilePixelRatio,
            tileUrlFunction: options.tileUrlFunction,
            url: options.url,
            urls: options.urls,
            wrapX: options.wrapX,
            transition: options.transition,
            key: options.key,
            attributionsCollapsible: options.attributionsCollapsible,
            zDirection: options.zDirection,
        }) || this;
        /**
         * @protected
         * @type {?string}
         */
        _this.crossOrigin =
            options.crossOrigin !== undefined ? options.crossOrigin : null;
        /**
         * @protected
         * @type {typeof ImageTile}
         */
        _this.tileClass =
            options.tileClass !== undefined ? options.tileClass : ImageTile;
        /**
         * @protected
         * @type {!Object<string, TileCache>}
         */
        _this.tileCacheForProjection = {};
        /**
         * @protected
         * @type {!Object<string, import("../tilegrid/TileGrid.js").default>}
         */
        _this.tileGridForProjection = {};
        /**
         * @private
         * @type {number|undefined}
         */
        _this.reprojectionErrorThreshold_ = options.reprojectionErrorThreshold;
        /**
         * @private
         * @type {object|undefined}
         */
        _this.contextOptions_ =
            options.imageSmoothing === false ? IMAGE_SMOOTHING_DISABLED : undefined;
        /**
         * @private
         * @type {boolean}
         */
        _this.renderReprojectionEdges_ = false;
        return _this;
    }
    /**
     * @return {boolean} Can expire cache.
     */
    TileImage.prototype.canExpireCache = function () {
        if (this.tileCache.canExpireCache()) {
            return true;
        }
        else {
            for (var key in this.tileCacheForProjection) {
                if (this.tileCacheForProjection[key].canExpireCache()) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @param {!Object<string, boolean>} usedTiles Used tiles.
     */
    TileImage.prototype.expireCache = function (projection, usedTiles) {
        var usedTileCache = this.getTileCacheForProjection(projection);
        this.tileCache.expireCache(this.tileCache == usedTileCache ? usedTiles : {});
        for (var id in this.tileCacheForProjection) {
            var tileCache = this.tileCacheForProjection[id];
            tileCache.expireCache(tileCache == usedTileCache ? usedTiles : {});
        }
    };
    /**
     * @return {Object|undefined} Context options.
     */
    TileImage.prototype.getContextOptions = function () {
        return this.contextOptions_;
    };
    /**
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @return {number} Gutter.
     */
    TileImage.prototype.getGutterForProjection = function (projection) {
        if (
            this.getProjection() &&
            projection &&
            !equivalent(this.getProjection(), projection)) {
            return 0;
        }
        else {
            return this.getGutter();
        }
    };
    /**
     * @return {number} Gutter.
     */
    TileImage.prototype.getGutter = function () {
        return 0;
    };
    /**
     * Return the key to be used for all tiles in the source.
     * @return {string} The key for all tiles.
     * @protected
     */
    TileImage.prototype.getKey = function () {
        return (_super.prototype.getKey.call(this) +
            (this.contextOptions_ ? '\n' + JSON.stringify(this.contextOptions_) : ''));
    };
    /**
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @return {boolean} Opaque.
     */
    TileImage.prototype.getOpaque = function (projection) {
        if (
            this.getProjection() &&
            projection &&
            !equivalent(this.getProjection(), projection)) {
            return false;
        }
        else {
            return _super.prototype.getOpaque.call(this, projection);
        }
    };
    /**
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @return {!import("../tilegrid/TileGrid.js").default} Tile grid.
     */
    TileImage.prototype.getTileGridForProjection = function (projection) {
        var thisProj = this.getProjection();
        if (this.tileGrid && (!thisProj || equivalent(thisProj, projection))) {
            return this.tileGrid;
        }
        else {
            var projKey = getUid(projection);
            if (!(projKey in this.tileGridForProjection)) {
                this.tileGridForProjection[projKey] =
                    getForProjection(projection);
            }
            return this.tileGridForProjection[projKey];
        }
    };
    /**
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @return {import("../TileCache.js").default} Tile cache.
     */
    TileImage.prototype.getTileCacheForProjection = function (projection) {
        var thisProj = this.getProjection();
        if (!thisProj || equivalent(thisProj, projection)) {
            return this.tileCache;
        }
        else {
            var projKey = getUid(projection);
            if (!(projKey in this.tileCacheForProjection)) {
                this.tileCacheForProjection[projKey] = new TileCache(this.tileCache.highWaterMark);
            }
            return this.tileCacheForProjection[projKey];
        }
    };
    /**
     * @param {number} z Tile coordinate z.
     * @param {number} x Tile coordinate x.
     * @param {number} y Tile coordinate y.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @param {string} key The key set on the tile.
     * @return {!import("../Tile.js").default} Tile.
     * @private
     */
    TileImage.prototype.createTile_ = function (z, x, y, pixelRatio, projection, key) {
        var tileCoord = [z, x, y];
        var urlTileCoord = this.getTileCoordForTileUrlFunction(tileCoord, projection);
        var tileUrl = urlTileCoord
            ? this.tileUrlFunction(urlTileCoord, pixelRatio, projection)
            : undefined;
        var tile = new this.tileClass(tileCoord, tileUrl !== undefined ? TileState.IDLE : TileState.EMPTY, tileUrl !== undefined ? tileUrl : '', this.crossOrigin, this.tileLoadFunction, this.tileOptions);
        tile.key = key;
        tile.addEventListener(EventType.CHANGE, this.handleTileChange.bind(this));
        return tile;
    };
    /**
     * @param {number} z Tile coordinate z.
     * @param {number} x Tile coordinate x.
     * @param {number} y Tile coordinate y.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @return {!import("../Tile.js").default} Tile.
     */
    TileImage.prototype.getTile = function (z, x, y, pixelRatio, projection) {
        var sourceProjection = this.getProjection();
        if (
            !sourceProjection ||
            !projection ||
            equivalent(sourceProjection, projection)) {
            return this.getTileInternal(z, x, y, pixelRatio, sourceProjection || projection);
        }
        else {
            var cache = this.getTileCacheForProjection(projection);
            var tileCoord = [z, x, y];
            var tile = void 0;
            var tileCoordKey = getKey(tileCoord);
            if (cache.containsKey(tileCoordKey)) {
                tile = cache.get(tileCoordKey);
            }
            var key = this.getKey();
            if (tile && tile.key == key) {
                return tile;
            }
            else {
                var sourceTileGrid = this.getTileGridForProjection(sourceProjection);
                var targetTileGrid = this.getTileGridForProjection(projection);
                var wrappedTileCoord = this.getTileCoordForTileUrlFunction(tileCoord, projection);
                var newTile = new ReprojTile(sourceProjection, sourceTileGrid, projection, targetTileGrid, tileCoord, wrappedTileCoord, this.getTilePixelRatio(pixelRatio), this.getGutter(), function (z, x, y, pixelRatio) {
                    return this.getTileInternal(z, x, y, pixelRatio, sourceProjection);
                }.bind(this), this.reprojectionErrorThreshold_, this.renderReprojectionEdges_, this.contextOptions_);
                newTile.key = key;
                if (tile) {
                    newTile.interimTile = tile;
                    newTile.refreshInterimChain();
                    cache.replace(tileCoordKey, newTile);
                }
                else {
                    cache.set(tileCoordKey, newTile);
                }
                return newTile;
            }
        }
    };
    /**
     * @param {number} z Tile coordinate z.
     * @param {number} x Tile coordinate x.
     * @param {number} y Tile coordinate y.
     * @param {number} pixelRatio Pixel ratio.
     * @param {!import("../proj/Projection.js").default} projection Projection.
     * @return {!import("../Tile.js").default} Tile.
     * @protected
     */
    TileImage.prototype.getTileInternal = function (z, x, y, pixelRatio, projection) {
        var tile = null;
        var tileCoordKey = getKeyZXY(z, x, y);
        var key = this.getKey();
        if (!this.tileCache.containsKey(tileCoordKey)) {
            tile = this.createTile_(z, x, y, pixelRatio, projection, key);
            this.tileCache.set(tileCoordKey, tile);
        }
        else {
            tile = this.tileCache.get(tileCoordKey);
            if (tile.key != key) {
                // The source's params changed. If the tile has an interim tile and if we
                // can use it then we use it. Otherwise we create a new tile.  In both
                // cases we attempt to assign an interim tile to the new tile.
                var interimTile = tile;
                tile = this.createTile_(z, x, y, pixelRatio, projection, key);
                //make the new tile the head of the list,
                if (interimTile.getState() == TileState.IDLE) {
                    //the old tile hasn't begun loading yet, and is now outdated, so we can simply discard it
                    tile.interimTile = interimTile.interimTile;
                }
                else {
                    tile.interimTile = interimTile;
                }
                tile.refreshInterimChain();
                this.tileCache.replace(tileCoordKey, tile);
            }
        }
        return tile;
    };
    /**
     * Sets whether to render reprojection edges or not (usually for debugging).
     * @param {boolean} render Render the edges.
     * @api
     */
    TileImage.prototype.setRenderReprojectionEdges = function (render) {
        if (
            this.renderReprojectionEdges_ == render) {
            return;
        }
        this.renderReprojectionEdges_ = render;
        for (var id in this.tileCacheForProjection) {
            this.tileCacheForProjection[id].clear();
        }
        this.changed();
    };
    /**
     * Sets the tile grid to use when reprojecting the tiles to the given
     * projection instead of the default tile grid for the projection.
     *
     * This can be useful when the default tile grid cannot be created
     * (e.g. projection has no extent defined) or
     * for optimization reasons (custom tile size, resolutions, ...).
     *
     * @param {import("../proj.js").ProjectionLike} projection Projection.
     * @param {import("../tilegrid/TileGrid.js").default} tilegrid Tile grid to use for the projection.
     * @api
     */
    TileImage.prototype.setTileGridForProjection = function (projection, tilegrid) {
        {
            var proj = get(projection);
            if (proj) {
                var projKey = getUid(proj);
                if (!(projKey in this.tileGridForProjection)) {
                    this.tileGridForProjection[projKey] = tilegrid;
                }
            }
        }
    };
    return TileImage;
}(UrlTile));
/**
 * @param {ImageTile} imageTile Image tile.
 * @param {string} src Source.
 */
function defaultTileLoadFunction(imageTile, src) {
    /** @type {HTMLImageElement|HTMLVideoElement} */ (imageTile.getImage()).src =
        src;
}

/**
 * @module ol/source/XYZ
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
 * @typedef {Object} Options
 * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
 * @property {boolean} [attributionsCollapsible=true] Attributions are collapsible.
 * @property {number} [cacheSize] Initial tile cache size. Will auto-grow to hold at least the number of tiles in the viewport.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {boolean} [imageSmoothing=true] Enable image smoothing.
 * @property {boolean} [opaque=false] Whether the layer is opaque.
 * @property {import("../proj.js").ProjectionLike} [projection='EPSG:3857'] Projection.
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {number} [maxZoom=42] Optional max zoom level. Not used if `tileGrid` is provided.
 * @property {number} [minZoom=0] Optional min zoom level. Not used if `tileGrid` is provided.
 * @property {number} [maxResolution] Optional tile grid resolution at level zero. Not used if `tileGrid` is provided.
 * @property {import("../tilegrid/TileGrid.js").default} [tileGrid] Tile grid.
 * @property {import("../Tile.js").LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
 * ```js
 * function(imageTile, src) {
 *   imageTile.getImage().src = src;
 * };
 * ```
 * @property {number} [tilePixelRatio=1] The pixel ratio used by the tile service.
 * For example, if the tile service advertizes 256px by 256px tiles but actually sends 512px
 * by 512px images (for retina/hidpi devices) then `tilePixelRatio`
 * should be set to `2`.
 * @property {number|import("../size.js").Size} [tileSize=[256, 256]] The tile size used by the tile service.
 * Not used if `tileGrid` is provided.
 * @property {import("../Tile.js").UrlFunction} [tileUrlFunction] Optional function to get
 * tile URL given a tile coordinate and the projection.
 * Required if `url` or `urls` are not provided.
 * @property {string} [url] URL template. Must include `{x}`, `{y}` or `{-y}`,
 * and `{z}` placeholders. A `{?-?}` template pattern, for example `subdomain{a-f}.domain.com`,
 * may be used instead of defining each one separately in the `urls` option.
 * @property {Array<string>} [urls] An array of URL templates.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 * @property {number} [transition=250] Duration of the opacity transition for rendering.
 * To disable the opacity transition, pass `transition: 0`.
 * @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
 * Choose whether to use tiles with a higher or lower zoom level when between integer
 * zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
 */
/**
 * @classdesc
 * Layer source for tile data with URLs in a set XYZ format that are
 * defined in a URL template. By default, this follows the widely-used
 * Google grid where `x` 0 and `y` 0 are in the top left. Grids like
 * TMS where `x` 0 and `y` 0 are in the bottom left can be used by
 * using the `{-y}` placeholder in the URL template, so long as the
 * source does not have a custom tile grid. In this case
 * a `tileUrlFunction` can be used, such as:
 * ```js
 *  tileUrlFunction: function(coordinate) {
 *    return 'http://mapserver.com/' + coordinate[0] + '/' +
 *      coordinate[1] + '/' + (-coordinate[2] - 1) + '.png';
 *  }
 * ```
 * @api
 */
var XYZ = /** @class */ (function (_super) {
    __extends$7(XYZ, _super);
    /**
     * @param {Options} [opt_options] XYZ options.
     */
    function XYZ(opt_options) {
        var _this = this;
        var options = opt_options || {};
        var projection = options.projection !== undefined ? options.projection : 'EPSG:3857';
        var tileGrid = options.tileGrid !== undefined
            ? options.tileGrid
            : createXYZ({
                extent: extentFromProjection(projection),
                maxResolution: options.maxResolution,
                maxZoom: options.maxZoom,
                minZoom: options.minZoom,
                tileSize: options.tileSize,
            });
        _this = _super.call(this, {
            attributions: options.attributions,
            cacheSize: options.cacheSize,
            crossOrigin: options.crossOrigin,
            imageSmoothing: options.imageSmoothing,
            opaque: options.opaque,
            projection: projection,
            reprojectionErrorThreshold: options.reprojectionErrorThreshold,
            tileGrid: tileGrid,
            tileLoadFunction: options.tileLoadFunction,
            tilePixelRatio: options.tilePixelRatio,
            tileUrlFunction: options.tileUrlFunction,
            url: options.url,
            urls: options.urls,
            wrapX: options.wrapX !== undefined ? options.wrapX : true,
            transition: options.transition,
            attributionsCollapsible: options.attributionsCollapsible,
            zDirection: options.zDirection,
        }) || this;
        return _this;
    }
    return XYZ;
}(TileImage));

/**
 * @module ol/uri
 */
/**
 * Appends query parameters to a URI.
 *
 * @param {string} uri The original URI, which may already have query data.
 * @param {!Object} params An object where keys are URI-encoded parameter keys,
 *     and the values are arbitrary types or arrays.
 * @return {string} The new URI.
 */
function appendParams(uri, params) {
    var keyParams = [];
    // Skip any null or undefined parameter values
    Object.keys(params).forEach(function (k) {
        if (params[k] !== null && params[k] !== undefined) {
            keyParams.push(k + '=' + encodeURIComponent(params[k]));
        }
    });
    var qs = keyParams.join('&');
    // remove any trailing ? or &
    uri = uri.replace(/[?&]$/, '');
    // append ? or & depending on whether uri has existing parameters
    uri = uri.indexOf('?') === -1 ? uri + '?' : uri + '&';
    return uri + qs;
}

/**
 * @module ol/source/TileArcGISRest
 */
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
 * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
 * @property {number} [cacheSize] Initial tile cache size. Will auto-grow to hold at least the number of tiles in the viewport.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {boolean} [imageSmoothing=true] Enable image smoothing.
 * @property {Object<string,*>} [params] ArcGIS Rest parameters. This field is optional. Service defaults will be
 * used for any fields not specified. `FORMAT` is `PNG32` by default. `F` is `IMAGE` by
 * default. `TRANSPARENT` is `true` by default.  `BBOX`, `SIZE`, `BBOXSR`,
 * and `IMAGESR` will be set dynamically. Set `LAYERS` to
 * override the default service layer visibility. See
 * https://developers.arcgis.com/rest/services-reference/export-map.htm
 * for further reference.
 * @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting
 * the image from the remote server.
 * @property {import("../tilegrid/TileGrid.js").default} [tileGrid] Tile grid. Base this on the resolutions,
 * tilesize and extent supported by the server.
 * If this is not defined, a default grid will be used: if there is a projection
 * extent, the grid will be based on that; if not, a grid based on a global
 * extent with origin at 0,0 will be used.
 * @property {import("../proj.js").ProjectionLike} [projection] Projection. Default is the view projection.
 * The projection code must contain a numeric end portion separated by :
 * or the entire code must form a valid ArcGIS SpatialReference definition.
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {import("../Tile.js").LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL.
 * The default is
 * ```js
 * function(imageTile, src) {
 *   imageTile.getImage().src = src;
 * };
 * ```
 * @property {string} [url] ArcGIS Rest service URL for a Map Service or Image Service. The
 * url should include /MapServer or /ImageServer.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 * @property {number} [transition] Duration of the opacity transition for rendering.  To disable the opacity
 * transition, pass `transition: 0`.
 * @property {Array<string>} [urls] ArcGIS Rest service urls. Use this instead of `url` when the ArcGIS
 * Service supports multiple urls for export requests.
 * @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
 * Choose whether to use tiles with a higher or lower zoom level when between integer
 * zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
 */
/**
 * @classdesc
 * Layer source for tile data from ArcGIS Rest services. Map and Image
 * Services are supported.
 *
 * For cached ArcGIS services, better performance is available using the
 * {@link module:ol/source/XYZ~XYZ} data source.
 * @api
 */
var TileArcGISRest = /** @class */ (function (_super) {
    __extends$8(TileArcGISRest, _super);
    /**
     * @param {Options} [opt_options] Tile ArcGIS Rest options.
     */
    function TileArcGISRest(opt_options) {
        var _this = this;
        var options = opt_options ? opt_options : {};
        _this = _super.call(this, {
            attributions: options.attributions,
            cacheSize: options.cacheSize,
            crossOrigin: options.crossOrigin,
            imageSmoothing: options.imageSmoothing,
            projection: options.projection,
            reprojectionErrorThreshold: options.reprojectionErrorThreshold,
            tileGrid: options.tileGrid,
            tileLoadFunction: options.tileLoadFunction,
            url: options.url,
            urls: options.urls,
            wrapX: options.wrapX !== undefined ? options.wrapX : true,
            transition: options.transition,
            zDirection: options.zDirection,
        }) || this;
        /**
         * @private
         * @type {!Object}
         */
        _this.params_ = options.params || {};
        /**
         * @private
         * @type {boolean}
         */
        _this.hidpi_ = options.hidpi !== undefined ? options.hidpi : true;
        /**
         * @private
         * @type {import("../extent.js").Extent}
         */
        _this.tmpExtent_ = createEmpty();
        _this.setKey(_this.getKeyForParams_());
        return _this;
    }
    /**
     * @private
     * @return {string} The key for the current params.
     */
    TileArcGISRest.prototype.getKeyForParams_ = function () {
        var i = 0;
        var res = [];
        for (var key in this.params_) {
            res[i++] = key + '-' + this.params_[key];
        }
        return res.join('/');
    };
    /**
     * Get the user-provided params, i.e. those passed to the constructor through
     * the "params" option, and possibly updated using the updateParams method.
     * @return {Object} Params.
     * @api
     */
    TileArcGISRest.prototype.getParams = function () {
        return this.params_;
    };
    /**
     * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @param {import("../size.js").Size} tileSize Tile size.
     * @param {import("../extent.js").Extent} tileExtent Tile extent.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @param {Object} params Params.
     * @return {string|undefined} Request URL.
     * @private
     */
    TileArcGISRest.prototype.getRequestUrl_ = function (tileCoord, tileSize, tileExtent, pixelRatio, projection, params) {
        var urls = this.urls;
        if (!urls) {
            return undefined;
        }
        // ArcGIS Server only wants the numeric portion of the projection ID.
        // (if there is no numeric portion the entire projection code must
        // form a valid ArcGIS SpatialReference definition).
        var srid = projection
            .getCode()
            .split(/:(?=\d+$)/)
            .pop();
        params['SIZE'] = tileSize[0] + ',' + tileSize[1];
        params['BBOX'] = tileExtent.join(',');
        params['BBOXSR'] = srid;
        params['IMAGESR'] = srid;
        params['DPI'] = Math.round(params['DPI'] ? params['DPI'] * pixelRatio : 90 * pixelRatio);
        var url;
        if (urls.length == 1) {
            url = urls[0];
        }
        else {
            var index = modulo(hash(tileCoord), urls.length);
            url = urls[index];
        }
        var modifiedUrl = url
            .replace(/MapServer\/?$/, 'MapServer/export')
            .replace(/ImageServer\/?$/, 'ImageServer/exportImage');
        return appendParams(modifiedUrl, params);
    };
    /**
     * Get the tile pixel ratio for this source.
     * @param {number} pixelRatio Pixel ratio.
     * @return {number} Tile pixel ratio.
     */
    TileArcGISRest.prototype.getTilePixelRatio = function (pixelRatio) {
        return this.hidpi_ ? pixelRatio : 1;
    };
    /**
     * Update the user-provided params.
     * @param {Object} params Params.
     * @api
     */
    TileArcGISRest.prototype.updateParams = function (params) {
        assign(this.params_, params);
        this.setKey(this.getKeyForParams_());
    };
    /**
     * @param {import("../tilecoord.js").TileCoord} tileCoord The tile coordinate
     * @param {number} pixelRatio The pixel ratio
     * @param {import("../proj/Projection.js").default} projection The projection
     * @return {string|undefined} The tile URL
     * @override
     */
    TileArcGISRest.prototype.tileUrlFunction = function (tileCoord, pixelRatio, projection) {
        var tileGrid = this.getTileGrid();
        if (!tileGrid) {
            tileGrid = this.getTileGridForProjection(projection);
        }
        if (tileGrid.getResolutions().length <= tileCoord[0]) {
            return undefined;
        }
        if (pixelRatio != 1 && !this.hidpi_) {
            pixelRatio = 1;
        }
        var tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent_);
        var tileSize = toSize(tileGrid.getTileSize(tileCoord[0]), this.tmpSize);
        if (pixelRatio != 1) {
            tileSize = scale(tileSize, pixelRatio, this.tmpSize);
        }
        // Apply default params and override with user specified values.
        var baseParams = {
            'F': 'image',
            'FORMAT': 'PNG32',
            'TRANSPARENT': true,
        };
        assign(baseParams, this.params_);
        return this.getRequestUrl_(tileCoord, tileSize, tileExtent, pixelRatio, projection, baseParams);
    };
    return TileArcGISRest;
}(TileImage));

export { TileArcGISRest, XYZ };
