
// This namespace
// #require "math.js"

// Dan reusable
// #require <dan/math/Vector2.js>


// + Constructors {{{

dan.math.Rect2 = function ()
// Class representing a 2D rectangle.
//
// Fundamentally this stores a start position and an end position each with 2 dimensions.
//
// Some terms used for convenience and what they are strictly synonymous with:
//  left: dimension 0 start
//  right: dimension 0 end
//  width: dimension 0 end - dimension 0 start
//  top: dimension 1 start
//  bottom: dimension 1 end
//  height: dimension 1 end - dimension 1 start
{
    this.start = new dan.math.Vector2();
    //  start:
    //   (dan.math.Vector2)

    this.end = new dan.math.Vector2();
    //  end:
    //   (dan.math.Vector2)
};

// + + Static constructors {{{

dan.math.Rect2.fromSE = function (i_start, i_end)
// Params:
//  i_start: (dan.math.Vector2)
//  i_end: (dan.math.Vector2)
{
    return new dan.math.Rect2().setSE(i_start, i_end);
};

dan.math.Rect2.fromSS = function (i_start, i_size)
// Params:
//  i_start: (dan.math.Vector2)
//  i_size: (dan.math.Vector2)
{
    return new dan.math.Rect2().setSS(i_start, i_size);
};

dan.math.Rect2.fromLTRB = function (i_left, i_top, i_right, i_bottom)
// Params:
//  i_left: (float)
//  i_top: (float)
//  i_right: (float)
//  i_bottom: (float)
//
// Returns:
//  (dan.math.Rect2)
{
    return new dan.math.Rect2().setLTRB(i_left, i_top, i_right, i_bottom);
};

dan.math.Rect2.fromX1Y1X2Y2 = function (i_x1, i_y1, i_x2, i_y2)
// Params:
//  i_x1: (float)
//  i_y1: (float)
//  i_x2: (float)
//  i_y2: (float)
//
// Returns:
//  (dan.math.Rect2)
{
    return new dan.math.Rect2().setX1Y1X2Y2(i_x1, i_y1, i_x2, i_y2);
};

dan.math.Rect2.fromX1X2Y1Y2 = function (i_x1, i_x2, i_y1, i_y2)
// Params:
//  i_x1: (float)
//  i_x2: (float)
//  i_y1: (float)
//  i_y2: (float)
//
// Returns:
//  (dan.math.Rect2)
{
    return new dan.math.Rect2().setX1X2Y1Y2(i_x1, i_x2, i_y1, i_y2);
};

dan.math.Rect2.fromXYWH = function (i_x, i_y, i_width, i_height)
// Params:
//  i_x: (float)
//  i_y: (float)
//  i_width: (float)
//  i_height: (float)
//
// Returns:
//  (dan.math.Rect2)
{
    return new dan.math.Rect2().setXYWH(i_x, i_y, i_width, i_height);
};

dan.math.Rect2.prototype.fromRect2 = function (i_rect)
// Params:
//  i_rect: (dan.math.Rect2)
//
// Returns:
//  (dan.math.Rect2)
{
    return new dan.math.Rect2().setRect2(i_rect);
};

// + + }}}

dan.math.Rect2.prototype.clone = function ()
// Returns:
//  (dan.math.Rect2)
{
    return new dan.math.Rect2().fromRect2(this);
};

// + }}}

// + Set all elements at once {{{

dan.math.Rect2.prototype.setSE = function (i_start, i_end)
// Params:
//  i_start: (dan.math.Vector2)
//  i_end: (dan.math.Vector2)
//
// Returns:
//  (dan.math.Rect2)
{
    this.start[0] = i_start[0];
    this.start[1] = i_start[1];
    this.end[0] = i_end[0];
    this.end[1] = i_end[1];
    return this;
};

dan.math.Rect2.prototype.setSS = function (i_start, i_size)
// Params:
//  i_start: (dan.math.Vector2)
//  i_size: (dan.math.Vector2)
//
// Returns:
//  (dan.math.Rect2)
{
    this.start[0] = i_start[0];
    this.start[1] = i_start[1];
    this.end[0] = i_start[0] + i_size[0];
    this.end[1] = i_start[1] + i_size[1];
    return this;
};

dan.math.Rect2.prototype.setLTRB = function (i_left, i_top, i_right, i_bottom)
// Params:
//  i_left: (float)
//  i_top: (float)
//  i_right: (float)
//  i_bottom: (float)
//
// Returns:
//  (dan.math.Rect2)
{
    this.start[0] = i_left;
    this.start[1] = i_top;
    this.end[0] = i_right;
    this.end[1] = i_bottom;
    return this;
};

dan.math.Rect2.prototype.setX1Y1X2Y2 = function (i_x1, i_y1, i_x2, i_y2)
// Params:
//  i_x1: (float)
//  i_y1: (float)
//  i_x2: (float)
//  i_y2: (float)
//
// Returns:
//  (dan.math.Rect2)
{
    this.start[0] = i_x1;
    this.start[1] = i_y1;
    this.end[0] = i_x2;
    this.end[1] = i_y2;
    return this;
};

