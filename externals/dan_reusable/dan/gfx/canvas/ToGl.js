
// This namespace
// #require "canvas.js"

// Dan reusable
// #require <dan/gfx/gl/SpriteBatch.js>
// #require <dan/gfx/gl/CompiledPrimitives.js>
// #require <dan/gfx/gl/CompiledBeamPrimitives.js>
// #require <dan/gfx/gl/Texture2D.js>
// #require <dan/gfx/gl/SubTexture2D.js>
// #require <dan/math/Matrix3.js>
// #require <dan/math/Matrix4.js>
// #require <dan/math/Rect2.js>


// TODO: specify rectangles with Rect


// + Construction {{{

dan.gfx.canvas.ToGl = function ()
{
    this.builtInSpriteBatch = new dan.gfx.gl.SpriteBatch();
    this.builtInSpriteBatch_srcTexture = null;
    // builtInSpriteBatch_srcTexture:
    //  Either (null)
    //  or (dan.gfx.gl.Texture2D)
    //  or (dan.gfx.gl.SubTexture2D)

    this.builtInCompiledPrimitives = new dan.gfx.gl.CompiledPrimitives();

    this.builtInCompiledBeamPrimitives = new dan.gfx.gl.CompiledBeamPrimitives();

    this.viewMatrixStack = [dan.math.Matrix3.identityMatrix()];
    this.projectionMatrixStack = [dan.math.Matrix4.orthoMatrix(0, 640, 300, 0, -1, 1)];
};

// + }}}

// + Matrix stacks {{{

dan.gfx.canvas.ToGl.prototype.setViewMatrix = function (i_matrix)
// Params:
//  i_matrix:
//   (dan.math.Matrix3)
{
    this.viewMatrixStack[this.viewMatrixStack.length - 1] = i_matrix;
}

dan.gfx.canvas.ToGl.prototype.getViewMatrix = function ()
// Returns:
//  (dan.math.Matrix3)
{
    return this.viewMatrixStack[this.viewMatrixStack.length - 1];
}

dan.gfx.canvas.ToGl.prototype.pushViewMatrix = function (i_matrix)
// Params:
//  i_matrix:
//   (dan.math.Matrix3)
{
    this.viewMatrixStack.push(i_matrix);
}

dan.gfx.canvas.ToGl.prototype.popViewMatrix = function ()
{
    this.viewMatrixStack.pop();
}

dan.gfx.canvas.ToGl.prototype.setProjectionMatrix = function (i_matrix)
// Params:
//  i_matrix:
//   (dan.math.Matrix4)
{
    this.projectionMatrixStack[this.projectionMatrixStack.length - 1] = i_matrix;
}

dan.gfx.canvas.ToGl.prototype.getProjectionMatrix = function ()
// Returns:
//  (dan.math.Matrix4)
{
    return this.projectionMatrixStack[this.projectionMatrixStack.length - 1];
}

dan.gfx.canvas.ToGl.prototype.pushProjectionMatrix = function (i_matrix)
// Params:
//  i_matrix:
//   (dan.math.Matrix4)
{
    this.projectionMatrixStack.push(i_matrix);
}

dan.gfx.canvas.ToGl.prototype.popProjectionMatrix = function ()
{
    this.projectionMatrixStack.pop();
}

// + }}}

// + Draw immediately {{{

dan.gfx.canvas.ToGl.prototype.clear = function ()
{
    GL.ctx.clearColor(0, 0, 0, 1);
    GL.ctx.clear(GL.ctx.COLOR_BUFFER_BIT, GL.ctx.DEPTH_BUFFER_BIT);
};

// + }}}

// + Draw from externally pre-compiled batches {{{

dan.gfx.canvas.ToGl.prototype.drawCompiledSprites = function (i_srcTexture, i_compiledSprites)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.Texture2D)
//   or (dan.gfx.gl.SubTexture2D)
//  i_compiledSprites:
//   (CompiledSprites)
{
    // Flush to draw and empty whichever built-in batch may currently be in progress
    this.flush();

    //
    i_compiledSprites.draw(i_srcTexture, this.viewMatrixStack[this.viewMatrixStack.length - 1], this.projectionMatrixStack[this.projectionMatrixStack.length - 1]);
};

