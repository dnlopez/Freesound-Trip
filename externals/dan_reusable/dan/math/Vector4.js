
// This namespace
// #require "math.js"


// + Construction {{{

dan.math.Vector4 = function ()
// Class representing a 4D vector, ie. 4 numbers,
// where each number is a float.
{
    this.elements = new Float32Array(4);
};

// + + Static constructors {{{

dan.math.Vector4.fromElements = function (i_x, i_y, i_z, i_w)
// Params:
//  i_x: (float)
//  i_y: (float)
//  i_z: (float)
//  i_w: (float)
//
// Returns:
//  (dan.math.Vector4)
{
    return new dan.math.Vector4().setFromElements(i_x, i_y, i_z, i_w);
};

dan.math.Vector4.fromXYZW = function (i_x, i_y, i_z, i_w)
// Params:
//  i_x: (float)
//  i_y: (float)
//  i_z: (float)
//  i_w: (float)
//
// Returns:
//  (dan.math.Vector4)
{
    return new dan.math.Vector4().setFromXYZW(i_x, i_y, i_z, i_w);
};

dan.math.Vector4.fromArray = function (i_array)
// Params:
//  i_array: (array of float)
//
// Returns:
//  (dan.math.Vector4)
{
    return new dan.math.Vector4().setFromArray(i_array);
};

dan.math.Vector4.fromConstant = function (i_constant)
// Params:
//  i_constant: (float)
//
// Returns:
//  (dan.math.Vector4)
{
    return new dan.math.Vector4().setFromConstant(i_constant);
};

dan.math.Vector4.fromVector4 = function (i_vector)
// Params:
//  i_vector: (dan.math.Vector4)
//
// Returns:
//  (dan.math.Vector4)
{
    return new dan.math.Vector4().setFromVector4(i_vector);
};

// + + }}}

dan.math.Vector4.prototype.clone = function (i_vector)
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromVector4(this);
};

// + }}}

// + Set all elements at once {{{

dan.math.Vector4.prototype.setFromElements = function (i_x, i_y, i_z, i_w)
// Params:
//  i_x: (float)
//  i_y: (float)
//  i_z: (float)
//  i_w: (float)
//
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] = i_x;
    this.elements[1] = i_y;
    this.elements[2] = i_z;
    this.elements[3] = i_w;
    return this;
};

dan.math.Vector4.prototype.setFromXYZW = function (i_x, i_y, i_z, i_w)
// Params:
//  i_x: (float)
//  i_y: (float)
//  i_z: (float)
//  i_w: (float)
//
// Returns:
//  (dan.math.Vector4)
{
    return this.setFromElements(i_x, i_y, i_z, i_w);
};

dan.math.Vector4.prototype.setFromArray = function (i_array)
// Params:
//  i_array: (array of float)
//
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] = i_array[0];
    this.elements[1] = i_array[1];
    this.elements[2] = i_array[2];
    this.elements[3] = i_array[3];
    return this;
};

dan.math.Vector4.prototype.setFromConstant = function (i_constant)
// Params:
//  i_constant: (float)
//
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] = i_constant;
    this.elements[1] = i_constant;
    this.elements[2] = i_constant;
    this.elements[3] = i_constant;
    return this;
};

dan.math.Vector4.prototype.setFromVector4 = function (i_vector)
// Params:
//  i_vector: (dan.math.Vector4)
//
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] = i_vector.elements[0];
    this.elements[1] = i_vector.elements[1];
    this.elements[2] = i_vector.elements[2];
    this.elements[3] = i_vector.elements[3];
    return this;
};

// + }}}

// + Get/set individual elements {{{

// + + By properties 0/1/2/3 {{{

