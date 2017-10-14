
// This namespace
// #require "gl.js"

// Dan reusable
// #require <dan/math/Vector2.js>
// #require <dan/math/Vector3.js>
// #require <dan/math/Vector4.js>
// #require <dan/gfx/ColourRGB.js>
// #require <dan/gfx/ColourRGBA.js>
// #require <dan/math/Matrix3.js>
// #require <dan/math/Matrix4.js>


// + Construction/disposal {{{

dan.gfx.gl.Program = function ()
{
    this.program = GL.ctx.createProgram();
    this.shaders = [];

    //this.uniformLocations = {};
};

dan.gfx.gl.Program.fromString = function (i_delimitedSourceCode, i_quietError)
// Construct, then;
// create and compile multiple shaders at once from delimited, concatenated code in a string,
// then;
// link the program.
//
// Params:
//  See addShaders().
//
// Returns:
//  Either (Program)
//  or (this may only happen if i_quietError == true) (undefined)
//   an error occurred
//  or (this may only happen if i_quietError == false) throw (string) exception
//   description of the error
{
    var newProgram = new dan.gfx.gl.Program();

    if (!newProgram.addShaders(i_delimitedSourceCode, i_quietError))
        return;

    newProgram.link(i_quietError);

    return newProgram;
};

dan.gfx.gl.Program.fromStringVSFS = function (i_vertexSourceCode, i_fragmentSourceCode, i_quietError)
// Construct, then;
// Create and compile a vertex shader and a fragment shader from seperate code strings, then;
// link the program.
//
// Params:
//  See addShadersVSFS().
//
// Returns:
//  Either (Program)
//  or (this may only happen if i_quietError == true) (undefined)
//   an error occurred
//  or (this may only happen if i_quietError == false) throw (string) exception
//   description of the error
{
    var newProgram = new dan.gfx.gl.Program();

    if (!newProgram.addShadersVSFS(i_vertexSourceCode, i_fragmentSourceCode, i_quietError))
        return;

    newProgram.link(i_quietError);

    return newProgram;
};

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
};

// + }}}

// + Shader compilation utilities {{{

dan.gfx.gl.Program.prototype._compileShader = function (i_shader, i_sourceCode, i_quietError)
// Set the source of, and compile a shader.
//
// Args:
//  i_shader:
//   (WebGLShader)
//   GL ID of the shader object to compile into.
//  i_sourceCode:
//   (string)
//   Source code of the shader.
//  i_quietError:
//   Either (boolean)
//    What to do if an error occurs.
//    One of:
//     true: print the error description to console.error() and return false
//     false: throw the error description string as an exception
//   or (null or undefined)
//    use default of false
//
// Returns:
//  Either (boolean)
//   true: successful
//   false: (this may only happen if i_quietError == true) an error occurred
//  or (this may only happen if i_quietError == false) throw (string) exception
//   description of the error
{
    // Set source and compile shader
    GL.ctx.shaderSource(i_shader, i_sourceCode);  //GL_IEADTL();
    GL.ctx.compileShader(i_shader);  //GL_IEADTL();

    // Detect and log errors
    if (!GL.ctx.getShaderParameter(i_shader, GL.ctx.COMPILE_STATUS))
    {
        var errorDescription = "glCompileShader() failed. Info log: " + GL.ctx.getShaderInfoLog(i_shader);
        if (i_quietError)
        {
            console.error(errorDescription);
            return false;
        }
        throw errorDescription;
    }

    // [TODO?: VALID_STATUS]

    return true;
};


// Type: VariableInfo
//  (object with specific key-value properties)
//  Keys/Values:
//   name:
//    (string)
//    Name of uniform or vertex attribute variable.
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

dan.gfx.gl.Program.prototype._extractActiveUniformsFromProgram = function (i_program, o_variableInfos)
// Get information (name, type, location) about active uniforms in a program.
//
// Params:
//  i_program:
//   (WebGLProgram)
//   Program should already have been linked.
//  o_variableInfos:
//   (object)
//   Object has:
//    Key:
//     (string)
//     Uniform variable name
//    Value:
//     (VariableInfo)
//     Uniform variable info
//
// Returns:
//  -
{
    // Get uniforms count
    var uniformCount = GL.ctx.getProgramParameter(i_program, GL.ctx.ACTIVE_UNIFORMS);

    // For each uniform
    for (var uniformNo = 0; uniformNo < uniformCount; ++uniformNo)
    {
        var activeInfo = GL.ctx.getActiveUniform(i_program, uniformNo);

        // Skip if it's a built-in GL uniform
        if (activeInfo.name[0] == 'g' && activeInfo.name[1] == 'l' && activeInfo.name[2] == '_')
            continue;

        // Get the location (not necessarily the same as the attributeNo passed into glGetActiveAttrib() above!)
        var location = GL.ctx.getUniformLocation(i_program, activeInfo.name);

        //
        o_variableInfos[activeInfo.name] = {
            name: activeInfo.name,
            dataType: activeInfo.type,
            location: location};
    }
};

