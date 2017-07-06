
// This namespace
// #require "canvas3d.js"

// Dan reusable
// #require <dan/gfx/gl/SpriteBatch3D.js>
// #require <dan/math/Matrix4.js>


dan.gfx.canvas3d.ToGl = function ()
{
    this.builtInSpriteBatch = new dan.gfx.gl.SpriteBatch3D();

    this.viewMatrix = dan.math.Matrix4.identityMatrix();
    this.projectionMatrix = dan.math.Matrix4.orthoMatrix(0, 640, 300, 0, -1, 1);
    this.drawDirection = [1, 1];
};

dan.gfx.canvas3d.ToGl.prototype.clear = function ()
{
    GL.ctx.clearColor(0, 0, 0, 1);
    GL.ctx.clear(GL.ctx.COLOR_BUFFER_BIT, GL.ctx.DEPTH_BUFFER_BIT);
};

// + Draw from precompiled objects {{{

/*
dan.gfx.canvas3d.ToGl.prototype.drawCompiledSprites = function (i_compiledSprites)
// Params:
//  i_compiledSprites:
//   (CompiledSprites)
{
    // If the built-in sprite batch is in progress, flush to draw and empty it
    if (this.builtInSpriteBatch.inProgress())
        this.flush();

    //
    i_compiledSprites.draw(this.viewMatrix, this.projectionMatrix);
};

dan.gfx.canvas3d.ToGl.prototype.drawCompiledPrimitives = function (i_compiledPrimitives, i_tint)
// Params:
//  i_compiledPrimitives:
//   (CompiledPrimitives)
//  i_tint:
//   Either (dan.gfx.ColourRGBA)
//   or (null or undefined)
{
    // If the built-in sprite batch is in progress, flush to draw and empty it
    if (this.builtInSpriteBatch.inProgress())
        this.flush();

    //
    i_compiledPrimitives.draw(dan.math.Matrix3.identityMatrix(), this.viewMatrix, this.projectionMatrix, i_tint);
};

dan.gfx.canvas3d.ToGl.prototype.drawCompiledPrimitivesT = function (i_compiledPrimitives, i_tint, i_translation)
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
    // If the built-in sprite batch is in progress, flush to draw and empty it
    if (this.builtInSpriteBatch.inProgress())
        this.flush();

    //
    i_compiledPrimitives.draw(dan.math.Matrix3.translationMatrix(i_translation[0], i_translation[1], 0),
                              this.viewMatrix, this.projectionMatrix, i_tint);
};

dan.gfx.canvas3d.ToGl.prototype.drawCompiledPrimitivesTSRT = function (
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
    // If the built-in sprite batch is in progress, flush to draw and empty it
    if (this.builtInSpriteBatch.inProgress())
        this.flush();

    //
    i_compiledPrimitives.draw(dan.math.Matrix3.tsrtMatrix(i_preTranslation, i_scale, i_rotation, i_postTranslation),
                              this.viewMatrix, this.projectionMatrix, i_tint);
};

dan.gfx.canvas3d.ToGl.prototype.drawCompiledBeamPrimitives = function (i_compiledBeamPrimitives)
// Params:
//  i_compiledBeamPrimitives:
//   (CompiledBeamPrimitives)
{
    // If the built-in sprite batch is in progress, flush to draw and empty it
    if (this.builtInSpriteBatch.inProgress())
        this.flush();

    //
    i_compiledBeamPrimitives.draw(dan.math.Matrix3.identityMatrix(), this.viewMatrix, this.projectionMatrix);
};

dan.gfx.canvas3d.ToGl.prototype.drawCompiledBeamPrimitivesT = function (
    i_compiledBeamPrimitives,
    i_translation)
// Params:
//  i_compiledBeamPrimitives:
//   (CompiledBeamPrimitives)
//  i_translation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
{
    // If the built-in sprite batch is in progress, flush to draw and empty it
    if (this.builtInSpriteBatch.inProgress())
        this.flush();

    //
    i_compiledBeamPrimitives.draw(dan.math.Matrix3.translationMatrix(i_translation[0], i_translation[1], 0),
                                  this.viewMatrix, this.projectionMatrix);
};

dan.gfx.canvas3d.ToGl.prototype.drawCompiledBeamPrimitivesTSRT = function (
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
    // If the built-in sprite batch is in progress, flush to draw and empty it
    if (this.builtInSpriteBatch.inProgress())
        this.flush();

    //
    i_compiledBeamPrimitives.draw(dan.math.Matrix3.tsrtMatrix(i_preTranslation, i_scale, i_rotation, i_postTranslation),
                                  this.viewMatrix, this.projectionMatrix, i_tint);
};

dan.gfx.canvas3d.ToGl.prototype.drawCompiledText = function (i_compiledText, i_tint)
// Params:
//  i_compiledText:
//   (CompiledText)
//  i_tint:
//   Either (dan.gfx.ColourRGBA)
//   or (null or undefined)
{
    // If the built-in sprite batch is in progress, flush to draw and empty it
    if (this.builtInSpriteBatch.inProgress())
        this.flush();

    //
    i_compiledText.draw(dan.math.Matrix3.identityMatrix(), this.viewMatrix, this.projectionMatrix, i_tint);
};

dan.gfx.canvas3d.ToGl.prototype.drawCompiledTextT = function (i_compiledText, i_tint, i_translation)
// Params:
//  i_compiledText:
//   (CompiledText)
//  i_tint:
//   Either (dan.gfx.ColourRGBA)
//   or (null or undefined)
{
    // If the built-in sprite batch is in progress, flush to draw and empty it
    if (this.builtInSpriteBatch.inProgress())
        this.flush();

    //
    i_compiledText.draw(dan.math.Matrix3.translationMatrix(i_translation[0], i_translation[1], 0),
                        this.viewMatrix, this.projectionMatrix, i_tint);
};
*/

