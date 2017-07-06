
// Parent namespace
// #require <dan/dan.js>

// Dan reusable
// #require <dan/math/Vector2.js>

if (typeof(dan.text) === "undefined")
    dan.text = {};


dan.text.stringAdvance = function (
    i_fontFace,
    i_text)
// Params:
//  i_fontFace:
//   Either (dan.text.VectorFontFace)
//   or (dan.text.CanvasFontFace)
//   or (dan.text.GlTextureFontFace)
//  i_text:
//   (string)
//
// Returns:
//  (dan.math.Vector2)
//  The total movement that the pen position would make in drawing this text.
{
    var totalAdvance = dan.math.Vector2.fromElements(0, 0);
    for (var charNo = 0; charNo < i_text.length; ++charNo)
    {
        var glyph = i_fontFace.charmaps[0][i_text.charCodeAt(charNo)];

        totalAdvance.add(glyph.advance);
    }

    return totalAdvance;
};

