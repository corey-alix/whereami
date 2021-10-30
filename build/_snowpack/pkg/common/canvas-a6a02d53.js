import { a as assert, B as BaseObject, f as Target, d as clear } from './asserts-e0c6c4d5.js';
import { c as clamp } from './math-b0fe2752.js';
import { W as WORKER_OFFSCREEN_CANVAS } from './has-ff434dd0.js';
import { d as createCanvasContext2D } from './dom-73d54564.js';
import { g as getFontParameters } from './css-ccce5ae1.js';

/**
 * @module ol/color
 */
/**
 * A color represented as a short array [red, green, blue, alpha].
 * red, green, and blue should be integers in the range 0..255 inclusive.
 * alpha should be a float in the range 0..1 inclusive. If no alpha value is
 * given then `1` will be used.
 * @typedef {Array<number>} Color
 * @api
 */
/**
 * This RegExp matches # followed by 3, 4, 6, or 8 hex digits.
 * @const
 * @type {RegExp}
 * @private
 */
var HEX_COLOR_RE_ = /^#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})$/i;
/**
 * Regular expression for matching potential named color style strings.
 * @const
 * @type {RegExp}
 * @private
 */
var NAMED_COLOR_RE_ = /^([a-z]*)$|^hsla?\(.*\)$/i;
/**
 * Return the color as an rgba string.
 * @param {Color|string} color Color.
 * @return {string} Rgba string.
 * @api
 */
function asString(color) {
    if (typeof color === 'string') {
        return color;
    }
    else {
        return toString(color);
    }
}
/**
 * Return named color as an rgba string.
 * @param {string} color Named color.
 * @return {string} Rgb string.
 */
function fromNamed(color) {
    var el = document.createElement('div');
    el.style.color = color;
    if (el.style.color !== '') {
        document.body.appendChild(el);
        var rgb = getComputedStyle(el).color;
        document.body.removeChild(el);
        return rgb;
    }
    else {
        return '';
    }
}
/**
 * @param {string} s String.
 * @return {Color} Color.
 */
var fromString = (function () {
    // We maintain a small cache of parsed strings.  To provide cheap LRU-like
    // semantics, whenever the cache grows too large we simply delete an
    // arbitrary 25% of the entries.
    /**
     * @const
     * @type {number}
     */
    var MAX_CACHE_SIZE = 1024;
    /**
     * @type {Object<string, Color>}
     */
    var cache = {};
    /**
     * @type {number}
     */
    var cacheSize = 0;
    return (
    /**
     * @param {string} s String.
     * @return {Color} Color.
     */
    function (s) {
        var color;
        if (cache.hasOwnProperty(s)) {
            color = cache[s];
        }
        else {
            if (cacheSize >= MAX_CACHE_SIZE) {
                var i = 0;
                for (var key in cache) {
                    if ((i++ & 3) === 0) {
                        delete cache[key];
                        --cacheSize;
                    }
                }
            }
            color = fromStringInternal_(s);
            cache[s] = color;
            ++cacheSize;
        }
        return color;
    });
})();
/**
 * Return the color as an array. This function maintains a cache of calculated
 * arrays which means the result should not be modified.
 * @param {Color|string} color Color.
 * @return {Color} Color.
 * @api
 */
function asArray(color) {
    if (Array.isArray(color)) {
        return color;
    }
    else {
        return fromString(color);
    }
}
/**
 * @param {string} s String.
 * @private
 * @return {Color} Color.
 */
function fromStringInternal_(s) {
    var r, g, b, a, color;
    if (NAMED_COLOR_RE_.exec(s)) {
        s = fromNamed(s);
    }
    if (HEX_COLOR_RE_.exec(s)) {
        // hex
        var n = s.length - 1; // number of hex digits
        var d = // number of digits per channel
         void 0; // number of digits per channel
        if (n <= 4) {
            d = 1;
        }
        else {
            d = 2;
        }
        var hasAlpha = n === 4 || n === 8;
        r = parseInt(s.substr(1 + 0 * d, d), 16);
        g = parseInt(s.substr(1 + 1 * d, d), 16);
        b = parseInt(s.substr(1 + 2 * d, d), 16);
        if (hasAlpha) {
            a = parseInt(s.substr(1 + 3 * d, d), 16);
        }
        else {
            a = 255;
        }
        if (d == 1) {
            r = (r << 4) + r;
            g = (g << 4) + g;
            b = (b << 4) + b;
            if (hasAlpha) {
                a = (a << 4) + a;
            }
        }
        color = [r, g, b, a / 255];
    }
    else if (s.indexOf('rgba(') == 0) {
        // rgba()
        color = s.slice(5, -1).split(',').map(Number);
        normalize(color);
    }
    else if (s.indexOf('rgb(') == 0) {
        // rgb()
        color = s.slice(4, -1).split(',').map(Number);
        color.push(1);
        normalize(color);
    }
    else {
        assert(false, 14); // Invalid color
    }
    return color;
}
/**
 * TODO this function is only used in the test, we probably shouldn't export it
 * @param {Color} color Color.
 * @return {Color} Clamped color.
 */
