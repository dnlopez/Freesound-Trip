
// This namespace
// #require "math.js"


// + Construction/clone {{{

dan.math.Euler = function (i_x, i_y, i_z, i_order)
// Params:
//  i_x, i_y, i_z:
//   Either (float)
//    Angles in radians
//   or (null or undefined)
//    Use default of 0.
//  i_order:
//   Either (string)
//    One of dan.math.Euler.RotationOrders,
//   or (null or undefined)
//    Use default of "XYZ".
{
    // Apply default arguments
    if (!i_x)
        i_x = 0;
    if (!i_y)
        i_y = 0;
    if (!i_z)
        i_z = 0;

    //
    this.setFromElements(i_x, i_y, i_z, i_order);

    // x, y, z:
    //  (float number)
    // order:
    //  (string, from dan.math.Euler.RotationOrders)
};

// + + Static constructors that wrap functions from "Get/set all components at once" {{{

dan.math.Euler.fromElements = function (i_x, i_y, i_z, i_order)
// Params:
//  i_x, i_y, i_z:
//   Either (float)
//    Angles in radians
//   or (null or undefined)
//    Use default of 0.
//  i_order:
//   Either (string)
//    One of dan.math.Euler.RotationOrders.
//    The order that rotations by the above angles should be done in.
//   or (null or undefined)
//    Use default of "XYZ".
{
    return new dan.math.Euler(i_x, i_y, i_z, i_order);
};

dan.math.Euler.fromArray = function (i_array)
// Params:
//  i_array:
//   (array)
//   First three elements are (float number) x, y and z values to set.
//   Fourth element is either (string) one of dan.math.Euler.RotationOrders to set,
//   or (undefined) don't change rotation order.
{
    return new dan.math.Euler().setFromArray(i_array);
};

dan.math.Euler.prototype.fromEuler = function (i_euler)
// Params:
//  i_euler:
//   (dan.math.Euler)
{
    return new dan.math.Euler().setFromEuler(i_euler);
};

// + + }}}

// + + Static constructors that wrap functions from "From other rotation representations" {{{

dan.math.Euler.fromRotationMatrix = function (i_matrix, i_order)
// Params:
//  i_matrix:
//   (dan.math.Matrix4)
//   This must be a pure rotation matrix (ie. no scaling effect. However,
//   any translation effect that may be represented by column 4 is simply ignored.)
//  i_order:
//   Either (string)
//    One of dan.math.Euler.RotationOrders.
//    New order to set before decomposing the matrix into corresponding individual rotations.
//   or (null or undefined)
//    Don't change existing order.
{
    return new dan.math.Euler().setFromRotationMatrix(i_matrix, i_order);
};

dan.math.Euler.fromQuaternion = function (i_q, i_order)
// Params:
//  i_q:
//   The quaternion to set from.
//   Must be normalized.
//  i_order:
//   Either (string)
//    One of dan.math.Euler.RotationOrders.
//    New order to set before decomposing the quaternion into corresponding individual
//    rotations.
//   or (null or undefined)
//    Don't change existing order.
{
    return new dan.math.Euler().setFromQuaternion(i_q, i_order);
};

// + + }}}

dan.math.Euler.prototype.clone = function ()
{
    return new dan.math.Euler(this.x, this.y, this.z, this.order);
};

// + }}}

dan.math.Euler.RotationOrders = ["XYZ", "YZX", "ZXY", "XZY", "YXZ", "ZYX"];
// "XYZ" means rotation about X followed by rotation about Y followed by rotation about Z

dan.math.Euler.DefaultOrder = "XYZ";


// + Get/set all components at once {{{

dan.math.Euler.prototype.setFromElements = function (i_x, i_y, i_z, i_order)
// Params:
//  i_x, i_y, i_z:
//   (float)
//   Angles in radians
//  i_order:
//   Either (string)
//    One of dan.math.Euler.RotationOrders.
//    The order that rotations by the above angles should be done in.
//   or (null or undefined)
//    Use default of "XYZ".
{
    // Apply default arguments
    if (!i_order)
        i_order = dan.math.Euler.DefaultOrder;

    this.x = i_x;
    this.y = i_y;
    this.z = i_z;
    this.order = i_order;

    return this;
};

dan.math.Euler.prototype.getToArray = function ()
{
    return [this.x, this.y, this.z, this.order];
};

