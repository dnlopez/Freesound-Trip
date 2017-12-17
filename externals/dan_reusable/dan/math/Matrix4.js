
// This namespace
// #require "math.js"
// #require "Vector4.js"
// //#require "Matrix3.js"  // commented because of include loop - TODO: fix this properly


// + Construction {{{

dan.math.Matrix4 = function ()
// Class representing a 4x4 matrix, ie. 16 numbers,
// where each number is a float.
{
    this.cols = [new dan.math.Vector4(),
                 new dan.math.Vector4(),
                 new dan.math.Vector4(),
                 new dan.math.Vector4()];
    this.c = this.cols;
};

// + + Static constructors that wrap functions from "Get/set all elements at once" {{{

dan.math.Matrix4.fromMatrix4 = function (i_other)
// Params:
//  i_other:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setFromMatrix4(i_other);
};

dan.math.Matrix4.fromColumnMajorComponents = function (
    i_r0c0, i_r1c0, i_r2c0, i_r3c0,
    i_r0c1, i_r1c1, i_r2c1, i_r3c1,
    i_r0c2, i_r1c2, i_r2c2, i_r3c2,
    i_r0c3, i_r1c3, i_r2c3, i_r3c3)
// Params:
//  (all):
//   (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setFromColumnMajorComponents(
        i_r0c0, i_r1c0, i_r2c0, i_r3c0,
        i_r0c1, i_r1c1, i_r2c1, i_r3c1,
        i_r0c2, i_r1c2, i_r2c2, i_r3c2,
        i_r0c3, i_r1c3, i_r2c3, i_r3c3);
};

dan.math.Matrix4.fromRowMajorComponents = function (
    i_r0c0, i_r0c1, i_r0c2, i_r0c3,
    i_r1c0, i_r1c1, i_r1c2, i_r1c3,
    i_r2c0, i_r2c1, i_r2c2, i_r2c3,
    i_r3c0, i_r3c1, i_r3c2, i_r3c3)
// Params:
//  (all):
//   (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setFromRowMajorComponents(
        i_r0c0, i_r0c1, i_r0c2, i_r0c3,
        i_r1c0, i_r1c1, i_r1c2, i_r1c3,
        i_r2c0, i_r2c1, i_r2c2, i_r2c3,
        i_r3c0, i_r3c1, i_r3c2, i_r3c3);
};

dan.math.Matrix4.fromColumnMajorArray = function (i_array)
// ie. an OpenGL-style float array
//
// Params:
//  i_array:
//   (array of float)
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setFromColumnMajorArray(i_array);
};

dan.math.Matrix4.fromRowMajorArray = function (i_array)
// Params:
//  i_array:
//   (array of float)
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setFromRowMajorArray(i_array);
};

dan.math.Matrix4.fromColumnVectors = function (i_column0, i_column1, i_column2, i_column3)
// Params:
//  i_column0, i_column1, i_column2, i_column3:
//   (dan.math.Vector4)
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setFromColumnVectors(i_column0, i_column1, i_column2, i_column3);
};

dan.math.Matrix4.fromRowVectors = function (i_row0, i_row1, i_row2, i_row3)
// Params:
//  i_row0, i_row1, i_row2, i_row3:
//   (dan.math.Vector4)
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setFromRowVectors(i_row0, i_row1, i_row2, i_row3);
};

dan.math.Matrix4.fromMatrix3 = function (i_matrix3)
// w coordinate is set to 1
//
// Params:
//  i_matrix3:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setFromMatrix3(i_matrix3);
};

// + + }}}

// + + Static constructors that wrap functions from "Set to preset matrix types" {{{

dan.math.Matrix4.zeroMatrix = function ()
// Params:
//  Same as for setToZero()
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setToZero();
};

dan.math.Matrix4.constantMatrix = function (i_value)
// Params:
//  Same as for setToConstant()
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setToConstant(i_value);
};

dan.math.Matrix4.identityMatrix = function ()
// Params:
//  Same as for setToIdentity()
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setToIdentity();
};

dan.math.Matrix4.xRotationMatrix = function (i_angleInRadians)
// Params:
//  Same as for setToXRotation()
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setToXRotation(i_angleInRadians);
};

dan.math.Matrix4.yRotationMatrix = function (i_angleInRadians)
// Params:
//  Same as for setToYRotation()
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setToYRotation(i_angleInRadians);
};

dan.math.Matrix4.zRotationMatrix = function (i_angleInRadians)
// Params:
//  Same as for setToZRotation()
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setToZRotation(i_angleInRadians);
};

dan.math.Matrix4.axisAngleRotationMatrix = function (i_axis, i_angleInRadians)
// Params:
//  Same as for setToAxisAngleRotation()
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setToAxisAngleRotation(i_axis, i_angleInRadians);
};

dan.math.Matrix4.fromEuler = function (i_euler)
// Params:
//  Same as for setFromEuler()
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setFromEuler(i_euler);
};

dan.math.Matrix4.fromQuaternion = function (i_quaternion)
// Params:
//  Same as for setFromQuaternion()
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setFromQuaternion(i_quaternion);
};

dan.math.Matrix4.translationMatrix = function (i_xOrVector3, i_y, i_z)
// Params:
//  Same as for setToTranslation()
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setToTranslation(i_xOrVector3, i_y, i_z);
};

dan.math.Matrix4.scaleMatrix = function (i_xOrVector4, i_y, i_z, i_w)
// Params:
//  Same as for setToScale()
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setToScale(i_xOrVector4, i_y, i_z, i_w);
};

dan.math.Matrix4.lookAtMatrix = function (i_cameraPos, i_target, i_cameraUp)
// Params:
//  Same as for setToLookAt()
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setToLookAt(i_cameraPos, i_target, i_cameraUp);
};

dan.math.Matrix4.frustumMatrix = function (i_left, i_right, i_bottom, i_top, i_near, i_far)
// Params:
//  Same as for setToFrustum()
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setToFrustum(i_left, i_right, i_bottom, i_top, i_near, i_far);
};

dan.math.Matrix4.perspectiveMatrix = function (i_fovYInDegrees, i_aspect, i_near, i_far)
// Params:
//  Same as for setToPerspective()
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setToPerspective(i_fovYInDegrees, i_aspect, i_near, i_far);
};

dan.math.Matrix4.orthoMatrix = function (i_left, i_right, i_bottom, i_top, i_near, i_far)
// Params:
//  Same as for setToOrtho()
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setToOrtho(i_left, i_right, i_bottom, i_top, i_near, i_far);
};

// + + }}}

dan.math.Matrix4.prototype.clone = function ()
// Params:
//  -
//
// Returns:
//  (dan.math.Matrix4)
{
    return new dan.math.Matrix4().setFromMatrix4(this);
};

// + }}}

// + Get/set all elements at once {{{

// (Where the getting/setting is only simple element-wise assignment.
//  For functions that may act on all elements but also interpret or compute the numbers
//  in some way such as for rotations etc, see other sections afterwards.)

