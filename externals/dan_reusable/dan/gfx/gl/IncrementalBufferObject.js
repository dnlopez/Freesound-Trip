
// This namespace
// #require "gl.js"

// Dan reusable
// #require <dan/DynamicArrayBuffer.js>


// An array class which starts out empty, allows you to append values without limit,
// and at any time have the class allocate and fill a BufferObject with the values which
// you can use to draw with. The current set of values can also be cleared for you to start
// again.


// + Construction/destruction {{{

dan.gfx.gl.IncrementalBufferObject = function (i_valueType, i_bindPoint)
// Params:
//  i_valueType:
//   (function)
//   TypedArray constructor corresponding to the type of the items that will be stored here.
//   One of:
//    Int8Array, Uint8Array, Uint8ClampedArray
//    Int16Array, Uint16Array
//    Int32Array, Uint32Array
//    Float32Array
//    Float64Array
//  i_bindPoint:
//   Either (GLenum)
//   or (null or undefined)
//    Default to GL_ARRAY_BUFFER
{
    this.array = new dan.DynamicArrayBuffer(i_valueType);
    this.valueType = i_valueType;
    this.bufferObject = new dan.gfx.gl.BufferObject(null, i_bindPoint);
    this.bufferObjectIsUpToDateWithArray = false;
};

dan.gfx.gl.IncrementalBufferObject.prototype.destroy = function ()
{
    if (this.bufferObject)
    {
        this.bufferObject.destroy();
        this.bufferObject = null;
    }
};

// + }}}

// + Add values {{{

dan.gfx.gl.IncrementalBufferObject.prototype.addValue = function (i_value)
// Params:
//  i_value:
//   (float number)
{
    this.array.push(i_value);
    this.bufferObjectIsUpToDateWithArray = false;
};

dan.gfx.gl.IncrementalBufferObject.prototype.addValues = function (i_values)
// Params:
//  i_values:
//   (array of float number)
{
    for (var valueNo = 0, len = i_values.length; valueNo < len; ++valueNo)
    {
        this.array.push(i_values[valueNo]);
    }
    if (i_values.length > 0)
        this.bufferObjectIsUpToDateWithArray = false;
};

dan.gfx.gl.IncrementalBufferObject.prototype.push = function (/* i_values... */)
// Params:
//  i_values*:
//   (float number)
{
    for (var valueNo = 0, len = arguments.length; valueNo < len; ++valueNo)
    {
        this.array.push(arguments[valueNo]);
    }
    if (arguments.length > 0)
        this.bufferObjectIsUpToDateWithArray = false;
};

// + }}}

// + Clear values {{{

dan.gfx.gl.IncrementalBufferObject.prototype.clear = function ()
{
    this.array.length = 0;
    this.bufferObjectIsUpToDateWithArray = false;
}

// + }}}

// + Get information {{{

dan.gfx.gl.IncrementalBufferObject.prototype.valueCount = function ()
{
    return this.array.length;
}

// + }}}

// + Get buffer object {{{

dan.gfx.gl.IncrementalBufferObject.prototype.getBufferObject = function ()
// Returns:
//  (dan.gfx.gl.BufferObject)
{
    // If source data has changed then reallocate GL buffer object
    // and reupload everything since the reallocation unfortunately clears it
    if (!this.bufferObjectIsUpToDateWithArray)
    {
        this.bufferObject.allocateAndWrite(GL.ctx.STREAM_DRAW, new this.valueType(this.array.getArray()));
        this.bufferObjectIsUpToDateWithArray = true;
    }

    // Return buffer object
    return this.bufferObject;
};

// + }}}
