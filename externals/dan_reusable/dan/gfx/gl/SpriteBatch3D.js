
// This namespace
// #require "gl.js"
// #require "Program.js"
// #require "FixedBufferObject.js"
// #require "SubTexture2D.js"

// Dan reusable
// #require <dan/math/Vector2.js>
// #require <dan/math/Vector3.js>
// #require <dan/math/Parallelogram3.js>


// + Construction {{{

dan.gfx.gl.SpriteBatch3D = function ()
{
    // Compile static shader program that is suitable for drawing any of the
    // compiled buffers that this class produces
    if (!dan.gfx.gl.SpriteBatch3D.drawProgram)
        dan.gfx.gl.SpriteBatch3D.drawProgram = dan.gfx.gl.Program.fromStringVSFS(
            dan.gfx.gl.SpriteBatch3D.vertexShaderSource,
            dan.gfx.gl.SpriteBatch3D.fragmentShaderSource);

    //
    this.k_maxSpriteCount = 2000;
    // Each sprite has 6 vertices
    //  positions: 3 components per vertex
    this.positions = new dan.gfx.gl.FixedBufferObject(6*3 * this.k_maxSpriteCount);
    //  colours: 4 components per vertex
    this.colours = new dan.gfx.gl.FixedBufferObject(6*4 * this.k_maxSpriteCount);
    //  texCoords: 2 components per vertex
    this.texCoords = new dan.gfx.gl.FixedBufferObject(6*2 * this.k_maxSpriteCount);

    //
    this.currentSpriteCount = 0;
    this.subTexture = null;
};

// + }}}

// + Add sprites {{{

dan.gfx.gl.SpriteBatch3D.prototype.addSpriteT = function (i_srcTexture,
                                                          i_colour,
                                                          i_translation,
                                                          i_drawDirection)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.SubTexture2D)
//   or (dan.gfx.gl.Texture2D)
//  i_colour:
//   (dan.gfx.ColourRGBA)
//  i_translation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_drawDirection:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//   or (null or undefined)
//    use default of [1, 1]
{
    // Apply default arguments
    if (!i_drawDirection)
        i_drawDirection = [1, 1];

    // If passed in a plain Texture2D, wrap it in a SubTexture2D
    var srcSubTexture;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        srcSubTexture = new dan.gfx.gl.SubTexture2D(i_srcTexture);
    else
        srcSubTexture = i_srcTexture;

    //
    this.subTexture = srcSubTexture;

    // Width and height
    //  oriented in requested axis directions
    var width = srcSubTexture.rect.width() * i_drawDirection[0];
    var height = srcSubTexture.rect.height() * i_drawDirection[1];

    // Add vertices to VBO
    this.positions.addValues([
        // low, low
        i_translation[0],          i_translation[1],           0,
        // high, high
        i_translation[0] + width,  i_translation[1] + height,  0,
        // low, high
        i_translation[0],          i_translation[1] + height,  0,
        // high, high
        i_translation[0] + width,  i_translation[1] + height,  0,
        // low, low
        i_translation[0],          i_translation[1],           0,
        // high, low
        i_translation[0] + width,  i_translation[1],           0]);
 
    var r = i_colour.r;
    var g = i_colour.g;
    var b = i_colour.b;
    var a = i_colour.a;
    this.colours.addValues([r, g, b, a,
                            r, g, b, a,
                            r, g, b, a,
                            r, g, b, a,
                            r, g, b, a,
                            r, g, b, a]);

    this.texCoords.addValues([0, 0,
                              1, 1,
                              0, 1,
                              1, 1,
                              0, 0,
                              1, 0]);

    ++this.currentSpriteCount;
};