dan.math.Matrix4.prototype.setFromMatrix4 = function (i_other)
// Params:
//  i_other:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Matrix4)
{
    this.cols[0].setFromVector4(i_other.cols[0]);
    this.cols[1].setFromVector4(i_other.cols[1]);
    this.cols[2].setFromVector4(i_other.cols[2]);
    this.cols[3].setFromVector4(i_other.cols[3]);
    return this;
};

dan.math.Matrix4.prototype.setFromColumnMajorComponents = function (
    i_r0c0, i_r1c0, i_r2c0, i_r3c0,
    i_r0c1, i_r1c1, i_r2c1, i_r3c1,
    i_r0c2, i_r1c2, i_r2c2, i_r3c2,
    i_r0c3, i_r1c3, i_r2c3, i_r3c3)
// Params:
//  (all):
//   (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    this.cols[0][0] = i_r0c0;
    this.cols[0][1] = i_r1c0;
    this.cols[0][2] = i_r2c0;
    this.cols[0][3] = i_r3c0;
    this.cols[1][0] = i_r0c1;
    this.cols[1][1] = i_r1c1;
    this.cols[1][2] = i_r2c1;
    this.cols[1][3] = i_r3c1;
    this.cols[2][0] = i_r0c2;
    this.cols[2][1] = i_r1c2;
    this.cols[2][2] = i_r2c2;
    this.cols[2][3] = i_r3c2;
    this.cols[3][0] = i_r0c3;
    this.cols[3][1] = i_r1c3;
    this.cols[3][2] = i_r2c3;
    this.cols[3][3] = i_r3c3;
    return this;
};

dan.math.Matrix4.prototype.setFromRowMajorComponents = function (
    i_r0c0, i_r0c1, i_r0c2, i_r0c3,
    i_r1c0, i_r1c1, i_r1c2, i_r1c3,
    i_r2c0, i_r2c1, i_r2c2, i_r2c3,
    i_r3c0, i_r3c1, i_r3c2, i_r3c3)
// Params:
//  (all):
//   (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    this.cols[0][0] = i_r0c0;
    this.cols[0][1] = i_r1c0;
    this.cols[0][2] = i_r2c0;
    this.cols[0][3] = i_r3c0;
    this.cols[1][0] = i_r0c1;
    this.cols[1][1] = i_r1c1;
    this.cols[1][2] = i_r2c1;
    this.cols[1][3] = i_r3c1;
    this.cols[2][0] = i_r0c2;
    this.cols[2][1] = i_r1c2;
    this.cols[2][2] = i_r2c2;
    this.cols[2][3] = i_r3c2;
    this.cols[3][0] = i_r0c3;
    this.cols[3][1] = i_r1c3;
    this.cols[3][2] = i_r2c3;
    this.cols[3][3] = i_r3c3;
    return this;
};

dan.math.Matrix4.prototype.setFromColumnMajorArray = function (i_array)
// ie. an OpenGL-style float array
//
// Params:
//  i_array:
//   (array of float)
//
// Returns:
//  (dan.math.Matrix4)
{
    this.cols[0][0] = i_array[0];
    this.cols[0][1] = i_array[1];
    this.cols[0][2] = i_array[2];
    this.cols[0][3] = i_array[3];
    this.cols[1][0] = i_array[4];
    this.cols[1][1] = i_array[5];
    this.cols[1][2] = i_array[6];
    this.cols[1][3] = i_array[7];
    this.cols[2][0] = i_array[8];
    this.cols[2][1] = i_array[9];
    this.cols[2][2] = i_array[10];
    this.cols[2][3] = i_array[11];
    this.cols[3][0] = i_array[12];
    this.cols[3][1] = i_array[13];
    this.cols[3][2] = i_array[14];
    this.cols[3][3] = i_array[15];
    return this;
};

dan.math.Matrix4.prototype.getToColumnMajorArray = function (o_array)
// ie. an OpenGL-style float array
//
// Returns:
//  o_array:
//   (array of float)
{
    o_array[0] = this.cols[0][0];
    o_array[1] = this.cols[0][1];
    o_array[2] = this.cols[0][2];
    o_array[3] = this.cols[0][3];
    o_array[4] = this.cols[1][0];
    o_array[5] = this.cols[1][1];
    o_array[6] = this.cols[1][2];
    o_array[7] = this.cols[1][3];
    o_array[8] = this.cols[2][0];
    o_array[9] = this.cols[2][1];
    o_array[10] = this.cols[2][2];
    o_array[11] = this.cols[2][3];
    o_array[12] = this.cols[3][0];
    o_array[13] = this.cols[3][1];
    o_array[14] = this.cols[3][2];
    o_array[15] = this.cols[3][3];
};

dan.math.Matrix4.prototype.toColumnMajorArray = function ()
// ie. an OpenGL-style float array
//
// Returns:
//  (array of float)
{
    return [
        this.cols[0][0],
        this.cols[0][1],
        this.cols[0][2],
        this.cols[0][3],
        this.cols[1][0],
        this.cols[1][1],
        this.cols[1][2],
        this.cols[1][3],
        this.cols[2][0],
        this.cols[2][1],
        this.cols[2][2],
        this.cols[2][3],
        this.cols[3][0],
        this.cols[3][1],
        this.cols[3][2],
        this.cols[3][3]];
};

dan.math.Matrix4.prototype.setFromRowMajorArray = function (i_array)
// Params:
//  i_array:
//   (array of float)
//
// Returns:
//  (dan.math.Matrix4)
{
    this.cols[0][0] = i_array[0];
    this.cols[1][0] = i_array[1];
    this.cols[2][0] = i_array[2];
    this.cols[3][0] = i_array[3];
    this.cols[0][1] = i_array[4];
    this.cols[1][1] = i_array[5];
    this.cols[2][1] = i_array[6];
    this.cols[3][1] = i_array[7];
    this.cols[0][2] = i_array[8];
    this.cols[1][2] = i_array[9];
    this.cols[2][2] = i_array[10];
    this.cols[3][2] = i_array[11];
    this.cols[0][3] = i_array[12];
    this.cols[1][3] = i_array[13];
    this.cols[2][3] = i_array[14];
    this.cols[3][3] = i_array[15];
    return this;
};

dan.math.Matrix4.prototype.getToRowMajorArray = function (o_array)
// Returns:
//  o_array:
//   (array of float)
{
    o_array[0] = this.cols[0][0];
    o_array[1] = this.cols[1][0];
    o_array[2] = this.cols[2][0];
    o_array[3] = this.cols[3][0];
    o_array[4] = this.cols[0][1];
    o_array[5] = this.cols[1][1];
    o_array[6] = this.cols[2][1];
    o_array[7] = this.cols[3][1];
    o_array[8] = this.cols[0][2];
    o_array[9] = this.cols[1][2];
    o_array[10] = this.cols[2][2];
    o_array[11] = this.cols[3][2];
    o_array[12] = this.cols[0][3];
    o_array[13] = this.cols[1][3];
    o_array[14] = this.cols[2][3];
    o_array[15] = this.cols[3][3];
};

