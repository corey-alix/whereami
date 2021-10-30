import { a as assert } from './asserts-e0c6c4d5.js';

/**
 * @module ol/extent/Corner
 */
/**
 * Extent corner.
 * @enum {string}
 */
var Corner = {
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_RIGHT: 'bottom-right',
    TOP_LEFT: 'top-left',
    TOP_RIGHT: 'top-right',
};

/**
 * @module ol/extent/Relationship
 */
/**
 * Relationship to an extent.
 * @enum {number}
 */
var Relationship = {
    UNKNOWN: 0,
    INTERSECTING: 1,
    ABOVE: 2,
    RIGHT: 4,
    BELOW: 8,
    LEFT: 16,
};

/**
 * @module ol/extent
 */
/**
 * An array of numbers representing an extent: `[minx, miny, maxx, maxy]`.
 * @typedef {Array<number>} Extent
 * @api
 */
/**
 * Build an extent that includes all given coordinates.
 *
 * @param {Array<import("./coordinate.js").Coordinate>} coordinates Coordinates.
 * @return {Extent} Bounding extent.
 * @api
 */
function boundingExtent(coordinates) {
    var extent = createEmpty();
    for (var i = 0, ii = coordinates.length; i < ii; ++i) {
        extendCoordinate(extent, coordinates[i]);
    }
    return extent;
}
/**
 * Return extent increased by the provided value.
 * @param {Extent} extent Extent.
 * @param {number} value The amount by which the extent should be buffered.
 * @param {Extent} [opt_extent] Extent.
 * @return {Extent} Extent.
 * @api
 */
function buffer(extent, value, opt_extent) {
    if (opt_extent) {
        opt_extent[0] = extent[0] - value;
        opt_extent[1] = extent[1] - value;
        opt_extent[2] = extent[2] + value;
        opt_extent[3] = extent[3] + value;
        return opt_extent;
    }
    else {
        return [
            extent[0] - value,
            extent[1] - value,
            extent[2] + value,
            extent[3] + value,
        ];
    }
}
/**
 * Creates a clone of an extent.
 *
 * @param {Extent} extent Extent to clone.
 * @param {Extent} [opt_extent] Extent.
 * @return {Extent} The clone.
 */
function clone(extent, opt_extent) {
    if (opt_extent) {
        opt_extent[0] = extent[0];
        opt_extent[1] = extent[1];
        opt_extent[2] = extent[2];
        opt_extent[3] = extent[3];
        return opt_extent;
    }
    else {
        return extent.slice();
    }
}
/**
 * @param {Extent} extent Extent.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {number} Closest squared distance.
 */
function closestSquaredDistanceXY(extent, x, y) {
    var dx, dy;
    if (x < extent[0]) {
        dx = extent[0] - x;
    }
    else if (extent[2] < x) {
        dx = x - extent[2];
    }
    else {
        dx = 0;
    }
    if (y < extent[1]) {
        dy = extent[1] - y;
    }
    else if (extent[3] < y) {
        dy = y - extent[3];
    }
    else {
        dy = 0;
    }
    return dx * dx + dy * dy;
}
/**
 * Check if the passed coordinate is contained or on the edge of the extent.
 *
 * @param {Extent} extent Extent.
 * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
 * @return {boolean} The coordinate is contained in the extent.
 * @api
 */
function containsCoordinate(extent, coordinate) {
    return containsXY(extent, coordinate[0], coordinate[1]);
}
/**
 * Check if one extent contains another.
 *
 * An extent is deemed contained if it lies completely within the other extent,
 * including if they share one or more edges.
 *
 * @param {Extent} extent1 Extent 1.
 * @param {Extent} extent2 Extent 2.
 * @return {boolean} The second extent is contained by or on the edge of the
 *     first.
 * @api
 */
function containsExtent(extent1, extent2) {
    return (extent1[0] <= extent2[0] &&
        extent2[2] <= extent1[2] &&
        extent1[1] <= extent2[1] &&
        extent2[3] <= extent1[3]);
}
/**
 * Check if the passed coordinate is contained or on the edge of the extent.
 *
 * @param {Extent} extent Extent.
 * @param {number} x X coordinate.
 * @param {number} y Y coordinate.
 * @return {boolean} The x, y values are contained in the extent.
 * @api
 */