dan.math.Rect2.prototype.setX1X2Y1Y2 = function (i_x1, i_x2, i_y1, i_y2)
// Params:
//  i_x1: (float)
//  i_x2: (float)
//  i_y1: (float)
//  i_y2: (float)
//
// Returns:
//  (dan.math.Rect2)
{
    this.start[0] = i_x1;
    this.end[0] = i_x2;
    this.start[1] = i_y1;
    this.end[1] = i_y2;
    return this;
};

dan.math.Rect2.prototype.setXYWH = function (i_x, i_y, i_width, i_height)
// Params:
//  i_x: (float)
//  i_y: (float)
//  i_width: (float)
//  i_height: (float)
//
// Returns:
//  (dan.math.Rect2)
{
    this.start[0] = i_x;
    this.start[1] = i_y;
    this.end[0] = i_x + i_width;
    this.end[1] = i_y + i_height;
    return this;
};

dan.math.Rect2.prototype.setRect2 = function (i_rect)
// Params:
//  i_rect: (dan.math.Rect2)
//
// Returns:
//  (dan.math.Rect2)
{
    this.start[0] = i_rect.start[0];
    this.start[1] = i_rect.start[1];
    this.end[0] = i_rect.end[0];
    this.end[1] = i_rect.end[1];
    return this;
};

// + }}}

// + Get/set individual elements (vectors) {{{

dan.math.Rect2.prototype.getStart = function ()
// Returns:
//  (dan.math.Vector2)
{
    return this.start;
};

dan.math.Rect2.prototype.setStart = function (i_start)
// Params:
//  i_start: (dan.math.Vector2)
//
// Returns:
//  (dan.math.Rect2)
{
    this.start[0] = i_start[0];
    this.start[1] = i_start[1];
    return this;
};

dan.math.Rect2.prototype.getEnd = function ()
// Returns:
//  (dan.math.Vector2)
{
    return this.end;
};

dan.math.Rect2.prototype.setEnd = function (i_end)
// Params:
//  i_end: (dan.math.Vector2)
//
// Returns:
//  (dan.math.Rect2)
{
    this.end[0] = i_end[0];
    this.end[1] = i_end[1];
    return this;
};

// + }}}

// + Get/set individual elements (components within vectors) {{{

dan.math.Rect2.prototype.getLeft = function ()
// Returns:
//  (float)
{
    return this.start[0];
};

dan.math.Rect2.prototype.setLeft = function (i_left)
// Params:
//  i_left: (float)
//
// Returns:
//  (dan.math.Rect2)
{
    this.start[0] = i_left;
    return this;
};

Object.defineProperty(dan.math.Rect2.prototype, "left", {
    get: function ()
    // Returns:
    //  (float)
    {
        return this.start[0];
    },
    set: function (i_value)
    // Params:
    //  i_value:
    //   (float)
    {
        this.start[0] = i_value;
    }
});

dan.math.Rect2.prototype.getTop = function ()
// Returns:
//  (float)
{
    return this.start[1];
};

dan.math.Rect2.prototype.setTop = function (i_top)
// Params:
//  i_top: (float)
//
// Returns:
//  (dan.math.Rect2)
{
    this.start[1] = i_top;
    return this;
};

Object.defineProperty(dan.math.Rect2.prototype, "top", {
    get: function ()
    // Returns:
    //  (float)
    {
        return this.start[1];
    },
    set: function (i_value)
    // Params:
    //  i_value:
    //   (float)
    {
        this.start[1] = i_value;
    }
});

dan.math.Rect2.prototype.getRight = function ()
// Returns:
//  (float)
{
    return this.end[0];
};

dan.math.Rect2.prototype.setRight = function (i_right)
// Params:
//  i_right: (float)
//
// Returns:
//  (dan.math.Rect2)
{
    this.end[0] = i_right;
    return this;
};

Object.defineProperty(dan.math.Rect2.prototype, "right", {
    get: function ()
    // Returns:
    //  (float)
    {
        return this.end[0];
    },
    set: function (i_value)
    // Params:
    //  i_value:
    //   (float)
    {
        this.end[0] = i_value;
    }
});

dan.math.Rect2.prototype.getBottom = function ()
// Returns:
//  (float)
{
    return this.end[1];
};

dan.math.Rect2.prototype.setBottom = function (i_bottom)
// Params:
//  i_bottom: (float)
//
// Returns:
//  (dan.math.Rect2)
{
    this.end[1] = i_bottom;
    return this;
};

Object.defineProperty(dan.math.Rect2.prototype, "bottom", {
    get: function ()
    // Returns:
    //  (float)
    {
        return this.end[1];
    },
    set: function (i_value)
    // Params:
    //  i_value:
    //   (float)
    {
        this.end[1] = i_value;
    }
});

dan.math.Rect2.prototype.getX = function ()
// Returns:
//  (float)
{
    return this.start[0];
};

