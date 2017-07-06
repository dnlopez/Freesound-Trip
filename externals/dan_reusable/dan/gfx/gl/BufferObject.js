
// This namespace
// #require "gl.js"


// + Construction/destruction {{{

dan.gfx.gl.BufferObject = function (i_buffer, i_bindPoint)
// TODO: Swap parameter order
//
// Params:
//  i_buffer:
//   Either (WebGLBuffer)
//    Wrap an existing buffer object
//   or (null or undefined)
//    Create a new buffer object.
//  i_bindPoint:
//   Either (GLenum)
//   or (null or undefined)
//    Default to GL_ARRAY_BUFFER
{
    if (!i_buffer)
        i_buffer = GL.ctx.createBuffer();
    if (!i_bindPoint)
        i_bindPoint = GL.ctx.ARRAY_BUFFER;

    this.glObject = i_buffer;
    // (WebGLBuffer)
    this.bindPoint = i_bindPoint;
    // (GLenum)

    this.byteCount = 0;
    this.usage = null;
}

dan.gfx.gl.BufferObject.prototype.destroy = function ()
{
    if (this.glObject)
    {
        GL.ctx.deleteBuffer(this.glObject);
        this.glObject = null;
    }
};

// + }}}

// + Management (allocation, writing) {{{

dan.gfx.gl.BufferObject.prototype.allocate = function (i_usage, i_byteCount)
// Allocate buffer memory, when: always.
//
// Params:
//  i_usage:
//   (GLenum)
//   ctx.STREAM_DRAW, ctx.STATIC_DRAW, ctx.DYNAMIC_DRAW
//  i_byteCount:
//   (integer number)
{
    this.usage = i_usage;
    this.byteCount = i_byteCount;

    // Allocate buffer memory but don't write any data now
    GL.pushBufferObject(this.bindPoint, this);
    GL.ctx.bufferData(this.bindPoint, this.byteCount, i_usage);
    GL.popBufferObject(this.bindPoint);
}

dan.gfx.gl.BufferObject.prototype.allocateAndWrite = function (i_usage, i_data)
// Allocate buffer memory, when: always,
// write data, from: an array buffer or array buffer view.
//
// Params:
//  i_usage:
//   (GLenum)
//   ctx.STREAM_DRAW, ctx.STATIC_DRAW, ctx.DYNAMIC_DRAW
//  i_data:
//   Either (ArrayBuffer)
//   or (ArrayBufferView)
{
    this.usage = i_usage;
    this.byteCount = i_data.byteLength;

    // Allocate buffer memory and also write data now
    GL.pushBufferObject(this.bindPoint, this.glObject);
    GL.ctx.bufferData(this.bindPoint, i_data, i_usage);
    GL.popBufferObject(this.bindPoint);
}

dan.gfx.gl.BufferObject.prototype.write = function (i_offset, i_data)
// Write data, from: an array buffer or array buffer view.
//
// Params:
//  i_offset:
//   (integer number)
//  i_data:
//   Either (ArrayBuffer)
//   or (ArrayBufferView)
{
    // Write data
    GL.pushBufferObject(this.bindPoint, this.glObject);
    GL.ctx.bufferSubData(this.bindPoint, i_offset, i_data);
    GL.popBufferObject(this.bindPoint);
}

dan.gfx.gl.BufferObject.prototype.reallocate = function (i_usage, i_byteCount)
// Allocate buffer memory, when: if usage has changed or if new size > old size.
//
// Params:
//  i_usage:
//   (GLenum)
//   ctx.STREAM_DRAW, ctx.STATIC_DRAW, ctx.DYNAMIC_DRAW
//  i_byteCount:
//   (integer number)
{
    if (i_usage != this.usage || i_byteCount > this.byteCount)
        this.allocate(i_usage, i_byteCount);
}

dan.gfx.gl.BufferObject.prototype.reallocateAndWrite = function (i_usage, i_data)
// Allocate buffer memory, when: if usage has changed or if new size > old size,
// write data, from: a byte count and pointer.
//
// Params:
//  i_usage:
//   (GLenum)
//   ctx.STREAM_DRAW, ctx.STATIC_DRAW, ctx.DYNAMIC_DRAW
//  i_data:
//   Either (ArrayBuffer)
//   or (ArrayBufferView)
{
    if (i_usage != this.usage || i_data.byteLength > this.byteCount)
        this.allocateAndWrite(i_usage, i_data);
    else
        this.write(0, i_data);
}

// + }}}
