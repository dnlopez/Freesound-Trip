
// This namespace
// #require "math.js"


// + Construction {{{

dan.math.Quaternion = function (i_w, i_x, i_y, i_z)
// Params:
//  i_w: (float)
//  i_x: (float)
//  i_y: (float)
//  i_z: (float)
{
    this.w = i_w || 1;
    this.x = i_x || 0;
    this.y = i_y || 0;
    this.z = i_z || 0;
};

// + + Static constructors that wrap functions from "Get/set all components at once" {{{

dan.math.Quaternion.fromElements = function (i_w, i_x, i_y, i_z)
// Params:
//  i_w: (float)
//  i_x: (float)
//  i_y: (float)
//  i_z: (float)
//
// Returns:
//  (dan.math.Quaternion)
{
    return new dan.math.Quaternion().setFromElements(i_w, i_x, i_y, i_z);
}

dan.math.Quaternion.fromArray = function (i_array)
// Params:
//  i_array: (array of float)
//
// Returns:
//  (dan.math.Quaternion)
{
    return new dan.math.Quaternion().setFromArray(i_array);
}

dan.math.Quaternion.fromRealAndImaginary = function (i_real, i_imaginary)
// Params:
//  i_real:
//   (float number)
//  i_imaginary:
//   (dan.math.Vector3)
//
// Returns:
//  (dan.math.Quaternion)
{
    return new dan.math.Quaternion().setFromRealAndImaginary(i_real, i_imaginary);
}

dan.math.Quaternion.fromQuaternion = function (i_other)
// Params:
//  i_other:
//   (dan.math.Quaternion)
//
// Returns:
//  (dan.math.Quaternion)
{
    return new dan.math.Quaternion().setFromQuaternion(i_other);
}

// + + }}}

// + + Static constructors that wrap functions from "Set to represent rotation
//     from other rotation representations" {{{

dan.math.Quaternion.identity = function ()
// Params:
//  Same as for setToIdentity()
//
// Returns:
//  (dan.math.Quaternion)
{
    return new dan.math.Quaternion().setToIdentity();
};

dan.math.Quaternion.xRotation = function (i_angleInRadians)
// Params:
//  Same as for setToXRotation()
//
// Returns:
//  (dan.math.Quaternion)
{
    return new dan.math.Quaternion().setToXRotation(i_angleInRadians);
};

dan.math.Quaternion.yRotation = function (i_angleInRadians)
// Params:
//  Same as for setToYRotation()
//
// Returns:
//  (dan.math.Quaternion)
{
    return new dan.math.Quaternion().setToYRotation(i_angleInRadians);
};

dan.math.Quaternion.zRotation = function (i_angleInRadians)
// Params:
//  Same as for setToZRotation()
//
// Returns:
//  (dan.math.Quaternion)
{
    return new dan.math.Quaternion().setToZRotation(i_angleInRadians);
};

dan.math.Quaternion.axisAngleRotation = function (i_axis, i_angle)
// Params:
//  Same as for setToAxisAngleRotation()
//
// Returns:
//  (dan.math.Quaternion)
{
    return new dan.math.Quaternion().setToAxisAngleRotation(i_axis, i_angle);
};

dan.math.Quaternion.fromEuler = function (i_euler)
// Params:
//  Same as for setFromEuler()
//
// Returns:
//  (dan.math.Quaternion)
{
    return new dan.math.Quaternion().setFromEuler(i_euler);
};

dan.math.Quaternion.fromRotationMatrix = function (i_matrix)
// Params:
//  Same as for setFromRotationMatrix()
//
// Returns:
//  (dan.math.Quaternion)
{
    return new dan.math.Quaternion().setFromRotationMatrix(i_matrix);
};

// + + }}}

dan.math.Quaternion.prototype.clone = function ()
// Returns:
//  (dan.math.Quaternion)
{
    return new dan.math.Quaternion(this.w, this.x, this.y, this.z);
};

