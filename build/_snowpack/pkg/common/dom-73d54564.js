import { W as WORKER_OFFSCREEN_CANVAS } from './has-ff434dd0.js';

/**
 * @module ol/dom
 */
//FIXME Move this function to the canvas module
/**
 * Create an html canvas element and returns its 2d context.
 * @param {number} [opt_width] Canvas width.
 * @param {number} [opt_height] Canvas height.
 * @param {Array<HTMLCanvasElement>} [opt_canvasPool] Canvas pool to take existing canvas from.
 * @param {CanvasRenderingContext2DSettings} [opt_Context2DSettings] CanvasRenderingContext2DSettings
 * @return {CanvasRenderingContext2D} The context.
 */
function createCanvasContext2D(opt_width, opt_height, opt_canvasPool, opt_Context2DSettings) {
    /** @type {HTMLCanvasElement|OffscreenCanvas} */
    var canvas;
    if (opt_canvasPool && opt_canvasPool.length) {
        canvas = opt_canvasPool.shift();
    }
    else if (WORKER_OFFSCREEN_CANVAS) {
        canvas = new OffscreenCanvas(opt_width || 300, opt_height || 300);
    }
    else {
        canvas = document.createElement('canvas');
        canvas.style.all = 'unset';
    }
    if (opt_width) {
        canvas.width = opt_width;
    }
    if (opt_height) {
        canvas.height = opt_height;
    }
    //FIXME Allow OffscreenCanvasRenderingContext2D as return type
    return /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d', opt_Context2DSettings));
}
/**
 * @param {Node} newNode Node to replace old node
 * @param {Node} oldNode The node to be replaced
 */
function replaceNode(newNode, oldNode) {
    var parent = oldNode.parentNode;
    if (parent) {
        parent.replaceChild(newNode, oldNode);
    }
}
/**
 * @param {Node} node The node to remove.
 * @return {Node} The node that was removed or null.
 */
function removeNode(node) {
    return node && node.parentNode ? node.parentNode.removeChild(node) : null;
}
/**
 * @param {Node} node The node to remove the children from.
 */
function removeChildren(node) {
    while (node.lastChild) {
        node.removeChild(node.lastChild);
    }
}
/**
 * Transform the children of a parent node so they match the
 * provided list of children.  This function aims to efficiently
 * remove, add, and reorder child nodes while maintaining a simple
 * implementation (it is not guaranteed to minimize DOM operations).
 * @param {Node} node The parent node whose children need reworking.
 * @param {Array<Node>} children The desired children.
 */
function replaceChildren(node, children) {
    var oldChildren = node.childNodes;
    for (var i = 0; true; ++i) {
        var oldChild = oldChildren[i];
        var newChild = children[i];
        // check if our work is done
        if (!oldChild && !newChild) {
            break;
        }
        // check if children match
        if (oldChild === newChild) {
            continue;
        }
        // check if a new child needs to be added
        if (!oldChild) {
            node.appendChild(newChild);
            continue;
        }
        // check if an old child needs to be removed
        if (!newChild) {
            node.removeChild(oldChild);
            --i;
            continue;
        }
        // reorder
        node.insertBefore(newChild, oldChild);
    }
}

export { removeNode as a, removeChildren as b, replaceNode as c, createCanvasContext2D as d, replaceChildren as r };