function normalize(color) {
    color[0] = clamp((color[0] + 0.5) | 0, 0, 255);
    color[1] = clamp((color[1] + 0.5) | 0, 0, 255);
    color[2] = clamp((color[2] + 0.5) | 0, 0, 255);
    color[3] = clamp(color[3], 0, 1);
    return color;
}
/**
 * @param {Color} color Color.
 * @return {string} String.
 */
function toString(color) {
    var r = color[0];
    if (r != (r | 0)) {
        r = (r + 0.5) | 0;
    }
    var g = color[1];
    if (g != (g | 0)) {
        g = (g + 0.5) | 0;
    }
    var b = color[2];
    if (b != (b | 0)) {
        b = (b + 0.5) | 0;
    }
    var a = color[3] === undefined ? 1 : color[3];
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

/**
 * @module ol/render/canvas
 */
/**
 * @typedef {Object} FillState
 * @property {import("../colorlike.js").ColorLike} fillStyle FillStyle.
 */
/**
 * @typedef Label
 * @property {number} width Width.
 * @property {number} height Height.
 * @property {Array<string|number>} contextInstructions ContextInstructions.
 */
/**
 * @typedef {Object} FillStrokeState
 * @property {import("../colorlike.js").ColorLike} [currentFillStyle] Current FillStyle.
 * @property {import("../colorlike.js").ColorLike} [currentStrokeStyle] Current StrokeStyle.
 * @property {CanvasLineCap} [currentLineCap] Current LineCap.
 * @property {Array<number>} currentLineDash Current LineDash.
 * @property {number} [currentLineDashOffset] Current LineDashOffset.
 * @property {CanvasLineJoin} [currentLineJoin] Current LineJoin.
 * @property {number} [currentLineWidth] Current LineWidth.
 * @property {number} [currentMiterLimit] Current MiterLimit.
 * @property {number} [lastStroke] Last stroke.
 * @property {import("../colorlike.js").ColorLike} [fillStyle] FillStyle.
 * @property {import("../colorlike.js").ColorLike} [strokeStyle] StrokeStyle.
 * @property {CanvasLineCap} [lineCap] LineCap.
 * @property {Array<number>} lineDash LineDash.
 * @property {number} [lineDashOffset] LineDashOffset.
 * @property {CanvasLineJoin} [lineJoin] LineJoin.
 * @property {number} [lineWidth] LineWidth.
 * @property {number} [miterLimit] MiterLimit.
 */
/**
 * @typedef {Object} StrokeState
 * @property {CanvasLineCap} lineCap LineCap.
 * @property {Array<number>} lineDash LineDash.
 * @property {number} lineDashOffset LineDashOffset.
 * @property {CanvasLineJoin} lineJoin LineJoin.
 * @property {number} lineWidth LineWidth.
 * @property {number} miterLimit MiterLimit.
 * @property {import("../colorlike.js").ColorLike} strokeStyle StrokeStyle.
 */
/**
 * @typedef {Object} TextState
 * @property {string} font Font.
 * @property {string} [textAlign] TextAlign.
 * @property {string} textBaseline TextBaseline.
 * @property {string} [placement] Placement.
 * @property {number} [maxAngle] MaxAngle.
 * @property {boolean} [overflow] Overflow.
 * @property {import("../style/Fill.js").default} [backgroundFill] BackgroundFill.
 * @property {import("../style/Stroke.js").default} [backgroundStroke] BackgroundStroke.
 * @property {import("../size.js").Size} [scale] Scale.
 * @property {Array<number>} [padding] Padding.
 */
/**
 * @typedef {Object} SerializableInstructions
 * @property {Array<*>} instructions The rendering instructions.
 * @property {Array<*>} hitDetectionInstructions The rendering hit detection instructions.
 * @property {Array<number>} coordinates The array of all coordinates.
 * @property {!Object<string, TextState>} [textStates] The text states (decluttering).
 * @property {!Object<string, FillState>} [fillStates] The fill states (decluttering).
 * @property {!Object<string, StrokeState>} [strokeStates] The stroke states (decluttering).
 */
/**
 * @typedef {Object<number, import("./canvas/Executor.js").ReplayImageOrLabelArgs>} DeclutterImageWithText
 */
/**
 * @const
 * @type {string}
 */
var defaultFont = '10px sans-serif';
/**
 * @const
 * @type {import("../colorlike.js").ColorLike}
 */
var defaultFillStyle = '#000';
/**
 * @const
 * @type {CanvasLineCap}
 */
var defaultLineCap = 'round';
/**
 * @const
 * @type {Array<number>}
 */
var defaultLineDash = [];
/**
 * @const
 * @type {number}
 */
var defaultLineDashOffset = 0;
/**
 * @const
 * @type {CanvasLineJoin}
 */
var defaultLineJoin = 'round';
/**
 * @const
 * @type {number}
 */
var defaultMiterLimit = 10;
/**
 * @const
 * @type {import("../colorlike.js").ColorLike}
 */
var defaultStrokeStyle = '#000';
/**
 * @const
 * @type {string}
 */
var defaultTextAlign = 'center';
/**
 * @const
 * @type {string}
 */
var defaultTextBaseline = 'middle';
/**
 * @const
 * @type {Array<number>}
 */
var defaultPadding = [0, 0, 0, 0];
/**
 * @const
 * @type {number}
 */
var defaultLineWidth = 1;
/**
 * @type {BaseObject}
 */
var checkedFonts = new BaseObject();
/**
 * The label cache for text rendering. To change the default cache size of 2048
 * entries, use {@link module:ol/structs/LRUCache~LRUCache#setSize cache.setSize()}.
 * Deprecated - there is no label cache any more.
 * @type {?}
 * @api
 * @deprecated
 */
var labelCache = new Target();
labelCache.setSize = function () {
    console.warn('labelCache is deprecated.'); //eslint-disable-line
};
/**
 * @type {CanvasRenderingContext2D}
 */
var measureContext = null;
/**
 * @type {string}
 */
var measureFont;
/**
 * @type {!Object<string, number>}
 */
var textHeights = {};
/**
 * Clears the label cache when a font becomes available.
 * @param {string} fontSpec CSS font spec.
 */
var registerFont = (function () {
    var retries = 100;
    var size = '32px ';
    var referenceFonts = ['monospace', 'serif'];
    var len = referenceFonts.length;
    var text = 'wmytzilWMYTZIL@#/&?$%10\uF013';
    var interval, referenceWidth;
    /**
     * @param {string} fontStyle Css font-style
     * @param {string} fontWeight Css font-weight
     * @param {*} fontFamily Css font-family
     * @return {boolean} Font with style and weight is available
     */
    function isAvailable(fontStyle, fontWeight, fontFamily) {
        var available = true;
        for (var i = 0; i < len; ++i) {
            var referenceFont = referenceFonts[i];
            referenceWidth = measureTextWidth(fontStyle + ' ' + fontWeight + ' ' + size + referenceFont, text);
            if (fontFamily != referenceFont) {
                var width = measureTextWidth(fontStyle +
                    ' ' +
                    fontWeight +
                    ' ' +
                    size +
                    fontFamily +
                    ',' +
                    referenceFont, text);
                // If width and referenceWidth are the same, then the fallback was used
                // instead of the font we wanted, so the font is not available.
                available = available && width != referenceWidth;
            }
        }
        if (available) {
            return true;
        }
        return false;
    }
    function check() {
        var done = true;
        var fonts = checkedFonts.getKeys();
        for (var i = 0, ii = fonts.length; i < ii; ++i) {
            var font = fonts[i];
            if (checkedFonts.get(font) < retries) {
                if (isAvailable.apply(this, font.split('\n'))) {
                    clear(textHeights);
                    // Make sure that loaded fonts are picked up by Safari
                    measureContext = null;
                    measureFont = undefined;
                    checkedFonts.set(font, retries);
                }
                else {
                    checkedFonts.set(font, checkedFonts.get(font) + 1, true);
                    done = false;
                }
            }
        }
        if (done) {
            clearInterval(interval);
            interval = undefined;
        }
    }
    return function (fontSpec) {
        var font = getFontParameters(fontSpec);
        if (!font) {
            return;
        }
        var families = font.families;
        for (var i = 0, ii = families.length; i < ii; ++i) {
            var family = families[i];
            var key = font.style + '\n' + font.weight + '\n' + family;
            if (checkedFonts.get(key) === undefined) {
                checkedFonts.set(key, retries, true);
                if (!isAvailable(font.style, font.weight, family)) {
                    checkedFonts.set(key, 0, true);
                    if (interval === undefined) {
                        interval = setInterval(check, 32);
                    }
                }
            }
        }
    };
})();
/**
 * @param {string} font Font to use for measuring.
 * @return {import("../size.js").Size} Measurement.
 */
var measureTextHeight = (function () {
    /**
     * @type {HTMLDivElement}
     */
    var measureElement;
    return function (fontSpec) {
        var height = textHeights[fontSpec];
        if (height == undefined) {
            if (WORKER_OFFSCREEN_CANVAS) {
                var font = getFontParameters(fontSpec);
                var metrics = measureText(fontSpec, 'Žg');
                var lineHeight = isNaN(Number(font.lineHeight))
                    ? 1.2
                    : Number(font.lineHeight);
                height =
                    lineHeight *
                        (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
            }
            else {
                if (!measureElement) {
                    measureElement = document.createElement('div');
                    measureElement.innerHTML = 'M';
                    measureElement.style.minHeight = '0';
                    measureElement.style.maxHeight = 'none';
                    measureElement.style.height = 'auto';
                    measureElement.style.padding = '0';
                    measureElement.style.border = 'none';
                    measureElement.style.position = 'absolute';
                    measureElement.style.display = 'block';
                    measureElement.style.left = '-99999px';
                }
                measureElement.style.font = fontSpec;
                document.body.appendChild(measureElement);
                height = measureElement.offsetHeight;
                document.body.removeChild(measureElement);
            }
            textHeights[fontSpec] = height;
        }
        return height;
    };
})();
/**
 * @param {string} font Font.
 * @param {string} text Text.
 * @return {TextMetrics} Text metrics.
 */
function measureText(font, text) {
    if (!measureContext) {
        measureContext = createCanvasContext2D(1, 1);
    }
    if (font != measureFont) {
        measureContext.font = font;
        measureFont = measureContext.font;
    }
    return measureContext.measureText(text);
}
/**
 * @param {string} font Font.
 * @param {string} text Text.
 * @return {number} Width.
 */
function measureTextWidth(font, text) {
    return measureText(font, text).width;
}
/**
 * Measure text width using a cache.
 * @param {string} font The font.
 * @param {string} text The text to measure.
 * @param {Object<string, number>} cache A lookup of cached widths by text.
 * @return {number} The text width.
 */
function measureAndCacheTextWidth(font, text, cache) {
    if (text in cache) {
        return cache[text];
    }
    var width = measureTextWidth(font, text);
    cache[text] = width;
    return width;
}
/**
 * @param {string} font Font to use for measuring.
 * @param {Array<string>} lines Lines to measure.
 * @param {Array<number>} widths Array will be populated with the widths of
 * each line.
 * @return {number} Width of the whole text.
 */
function measureTextWidths(font, lines, widths) {
    var numLines = lines.length;
    var width = 0;
    for (var i = 0; i < numLines; ++i) {
        var currentWidth = measureTextWidth(font, lines[i]);
        width = Math.max(width, currentWidth);
        widths.push(currentWidth);
    }
    return width;
}
/**
 * @param {CanvasRenderingContext2D} context Context.
 * @param {import("../transform.js").Transform|null} transform Transform.
 * @param {number} opacity Opacity.
 * @param {Label|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} labelOrImage Label.
 * @param {number} originX Origin X.
 * @param {number} originY Origin Y.
 * @param {number} w Width.
 * @param {number} h Height.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {import("../size.js").Size} scale Scale.
 */
function drawImageOrLabel(context, transform, opacity, labelOrImage, originX, originY, w, h, x, y, scale) {
    context.save();
    if (opacity !== 1) {
        context.globalAlpha *= opacity;
    }
    if (transform) {
        context.setTransform.apply(context, transform);
    }
    if ( /** @type {*} */(labelOrImage).contextInstructions) {
        // label
        context.translate(x, y);
        context.scale(scale[0], scale[1]);
        executeLabelInstructions(/** @type {Label} */ (labelOrImage), context);
    }
    else if (scale[0] < 0 || scale[1] < 0) {
        // flipped image
        context.translate(x, y);
        context.scale(scale[0], scale[1]);
        context.drawImage(
        /** @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} */ (labelOrImage), originX, originY, w, h, 0, 0, w, h);
    }
    else {
        // if image not flipped translate and scale can be avoided
        context.drawImage(
        /** @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} */ (labelOrImage), originX, originY, w, h, x, y, w * scale[0], h * scale[1]);
    }
    context.restore();
}
/**
 * @param {Label} label Label.
 * @param {CanvasRenderingContext2D} context Context.
 */
function executeLabelInstructions(label, context) {
    var contextInstructions = label.contextInstructions;
    for (var i = 0, ii = contextInstructions.length; i < ii; i += 2) {
        if (Array.isArray(contextInstructions[i + 1])) {
            context[contextInstructions[i]].apply(context, contextInstructions[i + 1]);
        }
        else {
            context[contextInstructions[i]] = contextInstructions[i + 1];
        }
    }
}

export { asString as a, defaultStrokeStyle as b, checkedFonts as c, defaultFillStyle as d, defaultLineCap as e, defaultLineDash as f, defaultLineDashOffset as g, defaultLineJoin as h, defaultLineWidth as i, defaultMiterLimit as j, defaultPadding as k, defaultTextAlign as l, defaultTextBaseline as m, defaultFont as n, measureTextWidths as o, measureTextHeight as p, drawImageOrLabel as q, registerFont as r, measureAndCacheTextWidth as s, asArray as t, toString as u };
