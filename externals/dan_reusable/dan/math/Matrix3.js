
// This namespace
// #require "math.js"
// #require "Vector3.js"


//function degToRad(a) { return a * 0.01745329252; }
//function radToDeg(a) { return a * 57.29577951; }


// + Construction {{{

dan.math.Matrix3 = function ()
// Class representing a 3x3 matrix, ie. 9 numbers,
// where each number is a float.
{
    this.cols = [new dan.math.Vector3(),
                 new dan.math.Vector3(),
                 new dan.math.Vector3()];
    this.c = this.cols;
};

// + + Static constructors that wrap functions from "Get/set all elements at once" {{{

dan.math.Matrix3.fromMatrix3 = function (i_other)
// Params:
//  i_other:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setFromMatrix3(i_other);
};

dan.math.Matrix3.fromColumnMajorComponents = function (
    i_r0c0, i_r1c0, i_r2c0,
    i_r0c1, i_r1c1, i_r2c1,
    i_r0c2, i_r1c2, i_r2c2)
// Params:
//  (all):
//   (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setFromColumnMajorComponents(
        i_r0c0, i_r1c0, i_r2c0,
        i_r0c1, i_r1c1, i_r2c1,
        i_r0c2, i_r1c2, i_r2c2);
};

dan.math.Matrix3.fromRowMajorComponents = function (
    i_r0c0, i_r0c1, i_r0c2,
    i_r1c0, i_r1c1, i_r1c2,
    i_r2c0, i_r2c1, i_r2c2)
// Params:
//  (all):
//   (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setFromRowMajorComponents(
        i_r0c0, i_r0c1, i_r0c2,
        i_r1c0, i_r1c1, i_r1c2,
        i_r2c0, i_r2c1, i_r2c2);
};

dan.math.Matrix3.fromColumnMajorArray = function (i_array)
// ie. an OpenGL-style float array
//
// Params:
//  i_array:
//   (array of float)
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setFromColumnMajorArray(i_array);
};

dan.math.Matrix3.fromRowMajorArray = function (i_array)
// Params:
//  i_array:
//   (array of float)
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setFromRowMajorArray(i_array);
};

dan.math.Matrix3.fromColumnVectors = function (i_column0, i_column1, i_column2)
// Params:
//  i_column0, i_column1, i_column2:
//   (dan.math.Vector3)
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setFromColumnVectors(i_column0, i_column1, i_column2);
};

dan.math.Matrix3.fromRowVectors = function (i_row0, i_row1, i_row2)
// Params:
//  i_row0, i_row1, i_row2:
//   (dan.math.Vector3)
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setFromRowVectors(i_row0, i_row1, i_row2);
};

/*
dan.math.Matrix3.fromMatrix2 = function (i_matrix2)
// z coordinate is set to 1
//
// Params:
//  i_matrix2:
//   (dan.math.Matrix2)
//
// Returns:
//  (dan.math.Matrix2)
{
    return new dan.math.Matrix3().setFromMatrix2(i_matrix2);
};
*/

// + + }}}

// + + Static constructors that wrap functions from "Set to preset matrix types" {{{

dan.math.Matrix3.zeroMatrix = function ()
// Params:
//  Same as for setToZero()
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setToZero();
};

dan.math.Matrix3.constantMatrix = function (i_value)
// Params:
//  Same as for setToConstant()
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setToConstant(i_value);
};

dan.math.Matrix3.identityMatrix = function ()
// Params:
//  Same as for setToIdentity()
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setToIdentity();
};

dan.math.Matrix3.xRotationMatrix = function (i_angleInRadians)
// Params:
//  Same as for setToXRotation()
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setToXRotation(i_angleInRadians);
};

dan.math.Matrix3.yRotationMatrix = function (i_angleInRadians)
// Params:
//  Same as for setToYRotation()
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setToYRotation(i_angleInRadians);
};

dan.math.Matrix3.zRotationMatrix = function (i_angleInRadians)
// Params:
//  Same as for setToZRotation()
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setToZRotation(i_angleInRadians);
};

dan.math.Matrix3.translationMatrix = function (i_xOrVector2, i_y)
// Params:
//  Same as for setToTranslation()
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setToTranslation(i_xOrVector2, i_y);
};