dan.math.Rect2.prototype.setX = function (i_x)
// Params:
//  i_x: (float)
//
// Returns:
//  (dan.math.Rect2)
{
    this.start[0] = i_x;
    return this;
};

dan.math.Rect2.prototype.getY = function ()
// Returns:
//  (float)
{
    return this.start[1];
};

dan.math.Rect2.prototype.setY = function (i_y)
// Params:
//  i_y: (float)
//
// Returns:
//  (dan.math.Rect2)
{
    this.start[1] = i_y;
    return this;
};

// + }}}

// + Size {{{

dan.math.Rect2.prototype.width = function ()
// Returns:
//  (float)
{
    return this.end[0] - this.start[0];
};

dan.math.Rect2.prototype.height = function ()
// Returns:
//  (float)
{
    return this.end[1] - this.start[1];
};

dan.math.Rect2.prototype.setWidth = function (i_width)
// Params:
//  i_width:
//   (float)
//
// Returns:
//  (dan.math.Rect2)
{
    this.end[0] = this.start[0] + i_width;
    return this;
};

dan.math.Rect2.prototype.setHeight = function (i_height)
// Params:
//  i_height:
//   (float)
//
// Returns:
//  (dan.math.Rect2)
{
    this.end[1] = this.start[1] + i_height;
    return this;
};

dan.math.Rect2.prototype.size = function ()
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.sub(this.end, this.start);
};

dan.math.Rect2.prototype.area = function ()
// Returns:
//  (float)
{
    return this.width() * this.height();
};

// + }}}

// + Anchor points {{{

// + + Get {{{

// + + + Corners {{{

dan.math.Rect2.prototype.leftTop = function ()
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(this.start[0], this.start[1]);
};

dan.math.Rect2.prototype.rightTop = function ()
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(this.end[0], this.start[1]);
};

dan.math.Rect2.prototype.leftBottom = function ()
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(this.start[0], this.end[1]);
};

dan.math.Rect2.prototype.rightBottom = function ()
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(this.end[0], this.end[1]);
};

// + + + }}}

// + + + Centres of edges {{{

dan.math.Rect2.prototype.leftCentre = function ()
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(this.start[0], (this.start[1] + this.end[1]) / 2);
};

dan.math.Rect2.prototype.centreTop = function ()
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements((this.start[0] + this.end[0]) / 2, this.start[1]);
};

dan.math.Rect2.prototype.rightCentre = function ()
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements(this.end[0], (this.start[1] + this.end[1]) / 2);
};

dan.math.Rect2.prototype.centreBottom = function ()
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements((this.start[0] + this.end[0]) / 2, this.end[1]);
};

// + + + }}}

// + + + Centre of area {{{

dan.math.Rect2.prototype.centre = function ()
// Returns:
//  (dan.math.Vector2)
{
    return dan.math.Vector2.fromElements((this.start[0] + this.end[0]) / 2, (this.start[1] + this.end[1]) / 2);
};

// + + + }}}

// + + }}}

// + + Set {{{

// These methods will resize the rectangle

dan.math.Rect2.prototype.setLeftTop = function (i_leftTop)
// Params:
//  i_leftTop:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Rect2)
{
    this.start[0] = i_leftTop[0];
    this.start[1] = i_leftTop[1];
    return this;
};

dan.math.Rect2.prototype.setRightTop = function (i_rightTop)
// Params:
//  i_rightTop:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Rect2)
{
    this.end[0] = i_rightTop[0];
    this.start[1] = i_rightTop[1];
    return this;
};

dan.math.Rect2.prototype.setLeftBottom = function (i_leftBottom)
// Params:
//  i_leftBottom:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Rect2)
{
    this.start[0] = i_leftBottom[0];
    this.end[1] = i_leftBottom[1];
    return this;
};

dan.math.Rect2.prototype.setRightBottom = function (i_rightBottom)
// Params:
//  i_rightBottom:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (dan.math.Rect2)
{
    this.end[0] = i_rightBottom[0];
    this.end[1] = i_rightBottom[1];
    return this;
};

// + + }}}

// + }}}

// + Set predicates {{{

dan.math.Rect2.prototype.intersects = function (i_other)
// Params:
//  i_other: (dan.math.Rect2)
//
// Returns:
//  (boolean)
{
    // If any one dimension doesn't intersect, the whole rectangle doesn't
    return !( (i_other.end[0] <= this.start[0]) ||
              (i_other.end[1] <= this.start[1]) ||
              (i_other.start[0] >= this.end[0]) ||
              (i_other.start[1] >= this.end[1]) );
};

