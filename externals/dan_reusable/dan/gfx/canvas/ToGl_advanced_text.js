
// This namespace
// #require "ToGl.js"

// Dan reusable
// #require <dan/text/GlTextureFontFace.js>
// //#require <dan/PixelRFGFBFAF.js>
// #require <dan/math/Vector2.js>
// #require <dan/math/Rect2.js>


// TODO:
//  In measurement functions, add option to use whole-font metrics for vertical extents
//  (ascender and descender) (instead of pen position or glyph bounds).
//  Then rename this file ToGl_text.js.


// + Single line {{{

// + + Measure {{{

function textLine_measure(i_glTextureFontFace, i_line, i_horizontally_measureGlyphBounds, i_vertically_measureGlyphBounds)
// Without actually drawing anything, measure the text that textLine_draw() would draw.
//
// Params:
//  i_glTextureFontFace:
//   (dan.text.GlTextureFontFace)
//   Font to draw with.
//  i_line:
//   (string)
//   A single line of text.
//  i_horizontally_measureGlyphBounds, i_vertically_measureGlyphBounds:
//   (boolean)
//   Independently for the horizontal and vertical axes,
//   false:
//    Get the bounds of all the positions that the text drawing pen would take while drawing the text.
//   true:
//    Get the bounds of all the bounding rectangles of the glyphs that would be drawn.
//
// Returns:
//  (dan.math.Rect2)
//  Rectangle containing bounds seperately calculated for the horizontal and vertical axes of the
//  above-selected characteristic in each of those axes.
//  The coordinates are relative to the initial drawing pen position, so for a typical left-to-right font,
//  if measuring drawing pen positions then the resulting left or top will typically be 0,
//  and if measuring glyph boxes then the resulting top will be negative by roughly one line's ascender
//  height, and the resulting left could be a little more than zero, if there happens to be a horizontal
//  gap between the pen position and the left edge of the glyph's bounding box for the glyph found at
//  the start of the line.
{
    var penPosition = dan.math.Vector2.fromXY(0, 0);
    var rv = dan.math.Rect2.fromSE(penPosition, penPosition);

    //
    for (var charNo = 0; charNo < i_line.length; ++charNo)
    {
        var charCode = i_line.charCodeAt(charNo);

        var glyph = i_glTextureFontFace.getGlyph(0, charCode);

        // Maybe extend result to enclose glyph box
        if (i_horizontally_measureGlyphBounds)
        {
            var glyph_left = penPosition.x + glyph.bearing.x;
            var glyph_right = glyph_left + glyph.rect.width();

            if (charNo == 0)
            {
                rv.setLeft(glyph_left);
                rv.setRight(glyph_right);
            }
            else
            {
                if (glyph_left < rv.getLeft())
                    rv.setLeft(glyph_left);
                if (glyph_right > rv.getRight())
                    rv.setRight(glyph_right);
            }
        }
        if (i_vertically_measureGlyphBounds)
        {
            var glyph_top = penPosition.y + glyph.bearing.y;
            var glyph_bottom = glyph_top + glyph.rect.height();

            if (charNo == 0)
            {
                rv.setTop(glyph_top);
                rv.setBottom(glyph_bottom);
            }
            else
            {
                if (glyph_top < rv.getTop())
                    rv.setTop(glyph_top);
                if (glyph_bottom > rv.getBottom())
                    rv.setBottom(glyph_bottom);
            }
        }

        //
        penPosition.add(glyph.advance);

        // Maybe extend result to enclose new pen position
        if (!i_horizontally_measureGlyphBounds)
        {
            if (penPosition.x < rv.getLeft())
                rv.setLeft(penPosition.x);
            if (penPosition.x > rv.getRight())
                rv.setRight(penPosition.x);
        }
        if (!i_vertically_measureGlyphBounds)
        {
            if (penPosition.y < rv.getTop())
                rv.setTop(penPosition.y);
            if (penPosition.y > rv.getBottom())
                rv.setBottom(penPosition.y);
        }
    }

    return rv;
}

// + + }}}

// + }}}
