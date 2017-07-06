
// This namespace
// #require "math.js"
// #require "Matrix3.js"


// + Construction {{{

dan.math.Vector2 = function ()
// Class representing a 2D vector, ie. 2 numbers,
// where each number is a float.
{
    this.construct();
};

dan.math.Vector2.prototype.construct = function ()
{
    this.elements = new Float32Array(2);
};

// + + Static constructors {{{

dan.math.Vector2.fromElements = function (i_x, i_y)
// Params:
//  i_x: (float)
//  i_y: (float)
//
// Returns:
//  (dan.math.Vector2)
{
    return new dan.math.Vector2().setFromElements(i_x, i_y);
};

dan.math.Vector2.fromXY = function (i_x, i_y)
// Params:
//  i_x: (float)
//  i_y: (float)
//
// Returns:
//  (dan.math.Vector2)
{
    return new dan.math.Vector2().setFromXY(i_x, i_y);
};

dan.math.Vector2.fromArray = function (i_array)
// Params:
//  i_array: (array of float)
//
// Returns:
//  (dan.math.Vector2)
{
    return new dan.math.Vector2().setFromArray(i_array);
};

dan.math.Vector2.fromConstant = function (i_constant)
// Params:
//  i_constant: (float)
//
// Returns:
//  (dan.math.Vector2)
{
    return new dan.math.Vector2().setFromConstant(i_constant);
};

dan.math.Vector2.fromVector2 = function (i_vector)
// Params:
//  i_vector: (dan.math.Vector2)
//
// Returns:
//  (dan.math.Vector2)
{
    return new dan.math.Vector2().setFromVector2(i_vector);
};

// + + }}}

dan.math.Vector2.prototype.clone = function (i_vector)
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromVector2(this);
};

// + + Custom memory allocator constructor {{{

dan.math.Vector2.alloc = function ()
// By default does the same as calling new.
{
    return new dan.math.Vector2();
};

dan.math.Vector2.temp = function ()
// By default does the same as calling new.
{
    return new dan.math.Vector2();
};

dan.math.Vector2.retain = function ()
{
};

dan.math.Vector2.release = function ()
{
};

// + + }}}

// + }}}

// + Set all elements at once {{{

dan.math.Vector2.prototype.setFromElements = function (i_x, i_y)
// Params:
//  i_x: (float)
//  i_y: (float)
//
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] = i_x;
    this.elements[1] = i_y;
    return this;
};

dan.math.Vector2.prototype.setFromXY = function (i_x, i_y)
// Params:
//  i_x: (float)
//  i_y: (float)
//
// Returns:
//  (dan.math.Vector2)
{
    return this.setFromElements(i_x, i_y);
};

dan.math.Vector2.prototype.setFromArray = function (i_array)
// Params:
//  i_array: (array of float)
//
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] = i_array[0];
    this.elements[1] = i_array[1];
    return this;
};

dan.math.Vector2.prototype.setFromConstant = function (i_constant)
// Params:
//  i_constant: (float)
//
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] = i_constant;
    this.elements[1] = i_constant;
    return this;
};

dan.math.Vector2.prototype.setFromVector2 = function (i_vector)
// Params:
//  i_vector: (dan.math.Vector2)
//
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] = i_vector.elements[0];
    this.elements[1] = i_vector.elements[1];
    return this;
};

// + }}}

// + Get/set individual elements {{{

// + + By properties 0/1 {{{

Object.defineProperty(dan.math.Vector2.prototype, "0", {
    get: function ()
    // Returns:
    //  (float)
    {
        return this.elements[0];
    },
    set: function (i_value)
    // Params:
    //  i_value:
    //   (float)
    {
        this.elements[0] = i_value;
    }
});

Object.defineProperty(dan.math.Vector2.prototype, "1", {
    get: function ()
    // Returns:
    //  (float)
    {
        return this.elements[1];
    },
    set: function (i_value)
    // Params:
    //  i_value:
    //   (float)
    {
        this.elements[1] = i_value;
    }
});