function containsXY(extent, x, y) {
    return extent[0] <= x && x <= extent[2] && extent[1] <= y && y <= extent[3];
}
/**
 * Get the relationship between a coordinate and extent.
 * @param {Extent} extent The extent.
 * @param {import("./coordinate.js").Coordinate} coordinate The coordinate.
 * @return {import("./extent/Relationship.js").default} The relationship (bitwise compare with
 *     import("./extent/Relationship.js").Relationship).
 */
function coordinateRelationship(extent, coordinate) {
    var minX = extent[0];
    var minY = extent[1];
    var maxX = extent[2];
    var maxY = extent[3];
    var x = coordinate[0];
    var y = coordinate[1];
    var relationship = Relationship.UNKNOWN;
    if (x < minX) {
        relationship = relationship | Relationship.LEFT;
    }
    else if (x > maxX) {
        relationship = relationship | Relationship.RIGHT;
    }
    if (y < minY) {
        relationship = relationship | Relationship.BELOW;
    }
    else if (y > maxY) {
        relationship = relationship | Relationship.ABOVE;
    }
    if (relationship === Relationship.UNKNOWN) {
        relationship = Relationship.INTERSECTING;
    }
    return relationship;
}
/**
 * Create an empty extent.
 * @return {Extent} Empty extent.
 * @api
 */
function createEmpty() {
    return [Infinity, Infinity, -Infinity, -Infinity];
}
/**
 * Create a new extent or update the provided extent.
 * @param {number} minX Minimum X.
 * @param {number} minY Minimum Y.
 * @param {number} maxX Maximum X.
 * @param {number} maxY Maximum Y.
 * @param {Extent} [opt_extent] Destination extent.
 * @return {Extent} Extent.
 */
function createOrUpdate(minX, minY, maxX, maxY, opt_extent) {
    if (opt_extent) {
        opt_extent[0] = minX;
        opt_extent[1] = minY;
        opt_extent[2] = maxX;
        opt_extent[3] = maxY;
        return opt_extent;
    }
    else {
        return [minX, minY, maxX, maxY];
    }
}
/**
 * Create a new empty extent or make the provided one empty.
 * @param {Extent} [opt_extent] Extent.
 * @return {Extent} Extent.
 */
function createOrUpdateEmpty(opt_extent) {
    return createOrUpdate(Infinity, Infinity, -Infinity, -Infinity, opt_extent);
}
/**
 * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
 * @param {Extent} [opt_extent] Extent.
 * @return {Extent} Extent.
 */
function createOrUpdateFromCoordinate(coordinate, opt_extent) {
    var x = coordinate[0];
    var y = coordinate[1];
    return createOrUpdate(x, y, x, y, opt_extent);
}
/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {Extent} [opt_extent] Extent.
 * @return {Extent} Extent.
 */
function createOrUpdateFromFlatCoordinates(flatCoordinates, offset, end, stride, opt_extent) {
    var extent = createOrUpdateEmpty(opt_extent);
    return extendFlatCoordinates(extent, flatCoordinates, offset, end, stride);
}
/**
 * Determine if two extents are equivalent.
 * @param {Extent} extent1 Extent 1.
 * @param {Extent} extent2 Extent 2.
 * @return {boolean} The two extents are equivalent.
 * @api
 */
function equals(extent1, extent2) {
    return (extent1[0] == extent2[0] &&
        extent1[2] == extent2[2] &&
        extent1[1] == extent2[1] &&
        extent1[3] == extent2[3]);
}
/**
 * Modify an extent to include another extent.
 * @param {Extent} extent1 The extent to be modified.
 * @param {Extent} extent2 The extent that will be included in the first.
 * @return {Extent} A reference to the first (extended) extent.
 * @api
 */