dan.gfx.gl.Program.prototype._extractActiveVertexAttributesFromProgram = function (i_program, o_variableInfo)
// Get information (name, type, location) about active vertex attributes in a program.
//
// Params:
//  i_program:
//   (WebGLProgram)
//   Program should already have been linked.
//  o_variableInfos:
//   (object)
//   Object has:
//    Key:
//     (string)
//     Attribute variable name
//    Value:
//     (VariableInfo)
//     Attribute variable info
//
// Returns:
//  -
{
    // Get attribute count
    var attributeCount = GL.ctx.getProgramParameter(i_program, GL.ctx.ACTIVE_ATTRIBUTES);

    // For each attribute
    for (var attributeNo = 0; attributeNo < attributeCount; ++attributeNo)
    {
        var activeInfo = GL.ctx.getActiveAttrib(i_program, attributeNo);

        // Skip if it's a built-in GL attribute
        if (activeInfo.name[0] == 'g' && activeInfo.name[1] == 'l' && activeInfo.name[2] == '_')
            continue;

        // Get the location (not necessarily the same as the attributeNo passed into glGetActiveAttrib() above!
        // Particularly it seems they can differ if the shader source uses "layout (location = ...)" statements to set locations explicitly).
        var location = GL.ctx.getAttribLocation(i_program, activeInfo.name);

        //
        o_variableInfo[activeInfo.name] = {
            name: activeInfo.name,
            dataType: activeInfo.type,
            location: location};
    }
};

// + }}}

// + Add shaders {{{

dan.gfx.gl.Program.prototype.addShader = function (i_shaderType, i_sourceCode, i_quietError)
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
//  i_quietError:
//   Either (boolean)
//    What to do if an error occurs.
//    One of:
//     true: print the error description to console.error() and return false
//     false: throw the error description string as an exception
//   or (null or undefined)
//    use default of false
//
// Returns:
//  Either (boolean)
//   true: shader creation and compilation was successful.
//   false: (this may only happen if i_quietError == true) an error occurred
//  or (this may only happen if i_quietError == false) throw (string) exception
//   description of the error
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
    return this._compileShader(shader, sourceCode, i_quietError);
};

dan.gfx.gl.Program.prototype.addShaders = function (i_delimitedSourceCode, i_quietError)
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
//  i_quietError:
//   Either (boolean)
//    What to do if an error occurs.
//    One of:
//     true: print the error description to console.error() and return false
//     false: throw the error description string as an exception
//   or (null or undefined)
//    use default of false
//
// Returns:
//  Either (boolean)
//   true: all shader creation and compilation was successful.
//   false: (this may only happen if i_quietError == true) an error occurred
//  or (this may only happen if i_quietError == false) throw (string) exception
//   description of the error
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
    {
        if (!this.addShader(GL.ctx.VERTEX_SHADER, vertexShaderCode, i_quietError))
            return false;
    }

    if (fragmentShaderCode != "")
    {
        if (!this.addShader(GL.ctx.FRAGMENT_SHADER, fragmentShaderCode, i_quietError))
            return false;
    }

    return true;
};

dan.gfx.gl.Program.prototype.addShadersVSFS = function (i_vertexSourceCode, i_fragmentSourceCode, i_quietError)
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
//  i_quietError:
//   Either (boolean)
//    What to do if an error occurs.
//    One of:
//     true: print the error description to console.error() and return false
//     false: throw the error description string as an exception
//   or (null or undefined)
//    use default of false
//
// Returns:
//  Either (boolean)
//   true: all shader creation and compilation was successful.
//   false: (this may only happen if i_quietError == true) an error occurred
//  or (this may only happen if i_quietError == false) throw (string) exception
//   description of the error
{
    if (!this.addShader(GL.ctx.VERTEX_SHADER, i_vertexSourceCode, i_quietError))
        return false;

    if (!this.addShader(GL.ctx.FRAGMENT_SHADER, i_fragmentSourceCode, i_quietError))
        return false;

    return true;
};


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

