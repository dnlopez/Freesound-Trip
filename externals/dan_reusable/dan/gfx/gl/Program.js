
// This namespace
// #require "gl.js"
// #require "Context.js"


// + Construction/disposal {{{

dan.gfx.gl.Program = function ()
{
    this.program = GL.ctx.createProgram();
    this.shaders = [];

    //this.uniformLocations = {};
}

dan.gfx.gl.Program.fromString = function (i_delimitedSourceCode)
// Construct, then;
// create and compile multiple shaders at once from delimited, concatenated code in a string,
// then;
// link the program.
//
// Params:
//  See addShaders().
//
// Returns:
//  (Program)
{
    var newProgram = new dan.gfx.gl.Program();

    if (!newProgram.addShaders(i_delimitedSourceCode))
        return;

    newProgram.link();

    return newProgram;
}

dan.gfx.gl.Program.fromStringVSFS = function (i_vertexSourceCode, i_fragmentSourceCode)
// Construct, then;
// Create and compile a vertex shader and a fragment shader from seperate code strings, then;
// link the program.
//
// Params:
//  See addShadersVSFS().
//
// Returns:
//  (Program)
{
    var newProgram = new dan.gfx.gl.Program();

    if (!newProgram.addShadersVSFS(i_vertexSourceCode, i_fragmentSourceCode))
        return;

    newProgram.link();

    return newProgram;
}

/*
// TODO: sync/async load
dan.gfx.gl.Program.fromFile = function (i_delimitedSourceFilePath)
// Params:
//  See ...
//
// Returns:
//  (Program)
{
    var newProgram = new dan.gfx.gl.Program();

    if (!newProgram.addShadersFromFile(i_delimitedSourceFilePath))
        return NULL;

    if (!newProgram.link())
        return NULL;

    return newProgram;
}

dan.gfx.gl.Program.fromFileVSFS = function (i_vertexSourceFilePath, i_fragmentSourceFilePath)
// Params:
//  See ...
//
// Returns:
//  (Program)
{
    var newProgram = new dan.gfx.gl.Program();

    if (!newProgram.addShadersVSFSFromFiles(i_vertexSourceFilePath, i_fragmentSourceFilePath))
        return NULL;

    if (!newProgram.link())
        return NULL;

    return newProgram;
}
*/

dan.gfx.gl.Program.prototype.dispose = function ()
{
    // Delete any shaders that have been left over here
    // (Them being here happens to mean they didn't get as far as being
    // compiled or linked into the program else they would have been
    // deleted already)
    for (var shaderNo = 0; shaderNo < this.shaders.length; ++shaderNo)
    {
        GL.ctx.deleteShader(this.shaders[shaderNo]);
    }

    // Delete program
    GL.ctx.deleteProgram(this.program);
}

// + }}}

// + Shader compilation utilities {{{

dan.gfx.gl.Program.prototype._compileShader = function (i_shader, i_sourceCode)
// Set the source of, and compile a shader.
//
// Args:
//  i_shader:
//   (WebGLShader)
//   GL ID of the shader object to compile into.
//  i_sourceCode:
//   (string)
//   Source code of the shader.
//
// Returns:
//  (boolean)
//  true if successful, else false.
{
    // Set source and compile shader
    GL.ctx.shaderSource(i_shader, i_sourceCode);  //GL_IEADTL();
    GL.ctx.compileShader(i_shader);  //GL_IEADTL();

    // Detect and log errors
    if (!GL.ctx.getShaderParameter(i_shader, GL.ctx.COMPILE_STATUS))
    {
        console.error("glCompileShader() failed. Info log: " + GL.ctx.getShaderInfoLog(i_shader));
        return false;
    }

    // [TODO?: VALID_STATUS]

    return true;
}


// Type: VertexAttributeDeclaration
//  (object with specific key-value properties)
//  Keys/Values:
//   name:
//    (string)
//   dataType:
//    (integer number)
//    One of:
//     GL.FLOAT
//     GL.FLOAT_VEC2
//     GL.FLOAT_VEC3
//     GL.FLOAT_VEC4
//     [etc, see GL...]
//   location:
//    (integer number)