function extend(extent1, extent2) {
    if (extent2[0] < extent1[0]) {
        extent1[0] = extent2[0];
    }
    if (extent2[2] > extent1[2]) {
        extent1[2] = extent2[2];
    }
    if (extent2[1] < extent1[1]) {
        extent1[1] = extent2[1];
    }
    if (extent2[3] > extent1[3]) {
        extent1[3] = extent2[3];
    }
    return extent1;
}
/**
 * @param {Extent} extent Extent.
 * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
 */
function extendCoordinate(extent, coordinate) {
    if (coordinate[0] < extent[0]) {
        extent[0] = coordinate[0];
    }
    if (coordinate[0] > extent[2]) {
        extent[2] = coordinate[0];
    }
    if (coordinate[1] < extent[1]) {
        extent[1] = coordinate[1];
    }
    if (coordinate[1] > extent[3]) {
        extent[3] = coordinate[1];
    }
}
/**
 * @param {Extent} extent Extent.
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {Extent} Extent.
 */
function extendFlatCoordinates(extent, flatCoordinates, offset, end, stride) {
    for (; offset < end; offset += stride) {
        extendXY(extent, flatCoordinates[offset], flatCoordinates[offset + 1]);
    }
    return extent;
}
/**
 * @param {Extent} extent Extent.
 * @param {number} x X.
 * @param {number} y Y.
 */
function extendXY(extent, x, y) {
    extent[0] = Math.min(extent[0], x);
    extent[1] = Math.min(extent[1], y);
    extent[2] = Math.max(extent[2], x);
    extent[3] = Math.max(extent[3], y);
}
/**
 * This function calls `callback` for each corner of the extent. If the
 * callback returns a truthy value the function returns that value
 * immediately. Otherwise the function returns `false`.
 * @param {Extent} extent Extent.
 * @param {function(import("./coordinate.js").Coordinate): S} callback Callback.
 * @return {S|boolean} Value.
 * @template S
 */
function forEachCorner(extent, callback) {
    var val;
    val = callback(getBottomLeft(extent));
    if (val) {
        return val;
    }
    val = callback(getBottomRight(extent));
    if (val) {
        return val;
    }
    val = callback(getTopRight(extent));
    if (val) {
        return val;
    }
    val = callback(getTopLeft(extent));
    if (val) {
        return val;
    }
    return false;
}
/**
 * Get the size of an extent.
 * @param {Extent} extent Extent.
 * @return {number} Area.
 * @api
 */
function getArea(extent) {
    var area = 0;
    if (!isEmpty(extent)) {
        area = getWidth(extent) * getHeight(extent);
    }
    return area;
}
/**
 * Get the bottom left coordinate of an extent.
 * @param {Extent} extent Extent.
 * @return {import("./coordinate.js").Coordinate} Bottom left coordinate.
 * @api
 */
function getBottomLeft(extent) {
    return [extent[0], extent[1]];
}
/**
 * Get the bottom right coordinate of an extent.
 * @param {Extent} extent Extent.
 * @return {import("./coordinate.js").Coordinate} Bottom right coordinate.
 * @api
 */
function getBottomRight(extent) {
    return [extent[2], extent[1]];
}
/**
 * Get the center coordinate of an extent.
 * @param {Extent} extent Extent.
 * @return {import("./coordinate.js").Coordinate} Center.
 * @api
 */
function getCenter(extent) {
    return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
}
/**
 * Get a corner coordinate of an extent.
 * @param {Extent} extent Extent.
 * @param {import("./extent/Corner.js").default} corner Corner.
 * @return {import("./coordinate.js").Coordinate} Corner coordinate.
 */
function getCorner(extent, corner) {
    var coordinate;
    if (corner === Corner.BOTTOM_LEFT) {
        coordinate = getBottomLeft(extent);
    }
    else if (corner === Corner.BOTTOM_RIGHT) {
        coordinate = getBottomRight(extent);
    }
    else if (corner === Corner.TOP_LEFT) {
        coordinate = getTopLeft(extent);
    }
    else if (corner === Corner.TOP_RIGHT) {
        coordinate = getTopRight(extent);
    }
    else {
        assert(false, 13); // Invalid corner
    }
    return coordinate;
}
/**
 * @param {import("./coordinate.js").Coordinate} center Center.
 * @param {number} resolution Resolution.
 * @param {number} rotation Rotation.
 * @param {import("./size.js").Size} size Size.
 * @param {Extent} [opt_extent] Destination extent.
 * @return {Extent} Extent.
 */
