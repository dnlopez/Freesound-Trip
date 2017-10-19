
// This namespace
// #require "mesh_namespace.js"
// #require "AttributeArrays.js"

/*
Vertices
 with
  primitiveType
  vertexCount
  attributes

SoA/AoS

IndexedVertices
 with
  indices
*/


// + Construction {{{

dan.mesh.Mesh = function (i_primitiveType)
// Params:
//  i_primitiveType:
//   Either (GLenum)
//    The primitive type.
//    The current options happen to match those supported by WebGL, ie. one of:
//     GL_POINTS
//     GL_LINES
//     GL_LINE_LOOP
//     GL_LINE_STRIP
//     GL_TRIANGLES
//     GL_TRIANGLE_STRIP
//     GL_TRIANGLE_FAN
//   or (null or undefined)
//    Default to GL_TRIANGLES
{
    // Apply default arguments
    if (!i_primitiveType)
        i_primitiveType = GL.ctx.TRIANGLES;

    this.primitiveType = i_primitiveType;
    // (GLenum)

    // Create object for holding vertex attribute values
    this.vertexAttributeArrays = new dan.mesh.AttributeArrays();
    // (dan.mesh.AttributeArrays)
    // Common vertex attributes:
    //  a_position: (dan.math.Vector3)
    //  a_colour: (dan.gfx.ColourRGBA)
    //  a_uv: (dan.math.Vector2)
    //  a_normal: (dan.math.Vector3)
    this.vertexAttributeArrays.a_position = [];

    this.primitives = [];
    // (array of dan.mesh.Primitive)
};

// + + Static constructors {{{

dan.mesh.Mesh.fromFaceMesh_toRenderBodyAsTriangles = function (i_faceMesh)
// Params:
//  i_faceMesh:
//   (dan.mesh.FaceMesh)
//
// Returns:
//  (dan.mesh.Mesh)
{
    return new dan.mesh.Mesh().toRenderBodyAsTriangles_setFromFaceMesh(i_faceMesh);
};

dan.mesh.Mesh.fromFaceMesh_toRenderBorderAsLines = function (i_faceMesh)
// Params:
//  i_faceMesh:
//   (dan.mesh.FaceMesh)
//
// Returns:
//  (dan.mesh.Mesh)
{
    return new dan.mesh.Mesh().toRenderBorderAsLines_setFromFaceMesh(i_faceMesh);
};

dan.mesh.Mesh.fromIndexedMesh = function (i_indexedMesh)
// Params:
//  i_indexedMesh:
//   (dan.mesh.IndexedMesh)
//
// Returns:
//  (dan.mesh.Mesh)
{
    return new dan.mesh.Mesh().setFromIndexedMesh(i_indexedMesh);
};

// + + }}}

// + }}}

// + Set all elements at once {{{

dan.mesh.Mesh.prototype.toRenderBodyAsTriangles_setFromFaceMesh = function (i_faceMesh)
// Params:
//  i_faceMesh:
//   (dan.mesh.FaceMesh)
//
// Returns:
//  (dan.mesh.Mesh)
{
    // + Get vertices {{{

    // Clear vertex attribute arrays,
    // then make a new one for every vertex attribute reported to exist by i_faceMesh
    this.vertexAttributeArrays = new dan.mesh.AttributeArrays();
    i_faceMesh.toRenderBodyAsTriangles_recreateVertexAttributeArrays(this.vertexAttributeArrays);

    // Copy values
    i_faceMesh.toRenderBodyAsTriangles_getVertexAttributeArrays(this.vertexAttributeArrays);

    // + }}}

    // + Get primitives {{{

    // Clear existing
    this.primitives.length = 0;

    // Copy values
    i_faceMesh.toRenderBodyAsTriangles_getPrimitives(this.primitives);

    //
    this.primitiveType = GL.ctx.TRIANGLES;

    // + }}}

    //
    return this;
};

