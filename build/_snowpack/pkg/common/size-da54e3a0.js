/**
 * @module ol/size
 */
/**
 * Determines if a size has a positive area.
 * @param {Size} size The size to test.
 * @return {boolean} The size has a positive area.
 */
function hasArea(size) {
    return size[0] > 0 && size[1] > 0;
}
/**
 * Returns a size scaled by a ratio. The result will be an array of integers.
 * @param {Size} size Size.
 * @param {number} ratio Ratio.
 * @param {Size} [opt_size] Optional reusable size array.
 * @return {Size} The scaled size.
 */
function scale(size, ratio, opt_size) {
    if (opt_size === undefined) {
        opt_size = [0, 0];
    }
    opt_size[0] = (size[0] * ratio + 0.5) | 0;
    opt_size[1] = (size[1] * ratio + 0.5) | 0;
    return opt_size;
}
/**
 * Returns an `Size` array for the passed in number (meaning: square) or
 * `Size` array.
 * (meaning: non-square),
 * @param {number|Size} size Width and height.
 * @param {Size} [opt_size] Optional reusable size array.
 * @return {Size} Size.
 * @api
 */
function toSize(size, opt_size) {
    if (Array.isArray(size)) {
        return size;
    }
    else {
        if (opt_size === undefined) {
            opt_size = [size, size];
        }
        else {
            opt_size[0] = size;
            opt_size[1] = size;
        }
        return opt_size;
    }
}

export { hasArea as h, scale as s, toSize as t };