function getForViewAndSize(center, resolution, rotation, size, opt_extent) {
    var dx = (resolution * size[0]) / 2;
    var dy = (resolution * size[1]) / 2;
    var cosRotation = Math.cos(rotation);
    var sinRotation = Math.sin(rotation);
    var xCos = dx * cosRotation;
    var xSin = dx * sinRotation;
    var yCos = dy * cosRotation;
    var ySin = dy * sinRotation;
    var x = center[0];
    var y = center[1];
    var x0 = x - xCos + ySin;
    var x1 = x - xCos - ySin;
    var x2 = x + xCos - ySin;
    var x3 = x + xCos + ySin;
    var y0 = y - xSin - yCos;
    var y1 = y - xSin + yCos;
    var y2 = y + xSin + yCos;
    var y3 = y + xSin - yCos;
    return createOrUpdate(Math.min(x0, x1, x2, x3), Math.min(y0, y1, y2, y3), Math.max(x0, x1, x2, x3), Math.max(y0, y1, y2, y3), opt_extent);
}
/**
 * Get the height of an extent.
 * @param {Extent} extent Extent.
 * @return {number} Height.
 * @api
 */
function getHeight(extent) {
    return extent[3] - extent[1];
}
/**
 * Get the intersection of two extents.
 * @param {Extent} extent1 Extent 1.
 * @param {Extent} extent2 Extent 2.
 * @param {Extent} [opt_extent] Optional extent to populate with intersection.
 * @return {Extent} Intersecting extent.
 * @api
 */
function getIntersection(extent1, extent2, opt_extent) {
    var intersection = opt_extent ? opt_extent : createEmpty();
    if (intersects(extent1, extent2)) {
        if (extent1[0] > extent2[0]) {
            intersection[0] = extent1[0];
        }
        else {
            intersection[0] = extent2[0];
        }
        if (extent1[1] > extent2[1]) {
            intersection[1] = extent1[1];
        }
        else {
            intersection[1] = extent2[1];
        }
        if (extent1[2] < extent2[2]) {
            intersection[2] = extent1[2];
        }
        else {
            intersection[2] = extent2[2];
        }
        if (extent1[3] < extent2[3]) {
            intersection[3] = extent1[3];
        }
        else {
            intersection[3] = extent2[3];
        }
    }
    else {
        createOrUpdateEmpty(intersection);
    }
    return intersection;
}
/**
 * Get the top left coordinate of an extent.
 * @param {Extent} extent Extent.
 * @return {import("./coordinate.js").Coordinate} Top left coordinate.
 * @api
 */
function getTopLeft(extent) {
    return [extent[0], extent[3]];
}
/**
 * Get the top right coordinate of an extent.
 * @param {Extent} extent Extent.
 * @return {import("./coordinate.js").Coordinate} Top right coordinate.
 * @api
 */
function getTopRight(extent) {
    return [extent[2], extent[3]];
}
/**
 * Get the width of an extent.
 * @param {Extent} extent Extent.
 * @return {number} Width.
 * @api
 */
function getWidth(extent) {
    return extent[2] - extent[0];
}
/**
 * Determine if one extent intersects another.
 * @param {Extent} extent1 Extent 1.
 * @param {Extent} extent2 Extent.
 * @return {boolean} The two extents intersect.
 * @api
 */
function intersects(extent1, extent2) {
    return (extent1[0] <= extent2[2] &&
        extent1[2] >= extent2[0] &&
        extent1[1] <= extent2[3] &&
        extent1[3] >= extent2[1]);
}
/**
 * Determine if an extent is empty.
 * @param {Extent} extent Extent.
 * @return {boolean} Is empty.
 * @api
 */
