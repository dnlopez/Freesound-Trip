
// This namespace
// #require "gl.js"
// #require "SubTexture2D.js"
// #require "Texture.js"

// Dan reusable
// #require <dan/math/Rect2.js>
// #require <dan/math/Vector4.js>


// Type: ScissorState
//  (object with specific key-value properties)
//  Keys/values:
//   enabled:
//    Either (boolean)
//    or (undefined)
//     use default of false.
//   rect:
//    Either (dan.math.Rect2)
//    or (undefined)
//     use default of a rectangle at (0, 0) with zero size.

// Type: BlendState
//  (object with specific key-value properties)
//  Keys/values:
//   enabled:
//    Either (boolean)
//    or (undefined)
//     use default of false
//   srcRgb:
//    Either (GLenum)
//    or (undefined)
//     use default of 0
//   srcAlpha:
//    Either (GLenum)
//    or (undefined)
//     use default of 0
//   destRgb:
//    Either (GLenum)
//    or (undefined)
//     use default of 0
//   destAlpha:
//    Either (GLenum)
//    or (undefined)
//     use default of 0
//   colour:
//    Either (dan.math.Vector4)
//    or (undefined)
//     use default of (0, 0, 0, 0)
//   equationRgb:
//    Either (GLenum)
//    or (undefined)
//     use default of ctx.FUNC_ADD
//   equationAlpha:
//    Either (GLenum)
//    or (undefined)
//     use default of ctx.FUNC_ADD

// Type: DepthState
//  (object with specific key-value properties)
//  Keys/values:
//   testEnabled:
//    Either (boolean)
//    or (undefined)
//     use default of false
//   writingEnabled:
//    Either (boolean)
//    or (undefined)
//     use default of true
//   testFunc:
//    Either (GLenum)
//    or (undefined)
//     use default of ctx.LESS

// Type: StencilState
//  (object with specific key-value properties)
//  Keys/values:
//   testEnabled:
//    Either (boolean)
//    or (undefined)
//     use default of false
//
//   testFunc:
//    Either (GLenum)
//    or (undefined)
//     use default of ctx.ALWAYS
//   testRef:
//    Either (GLint)
//    or (undefined)
//     use default of 0
//   testValueMask:
//    Either (GLuint)
//    or (undefined)
//     use default of -1
//   onFail:
//    Either (GLenum)
//    or (undefined)
//     use default of ctx.KEEP
//   onZFail:
//    Either (GLenum)
//    or (undefined)
//     use default of ctx.KEEP
//   onZPass:
//    Either (GLenum)
//    or (undefined)
//     use default of ctx.KEEP
//   writingEnabled:
//    Either (GLboolean)
//    or (undefined)
//     use default of true
//
//   backTestFunc:
//    Either (GLenum)
//    or (undefined)
//     use default of same as testFunc
//   backTestRef:
//    Either (GLint)
//    or (undefined)
//     use default of same as testRef
//   backTestValueMask:
//    Either (GLuint)
//    or (undefined)
//     use default of same as testValueMask
//   backOnFail:
//    Either (GLenum)
//    or (undefined)
//     use default of same as onFail
//   backOnZFail:
//    Either (GLenum)
//    or (undefined)
//     use default of same as onZFail
//   backOnZPass:
//    Either (GLenum)
//    or (undefined)
//     use default of same as onZPass
//   backWritingEnabled:
//    Either (GLboolean)
//    or (undefined)
//     use default of same as writingEnabled

// Type: CullState
//  (object with specific key-value properties)
//  Keys/values:
//   cullEnabled:
//    Either (boolean)
//    or (undefined)
//     use default of false
//   cullFace:
//    Either (GLenum)
//    or (undefined)
//     use default of ctx.BACK
//   frontFace:
//    Either (GLenum)
//    or (undefined)
//     use default of ctx.CCW

// Type: TextureUnitState
//  (object with specific key-value properties)
//  Keys/values:
//   texture2dBinding: (WebGLTexture)
//   textureCubeMapBinding: (WebGLTexture) [or null?]


// + Construction {{{

dan.gfx.gl.Context = function (i_context)
// Params:
//  i_context:
//   (WebGLRenderingContext)
{
    this.m_context = i_context;
    this.ctx = this.m_context;

    this.m_activeTextureUnitStack = [];
    // m_activeTextureUnitStack:
    //  (array of integer number)
    this.m_textureUnits = [];
    // m_textureUnits:
    //  (array of TextureUnitState)
    this.m_programStack = [];
    // m_programStack:
    //  (array of WebGLProgram)
    this.m_lineWidthStack = [];
    // m_lineWidthStack:
    //  (array of float number)
    this.m_bufferObjectStacks = [[], []];
    // m_bufferObjectStacks:
    //  (array of array of WebGLBuffer)
    this.m_framebufferStack = [];
    // m_framebufferStack:
    //  (array of WebGLFramebuffer)
    this.m_viewportStack = [];
    // m_viewportStack:
    //  (array of dan.math.Rect2)
    this.m_scissorStack = [];
    // m_scissorStack:
    //  (array of ScissorState)
    this.m_blendStack = [];
    // m_blendStack:
    //  (array of BlendState)
    this.m_depthStack = [];
    // m_depthStack:
    //  (array of DepthState)
    this.m_stencilStack = [];
    // m_stencilStack:
    //  (array of StencilState)
    this.m_cullStack = [];
    // m_cullStack:
    //  (array of CullState)
    this.m_unpackAlignmentStack = [];
    // m_unpackAlignmentStack:
    //  (array of integer number)
    this.m_packAlignmentStack = [];
    // m_packAlignmentStack:
    //  (array of integer number)
    this.resetToGlState();
};

