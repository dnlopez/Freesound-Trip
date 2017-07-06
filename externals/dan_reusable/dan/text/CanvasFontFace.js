// CanvasFontFace: A class to store a font in which the glyphs are stored in HTML canvas(es).


// This namespace
// #require "text.js"

// Dan reusable
// #require <dan/math/Rect2.js>
// #require <dan/math/Vector2.js>


dan.text.CanvasFontGlyph = function (i_canvasNo, i_rect, i_bearing, i_advance)
// Where to find the graphic for a single character
{
    this.canvasNo = i_canvasNo;
    // canvasNo:
    //  (integer number)
    //  Which canvas of the CanvasFontFace contains the glyph of this character
    this.rect = i_rect;
    // rect:
    //  (dan.math.Rect2)
    //  The position and size on the canvas of the character's glyph

    this.bearing = i_bearing;
    // bearing:
    //  (dan.math.Vector2)
    //  Distance from the drawing pen position to where the top-left of the glyph should be
    this.advance = i_advance;
    // advance:
    //  (dan.math.Vector2)
    //  The number of pixels that the drawing pen position should be moved
    //  after printing this character, to be ready for the next one
};


// Type: CanvasFontCharmap
//  (array of CanvasFontGlyph)
//  Represents a character map,
//  ie. a full alphabet of mappings from character code numbers to glyphs.
//  This collection of mappings is also known as a character encoding.
//
//  If being lazy could use multiple charmaps for different faces/styles eg. bold and italic,
//  although strictly speaking you should make multiple CanvasFontFace objects.


// + Construction {{{

dan.text.CanvasFontFace = function (i_canvases, i_charmaps, i_unitsPerEm)
// Params:
//  i_canvases:
//   (array of HTMLCanvasElement)
//  i_charmaps:
//   (array of CanvasFontCharmap)
//  i_unitsPerEm:
//   (number)
{
    // Apply default arguments
    if (i_canvases == null)
        i_canvases = [];
    if (i_charmaps == null)
        i_charmaps = [];
    if (i_unitsPerEm == null)
        i_unitsPerEm = 1;

    //
    this.canvases = i_canvases;
    // canvases:
    //  (array of HTMLCanvasElement)
    this.charmaps = i_charmaps;
    // charmaps:
    //  (array of CanvasFontCharmap)

    this.unitsPerEm = i_unitsPerEm;

    this.contexts = [];
    // contexts:
    //  (array of CanvasRenderingContext2D)
    for (var canvasNo = 0; canvasNo < this.canvases.length; ++canvasNo)
        this.contexts.push(this.canvases[canvasNo].getContext("2d"));
};

// + }}}

// + Charmaps {{{

dan.text.CanvasFontFace.prototype.charmap_count = function ()
// Returns:
//  (integer number)
{
    return this.charmaps.length();
};

//unsigned int charmap_charCount() const { return m_shared->m_charmaps.front().size(); }

// + }}}

dan.text.CanvasFontFace.prototype.getGlyph = function (i_charmapNo, i_charCode)
// [previous name getChar]
//
// Params:
//  i_charmapNo:
//   (integer number)
//  i_charCode:
//   (integer number)
//
// Returns:
//  (CanvasFontGlyph)
{
    if (i_charmapNo >= this.charmaps.length())
        throw("in CanvasFontFace::getChar, i_charmapNo out of range");
    var charmap = this.charmaps[i_charmapNo];

    var glyph = charmap[i_charCode];
    if (!glyph)
        throw("in CanvasFontFace::getChar, no glyph in charmap for i_charCode");

    return glyph;
}