dan.math.Matrix3.scaleMatrix = function (i_xOrVector3, i_y, i_z)
// Params:
//  Same as for setToScale()
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setToScale(i_xOrVector3, i_y, i_z);
};

dan.math.Matrix3.tsrtMatrix = function (i_preTranslation, i_scale, i_rotation, i_postTranslation)
// Params:
//  Same as for setToTSRT()
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setToTSRT(i_preTranslation, i_scale, i_rotation, i_postTranslation);
};

// + + }}}

dan.math.Matrix3.prototype.clone = function (i_other)
// Params:
//  i_other:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix3)
{
    return new dan.math.Matrix3().setFromMatrix3(this);
};

// + }}}

// + Get/set all elements at once {{{

// (Where the getting/setting is only simple element-wise assignment.
//  For functions that may act on all elements but also interpret or compute the numbers
//  in some way such as for rotations etc, see other sections afterwards.)

dan.math.Matrix3.prototype.setFromMatrix3 = function (i_other)
// Params:
//  i_other:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix3)
{
    this.cols[0].setFromVector3(i_other.cols[0]);
    this.cols[1].setFromVector3(i_other.cols[1]);
    this.cols[2].setFromVector3(i_other.cols[2]);
    return this;
};

dan.math.Matrix3.prototype.setFromColumnMajorComponents = function (
    i_r0c0, i_r1c0, i_r2c0,
    i_r0c1, i_r1c1, i_r2c1,
    i_r0c2, i_r1c2, i_r2c2)
// Params:
//  (all):
//   (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    this.cols[0][0] = i_r0c0;
    this.cols[0][1] = i_r1c0;
    this.cols[0][2] = i_r2c0;
    this.cols[1][0] = i_r0c1;
    this.cols[1][1] = i_r1c1;
    this.cols[1][2] = i_r2c1;
    this.cols[2][0] = i_r0c2;
    this.cols[2][1] = i_r1c2;
    this.cols[2][2] = i_r2c2;
    return this;
};

dan.math.Matrix3.prototype.setFromRowMajorComponents = function (
    i_r0c0, i_r0c1, i_r0c2,
    i_r1c0, i_r1c1, i_r1c2,
    i_r2c0, i_r2c1, i_r2c2)
// Params:
//  (all):
//   (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    this.cols[0][0] = i_r0c0;
    this.cols[0][1] = i_r1c0;
    this.cols[0][2] = i_r2c0;
    this.cols[1][0] = i_r0c1;
    this.cols[1][1] = i_r1c1;
    this.cols[1][2] = i_r2c1;
    this.cols[2][0] = i_r0c2;
    this.cols[2][1] = i_r1c2;
    this.cols[2][2] = i_r2c2;
    return this;
};

dan.math.Matrix3.prototype.setFromColumnMajorArray = function (i_array)
// ie. an OpenGL-style float array
//
// Params:
//  i_array:
//   (array of float)
//
// Returns:
//  (dan.math.Matrix3)
{
    this.cols[0][0] = i_array[0];
    this.cols[0][1] = i_array[1];
    this.cols[0][2] = i_array[2];
    this.cols[1][0] = i_array[3];
    this.cols[1][1] = i_array[4];
    this.cols[1][2] = i_array[5];
    this.cols[2][0] = i_array[6];
    this.cols[2][1] = i_array[7];
    this.cols[2][2] = i_array[8];
    return this;
};

dan.math.Matrix3.prototype.getToColumnMajorArray = function (o_array)
// ie. an OpenGL-style float array
//
// Returns:
//  o_array:
//   (array of float)
{
    o_array[0] = this.cols[0][0];
    o_array[1] = this.cols[0][1];
    o_array[2] = this.cols[0][2];
    o_array[3] = this.cols[1][0];
    o_array[4] = this.cols[1][1];
    o_array[5] = this.cols[1][2];
    o_array[6] = this.cols[2][0];
    o_array[7] = this.cols[2][1];
    o_array[8] = this.cols[2][2];
};

dan.math.Matrix3.prototype.toColumnMajorArray = function ()
// ie. an OpenGL-style float array
//
// Returns:
//  (array of float)
{
    return [
        this.cols[0][0],
        this.cols[0][1],
        this.cols[0][2],
        this.cols[1][0],
        this.cols[1][1],
        this.cols[1][2],
        this.cols[2][0],
        this.cols[2][1],
        this.cols[2][2]];
};

