// Functions about web browser UI.
//
// Note, these relate to user-interface, not browser-specific programmer utilities like htmlToDom() which are currently in documents.js.


// This namespace
// #require "dan.js"


dan.disableUserSelection = function (i_element)
// Stop text selection happening when dragging the mouse across a particular element or double-clicking it.
//
// Notes:
//  http://stackoverflow.com/questions/826782/css-rule-to-disable-text-selection-highlighting
//
// Params:
//  i_element:
//   (HTMLElement)
{    
    // iOS Safari
    i_element.style.webkitTouchCallout = "none";
    // Chrome/Safari/Opera
    i_element.style.webkitUserSelect = "none";
    // Konqueror
    i_element.style.khtmlUserSelect = "none";
    // Firefox
    i_element.style.mozUserSelect = "none";
    // IE/Edge
    i_element.style.msUserSelect = "none";
    // Unprefixed
    i_element.style.userSelect = "none";
};

dan.disableContextMenu = function (i_element)
// Disable the context menu on a particular element.
//
// Params:
//  i_element:
//   (HTMLElement)
{
    i_element.addEventListener("contextmenu", function (i_event) {
        i_event.preventDefault();
        // The above line is enough in modern Chromium and Firefox, but return false as well to be sure
        return false;
    });
};
