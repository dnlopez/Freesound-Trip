
// This namespace
// #require "math.js"
// #require "Vector2.js"
// #require "Circle2.js"

// 2D geometric functions.

// index from ch10 geometric algorithms
//  distance
//   euclidean distance
//   manhattan distance
//  area
//   triangle area
//   polygon area
//  perimeter
//   polygon perimeter
//  direction
//   clockwise
//  intersection
//   line intersection
//  inclusion
//   point in triangle
//   point in quad
//   point in polygon
//  boundaries
//   bounding box
//   convex hull
//   tangents
//  closest pair of points



// + Area {{{

dan.math.polygonArea = function (i_polygon)
// Get the area of a polygon.
// Based on code from PolyK
//
// Params:
//  i_polygon:
//   Either (array of dan.math.Vector2)
//   or (array of array of 2 floats)
//   Polygon to get the area of.
//   Can be convex or concave [but should probably by simple?]
//
// Returns:
//  (float number)
//  The area of the polygon.
{
    // If there are less than 3 points then there is no area
    if (i_polygon.length < 3)
        return 0;

    // Total up the cross products of each pair of adjacent edge vectors

    // Could basically use code such as
    //  var point1_x = i_polygon[pointNo][0];
    //  var point1_y = i_polygon[pointNo][1];
    //  var point2_x = i_polygon[pointNo + 1][0];
    //  var point2_y = i_polygon[pointNo + 1][1];
    //  var point3_x = i_polygon[pointNo + 2][0];
    //  var point3_y = i_polygon[pointNo + 2][1];
    //  var edge1_x = point2_x - point1_x;
    //  var edge1_y = point2_y - point1_x;
    //  var edge2_x = point3_x - point2_x;
    //  var edge2_y = point3_y - point2_x;
    //  sum += edge1_x * edge2_y - edge1_y * edge2_x;
    //
    // Though when you multiply that out for one pair of edges, terms where like coordinates
    // are multiplied (eg. point1_x * point2_x) cancel out,
    // and in adding the results for every pair of edges, terms where coordinates of
    // non-adjacent points are multiplied (eg. point1_x * point3_y) also cancel out,
    // meaning this is equivalent when run on each pair of points:
    //  sum += point1_x * point2_y - point1_y * point2_x;
    //
    // Below, this has been further optimized to the following with one less multiplication:
    //  sum += (point2_x - point1_x) * (point1_y + point2_y);
    // which after multiplying out and summing for each pair of points, amounts to the same
    // thing by similar cancelling out of terms.
    var sum = 0;
    var nearEndPointNo = i_polygon.length - 1;
    for (var pointNo = 0; pointNo < nearEndPointNo; ++pointNo)
        sum += (i_polygon[pointNo + 1][0] - i_polygon[pointNo][0]) * (i_polygon[pointNo][1] + i_polygon[pointNo + 1][1]);
    sum += (i_polygon[0][0] - i_polygon[nearEndPointNo][0]) * (i_polygon[nearEndPointNo][1] + i_polygon[0][1]);

    // Divide by 2 to get area
    return -sum * 0.5;
};

// + }}}

// + Turn direction, convexity {{{

dan.math.turnDirection = function (i_pointA, i_pointB, i_pointC)
// Find which clock direction to turn in to change from the direction of one vector to another.
//
// Params:
//  i_pointA, i_pointB, i_pointC:
//   (dan.math.Vector2)
//   Points at the end of the vectors.
//   The vectors then considered are AB and BC.
//   (Note that considering AB and AC will also give the same result.)
//
// Returns:
//  (number)
//  Assuming x-axis increases rightwards and y-axis increases upwards,
//  positive: anti-clockwise turn
//  zero: no turn (vectors are parallel)
//  negative: clockwise turn
//  (If y-axis increases downwards then results are reversed.)
{
    // Return size of z component of cross-product AB x BC
    var ab_x = i_pointB[0] - i_pointA[0];
    var ab_y = i_pointB[1] - i_pointA[1];
    var bc_x = i_pointC[0] - i_pointB[0];
    var bc_y = i_pointC[1] - i_pointB[1];
    return ab_x * bc_y - ab_y * bc_x;
};