dan.gfx.gl.Program.prototype.link = function (i_quietError)
// Params:
//  i_quietError:
//   Either (boolean)
//    What to do if an error occurs.
//    One of:
//     true: print the error description to console.error() and return false
//     false: throw the error description string as an exception
//   or (null or undefined)
//    use default of false
//
// Returns:
//  Either (boolean)
//   true: successful
//   false: (this may only happen if i_quietError == true) an error occurred
//  or (this may only happen if i_quietError == false) throw (string) exception
//   description of the error
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
    // (Optionally, comment the above block and uncomment the call to extractActiveVertexAttributesFromProgram() below
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
        var errorDescription = "glLinkProgram() failed.\n" +
            " VALIDATE_STATUS: " + GL.ctx.getProgramParameter(this.program, GL.ctx.VALIDATE_STATUS) + ", GL error no: " + GL.ctx.getError() + "\n" +
            " Program Info Log: " + GL.ctx.getProgramInfoLog(this.program);

        if (i_quietError)
        {
            console.error(errorDescription);
            return false;
        }
        throw errorDescription;
    }

    // Detach and delete all shaders
    while (this.shaders.length > 0)
    {
        var oldShader = this.shaders.pop();

        GL.ctx.detachShader(this.program, oldShader);
        GL.ctx.deleteShader(oldShader);
    }

    // Get info about active uniforms and vertex attributes
    this.uniformDeclarations = {};
    this._extractActiveUniformsFromProgram(this.program, this.uniformDeclarations);
    this.attributeDeclarations = {};
    this._extractActiveVertexAttributesFromProgram(this.program, this.attributeDeclarations);

    //
    return true;
};

/*
bool Program::isValid()
{
    return m_shared->programId > 0;
}
*/

// + }}}

// + Load {{{

dan.gfx.gl.Program.prototype.load = function (i_delimitedSourceCode, i_quietError)
// Compile shaders and immediately link program.
//
// Params:
//  i_delimitedSourceCode:
//   (string)
//  i_quietError:
//   Either (boolean)
//    What to do if an error occurs.
//    One of:
//     true: print the error description to console.error() and return false
//     false: throw the error description string as an exception
//   or (null or undefined)
//    use default of false
//
// Returns:
//  Either (boolean)
//   true: successful
//   false: (this may only happen if i_quietError == true) an error occurred
//  or (this may only happen if i_quietError == false) throw (string) exception
//   description of the error
{
    if (!this.addShaders(i_delimitedSourceCode, i_quietError))
        return false;

    return this.link(i_quietError);
};

dan.gfx.gl.Program.prototype.loadVSFS = function (i_vertexSourceCode, i_fragmentSourceCode, i_quietError)
// Compile shaders and immediately link program.
//
// Params:
//  i_vertexSourceCode:
//   (string)
//  i_fragmentSourceCode:
//   (string)
//  i_quietError:
//   Either (boolean)
//    What to do if an error occurs.
//    One of:
//     true: print the error description to console.error() and return false
//     false: throw the error description string as an exception
//   or (null or undefined)
//    use default of false
//
// Returns:
//  Either (boolean)
//   true: successful
//   false: (this may only happen if i_quietError == true) an error occurred
//  or (this may only happen if i_quietError == false) throw (string) exception
//   description of the error
{
    if (!this.addShadersVSFS(i_vertexSourceCode, i_fragmentSourceCode, i_quietError))
        return false;

    return this.link(i_quietError);
};

/*
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
*/

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
};

dan.gfx.gl.Program.prototype.unbind = function ()
{
    GL.setProgram(null);
    //sm_currentShaderProgram = 0;
};

// + }}}

// + Variables {{{

// + + Uniforms {{{

