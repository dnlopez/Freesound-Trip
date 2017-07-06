
// Base class
// #require "Texture.js"

// This namespace
//// #require "Context.h"

// Dan reusable
// #require <dan/math/Vector2.js>


// + Construction {{{

dan.gfx.gl.Texture2D = function (i_glTextureObject)
// Construct, creating a new GL texture object or wrapping an existing one.
// TODO: if wrapping an existing one, lookup width/height etc?
//
// Params:
//  i_glTextureObject:
//   Either (WebGLTexture)
//    Construct wrapping this existing GL texture (which if it has already been bound to a texture target, that target should have been GL_TEXTURE_2D).
//   or (null or undefined)
//    Construct with no underlying GL texture.
{
    dan.gfx.gl.Texture.call(this, GL.ctx.TEXTURE_2D, i_glTextureObject);
}

dan.gfx.gl.Texture2D.prototype = Object.create(dan.gfx.gl.Texture.prototype);
//dan.gfx.gl.Texture2D.constructor = dan.gfx.gl.Texture2D;

dan.gfx.gl.Texture2D.fromBlank = function (i_internalFormat, i_border, i_width, i_height,
                                           i_format, i_type,
                                           i_glTextureObject, i_clampToEdge, i_smoothFiltering)
// Construct, creating a new GL texture object or wrapping an existing one,
// and allocate texels of some type and size,
// not initializing the texel values.
//
// Params:
//  i_internalFormat:
//   (GLenum)
//  i_border:
//   (integer number)
//  i_width, i_height:
//   (integer number)
//   Size of texture
//  i_format, i_type:
//   (As per comment in allocate(), don't know why this is necessary but the value for
//   this can affect whether glTexImage2D() works or not.)
//   Either (GLenum), (GLenum)
//   or (null or undefined), (null or undefined)
//    Use appropriate defaults that go with i_internalFormat
//  i_glTextureObject:
//   Either (WebGLTexture)
//    Wrap this existing GL texture (which if it has already been bound to a texture target, that target should have been GL_TEXTURE_2D).
//   or (null or undefined)
//    Create a new GL texture.
//  i_clampToEdge:
//   Either (array of 2 boolean)
//    See setClampToEdge()
//   or (boolean)
//    See setClampToEdge()
//   or (undefined)
//    Use default of false.
//  i_smoothFiltering:
//   Either (array of 2 boolean)
//    See setSmoothFiltering()
//   or (boolean)
//    See setSmoothFiltering()
//   or (undefined)
//    Use default of false.
{
    // Apply default arguments
    if (i_clampToEdge === undefined)
        i_clampToEdge = false;
    if (i_smoothFiltering === undefined)
        i_smoothFiltering = false;

    //
    var rv = new dan.gfx.gl.Texture2D(i_glTextureObject);

    // Set initial values for texture parameters
    rv.setClampToEdge(i_clampToEdge);
    rv.setSmoothFiltering(i_smoothFiltering);

    //
    rv.allocate(i_internalFormat, i_border, i_width, i_height,
                i_format, i_type);

    return rv;
};

dan.gfx.gl.Texture2D.forDepth = function (i_width, i_height,
                                          i_glTextureObject)
// Construct, creating a new GL texture object or wrapping an existing one,
// and allocate texels of a suitable type for a depth buffer at some size,
// not initializing the texel values.
//
// Params:
//  i_width, i_height:
//   (integer number)
//   Size of texture
//  i_glTextureObject:
//   Either (WebGLTexture)
//    Wrap this existing GL texture (which if it has already been bound to a texture target, that target should have been GL_TEXTURE_2D).
//   or (null or undefined)
//    Create a new GL texture.
{
    //
    var rv = new dan.gfx.gl.Texture2D(i_glTextureObject);

    // Set initial values for texture parameters
    rv.setClampToEdge(true);
    rv.setSmoothFiltering(true);

    //
    rv.allocate(GL.ctx.DEPTH_COMPONENT16, 0, i_width, i_height);

    return rv;
};

dan.gfx.gl.Texture2D.fromTypedArray = function (i_internalFormat, i_border, i_width, i_height,
                                                i_format, i_type, i_pixels,
                                                i_glTextureObject, i_clampToEdge, i_smoothFiltering)