dan.math.Matrix3.prototype.setFromRowMajorArray = function (i_array)
// Params:
//  i_array:
//   (array of float)
//
// Returns:
//  (dan.math.Matrix3)
{
    this.cols[0][0] = i_array[0];
    this.cols[1][0] = i_array[1];
    this.cols[2][0] = i_array[2];
    this.cols[0][1] = i_array[3];
    this.cols[1][1] = i_array[4];
    this.cols[2][1] = i_array[5];
    this.cols[0][2] = i_array[6];
    this.cols[1][2] = i_array[7];
    this.cols[2][2] = i_array[8];
    return this;
};

dan.math.Matrix3.prototype.getToRowMajorArray = function (o_array)
// Returns:
//  o_array:
//   (array of float)
{
    o_array[0] = this.cols[0][0];
    o_array[1] = this.cols[1][0];
    o_array[2] = this.cols[2][0];
    o_array[3] = this.cols[0][1];
    o_array[4] = this.cols[1][1];
    o_array[5] = this.cols[2][1];
    o_array[6] = this.cols[0][2];
    o_array[7] = this.cols[1][2];
    o_array[8] = this.cols[2][2];
};

dan.math.Matrix3.prototype.setFromColumnVectors = function (i_column0, i_column1, i_column2)
// Params:
//  i_column0, i_column1, i_column2:
//   (dan.math.Vector3)
//
// Returns:
//  (dan.math.Matrix3)
{
    this.cols[0].setFromVector3(i_column0);
    this.cols[1].setFromVector3(i_column1);
    this.cols[2].setFromVector3(i_column2);
    return this;
};

dan.math.Matrix3.prototype.getToColumnVectors = function (o_column0, o_column1, o_column2)
// Returns:
//  o_column0, o_column1, o_column2:
//   (dan.math.Vector3)
{
    o_column0.setFromVector3(cols[0]);
    o_column1.setFromVector3(cols[1]);
    o_column2.setFromVector3(cols[2]);
};

dan.math.Matrix3.prototype.setFromRowVectors = function (i_row0, i_row1, i_row2)
// Params:
//  i_row0, i_row1, i_row2:
//   (dan.math.Vector3)
//
// Returns:
//  (dan.math.Matrix3)
{
    this.cols[0][0] = i_row0[0];
    this.cols[0][1] = i_row1[0];
    this.cols[0][2] = i_row2[0];
    this.cols[1][0] = i_row0[1];
    this.cols[1][1] = i_row1[1];
    this.cols[1][2] = i_row2[1];
    this.cols[2][0] = i_row0[2];
    this.cols[2][1] = i_row1[2];
    this.cols[2][2] = i_row2[2];
    return this;
};

dan.math.Matrix3.prototype.getToRowVectors = function (o_row0, o_row1, o_row2)
// Returns:
//  o_row0, o_row1, o_row2:
//   (dan.math.Vector3)
{
    o_row0[0] = this.cols[0][0];
    o_row1[0] = this.cols[0][1];
    o_row2[0] = this.cols[0][2];
    o_row0[1] = this.cols[1][0];
    o_row1[1] = this.cols[1][1];
    o_row2[1] = this.cols[1][2];
    o_row0[2] = this.cols[2][0];
    o_row1[2] = this.cols[2][1];
    o_row2[2] = this.cols[2][2];
};

/*
dan.math.Matrix3.prototype.setFromMatrix2 = function (i_matrix2)
// z coordinate is set to 1
//
// Params:
//  i_matrix2:
//   (dan.math.Matrix2)
//
// Returns:
//  (dan.math.Matrix3)
{
    this.cols[0].setFromElements(i_matrix2.cols[0][0], i_matrix2.cols[0][1], 0);
    this.cols[1].setFromElements(i_matrix2.cols[1][0], i_matrix2.cols[1][1], 0);
    this.cols[2].setFromElements(0, 0, 1);
    return this;
};
*/

// + }}}

// + Set to preset matrix types {{{