Object.defineProperty(dan.math.Vector4.prototype, "0", {
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

Object.defineProperty(dan.math.Vector4.prototype, "1", {
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

Object.defineProperty(dan.math.Vector4.prototype, "2", {
    get: function ()
    // Returns:
    //  (float)
    {
        return this.elements[2];
    },
    set: function (i_value)
    // Params:
    //  i_value:
    //   (float)
    {
        this.elements[2] = i_value;
    }
});

Object.defineProperty(dan.math.Vector4.prototype, "3", {
    get: function ()
    // Returns:
    //  (float)
    {
        return this.elements[3];
    },
    set: function (i_value)
    // Params:
    //  i_value:
    //   (float)
    {
        this.elements[3] = i_value;
    }
});

// + + }}}

// + + By properties x/y/z/w {{{

Object.defineProperty(dan.math.Vector4.prototype, "x", {
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

Object.defineProperty(dan.math.Vector4.prototype, "y", {
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

Object.defineProperty(dan.math.Vector4.prototype, "z", {
    get: function ()
    // Returns:
    //  (float)
    {
        return this.elements[2];
    },
    set: function (i_value)
    // Params:
    //  i_value:
    //   (float)
    {
        this.elements[2] = i_value;
    }
});

Object.defineProperty(dan.math.Vector4.prototype, "w", {
    get: function ()
    // Returns:
    //  (float)
    {
        return this.elements[3];
    },
    set: function (i_value)
    // Params:
    //  i_value:
    //   (float)
    {
        this.elements[3] = i_value;
    }
});

// + + }}}

// + + By functions get/set X/Y/Z/W {{{

dan.math.Vector4.prototype.getX = function ()
// Returns:
//  (float)
{
    return this.elements[0];
};
dan.math.Vector4.prototype.setX = function (i_value)
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] = i_value;
    return this;
};

dan.math.Vector4.prototype.getY = function ()
// Returns:
//  (float)
{
    return this.elements[1];
};
dan.math.Vector4.prototype.setY = function (i_value)
// Returns:
//  (dan.math.Vector4)
{
    this.elements[1] = i_value;
    return this;
};

dan.math.Vector4.prototype.getZ = function ()
// Returns:
//  (float)
{
    return this.elements[2];
};
dan.math.Vector4.prototype.setZ = function (i_value)
// Returns:
//  (dan.math.Vector4)
{
    this.elements[2] = i_value;
    return this;
};

dan.math.Vector4.prototype.getW = function ()
// Returns:
//  (float)
{
    return this.elements[3];
};
dan.math.Vector4.prototype.setW = function (i_value)
// Returns:
//  (dan.math.Vector4)
{
    this.elements[3] = i_value;
    return this;
};

// + + }}}

// + }}}

// + Imitate Array type {{{

Object.defineProperty(dan.math.Vector4.prototype, "length", {
    get: function ()
    // Returns:
    //  (integer)
    {
        return 4;
    },
    set: function (i_value)
    {
    }
});

// + }}}

// + Arithmetic operations {{{

// + + With other vectors {{{

// + + + Member versions, modifying 'this' {{{

dan.math.Vector4.prototype.add = function (i_other)
// Element-wise addition, this += i_other
//
// Params:
//  i_other:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] += i_other[0];
    this.elements[1] += i_other[1];
    this.elements[2] += i_other[2];
    this.elements[3] += i_other[3];
    return this;
};

dan.math.Vector4.prototype.sub = function (i_other)
// Element-wise subtraction, this -= i_other
//
// Params:
//  i_other:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] -= i_other[0];
    this.elements[1] -= i_other[1];
    this.elements[2] -= i_other[2];
    this.elements[3] -= i_other[3];
    return this;
};

dan.math.Vector4.prototype.mul = function (i_other)
// Element-wise multiplication, this *= i_other
//
// Params:
//  i_other:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] *= i_other[0];
    this.elements[1] *= i_other[1];
    this.elements[2] *= i_other[2];
    this.elements[3] *= i_other[3];
    return this;
};

dan.math.Vector4.prototype.div = function (i_other)
// Element-wise division, this /= i_other
//
// Params:
//  i_other:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] /= i_other[0];
    this.elements[1] /= i_other[1];
    this.elements[2] /= i_other[2];
    this.elements[3] /= i_other[3];
    return this;
};

// + + + }}}

// + + + Non-member versions, returning new object {{{

dan.math.Vector4.add = function (i_vector1, i_vector2)
// Element-wise addition, i_vector1 + i_vector2
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_vector2:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        i_vector1[0] + i_vector2[0],
        i_vector1[1] + i_vector2[1],
        i_vector1[2] + i_vector2[2],
        i_vector1[3] + i_vector2[3]);
};

dan.math.Vector4.sub = function (i_vector1, i_vector2)
// Element-wise subtraction, i_vector1 - i_vector2
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_vector2:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        i_vector1[0] - i_vector2[0],
        i_vector1[1] - i_vector2[1],
        i_vector1[2] - i_vector2[2],
        i_vector1[3] - i_vector2[3]);
};