dan.mesh.Mesh.prototype.toRenderBorderAsLines_setFromFaceMesh = function (i_faceMesh)
// Params:
//  i_faceMesh:
//   (dan.mesh.FaceMesh)
//
// Returns:
//  (dan.mesh.Mesh)
{
    // + Get vertices {{{

    // Clear vertex attribute arrays,
    // then make a new one for every vertex attribute reported to exist by i_faceMesh
    this.vertexAttributeArrays = new dan.mesh.AttributeArrays();
    i_faceMesh.toRenderBorderAsLines_recreateVertexAttributeArrays(this.vertexAttributeArrays);

    // Copy values
    i_faceMesh.toRenderBorderAsLines_getVertexAttributeArrays(this.vertexAttributeArrays);

    // + }}}

    // + Get primitives {{{

    // Clear existing
    this.primitives.length = 0;

    // Copy values
    i_faceMesh.toRenderBorderAsLines_getPrimitives(this.primitives);

    //
    this.primitiveType = GL.ctx.LINES;

    // + }}}

    //
    return this;
};

dan.mesh.Mesh.prototype.setFromIndexedMesh = function (i_indexedMesh)
// Params:
//  i_indexedMesh:
//   (dan.mesh.IndexedMesh)
//
// Returns:
//  (dan.mesh.Mesh)
{
    // + Get vertices {{{

    // Clear vertex attribute arrays,
    // then make a new one for every vertex attribute reported to exist by i_indexedMesh
    this.vertexAttributeArrays = new dan.mesh.AttributeArrays();
    this.vertexAttributeArrays.recreateAttributes(Object.keys(i_indexedMesh.vertexAttributeArrays));

    // Copy values in order of indices
    this.vertexAttributeArrays.appendAttributeArraysInIndexedOrder(i_indexedMesh.indices, i_indexedMesh.vertexAttributeArrays);
    
    // + }}}

    // + Get primitives {{{

    // Copy
    this.primitives = i_indexedMesh.primitives.map(function (i_primitive) {
        return i_primitive.clone();
    });

    //
    this.primitiveType = i_indexedMesh.primitiveType;

    // + }}}

    //
    return this;
};

// + }}}

// + Primitives {{{

dan.mesh.Mesh.prototype.primitivesToVertexAttributeArrays = function ()
// For every primitive attribute (well actually, we only bother to go by those found in
// the first primitive), call primitivesToVertexAttributeArray().
{
    // For each primitive attribute name, call primitivesToVertexAttributeArray()
    var firstPrimitive = this.primitives[0];
    var attributeNames = firstPrimitive.attributeNames();
    for (var primitiveAttributeNameNo in attributeNames)
    {
        this.primitivesToVertexAttributeArray(attributeNames[primitiveAttributeNameNo]);
    }
};

dan.mesh.Mesh.prototype.primitivesToVertexAttributeArray = function (i_name)
// Create a vertex attribute array (or clear existing) named after a primitive attribute
// and then for each primitive push copies of its value for that attribute into the vertex
// array, each one multiple times to stand for each vertex in the primitive.
// 
// Params:
//  i_name:
//   (string)
//   Name of the primitive attribute to read and vertex attribute array to overwrite.
{
    // Start with a new empty vertex array
    var vertexAttributeValues = [];

    // Determine how many vertices are in each primitive
    var primitiveVertexCount = 0;
    switch (this.primitiveType)
    {
    case GL.ctx.POINTS:
        primitiveVertexCount = 1;
        break;
    case GL.ctx.LINES:
        primitiveVertexCount = 2;
        break;
    case GL.ctx.TRIANGLES:
        primitiveVertexCount = 3;
        break;
    /*
    In these remaining cases the number of primitives does not divide neatly
    into the number of vertices. Forget it for now.
    case GL.ctx.LINE_LOOP:
    case GL.ctx.LINE_STRIP:
    case GL.ctx.TRIANGLE_STRIP:
    case GL.ctx.TRIANGLE_FAN:
    */
    }

    // For each primitive
    for (var primitiveNo = 0; primitiveNo < this.primitives.length; ++primitiveNo)
    {
        var primitiveAttributeValue = this.primitives[primitiveNo].get(i_name);

        // Push the primitive attribute value onto the vertex array
        // once for every vertex in the primitive
        for (var vertexNo = 0; vertexNo < primitiveVertexCount; ++vertexNo)
            vertexAttributeValues.push( primitiveAttributeValue.clone() );
    }

    // Set as the new vertex attribute array, replacing any previous one
    this.vertexAttributeArrays[i_name] = vertexAttributeValues;
};

// + }}}

// + Vertices {{{

