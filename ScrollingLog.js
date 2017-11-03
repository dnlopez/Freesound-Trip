
// + Construction {{{

function ScrollingLog()
{
    this.rootDomElement = document.createElement("div");
    this.rootDomElement.setAttribute("id", "scrollingLog");

    this.rootDomElement.style.position = "fixed";
    //this.rootDomElement.style.top = "0";
    this.rootDomElement.style.height = "100%";
    this.rootDomElement.style.bottom = "0";
    this.rootDomElement.style.overflow = "hidden";
    this.rootDomElement.style.left = "0";
    this.rootDomElement.style.right = "0";
    //this.rootDomElement.style.border = "3px solid red";
    this.rootDomElement.style.padding = "4px";
    this.rootDomElement.style.color = "#f00";
    this.rootDomElement.style.textShadow = "1px 1px 1px rgba(0, 0, 0, 0.5)";
    this.rootDomElement.style.fontWeight = "bold";
    this.rootDomElement.style.backgroundColor = "transparent";
    //this.rootDomElement.style.overflowY = "scroll";

    this.rootDomElement.style.pointerEvents = "none";

    // Show first element at bottom
    this.rootDomElement.style.display = "flex";
    this.rootDomElement.style.flexDirection = "column-reverse";

    // Default time in seconds for each log element to remain visible for
    this.timeout = Infinity;

    //
    this.entries = [];
}

// + }}}

ScrollingLog.prototype.setHeight = function (i_height)
// Params:
//  i_height:
//   Either (number)
//    A number of pixels
//   or (null)
//    Full height
{
    if (i_height === null)
    {
        this.rootDomElement.style.height = "100%";
    }
    else
    {
        this.rootDomElement.style.height = i_height.toString() + "px";
    }
};

ScrollingLog.prototype.setOpacity = function (i_opacity)
// Params:
//  i_opacity:
//   (float number)
//   In range [0 .. 1]
{
    this.rootDomElement.style.opacity = i_opacity.toString();
};

// + Root DOM element {{{

ScrollingLog.prototype.getRootDomElement = function ()
{
    return this.rootDomElement;
};

// + }}}

// + Add entries {{{

ScrollingLog.prototype.addText = function (i_text, i_timeout)
// Params:
//  i_text:
//   (string)
//  i_timeout:
//   Either (float number)
//    Time in seconds from now after which the log element should be removed (by removeTimedOutEntries()).
//    Infinity: Don't automatically remove.
//   or (null or undefined)
//    Use the default timeout (as set in constructor).
{
    // Apply default arguments
    if (i_timeout === null || i_timeout === undefined)
        i_timeout = this.timeout;

    // Create DOM element, containing text
    var domElement = document.createElement("div");
    domElement.appendChild(document.createTextNode(i_text));

    // Create an entry, with its timeout
    this.entries.push([performance.now() / 1000 + i_timeout, domElement]);

    // Add DOM element
    // and scroll to bottom
    this.rootDomElement.insertBefore(domElement, this.rootDomElement.firstChild);
    this.rootDomElement.scrollTop = this.rootDomElement.scrollHeight;
};

// + }}}

ScrollingLog.prototype.resetEntryTimeouts = function (i_timeout)
// Params:
//  i_timeout:
//   Either (float number)
//    Time in seconds from now after which all existing log elements should be removed (by removeTimedOutEntries()).
//    Infinity: Don't automatically remove.
//   or (null or undefined)
//    Use the default timeout (as set in constructor).
{
    // Apply default arguments
    if (i_timeout === null || i_timeout === undefined)
        i_timeout = this.timeout;

    //
    for (var entryCount = this.entries.length, entryNo = 0; entryNo < entryCount; ++entryNo)
    {
        this.entries[entryNo][0] = performance.now() / 1000 + i_timeout;
    }
};

ScrollingLog.prototype.removeTimedOutEntries = function ()
// Typically to be called from the animation loop.
{
    var currentTime = performance.now() / 1000;
    var entryNo = 0;
    while (entryNo < this.entries.length)
    {
        var entry = this.entries[entryNo];

        if (currentTime >= entry[0])
        {
            this.rootDomElement.removeChild(entry[1]);
            this.entries.splice(entryNo, 1);
        }
        else
        {
            ++entryNo;
        }
    }
};

ScrollingLog.prototype.removeAllEntries = function ()
{
    // Clear entries array
    this.entries.length = 0;

    // Remove log elements from DOM
    while (this.rootDomElement.lastChild)
    {
        this.rootDomElement.removeChild(this.rootDomElement.lastChild);
    }
};
