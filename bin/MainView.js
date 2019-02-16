"use strict";
class MainView {
    constructor(ctx) {
        this.gl = new GL.GLContext(ctx);
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(34962 /* ARRAY_BUFFER */, this.buffer);
        let vertice = new Float32Array([0, 0, -1, -1, -1, 1]);
        this.gl.bufferData(34962 /* ARRAY_BUFFER */, vertice);
        this.gl.vertexAttribPointer("pos", 2, 5126 /* FLOAT */, false, 8, 0);
        let program = this.gl.createProgram(defaultVertexShader, defaultFragmentShader);
        this.gl.useProgram(program);
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
    render() {
        this.gl.clearColor((this.renderID % 100) / 100, 0, 0, (Math.sin(this.renderID / 100) + 1) / 2);
        this.gl.clear(16384 /* COLOR_BUFFER_BIT */);
        this.gl.uniformnv("offset", [Math.sin(this.renderID / 100) / 2 + 0.5, 0]);
        this.gl.drawArrays(4 /* TRIANGLES */, 0, 3);
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
}
function defaultVertexShader(input, uniform, varying) {
    return [input.pos[0] + uniform.offset[0], input.pos[1] + uniform.offset[1], input.pos[2], input.pos[3]];
}
function defaultFragmentShader() {
    return [0, 0, 0, 1];
}
//# sourceMappingURL=MainView.js.map