dan.math.polygonConvexity = function (i_polygon)
// Check whether polygon is convex, and if so find the winding order,
// ie. whether turns are either all clockwise or all anti-clockwise (straight non-turns are
// ignored), and return which clock direction they all were.
//
// Returns:
//  (number)
//  Assuming x-axis increases rightwards and y-axis increases upwards,
//  1: All turns were anti-clockwise (or straight)
//  0: All turns were straight
//  -1: All turns were clockwise (or straight)
//  (If y-axis increases downwards then results are reversed.)
{
    if (i_polygon.length < 3)
        return 0;

    var polygonTurnDirection = 0;
    for (var pointNo = 0; pointNo < i_polygon.length; ++pointNo)
    {
        var turnDirection = dan.math.turnDirection(
            i_polygon[pointNo],
            i_polygon[(pointNo + 1) % i_polygon.length],
            i_polygon[(pointNo + 2) % i_polygon.length]);

        //
        if (turnDirection > 0)
            turnDirection = 1;
        else if (turnDirection < 0)
            turnDirection = -1;

        if (polygonTurnDirection == 0)
        {
            polygonTurnDirection = turnDirection;
        }
        else if (turnDirection != 0 && turnDirection != polygonTurnDirection)
        {
            polygonTurnDirection = 0;
            break;
        }
    }

    return polygonTurnDirection;
};

// + }}}

// + Intersection/clipping {{{

dan.math.intersectLineWithLine = function (i_line1_point1, i_line1_point2,
                                           i_line2_point1, i_line2_point2)
// Find the point of intersection between two infinitely long lines.
//
// Based on code by Robert Penner.
//
// Params:
//  i_line1_point1, i_line1_point2:
//   (dan.math.Vector2)
//   Points on line 1
//  i_line2_point1, i_line2_point2:
//   (dan.math.Vector2)
//   Points on line 2
//
// Returns:
//  Either (dan.math.Vector2)
//   Point of intersection
//  or (null)
//   Lines are parallel
// 
// Works by equating lines to each other, each written in vector form:
//  _p:1_ + t:1 _d:1_ = _p:2_ + t:2 _d:2_
//
// Rearrange to matrix equation in form Ax=b:
//  t:1 _d:1_ - t:2 _d:2_ = _p:2_ - _p:1_
//
//  / d:1:x  -d:2:x \ / t:1 \   / p:2:x - p:1:x \
//  |               | |     | = |               |
//  \ d:1:y  -d:2:y / \ t:2 /   \ p:2:y - p:1:y /
{
    var d11 = i_line1_point2[0] - i_line1_point1[0];
    var d21 = i_line1_point2[1] - i_line1_point1[1];
    var d12 = -(i_line2_point2[0] - i_line2_point1[0]);
    var d22 = -(i_line2_point2[1] - i_line2_point1[1]);

    var p1 = i_line2_point1[0] - i_line1_point1[0];
    var p2 = i_line2_point1[1] - i_line1_point1[1];

    // If determinant == 0, lines are parallel, no single solution
    if (d11 * d22 - d12 * d21 == 0)
        return null;

    // If top-left pivot == 0, swap rows
    if (d11 == 0)
    {
        var temp = d11;
        d11 = d21;
        d21 = temp;

        temp = d12;
        d12 = d22;
        d22 = temp;

        temp = p1;
        p1 = p2;
        p2 = temp;
    }

    // Make bottom-left entry == 0 by subtracting multiple of row 1
    var row1Multiplier = -d21/d11;
    d21 = 0;
    d22 += row1Multiplier * d12;
    p2 += row1Multiplier * p1;

    // Solve -d22 t2 = p2, for t2
    var t2 = p2 / d22;

    // 
    return dan.math.Vector2.fromElements(
        i_line2_point1[0] + t2 * (i_line2_point2[0] - i_line2_point1[0]),
        i_line2_point1[1] + t2 * (i_line2_point2[1] - i_line2_point1[1]));
};