dan.gfx.canvas.ToGl.prototype.drawCompiledPrimitives = function (i_compiledPrimitives, i_tint)
// Params:
//  i_compiledPrimitives:
//   (CompiledPrimitives)
//  i_tint:
//   Either (dan.gfx.ColourRGBA)
//   or (null or undefined)
{
    // Flush to draw and empty whichever built-in batch may currently be in progress
    this.flush();

    //
    i_compiledPrimitives.draw(dan.math.Matrix3.identityMatrix(), this.viewMatrixStack[this.viewMatrixStack.length - 1], this.projectionMatrixStack[this.projectionMatrixStack.length - 1], i_tint);
};

dan.gfx.canvas.ToGl.prototype.drawCompiledPrimitivesT = function (i_compiledPrimitives, i_tint, i_translation)
// Params:
//  i_compiledPrimitives:
//   (CompiledPrimitives)
//  i_tint:
//   Either (dan.gfx.ColourRGBA)
//   or (null or undefined)
//  i_translation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
{
    // Flush to draw and empty whichever built-in batch may currently be in progress
    this.flush();

    //
    i_compiledPrimitives.draw(dan.math.Matrix3.translationMatrix(i_translation[0], i_translation[1]),
                              this.viewMatrixStack[this.viewMatrixStack.length - 1], this.projectionMatrixStack[this.projectionMatrixStack.length - 1], i_tint);
};

dan.gfx.canvas.ToGl.prototype.drawCompiledPrimitivesTSRT = function (
    i_compiledPrimitives, i_tint,
    i_preTranslation, i_scale, i_rotation, i_postTranslation)
// Params:
//  i_compiledPrimitives:
//   (CompiledPrimitives)
//  i_tint:
//   Either (dan.gfx.ColourRGBA)
//   or (null or undefined)
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
{
    // Flush to draw and empty whichever built-in batch may currently be in progress
    this.flush();

    //
    i_compiledPrimitives.draw(dan.math.Matrix3.tsrtMatrix(i_preTranslation, i_scale, i_rotation, i_postTranslation),
                              this.viewMatrixStack[this.viewMatrixStack.length - 1], this.projectionMatrixStack[this.projectionMatrixStack.length - 1], i_tint);
};

dan.gfx.canvas.ToGl.prototype.drawCompiledBeamPrimitives = function (i_compiledBeamPrimitives)
// Params:
//  i_compiledBeamPrimitives:
//   (CompiledBeamPrimitives)
{
    // Flush to draw and empty whichever built-in batch may currently be in progress
    this.flush();

    //
    i_compiledBeamPrimitives.draw(dan.math.Matrix3.identityMatrix(), this.viewMatrixStack[this.viewMatrixStack.length - 1], this.projectionMatrixStack[this.projectionMatrixStack.length - 1]);
};

dan.gfx.canvas.ToGl.prototype.drawCompiledBeamPrimitivesT = function (
    i_compiledBeamPrimitives,
    i_translation)
// Params:
//  i_compiledBeamPrimitives:
//   (CompiledBeamPrimitives)
//  i_translation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
{
    // Flush to draw and empty whichever built-in batch may currently be in progress
    this.flush();

    //
    i_compiledBeamPrimitives.draw(dan.math.Matrix3.translationMatrix(i_translation[0], i_translation[1]),
                                  this.viewMatrixStack[this.viewMatrixStack.length - 1], this.projectionMatrixStack[this.projectionMatrixStack.length - 1]);
};

dan.gfx.canvas.ToGl.prototype.drawCompiledBeamPrimitivesTSRT = function (
    i_compiledBeamPrimitives, i_tint,
    i_preTranslation, i_scale, i_rotation, i_postTranslation)
// Params:
//  i_compiledBeamPrimitives:
//   (CompiledBeamPrimitives)
//  i_tint:
//   Either (dan.gfx.ColourRGBA)
//   or (null or undefined)
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
{
    // Flush to draw and empty whichever built-in batch may currently be in progress
    this.flush();

    //
    i_compiledBeamPrimitives.draw(dan.math.Matrix3.tsrtMatrix(i_preTranslation, i_scale, i_rotation, i_postTranslation),
                                  this.viewMatrixStack[this.viewMatrixStack.length - 1], this.projectionMatrixStack[this.projectionMatrixStack.length - 1], i_tint);
};

