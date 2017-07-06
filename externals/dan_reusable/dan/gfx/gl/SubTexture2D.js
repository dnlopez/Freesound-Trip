
// This namespace
// #require "Context.js"
// #require "Texture2D.js"

// Dan reusable
// #require <dan/math/Rect2.js>


// + Construction {{{

dan.gfx.gl.SubTexture2D = function (i_texture, i_rect)
// Represents a rectangular subarea within a larger 2D texture.
//
// Params:
//  i_texture:
//   (dan.gfx.gl.Texture2D)
//  i_rect:
//   Either (dan.math.Rect2)
//   or (null or undefined)
//    Default to whole area of i_texture
{
    // Apply default arguments
    if (!i_rect)
        i_rect = dan.math.Rect2.fromXYWH(0, 0, i_texture.width, i_texture.height);

    // Save arguments
    this.texture = i_texture;
    this.setRect(i_rect);
};

// + }}}

// + Rect {{{

dan.gfx.gl.SubTexture2D.prototype.setRect = function (i_rect)
// Params:
//  i_rect:
//   (dan.math.Rect2)
{
    this.rect = i_rect.clone();
    this.texCoordRect = dan.math.Rect2.fromLTRB(i_rect.left / this.texture.width,
                                                i_rect.top / this.texture.height,
                                                i_rect.right / this.texture.width,
                                                i_rect.bottom / this.texture.height);
};

// + }}}

// + Reset {{{

dan.gfx.gl.SubTexture2D.prototype.reset = function (i_texture, i_rect)
// Params:
//  i_texture:
//   (Texture2D)
//  i_rect:
//   Either (dan.math.Rect2)
//   or (null or undefined)
//    Default to whole area of i_texture
{
    // Apply default arguments
    if (!i_rect)
        i_rect = dan.math.Rect2.fromXYWH(0, 0, i_texture.width, i_texture.height);

    // Save arguments
    this.texture = i_texture;
    this.setRect(i_rect);
};

// + }}}
