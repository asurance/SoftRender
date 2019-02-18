define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.GLProgram = GLProgram;
});
//# sourceMappingURL=GLProgram.js.map