dan.gfx.canvas.ToGl.prototype.drawCompiledText = function (i_compiledText, i_tint)
// Params:
//  i_compiledText:
//   (CompiledText)
//  i_tint:
//   Either (dan.gfx.ColourRGBA)
//   or (null or undefined)
{
    // Flush to draw and empty whichever built-in batch may currently be in progress
    this.flush();

    //
    i_compiledText.draw(dan.math.Matrix3.identityMatrix(), this.viewMatrixStack[this.viewMatrixStack.length - 1], this.projectionMatrixStack[this.projectionMatrixStack.length - 1], i_tint);
};

dan.gfx.canvas.ToGl.prototype.drawCompiledTextT = function (i_compiledText, i_tint, i_translation)
// Params:
//  i_compiledText:
//   (CompiledText)
//  i_tint:
//   Either (dan.gfx.ColourRGBA)
//   or (null or undefined)
{
    // Flush to draw and empty whichever built-in batch may currently be in progress
    this.flush();

    //
    i_compiledText.draw(dan.math.Matrix3.translationMatrix(i_translation[0], i_translation[1]),
                        this.viewMatrixStack[this.viewMatrixStack.length - 1], this.projectionMatrixStack[this.projectionMatrixStack.length - 1], i_tint);
};

//[dan.gfx.canvas.ToGl.prototype.drawCompiledTextTST?...]

// + }}}

// + Draw from internally managed one-off batches {{{

// + + Sprite batch {{{

// + + + The batch object, and accessors {{{

// [In C version but not here: useBuiltInCompiledSprites()]

// + + + }}}

// + + + Drawing commands {{{

dan.gfx.canvas.ToGl.prototype.drawSpriteT = function (
    i_srcTexture,
    i_colour,
    i_translation)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.Texture2D)
//   or (dan.gfx.gl.SubTexture2D)
//  i_colour:
//   (dan.gfx.ColourRGBA)
//  i_translation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
{
    // If the built-in sprite batch is already in progress,
    // flush only if we want to change the texture or if it's full
    if (this.builtInSpriteBatch_srcTexture != null)
    {
        if (!dan.gfx.canvas.ToGl.isSameBaseTexture(this.builtInSpriteBatch_srcTexture, i_srcTexture) ||
            this.builtInSpriteBatch.remainingCapacity() <= 0)
            this.flush();
    }
    // Else flush to draw and empty whichever other built-in batch may currently be in progress
    else
        this.flush();

    //
    this.builtInSpriteBatch.addSpriteT(i_srcTexture, i_colour, i_translation);
    this.builtInSpriteBatch_srcTexture = i_srcTexture;
};

dan.gfx.canvas.ToGl.prototype.drawSpriteTST = function (
    i_srcTexture,
    i_colour,
    i_preTranslation, i_scale, i_postTranslation)
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
{
    // If the built-in sprite batch is already in progress,
    // flush only if we want to change the texture or if it's full
    if (this.builtInSpriteBatch_srcTexture != null)
    {
        if (!dan.gfx.canvas.ToGl.isSameBaseTexture(this.builtInSpriteBatch_srcTexture, i_srcTexture) ||
            this.builtInSpriteBatch.remainingCapacity() <= 0)
            this.flush();
    }
    // Else flush to draw and empty whichever other built-in batch may currently be in progress
    else
        this.flush();

    //
    this.builtInSpriteBatch.addSpriteTST(i_srcTexture, i_colour, i_preTranslation, i_scale, i_postTranslation);
    this.builtInSpriteBatch_srcTexture = i_srcTexture;
};

