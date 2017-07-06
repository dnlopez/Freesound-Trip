
// This namespace
// #require "dan.js"


// + Construction {{{

dan.DynamicArrayBuffer = function (i_arrayType)
// A wrapper for a typed array that makes it resize dynamically, a bit like C++'s std::vector.
//
// The underlying typed array is enlarged when new data is pushed onto it beyond its existing
// bounds, and it is never made smaller (unless you abuse reserve()).
//
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
{
    this.array = new i_arrayType(1);
    // The underlying array.

    this.length = 0;
    // (integer number)
    // The 'live' element count of the buffer as enlarged by user pushes,
    // less than or equal to the true size of this.array.
};

// + }}}

// + Push and pop {{{

dan.DynamicArrayBuffer.prototype.push_back = function (i_value)
// Append a new value to the end of the live array.
//
// If the underlying array buffer is not big enough to accommodate it, it will be doubled in size
// (while preserving the existing array contents).
//
// Params:
//  i_value:
//   Value to push.
//
// Returns:
//  i_value.
{
    // If array is full, double its size
    if (this.length == this.capacity())
        this.reserve(this.length << 1);

    // Push value onto virtual subarray
    this.array[this.length] = i_value;
    ++this.length;

    // Return i_value just like regular Array.push()
    return i_value;
};
dan.DynamicArrayBuffer.prototype.push = dan.DynamicArrayBuffer.prototype.push_back;

dan.DynamicArrayBuffer.prototype.pop_back = function ()
// Remove the last item from the live array and return it.
//
// Although this function will reduce the length of the live array by 1,
// it will not ever shrink the underlying array buffer.
//
// Params:
//  i_value:
//   Value to push.
//
// Returns:
//  The removed value.
{
    --this.length;
    return this.array[this.length];
};
dan.DynamicArrayBuffer.prototype.pop = dan.DynamicArrayBuffer.prototype.pop_back;

// + }}}

// + Live data length {{{

dan.DynamicArrayBuffer.prototype.size = function ()
// Get the length of the live data.
//
// Returns:
//  (integer number)
{
    return this.length;
};

dan.DynamicArrayBuffer.prototype.resize = function (i_elementCount)
// Change the length of the live data.
//
// Params:
//  i_elementCount:
//   (integer number)
//   The new size of the live data.
{
    // Enlarge underlying buffer (by doubling) if necessary to accommodate the new live length
    var capacity = this.capacity();
    if (capacity < i_elementCount)
    {
        while (capacity < i_elementCount)
            capacity <<= 1;
        this.reserve(capacity);
    }

    //
    this.length = i_elementCount;
};

// + }}}

// + Underlying array buffer length {{{

dan.DynamicArrayBuffer.prototype.capacity = function ()
// Get the length of the underlying array buffer.
//
// Returns:
//  (integer number)
{
    return this.array.length;
};

dan.DynamicArrayBuffer.prototype.resizeUnderlyingArrayBuffer = function (i_elementCount)
// Resize the underlying array buffer while preserving existing contents as far as
// they still fit into the new size.
//
// Params:
//  i_elementCount:
//   (integer number)
//   The new size of the underlying array buffer.
//   If this is less than the current amount of live data stored (this.length)
//   then the live data will be truncated (and this.length reduced).
{
    // Make array at new size
    var newArray = new this.array.constructor(i_elementCount);

    // If new array is smaller than the old live data length, then truncate the live data
    if (i_elementCount < this.length)
        this.length = i_elementCount;

    // Copy live data from old to new array
    for (var elementNo = 0; elementNo < this.length; ++elementNo)
    {
        newArray[elementNo] = this.array[elementNo];
    }

    // Discard the old array and start managing the new one
    this.array = newArray;
};

dan.DynamicArrayBuffer.prototype.reserve = function (i_elementCount)
// Resize the underlying array buffer while preserving existing contents.
//
// Params:
//  i_elementCount:
//   (integer number)
//   The new size of the underlying array buffer.
//   Before actually resizing this will be clamped so that it is not smaller than
//   the current amount of live data stored (this.length) so as not to lose data.
{
    if (i_elementCount < this.length)
        i_elementCount = this.length;

    this.resizeUnderlyingArrayBuffer(i_elementCount);
};

// + }}}

dan.DynamicArrayBuffer.prototype.getArray = function ()
// Returns:
//  (TypedArray)
//  A newly-allocated array of size this.length with a copy of the current items.
{
    return this.array.subarray(0, this.length);
};
