
// This namespace
// #require "mesh_namespace.js"
// #require "AttributeArrays.js"


// + Construction {{{

dan.mesh.IndexedMesh = function (i_primitiveType)
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

    //
    this.indices = [];
    // (array of integer number)
};

// + + Static constructors {{{

dan.mesh.IndexedMesh.fromIndexedFaceMesh_toRenderBodyAsTriangles = function (i_indexedFaceMesh)
// Params:
//  i_indexedFaceMesh:
//   (dan.mesh.IndexedFaceMesh)
//
// Returns:
//  (dan.mesh.IndexedMesh)
{
    return new dan.mesh.IndexedMesh().toRenderBodyAsTriangles_setFromIndexedFaceMesh(i_indexedFaceMesh);
};

dan.mesh.IndexedMesh.fromIndexedFaceMesh_toRenderBorderAsLines = function (i_indexedFaceMesh)
// Params:
//  i_indexedFaceMesh:
//   (dan.mesh.IndexedFaceMesh)
//
// Returns:
//  (dan.mesh.IndexedMesh)
{
    return new dan.mesh.IndexedMesh().toRenderBorderAsLines_setFromIndexedFaceMesh(i_indexedFaceMesh);
};

dan.mesh.IndexedMesh.fromMesh = function (i_mesh)
// Params:
//  i_mesh:
//   (dan.mesh.Mesh)
//
// Returns:
//  (dan.mesh.IndexedMesh)
{
    return new dan.mesh.IndexedMesh().setFromMesh(i_mesh);
};

// + + }}}

// + }}}

// + Set all elements at once {{{

dan.mesh.IndexedMesh.prototype.toRenderBodyAsTriangles_setFromIndexedFaceMesh = function (i_indexedFaceMesh)
// Params:
//  i_indexedFaceMesh:
//   (dan.mesh.IndexedFaceMesh)
//
// Returns:
//  (dan.mesh.IndexedMesh)
{
    // + Get vertices {{{

    // Clear vertex attribute arrays,
    // then make a new one for every vertex attribute reported to exist by i_indexedFaceMesh
    this.vertexAttributeArrays = new dan.mesh.AttributeArrays();
    i_indexedFaceMesh.toRender_recreateVertexAttributeArrays(this.vertexAttributeArrays);

    // Copy values
    i_indexedFaceMesh.toRender_getVertexAttributeArrays(this.vertexAttributeArrays);

    // + }}}

    // + Get indices {{{

    // Clear existing
    this.indices.length = 0;

    // Copy values
    i_indexedFaceMesh.toRenderBodyAsTriangles_getIndices(this.indices);

    // + }}}

    // + Get primitives {{{

    // Clear existing
    this.primitives.length = 0;

    // Copy values
    i_indexedFaceMesh.toRenderBodyAsTriangles_getPrimitives(this.primitives);

    //
    this.primitiveType = GL.ctx.TRIANGLES;

    // + }}}

    //
    return this;
};

dan.mesh.IndexedMesh.prototype.toRenderBorderAsLines_setFromIndexedFaceMesh = function (i_indexedFaceMesh)
// Params:
//  i_indexedFaceMesh:
//   (dan.mesh.IndexedFaceMesh)
//
// Returns:
//  (dan.mesh.IndexedMesh)
{
    // + Get vertices {{{

    // Clear vertex attribute arrays,
    // then make a new one for every vertex attribute reported to exist by i_indexedFaceMesh
    this.vertexAttributeArrays = new dan.mesh.AttributeArrays();
    i_indexedFaceMesh.toRender_recreateVertexAttributeArrays(this.vertexAttributeArrays);

    // Copy values
    i_indexedFaceMesh.toRender_getVertexAttributeArrays(this.vertexAttributeArrays);

    // + }}}

    // + Get indices {{{

    // Clear existing
    this.indices.length = 0;

    // Copy values
    i_indexedFaceMesh.toRenderBorderAsLines_getIndices(this.indices);

    // + }}}

    // + Get primitives {{{

    // Clear existing
    this.primitives.length = 0;

    // Copy values
    i_indexedFaceMesh.toRenderBorderAsLines_getPrimitives(this.primitives);

    //
    this.primitiveType = GL.ctx.LINES;

    // + }}}

    //
    return this;
};

dan.mesh.IndexedMesh.prototype.setFromMesh = function (i_mesh)
// Params:
//  i_mesh:
//   (dan.mesh.Mesh)
//
// Returns:
//  (dan.mesh.IndexedMesh)
{
    // + Get vertices {{{

    // Copy
    this.vertexAttributeArrays = i_mesh.vertexAttributeArrays.clone();

    // Generate indices from 0..N
    this.indices.length = 0;
    for (var vertexNo = 0; vertexNo < i_mesh.vertexAttributeArrays["a_position"].length; ++vertexNo)
    {
        this.indices.push(vertexNo);
    }

    // + }}}

    // + Get primitives {{{

    // Copy
    this.primitives = i_mesh.primitives.map(function (i_primitive) {
        return i_primitive.clone();
    });

    //
    this.primitiveType = i_mesh.primitiveType;

    // + }}}

    //
    return this;
};