dan.math.intersectCircleWithCircle = function (i_circle1, i_circle2)
// Find the point or points at which the circumferences of two circles intersect.
//
// See:
//  http://paulbourke.net/geometry/circlesphere/
//
// Params:
//  i_circle1:
//   (dan.math.Circle2)
//  i_circle2:
//   (dan.math.Circle2)
//
// Returns:
//  Either (array of dan.math.Vector2)
//   If the circles' circumferences are touching at one point,
//    that one point,
//   else if the circles are overlapping,
//    the two points at which the circumferences intersect.
//  or (integer number)
//   -1: The circles don't intersect because they are completely seperate
//   -2: The circles don't intersect because one is entirely contained within the other
//   -3: The circles are coincident (there are an infinite number of solutions)
{
    var distanceBetweenCentres = dan.math.Vector2.distance(i_circle1.centre, i_circle2.centre);

    // Test for failure cases
    //  If d > r0 + r1 then there are no solutions, the circles are separate
    if (distanceBetweenCentres > i_circle1.radius + i_circle2.radius)
        return -1;
    //  If d < |r0 - r1| then there are no solutions because one circle is contained within the other
    if (distanceBetweenCentres < Math.abs(i_circle1.radius - i_circle2.radius))
        return -2;
    //  If d = 0 and r0 = r1 then the circles are coincident and there are an infinite number of solutions
    if (distanceBetweenCentres == 0 && i_circle1.radius == i_circle2.radius)
        return -3;

    // Get distance from centre of circle 1 to cross point (midpoint between intersections)
    var a = (i_circle1.radius * i_circle1.radius
             - i_circle2.radius * i_circle2.radius
             + distanceBetweenCentres * distanceBetweenCentres) / (2 * distanceBetweenCentres);

    // Get position of cross point
    var unitVectorFromAToB = dan.math.Vector2.sub(i_circle2.centre, i_circle1.centre).normalize();
    var crossPoint = dan.math.Vector2.add(i_circle1.centre,
                                          dan.math.Vector2.muls(unitVectorFromAToB, a));

    // Get distance from cross point to each intersection
    var h = Math.sqrt(i_circle1.radius * i_circle1.radius - a * a);

    // Rotate unitVectorFromAToB by 90 degrees, multiply by h
    var vectorFromCrossPointToIntersection = dan.math.Vector2.fromXY(unitVectorFromAToB.y, -unitVectorFromAToB.x).muls(h);

    //
    if (vectorFromCrossPointToIntersection.x == 0 && vectorFromCrossPointToIntersection.y == 0)
        return [crossPoint];
    else
        return [dan.math.Vector2.add(crossPoint, vectorFromCrossPointToIntersection),
                dan.math.Vector2.sub(crossPoint, vectorFromCrossPointToIntersection)];
};

dan.math.clipPolygonWithPolygon = function (i_toClip, i_clipTo)
// Clip one arbitrary polygon to another using the Sutherland-Hodgman algorithm.
// aka intersectPolygonWithPolygon
//
// Params:
//  i_toClip:
//   (array of dan.math.Vector2)
//   Vertices of a polygon to be clipped. Vertices can be in any orientation.
//  i_clipTo:
//   (array of dan.math.Vector2)
//   Vertices of a polygon to clip to.
//   With x-axis increasing rightwards and y-axis increasing upwards, in anti-clockwise
//   orientation.
//
// Returns:
//  (array of dan.math.Vector2)
//  Clipped vertices, in the same orientation as they were in i_toClip.
//
// [TODO: edge cases like what if everything clipped]
{
    var clipped = [];
    for (var clipToEdgeNo = 0; clipToEdgeNo < i_clipTo.length; ++clipToEdgeNo)
    {
        var clipToEdge_start = i_clipTo[clipToEdgeNo];
        var clipToEdge_end;
        if (clipToEdgeNo < i_clipTo.length - 1)
            clipToEdge_end = i_clipTo[clipToEdgeNo + 1];
        else
            clipToEdge_end = i_clipTo[0];

        var previousVertex_position = i_toClip[i_toClip.length - 1];
        var previousVertex_isInside = dan.math.turnDirection(clipToEdge_start, clipToEdge_end,
                                                             previousVertex_position) <= 0;
        for (var toClipVertexNo = 0; toClipVertexNo < i_toClip.length; ++toClipVertexNo)
        {
            var vertex_position = i_toClip[toClipVertexNo];
            var vertex_isInside = dan.math.turnDirection(clipToEdge_start, clipToEdge_end,
                                                         vertex_position) <= 0;

            if (vertex_isInside != previousVertex_isInside)
            {
                clipped.push(dan.math.intersectLineWithLine(
                    clipToEdge_start, clipToEdge_end,
                    previousVertex_position, vertex_position));
                if (vertex_isInside)
                    clipped.push(vertex_position);
            }
            else if (vertex_isInside && previousVertex_isInside)
            {
                clipped.push(vertex_position);
            }

            previousVertex_position = vertex_position;
            previousVertex_isInside = vertex_isInside;
        }

        i_toClip = clipped;
        clipped = [];

        // If nothing left then don't bother with the other clip-to edges
        if (i_toClip.length == 0)
            break;
    }

    return i_toClip;
};

// + }}}

// + Inclusion {{{

/*
dan.math.pointInTriangle = function (i_point,
                                     i_triCornerA, i_triCornerB, i_triCornerC)
// Half-plane method
// http://stackoverflow.com/questions/2049582/how-to-determine-a-point-in-a-triangle
//
// [Think triangle winding order may be significant]
//
// Params:
//  i_point:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_triCornerA, i_triCornerB, i_triCornerC:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (boolean)
{
    var abSide = dan.math.turnDirection(i_triCornerA, i_triCornerB,
                                        i_point) <= 0;
    var bcSide = dan.math.turnDirection(i_triCornerB, i_triCornerC,
                                        i_point) <= 0;
    var caSide = dan.math.turnDirection(i_triCornerC, i_triCornerA,
                                        i_point) <= 0;
    return (abSide == bcSide) && (bcSide == caSide);
}
*/

