"use strict";
class MainView {
    constructor(ctx) {
        this.gl = new GL.GLContext(ctx);
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(34962 /* ARRAY_BUFFER */, this.buffer);
        let vertice = new Float32Array([0, 0, 0, 1, 1, 1]);
        this.gl.bufferData(34962 /* ARRAY_BUFFER */, vertice);
        this.gl.vertexAttribPointer(0, 2, 5126 /* FLOAT */, false, 8, 0);
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
    render() {
        console.log(this.renderID);
        this.gl.setclearColor((this.renderID % 100) / 100, 0, 0, (Math.sin(this.renderID / 100) + 1) / 2);
        this.gl.clear(16384 /* COLOR_BUFFER_BIT */);
        this.gl.drawArrays(4 /* TRIANGLES */, 0, 3);
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
}
//# sourceMappingURL=MainView.js.map