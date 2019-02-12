"use strict";
class MainView {
    constructor(ctx) {
        this.gl = new GL.GLContext(ctx);
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
    render() {
        console.log(this.renderID);
        this.gl.clearColor((this.renderID % 100) / 100, 0, 0, (Math.sin(this.renderID / 100) + 1) / 2);
        this.gl.clear(16384 /* COLOR_BUFFER_BIT */);
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
}
//# sourceMappingURL=MainView.js.map