dan.math.Rect2.prototype.contains = function (i_xOrVector2, i_y)
// Check whether this rectangle contains a point.
//
// This test is asymmetrical;
// if the point falls on a start border then it is considered to be contained,
// but if it point falls on an end border then it is considered to be outside.
// This tends to be the desired behaviour when using integer values.
//
// Mode 1:
//  Params:
//   i_xOrVector2: (float)
//   i_y: (float)
//
// Mode 2:
//  Params:
//   i_xOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_y: Ignored.
//
// Returns:
//  (boolean)
{
    if (i_xOrVector2 instanceof dan.math.Vector2 || i_xOrVector2 instanceof Array)
    {
        return (i_xOrVector2[0] >= this.start[0]) && (i_xOrVector2[0] < this.end[0]) &&
               (i_xOrVector2[1] >= this.start[1]) && (i_xOrVector2[1] < this.end[1]);
    }
    else
    {
        return (i_xOrVector2 >= this.start[0]) && (i_xOrVector2 < this.end[0]) &&
               (i_y >= this.start[1]) && (i_y < this.end[1]);
    }
};

// + }}}

// + Set operations {{{

// + + Member versions, modifying 'this' {{{

dan.math.Rect2.prototype.intersection = function (i_other)
// Params:
//  i_other:
//   (dan.math.Rect2)
//
// Returns:
//  (dan.math.Rect2)
{
    var newLeft  = Math.max(this.start[0], i_other.start[0]);
    var newRight = Math.min(this.end[0], i_other.end[0]);
    if (newRight < newLeft)
        newRight = newLeft;

    var newTop    = Math.max(this.start[1], i_other.start[1]);
    var newBottom = Math.min(this.end[1], i_other.end[1]);
    if (newBottom < newTop)
        newBottom = newTop;

    this.start[0] = newLeft;
    this.end[0] = newRight;
    this.start[1] = newTop;
    this.end[1] = newBottom;

    return this;
};

dan.math.Rect2.prototype.union_ = function (i_other)
// Params:
//  i_other:
//   (dan.math.Rect2)
//
// Returns:
//  (dan.math.Rect2)
{
    this.start[0] = Math.min(this.start[0], i_other.start[0]);
    this.end[0] = Math.max(this.end[0], i_other.end[0]);
    this.start[1] = Math.min(this.start[1], i_other.start[1]);
    this.end[1] = Math.max(this.end[1], i_other.end[1]);

    return this;
};

// + + }}}

// + + Non-member versions, returning new object {{{

dan.math.Rect2.intersection = function (i_rect1, i_rect2)
// Params:
//  i_rect1:
//   (dan.math.Rect2)
//  i_rect2:
//   (dan.math.Rect2)
//
// Returns:
//  (dan.math.Rect2)
{
    return i_rect1.clone().intersect(i_rect2);
};

dan.math.Rect2.union_ = function (i_rect1, i_rect2)
// Params:
//  i_rect1:
//   (dan.math.Rect2)
//  i_rect2:
//   (dan.math.Rect2)
//
// Returns:
//  (dan.math.Rect2)
{
    return i_rect1.clone().union(i_rect2);
};

// + + }}}

// + }}}

// + Move {{{

// + + Relatively {{{

// + + + Member versions, modifying 'this' {{{

dan.math.Rect2.prototype.add = function (i_xOrVector2, i_y)
// Mode 1:
//  Params:
//   i_xOrVector2: (float)
//   i_y: (float)
//
// Mode 2:
//  Params:
//   i_point:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_y: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    if (i_xOrVector2 instanceof dan.math.Vector2 || i_xOrVector2 instanceof Array)
    {
        this.start[0] += i_xOrVector2[0];
        this.end[0] += i_xOrVector2[0];
        this.start[1] += i_xOrVector2[1];
        this.end[1] += i_xOrVector2[1];
    }
    else
    {
        this.start[0] += i_xOrVector2;
        this.end[0] += i_xOrVector2;
        this.start[1] += i_y;
        this.end[1] += i_y;
    }

    return this;
};
dan.math.Rect2.prototype.offset = dan.math.Rect2.prototype.add;

// + + + }}}

// + + + Non-member versions, returning new object {{{

dan.math.Rect2.add = function (i_rect, i_xOrVector2, i_y)
// Mode 1:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_xOrVector2: (float)
//   i_y: (float)
//
// Mode 2:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_xOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_y: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    return i_rect.clone().offset(i_xOrVector2, i_y);
};
dan.math.Rect2.offset = dan.math.Rect2.add;

// + + + }}}

// + + }}}

// + + Absolutely aligning an anchor point {{{

// + + + Member versions, modifying 'this' {{{

// + + + + Corners {{{

dan.math.Rect2.prototype.moveByLeftTop = function (i_leftOrVector2, i_top)
// Move the rectangle (not resizing it) so that its top-left is at a specified point.
//
// Mode 1:
//  Params:
//   i_leftOrVector2: (float)
//   i_top: (float)
//
// Mode 2:
//  Params:
//   i_leftOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_top: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    if (i_leftOrVector2 instanceof dan.math.Vector2 || i_leftOrVector2 instanceof Array)
        return this.offset(i_leftOrVector2[0] - this.start[0], i_leftOrVector2[1] - this.start[1]);
    else
        return this.offset(i_leftOrVector2 - this.start[0], i_top - this.start[1]);
};

