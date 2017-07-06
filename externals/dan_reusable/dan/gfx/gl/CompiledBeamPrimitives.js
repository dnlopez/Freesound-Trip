
// This namespace
// #require "gl.js"
// #require "Program.js"
// #require "IncrementalBufferObject.js"
// #require "beamPrimitives_getVertices.js"

// Dan reusable
// #require <dan/gfx/ColourRGBA.js>


// + Construction/destruction {{{

dan.gfx.gl.CompiledBeamPrimitives = function ()
{
    // Compile static shader program that is suitable for drawing any of the
    // compiled buffers that this class produces
    if (!dan.gfx.gl.CompiledBeamPrimitives.drawProgram)
        dan.gfx.gl.CompiledBeamPrimitives.drawProgram = dan.gfx.gl.Program.fromStringVSFS(
            dan.gfx.gl.CompiledBeamPrimitives.vertexShaderSource,
            dan.gfx.gl.CompiledBeamPrimitives.fragmentShaderSource);

    //
    this.vertices = new dan.gfx.gl.IncrementalBufferObject(Float32Array);
    this.indices = new dan.gfx.gl.IncrementalBufferObject(Uint16Array, GL.ctx.ELEMENT_ARRAY_BUFFER);

    // Path state
    this.lineWidth = 1.0;
    this.strokeStyle = dan.gfx.ColourRGBA.fromName("black");
    this.currentPath = [];
};

dan.gfx.gl.CompiledBeamPrimitives.prototype.destroy = function ()
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
// See corresponding functions in beamPrimitives_getVertices.js for parameter docs.

