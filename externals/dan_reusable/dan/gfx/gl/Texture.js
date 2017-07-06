
// This namespace
// #require "gl.js"


// + Construction/destruction {{{

dan.gfx.gl.Texture = function (i_glTextureTarget, i_glTextureObject)
// Params:
//  i_glTextureTarget:
//   (integer number)
//  i_glTextureObject:
//   Either (WebGLTexture)
//    Wrap this existing GL texture.
//   or (null or undefined)
//    Create a new GL texture.
{
    this.glTextureTarget = i_glTextureTarget;

    this.glTextureObject = i_glTextureObject;
    if (!this.glTextureObject)
        this.glTextureObject = GL.ctx.createTexture();
};

dan.gfx.gl.Texture.prototype.destroy = function ()
{
    if (this.glTextureObject)
    {
        GL.ctx.deleteTexture(this.glTextureObject);
        this.glTextureObject = null;
    }
};

// + }}}

// + Texture parameters {{{

dan.gfx.gl.Texture.prototype.setTexParameter = function (i_pname, i_value)
// Params:
//  i_pname:
//   (GLenum)
//  i_pname:
//   (number, integer)
{
    this.bind();
    GL.ctx.texParameteri(this.glTextureTarget, i_pname, i_value);
}
/* Float version. But what parameters are floats anyway?
void setTexParameter(GLenum i_pname, GLfloat i_value) const
{
    bind();
    glTexParameterf(m_shared->m_glTextureTarget, i_pname, i_value);
}
*/

// + }}}

// + Compare {{{

dan.gfx.gl.Texture.prototype.isSameTexture = function (i_other)
// Params:
//  i_other:
//   (dan.gfx.gl.Texture)
{
    return this.glTextureObject === i_other.glTextureObject &&
        this.glTextureTarget === i_other.glTextureTarget;
};

dan.gfx.gl.Texture.isSameTexture = function (i_texture1, i_texture2)
// Params:
//  i_texture1, i_texture2:
//   (dan.gfx.gl.Texture)
{
    return i_texture1.glTextureObject === i_texture2.glTextureObject &&
        i_texture1.glTextureTarget === i_texture2.glTextureTarget;
};

// + }}}

// + Bind/unbind {{{

dan.gfx.gl.Texture.prototype.bind = function ()
// Be sure to have made the desired texture image unit active before calling this.
{
    GL.bindTexture(this.glTextureTarget, this);
}
dan.gfx.gl.Texture.prototype.unbind = function ()
{
    GL.bindTexture(this.glTextureTarget, null);
}

// + }}}