dan.gfx.gl.Program.prototype._extractVertexAttributesFromProgram = function (i_program, o_destVector)
// Params:
//  i_program:
//   (WebGLProgram)
//  o_destVector:
//   (array of VertexAttributeDeclaration)
//  
// Returns:
//  (boolean)
{
    // Get attribute count
    var attributeCount = GL.ctx.getProgramParameter(i_program, GL.ctx.ACTIVE_ATTRIBUTES);

    // For each attribute
    for (var attributeNo = 0; attributeNo < attributeCount; ++attributeNo)
    {
        var attrib = GL.ctx.getActiveAttrib(i_program, attributeNo);

        // Skip if it's a built-in GL attribute
        if (attrib.name[0] == 'g' && attrib.name[1] == 'l' && attrib.name[2] == '_')
            continue;

        // Get the location (not necessarily the same as the attributeNo passed into
        // glGetActiveAttrib() above! Particularly it seems they can differ if the shader
        // source uses "layout (location = ...)" statements to set locations explicitly).
        var location = GL.ctx.getAttribLocation(i_program, attrib.name);

        //
        o_destVector[attrib.name] = {
            name: attrib.name,
            dataType: attrib.type,
            location: location};
    }

    return true;
}

// + }}}

// + Add shaders {{{

dan.gfx.gl.Program.prototype.addShader = function (i_shaderType, i_sourceCode)
// Create and compile a single shader from source code in a string,
// and keep hold of the compiled object for later linking.
//
// Params:
//  i_shaderType:
//   (integer number)
//   Shader pipeline stage
//   eg. GL.VERTEX_SHADER, GL.FRAGMENT_SHADER
//  i_sourceCode:
//   (string)
//   GLSL code of the shader.
//
// Returns:
//  (boolean)
//  true if shader creation and compilation was successful.
//  false if any error occurred.
{
    /*
    if (!m_shared)
        m_shared.reset(new Shared());
    */

    var sourceCode = "";

    /*
    // Prepend lines to set precision if on GL ES
    #ifdef USE_OPENGL_ES
        if (i_shaderType == GL_FRAGMENT_SHADER)
        {
            sourceCode += "precision highp float;\n";
            sourceCode += "precision highp int;\n";
        }
    #endif
    */

    //
    sourceCode += i_sourceCode;

    // Create and save object for later linking
    var shader = GL.ctx.createShader(i_shaderType);  //GL_IEADTL();
    this.shaders.push(shader);

    // Compile
    if (!this._compileShader(shader, sourceCode))
    {
        return false;
    }

    //
    return true;
}

dan.gfx.gl.Program.prototype.addShaders = function (i_delimitedSourceCode)
// Create and compile multiple shaders at once from delimited, concatenated code in a string,
// and keep hold of the compiled objects for later linking.
//
// Params:
//  i_delimitedSourceCode:
//   (string)
//   Source code of one or more shaders, where a single-line comment in one of the following
//   forms must precede each block of GLSL code, to mark where it starts and declare which
//   shader pipeline stage it is for:
//    //[VERT]
//     <followed by vertex shader code>
//    //[FRAG]
//     <followed by fragment shader code>
//
// Returns:
//  (boolean)
//  true if all shader creation and compilation was successful.
//  false if any error occurred.
{
    // Scan the code line by line,
    // switching current shader type when we find a shader type heading,
    // appending intermediate lines to the extracted code for that shader type

    var vertexShaderCode;
    var fragmentShaderCode;
    var currentShaderCode = null;

    var sourceCodeLines = i_delimitedSourceCode.split("\n");
    for (var sourceCodeLineNo = 0; sourceCodeLineNo < sourceCodeLines.length; ++sourceCodeLineNo)
    {
        var line = sourceCodeLines[sourceCodeLineNo];

        if (line == "//[VERT]")
        {
            currentShaderCode = "vertex";
        }
        else if (line == "//[FRAG]")
        {
            currentShaderCode = "fragment";
        }
        else if (currentShaderCode)
        {
            if (currentShaderCode == "vertex")
                vertexShaderCode += line + "\n";
            else if (currentShaderCode == "fragment")
                fragmentShaderCode += line + "\n";
        }
    }

    // Add any shaders for which code was included

    if (vertexShaderCode != "")
        if (!this.addShader(GL.ctx.VERTEX_SHADER, vertexShaderCode))
            return false;

    if (fragmentShaderCode != "")
        if (!this.addShader(GL.ctx.FRAGMENT_SHADER, fragmentShaderCode))
            return false;

    return true;
}

dan.gfx.gl.Program.prototype.addShadersVSFS = function (i_vertexSourceCode, i_fragmentSourceCode)
// Create and compile a vertex shader and a fragment shader from seperate code strings,
// and keep hold of the compiled objects for later linking.
//
// Params:
//  i_vertexSourceCode:
//   (string)
//   GLSL code of vertex shader.
//  i_fragmentSourceCode:
//   (string)
//   GLSL code of fragment shader.
//
// Returns:
//  (boolean)
//  true if all shader creation and compilation was successful.
//  false if any error occurred.
{
    if (!this.addShader(GL.ctx.VERTEX_SHADER, i_vertexSourceCode))
        return false;

    if (!this.addShader(GL.ctx.FRAGMENT_SHADER, i_fragmentSourceCode))
        return false;

    return true;
}