dan.gfx.gl.Program.prototype.set = function (i_name, i_value)
// Set uniform variable value (of any type)
//
// Params:
//  i_value:
//   Value.
{
    var dataType = this.uniformDeclarations[i_name].dataType;
    switch (dataType)
    {
    case GL.ctx.INT:
        this.setInteger(i_name, i_value);
        break;
    case GL.ctx.FLOAT:
        this.setFloat(i_name, i_value);
        break;
    case GL.ctx.FLOAT_VEC2:
        this.setVector2(i_name, i_value);
        break;
    case GL.ctx.FLOAT_VEC3:
        this.setVector3(i_name, i_value);
        break;
    case GL.ctx.FLOAT_VEC4:
        this.setVector4(i_name, i_value);
        break;
    default:
        throw "Program.set() unsupported datatype";
    }
};

dan.gfx.gl.Program.prototype.set_int = function (i_name, i_value)
// Set uniform variable value
// of GLSL type int
//
// Params:
//  i_value:
//   (integer number)
{
    var location = this.uniformDeclarations[i_name].location;
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this);
    GL.ctx.uniform1i(location, i_value);
};

dan.gfx.gl.Program.prototype.set_float = function (i_name, i_value)
// Set uniform variable value
// of GLSL type float
//
// Params:
//  i_value:
//   (floating point number)
{
    var location = this.uniformDeclarations[i_name].location;
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this);
    GL.ctx.uniform1f(location, i_value);
};

dan.gfx.gl.Program.prototype.set_vec2 = function (i_name, i_value)
// Set uniform variable value
// of GLSL type vec2
//
// Params:
//  i_value:
//   Either (dan.math.Vector2)
//   or (array of 2 numbers)
{
    // Normalize overloaded arguments
    if (i_value instanceof dan.math.Vector2)
        i_value = i_value.elements;

    //
    var location = this.uniformDeclarations[i_name].location;
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this);
    GL.ctx.uniform2fv(location, i_value);
};

dan.gfx.gl.Program.prototype.set_vec3 = function (i_name, i_value)
// Set uniform variable value
// of GLSL type vec3
//
// Params:
//  i_value:
//   Either (dan.math.Vector3)
//   or (array of 3 numbers)
//   or (dan.gfx.ColourRGB)
{
    // Normalize overloaded arguments
    if (i_value instanceof dan.math.Vector3)
        i_value = i_value.elements;
    else if (i_value instanceof dan.gfx.ColourRGB)
        i_value = [i_value.r, i_value.g, i_value.b];

    //
    var location = this.uniformDeclarations[i_name].location;
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this);
    GL.ctx.uniform3fv(location, i_value);
};

dan.gfx.gl.Program.prototype.set_vec4 = function (i_name, i_value)
// Set uniform variable value
// of GLSL type vec4
//
// Params:
//  i_value:
//   Either (dan.math.Vector4)
//   or (array of 4 numbers)
//   or (dan.gfx.ColourRGBA)
{
    // Normalize overloaded arguments
    if (i_value instanceof dan.math.Vector4)
        i_value = i_value.elements;
    else if (i_value instanceof dan.gfx.ColourRGBA)
        i_value = [i_value.r, i_value.g, i_value.b, i_value.a];

    //
    var location = this.uniformDeclarations[i_name].location;
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this);
    GL.ctx.uniform4fv(location, i_value);
};

dan.gfx.gl.Program.prototype.set_mat3 = function (i_name, i_value)
// Set uniform variable value
// of GLSL type mat3
//
// Params:
//  i_value:
//   Either (dan.math.Matrix3)
//   or (array of 9 numbers)
//    Matrix elements in column-major order
{
    // Normalize overloaded arguments
    if (i_value instanceof dan.math.Matrix3)
        i_value = i_value.toColumnMajorArray();

    //
    var location = this.uniformDeclarations[i_name].location;
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */

    GL.setProgram(this);
    GL.ctx.uniformMatrix3fv(location, false, i_value);
};

dan.gfx.gl.Program.prototype.set_mat4 = function (i_name, i_value)
// Set uniform variable value
// of GLSL type mat4
//
// Params:
//  i_value:
//   Either (dan.math.Matrix4)
//   or (array of 16 numbers)
//    Matrix elements in column-major order
{
    //if (!(i_name in this.uniformLocations))
    //    this.uniformLocations[i_name] = GL.ctx.getUniformLocation(this.program, i_name);
    //var location = this.uniformLocations[i_name];

    // Normalize overloaded arguments
    if (i_value instanceof dan.math.Matrix4)
        i_value = i_value.toColumnMajorArray();

    //
    var location = this.uniformDeclarations[i_name].location;
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this);
    GL.ctx.uniformMatrix4fv(location, false, i_value);
};

