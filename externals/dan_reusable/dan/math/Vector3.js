
// This namespace
// #require "math.js"
// #require "Matrix4.js"
// #require "Quaternion.js"
// #require "Euler.js"


// + Construction {{{

dan.math.Vector3 = function ()
// Class representing a 3D vector, ie. 3 numbers,
// where each number is a float.
{
    this.elements = new Float32Array(3);
};

// + + Static constructors {{{

dan.math.Vector3.fromElements = function (i_x, i_y, i_z)
// Params:
//  i_x: (float)
//  i_y: (float)
//  i_z: (float)
//
// Returns:
//  (dan.math.Vector3)
{
    return new dan.math.Vector3().setFromElements(i_x, i_y, i_z);
};

dan.math.Vector3.fromXYZ = function (i_x, i_y, i_z)
// Params:
//  i_x: (float)
//  i_y: (float)
//  i_z: (float)
//
// Returns:
//  (dan.math.Vector3)
{
    return new dan.math.Vector3().setFromXYZ(i_x, i_y, i_z);
};

dan.math.Vector3.fromArray = function (i_array)
// Params:
//  i_array: (array of float)
//
// Returns:
//  (dan.math.Vector3)
{
    return new dan.math.Vector3().setFromArray(i_array);
};

dan.math.Vector3.fromConstant = function (i_constant)
// Params:
//  i_constant: (float)
//
// Returns:
//  (dan.math.Vector3)
{
    return new dan.math.Vector3().setFromConstant(i_constant);
};

dan.math.Vector3.fromVector3 = function (i_vector)
// Params:
//  i_vector: (dan.math.Vector3)
//
// Returns:
//  (dan.math.Vector3)
{
    return new dan.math.Vector3().setFromVector3(i_vector);
};

// + + }}}

dan.math.Vector3.prototype.clone = function (i_vector)
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromVector3(this);
};

// + }}}

// + Set all elements at once {{{

dan.math.Vector3.prototype.setFromElements = function (i_x, i_y, i_z)
// Params:
//  i_x: (float)
//  i_y: (float)
//  i_z: (float)
//
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] = i_x;
    this.elements[1] = i_y;
    this.elements[2] = i_z;
    return this;
};

dan.math.Vector3.prototype.setFromXYZ = function (i_x, i_y, i_z)
// Params:
//  i_x: (float)
//  i_y: (float)
//  i_z: (float)
//
// Returns:
//  (dan.math.Vector3)
{
    return this.setFromElements(i_x, i_y, i_z);
};

dan.math.Vector3.prototype.setFromArray = function (i_array)
// Params:
//  i_array: (array of float)
//
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] = i_array[0];
    this.elements[1] = i_array[1];
    this.elements[2] = i_array[2];
    return this;
};

dan.math.Vector3.prototype.setFromConstant = function (i_constant)
// Params:
//  i_constant: (float)
//
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] = i_constant;
    this.elements[1] = i_constant;
    this.elements[2] = i_constant;
    return this;
};

dan.math.Vector3.prototype.setFromVector3 = function (i_vector)
// Params:
//  i_vector: (dan.math.Vector3)
//
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] = i_vector.elements[0];
    this.elements[1] = i_vector.elements[1];
    this.elements[2] = i_vector.elements[2];
    return this;
};

// + }}}

// + Get/set individual elements {{{

// + + By properties 0/1/2 {{{