dan.gfx.gl.SpriteBatch3D.prototype.addSpriteTST = function (
    i_srcTexture,
    i_colour,
    i_preTranslation, i_scale, i_postTranslation,
    i_drawDirection)
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
//  i_drawDirection:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//   or (null or undefined)
//    use default of [1, 1]
{
    // Apply default arguments
    if (!i_drawDirection)
        i_drawDirection = [1, 1];

    // If passed in a plain Texture2D, wrap it in a SubTexture2D
    var srcSubTexture;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        srcSubTexture = new dan.gfx.gl.SubTexture2D(i_srcTexture);
    else
        srcSubTexture = i_srcTexture;

    //
    this.subTexture = srcSubTexture;

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
    var dxX = srcSubTexture.rect.width();
    var dxY = 0;
    //  scale
    dxX *= i_scale[0];
    //  orient in requested axis direction
    dxX *= i_drawDirection[0];

    // Height vector
    var dyX = 0;
    var dyY = srcSubTexture.rect.height();
    //  scale
    dyY *= i_scale[1];
    //  orient in requested axis direction
    dyY *= i_drawDirection[1];

    // + }}}

    // Add vertices to VBO
    this.positions.addValues([
        // low, low
        cornerX,              cornerY,              0,
        // high, high
        cornerX + dxX + dyX,  cornerY + dxY + dyY,  0,
        // low, high
        cornerX + dyX,        cornerY + dyY,        0,
        // high, high
        cornerX + dxX + dyX,  cornerY + dxY + dyY,  0,
        // low, low
        cornerX,              cornerY,              0,
        // high, low
        cornerX + dxX,        cornerY + dxY,        0]);
 
    var r = i_colour.r;
    var g = i_colour.g;
    var b = i_colour.b;
    var a = i_colour.a;
    this.colours.addValues([r, g, b, a,
                            r, g, b, a,
                            r, g, b, a,
                            r, g, b, a,
                            r, g, b, a,
                            r, g, b, a]);

    this.texCoords.addValues([0, 0,
                              1, 1,
                              0, 1,
                              1, 1,
                              0, 0,
                              1, 0]);

    ++this.currentSpriteCount;
};

dan.gfx.gl.SpriteBatch3D.prototype.addSpriteTSRT = function (
    i_srcTexture,
    i_colour,
    i_preTranslation, i_scale, i_rotation, i_postTranslation,
    i_drawDirection)
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
//  i_drawDirection:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//   or (null or undefined)
//    use default of [1, 1]
{
    // Apply default arguments
    if (!i_drawDirection)
        i_drawDirection = [1, 1];

    // If passed in a plain Texture2D, wrap it in a SubTexture2D
    var srcSubTexture;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        srcSubTexture = new dan.gfx.gl.SubTexture2D(i_srcTexture);
    else
        srcSubTexture = i_srcTexture;

    //
    this.subTexture = srcSubTexture;

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
    var tempDxX = srcSubTexture.rect.width();
    var tempDxY = 0;
    //  scale
    tempDxX *= i_scale[0];
    //  rotate
    var dxX = tempDxX * cosAngle - tempDxY * sinAngle;
    var dxY = tempDxY * cosAngle + tempDxX * sinAngle;
    //  orient in requested axis directions
    dxX *= i_drawDirection[0];
    dxY *= i_drawDirection[1];

    // Height vector
    var tempDyX = 0;
    var tempDyY = srcSubTexture.rect.height();
    //  scale
    tempDyY *= i_scale[1];
    //  rotate
    var dyX = tempDyX * cosAngle - tempDyY * sinAngle;
    var dyY = tempDyY * cosAngle + tempDyX * sinAngle;
    //  orient in requested axis directions
    dyX *= i_drawDirection[0];
    dyY *= i_drawDirection[1];

    // + }}}

    // Add vertices to VBO
    this.positions.addValues([
        // low, low
        cornerX,              cornerY,              0,
        // high, high
        cornerX + dxX + dyX,  cornerY + dxY + dyY,  0,
        // low, high
        cornerX + dyX,        cornerY + dyY,        0,
        // high, high
        cornerX + dxX + dyX,  cornerY + dxY + dyY,  0,
        // low, low
        cornerX,              cornerY,              0,
        // high, low
        cornerX + dxX,        cornerY + dxY,        0]);
 
    var r = i_colour.r;
    var g = i_colour.g;
    var b = i_colour.b;
    var a = i_colour.a;
    this.colours.addValues([r, g, b, a,
                            r, g, b, a,
                            r, g, b, a,
                            r, g, b, a,
                            r, g, b, a,
                            r, g, b, a]);

    this.texCoords.addValues([0, 0,
                              1, 1,
                              0, 1,
                              1, 1,
                              0, 0,
                              1, 0]);

    ++this.currentSpriteCount;
};

