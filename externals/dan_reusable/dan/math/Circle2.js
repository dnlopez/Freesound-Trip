
// This namespace
// #require "Vector2.js"


// + Construction {{{

dan.math.Circle2 = function ()
// Class representing a 2D circle.
//
// Fundamentally this stores an origin position with 2 dimensions, and a radius.
{
    this.centre = new dan.math.Vector2();
    //  centre:
    //   (dan.math.Vector2)

    this.radius = 0;
    //  radius:
    //   (number)
};

// + + Static constructors {{{

dan.math.Circle2.fromOR = function (i_centre, i_radius)
// Params:
//  i_centre:
//   (dan.math.Vector2)
//  i_radius:
//   (number)
//
// Returns:
//  (dan.math.Circle2)
{
    return new dan.math.Circle2().setOR(i_centre, i_radius);
};

dan.math.Circle2.fromXYR = function (i_centreX, i_centreY, i_radius)
// Params:
//  i_centreX:
//   (number)
//  i_centreY:
//   (number)
//  i_radius:
//   (number)
//
// Returns:
//  (dan.math.Circle2)
{
    return new dan.math.Circle2().setXYR(i_centreX, i_centreY, i_radius);
};

dan.math.Circle2.fromCircle2 = function (i_circle)
// Params:
//  i_circle:
//   (dan.math.Circle2)
//
// Returns:
//  (dan.math.Circle2)
{
    return new dan.math.Circle2().setCircle2(i_circle);
};

dan.math.Circle2.fromPointsOnCircumference = function (i_point1, i_point2)
// Params:
//  i_point1:
//   (dan.math.Vector2)
//  i_point2:
//   (dan.math.Vector2)
//
// Returns:
//  (dan.math.Circle2)
{
    var midpoint = dan.math.Vector2.mix(i_point1, i_point2, 0.5);

    return new dan.math.Circle2.fromOR(midpoint, midpoint.distance(i_point1));
};

// + + }}}

dan.math.Circle2.prototype.clone = function ()
// Returns:
//  (dan.math.Circle2)
{
    return new dan.math.Circle2().fromCircle2(this);
};

// + }}}

// + Set all elements at once {{{

dan.math.Circle2.prototype.setOR = function (i_centre, i_radius)
// Params:
//  i_centre:
//   (dan.math.Vector2)
//  i_radius:
//   (number)
//
// Returns:
//  (dan.math.Circle2)
{
    this.centre = i_centre;
    this.radius = i_radius;
    return this;
};

dan.math.Circle2.prototype.setXYR = function (i_centreX, i_centreY, i_radius)
// Params:
//  i_centreX:
//   (number)
//  i_centreY:
//   (number)
//  i_radius:
//   (number)
//
// Returns:
//  (dan.math.Circle2)
{
    this.centre = dan.math.Vector2.fromXY(i_centreX, i_centreY);
    this.radius = i_radius;
    return this;
};

dan.math.Circle2.prototype.setCircle2 = function (i_circle)
// Params:
//  i_circle: (dan.math.Circle2)
//
// Returns:
//  (dan.math.Circle2)
{
    this.centre.setVector2(i_circle.centre);
    this.radius = i_circle.radius;
    return this;
};

// + }}}

// + Comparison operators {{{

dan.math.Circle2.prototype.isEqual = function (i_other)
// Params:
//  i_other: (dan.math.Circle2)
//
// Returns:
//  (boolean)
{
    return ((i_other.centre[0] == this.centre[0]) &&
            (i_other.centre[1] == this.centre[1]) &&
            (i_other.radius == this.radius));
};

dan.math.Circle2.prototype.isNotEqual = function (i_other)
// Params:
//  i_other: (dan.math.Circle2)
//
// Returns:
//  (boolean)
{
    return ((i_other.centre[0] != this.centre[0]) ||
            (i_other.centre[1] != this.centre[1]) ||
            (i_other.radius != this.radius));
};

// + }}}

// + To string {{{

dan.math.Circle2.prototype.toString = function ()
// Returns:
//  (string)
{
    return "Circle2(" + this.centre.toString() + ", " + this.radius.toString() + ")";
}

// + + }}}

// + }}}
