
// This namespace
// #require "html.js"

// jQuery
// #require <jquery-1.8.2.min.js>


dan.gui.html.PopupTextarea = function (i_size, i_sizeUnit,
                                       i_caption, i_initialEntry,
                                       i_buttons)
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
//        i_value:
//         (string)
//         The text from the text area at the time of the above action.
//       Returns:
//        (boolean)
//        true: Close the popup
//        false: Leave the popup open.
//     2:
//      Either (integer number)
//       Keycode of shortcut key for this button
//       eg.
//        13: Enter
//        27: Escape
//      or (null or undefined)
//       Don't use a shortcut key
{
    var $container = $(document.body);

    // Make root container
    var $rootDomElement = $('<div>');
    $rootDomElement.css("padding", "0 1em 1em 1em");
    $rootDomElement.css("background-color", "#fff");
    $rootDomElement.css("border-color", "#000");
    $rootDomElement.css("border-thickness", 2);
    $rootDomElement.css("border-style", "solid");
    $rootDomElement.css("display", "flex");
    $rootDomElement.css("flex-direction", "column");

    //
    //document.documentElement.clientWidth, document.documentElement.clientHeight

    $rootDomElement.css("position", "fixed");
    if (i_sizeUnit == "px")
    {
        $rootDomElement.css("top", "50%");
        $rootDomElement.css("left", "50%");
        $rootDomElement.css("width", i_size[0].toString() + i_sizeUnit);
        $rootDomElement.css("height", i_size[1].toString() + i_sizeUnit);
        $rootDomElement.css("margin-left", (-i_size[0] / 2).toString() + i_sizeUnit);
        $rootDomElement.css("margin-top", (-i_size[1] / 2).toString() + i_sizeUnit);
    }
    else // if (i_sizeUnit == "%")
    {
        $rootDomElement.css("top", ((100 - i_size[1]) / 2).toString() + i_sizeUnit);
        $rootDomElement.css("left", ((100 - i_size[0]) / 2).toString() + i_sizeUnit);
        $rootDomElement.css("bottom", ((100 - i_size[1]) / 2).toString() + i_sizeUnit);
        $rootDomElement.css("right", ((100 - i_size[0]) / 2).toString() + i_sizeUnit);
    }
    $rootDomElement.css("box-shadow", "0px 0px 30px #000");

    //
    var $caption = $('<p>');
    $caption.html(i_caption);
    $rootDomElement.append($caption);

    //
    var $textInput = $('<textarea>');
    $textInput.css("width", "100%");
    $textInput.css("height", "100%");
    $textInput.css("font-family", "Courier");
    $textInput.val(i_initialEntry);
    $textInput.bind("keydown", function (i_event) {
        if (i_event.which == 13)
            doLoad();
        else if (i_event.which == 27)
            doCancel();
        i_event.stopPropagation();
    });
    $rootDomElement.append($textInput);

    //
    var $buttons = $('<div>');
    $buttons.css("padding-top", "1em");
    $buttons.css("text-align", "right");

    //
    for (var buttonCount = i_buttons.length, buttonNo = 0; buttonNo < buttonCount; ++buttonNo)
    {
        var button = i_buttons[buttonNo];

        var $button = $('<button>' + button[0] + '</button>');
        //$button.css("width", "90px");
        $button.bind("click", button[1])
        if (i_onDoneCallback(true, $textInput.val()))
        {
            $dimmer.remove();
            $rootDomElement.remove();
        }
);
        $buttons.append($loadButton);
        
    }

    //
    var $cancelButton = $('<button>Cancel</button>');
    $cancelButton.css("margin-left", "8px");
    $cancelButton.css("width", "90px");
    $cancelButton.bind("click", doCancel);
    $buttons.append($cancelButton);

    $rootDomElement.append($buttons);

    //
    var $dimmer = $('<div>');
    $dimmer.css("background-color", "#000");
    $dimmer.css("opacity", "0.5");

    $dimmer.css("position", "fixed");
    $dimmer.css("top", "0");
    $dimmer.css("left", "0");
    $dimmer.css("right", "0");
    $dimmer.css("bottom", "0");

    $dimmer.css("z-index", 5);
    $rootDomElement.css("z-index", 10);

    $container.append($dimmer);
    $container.append($rootDomElement);

    $textInput.select();

    function doLoad()
    {
        if (i_onDoneCallback(true, $textInput.val()))
        {
            $dimmer.remove();
            $rootDomElement.remove();
        }
    }

    function doCancel()
    {
        if (i_onDoneCallback(false, $textInput.val()))
        {
            $dimmer.remove();
            $rootDomElement.remove();
        }
    }
}