dan.text.CanvasFontFace.prototype.getGlyphCanvas = function (i_charmapNo, i_charCode)
// [previous name getCharCanvas]
//
// Params:
//  i_charmapNo:
//   (integer number)
//  i_charCode:
//   (integer number)
//
// Returns:
//  (HTMLCanvasElement)
{
    if (i_charmapNo >= this.charmaps.length())
        throw("in CanvasFontFace::getCharCanvas, i_charmapNo out of range");
    var charmap = this.charmaps[i_charmapNo];

    var glyph = charmap[i_charCode];
    if (!glyph)
        throw("in CanvasFontFace::getCharCanvas, no glyph in charmap for i_charCode");

    return this.canvases[glyph.canvasNo];
}

dan.text.CanvasFontFace.prototype.getGlyphRect = function (i_charmapNo, i_charCode)
// [previous name getCharRect]
//
// Params:
//  i_charmapNo:
//   (integer number)
//  i_charCode:
//   (integer number)
//
// Returns:
//  (dan.math.Rect2)
{
    if (i_charmapNo >= this.charmaps.length())
        throw("in CanvasFontFace::getCharRect, i_charmapNo out of range");
    var charmap = this.charmaps[i_charmapNo];

    var glyph = charmap[i_charCode];
    if (!glyph)
        throw("in CanvasFontFace::getCharRect, no glyph in charmap for i_charCode");

    return glyph.rect;
}

/*
    unsigned int charWidthMax() const
    {
        unsigned int maxValue = 0;
        for (unsigned int charmapNo = 0; charmapNo < m_shared->m_charmaps.size(); ++charmapNo)
        {
            const CanvasFontCharmap & charmap = m_shared->m_charmaps[charmapNo];
            for (unsigned int charNo = 0; charNo < charmap.size(); ++charNo)
            {
                if (charmap[charNo].rect.width() > static_cast<int>(maxValue))
                {
                    maxValue = charmap[charNo].rect.width();
                }
            }
        }
        return maxValue;
    }

    int charAdvanceXMax() const
    {
        int maxValue = 0;
        for (unsigned int charmapNo = 0; charmapNo < m_shared->m_charmaps.size(); ++charmapNo)
        {
            const CanvasFontCharmap & charmap = m_shared->m_charmaps[charmapNo];
            for (unsigned int charNo = 0; charNo < charmap.size(); ++charNo)
            {
                if (charmap[charNo].advanceX > static_cast<int>(maxValue))
                {
                    maxValue = charmap[charNo].advanceX;
                }
            }
        }
        return maxValue;
    }

    unsigned int charHeightMax() const
    {
        unsigned int maxValue = 0;
        for (unsigned int charmapNo = 0; charmapNo < m_shared->m_charmaps.size(); ++charmapNo)
        {
            const CanvasFontCharmap & charmap = m_shared->m_charmaps[charmapNo];
            for (unsigned int charNo = 0; charNo < charmap.size(); ++charNo)
            {
                if (charmap[charNo].rect.height() > static_cast<int>(maxValue))
                {
                    maxValue = charmap[charNo].rect.height();
                }
            }
        }
        return maxValue;
    }
};
*/


