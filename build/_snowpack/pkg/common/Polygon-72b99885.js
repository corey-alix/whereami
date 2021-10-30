import { a as GeometryLayout, G as GeometryType, S as SimpleGeometry } from './SimpleGeometry-0ef1a82e.js';
import { s as squaredDistance, l as lerp } from './math-b0fe2752.js';
import { l as closestSquaredDistanceXY, m as forEachCorner, n as extendFlatCoordinates, j as createEmpty, o as intersects, p as containsExtent, q as intersectsSegment, d as getCenter } from './extent-0b32e3b6.js';
import { d as deflateCoordinates, P as Point, a as deflateCoordinatesArray } from './Point-6e9bb897.js';
import { i as inflateCoordinates, d as douglasPeucker, a as inflateCoordinatesArray, q as quantizeArray } from './inflate-f8e41fee.js';
import { n as numberSafeCompareFunction, j as extend } from './asserts-e0c6c4d5.js';

/**
 * @module ol/geom/flat/closest
 */
/**
 * Returns the point on the 2D line segment flatCoordinates[offset1] to
 * flatCoordinates[offset2] that is closest to the point (x, y).  Extra
 * dimensions are linearly interpolated.
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset1 Offset 1.
 * @param {number} offset2 Offset 2.
 * @param {number} stride Stride.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {Array<number>} closestPoint Closest point.
 */
function assignClosest(flatCoordinates, offset1, offset2, stride, x, y, closestPoint) {
    var x1 = flatCoordinates[offset1];
    var y1 = flatCoordinates[offset1 + 1];
    var dx = flatCoordinates[offset2] - x1;
    var dy = flatCoordinates[offset2 + 1] - y1;
    var offset;
    if (dx === 0 && dy === 0) {
        offset = offset1;
    }
    else {
        var t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
        if (t > 1) {
            offset = offset2;
        }
        else if (t > 0) {
            for (var i = 0; i < stride; ++i) {
                closestPoint[i] = lerp(flatCoordinates[offset1 + i], flatCoordinates[offset2 + i], t);
            }
            closestPoint.length = stride;
            return;
        }
        else {
            offset = offset1;
        }
    }
    for (var i = 0; i < stride; ++i) {
        closestPoint[i] = flatCoordinates[offset + i];
    }
    closestPoint.length = stride;
}
/**
 * Return the squared of the largest distance between any pair of consecutive
 * coordinates.
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} max Max squared delta.
 * @return {number} Max squared delta.
 */
function maxSquaredDelta(flatCoordinates, offset, end, stride, max) {
    var x1 = flatCoordinates[offset];
    var y1 = flatCoordinates[offset + 1];
    for (offset += stride; offset < end; offset += stride) {
        var x2 = flatCoordinates[offset];
        var y2 = flatCoordinates[offset + 1];
        var squaredDelta = squaredDistance(x1, y1, x2, y2);
        if (squaredDelta > max) {
            max = squaredDelta;
        }
        x1 = x2;
        y1 = y2;
    }
    return max;
}
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {number} max Max squared delta.
 * @return {number} Max squared delta.
 */
function arrayMaxSquaredDelta(flatCoordinates, offset, ends, stride, max) {
    for (var i = 0, ii = ends.length; i < ii; ++i) {
        var end = ends[i];
        max = maxSquaredDelta(flatCoordinates, offset, end, stride, max);
        offset = end;
    }
    return max;
}
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} maxDelta Max delta.
 * @param {boolean} isRing Is ring.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {Array<number>} closestPoint Closest point.
 * @param {number} minSquaredDistance Minimum squared distance.
 * @param {Array<number>} [opt_tmpPoint] Temporary point object.
 * @return {number} Minimum squared distance.
 */
