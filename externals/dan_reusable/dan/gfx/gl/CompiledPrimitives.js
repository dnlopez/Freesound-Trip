
// This namespace
// #require "gl.js"
// #require "Program.js"
// #require "IncrementalBufferObject.js"
// #require "primitives_getVertices.js"

// Dan reusable
// #require <dan/memory/NonGcStack.js>
// #require <dan/gfx/ColourRGBA.js>


// + Construction {{{

dan.gfx.gl.CompiledPrimitives = function ()
{
    // Compile static shader program that is suitable for drawing any of the
    // compiled buffers that this class produces
    if (!dan.gfx.gl.CompiledPrimitives.drawProgram)
        dan.gfx.gl.CompiledPrimitives.drawProgram = dan.gfx.gl.Program.fromStringVSFS(
            dan.gfx.gl.CompiledPrimitives.vertexShaderSource,
            dan.gfx.gl.CompiledPrimitives.fragmentShaderSource);

    //
    this.vertices = new dan.gfx.gl.IncrementalBufferObject(Float32Array);
    this.indices = new dan.gfx.gl.IncrementalBufferObject(Uint16Array, GL.ctx.ELEMENT_ARRAY_BUFFER);

    // Path state
    this.lineWidth = 1.0;
    this.strokeStyle = dan.gfx.ColourRGBA.fromName("black");
    this.fillStyle = dan.gfx.ColourRGBA.fromName("black");
    this.currentPath = new dan.memory.NonGcStack();
};

dan.gfx.gl.CompiledPrimitives.prototype.destroy = function ()
{
    if (this.vertices)
    {
        this.vertices.destroy();
        this.vertices = null;
    }
    if (this.indices)
    {
        this.indices.destroy();
        this.indices = null;
    }
};

// + }}}

// + Add primitives {{{
// See corresponding functions in primitives_getVertices.js for parameter docs.

