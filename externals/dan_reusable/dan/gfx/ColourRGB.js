
// This namespace
// #require "gfx.js"


// + Construction/clone {{{

dan.gfx.ColourRGB = function (i_r, i_g, i_b)
// Params:
//  i_r:
//   Either (float number)
//    Red component in range [0..1]
//   or (null or undefined)
//    Use default of 0.
//  i_g:
//   Either (float number)
//    Green component in range [0..1]
//   or (null or undefined)
//    Use default of 0.
//  i_b:
//   Either (float number)
//    Blue component in range [0..1]
//   or (null or undefined)
//    Use default of 0.
{
    this.r = i_r ? i_r : 0;
    // this.r:
    //  (float number)
    //  Red component in range [0..1]

    this.g = i_g ? i_g : 0;
    // this.g:
    //  (float number)
    //  Green component in range [0..1]

    this.b =  i_b ? i_b : 0;
    // this.b:
    //  (float number)
    //  Blue component in range [0..1]
};

dan.gfx.ColourRGB.fromInt = function (i_value)
// Params:
//  As for setFromInt().
{
    return new dan.gfx.ColourRGB().setFromInt(i_value);
};

dan.gfx.ColourRGB.fromName = function (i_name)
// Params:
//  As for setFromName().
{
    return new dan.gfx.ColourRGB().setFromName(i_name);
};

dan.gfx.ColourRGB.fromHexString = function (i_hexString)
// Params:
//  As for setFromHexString().
{
    return new dan.gfx.ColourRGB().setFromHexString(i_hexString);
};

dan.gfx.ColourRGB.fromCssString = function (i_cssString)
// Params:
//  As for setFromCssString().
{
    return new dan.gfx.ColourRGB().setFromCssString(i_cssString);
};

dan.gfx.ColourRGB.prototype.clone = function ()
{
    var newColour = new dan.gfx.ColourRGB();
    newColour.r = this.r;
    newColour.g = this.g;
    newColour.b = this.b;
    return newColour;
};

// + }}}

// + Get to other colour representations {{{

dan.gfx.ColourRGB.prototype.toCssRgbString = function ()
// Returns:
//  (string)
{
    return "rgb(" +
        Math.round(this.r * 255).toString() + ", " +
        Math.round(this.g * 255).toString() + ", " +
        Math.round(this.b * 255).toString() + ")";
};

dan.gfx.ColourRGB.prototype.to6CharHexString = function ()
// Returns:
//  (string)
{
    var r = Math.round(this.r * 255).toString(16);
    if (r.length == 1)
        r = "0" + r;
    var g = Math.round(this.g * 255).toString(16);
    if (g.length == 1)
        g = "0" + g;
    var b = Math.round(this.b * 255).toString(16);
    if (b.length == 1)
        b = "0" + b;
    return r + g + b;
};

dan.gfx.ColourRGB.prototype.toInt = function ()
// Returns:
//  (integer number)
{
    return Math.floor(this.r * 255) << 16 |
        Math.floor(this.g * 255) << 8 |
        Math.floor(this.b * 255);
};

// + }}}

// + Set from other colour representations {{{

dan.gfx.ColourRGB.prototype.setFromInt = function (i_value)
// Params:
//  i_name:
//   (string)
//
// Returns:
//  (dan.gfx.ColourRGB)
{
    this.r = ((i_value >> 16) & 0xFF) / 255;
    this.g = ((i_value >> 8)  & 0xFF) / 255;
    this.b = ((i_value)       & 0xFF) / 255;

    return this;
};

dan.gfx.ColourRGB.prototype.setFromName = function (i_name)
// Params:
//  i_name:
//   (string)
//
// Returns:
//  (dan.gfx.ColourRGB)
{
    if (i_name in dan.gfx.ColourRGB.colourNames)
        this.setFromHexString(dan.gfx.ColourRGB.colourNames[i_name]);

    return this;
};

dan.gfx.ColourRGB.prototype.setFromHexString = function (i_hexString)
// Params:
//  i_hexString:
//   (string)
//   May be a 3 char "RGB" or 6 char "RRGGBB" string,
//   or a 4 char "ARGB" or 8 char "AARRGGBB" string in which cases the alpha is discarded.
//   Any of these forms may optionally have a leading "#".
//
// Returns:
//  (dan.gfx.ColourRGB)
{
    // Remove leading hash if present
    if (i_hexString[0] == "#")
        i_hexString = i_hexString.slice(1);

    // Convert "RGB" to "RRGGBB" by doubling characters
    if (i_hexString.length == 3)
    {
        i_hexString = i_hexString[0] + i_hexString[0] +  + i_hexString[1] + i_hexString[1] + i_hexString[2] + i_hexString[2];
    }
    // Convert "ARGB" to "RRGGBB" by doubling characters and discarding alpha
    else if (i_hexString.length == 3)
    {
        i_hexString = i_hexString[1] + i_hexString[1] +  + i_hexString[2] + i_hexString[2] + i_hexString[3] + i_hexString[3];
    }
    // Convert "AARRGGBB" to "RRGGBB" by discarding alpha
    else if (i_hexString.length == 8)
    {
        i_hexString = i_hexString.slice(2);
    }

    // Parse string as "RRGGBB"
    this.r = parseInt(i_hexString.substr(0, 2), 16) / 255;
    this.g = parseInt(i_hexString.substr(2, 2), 16) / 255;
    this.b = parseInt(i_hexString.substr(4, 2), 16) / 255;

    //
    return this;
};