// + }}}

// + Built-in sprite batch {{{

dan.gfx.canvas3d.ToGl.prototype.drawSpriteT = function (
    i_srcTexture,
    i_colour,
    i_translation)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.SubTexture2D)
//   or (dan.gfx.gl.Texture2D)
//  i_colour:
//   (dan.gfx.ColourRGBA)
//  i_translation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
{
    // If passed in a plain Texture2D, wrap it in a SubTexture2D
    var srcSubTexture;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        srcSubTexture = new dan.gfx.gl.SubTexture2D(i_srcTexture);
    else
        srcSubTexture = i_srcTexture;

    // If different texture from current, flush to draw and empty the built-in sprite batch
    if (this.builtInSpriteBatch.inProgress() && srcSubTexture.texture !== this.builtInSpriteBatch.getTexture())
        this.flush();
    // Or if the built-in sprite batch is full, flush to draw and empty it
    if (this.builtInSpriteBatch.remainingCapacity() <= 0)
        this.flush();

    //
    this.builtInSpriteBatch.addSpriteT(srcSubTexture, i_colour, i_translation, this.drawDirection);
};

dan.gfx.canvas3d.ToGl.prototype.drawSpriteTST = function (
    i_srcTexture,
    i_colour,
    i_preTranslation, i_scale, i_postTranslation)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.SubTexture2D)
//   or (dan.gfx.gl.Texture2D)
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
    // If passed in a plain Texture2D, wrap it in a SubTexture2D
    var srcSubTexture;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        srcSubTexture = new dan.gfx.gl.SubTexture2D(i_srcTexture);
    else
        srcSubTexture = i_srcTexture;

    // If different texture from current, flush to draw and empty the built-in sprite batch
    if (this.builtInSpriteBatch.inProgress() && srcSubTexture.texture !== this.builtInSpriteBatch.getTexture())
        this.flush();
    // Or if the built-in sprite batch is full, flush to draw and empty it
    if (this.builtInSpriteBatch.remainingCapacity() <= 0)
        this.flush();

    //
    this.builtInSpriteBatch.addSpriteTST(srcSubTexture, i_colour, i_preTranslation, i_scale, i_postTranslation, this.drawDirection);
};