dan.math.Rect2.prototype.moveByRightTop = function (i_rightOrVector2, i_top)
// Move the rectangle (not resizing it) so that its top-right is at a specified point.
//
// Mode 1:
//  Params:
//   i_rightOrVector2: (float)
//   i_top: (float)
//
// Mode 2:
//  Params:
//   i_rightOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_top: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    if (i_rightOrVector2 instanceof dan.math.Vector2 || i_rightOrVector2 instanceof Array)
        return this.offset(i_rightOrVector2[0] - this.end[0], i_rightOrVector2[1] - this.start[1]);
    else
        return this.offset(i_rightOrVector2 - this.end[0], i_top - this.start[1]);
};

dan.math.Rect2.prototype.moveByLeftBottom = function (i_leftOrVector2, i_bottom)
// Move the rectangle (not resizing it) so that its bottom-left is at a specified point.
//
// Mode 1:
//  Params:
//   i_leftOrVector2: (float)
//   i_bottom: (float)
//
// Mode 2:
//  Params:
//   i_leftOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_bottom: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    if (i_leftOrVector2 instanceof dan.math.Vector2 || i_leftOrVector2 instanceof Array)
        return this.offset(i_leftOrVector2[0] - this.start[0], i_leftOrVector2[1] - this.end[1]);
    else
        return this.offset(i_leftOrVector2 - this.start[0], i_bottom - this.end[1]);
};

dan.math.Rect2.prototype.moveByRightBottom = function (i_rightOrVector2, i_bottom)
// Move the rectangle (not resizing it) so that its bottom-right is at a specified point.
//
// Mode 1:
//  Params:
//   i_rightOrVector2: (float)
//   i_bottom: (float)
//
// Mode 2:
//  Params:
//   i_rightOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_bottom: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    if (i_rightOrVector2 instanceof dan.math.Vector2 || i_rightOrVector2 instanceof Array)
        return this.offset(i_rightOrVector2[0] - this.end[0], i_rightOrVector2[1] - this.end[1]);
    else
        return this.offset(i_rightOrVector2 - this.end[0], i_bottom - this.end[1]);
};

// + + + + }}}

// + + + + Centres of edges {{{

dan.math.Rect2.prototype.moveByLeftCentre = function (i_leftOrVector2, i_centre)
// Move the rectangle (not resizing it) so that its centre-left is at a specified point.
//
// Mode 1:
//  Params:
//   i_leftOrVector2: (float)
//   i_centre: (float)
//
// Mode 2:
//  Params:
//   i_leftOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_centre: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    if (i_leftOrVector2 instanceof dan.math.Vector2 || i_leftOrVector2 instanceof Array)
        return this.offset(i_leftOrVector2[0] - this.start[0], i_leftOrVector2[1] - (this.start[1] + this.end[1]) / 2);
    else
        return this.offset(i_leftOrVector2 - this.start[0], i_centre - (this.start[1] + this.end[1]) / 2);
};

dan.math.Rect2.prototype.moveByCentreTop = function (i_centreOrVector2, i_top)
// Move the rectangle (not resizing it) so that its top-centre is at a specified point.
//
// Mode 1:
//  Params:
//   i_centreOrVector2: (float)
//   i_top: (float)
//
// Mode 2:
//  Params:
//   i_centreOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_top: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    if (i_centreOrVector2 instanceof dan.math.Vector2 || i_centreOrVector2 instanceof Array)
        return this.offset(i_centreOrVector2[0] - (this.start[0] + this.end[0]) / 2, i_centreOrVector2[1] - this.start[1]);
    else
        return this.offset(i_centreOrVector2 - (this.start[0] + this.end[0]) / 2, i_top - this.start[1]);
};

dan.math.Rect2.prototype.moveByRightCentre = function (i_rightOrVector2, i_centre)
// Move the rectangle (not resizing it) so that its centre-right is at a specified point.
//
// Mode 1:
//  Params:
//   i_rightOrVector2: (float)
//   i_centre: (float)
//
// Mode 2:
//  Params:
//   i_rightOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_centre: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    if (i_rightOrVector2 instanceof dan.math.Vector2 || i_rightOrVector2 instanceof Array)
        return this.offset(i_rightOrVector2[0] - this.end[0], i_rightOrVector2[1] - (this.start[1] + this.end[1]) / 2);
    else
        return this.offset(i_rightOrVector2 - this.end[0], i_centre - (this.start[1] + this.end[1]) / 2);
};

dan.math.Rect2.prototype.moveByCentreBottom = function (i_centreOrVector2, i_bottom)
// Move the rectangle (not resizing it) so that its bottom-centre is at a specified point.
//
// Mode 1:
//  Params:
//   i_centreOrVector2: (float)
//   i_bottom: (float)
//
// Mode 2:
//  Params:
//   i_centreOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_bottom: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    if (i_centreOrVector2 instanceof dan.math.Vector2 || i_centreOrVector2 instanceof Array)
        return this.offset(i_centreOrVector2[0] - (this.start[0] + this.end[0]) / 2, i_centreOrVector2[1] - this.end[1]);
    else
        return this.offset(i_centreOrVector2 - (this.start[0] + this.end[0]) / 2, i_bottom - this.end[1]);
};