dan.gfx.gl.CompiledPrimitives.prototype.addRectStroke = function (
    i_corner, i_size, i_width, i_alignment, i_colour)
{
    dan.gfx.gl.rectStroke_getVertices(
        i_corner, i_size, i_width, i_alignment, i_colour,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledPrimitives.prototype.addRectFill = function (
    i_corner, i_size, i_colour)
{
    dan.gfx.gl.rectFill_getVertices(
        i_corner, i_size, i_colour,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledPrimitives.prototype.addTrianglesStroke = function (
    i_points, i_width, i_alignment, i_colour, i_join)
{
    dan.gfx.gl.trianglesStroke_getVertices(
        i_points, i_width, i_alignment, i_colour, i_join,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledPrimitives.prototype.addTrianglesFill = function (
    i_points, i_colour)
{
    dan.gfx.gl.trianglesFill_getVertices(
        i_points, i_colour,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledPrimitives.prototype.addLineStroke = function (
    i_startPoint, i_endPoint, i_width, i_alignment, i_colour)
{
    dan.gfx.gl.lineStroke_getVertices(
        i_startPoint, i_endPoint, i_width, i_alignment, i_colour,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledPrimitives.prototype.addPolygonStroke = function (
    i_points, i_width, i_alignment, i_colour, i_join, i_closed)
{
    dan.gfx.gl.polygonStroke_getVertices(
        i_points, i_width, i_alignment, i_colour, i_join, i_closed,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledPrimitives.prototype.addPolygonFill = function (
    i_points, i_colour)
{
    dan.gfx.gl.polygonFill_getVertices(
        i_points, i_colour,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledPrimitives.prototype.addCircleStroke = function (
    i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount)
{
    dan.gfx.gl.circleStroke_getVertices(
        i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledPrimitives.prototype.addCircleFill = function (
    i_centre, i_radius, i_colour, i_segmentCount)
{
    dan.gfx.gl.circleFill_getVertices(
        i_centre, i_radius, i_colour, i_segmentCount,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledPrimitives.prototype.addArcStroke = function (
    i_centre, i_radius, i_startAngle, i_spanAngle, i_width, i_alignment, i_colour, i_closed, i_chord, i_segmentCount)
{
    dan.gfx.gl.arcStroke_getVertices(
        i_centre, i_radius, i_startAngle, i_spanAngle, i_width, i_alignment, i_colour, i_closed, i_chord, i_segmentCount,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledPrimitives.prototype.addArcFill = function (
    i_centre, i_radius, i_startAngle, i_spanAngle, i_chord, i_colour, i_segmentCount)
{
    dan.gfx.gl.arcFill_getVertices(
        i_centre, i_radius, i_startAngle, i_spanAngle, i_colour, i_chord, i_segmentCount,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledPrimitives.prototype.addEllipseStroke = function (
    i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount)
{
    dan.gfx.gl.ellipseStroke_getVertices(
        i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledPrimitives.prototype.addEllipseFill = function (
    i_centre, i_radius, i_colour, i_segmentCount)
{
    dan.gfx.gl.ellipseFill_getVertices(
        i_centre, i_radius, i_colour, i_segmentCount,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledPrimitives.prototype.addLinearBlendedSegment = function (
    i_startPoint, i_startStyle, i_endPoint, i_endStyle, i_width)
{
    dan.gfx.gl.linearBlendedSegment_getVertices(
        i_startPoint, i_startStyle, i_endPoint, i_endStyle, i_width,
        this.vertices, this.indices);
};

// + }}}

// + Clear {{{

dan.gfx.gl.CompiledPrimitives.prototype.clear = function ()
{
    this.vertices.clear();
    this.indices.clear();
};

dan.gfx.gl.CompiledPrimitives.prototype.isEmpty = function ()
// Returns:
//  (boolean)
{
    return this.vertices.valueCount() == 0;
};

// + }}}

// + Paths {{{

// + + Begin {{{

dan.gfx.gl.CompiledPrimitives.prototype.beginPath = function ()
{
    this.currentPath.clear();
}

// + + }}}

// + + Plot {{{

dan.gfx.gl.CompiledPrimitives.prototype.moveTo = function (i_x, i_y)
// Move the drawing position for the start of the next line segment to (x, y).
// If some line segments have already been specified, this will break that sequence of
// line segments ("subpath") and start a new one.
//
// Params:
//  i_x:
//   (number)
//  i_y:
//   (number)
{
    this.currentPath.push(["moveTo", [i_x, i_y]]);
};

dan.gfx.gl.CompiledPrimitives.prototype.lineTo = function (i_x, i_y)
// Add a line segment from the current drawing position to (x, y),
// and then move the current drawing position to (x, y).
//
// Params:
//  i_x:
//   (number)
//  i_y:
//   (number)
{
    this.currentPath.push(["lineTo", [i_x, i_y]]);
};

dan.gfx.gl.CompiledPrimitives.prototype.closePath = function ()
// Add a line segment from the current drawing position to the initial point of the
// current subpath (making a proper join) and then start a new subpath at that initial point.
//
// Params:
//  i_x:
//   (number)
//  i_y:
//   (number)
{
    this.currentPath.push(["closePath", null]);
};

// + + }}}

// + + Draw {{{

dan.gfx.gl.CompiledPrimitives.prototype.stroke = function ()
{
    var points = [];
    var closed = false;

    for (var commandNo = 0; commandNo < this.currentPath.getLength(); ++commandNo)
    {
        var command = this.currentPath.getArray()[commandNo];

        if (command[0] == "moveTo")
        {
            // If a line is in progress, then flush that before moving to start a new one
            if (points.length >= 2)
            {
                this.addPolygonStroke(points.slice(0), this.lineWidth, 0.5, this.strokeStyle, null, closed);
            }

            // Set the new point as the only point
            closed = false;
            points.length = 0;
            points[0] = command[1];
        }
        else if (command[0] == "lineTo")
        {
            points.push(command[1]);
        }
        else if (command[0] == "closePath")
        {
            closed = true;
        }
    }

    if (points.length >= 2)
    {
        this.addPolygonStroke(points.slice(0), this.lineWidth, 0.5, this.strokeStyle, null, closed);
    }
}

dan.gfx.gl.CompiledPrimitives.prototype.fill = function ()
{
    var points = [];

    for (var commandNo = 0; commandNo < this.currentPath.getLength(); ++commandNo)
    {
        var command = this.currentPath.getArray()[commandNo];

        if (command[0] == "moveTo")
        {
            // If a polygon is in progress, then flush that before moving to start a new one
            if (points.length >= 3)
            {
                this.addPolygonFill(points.slice(0), this.fillStyle);
            }

            // Set the new point as the only point
            points.length = 0;
            points[0] = command[1];
        }
        else if (command[0] == "lineTo")
        {
            points.push(command[1]);
        }
    }

    if (points.length >= 3)
    {
        this.addPolygonFill(points.slice(0), this.fillStyle);
    }
}

// + + }}}

// + }}}

// + Draw {{{

dan.gfx.gl.CompiledPrimitives.vertexShaderSource = "\n\
uniform mat3 u_worldMatrix;\n\
uniform mat3 u_viewMatrix;\n\
uniform mat4 u_projectionMatrix;\n\
\n\
attribute vec2 a_position;\n\
attribute vec4 a_colour;\n\
\n\
varying vec4 v_colour;\n\
\n\
void main()\n\
{\n\
    vec3 position_view = u_viewMatrix * u_worldMatrix * vec3(a_position, 1.0);\n\
    gl_Position = u_projectionMatrix * vec4(position_view.xy, 0.0, 1.0);\n\
\n\
    v_colour = a_colour;\n\
}\n\
";

dan.gfx.gl.CompiledPrimitives.fragmentShaderSource = "\
precision mediump float;\n\
\n\
uniform vec4 u_tint;\n\
\n\
varying highp vec4 v_colour;\n\
\n\
void main()\n\
{\n\
    gl_FragColor = v_colour * u_tint;\n\
}\n\
";

dan.gfx.gl.CompiledPrimitives.prototype.draw = function (i_worldMatrix, i_viewMatrix, i_projectionMatrix, i_tint)
// Params:
//  i_worldMatrix:
//   (dan.math.Matrix3)
//  i_viewMatrix:
//   (dan.math.Matrix3)
//  i_projectionMatrix:
//   (dan.math.Matrix4)
//  i_tint:
//   Either (dan.gfx.ColourRGBA)
//   or (null or undefined)
//    use default of white
{
    if (!i_tint)
        i_tint = new dan.gfx.ColourRGBA(1.0, 1.0, 1.0, 1.0);

    GL.setBufferObject(GL.ctx.ARRAY_BUFFER, this.vertices.getBufferObject());
    GL.ctx.vertexAttribPointer(dan.gfx.gl.CompiledPrimitives.drawProgram.getAttributeLocation("a_position"), 2, GL.ctx.FLOAT, false, 4*6, 0);
    GL.ctx.vertexAttribPointer(dan.gfx.gl.CompiledPrimitives.drawProgram.getAttributeLocation("a_colour"), 4, GL.ctx.FLOAT, false, 4*6, 4*2);

    GL.setProgram(dan.gfx.gl.CompiledPrimitives.drawProgram);
    dan.gfx.gl.CompiledPrimitives.drawProgram.setMatrix3("u_worldMatrix", i_worldMatrix);
    dan.gfx.gl.CompiledPrimitives.drawProgram.setMatrix3("u_viewMatrix", i_viewMatrix);
    dan.gfx.gl.CompiledPrimitives.drawProgram.setMatrix4("u_projectionMatrix", i_projectionMatrix);
    dan.gfx.gl.CompiledPrimitives.drawProgram.setColourRGBA("u_tint", i_tint);
    GL.ctx.enableVertexAttribArray(dan.gfx.gl.CompiledPrimitives.drawProgram.getAttributeLocation("a_position"));
    GL.ctx.enableVertexAttribArray(dan.gfx.gl.CompiledPrimitives.drawProgram.getAttributeLocation("a_colour"));
    GL.setBufferObject(GL.ctx.ELEMENT_ARRAY_BUFFER, this.indices.getBufferObject().glObject);
    GL.ctx.drawElements(GL.ctx.TRIANGLE_STRIP, this.indices.valueCount(), GL.ctx.UNSIGNED_SHORT, 0);
    GL.setProgram(null);
    GL.ctx.disableVertexAttribArray(dan.gfx.gl.CompiledPrimitives.drawProgram.getAttributeLocation("a_position"));
    GL.ctx.disableVertexAttribArray(dan.gfx.gl.CompiledPrimitives.drawProgram.getAttributeLocation("a_colour"));
};

// + }}}