// + }}}

// + Get/set all components at once {{{

// (Where the getting/setting is only simple element-wise assignment.
//  For functions that may act on all elements but also interpret or compute the numbers
//  in some way such as for rotations etc, see other sections afterwards.)

dan.math.Quaternion.prototype.setFromElements = function (i_w, i_x, i_y, i_z)
// Params:
//  i_w: (float)
//  i_x: (float)
//  i_y: (float)
//  i_z: (float)
//
// Returns:
//  (dan.math.Quaternion)
{
    this.w = i_w;
    this.x = i_x;
    this.y = i_y;
    this.z = i_z;
    return this;
};

dan.math.Quaternion.prototype.setFromArray = function (i_array)
// Params:
//  i_array: (array of float)
//
// Returns:
//  (dan.math.Quaternion)
{
    this.w = i_array[0];
    this.x = i_array[1];
    this.y = i_array[2];
    this.z = i_array[3];
    return this;
};

dan.math.Quaternion.prototype.setFromRealAndImaginary = function (i_real, i_imaginary)
// Params:
//  i_real:
//   (float number)
//  i_imaginary:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//
// Returns:
//  (dan.math.Quaternion)
{
    this.w = i_real;
    this.x = i_imaginary[0];
    this.y = i_imaginary[1];
    this.z = i_imaginary[2];
    return this;
};

dan.math.Quaternion.prototype.getToArray = function ()
// Returns:
//  (array of float)
{
    return [this.w, this.x, this.y, this.z];
};

dan.math.Quaternion.prototype.setFromQuaternion = function (i_other)
// Params:
//  i_other:
//   (dan.math.Quaternion)
//
// Returns:
//  (dan.math.Quaternion)
{
    this.w = i_other.w;
    this.x = i_other.x;
    this.y = i_other.y;
    this.z = i_other.z;
    return this;
};

// + }}}

// + Set to represent rotation from other rotation representations {{{

dan.math.Quaternion.prototype.setToIdentity = function ()
// Set to the multiplicative identity.
//
// Returns:
//  (dan.math.Quaternion)
{
    this.w = 1;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    return this;
};

dan.math.Quaternion.prototype.setToXRotation = function (i_angleInRadians)
// Set to a value that represents a rotation about the positive X axis.
//
// Params:
//  i_angleInRadians: (float)
//
// Returns:
//  (dan.math.Quaternion)
{
    var halfAngle = i_angle / 2;

    this.w = Math.cos(halfAngle);
    this.x = Math.sin(halfAngle);
    this.y = 0;
    this.z = 0;
    return this;
};

dan.math.Quaternion.prototype.setToYRotation = function (i_angleInRadians)
// Set to a value that represents a rotation about the positive Y axis.
//
// Params:
//  i_angleInRadians: (float)
//
// Returns:
//  (dan.math.Quaternion)
{
    var halfAngle = i_angle / 2;

    this.w = Math.cos(halfAngle);
    this.x = 0;
    this.y = Math.sin(halfAngle);
    this.z = 0;
    return this;
};

dan.math.Quaternion.prototype.setToZRotation = function (i_angleInRadians)
// Set to a value that represents a rotation about the positive Z axis.
//
// Params:
//  i_angleInRadians: (float)
//
// Returns:
//  (dan.math.Quaternion)
{
    var halfAngle = i_angle / 2;

    this.w = Math.cos(halfAngle);
    this.x = 0;
    this.y = 0;
    this.z = Math.sin(halfAngle);
    return this;
};