dan.gfx.gl.SpriteBatch3D.prototype.addSpriteM = function (
    i_srcTexture,
    i_colour,
    i_transform,
    i_drawDirection)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.SubTexture2D)
//   or (dan.gfx.gl.Texture2D)
//  i_colour:
//   (dan.gfx.ColourRGBA)
//  i_transform:
//   (dan.math.Matrix4)
//  i_drawDirection:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//   or (null or undefined)
//    use default of [1, 1]
{
    // Apply default arguments
    if (!i_drawDirection)
        i_drawDirection = [1, 1];

    // If passed in a plain Texture2D, wrap it in a SubTexture2D
    var srcSubTexture;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        srcSubTexture = new dan.gfx.gl.SubTexture2D(i_srcTexture);
    else
        srcSubTexture = i_srcTexture;

    //
    this.subTexture = srcSubTexture;

    // + Transform {{{

    // Corner
    var corner = dan.math.Vector3.fromElements(0, 0, 0);
    corner.transformByMatrix(i_transform);

    //
    var scalingAndRotationTransformOnly = i_transform.clone();
    scalingAndRotationTransformOnly.cols[3][0] = 0;
    scalingAndRotationTransformOnly.cols[3][1] = 0;
    scalingAndRotationTransformOnly.cols[3][2] = 0;

    // Width vector
    var dx = dan.math.Vector3.fromElements(srcSubTexture.rect.width(), 0, 0);
    dx.transformByMatrix(scalingAndRotationTransformOnly);
    //  orient in requested axis direction
    dx.muls(i_drawDirection[0]);

    // Height vector
    var dy = dan.math.Vector3.fromElements(0, srcSubTexture.rect.height(), 0);
    dy.transformByMatrix(scalingAndRotationTransformOnly);
    //  orient in requested axis direction
    dy.muls(i_drawDirection[1]);

    // + }}}

    // Add vertices to VBO
    this.positions.addValues([
        // low, low
        corner[0],                 corner[1],                 corner[2],
        // high, high
        corner[0] + dx[0] + dy[0], corner[1] + dx[1] + dy[1], corner[2] + dx[2] + dy[2],
        // low, high
        corner[0] + dy[0],         corner[1] + dy[1],         corner[2] + dy[2],
        // high, high
        corner[0] + dx[0] + dy[0], corner[1] + dx[1] + dy[1], corner[2] + dx[2] + dy[2],
        // low, low
        corner[0],                 corner[1],                 corner[2],
        // high, low
        corner[0] + dx[0],         corner[1] + dx[1],         corner[2] + dx[2]]);
 
    var r = i_colour.r;
    var g = i_colour.g;
    var b = i_colour.b;
    var a = i_colour.a;
    this.colours.addValues([r, g, b, a,
                            r, g, b, a,
                            r, g, b, a,
                            r, g, b, a,
                            r, g, b, a,
                            r, g, b, a]);

    this.texCoords.addValues([0, 0,
                              1, 1,
                              0, 1,
                              1, 1,
                              0, 0,
                              1, 0]);

    ++this.currentSpriteCount;
};

dan.gfx.gl.SpriteBatch3D.prototype.addSpriteP = function (
    i_srcTexture,
    i_colour,
    i_parallelogram)