dan.gfx.gl.Context.prototype.resetToGlState = function ()
// Get the state from GL of all settings that this class handles
{
    // + Textures {{{

    // Get current active texture unit for stack
    var currentActiveTextureUnit = this.ctx.getParameter(this.ctx.ACTIVE_TEXTURE);
    currentActiveTextureUnit -= this.ctx.TEXTURE0;
    this.m_activeTextureUnitStack.length = 0;
    this.m_activeTextureUnitStack.push(currentActiveTextureUnit);

    // Get count of texture units
    this.m_textureUnitCount = this.ctx.getParameter(this.ctx.MAX_TEXTURE_IMAGE_UNITS);

    // Get bindings and environment settings of each texture unit.
    // Restore previously active texture unit when done
    this.m_textureUnits.length = this.m_textureUnitCount;
    for (var textureUnitNo = 0; textureUnitNo < this.m_textureUnitCount; ++textureUnitNo)
    {
        this.ctx.activeTexture(this.ctx.TEXTURE0 + textureUnitNo);
        this.m_textureUnits[textureUnitNo] = { texture2dBinding: this.ctx.getParameter(this.ctx.TEXTURE_BINDING_2D),
                                               textureCubeMapBinding: this.ctx.getParameter(this.ctx.TEXTURE_BINDING_CUBE_MAP) };
    }
    this.ctx.activeTexture(this.ctx.TEXTURE0 + this.m_activeTextureUnitStack[this.m_activeTextureUnitStack.length - 1]);

    // + }}}

    this.m_programStack.length = 0;
    this.m_programStack.push(this.ctx.getParameter(this.ctx.CURRENT_PROGRAM));

    this.m_lineWidthStack.length = 0;
    this.m_lineWidthStack.push(this.ctx.getParameter(this.ctx.LINE_WIDTH));

    this.m_bufferObjectStacks[0].length = 0;
    this.m_bufferObjectStacks[0].push(this.ctx.getParameter(this.ctx.ARRAY_BUFFER_BINDING));
    this.m_bufferObjectStacks[1].length = 0;
    this.m_bufferObjectStacks[1].push(this.ctx.getParameter(this.ctx.ELEMENT_ARRAY_BUFFER_BINDING));

    this.m_framebufferStack.length = 0;
    this.m_framebufferStack.push(this.ctx.getParameter(this.ctx.FRAMEBUFFER_BINDING));

    var currentViewport = this.ctx.getParameter(this.ctx.VIEWPORT);
    this.m_viewportStack.length = 0;
    this.m_viewportStack.push(dan.math.Rect2.fromXYWH(currentViewport[0], currentViewport[1], currentViewport[0] + currentViewport[2], currentViewport[1] + currentViewport[3]));

    var currentScissorRect = this.ctx.getParameter(this.ctx.SCISSOR_BOX);
    this.m_scissorStack.length = 0;
    this.m_scissorStack.push({ enabled: this.ctx.getParameter(this.ctx.SCISSOR_TEST),
                               rect: dan.math.Rect2.fromXYWH(currentScissorRect[0], currentScissorRect[1], currentScissorRect[0] + currentScissorRect[2], currentScissorRect[1] + currentScissorRect[3]) });

    this.m_blendStack.length = 0;
    this.m_blendStack.push({ enabled: this.ctx.getParameter(this.ctx.BLEND),
                             srcRgb: this.ctx.getParameter(this.ctx.BLEND_SRC_RGB),
                             srcAlpha: this.ctx.getParameter(this.ctx.BLEND_SRC_ALPHA),
                             destRgb: this.ctx.getParameter(this.ctx.BLEND_DST_RGB),
                             destAlpha: this.ctx.getParameter(this.ctx.BLEND_DST_ALPHA),
                             colour: dan.math.Vector4.fromArray(this.ctx.getParameter(this.ctx.BLEND_COLOR)),
                             equationRgb: this.ctx.getParameter(this.ctx.BLEND_EQUATION_RGB),
                             equationAlpha: this.ctx.getParameter(this.ctx.BLEND_EQUATION_ALPHA) });

    this.m_depthStack.length = 0;
    this.m_depthStack.push({ testEnabled: this.ctx.getParameter(this.ctx.DEPTH_TEST),
                             writingEnabled: this.ctx.getParameter(this.ctx.DEPTH_WRITEMASK),
                             testFunc: this.ctx.getParameter(this.ctx.DEPTH_FUNC) });

    this.m_stencilStack.length = 0;
    this.m_stencilStack.push({ testEnabled: this.ctx.getParameter(this.ctx.STENCIL_TEST),
                               testFunc: this.ctx.getParameter(this.ctx.STENCIL_FUNC),
                               testRef: this.ctx.getParameter(this.ctx.STENCIL_REF),
                               testValueMask: this.ctx.getParameter(this.ctx.STENCIL_VALUE_MASK),
                               onFail: this.ctx.getParameter(this.ctx.STENCIL_FAIL),
                               onZFail: this.ctx.getParameter(this.ctx.STENCIL_PASS_DEPTH_FAIL),
                               onZPass: this.ctx.getParameter(this.ctx.STENCIL_PASS_DEPTH_PASS),
                               writingEnabled: this.ctx.getParameter(this.ctx.STENCIL_WRITEMASK),
                               backTestFunc: this.ctx.getParameter(this.ctx.STENCIL_BACK_FUNC),
                               backTestRef: this.ctx.getParameter(this.ctx.STENCIL_BACK_REF),
                               backTestValueMask: this.ctx.getParameter(this.ctx.STENCIL_BACK_VALUE_MASK),
                               backOnFail: this.ctx.getParameter(this.ctx.STENCIL_BACK_FAIL),
                               backOnZFail: this.ctx.getParameter(this.ctx.STENCIL_BACK_PASS_DEPTH_FAIL),
                               backOnZPass: this.ctx.getParameter(this.ctx.STENCIL_BACK_PASS_DEPTH_PASS),
                               backWritingEnabled: this.ctx.getParameter(this.ctx.STENCIL_BACK_WRITEMASK) });

    this.m_cullStack.length = 0;
    this.m_cullStack.push({ cullEnabled: this.ctx.getParameter(this.ctx.CULL_FACE),
                            cullFace: this.ctx.getParameter(this.ctx.CULL_FACE_MODE),
                            frontFace: this.ctx.getParameter(this.ctx.FRONT_FACE) });

    this.m_unpackAlignmentStack.length = 0;
    this.m_unpackAlignmentStack.push(this.ctx.getParameter(this.ctx.UNPACK_ALIGNMENT));

    this.m_packAlignmentStack.length = 0;
    this.m_packAlignmentStack.push(this.ctx.getParameter(this.ctx.PACK_ALIGNMENT));
};

// + }}}

// + Textures {{{

// + + Texture unit (glActiveTexture) stack {{{

// + + + Set {{{

dan.gfx.gl.Context.prototype.setActiveTextureUnit = function (i_unitNo, i_safe)
// Params:
//  i_unitNo:
//   (integer number)
//  i_safe:
//   (boolean)
{
    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || i_unitNo != this.m_activeTextureUnitStack[this.m_activeTextureUnitStack.length - 1])
    {
        this.ctx.activeTexture(this.ctx.TEXTURE0 + i_unitNo);
    }
    // Put on stack
    this.m_activeTextureUnitStack[this.m_activeTextureUnitStack.length - 1] = i_unitNo;
};

dan.gfx.gl.Context.prototype.pushActiveTextureUnit = function (i_unitNo, i_safe)
// Params:
//  i_unitNo:
//   (integer number)
//  i_safe:
//   (boolean)
{
    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || i_unitNo != this.m_activeTextureUnitStack[this.m_activeTextureUnitStack.length - 1])
    {
        this.ctx.activeTexture(this.ctx.TEXTURE0 + i_unitNo);
    }
    // Push on stack
    this.m_activeTextureUnitStack.push(i_unitNo);
};