// Construct, creating a new GL texture object or wrapping an existing one,
// allocate texels of some type and size,
// and convert/load in initial texel values from a typed array buffer.
//
// Params:
//  i_internalFormat:
//   (GLenum)
//  i_border:
//   (integer number)
//  i_width, i_height:
//   (integer number)
//   Size of texture
//  i_format:
//   (GLenum)
//  i_type:
//   (GLenum)
//  i_pixels:
//   Either (ArrayBufferView)
//    If i_type is UNSIGNED_BYTE,
//     this should be a Uint8Array.
//    If i_type is UNSIGNED_SHORT_5_6_5, UNSIGNED_SHORT_4_4_4_4, or UNSIGNED_SHORT_5_5_5_1,
//     this should be a Uint16Array.
//   or (null or undefined)
//    Construct without any pixels.
//  i_glTextureObject:
//   Either (WebGLTexture)
//    Wrap this existing GL texture (which if it has already been bound to a texture target, that target should have been GL_TEXTURE_2D).
//   or (null or undefined)
//    Create a new GL texture.
//  i_clampToEdge:
//   Either (array of 2 boolean)
//    See setClampToEdge()
//   or (boolean)
//    See setClampToEdge()
//   or (undefined)
//    Use default of false.
//  i_smoothFiltering:
//   Either (array of 2 boolean)
//    See setSmoothFiltering()
//   or (boolean)
//    See setSmoothFiltering()
//   or (undefined)
//    Use default of false.
{
    // Apply default arguments
    if (i_clampToEdge === undefined)
        i_clampToEdge = false;
    if (i_smoothFiltering === undefined)
        i_smoothFiltering = false;

    //
    var rv = new dan.gfx.gl.Texture2D(i_glTextureObject);

    // Set initial values for texture parameters
    rv.setClampToEdge(i_clampToEdge);
    rv.setSmoothFiltering(i_smoothFiltering);

    //
    rv.allocateAndWriteTypedArray(i_internalFormat, i_border, i_width, i_height,
                                  i_format, i_type, i_pixels);

    return rv;
};

dan.gfx.gl.Texture2D.fromImage = function (i_format, i_type, i_image,
                                           i_glTextureObject, i_clampToEdge, i_smoothFiltering)
// Construct, creating a new GL texture object or wrapping an existing one,
// allocate pixels of some type, at a size that matches an image, video or canvas,
// and convert/load in initial texel values from that image, video or canvas.
//
// Params:
//  i_format:
//   Either (GLenum)
//    Conceptually convert the source image data to this format before uploading
//   or (null or undefined)
//    Use GL_RGBA by default
//  i_type:
//   Either (GLenum)
//    Conceptually convert the source image data to this type before uploading
//   or (null or undefined)
//    Use GL_UNSIGNED_BYTE by default
//  i_image:
//   Either (HTMLImageElement)
//   or (HTMLVideoElement)
//   or (HTMLCanvasElement)
//   or (ImageData)
//  i_glTextureObject:
//   Either (WebGLTexture)
//    Wrap this existing GL texture (which if it has already been bound to a texture target, that target should have been GL_TEXTURE_2D).
//   or (null or undefined)
//    Create a new GL texture.
//  i_clampToEdge:
//   Either (array of 2 boolean)
//    See setClampToEdge()
//   or (boolean)
//    See setClampToEdge()
//   or (undefined)
//    Use default of false.
//  i_smoothFiltering:
//   Either (array of 2 boolean)
//    See setSmoothFiltering()
//   or (boolean)
//    See setSmoothFiltering()
//   or (undefined)
//    Use default of false.
{
    // Apply default arguments
    if (i_clampToEdge === undefined)
        i_clampToEdge = false;
    if (i_smoothFiltering === undefined)
        i_smoothFiltering = false;

    //
    var rv = new dan.gfx.gl.Texture2D(i_glTextureObject);

    // Set initial values for texture parameters
    rv.setClampToEdge(i_clampToEdge);
    rv.setSmoothFiltering(i_smoothFiltering);

    //
    rv.allocateAndWriteImage(GL.ctx.RGBA, 0,
                             i_format, i_type, i_image);

    return rv;
};