// + + + + }}}

// + + + + Centre of area {{{

dan.math.Rect2.prototype.moveByCentre = function (i_xOrVector2, i_y)
// Move the rectangle (not resizing it) so that its centre is at a specified point.
//
// Mode 1:
//  Params:
//   i_xOrVector2: (float)
//   i_y: (float)
//
// Mode 2:
//  Params:
//   i_xOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_y: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    if (i_xOrVector2 instanceof dan.math.Vector2 || i_xOrVector2 instanceof Array)
        return this.offset(i_xOrVector2[0] - (this.start[0] + this.end[0]) / 2, i_xOrVector2[1] - (this.start[1] + this.end[1]) / 2);
    else
        return this.offset(i_xOrVector2 - (this.start[0] + this.end[0]) / 2, i_y - (this.start[1] + this.end[1]) / 2);
};

// + + + + }}}

// + + + }}}

// + + + Non-member versions, returning new object {{{

// + + + + Corners {{{

dan.math.Rect2.moveByLeftTop = function (i_rect, i_leftOrVector2, i_top)
// Move a rectangle (not resizing it) so that its top-left is at a specified point.
//
// Mode 1:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_leftOrVector2: (float)
//   i_top: (float)
//
// Mode 2:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_leftOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_top: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    return i_rect.clone().moveByLeftTop(i_leftOrVector2, i_top);
};

dan.math.Rect2.moveByRightTop = function (i_rect, i_rightOrVector2, i_top)
// Move a rectangle (not resizing it) so that its top-right is at a specified point.
//
// Mode 1:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_rightOrVector2: (float)
//   i_top: (float)
//
// Mode 2:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_rightOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_top: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    return i_rect.clone().moveByRightTop(i_rightOrVector2, i_top);
};

dan.math.Rect2.moveByLeftBottom = function (i_rect, i_leftOrVector2, i_bottom)
// Move a rectangle (not resizing it) so that its bottom-left is at a specified point.
//
// Mode 1:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_leftOrVector2: (float)
//   i_bottom: (float)
//
// Mode 2:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_leftOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_bottom: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    return i_rect.clone().moveByLeftBottom(i_leftOrVector2, i_bottom);
};

dan.math.Rect2.moveByRightBottom = function (i_rect, i_rightOrVector2, i_bottom)
// Move a rectangle (not resizing it) so that its bottom-right is at a specified point.
//
// Mode 1:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_rightOrVector2: (float)
//   i_bottom: (float)
//
// Mode 2:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_rightOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_bottom: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    return i_rect.clone().moveByRightBottom(i_rightOrVector2, i_bottom);
};

// + + + + }}}

// + + + + Centres of edges {{{

dan.math.Rect2.moveByLeftCentre = function (i_rect, i_leftOrVector2, i_centre)
// Move a rectangle (not resizing it) so that its centre-left is at a specified point.
//
// Mode 1:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_leftOrVector2: (float)
//   i_centre: (float)
//
// Mode 2:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_leftOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_centre: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    return i_rect.clone().moveByLeftCentre(i_leftOrVector2, i_centre);
};

dan.math.Rect2.moveByCentreTop = function (i_rect, i_centreOrVector2, i_top)
// Move a rectangle (not resizing it) so that its top-centre is at a specified point.
//
// Mode 1:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_centreOrVector2: (float)
//   i_top: (float)
//
// Mode 2:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_centreOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_top: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    return i_rect.clone().moveByCentreTop(i_centreOrVector2, i_top);
};

dan.math.Rect2.moveByRightCentre = function (i_rect, i_rightOrVector2, i_centre)
// Move a rectangle (not resizing it) so that its centre-right is at a specified point.
//
// Mode 1:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_rightOrVector2: (float)
//   i_centre: (float)
//
// Mode 2:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_rightOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_centre: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    return i_rect.clone().moveByRightCentre(i_rightOrVector2, i_centre);
};

dan.math.Rect2.moveByCentreBottom = function (i_rect, i_centreOrVector2, i_bottom)
// Move a rectangle (not resizing it) so that its bottom-centre is at a specified point.
//
// Mode 1:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_centreOrVector2: (float)
//   i_bottom: (float)
//
// Mode 2:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_centreOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_bottom: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    return i_rect.clone().moveByCentreBottom(i_centreOrVector2, i_bottom);
};

// + + + + }}}

// + + + + Centre of area {{{

dan.math.Rect2.moveByCentre = function (i_rect, i_xOrVector2, i_y)
// Move a rectangle (not resizing it) so that its centre is at a specified point.
//
// Mode 1:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_xOrVector2: (float)
//   i_y: (float)
//
// Mode 2:
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_xOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_y: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    return i_rect.clone().moveByCentre(i_xOrVector2, i_y);
};