dan.gfx.canvas.ToGl.prototype.drawSpriteTSRT = function (
    i_srcTexture,
    i_colour,
    i_preTranslation, i_scale, i_rotation, i_postTranslation)
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
{
    // If the built-in sprite batch is already in progress,
    // flush only if we want to change the texture or if it's full
    if (this.builtInSpriteBatch_srcTexture != null)
    {
        if (!dan.gfx.canvas.ToGl.isSameBaseTexture(this.builtInSpriteBatch_srcTexture, i_srcTexture) ||
            this.builtInSpriteBatch.remainingCapacity() <= 0)
            this.flush();
    }
    // Else flush to draw and empty whichever other built-in batch may currently be in progress
    else
        this.flush();

    //
    this.builtInSpriteBatch.addSpriteTSRT(i_srcTexture, i_colour, i_preTranslation, i_scale, i_rotation, i_postTranslation);
    this.builtInSpriteBatch_srcTexture = i_srcTexture;
};

dan.gfx.canvas.ToGl.prototype.drawSpriteC = function (
    i_srcTexture,
    i_colour,
    i_destRect)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.Texture2D)
//   or (dan.gfx.gl.SubTexture2D)
//  i_colour:
//   (dan.gfx.ColourRGBA)
//  i_destRect:
//   (dan.math.Rect2)
{
    // If the built-in sprite batch is already in progress,
    // flush only if we want to change the texture or if it's full
    if (this.builtInSpriteBatch_srcTexture != null)
    {
        if (!dan.gfx.canvas.ToGl.isSameBaseTexture(this.builtInSpriteBatch_srcTexture, i_srcTexture) ||
            this.builtInSpriteBatch.remainingCapacity() <= 0)
            this.flush();
    }
    // Else flush to draw and empty whichever other built-in batch may currently be in progress
    else
        this.flush();

    //
    this.builtInSpriteBatch.addSpriteC(i_srcTexture, i_colour, i_destRect);
    this.builtInSpriteBatch_srcTexture = i_srcTexture;
};

dan.gfx.canvas.ToGl.prototype.drawTiling = function (
    i_srcTexture,
    i_colour,
    i_texturePreTranslation, i_textureScale, i_texturePostTranslation,
    i_destRect)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.Texture2D)
//   or (dan.gfx.gl.SubTexture2D)
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
{
    // If the built-in sprite batch is already in progress,
    // flush only if we want to change the texture or if it's full
    if (this.builtInSpriteBatch_srcTexture != null)
    {
        if (!dan.gfx.canvas.ToGl.isSameBaseTexture(this.builtInSpriteBatch_srcTexture, i_srcTexture) ||
            this.builtInSpriteBatch.remainingCapacity() <= 0)
            this.flush();
    }
    // Else flush to draw and empty whichever other built-in batch may currently be in progress
    else
        this.flush();

    //
    this.builtInSpriteBatch.addTiling(i_srcTexture, i_colour, i_texturePreTranslation, i_textureScale, i_texturePostTranslation, i_destRect);
    this.builtInSpriteBatch_srcTexture = i_srcTexture;
};

// [In C version but not here: drawTriangle]

dan.gfx.canvas.ToGl.prototype.drawTextT = function (
    i_glTextureFontFace,
    i_text,
    i_colour,
    i_translation)
// Params:
//  i_glTextureFontFace:
//   (dan.text.GlTextureFontFace)
//  i_text:
//   (string)
//  i_colour:
//   (dan.gfx.ColourRGBA)
//  i_translation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
//  The new pen position at the end of the text which was drawn.
{
    var penPosition = dan.math.Vector2.fromElements(i_translation[0], i_translation[1]);
    for (var charNo = 0; charNo < i_text.length; ++charNo)
    {
        var glyph = i_glTextureFontFace.charmaps[0][i_text.charCodeAt(charNo)];

        var srcSubTexture = new dan.gfx.gl.SubTexture2D(i_glTextureFontFace.textures[glyph.textureNo], glyph.rect);

        // If the built-in sprite batch is already in progress,
        // flush only if we want to change the texture or if it's full
        if (this.builtInSpriteBatch_srcTexture != null)
        {
            if (!dan.gfx.canvas.ToGl.isSameBaseTexture(this.builtInSpriteBatch_srcTexture, srcSubTexture.texture) ||
                this.builtInSpriteBatch.remainingCapacity() <= 0)
                this.flush();
        }
        // Else flush to draw and empty whichever other built-in batch may currently be in progress
        else
            this.flush();

        this.builtInSpriteBatch.addSpriteT(srcSubTexture, i_colour, dan.math.Vector2.add(penPosition, glyph.bearing));
        this.builtInSpriteBatch_srcTexture = srcSubTexture;

        penPosition.add(glyph.advance);
    }

    return penPosition;
};

