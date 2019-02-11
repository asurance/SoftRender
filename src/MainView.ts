class MainView {
    private renderID: number;
    private gl: GL.GLContext;
    constructor(ctx: CanvasRenderingContext2D) {
        this.gl = new GL.GLContext(ctx);
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
    render() {
        console.log(this.renderID);
        this.gl.clearColor((this.renderID % 100) / 100, 0, 0, 1);
        this.gl.clear(GL.GLConstants.COLOR_BUFFER_BIT);
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
}