dan.math.Quaternion.prototype.setToAxisAngleRotation = function (i_axis, i_angle)
// Set to a value that represents a rotation about an arbitrary axis.
//
// See:
//  http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
//  http://www.gamasutra.com/view/feature/131686/rotating_objects_using_quaternions.php
//
// Params:
//  i_axis:
//   (dan.math.Vector3)
//   Must be normalized.
//  i_angle:
//   (float)
//   In radians.
//
// Returns:
//  (dan.math.Quaternion)
{
    var halfAngle = i_angle / 2;

    this.w = Math.cos(halfAngle);

    var sinHalfAngle = Math.sin(halfAngle);
    this.x = i_axis.x * sinHalfAngle;
    this.y = i_axis.y * sinHalfAngle;
    this.z = i_axis.z * sinHalfAngle;

    return this;
};

dan.math.Quaternion.prototype.setFromEuler = function (i_euler)
// Set to a value that represents the end point of a succession of Euler rotations.
//
// Params:
//  i_euler:
//   (Euler)
//
// Returns:
//  (dan.math.Quaternion)
{
    // These formulas can be derived by algebraically multiplying out the standalone
    // X, Y and Z rotation quaternions in each different order.

    var cosHalfX = Math.cos(i_euler.x / 2);
    var cosHalfY = Math.cos(i_euler.y / 2);
    var cosHalfZ = Math.cos(i_euler.z / 2);
    var sinHalfX = Math.sin(i_euler.x / 2);
    var sinHalfY = Math.sin(i_euler.y / 2);
    var sinHalfZ = Math.sin(i_euler.z / 2);

    if (i_euler.order === "XYZ")
    {
        this.w = cosHalfX * cosHalfY * cosHalfZ + sinHalfX * sinHalfY * sinHalfZ;
        this.x = sinHalfX * cosHalfY * cosHalfZ - cosHalfX * sinHalfY * sinHalfZ;
        this.y = cosHalfX * sinHalfY * cosHalfZ + sinHalfX * cosHalfY * sinHalfZ;
        this.z = cosHalfX * cosHalfY * sinHalfZ - sinHalfX * sinHalfY * cosHalfZ;
    }
    else if (i_euler.order === "YZX")
    {
        this.w = cosHalfX * cosHalfY * cosHalfZ + sinHalfX * sinHalfY * sinHalfZ;
        this.x = sinHalfX * cosHalfY * cosHalfZ - cosHalfX * sinHalfY * sinHalfZ;
        this.y = cosHalfX * sinHalfY * cosHalfZ - sinHalfX * cosHalfY * sinHalfZ;
        this.z = cosHalfX * cosHalfY * sinHalfZ + sinHalfX * sinHalfY * cosHalfZ;
    }
    else if (i_euler.order === "ZXY")
    {
        this.w = cosHalfX * cosHalfY * cosHalfZ + sinHalfX * sinHalfY * sinHalfZ;
        this.x = sinHalfX * cosHalfY * cosHalfZ + cosHalfX * sinHalfY * sinHalfZ;
        this.y = cosHalfX * sinHalfY * cosHalfZ - sinHalfX * cosHalfY * sinHalfZ;
        this.z = cosHalfX * cosHalfY * sinHalfZ - sinHalfX * sinHalfY * cosHalfZ;
    }
    else if (i_euler.order === "XZY")
    {
        this.w = cosHalfX * cosHalfY * cosHalfZ - sinHalfX * sinHalfY * sinHalfZ;
        this.x = sinHalfX * cosHalfY * cosHalfZ + cosHalfX * sinHalfY * sinHalfZ;
        this.y = cosHalfX * sinHalfY * cosHalfZ + sinHalfX * cosHalfY * sinHalfZ;
        this.z = cosHalfX * cosHalfY * sinHalfZ - sinHalfX * sinHalfY * cosHalfZ;
    }
    else if (i_euler.order === "YXZ")
    {
        this.w = cosHalfX * cosHalfY * cosHalfZ - sinHalfX * sinHalfY * sinHalfZ;
        this.x = sinHalfX * cosHalfY * cosHalfZ - cosHalfX * sinHalfY * sinHalfZ;
        this.y = cosHalfX * sinHalfY * cosHalfZ + sinHalfX * cosHalfY * sinHalfZ;
        this.z = cosHalfX * cosHalfY * sinHalfZ + sinHalfX * sinHalfY * cosHalfZ;
    }
    else if (i_euler.order === "ZYX")
    {
        this.w = cosHalfX * cosHalfY * cosHalfZ - sinHalfX * sinHalfY * sinHalfZ;
        this.x = sinHalfX * cosHalfY * cosHalfZ + cosHalfX * sinHalfY * sinHalfZ;
        this.y = cosHalfX * sinHalfY * cosHalfZ - sinHalfX * cosHalfY * sinHalfZ;
        this.z = cosHalfX * cosHalfY * sinHalfZ + sinHalfX * sinHalfY * cosHalfZ;
    }

    return this;
};