dan.gfx.gl.Context.prototype.popActiveTextureUnit = function (i_safe)
//  i_safe:
//   (boolean)
{
    var previous = this.m_activeTextureUnitStack[this.m_activeTextureUnitStack.length - 1];

    // Pop from stack
    this.m_activeTextureUnitStack.pop();
    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || this.m_activeTextureUnitStack[this.m_activeTextureUnitStack.length - 1] != previous)
    {
        this.ctx.activeTexture(this.ctx.TEXTURE0 + this.m_activeTextureUnitStack[this.m_activeTextureUnitStack.length - 1]);
    }
};

// + + + }}}

// + + + Get {{{

dan.gfx.gl.Context.prototype.getActiveTextureUnit = function ()
// Returns:
//  (integer number)
{
    return this.m_activeTextureUnitStack[this.m_activeTextureUnitStack.length - 1];
};

// + + + }}}

// + + + Diagnostics {{{

dan.gfx.gl.Context.prototype.activeTextureUnitStackToString = function (i_verbose)
// Params:
//  i_verbose:
//   (boolean)
//
// Returns:
//  (string)
{
    var out = "";

    // Item count
    out += "(" + this.m_activeTextureUnitStack.length + ") ";
    // Items up to but not including item on top of stack
    if (i_verbose) {
        for (var activeTextureUnitNo = 0; activeTextureUnitNo < this.m_activeTextureUnitStack.length - 1; ++activeTextureUnitNo) {
            out += this.m_activeTextureUnitStack[activeTextureUnitNo] + ", ";
        }
    }
    // Item on top of stack
    if (this.m_activeTextureUnitStack.length != 0)
        out += this.m_activeTextureUnitStack[this.m_activeTextureUnitStack.length - 1];

    return out;
};

// + + + }}}

// + + }}}

// + + State within each texture unit {{{

dan.gfx.gl.Context.prototype.bindTexture = function (i_textureTarget, i_texture, i_safe)
// Params:
//  i_textureTarget:
//   (GLenum)
//  i_texture:
//   Either (WebGLTexture)
//   or (dan.gfx.gl.Texture)
//   or (dan.gfx.gl.SubTexture2D)
//   or (null)
//  i_safe:
//   (boolean)
{
    // Normalize overloaded arguments
    if (i_texture instanceof dan.gfx.gl.SubTexture2D)
        i_texture = i_texture.texture;
    if (i_texture instanceof dan.gfx.gl.Texture)
        i_texture = i_texture.glTextureObject;

    //
    if (i_textureTarget == this.ctx.TEXTURE_2D)
    {
        if (i_safe || i_texture != this.m_textureUnits[this.m_activeTextureUnitStack[this.m_activeTextureUnitStack.length - 1]].texture2dBinding)
        {
            this.ctx.bindTexture(i_textureTarget, i_texture);
            this.m_textureUnits[this.m_activeTextureUnitStack[this.m_activeTextureUnitStack.length - 1]].texture2dBinding = i_texture;
        }
    }
    else if (i_textureTarget == this.ctx.TEXTURE_CUBE_MAP)
    {
        if (i_safe || i_texture != this.m_textureUnits[this.m_activeTextureUnitStack[this.m_activeTextureUnitStack.length - 1]].textureCubeMapBinding)
        {
            this.ctx.bindTexture(i_textureTarget, i_texture);
            this.m_textureUnits[this.m_activeTextureUnitStack[this.m_activeTextureUnitStack.length - 1]].textureCubeMapBinding = i_texture;
        }
    }
    else
    {
        this.ctx.bindTexture(i_textureTarget, i_texture);
    }
};

// + + }}}

// + }}}

// + Program (glUseProgram) stack {{{

// + + Set from a GL object {{{

dan.gfx.gl.Context.prototype.setProgram = function (i_program, i_safe)
// Params:
//  i_program:
//   Either (WebGLProgram)
//   or (dan.gfx.gl.Program)
//   or (null)
//  i_safe:
//   (boolean)
{
    // Normalize overloaded arguments
    if (i_program instanceof dan.gfx.gl.Program)
        i_program = i_program.program;

    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || i_program != this.m_programStack[this.m_programStack.length - 1])
    {
        this.ctx.useProgram(i_program);
    }
    // Put on stack
    this.m_programStack[this.m_programStack.length - 1] = i_program;
};

dan.gfx.gl.Context.prototype.pushProgram = function (i_program, i_safe)
// Params:
//  i_program:
//   Either (WebGLProgram)
//   or (dan.gfx.gl.Program)
//   or (null)
//  i_safe:
//   (boolean)
{
    // Normalize overloaded arguments
    if (i_program instanceof dan.gfx.gl.Program)
        i_program = i_program.program;

    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || i_program != this.m_programStack[this.m_programStack.length - 1])
    {
        this.ctx.useProgram(i_program);
    }
    // Push on stack
    this.m_programStack.push(i_program);
};

dan.gfx.gl.Context.prototype.popProgram = function (i_safe)
// Params:
//  i_safe:
//   (boolean)
{
    var previous = this.m_programStack[this.m_programStack.length - 1];

    // Pop from stack
    this.m_programStack.pop();
    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || this.m_programStack[this.m_programStack.length - 1] != previous)
    {
        this.ctx.useProgram(this.m_programStack[this.m_programStack.length - 1]);
    }
};

// + + }}}

// + + Diagnostics {{{

dan.gfx.gl.Context.prototype.programStackToString = function (i_verbose)
// Params:
//  i_verbose:
//   (boolean)
//
// Returns:
//  (string)
{
    var out = "";

    // Item count
    out += "(" + this.m_programStack.length + ") ";
    // Items up to but not including item on top of stack
    if (i_verbose) {
        for (var programNo = 0; programNo < this.m_programStack.length - 1; ++programNo) {
            out += this.m_programStack[programNo] + ", ";
        }
    }
    // Item on top of stack
    if (this.m_programStack.length != 0)
        out += this.m_programStack[this.m_programStack.length - 1];

    return out;
};

// + + }}}

// + }}}

// + Line width (this.ctx.lineWidth) stack {{{

// + + Set {{{

dan.gfx.gl.Context.prototype.setLineWidth = function (i_lineWidth, i_safe)
// Params:
//  i_lineWidth:
//   (number, float)
//  i_safe:
//   (boolean)
{
    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || i_lineWidth != this.m_lineWidthStack[this.m_lineWidthStack.length - 1])
    {
        this.ctx.lineWidth(i_lineWidth);
    }
    // Put on stack
    this.m_lineWidthStack[this.m_lineWidthStack.length - 1] = i_lineWidth;
};