dan.math.Euler.prototype.setFromArray = function (i_array)
// Params:
//  i_array:
//   (array)
//   First three elements are (float number) x, y and z values to set.
//   Fourth element is either (string) one of dan.math.Euler.RotationOrders to set,
//   or (undefined) don't change rotation order.
{
    this.x = i_array[0];
    this.y = i_array[1];
    this.z = i_array[2];
    if (i_array[3] !== undefined)
        this.order = i_array[3];

    return this;
}

dan.math.Euler.prototype.setFromEuler = function (i_euler)
// Params:
//  i_euler:
//   (dan.math.Euler)
{
    this.x = i_euler.x;
    this.y = i_euler.y;
    this.z = i_euler.z;
    this.order = i_euler.order;

    return this;
};

// + }}}

// + From other rotation representations {{{

dan.math.Euler.prototype.setFromRotationMatrix = function (i_matrix, i_order)
// Params:
//  i_matrix:
//   (dan.math.Matrix4)
//   This must be a pure rotation matrix (ie. no scaling effect. However,
//   any translation effect that may be represented by column 4 is simply ignored.)
//  i_order:
//   Either (string)
//    One of dan.math.Euler.RotationOrders.
//    New order to set before decomposing the matrix into corresponding individual rotations.
//   or (null or undefined)
//    Don't change existing order.
{
    // Apply default arguments
    if (!i_order)
        i_order = this.order;

    function clamp(x)
    // Clamp x to [-1, 1], to handle numerical problems
    {
        return Math.min(Math.max(x, -1), 1);
    }

    var m11 = i_matrix.cols[0][0], m12 = i_matrix.cols[1][0], m13 = i_matrix.cols[2][0];
    var m21 = i_matrix.cols[0][1], m22 = i_matrix.cols[1][1], m23 = i_matrix.cols[2][1];
    var m31 = i_matrix.cols[0][2], m32 = i_matrix.cols[1][2], m33 = i_matrix.cols[2][2];

    // These are derived by starting with the result of algebraically multiplying out
    // the standalone X, Y and Z rotation matrices in each different order (as done in
    // Matrix4.setToEuler()) and then using inverse trig functions on the
    // elements that most lend themselves to recovering the angles.
    // See also http://www.soi.city.ac.uk/~sbbh653/publications/euler.pdf

    if (i_order === "XYZ")
    {
        this.y = Math.asin(-clamp(m31));

        if (Math.abs(m31) < 0.99999)
        {
            this.x = Math.atan2(m32, m33);
            this.z = Math.atan2(m21, m11);
        }
        else
        {
            this.x = 0;
            this.z = Math.atan2(-m12, m22);
        }
    }
    else if (i_order === "YZX")
    {
        this.z = Math.asin(-clamp(m12));

        if (Math.abs(m12) < 0.99999)
        {
            this.x = Math.atan2(m32, m22);
            this.y = Math.atan2(m13, m11);
        }
        else
        {
            this.x = Math.atan2(-m23, m33);
            this.y = 0;
        }
    }
    else if (i_order === "ZXY")
    {
        this.x = Math.asin(-clamp(m23));

        if (Math.abs(m23) < 0.99999)
        {
            this.y = Math.atan2(m13, m33);
            this.z = Math.atan2(m21, m22);
        }
        else
        {
            this.y = Math.atan2(-m31, m11);
            this.z = 0;
        }
    }
    else if (i_order === "XZY")
    {
        this.z = Math.asin(clamp(m21));

        if (Math.abs(m21) < 0.99999)
        {
            this.x = Math.atan2(-m23, m22);
            this.y = Math.atan2(-m31, m11);
        }
        else
        {
            this.x = 0;
            this.y = Math.atan2(m13, m33);
        }
    }
    else if (i_order === "YXZ")
    {
        this.x = Math.asin(clamp(m32));

        if (Math.abs(m32) < 0.99999)
        {
            this.y = Math.atan2(-m31, m33);
            this.z = Math.atan2(-m12, m22);
        }
        else
        {
            this.y = 0;
            this.z = Math.atan2(m21, m11);
        }
    }
    else if (i_order === "ZYX")
    {
        this.y = Math.asin(clamp(m13));

        if (Math.abs(m13) < 0.99999)
        {
            this.x = Math.atan2(-m23, m33);
            this.z = Math.atan2(-m12, m11);
        }
        else
        {
            this.x = Math.atan2(m32, m22);
            this.z = 0;
        }
    }

    this.order = i_order;

    return this;
};