dan.math.Matrix4.prototype.toRowMajorArray = function ()
// Returns:
//  (array of float)
{
    return [
        this.cols[0][0],
        this.cols[1][0],
        this.cols[2][0],
        this.cols[3][0],
        this.cols[0][1],
        this.cols[1][1],
        this.cols[2][1],
        this.cols[3][1],
        this.cols[0][2],
        this.cols[1][2],
        this.cols[2][2],
        this.cols[3][2],
        this.cols[0][3],
        this.cols[1][3],
        this.cols[2][3],
        this.cols[3][3]];
};

dan.math.Matrix4.prototype.setFromColumnVectors = function (i_column0, i_column1, i_column2, i_column3)
// Params:
//  i_column0, i_column1, i_column2, i_column3:
//   (dan.math.Vector4)
//
// Returns:
//  (dan.math.Matrix4)
{
    this.cols[0].setFromVector4(i_column0);
    this.cols[1].setFromVector4(i_column1);
    this.cols[2].setFromVector4(i_column2);
    this.cols[3].setFromVector4(i_column3);
    return this;
};

dan.math.Matrix4.prototype.getToColumnVectors = function (o_column0, o_column1, o_column2, o_column3)
// Returns:
//  o_column0, o_column1, o_column2, o_column3:
//   (dan.math.Vector4)
{
    o_column0.setFromVector4(cols[0]);
    o_column1.setFromVector4(cols[1]);
    o_column2.setFromVector4(cols[2]);
    o_column3.setFromVector4(cols[3]);
};

dan.math.Matrix4.prototype.setFromRowVectors = function (i_row0, i_row1, i_row2, i_row3)
// Params:
//  i_row0, i_row1, i_row2, i_row3:
//   (dan.math.Vector4)
//
// Returns:
//  (dan.math.Matrix4)
{
    this.cols[0][0] = i_row0[0];
    this.cols[0][1] = i_row1[0];
    this.cols[0][2] = i_row2[0];
    this.cols[0][3] = i_row3[0];
    this.cols[1][0] = i_row0[1];
    this.cols[1][1] = i_row1[1];
    this.cols[1][2] = i_row2[1];
    this.cols[1][3] = i_row3[1];
    this.cols[2][0] = i_row0[2];
    this.cols[2][1] = i_row1[2];
    this.cols[2][2] = i_row2[2];
    this.cols[2][3] = i_row3[2];
    this.cols[3][0] = i_row0[3];
    this.cols[3][1] = i_row1[3];
    this.cols[3][2] = i_row2[3];
    this.cols[3][3] = i_row3[3];
    return this;
};

dan.math.Matrix4.prototype.getToRowVectors = function (o_row0, o_row1, o_row2, o_row3)
// Returns:
//  o_row0, o_row1, o_row2, o_row3:
//   (dan.math.Vector4)
{
    o_row0[0] = this.cols[0][0];
    o_row1[0] = this.cols[0][1];
    o_row2[0] = this.cols[0][2];
    o_row3[0] = this.cols[0][3];
    o_row0[1] = this.cols[1][0];
    o_row1[1] = this.cols[1][1];
    o_row2[1] = this.cols[1][2];
    o_row3[1] = this.cols[1][3];
    o_row0[2] = this.cols[2][0];
    o_row1[2] = this.cols[2][1];
    o_row2[2] = this.cols[2][2];
    o_row3[2] = this.cols[2][3];
    o_row0[3] = this.cols[3][0];
    o_row1[3] = this.cols[3][1];
    o_row2[3] = this.cols[3][2];
    o_row3[3] = this.cols[3][3];
};

dan.math.Matrix4.prototype.setFromMatrix3 = function (i_matrix3)
// w coordinate is set to 1
//
// Params:
//  i_matrix3:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix4)
{
    this.cols[0].setFromElements(i_matrix3.cols[0][0], i_matrix3.cols[0][1], i_matrix3.cols[0][2], 0);
    this.cols[1].setFromElements(i_matrix3.cols[1][0], i_matrix3.cols[1][1], i_matrix3.cols[1][2], 0);
    this.cols[2].setFromElements(i_matrix3.cols[2][0], i_matrix3.cols[2][1], i_matrix3.cols[2][2], 0);
    this.cols[3].setFromElements(0, 0, 0, 1);
    return this;
};

// + }}}

// + Set to preset matrix types {{{

dan.math.Matrix4.prototype.setToZero = function ()
// Completely overwrite this matrix to make every cell zero.
//
// Returns:
//  (dan.math.Matrix4)
{
    return this.setToConstant(0);
};

dan.math.Matrix4.prototype.setToConstant = function (i_value)
// Completely overwrite this matrix to make every cell the same number.
//
// Params:
//  i_constant:
//   (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    this.cols[0].setFromConstant(i_value);
    this.cols[1].setFromConstant(i_value);
    this.cols[2].setFromConstant(i_value);
    this.cols[3].setFromConstant(i_value);
    return this;
};

dan.math.Matrix4.prototype.setToIdentity = function ()
// Completely overwrite this matrix to make it an identity matrix.
//
// Returns:
//  (dan.math.Matrix4)
{
    this.cols[0].setFromElements(1.0, 0.0, 0.0, 0.0);
    this.cols[1].setFromElements(0.0, 1.0, 0.0, 0.0);
    this.cols[2].setFromElements(0.0, 0.0, 1.0, 0.0);
    this.cols[3].setFromElements(0.0, 0.0, 0.0, 1.0);
    return this;
};

dan.math.Matrix4.prototype.setToXRotation = function (i_angleInRadians)
// Completely overwrite this matrix to make it a rotation matrix
// that rotates about the positive X axis.
//
// Params:
//  i_angleInRadians:
//   (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    var sinA = Math.sin(i_angleInRadians);
    var cosA = Math.cos(i_angleInRadians);

    this.cols[0].setFromElements(1.0, 0.0,   0.0,  0.0);
    this.cols[1].setFromElements(0.0, cosA,  sinA, 0.0);
    this.cols[2].setFromElements(0.0, -sinA, cosA, 0.0);
    this.cols[3].setFromElements(0.0, 0.0,   0.0,  1.0);

    return this;
};

dan.math.Matrix4.prototype.setToYRotation = function (i_angleInRadians)
// Completely overwrite this matrix to make it a rotation matrix
// that rotates about the positive Y axis.
//
// Params:
//  i_angleInRadians:
//   (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    var sinA = Math.sin(i_angleInRadians);
    var cosA = Math.cos(i_angleInRadians);

    this.cols[0].setFromElements(cosA, 0.0, -sinA, 0.0);
    this.cols[1].setFromElements(0.0,  1.0, 0.0,   0.0);
    this.cols[2].setFromElements(sinA, 0.0, cosA,  0.0);
    this.cols[3].setFromElements(0.0,  0.0, 0.0,   1.0);

    return this;
};