dan.math.Matrix3.prototype.setToZero = function ()
// Completely overwrite this matrix to make every cell zero.
//
// Returns:
//  (dan.math.Matrix3)
{
    return this.setToConstant(0);
};

dan.math.Matrix3.prototype.setToConstant = function (i_value)
// Completely overwrite this matrix to make every cell the same number.
//
// Params:
//  i_constant: (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    this.cols[0].setFromConstant(i_value);
    this.cols[1].setFromConstant(i_value);
    this.cols[2].setFromConstant(i_value);
    return this;
};

dan.math.Matrix3.prototype.setToIdentity = function ()
// Completely overwrite this matrix to make it an identity matrix.
//
// Returns:
//  (dan.math.Matrix3)
{
    this.cols[0].setFromElements(1.0, 0.0, 0.0);
    this.cols[1].setFromElements(0.0, 1.0, 0.0);
    this.cols[2].setFromElements(0.0, 0.0, 1.0);
    return this;
};

dan.math.Matrix3.prototype.setToXRotation = function (i_angleInRadians)
// Completely overwrite this matrix to make it a rotation matrix
// that rotates about the positive X axis.
//
// Params:
//  i_angleInRadians: (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    var sinA = Math.sin(i_angleInRadians);
    var cosA = Math.cos(i_angleInRadians);

    this.cols[0].setFromElements(1.0, 0.0,   0.0 );
    this.cols[1].setFromElements(0.0, cosA,  sinA);
    this.cols[2].setFromElements(0.0, -sinA, cosA);

    return this;
};

dan.math.Matrix3.prototype.setToYRotation = function (i_angleInRadians)
// Completely overwrite this matrix to make it a rotation matrix
// that rotates about the positive Y axis.
//
// Params:
//  i_angleInRadians: (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    var sinA = Math.sin(i_angleInRadians);
    var cosA = Math.cos(i_angleInRadians);

    this.cols[0].setFromElements(cosA, 0.0, -sinA);
    this.cols[1].setFromElements(0.0,  1.0, 0.0  );
    this.cols[2].setFromElements(sinA, 0.0, cosA );

    return this;
};

dan.math.Matrix3.prototype.setToZRotation = function (i_angleInRadians)
// Completely overwrite this matrix to make it a rotation matrix
// that rotates about the positive Z axis.
//
// Params:
//  i_angleInRadians: (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    var sinA = Math.sin(i_angleInRadians);
    var cosA = Math.cos(i_angleInRadians);

    this.cols[0].setFromElements(cosA,  sinA, 0.0);
    this.cols[1].setFromElements(-sinA, cosA, 0.0);
    this.cols[2].setFromElements(0.0,   0.0,  1.0);

    return this;
};

dan.math.Matrix3.prototype.setToTranslation = function (i_xOrVector2, i_y)
// Completely overwrite this matrix to make it an affine translation matrix
// for 2D vectors in homogenous 3-component form.
//
// Mode 1:
//  Params:
//   i_xOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_y: Ignored.
//
// Mode 2:
//  Params:
//   i_xOrVector2: (float)
//   i_y: (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    if (i_xOrVector2 instanceof dan.math.Vector2 || i_xOrVector2 instanceof Array)
    {
        this.cols[0].setFromElements(1.0, 0.0, 0.0);
        this.cols[1].setFromElements(0.0, 1.0, 0.0);
        this.cols[2].setFromElements(i_xOrVector2[0], i_xOrVector2[1], 1.0);
    }
    else
    {
        this.cols[0].setFromElements(1.0, 0.0, 0.0);
        this.cols[1].setFromElements(0.0, 1.0, 0.0);
        this.cols[2].setFromElements(i_xOrVector2, i_y, 1.0);
    }
    return this;
};

dan.math.Matrix3.prototype.setToScale = function (i_xOrVector3, i_y, i_z)
// Completely overwrite this matrix to make it a scaling matrix.
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
//   i_xOrVector3: (float)
//   i_y: (float)
//   i_z: (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    if (i_xOrVector3 instanceof dan.math.Vector3 || i_xOrVector3 instanceof Array)
    {
        this.cols[0].setFromElements(i_xOrVector3[0], 0.0, 0.0);
        this.cols[1].setFromElements(0.0, i_xOrVector3[1], 0.0);
        this.cols[2].setFromElements(0.0, 0.0, i_xOrVector3[2]);
    }
    else
    {
        this.cols[0].setFromElements(i_xOrVector3, 0.0, 0.0);
        this.cols[1].setFromElements(0.0, i_y, 0.0);
        this.cols[2].setFromElements(0.0, 0.0, i_z);
    }
    return this;
};