/*
dan.gfx.gl.Program.prototype.addShaderFromFile = function (i_shaderType, i_sourceFilePath)
// Create and compile a single shader from source code in a disk file,
// and keep hold of the compiled object for later linking.
//
// Params:
//  i_shaderType:
//   (integer number)
//   Shader pipeline stage
//   eg. GL.VERTEX_SHADER, GL.FRAGMENT_SHADER
//  i_sourceFilePath:
//   Path of file that contains GLSL code of the shader.
//
// Returns:
//  (boolean)
//  true if shader creation and compilation was successful.
//  false if any error occurred.
{
    // Open file
    ifstream sourceFile(i_sourceFilePath.c_str());
    if (sourceFile.fail())
    {
        dan.gfx.gl.Program.handleError("Failed to open shader source code file: " + i_sourceFilePath);
        return false;
    }

    //
    string sourceCode;

    // Get whole file length, reserve string length in advance
    sourceFile.seekg(0, ios_base::end);
    sourceCode.reserve(sourceFile.tellg());
    sourceFile.seekg(0, ios_base::beg);

    // Load whole file contents
    sourceCode.assign(istreambuf_iterator<char>(sourceFile), istreambuf_iterator<char>());

    //
    return addShader(i_shaderType, sourceCode);
}

dan.gfx.gl.Program.prototype.addShadersFromFile = function (const string & i_delimitedSourceFilePath)
// Create and compile multiple shaders at once from delimited, concatenated code in a disk file,
// and keep hold of the compiled objects for later linking.
//
// Params:
//  i_delimitedSourceFilePath:
//   Path of file that contains source code of one or more shaders,
//   in same format as described above under addShaders().
//
// Returns:
//  (boolean)
//  true if all shader creation and compilation was successful.
//  false if any error occurred.
{
    // Open file
    ifstream sourceFile(i_delimitedSourceFilePath.c_str());
    if (sourceFile.fail())
    {
        dan.gfx.gl.Program.handleError("Failed to open shader source code file: " + i_delimitedSourceFilePath);
        return false;
    }

    //
    string sourceCode;

    // Get whole file length, reserve string length in advance
    sourceFile.seekg(0, ios_base::end);
    sourceCode.reserve(sourceFile.tellg());
    sourceFile.seekg(0, ios_base::beg);

    // Load whole file contents
    sourceCode.assign(istreambuf_iterator<char>(sourceFile), istreambuf_iterator<char>());

    //
    return addShaders(sourceCode);
}

dan.gfx.gl.Program.prototype.addShadersVSFSFromFiles = function (const string & i_vertexSourceFilePath, const string & i_fragmentSourceFilePath)
// Create and compile a vertex shader and a fragment shader from seperate code strings,
// and keep hold of the compiled objects for later linking.
//
// Params:
//  i_vertexSourceFilePath:
//   Path of file that contains GLSL code of vertex shader.
//  i_fragmentSourceFilePath:
//   Path of file that contains GLSL code of fragment shader.
//
// Returns:
//  (boolean)
//  true if all shader creation and compilation was successful.
//  false if any error occurred.
{
    //// Vertex shader

    // Open vertex file
    ifstream sourceFile(i_vertexSourceFilePath.c_str());
    if (sourceFile.fail())
    {
        dan.gfx.gl.Program.handleError("Failed to open vertex shader source code file: " + i_vertexSourceFilePath);
        return false;
    }

    //
    string vertexSourceCode;

    // Get whole file length, reserve string length in advance
    sourceFile.seekg(0, ios_base::end);
    vertexSourceCode.reserve(sourceFile.tellg());
    sourceFile.seekg(0, ios_base::beg);

    // Load whole file contents
    vertexSourceCode.assign(istreambuf_iterator<char>(sourceFile), istreambuf_iterator<char>());

    //// Fragment shader

    // Open fragment file
    sourceFile.close();
    sourceFile.open(i_fragmentSourceFilePath.c_str());
    if (sourceFile.fail())
    {
        dan.gfx.gl.Program.handleError("Failed to open fragment shader source code file: " + i_fragmentSourceFilePath);
        return false;
    }

    //
    string fragmentSourceCode;

    // Get whole file length, reserve string length in advance
    sourceFile.seekg(0, ios_base::end);
    fragmentSourceCode.reserve(sourceFile.tellg());
    sourceFile.seekg(0, ios_base::beg);

    // Load whole file contents
    fragmentSourceCode.assign(istreambuf_iterator<char>(sourceFile), istreambuf_iterator<char>());

    ////

    return addShadersVSFS(vertexSourceCode, fragmentSourceCode);
}
*/