// Params:
//  i_srcTexture:
//   Either (dan.gfx.gl.SubTexture2D)
//   or (dan.gfx.gl.Texture2D)
//  i_colour:
//   (dan.gfx.ColourRGBA)
//  i_parallelogram:
//   (dan.math.Parallelogram3)
{
    // If passed in a plain Texture2D, wrap it in a SubTexture2D
    var srcSubTexture;
    if (i_srcTexture instanceof dan.gfx.gl.Texture2D)
        srcSubTexture = new dan.gfx.gl.SubTexture2D(i_srcTexture);
    else
        srcSubTexture = i_srcTexture;

    //
    this.subTexture = srcSubTexture;

    // Add vertices to VBO
    this.positions.addValues([
        // low, low
        i_parallelogram.corner[0],
        i_parallelogram.corner[1],
        i_parallelogram.corner[2],
        // high, high
        i_parallelogram.corner[0] + i_parallelogram.base1[0] + i_parallelogram.base2[0],
        i_parallelogram.corner[1] + i_parallelogram.base1[1] + i_parallelogram.base2[1],
        i_parallelogram.corner[2] + i_parallelogram.base1[2] + i_parallelogram.base2[2],
        // low, high
        i_parallelogram.corner[0] + i_parallelogram.base2[0],
        i_parallelogram.corner[1] + i_parallelogram.base2[1],
        i_parallelogram.corner[2] + i_parallelogram.base2[2],
        // high, high
        i_parallelogram.corner[0] + i_parallelogram.base1[0] + i_parallelogram.base2[0],
        i_parallelogram.corner[1] + i_parallelogram.base1[1] + i_parallelogram.base2[1],
        i_parallelogram.corner[2] + i_parallelogram.base1[2] + i_parallelogram.base2[2],
        // low, low
        i_parallelogram.corner[0],
        i_parallelogram.corner[1],
        i_parallelogram.corner[2],
        // high, low
        i_parallelogram.corner[0] + i_parallelogram.base1[0],
        i_parallelogram.corner[1] + i_parallelogram.base1[1],
        i_parallelogram.corner[2] + i_parallelogram.base1[2]]);
 
    var r = i_colour.r;
    var g = i_colour.g;
    var b = i_colour.b;
    var a = i_colour.a;
    this.colours.addValues([r, g, b, a,
                            r, g, b, a,
                            r, g, b, a,
                            r, g, b, a,
                            r, g, b, a,
                            r, g, b, a]);

    this.texCoords.addValues([0, 0,
                              1, 1,
                              0, 1,
                              1, 1,
                              0, 0,
                              1, 0]);

    ++this.currentSpriteCount;
};

// + }}}

// + Draw {{{

dan.gfx.gl.SpriteBatch3D.vertexShaderSource = "\n\
uniform mat4 u_viewMatrix;\n\
uniform mat4 u_projectionMatrix;\n\
\n\
attribute vec3 a_position;\n\
attribute vec4 a_colour;\n\
attribute vec2 a_texCoord;\n\
\n\
varying vec4 v_colour;\n\
varying vec2 v_texCoord;\n\
\n\
void main()\n\
{\n\
    vec4 position_view = u_viewMatrix * vec4(a_position, 1.0);\n\
    gl_Position = u_projectionMatrix * position_view;\n\
\n\
    v_colour = a_colour;\n\
    v_texCoord = a_texCoord;\n\
}\n\
";

dan.gfx.gl.SpriteBatch3D.fragmentShaderSource = "\
precision mediump float;\n\
\n\
varying highp vec4 v_colour;\n\
varying highp vec2 v_texCoord;\n\
\n\
uniform sampler2D u_texture;\n\
\n\
void main()\n\
{\n\
    vec4 texel = texture2D(u_texture, v_texCoord);\n\
    gl_FragColor = texel * v_colour;\n\
    if (gl_FragColor.a < 0.5) { discard; }\n\
}\n\
";