Object.defineProperty(dan.math.Vector3.prototype, "0", {
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

Object.defineProperty(dan.math.Vector3.prototype, "1", {
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

Object.defineProperty(dan.math.Vector3.prototype, "2", {
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

// + + }}}

// + + By properties x/y/z {{{

Object.defineProperty(dan.math.Vector3.prototype, "x", {
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

Object.defineProperty(dan.math.Vector3.prototype, "y", {
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

Object.defineProperty(dan.math.Vector3.prototype, "z", {
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

// + + }}}

// + + By functions get/set X/Y/Z {{{

dan.math.Vector3.prototype.getX = function ()
// Returns:
//  (float)
{
    return this.elements[0];
};
dan.math.Vector3.prototype.setX = function (i_value)
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] = i_value;
    return this;
};

dan.math.Vector3.prototype.getY = function ()
// Returns:
//  (float)
{
    return this.elements[1];
};
dan.math.Vector3.prototype.setY = function (i_value)
// Returns:
//  (dan.math.Vector3)
{
    this.elements[1] = i_value;
    return this;
};

dan.math.Vector3.prototype.getZ = function ()
// Returns:
//  (float)
{
    return this.elements[2];
};
dan.math.Vector3.prototype.setZ = function (i_value)
// Returns:
//  (dan.math.Vector3)
{
    this.elements[2] = i_value;
    return this;
};

// + + }}}

// + }}}

// + Imitate Array type {{{

Object.defineProperty(dan.math.Vector3.prototype, "length", {
    get: function ()
    // Returns:
    //  (integer)
    {
        return 3;
    },
    set: function (i_value)
    {
    }
});

// + }}}

// + Arithmetic operations {{{

// + + With other vectors {{{

// + + + Member versions, modifying 'this' {{{

dan.math.Vector3.prototype.add = function (i_other)
// Element-wise addition, this += i_other
//
// Params:
//  i_other:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] += i_other[0];
    this.elements[1] += i_other[1];
    this.elements[2] += i_other[2];
    return this;
};

dan.math.Vector3.prototype.sub = function (i_other)
// Element-wise subtraction, this -= i_other
//
// Params:
//  i_other:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] -= i_other[0];
    this.elements[1] -= i_other[1];
    this.elements[2] -= i_other[2];
    return this;
};

dan.math.Vector3.prototype.mul = function (i_other)
// Element-wise multiplication, this *= i_other
//
// Params:
//  i_other:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] *= i_other[0];
    this.elements[1] *= i_other[1];
    this.elements[2] *= i_other[2];
    return this;
};

dan.math.Vector3.prototype.div = function (i_other)
// Element-wise division, this /= i_other
//
// Params:
//  i_other:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] /= i_other[0];
    this.elements[1] /= i_other[1];
    this.elements[2] /= i_other[2];
    return this;
};

// + + + }}}

// + + + Non-member versions, returning new object {{{

dan.math.Vector3.add = function (i_vector1, i_vector2)
// Element-wise addition, i_vector1 + i_vector2
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_vector2:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        i_vector1[0] + i_vector2[0],
        i_vector1[1] + i_vector2[1],
        i_vector1[2] + i_vector2[2]);
};

dan.math.Vector3.sub = function (i_vector1, i_vector2)
// Element-wise subtraction, i_vector1 - i_vector2
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_vector2:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        i_vector1[0] - i_vector2[0],
        i_vector1[1] - i_vector2[1],
        i_vector1[2] - i_vector2[2]);
};

dan.math.Vector3.mul = function (i_vector1, i_vector2)
// Element-wise multiplication, i_vector1 * i_vector2
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_vector2:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        i_vector1[0] * i_vector2[0],
        i_vector1[1] * i_vector2[1],
        i_vector1[2] * i_vector2[2]);
};

dan.math.Vector3.div = function (i_vector1, i_vector2)
// Element-wise division, i_vector1 / i_vector2
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_vector2:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        i_vector1[0] / i_vector2[0],
        i_vector1[1] / i_vector2[1],
        i_vector1[2] / i_vector2[2]);
};

// + + + }}}

// + + }}}

// + + With scalars {{{

// + + + Member versions, modifying 'this' {{{

dan.math.Vector3.prototype.adds = function (i_scalar)
// Add scalar, this += i_scalar
//
// Params:
//  i_scalar: (float)
//
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] += i_scalar;
    this.elements[1] += i_scalar;
    this.elements[2] += i_scalar;
    return this;
};

dan.math.Vector3.prototype.subs = function (i_scalar)
// Subtract scalar, this -= i_scalar
//
// Params:
//  i_scalar: (float)
//
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] -= i_scalar;
    this.elements[1] -= i_scalar;
    this.elements[2] -= i_scalar;
    return this;
};

