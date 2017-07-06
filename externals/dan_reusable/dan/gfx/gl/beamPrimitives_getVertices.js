
// This namespace
// #require "gl.js"

// Dan reusable
// #require <dan/math/Vector2.js>
// #require <dan/math/geometry.js>


dan.gfx.gl.rectBeam_getVertices = function (
    i_corner, i_size, i_width, i_alignment, i_colour,
    o_vertices, o_indices)
// Build a rectangle stroke
//
// Params:
//  i_corner:
//   Either (array of dan.math.Vector2)
//   or (array of array of 2 floats)
//  i_size:
//   Either (array of dan.math.Vector2)
//   or (array of array of 2 floats)
//  i_width:
//   (float number)
//  i_alignment:
//   (float number)
//   How to laterally align the stroke to the rectangle.
//   0.5: Middle of stroke aligns with rectangle
//   0: Negative (outer) side of stroke aligns with rectangle (inner border)
//   1: Positive (inner) side of stroke aligns with rectangle (outer border)
//  i_colour:
//   Either (dan.gfx.ColourRGBA)
//    Colour for line
//   or (array of 2 dan.gfx.ColourRGBA)
//    Colours for negative (outer) and positive (inner) edges of stroke respectively.
//
// Returns:
//  o_vertices:
//   (array of number)
//   Vertex attributes for successive vertices are pushed onto this array.
//  o_indices:
//   (array of number)
//   Indices for successive vertices are pushed onto this array.
{
    var x = i_corner[0];
    var y = i_corner[1];
    var width = i_size[0];
    var height = i_size[1];

    // Get colour and alpha components ready
    var negativeSideAlpha, negativeSideR, negativeSideG, negativeSideB;
    var positiveSideAlpha, positiveSideR, positiveSideG, positiveSideB;
    if (i_colour instanceof dan.gfx.ColourRGBA)
    {
        negativeSideAlpha = positiveSideAlpha = i_colour.a;
        negativeSideR = positiveSideR = i_colour.r;
        negativeSideG = positiveSideG = i_colour.g;
        negativeSideB = positiveSideB = i_colour.b;
    }
    else
    {
        negativeSideAlpha = i_colour[0].a;
        negativeSideR = i_colour[0].r;
        negativeSideG = i_colour[0].g;
        negativeSideB = i_colour[0].b;
        positiveSideAlpha = i_colour[1].a;
        positiveSideR = i_colour[1].r;
        positiveSideG = i_colour[1].g;
        positiveSideB = i_colour[1].b;
    }

    //
    var outputPointCountAtStart = o_vertices.valueCount() / 8;

    var negativeSideWidth = i_width * i_alignment;
    var positiveSideWidth = i_width - negativeSideWidth;

    //
    o_vertices.push(x, y,
                    -negativeSideWidth, -negativeSideWidth,
                    negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
    o_vertices.push(x, y,
                    +positiveSideWidth, +positiveSideWidth,
                    positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);

    o_vertices.push(x + width, y,
                    +negativeSideWidth, -negativeSideWidth,
                    negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
    o_vertices.push(x + width, y,
                    -positiveSideWidth, +positiveSideWidth,
                    positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);

    o_vertices.push(x + width, y + height,
                    +negativeSideWidth, +negativeSideWidth,
                    negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
    o_vertices.push(x + width, y + height,
                    -positiveSideWidth, -positiveSideWidth,
                    positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);

    o_vertices.push(x, y + height,
                    -negativeSideWidth, +negativeSideWidth,
                    negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
    o_vertices.push(x, y + height,
                    +positiveSideWidth, -positiveSideWidth,
                    positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);

    // Push indices to form triangles
    // with duplicate vertex at start and end to make degenerate triangles to seperate
    // from other primitives in this batch
    o_indices.push(outputPointCountAtStart + 0,
                   outputPointCountAtStart + 0, outputPointCountAtStart + 1,
                   outputPointCountAtStart + 2, outputPointCountAtStart + 3,
                   outputPointCountAtStart + 4, outputPointCountAtStart + 5,
                   outputPointCountAtStart + 6, outputPointCountAtStart + 7,
                   outputPointCountAtStart + 0, outputPointCountAtStart + 1,
                   outputPointCountAtStart + 1);
};

dan.gfx.gl.trianglesBeam_getVertices = function (
    i_points, i_width, i_alignment, i_colour, i_join,
    o_vertices, o_indices)
// Build a number of triangle strokes
//
// Params:
//  i_points:
//   Either (array of dan.math.Vector2)
//   or (array of array of 2 floats)
//  i_width:
//   (float number)
//  i_alignment:
//   (float number)
//   How to laterally align the stroke to the vertices.
//   0.5: Middle of stroke aligns with vertices
//   0: Negative side of stroke aligns with vertices
//   1: Positive side of stroke aligns with vertices
//  i_colour:
//   Either (dan.gfx.ColourRGBA)
//    Colour for line
//   or (array of 2 dan.gfx.ColourRGBA)
//    Colours for negative (outer) and positive (inner) edges of stroke respectively.
//  i_join:
//   Either (string)
//    One of "miter", "bevel"
//   or (number)
//    Miter join if its size would be less than or equal to this number, bevel join otherwise
//
// Returns:
//  o_vertices:
//   (array of number)
//   Vertex attributes for successive vertices are pushed onto this array.
//  o_indices:
//   (array of number)
//   Indices for successive vertices are pushed onto this array.
{
    // Validate that point count is a multiple of 3
    if ((i_points.length % 3) != 0)
        return;

    for (var pointNo = 0; pointNo < i_points.length; pointNo += 3)
    {
        dan.gfx.gl.polygonBeam_getVertices(i_points.slice(pointNo, pointNo + 3), i_width, i_alignment, i_colour, i_join, true,
                                           o_vertices, o_indices);
    }
};

dan.gfx.gl.polygonBeam_getVertices = function (
    i_points, i_width, i_alignment, i_colour, i_join, i_closed,
    o_vertices, o_indices)
// Build a line
//
// Params:
//  i_points:
//   Either (array of dan.math.Vector2)
//   or (array of array of 2 floats)
//  i_width:
//   (float number)
//  i_alignment:
//   (float number)
//   How to laterally align the stroke to the vertices.
//   0.5: Middle of stroke aligns with vertices
//   0: Negative side of stroke aligns with vertices
//   1: Positive side of stroke aligns with vertices
//  i_colour:
//   Either (dan.gfx.ColourRGBA)
//    Colour for line
//   or (array of 2 dan.gfx.ColourRGBA)
//    Colours for negative and positive edges of stroke respectively.
//  i_join:
//   Either (string)
//    One of "miter", "bevel"
//   or (number)
//    Miter join if its size would be less than or equal to this number, bevel join otherwise
//  i_closed:
//   (boolean)
//
// Returns:
//  o_vertices:
//   (array of number)
//   Vertex attributes for successive vertices are pushed onto this array.
//  o_indices:
//   (array of number)
//   Indices for successive vertices are pushed onto this array.
{
    if (i_points.length < 2)
        return;

    // Unduplicate points
    var points = dan.math.filterOutDuplicatePoints(i_points, i_closed);
    if (points.length < 2)
        return;

    // If the line width is an odd number add 0.5 to every coordinate to align to a whole pixel
    if (i_width % 2)
    {
        for (var pointNo = 0; pointNo < points.length; ++pointNo)
        {
            points[pointNo][0] += 0.5;
            points[pointNo][1] += 0.5;
        }
    }

    //
    var outputPointCountAtStart = o_vertices.valueCount() / 8;

    // Get colour and alpha components ready
    var negativeSideAlpha, negativeSideR, negativeSideG, negativeSideB;
    var positiveSideAlpha, positiveSideR, positiveSideG, positiveSideB;
    if (i_colour instanceof dan.gfx.ColourRGBA)
    {
        negativeSideAlpha = positiveSideAlpha = i_colour.a;
        negativeSideR = positiveSideR = i_colour.r;
        negativeSideG = positiveSideG = i_colour.g;
        negativeSideB = positiveSideB = i_colour.b;
    }
    else
    {
        negativeSideAlpha = i_colour[0].a;
        negativeSideR = i_colour[0].r;
        negativeSideG = i_colour[0].g;
        negativeSideB = i_colour[0].b;
        positiveSideAlpha = i_colour[1].a;
        positiveSideR = i_colour[1].r;
        positiveSideG = i_colour[1].g;
        positiveSideB = i_colour[1].b;
    }

    // Get (half of) line width ready
    var halfWidth = i_width / 2;

    // Get lateral shift for each point as a fraction of the line width
    // then *2 to base that same distance on half the width, for convenience in usage below
    // then negate to shift in the opposite direction to the alignment direction
    var pointLateralShift = -(i_alignment - 0.5) * 2;

    // For each point
    // (if path is closed, do first point twice)
    // (Maybe TODO: don't generate first point twice but instead duplicate start index at end)
    var pointCount = points.length;
    var plotPointCount = pointCount;
    if (i_closed)
        ++plotPointCount;
    for (var pointNo = 0; pointNo < plotPointCount; ++pointNo)
    {
        // Maybe TODO: merge the first two branches of this 'if'
        if (!i_closed && pointNo == 0)
        {
            // For the first two points, get x and y coordinates
            var point0_x = points[0][0];
            var point0_y = points[0][1];
            var point1_x = points[1][0];
            var point1_y = points[1][1];

            // Get components of line from 1st point to 2nd point,
            // swap and negate one to turn it +90 degrees
            var seg01_perpX = -(point1_y - point0_y);
            var seg01_perpY = point1_x - point0_x;
            // Normalize components and scale up to halfWidth
            var dist = Math.sqrt(seg01_perpX*seg01_perpX + seg01_perpY*seg01_perpY);
            if (dist == 0)
                continue;
            seg01_perpX /= dist;
            seg01_perpY /= dist;
            seg01_perpX *= halfWidth;
            seg01_perpY *= halfWidth;

            //
            var point0LateralShift_x = seg01_perpX * pointLateralShift;
            var point0LateralShift_y = seg01_perpY * pointLateralShift;

            // Store the two points on the start end of the line quad
            o_vertices.push(point0_x, point0_y,
                            point0LateralShift_x - seg01_perpX, point0LateralShift_y - seg01_perpY,
                            negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
            o_vertices.push(point0_x, point0_y,
                            point0LateralShift_x + seg01_perpX, point0LateralShift_y + seg01_perpY,
                            positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);
        }
        else if (!i_closed && pointNo == pointCount - 1)
        {
            // For the last two points, get x and y coordinates
            var point0_x = points[pointCount - 2][0];
            var point0_y = points[pointCount - 2][1];
            var point1_x = points[pointCount - 1][0];
            var point1_y = points[pointCount - 1][1];

            // Get components of line from penultimate point to last point,
            // swap and negate one to turn it +90 degrees
            var seg01_perpX = -(point1_y - point0_y);
            var seg01_perpY = point1_x - point0_x;
            // Normalize components and scale up to halfWidth
            var dist = Math.sqrt(seg01_perpX*seg01_perpX + seg01_perpY*seg01_perpY);
            if (dist == 0)
                continue;
            seg01_perpX /= dist;
            seg01_perpY /= dist;
            seg01_perpX *= halfWidth;
            seg01_perpY *= halfWidth;

            //
            var point1LateralShift_x = seg01_perpX * pointLateralShift;
            var point1LateralShift_y = seg01_perpY * pointLateralShift;

            // Store the two points on the end end of the line quad
            o_vertices.push(point1_x, point1_y,
                            point1LateralShift_x - seg01_perpX, point1LateralShift_y - seg01_perpY,
                            negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
            o_vertices.push(point1_x, point1_y,
                            point1LateralShift_x + seg01_perpX, point1LateralShift_y + seg01_perpY,
                            positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);
        }
        else
        {
            // Get the number of the point previous to the current, current, and next,
            // wrapping around if necessary
            var point1_no = pointNo;
            if (point1_no >= pointCount)
                point1_no = 0;
            var point0_no = point1_no - 1;
            if (point0_no < 0)
                point0_no = pointCount - 1;
            var point2_no = point1_no + 1;
            if (point2_no >= pointCount)
                point2_no = 0;

            // For each point, get the x and y coordinates
            var point0_x = points[point0_no][0];
            var point0_y = points[point0_no][1];
            var point1_x = points[point1_no][0];
            var point1_y = points[point1_no][1];
            var point2_x = points[point2_no][0];
            var point2_y = points[point2_no][1];

            // Get components of line from previous point to current point,
            // swap and negate one to turn it +90 degrees
            var seg01_perpX = -(point1_y - point0_y);
            var seg01_perpY = point1_x - point0_x;
            // Normalize components and scale up to halfWidth
            var dist = Math.sqrt(seg01_perpX*seg01_perpX + seg01_perpY*seg01_perpY);
            if (dist == 0)
                continue;
            seg01_perpX /= dist;
            seg01_perpY /= dist;
            seg01_perpX *= halfWidth;
            seg01_perpY *= halfWidth;

            // Get components of line from current point to next point,
            // swap and negate one to turn it +90 degrees
            var seg12_perpX = -(point2_y - point1_y);
            var seg12_perpY = point2_x - point1_x;
            // Normalize components and scale up to halfWidth
            dist = Math.sqrt(seg12_perpX*seg12_perpX + seg12_perpY*seg12_perpY);
            if (dist == 0)
                continue;
            seg12_perpX /= dist;
            seg12_perpY /= dist;
            seg12_perpX *= halfWidth;
            seg12_perpY *= halfWidth;

            //
            var point0LateralShift_x, point0LateralShift_y;
            var point1LateralShift_x, point1LateralShift_y;
            var point2LateralShift_x, point2LateralShift_y;
            var laterallyShiftedPoint0_x;
            var laterallyShiftedPoint0_y;
            var laterallyShiftedPoint1_x;
            var laterallyShiftedPoint1_y;
            var laterallyShiftedPoint2_x;
            var laterallyShiftedPoint2_y;
            if (pointLateralShift == 0)
            {
                point0LateralShift_x = 0;
                point0LateralShift_y = 0;
                laterallyShiftedPoint0_x = point0_x;
                laterallyShiftedPoint0_y = point0_y;

                point1LateralShift_x = 0;
                point1LateralShift_y = 0;
                laterallyShiftedPoint1_x = point1_x;
                laterallyShiftedPoint1_y = point1_y;

                point2LateralShift_x = 0;
                point2LateralShift_y = 0;
                laterallyShiftedPoint2_x = point2_x;
                laterallyShiftedPoint2_y = point2_y;
            }
            else //if (pointLateralShift != 0)
            {
                // Laterally move the points which are on one segment only
                point0LateralShift_x = seg01_perpX * pointLateralShift;
                point0LateralShift_y = seg01_perpY * pointLateralShift;
                laterallyShiftedPoint0_x = point0_x + point0LateralShift_x;
                laterallyShiftedPoint0_y = point0_y + point0LateralShift_y;

                point2LateralShift_x = seg12_perpX * pointLateralShift;
                point2LateralShift_y = seg12_perpY * pointLateralShift;
                laterallyShiftedPoint2_x = point2_x + point2LateralShift_x;
                laterallyShiftedPoint2_y = point2_y + point2LateralShift_y;

                // Move the shared point individually for each segment and find the
                // new shared point by calling function to intersect the segments
                var point1OnSegment0 = [point1_x + seg01_perpX * pointLateralShift, point1_y + seg01_perpY * pointLateralShift];
                var point1OnSegment1 = [point1_x + seg12_perpX * pointLateralShift, point1_y + seg12_perpY * pointLateralShift];
                var newPoint1 = dan.math.intersectLineWithLine(
                    [laterallyShiftedPoint0_x, laterallyShiftedPoint0_y],
                    point1OnSegment0,
                    point1OnSegment1,
                    [laterallyShiftedPoint2_x, laterallyShiftedPoint2_y]);

                // Take intersection point
                if (newPoint1 != null)
                {
                    point1LateralShift_x = newPoint1[0] - point1_x;
                    point1LateralShift_y = newPoint1[1] - point1_y;
                    laterallyShiftedPoint1_x = newPoint1[0];
                    laterallyShiftedPoint1_y = newPoint1[1];
                }
                else
                {
                    // If segments were parallel, just take the laterally moved point from
                    // the first segment, as both should be the same anyway
                    point1LateralShift_x = point1OnSegment0[0] - point1_x;
                    point1LateralShift_y = point1OnSegment0[1] - point1_y;
                    laterallyShiftedPoint1_x = point1OnSegment0[0];
                    laterallyShiftedPoint1_y = point1OnSegment0[1];
                }
            }

            // Intersect negative-side border of each quad
            var negativeBordersIntersection = dan.math.intersectLineWithLine(
                [laterallyShiftedPoint0_x - seg01_perpX, laterallyShiftedPoint0_y - seg01_perpY],
                [laterallyShiftedPoint1_x - seg01_perpX, laterallyShiftedPoint1_y - seg01_perpY],
                [laterallyShiftedPoint1_x - seg12_perpX, laterallyShiftedPoint1_y - seg12_perpY],
                [laterallyShiftedPoint2_x - seg12_perpX, laterallyShiftedPoint2_y - seg12_perpY]);

            // If the borders, and thus the lines themselves, are parallel
            if (negativeBordersIntersection === null)
            {
                o_vertices.push(point1_x, point1_y,
                                point1LateralShift_x - seg01_perpX, point1LateralShift_y - seg01_perpY,
                                negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
                o_vertices.push(point1_x, point1_y,
                                point1LateralShift_x + seg01_perpX, point1LateralShift_y + seg01_perpY,
                                positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);
                continue;
            }

            var positiveBordersIntersection = [
                laterallyShiftedPoint1_x - (negativeBordersIntersection[0] - laterallyShiftedPoint1_x),
                laterallyShiftedPoint1_y - (negativeBordersIntersection[1] - laterallyShiftedPoint1_y)];

            // Get the direction of turn from segment 01 to segment 12,
            // used in various places below
            // TODO: use the vars instead?
            var turnDirection = dan.math.turnDirection(points[point0_no], points[point1_no], points[point2_no]);

            // Find whether the angle between the two segments is acute enough that the
            // 'bookend' border at either end of the segment pair overlaps with the other
            // segment coming down back past it (if that other segment extended infinitely).
            // This changes the shape we're trying to triangulate, generally making things
            // much more complicated - needing more triangles, possibly being unsymmetrical
            // and the overlap confuses the behaviour of things like vertex colours.
            var bookendsDontOverlap;
            // If the two segments are a positive turn
            if (turnDirection >= 0)
            {
                // Ends don't overlap if
                bookendsDontOverlap =
                    // The positive-side border of 1st segment turning to the
                    // positive-side vertex of the 2nd segment end point is also a positive turn
                    (dan.math.turnDirection(
                        [laterallyShiftedPoint0_x + seg01_perpX, laterallyShiftedPoint0_y + seg01_perpY],
                        [laterallyShiftedPoint1_x + seg01_perpX, laterallyShiftedPoint1_y + seg01_perpY],
                        [laterallyShiftedPoint2_x + seg12_perpX, laterallyShiftedPoint2_y + seg12_perpY]) > 0)
                    &&
                    // The positive-side border of 2nd segment in reverse turning to the
                    // positive-side vertex of the 1st segment start point is a negative turn
                    (dan.math.turnDirection(
                        [laterallyShiftedPoint2_x + seg12_perpX, laterallyShiftedPoint2_y + seg12_perpY],
                        [laterallyShiftedPoint1_x + seg12_perpX, laterallyShiftedPoint1_y + seg12_perpY],
                        [laterallyShiftedPoint0_x + seg01_perpX, laterallyShiftedPoint0_y + seg01_perpY]) < 0);
            }
            // Else if the two segments are a negative turn
            else
            {
                // Ends don't overlap if
                bookendsDontOverlap =
                    // The negative-side border of 1st segment turning to the
                    // negative-side vertex of the 2nd segment end point is also a negative turn
                    (dan.math.turnDirection(
                        [laterallyShiftedPoint0_x - seg01_perpX, laterallyShiftedPoint0_y - seg01_perpY],
                        [laterallyShiftedPoint1_x - seg01_perpX, laterallyShiftedPoint1_y - seg01_perpY],
                        [laterallyShiftedPoint2_x - seg12_perpX, laterallyShiftedPoint2_y - seg12_perpY]) < 0)
                    &&
                    // The negative-side border of 2nd segment in reverse turning to the
                    // negative-side vertex of the 1st segment start point is a positive turn
                    (dan.math.turnDirection(
                        [laterallyShiftedPoint2_x - seg12_perpX, laterallyShiftedPoint2_y - seg12_perpY],
                        [laterallyShiftedPoint1_x - seg12_perpX, laterallyShiftedPoint1_y - seg12_perpY],
                        [laterallyShiftedPoint0_x - seg01_perpX, laterallyShiftedPoint0_y - seg01_perpY]) > 0);
            }
            //bookendsDontOverlap = true;

            // If specified a numerical miter limit then decide now whether the miter would
            // be too big or not
            var join;
            if (typeof(i_join) == "number")
            {
                // Get the miter size, the distance from the intersection of the negative
                // side border of each quad to the positive-side intersection that lies
                // symmetrically on the other side of the central line vertex - hence, double
                // the half-distance that we do have.
                //
                // We leave the distance squared as we're only using it for a comparison -
                // and thus multiply by 4 to do the above doubling instead of 2.
                var miterSizeSquared = 4 * dan.math.Vector2.temp().setFromElements(
                    negativeBordersIntersection[0] - laterallyShiftedPoint1_x, negativeBordersIntersection[1] - laterallyShiftedPoint1_y).normSquared();

                if (miterSizeSquared > i_join * i_join)
                    join = "bevel";
                else
                    join = "miter";
            }
            else
                join = i_join;

            // If the bookend borders don't overlap,
            // we can construct our line with non-overlapping triangles
            if (bookendsDontOverlap)
            {
                // Choose type of join
                if (join == "bevel")
                {
                    // Positive turn
                    if (turnDirection >= 0)
                    {
                        // Incoming shoulder
                        o_vertices.push(point1_x, point1_y,
                                        point1LateralShift_x - seg01_perpX, point1LateralShift_y - seg01_perpY,
                                        negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
                        // Inner elbow
                        o_vertices.push(point1_x, point1_y,
                                        positiveBordersIntersection[0] - point1_x, positiveBordersIntersection[1] - point1_y,
                                        positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);

                        // If looping back to first point don't draw overlap
                        if (!(i_closed && pointNo == pointCount))
                        {
                            // Middle of bevel edge
                            o_vertices.push(point1_x, point1_y,
                                            point1LateralShift_x - (seg01_perpX + seg12_perpX)/2, point1LateralShift_y - (seg01_perpY + seg12_perpY)/2,
                                            negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
                            // Repeat previous to reset triangle strip
                            o_vertices.push(point1_x, point1_y,
                                            point1LateralShift_x - (seg01_perpX + seg12_perpX)/2, point1LateralShift_y - (seg01_perpY + seg12_perpY)/2,
                                            negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
                            // Outgoing shoulder
                            o_vertices.push(point1_x, point1_y,
                                            point1LateralShift_x - seg12_perpX, point1LateralShift_y - seg12_perpY,
                                            negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
                            // Inner elbow
                            o_vertices.push(point1_x, point1_y,
                                            positiveBordersIntersection[0] - point1_x, positiveBordersIntersection[1] - point1_y,
                                            positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);
                        }
                    }
                    // Negative turn
                    else
                    {
                        // Inner elbow
                        o_vertices.push(point1_x, point1_y,
                                        negativeBordersIntersection[0] - point1_x, negativeBordersIntersection[1] - point1_y,
                                        negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
                        // Incoming shoulder
                        o_vertices.push(point1_x, point1_y,
                                        point1LateralShift_x + seg01_perpX, point1LateralShift_y + seg01_perpY,
                                        positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);

                        // If looping back to first point don't draw overlap
                        if (!(i_closed && pointNo == pointCount))
                        {
                            // Middle of bevel edge
                            o_vertices.push(point1_x, point1_y,
                                            point1LateralShift_x + (seg01_perpX + seg12_perpX)/2, point1LateralShift_y + (seg01_perpY + seg12_perpY)/2,
                                            positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);
                            // Repeat previous to reset triangle strip
                            o_vertices.push(point1_x, point1_y,
                                            point1LateralShift_x + (seg01_perpX + seg12_perpX)/2, point1LateralShift_y + (seg01_perpY + seg12_perpY)/2,
                                            positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);
                            // Inner elbow
                            o_vertices.push(point1_x, point1_y,
                                            negativeBordersIntersection[0] - point1_x, negativeBordersIntersection[1] - point1_y,
                                            negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
                            // Outgoing shoulder
                            o_vertices.push(point1_x, point1_y,
                                            point1LateralShift_x + seg12_perpX, point1LateralShift_y + seg12_perpY,
                                            positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);
                        }
                    }
                }
                else //if (join == "miter")
                {
                    // If positive turn this is the outer elbow
                    // If negative turn this is the inner elbow
                    o_vertices.push(point1_x, point1_y,
                                    negativeBordersIntersection[0] - point1_x, negativeBordersIntersection[1] - point1_y,
                                    negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
                    // The opposite elbow to the above
                    o_vertices.push(point1_x, point1_y,
                                    positiveBordersIntersection[0] - point1_x, positiveBordersIntersection[1] - point1_y,
                                    positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);
                }
            }
            // Else if the bookend borders do overlap,
            // the task of filling the resulting shape with non-overlapping triangles is more
            // complicated than I have been able to work out yet.
            // This outputs vertices that at least cover the correct area though some parts
            // may be drawn twice, which unfortunately will show if using transparency.
            else
            {
                // Choose type of join
                if (join == "bevel")
                {
                    // Positive turn
                    if (turnDirection >= 0)
                    {
                        // Incoming shoulder
                        o_vertices.push(point1_x, point1_y,
                                        point1LateralShift_x - seg01_perpX, point1LateralShift_y - seg01_perpY,
                                        negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
                        // Outgoing shoulder
                        o_vertices.push(point1_x, point1_y,
                                        point1LateralShift_x - seg12_perpX, point1LateralShift_y - seg12_perpY,
                                        negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
                        // Incoming shoulder
                        o_vertices.push(point1_x, point1_y,
                                        point1LateralShift_x - seg01_perpX, point1LateralShift_y - seg01_perpY,
                                        negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
                    }
                    // Negative turn
                    else
                    {
                        // Outgoing shoulder
                        o_vertices.push(point1_x, point1_y,
                                        point1LateralShift_x + seg12_perpX, point1LateralShift_y + seg12_perpY,
                                        positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);
                        // Incoming shoulder
                        o_vertices.push(point1_x, point1_y,
                                        point1LateralShift_x + seg01_perpX, point1LateralShift_y + seg01_perpY,
                                        positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);
                        // Outgoing shoulder
                        o_vertices.push(point1_x, point1_y,
                                        point1LateralShift_x + seg12_perpX, point1LateralShift_y + seg12_perpY,
                                        positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);
                    }
                }
                else //if (join == "miter")
                {
                    // Positive turn
                    if (turnDirection >= 0)
                    {
                        // Outer elbow
                        o_vertices.push(point1_x, point1_y,
                                        negativeBordersIntersection[0] - point1_x, negativeBordersIntersection[1] - point1_y,
                                        negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);

                        // Intersection of positive-side border of quad 1
                        // with negative-side border of quad 2
                        var posAndNegBordersIntersection = dan.math.intersectLineWithLine(
                            [laterallyShiftedPoint0_x + seg01_perpX, laterallyShiftedPoint0_y + seg01_perpY],
                            [laterallyShiftedPoint1_x + seg01_perpX, laterallyShiftedPoint1_y + seg01_perpY],
                            [laterallyShiftedPoint1_x - seg12_perpX, laterallyShiftedPoint1_y - seg12_perpY],
                            [laterallyShiftedPoint2_x - seg12_perpX, laterallyShiftedPoint2_y - seg12_perpY]);
                        o_vertices.push(point1_x, point1_y,
                                        posAndNegBordersIntersection[0] - point1_x, posAndNegBordersIntersection[1] - point1_y,
                                        negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
                        // Repeat previous to reset triangle strip
                        o_vertices.push(point1_x, point1_y,
                                        posAndNegBordersIntersection[0] - point1_x, posAndNegBordersIntersection[1] - point1_y,
                                        negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);

                        // Intersection of positive-side border of quad 1
                        // with positive-side border of quad 2
                        var posAndPosBordersIntersection = dan.math.intersectLineWithLine(
                            [laterallyShiftedPoint0_x + seg01_perpX, laterallyShiftedPoint0_y + seg01_perpY],
                            [laterallyShiftedPoint1_x + seg01_perpX, laterallyShiftedPoint1_y + seg01_perpY],
                            [laterallyShiftedPoint1_x + seg12_perpX, laterallyShiftedPoint1_y + seg12_perpY],
                            [laterallyShiftedPoint2_x + seg12_perpX, laterallyShiftedPoint2_y + seg12_perpY]);
                        o_vertices.push(point1_x, point1_y,
                                        posAndPosBordersIntersection[0] - point1_x, posAndPosBordersIntersection[1] - point1_y,
                                        positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);
                    }
                    // Negative turn
                    else
                    {
                        // Inner elbow
                        o_vertices.push(point1_x, point1_y,
                                        negativeBordersIntersection[0] - point1_x, negativeBordersIntersection[1] - point1_y,
                                        negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);

                        // Intersection of positive-side border of quad 1
                        // with negative-side border of quad 2
                        var posAndNegBordersIntersection = dan.math.intersectLineWithLine(
                            [laterallyShiftedPoint0_x + seg01_perpX, laterallyShiftedPoint0_y + seg01_perpY],
                            [laterallyShiftedPoint1_x + seg01_perpX, laterallyShiftedPoint1_y + seg01_perpY],
                            [laterallyShiftedPoint1_x - seg12_perpX, laterallyShiftedPoint1_y - seg12_perpY],
                            [laterallyShiftedPoint2_x - seg12_perpX, laterallyShiftedPoint2_y - seg12_perpY]);
                        o_vertices.push(point1_x, point1_y,
                                        posAndNegBordersIntersection[0] - point1_x, posAndNegBordersIntersection[1] - point1_y,
                                        positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);
                        // Repeat previous to reset triangle strip
                        o_vertices.push(point1_x, point1_y,
                                        posAndNegBordersIntersection[0] - point1_x, posAndNegBordersIntersection[1] - point1_y,
                                        positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);

                        // Outer elbow
                        o_vertices.push(point1_x, point1_y,
                                        positiveBordersIntersection[0] - point1_x, positiveBordersIntersection[1] - point1_y,
                                        positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);
                    }
                }
            }
        }
    }

    // Add corresponding index for every vertex added
    o_indices.push(outputPointCountAtStart);
    var outputPointCountAtEnd = o_vertices.valueCount() / 8;
    for (var indexNo = outputPointCountAtStart; indexNo < outputPointCountAtEnd; ++indexNo)
    {
        o_indices.push(indexNo);
    }
    o_indices.push(outputPointCountAtEnd - 1);
};

dan.gfx.gl.circleBeam_getVertices = function (
    i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount,
    o_vertices, o_indices)
// Build a circle outline
//
// Algorithm from http://slabode.exofire.net/circle_draw.shtml
//
// Params:
//  i_centre:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_radius:
//   (float number)
//  i_width:
//   (float number)
//  i_alignment:
//   (float number)
//   How to laterally align the stroke to the circle.
//   0.5: Middle of stroke aligns with circle
//   0: Negative side of stroke aligns with circle (inner border)
//   1: Positive side of stroke aligns with circle (outer border)
//  i_colour:
//   Either (dan.gfx.ColourRGBA)
//    Colour for line
//   or (array of 2 dan.gfx.ColourRGBA)
//    Colours for negative (outer) and positive (inner) edges of stroke respectively.
//  i_segmentCount:
//   Either (integer number)
//    Number of straight line segments to use in each 2*PI radians
//   or (null or undefined)
//    use default
//
// Returns:
//  o_vertices:
//   (array of number)
//   Vertex attributes for successive vertices are pushed onto this array.
//  o_indices:
//   (array of number)
//   Indices for successive vertices are pushed onto this array.
{
    dan.gfx.gl.ellipseBeam_getVertices(
        i_centre, [i_radius, i_radius], i_width, i_alignment, i_colour, i_segmentCount,
        o_vertices, o_indices);
};

dan.gfx.gl.arcBeam_getVertices = function (
    i_centre, i_radius, i_startAngle, i_spanAngle, i_width, i_alignment, i_colour, i_closed, i_chord, i_segmentCount,
    o_vertices, o_indices)
// Build an arc
//
// Algorithm from http://slabode.exofire.net/circle_draw.shtml
//
// Params:
//  i_centre:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_radius:
//   (float number)
//  i_startAngle:
//   (float number)
//   In radians.
//  i_spanAngle:
//   (float number)
//   In radians.
//  i_width:
//   (float number)
//  i_alignment:
//   (float number)
//   How to laterally align the stroke to the circle.
//   0.5: Middle of stroke aligns with circle
//   0: Negative side of stroke aligns with circle (inner border)
//   1: Positive side of stroke aligns with circle (outer border)
//  i_colour:
//   Either (dan.gfx.ColourRGBA)
//    Colour for line
//   or (array of 2 dan.gfx.ColourRGBA)
//    Colours for negative (outer) and positive (inner) edges of stroke respectively.
//  i_closed:
//   (boolean)
//  i_chord:
//   (boolean)
//   When closing a shape (this only applies when i_closed == true)
//   true: Connect the first point directly to the start point
//   false: Make a pie/Pacman shape
//  i_segmentCount:
//   Either (integer number)
//    Number of straight line segments to use in each 2*PI radians
//   or (null or undefined)
//    use default
//
// Returns:
//  o_vertices:
//   (array of number)
//   Vertex attributes for successive vertices are pushed onto this array.
//  o_indices:
//   (array of number)
//   Indices for successive vertices are pushed onto this array.
{
    // Apply default value for segment count
    if (!i_segmentCount)
        //i_segmentCount = 10 * Math.sqrt(i_radius) * i_spanAngle / (2*Math.PI);
        i_segmentCount = 40 * i_spanAngle / (2*Math.PI);

    //
    var angleStep = i_spanAngle / i_segmentCount;
    var tangentialFactor = Math.tan(angleStep);  // Length of tangential movement in one step as a fraction of the radius
    var radialFactor = Math.cos(angleStep);

    if (!i_closed)
    {
        // Get start points at normalized radius pointing in start angle direction
        var x = Math.cos(i_startAngle);
        var y = Math.sin(i_startAngle);

        //
        var outerSideWidth = i_width * i_alignment;
        var innerSideWidth = i_width - outerSideWidth;

        // Get colour and alpha components ready
        var negativeSideAlpha, negativeSideR, negativeSideG, negativeSideB;
        var positiveSideAlpha, positiveSideR, positiveSideG, positiveSideB;
        if (i_colour instanceof dan.gfx.ColourRGBA)
        {
            negativeSideAlpha = positiveSideAlpha = i_colour.a;
            negativeSideR = positiveSideR = i_colour.r;
            negativeSideG = positiveSideG = i_colour.g;
            negativeSideB = positiveSideB = i_colour.b;
        }
        else
        {
            negativeSideAlpha = i_colour[0].a;
            negativeSideR = i_colour[0].r;
            negativeSideG = i_colour[0].g;
            negativeSideB = i_colour[0].b;
            positiveSideAlpha = i_colour[1].a;
            positiveSideR = i_colour[1].r;
            positiveSideG = i_colour[1].g;
            positiveSideB = i_colour[1].b;
        }

        //
        var outputPointCountAtStart = o_vertices.valueCount() / 8;

        o_indices.push(outputPointCountAtStart);

        // Send vertices
        for (var segmentNo = 0; segmentNo <= i_segmentCount; ++segmentNo)
        {
            o_vertices.push(i_centre[0] + x * i_radius, i_centre[1] + y * i_radius,
                            x * outerSideWidth, y * outerSideWidth,
                            negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
            o_vertices.push(i_centre[0] + x * i_radius, i_centre[1] + y * i_radius,
                            x * -innerSideWidth, y * -innerSideWidth,
                            positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);

            o_indices.push(outputPointCountAtStart++, outputPointCountAtStart++);

            // Get direction of tangent (radius rotated by 90 degrees)
            var tangentialVector_x = -y;
            var tangentialVector_y = x;

            // Move along tangent
            x += tangentialVector_x * tangentialFactor;
            y += tangentialVector_y * tangentialFactor;

            // Reduce to move back in towards centre onto circle
            x *= radialFactor;
            y *= radialFactor;
        }

        o_indices.push(outputPointCountAtStart - 1);
    }
    else //if (i_closed)
    {
        // Get start point at i_radius pointing in start angle direction
        var x = i_radius * Math.cos(i_startAngle);
        var y = i_radius * Math.sin(i_startAngle);

        // Prepare vertices
        var borderPoints = [];
        for (var segmentNo = 0; segmentNo <= i_segmentCount; ++segmentNo)
        {
            borderPoints.push([i_centre[0] + x, i_centre[1] + y]);

            // Get direction of tangent (radius rotated by 90 degrees)
            var tangentialVector_x = -y;
            var tangentialVector_y = x;

            // Move along tangent
            x += tangentialVector_x * tangentialFactor;
            y += tangentialVector_y * tangentialFactor;

            // Reduce to move back in towards centre onto circle
            x *= radialFactor;
            y *= radialFactor;
        }

        if (!i_chord)
            borderPoints.push([i_centre[0], i_centre[1]]);

        dan.gfx.gl.polygonBeam_getVertices(borderPoints, i_width, i_alignment, i_colour, "miter", true,
                                           o_vertices, o_indices);
    }
};

dan.gfx.gl.ellipseBeam_getVertices = function (
    i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount,
    o_vertices, o_indices)
// Build an ellipse outline
//
// Algorithm from http://slabode.exofire.net/circle_draw.shtml
//
// Params:
//  i_centre:
//   Either (dan.math.Vector2)
//   or (array of 2 floats)
//  i_radius:
//   Either (float number)
//    Same radius for both x and y
//   or (dan.math.Vector2) or (array of 2 floats)
//    Seperate radii for x and y respectively
//  i_width:
//   (float number)
//  i_alignment:
//   (float number)
//   How to laterally align the stroke to the circle.
//   0.5: Middle of stroke aligns with circle
//   0: Negative side of stroke aligns with circle (inner border)
//   1: Positive side of stroke aligns with circle (outer border)
//  i_colour:
//   Either (dan.gfx.ColourRGBA)
//    Colour for line
//   or (array of 2 dan.gfx.ColourRGBA)
//    Colours for negative (outer) and positive (inner) edges of stroke respectively.
//  i_segmentCount:
//   Either (integer number)
//    Number of straight line segments to use in each 2*PI radians
//   or (null or undefined)
//    use default
//
// Returns:
//  o_vertices:
//   (array of number)
//   Vertex attributes for successive vertices are pushed onto this array.
//  o_indices:
//   (array of number)
//   Indices for successive vertices are pushed onto this array.
{
    // Apply default value for segment count
    if (!i_segmentCount)
        //i_segmentCount = 10 * Math.sqrt(i_radius);
        i_segmentCount = 40;

    //
    var radiusX;
    var radiusY;
    if (!(i_radius instanceof Array || i_radius instanceof dan.math.Vector2))
    {
        radiusX = radiusY = i_radius;
    }
    else
    {
        radiusX = i_radius[0];
        radiusY = i_radius[1];
    }

    //
    var angleStep = 2.0 * Math.PI / i_segmentCount;
    var tangentialFactor = Math.tan(angleStep);  // Length of tangential movement in one step as a fraction of the radius
    var radialFactor = Math.cos(angleStep);

    // Get start points at normalized radius pointing in zero angle direction
    var x = 1;
    var y = 0;

    //
    var outerSideWidth = i_width * i_alignment;
    var innerSideWidth = i_width - outerSideWidth;

    // Get colour and alpha components ready
    var negativeSideAlpha, negativeSideR, negativeSideG, negativeSideB;
    var positiveSideAlpha, positiveSideR, positiveSideG, positiveSideB;
    if (i_colour instanceof dan.gfx.ColourRGBA)
    {
        negativeSideAlpha = positiveSideAlpha = i_colour.a;
        negativeSideR = positiveSideR = i_colour.r;
        negativeSideG = positiveSideG = i_colour.g;
        negativeSideB = positiveSideB = i_colour.b;
    }
    else
    {
        negativeSideAlpha = i_colour[0].a;
        negativeSideR = i_colour[0].r;
        negativeSideG = i_colour[0].g;
        negativeSideB = i_colour[0].b;
        positiveSideAlpha = i_colour[1].a;
        positiveSideR = i_colour[1].r;
        positiveSideG = i_colour[1].g;
        positiveSideB = i_colour[1].b;
    }

    //
    var outputPointCountAtStart = o_vertices.valueCount() / 8;

    o_indices.push(outputPointCountAtStart);

    // Send vertices
    for (var segmentNo = 0; segmentNo <= i_segmentCount; ++segmentNo)
    {
        o_vertices.push(i_centre[0] + x * radiusX, i_centre[1] + y * radiusY,
                        x * outerSideWidth, y * outerSideWidth,
                        negativeSideR, negativeSideG, negativeSideB, negativeSideAlpha);
        o_vertices.push(i_centre[0] + x * radiusX, i_centre[1] + y * radiusY,
                        x * -innerSideWidth, y * -innerSideWidth,
                        positiveSideR, positiveSideG, positiveSideB, positiveSideAlpha);

        o_indices.push(outputPointCountAtStart++, outputPointCountAtStart++);

        // Get direction of tangent (radius rotated by 90 degrees)
        var tangentialVector_x = -y;
        var tangentialVector_y = x;

        // Move along tangent
        x += tangentialVector_x * tangentialFactor;
        y += tangentialVector_y * tangentialFactor;

        // Reduce to move back in towards centre onto circle
        x *= radialFactor;
        y *= radialFactor;
    }

    o_indices.push(outputPointCountAtStart - 1);
};