dan.text.CanvasFontFace.fromSystemFont = function (i_fontFamily, i_fontWeight, i_fontStyle, i_fontSize, i_charCodeRanges)
// Render characters from a system font onto a canvas
// and construct a CanvasFontFace from it.
//
// Params:
//  i_fontFamily:
//   (string)
//   A font family name as recognized by canvas/CSS.
//   Either the name of a family with an installed font or
//   a generic family name ("serif", "sans-serif", "cursive", "fantasy", "monospace").
//  i_fontWeight:
//   (string)
//   A font weight as recognized by canvas.
//   Either a multiple of 100 in string form, min "100" max "900"
//   or "normal" (equivalent to 400) or "bold" (equivalent to 700)
//   or "fakebold" to emulate a bold face by drawing a 1 pixel stroke around each character.
//  i_fontStyle:
//   (string)
//   A font style name as recognized by canvas/CSS.
//   One of "normal", "italic", "oblique"
//  i_fontSize:
//   (number)
//   In pixels.
//  i_charCodeRanges:
//   (array)
//   Which characters from the system font to include in the canvas font.
//   Each element is either (integer number),
//    the Unicode code point of a character to include
//   or (array of 1 integer number),
//    the Unicode code point of a character to include
//   or (array of 2 integer number),
//    an inclusive range [first, last] of Unicode code points of characters to include.
//
// Returns:
//  (dan.text.CanvasFontFace)
{
    // Make a canvas which is big enough to hold every glyph from the system font
    // in its entirety. We make a square with sides of twice i_fontSize (pixels),
    // which should be more than enough.
    //
    // (Sadly it doesn't seem possible to work out *exactly* how much is enough from
    // what metrics we can obtain for system fonts here in browser Javascript.
    // i_fontSize is the height of the em-box in pixels, however even in common fonts
    // like Times New Roman there are characters that extend arbitrarily above the
    // top of this box (uppercase letters with accents eg. "\u00C1") and below the bottom
    // of this box (lower case j, lower case y). Horizontally speaking, there are also
    // characters in Times New Roman that extend arbitrarily to the left of zero / the pen
    // position (lower case j), so we must make scratch space for those cases too.
    var canvas = document.createElement("canvas");
    canvas.width = i_fontSize * 2;
    canvas.height = i_fontSize * 2;
    var ctx = canvas.getContext("2d");

    // debug
    //canvas.setAttribute("style", "position: absolute; left: -1px; top: -1px; border: 1px solid red;");
    //window.ctx = ctx;
    //document.body.appendChild(canvas);

    var fontWeightForContext = i_fontWeight;
    if (i_fontWeight == "normal" || i_fontWeight == "fakebold")
        fontWeightForContext = "";
    var fontStyleForContext = i_fontStyle;
    if (i_fontStyle == "normal")
        fontStyleForContext = "";
    var fontDescription = fontStyleForContext + " " + fontWeightForContext + " " + i_fontSize.toString() + "px " + i_fontFamily;

    // Draw all chars with their (left line, baseline) aligned to the middle point of canvas
    // (all overlapping each other).
    ctx.fillStyle = "white";
    ctx.font = fontDescription;
    ctx.textBaseline = "alphabetic";

    var charCount = 0;
    for (var charCodeRangeNo = 0; charCodeRangeNo < i_charCodeRanges.length; ++charCodeRangeNo)
    {
        var charCodeRange = i_charCodeRanges[charCodeRangeNo];

        if (!(charCodeRange instanceof Array))
            charCodeRange = [charCodeRange];
        if (charCodeRange.length == 1)
            charCodeRange.push(charCodeRange[0]);

        for (var charCode = charCodeRange[0]; charCode <= charCodeRange[1]; ++charCode)
        {
            ctx.fillText(String.fromCharCode(charCode), i_fontSize, i_fontSize);
            ++charCount;
        }
    }

    // Find the bounding box of this union of characters
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    var bb = getBoundingBox(imageData);
    var topLeftToPen = [i_fontSize - bb[0], i_fontSize - bb[1]];
    var commonGlyphWidth = bb[2] - bb[0] + 1;
    var commonGlyphHeight = bb[3] - bb[1] + 1;

    // To get total size of bitmap rectangular 'cell' to allocate for each glyph,
    // add 1 pixel of padding on each side to avoid overspill when doing bilinear filtering
    // or such like (eg. typically later with GL)
    var padding = 1;
    var cellWidth = commonGlyphWidth + padding * 2;
    var cellHeight = commonGlyphHeight + padding * 2;
    //  Adjust topLeftToPen so it's from the corner of the cell, rather than the glyph
    //topLeftToPen[0] += padding;
    //topLeftToPen[1] += padding;

    // Work out positions for chars so that the canvas may be square.
    // This is not essential for canvas drawing, but may be helpful if later want to
    // upload the canvas to a GL texture (convert to a GlTextureFontFace instance).
    var packed = packFixedSizeRectsIntoSquarelike(cellWidth, cellHeight, charCount);

    // Resize canvas to be big enough to hold everything
    canvas.width = packed.totalWidth;
    canvas.height = packed.totalHeight;

    // Loop over the chars again, drawing each one on the big canvas,
    // and building up a CanvasFontCharmap
    ctx.fillStyle = "white";
    ctx.font = fontDescription;
    ctx.textBaseline = "alphabetic";

    var charmap = [];

    // debug
    //ctx.strokeStyle = "red";
    //ctx.lineWidth = 1;

    //
    if (i_fontWeight == "fakebold")
    {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
    }

    for (var charCodeRangeNo = 0; charCodeRangeNo < i_charCodeRanges.length; ++charCodeRangeNo)
    {
        var charCodeRange = i_charCodeRanges[charCodeRangeNo];

        if (!(charCodeRange instanceof Array))
            charCodeRange = [charCodeRange];
        if (charCodeRange.length == 1)
            charCodeRange.push(charCodeRange[0]);

        for (var charCode = charCodeRange[0]; charCode <= charCodeRange[1]; ++charCode)
        {
            var charString = String.fromCharCode(charCode);

            var nextTopLeft = packed.topLefts.shift();
            //ctx.strokeRect(nextTopLeft[0] + 0.5, nextTopLeft[1] + 0.5, commonGlyphWidth - 1, commonGlyphHeight - 1);
            ctx.fillText(charString, nextTopLeft[0] + padding + topLeftToPen[0], nextTopLeft[1] + padding + topLeftToPen[1]);
            if (i_fontWeight == "fakebold")
            {
                ctx.strokeText(charString, nextTopLeft[0] + padding + topLeftToPen[0], nextTopLeft[1] + padding + topLeftToPen[1]);
            }

            charmap[charCode] = new dan.text.CanvasFontGlyph(
                0,
                dan.math.Rect2.fromXYWH(nextTopLeft[0] + padding, nextTopLeft[1] + padding, commonGlyphWidth, commonGlyphHeight),
                dan.math.Vector2.fromElements(-topLeftToPen[0], -topLeftToPen[1]),
                dan.math.Vector2.fromElements(ctx.measureText(charString).width, 0));
        }
    }

    var newFontFace = new dan.text.CanvasFontFace([canvas], [charmap], i_fontSize);
    newFontFace.fontFamily = i_fontFamily;
    newFontFace.fontWeight = i_fontWeight;
    newFontFace.fontStyle = i_fontStyle;
    newFontFace.fontSize = i_fontSize;
    newFontFace.ascent = i_fontSize - bb[1] + 1;
    newFontFace.descent = bb[3] - i_fontSize;
    return newFontFace;
};