dan.math.pointInTriangle = function (i_point,
                                     i_triCornerA, i_triCornerB, i_triCornerC)
// Barycentric coordinates method
// http://stackoverflow.com/questions/2049582/how-to-determine-a-point-in-a-triangle
// [Faster than half-plane method]
//
// [Is triangle winding order significant?]
//
// Params:
//  i_point:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_triCornerA, i_triCornerB, i_triCornerC:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (boolean)
{
    var triSideAC_x = i_triCornerC[0] - i_triCornerA[0];
    var triSideAC_y = i_triCornerC[1] - i_triCornerA[1];
    var triSideAB_x = i_triCornerB[0] - i_triCornerA[0];
    var triSideAB_y = i_triCornerB[1] - i_triCornerA[1];
    var pointToTriCornerA_x = i_point[0] - i_triCornerA[0];
    var pointToTriCornerA_y = i_point[1] - i_triCornerA[1];

    var dot00 = triSideAC_x * triSideAC_x + triSideAC_y * triSideAC_y;
    var dot01 = triSideAC_x * triSideAB_x + triSideAC_y * triSideAB_y;
    var dot02 = triSideAC_x * pointToTriCornerA_x + triSideAC_y * pointToTriCornerA_y;
    var dot11 = triSideAB_x * triSideAB_x + triSideAB_y * triSideAB_y;
    var dot12 = triSideAB_x * pointToTriCornerA_x + triSideAB_y * pointToTriCornerA_y;

    var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    // Check if point is in triangle
    return (u >= 0) && (v >= 0) && (u + v < 1);
};

dan.math.pointInPolygon = function (i_polygon, i_point)
//
// Params:
//  i_polygon:
//   Either (array of dan.math.Vector2)
//   or (array of array of 2 floats)
//  i_point:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//
// Returns:
//  (boolean)
{
    var pointCount = i_polygon.length;

    // These hold edge start and end positions relative to i_point.
    // Set edgeEnd_x/y to refer to the last point in polygon - the code afterwards will
    // subsequently shuffle it into edgeStart_x/y and get the first point into edgeEnd_x/y,
    // so dealing with the wrap around edge first.
    var edgeStart_x;
    var edgeStart_y;
    var edgeEnd_x = i_polygon[pointCount - 1][0] - i_point[0];
    var edgeEnd_y = i_polygon[pointCount - 1][1] - i_point[1];

    // Pre-iterate the polygon to end up with the last edge and whether it's going up or down
    var previousEdgeYIncreasing;
    for (var pointNo = 0; pointNo < pointCount; ++pointNo)
    {
        edgeStart_x = edgeEnd_x;
        edgeStart_y = edgeEnd_y;
        edgeEnd_x = i_polygon[pointNo][0] - i_point[0];
        edgeEnd_y = i_polygon[pointNo][1] - i_point[1];
        if (edgeStart_y == edgeEnd_y)
            continue;
        previousEdgeYIncreasing = edgeEnd_y > edgeStart_y;
    }

    // Before seeing any edges, assume point is outside
    var depth = 0;
    // For each edge, where pointNo is the point at the end of the edge
    for (var pointNo = 0; pointNo < pointCount; ++pointNo)
    {
        edgeStart_x = edgeEnd_x;
        edgeStart_y = edgeEnd_y;
        edgeEnd_x = i_polygon[pointNo][0] - i_point[0];
        edgeEnd_y = i_polygon[pointNo][1] - i_point[1];

        // If the whole edge is either above or below or to the left
        if ((edgeStart_y < 0 && edgeEnd_y < 0) ||
            (edgeStart_y > 0 && edgeEnd_y > 0) ||
            (edgeStart_x < 0 && edgeEnd_x < 0))
            continue;

        // If the edge is horizontal
        if (edgeStart_y == edgeEnd_y)
        {
            // If one of the edge points is on the left,
            // and other must be on the right due to a condition above
            // ie. the edge goes right through the test point
            if (Math.min(edgeStart_x, edgeEnd_x) <= 0)
                return true;
            // Else it's a horizontal edge that is clear to the left or right of the test point
            continue;
        }

        // Else the edge is not horizontal and has at least one point to the right of the test.
        // Find the edge's x at the y of the test point
        var edgeXAtTestPointY = edgeStart_x + (edgeEnd_x - edgeStart_x) * (-edgeStart_y) / (edgeEnd_y - edgeStart_y);
        // If it crosses right through the test point
        if (edgeXAtTestPointY == 0)
            return true;
        // If it crosses on the right of the test point
        if (edgeXAtTestPointY > 0)
            ++depth;

        if (edgeStart_y == 0 && previousEdgeYIncreasing && edgeEnd_y > edgeStart_y)
            --depth; // hit vertex, both up
        if (edgeStart_y == 0 && !previousEdgeYIncreasing && edgeEnd_y < edgeStart_y)
            --depth; // hit vertex, both down

        previousEdgeYIncreasing = edgeEnd_y > edgeStart_y;
    }

    return (depth & 1) == 1;
};

