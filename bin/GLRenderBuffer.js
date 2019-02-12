"use strict";
var GL;
(function (GL) {
    class GLRenderBuffer {
        constructor(context) {
            if (context != undefined) {
                this.context = context;
                this.buffer = new ImageData(context.canvas.width, context.canvas.height);
                requestAnimationFrame(this.render.bind(this));
            }
        }
        render() {
            this.context.putImageData(this.buffer, 0, 0);
            requestAnimationFrame(this.render.bind(this));
        }
    }
    GL.GLRenderBuffer = GLRenderBuffer;
})(GL || (GL = {}));
//# sourceMappingURL=GLRenderBuffer.js.map