function packFixedSizeRectsIntoSquarelike(i_rectWidth, i_rectHeight, i_rectCount)
// Layout i_rectCount input rectangles, all of the same size i_rectWidth x i_rectHeight,
// in a rectangle of consequent size which is as close to being a square as possible.
//
// Params:
//  i_rectWidth, i_rectHeight:
//   (number)
//  i_rectCount:
//   (integer number)
//
// Returns:
//  (object with specific key-value properties)
//  Keys:
//   totalWidth, totalHeight:
//    (integer number)
//    The size of the consequent rectangle that can contain all of the input rects.
//   topLefts:
//    (array)
//    The top-left position of each input rectangle laid out within the consequent rectangle.
//    Each element is:
//     (array of 2 integer number)
//     x and y coordinates.
{
    var topLefts = [];
    var totalWidth = 0;
    var totalHeight = 0;
    if (i_rectCount == 0)
        return [topLefts, totalWidth, totalHeight];

    // Do first rectangle seperately because the code in the loop that opens a new row/column
    // requires a non-zero existing totalWidth and totalHeight
    topLefts.push([0, 0])

    //
    var totalWidth = i_rectWidth;
    var totalHeight = i_rectHeight;
    //  Zero will cause a new row/column to be opened on the first run through the loop
    var rectsLeftInCurrentlyOpenRowOrCol = 0;
    //  which will initialize these
    var nextRectTopLeftX;
    var nextRectTopLeftXIncrement;
    var nextRectTopLeftY;
    var nextRectTopLeftYIncrement;

    for (var rectNo = 0; rectNo < i_rectCount; ++rectNo)
    {
        if (rectsLeftInCurrentlyOpenRowOrCol == 0)
        {
            // Shall we open a new row or column?
            // Find which action would increase the size of the square least
            var newSideLengthIfAddColumn = totalWidth + i_rectWidth;
            var newSideLengthIfAddRow = totalHeight + i_rectHeight;

            // Add new column
            if (newSideLengthIfAddColumn < newSideLengthIfAddRow)
            {
                nextRectTopLeftX = totalWidth;
                nextRectTopLeftXIncrement = 0;
                nextRectTopLeftY = 0;
                nextRectTopLeftYIncrement = i_rectHeight;
                rectsLeftInCurrentlyOpenRowOrCol = totalHeight / i_rectHeight;

                totalWidth += i_rectWidth;
            }
            // Add new row
            else
            {
                nextRectTopLeftX = 0;
                nextRectTopLeftXIncrement = i_rectWidth;
                nextRectTopLeftY = totalHeight;
                nextRectTopLeftYIncrement = 0;
                rectsLeftInCurrentlyOpenRowOrCol = totalWidth / i_rectWidth;

                totalHeight += i_rectHeight;
            }
        }

        topLefts.push([nextRectTopLeftX, nextRectTopLeftY]);
        nextRectTopLeftX += nextRectTopLeftXIncrement;
        nextRectTopLeftY += nextRectTopLeftYIncrement;
        --rectsLeftInCurrentlyOpenRowOrCol;
    }

    return { totalWidth: totalWidth,
             totalHeight: totalHeight,
             topLefts: topLefts };
}