/*
template<typename PixelType>
    Texture2D(const SubBitmap<PixelType> & i_subBitmap,
              i_glTextureObject, i_smoothFiltering)
// Construct from a SubBitmap (which itself specifies width and height and pixels).
// The pixels inside the SubBitmap's sub-rectangle will form the entire texture;
// those outside this area will not be uploaded or contribute to the final width/height.
//
// Params:
//  i_glTextureObject:
//   Either (WebGLTexture)
//    Wrap this existing GL texture (which if it has already been bound to a texture target, that target should have been GL_TEXTURE_2D).
//   or (null or undefined)
//    Create a new GL texture.
//  i_smoothFiltering:
//   Either (boolean)
//   or (undefined)
//    Use default of false.
{
    // Apply default arguments
    if (i_smoothFiltering === undefined)
        i_smoothFiltering = false;

    //
    dan.gfx.gl.Texture.call(this, GL.ctx.TEXTURE_2D, i_glTextureObject);

    // Set basic default values for texture parameters
    this.bind();
    GL.ctx.texParameteri(this.glTextureTarget, GL.ctx.TEXTURE_MIN_FILTER, i_smoothFiltering ? GL.ctx.LINEAR : GL.ctx.NEAREST);
    GL.ctx.texParameteri(this.glTextureTarget, GL.ctx.TEXTURE_MAG_FILTER, i_smoothFiltering ? GL.ctx.LINEAR : GL.ctx.NEAREST);
    GL.ctx.texParameteri(this.glTextureTarget, GL.ctx.TEXTURE_WRAP_S, GL.ctx.REPEAT);
    GL.ctx.texParameteri(this.glTextureTarget, GL.ctx.TEXTURE_WRAP_T, GL.ctx.REPEAT);

    //
    allocateAndWrite<PixelType>(GL.ctx.RGBA, 0,
                                i_subBitmap);
};
*/

// + }}}

// + Resize/rellocate/reset {{{

dan.gfx.gl.Texture2D.prototype.allocate = function (i_internalFormat, i_border, i_width, i_height,
                                                    i_format, i_type)
// Allocate texels,
// with some type and size,
// not initializing the texel values.
//
// Params:
//  i_internalFormat:
//   (GLenum)
//  i_border:
//   (integer number)
//  i_width, i_height:
//   (integer number)
//   Size of texture
//  i_format, i_type:
//   (As per comment below, don't know why this is necessary but the value for
//   this can affect whether glTexImage2D() works or not.)
//   Either (GLenum), (GLenum)
//   or (null or undefined), (null or undefined)
//    Use appropriate defaults that go with i_internalFormat
{
    // If format or type were not specified,
    // apply a suitable default that goes with the internal format.
    // (Don't understand why should even need to set these parameters when we're not
    // supplying pixels to glTexImage2D(), but unfortunately passing 0 or other random
    // values for them just leads to GL errors.)
    switch (i_internalFormat)
    {
    // From glTexImage2D reference page:
    //  "GL_INVALID_OPERATION is generated if format is GL_DEPTH_COMPONENT
    //  and internalFormat is not GL_DEPTH_COMPONENT, GL_DEPTH_COMPONENT16,
    //  GL_DEPTH_COMPONENT24, or GL_DEPTH_COMPONENT32F."
    // and
    //  "GL_INVALID_OPERATION is generated if internalFormat is
    //  GL_DEPTH_COMPONENT, GL_DEPTH_COMPONENT16, GL_DEPTH_COMPONENT24,
    //  or GL_DEPTH_COMPONENT32F, and format is not GL_DEPTH_COMPONENT."
    case GL.ctx.DEPTH_COMPONENT:
    case GL.ctx.DEPTH_COMPONENT16:
    case GL.ctx.DEPTH_COMPONENT24:
    case GL.ctx.DEPTH_COMPONENT32F:
        if (!i_format)
            i_format = GL.ctx.DEPTH_COMPONENT;
        if (!i_type)
            i_type = GL.ctx.FLOAT;
        break;
    default:
        // RGBA is probably a reasonable default choice
        if (!i_format)
            i_format = GL.ctx.RGBA;
        // Say 1 byte to avoid any confusion about length
        if (!i_type)
            i_type = GL.ctx.UNSIGNED_BYTE;
        break;
    }

    // Size of texture will be the specified width and height
    this.width = i_width;
    this.height = i_height;

    //
    this.bind();

    // Set size in GL
    GL.ctx.texImage2D(this.glTextureTarget, 0,
                      i_internalFormat,
                      this.width, this.height,
                      i_border,
                      i_format, i_type,
                      // No pixels
                      null);
};

dan.gfx.gl.Texture2D.prototype.allocateAndWriteTypedArray = function (i_internalFormat, i_border, i_width, i_height,
                                                                      i_format, i_type, i_pixels)