dan.mesh.Mesh.prototype.vertexCount = function ()
{
    return this.vertexAttributeArrays.a_position.length;
};

// + }}}

// + Transform {{{

dan.mesh.Mesh.prototype.translate = function (i_xOrVector3, i_y, i_z)
// Translate all positions.
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
//  (dan.mesh.Mesh)
//  this.
{
    // Prepare a translation vector
    var translationVector;
    if (i_xOrVector3 instanceof dan.math.Vector3 || i_xOrVector3 instanceof Array)
        translationVector = i_xOrVector3;
    else
        translationVector = dan.math.Vector3.fromElements(i_xOrVector3, i_y, i_z);

    // In each vertex add it to a_position
    var positionsAttributeArray = this.vertexAttributeArrays.a_position;
    for (var vertexNo = 0; vertexNo < this.vertexAttributeArrays.a_position.length; ++vertexNo)
    {
        positionsAttributeArray[vertexNo].add(translationVector);
    }

    //
    return this;
};

dan.mesh.Mesh.prototype.transformByMatrix = function (i_matrix)
// Transform all 3D positions with affine 4x4 matrix
//
// Params:
//  i_matrix:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.mesh.Mesh)
//  this.
{
    // In each vertex transform the a_position vector
    var positionsAttributeArray = this.vertexAttributeArrays.a_position;
    for (var vertexNo = 0; vertexNo < this.vertexAttributeArrays.a_position.length; ++vertexNo)
    {
        positionsAttributeArray[vertexNo].transformByMatrix(i_matrix);
    }

    //
    return this;
};

// + }}}

// + Drawing with GL {{{

function constructTypedArrayFromSubarrays(i_typedArrayType, i_subarrays)
// Params:
//  i_typedArrayType:
//   (function)
//   One of the typed array constructors.
//  i_subarrays:
//   (array of arrays)
{
    // Flatten subarrays
    var flattenedArray = [];
    for (var subarrayNo = 0; subarrayNo < i_subarrays.length; ++subarrayNo)
    {
        var subarray = i_subarrays[subarrayNo];

        for (var subelementNo = 0; subelementNo < subarray.length; ++subelementNo)
        {
            flattenedArray.push(subarray[subelementNo]);
        }
    }

    // Construct typed array
    return new i_typedArrayType(flattenedArray);

    // [Might be quicker to make an empty typed array at the needed size first
    // then copy each subarray in instead of making the intermediate flattened array]
}

function constructTypedArrayFromColourRGBAs(i_typedArrayType, i_colours)
// Params:
//  i_typedArrayType:
//   (function)
//   One of the typed array constructors.
//  i_colours:
//   (array of ColourRGBA)
{
    // Flatten subarrays
    var flattenedArray = [];
    for (var colourNo = 0; colourNo < i_colours.length; ++colourNo)
    {
        var colour = i_colours[colourNo];

        flattenedArray.push(colour.r, colour.g, colour.b, colour.a);
    }

    // Construct typed array
    return new i_typedArrayType(flattenedArray);

    // [Might be quicker to make an empty typed array at the needed size first
    // then copy each subarray in instead of making the intermediate flattened array]
}

dan.mesh.Mesh.prototype.uploadToBufferObjects = function ()
{
    if (!this.bufferObjects)
        this.bufferObjects = {};

    for (var vertexAttributeArrayName in this.vertexAttributeArrays)
    {
        // Create buffer object if it doesn't already exist
        if (!this.bufferObjects[vertexAttributeArrayName])
            this.bufferObjects[vertexAttributeArrayName] = new dan.gfx.gl.BufferObject();

        // Flatten values to typed array
        var values = this.vertexAttributeArrays[vertexAttributeArrayName];
        var valuesInTypedArray;
        if (values.length == 0)
            valuesInTypedArray = Float32Array(0);
        else if (values[0] instanceof dan.gfx.ColourRGBA)
            valuesInTypedArray = constructTypedArrayFromColourRGBAs(Float32Array, values);
        else
            valuesInTypedArray = constructTypedArrayFromSubarrays(Float32Array, values);

        // Write data
        this.bufferObjects[vertexAttributeArrayName].allocateAndWrite(GL.ctx.STATIC_DRAW, valuesInTypedArray);
    }
};

// + }}}