dan.math.Vector3.prototype.muls = function (i_scalar)
// Multiply by scalar, this *= i_scalar
//
// Params:
//  i_scalar: (float)
//
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] *= i_scalar;
    this.elements[1] *= i_scalar;
    this.elements[2] *= i_scalar;
    return this;
};

dan.math.Vector3.prototype.divs = function (i_scalar)
// Divide by scalar, this /= i_scalar
//
// Params:
//  i_scalar: (float)
//
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] /= i_scalar;
    this.elements[1] /= i_scalar;
    this.elements[2] /= i_scalar;
    return this;
};

// + + + }}}

// + + + Non-member versions, returning new object {{{

dan.math.Vector3.adds = function (i_vector, i_scalar)
// Add scalar, i_vector + i_scalar
//
// Params:
//  i_vector:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        i_vector[0] + i_scalar,
        i_vector[1] + i_scalar,
        i_vector[2] + i_scalar);
};

dan.math.Vector3.sadd = function (i_scalar, i_vector)
// Add scalar, i_scalar + i_vector
//
// Params:
//  i_scalar:
//   (float)
//  i_vector:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        i_scalar + i_vector[0],
        i_scalar + i_vector[1],
        i_scalar + i_vector[2]);
};

dan.math.Vector3.subs = function (i_vector, i_scalar)
// Subtract scalar, i_vector - i_scalar
//
// Params:
//  i_vector:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        i_vector[0] - i_scalar,
        i_vector[1] - i_scalar,
        i_vector[2] - i_scalar);
};

dan.math.Vector3.ssub = function (i_scalar, i_vector)
// Subtract from scalar, i_scalar - i_vector
//
// Params:
//  i_scalar:
//   (float)
//  i_vector:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        i_scalar - i_vector[0],
        i_scalar - i_vector[1],
        i_scalar - i_vector[2]);
};

dan.math.Vector3.muls = function (i_vector, i_scalar)
// Multiply by scalar, i_vector * i_scalar
//
// Params:
//  i_vector:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        i_vector[0] * i_scalar,
        i_vector[1] * i_scalar,
        i_vector[2] * i_scalar);
};

dan.math.Vector3.smul = function (i_scalar, i_vector)
// Multiply by scalar, i_scalar * i_vector
//
// Params:
//  i_scalar:
//   (float)
//  i_vector:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        i_scalar * i_vector[0],
        i_scalar * i_vector[1],
        i_scalar * i_vector[2]);
};

dan.math.Vector3.divs = function (i_vector, i_scalar)
// Divide by scalar, i_vector / i_scalar
//
// Params:
//  i_vector:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        i_vector[0] / i_scalar,
        i_vector[1] / i_scalar,
        i_vector[2] / i_scalar);
};

dan.math.Vector3.sdiv = function (i_scalar, i_vector)
// Divide into scalar, i_scalar / i_vector
//
// Params:
//  i_scalar:
//   (float)
//  i_vector:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        i_scalar / i_vector[0],
        i_scalar / i_vector[1],
        i_scalar / i_vector[2]);
};

// + + + }}}

// + + }}}

// + }}}

// + Transform {{{

// + + Member versions, modifying 'this' {{{

dan.math.Vector3.prototype.transformByMatrix = function (i_matrix)
// Transform 3D vector with affine 4x4 matrix, this = i_matrix * this
//
// Params:
//  i_matrix:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Vector3)
{
    return this.setFromElements(
        i_matrix.cols[0][0] * this.getX()  +  i_matrix.cols[1][0] * this.getY()  +  i_matrix.cols[2][0] * this.getZ()  +  i_matrix.cols[3][0] * 1.0,
        i_matrix.cols[0][1] * this.getX()  +  i_matrix.cols[1][1] * this.getY()  +  i_matrix.cols[2][1] * this.getZ()  +  i_matrix.cols[3][1] * 1.0,
        i_matrix.cols[0][2] * this.getX()  +  i_matrix.cols[1][2] * this.getY()  +  i_matrix.cols[2][2] * this.getZ()  +  i_matrix.cols[3][2] * 1.0);
};

