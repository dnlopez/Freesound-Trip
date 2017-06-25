
// This namespace
// #require "html.js"


dan.gui.html.PopupTextarea = function (i_size, i_sizeUnit,
                                       i_caption, i_initialEntry,
                                       i_buttons, i_readOnly)
// Params:
//  i_size:
//   (array of 2 number)
//   Width and height for window.
//  i_sizeUnit:
//   (string)
//   A CSS unit, eg. "px" or "%".
//  i_caption:
//   (string)
//  i_initialEntry:
//   (string)
//  i_buttons:
//   (array)
//   One element for each button to show in the bottom right.
//   Each element is:
//    (array)
//    With elements:
//     0:
//      (string)
//      Button label
//     1:
//      (function)
//      Function to call if button is clicked or if its shortcut key is pressed.
//      Function has:
//       Params:
//        i_buttonNo:
//         (integer number)
//         Which button number this is (ie. the position we're at in i_buttons).
//         This enables you to distiguish between them in case you use the same callback for all buttons.
//        i_value:
//         (string)
//         The text from the text area at the time of the above action.
//        i_event:
//         (Event)
//         The event object form the browser.
//       Returns:
//        (boolean)
//        true: Close the popup
//        false: Leave the popup open.
//     2:
//      Either (array of integer number)
//       Keycodes of shortcut keys for this button
//       eg.
//        [13, 27]: Enter and Escape
//      or (integer number)
//       Keycode of shortcut key for this button
//       eg.
//        13: Enter
//        27: Escape
//      or (null or undefined)
//       Don't use a shortcut key
//  i_readOnly:
//   Either (boolean)
//    true: Don't allow the textarea to be edited
//   or (null or undefined)
//    Use default of false.
//
// Example usage:
//  dan.gui.html.PopupTextarea(
//      [70, 70], "%", "Current sequence:",
//      JSON.stringify(g_sequencer.save()),
//      [
//          ["OK", function (i_buttonNo, i_value, i_event) {
//              g_sequencer.loadNewSequence(i_value);
//              return true;
//          }, 13],
//          ["Cancel", function (i_buttonNo, i_value, i_event) {
//              return true;
//          }, 27]
//      ]);
{
    // Make root container
    var rootDomElement = document.createElement("div");
    rootDomElement.style.padding = "0 1em 1em 1em";
    rootDomElement.style.backgroundColor = "#fff";
    rootDomElement.style.borderColor = "#000";
    rootDomElement.style.borderThickness = 2;
    rootDomElement.style.borderStyle = "solid";
    rootDomElement.style.display = "flex";
    rootDomElement.style.flexDirection = "column";

    //
    //document.documentElement.clientWidth, document.documentElement.clientHeight

    rootDomElement.style.position = "fixed";
    if (i_sizeUnit == "px")
    {
        rootDomElement.style.top = "50%";
        rootDomElement.style.left = "50%";
        rootDomElement.style.width = i_size[0].toString() + i_sizeUnit;
        rootDomElement.style.height = i_size[1].toString() + i_sizeUnit;
        rootDomElement.style.marginLeft = (-i_size[0] / 2).toString() + i_sizeUnit;
        rootDomElement.style.marginTop = (-i_size[1] / 2).toString() + i_sizeUnit;
    }
    else // if (i_sizeUnit == "%")
    {
        rootDomElement.style.top = ((100 - i_size[1]) / 2).toString() + i_sizeUnit;
        rootDomElement.style.left = ((100 - i_size[0]) / 2).toString() + i_sizeUnit;
        rootDomElement.style.bottom = ((100 - i_size[1]) / 2).toString() + i_sizeUnit;
        rootDomElement.style.right = ((100 - i_size[0]) / 2).toString() + i_sizeUnit;
    }
    rootDomElement.style.boxShadow = "0px 0px 30px #000";

    //
    var captionElement = document.createElement("p");
    captionElement.innerHTML = i_caption;
    rootDomElement.appendChild(captionElement);

    //
    var textInputElement = document.createElement("textarea");
    textInputElement.style.width = "100%";
    textInputElement.style.height = "100%";
    textInputElement.style.fontFamily = "Courier";
    if (i_readOnly)
        textInputElement.setAttribute("readonly", "1");
    textInputElement.value = i_initialEntry;
    textInputElement.addEventListener("keydown", function (i_event) {
        for (var buttonCount = i_buttons.length, buttonNo = 0; buttonNo < buttonCount; ++buttonNo)
        {
            var button = i_buttons[buttonNo];

            // If button has a shortcut keycode or keycodes matching the pressed keycode
            var shortcutKeyMatch;
            if (!Array.isArray(button[2]))
                shortcutKeyMatch = button[2] == i_event.which;
            else
                shortcutKeyMatch = button[2].indexOf(i_event.which) != -1;

            if (shortcutKeyMatch)
            {
                // Call the user callback with the button number and the current textarea value,
                // and if it returns true then close the popup
                if (button[1](buttonNo, textInputElement.value, i_event))
                    closePopup();
            }
        }

        i_event.stopPropagation();
    });
    rootDomElement.appendChild(textInputElement);

    //
    var buttonContainerElement = document.createElement("div");
    buttonContainerElement.style.paddingTop = "1em";
    buttonContainerElement.style.textAlign = "right";

    //
    for (var buttonCount = i_buttons.length, buttonNo = 0; buttonNo < buttonCount; ++buttonNo)
    {
        var button = i_buttons[buttonNo];

        var buttonElement = document.createElement("button");
        buttonElement.appendChild(document.createTextNode(button[0]));
        //buttonElement.style.width = "90px";
        // If button has a user callback
        if (button[1])
        {
            buttonElement.addEventListener("click", function (i_event) {
                // Call the user callback with the button number and the current textarea value,
                // and if it returns true then close the popup
                if (button[1](buttonNo, textInputElement.value, i_event))
                    closePopup();
            });
        }

        buttonContainerElement.appendChild(buttonElement);
    }

    //
    //var $cancelButton = $('<button>Cancel</button>');
    //$cancelButton.css("margin-left", "8px");
    //$cancelButton.css("width", "90px");

    rootDomElement.appendChild(buttonContainerElement);

    //
    var dimmerElement = document.createElement("div");
    dimmerElement.style.backgroundColor = "#000";
    dimmerElement.style.opacity = "0.5";

    dimmerElement.style.position = "fixed";
    dimmerElement.style.top = "0";
    dimmerElement.style.left = "0";
    dimmerElement.style.right = "0";
    dimmerElement.style.bottom = "0";

    dimmerElement.style.zIndex = 5;
    rootDomElement.style.zIndex = 10;

    //
    document.body.appendChild(dimmerElement);
    document.body.appendChild(rootDomElement);

    textInputElement.select();

    //
    function closePopup()
    {
        dimmerElement.parentElement.removeChild(dimmerElement);
        rootDomElement.parentElement.removeChild(rootDomElement);
    }
}
