
// This namespace
// #require "memory.js"


dan.memory.NonGcStack = function ()
// A stack-like container based upon a standard Array which never actually gets smaller,
// to try and avoid garbage collector action on the removed space.
//
// Note: this is referring to the array itself's memory allocation for its nodes, not the
// objects themselves if the nodes contain references to objects. If you remove an object
// from this container and then discard it and no other references remain, GC will be invoked
// on that object as per usual, and to avoid this you'll need to use some seperate scheme
// such as pooling those objects. (So, not sure how useful this class actually is in reality,
// but here it is).
{
    this.m_array = [];
    this.m_length = 0;
};

dan.memory.NonGcStack.prototype.push = function (i_value)
{
    this.m_array[this.m_length] = i_value;
    ++this.m_length;
    return i_value;
};

dan.memory.NonGcStack.prototype.pop = function ()
{
    --this.m_length;
    return this.m_array[this.m_length];
};

dan.memory.NonGcStack.prototype.clear = function ()
{
    this.m_length = 0;
};

dan.memory.NonGcStack.prototype.getLength = function ()
// Returns:
//  (integer number)
{
    return this.m_length;
}

dan.memory.NonGcStack.prototype.getArray = function ()
// Returns:
//  (Array)
//  This array is provided mainly for reading.
//  You must not change its length. (You may, however, change individual items in it.)
{
    return this.m_array;
};