dan.gfx.gl.SpriteBatch3D.prototype.draw = function (i_viewMatrix, i_projectionMatrix)
// Params:
//  i_viewMatrix:
//   (dan.math.Matrix4)
//  i_projectionMatrix:
//   (dan.math.Matrix4)
{
    GL.setBufferObject(GL.ctx.ARRAY_BUFFER, this.positions.getBufferObject());
    GL.ctx.vertexAttribPointer(dan.gfx.gl.SpriteBatch3D.drawProgram.getAttributeLocation("a_position"), 3, GL.ctx.FLOAT, false, 0, 0);
    GL.setBufferObject(GL.ctx.ARRAY_BUFFER, this.colours.getBufferObject());
    GL.ctx.vertexAttribPointer(dan.gfx.gl.SpriteBatch3D.drawProgram.getAttributeLocation("a_colour"), 4, GL.ctx.FLOAT, false, 0, 0);
    GL.setBufferObject(GL.ctx.ARRAY_BUFFER, this.texCoords.getBufferObject());
    GL.ctx.vertexAttribPointer(dan.gfx.gl.SpriteBatch3D.drawProgram.getAttributeLocation("a_texCoord"), 2, GL.ctx.FLOAT, false, 0, 0);

    GL.setActiveTextureUnit(0);
    GL.bindTexture(GL.ctx.TEXTURE_2D, this.subTexture);

    GL.setProgram(dan.gfx.gl.SpriteBatch3D.drawProgram);
    dan.gfx.gl.SpriteBatch3D.drawProgram.setInteger("u_texture", 0);
    dan.gfx.gl.SpriteBatch3D.drawProgram.setMatrix4("u_viewMatrix", i_viewMatrix);
    dan.gfx.gl.SpriteBatch3D.drawProgram.setMatrix4("u_projectionMatrix", i_projectionMatrix);
    GL.ctx.enableVertexAttribArray(dan.gfx.gl.SpriteBatch3D.drawProgram.getAttributeLocation("a_position"));
    GL.ctx.enableVertexAttribArray(dan.gfx.gl.SpriteBatch3D.drawProgram.getAttributeLocation("a_colour"));
    GL.ctx.enableVertexAttribArray(dan.gfx.gl.SpriteBatch3D.drawProgram.getAttributeLocation("a_texCoord"));
    //GL.ctx.drawArrays(GL.ctx.TRIANGLES, 0, this.positions.getBufferObject().byteCount / 16);
    GL.ctx.drawArrays(GL.ctx.TRIANGLES, 0, this.currentSpriteCount * 6);  // 6 vertices per sprite
    GL.setProgram(null);
    GL.ctx.disableVertexAttribArray(dan.gfx.gl.SpriteBatch3D.drawProgram.getAttributeLocation("a_position"));
    GL.ctx.disableVertexAttribArray(dan.gfx.gl.SpriteBatch3D.drawProgram.getAttributeLocation("a_colour"));
    GL.ctx.disableVertexAttribArray(dan.gfx.gl.SpriteBatch3D.drawProgram.getAttributeLocation("a_texCoord"));
};

// + }}}

// + Clear {{{

dan.gfx.gl.SpriteBatch3D.prototype.clear = function ()
{
    this.positions.clear();
    this.colours.clear();
    this.texCoords.clear();

    this.subTexture = null;
    this.currentSpriteCount = 0;
};

// + }}}

// + Get information {{{

dan.gfx.gl.SpriteBatch3D.prototype.remainingCapacity = function ()
// Returns:
//  (integer number)
{
    return this.k_maxSpriteCount - this.currentSpriteCount;
}

dan.gfx.gl.SpriteBatch3D.prototype.inProgress = function ()
// Returns:
//  (boolean)
{
    return this.subTexture !== null;
};

dan.gfx.gl.SpriteBatch3D.prototype.getTexture = function ()
// Returns:
//  (dan.gfx.gl.Texture2D)
{
    if (this.subTexture === null)
        return null;
    else
        return this.subTexture.texture;
};

// + }}}