dan.gfx.ColourRGB.prototype.setFromCssString = function (i_description)
// Params:
//  i_description:
//   (string)
//   A CSS3 colour value
//   ie. one of the following forms:
//    "orange"
//    "#FD0"
//    "#FFA500"
//    "rgb(255, 165, 0)"
//    "rgba(255, 165, 0, 1.0)"
//     In this last case which includes an alpha value, each of the other channels will
//     be multiplied by the alpha value and then the alpha value will be discarded.
{
    if (i_description[0] == "#")
    {
        this.setFromHexString(i_description.slice(1));
    }
    else if (i_description.slice(0, 4) == "rgb(" &&
             i_description[i_description.length - 1] == ")")
    {
        var components = i_description.slice(4, -1).split(",");
        this.r = components[0] / 255;
        this.g = components[1] / 255;
        this.b = components[2] / 255;
    }
    else if (i_description.slice(0, 5) == "rgba(" &&
             i_description[i_description.length - 1] == ")")
    {
        var components = i_description.slice(5, -1).split(",");
        // Multiply alpha into colours throughout
        this.r = components[0] * components[3] / 255;
        this.g = components[1] * components[3] / 255;
        this.b = components[2] * components[3] / 255;
    }
    else if (i_description in dan.gfx.ColourRGB.colourNames)
    {
        var hexString = dan.gfx.ColourRGB.colourNames[i_description];
        this.r = parseInt(hexString.substr(1, 2), 16) / 255;
        this.g = parseInt(hexString.substr(3, 2), 16) / 255;
        this.b = parseInt(hexString.substr(5, 2), 16) / 255;
    }

    //
    return this;
};

// + }}}

// + Miscellaneous operations {{{

// + + Member versions, modifying 'this' {{{

dan.gfx.ColourRGB.prototype.mix = function (i_other, i_f)
// Aka 'lerp'
//
// Params:
//  i_other: (dan.gfx.ColourRGB)
//  i_f:
//   Either (float)
//   or (null or undefined)
//    Use default of 0.5.
//
// Returns:
//  (dan.gfx.ColourRGB)
{
    // Apply default arguments
    if (!i_f)
        i_f = 0.5;

    //
    this.r = this.r + i_f*(i_other.r - this.r);
    this.g = this.g + i_f*(i_other.g - this.g);
    this.b = this.b + i_f*(i_other.b - this.b);
    return this;
};

// + + }}}

// + + Non-member versions, returning new object {{{

dan.gfx.ColourRGB.mix = function (i_colour1, i_colour2, i_f)
// Aka 'lerp'
//
// Params:
//  i_colour1: (dan.gfx.ColourRGB)
//  i_colour2: (dan.gfx.ColourRGB)
//  i_f:
//   Either (float)
//   or (null or undefined)
//    Use default of 0.5.
//
// Returns:
//  (dan.gfx.ColourRGB)
{
    // Apply default arguments
    if (!i_f)
        i_f = 0.5;

    //
    return new dan.gfx.ColourRGB(
        i_colour1.r + i_f*(i_colour2.r - i_colour1.r),
        i_colour1.g + i_f*(i_colour2.g - i_colour1.g),
        i_colour1.b + i_f*(i_colour2.b - i_colour1.b));
};

// + + }}}

// + }}}