dan.math.Vector3.prototype.transformByQuaternion = function (i_quaternion)
// Transform 3D vector with quaternion, this = i_quaternion * this
//
// Params:
//  i_quaternion:
//   (dan.math.Quaternion)
//
// Returns:
//  (dan.math.Vector3)
{
    var x = this.elements[0];
    var y = this.elements[1];
    var z = this.elements[2];

    var qw = i_quaternion.w;
    var qx = i_quaternion.x;
    var qy = i_quaternion.y;
    var qz = i_quaternion.z;

    // calculate quat * vector
    var ix = qw * x + qy * z - qz * y;
    var iy = qw * y + qz * x - qx * z;
    var iz = qw * z + qx * y - qy * x;
    var iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

    return this;
};

dan.math.Vector3.prototype.transformByEuler = function ()
// Transform 3D vector with a set of Euler rotations
//
// Params:
//  i_euler:
//   (dan.math.Euler)
//
// Returns:
//  (dan.math.Vector3)
//  this.
{
    var quaternion = new dan.math.Quaternion();

    return function (i_euler)
    {
        this.transformByQuaternion(quaternion.setFromEuler(i_euler));

        return this;
    };
}();

// + + }}}

// + + Non-member versions, returning new object {{{

dan.math.Vector3.transformByMatrix = function (i_matrix, i_vector)
// Transform 3D vector with affine 4x4 matrix, i_matrix * i_vector
//
// Params:
//  i_matrix:
//   (dan.math.Matrix4)
//  i_vector:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        i_matrix.cols[0][0] * i_vector[0]  +  i_matrix.cols[1][0] * i_vector[1]  +  i_matrix.cols[2][0] * i_vector[2]  +  i_matrix.cols[3][0] * 1.0,
        i_matrix.cols[0][1] * i_vector[0]  +  i_matrix.cols[1][1] * i_vector[1]  +  i_matrix.cols[2][1] * i_vector[2]  +  i_matrix.cols[3][1] * 1.0,
        i_matrix.cols[0][2] * i_vector[0]  +  i_matrix.cols[1][2] * i_vector[1]  +  i_matrix.cols[2][2] * i_vector[2]  +  i_matrix.cols[3][2] * 1.0);
};

dan.math.Vector3.transformByQuaternion = function (i_vector3, i_quaternion)
// Transform 3D vector with quaternion, this = i_quaternion * i_vector3
//
// Params:
//  i_vector3:
//   (dan.math.Vector3)
//  i_quaternion:
//   (dan.math.Quaternion)
//
// Returns:
//  (dan.math.Vector3)
{
    return i_vector3.clone().transformByQuaternion(i_quaternion);
};

dan.math.Vector3.transformByEuler = function (i_vector3, i_euler)
// Transform 3D vector with a set of Euler rotations
//
// Params:
//  i_vector3:
//   (dan.math.Vector3)
//  i_euler:
//   (dan.math.Euler)
//
// Returns:
//  (dan.math.Vector3)
{
    return i_vector3.clone().transformByEuler(i_euler);
};

// + + }}}

// + }}}

// + Negate {{{

// + + Member versions, modifying 'this' {{{

dan.math.Vector3.prototype.negate = function ()
// Negation, -this
//
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] = -this.elements[0];
    this.elements[1] = -this.elements[1];
    this.elements[2] = -this.elements[2];
    return this;
};

// + + }}}

// + + Non-member versions, returning new object {{{

dan.math.Vector3.negate = function (i_vector)
// Negation, -i_vector
//
// Params:
//  i_vector:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        -i_vector[0],
        -i_vector[1],
        -i_vector[2]);
};

// + + }}}

// + }}}

// + Comparison operators {{{