dan.gfx.canvas.ToGl.prototype.drawTextTST = function (
    i_glTextureFontFace,
    i_text,
    i_colour,
    i_preTranslation, i_scale, i_postTranslation)
// Params:
//  i_glTextureFontFace:
//   (dan.text.GlTextureFontFace)
//  i_text:
//   (string)
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
//  (dan.math.Vector2)
//  The new pen position at the end of the text which was drawn.
{
    var penPosition = dan.math.Vector2.fromElements(i_preTranslation[0], i_preTranslation[1]);
    for (var charNo = 0; charNo < i_text.length; ++charNo)
    {
        var glyph = i_glTextureFontFace.charmaps[0][i_text.charCodeAt(charNo)];

        var srcSubTexture = new dan.gfx.gl.SubTexture2D(i_glTextureFontFace.textures[glyph.textureNo], glyph.rect);

        // If the built-in sprite batch is already in progress,
        // flush only if we want to change the texture or if it's full
        if (this.builtInSpriteBatch_srcTexture != null)
        {
            if (!dan.gfx.canvas.ToGl.isSameBaseTexture(this.builtInSpriteBatch_srcTexture, srcSubTexture.texture) ||
                this.builtInSpriteBatch.remainingCapacity() <= 0)
                this.flush();
        }
        // Else flush to draw and empty whichever other built-in batch may currently be in progress
        else
            this.flush();

        this.builtInSpriteBatch.addSpriteTST(srcSubTexture, i_colour, dan.math.Vector2.add(penPosition, glyph.bearing), i_scale, i_postTranslation);
        this.builtInSpriteBatch_srcTexture = srcSubTexture;

        penPosition.add(glyph.advance);
    }

    return penPosition;
};

// [In C version but not here: drawMultilineTextT]

// + + + }}}

// + + }}}

// + + Compiled primitives {{{

// + + + The batch object, and accessors {{{

dan.gfx.canvas.ToGl.prototype.getCompiledPrimitives = function ()
// Get in a state accepting of new primitives, and return the built-in compiled primitives
// object to which such primitives may then be added.
//
// Returns:
//  (dan.gfx.gl.CompiledPrimitives)
{
    // If the built-in compiled primitives is empty (is not already in progress),
    // flush to draw and empty whichever other built-in batch may currently be in progress
    if (this.builtInCompiledPrimitives.isEmpty())
        this.flush();

    //
    return this.builtInCompiledPrimitives;
}

// + + + }}}

// + + + Drawing commands {{{

dan.gfx.canvas.ToGl.prototype.drawRectStroke = function (
    i_corner, i_size, i_width, i_alignment, i_colour)
{
    this.getCompiledPrimitives().addRectStroke(
        i_corner, i_size, i_width, i_alignment, i_colour);
};

dan.gfx.canvas.ToGl.prototype.drawRectFill = function (
    i_corner, i_size, i_colour)
{
    this.getCompiledPrimitives().addRectFill(
        i_corner, i_size, i_colour);
};

// [In C version but not here: drawTriangleStroke]
// [In C version but not here: drawTriangleFill]

dan.gfx.canvas.ToGl.prototype.drawTrianglesStroke = function (
    i_points, i_width, i_alignment, i_colour, i_join)
{
    this.getCompiledPrimitives().addTrianglesStroke(
        i_points, i_width, i_alignment, i_colour, i_join);
};

dan.gfx.canvas.ToGl.prototype.drawTrianglesFill = function (
    i_points, i_colour)
{
    this.getCompiledPrimitives().addTrianglesFill(
        i_points, i_colour);
};

dan.gfx.canvas.ToGl.prototype.drawLineStroke = function (
    i_startPoint, i_endPoint, i_width, i_alignment, i_colour)
{
    this.getCompiledPrimitives().addLineStroke(
        i_startPoint, i_endPoint, i_width, i_alignment, i_colour);
};

dan.gfx.canvas.ToGl.prototype.drawPolygonStroke = function (
    i_points, i_width, i_alignment, i_colour, i_join, i_closed)
{
    this.getCompiledPrimitives().addPolygonStroke(
        i_points, i_width, i_alignment, i_colour, i_join, i_closed);
};