// + + }}}

// + + By properties x/y {{{

Object.defineProperty(dan.math.Vector2.prototype, "x", {
    get: function ()
    // Returns:
    //  (float)
    {
        return this.elements[0];
    },
    set: function (i_value)
    // Params:
    //  i_value:
    //   (float)
    {
        this.elements[0] = i_value;
    }
});

Object.defineProperty(dan.math.Vector2.prototype, "y", {
    get: function ()
    // Returns:
    //  (float)
    {
        return this.elements[1];
    },
    set: function (i_value)
    // Params:
    //  i_value:
    //   (float)
    {
        this.elements[1] = i_value;
    }
});

// + + }}}

// + + By functions get/set X/Y {{{

dan.math.Vector2.prototype.getX = function ()
// Returns:
//  (float)
{
    return this.elements[0];
};
dan.math.Vector2.prototype.setX = function (i_value)
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] = i_value;
    return this;
};

dan.math.Vector2.prototype.getY = function ()
// Returns:
//  (float)
{
    return this.elements[1];
};
dan.math.Vector2.prototype.setY = function (i_value)
// Returns:
//  (dan.math.Vector2)
{
    this.elements[1] = i_value;
    return this;
}

// + + }}}

// + }}}

// + Imitate Array type {{{

Object.defineProperty(dan.math.Vector2.prototype, "length", {
    get: function ()
    // Returns:
    //  (integer)
    {
        return 2;
    },
    set: function (i_value)
    {
    }
});

// + }}}

// + Arithmetic operations {{{

// + + With other vectors {{{

// + + + Member versions, modifying 'this' {{{

dan.math.Vector2.prototype.add = function (i_other)
// Element-wise addition, this += i_other
//
// Params:
//  i_other:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] += i_other[0];
    this.elements[1] += i_other[1];
    return this;
};

dan.math.Vector2.prototype.sub = function (i_other)
// Element-wise subtraction, this -= i_other
//
// Params:
//  i_other:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] -= i_other[0];
    this.elements[1] -= i_other[1];
    return this;
};

dan.math.Vector2.prototype.mul = function (i_other)
// Element-wise multiplication, this *= i_other
//
// Params:
//  i_other:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] *= i_other[0];
    this.elements[1] *= i_other[1];
    return this;
};

dan.math.Vector2.prototype.div = function (i_other)
// Element-wise division, this /= i_other
//
// Params:
//  i_other:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] /= i_other[0];
    this.elements[1] /= i_other[1];
    return this;
};

// + + + }}}

// + + + Non-member versions, returning new object {{{

dan.math.Vector2.add = function (i_vector1, i_vector2)
// Element-wise addition, i_vector1 + i_vector2
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_vector2:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        i_vector1[0] + i_vector2[0],
        i_vector1[1] + i_vector2[1]);
};

dan.math.Vector2.sub = function (i_vector1, i_vector2)
// Element-wise subtraction, i_vector1 - i_vector2
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_vector2:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        i_vector1[0] - i_vector2[0],
        i_vector1[1] - i_vector2[1]);
};

dan.math.Vector2.mul = function (i_vector1, i_vector2)
// Element-wise multiplication, i_vector1 * i_vector2
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_vector2:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        i_vector1[0] * i_vector2[0],
        i_vector1[1] * i_vector2[1]);
};

dan.math.Vector2.div = function (i_vector1, i_vector2)
// Element-wise division, i_vector1 / i_vector2
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_vector2:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        i_vector1[0] / i_vector2[0],
        i_vector1[1] / i_vector2[1]);
};

// + + + }}}

// + + }}}

// + + With scalars {{{

// + + + Member versions, modifying 'this' {{{