dan.math.Euler.prototype.setFromQuaternion = function (i_q, i_order)
// Params:
//  i_q:
//   The quaternion to set from.
//   Must be normalized.
//  i_order:
//   Either (string)
//    One of dan.math.Euler.RotationOrders.
//    New order to set before decomposing the quaternion into corresponding individual
//    rotations.
//   or (null or undefined)
//    Don't change existing order.
{
    // Apply default arguments
    i_order = i_order || this.order;

    function clamp(x)
    // Clamp x to [-1, 1], to handle numerical problems
    {
        return Math.min(Math.max(x, -1), 1);
    }

    // See:
    //  http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m
    // TODO: understand this; possibly the method is similar to setFromRotationMatrix()?

    var sqx = i_q.x * i_q.x;
    var sqy = i_q.y * i_q.y;
    var sqz = i_q.z * i_q.z;
    var sqw = i_q.w * i_q.w;

    if (i_order === "XYZ")
    {
        this.x = Math.atan2(2 * (i_q.x * i_q.w + i_q.z * i_q.y), (sqw - sqx - sqy + sqz));
        this.y = Math.asin(clamp(2 * (i_q.y * i_q.w - i_q.x * i_q.z)));
        this.z = Math.atan2(2 * (i_q.x * i_q.y + i_q.z * i_q.w), (sqw + sqx - sqy - sqz));
    }
    else if (i_order === "YZX")
    {
        this.x = Math.atan2(2 * (i_q.x * i_q.w + i_q.y * i_q.z), (sqw - sqx + sqy - sqz));
        this.y = Math.atan2(2 * (i_q.x * i_q.z + i_q.y * i_q.w), (sqw + sqx - sqy - sqz));
        this.z = Math.asin(clamp(2 * (i_q.z * i_q.w - i_q.x * i_q.y)));
    }
    else if (i_order === "ZXY")
    {
        this.x = Math.asin(clamp(2 * (i_q.x * i_q.w - i_q.y * i_q.z)));
        this.y = Math.atan2(2 * (i_q.x * i_q.z + i_q.y * i_q.w), (sqw - sqx - sqy + sqz));
        this.z = Math.atan2(2 * (i_q.x * i_q.y + i_q.z * i_q.w), (sqw - sqx + sqy - sqz));
    }
    else if (i_order === "XZY")
    {
        this.x = Math.atan2(2 * (i_q.x * i_q.w - i_q.z * i_q.y), (sqw - sqx + sqy - sqz));
        this.y = Math.atan2(2 * (i_q.y * i_q.w - i_q.x * i_q.z), (sqw + sqx - sqy - sqz));
        this.z = Math.asin(clamp(2 * (i_q.x * i_q.y + i_q.z * i_q.w)));
    }
    else if (i_order === "YXZ")
    {
        this.x = Math.asin(clamp(2 * (i_q.x * i_q.w + i_q.y * i_q.z)));
        this.y = Math.atan2(2 * (i_q.y * i_q.w - i_q.z * i_q.x), (sqw - sqx - sqy + sqz));
        this.z = Math.atan2(2 * (i_q.z * i_q.w - i_q.x * i_q.y), (sqw - sqx + sqy - sqz));
    }
    else if (i_order === "ZYX")
    {
        this.x = Math.atan2(2 * (i_q.x * i_q.w - i_q.y * i_q.z), (sqw - sqx - sqy + sqz));
        this.y = Math.asin(clamp(2 * (i_q.x * i_q.z + i_q.y * i_q.w)));
        this.z = Math.atan2(2 * (i_q.z * i_q.w - i_q.x * i_q.y), (sqw + sqx - sqy - sqz));
    }

    this.order = i_order;

    return this;
};

// + }}}

// + Change order {{{

dan.math.Euler.prototype.reorder = function ()
// Change the rotation order while recalculating the angles so that the actual combined
// rotation is not changed.
// Though, WARNING: this discards revolution information -bhouston
{
    var q = new dan.math.Quaternion();

    return function (newOrder)
    {
        q.setFromEuler(this);
        this.setFromQuaternion(q, newOrder);
    };
}();

// + }}}

// + Comparison operators {{{

dan.math.Euler.prototype.equals = function (i_other)
{
    return (i_other.x === this.x) &&
        (i_other.y === this.y) &&
        (i_other.z === this.z) &&
        (i_other.order === this.order);
};

// + }}}
