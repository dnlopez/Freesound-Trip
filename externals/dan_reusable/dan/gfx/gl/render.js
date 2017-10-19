
// This namespace
// #require "gl.js"

// Dan reusable
// #require <dan/mesh/Mesh.js>
// #require <dan/mesh/IndexedMesh.js>


dan.gfx.gl.setVertexAttributeArrays = function (i_program, i_bufferObjects)
{
    // For each vertex attribute declared in the shader program,
    // get the corresponding buffer of values from the mesh and enable it
    for (var attributeDeclarationName in i_program.attributeDeclarations)
    {
        var attributeDeclaration = i_program.attributeDeclarations[attributeDeclarationName];

        var valueType;
        var valueComponentCount;
        switch (attributeDeclaration.dataType)
        {
        case GL.ctx.FLOAT:
            valueType = GL.ctx.FLOAT;
            valueComponentCount = 1;
            break;
        case GL.ctx.FLOAT_VEC2:
            valueType = GL.ctx.FLOAT;
            valueComponentCount = 2;
            break;
        case GL.ctx.FLOAT_VEC3:
            valueType = GL.ctx.FLOAT;
            valueComponentCount = 3;
            break;
        case GL.ctx.FLOAT_VEC4:
            valueType = GL.ctx.FLOAT;
            valueComponentCount = 4;
            break;
        default:
            throw "renderMesh: Unsupported vertex attribute type";
            break;
        }

        // Enable pulling of values to the generic vertex attribute at its location in the shader,
        // and describe the location and format of the data coming in to that location
        GL.ctx.enableVertexAttribArray(attributeDeclaration.location);
        GL.setBufferObject(GL.ctx.ARRAY_BUFFER, i_bufferObjects[attributeDeclaration.name]);
        GL.ctx.vertexAttribPointer(attributeDeclaration.location, valueComponentCount, valueType, false, 0, 0);
    }
};

dan.gfx.gl.unsetVertexAttributeArrays = function (i_program)
{
    // For each vertex attribute declared in the shader program,
    // disable the array
    for (var attributeDeclarationName in i_program.attributeDeclarations)
    {
        var attributeDeclaration = i_program.attributeDeclarations[attributeDeclarationName];

        GL.ctx.disableVertexAttribArray(attributeDeclaration.location);
    }
};

dan.gfx.gl.renderGeneralMesh = function (i_mesh, i_program)
// Params:
//  i_mesh:
//   Either (dan.mesh.Mesh)
//   or (dan.mesh.IndexedMesh)
//  i_program:
//   (dan.gfx.gl.Program)
{
    if (i_mesh instanceof dan.mesh.Mesh)
        dan.gfx.gl.renderMesh(i_mesh, i_program);
    else if (i_mesh instanceof dan.mesh.IndexedMesh)
        dan.gfx.gl.renderIndexedMesh(i_mesh, i_program);
};

// + Literal (non-indexed) meshes {{{

dan.gfx.gl.renderMesh = function (i_mesh, i_program)
// Params:
//  i_mesh:
//   (dan.mesh.Mesh)
//  i_program:
//   (dan.gfx.gl.Program)
{
    if (i_mesh.vertexCount() == 0)
        return;

    GL.setProgram(i_program);

    this.setVertexAttributeArrays(i_program, i_mesh.bufferObjects);

    // Draw mesh by specifying vertices
    GL.ctx.drawArrays(i_mesh.primitiveType, 0, i_mesh.vertexCount());

    this.unsetVertexAttributeArrays(i_program);
};

// + }}}

// + Indexed meshes {{{

dan.gfx.gl.renderIndexedMesh = function (i_mesh, i_program)
// Params:
//  i_mesh:
//   (dan.mesh.IndexedMesh)
//  i_program:
//   (dan.gfx.gl.Program)
{
    if (i_mesh.vertexCount() == 0)
        return;

    GL.setProgram(i_program);

    this.setVertexAttributeArrays(i_program, i_mesh.bufferObjects);

    // Draw mesh by specifying vertex indices
    GL.setBufferObject(GL.ctx.ELEMENT_ARRAY_BUFFER, i_mesh.bufferObjects.indices);
    GL.ctx.drawElements(i_mesh.primitiveType, i_mesh.bufferObjects.indices.byteCount / 2, GL.ctx.UNSIGNED_SHORT, 0);

    this.unsetVertexAttributeArrays(i_program);
};

// + }}}