dan.math.Vector3.isEqual = function (i_vector1, i_vector2)
// Params:
//  i_vector1:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_vector2:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (boolean)
{
    return i_vector1[0] == i_vector2[0] &&
           i_vector1[1] == i_vector2[1] &&
           i_vector1[2] == i_vector2[2];
};

dan.math.Vector3.isNotEqual = function (i_vector1, i_vector2)
// Params:
//  i_vector1:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_vector2:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (boolean)
{
    return i_vector1[0] != i_vector2[0] ||
           i_vector1[1] != i_vector2[1] ||
           i_vector1[2] != i_vector2[2];
};

// + }}}

// + Length-related information and operations {{{

dan.math.Vector3.prototype.norm = function ()
// Member version.
//
// Returns:
//  (float)
{
    return Math.sqrt(this.elements[0]*this.elements[0] +
                     this.elements[1]*this.elements[1] +
                     this.elements[2]*this.elements[2]);
};

dan.math.Vector3.norm = function (i_vector)
// Non-member version.
//
// Params:
//  i_vector:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (float)
{
    return Math.sqrt(i_vector[0]*i_vector[0] +
                     i_vector[1]*i_vector[1] +
                     i_vector[2]*i_vector[2]);
};

dan.math.Vector3.prototype.normSquared = function ()
// Member version.
//
// Returns:
//  (float)
{
    return this.elements[0]*this.elements[0] +
           this.elements[1]*this.elements[1] +
           this.elements[2]*this.elements[2];
};

dan.math.Vector3.normSquared = function (i_vector)
// Non-member version.
//
// Params:
//  i_vector:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (float)
{
    return i_vector[0]*i_vector[0] +
           i_vector[1]*i_vector[1] +
           i_vector[2]*i_vector[2];
};

dan.math.Vector3.prototype.normalize = function ()
// Member version, modifies 'this'.
//
// Returns:
//  (dan.math.Vector3)
{
    var reciprocalOfLength = 1.0 / this.norm();
    this.elements[0] *= reciprocalOfLength;
    this.elements[1] *= reciprocalOfLength;
    this.elements[2] *= reciprocalOfLength;
    return this;
};

dan.math.Vector3.normalize = function (i_vector)
// Non-member version, doesn't modify input objects.
//
// Params:
//  i_vector:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    var reciprocalOfLength = 1.0 / i_vector.norm();
    return dan.math.Vector3.fromElements(
        i_vector[0] * reciprocalOfLength,
        i_vector[1] * reciprocalOfLength,
        i_vector[2] * reciprocalOfLength);
};

// + }}}

// + Dot and cross product {{{

dan.math.Vector3.prototype.dot = function (i_other)
// Dot product, this . i_other
//
// Member version.
//
// Params:
//  i_other:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (float)
{
    return this.elements[0] * i_other[0] +
           this.elements[1] * i_other[1] +
           this.elements[2] * i_other[2];
};

dan.math.Vector3.dot = function (i_vector1, i_vector2)
// Dot product, i_vector1 . i_vector2
//
// Non-member version.
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_vector2:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (float)
{
    return i_vector1[0] * i_vector2[0] +
           i_vector1[1] * i_vector2[1] +
           i_vector1[2] * i_vector2[2];
};

dan.math.Vector3.prototype.cross = function (i_other)
// Dot product, this x= i_other
//
// Member version, modifies 'this'.
//
// Params:
//  i_other:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    var newX = this.elements[1] * i_other[2] - this.elements[2] * i_other[1];
    var newY = this.elements[2] * i_other[0] - this.elements[0] * i_other[2];
    var newZ = this.elements[0] * i_other[1] - this.elements[1] * i_other[0];

    this.elements[0] = newX;
    this.elements[1] = newY;
    this.elements[2] = newZ;

    return this;
};

dan.math.Vector3.cross = function (i_vector1, i_vector2)
// Cross product, i_vector1 x i_vector2
//
// Non-member version, doesn't modify input objects.
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_vector2:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        i_vector1[1] * i_vector2[2] - i_vector1[2] * i_vector2[1],
        i_vector1[2] * i_vector2[0] - i_vector1[0] * i_vector2[2],
        i_vector1[0] * i_vector2[1] - i_vector1[1] * i_vector2[0]);
};

