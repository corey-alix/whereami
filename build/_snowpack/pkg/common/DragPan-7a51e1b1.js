import { E as EventType, B as BaseObject, k as getValues, a as assert, T as TRUE, F as FALSE } from './asserts-e0c6c4d5.js';
import { l as linear, e as easeOut } from './easing-827db2b3.js';
import { a as WEBKIT, M as MAC } from './has-ff434dd0.js';
import { s as scale, r as rotate } from './coordinate-762b4bbd.js';

/**
 * @module ol/MapBrowserEventType
 */
/**
 * Constants for event names.
 * @enum {string}
 */
var MapBrowserEventType = {
    /**
     * A true single click with no dragging and no double click. Note that this
     * event is delayed by 250 ms to ensure that it is not a double click.
     * @event module:ol/MapBrowserEvent~MapBrowserEvent#singleclick
     * @api
     */
    SINGLECLICK: 'singleclick',
    /**
     * A click with no dragging. A double click will fire two of this.
     * @event module:ol/MapBrowserEvent~MapBrowserEvent#click
     * @api
     */
    CLICK: EventType.CLICK,
    /**
     * A true double click, with no dragging.
     * @event module:ol/MapBrowserEvent~MapBrowserEvent#dblclick
     * @api
     */
    DBLCLICK: EventType.DBLCLICK,
    /**
     * Triggered when a pointer is dragged.
     * @event module:ol/MapBrowserEvent~MapBrowserEvent#pointerdrag
     * @api
     */
    POINTERDRAG: 'pointerdrag',
    /**
     * Triggered when a pointer is moved. Note that on touch devices this is
     * triggered when the map is panned, so is not the same as mousemove.
     * @event module:ol/MapBrowserEvent~MapBrowserEvent#pointermove
     * @api
     */
    POINTERMOVE: 'pointermove',
    POINTERDOWN: 'pointerdown',
    POINTERUP: 'pointerup',
    POINTEROVER: 'pointerover',
    POINTEROUT: 'pointerout',
    POINTERENTER: 'pointerenter',
    POINTERLEAVE: 'pointerleave',
    POINTERCANCEL: 'pointercancel',
};
/***
 * @typedef {'singleclick'|'click'|'dblclick'|'pointerdrag'|'pointermove'} Types
 */

/**
 * @module ol/interaction/Property
 */
/**
 * @enum {string}
 */
var InteractionProperty = {
    ACTIVE: 'active',
};

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
/***
 * @template Return
 * @typedef {import("../Observable").OnSignature<import("../Observable").EventTypes, import("../events/Event.js").default, Return> &
 *   import("../Observable").OnSignature<import("../ObjectEventType").Types|
 *     'change:active', import("../Object").ObjectEvent, Return> &
 *   import("../Observable").CombinedOnSignature<import("../Observable").EventTypes|import("../ObjectEventType").Types|
 *     'change:active', Return>} InteractionOnSignature
 */
/**
 * Object literal with config options for interactions.
 * @typedef {Object} InteractionOptions
 * @property {function(import("../MapBrowserEvent.js").default):boolean} handleEvent
 * Method called by the map to notify the interaction that a browser event was
 * dispatched to the map. If the function returns a falsy value, propagation of
 * the event to other interactions in the map's interactions chain will be
 * prevented (this includes functions with no explicit return). The interactions
 * are traversed in reverse order of the interactions collection of the map.
 */
/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * User actions that change the state of the map. Some are similar to controls,
 * but are not associated with a DOM element.
 * For example, {@link module:ol/interaction/KeyboardZoom~KeyboardZoom} is
 * functionally the same as {@link module:ol/control/Zoom~Zoom}, but triggered
 * by a keyboard event not a button element event.
 * Although interactions do not have a DOM element, some of them do render
 * vectors and so are visible on the screen.
 * @api
 */