// + + + + }}}

// + + + }}}

// + + }}}

// + }}}

// + Change size {{{

// + + Member versions, modifying 'this' {{{

dan.math.Rect2.prototype.inflate = function (i_xOrVector2, i_y)
// Mode 1:
//  Add i_xOrVector2 and i_y to both sides of the rectangle
//  Params:
//   i_xOrVector2: (float)
//   i_y: (float)
//
// Mode 2:
//  Add i_xOrVector2.x and i_xOrVector2.y to both sides of the rectangle
//  Params:
//   i_xOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_y: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    if (i_xOrVector2 instanceof dan.math.Vector2 || i_xOrVector2 instanceof Array)
    {
        this.start[0] -= i_xOrVector2[0];
        this.start[1] -= i_xOrVector2[1];
        this.end[0] += i_xOrVector2[0];
        this.end[1] += i_xOrVector2[1];
    }
    else
    {
        this.start[0] -= i_xOrVector2;
        this.start[1] -= i_y;
        this.end[0] += i_xOrVector2;
        this.end[1] += i_y;
    }

    return this;
};

dan.math.Rect2.prototype.fitLetterboxed = function (i_container, i_align)
// Reposition and (without changing its aspect ratio) resize this rectangle
// to fit fully inside a container rectangle with letterboxing,
// ie. one pair of this rectangle's opposing edges will touch the container's edges precisely,
// such that the other pair of this rectangle's opposing edges will lie inside the container's
// edges leaving some unused 'black borders' space.
//
// Params:
//  i_container:
//   (dan.math.Rect2)
//   The rectangle to fit this one within.
//  i_align:
//   Either (float)
//    How to align the resulting rectangle in the underfitting dimension;
//    or in other words, the relative size of the letterbox borders.
//    0.5:
//     align in centre; make both borders the same size
//    0:
//     align at left or top; make the left or top border zero and the opposite
//     border full size
//    1:
//     align at right or bottom; make the right or bottom border zero and the
//     opposite border full size
//   or (null or undefined)
//    Use default of 0.5.
//
// Returns:
//  (dan.math.Rect2)
{
    // Apply default arguments
    if (i_align === null || i_align === undefined)
        i_align = 0.5;

    // Find the scaling required to make the horizontal edges fit exactly,
    // and the vertical edges fit exactly
    var requiredHorizontalScale = i_container.width() / this.width();
    var requiredVerticalScale = i_container.height() / this.height();
    // Use the smaller of the two
    if (requiredHorizontalScale < requiredVerticalScale)
    {
        this.start[0] = i_container.start[0];
        this.end[0] = i_container.end[0];
        var combinedBorderSize = i_container.height() - this.height() * requiredHorizontalScale;
        this.start[1] = i_container.start[1] + i_align * combinedBorderSize;
        this.end[1] = i_container.end[1] - (1 - i_align) * combinedBorderSize;
    }
    else
    {
        this.start[1] = i_container.start[1];
        this.end[1] = i_container.end[1];
        var combinedBorderSize = i_container.width() - this.width() * requiredVerticalScale;
        this.start[0] = i_container.start[0] + i_align * combinedBorderSize;
        this.end[0] = i_container.end[0] - (1 - i_align) * combinedBorderSize;
    }

    return this;
};

dan.math.Rect2.prototype.fitPanned = function (i_container, i_align)
// Reposition and (without changing its aspect ratio) resize this rectangle
// to fit inside a container rectangle with panning,
// ie. one pair of this rectangle's opposing edges will touch the container's edges precisely,
// such that the other pair of this rectangle's opposing edges will lie outside the container's
// edges causing some of the rectangle to be cropped by the container.
//
// Params:
//  i_container:
//   (dan.math.Rect2)
//   The rectangle to fit this one within.
//  i_align:
//   Either (float)
//    How to align the resulting rectangle in the overfitting dimension;
//    or in other words, the relative size of the cropped areas.
//    0.5:
//     align in centre; crop equal amounts on both sides
//    0:
//     align at / pan to left or top;
//     crop nothing from the left or top and crop fully from the right or bottom
//    1:
//     align at / pan to right or bottom;
//     crop nothing from the right or bottom and crop fully from the left or top
//   or (null or undefined)
//    Use default of 0.5.
//
// Returns:
//  (dan.math.Rect2)
{
    // Apply default arguments
    if (i_align === null || i_align === undefined)
        i_align = 0.5;

    // Find the scaling required to make the horizontal edges fit exactly,
    // and the vertical edges fit exactly
    var requiredHorizontalScale = i_container.width() / this.width();
    var requiredVerticalScale = i_container.height() / this.height();
    // Use the larger of the two
    if (requiredHorizontalScale > requiredVerticalScale)
    {
        this.start[0] = i_container.start[0];
        this.end[0] = i_container.end[0];
        var combinedBorderSize = i_container.height() - this.height() * requiredHorizontalScale;
        this.start[1] = i_container.start[1] + i_align * combinedBorderSize;
        this.end[1] = i_container.end[1] - (1 - i_align) * combinedBorderSize;
    }
    else
    {
        this.start[1] = i_container.start[1];
        this.end[1] = i_container.end[1];
        var combinedBorderSize = i_container.width() - this.width() * requiredVerticalScale;
        this.start[0] = i_container.start[0] + i_align * combinedBorderSize;
        this.end[0] = i_container.end[0] - (1 - i_align) * combinedBorderSize;
    }

    return this;
};