dan.math.Matrix4.prototype.setToZRotation = function (i_angleInRadians)
// Completely overwrite this matrix to make it a rotation matrix
// that rotates about the positive Z axis.
//
// Params:
//  i_angleInRadians:
//   (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    var sinA = Math.sin(i_angleInRadians);
    var cosA = Math.cos(i_angleInRadians);

    this.cols[0].setFromElements(cosA,  sinA, 0.0, 0.0);
    this.cols[1].setFromElements(-sinA, cosA, 0.0, 0.0);
    this.cols[2].setFromElements(0.0,   0.0,  1.0, 0.0);
    this.cols[3].setFromElements(0.0,   0.0,  0.0, 1.0);

    return this;
};

dan.math.Matrix4.prototype.setToAxisAngleRotation = function (i_axis, i_angleInRadians)
// Completely overwrite this matrix to make it a rotation matrix
// that rotates about an arbitrary axis.
//
// Params:
//  i_axis:
//   Either (dan.math.Vector3)
//   or (array of 3 floats)
//  i_angleInRadians:
//   (float)
//
// Returns:
//  (dan.math.Matrix4)
//
// Derivation:
//  From
//   "Visualizing Quaternions", "6. Fundamentals of Rotations", "6.2. Quaternions and 3D Rotations", "6.2.1. Construction", where
//    Book's "s", "c" <-> below's "sinA", "cosA"
//    Book's "n1", "n2", "n3" <-> below's "x", "y", "z"
//   http://paulbourke.net/geometry/rotate/
//  Summary
//   Compose matrices that
//    rotate about the x axis then about the y axis to line the arbitrary axis up with the z axis
//    rotate about the z axis
//    do the inverse of the first two rotations
//
// Another derivation:
//  From
//   "3D Math Primer for Graphics and Game Development", "8.2.3. 3D Rotation about an Arbitrary Axis"
//  Summary
//   Find components of vector being rotated that are parallel and perpendicular to arbitary axis
//   Rotate perpendicular component only and add back to parallel component
//   Apply above to x, y and z basis vectors to get columns for a matrix
{
    var sinA = Math.sin(i_angleInRadians);
    var cosA = Math.cos(i_angleInRadians);
    var oneMinusCosA = 1.0 - cosA;

    var normalizedAxis = dan.math.Vector3.normalize(i_axis);
    var x = normalizedAxis[0];
    var y = normalizedAxis[1];
    var z = normalizedAxis[2];
    var xSq = x * x;
    var ySq = y * y;
    var zSq = z * z;

    //        c  r
    this.cols[0][0] = (oneMinusCosA * xSq) + (cosA);
    this.cols[1][0] = (oneMinusCosA * x * y) - (sinA * z);
    this.cols[2][0] = (oneMinusCosA * x * z) + (sinA * y);
    this.cols[3][0] = 0.0;

    this.cols[0][1] = (oneMinusCosA * x * y) + (sinA * z);
    this.cols[1][1] = (oneMinusCosA * ySq) + (cosA);
    this.cols[2][1] = (oneMinusCosA * y * z) - (sinA * x);
    this.cols[3][1] = 0.0;

    this.cols[0][2] = (oneMinusCosA * x * z) - (sinA * y);
    this.cols[1][2] = (oneMinusCosA * y * z) + (sinA * x);
    this.cols[2][2] = (oneMinusCosA * zSq) + (cosA);
    this.cols[3][2] = 0.0;

    this.cols[0][3] = 0.0;
    this.cols[1][3] = 0.0;
    this.cols[2][3] = 0.0;
    this.cols[3][3] = 1.0;

    return this;
};

dan.math.Matrix4.prototype.setFromEuler = function (i_euler)
// Completely overwrite this matrix to make it a rotation matrix
// that has the same effect as a succession of Euler rotations.
//
// Params:
//  i_euler:
//   (dan.math.Euler)
//
// Returns:
//  (dan.math.Matrix4)
{
    var cosX = Math.cos(i_euler.x);
    var sinX = Math.sin(i_euler.x);
    var cosY = Math.cos(i_euler.y);
    var sinY = Math.sin(i_euler.y);
    var cosZ = Math.cos(i_euler.z);
    var sinZ = Math.sin(i_euler.z);

    // These cell formulas can be derived by algebraically multiplying out the standalone
    // X, Y and Z rotation matrices in each different order.

    if (i_euler.order === "ZYX")
    {
        var cosX_x_cosZ = cosX * cosZ;
        var cosX_x_sinZ = cosX * sinZ;
        var sinX_x_cosZ = sinX * cosZ;
        var sinX_x_sinZ = sinX * sinZ;

        // row 1
        this.cols[0][0] = cosY * cosZ;
        this.cols[1][0] = -cosY * sinZ;
        this.cols[2][0] = sinY;
        // row 2
        this.cols[0][1] = cosX_x_sinZ + sinX_x_cosZ * sinY;
        this.cols[1][1] = cosX_x_cosZ - sinX_x_sinZ * sinY;
        this.cols[2][1] = -sinX * cosY;
        // row 3
        this.cols[0][2] = sinX_x_sinZ - cosX_x_cosZ * sinY;
        this.cols[1][2] = sinX_x_cosZ + cosX_x_sinZ * sinY;
        this.cols[2][2] = cosX * cosY;
    }
    else if (i_euler.order === "ZXY")
    {
        var cosY_x_cosZ = cosY * cosZ;
        var cosY_x_sinZ = cosY * sinZ;
        var sinY_x_cosZ = sinY * cosZ;
        var sinY_x_sinZ = sinY * sinZ;

        // row 1
        this.cols[0][0] = cosY_x_cosZ + sinY_x_sinZ * sinX;
        this.cols[1][0] = sinY_x_cosZ * sinX - cosY_x_sinZ;
        this.cols[2][0] = cosX * sinY;
        // row 2
        this.cols[0][1] = cosX * sinZ;
        this.cols[1][1] = cosX * cosZ;
        this.cols[2][1] = -sinX;
        // row 3
        this.cols[0][2] = cosY_x_sinZ * sinX - sinY_x_cosZ;
        this.cols[1][2] = sinY_x_sinZ + cosY_x_cosZ * sinX;
        this.cols[2][2] = cosX * cosY;
    }
    else if (i_euler.order === "YXZ")
    {
        var cosY_x_cosZ = cosY * cosZ;
        var cosY_x_sinZ = cosY * sinZ;
        var sinY_x_cosZ = sinY * cosZ;
        var sinY_x_sinZ = sinY * sinZ;

        // row 1
        this.cols[0][0] = cosY_x_cosZ - sinY_x_sinZ * sinX;
        this.cols[1][0] = -cosX * sinZ;
        this.cols[2][0] = sinY_x_cosZ + cosY_x_sinZ * sinX;
        // row 2
        this.cols[0][1] = cosY_x_sinZ + sinY_x_cosZ * sinX;
        this.cols[1][1] = cosX * cosZ;
        this.cols[2][1] = sinY_x_sinZ - cosY_x_cosZ * sinX;
        // row 3
        this.cols[0][2] = -cosX * sinY;
        this.cols[1][2] = sinX;
        this.cols[2][2] = cosX * cosY;
    }
    else if (i_euler.order === "XYZ")
    {
        var cosX_x_cosZ = cosX * cosZ;
        var cosX_x_sinZ = cosX * sinZ;
        var sinX_x_cosZ = sinX * cosZ;
        var sinX_x_sinZ = sinX * sinZ;

        // row 1
        this.cols[0][0] = cosY * cosZ;
        this.cols[1][0] = sinX_x_cosZ * sinY - cosX_x_sinZ;
        this.cols[2][0] = cosX_x_cosZ * sinY + sinX_x_sinZ;
        // row 2
        this.cols[0][1] = cosY * sinZ;
        this.cols[1][1] = sinX_x_sinZ * sinY + cosX_x_cosZ;
        this.cols[2][1] = cosX_x_sinZ * sinY - sinX_x_cosZ;
        // row 3
        this.cols[0][2] = -sinY;
        this.cols[1][2] = sinX * cosY;
        this.cols[2][2] = cosX * cosY;
    }
    else if (i_euler.order === "XZY")
    {
        var cosX_x_cosY = cosX * cosY;
        var cosX_x_sinY = cosX * sinY;
        var sinX_x_cosY = sinX * cosY;
        var sinX_x_sinY = sinX * sinY;

        // row 1
        this.cols[0][0] = cosY * cosZ;
        this.cols[1][0] = sinX_x_sinY - cosX_x_cosY * sinZ;
        this.cols[2][0] = sinX_x_cosY * sinZ + cosX_x_sinY;
        // row 2
        this.cols[0][1] = sinZ;
        this.cols[1][1] = cosX * cosZ;
        this.cols[2][1] = -sinX * cosZ;
        // row 3
        this.cols[0][2] = -sinY * cosZ;
        this.cols[1][2] = cosX_x_sinY * sinZ + sinX_x_cosY;
        this.cols[2][2] = cosX_x_cosY - sinX_x_sinY * sinZ;
    }
    else if (i_euler.order === "YZX")
    {
        var cosX_x_cosY = cosX * cosY;
        var cosX_x_sinY = cosX * sinY;
        var sinX_x_cosY = sinX * cosY;
        var sinX_x_sinY = sinX * sinY;

        // row 1
        this.cols[0][0] = cosY * cosZ;
        this.cols[1][0] = -sinZ;
        this.cols[2][0] = sinY * cosZ;
        // row 2
        this.cols[0][1] = cosX_x_cosY * sinZ + sinX_x_sinY;
        this.cols[1][1] = cosX * cosZ;
        this.cols[2][1] = cosX_x_sinY * sinZ - sinX_x_cosY;
        // row 3
        this.cols[0][2] = sinX_x_cosY * sinZ - cosX_x_sinY;
        this.cols[1][2] = sinX * cosZ;
        this.cols[2][2] = sinX_x_sinY * sinZ + cosX_x_cosY;
    }

    // row 4
    this.cols[0][3] = 0;
    this.cols[1][3] = 0;
    this.cols[2][3] = 0;

    // column 4
    this.cols[3][0] = 0;
    this.cols[3][1] = 0;
    this.cols[3][2] = 0;
    this.cols[3][3] = 1;

    return this;
};

