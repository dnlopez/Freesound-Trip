
// This namespace
// #require "gl.js"
// #require "Program.js"
// #require "FixedBufferObject.js"
// #require "sprites_getVertices.js"

// Dan reusable
// #require <dan/math/Vector2.js>


// + Construction {{{

dan.gfx.gl.SpriteBatch = function ()
{
    // Compile static shader program that is suitable for drawing any of the
    // compiled buffers that this class produces
    if (!dan.gfx.gl.SpriteBatch.drawProgram)
        dan.gfx.gl.SpriteBatch.drawProgram = dan.gfx.gl.Program.fromStringVSFS(
            dan.gfx.gl.SpriteBatch.vertexShaderSource,
            dan.gfx.gl.SpriteBatch.fragmentShaderSource);

    //
    this.k_maxSpriteCount = 2000;

    // Each sprite has 6 vertices
    //  positions: 2 components per vertex
    this.positions = new dan.gfx.gl.FixedBufferObject(6*2 * this.k_maxSpriteCount);
    //  colours: 4 components per vertex
    this.colours = new dan.gfx.gl.FixedBufferObject(6*4 * this.k_maxSpriteCount);
    //  texCoords: 2 components per vertex
    this.texCoords = new dan.gfx.gl.FixedBufferObject(6*2 * this.k_maxSpriteCount);

    //
    this.currentSpriteCount = 0;
};

dan.gfx.gl.SpriteBatch.prototype.destroy = function ()
{
    if (this.positions)
    {
        this.positions.destroy();
        this.positions = null;
    }
    if (this.colours)
    {
        this.colours.destroy();
        this.colours = null;
    }
    if (this.texCoords)
    {
        this.texCoords.destroy();
        this.texCoords = null;
    }
};

// + }}}

// + Add sprites {{{

dan.gfx.gl.SpriteBatch.prototype.addSpriteT = function (
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
    dan.gfx.gl.spriteT_getVertices(
        i_srcTexture,
        i_colour,
        i_translation,
        this.positions, this.colours, this.texCoords);

    ++this.currentSpriteCount;
};

dan.gfx.gl.SpriteBatch.prototype.addSpriteTST = function (
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
    dan.gfx.gl.spriteTST_getVertices(
        i_srcTexture,
        i_colour,
        i_preTranslation, i_scale, i_postTranslation,
        this.positions, this.colours, this.texCoords);

    ++this.currentSpriteCount;
};

dan.gfx.gl.SpriteBatch.prototype.addSpriteTSRT = function (
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
    dan.gfx.gl.spriteTSRT_getVertices(
        i_srcTexture,
        i_colour,
        i_preTranslation, i_scale, i_rotation, i_postTranslation,
        this.positions, this.colours, this.texCoords);

    ++this.currentSpriteCount;
};

dan.gfx.gl.SpriteBatch.prototype.addSpriteC = function (
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
    dan.gfx.gl.spriteC_getVertices(
        i_srcTexture,
        i_colour,
        i_destRect,
        this.positions, this.colours, this.texCoords);

    ++this.currentSpriteCount;
};

dan.gfx.gl.SpriteBatch.prototype.addTiling = function (
    i_srcTexture,
    i_colour,
    i_texturePreTranslation, i_textureScale, i_texturePostTranslation,
    i_destRect)
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
{
    dan.gfx.gl.tiling_getVertices(
        i_srcTexture, i_colour, i_texturePreTranslation, i_textureScale, i_texturePostTranslation,
        i_destRect,
        this.positions, this.colours, this.texCoords);

    ++this.currentSpriteCount;
};

// + }}}

// + Draw {{{

dan.gfx.gl.SpriteBatch.vertexShaderSource = "\n\
uniform mat3 u_viewMatrix;\n\
uniform mat4 u_projectionMatrix;\n\
\n\
attribute vec2 a_position;\n\
attribute vec4 a_colour;\n\
attribute vec2 a_texCoord;\n\
\n\
varying vec4 v_colour;\n\
varying vec2 v_texCoord;\n\
\n\
void main()\n\
{\n\
    vec3 position_view = u_viewMatrix * vec3(a_position, 1.0);\n\
    gl_Position = u_projectionMatrix * vec4(position_view.xy, 0.0, 1.0);\n\
\n\
    v_colour = a_colour;\n\
    v_texCoord = a_texCoord;\n\
}\n\
";