/*
PolyK.pointInRect = function (i_point, i_rectCorner1, i_rectCorner2)
// Check whether a point is in a rectangle.
//
// Params:
//  i_point:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_rectCorner1:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//    One corner of the rectangle.
//  i_rectCorner2:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//    The opposite corner of the rectangle.
{
    return i_point[0] >= Math.min(i_rectCorner1[0], i_rectCorner2[0]) &&
           i_point[0] <= Math.max(i_rectCorner1[0], i_rectCorner2[0]) &&
           i_point[1] >= Math.min(i_rectCorner1[1], i_rectCorner2[1]) &&
           i_point[1] <= Math.max(i_rectCorner1[1], i_rectCorner2[1]);
};
*/

// + }}}

// + Boundaries {{{

dan.math.pointToCircleTangents = function (i_point, i_circle)
// Construct tangents from a point to a circle.
//
// See:
//  http://www.cut-the-knot.org/Curriculum/Geometry/GeoGebra/Tangents.shtml
//
// Params:
//  i_point:
//   (dan.math.Vector2)
//  i_circle:
//   (dan.math.Circle2)
//
// Returns:
//  Either (array of dan.math.Vector2)
//   If i_circle has zero radius,
//    the one point on the circumference of i_circle at which there is a tangent (ie. its centre).
//   Else if i_point was on the circumference of i_circle,
//    the one point on the circumference of i_circle at which there is a tangent (ie. i_point).
//   else if i_point was outside i_circle,
//    the two points on the circumference of i_circle at which a line from each one back to i_point
//    is a tangent to i_circle.
//  or (integer number)
//   -1: Cannot compute tangents because i_point was inside i_circle
//   -2: Some other error occurred in an unforseen edge case (if get this, investigate to fix this function)
{
    // Construct auxiliary circle that goes through input point and centre of input circle
    var auxiliaryCircle = dan.math.Circle2.fromPointsOnCircumference(i_point, i_circle.centre);

    // Intersect the auxiliary circle with the input circle
    var intersections = dan.math.intersectCircleWithCircle(i_circle, auxiliaryCircle);
    if (typeof(intersections) == "number")
    {
        if (intersections == -2)
            return -1;
        else
            return -2;
    }

    //
    return intersections;
};