dan.math.Vector2.prototype.adds = function (i_scalar)
// Add scalar, this += i_scalar
//
// Params:
//  i_scalar: (float)
//
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] += i_scalar;
    this.elements[1] += i_scalar;
    return this;
};

dan.math.Vector2.prototype.subs = function (i_scalar)
// Subtract scalar, this -= i_scalar
//
// Params:
//  i_scalar: (float)
//
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] -= i_scalar;
    this.elements[1] -= i_scalar;
    return this;
};

dan.math.Vector2.prototype.muls = function (i_scalar)
// Multiply by scalar, this *= i_scalar
//
// Params:
//  i_scalar: (float)
//
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] *= i_scalar;
    this.elements[1] *= i_scalar;
    return this;
};

dan.math.Vector2.prototype.divs = function (i_scalar)
// Divide by scalar, this /= i_scalar
//
// Params:
//  i_scalar: (float)
//
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] /= i_scalar;
    this.elements[1] /= i_scalar;
    return this;
};

// + + + }}}

// + + + Non-member versions, returning new object {{{

dan.math.Vector2.adds = function (i_vector, i_scalar)
// Add scalar, i_vector + i_scalar
//
// Params:
//  i_vector:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        i_vector[0] + i_scalar,
        i_vector[1] + i_scalar);
};

dan.math.Vector2.sadd = function (i_scalar, i_vector)
// Add scalar, i_scalar + i_vector
//
// Params:
//  i_scalar:
//   (float)
//  i_vector:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        i_scalar + i_vector[0],
        i_scalar + i_vector[1]);
};

dan.math.Vector2.subs = function (i_vector, i_scalar)
// Subtract scalar, i_vector - i_scalar
//
// Params:
//  i_vector:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        i_vector[0] - i_scalar,
        i_vector[1] - i_scalar);
};

dan.math.Vector2.ssub = function (i_scalar, i_vector)
// Subtract from scalar, i_scalar - i_vector
//
// Params:
//  i_scalar:
//   (float)
//  i_vector:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        i_scalar - i_vector[0],
        i_scalar - i_vector[1]);
};

dan.math.Vector2.muls = function (i_vector, i_scalar)
// Multiply by scalar, i_vector * i_scalar
//
// Params:
//  i_vector:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        i_vector[0] * i_scalar,
        i_vector[1] * i_scalar);
};

dan.math.Vector2.smul = function (i_scalar, i_vector)
// Multiply by scalar, i_scalar * i_vector
//
// Params:
//  i_scalar:
//   (float)
//  i_vector:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        i_scalar * i_vector[0],
        i_scalar * i_vector[1]);
};

dan.math.Vector2.divs = function (i_vector, i_scalar)
// Divide by scalar, i_vector / i_scalar
//
// Params:
//  i_vector:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        i_vector[0] / i_scalar,
        i_vector[1] / i_scalar);
};

dan.math.Vector2.sdiv = function (i_scalar, i_vector)
// Divide into scalar, i_scalar / i_vector
//
// Params:
//  i_scalar:
//   (float)
//  i_vector:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        i_scalar / i_vector[0],
        i_scalar / i_vector[1]);
};

// + + + }}}

// + + }}}

// + }}}

// + Transform {{{

// + + Member versions, modifying 'this' {{{

dan.math.Vector2.prototype.transformByMatrix = function (i_matrix)
// Transform 2D vector with affine 3x3 matrix, this = i_matrix * this
//
// Params:
//  i_matrix:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Vector2)
{
    return this.setFromElements(
        i_matrix.cols[0][0] * this.getX()  +  i_matrix.cols[1][0] * this.getY()  +  i_matrix.cols[2][0] * 1.0,
        i_matrix.cols[0][1] * this.getX()  +  i_matrix.cols[1][1] * this.getY()  +  i_matrix.cols[2][1] * 1.0);
};

// + + }}}

// + + Non-member versions, returning new object {{{