dan.gfx.gl.SpriteBatch.fragmentShaderSource = "\
precision mediump float;\n\
\n\
varying highp vec4 v_colour;\n\
varying highp vec2 v_texCoord;\n\
\n\
uniform sampler2D u_srcTexture;\n\
\n\
void main()\n\
{\n\
    vec4 texel = texture2D(u_srcTexture, v_texCoord);\n\
    gl_FragColor = texel * v_colour;\n\
}\n\
";

dan.gfx.gl.SpriteBatch.prototype.draw = function (
    i_srcTexture, i_viewMatrix, i_projectionMatrix)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.Texture2D)
//   or (dan.gfx.gl.SubTexture2D)
//  i_viewMatrix:
//   (dan.math.Matrix3)
//  i_projectionMatrix:
//   (dan.math.Matrix4)
//
// TODO: tint
{
    GL.setBufferObject(GL.ctx.ARRAY_BUFFER, this.positions.getBufferObject());
    GL.ctx.vertexAttribPointer(dan.gfx.gl.SpriteBatch.drawProgram.getAttributeLocation("a_position"), 2, GL.ctx.FLOAT, false, 0, 0);
    GL.setBufferObject(GL.ctx.ARRAY_BUFFER, this.colours.getBufferObject());
    GL.ctx.vertexAttribPointer(dan.gfx.gl.SpriteBatch.drawProgram.getAttributeLocation("a_colour"), 4, GL.ctx.FLOAT, false, 0, 0);
    GL.setBufferObject(GL.ctx.ARRAY_BUFFER, this.texCoords.getBufferObject());
    GL.ctx.vertexAttribPointer(dan.gfx.gl.SpriteBatch.drawProgram.getAttributeLocation("a_texCoord"), 2, GL.ctx.FLOAT, false, 0, 0);

    GL.setActiveTextureUnit(0);
    GL.bindTexture(GL.ctx.TEXTURE_2D, i_srcTexture);

    GL.setProgram(dan.gfx.gl.SpriteBatch.drawProgram);
    dan.gfx.gl.SpriteBatch.drawProgram.setInteger("u_srcTexture", 0);
    dan.gfx.gl.SpriteBatch.drawProgram.setMatrix3("u_viewMatrix", i_viewMatrix);
    dan.gfx.gl.SpriteBatch.drawProgram.setMatrix4("u_projectionMatrix", i_projectionMatrix);
    GL.ctx.enableVertexAttribArray(dan.gfx.gl.SpriteBatch.drawProgram.getAttributeLocation("a_position"));
    GL.ctx.enableVertexAttribArray(dan.gfx.gl.SpriteBatch.drawProgram.getAttributeLocation("a_colour"));
    GL.ctx.enableVertexAttribArray(dan.gfx.gl.SpriteBatch.drawProgram.getAttributeLocation("a_texCoord"));
    GL.ctx.drawArrays(GL.ctx.TRIANGLES, 0, this.currentSpriteCount * 6);  // 6 vertices per sprite
    GL.setProgram(null);
    GL.ctx.disableVertexAttribArray(dan.gfx.gl.SpriteBatch.drawProgram.getAttributeLocation("a_position"));
    GL.ctx.disableVertexAttribArray(dan.gfx.gl.SpriteBatch.drawProgram.getAttributeLocation("a_colour"));
    GL.ctx.disableVertexAttribArray(dan.gfx.gl.SpriteBatch.drawProgram.getAttributeLocation("a_texCoord"));
};

// + }}}

// + Clear {{{

dan.gfx.gl.SpriteBatch.prototype.clear = function ()
{
    this.positions.clear();
    this.colours.clear();
    this.texCoords.clear();

    this.currentSpriteCount = 0;
};

// + }}}

// + Get information {{{

dan.gfx.gl.SpriteBatch.prototype.remainingCapacity = function ()
// Returns:
//  (integer number)
{
    return this.k_maxSpriteCount - this.currentSpriteCount;
};

// + }}}