// Allocate texels,
// with some type and size,
// and convert/load in initial texel values from a typed array buffer.
//
// Params:
//  i_internalFormat:
//   (GLenum)
//  i_border:
//   (integer number)
//  i_width, i_height:
//   (integer number)
//   Size of texture
//  i_format:
//   (GLenum)
//  i_type:
//   (GLenum)
//  i_pixels:
//   (ArrayBufferView)
//   If i_type is UNSIGNED_BYTE,
//    this should be a Uint8Array.
//   If i_type is UNSIGNED_SHORT_5_6_5, UNSIGNED_SHORT_4_4_4_4, or UNSIGNED_SHORT_5_5_5_1,
//    this should be a Uint16Array.
{
    // Size of texture will be the specified width and height
    this.width = i_width;
    this.height = i_height;

    // Set pixel store (pixel block format) stuff, affecting glTexImage2D() operation.
    // Default alignment.
    GL.unpackAlignment(1);

    //
    this.bind();

    // Set size / upload pixels to GL
    GL.ctx.texImage2D(this.glTextureTarget, 0,
                      i_internalFormat,
                      this.width, this.height,
                      i_border,
                      i_format, i_type,
                      // Pixels are those passed in
                      i_pixels);
};

dan.gfx.gl.Texture2D.prototype.allocateAndWriteImage = function (i_internalFormat, i_border,
                                                                 i_format, i_type, i_image)
// Allocate texels,
// with some type, at a size that matches an image, video or canvas,
// and convert/load in initial texel values from that image, video or canvas.
//
// Params:
//  i_internalFormat:
//   (GLenum)
//  i_border:
//   (integer number)
//  i_format:
//   Either (GLenum)
//    Conceptually convert the source image data to this format before uploading
//   or (null or undefined)
//    Use GL_RGBA by default
//  i_type:
//   Either (GLenum)
//    Conceptually convert the source image data to this type before uploading
//   or (null or undefined)
//    Use GL_UNSIGNED_BYTE by default
//  i_image:
//   Either (HTMLImageElement)
//   or (HTMLVideoElement)
//   or (HTMLCanvasElement)
//   or (ImageData)
{
    // Apply default arguments
    if (!i_format)
        i_format = GL.ctx.RGBA;
    if (!i_type)
        i_type = GL.ctx.UNSIGNED_BYTE;

    // Query the image/video/canvas for the width and height for future reference
    this.width = i_image.width;
    this.height = i_image.height;

    // Because pixels are being loaded with top scanline first,
    // texture coordinate y origin will be at top
    // Maybe TODO: UNPACK_FLIP_Y_WEBGL pixel storage parameter

    //
    this.bind();

    // Set size / upload pixels to GL
    GL.ctx.texImage2D(this.glTextureTarget, 0,
                      i_internalFormat,
                      i_format, i_type,
                      // Pixels are those from the image, video or canvas
                      i_image);
};

dan.gfx.gl.Texture2D.prototype.allocateAndWriteFramebuffer = function (
    i_internalFormat,
    i_width, i_height,
    i_framebuffer)
// Allocate texels,
// with some type, at a size that matches a framebuffer [TODO or must it be from params...],
// and convert/load in initial texel values from that framebuffer.
//
// Params:
//  i_internalFormat:
//   Either (GLenum)
//   or (null or undefined)
//    Use GL_RGBA by default
//  i_framebuffer:
//   (dan.gfx.gl.Framebuffer)
{
    // Apply default arguments
    if (!i_internalFormat)
        i_format = GL.ctx.RGBA;

    // Query the framebuffer for the width and height for future reference
    // [TODO: why are they params, is this not possible in WebGL?]
    this.width = i_width;
    this.height = i_height;

    // Because pixels are being loaded with top scanline first,
    // texture coordinate y origin will be at top
    // Maybe TODO: UNPACK_FLIP_Y_WEBGL pixel storage parameter

    //
    this.bind();

    // Set size / upload pixels to GL
    GL.ctx.copyTexImage2D(this.glTextureTarget, 0,
                          i_internalFormat,
                          0, 0, this.width, this.height,
                          0);
};