dan.gfx.gl.Context.prototype.pushLineWidth = function (i_lineWidth, i_safe)
// Params:
//  i_lineWidth:
//   (number, float)
//  i_safe:
//   (boolean)
{
    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || i_lineWidth != this.m_lineWidthStack[this.m_lineWidthStack.length - 1])
    {
        this.ctx.lineWidth(i_lineWidth);
    }
    // Push on stack
    this.m_lineWidthStack.push(i_lineWidth);
};

dan.gfx.gl.Context.prototype.popLineWidth = function (i_safe)
// Params:
//  i_safe:
//   (boolean)
{
    var previous = this.m_lineWidthStack[this.m_lineWidthStack.length - 1];

    // Pop from stack
    this.m_lineWidthStack.pop();
    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || this.m_lineWidthStack[this.m_lineWidthStack.length - 1] != previous)
    {
        this.ctx.lineWidth(this.m_lineWidthStack[this.m_lineWidthStack.length - 1]);
    }
};

// + + }}}

// + + Diagnostics {{{

dan.gfx.gl.Context.prototype.lineWidthStackToString = function (i_verbose)
// Params:
//  i_verbose:
//   (boolean)
//
// Returns:
//  (string)
{
    var out = "";

    // Item count
    out += "(" + this.m_lineWidthStack.length + ") ";
    // Items up to but not including item on top of stack
    if (i_verbose) {
        for (var lineWidthNo = 0; lineWidthNo < this.m_lineWidthStack.length - 1; ++lineWidthNo) {
            out += this.m_lineWidthStack[lineWidthNo] + ", ";
        }
    }
    // Item on top of stack
    if (this.m_lineWidthStack.length != 0)
        out += this.m_lineWidthStack[this.m_lineWidthStack.length - 1];

    return out;
};

// + + }}}

// + }}}

// + Buffer object stacks {{{

// + + Set from a GL object {{{

dan.gfx.gl.Context.prototype.setBufferObject = function (i_target, i_buffer, i_safe)
// Params:
//  i_target:
//   (GLenum)
//   One of:
//    GL_ARRAY_BUFFER
//    GL_ELEMENT_ARRAY_BUFFER
//  i_buffer:
//   Either (WebGLBuffer)
//   or (dan.gfx.gl.BufferObject)
//  i_safe:
//   (boolean)
{
    // Normalize overloaded arguments
    if (i_buffer instanceof dan.gfx.gl.BufferObject)
        i_buffer = i_buffer.glObject;

    // Call GL only if we think the state has changed or if we're just being safe
    var stack = this.m_bufferObjectStacks[i_target - GL.ctx.ARRAY_BUFFER];
    if (i_safe || i_buffer != stack[stack.length - 1])
    {
        this.ctx.bindBuffer(i_target, i_buffer);
    }
    // Put on stack
    stack[stack.length - 1] = i_buffer;
};

dan.gfx.gl.Context.prototype.pushBufferObject = function (i_target, i_buffer, i_safe)
// Params:
//  i_target:
//   (GLenum)
//   One of:
//    GL_ARRAY_BUFFER
//    GL_ELEMENT_ARRAY_BUFFER
//  i_buffer:
//   Either (WebGLBuffer)
//   or (dan.gfx.gl.BufferObject)
//  i_safe:
//   (boolean)
{
    // Normalize overloaded arguments
    if (i_buffer instanceof dan.gfx.gl.BufferObject)
        i_buffer = i_buffer.glObject;

    // Call GL only if we think the state has changed or if we're just being safe
    var stack = this.m_bufferObjectStacks[i_target - GL.ctx.ARRAY_BUFFER];
    if (i_safe || i_buffer != stack[stack.length - 1])
    {
        this.ctx.bindBuffer(i_target, i_buffer);
    }
    // Push on stack
    stack.push(i_buffer);
};

dan.gfx.gl.Context.prototype.popBufferObject = function (i_target, i_safe)
// Params:
//  i_target:
//   (GLenum)
//   One of:
//    GL_ARRAY_BUFFER
//    GL_ELEMENT_ARRAY_BUFFER
//  i_safe:
//   (boolean)
{
    var stack = this.m_bufferObjectStacks[i_target - GL.ctx.ARRAY_BUFFER];
    var previous = stack[stack.length - 1];

    // Pop from stack
    stack.pop();
    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || stack[stack.length - 1] != previous)
    {
        this.ctx.bindBuffer(i_target, stack[stack.length - 1]);
    }
};

// + + }}}

// + + Diagnostics {{{

dan.gfx.gl.Context.prototype.bufferObjectStackToString = function (i_target, i_verbose)
// Params:
//  i_verbose:
//   (boolean)
//
// Returns:
//  (string)
{
    var out = "";

    // Item count
    var stack = this.m_bufferObjectStacks[i_target - GL.ctx.ARRAY_BUFFER];
    out += "(" + stack.length + ") ";
    // Items up to but not including item on top of stack
    if (i_verbose) {
        for (var bufferObjectNo = 0; bufferObjectNo < stack.length - 1; ++bufferObjectNo) {
            out += stack[bufferObjectNo] + ", ";
        }
    }
    // Item on top of stack
    if (stack.length != 0)
        out += stack[stack.length - 1];

    return out;
};

// + + }}}

// + }}}

// + Framebuffer binding (glBindFramebuffer/GL_FRAMEBUFFER) stack {{{

dan.gfx.gl.Context.prototype.setFramebuffer = function (i_framebuffer, i_safe)
// Params:
//  i_framebuffer:
//   Either (WebGLFramebuffer)
//   or (dan.gfx.gl.Framebuffer)
//   or (null)
//  i_safe:
//   (boolean)
{
    // Normalize overloaded arguments
    if (i_framebuffer instanceof dan.gfx.gl.Framebuffer)
        i_framebuffer = i_framebuffer.glObject;

    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || i_framebuffer != this.m_framebufferStack[this.m_framebufferStack.length - 1])
    {
        this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, i_framebuffer);
    }

    // Put on stack
    this.m_framebufferStack[this.m_framebufferStack.length - 1] = i_framebuffer;
};

