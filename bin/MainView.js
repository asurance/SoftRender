define(["require", "exports", "./GLContext"], function (require, exports, GLContext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MainView {
        constructor(ctx) {
            this.gl = new GLContext_1.GLContext(ctx);
            this.gl.clearColor(0, 0, 0, 1);
            this.buffer = this.gl.createBuffer();
            this.gl.bindBuffer(34962 /* ARRAY_BUFFER */, this.buffer);
            let vertice = new Float32Array([0, 0, 0, 0, 0, 0]);
            // let vertice = new Float32Array([0, -1, -1, 0, 1, 1]);
            // let vertice = new Float32Array([0, -1, -1, 0, -0.5, -0.5]);
            this.gl.bufferData(34962 /* ARRAY_BUFFER */, vertice);
            this.gl.vertexAttribPointer("pos", 2, 5126 /* FLOAT */, false, 8, 0);
            let program = this.gl.createProgram(defaultVertexShader, defaultFragmentShader);
            this.gl.useProgram(program);
            this.renderID = requestAnimationFrame(this.render.bind(this));
        }
        render() {
            this.gl.clear(16384 /* COLOR_BUFFER_BIT */);
            this.gl.uniformnv("offset", [0, 0]);
            // this.gl.uniformnv("offset", [Math.sin(this.renderID / 100) / 2 + 0.5, 0])
            this.gl.drawArrays(4 /* TRIANGLES */, 0, 3);
            this.renderID = requestAnimationFrame(this.render.bind(this));
        }
    }
    exports.MainView = MainView;
    function defaultVertexShader(input, uniform, varying) {
        let x = input.pos[0] + uniform.offset[0];
        let y = input.pos[1] + uniform.offset[1];
        varying.pos = [x, y];
        return [x, y, input.pos[2], input.pos[3]];
    }
    function defaultFragmentShader(uniform, varying) {
        return [(varying.pos[0] + 1) / 2, (varying.pos[1] + 1) / 2, 0, 1];
    }
});
//# sourceMappingURL=MainView.js.map