dan.math.circleToCircleOuterTangents = function (i_circle1, i_circle2)
// Construct outer tangents from one circle to another.
//
// See:
//  http://www.cut-the-knot.org/Curriculum/Geometry/GeoGebra/TangentToTwoCircles.shtml
//
// Params:
//  i_circle1:
//   (dan.math.Circle2)
//  i_circle2:
//   (dan.math.Circle2)
//
// Returns:
//  Either (array of array)
//   The two tangents.
//   Each element is:
//    (array of dan.math.Vector2)
//    The start point (on i_circle1) and end point (on i_circle2) of a tangent line.
//  or (dan.math.Vector2)
//   One circle was inside the other with their circumferences touching at one point,
//   and this is that point.
//  or (integer number)
//   -1: Cannot compute outer tangents because one circle was inside the other
//   -2: Some other error occurred in an unforseen edge case (if get this, investigate to fix this function)
{
    // If circles are the same size, treat as a special case
    if (i_circle1.radius == i_circle2.radius)
    {
        var circle1To2 = dan.math.Vector2.sub(i_circle2.centre, i_circle1.centre);
        var sideVector = dan.math.Vector2.fromXY(circle1To2.y, -circle1To2.x).normalize().muls(i_circle1.radius);

        return [
            //
            [dan.math.Vector2.add(i_circle1.centre, sideVector),
             dan.math.Vector2.add(i_circle2.centre, sideVector)],
            //
            [dan.math.Vector2.sub(i_circle1.centre, sideVector),
             dan.math.Vector2.sub(i_circle2.centre, sideVector)]
        ];
    }

    // Find smaller/bigger circle
    var smallerCircle, biggerCircle;
    if (i_circle1.radius < i_circle2.radius)
    {
        smallerCircle = i_circle1;
        biggerCircle = i_circle2;
    }
    else //if (i_circle1.radius > i_circle2.radius)
    {
        smallerCircle = i_circle2;
        biggerCircle = i_circle1;
    }

    // Shrink the bigger circle by the radius of the smaller,
    // then get tangents from smaller circle's centre to the shrunken bigger circle
    var shrunkenBiggerCircle = dan.math.Circle2.fromOR(biggerCircle.centre, biggerCircle.radius - smallerCircle.radius);
    var intersections = dan.math.pointToCircleTangents(smallerCircle.centre, shrunkenBiggerCircle);

    // If pointToCircleTangents() failed with a numbered error case,
    // reinterpret it and return our own error code
    // (though codes currently correspond so no translation is actually necessary)
    if (typeof(intersections) == "number")
    {
        return intersections;
    }
    // If point was on circumference,
    // it's because smaller circle was inside bigger circle with circumferences touching at one point;
    // return that point
    if (intersections.length == 1)
    {
        return intersections[0];
    }

    // Get vectors from centre of the bigger circle (shrunken or not, it is the same)
    // to the tangent points on the shrunken bigger circle,
    // normalized
    var centreToIntersection1 = dan.math.Vector2.sub(intersections[0], biggerCircle.centre).divs(shrunkenBiggerCircle.radius);
    var centreToIntersection2 = dan.math.Vector2.sub(intersections[1], biggerCircle.centre).divs(shrunkenBiggerCircle.radius);

    //
    return [
        //
        [ dan.math.Vector2.add(i_circle1.centre, dan.math.Vector2.muls(centreToIntersection1, i_circle1.radius)),
          dan.math.Vector2.add(i_circle2.centre, dan.math.Vector2.muls(centreToIntersection1, i_circle2.radius)) ],
        //
        [ dan.math.Vector2.add(i_circle1.centre, dan.math.Vector2.muls(centreToIntersection2, i_circle1.radius)),
          dan.math.Vector2.add(i_circle2.centre, dan.math.Vector2.muls(centreToIntersection2, i_circle2.radius)) ]
    ];
};

dan.math.circleToCircleInnerTangents = function (i_circle1, i_circle2)
// Construct inner tangents from one circle to another.
//
// See:
//  http://www.cut-the-knot.org/Curriculum/Geometry/GeoGebra/TangentToTwoCircles.shtml
//
// Params:
//  i_circle1:
//   (dan.math.Circle2)
//  i_circle2:
//   (dan.math.Circle2)
//
// Returns:
//  Either (array of array)
//   The two tangents.
//   Each element is:
//    (array of dan.math.Vector2)
//    The start point (on i_circle1) and end point (on i_circle2) of a tangent line.
//  or (dan.math.Vector2)
//   The circles' circumferences are touching at one point,
//   and this is that point.
//  or (integer number)
//   -1: Cannot compute inner tangents because the circles intersect
//   -2: Some other error occurred in an unforseen edge case (if get this, investigate to fix this function)
{
    // Find smaller/bigger circle
    var smallerCircle, biggerCircle;
    if (i_circle1.radius <= i_circle2.radius)
    {
        smallerCircle = i_circle1;
        biggerCircle = i_circle2;
    }
    else //if (i_circle1.radius > i_circle2.radius)
    {
        smallerCircle = i_circle2;
        biggerCircle = i_circle1;
    }

    // Inflate the smaller circle by the radius of the bigger,
    // then get tangents from bigger circle's centre to the inflated smaller circle
    var inflatedSmallerCircle = dan.math.Circle2.fromOR(smallerCircle.centre, smallerCircle.radius + biggerCircle.radius);
    var intersections = dan.math.pointToCircleTangents(biggerCircle.centre, inflatedSmallerCircle);

    // If pointToCircleTangents() failed with a numbered error case,
    // reinterpret it and return our own error code
    // (though codes currently correspond so no translation is actually necessary)
    if (typeof(intersections) == "number")
    {
        return intersections;
    }
    // If point was on circumference,
    // it's because circle circumferences were touching at one point;
    // return that point
    if (intersections.length == 1)
    {
        return intersections[0];
    }

    // Get vectors from centre of the smaller circle (inflated or not, it is the same)
    // to the tangent points on the inflated smaller circle,
    // normalized
    var centreToIntersection1 = dan.math.Vector2.sub(intersections[0], smallerCircle.centre).divs(inflatedSmallerCircle.radius);
    var centreToIntersection2 = dan.math.Vector2.sub(intersections[1], smallerCircle.centre).divs(inflatedSmallerCircle.radius);

    //
    if (i_circle1.radius <= i_circle2.radius)
    {
        return [
            //
            [ dan.math.Vector2.add(i_circle1.centre, dan.math.Vector2.muls(centreToIntersection1, i_circle1.radius)),
              dan.math.Vector2.add(i_circle2.centre, dan.math.Vector2.muls(centreToIntersection1, -i_circle2.radius)) ],
            //
            [ dan.math.Vector2.add(i_circle1.centre, dan.math.Vector2.muls(centreToIntersection2, i_circle1.radius)),
              dan.math.Vector2.add(i_circle2.centre, dan.math.Vector2.muls(centreToIntersection2, -i_circle2.radius)) ]
        ];
    }
    else //if (i_circle1.radius > i_circle2.radius)
    {
        return [
            //
            [ dan.math.Vector2.add(i_circle1.centre, dan.math.Vector2.muls(centreToIntersection1, -i_circle1.radius)),
              dan.math.Vector2.add(i_circle2.centre, dan.math.Vector2.muls(centreToIntersection1, i_circle2.radius)) ],
            //
            [ dan.math.Vector2.add(i_circle1.centre, dan.math.Vector2.muls(centreToIntersection2, -i_circle1.radius)),
              dan.math.Vector2.add(i_circle2.centre, dan.math.Vector2.muls(centreToIntersection2, i_circle2.radius)) ]
        ];
    }
};