// + + }}}

// + + Non-member versions, returning new object {{{

dan.math.Rect2.inflate = function (i_rect, i_xOrVector2, i_y)
// Mode 1:
//  Add i_xOrVector2 and i_y to both sides of the rectangle
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_xOrVector2: (float)
//   i_y: (float)
//
// Mode 2:
//  Add i_xOrVector2.x and i_xOrVector2.y to both sides of the rectangle
//  Params:
//   i_rect: (dan.math.Rect2)
//   i_xOrVector2:
//    Either (dan.math.Vector2)
//    or (array of 2 floats)
//   i_y: Ignored.
//
// Returns:
//  (dan.math.Rect2)
{
    return i_rect.clone().inflate(i_xOrVector2, i_y);
};

dan.math.Rect2.fitLetterboxed = function (i_rect, i_container, i_align)
// Reposition and (without changing its aspect ratio) resize a rectangle
// to fit fully inside a container rectangle with letterboxing,
// ie. one pair of the rectangle's opposing edges will touch the container's edges precisely,
// such that the other pair of the rectangle's opposing edges will lie inside the container's
// edges leaving some unused 'black borders' space.
//
// Params:
//  i_rect:
//   (dan.math.Rect2)
//   The rectangle to fit.
//  i_container:
//   (dan.math.Rect2)
//   The rectangle to fit within.
//  i_align:
//   Either (float)
//    How to align the resulting rectangle in the underfitting dimension;
//    or in other words, the relative size of the letterbox borders.
//    0.5:
//     align in centre; make both borders the same size
//    0:
//     align at left or top; make the left or top border zero and the opposite
//     border full size
//    1:
//     align at right or bottom; make the right or bottom border zero and the
//     opposite border full size
//   or (null or undefined)
//    Use default of 0.5.
//
// Returns:
//  (dan.math.Rect2)
{
    return i_rect.clone().fitLetterboxed(i_container, i_align);
};

dan.math.Rect2.fitPanned = function (i_rect, i_container, i_align)
// Reposition and (without changing its aspect ratio) resize a rectangle
// to fit inside a container rectangle with panning,
// ie. one pair of the rectangle's opposing edges will touch the container's edges precisely,
// such that the other pair of the rectangle's opposing edges will lie outside the container's
// edges causing some of the rectangle to be cropped by the container.
//
// Params:
//  i_rect:
//   (dan.math.Rect2)
//   The rectangle to fit.
//  i_container:
//   (dan.math.Rect2)
//   The rectangle to fit within.
//  i_align:
//   Either (float)
//    How to align the resulting rectangle in the overfitting dimension;
//    or in other words, the relative size of the cropped areas.
//    0.5:
//     align in centre; crop equal amounts on both sides
//    0:
//     align at / pan to left or top;
//     crop nothing from the left or top and crop fully from the right or bottom
//    1:
//     align at / pan to right or bottom;
//     crop nothing from the right or bottom and crop fully from the left or top
//   or (null or undefined)
//    Use default of 0.5.
//
// Returns:
//  (dan.math.Rect2)
{
    return i_rect.clone().fitPanned(i_container, i_align);
};

// + + }}}

// + }}}

// + Comparison operators {{{

dan.math.Rect2.prototype.isEqual = function (i_other)
// Params:
//  i_other: (dan.math.Rect2)
//
// Returns:
//  (boolean)
{
    return ((i_other.start[0] == this.start[0]) &&
            (i_other.start[1] == this.start[1]) &&
            (i_other.end[0] == this.end[0]) &&
            (i_other.end[1] == this.end[1]));
};

dan.math.Rect2.prototype.isNotEqual = function (i_other)
// Params:
//  i_other: (dan.math.Rect2)
//
// Returns:
//  (boolean)
{
    return ((i_other.start[0] != this.start[0]) ||
            (i_other.start[1] != this.start[1]) ||
            (i_other.end[0] != this.end[0]) ||
            (i_other.end[1] != this.end[1]));
};

// + }}}

// + Normalize {{{

dan.math.Rect2.prototype.normalizeOrientation = function ()
// Returns:
//  (dan.math.Rect2)
{
    if (this.start[0] > this.end[0])
    {
        var temp = this.start[0];
        this.start[0] = this.end[0];
        this.end[0] = temp;
    }
    if (this.start[1] > this.end[1])
    {
        var temp = this.start[1];
        this.start[1] = this.end[1];
        this.end[1] = temp;
    }
    return this;
};

// + }}}
