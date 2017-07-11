
var THREE_FlyControls = function (i_object, i_eventTarget)
// Params:
//  i_object:
//   (THREE.Object3D)
//   Object to move with these controls.
//  i_eventTarget:
//   Either (HTMLElement)
//    Element on which to add event handlers for reading input (mouse, keyboard)
//   or (undefined)
//    Default to document.
{
    // Apply default arguments
    if (i_eventTarget === undefined)
        i_eventTarget = document;

    // + Save and setup event target {{{

    this.eventTarget = i_eventTarget;

    // If event target is not the whole document,
    // make it focusable but not by sequential keyboard navigation
    if (this.eventTarget !== document)
        this.eventTarget.setAttribute("tabindex", -1);

    // Disable context menu on the event target
    this.eventTarget.addEventListener("contextmenu", function (i_event) {
        i_event.preventDefault();
    }, false);

    this.getEventTargetDimensions = function ()
    // Get size of event target
    {
        if (this.eventTarget === document)
        {
            return {
                size: [window.innerWidth, window.innerHeight],
                offset: [0, 0]
            };
        }
        else
        {
            return {
                size: [this.eventTarget.offsetWidth, this.eventTarget.offsetHeight],
                offset: [this.eventTarget.offsetLeft, this.eventTarget.offsetTop]
            };
        }
    };

    // + }}}

    //
    this.object = i_object;

    // API

    this.movementSpeed = 1.0;
    this.rollSpeed = 0.005;

    this.mouse_mustHoldButtonToLook = false;
    // (boolean)
    // true:
    //  mouselook is activated only while holding down a mouse button,
    //  and mouse buttons do not cause positional movement
    // false:
    //  mouselook is activated all the time,
    //  and left/right buttons cause forward/backward positional movement
    this.mouse_isDragging = false;
    // Only used if mouse_mustHoldButtonToLook is true

    // + Unused {{{

    this.handleEvent = function (i_event)
    {
        if (typeof this[i_event.type] == 'function')
        {
            this[i_event.type](i_event);
        }
    };

    // + }}}

    // + Read input {{{

    // + + Mouse {{{

    this.mousedown = function (i_event)
    {
        if (this.eventTarget !== document)
        {
            this.eventTarget.focus();
        }

        if (this.mouse_mustHoldButtonToLook)
        {
            console.log("++");
            this.mouse_isDragging = true;
        }
        else
        {
            switch (i_event.button)
            {
            case 0:
                this.inputState.forward = 1;
                break;
            case 2:
                this.inputState.back = 1;
                break;
            }

            this.updateMovementVector();
        }

        //
        i_event.preventDefault();
        i_event.stopPropagation();
    };
    this.eventTarget.addEventListener('mousedown', bind(this, this.mousedown), false);

    this.mousemove = function (i_event)
    {
        if (!this.mouse_mustHoldButtonToLook || this.mouse_isDragging)
        {
            // Set yaw and pitch according to mouse offset from the centre of the event target
            var eventTarget = this.getEventTargetDimensions();
            var halfWidth = eventTarget.size[0] / 2;
            var halfHeight = eventTarget.size[1] / 2;
            this.inputState.yawLeft = -((i_event.pageX - eventTarget.offset[0]) - halfWidth) / halfWidth;
            this.inputState.pitchDown = ((i_event.pageY - eventTarget.offset[1]) - halfHeight) / halfHeight;

            this.updateRotationVector();
        }
    };
    this.eventTarget.addEventListener('mousemove', bind(this, this.mousemove), false);

    this.mouseup = function (i_event)
    {
        if (this.mouse_mustHoldButtonToLook)
        {
            // Stop dragging and zero out yaw and pitch
            this.mouse_isDragging = false;

            this.inputState.yawLeft = this.inputState.pitchDown = 0;
        }
        else
        {
            switch (i_event.button)
            {
            case 0:
                this.inputState.forward = 0;
                break;
            case 2:
                this.inputState.back = 0;
                break;
            }

            this.updateMovementVector();
        }

        this.updateRotationVector();

        //
        i_event.preventDefault();
        i_event.stopPropagation();
    };
    this.eventTarget.addEventListener('mouseup', bind(this, this.mouseup), false);

    // + + }}}

    // + + Keyboard {{{

    this.keydown = function (i_event)
    {
        if (i_event.altKey)
            return;

        switch (i_event.keyCode)
        {
        case 16:
            /* shift */ this.movementSpeedMultiplier = 0.1;
            break;

        case 87:
            /*W*/ this.inputState.forward = 1;
            break;
        case 83:
            /*S*/ this.inputState.back = 1;
            break;

        case 65:
            /*A*/ this.inputState.left = 1;
            break;
        case 68:
            /*D*/ this.inputState.right = 1;
            break;

        case 82:
            /*R*/ this.inputState.up = 1;
            break;
        case 70:
            /*F*/ this.inputState.down = 1;
            break;

        case 38:
            /*up*/ this.inputState.pitchUp = 1;
            break;
        case 40:
            /*down*/ this.inputState.pitchDown = 1;
            break;

        case 37:
            /*left*/ this.inputState.yawLeft = 1;
            break;
        case 39:
            /*right*/ this.inputState.yawRight = 1;
            break;

        case 81:
            /*Q*/ this.inputState.rollLeft = 1;
            break;
        case 69:
            /*E*/ this.inputState.rollRight = 1;
            break;
        }

        this.updateMovementVector();
        this.updateRotationVector();

        //i_event.preventDefault();
    };
    this.eventTarget.addEventListener('keydown', bind(this, this.keydown), false);

    this.keyup = function (i_event)
    {
        switch (i_event.keyCode)
        {
        case 16:
            /* shift */ this.movementSpeedMultiplier = 1;
            break;

        case 87:
            /*W*/ this.inputState.forward = 0;
            break;
        case 83:
            /*S*/ this.inputState.back = 0;
            break;

        case 65:
            /*A*/ this.inputState.left = 0;
            break;
        case 68:
            /*D*/ this.inputState.right = 0;
            break;

        case 82:
            /*R*/ this.inputState.up = 0;
            break;
        case 70:
            /*F*/ this.inputState.down = 0;
            break;

        case 38:
            /*up*/ this.inputState.pitchUp = 0;
            break;
        case 40:
            /*down*/ this.inputState.pitchDown = 0;
            break;

        case 37:
            /*left*/ this.inputState.yawLeft = 0;
            break;
        case 39:
            /*right*/ this.inputState.yawRight = 0;
            break;

        case 81:
            /*Q*/ this.inputState.rollLeft = 0;
            break;
        case 69:
            /*E*/ this.inputState.rollRight = 0;
            break;
        }

        this.updateMovementVector();
        this.updateRotationVector();
    };
    this.eventTarget.addEventListener('keyup', bind(this, this.keyup), false);

    // + + }}}

    this.inputState = {
        // Movement
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        forward: 0,
        back: 0,
        // Rotation
        pitchUp: 0,
        pitchDown: 0,
        yawLeft: 0,
        yawRight: 0,
        rollLeft: 0,
        rollRight: 0
    };

    this.resetInputs = function ()
    {
        this.inputState = {
            // Movement
            up: 0,
            down: 0,
            left: 0,
            right: 0,
            forward: 0,
            back: 0,
            // Rotation
            pitchUp: 0,
            pitchDown: 0,
            yawLeft: 0,
            yawRight: 0,
            rollLeft: 0,
            rollRight: 0
        };

        this.updateMovementVector();
        this.updateRotationVector();

        //if (this.mouse_isDragging > 0)
        //    this.mouse_isDragging = 0;
    };

    // + }}}

    // + Convert input state to unit-sized mathematical elements for movement {{{

    this.movementVector = new THREE.Vector3(0, 0, 0);
    this.updateMovementVector = function ()
    // Set this.movementVector to a direction according to current inputState movement components
    {
        this.movementVector.x = (-this.inputState.left + this.inputState.right);
        this.movementVector.y = (-this.inputState.down + this.inputState.up);
        this.movementVector.z = (-this.inputState.forward + this.inputState.back);

        //console.log('move:', [this.movementVector.x, this.movementVector.y, this.movementVector.z]);
    };
    this.updateMovementVector();

    this.rotationVector = new THREE.Vector3(0, 0, 0);
    this.updateRotationVector = function ()
    // Set this.rotationVector to a direction according to current inputState rotation components
    {
        this.rotationVector.x = (-this.inputState.pitchDown + this.inputState.pitchUp);
        this.rotationVector.y = (-this.inputState.yawRight + this.inputState.yawLeft);
        this.rotationVector.z = (-this.inputState.rollRight + this.inputState.rollLeft);

        //console.log('rotate:', [this.rotationVector.x, this.rotationVector.y, this.rotationVector.z]);
    };
    this.updateRotationVector();

    // + }}}

    // + Apply movement {{{

    this.tmpQuaternion = new THREE.Quaternion();

    this.update = function (i_delta)
    {
        // Translate this.object by movementVector
        var movementDelta = this.movementSpeed * i_delta;
        this.object.translateX(this.movementVector.x * movementDelta);
        this.object.translateY(this.movementVector.y * movementDelta);
        this.object.translateZ(this.movementVector.z * movementDelta);

        // Rotate
        var rollDelta = this.rollSpeed * i_delta;
        this.tmpQuaternion.set(this.rotationVector.x * rollDelta,
                               this.rotationVector.y * rollDelta,
                               this.rotationVector.z * rollDelta,
                               1).normalize();
        this.object.quaternion.multiply(this.tmpQuaternion);

        // expose the rotation vector for convenience
        this.object.rotation.setFromQuaternion(this.object.quaternion,
                                               this.object.rotation.order);
    };

    // + }}}

    // + Helper for event binding {{{

    function bind(scope, fn)
    {
        return function ()
        {
            fn.apply(scope, arguments);
        };
    };

    // + }}}
};