// + }}}

// + TODO (understand and comment) {{{

dan.math.triangulatePolygon = function (i_polygon)
// Params:
//  i_polygon:
//   Either (array of dan.math.Vector2)
//   or (array of array of 2 floats)
//
// Returns:
//  (array of integer number)
//  Each three elements are the indices of a triangle.
{
    var pointCount = i_polygon.length;
    if (pointCount < 3)
        return [];

    var indexList = [];
    for (var pointNo = 0; pointNo < pointCount; ++pointNo)
        indexList.push(pointNo);
    var indexListLength = pointCount;

    // Initially look for anti-clockwise-turning triples of points to form our triangles.
    // Later if this isn't working we'll change this to false and start again to try and
    // find clockwise-turning triples instead.
    var treatAnticlockwiseAsConvex = true;

    var trianglePoints = [];
    var i = 0;
    while (indexListLength > 3)
    {
        var pointA_index = indexList[(i + 0) % indexListLength];
        var pointB_index = indexList[(i + 1) % indexListLength];
        var pointC_index = indexList[(i + 2) % indexListLength];

        var pointA = i_polygon[pointA_index];
        var pointB = i_polygon[pointB_index];
        var pointC = i_polygon[pointC_index];

        // Check whether the next three points form a convex 'ear'
        // in the turning direction we're currently looking for
        // ie. first check whether they turn in the right direction, then if so
        // check that no other points fall in the triangle formed by the three points
        var earFound = false;
        if ((dan.math.turnDirection(pointA, pointB, pointC) >= 0) ^ (!treatAnticlockwiseAsConvex))
        {
            earFound = true;

            for (var pointNo = 0; pointNo < indexListLength; ++pointNo)
            {
                var vi = indexList[pointNo];
                if (vi === pointA_index || vi === pointB_index || vi === pointC_index)
                    continue;

                if (dan.math.pointInTriangle(i_polygon[vi],
                                             pointA, pointB, pointC))
                {
                    earFound = false;
                    break;
                }
            }
        }

        // If found a convex ear then 'chop it off' -
        // put indices of it in the result set,
        // remove the apex point from the remainder set,
        // and start scanning the remainder set again from the beginning
        if (earFound)
        {
            trianglePoints.push(pointA_index, pointB_index, pointC_index);
            indexList.splice((i + 1) % indexListLength, 1);
            --indexListLength;
            i = 0;
        }
        else if (i++ > 3 * indexListLength)
        {
            // need to flip flip reverse it!
            // reset!
            if (treatAnticlockwiseAsConvex)
            {
                trianglePoints = [];
                indexList = [];
                for (pointNo = 0; pointNo < pointCount; ++pointNo)
                    indexList.push(pointNo);
                indexListLength = pointCount;

                i = 0;
                treatAnticlockwiseAsConvex = false;
            }
            else
            {
                window.console.log("PIXI Warning: shape too complex to fill");
                return [];
            }
        }
    }

    trianglePoints.push(indexList[0], indexList[1], indexList[2]);
    return trianglePoints;
};

// + }}}

// + Old {{{

dan.math.intersect2Lines = function (i_line1_start, i_line1_end,
                                     i_line2_start, i_line2_end)