dan.gfx.gl.CompiledBeamPrimitives.prototype.addRectStroke = function (
    i_corner, i_size, i_width, i_alignment, i_colour)
{
    dan.gfx.gl.rectBeam_getVertices(
        i_corner, i_size, i_width, i_alignment, i_colour,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledBeamPrimitives.prototype.addTrianglesStroke = function (
    i_points, i_width, i_alignment, i_colour, i_join)
{
    dan.gfx.gl.trianglesBeam_getVertices(
        i_points, i_width, i_alignment, i_colour, i_join,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledBeamPrimitives.prototype.addPolygonStroke = function (
    i_points, i_width, i_alignment, i_colour, i_join, i_closed)
{
    dan.gfx.gl.polygonBeam_getVertices(
        i_points, i_width, i_alignment, i_colour, i_join, i_closed,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledBeamPrimitives.prototype.addCircleStroke = function (
    i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount)
{
    dan.gfx.gl.circleBeam_getVertices(
        i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledBeamPrimitives.prototype.addArcStroke = function (
    i_centre, i_radius, i_startAngle, i_spanAngle, i_width, i_alignment, i_colour, i_closed, i_chord, i_segmentCount)
{
    dan.gfx.gl.arcBeam_getVertices(
        i_centre, i_radius, i_startAngle, i_spanAngle, i_width, i_alignment, i_colour, i_closed, i_chord, i_segmentCount,
        this.vertices, this.indices);
};

dan.gfx.gl.CompiledBeamPrimitives.prototype.addEllipseStroke = function (
    i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount)
{
    dan.gfx.gl.ellipseBeam_getVertices(
        i_centre, i_radius, i_width, i_alignment, i_colour, i_segmentCount,
        this.vertices, this.indices);
};

// + }}}

// + Clear {{{

dan.gfx.gl.CompiledBeamPrimitives.prototype.clear = function ()
{
    this.vertices.clear();
    this.indices.clear();
};

dan.gfx.gl.CompiledBeamPrimitives.prototype.isEmpty = function ()
// Returns:
//  (boolean)
{
    return this.vertices.valueCount() == 0;
};

// + }}}

// + Paths {{{

// + + Begin {{{

dan.gfx.gl.CompiledBeamPrimitives.prototype.beginPath = function ()
{
    this.currentPath = [];
}

// + + }}}

// + + Plot {{{

dan.gfx.gl.CompiledBeamPrimitives.prototype.moveTo = function (i_x, i_y)
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

dan.gfx.gl.CompiledBeamPrimitives.prototype.lineTo = function (i_x, i_y)
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

dan.gfx.gl.CompiledBeamPrimitives.prototype.closePath = function ()
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

dan.gfx.gl.CompiledBeamPrimitives.prototype.stroke = function ()
{
    var points = [];
    var closed = false;

    for (var commandNo = 0; commandNo < this.currentPath.length; ++commandNo)
    {
        var command = this.currentPath[commandNo];

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

// + + }}}

// + }}}

// + Draw {{{

dan.gfx.gl.CompiledBeamPrimitives.vertexShaderSource = "\n\
uniform mat3 u_worldMatrix;\n\
uniform mat3 u_viewMatrix;\n\
uniform mat4 u_projectionMatrix;\n\
\n\
attribute vec2 a_position;\n\
attribute vec2 a_thicknessVector;\n\
attribute vec4 a_colour;\n\
\n\
varying vec4 v_colour;\n\
\n\
void main()\n\
{\n\
    mat3 worldViewMatrix = u_viewMatrix * u_worldMatrix;\n\
    vec3 v = worldViewMatrix * vec3(a_position, 1.0);\n\
\n\
    mat2 rotationMatrix = mat2(normalize(vec2(worldViewMatrix[0])), normalize(vec2(worldViewMatrix[1])));\n\
    vec2 rotatedThicknessVector = rotationMatrix * a_thicknessVector;\n\
    v += vec3(rotatedThicknessVector, 0.0);\n\
\n\
    gl_Position = u_projectionMatrix * vec4(v.xy, 0.0, 1.0);\n\
\n\
    v_colour = a_colour;\n\
}\n\
";

dan.gfx.gl.CompiledBeamPrimitives.fragmentShaderSource = "\
precision mediump float;\n\
\n\
varying highp vec4 v_colour;\n\
\n\
void main()\n\
{\n\
    gl_FragColor = v_colour;\n\
}\n\
";

dan.gfx.gl.CompiledBeamPrimitives.prototype.draw = function (i_worldMatrix, i_viewMatrix, i_projectionMatrix)
// Params:
//  i_worldMatrix:
//   (dan.math.Matrix3)
//  i_viewMatrix:
//   (dan.math.Matrix3)
//  i_projectionMatrix:
//   (dan.math.Matrix4)
//
// TODO: tint
{
    GL.setBufferObject(GL.ctx.ARRAY_BUFFER, this.vertices.getBufferObject());
    GL.ctx.vertexAttribPointer(dan.gfx.gl.CompiledBeamPrimitives.drawProgram.getAttributeLocation("a_position"), 2, GL.ctx.FLOAT, false, 4*8, 0);
    GL.ctx.vertexAttribPointer(dan.gfx.gl.CompiledBeamPrimitives.drawProgram.getAttributeLocation("a_thicknessVector"), 2, GL.ctx.FLOAT, false, 4*8, 4*2);
    GL.ctx.vertexAttribPointer(dan.gfx.gl.CompiledBeamPrimitives.drawProgram.getAttributeLocation("a_colour"), 4, GL.ctx.FLOAT, false, 4*8, 4*4);

    GL.setProgram(dan.gfx.gl.CompiledBeamPrimitives.drawProgram);
    dan.gfx.gl.CompiledBeamPrimitives.drawProgram.setMatrix3("u_worldMatrix", i_worldMatrix);
    dan.gfx.gl.CompiledBeamPrimitives.drawProgram.setMatrix3("u_viewMatrix", i_viewMatrix);
    dan.gfx.gl.CompiledBeamPrimitives.drawProgram.setMatrix4("u_projectionMatrix", i_projectionMatrix);
    GL.ctx.enableVertexAttribArray(dan.gfx.gl.CompiledBeamPrimitives.drawProgram.getAttributeLocation("a_position"));
    GL.ctx.enableVertexAttribArray(dan.gfx.gl.CompiledBeamPrimitives.drawProgram.getAttributeLocation("a_thicknessVector"));
    GL.ctx.enableVertexAttribArray(dan.gfx.gl.CompiledBeamPrimitives.drawProgram.getAttributeLocation("a_colour"));
    GL.setBufferObject(GL.ctx.ELEMENT_ARRAY_BUFFER, this.indices.getBufferObject().glObject);
    GL.ctx.drawElements(GL.ctx.TRIANGLE_STRIP, this.indices.valueCount(), GL.ctx.UNSIGNED_SHORT, 0);
    GL.setProgram(null);
    GL.ctx.disableVertexAttribArray(dan.gfx.gl.CompiledBeamPrimitives.drawProgram.getAttributeLocation("a_position"));
    GL.ctx.disableVertexAttribArray(dan.gfx.gl.CompiledBeamPrimitives.drawProgram.getAttributeLocation("a_thicknessVector"));
    GL.ctx.disableVertexAttribArray(dan.gfx.gl.CompiledBeamPrimitives.drawProgram.getAttributeLocation("a_colour"));
};

// + }}}
