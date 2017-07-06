
// This namespace
// #require "gl.js"

//
// #require "BufferObject.js"


// An array class which starts out empty, allows you to append values up to a limit,
// and at any time have the class allocate and fill a BufferObject with the values which
// you can use to draw with. The current set of values can also be cleared for you to start
// again.
//
// This is similar to IncrementalBufferObject but the hard limit means it can be faster by
// using a typed array to hold the incrementally added values, and allocating the BufferObject
// only once at construction time.


// + Construction {{{

dan.gfx.gl.FixedBufferObject = function (i_maxValueCount)
// Params:
//  i_maxValueCount:
//   (integer number)
{
    this.maxValueCount = i_maxValueCount;

    this.typedArray = new Float32Array(this.maxValueCount);
    this.typedArray_usedValueCount = 0;

    this.bufferObject = new dan.gfx.gl.BufferObject();
    this.bufferObject.allocate(GL.ctx.STATIC_DRAW, this.maxValueCount * 4);
    this.bufferObject_uploadedValueCount = 0;
};

dan.gfx.gl.FixedBufferObject.prototype.destroy = function ()
{
    if (this.bufferObject)
    {
        this.bufferObject.destroy();
        this.bufferObject = null;
    }
};

// + }}}

// + Add values {{{

dan.gfx.gl.FixedBufferObject.prototype.addValue = function (i_value)
// Add a single value to the buffer.
//
// Whether there is space for the value is not checked. Undefined behaviour will result
// if you exceed the buffer's capacity.
//
// Params:
//  i_value:
//   (float number)
{
    //if (this.typedArray_usedValueCount + 1 > this.maxValueCount)
    //    return false;

    this.typedArray[this.typedArray_usedValueCount] = i_value;
    ++this.typedArray_usedValueCount;
};

dan.gfx.gl.FixedBufferObject.prototype.addValues = function (i_values)
// Add multiple values to the buffer.
//
// Whether there is space for the values is not checked. Undefined behaviour will result
// if you exceed the buffer's capacity.
//
// Params:
//  i_values:
//   (array of float number)
{
    //if (this.typedArray_usedValueCount + i_values.length > this.maxValueCount)
    //    return false;

    for (var valueNo = 0, len = i_values.length; valueNo < len; ++valueNo)
    {
        this.typedArray[this.typedArray_usedValueCount] = i_values[valueNo];
        ++this.typedArray_usedValueCount;
    }
};

// + }}}

// + Clear values {{{

dan.gfx.gl.FixedBufferObject.prototype.clear = function ()
{
    this.typedArray_usedValueCount = 0;
    this.bufferObject_uploadedValueCount = 0;
}

// + }}}

// + Get buffer object {{{

dan.gfx.gl.FixedBufferObject.prototype.getBufferObject = function ()
// Returns:
//  (dan.gfx.gl.BufferObject)
{
    // If source data has been added to then upload the added stuff to the GL buffer object
    if (this.typedArray_usedValueCount > this.bufferObject_uploadedValueCount)
    {
        this.bufferObject.write(this.bufferObject_uploadedValueCount * 4,
                                this.typedArray.subarray(this.bufferObject_uploadedValueCount, this.typedArray_usedValueCount));
        this.bufferObject_uploadedValueCount = this.typedArray_usedValueCount;
    }

    // Return buffer object
    return this.bufferObject;
};

// + }}}