dan.math.Vector4.mul = function (i_vector1, i_vector2)
// Element-wise multiplication, i_vector1 * i_vector2
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_vector2:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        i_vector1[0] * i_vector2[0],
        i_vector1[1] * i_vector2[1],
        i_vector1[2] * i_vector2[2],
        i_vector1[3] * i_vector2[3]);
};

dan.math.Vector4.div = function (i_vector1, i_vector2)
// Element-wise division, i_vector1 / i_vector2
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_vector2:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        i_vector1[0] / i_vector2[0],
        i_vector1[1] / i_vector2[1],
        i_vector1[2] / i_vector2[2],
        i_vector1[3] / i_vector2[3]);
};

// + + + }}}

// + + }}}

// + + With scalars {{{

// + + + Member versions, modifying 'this' {{{

dan.math.Vector4.prototype.adds = function (i_scalar)
// Add scalar, this += i_scalar
//
// Params:
//  i_scalar: (float)
//
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] += i_scalar;
    this.elements[1] += i_scalar;
    this.elements[2] += i_scalar;
    this.elements[3] += i_scalar;
    return this;
};

dan.math.Vector4.prototype.subs = function (i_scalar)
// Subtract scalar, this -= i_scalar
//
// Params:
//  i_scalar: (float)
//
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] -= i_scalar;
    this.elements[1] -= i_scalar;
    this.elements[2] -= i_scalar;
    this.elements[3] -= i_scalar;
    return this;
};

dan.math.Vector4.prototype.muls = function (i_scalar)
// Multiply by scalar, this *= i_scalar
//
// Params:
//  i_scalar: (float)
//
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] *= i_scalar;
    this.elements[1] *= i_scalar;
    this.elements[2] *= i_scalar;
    this.elements[3] *= i_scalar;
    return this;
};

dan.math.Vector4.prototype.divs = function (i_scalar)
// Divide by scalar, this /= i_scalar
//
// Params:
//  i_scalar: (float)
//
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] /= i_scalar;
    this.elements[1] /= i_scalar;
    this.elements[2] /= i_scalar;
    this.elements[3] /= i_scalar;
    return this;
};

// + + + }}}

// + + + Non-member versions, returning new object {{{

dan.math.Vector4.adds = function (i_vector, i_scalar)
// Add scalar, i_vector + i_scalar
//
// Params:
//  i_vector:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        i_vector[0] + i_scalar,
        i_vector[1] + i_scalar,
        i_vector[2] + i_scalar,
        i_vector[3] + i_scalar);
};

dan.math.Vector4.sadd = function (i_scalar, i_vector)
// Add scalar, i_scalar + i_vector
//
// Params:
//  i_scalar:
//   (float)
//  i_vector:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        i_scalar + i_vector[0],
        i_scalar + i_vector[1],
        i_scalar + i_vector[2],
        i_scalar + i_vector[3]);
};

dan.math.Vector4.subs = function (i_vector, i_scalar)
// Subtract scalar, i_vector - i_scalar
//
// Params:
//  i_vector:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        i_vector[0] - i_scalar,
        i_vector[1] - i_scalar,
        i_vector[2] - i_scalar,
        i_vector[3] - i_scalar);
};

dan.math.Vector4.ssub = function (i_scalar, i_vector)
// Subtract from scalar, i_scalar - i_vector
//
// Params:
//  i_scalar:
//   (float)
//  i_vector:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        i_scalar - i_vector[0],
        i_scalar - i_vector[1],
        i_scalar - i_vector[2],
        i_scalar - i_vector[3]);
};

dan.math.Vector4.muls = function (i_vector, i_scalar)
// Multiply by scalar, i_vector * i_scalar
//
// Params:
//  i_vector:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        i_vector[0] * i_scalar,
        i_vector[1] * i_scalar,
        i_vector[2] * i_scalar,
        i_vector[3] * i_scalar);
};

dan.math.Vector4.smul = function (i_scalar, i_vector)
// Multiply by scalar, i_scalar * i_vector
//
// Params:
//  i_scalar:
//   (float)
//  i_vector:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        i_scalar * i_vector[0],
        i_scalar * i_vector[1],
        i_scalar * i_vector[2],
        i_scalar * i_vector[3]);
};

