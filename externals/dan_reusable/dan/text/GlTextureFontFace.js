// GlTextureFontFace: A class to store a font in which the glyphs are stored in GL textures.


// This namespace
// #require "text.js"

// Dan reusable
// #require <dan/math/Rect2.js>
// #require <dan/gfx/gl/Texture2D.js>


dan.text.GlTextureFontGlyph = function (i_textureNo, i_rect, i_bearing, i_advance)
// Where to find the graphic for a single character
{
    this.textureNo = i_textureNo;
    // textureNo:
    //  (integer number)
    //  Which texture of the GlTextureFontFace contains the glyph of this character
    this.rect = i_rect;
    // rect:
    //  (dan.math.Rect2)
    //  The position and size on the texture of the character's glyph

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


// Type: GlTextureFontCharmap
//  (array of GlTextureFontGlyph)
//  Represents a character map,
//  ie. a full alphabet of mappings from character code numbers to glyphs.
//  This collection of mappings is also known as a character encoding.
//
//  If being lazy could use multiple charmaps for different faces/styles eg. bold and italic,
//  although strictly speaking you should make multiple GlTextureFontFace objects.


// + Construction {{{

dan.text.GlTextureFontFace = function (i_textures, i_charmaps, i_unitsPerEm)
// Params:
//  i_textures:
//   (array of dan.gfx.gl.Texture2D)
//  i_charmaps:
//   (array of GlTextureFontCharmap)
//  i_unitsPerEm:
//   (number)
{
    // Apply default arguments
    if (i_textures == null)
        i_textures = [];
    if (i_charmaps == null)
        i_charmaps = [];
    if (i_unitsPerEm == null)
        i_unitsPerEm = 1;

    //
    this.textures = i_textures;
    // textures:
    //  (array of dan.gfx.gl.Texture2D)
    this.charmaps = i_charmaps;
    // charmaps:
    //  (array of GlTextureFontCharmap)

    this.unitsPerEm = i_unitsPerEm;

    /*
    font-family="Times New Roman"

    font-weight="400"
    font-stretch="normal"
    font-style="italic"  // if italic
    slope="-16.333"  // if italic

    units-per-em="2048"
    panose-1="2 2 6 3 5 4 5 2 3 4"

    ascent="1638"
    descent="-410"
    x-height="916"
    cap-height="1356"

    bbox="-1164 -628 4096 2062"

    underline-thickness="100"
    underline-position="-173"

    unicode-range="U+0021-U+FFFC"
    */
};

// + }}}

// + Charmaps {{{

dan.text.GlTextureFontFace.prototype.charmap_count = function ()
// Returns:
//  (integer number)
{
    return this.charmaps.length();
};

//unsigned int charmap_charCount() const { return m_shared->m_charmaps.front().size(); }

// + }}}

// + Get details of a single char {{{

dan.text.GlTextureFontFace.prototype.getGlyph = function (i_charmapNo, i_charCode)
// [previous name getChar]
//
// Params:
//  i_charmapNo:
//   (integer number)
//  i_charCode:
//   (integer number)
//
// Returns:
//  (GlTextureFontGlyph)
{
    if (i_charmapNo >= this.charmaps.length())
        throw("in GlTextureFontFace::getChar, i_charmapNo out of range");
    var charmap = this.charmaps[i_charmapNo];

    var glyph = charmap[i_charCode];
    if (!glyph)
        throw("in GlTextureFontFace::getChar, no glyph in charmap for i_charCode");

    return glyph;
}

dan.text.GlTextureFontFace.prototype.getGlyphTexture = function (i_charmapNo, i_charCode)
// [previous name getCharTexture]
//
// Params:
//  i_charmapNo:
//   (integer number)
//  i_charCode:
//   (integer number)
//
// Returns:
//  (dan.gfx.gl.Texture2D)
{
    if (i_charmapNo >= this.charmaps.length())
        throw("in GlTextureFontFace::getCharTexture, i_charmapNo out of range");
    var charmap = this.charmaps[i_charmapNo];

    var glyph = charmap[i_charCode];
    if (!glyph)
        throw("in GlTextureFontFace::getCharTexture, no glyph in charmap for i_charCode");

    return this.textures[glyph.textureNo];
}

dan.text.GlTextureFontFace.prototype.getGlyphRect = function (i_charmapNo, i_charCode)
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
        throw("in GlTextureFontFace::getCharRect, i_charmapNo out of range");
    var charmap = this.charmaps[i_charmapNo];

    var glyph = charmap[i_charCode];
    if (!glyph)
        throw("in GlTextureFontFace::getCharRect, no glyph in charmap for i_charCode");

    return glyph.rect;
}

// + }}}

/*
    unsigned int charWidthMax() const
    {
        unsigned int maxValue = 0;
        for (unsigned int charmapNo = 0; charmapNo < m_shared->m_charmaps.size(); ++charmapNo)
        {
            const GlTextureFontCharmap & charmap = m_shared->m_charmaps[charmapNo];
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
            const GlTextureFontCharmap & charmap = m_shared->m_charmaps[charmapNo];
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
            const GlTextureFontCharmap & charmap = m_shared->m_charmaps[charmapNo];
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

dan.text.GlTextureFontFace.fromCanvasFont = function (i_canvasFontFace)
// Params:
//  i_canvasFontFace:
//   (dan.text.CanvasFontFace)
//
// Returns:
//  (dan.text.GlTextureFontFace)
{
    var textures = [];
    for (var canvasNo = 0; canvasNo < i_canvasFontFace.canvases.length; ++canvasNo)
    {
        textures.push(dan.gfx.gl.Texture2D.fromImage(null, null, i_canvasFontFace.canvases[canvasNo],
                                                     null, true, true));
    }

    var charmaps = [];
    for (var srcCharmapNo = 0; srcCharmapNo < i_canvasFontFace.charmaps.length; ++srcCharmapNo)
    {
        var srcCharmap = i_canvasFontFace.charmaps[srcCharmapNo];

        var charmap = [];
        var charCodes = Object.keys(srcCharmap);
        for (var charCodeCount = charCodes.length, charCodeNo = 0; charCodeNo < charCodeCount; ++charCodeNo)
        {
            var charCode = charCodes[charCodeNo];

            var glyph = srcCharmap[charCode];

            charmap[charCode] = new dan.text.GlTextureFontGlyph(
                glyph.canvasNo,
                glyph.rect.clone(),
                glyph.bearing.clone(),
                glyph.advance.clone());
        }
        charmaps.push(charmap);
    }

    var newFontFace = new dan.text.GlTextureFontFace(textures, charmaps, i_canvasFontFace.unitsPerEm);
    newFontFace.fontFamily = i_canvasFontFace.fontFamily;
    newFontFace.fontWeight = i_canvasFontFace.fontWeight;
    newFontFace.fontStyle = i_canvasFontFace.fontStyle;
    newFontFace.fontSize = i_canvasFontFace.fontSize;
    newFontFace.ascent = i_canvasFontFace.ascent;
    newFontFace.descent = i_canvasFontFace.descent;
    return newFontFace;
};