dan.math.Quaternion.prototype.setFromRotationMatrix = function (i_matrix)
// Set to a value that represents the rotation applied by a matrix.
//
// Params:
//  i_matrix:
//   (dan.math.Matrix3 or dan.math.Matrix4)
//   The upper 3x3 of this must be a pure rotation matrix (ie. orthonormal).
//   Any translation components (4th column in a Matrix4) are ignored.
//
// Returns:
//  (dan.math.Quaternion)
{
    var m11 = i_matrix.cols[0][0], m12 = i_matrix.cols[1][0], m13 = i_matrix.cols[2][0];
    var m21 = i_matrix.cols[0][1], m22 = i_matrix.cols[1][1], m23 = i_matrix.cols[2][1];
    var m31 = i_matrix.cols[0][2], m32 = i_matrix.cols[1][2], m33 = i_matrix.cols[2][2];

    // See:
    //  http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
    // TODO: understand this

    var trace = m11 + m22 + m33;
    if (trace > 0)
    {
        var s = 0.5 / Math.sqrt(trace + 1.0);

        this.w = 0.25 / s;
        this.x = (m32 - m23) * s;
        this.y = (m13 - m31) * s;
        this.z = (m21 - m12) * s;
    }
    else if (m11 > m22 && m11 > m33)
    {
        var s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

        this.w = (m32 - m23) / s;
        this.x = 0.25 * s;
        this.y = (m12 + m21) / s;
        this.z = (m13 + m31) / s;
    }
    else if (m22 > m33)
    {
        var s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

        this.w = (m13 - m31) / s;
        this.x = (m12 + m21) / s;
        this.y = 0.25 * s;
        this.z = (m23 + m32) / s;
    }
    else
    {
        var s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

        this.w = (m21 - m12) / s;
        this.x = (m13 + m31) / s;
        this.y = (m23 + m32) / s;
        this.z = 0.25 * s;
    }

    return this;
};

// + }}}

// + Comparison operators {{{

dan.math.Quaternion.prototype.equals = function (i_other)
// Params:
//  i_other:
//   (dan.math.Quaternion)
//
// Returns:
//  (boolean)
{
    return (i_other.w === this.w) && (i_other.x === this.x) && (i_other.y === this.y) && (i_other.z === this.z);
};

// + }}}

// + Length-related information and operations {{{

dan.math.Quaternion.prototype.norm = function ()
// Returns:
//  (dan.math.Quaternion)
{
    return Math.sqrt(this.w * this.w  +  this.x * this.x  +  this.y * this.y  +  this.z * this.z);
};

dan.math.Quaternion.prototype.normSquared = function ()
// Returns:
//  (dan.math.Quaternion)
{
    return this.w * this.w  +  this.x * this.x  +  this.y * this.y  +  this.z * this.z;
};

