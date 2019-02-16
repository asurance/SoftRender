class MainView {
    private renderID: number;
    private gl: GL.GLContext;
    private buffer: GL.GLBuffer;
    constructor(ctx: CanvasRenderingContext2D) {
        this.gl = new GL.GLContext(ctx);
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(GL.BufferType.ARRAY_BUFFER, this.buffer);
        let vertice = new Float32Array([0, 0, -1, -1, -1, 1]);
        this.gl.bufferData(GL.BufferType.ARRAY_BUFFER, vertice);
        this.gl.vertexAttribPointer(0, 2, GL.TypeType.FLOAT, false, 8, 0);
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
    render() {
        console.log(this.renderID);
        this.gl.clearColor((this.renderID % 100) / 100, 0, 0, (Math.sin(this.renderID / 100) + 1) / 2);
        this.gl.clear(GL.ClearType.COLOR_BUFFER_BIT);
        this.gl.drawArrays(GL.PrimitiveType.TRIANGLES, 0, 3);
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
}
