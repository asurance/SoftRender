"use strict";
var GL;
(function (GL) {
    class GLContext {
        constructor(context) {
            this.context = context;
            this.viewportX = 0;
            this.viewportY = 0;
            this.viewportWidth = context.canvas.width;
            this.viewportHeight = context.canvas.height;
            this.clearColorR = 0;
            this.clearColorG = 0;
            this.clearColorB = 0;
            this.clearColorA = 0;
            this.arrayBuffer = null;
            this.elementArrayBuffer = null;
            this.renderFrameBuffer = new GL.GLRenderBuffer(context);
        }
        /**Viewing and clipping */
        viewport(x, y, width, height) {
            if (width < 0 || height < 0) {
                throw Error("INVALID_VALUE");
            }
            this.viewportX = x;
            this.viewportY = y;
            this.viewportWidth = width;
            this.viewportHeight = height;
        }
        /**State information */
        clearColor(red, green, blue, alpha) {
            this.clearColorR = clampTo01(red);
            this.clearColorG = clampTo01(green);
            this.clearColorB = clampTo01(blue);
            this.clearColorA = clampTo01(alpha);
        }
        getParameter(pname) {
            switch (pname) {
                case 2978 /* VIEWPORT */:
                    return new Int32Array([this.viewportX, this.viewportY, this.viewportWidth, this.viewportHeight]);
                case 3106 /* COLOR_CLEAR_VALUE */:
                    return new Float32Array([this.clearColorR, this.clearColorG, this.clearColorB, this.clearColorA]);
                case 2931 /* DEPTH_CLEAR_VALUE */:
                    throw Error("NOT_IMPLEMENT");
                case 2961 /* STENCIL_CLEAR_VALUE */:
                    throw Error("NOT_IMPLEMENT");
                case 34964 /* ARRAY_BUFFER_BINDING */:
                    return this.arrayBuffer;
                case 34965 /* ELEMENT_ARRAY_BUFFER_BINDING */:
                    return this.elementArrayBuffer;
                default:
                    throw Error("INVALID_ENUM");
            }
        }
        /**Buffers */
        bindBuffer(target, buffer) {
            if (buffer == null) {
                if (target == 34962 /* ARRAY_BUFFER */) {
                    this.arrayBuffer = null;
                }
                else {
                    this.elementArrayBuffer = null;
                }
            }
            else {
                if (buffer.Disposed) {
                    throw Error("INVALID_OPERATION");
                }
                if (target == 34962 /* ARRAY_BUFFER */) {
                    if (this.elementArrayBuffer == buffer) {
                        throw Error("INVALID_OPERATION");
                    }
                    else {
                        this.arrayBuffer = buffer;
                    }
                }
                else {
                    if (this.arrayBuffer == buffer) {
                        throw Error("INVALID_OPERATION");
                    }
                    else {
                        this.elementArrayBuffer = buffer;
                    }
                }
            }
        }
        bufferData(target, srcData, usage) {
            if (typeof srcData == 'number' && srcData < 0) {
                throw Error("INVALID_VALUE");
            }
            let targetBuffer = target == 34962 /* ARRAY_BUFFER */ ? this.arrayBuffer : this.elementArrayBuffer;
            targetBuffer.SetData(srcData, usage);
        }
        getBufferParameter(target, pname) {
            let targetBuffer = target == 34962 /* ARRAY_BUFFER */ ? this.arrayBuffer : this.elementArrayBuffer;
            if (pname == 34660 /* BUFFER_SIZE */) {
                return targetBuffer.data.byteLength;
            }
            else {
                return targetBuffer.usage;
            }
        }
        createBuffer() {
            return new GL.GLBuffer();
        }
        deleteBuffer(buffer) {
            buffer.Dispose();
        }
        /**Renderbuffers */
        createRenderbuffer() {
            return new GL.GLRenderBuffer();
        }
        /**Drawing buffers */
        clear(mask) {
            if (mask & (~(16384 /* COLOR_BUFFER_BIT */ | 256 /* DEPTH_BUFFER_BIT */ | 1024 /* STENCIL_BUFFER_BIT */))) {
                throw Error("INVALID_ENUM");
            }
            if (mask & 16384 /* COLOR_BUFFER_BIT */) {
                // let color = (this.clearColorR * 255 << 16) + (this.clearColorG * 255 << 8) + (this.clearColorB * 255 << 0);
                let buffer = this.renderFrameBuffer.buffer;
                for (let i = 0; i < buffer.height; i++) {
                    for (let j = 0; j < buffer.width; j++) {
                        buffer.data[(i * buffer.width + j) * 4] = this.clearColorR * 255 | 0;
                        buffer.data[(i * buffer.width + j) * 4 + 1] = this.clearColorG * 255 | 0;
                        buffer.data[(i * buffer.width + j) * 4 + 2] = this.clearColorB * 255 | 0;
                        buffer.data[(i * buffer.width + j) * 4 + 3] = this.clearColorA * 255 | 0;
                    }
                }
                // this.context.fillStyle = `#${color.toString(16)}`;
                // this.context.globalAlpha = this.clearColorA;
                // this.context.fillRect(this.viewportX, this.viewportY, this.viewportWidth, this.viewportHeight);
            }
            if (mask & 256 /* DEPTH_BUFFER_BIT */) {
                throw Error("NOT_IMPLEMENT");
            }
            if (mask & 1024 /* STENCIL_BUFFER_BIT */) {
                throw Error("NOT_IMPLEMENT");
            }
        }
    }
    GL.GLContext = GLContext;
    function clampTo01(val) {
        return Math.max(Math.min(val, 1), 0);
    }
})(GL || (GL = {}));
//# sourceMappingURL=GLContext.js.map