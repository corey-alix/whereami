import { W as WORKER_OFFSCREEN_CANVAS } from './has-ff434dd0.js';
import { a as assert } from './asserts-e0c6c4d5.js';

/**
 * @module ol/transform
 */
/**
 * An array representing an affine 2d transformation for use with
 * {@link module:ol/transform} functions. The array has 6 elements.
 * @typedef {!Array<number>} Transform
 * @api
 */
/**
 * Collection of affine 2d transformation functions. The functions work on an
 * array of 6 elements. The element order is compatible with the [SVGMatrix
 * interface](https://developer.mozilla.org/en-US/docs/Web/API/SVGMatrix) and is
 * a subset (elements a to f) of a 3×3 matrix:
 * ```
 * [ a c e ]
 * [ b d f ]
 * [ 0 0 1 ]
 * ```
 */
/**
 * @private
 * @type {Transform}
 */
var tmp_ = new Array(6);
/**
 * Create an identity transform.
 * @return {!Transform} Identity transform.
 */
function create() {
    return [1, 0, 0, 1, 0, 0];
}
/**
 * Set the transform components a-f on a given transform.
 * @param {!Transform} transform Transform.
 * @param {number} a The a component of the transform.
 * @param {number} b The b component of the transform.
 * @param {number} c The c component of the transform.
 * @param {number} d The d component of the transform.
 * @param {number} e The e component of the transform.
 * @param {number} f The f component of the transform.
 * @return {!Transform} Matrix with transform applied.
 */
function set(transform, a, b, c, d, e, f) {
    transform[0] = a;
    transform[1] = b;
    transform[2] = c;
    transform[3] = d;
    transform[4] = e;
    transform[5] = f;
    return transform;
}
/**
 * Set transform on one matrix from another matrix.
 * @param {!Transform} transform1 Matrix to set transform to.
 * @param {!Transform} transform2 Matrix to set transform from.
 * @return {!Transform} transform1 with transform from transform2 applied.
 */
function setFromArray(transform1, transform2) {
    transform1[0] = transform2[0];
    transform1[1] = transform2[1];
    transform1[2] = transform2[2];
    transform1[3] = transform2[3];
    transform1[4] = transform2[4];
    transform1[5] = transform2[5];
    return transform1;
}
/**
 * Transforms the given coordinate with the given transform returning the
 * resulting, transformed coordinate. The coordinate will be modified in-place.
 *
 * @param {Transform} transform The transformation.
 * @param {import("./coordinate.js").Coordinate|import("./pixel.js").Pixel} coordinate The coordinate to transform.
 * @return {import("./coordinate.js").Coordinate|import("./pixel.js").Pixel} return coordinate so that operations can be
 *     chained together.
 */
function apply(transform, coordinate) {
    var x = coordinate[0];
    var y = coordinate[1];
    coordinate[0] = transform[0] * x + transform[2] * y + transform[4];
    coordinate[1] = transform[1] * x + transform[3] * y + transform[5];
    return coordinate;
}
/**
 * Creates a scale transform.
 * @param {!Transform} target Transform to overwrite.
 * @param {number} x Scale factor x.
 * @param {number} y Scale factor y.
 * @return {!Transform} The scale transform.
 */
function makeScale(target, x, y) {
    return set(target, x, 0, 0, y, 0, 0);
}
/**
 * Creates a composite transform given an initial translation, scale, rotation, and
 * final translation (in that order only, not commutative).
 * @param {!Transform} transform The transform (will be modified in place).
 * @param {number} dx1 Initial translation x.
 * @param {number} dy1 Initial translation y.
 * @param {number} sx Scale factor x.
 * @param {number} sy Scale factor y.
 * @param {number} angle Rotation (in counter-clockwise radians).
 * @param {number} dx2 Final translation x.
 * @param {number} dy2 Final translation y.
 * @return {!Transform} The composite transform.
 */
function compose(transform, dx1, dy1, sx, sy, angle, dx2, dy2) {
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);
    transform[0] = sx * cos;
    transform[1] = sy * sin;
    transform[2] = -sx * sin;
    transform[3] = sy * cos;
    transform[4] = dx2 * sx * cos - dy2 * sx * sin + dx1;
    transform[5] = dx2 * sy * sin + dy2 * sy * cos + dy1;
    return transform;
}
/**
 * Invert the given transform.
 * @param {!Transform} target Transform to be set as the inverse of
 *     the source transform.
 * @param {!Transform} source The source transform to invert.
 * @return {!Transform} The inverted (target) transform.
 */
function makeInverse(target, source) {
    var det = determinant(source);
    assert(det !== 0, 32); // Transformation matrix cannot be inverted
    var a = source[0];
    var b = source[1];
    var c = source[2];
    var d = source[3];
    var e = source[4];
    var f = source[5];
    target[0] = d / det;
    target[1] = -b / det;
    target[2] = -c / det;
    target[3] = a / det;
    target[4] = (c * f - d * e) / det;
    target[5] = -(a * f - b * e) / det;
    return target;
}
/**
 * Returns the determinant of the given matrix.
 * @param {!Transform} mat Matrix.
 * @return {number} Determinant.
 */
function determinant(mat) {
    return mat[0] * mat[3] - mat[1] * mat[2];
}
/**
 * @type {HTMLElement}
 * @private
 */
var transformStringDiv;
/**
 * A rounded string version of the transform.  This can be used
 * for CSS transforms.
 * @param {!Transform} mat Matrix.
 * @return {string} The transform as a string.
 */
function toString(mat) {
    var transformString = 'matrix(' + mat.join(', ') + ')';
    if (WORKER_OFFSCREEN_CANVAS) {
        return transformString;
    }
    var node = transformStringDiv || (transformStringDiv = document.createElement('div'));
    node.style.transform = transformString;
    return node.style.transform;
}

export { create as a, apply as b, compose as c, makeScale as d, makeInverse as m, setFromArray as s, toString as t };