dan.gfx.gl.Context.prototype.pushFramebuffer = function (i_framebuffer, i_safe)
// Params:
//  i_framebuffer:
//   Either (WebGLFramebuffer)
//   or (dan.gfx.gl.Framebuffer)
//   or (null)
//  i_safe:
//   (boolean)
{
    // Normalize overloaded arguments
    if (i_framebuffer instanceof dan.gfx.gl.Framebuffer)
        i_framebuffer = i_framebuffer.glObject;

    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || i_framebuffer != this.m_framebufferStack[this.m_framebufferStack.length - 1])
    {
        this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, i_framebuffer);
    }

    // Push on stack
    this.m_framebufferStack.push(i_framebuffer);
};
dan.gfx.gl.Context.prototype.popFramebuffer = function (i_safe)
// Params:
//  i_safe:
//   (boolean)
{
    var previous = this.m_framebufferStack[this.m_framebufferStack.length - 1];

    // Pop from stack
    this.m_framebufferStack.pop();
    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || this.m_framebufferStack[this.m_framebufferStack.length - 1] != previous)
    {
        this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, this.m_framebufferStack[this.m_framebufferStack.length - 1]);
    }
};

dan.gfx.gl.Context.prototype.framebufferStackToString = function (i_verbose)
// Params:
//  i_verbose:
//   (boolean)
//
// Returns:
//  (string)
{
    var out = "";

    // Item count
    out += "(" + this.m_framebufferStack.length + ") ";
    // Items up to but not including item on top of stack
    if (i_verbose) {
        for (var framebufferNo = 0; framebufferNo < this.m_framebufferStack.length - 1; ++framebufferNo) {
            out += this.m_framebufferStack[framebufferNo] + ", ";
        }
    }
    // Item on top of stack
    if (this.m_framebufferStack.length != 0)
        out += this.m_framebufferStack[this.m_framebufferStack.length - 1];

    return out;
};

// + }}}

// + Viewport binding (glViewport) stack {{{

dan.gfx.gl.Context.prototype.setViewport = function (i_rectOrX, i_y, i_width, i_height)
// Params:
//  i_rectOrX:
//   Either (dan.math.Rect2)
//   or (integer number)
//  i_y:
//   (integer number)
//  i_width:
//   (integer number)
//  i_height:
//   (integer number)
{
    // Normalize overloaded arguments
    if (!(i_rectOrX instanceof dan.math.Rect2))
    {
        i_rectOrX = dan.math.Rect2.fromXYWH(i_rectOrX, i_y, i_width, i_height);
    }

    // Call GL
    this.ctx.viewport(i_rectOrX.left, i_rectOrX.top, i_rectOrX.width(), i_rectOrX.height());
    // Put on stack
    this.m_viewportStack[this.m_viewportStack.length - 1] = i_rectOrX;
};

dan.gfx.gl.Context.prototype.getViewport = function ()
// Returns:
//  (dan.math.Rect2)
{
    return this.m_viewportStack[this.m_viewportStack.length - 1];
};

dan.gfx.gl.Context.prototype.pushViewport = function (i_rectOrX, i_y, i_width, i_height)
// Params:
//  i_rectOrX:
//   Either (dan.math.Rect2)
//   or (integer number)
//  i_y:
//   (integer number)
//  i_width:
//   (integer number)
//  i_height:
//   (integer number)
{
    // Normalize overloaded arguments
    if (!(i_rectOrX instanceof dan.math.Rect2))
    {
        i_rectOrX = dan.math.Rect2.fromXYWH(i_rectOrX, i_y, i_width, i_height);
    }

    // Call GL
    this.ctx.viewport(i_rectOrX.left, i_rectOrX.top, i_rectOrX.width(), i_rectOrX.height());
    // Push on stack
    this.m_viewportStack.push(i_rectOrX);
};

dan.gfx.gl.Context.prototype.popViewport = function ()
{
    // Pop from stack
    this.m_viewportStack.pop();
    // Call GL
    this.ctx.viewport(this.m_viewportStack[this.m_viewportStack.length - 1].left, this.m_viewportStack[this.m_viewportStack.length - 1].top, this.m_viewportStack[this.m_viewportStack.length - 1].width(), this.m_viewportStack[this.m_viewportStack.length - 1].height());
};

// + }}}

// + Scissor box (glScissor) stack {{{

dan.gfx.gl.Context.prototype.setScissor = function (i_state)
// Params:
//  i_stateOrEnabled:
//   (ScissorState)
{
    // Apply default arguments
    if (!i_state.enabled)
        i_state.enabled = false;
    if (!i_state.rect)
        i_state.rect = dan.math.Rect2.fromXYWH(0, 0, 0, 0);

    // Call GL
    if (i_state.enabled) {
        this.ctx.enable(this.ctx.SCISSOR_TEST);
        this.ctx.scissor(i_state.rect.left, i_state.rect.top, i_state.rect.width(), i_state.rect.height());
    }
    else {
        this.ctx.disable(this.ctx.SCISSOR_TEST);
    }
    // Put on stack
    this.m_scissorStack[this.m_scissorStack.length - 1] = i_state;
};

dan.gfx.gl.Context.prototype.pushScissor = function (i_state)
// Params:
//  i_state:
//   (ScissorState)
{
    // Call GL
    if (i_state.enabled) {
        this.ctx.enable(this.ctx.SCISSOR_TEST);
        this.ctx.scissor(i_state.rect.left, i_state.rect.top, i_state.rect.width(), i_state.rect.height());
    }
    else {
        this.ctx.disable(this.ctx.SCISSOR_TEST);
    }
    // Push on stack
    this.m_scissorStack.push(i_state);
};

dan.gfx.gl.Context.prototype.popScissor = function ()
{
    // Pop from stack
    this.m_scissorStack.pop();
    // Call GL
    var back = this.m_scissorStack[this.m_scissorStack.length - 1];
    if (back.enabled) {
        this.ctx.enable(this.ctx.SCISSOR_TEST);
        this.ctx.scissor(back.rect.left, back.rect.top, back.rect.width(), back.rect.height());
    }
    else {
        this.ctx.disable(this.ctx.SCISSOR_TEST);
    }
};

dan.gfx.gl.Context.prototype.scissorStackToString = function (i_verbose)
// Params:
//  i_verbose:
//   (boolean)
//
// Returns:
//  (string)
{
    var out = "";

    // Item count
    out += "(" + this.m_scissorStack.length + ") ";
    // Items up to but not including item on top of stack
    if (i_verbose) {
        for (var scissorNo = 0; scissorNo < this.m_scissorStack.length - 1; ++scissorNo) {
            out += "(" + this.m_scissorStack[scissorNo].enabled.toString() + ", ";
            out += this.m_scissorStack[scissorNo].rect.toString();
            out += "), ";
        }
    }
    // Item on top of stack
    if (this.m_scissorStack.length != 0)
    {
        out += "(" + this.m_scissorStack[this.m_scissorStack.length - 1].toString() + ", ";
        out += this.m_scissorStack[this.m_scissorStack.length - 1].rect.toString();
        out += ")";
    }

    return out;
};

// + }}}

// + Blend state stack {{{