/*
template<typename PixelType>
    dan.gfx.gl.Texture2D.prototype.allocateAndWrite = function (i_internalFormat, i_border,
                                                                const SubBitmap<PixelType> & i_subBitmap)
// Allocate texture memory
// and load some pixels into it from a SubBitmap
//  (which itself specifies width and height and pixels).
//  The pixels inside the SubBitmap's sub-rectangle will form the entire texture;
//  those outside this area will not be uploaded or contribute to the final width/height.
//
// Params:
//  i_internalFormat:
//   (GLenum)
//  i_border:
//   (integer number)
{
    // Size of texture will be the width and height of the SubBitmap's sub-rectangle
    dan::Rect & subRectangle = i_subBitmap.rect();
    this.width = subRectangle.width();
    this.height = subRectangle.height();

    // Set pixel store (pixel block format) stuff, affecting glTexImage2D() operation.
    // Default alignment.
    GL.unpackAlignment(1);

    // Because pixels are being loaded with top scanline first,
    // texture coordinate y origin will be at top

    //
    this.bind();

    // Choose channel swizzling while uploading in conjunction with pixel format/type below
    pixel_gl_traits<PixelType>::setSwizzle(this.glTextureTarget);

    // Set size / upload pixels to GL
    GL.ctx.texImage2D(this.glTextureTarget, 0,
                 i_internalFormat,
                 this.width, this.height,
                 i_border,
                 // Lookup GL pixel format/type for our template-parameterized PixelType
                 pixel_gl_traits<PixelType>::PixelFormat, pixel_gl_traits<PixelType>::PixelType,
                 // Pixels are from the SubBitmap's underlying Bitmap,
                 // having moved to the top-left of the sub-rectangle
                 i_subBitmap.bitmap().pixels().get() +
                 i_subBitmap.bitmap().width() * subRectangle.top +
                 subRectangle.left);
};
*/

// + }}}

// + Dimensions {{{

dan.gfx.gl.Texture2D.prototype.getSize = function ()
// Returns:
//  (dan.math.Vector2)
//  Width and height.
{
    if (this.width === null || this.width === undefined)
        return dan.math.Vector2.fromXY(0, 0);

    return dan.math.Vector2.fromXY(this.width, this.height);
};

// + }}}


// + Texture parameters {{{

dan.gfx.gl.Texture2D.prototype.setClampToEdge = function (i_clamp)
// Params:
//  i_clamp:
//   Either (array of 2 boolean)
//    Whether to use clamp (GL_CLAMP_TO_EDGE) or not (GL_REPEAT)
//    in the S and T directions respectively
//   or (boolean)
//    Do the same for both cases
{
    this.bind();
    if (i_clamp instanceof Array)
    {
        this.setTexParameter(GL.ctx.TEXTURE_WRAP_S, i_clamp[0] ? GL.ctx.CLAMP_TO_EDGE : GL.ctx.REPEAT);
        this.setTexParameter(GL.ctx.TEXTURE_WRAP_T, i_clamp[1] ? GL.ctx.CLAMP_TO_EDGE : GL.ctx.REPEAT);
    }
    else
    {
        this.setTexParameter(GL.ctx.TEXTURE_WRAP_S, i_clamp ? GL.ctx.CLAMP_TO_EDGE : GL.ctx.REPEAT);
        this.setTexParameter(GL.ctx.TEXTURE_WRAP_T, i_clamp ? GL.ctx.CLAMP_TO_EDGE : GL.ctx.REPEAT);
    }
};

dan.gfx.gl.Texture2D.prototype.setSmoothFiltering = function (i_smooth)
// Params:
//  i_smooth:
//   Either (array of 2 boolean)
//    Whether to use smooth (GL_LINEAR) filtering or not (GL_NEAREST)
//    for minifying and magnifying respectively
//   or (boolean)
//    Do the same for both cases
{
    this.bind();
    if (i_smooth instanceof Array)
    {
        this.setTexParameter(GL.ctx.TEXTURE_MIN_FILTER, i_smooth[0] ? GL.ctx.LINEAR : GL.ctx.NEAREST);
        this.setTexParameter(GL.ctx.TEXTURE_MAG_FILTER, i_smooth[1] ? GL.ctx.LINEAR : GL.ctx.NEAREST);
    }
    else
    {
        this.setTexParameter(GL.ctx.TEXTURE_MIN_FILTER, i_smooth ? GL.ctx.LINEAR : GL.ctx.NEAREST);
        this.setTexParameter(GL.ctx.TEXTURE_MAG_FILTER, i_smooth ? GL.ctx.LINEAR : GL.ctx.NEAREST);
    }
};

// + }}}