dan.math.Vector2.transformByMatrix = function (i_matrix, i_vector)
// Transform 2D vector with affine 3x3 matrix, i_matrix * i_vector
//
// Params:
//  i_matrix:
//   (dan.math.Matrix3)
//  i_vector:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        i_matrix.cols[0][0] * i_vector[0]  +  i_matrix.cols[1][0] * i_vector[1]  +  i_matrix.cols[2][0] * 1.0,
        i_matrix.cols[0][1] * i_vector[0]  +  i_matrix.cols[1][1] * i_vector[1]  +  i_matrix.cols[2][1] * 1.0);
};

// + + }}}

// + }}}

// + Negate {{{

// + + Member versions, modifying 'this' {{{

dan.math.Vector2.prototype.negate = function ()
// Negation, -this
//
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] = -this.elements[0];
    this.elements[1] = -this.elements[1];
    return this;
};

// + + }}}

// + + Non-member versions, returning new object {{{

dan.math.Vector2.negate = function (i_vector)
// Negation, -i_vector
//
// Params:
//  i_vector:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        -i_vector[0],
        -i_vector[1]);
};

// + + }}}

// + }}}

// + Comparison operators {{{

dan.math.Vector2.isEqual = function (i_vector1, i_vector2)
// Params:
//  i_vector1:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_vector2:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (boolean)
{
    return i_vector1[0] == i_vector2[0] &&
           i_vector1[1] == i_vector2[1];
};

dan.math.Vector2.isNotEqual = function (i_vector1, i_vector2)
// Params:
//  i_vector1:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_vector2:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (boolean)
{
    return i_vector1[0] != i_vector2[0] ||
           i_vector1[1] != i_vector2[1];
};

// + }}}

// + Length-related information and operations {{{

dan.math.Vector2.prototype.norm = function ()
// Member version.
//
// Returns:
//  (float)
{
    return Math.sqrt(this.elements[0]*this.elements[0] +
                     this.elements[1]*this.elements[1]);
};

dan.math.Vector2.norm = function (i_vector)
// Non-member version.
//
// Params:
//  i_vector:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (float)
{
    return Math.sqrt(i_vector[0]*i_vector[0] +
                     i_vector[1]*i_vector[1]);
};

dan.math.Vector2.prototype.normSquared = function ()
// Member version.
//
// Returns:
//  (float)
{
    return this.elements[0]*this.elements[0] +
           this.elements[1]*this.elements[1];
};

dan.math.Vector2.normSquared = function (i_vector)
// Non-member version.
//
// Params:
//  i_vector:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (float)
{
    return i_vector[0]*i_vector[0] +
        i_vector[1]*i_vector[1];
};
dan.math.Vector2.length = dan.math.Vector2.norm;

dan.math.Vector2.prototype.normalize = function ()
// Member version, modifies 'this'.
//
// Returns:
//  (dan.math.Vector2)
{
    var reciprocalOfLength = 1.0 / this.norm();
    this.elements[0] *= reciprocalOfLength;
    this.elements[1] *= reciprocalOfLength;
    return this;
};

dan.math.Vector2.normalize = function (i_vector)
// Non-member version, doesn't modify input objects.
//
// Params:
//  i_vector:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    var reciprocalOfLength = 1.0 / i_vector.norm();
    return dan.math.Vector2.fromElements(
        i_vector[0] * reciprocalOfLength,
        i_vector[1] * reciprocalOfLength);
};

// + }}}

// + Dot product {{{

dan.math.Vector2.prototype.dot = function (i_other)
// Dot product, this . i_other
//
// Member version.
//
// Params:
//  i_other:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (float)
{
    return this.elements[0] * i_other[0] +
           this.elements[1] * i_other[1];
};

dan.math.Vector2.dot = function (i_vector1, i_vector2)
// Dot product, i_vector1 . i_vector2
//
// Non-member version.
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_vector2:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (float)
{
    return i_vector1[0] * i_vector2[0] +
           i_vector1[1] * i_vector2[1];
};