dan.math.Matrix4.prototype.setFromQuaternion = function (i_quaternion)
// Completely overwrite this matrix to make it a rotation matrix.
// that carries out the same rotation as a quaternion.
//
// [Code copied from Three.js
//  TODO find derivation
//  TODO better comments]
//
// Params:
//  i_quaternion:
//   (dan.math.Quaternion)
//
// Returns:
//  (dan.math.Matrix4)
{
    var x = i_quaternion.x, y = i_quaternion.y, z = i_quaternion.z, w = i_quaternion.w;

    var _2x = x + x;
    var _2y = y + y;
    var _2z = z + z;

    var _2xx = _2x * x;
    var _2xy = _2y * x;
    var _2xz = _2z * x;
    var _2yy = _2y * y;
    var _2yz = _2z * y;
    var _2zz = _2z * z;
    var _2wx = _2x * w;
    var _2wy = _2y * w;
    var _2wz = _2z * w;

    // row 1
    this.cols[0][0] = 1 - (_2yy + _2zz);
    this.cols[1][0] = _2xy - _2wz;
    this.cols[2][0] = _2xz + _2wy;
    // row 2
    this.cols[0][1] = _2xy + _2wz;
    this.cols[1][1] = 1 - (_2xx + _2zz);
    this.cols[2][1] = _2yz - _2wx;
    // row 3
    this.cols[0][2] = _2xz - _2wy;
    this.cols[1][2] = _2yz + _2wx;
    this.cols[2][2] = 1 - (_2xx + _2yy);

    // row 4
    this.cols[0][3] = 0;
    this.cols[1][3] = 0;
    this.cols[2][3] = 0;

    // column 4
    this.cols[3][0] = 0;
    this.cols[3][1] = 0;
    this.cols[3][2] = 0;
    this.cols[3][3] = 1;

    return this;
};

dan.math.Matrix4.prototype.setToTranslation = function (i_xOrVector3, i_y, i_z)
// Completely overwrite this matrix to make it an affine translation matrix
// for 3D vectors in homogenous 4-component form.
//
// Mode 1:
//  Params:
//   i_xOrVector3:
//    Either (dan.math.Vector3)
//    or (array of 3 floats)
//   i_y, i_z: Ignored.
//
// Mode 2:
//  Params:
//   i_xOrVector3:
//    (float)
//   i_y:
//    (float)
//   i_z:
//    (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    if (i_xOrVector3 instanceof dan.math.Vector3 || i_xOrVector3 instanceof Array)
    {
        this.cols[0].setFromElements(1.0, 0.0, 0.0, 0.0);
        this.cols[1].setFromElements(0.0, 1.0, 0.0, 0.0);
        this.cols[2].setFromElements(0.0, 0.0, 1.0, 0.0);
        this.cols[3].setFromElements(i_xOrVector3[0], i_xOrVector3[1], i_xOrVector3[2], 1.0);
    }
    else
    {
        this.cols[0].setFromElements(1.0, 0.0, 0.0, 0.0);
        this.cols[1].setFromElements(0.0, 1.0, 0.0, 0.0);
        this.cols[2].setFromElements(0.0, 0.0, 1.0, 0.0);
        this.cols[3].setFromElements(i_xOrVector3, i_y, i_z, 1.0);
    }
    return this;
};