// From http://www.w3.org/TR/css3-color/
dan.gfx.ColourRGB.colourNames = {
  	"aliceblue": "#f0f8ff",
  	"antiquewhite": "#faebd7",
  	"aqua": "#00ffff",
  	"aquamarine": "#7fffd4",
  	"azure": "#f0ffff",
  	"beige": "#f5f5dc",
  	"bisque": "#ffe4c4",
  	"black": "#000000",
  	"blanchedalmond": "#ffebcd",
  	"blue": "#0000ff",
  	"blueviolet": "#8a2be2",
  	"brown": "#a52a2a",
  	"burlywood": "#deb887",
  	"cadetblue": "#5f9ea0",
  	"chartreuse": "#7fff00",
  	"chocolate": "#d2691e",
  	"coral": "#ff7f50",
  	"cornflowerblue": "#6495ed",
  	"cornsilk": "#fff8dc",
  	"crimson": "#dc143c",
  	"cyan": "#00ffff",
  	"darkblue": "#00008b",
  	"darkcyan": "#008b8b",
  	"darkgoldenrod": "#b8860b",
  	"darkgray": "#a9a9a9",
  	"darkgreen": "#006400",
  	"darkgrey": "#a9a9a9",
  	"darkkhaki": "#bdb76b",
  	"darkmagenta": "#8b008b",
  	"darkolivegreen": "#556b2f",
  	"darkorange": "#ff8c00",
  	"darkorchid": "#9932cc",
  	"darkred": "#8b0000",
  	"darksalmon": "#e9967a",
  	"darkseagreen": "#8fbc8f",
  	"darkslateblue": "#483d8b",
  	"darkslategray": "#2f4f4f",
  	"darkslategrey": "#2f4f4f",
  	"darkturquoise": "#00ced1",
  	"darkviolet": "#9400d3",
  	"deeppink": "#ff1493",
  	"deepskyblue": "#00bfff",
  	"dimgray": "#696969",
  	"dimgrey": "#696969",
  	"dodgerblue": "#1e90ff",
  	"firebrick": "#b22222",
  	"floralwhite": "#fffaf0",
  	"forestgreen": "#228b22",
  	"fuchsia": "#ff00ff",
  	"gainsboro": "#dcdcdc",
  	"ghostwhite": "#f8f8ff",
  	"gold": "#ffd700",
  	"goldenrod": "#daa520",
  	"gray": "#808080",
  	"green": "#008000",
  	"greenyellow": "#adff2f",
  	"grey": "#808080",
  	"honeydew": "#f0fff0",
  	"hotpink": "#ff69b4",
  	"indianred": "#cd5c5c",
  	"indigo": "#4b0082",
  	"ivory": "#fffff0",
  	"khaki": "#f0e68c",
  	"lavender": "#e6e6fa",
  	"lavenderblush": "#fff0f5",
  	"lawngreen": "#7cfc00",
  	"lemonchiffon": "#fffacd",
  	"lightblue": "#add8e6",
  	"lightcoral": "#f08080",
  	"lightcyan": "#e0ffff",
  	"lightgoldenrodyellow": "#fafad2",
  	"lightgray": "#d3d3d3",
  	"lightgreen": "#90ee90",
  	"lightgrey": "#d3d3d3",
  	"lightpink": "#ffb6c1",
  	"lightsalmon": "#ffa07a",
  	"lightseagreen": "#20b2aa",
  	"lightskyblue": "#87cefa",
  	"lightslategray": "#778899",
  	"lightslategrey": "#778899",
  	"lightsteelblue": "#b0c4de",
  	"lightyellow": "#ffffe0",
  	"lime": "#00ff00",
  	"limegreen": "#32cd32",
  	"linen": "#faf0e6",
  	"magenta": "#ff00ff",
  	"maroon": "#800000",
  	"mediumaquamarine": "#66cdaa",
  	"mediumblue": "#0000cd",
  	"mediumorchid": "#ba55d3",
  	"mediumpurple": "#9370db",
  	"mediumseagreen": "#3cb371",
  	"mediumslateblue": "#7b68ee",
  	"mediumspringgreen": "#00fa9a",
  	"mediumturquoise": "#48d1cc",
  	"mediumvioletred": "#c71585",
  	"midnightblue": "#191970",
  	"mintcream": "#f5fffa",
  	"mistyrose": "#ffe4e1",
  	"moccasin": "#ffe4b5",
  	"navajowhite": "#ffdead",
  	"navy": "#000080",
  	"oldlace": "#fdf5e6",
  	"olive": "#808000",
  	"olivedrab": "#6b8e23",
  	"orange": "#ffa500",
  	"orangered": "#ff4500",
  	"orchid": "#da70d6",
  	"palegoldenrod": "#eee8aa",
  	"palegreen": "#98fb98",
  	"paleturquoise": "#afeeee",
  	"palevioletred": "#db7093",
  	"papayawhip": "#ffefd5",
  	"peachpuff": "#ffdab9",
  	"peru": "#cd853f",
  	"pink": "#ffc0cb",
  	"plum": "#dda0dd",
  	"powderblue": "#b0e0e6",
  	"purple": "#800080",
  	"red": "#ff0000",
  	"rosybrown": "#bc8f8f",
  	"royalblue": "#4169e1",
  	"saddlebrown": "#8b4513",
  	"salmon": "#fa8072",
  	"sandybrown": "#f4a460",
  	"seagreen": "#2e8b57",
  	"seashell": "#fff5ee",
  	"sienna": "#a0522d",
  	"silver": "#c0c0c0",
  	"skyblue": "#87ceeb",
  	"slateblue": "#6a5acd",
  	"slategray": "#708090",
  	"slategrey": "#708090",
  	"snow": "#fffafa",
  	"springgreen": "#00ff7f",
  	"steelblue": "#4682b4",
  	"tan": "#d2b48c",
  	"teal": "#008080",
  	"thistle": "#d8bfd8",
  	"tomato": "#ff6347",
  	"turquoise": "#40e0d0",
  	"violet": "#ee82ee",
  	"wheat": "#f5deb3",
  	"white": "#ffffff",
  	"whitesmoke": "#f5f5f5",
  	"yellow": "#ffff00",
  	"yellowgreen": "#9acd32"
};
