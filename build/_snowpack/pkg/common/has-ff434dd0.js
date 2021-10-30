/**
 * @module ol/has
 */
var ua = typeof navigator !== 'undefined' && typeof navigator.userAgent !== 'undefined'
    ? navigator.userAgent.toLowerCase()
    : '';
/**
 * User agent string says we are dealing with Firefox as browser.
 * @type {boolean}
 */
var FIREFOX = ua.indexOf('firefox') !== -1;
/**
 * User agent string says we are dealing with Safari as browser.
 * @type {boolean}
 */
var SAFARI = ua.indexOf('safari') !== -1 && ua.indexOf('chrom') == -1;
/**
 * User agent string says we are dealing with a WebKit engine.
 * @type {boolean}
 */
var WEBKIT = ua.indexOf('webkit') !== -1 && ua.indexOf('edge') == -1;
/**
 * User agent string says we are dealing with a Mac as platform.
 * @type {boolean}
 */
var MAC = ua.indexOf('macintosh') !== -1;
/**
 * The ratio between physical pixels and device-independent pixels
 * (dips) on the device (`window.devicePixelRatio`).
 * @const
 * @type {number}
 * @api
 */
var DEVICE_PIXEL_RATIO = typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1;
/**
 * The execution context is a worker with OffscreenCanvas available.
 * @const
 * @type {boolean}
 */
var WORKER_OFFSCREEN_CANVAS = typeof WorkerGlobalScope !== 'undefined' &&
    typeof OffscreenCanvas !== 'undefined' &&
    self instanceof WorkerGlobalScope; //eslint-disable-line
/**
 * Image.prototype.decode() is supported.
 * @type {boolean}
 */
var IMAGE_DECODE = typeof Image !== 'undefined' && Image.prototype.decode;
/**
 * @type {boolean}
 */
var PASSIVE_EVENT_LISTENERS = (function () {
    var passive = false;
    try {
        var options = Object.defineProperty({}, 'passive', {
            get: function () {
                passive = true;
            },
        });
        window.addEventListener('_', null, options);
        window.removeEventListener('_', null, options);
    }
    catch (error) {
        // passive not supported
    }
    return passive;
})();

export { DEVICE_PIXEL_RATIO as D, FIREFOX as F, IMAGE_DECODE as I, MAC as M, PASSIVE_EVENT_LISTENERS as P, WORKER_OFFSCREEN_CANVAS as W, WEBKIT as a };
