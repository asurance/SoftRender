define(["require", "exports", "./GLContext"], function (require, exports, GLContext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MainView {
        constructor(ctx) {
            this.gl = new GLContext_1.GLContext(ctx);
            this.gl.clearColor(0, 0, 0, 1);
            this.buffer = this.gl.createBuffer();
            this.gl.bindBuffer(34962 /* ARRAY_BUFFER */, this.buffer);
            // let vertice = new Float32Array([0, 0, 0, 0, 0, 0]);
            // let vertice = new Float32Array([0, -1, -1, 0, -0.5, -0.5]);
            let vertice = new Float32Array([0, -1, 1, 0, 0, -1, 0, 0, 1, 0, 1, 0, 0, 0, 1]);
            this.gl.bufferData(34962 /* ARRAY_BUFFER */, vertice);
            this.gl.vertexAttribPointer("pos", 2, 5126 /* FLOAT */, false, 20, 0);
            this.gl.vertexAttribPointer("color", 3, 5126 /* FLOAT */, false, 20, 8);
            let program = this.gl.createProgram(defaultVertexShader, defaultFragmentShader);
            this.gl.useProgram(program);
            this.renderID = requestAnimationFrame(this.render.bind(this));
        }
        render() {
            this.gl.clear(16384 /* COLOR_BUFFER_BIT */);
            this.gl.uniformnv("rotation", [this.renderID / 100]);
            // this.gl.uniformnv("offset", [Math.sin(this.renderID / 100) / 2 + 0.5, 0])
            this.gl.drawArrays(4 /* TRIANGLES */, 0, 3);
            this.renderID = requestAnimationFrame(this.render.bind(this));
        }
    }
    exports.MainView = MainView;
    function defaultVertexShader(input, uniform) {
        let ratio = Math.sin(uniform.rotation[0]);
        let ratioC = (ratio + 1) / 2;
        let color = [input.color[0] * ratioC, input.color[1] * ratioC, input.color[2] * ratioC];
        return { position: [input.pos[0] * ratio, input.pos[1], input.pos[2], input.pos[3]], varying: { color: color } };
    }
    function defaultFragmentShader(uniform, varying) {
        return [varying.color[0], varying.color[1], varying.color[2], 1];
    }
});
//# sourceMappingURL=MainView.js.map