function assignClosestPoint(flatCoordinates, offset, end, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance, opt_tmpPoint) {
    if (offset == end) {
        return minSquaredDistance;
    }
    var i, squaredDistance$1;
    if (maxDelta === 0) {
        // All points are identical, so just test the first point.
        squaredDistance$1 = squaredDistance(x, y, flatCoordinates[offset], flatCoordinates[offset + 1]);
        if (squaredDistance$1 < minSquaredDistance) {
            for (i = 0; i < stride; ++i) {
                closestPoint[i] = flatCoordinates[offset + i];
            }
            closestPoint.length = stride;
            return squaredDistance$1;
        }
        else {
            return minSquaredDistance;
        }
    }
    var tmpPoint = opt_tmpPoint ? opt_tmpPoint : [NaN, NaN];
    var index = offset + stride;
    while (index < end) {
        assignClosest(flatCoordinates, index - stride, index, stride, x, y, tmpPoint);
        squaredDistance$1 = squaredDistance(x, y, tmpPoint[0], tmpPoint[1]);
        if (squaredDistance$1 < minSquaredDistance) {
            minSquaredDistance = squaredDistance$1;
            for (i = 0; i < stride; ++i) {
                closestPoint[i] = tmpPoint[i];
            }
            closestPoint.length = stride;
            index += stride;
        }
        else {
            // Skip ahead multiple points, because we know that all the skipped
            // points cannot be any closer than the closest point we have found so
            // far.  We know this because we know how close the current point is, how
            // close the closest point we have found so far is, and the maximum
            // distance between consecutive points.  For example, if we're currently
            // at distance 10, the best we've found so far is 3, and that the maximum
            // distance between consecutive points is 2, then we'll need to skip at
            // least (10 - 3) / 2 == 3 (rounded down) points to have any chance of
            // finding a closer point.  We use Math.max(..., 1) to ensure that we
            // always advance at least one point, to avoid an infinite loop.
            index +=
                stride *
                    Math.max(((Math.sqrt(squaredDistance$1) - Math.sqrt(minSquaredDistance)) /
                        maxDelta) |
                        0, 1);
        }
    }
    if (isRing) {
        // Check the closing segment.
        assignClosest(flatCoordinates, end - stride, offset, stride, x, y, tmpPoint);
        squaredDistance$1 = squaredDistance(x, y, tmpPoint[0], tmpPoint[1]);
        if (squaredDistance$1 < minSquaredDistance) {
            minSquaredDistance = squaredDistance$1;
            for (i = 0; i < stride; ++i) {
                closestPoint[i] = tmpPoint[i];
            }
            closestPoint.length = stride;
        }
    }
    return minSquaredDistance;
}
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {number} maxDelta Max delta.
 * @param {boolean} isRing Is ring.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {Array<number>} closestPoint Closest point.
 * @param {number} minSquaredDistance Minimum squared distance.
 * @param {Array<number>} [opt_tmpPoint] Temporary point object.
 * @return {number} Minimum squared distance.
 */
function assignClosestArrayPoint(flatCoordinates, offset, ends, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance, opt_tmpPoint) {
    var tmpPoint = opt_tmpPoint ? opt_tmpPoint : [NaN, NaN];
    for (var i = 0, ii = ends.length; i < ii; ++i) {
        var end = ends[i];
        minSquaredDistance = assignClosestPoint(flatCoordinates, offset, end, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance, tmpPoint);
        offset = end;
    }
    return minSquaredDistance;
}

/**
 * @module ol/geom/flat/area
 */
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {number} Area.
 */
function linearRing(flatCoordinates, offset, end, stride) {
    var twiceArea = 0;
    var x1 = flatCoordinates[end - stride];
    var y1 = flatCoordinates[end - stride + 1];
    for (; offset < end; offset += stride) {
        var x2 = flatCoordinates[offset];
        var y2 = flatCoordinates[offset + 1];
        twiceArea += y1 * x2 - x1 * y2;
        x1 = x2;
        y1 = y2;
    }
    return twiceArea / 2;
}
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<number>} ends Ends.
 * @param {number} stride Stride.
 * @return {number} Area.
 */