dan.gfx.gl.Context.prototype.setBlend = function (i_state)
// Params:
//  i_state:
//   (BlendState)
{
    // Apply default arguments
    if (!i_state.srcRgb)
        i_state.srcRgb = 0;
    if (!i_state.srcAlpha)
        i_state.srcAlpha = 0;
    if (!i_state.destRgb)
        i_state.destRgb = 0;
    if (!i_state.destAlpha)
        i_state.destAlpha = 0;
    if (!i_state.colour)
        i_state.colour = dan.math.Vector4.fromElements(0, 0, 0, 0);
    if (!i_state.equationRgb)
        i_state.equationRgb = this.ctx.FUNC_ADD;
    if (!i_state.equationAlpha)
        i_state.equationAlpha = this.ctx.FUNC_ADD;

    // Call GL
    if (i_state.enabled) {
        this.ctx.enable(this.ctx.BLEND);
        this.ctx.blendFuncSeparate(i_state.srcRgb, i_state.destRgb, i_state.srcAlpha, i_state.destAlpha);
        this.ctx.blendColor(i_state.colour.elements[0], i_state.colour.elements[1], i_state.colour.elements[2], i_state.colour.elements[3]);
        this.ctx.blendEquationSeparate(i_state.equationRgb, i_state.equationAlpha);
    }
    else {
        this.ctx.disable(this.ctx.BLEND);
    }
    // Put on stack
    this.m_blendStack[this.m_blendStack.length - 1] = i_state;
};

dan.gfx.gl.Context.prototype.pushBlend = function (i_state)
// Params:
//  i_state:
//   (BlendState)
{
    // Apply default arguments
    if (!i_state.srcRgb)
        i_state.srcRgb = 0;
    if (!i_state.srcAlpha)
        i_state.srcAlpha = 0;
    if (!i_state.destRgb)
        i_state.destRgb = 0;
    if (!i_state.destAlpha)
        i_state.destAlpha = 0;
    if (!i_state.colour)
        i_state.colour = dan.math.Vector4.fromElements(0, 0, 0, 0);
    if (!i_state.equationRgb)
        i_state.equationRgb = this.ctx.FUNC_ADD;
    if (!i_state.equationAlpha)
        i_state.equationAlpha = this.ctx.FUNC_ADD;

    // Call GL
    if (i_state.enabled) {
        this.ctx.enable(this.ctx.BLEND);
        this.ctx.blendFuncSeparate(i_state.srcRgb, i_state.destRgb, i_state.srcAlpha, i_state.destAlpha);
        this.ctx.blendColor(i_state.colour.elements[0], i_state.colour.elements[1], i_state.colour.elements[2], i_state.colour.elements[3]);
        this.ctx.blendEquationSeparate(i_state.equationRgb, i_state.equationAlpha);
    }
    else {
        this.ctx.disable(this.ctx.BLEND);
    }
    // Push on stack
    this.m_blendStack.push(i_state);
};

dan.gfx.gl.Context.prototype.popBlend = function ()
{
    // Pop from stack
    this.m_blendStack.pop();
    // Call GL
    var back = this.m_blendStack[this.m_blendStack.length - 1];
    if (back.enabled) {
        this.ctx.enable(this.ctx.BLEND);
        this.ctx.blendFuncSeparate(back.srcRgb, back.destRgb, back.srcAlpha, back.destAlpha);
        this.ctx.blendColor(back.colour.elements[0], back.colour.elements[1], back.colour.elements[2], back.colour.elements[3]);
        this.ctx.blendEquationSeparate(back.equationRgb, back.equationAlpha);
    }
    else {
        this.ctx.disable(this.ctx.BLEND);
    }
};

// + }}}
 
// + Depth state stack {{{

dan.gfx.gl.Context.prototype.setDepth = function (i_state)
// Parans:
//  i_state:
//   (DepthState)
{
    // Apply default arguments
    if (!i_state.testEnabled)
        i_state.testEnabled = false;
    if (!i_state.writingEnabled)
        i_state.writingEnabled = true;
    if (!i_state.testFunc)
        i_state.testFunc = this.ctx.LESS;

    // Call GL
    if (i_state.testEnabled) {
        this.ctx.enable(this.ctx.DEPTH_TEST);
        this.ctx.depthFunc(i_state.testFunc);
    }
    else {
        this.ctx.disable(this.ctx.DEPTH_TEST);
    }
    this.ctx.depthMask(i_state.writingEnabled);
    // Put on stack
    this.m_depthStack[this.m_depthStack.length - 1] = i_state;
};

dan.gfx.gl.Context.prototype.pushDepth = function (i_state)
// Parans:
//  i_state:
//   (DepthState)
{
    // Apply default arguments
    if (!i_state.testEnabled)
        i_state.testEnabled = false;
    if (!i_state.writingEnabled)
        i_state.writingEnabled = true;
    if (!i_state.testFunc)
        i_state.testFunc = this.ctx.LESS;

    // Call GL
    if (i_state.testEnabled) {
        this.ctx.enable(this.ctx.DEPTH_TEST);
        this.ctx.depthFunc(i_state.testFunc);
    }
    else {
        this.ctx.disable(this.ctx.DEPTH_TEST);
    }
    this.ctx.depthMask(i_state.writingEnabled);
    // Push on stack
    this.m_depthStack.push(i_state);
};

dan.gfx.gl.Context.prototype.popDepth = function ()
{
    // Pop from stack
    this.m_depthStack.pop();
    // Call GL
    var back = this.m_depthStack[this.m_depthStack.length - 1];
    if (back.testEnabled) {
        this.ctx.enable(this.ctx.DEPTH_TEST);
        this.ctx.depthFunc(back.testFunc);
    }
    else {
        this.ctx.disable(this.ctx.DEPTH_TEST);
    }
    this.ctx.depthMask(back.writingEnabled);
};

// + }}}

// + Stencil state stack {{{

