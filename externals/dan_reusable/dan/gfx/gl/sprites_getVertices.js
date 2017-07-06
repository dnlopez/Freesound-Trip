
// This namespace
// #require "gl.js"


dan.gfx.gl.spriteT_getVertices = function (
    i_srcTexture,
    i_colour,
    i_translation,
    o_positions, o_colours, o_texCoords)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.Texture2D)
//   or (dan.gfx.gl.SubTexture2D)
//  i_colour:
//   (dan.gfx.ColourRGBA)
//  i_translation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  o_positions:
//   (array of number)
//   Positions for successive vertices are pushed onto this array.
//  o_colours:
//   (array of number)
//   Colours for successive vertices are pushed onto this array.
//  o_texCoords:
//   (array of number)
//   Texture coordinates for successive vertices are pushed onto this array.
{
    // + Add vertices to VBO {{{

    // + + Positions {{{

    var positionsWidth, positionsHeight;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
    {
        positionsWidth = i_srcTexture.width;
        positionsHeight = i_srcTexture.height;
    }
    else
    {
        positionsWidth = i_srcTexture.rect.width();
        positionsHeight = i_srcTexture.rect.height();
    }

    o_positions.addValues([
        i_translation[0],                  i_translation[1],                      // low, low
        i_translation[0] + positionsWidth, i_translation[1] + positionsHeight,    // high, high
        i_translation[0],                  i_translation[1] + positionsHeight,    // low, high
        i_translation[0] + positionsWidth, i_translation[1] + positionsHeight,    // high, high
        i_translation[0],                  i_translation[1],                      // low, low
        i_translation[0] + positionsWidth, i_translation[1]                   ]); // high, low

    // + + }}}

    // + + Colours {{{

    var r = i_colour.r;
    var g = i_colour.g;
    var b = i_colour.b;
    var a = i_colour.a;
    o_colours.addValues([r, g, b, a,
                         r, g, b, a,
                         r, g, b, a,
                         r, g, b, a,
                         r, g, b, a,
                         r, g, b, a]);

    // + + }}}

    // + + Texture coordinates {{{

    var texCoordRect;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        texCoordRect = dan.math.Rect2.fromLTRB(0, 0, 1, 1);
    else
        texCoordRect = i_srcTexture.texCoordRect;

    o_texCoords.addValues([texCoordRect.left, texCoordRect.top,
                           texCoordRect.right, texCoordRect.bottom,
                           texCoordRect.left, texCoordRect.bottom,
                           texCoordRect.right, texCoordRect.bottom,
                           texCoordRect.left, texCoordRect.top,
                           texCoordRect.right, texCoordRect.top]);

    // + + }}}

    // + }}}
};

dan.gfx.gl.spriteTST_getVertices = function (
    i_srcTexture,
    i_colour,
    i_preTranslation, i_scale, i_postTranslation,
    o_positions, o_colours, o_texCoords)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.Texture2D)
//   or (dan.gfx.gl.SubTexture2D)
//  i_colour:
//   (dan.gfx.ColourRGBA)
//  i_preTranslation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_scale:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_postTranslation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  o_positions:
//   (array of number)
//   Positions for successive vertices are pushed onto this array.
//  o_colours:
//   (array of number)
//   Colours for successive vertices are pushed onto this array.
//  o_texCoords:
//   (array of number)
//   Texture coordinates for successive vertices are pushed onto this array.
{
    // + Transform {{{

    // Corner
    //  pre-translate
    var cornerX = i_preTranslation[0];
    var cornerY = i_preTranslation[1];
    //  scale
    cornerX *= i_scale[0];
    cornerY *= i_scale[1];
    //  post-translate
    cornerX += i_postTranslation[0];
    cornerY += i_postTranslation[1];

    // Width vector
    var widthX;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        widthX = i_srcTexture.width;
    else
        widthX = i_srcTexture.rect.width();
    var widthY = 0;
    //  scale
    widthX *= i_scale[0];

    // Height vector
    var heightX = 0;
    var heightY;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        heightY = i_srcTexture.height;
    else
        heightY = i_srcTexture.rect.height();
    //  scale
    heightY *= i_scale[1];

    // + }}}

    // + Add vertices to VBO {{{

    // + + Positions {{{

    o_positions.addValues([
        // corner
        cornerX, cornerY,
        // corner + width + height
        cornerX + widthX + heightX, cornerY + widthY + heightY,
        // corner + height
        cornerX + heightX, cornerY + heightY,
        // corner + width + height
        cornerX + widthX + heightX, cornerY + widthY + heightY,
        // corner
        cornerX, cornerY,
        // corner + width
        cornerX + widthX, cornerY + widthY]);

    // + + }}}

    // + + Colours {{{

    var r = i_colour.r;
    var g = i_colour.g;
    var b = i_colour.b;
    var a = i_colour.a;
    o_colours.addValues([r, g, b, a,
                         r, g, b, a,
                         r, g, b, a,
                         r, g, b, a,
                         r, g, b, a,
                         r, g, b, a]);

    // + + }}}

    // + + Texture coordinates {{{

    var texCoordRect;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        texCoordRect = dan.math.Rect2.fromLTRB(0, 0, 1, 1);
    else
        texCoordRect = i_srcTexture.texCoordRect;

    o_texCoords.addValues([
        // corner
        texCoordRect.left, texCoordRect.top,
        // corner + width + height
        texCoordRect.right, texCoordRect.bottom,
        // corner + height
        texCoordRect.left, texCoordRect.bottom,
        // corner + width + height
        texCoordRect.right, texCoordRect.bottom,
        // corner
        texCoordRect.left, texCoordRect.top,
        // corner + width
        texCoordRect.right, texCoordRect.top]);

    // + + }}}

    // + }}}
};