// + }}}

// + Distance from other vectors {{{

dan.math.Vector2.prototype.squaredDistance = function (i_other)
// Get square of distance between this and another position vector.
//
// Member version.
//
// Params:
//  i_other:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (float)
{
    var dx = this.elements[0] - i_other[0];
    var dy = this.elements[1] - i_other[1];

    return dx*dx + dy*dy;
};

dan.math.Vector2.squaredDistance = function (i_vector1, i_vector2)
// Get square of distance between two position vectors.
//
// Non-member version.
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_vector2:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (float)
{
    var dx = i_vector1[0] - i_vector2[0];
    var dy = i_vector1[1] - i_vector2[1];

    return dx*dx + dy*dy;
};

dan.math.Vector2.prototype.distance = function (i_other)
// Get distance between this and another position vector.
//
// Member version.
//
// Params:
//  i_other:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (float)
{
    return Math.sqrt(this.squaredDistance(i_other));
};

dan.math.Vector2.distance = function (i_vector1, i_vector2)
// Get distance between two position vectors.
//
// Non-member version.
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_vector2:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (float)
{
    return Math.sqrt(dan.math.Vector2.squaredDistance(i_vector1, i_vector2));
};

// + }}}

// + Miscellaneous operations {{{

// + + Member versions, modifying 'this' {{{

dan.math.Vector2.prototype.mix = function (i_other, i_f)
// Aka 'lerp'
//
// Params:
//  i_other:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_f: (float)
//
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] = this.elements[0] + i_f*(i_other[0] - this.elements[0]);
    this.elements[1] = this.elements[1] + i_f*(i_other[1] - this.elements[1]);
    return this;
};

dan.math.Vector2.prototype.clamp = function (i_min, i_max)
// Params:
//  i_min: (float)
//  i_max: (float)
//
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] = (this.elements[0] < i_min) ?
                       i_min :
                       (this.elements[0] > i_max) ?
                           i_max :
                           this.elements[0];
    this.elements[1] = (this.elements[1] < i_min) ?
                       i_min :
                       (this.elements[1] > i_max) ?
                           i_max :
                           this.elements[1];
    return this;
};

dan.math.Vector2.prototype.abs = function ()
// Returns:
//  (dan.math.Vector2)
{
    this.elements[0] = Math.abs(this.elements[0]);
    this.elements[1] = Math.abs(this.elements[1]);
    return this;
};

// + + }}}

// + + Non-member versions, returning new object {{{

dan.math.Vector2.mix = function (i_vector1, i_vector2, i_f)
// Aka 'lerp'
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_vector2:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_f:
//   (float)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        i_vector1[0] + i_f*(i_vector2[0] - i_vector1[0]),
        i_vector1[1] + i_f*(i_vector2[1] - i_vector1[1]));
};

dan.math.Vector2.clamp = function (i_vector, i_min, i_max)
// Params:
//  i_vector:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_min:
//   (float)
//  i_max:
//   (float)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        (i_vector[0] < i_min) ?
            i_min :
            (i_vector[0] > i_max) ?
                i_max :
                i_vector[0],
        (i_vector[1] < i_min) ?
            i_min :
            (i_vector[1] > i_max) ?
                i_max :
                i_vector[1]);
};

dan.math.Vector2.abs = function (i_vector)
// Params:
//  i_vector:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(
        Math.abs(i_vector[0]),
        Math.abs(i_vector[1]));
};

// + + }}}

// + }}}

// + Convert to other built-in types {{{

dan.math.Vector2.prototype.toArray = function ()
// Returns:
//  (array)
{
    return Array.apply(null, this.elements);
};

dan.math.Vector2.prototype.toString = function ()
// Returns:
//  (string)
{
    return "(" + this.elements[0].toString() + ", " + this.elements[1].toString() + ")";
};

// + }}}
