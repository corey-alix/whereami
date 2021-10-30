import { G as GeometryType, S as SimpleGeometry } from './SimpleGeometry-0ef1a82e.js';
import { s as createOrUpdateFromCoordinate, t as containsXY } from './extent-0b32e3b6.js';
import { s as squaredDistance } from './math-b0fe2752.js';

/**
 * @module ol/geom/flat/deflate
 */
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
 * @param {number} stride Stride.
 * @return {number} offset Offset.
 */
function deflateCoordinate(flatCoordinates, offset, coordinate, stride) {
    for (var i = 0, ii = coordinate.length; i < ii; ++i) {
        flatCoordinates[offset++] = coordinate[i];
    }
    return offset;
}
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<import("../../coordinate.js").Coordinate>} coordinates Coordinates.
 * @param {number} stride Stride.
 * @return {number} offset Offset.
 */
function deflateCoordinates(flatCoordinates, offset, coordinates, stride) {
    for (var i = 0, ii = coordinates.length; i < ii; ++i) {
        var coordinate = coordinates[i];
        for (var j = 0; j < stride; ++j) {
            flatCoordinates[offset++] = coordinate[j];
        }
    }
    return offset;
}
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<Array<import("../../coordinate.js").Coordinate>>} coordinatess Coordinatess.
 * @param {number} stride Stride.
 * @param {Array<number>} [opt_ends] Ends.
 * @return {Array<number>} Ends.
 */
function deflateCoordinatesArray(flatCoordinates, offset, coordinatess, stride, opt_ends) {
    var ends = opt_ends ? opt_ends : [];
    var i = 0;
    for (var j = 0, jj = coordinatess.length; j < jj; ++j) {
        var end = deflateCoordinates(flatCoordinates, offset, coordinatess[j], stride);
        ends[i++] = end;
        offset = end;
    }
    ends.length = i;
    return ends;
}

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
 * @classdesc
 * Point geometry.
 *
 * @api
 */
var Point = /** @class */ (function (_super) {
    __extends(Point, _super);
    /**
     * @param {import("../coordinate.js").Coordinate} coordinates Coordinates.
     * @param {import("./GeometryLayout.js").default} [opt_layout] Layout.
     */
    function Point(coordinates, opt_layout) {
        var _this = _super.call(this) || this;
        _this.setCoordinates(coordinates, opt_layout);
        return _this;
    }
    /**
     * Make a complete copy of the geometry.
     * @return {!Point} Clone.
     * @api
     */
    Point.prototype.clone = function () {
        var point = new Point(this.flatCoordinates.slice(), this.layout);
        point.applyProperties(this);
        return point;
    };
    /**
     * @param {number} x X.
     * @param {number} y Y.
     * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
     * @param {number} minSquaredDistance Minimum squared distance.
     * @return {number} Minimum squared distance.
     */
    Point.prototype.closestPointXY = function (x, y, closestPoint, minSquaredDistance) {
        var flatCoordinates = this.flatCoordinates;
        var squaredDistance$1 = squaredDistance(x, y, flatCoordinates[0], flatCoordinates[1]);
        if (squaredDistance$1 < minSquaredDistance) {
            var stride = this.stride;
            for (var i = 0; i < stride; ++i) {
                closestPoint[i] = flatCoordinates[i];
            }
            closestPoint.length = stride;
            return squaredDistance$1;
        }
        else {
            return minSquaredDistance;
        }
    };
    /**
     * Return the coordinate of the point.
     * @return {import("../coordinate.js").Coordinate} Coordinates.
     * @api
     */
    Point.prototype.getCoordinates = function () {
        return !this.flatCoordinates ? [] : this.flatCoordinates.slice();
    };
    /**
     * @param {import("../extent.js").Extent} extent Extent.
     * @protected
     * @return {import("../extent.js").Extent} extent Extent.
     */
    Point.prototype.computeExtent = function (extent) {
        return createOrUpdateFromCoordinate(this.flatCoordinates, extent);
    };
    /**
     * Get the type of this geometry.
     * @return {import("./GeometryType.js").default} Geometry type.
     * @api
     */
    Point.prototype.getType = function () {
        return GeometryType.POINT;
    };
    /**
     * Test if the geometry and the passed extent intersect.
     * @param {import("../extent.js").Extent} extent Extent.
     * @return {boolean} `true` if the geometry and the extent intersect.
     * @api
     */
    Point.prototype.intersectsExtent = function (extent) {
        return containsXY(extent, this.flatCoordinates[0], this.flatCoordinates[1]);
    };
    /**
     * @param {!Array<*>} coordinates Coordinates.
     * @param {import("./GeometryLayout.js").default} [opt_layout] Layout.
     * @api
     */
    Point.prototype.setCoordinates = function (coordinates, opt_layout) {
        this.setLayout(opt_layout, coordinates, 0);
        if (!this.flatCoordinates) {
            this.flatCoordinates = [];
        }
        this.flatCoordinates.length = deflateCoordinate(this.flatCoordinates, 0, coordinates, this.stride);
        this.changed();
    };
    return Point;
}(SimpleGeometry));

export { Point as P, deflateCoordinatesArray as a, deflateCoordinates as d };