dan.math.Matrix3.prototype.setToTSRT = function (i_preTranslation, i_scale, i_rotation, i_postTranslation)
// Completely overwrite this matrix to make it
// an affine translation-scale-rotate-translate matrix
// for 2D vectors in homogenous 3-component form.
//
// Params:
//  i_preTranslation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_scale:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_rotation:
//   (float)
//  i_postTranslation:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Matrix3)
{
    var cosR = Math.cos(i_rotation);
    var sinR = Math.sin(i_rotation);

    var scaleXcosR = i_scale[0] * cosR;
    var scaleXsinR = i_scale[0] * sinR;
    var scaleYcosR = i_scale[1] * cosR;
    var scaleYsinR = i_scale[1] * sinR;

    this.cols[0].setFromElements(scaleXcosR, scaleXsinR, 0.0);
    this.cols[1].setFromElements(-scaleYsinR, scaleYcosR, 0.0);
    this.cols[2].setFromElements(i_preTranslation[0] * scaleXcosR - i_preTranslation[1] * scaleYsinR + i_postTranslation[0],
                                 i_preTranslation[0] * scaleXsinR + i_preTranslation[1] * scaleYcosR + i_postTranslation[1],
                                 1.0);

    return this;
};

// + }}}

// + Arithmetic operations {{{

// + + With other matrices {{{

// + + + Member versions, modifying 'this' {{{

dan.math.Matrix3.prototype.add = function (i_right)
// Element-wise addition, this = this + i_right
//
// Params:
//  i_right:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix3)
{
    this.cols[0].add(i_right.cols[0]);
    this.cols[1].add(i_right.cols[1]);
    this.cols[2].add(i_right.cols[2]);
    return this;
};

dan.math.Matrix3.prototype.sub = function (i_right)
// Element-wise subtraction, this = this - i_right
//
// Params:
//  i_right:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix3)
{
    this.cols[0].sub(i_right.cols[0]);
    this.cols[1].sub(i_right.cols[1]);
    this.cols[2].sub(i_right.cols[2]);
    return this;
};

dan.math.Matrix3.prototype.mul = function (i_right)
// Matrix multiplication, this = this * i_right
//
// Params:
//  i_right:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix3)
{
    var left = this.clone();
    for (var r = 0; r < 3; ++r)
    {
        for (var c = 0; c < 3; ++c)
        {
            // 'this' matrix's row dotted with i_right matrix's column
            var total = 0;
            total += (left.cols[0][r] * i_right.cols[c][0]);
            total += (left.cols[1][r] * i_right.cols[c][1]);
            total += (left.cols[2][r] * i_right.cols[c][2]);

            this.cols[c][r] = total;
        }
    }

    return this;
};

dan.math.Matrix3.prototype.lmul = function (i_left)
// Matrix multiplication, this = i_left * this
//
// Params:
//  i_left:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix3)
{
    var right = this.clone();
    for (var r = 0; r < 3; ++r)
    {
        for (var c = 0; c < 3; ++c)
        {
            // i_left matrix's row dotted with this matrix's column
            var total = 0;
            total += (i_left.cols[0][r] * right.cols[c][0]);
            total += (i_left.cols[1][r] * right.cols[c][1]);
            total += (i_left.cols[2][r] * right.cols[c][2]);

            this.cols[c][r] = total;
        }
    }

    return this;
};

// + + + }}}

// + + + Non-member versions, returning new object {{{

dan.math.Matrix3.add = function (i_matrix1, i_matrix2)
// Element-wise addition, i_matrix1 + i_matrix2
//
// Params:
//  i_matrix1:
//   (dan.math.Matrix3)
//  i_matrix2:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix3)
{
    return i_matrix1.clone().add(i_matrix2);
};