function isEmpty(extent) {
    return extent[2] < extent[0] || extent[3] < extent[1];
}
/**
 * @param {Extent} extent Extent.
 * @param {Extent} [opt_extent] Extent.
 * @return {Extent} Extent.
 */
function returnOrUpdate(extent, opt_extent) {
    if (opt_extent) {
        opt_extent[0] = extent[0];
        opt_extent[1] = extent[1];
        opt_extent[2] = extent[2];
        opt_extent[3] = extent[3];
        return opt_extent;
    }
    else {
        return extent;
    }
}
/**
 * Determine if the segment between two coordinates intersects (crosses,
 * touches, or is contained by) the provided extent.
 * @param {Extent} extent The extent.
 * @param {import("./coordinate.js").Coordinate} start Segment start coordinate.
 * @param {import("./coordinate.js").Coordinate} end Segment end coordinate.
 * @return {boolean} The segment intersects the extent.
 */
function intersectsSegment(extent, start, end) {
    var intersects = false;
    var startRel = coordinateRelationship(extent, start);
    var endRel = coordinateRelationship(extent, end);
    if (startRel === Relationship.INTERSECTING ||
        endRel === Relationship.INTERSECTING) {
        intersects = true;
    }
    else {
        var minX = extent[0];
        var minY = extent[1];
        var maxX = extent[2];
        var maxY = extent[3];
        var startX = start[0];
        var startY = start[1];
        var endX = end[0];
        var endY = end[1];
        var slope = (endY - startY) / (endX - startX);
        var x = void 0, y = void 0;
        if (!!(endRel & Relationship.ABOVE) && !(startRel & Relationship.ABOVE)) {
            // potentially intersects top
            x = endX - (endY - maxY) / slope;
            intersects = x >= minX && x <= maxX;
        }
        if (!intersects &&
            !!(endRel & Relationship.RIGHT) &&
            !(startRel & Relationship.RIGHT)) {
            // potentially intersects right
            y = endY - (endX - maxX) * slope;
            intersects = y >= minY && y <= maxY;
        }
        if (!intersects &&
            !!(endRel & Relationship.BELOW) &&
            !(startRel & Relationship.BELOW)) {
            // potentially intersects bottom
            x = endX - (endY - minY) / slope;
            intersects = x >= minX && x <= maxX;
        }
        if (!intersects &&
            !!(endRel & Relationship.LEFT) &&
            !(startRel & Relationship.LEFT)) {
            // potentially intersects left
            y = endY - (endX - minX) * slope;
            intersects = y >= minY && y <= maxY;
        }
    }
    return intersects;
}
/**
 * Modifies the provided extent in-place to be within the real world
 * extent.
 *
 * @param {Extent} extent Extent.
 * @param {import("./proj/Projection.js").default} projection Projection
 * @return {Extent} The extent within the real world extent.
 */
function wrapX(extent, projection) {
    var projectionExtent = projection.getExtent();
    var center = getCenter(extent);
    if (projection.canWrapX() &&
        (center[0] < projectionExtent[0] || center[0] >= projectionExtent[2])) {
        var worldWidth = getWidth(projectionExtent);
        var worldsAway = Math.floor((center[0] - projectionExtent[0]) / worldWidth);
        var offset = worldsAway * worldWidth;
        extent[0] -= offset;
        extent[2] -= offset;
    }
    return extent;
}

export { buffer as A, createOrUpdate as B, extendCoordinate as C, wrapX as D, getArea as E, boundingExtent as F, extend as G, getCorner as H, Corner as I, Relationship as R, getIntersection as a, getHeight as b, getForViewAndSize as c, getCenter as d, equals as e, createOrUpdateEmpty as f, getWidth as g, clone as h, isEmpty as i, createEmpty as j, createOrUpdateFromFlatCoordinates as k, closestSquaredDistanceXY as l, forEachCorner as m, extendFlatCoordinates as n, intersects as o, containsExtent as p, intersectsSegment as q, returnOrUpdate as r, createOrUpdateFromCoordinate as s, containsXY as t, getTopLeft as u, getTopRight as v, getBottomRight as w, getBottomLeft as x, containsCoordinate as y, coordinateRelationship as z };