dan.math.Matrix4.prototype.setToScale = function (i_xOrVector4, i_y, i_z, i_w)
// Completely overwrite this matrix to make it a scaling matrix.
//
// Mode 1:
//  Params:
//   i_xOrVector4:
//    Either (dan.math.Vector4)
//    or (array of 4 floats)
//   i_y, i_z, i_w: Ignored.
//
// Mode 2:
//  Params:
//   i_xOrVector4:
//    (float)
//   i_y:
//    (float)
//   i_z:
//    (float)
//   i_w:
//    (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    if (i_xOrVector4 instanceof dan.math.Vector4 || i_xOrVector4 instanceof Array)
    {
        this.cols[0].setFromElements(i_xOrVector4[0], 0.0, 0.0, 0.0);
        this.cols[1].setFromElements(0.0, i_xOrVector4[1], 0.0, 0.0);
        this.cols[2].setFromElements(0.0, 0.0, i_xOrVector4[2], 0.0);
        this.cols[3].setFromElements(0.0, 0.0, 0.0, i_xOrVector4[3]);
    }
    else
    {
        this.cols[0].setFromElements(i_xOrVector4, 0.0, 0.0, 0.0);
        this.cols[1].setFromElements(0.0, i_y, 0.0, 0.0);
        this.cols[2].setFromElements(0.0, 0.0, i_z, 0.0);
        this.cols[3].setFromElements(0.0, 0.0, 0.0, i_w);
    }
    return this;
};

dan.math.Matrix4.prototype.setToLookAt = function (i_cameraPos, i_target, i_cameraUp)
// Completely overwrite this matrix to make it
// a matrix which will translate the point i_cameraPos to the origin,
// and rotate so that i_target lies along the -z axis
//
// Equivalent to GLU's gluLookAt(),
// which is said to perform a modelview transformation
// in taking world coordinates -> eye coordinates.
//
// cameraPos and target determine yaw and pitch
// up vector determines roll
//
// Params:
//  i_cameraPos:
//   (dan.math.Vector3)
//  i_target:
//   (dan.math.Vector3)
//  i_cameraUp:
//   (dan.math.Vector3)
//
// Returns:
//  (dan.math.Matrix4)
{
    // Calculate forward vector as eye to target
    // locking in the yaw and pitch
    var f = dan.math.Vector3.normalize( dan.math.Vector3.sub(i_target, i_cameraPos) );
    // Calculate side vector as perpendicular to forward and up,
    // locking in the roll
    var s = dan.math.Vector3.normalize( dan.math.Vector3.cross(f, dan.math.Vector3.normalize(i_cameraUp)) );
    // Use cross product to recalculate up vector
    // in case it wasn't 90 degrees from the forward vector to begin with
    var u = dan.math.Vector3.normalize( dan.math.Vector3.cross(s, f) );

    // Put s in 1st row of matrix,
    // thus resulting matrix will project input x coordinate on s
    this.cols[0][0] = s.getX();
    this.cols[1][0] = s.getY();
    this.cols[2][0] = s.getZ();
    this.cols[3][0] = 0.0;

    // Put u in 2nd row of matrix,
    // thus resulting matrix will project input y coordinate on u
    this.cols[0][1] = u.getX();
    this.cols[1][1] = u.getY();
    this.cols[2][1] = u.getZ();
    this.cols[3][1] = 0.0;

    // Put -f in 3rd row of matrix,
    // thus resulting matrix will project input z coordinate on -f
    this.cols[0][2] = -f.getX();
    this.cols[1][2] = -f.getY();
    this.cols[2][2] = -f.getZ();
    this.cols[3][2] = 0.0;

    this.cols[0][3] = 0.0;
    this.cols[1][3] = 0.0;
    this.cols[2][3] = 0.0;
    this.cols[3][3] = 1.0;

    this.mul(dan.math.Matrix4.translationMatrix(-i_cameraPos.x, -i_cameraPos.y, -i_cameraPos.z));

    return this;
};

dan.math.Matrix4.prototype.setToFrustum = function (i_left, i_right, i_bottom, i_top, i_near, i_far)
// Completely overwrite this matrix to make it
// a matrix which will project onto the near plane of a frustum of a pyramid,
// giving a perspective view.
//
// Equivalent to GL's glFrustum(),
// which is said to perform a projection transformation
// in taking eye coordinates -> clip coordinates.
//
// Params:
//  i_left, i_right, i_bottom, i_top:
//   (float)
//   x and y extents of the near clipping plane.
//  i_near, i_far:
//   (float)
//   Distances between the viewpoint and the clipping planes along the negative z axis.
//   Should always be positive.
//
// Returns:
//  (dan.math.Matrix4)
{
    var width = i_right - i_left;
    var height = i_top - i_bottom;
    var depth = i_far - i_near;

    this.cols[0][0] = (2*i_near) / width;
    this.cols[0][1] = 0.0;
    this.cols[0][2] = 0.0;
    this.cols[0][3] = 0.0;

    this.cols[1][0] = 0.0;
    this.cols[1][1] = (2*i_near) / height;
    this.cols[1][2] = 0.0;
    this.cols[1][3] = 0.0;

    this.cols[2][0] = (i_right + i_left) / width;
    this.cols[2][1] = (i_top + i_bottom) / height;
    this.cols[2][2] = -(i_far + i_near) / depth;
    this.cols[2][3] = -1.0;

    this.cols[3][0] = 0.0;
    this.cols[3][1] = 0.0;
    this.cols[3][2] = -(2*i_far*i_near) / depth;
    this.cols[3][3] = 0.0;

    return this;
};

dan.math.Matrix4.prototype.setToPerspective = function (i_fovYInDegrees, i_aspect, i_near, i_far)
// Completely overwrite this matrix to make it
// a matrix which will project onto the near plane of a frustum of a pyramid,
// giving a perspective view.
//
// Equivalent to GLU's gluPerspective(),
// which is said to perform a projection transformation
// in taking eye coordinates -> clip coordinates.
//
// Params:
//  i_fovYInDegrees:
//   (float)
//   Angle of the field of view in the yz plane in degrees.
//   Must be in range [0.0, 180.0].
//  i_aspect:
//   (float)
//   Width of frustum divided by height of frustum.
//  i_near, i_far:
//   (float)
//   Distances between the viewpoint and the clipping planes along the negative z axis.
//   Should always be positive.
//
// Returns:
//  (dan.math.Matrix4)
{
    var angle = i_fovYInDegrees / 2.0;
    angle = dan.math.Matrix4.degToRad(angle);

    var cot = Math.cos(angle) / Math.sin(angle);

    this.cols[0][0] = cot / i_aspect;
    this.cols[0][1] = 0.0;
    this.cols[0][2] = 0.0;
    this.cols[0][3] = 0.0;

    this.cols[1][0] = 0.0;
    this.cols[1][1] = cot;
    this.cols[1][2] = 0.0;
    this.cols[1][3] = 0.0;

    this.cols[2][0] = 0.0;
    this.cols[2][1] = 0.0;
    this.cols[2][2] = -(i_far + i_near) / (i_far - i_near); //-1
    this.cols[2][3] = -1.0;


    this.cols[3][0] = 0.0;
    this.cols[3][1] = 0.0;
    this.cols[3][2] = -(2*i_far*i_near) / (i_far - i_near);//-2*near;
    this.cols[3][3] = 0.0;

    return this;
};