dan.gfx.canvas3d.ToGl.prototype.drawSpriteTSRT = function (
    i_srcTexture,
    i_colour,
    i_preTranslation, i_scale, i_rotation, i_postTranslation)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.SubTexture2D)
//   or (dan.gfx.gl.Texture2D)
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
    // If passed in a plain Texture2D, wrap it in a SubTexture2D
    var srcSubTexture;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        srcSubTexture = new dan.gfx.gl.SubTexture2D(i_srcTexture);
    else
        srcSubTexture = i_srcTexture;

    // If different texture from current, flush to draw and empty the built-in sprite batch
    if (this.builtInSpriteBatch.inProgress() && srcSubTexture.texture !== this.builtInSpriteBatch.getTexture())
        this.flush();
    // Or if the built-in sprite batch is full, flush to draw and empty it
    if (this.builtInSpriteBatch.remainingCapacity() <= 0)
        this.flush();

    //
    this.builtInSpriteBatch.addSpriteTSRT(srcSubTexture, i_colour, i_preTranslation, i_scale, i_rotation, i_postTranslation, this.drawDirection);
};

dan.gfx.canvas3d.ToGl.prototype.drawSpriteM = function (
    i_srcTexture,
    i_colour,
    i_transform)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.SubTexture2D)
//   or (dan.gfx.gl.Texture2D)
//  i_colour:
//   (dan.gfx.ColourRGBA)
//  i_transform:
//   (dan.math.Matrix4)
{
    // If passed in a plain Texture2D, wrap it in a SubTexture2D
    var srcSubTexture;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        srcSubTexture = new dan.gfx.gl.SubTexture2D(i_srcTexture);
    else
        srcSubTexture = i_srcTexture;

    // If different texture from current, flush to draw and empty the built-in sprite batch
    if (this.builtInSpriteBatch.inProgress() && srcSubTexture.texture !== this.builtInSpriteBatch.getTexture())
        this.flush();
    // Or if the built-in sprite batch is full, flush to draw and empty it
    if (this.builtInSpriteBatch.remainingCapacity() <= 0)
        this.flush();

    //
    this.builtInSpriteBatch.addSpriteM(srcSubTexture, i_colour, i_transform, this.drawDirection);
};

dan.gfx.canvas3d.ToGl.prototype.drawSpriteP = function (
    i_srcTexture,
    i_colour,
    i_parallelogram)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.SubTexture2D)
//   or (dan.gfx.gl.Texture2D)
//  i_colour:
//   (dan.gfx.ColourRGBA)
//  i_corner:
//   (dan.math.Vector3)
//  i_parallelogram:
//   (dan.math.Parallelogram3)
{
    // If passed in a plain Texture2D, wrap it in a SubTexture2D
    var srcSubTexture;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        srcSubTexture = new dan.gfx.gl.SubTexture2D(i_srcTexture);
    else
        srcSubTexture = i_srcTexture;

    // If different texture from current, flush to draw and empty the built-in sprite batch
    if (this.builtInSpriteBatch.inProgress() && srcSubTexture.texture !== this.builtInSpriteBatch.getTexture())
        this.flush();
    // Or if the built-in sprite batch is full, flush to draw and empty it
    if (this.builtInSpriteBatch.remainingCapacity() <= 0)
        this.flush();

    //
    this.builtInSpriteBatch.addSpriteP(srcSubTexture, i_colour, i_parallelogram);
};


dan.gfx.canvas3d.ToGl.prototype.flush = function ()
{
    if (this.builtInSpriteBatch.inProgress())
    {
        this.builtInSpriteBatch.draw(this.viewMatrix, this.projectionMatrix);
        this.builtInSpriteBatch.clear();
    }
};

// + }}}