function linearRings(flatCoordinates, offset, ends, stride) {
    var area = 0;
    for (var i = 0, ii = ends.length; i < ii; ++i) {
        var end = ends[i];
        area += linearRing(flatCoordinates, offset, end, stride);
        offset = end;
    }
    return area;
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
 * Linear ring geometry. Only used as part of polygon; cannot be rendered
 * on its own.
 *
 * @api
 */
var LinearRing = /** @class */ (function (_super) {
    __extends(LinearRing, _super);
    /**
     * @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
     *     For internal use, flat coordinates in combination with `opt_layout` are also accepted.
     * @param {import("./GeometryLayout.js").default} [opt_layout] Layout.
     */
    function LinearRing(coordinates, opt_layout) {
        var _this = _super.call(this) || this;
        /**
         * @private
         * @type {number}
         */
        _this.maxDelta_ = -1;
        /**
         * @private
         * @type {number}
         */
        _this.maxDeltaRevision_ = -1;
        if (opt_layout !== undefined && !Array.isArray(coordinates[0])) {
            _this.setFlatCoordinates(opt_layout, 
            /** @type {Array<number>} */ (coordinates));
        }
        else {
            _this.setCoordinates(
            /** @type {Array<import("../coordinate.js").Coordinate>} */ (coordinates), opt_layout);
        }
        return _this;
    }
    /**
     * Make a complete copy of the geometry.
     * @return {!LinearRing} Clone.
     * @api
     */
    LinearRing.prototype.clone = function () {
        return new LinearRing(this.flatCoordinates.slice(), this.layout);
    };
    /**
     * @param {number} x X.
     * @param {number} y Y.
     * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
     * @param {number} minSquaredDistance Minimum squared distance.
     * @return {number} Minimum squared distance.
     */
    LinearRing.prototype.closestPointXY = function (x, y, closestPoint, minSquaredDistance) {
        if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
            return minSquaredDistance;
        }
        if (this.maxDeltaRevision_ != this.getRevision()) {
            this.maxDelta_ = Math.sqrt(maxSquaredDelta(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0));
            this.maxDeltaRevision_ = this.getRevision();
        }
        return assignClosestPoint(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
    };
    /**
     * Return the area of the linear ring on projected plane.
     * @return {number} Area (on projected plane).
     * @api
     */
    LinearRing.prototype.getArea = function () {
        return linearRing(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
    };
    /**
     * Return the coordinates of the linear ring.
     * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
     * @api
     */
    LinearRing.prototype.getCoordinates = function () {
        return inflateCoordinates(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
    };
    /**
     * @param {number} squaredTolerance Squared tolerance.
     * @return {LinearRing} Simplified LinearRing.
     * @protected
     */
    LinearRing.prototype.getSimplifiedGeometryInternal = function (squaredTolerance) {
        var simplifiedFlatCoordinates = [];
        simplifiedFlatCoordinates.length = douglasPeucker(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, squaredTolerance, simplifiedFlatCoordinates, 0);
        return new LinearRing(simplifiedFlatCoordinates, GeometryLayout.XY);
    };
    /**
     * Get the type of this geometry.
     * @return {import("./GeometryType.js").default} Geometry type.
     * @api
     */
    LinearRing.prototype.getType = function () {
        return GeometryType.LINEAR_RING;
    };
    /**
     * Test if the geometry and the passed extent intersect.
     * @param {import("../extent.js").Extent} extent Extent.
     * @return {boolean} `true` if the geometry and the extent intersect.
     * @api
     */
    LinearRing.prototype.intersectsExtent = function (extent) {
        return false;
    };
    /**
     * Set the coordinates of the linear ring.
     * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
     * @param {import("./GeometryLayout.js").default} [opt_layout] Layout.
     * @api
     */
    LinearRing.prototype.setCoordinates = function (coordinates, opt_layout) {
        this.setLayout(opt_layout, coordinates, 1);
        if (!this.flatCoordinates) {
            this.flatCoordinates = [];
        }
        this.flatCoordinates.length = deflateCoordinates(this.flatCoordinates, 0, coordinates, this.stride);
        this.changed();
    };
    return LinearRing;
}(SimpleGeometry));

/**
 * @module ol/geom/flat/contains
 */
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {import("../../extent.js").Extent} extent Extent.
 * @return {boolean} Contains extent.
 */
function linearRingContainsExtent(flatCoordinates, offset, end, stride, extent) {
    var outside = forEachCorner(extent, 
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} Contains (x, y).
     */
    function (coordinate) {
        return !linearRingContainsXY(flatCoordinates, offset, end, stride, coordinate[0], coordinate[1]);
    });
    return !outside;
}
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {boolean} Contains (x, y).
 */
function linearRingContainsXY(flatCoordinates, offset, end, stride, x, y) {
    // https://geomalgorithms.com/a03-_inclusion.html
    // Copyright 2000 softSurfer, 2012 Dan Sunday
    // This code may be freely used and modified for any purpose
    // providing that this copyright notice is included with it.
    // SoftSurfer makes no warranty for this code, and cannot be held
    // liable for any real or imagined damage resulting from its use.
    // Users of this code must verify correctness for their application.
    var wn = 0;
    var x1 = flatCoordinates[end - stride];
    var y1 = flatCoordinates[end - stride + 1];
    for (; offset < end; offset += stride) {
        var x2 = flatCoordinates[offset];
        var y2 = flatCoordinates[offset + 1];
        if (y1 <= y) {
            if (y2 > y && (x2 - x1) * (y - y1) - (x - x1) * (y2 - y1) > 0) {
                wn++;
            }
        }
        else if (y2 <= y && (x2 - x1) * (y - y1) - (x - x1) * (y2 - y1) < 0) {
            wn--;
        }
        x1 = x2;
        y1 = y2;
    }
    return wn !== 0;
}
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {boolean} Contains (x, y).
 */
function linearRingsContainsXY(flatCoordinates, offset, ends, stride, x, y) {
    if (ends.length === 0) {
        return false;
    }
    if (!linearRingContainsXY(flatCoordinates, offset, ends[0], stride, x, y)) {
        return false;
    }
    for (var i = 1, ii = ends.length; i < ii; ++i) {
        if (linearRingContainsXY(flatCoordinates, ends[i - 1], ends[i], stride, x, y)) {
            return false;
        }
    }
    return true;
}

/**
 * @module ol/geom/flat/interiorpoint
 */
/**
 * Calculates a point that is likely to lie in the interior of the linear rings.
 * Inspired by JTS's com.vividsolutions.jts.geom.Geometry#getInteriorPoint.
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {Array<number>} flatCenters Flat centers.
 * @param {number} flatCentersOffset Flat center offset.
 * @param {Array<number>} [opt_dest] Destination.
 * @return {Array<number>} Destination point as XYM coordinate, where M is the
 * length of the horizontal intersection that the point belongs to.
 */
function getInteriorPointOfArray(flatCoordinates, offset, ends, stride, flatCenters, flatCentersOffset, opt_dest) {
    var i, ii, x, x1, x2, y1, y2;
    var y = flatCenters[flatCentersOffset + 1];
    /** @type {Array<number>} */
    var intersections = [];
    // Calculate intersections with the horizontal line
    for (var r = 0, rr = ends.length; r < rr; ++r) {
        var end = ends[r];
        x1 = flatCoordinates[end - stride];
        y1 = flatCoordinates[end - stride + 1];
        for (i = offset; i < end; i += stride) {
            x2 = flatCoordinates[i];
            y2 = flatCoordinates[i + 1];
            if ((y <= y1 && y2 <= y) || (y1 <= y && y <= y2)) {
                x = ((y - y1) / (y2 - y1)) * (x2 - x1) + x1;
                intersections.push(x);
            }
            x1 = x2;
            y1 = y2;
        }
    }
    // Find the longest segment of the horizontal line that has its center point
    // inside the linear ring.
    var pointX = NaN;
    var maxSegmentLength = -Infinity;
    intersections.sort(numberSafeCompareFunction);
    x1 = intersections[0];
    for (i = 1, ii = intersections.length; i < ii; ++i) {
        x2 = intersections[i];
        var segmentLength = Math.abs(x2 - x1);
        if (segmentLength > maxSegmentLength) {
            x = (x1 + x2) / 2;
            if (linearRingsContainsXY(flatCoordinates, offset, ends, stride, x, y)) {
                pointX = x;
                maxSegmentLength = segmentLength;
            }
        }
        x1 = x2;
    }
    if (isNaN(pointX)) {
        // There is no horizontal line that has its center point inside the linear
        // ring.  Use the center of the the linear ring's extent.
        pointX = flatCenters[flatCentersOffset];
    }
    if (opt_dest) {
        opt_dest.push(pointX, y, maxSegmentLength);
        return opt_dest;
    }
    else {
        return [pointX, y, maxSegmentLength];
    }
}

/**
 * @module ol/geom/flat/segments
 */
/**
 * This function calls `callback` for each segment of the flat coordinates
 * array. If the callback returns a truthy value the function returns that
 * value immediately. Otherwise the function returns `false`.
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {function(import("../../coordinate.js").Coordinate, import("../../coordinate.js").Coordinate): T} callback Function
 *     called for each segment.
 * @return {T|boolean} Value.
 * @template T
 */
function forEach(flatCoordinates, offset, end, stride, callback) {
    var ret;
    offset += stride;
    for (; offset < end; offset += stride) {
        ret = callback(flatCoordinates.slice(offset - stride, offset), flatCoordinates.slice(offset, offset + stride));
        if (ret) {
            return ret;
        }
    }
    return false;
}

/**
 * @module ol/geom/flat/intersectsextent
 */
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {import("../../extent.js").Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
function intersectsLineString(flatCoordinates, offset, end, stride, extent) {
    var coordinatesExtent = extendFlatCoordinates(createEmpty(), flatCoordinates, offset, end, stride);
    if (!intersects(extent, coordinatesExtent)) {
        return false;
    }
    if (containsExtent(extent, coordinatesExtent)) {
        return true;
    }
    if (coordinatesExtent[0] >= extent[0] && coordinatesExtent[2] <= extent[2]) {
        return true;
    }
    if (coordinatesExtent[1] >= extent[1] && coordinatesExtent[3] <= extent[3]) {
        return true;
    }
    return forEach(flatCoordinates, offset, end, stride, 
    /**
     * @param {import("../../coordinate.js").Coordinate} point1 Start point.
     * @param {import("../../coordinate.js").Coordinate} point2 End point.
     * @return {boolean} `true` if the segment and the extent intersect,
     *     `false` otherwise.
     */
    function (point1, point2) {
        return intersectsSegment(extent, point1, point2);
    });
}
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {import("../../extent.js").Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
function intersectsLinearRing(flatCoordinates, offset, end, stride, extent) {
    if (intersectsLineString(flatCoordinates, offset, end, stride, extent)) {
        return true;
    }
    if (linearRingContainsXY(flatCoordinates, offset, end, stride, extent[0], extent[1])) {
        return true;
    }
    if (linearRingContainsXY(flatCoordinates, offset, end, stride, extent[0], extent[3])) {
        return true;
    }
    if (linearRingContainsXY(flatCoordinates, offset, end, stride, extent[2], extent[1])) {
        return true;
    }
    if (linearRingContainsXY(flatCoordinates, offset, end, stride, extent[2], extent[3])) {
        return true;
    }
    return false;
}
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {import("../../extent.js").Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
function intersectsLinearRingArray(flatCoordinates, offset, ends, stride, extent) {
    if (!intersectsLinearRing(flatCoordinates, offset, ends[0], stride, extent)) {
        return false;
    }
    if (ends.length === 1) {
        return true;
    }
    for (var i = 1, ii = ends.length; i < ii; ++i) {
        if (linearRingContainsExtent(flatCoordinates, ends[i - 1], ends[i], stride, extent)) {
            if (!intersectsLineString(flatCoordinates, ends[i - 1], ends[i], stride, extent)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * @module ol/geom/flat/reverse
 */
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 */
function coordinates(flatCoordinates, offset, end, stride) {
    while (offset < end - stride) {
        for (var i = 0; i < stride; ++i) {
            var tmp = flatCoordinates[offset + i];
            flatCoordinates[offset + i] = flatCoordinates[end - stride + i];
            flatCoordinates[end - stride + i] = tmp;
        }
        offset += stride;
        end -= stride;
    }
}

/**
 * @module ol/geom/flat/orient
 */
/**
 * Is the linear ring oriented clockwise in a coordinate system with a bottom-left
 * coordinate origin? For a coordinate system with a top-left coordinate origin,
 * the ring's orientation is clockwise when this function returns false.
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {boolean} Is clockwise.
 */
function linearRingIsClockwise(flatCoordinates, offset, end, stride) {
    // https://stackoverflow.com/q/1165647/clockwise-method#1165943
    // https://github.com/OSGeo/gdal/blob/master/gdal/ogr/ogrlinearring.cpp
    var edge = 0;
    var x1 = flatCoordinates[end - stride];
    var y1 = flatCoordinates[end - stride + 1];
    for (; offset < end; offset += stride) {
        var x2 = flatCoordinates[offset];
        var y2 = flatCoordinates[offset + 1];
        edge += (x2 - x1) * (y2 + y1);
        x1 = x2;
        y1 = y2;
    }
    return edge === 0 ? undefined : edge > 0;
}
/**
 * Determines if linear rings are oriented.  By default, left-hand orientation
 * is tested (first ring must be clockwise, remaining rings counter-clockwise).
 * To test for right-hand orientation, use the `opt_right` argument.
 *
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<number>} ends Array of end indexes.
 * @param {number} stride Stride.
 * @param {boolean} [opt_right] Test for right-hand orientation
 *     (counter-clockwise exterior ring and clockwise interior rings).
 * @return {boolean} Rings are correctly oriented.
 */
function linearRingsAreOriented(flatCoordinates, offset, ends, stride, opt_right) {
    var right = opt_right !== undefined ? opt_right : false;
    for (var i = 0, ii = ends.length; i < ii; ++i) {
        var end = ends[i];
        var isClockwise = linearRingIsClockwise(flatCoordinates, offset, end, stride);
        if (i === 0) {
            if ((right && isClockwise) || (!right && !isClockwise)) {
                return false;
            }
        }
        else {
            if ((right && !isClockwise) || (!right && isClockwise)) {
                return false;
            }
        }
        offset = end;
    }
    return true;
}
/**
 * Orient coordinates in a flat array of linear rings.  By default, rings
 * are oriented following the left-hand rule (clockwise for exterior and
 * counter-clockwise for interior rings).  To orient according to the
 * right-hand rule, use the `opt_right` argument.
 *
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {boolean} [opt_right] Follow the right-hand rule for orientation.
 * @return {number} End.
 */
function orientLinearRings(flatCoordinates, offset, ends, stride, opt_right) {
    var right = opt_right !== undefined ? opt_right : false;
    for (var i = 0, ii = ends.length; i < ii; ++i) {
        var end = ends[i];
        var isClockwise = linearRingIsClockwise(flatCoordinates, offset, end, stride);
        var reverse = i === 0
            ? (right && isClockwise) || (!right && !isClockwise)
            : (right && !isClockwise) || (!right && isClockwise);
        if (reverse) {
            coordinates(flatCoordinates, offset, end, stride);
        }
        offset = end;
    }
    return offset;
}

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
 * @classdesc
 * Polygon geometry.
 *
 * @api
 */
var Polygon = /** @class */ (function (_super) {
    __extends$1(Polygon, _super);
    /**
     * @param {!Array<Array<import("../coordinate.js").Coordinate>>|!Array<number>} coordinates
     *     Array of linear rings that define the polygon. The first linear ring of the
     *     array defines the outer-boundary or surface of the polygon. Each subsequent
     *     linear ring defines a hole in the surface of the polygon. A linear ring is
     *     an array of vertices' coordinates where the first coordinate and the last are
     *     equivalent. (For internal use, flat coordinates in combination with
     *     `opt_layout` and `opt_ends` are also accepted.)
     * @param {import("./GeometryLayout.js").default} [opt_layout] Layout.
     * @param {Array<number>} [opt_ends] Ends (for internal use with flat coordinates).
     */
    function Polygon(coordinates, opt_layout, opt_ends) {
        var _this = _super.call(this) || this;
        /**
         * @type {Array<number>}
         * @private
         */
        _this.ends_ = [];
        /**
         * @private
         * @type {number}
         */
        _this.flatInteriorPointRevision_ = -1;
        /**
         * @private
         * @type {import("../coordinate.js").Coordinate}
         */
        _this.flatInteriorPoint_ = null;
        /**
         * @private
         * @type {number}
         */
        _this.maxDelta_ = -1;
        /**
         * @private
         * @type {number}
         */
        _this.maxDeltaRevision_ = -1;
        /**
         * @private
         * @type {number}
         */
        _this.orientedRevision_ = -1;
        /**
         * @private
         * @type {Array<number>}
         */
        _this.orientedFlatCoordinates_ = null;
        if (opt_layout !== undefined && opt_ends) {
            _this.setFlatCoordinates(opt_layout, 
            /** @type {Array<number>} */ (coordinates));
            _this.ends_ = opt_ends;
        }
        else {
            _this.setCoordinates(
            /** @type {Array<Array<import("../coordinate.js").Coordinate>>} */ (coordinates), opt_layout);
        }
        return _this;
    }
    /**
     * Append the passed linear ring to this polygon.
     * @param {LinearRing} linearRing Linear ring.
     * @api
     */
    Polygon.prototype.appendLinearRing = function (linearRing) {
        if (!this.flatCoordinates) {
            this.flatCoordinates = linearRing.getFlatCoordinates().slice();
        }
        else {
            extend(this.flatCoordinates, linearRing.getFlatCoordinates());
        }
        this.ends_.push(this.flatCoordinates.length);
        this.changed();
    };
    /**
     * Make a complete copy of the geometry.
     * @return {!Polygon} Clone.
     * @api
     */
    Polygon.prototype.clone = function () {
        var polygon = new Polygon(this.flatCoordinates.slice(), this.layout, this.ends_.slice());
        polygon.applyProperties(this);
        return polygon;
    };
    /**
     * @param {number} x X.
     * @param {number} y Y.
     * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
     * @param {number} minSquaredDistance Minimum squared distance.
     * @return {number} Minimum squared distance.
     */
    Polygon.prototype.closestPointXY = function (x, y, closestPoint, minSquaredDistance) {
        if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
            return minSquaredDistance;
        }
        if (this.maxDeltaRevision_ != this.getRevision()) {
            this.maxDelta_ = Math.sqrt(arrayMaxSquaredDelta(this.flatCoordinates, 0, this.ends_, this.stride, 0));
            this.maxDeltaRevision_ = this.getRevision();
        }
        return assignClosestArrayPoint(this.flatCoordinates, 0, this.ends_, this.stride, this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
    };
    /**
     * @param {number} x X.
     * @param {number} y Y.
     * @return {boolean} Contains (x, y).
     */
    Polygon.prototype.containsXY = function (x, y) {
        return linearRingsContainsXY(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, x, y);
    };
    /**
     * Return the area of the polygon on projected plane.
     * @return {number} Area (on projected plane).
     * @api
     */
    Polygon.prototype.getArea = function () {
        return linearRings(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride);
    };
    /**
     * Get the coordinate array for this geometry.  This array has the structure
     * of a GeoJSON coordinate array for polygons.
     *
     * @param {boolean} [opt_right] Orient coordinates according to the right-hand
     *     rule (counter-clockwise for exterior and clockwise for interior rings).
     *     If `false`, coordinates will be oriented according to the left-hand rule
     *     (clockwise for exterior and counter-clockwise for interior rings).
     *     By default, coordinate orientation will depend on how the geometry was
     *     constructed.
     * @return {Array<Array<import("../coordinate.js").Coordinate>>} Coordinates.
     * @api
     */
    Polygon.prototype.getCoordinates = function (opt_right) {
        var flatCoordinates;
        if (opt_right !== undefined) {
            flatCoordinates = this.getOrientedFlatCoordinates().slice();
            orientLinearRings(flatCoordinates, 0, this.ends_, this.stride, opt_right);
        }
        else {
            flatCoordinates = this.flatCoordinates;
        }
        return inflateCoordinatesArray(flatCoordinates, 0, this.ends_, this.stride);
    };
    /**
     * @return {Array<number>} Ends.
     */
    Polygon.prototype.getEnds = function () {
        return this.ends_;
    };
    /**
     * @return {Array<number>} Interior point.
     */
    Polygon.prototype.getFlatInteriorPoint = function () {
        if (this.flatInteriorPointRevision_ != this.getRevision()) {
            var flatCenter = getCenter(this.getExtent());
            this.flatInteriorPoint_ = getInteriorPointOfArray(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, flatCenter, 0);
            this.flatInteriorPointRevision_ = this.getRevision();
        }
        return this.flatInteriorPoint_;
    };
    /**
     * Return an interior point of the polygon.
     * @return {Point} Interior point as XYM coordinate, where M is the
     * length of the horizontal intersection that the point belongs to.
     * @api
     */
    Polygon.prototype.getInteriorPoint = function () {
        return new Point(this.getFlatInteriorPoint(), GeometryLayout.XYM);
    };
    /**
     * Return the number of rings of the polygon,  this includes the exterior
     * ring and any interior rings.
     *
     * @return {number} Number of rings.
     * @api
     */
    Polygon.prototype.getLinearRingCount = function () {
        return this.ends_.length;
    };
    /**
     * Return the Nth linear ring of the polygon geometry. Return `null` if the
     * given index is out of range.
     * The exterior linear ring is available at index `0` and the interior rings
     * at index `1` and beyond.
     *
     * @param {number} index Index.
     * @return {LinearRing} Linear ring.
     * @api
     */
    Polygon.prototype.getLinearRing = function (index) {
        if (index < 0 || this.ends_.length <= index) {
            return null;
        }
        return new LinearRing(this.flatCoordinates.slice(index === 0 ? 0 : this.ends_[index - 1], this.ends_[index]), this.layout);
    };
    /**
     * Return the linear rings of the polygon.
     * @return {Array<LinearRing>} Linear rings.
     * @api
     */
    Polygon.prototype.getLinearRings = function () {
        var layout = this.layout;
        var flatCoordinates = this.flatCoordinates;
        var ends = this.ends_;
        var linearRings = [];
        var offset = 0;
        for (var i = 0, ii = ends.length; i < ii; ++i) {
            var end = ends[i];
            var linearRing = new LinearRing(flatCoordinates.slice(offset, end), layout);
            linearRings.push(linearRing);
            offset = end;
        }
        return linearRings;
    };
    /**
     * @return {Array<number>} Oriented flat coordinates.
     */
    Polygon.prototype.getOrientedFlatCoordinates = function () {
        if (this.orientedRevision_ != this.getRevision()) {
            var flatCoordinates = this.flatCoordinates;
            if (linearRingsAreOriented(flatCoordinates, 0, this.ends_, this.stride)) {
                this.orientedFlatCoordinates_ = flatCoordinates;
            }
            else {
                this.orientedFlatCoordinates_ = flatCoordinates.slice();
                this.orientedFlatCoordinates_.length = orientLinearRings(this.orientedFlatCoordinates_, 0, this.ends_, this.stride);
            }
            this.orientedRevision_ = this.getRevision();
        }
        return this.orientedFlatCoordinates_;
    };
    /**
     * @param {number} squaredTolerance Squared tolerance.
     * @return {Polygon} Simplified Polygon.
     * @protected
     */
    Polygon.prototype.getSimplifiedGeometryInternal = function (squaredTolerance) {
        var simplifiedFlatCoordinates = [];
        var simplifiedEnds = [];
        simplifiedFlatCoordinates.length = quantizeArray(this.flatCoordinates, 0, this.ends_, this.stride, Math.sqrt(squaredTolerance), simplifiedFlatCoordinates, 0, simplifiedEnds);
        return new Polygon(simplifiedFlatCoordinates, GeometryLayout.XY, simplifiedEnds);
    };
    /**
     * Get the type of this geometry.
     * @return {import("./GeometryType.js").default} Geometry type.
     * @api
     */
    Polygon.prototype.getType = function () {
        return GeometryType.POLYGON;
    };
    /**
     * Test if the geometry and the passed extent intersect.
     * @param {import("../extent.js").Extent} extent Extent.
     * @return {boolean} `true` if the geometry and the extent intersect.
     * @api
     */
    Polygon.prototype.intersectsExtent = function (extent) {
        return intersectsLinearRingArray(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, extent);
    };
    /**
     * Set the coordinates of the polygon.
     * @param {!Array<Array<import("../coordinate.js").Coordinate>>} coordinates Coordinates.
     * @param {import("./GeometryLayout.js").default} [opt_layout] Layout.
     * @api
     */
    Polygon.prototype.setCoordinates = function (coordinates, opt_layout) {
        this.setLayout(opt_layout, coordinates, 2);
        if (!this.flatCoordinates) {
            this.flatCoordinates = [];
        }
        var ends = deflateCoordinatesArray(this.flatCoordinates, 0, coordinates, this.stride, this.ends_);
        this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
        this.changed();
    };
    return Polygon;
}(SimpleGeometry));
/**
 * Create a polygon from an extent. The layout used is `XY`.
 * @param {import("../extent.js").Extent} extent The extent.
 * @return {Polygon} The polygon.
 * @api
 */
function fromExtent(extent) {
    var minX = extent[0];
    var minY = extent[1];
    var maxX = extent[2];
    var maxY = extent[3];
    var flatCoordinates = [
        minX,
        minY,
        minX,
        maxY,
        maxX,
        maxY,
        maxX,
        minY,
        minX,
        minY,
    ];
    return new Polygon(flatCoordinates, GeometryLayout.XY, [
        flatCoordinates.length,
    ]);
}

export { Polygon as P, fromExtent as f };
