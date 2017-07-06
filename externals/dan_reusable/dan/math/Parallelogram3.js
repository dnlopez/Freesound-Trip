
// This namespace
// #require "math.js"
// #require <dan/math/Vector3.js>


// [maybe Parallelogram3 should have a 3 on the end]
//  [+]]


// + Construction {{{

dan.math.Parallelogram3 = function ()
{
    this.corner = new dan.math.Vector3();
    this.base1 = new dan.math.Vector3();
    this.base2 = new dan.math.Vector3();
};

// + + Static constructors {{{

dan.math.Parallelogram3.fromElements = function (i_corner, i_base1, i_base2)
// Params:
//  i_corner:
//   (dan.math.Vector3)
//  i_base1, i_base2:
//   (dan.math.Vector3)
//
// Returns:
//  (dan.math.Parallelogram3)
{
    return new dan.math.Parallelogram3().setFromElements(i_corner, i_base1, i_base2);
};

dan.math.Parallelogram3.fromParallelogram3 = function (i_parallelogram)
// Params:
//  i_parallelogram: (dan.math.Parallelogram3)
//
// Returns:
//  (dan.math.Parallelogram3)
{
    return new dan.math.Parallelogram3().setFromParallelogram3(i_parallelogram);
};

// + + }}}

dan.math.Parallelogram3.prototype.clone = function (i_parallelogram)
// Returns:
//  (dan.math.Parallelogram3)
{
    return dan.math.Parallelogram3.fromParallelogram3(this);
};

// + }}}

// + Get/set all elements at once {{{

dan.math.Parallelogram3.prototype.setFromElements = function (i_corner, i_base1, i_base2)
// Params:
//  i_corner:
//   (dan.math.Vector3)
//  i_base1, i_base2:
//   (dan.math.Vector3)
//
// Returns:
//  (dan.math.Parallelogram3)
{
    this.corner.setFromVector3(i_corner);
    this.base1.setFromVector3(i_base1);
    this.base2.setFromVector3(i_base2);
    return this;
};

dan.math.Parallelogram3.prototype.setFromParallelogram3 = function (i_parallelogram)
// Params:
//  i_parallelogram: (dan.math.Parallelogram3)
//
// Returns:
//  (dan.math.Parallelogram3)
{
    this.corner.setFromVector3(i_parallelogram.corner);
    this.base1.setFromVector3(i_parallelogram.base1);
    this.base2.setFromVector3(i_parallelogram.base2);
    return this;
};

// + }}}

// + Transform {{{

// + + Member versions, modifying 'this' {{{

dan.math.Parallelogram3.prototype.transformByMatrix = function (i_matrix)
// Transform 3D parallelogram with affine 4x4 matrix, this = i_matrix * this
//
// Params:
//  i_matrix:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.math.Parallelogram3)
{
    // [possibly this could also be done like Ray3 where add corner point to each
    //  base vector, transform by matrix, then subtract again]

    this.corner.transformByMatrix(i_matrix);

    var transformWithScalingAndRotationOnly = i_matrix.clone();
    transformWithScalingAndRotationOnly.cols[3][0] = 0;
    transformWithScalingAndRotationOnly.cols[3][1] = 0;
    transformWithScalingAndRotationOnly.cols[3][2] = 0;
    this.base1.transformByMatrix(transformWithScalingAndRotationOnly);
    this.base2.transformByMatrix(transformWithScalingAndRotationOnly);

    return this;
};

// + + }}}

// + + Non-member versions, returning new object {{{

dan.math.Parallelogram3.transformByMatrix = function (i_matrix, i_parallelogram)
// Transform 3D parallelogram with affine 4x4 matrix, i_matrix * i_vector
//
// Params:
//  i_matrix:
//   (dan.math.Matrix4)
//  i_parallelogram:
//   (dan.math.Parallelogram3)
//
// Returns:
//  (dan.math.Parallelogram3)
{
    var transformWithScalingAndRotationOnly = i_matrix.clone();
    transformWithScalingAndRotationOnly.cols[3][0] = 0;
    transformWithScalingAndRotationOnly.cols[3][1] = 0;
    transformWithScalingAndRotationOnly.cols[3][2] = 0;

    return dan.math.Parallelogram3.fromElements(
        dan.math.Vector3.transformByMatrix(i_matrix, i_parallelogram.corner),
        dan.math.Vector3.transformByMatrix(transformWithScalingAndRotationOnly, i_parallelogram.base1),
        dan.math.Vector3.transformByMatrix(transformWithScalingAndRotationOnly, i_parallelogram.base2));
};

// + + }}}

// + }}}