dan.math.Vector4.divs = function (i_vector, i_scalar)
// Divide by scalar, i_vector / i_scalar
//
// Params:
//  i_vector:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        i_vector[0] / i_scalar,
        i_vector[1] / i_scalar,
        i_vector[2] / i_scalar,
        i_vector[3] / i_scalar);
};

dan.math.Vector4.sdiv = function (i_scalar, i_vector)
// Divide into scalar, i_scalar / i_vector
//
// Params:
//  i_scalar:
//   (float)
//  i_vector:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        i_scalar / i_vector[0],
        i_scalar / i_vector[1],
        i_scalar / i_vector[2],
        i_scalar / i_vector[3]);
};

// + + + }}}

// + + }}}

// + }}}

// + Transform by matrix {{{

// + + Member versions, modifying 'this' {{{

dan.math.Vector4.prototype.transformByMatrix = function (i_matrix)
// Transform 4D vector with matrix, this = i_matrix * this
//
// Params:
//  i_matrix:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Vector4)
{
    return this.setFromElements(
        i_matrix.cols[0][0] * this.getX()  +  i_matrix.cols[1][0] * this.getY()  +  i_matrix.cols[2][0] * this.getZ()  +  i_matrix.cols[3][0] * this.getW(),
        i_matrix.cols[0][1] * this.getX()  +  i_matrix.cols[1][1] * this.getY()  +  i_matrix.cols[2][1] * this.getZ()  +  i_matrix.cols[3][1] * this.getW(),
        i_matrix.cols[0][2] * this.getX()  +  i_matrix.cols[1][2] * this.getY()  +  i_matrix.cols[2][2] * this.getZ()  +  i_matrix.cols[3][2] * this.getW(),
        i_matrix.cols[0][3] * this.getX()  +  i_matrix.cols[1][3] * this.getY()  +  i_matrix.cols[2][3] * this.getZ()  +  i_matrix.cols[3][3] * this.getW());
};

// + + }}}

// + + Non-member versions, returning new object {{{

dan.math.Vector4.transformByMatrix = function (i_matrix, i_vector)
// Transform 4D vector with matrix, i_matrix * i_vector
//
// Params:
//  i_matrix:
//   (dan.math.Matrix4)
//  i_vector:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        i_matrix.cols[0][0] * i_vector[0]  +  i_matrix.cols[1][0] * i_vector[1]  +  i_matrix.cols[2][0] * i_vector[2]  +  i_matrix.cols[3][0] * i_vector[3],
        i_matrix.cols[0][1] * i_vector[0]  +  i_matrix.cols[1][1] * i_vector[1]  +  i_matrix.cols[2][1] * i_vector[2]  +  i_matrix.cols[3][1] * i_vector[3],
        i_matrix.cols[0][2] * i_vector[0]  +  i_matrix.cols[1][2] * i_vector[1]  +  i_matrix.cols[2][2] * i_vector[2]  +  i_matrix.cols[3][2] * i_vector[3],
        i_matrix.cols[0][3] * i_vector[0]  +  i_matrix.cols[1][3] * i_vector[1]  +  i_matrix.cols[2][3] * i_vector[2]  +  i_matrix.cols[3][3] * i_vector[3]);
};

// + + }}}

// + }}}

// + Negate {{{

// + + Member versions, modifying 'this' {{{

dan.math.Vector4.prototype.negate = function ()
// Negation, -this
//
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] = -this.elements[0];
    this.elements[1] = -this.elements[1];
    this.elements[2] = -this.elements[2];
    this.elements[3] = -this.elements[3];
    return this;
};

// + + }}}

// + + Non-member versions, returning new object {{{

dan.math.Vector4.negate = function (i_vector)
// Negation, -i_vector
//
// Params:
//  i_vector:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        -i_vector[0],
        -i_vector[1],
        -i_vector[2],
        -i_vector[3]);
};

// + + }}}

// + }}}

// + Comparison operators {{{

dan.math.Vector4.isEqual = function (i_vector1, i_vector2)
// Params:
//  i_vector1:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_vector2:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (boolean)
{
    return i_vector1[0] == i_vector2[0] &&
           i_vector1[1] == i_vector2[1] &&
           i_vector1[2] == i_vector2[2] &&
           i_vector1[3] == i_vector2[3];
};