// + }}}

// + Distance from other vectors {{{

dan.math.Vector3.prototype.squaredDistance = function (i_other)
// Get square of distance between this and another position vector.
//
// Member version.
//
// Params:
//  i_other:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (float)
{
    var dx = this.elements[0] - i_other[0];
    var dy = this.elements[1] - i_other[1];
    var dz = this.elements[2] - i_other[2];

    return dx*dx + dy*dy + dz*dz;
};

dan.math.Vector3.squaredDistance = function (i_vector1, i_vector2)
// Get square of distance between two position vectors.
//
// Non-member version.
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_vector2:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (float)
{
    var dx = i_vector1[0] - i_vector2[0];
    var dy = i_vector1[1] - i_vector2[1];
    var dz = i_vector1[2] - i_vector2[2];

    return dx*dx + dy*dy + dz*dz;
};

dan.math.Vector3.prototype.distance = function (i_other)
// Get distance between this and another position vector.
//
// Member version.
//
// Params:
//  i_other:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (float)
{
    return Math.sqrt(this.squaredDistance(i_other));
};

dan.math.Vector3.distance = function (i_vector1, i_vector2)
// Get distance between two position vectors.
//
// Non-member version.
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_vector2:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (float)
{
    return Math.sqrt(dan.math.Vector3.squaredDistance(i_vector1, i_vector2));
};

// + }}}

// + Miscellaneous operations {{{

// + + Member versions, modifying 'this' {{{

dan.math.Vector3.prototype.mix = function (i_other, i_f)
// Aka 'lerp'
//
// Params:
//  i_other:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_f: (float)
//
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] = this.elements[0] + i_f*(i_other[0] - this.elements[0]);
    this.elements[1] = this.elements[1] + i_f*(i_other[1] - this.elements[1]);
    this.elements[2] = this.elements[2] + i_f*(i_other[2] - this.elements[2]);
    return this;
};

dan.math.Vector3.prototype.clamp = function (i_min, i_max)
// Params:
//  i_min: (float)
//  i_max: (float)
//
// Returns:
//  (dan.math.Vector3)
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
    return this;
};

dan.math.Vector3.prototype.abs = function ()
// Returns:
//  (dan.math.Vector3)
{
    this.elements[0] = Math.abs(this.elements[0]);
    this.elements[1] = Math.abs(this.elements[1]);
    this.elements[2] = Math.abs(this.elements[2]);
    return this;
};

// + + }}}

// + + Non-member versions, returning new object {{{

dan.math.Vector3.mix = function (i_vector1, i_vector2, i_f)
// Aka 'lerp'
//
// Params:
//  i_vector1:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_vector2:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_f:
//   (float)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        i_vector1[0] + i_f*(i_vector2[0] - i_vector1[0]),
        i_vector1[1] + i_f*(i_vector2[1] - i_vector1[1]),
        i_vector1[2] + i_f*(i_vector2[2] - i_vector1[2]));
};

dan.math.Vector3.clamp = function (i_vector, i_min, i_max)
// Params:
//  i_vector:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_min:
//   (float)
//  i_max:
//   (float)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
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
                i_vector[2]);
};

dan.math.Vector3.abs = function (i_vector)
// Params:
//  i_vector:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Vector3)
{
    return dan.math.Vector3.fromElements(
        Math.abs(i_vector[0]),
        Math.abs(i_vector[1]),
        Math.abs(i_vector[2]));
};

// + + }}}

// + }}}

// + Convert to other built-in types {{{

dan.math.Vector3.prototype.toArray = function ()
// Returns:
//  (array)
{
    return Array.apply(null, this.elements);
};

dan.math.Vector3.prototype.toString = function ()
// Returns:
//  (string)
{
    return "(" + this.elements[0].toString() + ", " + this.elements[1].toString() + ", " + this.elements[2].toString() + ")";
};

// + }}}
