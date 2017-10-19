
function Skybox(i_textureCubeMap)
// Params:
//  i_textureCubeMap:
//   (dan.gfx.gl.TextureCubeMap)
{
    this.gl = g_renderer.context;
    var gl = this.gl;

    //
    this.textureCubeMap = i_textureCubeMap;

    // 24+36 = 60 numbers
    this.indexedMesh = new dan.mesh.IndexedMesh(GL.ctx.TRIANGLES);

    //   2 ---- 3
    //  /|     /|
    // 6 ---- 7 |
    // | |    | |
    // | 0 ---| 1
    // |/     |/
    // 4 ---- 5

    this.indexedMesh.vertexAttributeArrays.a_position = [
        [-1000, -1000, -1000],
        [ 1000, -1000, -1000],
        [-1000,  1000, -1000],
        [ 1000,  1000, -1000],
        [-1000, -1000,  1000],
        [ 1000, -1000,  1000],
        [-1000,  1000,  1000],
        [ 1000,  1000,  1000]
    ];

    this.indexedMesh.indices = [
        // positive x
        5, 1, 3,
        3, 7, 5,
        // negative x
        0, 4, 6,
        6, 2, 0,
        // positive y
        6, 7, 3,
        3, 2, 6,
        // negative y
        5, 4, 0,
        0, 1, 5,
        // positive z
        4, 5, 7,
        7, 6, 4,
        // negative z
        1, 0, 2,
        2, 3, 1
    ];

    this.indexedMesh.uploadToBufferObjects();

    //
    var vertexShaderSource = `
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

attribute vec3 a_position;

varying vec3 v_position;

void main()
{
    // Remove translation from view matrix before using it
    gl_Position = u_projectionMatrix * mat4(mat3(u_viewMatrix)) * vec4(a_position, 1.0);

    v_position = a_position;
}
`;

    var fragmentShaderSource = `
precision mediump float;

uniform samplerCube u_texture;

varying vec3 v_position;

void main()
{
    //gl_FragColor = vec4(1, 0, 0, 1);
    gl_FragColor = textureCube(u_texture, v_position);
}
`;

    /*
    var fragmentShaderSource = `
precision mediump float;

uniform samplerCube u_texture;

varying vec3 v_position;

void main()
{
    gl_FragColor = vec4(1.0);

    for (float s = 0.0; s < 200.0; ++s)
    {
        vec3 p = vec3(0.1, 0.2, fract(0.01*floor(s + iGlobalTime * 125.0)));
        p.xy += s * v_position.xy / 300000.0;
        for (int k = 0; k < 9; ++k)
            p = abs(p) / (gl_FragColor.a = dot(p, p)) - 0.60;

        gl_FragColor += gl_FragColor.a;
    }
    gl_FragColor /= 1000.0;

    gl_FragColor.a = 0.5;  // [not needed in original version]
    //gl_FragColor = vec4(1, 0, 0, 1);
    //gl_FragColor = textureCube(u_texture, v_position);
}
`;
    */

    this.program = dan.gfx.gl.Program.fromStringVSFS(vertexShaderSource, fragmentShaderSource);
}

Skybox.prototype.draw = function (i_viewMatrix, i_projectionMatrix)
{
    var gl = this.gl;

    GL.setActiveTextureUnit(0);
    GL.bindTexture(GL.ctx.TEXTURE_CUBE_MAP, this.textureCubeMap);
    this.program.setInteger("u_texture", 0);

    this.program.setMatrix4("u_viewMatrix", i_viewMatrix);
    this.program.setMatrix4("u_projectionMatrix", i_projectionMatrix);

    dan.gfx.gl.renderIndexedMesh(this.indexedMesh, this.program);
};
