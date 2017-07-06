
// This namespace
// #require "text.js"

/**
 * JavaScript code to detect available availability of a
 * particular font in a browser using JavaScript and CSS.
 *
 * Author : Lalit Patel
 * Website: http://www.lalit.org/lab/javascript-css-font-detect/
 * License: Apache Software License 2.0
 *          http://www.apache.org/licenses/LICENSE-2.0
 * Version: 0.15 (21 Sep 2009)
 *          Changed comparision font to default from sans-default-default,
 *          as in FF3.0 font of child element didn't fallback
 *          to parent element if the font is missing.
 * Version: 0.2 (04 Mar 2012)
 *          Comparing font against all the 3 generic font families ie,
 *          'monospace', 'sans-serif' and 'sans'. If it doesn't match all 3
 *          then that font is 100% not available in the system
 * Version: 0.3 (24 Mar 2012)
 *          Replaced sans with serif in the list of baseFonts
 */

dan.text.FontDetector = function ()
// Usage:
//  Possibly load a non-standard font first with CSS such as:
//   @font-face {
//       font-family: Droid Sans Mono;
//       src: url('fonts/DroidSansMono-Regular.ttf');
//   }
//
//  Check whether it's loaded and ready for use yet with:
//   var fontDetector = new FontDetector();
//   fontDetector.detect('font name');
{
    //we use m or w because these two characters take up the maximum width.
    // And we use a LLi so that the same matching fonts can get separated
    var testString = "mmmmmmmmmmlli";

    //we test using 72px font size, we may use any size. I guess larger the better.
    var testSize = "72px";

    var body = document.getElementsByTagName("body")[0];

    // Using a SPAN temporarily inserted into the document,
    // get the width of the test string in a variety of base fonts
    var baseFontNames = ["monospace", "sans-serif", "serif"];
    var span = document.createElement("span");
    span.style.fontSize = testSize;
    span.innerHTML = testString;
    var baseFontSizes = {};
    for (var baseFontNameNo in baseFontNames)
    {
        var baseFontName = baseFontNames[baseFontNameNo];

        span.style.fontFamily = baseFontName;
        body.appendChild(span);
        baseFontSizes[baseFontName] = [span.offsetWidth, span.offsetHeight];
        body.removeChild(span);
    }

    this.detect = function (i_fontName)
    // Params:
    //  i_fontName:
    //   (string)
    //   Name of font to check for the existence of
    //
    // Returns:
    //  (boolean)
    //  true if the font is loaded
    {
        // In another temporary SPAN, reinsert the test string in each base font as fallback,
        // while preferring the test font. If the size has changed from the measured base font
        // size for any one of them, the base font has been replaced and the font must have
        // loaded.
        var differenceFound = false;
        for (var baseFontNameNo in baseFontNames)
        {
            var baseFontName = baseFontNames[baseFontNameNo];

            span.style.fontFamily = i_fontName + "," + baseFontName; // name of the font along with the base font for fallback.
            body.appendChild(span);
            if (span.offsetWidth != baseFontSizes[baseFontName][0] || span.offsetHeight != baseFontSizes[baseFontName][1])
                differenceFound = true;
            body.removeChild(span);

            if (differenceFound)
                break;
        }
        return differenceFound;
    }

    this.waitForFont = function (i_fontName)
    // Params:
    //  i_fontName:
    //   (string)
    //   Name of font to wait for the existence of
    //
    // Returns:
    //  (Promise)
    //  Promise that resolves then the font is loaded and ready for use
    {
        var self = this;

        return new Promise(function (i_resolve, i_reject) {
            function testForFont()
            {
                // If have it, resolve the promise
                if (self.detect(i_fontName))
                {
                    i_resolve();
                }
                // Else if don't have it, try again in 100 ms
                {
                    setTimeout(testForFont, 100);
                }
            }
            testForFont();
        });
    };
};

dan.text.loadFont = function (i_url, i_fontFamily)
// Params:
//  i_url:
//   (string)
//   Path of font file to load.
//   eg. "fonts/Open_Sans/OpenSans-Regular.ttf"
//  i_fontFamily:
//   (string)
//   eg. "OpenSans"
//
// TODO:
//  Extra params for and disambiguation of styles, weights, etc.
//
// Returns:
//  (Promise)
//  Promise that resolves then the font is loaded and ready for use
{
    // Insert new style element into document with @font-face rule to load the font
    var cssText = "@font-face {";
    cssText += "\nfont-family: " + i_fontFamily + ";";
    cssText += "\nsrc: url('" + i_url + "');";
    cssText += "\n}";

    var styleElement = document.createElement("style");
    styleElement.setAttribute("type", "text/css");
    styleElement.appendChild(document.createTextNode(cssText));

    document.body.appendChild(styleElement);

    //
    var fontDetector = new dan.text.FontDetector();
    return fontDetector.waitForFont(i_fontFamily);
};