dan.math.Matrix4.prototype.setToOrtho = function (i_left, i_right, i_bottom, i_top, i_near, i_far)
// Completely overwrite this matrix to make it
// a matrix which will project onto the near plane of a box,
// giving an orthographic view.
//
// Equivalent to GL's glOrtho(),
// which is said to perform a projection transformation
// in taking eye coordinates -> clip coordinates.
//
// Params:
//  i_left, i_right, i_bottom, i_top:
//   (float)
//   x and y extents of the near (and far) clipping plane.
//  i_near, i_far:
//   (float)
//   Distances between the viewpoint and the clipping planes along the negative z axis.
//   Should always be positive.
//
// Returns:
//  (dan.math.Matrix4)
{
    var width = i_right - i_left;
    var height = i_top - i_bottom;
    var depth = i_far - i_near;

    this.cols[0][0] = 2.0 / width;
    this.cols[0][1] = 0.0;
    this.cols[0][2] = 0.0;
    this.cols[0][3] = 0.0;

    this.cols[1][0] = 0.0;
    this.cols[1][1] = 2.0 / height;
    this.cols[1][2] = 0.0;
    this.cols[1][3] = 0.0;

    this.cols[2][0] = 0.0;
    this.cols[2][1] = 0.0;
    this.cols[2][2] = -(2.0) / depth;
    this.cols[2][3] = 0.0;

    this.cols[3][0] = -(i_right + i_left) / width;
    this.cols[3][1] = -(i_top + i_bottom) / height;
    this.cols[3][2] = -(i_far + i_near) / depth;
    this.cols[3][3] = 1.0;

    return this;
};

// + }}}

// + Arithmetic operations {{{

// + + With other matrices {{{

// + + + Member versions, modifying 'this' {{{

dan.math.Matrix4.prototype.add = function (i_right)
// Element-wise addition, this = this + i_right
//
// Params:
//  i_right:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Matrix4)
{
    this.cols[0].add(i_right.cols[0]);
    this.cols[1].add(i_right.cols[1]);
    this.cols[2].add(i_right.cols[2]);
    this.cols[3].add(i_right.cols[3]);
    return this;
};

dan.math.Matrix4.prototype.sub = function (i_right)
// Element-wise subtraction, this = this - i_right
//
// Params:
//  i_right:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Matrix4)
{
    this.cols[0].sub(i_right.cols[0]);
    this.cols[1].sub(i_right.cols[1]);
    this.cols[2].sub(i_right.cols[2]);
    this.cols[3].sub(i_right.cols[3]);
    return this;
};

dan.math.Matrix4.prototype.mul = function (i_right)
// Matrix multiplication, this = this * i_right
//
// Params:
//  i_right:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Matrix4)
{
    var left = this.clone();
    for (var r = 0; r < 4; ++r)
    {
        for (var c = 0; c < 4; ++c)
        {
            // 'this' matrix's row dotted with i_right matrix's column
            var total = 0;
            total += (left.cols[0][r] * i_right.cols[c][0]);
            total += (left.cols[1][r] * i_right.cols[c][1]);
            total += (left.cols[2][r] * i_right.cols[c][2]);
            total += (left.cols[3][r] * i_right.cols[c][3]);

            this.cols[c][r] = total;
        }
    }

    return this;
};

dan.math.Matrix4.prototype.lmul = function (i_left)
// Matrix multiplication, this = i_left * this
//
// Params:
//  i_left:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Matrix4)
{
    var right = this.clone();
    for (var r = 0; r < 4; ++r)
    {
        for (var c = 0; c < 4; ++c)
        {
            // i_left matrix's row dotted with 'this' matrix's column
            var total = 0;
            total += (i_left.cols[0][r] * right.cols[c][0]);
            total += (i_left.cols[1][r] * right.cols[c][1]);
            total += (i_left.cols[2][r] * right.cols[c][2]);
            total += (i_left.cols[3][r] * right.cols[c][3]);

            this.cols[c][r] = total;
        }
    }

    return this;
};

// + + + }}}

// + + + Non-member versions, returning new object {{{

dan.math.Matrix4.add = function (i_matrix1, i_matrix2)
// Element-wise addition, i_matrix1 + i_matrix2
//
// Params:
//  i_matrix1:
//   (dan.math.Matrix4)
//  i_matrix2:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Matrix4)
{
    return i_matrix1.clone().add(i_matrix2);
};

dan.math.Matrix4.sub = function (i_matrix1, i_matrix2)
// Element-wise subtraction, i_matrix1 - i_matrix2
//
// Params:
//  i_matrix1:
//   (dan.math.Matrix4)
//  i_matrix2:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Matrix4)
{
    return i_matrix1.clone().sub(i_matrix2);
};

dan.math.Matrix4.mul = function (i_matrix1, i_matrix2)
// Matrix multiplication, i_matrix1 * i_matrix2
//
// Params:
//  i_matrix1:
//   (dan.math.Matrix4)
//  i_matrix2:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Matrix4)
{
    return i_matrix1.clone().mul(i_matrix2);
};

// + + + }}}

// + + }}}

// + + With scalars {{{

// + + + Member versions, modifying 'this' {{{

dan.math.Matrix4.prototype.adds = function (i_scalar)
// Add scalar, this += i_scalar
//
// Params:
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    this.cols[0].adds(i_scalar);
    this.cols[1].adds(i_scalar);
    this.cols[2].adds(i_scalar);
    this.cols[3].adds(i_scalar);
    return this;
};

dan.math.Matrix4.prototype.subs = function (i_scalar)
// Subtract scalar, this -= i_scalar
//
// Params:
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    this.cols[0].subs(i_scalar);
    this.cols[1].subs(i_scalar);
    this.cols[2].subs(i_scalar);
    this.cols[3].subs(i_scalar);
    return this;
};

dan.math.Matrix4.prototype.muls = function (i_scalar)
// Multiplication by scalar, this *= i_scalar
//
// Params:
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    this.cols[0].muls(i_scalar);
    this.cols[1].muls(i_scalar);
    this.cols[2].muls(i_scalar);
    this.cols[3].muls(i_scalar);
    return this;
};

// + + + }}}

// + + + Non-member versions, returning new object {{{

dan.math.Matrix4.adds = function (i_matrix, i_scalar)
// Add scalar, i_matrix + i_scalar
//
// Params:
//  i_matrix:
//   (dan.math.Matrix4)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    return i_matrix.clone().adds(i_scalar);
};

dan.math.Matrix4.sadd = function (i_scalar, i_matrix)
// Add scalar, i_scalar + i_matrix
//
// Params:
//  i_scalar:
//   (float)
//  i_matrix:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Matrix4)
{
    return dan.math.Matrix4.fromColumnVectors(
        dan.math.Vector4.sadd(i_scalar, i_matrix.cols[0]),
        dan.math.Vector4.sadd(i_scalar, i_matrix.cols[1]),
        dan.math.Vector4.sadd(i_scalar, i_matrix.cols[2]),
        dan.math.Vector4.sadd(i_scalar, i_matrix.cols[3]));
};

dan.math.Matrix4.subs = function (i_matrix, i_scalar)
// Subtract scalar, i_matrix - i_scalar
//
// Params:
//  i_matrix:
//   (dan.math.Matrix4)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    return i_matrix.clone().subs(i_scalar);
};