// + }}}

// + Primitives {{{

dan.mesh.IndexedMesh.prototype.primitivesToVertexAttributeArrays = function ()
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

dan.mesh.IndexedMesh.prototype.primitivesToVertexAttributeArray = function (i_name)
// Create a vertex attribute array (or clear existing) named after a primitive attribute
// and then for each primitive copy its value for that attribute multiple times into the
// vertex array, once into each vertex as located by primitive indices.
//
// Note this means that if any vertices are used by more than one primitive, then the
// attribute value from the last primitive will end up overwriting all those from the
// previous primitives in that vertex.
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
    var indexNo = 0;
    for (var primitiveNo = 0; primitiveNo < this.primitives.length; ++primitiveNo)
    {
        var primitiveAttributeValue = this.primitives[primitiveNo].get(i_name);

        // Set the primitive attribute value in the vertex array
        // in every vertex that the primitive references by index
        for (var vertexNo = 0; vertexNo < primitiveVertexCount; ++vertexNo)
        {
            vertexAttributeValues[this.indices[indexNo]] = primitiveAttributeValue.clone();
            ++indexNo;
        }
    }

    // Set as the new vertex attribute array, replacing any previous one
    this.vertexAttributeArrays[i_name] = vertexAttributeValues;
};

/* Seems obsolete - remove when sure
dan.mesh.IndexedMesh.prototype.primitiveAttributesToVertexAttributeArrays = function ()
{
    for (var primitiveAttributeName in this.primitiveAttributes)
    {
        this.primitiveAttributeToVertexAttributeArray(primitiveAttributeName);
    }
};

dan.mesh.IndexedMesh.prototype.primitiveAttributeToVertexAttributeArray = function (i_name)
// Params:
//  i_name:
//   (string)
{
    var primitiveAttributeValues = this.primitiveAttributes[i_name];
    var vertexAttributeValues = [];

    // For each primitive
    for (var primitiveNo = 0; primitiveNo < primitiveAttributeValues.length; ++primitiveNo)
    {
        var primitiveAttributeValue = primitiveAttributeValues[primitiveNo];

        // Copy the face property into each of the three vertices [TODO: don't assume TRIANGLES]
        vertexAttributeValues.push( primitiveAttributeValue.clone() );
        vertexAttributeValues.push( primitiveAttributeValue.clone() );
        vertexAttributeValues.push( primitiveAttributeValue.clone() );
    }

    //
    this.vertexAttributeArrays[i_name] = vertexAttributeValues;
};
*/

// + }}}

// + Vertices {{{

dan.mesh.IndexedMesh.prototype.vertexCount = function ()
{
    return this.indices.length;
};

// + }}}

// + Transform {{{

dan.mesh.IndexedMesh.prototype.translate = function (i_xOrVector3, i_y, i_z)
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
//  (dan.mesh.IndexedMesh)
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

dan.mesh.IndexedMesh.prototype.transformByMatrix = function (i_matrix)
// Transform all 3D positions with affine 4x4 matrix
//
// Params:
//  i_matrix:
//   (dan.math.Matrix4)
//
// Returns:
//  (dan.mesh.IndexedMesh)
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

dan.mesh.IndexedMesh.prototype.uploadToBufferObjects = function ()
{
    if (!this.bufferObjects)
        this.bufferObjects = {};

    // Vertex attributes
    for (var vertexAttributeArrayName in this.vertexAttributeArrays)
    {
        // Create buffer object if it doesn't already exist
        if (!this.bufferObjects[vertexAttributeArrayName])
            this.bufferObjects[vertexAttributeArrayName] = new dan.gfx.gl.BufferObject();

        // Flatten values to typed array
        var values = this.vertexAttributeArrays[vertexAttributeArrayName];
        var valuesInTypedArray;
        if (values.length == 0)
            valuesInTypedArray = new Float32Array(0);
        else if (values[0] instanceof dan.gfx.ColourRGBA)
            valuesInTypedArray = constructTypedArrayFromColourRGBAs(Float32Array, values);
        else
            valuesInTypedArray = constructTypedArrayFromSubarrays(Float32Array, values);

        // Write data
        this.bufferObjects[vertexAttributeArrayName].allocateAndWrite(GL.ctx.STATIC_DRAW, valuesInTypedArray);
    }

    // Indices
    //  Create buffer object if it doesn't already exist
    if (!this.bufferObjects.indices)
        this.bufferObjects.indices = new dan.gfx.gl.BufferObject(null, GL.ctx.ELEMENT_ARRAY_BUFFER);
    this.bufferObjects.indices.allocateAndWrite(GL.ctx.STATIC_DRAW, new Uint16Array(this.indices));
};

// + }}}
