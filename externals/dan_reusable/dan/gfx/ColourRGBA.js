
// This namespace
// #require "gfx.js"
// #require "ColourRGB.js"


// + Construction/clone {{{

dan.gfx.ColourRGBA = function (i_r, i_g, i_b, i_a)
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
//  i_a:
//   Either (float number)
//    Alpha component in range [0..1]
//   or (null or undefined)
//    Use default of 1.
{
    this.r = i_r ? i_r : 0;
    // this.r:
    //  (float number)
    //  Red component in range [0..1]

    this.g = i_g ? i_g : 0;
    // this.g:
    //  (float number)
    //  Green component in range [0..1]

    this.b = i_b ? i_b : 0;
    // this.b:
    //  (float number)
    //  Blue component in range [0..1]

    this.a = (i_a != null) ? i_a : 1;
    // this.a:
    //  (float number)
    //  Alpha component in range [0..1]
};

dan.gfx.ColourRGBA.fromInt = function (i_value)
// Params:
//  As for setFromInt().
{
    return new dan.gfx.ColourRGBA().setFromInt(i_value);
};

dan.gfx.ColourRGBA.fromName = function (i_name)
// Params:
//  As for setFromName().
{
    return new dan.gfx.ColourRGBA().setFromName(i_name);
};

dan.gfx.ColourRGBA.fromHexString = function (i_hexString)
// Params:
//  As for setFromHexString().
{
    return new dan.gfx.ColourRGBA().setFromHexString(i_hexString);
};

dan.gfx.ColourRGBA.fromCssString = function (i_cssString)
// Params:
//  As for setFromCssString().
{
    return new dan.gfx.ColourRGBA().setFromCssString(i_cssString);
};

dan.gfx.ColourRGBA.prototype.clone = function ()
{
    var newColour = new dan.gfx.ColourRGBA();
    newColour.r = this.r;
    newColour.g = this.g;
    newColour.b = this.b;
    newColour.a = this.a;
    return newColour;
};

// + }}}

// + Get to other colour representations {{{

dan.gfx.ColourRGBA.prototype.toCssRgbaString = function ()
// Returns:
//  (string)
{
    return "rgba(" +
        Math.round(this.r * 255).toString() + ", " +
        Math.round(this.g * 255).toString() + ", " +
        Math.round(this.b * 255).toString() + ", " +
        this.a.toString() + ")";
};

dan.gfx.ColourRGBA.prototype.to8CharHexString = function ()
// Returns:
//  (string)
{
    var a = Math.round(this.a * 255).toString(16);
    if (r.length == 1)
        a = "0" + a;
    var r = Math.round(this.r * 255).toString(16);
    if (r.length == 1)
        r = "0" + r;
    var g = Math.round(this.g * 255).toString(16);
    if (g.length == 1)
        g = "0" + g;
    var b = Math.round(this.b * 255).toString(16);
    if (b.length == 1)
        b = "0" + b;
    return a + r + g + b;
};

dan.gfx.ColourRGBA.prototype.toInt = function ()
// Returns:
//  (integer number)
{
    return Math.floor(this.a * 255) << 24 |
        Math.floor(this.r * 255) << 16 |
        Math.floor(this.g * 255) << 8 |
        Math.floor(this.b * 255);
};

// + }}}

// + Set from other colour representations {{{

dan.gfx.ColourRGBA.prototype.setFromInt = function (i_value)
// Params:
//  i_value:
//   (integer number)
//   0xAARRGGBB
//
// Returns:
//  (dan.gfx.ColourRGBA)
{
    this.a = ((i_value >> 24) & 0xFF) / 255;
    this.r = ((i_value >> 16) & 0xFF) / 255;
    this.g = ((i_value >> 8)  & 0xFF) / 255;
    this.b = ((i_value)       & 0xFF) / 255;

    return this;
};

dan.gfx.ColourRGBA.prototype.setFromName = function (i_name)
// Params:
//  i_name:
//   (string)
//
// Returns:
//  (dan.gfx.ColourRGBA)
{
    if (i_name in dan.gfx.ColourRGB.colourNames)
        this.setFromHexString("#FF" + dan.gfx.ColourRGB.colourNames[i_name].slice(1));

    return this;
};