dan.math.Matrix4.ssub = function (i_scalar, i_matrix)
// Subtract from scalar, i_scalar - i_matrix
//
// Params:
//  i_scalar:
//   (float)
//  i_matrix:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Matrix4)
{
    return dan.math.Matrix4.fromColumnVectors(
        dan.math.Vector4.ssub(i_scalar, i_matrix.cols[0]),
        dan.math.Vector4.ssub(i_scalar, i_matrix.cols[1]),
        dan.math.Vector4.ssub(i_scalar, i_matrix.cols[2]),
        dan.math.Vector4.ssub(i_scalar, i_matrix.cols[3]));
};

dan.math.Matrix4.muls = function (i_matrix, i_scalar)
// Multiplication by scalar, i_matrix * i_scalar
//
// Params:
//  i_matrix:
//   (dan.math.Matrix4)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Matrix4)
{
    return i_matrix.clone().muls(i_scalar);
};

dan.math.Matrix4.smul = function (i_scalar, i_matrix)
// Multiplication by scalar, i_scalar * i_matrix
//
// Params:
//  i_scalar:
//   (float)
//  i_matrix:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Matrix4)
{
    return dan.math.Matrix4.fromColumnVectors(
        dan.math.Vector4.smul(i_scalar, i_matrix.cols[0]),
        dan.math.Vector4.smul(i_scalar, i_matrix.cols[1]),
        dan.math.Vector4.smul(i_scalar, i_matrix.cols[2]),
        dan.math.Vector4.smul(i_scalar, i_matrix.cols[3]));
};

// + + + }}}

// + + }}}

// + }}}

// + Comparison operators {{{

dan.math.Matrix4.isEqual = function (i_matrix1, i_matrix2)
// Params:
//  i_matrix1:
//   (dan.math.Matrix4)
//  i_matrix2:
//   (dan.math.Matrix4)
//
// Returns:
//  (boolean)
{
    return (dan.math.Vector4.isEqual(i_matrix1.cols[0], i_matrix2.cols[0]) &&
            dan.math.Vector4.isEqual(i_matrix1.cols[1], i_matrix2.cols[1]) &&
            dan.math.Vector4.isEqual(i_matrix1.cols[2], i_matrix2.cols[2]) &&
            dan.math.Vector4.isEqual(i_matrix1.cols[3], i_matrix2.cols[3]));
};

dan.math.Matrix4.isNotEqual = function (i_matrix1, i_matrix2)
// Params:
//  i_matrix1:
//   (dan.math.Matrix4)
//  i_matrix2:
//   (dan.math.Matrix4)
//
// Returns:
//  (boolean)
{
    return (dan.math.Vector4.isNotEqual(i_matrix1.cols[0], i_matrix2.cols[0]) ||
            dan.math.Vector4.isNotEqual(i_matrix1.cols[1], i_matrix2.cols[1]) ||
            dan.math.Vector4.isNotEqual(i_matrix1.cols[2], i_matrix2.cols[2]) ||
            dan.math.Vector4.isNotEqual(i_matrix1.cols[3], i_matrix2.cols[3]));
};

// + }}}

// + Matrix-specific operations {{{

// + + Member versions, modifying 'this' {{{

dan.math.Matrix4.prototype.transpose = function ()
// Returns:
//  (dan.math.Matrix4)
{
    for (var colNo = 0; colNo < 4; ++colNo)
    {
        // Exchange values below/right of diagonal
        for (var rowNo = colNo+1; rowNo < 4; ++rowNo)
        {
            var tmp = this.cols[colNo][rowNo];
            this.cols[colNo][rowNo] = this.cols[rowNo][colNo];
            this.cols[rowNo][colNo] = tmp;
        }
    }
    return this;
};

dan.math.Matrix4.prototype.invert = function ()
// Returns:
//  (dan.math.Matrix4)
{
    this.setFromMatrix4(dan.math.Matrix4.invert(this));
    return this;
};

// + + }}}

// + + Non-member versions, returning new object {{{

dan.math.Matrix4.transpose = function (i_matrix)
// Params:
//  i_matrix:
//  (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Matrix4)
{
    var rv = new dan.math.Matrix4();

    for (var colNo = 0; colNo < 4; ++colNo)
    {
        // Copy value on diagonal
        rv.cols[colNo][colNo] = i_matrix.cols[colNo][colNo];

        // Copy/exchange values below/right of diagonal
        for (var rowNo = colNo+1; rowNo < 4; ++rowNo)
        {
            rv.cols[colNo][rowNo] = i_matrix.cols[rowNo][colNo];
            rv.cols[rowNo][colNo] = i_matrix.cols[colNo][rowNo];
        }
    }

    return rv;
};

dan.math.Matrix4.invert = function (i_matrix)
// Params:
//  i_matrix:
//  (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Matrix4)
{
    var a = i_matrix.clone();
    var b = dan.math.Matrix4.identityMatrix();

    var tmp;

    // Go through columns
    for (var c = 0; c < 4; ++c)
    {
        // For the entries in the column from the one that is on the diagonal to the last one,
        // find which has the maximum absolute value, getting its row number in rowMax
        var rowMax = c;
        for (var r = c + 1; r < 4; ++r)
        {
            if (Math.abs(a.cols[c][r]) > Math.abs(a.cols[c][rowMax]))
            {
                rowMax = r;
            }
        }

        // If the value of the entry is 0, we can't invert. Return identity.
        if (a.cols[rowMax][c] == 0.0)
            return dan.math.Matrix4.identityMatrix();

        // Swap row "rowMax" with row "c"
        for (var cc = 0; cc < 4; ++cc)
        {
            tmp = a.cols[cc][c];
            a.cols[cc][c] = a.cols[cc][rowMax];
            a.cols[cc][rowMax] = tmp;
            tmp = b.cols[cc][c];
            b.cols[cc][c] = b.cols[cc][rowMax];
            b.cols[cc][rowMax] = tmp;
        }

        // Now everything we do is on row "c".
        // Set the max cell to 1 by dividing the entire row by that value
        tmp = a.cols[c][c];
        for (var cc = 0; cc < 4; ++cc)
        {
            a.cols[cc][c] /= tmp;
            b.cols[cc][c] /= tmp;
        }

        // Now do the other rows, so that this column only has a 1 and 0's
        for (var rowNo = 0; rowNo < 4; ++rowNo)
        {
            if (rowNo != c)
            {
                tmp = a.cols[c][rowNo];
                for (var cc = 0; cc < 4; ++cc)
                {
                    a.cols[cc][rowNo] -= a.cols[cc][c] * tmp;
                    b.cols[cc][rowNo] -= b.cols[cc][c] * tmp;
                }
            }
        }
    }

    return b;
};

// + + }}}

// + }}}

// + Utilities {{{

dan.math.Matrix4.degToRad = function (a) { return a * 0.01745329252; }
//function radToDeg(a) { return a * 57.29577951; }

// + }}}