dan.math.Vector4.isNotEqual = function (i_vector1, i_vector2)
// Params:
//  i_vector1:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_vector2:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (boolean)
{
    return i_vector1[0] != i_vector2[0] ||
           i_vector1[1] != i_vector2[1] ||
           i_vector1[2] != i_vector2[2] ||
           i_vector1[3] != i_vector2[3];
};

// + }}}

// + Length-related information and operations {{{

dan.math.Vector4.prototype.norm = function ()
// Member version.
//
// Returns:
//  (float)
{
    return Math.sqrt(this.elements[0]*this.elements[0] +
                     this.elements[1]*this.elements[1] +
                     this.elements[2]*this.elements[2] +
                     this.elements[3]*this.elements[3]);
};

dan.math.Vector4.norm = function (i_vector)
// Non-member version.
//
// Params:
//  i_vector:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (float)
{
    return Math.sqrt(i_vector[0]*i_vector[0] +
                     i_vector[1]*i_vector[1] +
                     i_vector[2]*i_vector[2] +
                     i_vector[3]*i_vector[3]);
};

dan.math.Vector4.prototype.normSquared = function ()
// Member version.
//
// Returns:
//  (float)
{
    return this.elements[0]*this.elements[0] +
           this.elements[1]*this.elements[1] +
           this.elements[2]*this.elements[2] +
           this.elements[3]*this.elements[3];
};

dan.math.Vector4.normSquared = function (i_vector)
// Non-member version.
//
// Params:
//  i_vector:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (float)
{
    return i_vector[0]*i_vector[0] +
           i_vector[1]*i_vector[1] +
           i_vector[2]*i_vector[2] +
           i_vector[3]*i_vector[3];
};

dan.math.Vector4.prototype.normalize = function ()
// Member version, modifies 'this'.
//
// Returns:
//  (dan.math.Vector4)
{
    var reciprocalOfLength = 1.0 / this.norm();
    this.elements[0] *= reciprocalOfLength;
    this.elements[1] *= reciprocalOfLength;
    this.elements[2] *= reciprocalOfLength;
    this.elements[3] *= reciprocalOfLength;
    return this;
};

dan.math.Vector4.normalize = function (i_vector)
// Non-member version, doesn't modify input objects.
//
// Params:
//  i_vector:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    var reciprocalOfLength = 1.0 / i_vector.norm();
    return dan.math.Vector4.fromElements(
        i_vector[0] * reciprocalOfLength,
        i_vector[1] * reciprocalOfLength,
        i_vector[2] * reciprocalOfLength,
        i_vector[3] * reciprocalOfLength);
};

// + }}}

// + Dot product {{{

dan.math.Vector4.prototype.dot = function (i_other)
// Dot product, this . i_other
//
// Member version.
//
// Params:
//  i_other:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (float)
{
    return this.elements[0] * i_other[0] +
           this.elements[1] * i_other[1] +
           this.elements[2] * i_other[2] +
           this.elements[3] * i_other[3];
};

dan.math.Vector4.dot = function (i_vector1, i_vector2)
// Dot product, i_vector1 . i_vector2
//
// Non-member version.
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_vector2:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (float)
{
    return i_vector1[0] * i_vector2[0] +
           i_vector1[1] * i_vector2[1] +
           i_vector1[2] * i_vector2[2] +
           i_vector1[3] * i_vector2[3];
};

// + }}}

// + Distance from other vectors {{{

dan.math.Vector4.prototype.squaredDistance = function (i_other)
// Get square of distance between this and another position vector.
//
// Member version.
//
// Params:
//  i_other:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (float)
{
    var dx = this.elements[0] - i_other[0];
    var dy = this.elements[1] - i_other[1];
    var dz = this.elements[2] - i_other[2];
    var dw = this.elements[3] - i_other[3];

    return dx*dx + dy*dy + dz*dz + dw*dw;
};

dan.math.Vector4.squaredDistance = function (i_vector1, i_vector2)
// Get square of distance between two position vectors.
//
// Non-member version.
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_vector2:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (float)
{
    var dx = i_vector1[0] - i_vector2[0];
    var dy = i_vector1[1] - i_vector2[1];
    var dz = i_vector1[2] - i_vector2[2];
    var dw = i_vector1[3] - i_vector2[3];

    return dx*dx + dy*dy + dz*dz + dw*dw;
};