// + }}}

// + Link {{{

dan.gfx.gl.Program.prototype.link = function ()
// Returns:
//  (boolean)
{
    /*
    if (!m_shared)
        m_shared.reset(new Shared());
    */

    /*
    // Parse vertex shader source for generic attribute declarations, record in m_shared->attributeDeclarations,
    // then bind them to known indexes with glBindAttribLocation() before linking
    m_shared->attributeDeclarations.clear();
    extractVertexAttributesFromSourceCode(i_vertexShaderCode, m_shared->attributeDeclarations);
    for (unsigned int i = 0; i < m_shared->attributeDeclarations.size(); ++i)
    {
        glBindAttribLocation(m_shared->programId,
                             m_shared->attributeDeclarations[i].location,
                             m_shared->attributeDeclarations[i].name.c_str());  GL_IEADTL();
    }
    */
    // (Optionally, comment the above block and uncomment the call to extractVertexAttributesFromProgram() below
    // after linking to use the auto-assigned values)

    // Attach all shaders
    for (var shaderNo = 0; shaderNo < this.shaders.length; ++shaderNo)
    {
        GL.ctx.attachShader(this.program, this.shaders[shaderNo]);
    }

    // Link
    GL.ctx.linkProgram(this.program);  //GL_IEADTL();

    // Detect and log errors
    if (!GL.ctx.getProgramParameter(this.program, GL.ctx.LINK_STATUS))
    {
        console.error("glLinkProgram() failed.\n" +
                      " VALIDATE_STATUS: " + GL.ctx.getProgramParameter(this.program, GL.ctx.VALIDATE_STATUS) + ", GL error no: " + GL.ctx.getError() + "\n" +
                      " Program Info Log: " + GL.ctx.getProgramInfoLog(this.program));
        return false;
    }

    // Detach and delete all shaders
    while (this.shaders.length > 0)
    {
        var oldShader = this.shaders.pop();

        GL.ctx.detachShader(this.program, oldShader);
        GL.ctx.deleteShader(oldShader);
    }

    //
    this.attributeDeclarations = {};
    if (!this._extractVertexAttributesFromProgram(this.program, this.attributeDeclarations))
        return false;

    //
    return true;
}

/*
bool Program::isValid()
{
    return m_shared->programId > 0;
}
*/

// + }}}

// + Load {{{

dan.gfx.gl.Program.prototype.load = function (i_delimitedSourceCode)
// Compile shaders and immediately link program.
//
// Params:
//  i_delimitedSourceCode:
//   (string)
//
// Returns:
//  (boolean)
//  true if successful, else false.
{
    if (!this.addShaders(i_delimitedSourceCode))
        return false;

    return this.link();
}

dan.gfx.gl.Program.prototype.loadVSFS = function (i_vertexSourceCode, i_fragmentSourceCode)
// Compile shaders and immediately link program.
//
// Params:
//  i_vertexSourceCode:
//   (string)
//  i_fragmentSourceCode:
//   (string)
//
// Returns:
//  (boolean)
//  true if successful, else false.
{
    if (!this.addShadersVSFS(i_vertexSourceCode, i_fragmentSourceCode))
        return false;

    return this.link();
}

dan.gfx.gl.Program.prototype.loadFromFile = function (i_delimitedSourceFilePath)
// Compile shaders and immediately link program.
//
// Params:
//  i_delimitedSourceFilePath:
//   (string)
//
// Returns:
//  (boolean)
//  true if successful, else false.
{
    if (!this.addShadersFromFile(i_delimitedSourceFilePath))
        return false;

    return this.link();
}

dan.gfx.gl.Program.prototype.loadVSFSFromFiles = function (i_vertexSourceFilePath, i_fragmentSourceFilePath)
// Compile shaders and immediately link program.
//
// Params:
//  i_vertexSourceFilePath:
//   (string)
//  i_fragmentSourceFilePath:
//   (string)
//
// Returns:
//  (boolean)
//  true if successful, else false.
{
    if (!this.addShadersVSFS(i_vertexSourceFilePath, i_fragmentSourceFilePath))
        return false;

    return this.link();
}

// + }}}

// + Binding {{{

//var sm_currentShaderProgram = 0;

