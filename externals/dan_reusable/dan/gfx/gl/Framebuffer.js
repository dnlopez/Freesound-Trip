
// This namespace
// #require "gl.js"
// #require "Context.js"
// #require "Texture2D.js"
// //#require "Renderbuffer.js"


// + Construction/destruction {{{

dan.gfx.gl.Framebuffer = function (i_glFramebufferObject)
// Params:
//  i_glFramebufferObject:
//   Either (WebGLFramebuffer)
//   or (null or undefined)
{
    this.glObject = i_glFramebufferObject;
    if (!this.glObject)
        this.glObject = GL.ctx.createFramebuffer();

    // + Attachments {{{

    this.m_textureInColourSlot = null;
    // (Texture2D)
    this.m_textureInDepthSlot = null;
    // (Texture2D)
    this.m_renderbufferInDepthSlot = null;
    // (Renderbuffer)

    // + }}}
};

dan.gfx.gl.Framebuffer.prototype.destroy = function ()
{
    if (this.glObject)
    {
        GL.ctx.deleteFramebuffer(this.glObject);
        this.glObject = null;
    }
};

// + }}}

// + Attachments {{{

// + + Colour slot {{{

dan.gfx.gl.Framebuffer.prototype.attachToColourSlot = function (i_texture)
// Attach texture to colour buffer slot
//
// Params:
//  i_texture:
//   (Texture2D)
{
    this.m_textureInColourSlot = i_texture;
    GL.pushFramebuffer(this);
    GL.ctx.framebufferTexture2D(GL.ctx.FRAMEBUFFER, GL.ctx.COLOR_ATTACHMENT0,
                                GL.ctx.TEXTURE_2D, i_texture.glTextureObject, 0);
    GL.popFramebuffer();
};

dan.gfx.gl.Framebuffer.prototype.textureInColourSlot = function ()
// Returns:
//  Either (Texture2D)
//  or (null)
{
    return this.m_textureInColourSlot;
};

// + + }}}

// + + Depth slot {{{

dan.gfx.gl.Framebuffer.prototype.attachToDepthSlot = function (i_texture)
// Attach texture to depth buffer slot
//
// Params:
//  i_texture:
//   (Texture2D)
{
    this.m_textureInDepthSlot = i_texture;
    GL.pushFramebuffer(this);
    GL.ctx.framebufferTexture2D(GL.ctx.FRAMEBUFFER, GL.ctx.DEPTH_ATTACHMENT,
                                GL.ctx.TEXTURE_2D, i_texture.glTextureObject, 0);
    GL.popFramebuffer();
};

dan.gfx.gl.Framebuffer.prototype.textureInDepthSlot = function ()
// Returns:
//  Either (Texture2D)
//  or (null)
{
    return this.m_textureInDepthSlot;
};

/*
TODO: overload above with renderbuffer parameter
void Framebuffer::attachToDepthSlot(Renderbuffer i_renderbuffer)
// Attach renderbuffer to depth buffer slot
{
    m_shared->m_renderbufferInDepthSlot = i_renderbuffer;
    GL.pushFramebuffer(*this);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT,
                              GL_RENDERBUFFER, i_renderbuffer.glName());  GL_IEADTL();
    GL.popFramebuffer();
};

dan.gfx.gl.Framebuffer.prototype.renderbufferInColourSlot = function ()
// Returns:
//  Either (Renderbuffer)
//  or (null)
{
    return this.m_renderbufferInColourSlot;
};
*/

dan.gfx.gl.Framebuffer.prototype.detachDepthSlot = function ()
{
    this.m_textureInDepthSlot = null;
    this.m_renderbufferInDepthSlot = null;
    GL.pushFramebuffer(this);
    GL.ctx.framebufferRenderbuffer(GL.ctx.FRAMEBUFFER, GL.ctx.DEPTH_ATTACHMENT, 0, 0);
    GL.popFramebuffer();
};

// + + }}}

// + }}}

dan.gfx.gl.Framebuffer.prototype.checkErrors = function ()
{
    var status = GL.ctx.checkFramebufferStatus(GL.ctx.FRAMEBUFFER);

    switch (status)
    {
    case GL.ctx.FRAMEBUFFER_COMPLETE:
        break;
    case GL.ctx.FRAMEBUFFER_UNSUPPORTED:
        console.error("Framebuffer error: GL_FRAMEBUFFER_UNSUPPORTED");
        break;
    case GL.ctx.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
        console.error("Framebuffer error: GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
        break;
    case GL.ctx.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
        console.error("Framebuffer error: GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
        break;
    case GL.ctx.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
        console.error("Framebuffer error: GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
        break;
    case GL.ctx.FRAMEBUFFER_UNSUPPORTED:
        console.error("Framebuffer error: GL_UNSUPPORTED");
        break;
    default:
        console.error("Framebuffer error: unknown [" + status.toString() + "]");
        break;
    }
};