dan.gfx.canvas.ToGl.prototype.drawPolygonFill = function (
    i_points, i_colour)
{
    this.getCompiledPrimitives().addPolygonFill(
        i_points, i_colour);
};

dan.gfx.canvas.ToGl.prototype.drawCircleStroke = function (
    i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount)
{
    this.getCompiledPrimitives().addCircleStroke(
        i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount);
};

dan.gfx.canvas.ToGl.prototype.drawCircleFill = function (
    i_centre, i_radius, i_colour, i_segmentCount)
{
    this.getCompiledPrimitives().addCircleFill(
        i_centre, i_radius, i_colour, i_segmentCount);
};

dan.gfx.canvas.ToGl.prototype.drawArcStroke = function (
    i_centre, i_radius, i_startAngle, i_spanAngle, i_width, i_alignment, i_colour, i_closed, i_chord, i_segmentCount)
{
    this.getCompiledPrimitives().addArcStroke(
        i_centre, i_radius, i_startAngle, i_spanAngle, i_width, i_alignment, i_colour, i_closed, i_chord, i_segmentCount);
};

dan.gfx.canvas.ToGl.prototype.drawArcFill = function (
    i_centre, i_radius, i_startAngle, i_spanAngle, i_colour, i_chord, i_segmentCount)
{
    this.getCompiledPrimitives().addArcFill(
        i_centre, i_radius, i_startAngle, i_spanAngle, i_chord, i_colour, i_segmentCount);
};

dan.gfx.canvas.ToGl.prototype.drawEllipseStroke = function (
    i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount)
{
    this.getCompiledPrimitives().addEllipseStroke(
        i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount);
};

dan.gfx.canvas.ToGl.prototype.drawEllipseFill = function (
    i_centre, i_radius, i_colour, i_segmentCount)
{
    this.getCompiledPrimitives().addEllipseFill(
        i_centre, i_radius, i_colour, i_segmentCount);
};

dan.gfx.canvas.ToGl.prototype.drawLinearBlendedSegment = function (
    i_startPoint, i_startStyle, i_endPoint, i_endStyle, i_width)
{
    this.getCompiledPrimitives().addLinearBlendedSegment(
        i_startPoint, i_startStyle, i_endPoint, i_endStyle, i_width);
};

// + + + }}}

// + + }}}

// + + Compiled beam primitives {{{

// + + + The batch object, and accessors {{{

// [In C version but not here: useBuiltInCompiledBeamPrimitives()]

// + + + }}}

// + + + Drawing commands {{{

dan.gfx.canvas.ToGl.prototype.drawRectBeam = function (
    i_corner, i_size, i_width, i_alignment, i_colour)
{
    // If the built-in compiled beam primitives is empty (is not already in progress),
    // flush to draw and empty whichever other built-in batch may currently be in progress
    if (this.builtInCompiledBeamPrimitives.isEmpty())
        this.flush();

    //
    this.builtInCompiledBeamPrimitives.addRectStroke(
        i_corner, i_size, i_width, i_alignment, i_colour);
};

dan.gfx.canvas.ToGl.prototype.drawTrianglesBeam = function (
    i_points, i_width, i_alignment, i_colour, i_join)
{
    // If the built-in compiled beam primitives is empty (is not already in progress),
    // flush to draw and empty whichever other built-in batch may currently be in progress
    if (this.builtInCompiledBeamPrimitives.isEmpty())
        this.flush();

    //
    this.builtInCompiledBeamPrimitives.addTrianglesStroke(
        i_points, i_width, i_alignment, i_colour, i_join);
};


// [In C version but not here: drawLineBeam()]

dan.gfx.canvas.ToGl.prototype.drawPolygonBeam = function (
    i_points, i_width, i_alignment, i_colour, i_join, i_closed)
{
    // If the built-in compiled beam primitives is empty (is not already in progress),
    // flush to draw and empty whichever other built-in batch may currently be in progress
    if (this.builtInCompiledBeamPrimitives.isEmpty())
        this.flush();

    //
    this.builtInCompiledBeamPrimitives.addPolygonStroke(
        i_points, i_width, i_alignment, i_colour, i_join, i_closed);
};