dan.gfx.gl.spriteTSRT_getVertices = function (
    i_srcTexture,
    i_colour,
    i_preTranslation, i_scale, i_rotation, i_postTranslation,
    o_positions, o_colours, o_texCoords)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.Texture2D)
//   or (dan.gfx.gl.SubTexture2D)
//  i_colour:
//   (dan.gfx.ColourRGBA)
//  i_preTranslation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_scale:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_rotation:
//   (float)
//  i_postTranslation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  o_positions:
//   (array of number)
//   Positions for successive vertices are pushed onto this array.
//  o_colours:
//   (array of number)
//   Colours for successive vertices are pushed onto this array.
//  o_texCoords:
//   (array of number)
//   Texture coordinates for successive vertices are pushed onto this array.
{
    // + Transform {{{

    var sinAngle = Math.sin(i_rotation);
    var cosAngle = Math.cos(i_rotation);

    // Corner
    //  pre-translate
    var cornerX = i_preTranslation[0];
    var cornerY = i_preTranslation[1];
    //  scale
    cornerX *= i_scale[0];
    cornerY *= i_scale[1];
    //  rotate
    var tempCornerX = cornerX * cosAngle - cornerY * sinAngle;
    var tempCornerY = cornerY * cosAngle + cornerX * sinAngle;
    //  post-translate
    cornerX = tempCornerX + i_postTranslation[0];
    cornerY = tempCornerY + i_postTranslation[1];

    // Width vector
    var tempWidthX;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        tempWidthX = i_srcTexture.width;
    else
        tempWidthX = i_srcTexture.rect.width();
    var tempWidthY = 0;
    //  scale
    tempWidthX *= i_scale[0];
    //  rotate
    var widthX = tempWidthX * cosAngle - tempWidthY * sinAngle;
    var widthY = tempWidthY * cosAngle + tempWidthX * sinAngle;

    // Height vector
    var tempHeightX = 0;
    var tempHeightY;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        tempHeightY = i_srcTexture.height;
    else
        tempHeightY = i_srcTexture.rect.height();
    //  scale
    tempHeightY *= i_scale[1];
    //  rotate
    var heightX = tempHeightX * cosAngle - tempHeightY * sinAngle;
    var heightY = tempHeightY * cosAngle + tempHeightX * sinAngle;

    // + }}}

    // + Add vertices to VBO {{{

    // + + Positions {{{

    o_positions.addValues([
        // corner
        cornerX, cornerY,
        // corner + width + height
        cornerX + widthX + heightX, cornerY + widthY + heightY,
        // corner + height
        cornerX + heightX, cornerY + heightY,
        // corner + width + height
        cornerX + widthX + heightX, cornerY + widthY + heightY,
        // corner
        cornerX, cornerY,
        // corner + width
        cornerX + widthX, cornerY + widthY]);

    // + + }}}

    // + + Colours {{{

    var r = i_colour.r;
    var g = i_colour.g;
    var b = i_colour.b;
    var a = i_colour.a;
    o_colours.addValues([r, g, b, a,
                         r, g, b, a,
                         r, g, b, a,
                         r, g, b, a,
                         r, g, b, a,
                         r, g, b, a]);

    // + + }}}

    // + + Texture coordinates {{{

    var texCoordRect;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        texCoordRect = dan.math.Rect2.fromLTRB(0, 0, 1, 1);
    else
        texCoordRect = i_srcTexture.texCoordRect;

    o_texCoords.addValues([
        // corner
        texCoordRect.left, texCoordRect.top,
        // corner + width + height
        texCoordRect.right, texCoordRect.bottom,
        // corner + height
        texCoordRect.left, texCoordRect.bottom,
        // corner + width + height
        texCoordRect.right, texCoordRect.bottom,
        // corner
        texCoordRect.left, texCoordRect.top,
        // corner + width
        texCoordRect.right, texCoordRect.top]);

    // + + }}}

    // + }}}
};

dan.gfx.gl.spriteC_getVertices = function (
    i_srcTexture,
    i_colour,
    i_destRect,
    o_positions, o_colours, o_texCoords)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.Texture2D)
