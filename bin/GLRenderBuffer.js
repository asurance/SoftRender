define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.GLRenderBuffer = GLRenderBuffer;
});
//# sourceMappingURL=GLRenderBuffer.js.map