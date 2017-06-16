// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
/*
var blocker = document.getElementById("blocker");
var instructions = document.getElementById("instructions");

var havePointerLock = "pointerLockElement" in document || "mozPointerLockElement" in document || "webkitPointerLockElement" in document;
if (havePointerLock)
{
    var element = document.body;

    var pointerlockchange = function (event)
    {
        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element)
        {
            g_controlsEnabled = true;
            g_controls.enabled = true;

            blocker.style.display = "none";
        }
        else
        {
            g_controls.enabled = false;

            blocker.style.display = "-webkit-box";
            blocker.style.display = "-moz-box";
            blocker.style.display = "box";

            instructions.style.display = "";

        }

    };

    var pointerlockerror = function (event) {

        instructions.style.display = "";

    };

    // Hook pointer lock state change events
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);

    document.addEventListener("pointerlockerror", pointerlockerror, false);
    document.addEventListener("mozpointerlockerror", pointerlockerror, false);
    document.addEventListener("webkitpointerlockerror", pointerlockerror, false);

    instructions.addEventListener("click", function (event) {

        instructions.style.display = "none";

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();

    }, false);

} else {

    instructions.innerHTML = "Your browser doesn\"t seem to support Pointer Lock API";

}
*/