dan.math.Quaternion.prototype.normalize = function ()
// Returns:
//  (dan.math.Quaternion)
{
    var l = this.norm();

    if (l === 0)
    {
        this.w = 1;
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    else
    {
        l = 1 / l;

        this.w = this.w * l;
        this.x = this.x * l;
        this.y = this.y * l;
        this.z = this.z * l;
    }

    return this;
};

dan.math.Quaternion.normalize = function (i_q)
// Params:
//  i_q:
//   (dan.math.Quaternion)
//
// Returns:
//  (dan.math.Quaternion)
{
    return dan.math.Quaternion.fromQuaternion(this).normalize();
};

// + }}}

// + Conjugate and inverse {{{

dan.math.Quaternion.prototype.conjugate = function ()
// Returns:
//  (dan.math.Quaternion)
{
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;

    return this;
};

dan.math.Quaternion.conjugate = function (i_q)
// Params:
//  i_q:
//   (dan.math.Quaternion)
//
// Returns:
//  (dan.math.Quaternion)
{
    return new dan.math.Quaternion(this.w, -i_q.x, -i_q.y, -i_q.z);
};

dan.math.Quaternion.prototype.inverse = function ()
// Returns:
//  (dan.math.Quaternion)
{
    this.conjugate().normalize();

    return this;
};

// + }}}

// + Arithmetic operations {{{

// + + With other quaternions {{{

// + + + Member versions, modifying 'this' {{{

dan.math.Quaternion.prototype.add = function (i_right)
// Element-wise addition, this += i_right
//
// Params:
//  i_right: (dan.math.Quaternion)
//
// Returns:
//  (dan.math.Quaternion)
{
    this.w += i_right.w;
    this.x += i_right.x;
    this.y += i_right.y;
    this.z += i_right.z;
    return this;
}

dan.math.Quaternion.prototype.sub = function (i_right)
// Element-wise subtraction, this -= i_right
//
// Params:
//  i_right: (dan.math.Quaternion)
//
// Returns:
//  (dan.math.Quaternion)
{
    this.w -= i_right.w;
    this.x -= i_right.x;
    this.y -= i_right.y;
    this.z -= i_right.z;
    return this;
}

dan.math.Quaternion.prototype.mul = function (i_right)
// Quaternion multiplication, this *= i_right
//
// Params:
//  i_right: (dan.math.Quaternion)
//
// Returns:
//  (dan.math.Quaternion)
{
    var tw = this.w;
    var tx = this.x;
    var ty = this.y;
    var tz = this.z;

    this.w = tw * i_right.w  -  tx * i_right.x  -  ty * i_right.y  -  tz * i_right.z;
    this.x = tx * i_right.w  +  tw * i_right.x  +  ty * i_right.z  -  tz * i_right.y;
    this.y = ty * i_right.w  +  tw * i_right.y  +  tz * i_right.x  -  tx * i_right.z;
    this.z = tz * i_right.w  +  tw * i_right.z  +  tx * i_right.y  -  ty * i_right.x;

    return this;
};

// + + + }}}

// + + + Non-member versions, returning new object {{{

dan.math.Quaternion.add = function (i_q1, i_q2)
// Element-wise addition, i_q1 + i_q2
//
// Params:
//  i_q1: (dan.math.Quaternion)
//  i_q2: (dan.math.Quaternion)
//
// Returns:
//  (dan.math.Quaternion)
{
    return dan.math.Quaternion.fromElements(
        i_q1.w + i_q2.w,
        i_q1.x + i_q2.x,
        i_q1.y + i_q2.y,
        i_q1.z + i_q2.z);
}

dan.math.Quaternion.sub = function (i_q1, i_q2)
// Element-wise subtraction, i_q1 - i_q2
//
// Params:
//  i_q1: (dan.math.Quaternion)
//  i_q2: (dan.math.Quaternion)
//
// Returns:
//  (dan.math.Quaternion)
{
    return dan.math.Quaternion.fromElements(
        i_q1.w - i_q2.w,
        i_q1.x - i_q2.x,
        i_q1.y - i_q2.y,
        i_q1.z - i_q2.z);
}

dan.math.Quaternion.mul = function (i_q1, i_q2)
// Quaternion multiplication, i_q1 * i_q2
//
// Params:
//  i_q1: (dan.math.Quaternion)
//  i_q2: (dan.math.Quaternion)
//
// Returns:
//  (dan.math.Quaternion)
{
    return dan.math.Quaternion.fromElements(
        i_q1.w * i_q2.w  -  i_q1.x * i_q2.x  -  i_q1.y * i_q2.y  -  i_q1.z * i_q2.z,
        i_q1.x * i_q2.w  +  i_q1.w * i_q2.x  +  i_q1.y * i_q2.z  -  i_q1.z * i_q2.y,
        i_q1.y * i_q2.w  +  i_q1.w * i_q2.y  +  i_q1.z * i_q2.x  -  i_q1.x * i_q2.z,
        i_q1.z * i_q2.w  +  i_q1.w * i_q2.z  +  i_q1.x * i_q2.y  -  i_q1.y * i_q2.x);
}

// + + + }}}

// + + }}}

// + + With scalars {{{

// + + + Member versions, modifying 'this' {{{

dan.math.Quaternion.prototype.muls = function (i_scalar)
// Multiply by scalar, this * i_scalar
//
// Params:
//  i_scalar: (float)
//
// Returns:
//  (dan.math.Quaternion)
{
    this.w *= i_scalar;
    this.x *= i_scalar;
    this.y *= i_scalar;
    this.z *= i_scalar;
    return this;
}

// + + + }}}

// + + + Non-member versions, returning new object {{{

dan.math.Quaternion.prototype.muls = function (i_q, i_scalar)
// Multiply by scalar, i_q * i_scalar
//
// Params:
//  i_q: (dan.math.Quaternion)
//  i_scalar: (float)
//
// Returns:
//  (dan.math.Quaternion)
{
    return dan.math.Quaternion.fromElements(
        i_q.w * i_scalar,
        i_q.x * i_scalar,
        i_q.y * i_scalar,
        i_q.z * i_scalar);
}

dan.math.Quaternion.prototype.smul = function (i_scalar, i_q)
// Multiply by scalar, i_scalar * i_q
//
// Params:
//  i_scalar: (float)
//  i_q: (dan.math.Quaternion)
//
// Returns:
//  (dan.math.Quaternion)
{
    return dan.math.Quaternion.fromElements(
        i_scalar * i_q.w,
        i_scalar * i_q.x,
        i_scalar * i_q.y,
        i_scalar * i_q.z);
}

// + + + }}}

// + + }}}

// + }}}

// + Interpolation {{{

dan.math.Quaternion.prototype.slerp = function (qb, t)
{
    var x = this.x,
    y = this.y,
    z = this.z,
    w = this.w;

    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

    var cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;

    if (cosHalfTheta < 0)
    {
        this.w = -qb.w;
        this.x = -qb.x;
        this.y = -qb.y;
        this.z = -qb.z;

        cosHalfTheta = -cosHalfTheta;
    }
    else
    {
        this.setFromQuaternion(qb);
    }

    if (cosHalfTheta >= 1.0)
    {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    var halfTheta = Math.acos(cosHalfTheta);
    var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

    if (Math.abs(sinHalfTheta) < 0.001)
    {
        this.w = 0.5 * (w + this.w);
        this.x = 0.5 * (x + this.x);
        this.y = 0.5 * (y + this.y);
        this.z = 0.5 * (z + this.z);

        return this;
    }

    var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
    ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    this.w = (w * ratioA + this.w * ratioB);
    this.x = (x * ratioA + this.x * ratioB);
    this.y = (y * ratioA + this.y * ratioB);
    this.z = (z * ratioA + this.z * ratioB);

    return this;
};

dan.math.Quaternion.slerp = function (qa, qb, qm, t)
{
    return qm.setFromQuaternion(qa).slerp(qb, t);
}

// + }}}