var Interaction = /** @class */ (function (_super) {
    __extends(Interaction, _super);
    /**
     * @param {InteractionOptions} [opt_options] Options.
     */
    function Interaction(opt_options) {
        var _this = _super.call(this) || this;
        /***
         * @type {InteractionOnSignature<import("../events").EventsKey>}
         */
        _this.on;
        /***
         * @type {InteractionOnSignature<import("../events").EventsKey>}
         */
        _this.once;
        /***
         * @type {InteractionOnSignature<void>}
         */
        _this.un;
        if (opt_options && opt_options.handleEvent) {
            _this.handleEvent = opt_options.handleEvent;
        }
        /**
         * @private
         * @type {import("../PluggableMap.js").default}
         */
        _this.map_ = null;
        _this.setActive(true);
        return _this;
    }
    /**
     * Return whether the interaction is currently active.
     * @return {boolean} `true` if the interaction is active, `false` otherwise.
     * @observable
     * @api
     */
    Interaction.prototype.getActive = function () {
        return /** @type {boolean} */ (this.get(InteractionProperty.ACTIVE));
    };
    /**
     * Get the map associated with this interaction.
     * @return {import("../PluggableMap.js").default} Map.
     * @api
     */
    Interaction.prototype.getMap = function () {
        return this.map_;
    };
    /**
     * Handles the {@link module:ol/MapBrowserEvent map browser event}.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
     * @return {boolean} `false` to stop event propagation.
     * @api
     */
    Interaction.prototype.handleEvent = function (mapBrowserEvent) {
        return true;
    };
    /**
     * Activate or deactivate the interaction.
     * @param {boolean} active Active.
     * @observable
     * @api
     */
    Interaction.prototype.setActive = function (active) {
        this.set(InteractionProperty.ACTIVE, active);
    };
    /**
     * Remove the interaction from its current map and attach it to the new map.
     * Subclasses may set up event handlers to get notified about changes to
     * the map here.
     * @param {import("../PluggableMap.js").default} map Map.
     */
    Interaction.prototype.setMap = function (map) {
        this.map_ = map;
    };
    return Interaction;
}(BaseObject));
/**
 * @param {import("../View.js").default} view View.
 * @param {import("../coordinate.js").Coordinate} delta Delta.
 * @param {number} [opt_duration] Duration.
 */
function pan(view, delta, opt_duration) {
    var currentCenter = view.getCenterInternal();
    if (currentCenter) {
        var center = [currentCenter[0] + delta[0], currentCenter[1] + delta[1]];
        view.animateInternal({
            duration: opt_duration !== undefined ? opt_duration : 250,
            easing: linear,
            center: view.getConstrainedCenter(center),
        });
    }
}
/**
 * @param {import("../View.js").default} view View.
 * @param {number} delta Delta from previous zoom level.
 * @param {import("../coordinate.js").Coordinate} [opt_anchor] Anchor coordinate in the user projection.
 * @param {number} [opt_duration] Duration.
 */