dan.gfx.gl.Context.prototype.setStencil = function (i_state)
// Parans:
//  i_state:
//   (StencilState)
{
    // Apply default arguments
    if (!i_state.testEnabled)
        i_state.testEnabled = false;
    if (!i_state.testFunc)
        i_state.testFunc = this.ctx.ALWAYS;
    if (!i_state.testRef)
        i_state.testRef = 0;
    if (!i_state.testValueMask)
        i_state.testValueMask = -1;
    if (!i_state.onFail)
        i_state.onFail = GL.ctx.KEEP;
    if (!i_state.onZFail)
        i_state.onZFail = GL.ctx.KEEP;
    if (!i_state.onZPass)
        i_state.onZPass = GL.ctx.KEEP;
    if (!i_state.writingEnabled)
        i_state.writingEnabled = true;
    if (!i_state.backTestFunc)
        i_state.backTestFunc = i_state.testFunc;
    if (!i_state.backTestRef)
        i_state.backTestRef = i_state.testRef;
    if (!i_state.backTestValueMask)
        i_state.backTestValueMask = i_state.testValueMask;
    if (!i_state.backOnFail)
        i_state.backOnFail = i_state.onFail;
    if (!i_state.backOnZFail)
        i_state.backOnZFail = i_state.onZFail;
    if (!i_state.backOnZPass)
        i_state.backOnZPass = i_state.onZPass;
    if (!i_state.backWritingEnabled)
        i_state.backWritingEnabled = i_state.writingEnabled;

    // Call GL
    if (i_state.testEnabled) {
        this.ctx.enable(this.ctx.STENCIL_TEST);

        if (i_state.testFunc == i_state.backTestFunc &&
            i_state.testRef == i_state.backTestRef &&
            i_state.testValueMask == i_state.backTestValueMask)
        {
            this.ctx.stencilFunc(i_state.testFunc, i_state.testRef, i_state.testValueMask);
        }
        else
        {
            this.ctx.stencilFuncSeparate(GL.ctx.FRONT, i_state.testFunc, i_state.testRef, i_state.testValueMask);
            this.ctx.stencilFuncSeparate(GL.ctx.BACK, i_state.backTestFunc, i_state.backTestRef, i_state.backTestValueMask);
        }

        if (i_state.onFail == i_state.backOnFail &&
            i_state.onZFail == i_state.backOnZFail &&
            i_state.onZPass == i_state.backOnZPass)
        {
            this.ctx.stencilOp(i_state.onFail, i_state.onZFail, i_state.onZPass);
        }
        else
        {
            this.ctx.stencilOpSeparate(GL.ctx.FRONT, i_state.onFail, i_state.onZFail, i_state.onZPass);
            this.ctx.stencilOpSeparate(GL.ctx.BACK, i_state.backOnFail, i_state.backOnZFail, i_state.backOnZPass);
        }

        if (i_state.writingEnabled == i_state.backWritingEnabled)
        {
            this.ctx.stencilMask(i_state.writingEnabled);
        }
        else
        {
            this.ctx.stencilMaskSeparate(GL.ctx.FRONT, i_state.writingEnabled);
            this.ctx.stencilMaskSeparate(GL.ctx.BACK, i_state.backWritingEnabled);
        }
    }
    else {
        this.ctx.disable(this.ctx.STENCIL_TEST);
    }

    // Put on stack
    this.m_stencilStack[this.m_stencilStack.length - 1] = i_state;
};

dan.gfx.gl.Context.prototype.pushStencil = function (i_state)
// Parans:
//  i_state:
//   (StencilState)
{
    // Apply default arguments
    if (!i_state.testEnabled)
        i_state.testEnabled = false;
    if (!i_state.testFunc)
        i_state.testFunc = this.ctx.ALWAYS;
    if (!i_state.testRef)
        i_state.testRef = 0;
    if (!i_state.testValueMask)
        i_state.testValueMask = -1;
    if (!i_state.onFail)
        i_state.onFail = GL.ctx.KEEP;
    if (!i_state.onZFail)
        i_state.onZFail = GL.ctx.KEEP;
    if (!i_state.onZPass)
        i_state.onZPass = GL.ctx.KEEP;
    if (!i_state.writingEnabled)
        i_state.writingEnabled = true;
    if (!i_state.backTestFunc)
        i_state.backTestFunc = i_state.testFunc;
    if (!i_state.backTestRef)
        i_state.backTestRef = i_state.testRef;
    if (!i_state.backTestValueMask)
        i_state.backTestValueMask = i_state.testValueMask;
    if (!i_state.backOnFail)
        i_state.backOnFail = i_state.onFail;
    if (!i_state.backOnZFail)
        i_state.backOnZFail = i_state.onZFail;
    if (!i_state.backOnZPass)
        i_state.backOnZPass = i_state.onZPass;
    if (!i_state.backWritingEnabled)
        i_state.backWritingEnabled = i_state.writingEnabled;

    // Call GL
    if (i_state.testEnabled) {
        this.ctx.enable(this.ctx.STENCIL_TEST);

        if (i_state.testFunc == i_state.backTestFunc &&
            i_state.testRef == i_state.backTestRef &&
            i_state.testValueMask == i_state.backTestValueMask)
        {
            this.ctx.stencilFunc(i_state.testFunc, i_state.testRef, i_state.testValueMask);
        }
        else
        {
            this.ctx.stencilFuncSeparate(GL.ctx.FRONT, i_state.testFunc, i_state.testRef, i_state.testValueMask);
            this.ctx.stencilFuncSeparate(GL.ctx.BACK, i_state.backTestFunc, i_state.backTestRef, i_state.backTestValueMask);
        }

        if (i_state.onFail == i_state.backOnFail &&
            i_state.onZFail == i_state.backOnZFail &&
            i_state.onZPass == i_state.backOnZPass)
        {
            this.ctx.stencilOp(i_state.onFail, i_state.onZFail, i_state.onZPass);
        }
        else
        {
            this.ctx.stencilOpSeparate(GL.ctx.FRONT, i_state.onFail, i_state.onZFail, i_state.onZPass);
            this.ctx.stencilOpSeparate(GL.ctx.BACK, i_state.backOnFail, i_state.backOnZFail, i_state.backOnZPass);
        }

        if (i_state.writingEnabled == i_state.backWritingEnabled)
        {
            this.ctx.stencilMask(i_state.writingEnabled);
        }
        else
        {
            this.ctx.stencilMaskSeparate(GL.ctx.FRONT, i_state.writingEnabled);
            this.ctx.stencilMaskSeparate(GL.ctx.BACK, i_state.backWritingEnabled);
        }
    }
    else {
        this.ctx.disable(this.ctx.STENCIL_TEST);
    }

    // Push on stack
    this.m_stencilStack.push(i_state);
};