dan.gfx.gl.Program.prototype.bind = function ()
// Reload the shader if necessary,
// then activate the shader in GL with glUseProgram.
{
    /*
    if (m_shared->autoReload)
    {
        if (m_shared->autoReloadTimer++ > 10)
        {
            Log::singleton().printf("Reloading %s\n", m_shared->fileName);
            m_shared->autoReloadTimer = 0;

            //// Load text from file

            ifstream file(m_shared->fileName);
            if (!file.fail())
            {
                string shaderCode;

                file.seekg(0, ios_base::end);
                shaderCode.reserve(file.tellg());
                file.seekg(0, ios_base::beg);

                shaderCode.assign((istreambuf_iterator<char>(file)),
                                  istreambuf_iterator<char>());

                //// Unbind shader, reparse code

                unbind();
                load(shaderCode);
            }
        }
    }
    */

    //if (m_shared->programId > 0) {
    GL.setProgram(this);  //GL_IEADTL();
    //sm_currentShaderProgram = this;
    //}
}

dan.gfx.gl.Program.prototype.unbind = function ()
{
    GL.setProgram(null);
    //sm_currentShaderProgram = 0;
}

// + }}}

// + Variables {{{

// + + Uniforms {{{

dan.gfx.gl.Program.prototype.setInteger = function (i_name, i_value)
// Set uniform variable value
//
// Params:
//  i_value:
//   (integer number)
{
    var location = GL.ctx.getUniformLocation(this.program, i_name);
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this); 
    GL.ctx.uniform1i(location, i_value);
}

dan.gfx.gl.Program.prototype.setFloat = function (i_name, i_value)
// Set uniform variable value
//
// Params:
//  i_value:
//   (floating point number)
{
    var location = GL.ctx.getUniformLocation(this.program, i_name);
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this); 
    GL.ctx.uniform1f(location, i_value);
}

dan.gfx.gl.Program.prototype.setVector2 = function (i_name, i_value)
// Set uniform variable value
//
// Params:
//  i_value:
//   (dan.Vector2)
{
    var location = GL.ctx.getUniformLocation(this.program, i_name);
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this); 
    GL.ctx.uniform2fv(location, i_value.elements);
}

dan.gfx.gl.Program.prototype.setVector3 = function (i_name, i_value)
// Set uniform variable value
//
// Params:
//  i_value:
//   (dan.Vector3)
{
    var location = GL.ctx.getUniformLocation(this.program, i_name);
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this); 
    GL.ctx.uniform3fv(location, i_value.elements);
}

dan.gfx.gl.Program.prototype.setVector4 = function (i_name, i_value)
// Set uniform variable value
{
    var location = GL.ctx.getUniformLocation(this.program, i_name);
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this); 
    GL.ctx.uniform4fv(location, i_value.elements);
}

dan.gfx.gl.Program.prototype.setColourRGBA = function (i_name, i_value)
// Set uniform variable value
{
    var location = GL.ctx.getUniformLocation(this.program, i_name);
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this); 
    GL.ctx.uniform4fv(location, [i_value.r, i_value.g, i_value.b, i_value.a]);
}

dan.gfx.gl.Program.prototype.setMatrix3 = function (i_name, i_value)
// Set uniform variable value
//
// Params:
//  i_value:
//   (dan.Matrix3)
{
    var location = GL.ctx.getUniformLocation(this.program, i_name);
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    
    GL.setProgram(this); 
    GL.ctx.uniformMatrix3fv(location, false,
                            i_value.toColumnMajorArray());
}

dan.gfx.gl.Program.prototype.setMatrix4 = function (i_name, i_value)
// Set uniform variable value
//
// Params:
//  i_value:
//   (dan.Matrix4)
{
    //if (!(i_name in this.uniformLocations))
    //    this.uniformLocations[i_name] = GL.ctx.getUniformLocation(this.program, i_name);
    //var location = this.uniformLocations[i_name];

    var location = GL.ctx.getUniformLocation(this.program, i_name);
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this); 
    GL.ctx.uniformMatrix4fv(location, false,
                            i_value.toColumnMajorArray());
}

// + + }}}

// + + Attributes {{{

dan.gfx.gl.Program.prototype.getAttributeLocation = function (i_name)
// Search the attribute declarations to find
// the numerical location of an attribute specified by name.
//
// Params:
//  i_name:
//   (string)
//   The name of the attribute.
//
// Returns:
//  (integer number)
//  The numerical location, or -1 if an attribute with this name was not found.
{
    if (i_name in this.attributeDeclarations)
        return this.attributeDeclarations[i_name].location;
    else
        return -1;
}

// + + }}}

// + }}}
