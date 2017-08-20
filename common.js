// + ViewportDimmer {{{

function ViewportDimmer()
{
    //
    this.dimmerElement = document.createElement("div");

    this.dimmerElement.style.position = "fixed";
    this.dimmerElement.style.top = "0";
    this.dimmerElement.style.left = "0";
    this.dimmerElement.style.right = "0";
    this.dimmerElement.style.bottom = "0";

    this.dimmerElement.style.visibility = "hidden";

    this.dimmerElement.style.zIndex = 5;

    //
    document.body.appendChild(this.dimmerElement);
}

ViewportDimmer.prototype.dim = function (i_brightness, i_colour)
// Params:
//  i_brightness:
//   Either (float number)
//    In range [0..1]
//    Lower is darker (more of i_colour).
//   or (null or undefined)
//    Use default of 0.5.
//  i_colour:
//   Either (string)
//    CSS colour description
//   or (null or undefined)
//    Use default of "#000".
{
    // Apply default arguments
    if (i_brightness === null || i_brightness === undefined)
        i_brightness = 0.5;
    if (i_colour === null || i_colour === undefined)
        i_colour = "#000";

    //
    this.dimmerElement.style.backgroundColor = i_colour;
    this.dimmerElement.style.opacity = (1.0 - i_brightness).toString();

    //
    if (i_brightness >= 1.0)
        this.dimmerElement.style.visibility = "hidden";
    else
        this.dimmerElement.style.visibility = "visible";
};

ViewportDimmer.prototype.undim = function ()
{
    this.dim(1.0);
};

ViewportDimmer.prototype.bindClick = function (i_func)
// Params:
//  i_func:
//   (function)
//   Function has:
//    Params:
//     i_event:
//      (Event)
{
    this.dimmerElement.addEventListener("click", function (i_event) {
        i_func(i_event);
    });
};

// + }}}

function positionElementVisibly(i_element, i_left, i_top, i_viewportEdgeClearance)
// Params:
//  i_element:
//   (HTMLElement)
//   Element to move.
//   This should have a defined height and width,
//   and its CSS top and left should work to position it relative to the top-left of the viewport (eg. by "position: fixed").
//  i_left, i_top:
//   (number)
//   Ideal position for the top-left corner of the dialog.
//   If this results in some part of the element being off-viewport, it will be nudged to compensate.
//  i_viewportEdgeClearance:
//   Either (number)
//   or (null or undefined)
//    Use default of 0.
{
    // Apply default arguments
    if (i_viewportEdgeClearance === null || i_viewportEdgeClearance === undefined)
        i_viewportEdgeClearance = 0;

    //
    var elementClientRect = i_element.getBoundingClientRect();

    // Back off from viewport edge
    //  at right
    var overhangAtRight = i_left + elementClientRect.width - (window.innerWidth - i_viewportEdgeClearance);
    if (overhangAtRight > 0)
        i_left -= overhangAtRight;
    //  at bottom
    var overhangAtBottom = i_top + elementClientRect.height - (window.innerHeight - i_viewportEdgeClearance);
    if (overhangAtBottom > 0)
        i_top -= overhangAtBottom;
    //  at left
    if (i_left < i_viewportEdgeClearance)
        i_left = i_viewportEdgeClearance;
    //  at top
    if (i_top < i_viewportEdgeClearance)
        i_top = i_viewportEdgeClearance;

    //
    i_element.style.left = i_left.toString() + "px";
    i_element.style.top = i_top.toString() + "px";
}

function popUpElement(i_element, i_left, i_top)
// Params:
//  i_element:
//   (HTMLElement)
//  i_left, i_top:
//   (number)
{
    i_element.style.visibility = "visible";

    var openerButtonClientRect = i_element.getBoundingClientRect();
    positionElementVisibly(i_element, i_left, i_top, 16);

    dan.movement.animate(0.2, function (i_progress) {
        i_progress = dan.movement.ease_cubic_out(i_progress);

        //
        i_element.style.transform = "scale(" + i_progress.toString() + ")";

        // If finished and a callback was passed then call it
        if (i_progress == 1)
            i_element.style.transform = "";
    });
}