function zoomByDelta(view, delta, opt_anchor, opt_duration) {
    var currentZoom = view.getZoom();
    if (currentZoom === undefined) {
        return;
    }
    var newZoom = view.getConstrainedZoom(currentZoom + delta);
    var newResolution = view.getResolutionForZoom(newZoom);
    if (view.getAnimating()) {
        view.cancelAnimations();
    }
    view.animate({
        resolution: newResolution,
        anchor: opt_anchor,
        duration: opt_duration !== undefined ? opt_duration : 250,
        easing: easeOut,
    });
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
 * @typedef {Object} Options
 * @property {function(import("../MapBrowserEvent.js").default):boolean} [handleDownEvent]
 * Function handling "down" events. If the function returns `true` then a drag
 * sequence is started.
 * @property {function(import("../MapBrowserEvent.js").default):void} [handleDragEvent]
 * Function handling "drag" events. This function is called on "move" events
 * during a drag sequence.
 * @property {function(import("../MapBrowserEvent.js").default):boolean} [handleEvent]
 * Method called by the map to notify the interaction that a browser event was
 * dispatched to the map. The function may return `false` to prevent the
 * propagation of the event to other interactions in the map's interactions
 * chain.
 * @property {function(import("../MapBrowserEvent.js").default):void} [handleMoveEvent]
 * Function handling "move" events. This function is called on "move" events.
 * This functions is also called during a drag sequence, so during a drag
 * sequence both the `handleDragEvent` function and this function are called.
 * If `handleDownEvent` is defined and it returns true this function will not
 * be called during a drag sequence.
 * @property {function(import("../MapBrowserEvent.js").default):boolean} [handleUpEvent]
 *  Function handling "up" events. If the function returns `false` then the
 * current drag sequence is stopped.
 * @property {function(boolean):boolean} [stopDown]
 * Should the down event be propagated to other interactions, or should be
 * stopped?
 */
/**
 * @classdesc
 * Base class that calls user-defined functions on `down`, `move` and `up`
 * events. This class also manages "drag sequences".
 *
 * When the `handleDownEvent` user function returns `true` a drag sequence is
 * started. During a drag sequence the `handleDragEvent` user function is
 * called on `move` events. The drag sequence ends when the `handleUpEvent`
 * user function is called and returns `false`.
 * @api
 */
var PointerInteraction = /** @class */ (function (_super) {
    __extends$1(PointerInteraction, _super);
    /**
     * @param {Options} [opt_options] Options.
     */
    function PointerInteraction(opt_options) {
        var _this = this;
        var options = opt_options ? opt_options : {};
        _this = _super.call(this, 
        /** @type {import("./Interaction.js").InteractionOptions} */ (options)) || this;
        if (options.handleDownEvent) {
            _this.handleDownEvent = options.handleDownEvent;
        }
        if (options.handleDragEvent) {
            _this.handleDragEvent = options.handleDragEvent;
        }
        if (options.handleMoveEvent) {
            _this.handleMoveEvent = options.handleMoveEvent;
        }
        if (options.handleUpEvent) {
            _this.handleUpEvent = options.handleUpEvent;
        }
        if (options.stopDown) {
            _this.stopDown = options.stopDown;
        }
        /**
         * @type {boolean}
         * @protected
         */
        _this.handlingDownUpSequence = false;
        /**
         * @type {!Object<string, PointerEvent>}
         * @private
         */
        _this.trackedPointers_ = {};
        /**
         * @type {Array<PointerEvent>}
         * @protected
         */
        _this.targetPointers = [];
        return _this;
    }
    /**
     * Returns the current number of pointers involved in the interaction,
     * e.g. `2` when two fingers are used.
     * @return {number} The number of pointers.
     * @api
     */
    PointerInteraction.prototype.getPointerCount = function () {
        return this.targetPointers.length;
    };
    /**
     * Handle pointer down events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     * @return {boolean} If the event was consumed.
     * @protected
     */
    PointerInteraction.prototype.handleDownEvent = function (mapBrowserEvent) {
        return false;
    };
    /**
     * Handle pointer drag events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     * @protected
     */
    PointerInteraction.prototype.handleDragEvent = function (mapBrowserEvent) { };
    /**
     * Handles the {@link module:ol/MapBrowserEvent map browser event} and may call into
     * other functions, if event sequences like e.g. 'drag' or 'down-up' etc. are
     * detected.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
     * @return {boolean} `false` to stop event propagation.
     * @api
     */
    PointerInteraction.prototype.handleEvent = function (mapBrowserEvent) {
        if (!mapBrowserEvent.originalEvent) {
            return true;
        }
        var stopEvent = false;
        this.updateTrackedPointers_(mapBrowserEvent);
        if (this.handlingDownUpSequence) {
            if (mapBrowserEvent.type == MapBrowserEventType.POINTERDRAG) {
                this.handleDragEvent(mapBrowserEvent);
                // prevent page scrolling during dragging
                mapBrowserEvent.originalEvent.preventDefault();
            }
            else if (mapBrowserEvent.type == MapBrowserEventType.POINTERUP) {
                var handledUp = this.handleUpEvent(mapBrowserEvent);
                this.handlingDownUpSequence =
                    handledUp && this.targetPointers.length > 0;
            }
        }
        else {
            if (mapBrowserEvent.type == MapBrowserEventType.POINTERDOWN) {
                var handled = this.handleDownEvent(mapBrowserEvent);
                this.handlingDownUpSequence = handled;
                stopEvent = this.stopDown(handled);
            }
            else if (mapBrowserEvent.type == MapBrowserEventType.POINTERMOVE) {
                this.handleMoveEvent(mapBrowserEvent);
            }
        }
        return !stopEvent;
    };
    /**
     * Handle pointer move events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     * @protected
     */
    PointerInteraction.prototype.handleMoveEvent = function (mapBrowserEvent) { };
    /**
     * Handle pointer up events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     * @return {boolean} If the event was consumed.
     * @protected
     */
    PointerInteraction.prototype.handleUpEvent = function (mapBrowserEvent) {
        return false;
    };
    /**
     * This function is used to determine if "down" events should be propagated
     * to other interactions or should be stopped.
     * @param {boolean} handled Was the event handled by the interaction?
     * @return {boolean} Should the `down` event be stopped?
     */
    PointerInteraction.prototype.stopDown = function (handled) {
        return handled;
    };
    /**
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     * @private
     */
    PointerInteraction.prototype.updateTrackedPointers_ = function (mapBrowserEvent) {
        if (isPointerDraggingEvent(mapBrowserEvent)) {
            var event_1 = mapBrowserEvent.originalEvent;
            var id = event_1.pointerId.toString();
            if (mapBrowserEvent.type == MapBrowserEventType.POINTERUP) {
                delete this.trackedPointers_[id];
            }
            else if (mapBrowserEvent.type == MapBrowserEventType.POINTERDOWN) {
                this.trackedPointers_[id] = event_1;
            }
            else if (id in this.trackedPointers_) {
                // update only when there was a pointerdown event for this pointer
                this.trackedPointers_[id] = event_1;
            }
            this.targetPointers = getValues(this.trackedPointers_);
        }
    };
    return PointerInteraction;
}(Interaction));
/**
 * @param {Array<PointerEvent>} pointerEvents List of events.
 * @return {import("../pixel.js").Pixel} Centroid pixel.
 */
function centroid(pointerEvents) {
    var length = pointerEvents.length;
    var clientX = 0;
    var clientY = 0;
    for (var i = 0; i < length; i++) {
        clientX += pointerEvents[i].clientX;
        clientY += pointerEvents[i].clientY;
    }
    return [clientX / length, clientY / length];
}
/**
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
 * @return {boolean} Whether the event is a pointerdown, pointerdrag
 *     or pointerup event.
 */
function isPointerDraggingEvent(mapBrowserEvent) {
    var type = mapBrowserEvent.type;
    return (type === MapBrowserEventType.POINTERDOWN ||
        type === MapBrowserEventType.POINTERDRAG ||
        type === MapBrowserEventType.POINTERUP);
}

/**
 * @module ol/events/condition
 */
/**
 * A function that takes an {@link module:ol/MapBrowserEvent} and returns a
 * `{boolean}`. If the condition is met, true should be returned.
 *
 * @typedef {function(this: ?, import("../MapBrowserEvent.js").default): boolean} Condition
 */
/**
 * Creates a condition function that passes when all provided conditions pass.
 * @param {...Condition} var_args Conditions to check.
 * @return {Condition} Condition function.
 */
function all(var_args) {
    var conditions = arguments;
    /**
     * @param {import("../MapBrowserEvent.js").default} event Event.
     * @return {boolean} All conditions passed.
     */
    return function (event) {
        var pass = true;
        for (var i = 0, ii = conditions.length; i < ii; ++i) {
            pass = pass && conditions[i](event);
            if (!pass) {
                break;
            }
        }
        return pass;
    };
}
/**
 * Return `true` if only the alt-key and shift-key is pressed, `false` otherwise
 * (e.g. when additionally the platform-modifier-key is pressed).
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True if only the alt and shift keys are pressed.
 * @api
 */
var altShiftKeysOnly = function (mapBrowserEvent) {
    var originalEvent = /** @type {KeyboardEvent|MouseEvent|TouchEvent} */ (mapBrowserEvent.originalEvent);
    return (originalEvent.altKey &&
        !(originalEvent.metaKey || originalEvent.ctrlKey) &&
        originalEvent.shiftKey);
};
/**
 * Return `true` if the map has the focus. This condition requires a map target
 * element with a `tabindex` attribute, e.g. `<div id="map" tabindex="1">`.
 *
 * @param {import("../MapBrowserEvent.js").default} event Map browser event.
 * @return {boolean} The map has the focus.
 * @api
 */
var focus = function (event) {
    return event.target.getTargetElement().contains(document.activeElement);
};
/**
 * Return `true` if the map has the focus or no 'tabindex' attribute set.
 *
 * @param {import("../MapBrowserEvent.js").default} event Map browser event.
 * @return {boolean} The map container has the focus or no 'tabindex' attribute.
 */
var focusWithTabindex = function (event) {
    return event.map.getTargetElement().hasAttribute('tabindex')
        ? focus(event)
        : true;
};
/**
 * Return always true.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True.
 * @api
 */
var always = TRUE;
/**
 * Return `true` if the event has an "action"-producing mouse button.
 *
 * By definition, this includes left-click on windows/linux, and left-click
 * without the ctrl key on Macs.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} The result.
 */
var mouseActionButton = function (mapBrowserEvent) {
    var originalEvent = /** @type {MouseEvent} */ (mapBrowserEvent.originalEvent);
    return originalEvent.button == 0 && !(WEBKIT && MAC && originalEvent.ctrlKey);
};
/**
 * Return `true` if no modifier key (alt-, shift- or platform-modifier-key) is
 * pressed.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True only if there no modifier keys are pressed.
 * @api
 */
var noModifierKeys = function (mapBrowserEvent) {
    var originalEvent = /** @type {KeyboardEvent|MouseEvent|TouchEvent} */ (mapBrowserEvent.originalEvent);
    return (!originalEvent.altKey &&
        !(originalEvent.metaKey || originalEvent.ctrlKey) &&
        !originalEvent.shiftKey);
};
/**
 * Return `true` if only the shift-key is pressed, `false` otherwise (e.g. when
 * additionally the alt-key is pressed).
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True if only the shift key is pressed.
 * @api
 */
var shiftKeyOnly = function (mapBrowserEvent) {
    var originalEvent = /** @type {KeyboardEvent|MouseEvent|TouchEvent} */ (mapBrowserEvent.originalEvent);
    return (!originalEvent.altKey &&
        !(originalEvent.metaKey || originalEvent.ctrlKey) &&
        originalEvent.shiftKey);
};
/**
 * Return `true` if the target element is not editable, i.e. not a `<input>`-,
 * `<select>`- or `<textarea>`-element, `false` otherwise.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True only if the target element is not editable.
 * @api
 */
var targetNotEditable = function (mapBrowserEvent) {
    var originalEvent = /** @type {KeyboardEvent|MouseEvent|TouchEvent} */ (mapBrowserEvent.originalEvent);
    var tagName = /** @type {Element} */ (originalEvent.target).tagName;
    return tagName !== 'INPUT' && tagName !== 'SELECT' && tagName !== 'TEXTAREA';
};
/**
 * Return `true` if the event originates from a mouse device.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True if the event originates from a mouse device.
 * @api
 */
var mouseOnly = function (mapBrowserEvent) {
    var pointerEvent = /** @type {import("../MapBrowserEvent").default} */ (mapBrowserEvent).originalEvent;
    assert(pointerEvent !== undefined, 56); // mapBrowserEvent must originate from a pointer event
    // see https://www.w3.org/TR/pointerevents/#widl-PointerEvent-pointerType
    return pointerEvent.pointerType == 'mouse';
};
/**
 * Return `true` if the event originates from a primary pointer in
 * contact with the surface or if the left mouse button is pressed.
 * See https://www.w3.org/TR/pointerevents/#button-states.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True if the event originates from a primary pointer.
 * @api
 */
var primaryAction = function (mapBrowserEvent) {
    var pointerEvent = /** @type {import("../MapBrowserEvent").default} */ (mapBrowserEvent).originalEvent;
    assert(pointerEvent !== undefined, 56); // mapBrowserEvent must originate from a pointer event
    return pointerEvent.isPrimary && pointerEvent.button === 0;
};

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
/**
 * @typedef {Object} Options
 * @property {import("../events/condition.js").Condition} [condition] A function that takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * Default is {@link module:ol/events/condition.noModifierKeys} and {@link module:ol/events/condition.primaryAction}.
 * @property {boolean} [onFocusOnly=false] When the map's target has a `tabindex` attribute set,
 * the interaction will only handle events when the map has the focus.
 * @property {import("../Kinetic.js").default} [kinetic] Kinetic inertia to apply to the pan.
 */
/**
 * @classdesc
 * Allows the user to pan the map by dragging the map.
 * @api
 */
var DragPan = /** @class */ (function (_super) {
    __extends$2(DragPan, _super);
    /**
     * @param {Options} [opt_options] Options.
     */
    function DragPan(opt_options) {
        var _this = _super.call(this, {
            stopDown: FALSE,
        }) || this;
        var options = opt_options ? opt_options : {};
        /**
         * @private
         * @type {import("../Kinetic.js").default|undefined}
         */
        _this.kinetic_ = options.kinetic;
        /**
         * @type {import("../pixel.js").Pixel}
         */
        _this.lastCentroid = null;
        /**
         * @type {number}
         */
        _this.lastPointersCount_;
        /**
         * @type {boolean}
         */
        _this.panning_ = false;
        var condition = options.condition
            ? options.condition
            : all(noModifierKeys, primaryAction);
        /**
         * @private
         * @type {import("../events/condition.js").Condition}
         */
        _this.condition_ = options.onFocusOnly
            ? all(focusWithTabindex, condition)
            : condition;
        /**
         * @private
         * @type {boolean}
         */
        _this.noKinetic_ = false;
        return _this;
    }
    /**
     * Handle pointer drag events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     */
    DragPan.prototype.handleDragEvent = function (mapBrowserEvent) {
        if (!this.panning_) {
            this.panning_ = true;
            this.getMap().getView().beginInteraction();
        }
        var targetPointers = this.targetPointers;
        var centroid$1 = centroid(targetPointers);
        if (targetPointers.length == this.lastPointersCount_) {
            if (this.kinetic_) {
                this.kinetic_.update(centroid$1[0], centroid$1[1]);
            }
            if (this.lastCentroid) {
                var delta = [
                    this.lastCentroid[0] - centroid$1[0],
                    centroid$1[1] - this.lastCentroid[1],
                ];
                var map = mapBrowserEvent.map;
                var view = map.getView();
                scale(delta, view.getResolution());
                rotate(delta, view.getRotation());
                view.adjustCenterInternal(delta);
            }
        }
        else if (this.kinetic_) {
            // reset so we don't overestimate the kinetic energy after
            // after one finger down, tiny drag, second finger down
            this.kinetic_.begin();
        }
        this.lastCentroid = centroid$1;
        this.lastPointersCount_ = targetPointers.length;
        mapBrowserEvent.originalEvent.preventDefault();
    };
    /**
     * Handle pointer up events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     * @return {boolean} If the event was consumed.
     */
    DragPan.prototype.handleUpEvent = function (mapBrowserEvent) {
        var map = mapBrowserEvent.map;
        var view = map.getView();
        if (this.targetPointers.length === 0) {
            if (!this.noKinetic_ && this.kinetic_ && this.kinetic_.end()) {
                var distance = this.kinetic_.getDistance();
                var angle = this.kinetic_.getAngle();
                var center = view.getCenterInternal();
                var centerpx = map.getPixelFromCoordinateInternal(center);
                var dest = map.getCoordinateFromPixelInternal([
                    centerpx[0] - distance * Math.cos(angle),
                    centerpx[1] - distance * Math.sin(angle),
                ]);
                view.animateInternal({
                    center: view.getConstrainedCenter(dest),
                    duration: 500,
                    easing: easeOut,
                });
            }
            if (this.panning_) {
                this.panning_ = false;
                view.endInteraction();
            }
            return false;
        }
        else {
            if (this.kinetic_) {
                // reset so we don't overestimate the kinetic energy after
                // after one finger up, tiny drag, second finger up
                this.kinetic_.begin();
            }
            this.lastCentroid = null;
            return true;
        }
    };
    /**
     * Handle pointer down events.
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
     * @return {boolean} If the event was consumed.
     */
    DragPan.prototype.handleDownEvent = function (mapBrowserEvent) {
        if (this.targetPointers.length > 0 && this.condition_(mapBrowserEvent)) {
            var map = mapBrowserEvent.map;
            var view = map.getView();
            this.lastCentroid = null;
            // stop any current animation
            if (view.getAnimating()) {
                view.cancelAnimations();
            }
            if (this.kinetic_) {
                this.kinetic_.begin();
            }
            // No kinetic as soon as more than one pointer on the screen is
            // detected. This is to prevent nasty pans after pinch.
            this.noKinetic_ = this.targetPointers.length > 1;
            return true;
        }
        else {
            return false;
        }
    };
    return DragPan;
}(PointerInteraction));

export { DragPan as D, Interaction as I, MapBrowserEventType as M, PointerInteraction as P, altShiftKeysOnly as a, mouseActionButton as b, always as c, all as d, centroid as e, focusWithTabindex as f, mouseOnly as m, noModifierKeys as n, pan as p, shiftKeyOnly as s, targetNotEditable as t, zoomByDelta as z };