dan.gfx.ColourRGBA.prototype.setFromHexString = function (i_hexString)
// Params:
//  i_hexString:
//   (string)
//   May be a 4 char "ARGB" or 8 char "AARRGGBB" string,
//   or a 3 char "RGB" or 6 char "RRGGBB" string in which cases the alpha is set to 1.
//   Any of these forms may optionally have a leading "#".
//
// Returns:
//  (dan.gfx.ColourRGBA)
{
    // Remove leading hash if present
    if (i_hexString[0] == "#")
        i_hexString = i_hexString.slice(1);

    // Convert "ARGB" to "AARRGGBB" by doubling characters
    if (i_hexString.length == 4)
    {
        i_hexString = i_hexString[0] + i_hexString[0] +  + i_hexString[1] + i_hexString[1] + i_hexString[2] + i_hexString[2] + i_hexString[3] + i_hexString[3];
    }
    // Convert "RGB" to "AARRGGBB" by doubling characters and setting alpha to FF
    else if (i_hexString.length == 3)
    {
        i_hexString = "FF" + i_hexString[0] + i_hexString[0] +  + i_hexString[1] + i_hexString[1] + i_hexString[2] + i_hexString[2];
    }
    // Convert "RRGGBB" to "AARRGGBB" by setting alpha to FF
    else if (i_hexString.length == 6)
    {
        i_hexString = "FF" + i_hexString;
    }

    // Parse string as "AARRGGBB"
    this.a = parseInt(i_hexString.substr(0, 2), 16) / 255;
    this.r = parseInt(i_hexString.substr(2, 2), 16) / 255;
    this.g = parseInt(i_hexString.substr(4, 2), 16) / 255;
    this.b = parseInt(i_hexString.substr(6, 2), 16) / 255;

    //
    return this;
};

dan.gfx.ColourRGBA.prototype.setFromCssString = function (i_description)
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
{
    if (i_description[0] == "#")
    {
        // If it's a 3 char hex number eg. "FD0", convert it to a 6 char number, ie. "FFDD00"
        if (i_description.length == 4)
        {
            i_description = "#" + i_description[1] + i_description[1] +  + i_description[2] + i_description[2] + i_description[3] + i_description[3];
        }

        //
        this.r = parseInt(i_description.substr(1, 2), 16) / 255;
        this.g = parseInt(i_description.substr(3, 2), 16) / 255;
        this.b = parseInt(i_description.substr(5, 2), 16) / 255;
        this.a = 1.0;
    }
    else if (i_description.slice(0, 4) == "rgb(" &&
             i_description[i_description.length - 1] == ")")
    {
        var components = i_description.slice(4, -1).split(",");
        this.r = components[0] / 255;
        this.g = components[1] / 255;
        this.b = components[2] / 255;
        this.a = 1.0;
    }
    else if (i_description.slice(0, 5) == "rgba(" &&
             i_description[i_description.length - 1] == ")")
    {
        var components = i_description.slice(5, -1).split(",");
        this.r = components[0] / 255;
        this.g = components[1] / 255;
        this.b = components[2] / 255;
        this.a = parseFloat(components[3]);
    }
    else if (i_description in dan.gfx.ColourRGB.colourKeywords)
    {
        var hexString = dan.gfx.ColourRGB.colourKeywords[i_description];
        this.r = parseInt(hexString.substr(1, 2), 16) / 255;
        this.g = parseInt(hexString.substr(3, 2), 16) / 255;
        this.b = parseInt(hexString.substr(5, 2), 16) / 255;
        this.a = 1.0;
    }

    //
    return this;
};

// + }}}

// + Miscellaneous operations {{{

// + + Member versions, modifying 'this' {{{

dan.gfx.ColourRGBA.prototype.mix = function (i_other, i_f)
// Aka 'lerp'
//
// Params:
//  i_other: (dan.gfx.ColourRGBA)
//  i_f:
//   Either (float)
//   or (null or undefined)
//    Use default of 0.5.
//
// Returns:
//  (dan.gfx.ColourRGBA)
{
    // Apply default arguments
    if (!i_f)
        i_f = 0.5;

    //
    this.r = this.r + i_f*(i_other.r - this.r);
    this.g = this.g + i_f*(i_other.g - this.g);
    this.b = this.b + i_f*(i_other.b - this.b);
    this.a = this.a + i_f*(i_other.a - this.a);
    return this;
};

// + + }}}

// + + Non-member versions, returning new object {{{

dan.gfx.ColourRGBA.mix = function (i_colour1, i_colour2, i_f)
// Aka 'lerp'
//
// Params:
//  i_colour1: (dan.gfx.ColourRGBA)
//  i_colour2: (dan.gfx.ColourRGBA)
//  i_f:
//   Either (float)
//   or (null or undefined)
//    Use default of 0.5.
//
// Returns:
//  (dan.gfx.ColourRGBA)
{
    // Apply default arguments
    if (!i_f)
        i_f = 0.5;

    //
    return new dan.gfx.ColourRGBA(
        i_colour1.r + i_f*(i_colour2.r - i_colour1.r),
        i_colour1.g + i_f*(i_colour2.g - i_colour1.g),
        i_colour1.b + i_f*(i_colour2.b - i_colour1.b),
        i_colour1.a + i_f*(i_colour2.a - i_colour1.a));
};

// + + }}}

// + }}}
