"use strict";
var GL;
(function (GL) {
    class GLProgram {
        constructor(vertexShader, fragmentShader) {
            this.VertexShader = vertexShader;
            this.FragmentShader = fragmentShader;
            this.uniform = {};
            this.varying = {};
        }
        GetPositonByVertexShader(vertex) {
            return this.VertexShader(vertex, this.uniform, this.varying);
        }
    }
    GL.GLProgram = GLProgram;
})(GL || (GL = {}));
//# sourceMappingURL=GLProgram.js.map