// + + + Deprecated {{{

dan.gfx.gl.Program.prototype.setInteger = function (i_name, i_value)
// Set uniform variable value
// of GLSL type int
// with a JS number
//
// Params:
//  i_value:
//   (integer number)
{
    var location = this.uniformDeclarations[i_name].location;
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this);
    GL.ctx.uniform1i(location, i_value);
};

dan.gfx.gl.Program.prototype.setFloat = function (i_name, i_value)
// Set uniform variable value
// of GLSL type float
// with a JS number
//
// Params:
//  i_value:
//   (floating point number)
{
    var location = this.uniformDeclarations[i_name].location;
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this);
    GL.ctx.uniform1f(location, i_value);
};

dan.gfx.gl.Program.prototype.setVector2 = function (i_name, i_value)
// Set uniform variable value
// of GLSL type vec2
// with a JS dan.math.Vector2
//
// Params:
//  i_value:
//   (dan.math.Vector2)
{
    var location = this.uniformDeclarations[i_name].location;
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this);
    GL.ctx.uniform2fv(location, i_value.elements);
};

dan.gfx.gl.Program.prototype.setVector3 = function (i_name, i_value)
// Set uniform variable value
// of GLSL type vec3
// with a JS dan.math.Vector3
//
// Params:
//  i_value:
//   (dan.math.Vector3)
{
    var location = this.uniformDeclarations[i_name].location;
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this);
    GL.ctx.uniform3fv(location, i_value.elements);
};

dan.gfx.gl.Program.prototype.setVector4 = function (i_name, i_value)
// Set uniform variable value
// of GLSL type vec4
// with a JS dan.math.Vector4
//
// Params:
//  i_value:
//   (dan.math.Vector4)
{
    var location = this.uniformDeclarations[i_name].location;
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this);
    GL.ctx.uniform4fv(location, i_value.elements);
};

dan.gfx.gl.Program.prototype.setColourRGBA = function (i_name, i_value)
// Set uniform variable value
// of GLSL type vec4
// with a JS dan.gfx.ColourRGBA
//
// Params:
//  i_value:
//   (dan.gfx.ColourRGBA)
{
    var location = this.uniformDeclarations[i_name].location;
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this);
    GL.ctx.uniform4fv(location, [i_value.r, i_value.g, i_value.b, i_value.a]);
};

dan.gfx.gl.Program.prototype.setMatrix3 = function (i_name, i_value)
// Set uniform variable value
// of GLSL type mat3
// with a JS dan.math.Matrix3
//
// Params:
//  i_value:
//   Either (dan.math.Matrix3)
{
    var location = this.uniformDeclarations[i_name].location;
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */

    GL.setProgram(this);
    GL.ctx.uniformMatrix3fv(location, false,
                            i_value.toColumnMajorArray());
};

dan.gfx.gl.Program.prototype.setMatrix4 = function (i_name, i_value)
// Set uniform variable value
// of GLSL type mat4
// with a JS dan.math.Matrix4
//
// Params:
//  i_value:
//   (dan.math.Matrix4)
{
    //if (!(i_name in this.uniformLocations))
    //    this.uniformLocations[i_name] = GL.ctx.getUniformLocation(this.program, i_name);
    //var location = this.uniformLocations[i_name];

    var location = this.uniformDeclarations[i_name].location;
    /*
        if (location == -1)
        {
            LOG.print(string("In Program::set(), glGetUniformLocation() returned -1 for ") + i_name + "\n");
        }
    */
    GL.setProgram(this);
    GL.ctx.uniformMatrix4fv(location, false,
                            i_value.toColumnMajorArray());
};

// + + + }}}

// + + }}}

// + + Attributes {{{

dan.gfx.gl.Program.prototype.getUniformLocation = function (i_name)
// Search the active uniform declarations to find
// the numerical location of an uniform specified by name.
//
// Params:
//  i_name:
//   (string)
//   The name of the uniform.
//
// Returns:
//  (integer number)
//  The numerical location, or -1 if an uniform with this name was not found.
{
    if (i_name in this.uniformDeclarations)
        return this.uniformDeclarations[i_name].location;
    else
        return -1;
};

dan.gfx.gl.Program.prototype.getAttributeLocation = function (i_name)
// Search the active attribute declarations to find
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
};

// + + }}}

// + }}}