dan.gfx.canvas.ToGl.prototype.drawCircleBeam = function (
    i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount)
{
    // If the built-in compiled beam primitives is empty (is not already in progress),
    // flush to draw and empty whichever other built-in batch may currently be in progress
    if (this.builtInCompiledBeamPrimitives.isEmpty())
        this.flush();

    //
    this.builtInCompiledBeamPrimitives.addCircleStroke(
        i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount);
};

dan.gfx.canvas.ToGl.prototype.drawArcBeam = function (
    i_centre, i_radius, i_startAngle, i_spanAngle, i_width, i_alignment, i_colour, i_closed, i_chord, i_segmentCount)
{
    // If the built-in compiled beam primitives is empty (is not already in progress),
    // flush to draw and empty whichever other built-in batch may currently be in progress
    if (this.builtInCompiledBeamPrimitives.isEmpty())
        this.flush();

    //
    this.builtInCompiledBeamPrimitives.addArcStroke(
        i_centre, i_radius, i_startAngle, i_spanAngle, i_width, i_alignment, i_colour, i_closed, i_chord, i_segmentCount);
};

dan.gfx.canvas.ToGl.prototype.drawEllipseBeam = function (
    i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount)
{
    // If the built-in compiled beam primitives is empty (is not already in progress),
    // flush to draw and empty whichever other built-in batch may currently be in progress
    if (this.builtInCompiledBeamPrimitives.isEmpty())
        this.flush();

    //
    this.builtInCompiledBeamPrimitives.addEllipseStroke(
        i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount);
};

// + + + }}}

// + + }}}

dan.gfx.canvas.ToGl.prototype.flush = function ()
// Draw and empty whichever built-in batch may currently be in progress
{
    // Note use of 'else if' here because only one of these batches
    // should be in progress at a time
    if (this.builtInSpriteBatch_srcTexture != null)
    {
        this.builtInSpriteBatch.draw(this.builtInSpriteBatch_srcTexture, this.viewMatrixStack[this.viewMatrixStack.length - 1], this.projectionMatrixStack[this.projectionMatrixStack.length - 1]);
        this.builtInSpriteBatch.clear();
        this.builtInSpriteBatch_srcTexture = null;
    }
    else if (!this.builtInCompiledPrimitives.isEmpty())
    {
        this.builtInCompiledPrimitives.draw(dan.math.Matrix3.identityMatrix(), this.viewMatrixStack[this.viewMatrixStack.length - 1], this.projectionMatrixStack[this.projectionMatrixStack.length - 1]);
        this.builtInCompiledPrimitives.clear();
    }
    else if (!this.builtInCompiledBeamPrimitives.isEmpty())
    {
        this.builtInCompiledBeamPrimitives.draw(dan.math.Matrix3.identityMatrix(), this.viewMatrixStack[this.viewMatrixStack.length - 1], this.projectionMatrixStack[this.projectionMatrixStack.length - 1]);
        this.builtInCompiledBeamPrimitives.clear();
    }
};

// + }}}

// + Utilities {{{

dan.gfx.canvas.ToGl.isSameBaseTexture = function (
    i_textureOrSubTexture1, i_textureOrSubTexture2)
// Params:
//  i_textureOrSubTexture1, i_textureOrSubTexture2:
//   Either (dan.gfx.gl.Texture2D)
//   or (dan.gfx.gl.SubTexture2D)
//
// Returns:
//  (boolean)
{
    var texture1;
    if (i_textureOrSubTexture1 instanceof dan.gfx.gl.Texture2D)
        texture1 = i_textureOrSubTexture1;
    else //if (i_textureOrSubTexture1 instanceof dan.gfx.gl.SubTexture2D)
        texture1 = i_textureOrSubTexture1.texture;

    var texture2;
    if (i_textureOrSubTexture2 instanceof dan.gfx.gl.Texture2D)
        texture2 = i_textureOrSubTexture2;
    else //if (i_textureOrSubTexture2 instanceof dan.gfx.gl.SubTexture2D)
        texture2 = i_textureOrSubTexture2.texture;

    return texture1.isSameTexture(texture2);
};

// + }}}