dan.math.Matrix3.sub = function (i_matrix1, i_matrix2)
// Element-wise subtraction, i_matrix1 - i_matrix2
//
// Params:
//  i_matrix1:
//   (dan.math.Matrix3)
//  i_matrix2:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix3)
{
    return i_matrix1.clone().sub(i_matrix2);
};

dan.math.Matrix3.mul = function (i_matrix1, i_matrix2)
// Matrix multiplication, i_matrix1 * i_matrix2
//
// Params:
//  i_matrix1:
//   (dan.math.Matrix3)
//  i_matrix2:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix3)
{
    return i_matrix1.clone().mul(i_matrix2);
};

// + + + }}}

// + + }}}

// + + With scalars {{{

// + + + Member versions, modifying 'this' {{{

dan.math.Matrix3.prototype.adds = function (i_scalar)
// Add scalar, this += i_scalar
//
// Params:
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    this.cols[0].adds(i_scalar);
    this.cols[1].adds(i_scalar);
    this.cols[2].adds(i_scalar);
    return this;
};

dan.math.Matrix3.prototype.subs = function (i_scalar)
// Subtract scalar, this -= i_scalar
//
// Params:
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    this.cols[0].subs(i_scalar);
    this.cols[1].subs(i_scalar);
    this.cols[2].subs(i_scalar);
    return this;
};

dan.math.Matrix3.prototype.muls = function (i_scalar)
// Multiplication by scalar, this *= i_scalar
//
// Params:
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    this.cols[0].muls(i_scalar);
    this.cols[1].muls(i_scalar);
    this.cols[2].muls(i_scalar);
    return this;
};

// + + + }}}

// + + + Non-member versions, returning new object {{{

dan.math.Matrix3.adds = function (i_matrix, i_scalar)
// Add scalar, i_matrix + i_scalar
//
// Params:
//  i_matrix:
//   (dan.math.Matrix3)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    return i_matrix.clone().adds(i_scalar);
};

dan.math.Matrix3.sadd = function (i_scalar, i_matrix)
// Add scalar, i_scalar + i_matrix
//
// Params:
//  i_scalar:
//   (float)
//  i_matrix:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix3)
{
    return dan.math.Matrix3.fromColumnVectors(
        dan.math.Vector3.sadd(i_scalar, i_matrix.cols[0]),
        dan.math.Vector3.sadd(i_scalar, i_matrix.cols[1]),
        dan.math.Vector3.sadd(i_scalar, i_matrix.cols[2]));
};

dan.math.Matrix3.subs = function (i_matrix, i_scalar)
// Subtract scalar, i_matrix - i_scalar
//
// Params:
//  i_matrix:
//   (dan.math.Matrix3)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    return i_matrix.clone().subs(i_scalar);
};

dan.math.Matrix3.ssub = function (i_scalar, i_matrix)
// Subtract from scalar, i_scalar - i_matrix
//
// Params:
//  i_scalar:
//   (float)
//  i_matrix:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix3)
{
    return dan.math.Matrix3.fromColumnVectors(
        dan.math.Vector3.ssub(i_scalar, i_matrix.cols[0]),
        dan.math.Vector3.ssub(i_scalar, i_matrix.cols[1]),
        dan.math.Vector3.ssub(i_scalar, i_matrix.cols[2]));
};

dan.math.Matrix3.muls = function (i_matrix, i_scalar)
// Multiplication by scalar, i_matrix * i_scalar
//
// Params:
//  i_matrix:
//   (dan.math.Matrix3)
//  i_scalar:
//   (float)
//
// Returns:
//  (dan.math.Matrix3)
{
    return i_matrix.clone().muls(i_scalar);
};

dan.math.Matrix3.smul = function (i_scalar, i_matrix)
// Multiplication by scalar, i_scalar * i_matrix
//
// Params:
//  i_scalar:
//   (float)
//  i_matrix:
//   (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix3)
{
    return dan.math.Matrix3.fromColumnVectors(
        dan.math.Vector3.smul(i_scalar, i_matrix.cols[0]),
        dan.math.Vector3.smul(i_scalar, i_matrix.cols[1]),
        dan.math.Vector3.smul(i_scalar, i_matrix.cols[2]));
};

// + + + }}}

// + + }}}

// + }}}

// + Comparison operators {{{