// Find the point of intersection between two lines.
//
// Based on code by Robert Penner.
//
// Params:
//  i_line1_start, i_line1_end:
//   (dan.Point)
//   Points on line 1
//  i_line2_start, i_line2_end:
//   (dan.Point)
//   Points on line 2
//
// Returns:
//  Either (dan.Point)
//   Point of intersection
//  or (null)
//   Lines are parallel
// 
// Works by equating lines to each other, each written in vector form:
//  _p:1_ + t:1 _d:1_ = _p:2_ + t:2 _d:2_
//
// Rearrange to matrix equation in form Ax=b:
//  t:1 _d:1_ - t:2 _d:2_ = _p:2_ - _p:1_
//
//  / d:1:x  -d:2:x \ / t:1 \   / p:2:x - p:1:x \
//  |               | |     | = |               |
//  \ d:1:y  -d:2:y / \ t:2 /   \ p:2:y - p:1:y /
{
    var d11 = i_line1_end.x - i_line1_start.x;
    var d21 = i_line1_end.y - i_line1_start.y;
    var d12 = -(i_line2_end.x - i_line2_start.x);
    var d22 = -(i_line2_end.y - i_line2_start.y);

    var p1 = i_line2_start.x - i_line1_start.x;
    var p2 = i_line2_start.y - i_line1_start.y;

    // If determinant == 0, lines are parallel, no single solution
    if (d11 * d22 - d12 * d21 == 0)
        return null;

    // If top-left pivot == 0, swap rows
    if (d11 == 0)
    {
        var temp = d11;
        d11 = d21;
        d21 = temp;

        temp = d12;
        d12 = d22;
        d22 = temp;

        temp = p1;
        p1 = p2;
        p2 = temp;
    }

    // Make bottom-left entry == 0 by subtracting multiple of row 1
    var row1Multiplier = -d21/d11;
    d21 = 0;
    d22 += row1Multiplier * d12;
    p2 += row1Multiplier * p1;

    // Solve -d22 t2 = p2, for t2
    var t2 = p2 / d22;

    // 
    return dan.Point.fromXY(i_line2_start.x + t2 * (i_line2_end.x - i_line2_start.x),
                            i_line2_start.y + t2 * (i_line2_end.y - i_line2_start.y));
};

// + }}}

// + Utilities {{{

dan.math.removeNearPoints = function (io_points, i_minDistance, i_circular)
// Remove points from an array which are too close to the one before.
//
// Params:
//  io_points:
//   (array of dan.math.Vector2)
//  i_minDistance:
//   (number)
//  i_circular:
//   (boolean)
//
// Returns:
//  (integer number)
//  Count of points deleted.
{
    var deletedPointCount = 0;

    var pointNo = 1;
    while (pointNo < io_points.length)
    {
        if (dan.math.Vector2.distance(io_points[pointNo], io_points[pointNo - 1]) < i_minDistance)
        {
            io_points.splice(pointNo, 1);
            ++deletedPointCount;
        }
        else
            ++pointNo;
    }

    if (i_circular)
    {
        while (io_points.length >= 2)
        {
            if (dan.math.Vector2.distance(io_points[0], io_points[io_points.length - 1]) >= i_minDistance)
                break;

            io_points.pop();
            ++deletedPointCount;
        }
    }

    return deletedPointCount;
};

dan.math.filterOutDuplicatePoints = function (i_points, i_circular)
// Copy an array of points while removing adjacent duplicates.
//
// Params:
//  i_points:
//   Either (array of dan.math.Vector2)
//   or (array of array of 2 floats)
//  i_circular:
//   (boolean)
//
// Returns:
//  (array of array of 2 floats)
{
    // If there are less than 2 points then there can't be any duplicates
    if (i_points.length < 2)
        return i_points;

    // Start with first point
    var unduplicatedPoints = [i_points[0]];
    // For each successive point, keep it if it's different from the previous one
    for (var pointNo = 1; pointNo < i_points.length; ++pointNo)
    {
        if (unduplicatedPoints[unduplicatedPoints.length - 1][0] != i_points[pointNo][0] ||
            unduplicatedPoints[unduplicatedPoints.length - 1][1] != i_points[pointNo][1])
            unduplicatedPoints.push(i_points[pointNo]);
    }

    // If circular, throw away the last point if it's the same as the first
    if (i_circular)
        if (unduplicatedPoints[0][0] == unduplicatedPoints[unduplicatedPoints.length - 1][0] &&
            unduplicatedPoints[0][1] == unduplicatedPoints[unduplicatedPoints.length - 1][1])
            unduplicatedPoints.pop();

    //
    return unduplicatedPoints;
};

// + }}}