dan.gfx.gl.Context.prototype.popStencil = function ()
{
    // Pop from stack
    this.m_stencilStack.pop();

    // Call GL
    var back = this.m_stencilStack[this.m_stencilStack.length - 1];
    if (back.testEnabled) {
        this.ctx.enable(this.ctx.STENCIL_TEST);

        if (back.testFunc == back.backTestFunc &&
            back.testRef == back.backTestRef &&
            back.testValueMask == back.backTestValueMask)
        {
            this.ctx.stencilFunc(back.testFunc, back.testRef, back.testValueMask);
        }
        else
        {
            this.ctx.stencilFuncSeparate(GL.ctx.FRONT, back.testFunc, back.testRef, back.testValueMask);
            this.ctx.stencilFuncSeparate(GL.ctx.BACK, back.backTestFunc, back.backTestRef, back.backTestValueMask);
        }

        if (back.onFail == back.backOnFail &&
            back.onZFail == back.backOnZFail &&
            back.onZPass == back.backOnZPass)
        {
            this.ctx.stencilOp(back.onFail, back.onZFail, back.onZPass);
        }
        else
        {
            this.ctx.stencilOpSeparate(GL.ctx.FRONT, back.onFail, back.onZFail, back.onZPass);
            this.ctx.stencilOpSeparate(GL.ctx.BACK, back.backOnFail, back.backOnZFail, back.backOnZPass);
        }

        if (back.writingEnabled == back.backWritingEnabled)
        {
            this.ctx.stencilMask(back.writingEnabled);
        }
        else
        {
            this.ctx.stencilMaskSeparate(GL.ctx.FRONT, back.writingEnabled);
            this.ctx.stencilMaskSeparate(GL.ctx.BACK, back.backWritingEnabled);
        }
    }
    else {
        this.ctx.disable(this.ctx.STENCIL_TEST);
    }
};

// + }}}

// + Cull state stack {{{

dan.gfx.gl.Context.prototype.setCull = function (i_state)
// Params:
//  i_state:
//   (CullState)
{
    // Apply default arguments
    if (!i_state.cullEnabled)
        i_state.cullEnabled = false;
    if (!i_state.cullFace)
        i_state.cullFace = this.ctx.BACK;
    if (!i_state.frontFace)
        i_state.frontFace = this.ctx.CCW;

    // Call GL
    if (i_state.cullEnabled) {
        this.ctx.enable(this.ctx.CULL_FACE);
        this.ctx.cullFace(i_state.cullFace);
    }
    else {
        this.ctx.disable(this.ctx.CULL_FACE);
    }
    this.ctx.frontFace(i_state.frontFace);
    // Put on stack
    this.m_cullStack[this.m_cullStack.length - 1] = i_state;
};

dan.gfx.gl.Context.prototype.pushCull = function (i_state)
// Params:
//  i_state:
//   (CullState)
{
    // Apply default arguments
    if (!i_state.cullEnabled)
        i_state.cullEnabled = false;
    if (!i_state.cullFace)
        i_state.cullFace = this.ctx.BACK;
    if (!i_state.frontFace)
        i_state.frontFace = this.ctx.CCW;

    // Call GL
    if (i_state.cullEnabled) {
        this.ctx.enable(this.ctx.CULL_FACE);
        this.ctx.cullFace(i_state.cullFace);
    }
    else {
        this.ctx.disable(this.ctx.CULL_FACE);
    }
    this.ctx.frontFace(i_state.frontFace);
    // Push on stack
    this.m_cullStack.push(i_state);
};

dan.gfx.gl.Context.prototype.popCull = function ()
{
    // Pop from stack
    this.m_cullStack.pop();
    // Call GL
    var back = this.m_cullStack[this.m_cullStack.length - 1];
    if (back.cullEnabled) {
        this.ctx.enable(this.ctx.CULL_FACE);
        this.ctx.cullFace(back.cullFace);
    }
    else {
        this.ctx.disable(this.ctx.CULL_FACE);
    }
    this.ctx.frontFace(back.frontFace);
};

// + }}}

// + Pixel storage settings {{{

dan.gfx.gl.Context.prototype.setUnpackAlignment = function (i_alignment, i_safe)
// Params:
//  i_alignment:
//   (number, integer)
//  i_safe:
//   (boolean)
{
    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || i_alignment != this.m_unpackAlignmentStack[this.m_unpackAlignmentStack.length - 1])
    {
        this.ctx.pixelStorei(this.ctx.UNPACK_ALIGNMENT, i_alignment);
    }
    // Put on stack
    this.m_unpackAlignmentStack[this.m_unpackAlignmentStack.length - 1] = i_alignment;
};

dan.gfx.gl.Context.prototype.pushUnpackAlignment = function (i_alignment, i_safe)
// Params:
//  i_alignment:
//   (number, integer)
//  i_safe:
//   (boolean)
{
    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || i_alignment != this.m_unpackAlignmentStack[this.m_unpackAlignmentStack.length - 1])
    {
        this.ctx.pixelStorei(this.ctx.UNPACK_ALIGNMENT, i_alignment);
    }
    // Put on stack
    this.m_unpackAlignmentStack.push(i_alignment);
};

dan.gfx.gl.Context.prototype.popUnpackAlignment = function (i_safe)
{
    var previous = this.m_unpackAlignmentStack[this.m_unpackAlignmentStack.length - 1];

    // Pop from stack
    this.m_unpackAlignmentStack.pop();
    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || this.m_unpackAlignmentStack[this.m_unpackAlignmentStack.length - 1] != previous)
    {
        this.ctx.pixelStorei(this.ctx.UNPACK_ALIGNMENT, this.m_unpackAlignmentStack[this.m_unpackAlignmentStack.length - 1]);
    }
};

dan.gfx.gl.Context.prototype.setPackAlignment = function (i_alignment, i_safe)
// Params:
//  i_alignment:
//   (number, integer)
//  i_safe:
//   (boolean)
{
    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || i_alignment != this.m_packAlignmentStack[this.m_packAlignmentStack.length - 1])
    {
        this.ctx.pixelStorei(this.ctx.PACK_ALIGNMENT, i_alignment);
    }
    // Put on stack
    this.m_packAlignmentStack[this.m_packAlignmentStack.length - 1] = i_alignment;
};

dan.gfx.gl.Context.prototype.pushPackAlignment = function (i_alignment, i_safe)
// Params:
//  i_alignment:
//   (number, integer)
//  i_safe:
//   (boolean)
{
    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || i_alignment != this.m_packAlignmentStack[this.m_packAlignmentStack.length - 1])
    {
        this.ctx.pixelStorei(this.ctx.PACK_ALIGNMENT, i_alignment);
    }
    // Put on stack
    this.m_packAlignmentStack.push(i_alignment);
};

dan.gfx.gl.Context.prototype.popPackAlignment = function (i_safe)
{
    var previous = this.m_packAlignmentStack[this.m_packAlignmentStack.length - 1];

    // Pop from stack
    this.m_packAlignmentStack.pop();
    // Call GL only if we think the state has changed or if we're just being safe
    if (i_safe || this.m_packAlignmentStack[this.m_packAlignmentStack.length - 1] != previous)
    {
        this.ctx.pixelStorei(this.ctx.PACK_ALIGNMENT, this.m_packAlignmentStack[this.m_packAlignmentStack.length - 1]);
    }
};

// + }}}


/*
public:
    static Gl & singleton()
    {
        static Gl s_gl;
        return s_gl;
    }
    #define GL dan::gl::Gl::singleton()
};
*/