//   or (dan.gfx.gl.SubTexture2D)
//  i_colour:
//   (dan.gfx.ColourRGBA)
//  i_destRect:
//   (dan.math.Rect2)
//
// Returns:
//  o_positions:
//   (array of number)
//   Positions for successive vertices are pushed onto this array.
//  o_colours:
//   (array of number)
//   Colours for successive vertices are pushed onto this array.
//  o_texCoords:
//   (array of number)
//   Texture coordinates for successive vertices are pushed onto this array.
{
    // + Add vertices to VBO {{{

    // + + Positions {{{

    o_positions.addValues([
        i_destRect.left, i_destRect.top,
        i_destRect.right, i_destRect.bottom,
        i_destRect.left, i_destRect.bottom,
        i_destRect.right, i_destRect.bottom,
        i_destRect.left, i_destRect.top,
        i_destRect.right, i_destRect.top]);

    // + + }}}

    // + + Colours {{{

    var r = i_colour.r;
    var g = i_colour.g;
    var b = i_colour.b;
    var a = i_colour.a;
    o_colours.addValues([r, g, b, a,
                         r, g, b, a,
                         r, g, b, a,
                         r, g, b, a,
                         r, g, b, a,
                         r, g, b, a]);

    // + + }}}

    // + + Texture coordinates {{{

    var texCoordRect;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        texCoordRect = dan.math.Rect2.fromLTRB(0, 0, 1, 1);
    else
        texCoordRect = i_srcTexture.texCoordRect;

    o_texCoords.addValues([
        // corner
        texCoordRect.left, texCoordRect.top,
        // corner + width + height
        texCoordRect.right, texCoordRect.bottom,
        // corner + height
        texCoordRect.left, texCoordRect.bottom,
        // corner + width + height
        texCoordRect.right, texCoordRect.bottom,
        // corner
        texCoordRect.left, texCoordRect.top,
        // corner + width
        texCoordRect.right, texCoordRect.top]);

    // + + }}}

    // + }}}
};

dan.gfx.gl.tiling_getVertices = function (
    i_srcTexture,
    i_colour,
    i_texturePreTranslation, i_textureScale, i_texturePostTranslation,
    i_destRect,
    o_positions, o_colours, o_texCoords)
// Params:
//  i_srcTexture:
//   (dan.gfx.gl.Texture2D)
//  i_colour:
//   (dan.gfx.ColourRGBA)
//  i_texturePreTranslation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_textureScale:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_texturePostTranslation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_destRect:
//   (dan.math.Rect2)
//
// Returns:
//  o_positions:
//   (array of number)
//   Positions for successive vertices are pushed onto this array.
//  o_colours:
//   (array of number)
//   Colours for successive vertices are pushed onto this array.
//  o_texCoords:
//   (array of number)
//   Texture coordinates for successive vertices are pushed onto this array.
{
    // + Add vertices to VBO {{{

    // + + Positions {{{

    o_positions.addValues([
        // corner
        i_destRect.left,  i_destRect.top,
        // corner + width + height
        i_destRect.right, i_destRect.bottom,
        // corner + height
        i_destRect.left,  i_destRect.bottom,
        // corner + width + height
        i_destRect.right, i_destRect.bottom,
        // corner
        i_destRect.left,  i_destRect.top,
        // corner + width
        i_destRect.right, i_destRect.top]);

    // + + }}}

    // + + Colours {{{

    var r = i_colour.r;
    var g = i_colour.g;
    var b = i_colour.b;
    var a = i_colour.a;
    o_colours.addValues([r, g, b, a,
                         r, g, b, a,
                         r, g, b, a,
                         r, g, b, a,
                         r, g, b, a,
                         r, g, b, a]);

    // + + }}}

    // + + Texture coordinates {{{

    // Corner
    //  pre-translate
    var cornerX = i_texturePreTranslation[0];
    var cornerY = i_texturePreTranslation[1];
    //  scale
    cornerX *= i_textureScale[0];
    cornerY *= i_textureScale[1];
    //  post-translate
    cornerX += i_texturePostTranslation[0];
    cornerY += i_texturePostTranslation[1];

    // Width vector
    var widthX = i_srcTexture.width;
    var widthY = 0;
    //  scale
    widthX *= i_textureScale[0];

    // Height vector
    var heightX = 0;
    var heightY = i_srcTexture.height;
    //  scale
    heightY *= i_textureScale[1];

    // Normalize to texture coordinates
    cornerX = -cornerX / (i_srcTexture.width * i_textureScale[0]);
    cornerY = -cornerY / (i_srcTexture.height * i_textureScale[1]);
    widthX = i_destRect.width() / widthX;
    //widthY = i_destRect.height() / widthY;  // No need because always 0
    //heightX = i_destRect.width() / heightX;  // No need because always 0
    heightY = i_destRect.height() / heightY;

    o_texCoords.addValues([
        // corner
        cornerX, cornerY,
        // corner + width + height
        cornerX + widthX + heightX, cornerY + widthY + heightY,
        // corner + height
        cornerX + heightX, cornerY + heightY,
        // corner + width + height
        cornerX + widthX + heightX, cornerY + widthY + heightY,
        // corner
        cornerX, cornerY,
        // corner + width
        cornerX + widthX, cornerY + widthY]);

    // + + }}}

    // + }}}
};