function getBoundingBox(i_imageData)
// Find the bounding rectangle of non-transparent pixels on an ImageData.
//
// Params:
//  i_imageData:
//   (ImageData)
//
// Returns:
//  (array of 4 integer number)
//  The left, top, right and bottom coordinates of the bounding rectangle.
//  All coordinates are inclusive, ie. the right column and bottom row with those indexes
//  do contain a non-transparent pixel, similar to how the left column and top row do.
{
    var imageWidth = i_imageData.width;
    var imageHeight = i_imageData.height;
    var imageBytes = i_imageData.data;
    var byteCount = imageBytes.length;

    // From top search downwards for row with non-transparent pixel
    for (var byteNo = 3; byteNo < byteCount; byteNo += 4)
    {
        if (imageBytes[byteNo] != 0)
            break;
    }
    var top = Math.floor((byteNo >> 2) / imageWidth);

    // From bottom search upwards for row with non-zero pixel
    for (var byteNo = byteCount - 1; byteNo >= 0; byteNo -= 4)
    {
        if (imageBytes[byteNo] != 0)
            break;
    }
    var bottom = Math.floor((byteNo >> 2) / imageWidth);

    // From left search rightwards for column with non-zero pixel
    var left = 0;
    var found = false;
    while (left < imageWidth)
    {
        // Search column from top to bottom
        for (var byteNo = (left << 2) + 3; byteNo < byteCount; byteNo += imageWidth << 2)
        {
            if (imageBytes[byteNo] != 0)
            {
                found = true;
                break;
            }
        }
        if (found)
            break;

        //
        ++left;
    }

    // From right search leftwards for column with non-zero pixel
    var right = imageWidth - 1;
    found = false;
    while (right >= 0)
    {
        // Search column from top to bottom
        for (var byteNo = (right << 2) + 3; byteNo < byteCount; byteNo += imageWidth << 2)
        {
            if (imageBytes[byteNo] != 0)
            {
                found = true;
                break;
            }
        }
        if (found)
            break;

        //
        --right;
    }

    //
    return [left, top, right, bottom];
}
