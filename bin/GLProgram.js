"use strict";
var GL;
(function (GL) {
    class GLProgram {
        constructor(vertexShader, pixelShader) {
            this.VertexShader = vertexShader;
            this.PixelShader = pixelShader;
        }
    }
    GL.GLProgram = GLProgram;
})(GL || (GL = {}));
//# sourceMappingURL=GLProgram.js.map