dan.math.Vector4.prototype.distance = function (i_other)
// Get distance between this and another position vector.
//
// Member version.
//
// Params:
//  i_other:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (float)
{
    return Math.sqrt(this.squaredDistance(i_other));
};

dan.math.Vector4.distance = function (i_vector1, i_vector2)
// Get distance between two position vectors.
//
// Non-member version.
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_vector2:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (float)
{
    return Math.sqrt(dan.math.Vector4.squaredDistance(i_vector1, i_vector2));
};

// + }}}

// + Miscellaneous operations {{{

// + + Member versions, modifying 'this' {{{

dan.math.Vector4.prototype.mix = function (i_other, i_f)
// Aka 'lerp'
//
// Params:
//  i_other:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_f: (float)
//
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] = this.elements[0] + i_f*(i_other[0] - this.elements[0]);
    this.elements[1] = this.elements[1] + i_f*(i_other[1] - this.elements[1]);
    this.elements[2] = this.elements[2] + i_f*(i_other[2] - this.elements[2]);
    this.elements[3] = this.elements[3] + i_f*(i_other[3] - this.elements[3]);
    return this;
};

dan.math.Vector4.prototype.clamp = function (i_min, i_max)
// Params:
//  i_min: (float)
//  i_max: (float)
//
// Returns:
//  (dan.math.Vector4)
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
    this.elements[2] = (this.elements[2] < i_min) ?
                       i_min :
                       (this.elements[2] > i_max) ?
                           i_max :
                           this.elements[2];
    this.elements[3] = (this.elements[3] < i_min) ?
                       i_min :
                       (this.elements[3] > i_max) ?
                           i_max :
                           this.elements[3];
    return this;
};

dan.math.Vector4.prototype.abs = function ()
// Returns:
//  (dan.math.Vector4)
{
    this.elements[0] = Math.abs(this.elements[0]);
    this.elements[1] = Math.abs(this.elements[1]);
    this.elements[2] = Math.abs(this.elements[2]);
    this.elements[3] = Math.abs(this.elements[3]);
    return this;
};

// + + }}}

// + + Non-member versions, returning new object {{{

dan.math.Vector4.mix = function (i_vector1, i_vector2, i_f)
// Aka 'lerp'
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_vector2:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_f:
//   (float)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        i_vector1[0] + i_f*(i_vector2[0] - i_vector1[0]),
        i_vector1[1] + i_f*(i_vector2[1] - i_vector1[1]),
        i_vector1[2] + i_f*(i_vector2[2] - i_vector1[2]),
        i_vector1[3] + i_f*(i_vector2[3] - i_vector1[3]));
};

dan.math.Vector4.clamp = function (i_vector, i_min, i_max)
// Params:
//  i_vector:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//  i_min:
//   (float)
//  i_max:
//   (float)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        (i_vector[0] < i_min) ?
            i_min :
            (i_vector[0] > i_max) ?
                i_max :
                i_vector[0],
        (i_vector[1] < i_min) ?
            i_min :
            (i_vector[1] > i_max) ?
                i_max :
                i_vector[1],
        (i_vector[2] < i_min) ?
            i_min :
            (i_vector[2] > i_max) ?
                i_max :
                i_vector[2],
        (i_vector[3] < i_min) ?
            i_min :
            (i_vector[3] > i_max) ?
                i_max :
                i_vector[3]);
};

dan.math.Vector4.abs = function (i_vector)
// Params:
//  i_vector:
//   Either (dan.math.Vector4)
//   or (array of 4 floats)
//
// Returns:
//  (dan.math.Vector4)
{
    return dan.math.Vector4.fromElements(
        Math.abs(i_vector[0]),
        Math.abs(i_vector[1]),
        Math.abs(i_vector[2]),
        Math.abs(i_vector[3]));
};

// + + }}}

// + }}}

// + Convert to other built-in types {{{

dan.math.Vector4.prototype.toArray = function ()
// Returns:
//  (array)
{
    return Array.apply(null, this.elements);
};

dan.math.Vector4.prototype.toString = function ()
// Returns:
//  (string)
{
    return "(" + this.elements[0].toString() + ", " + this.elements[1].toString() + ", " + this.elements[2].toString() + ", " + this.elements[3].toString() + ")";
};

// + }}}