dan.math.Matrix3.isEqual = function (i_matrix1, i_matrix2)
// Params:
//  i_matrix1:
//   (dan.math.Matrix3)
//  i_matrix2:
//   (dan.math.Matrix3)
//
// Returns:
//  (boolean)
{
    return (dan.math.Vector3.isEqual(i_matrix1.cols[0], i_matrix2.cols[0]) &&
            dan.math.Vector3.isEqual(i_matrix1.cols[1], i_matrix2.cols[1]) &&
            dan.math.Vector3.isEqual(i_matrix1.cols[2], i_matrix2.cols[2]));
};

dan.math.Matrix3.isNotEqual = function (i_matrix1, i_matrix2)
// Params:
//  i_matrix1:
//   (dan.math.Matrix3)
//  i_matrix2:
//   (dan.math.Matrix3)
//
// Returns:
//  (boolean)
{
    return (dan.math.Vector3.isNotEqual(i_matrix1.cols[0], i_matrix2.cols[0]) ||
            dan.math.Vector3.isNotEqual(i_matrix1.cols[1], i_matrix2.cols[1]) ||
            dan.math.Vector3.isNotEqual(i_matrix1.cols[2], i_matrix2.cols[2]));
};

// + }}}

// + Matrix-specific operations {{{

// + + Member versions, modifying 'this' {{{

dan.math.Matrix3.prototype.transpose = function ()
// Returns:
//  (dan.math.Matrix3)
{
    for (var colNo = 0; colNo < 3; ++colNo)
    {
        // Exchange values below/right of diagonal
        for (var rowNo = colNo+1; rowNo < 3; ++rowNo)
        {
            var tmp = this.cols[colNo][rowNo];
            this.cols[colNo][rowNo] = this.cols[rowNo][colNo];
            this.cols[rowNo][colNo] = tmp;
        }
    }
    return this;
};

dan.math.Matrix3.prototype.invert = function ()
// Returns:
//  (dan.math.Matrix3)
{
    this.setFromMatrix3(dan.math.Matrix3.invert(this));
    return this;
};

// + + }}}

// + + Non-member versions, returning new object {{{

dan.math.Matrix3.transpose = function (i_matrix)
// Params:
//  i_matrix:
//  (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix3)
{
    var rv = new dan.math.Matrix3();

    for (var colNo = 0; colNo < 3; ++colNo)
    {
        // Copy value on diagonal
        rv.cols[colNo][colNo] = i_matrix.cols[colNo][colNo];

        // Copy/exchange values below/right of diagonal
        for (var rowNo = colNo+1; rowNo < 3; ++rowNo)
        {
            rv.cols[colNo][rowNo] = i_matrix.cols[rowNo][colNo];
            rv.cols[rowNo][colNo] = i_matrix.cols[colNo][rowNo];
        }
    }

    return rv;
};

dan.math.Matrix3.invert = function (i_matrix)
// Params:
//  i_matrix:
//  (dan.math.Matrix3)
//
// Returns:
//  (dan.math.Matrix3)
{
    var a = i_matrix.clone();
    var b = dan.math.Matrix3.identityMatrix();

    var tmp;

    // Go through columns
    for (var c = 0; c < 3; ++c)
    {
        // For the entries in the column from the one that is on the diagonal to the last one,
        // find which has the maximum absolute value, getting its row number in rowMax
        var rowMax = c;
        for (var r = c + 1; r < 3; ++r)
        {
            if (Math.abs(a.cols[c][r]) > Math.abs(a.cols[c][rowMax]))
            {
                rowMax = r;
            }
        }

        // If the value of the entry is 0, we can't invert. Return identity.
        if (a.cols[rowMax][c] == 0.0)
            return dan.math.Matrix3.identityMatrix();

        // Swap row "rowMax" with row "c"
        for (var cc = 0; cc < 3; ++cc)
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
        for (var cc = 0; cc < 3; ++cc)
        {
            a.cols[cc][c] /= tmp;
            b.cols[cc][c] /= tmp;
        }

        // Now do the other rows, so that this column only has a 1 and 0's
        for (var rowNo = 0; rowNo < 3; ++rowNo)
        {
            if (rowNo != c)
            {
                tmp = a.cols[c][rowNo];
                for (var cc = 0; cc < 3; ++cc)
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
