define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GLProgram {
        constructor(vertexShader, fragmentShader) {
            this.VertexShader = vertexShader;
            this.FragmentShader = fragmentShader;
            this.uniform = {};
        }
        GetVertexByVertexShader(vertex) {
            return this.VertexShader(vertex, this.uniform);
        }
        GetColorByFragmentShader(varying, sampler) {
            return this.FragmentShader(this.uniform, varying, sampler);
        }
    }
    exports.GLProgram = GLProgram;
});
//# sourceMappingURL=GLProgram.js.map