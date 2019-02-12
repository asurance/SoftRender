namespace GL {
    export class GLContext {
        private context: CanvasRenderingContext2D;
        private viewportX: number;
        private viewportY: number;
        private viewportWidth: number;
        private viewportHeight: number;
        private clearColorR: number;
        private clearColorG: number;
        private clearColorB: number;
        private clearColorA: number;
        private arrayBuffer: GLBuffer | null;
        private elementArrayBuffer: GLBuffer | null;
        private renderFrameBuffer: GLRenderBuffer;
        constructor(context: CanvasRenderingContext2D) {
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
            this.renderFrameBuffer = new GLRenderBuffer(context);
        }
        /**Viewing and clipping */
        viewport(x: number, y: number, width: number, height: number) {
            if (width < 0 || height < 0) {
                throw Error("INVALID_VALUE");
            }
            this.viewportX = x;
            this.viewportY = y;
            this.viewportWidth = width;
            this.viewportHeight = height;
        }
        /**State information */
        clearColor(red: number, green: number, blue: number, alpha: number) {
            this.clearColorR = clampTo01(red);
            this.clearColorG = clampTo01(green);
            this.clearColorB = clampTo01(blue);
            this.clearColorA = clampTo01(alpha);
        }
        getParameter(pname: GLConstants) {
            switch (pname) {
                case GLConstants.VIEWPORT:
                    return new Int32Array([this.viewportX, this.viewportY, this.viewportWidth, this.viewportHeight]);
                case GLConstants.COLOR_CLEAR_VALUE:
                    return new Float32Array([this.clearColorR, this.clearColorG, this.clearColorB, this.clearColorA]);
                case GLConstants.DEPTH_CLEAR_VALUE:
                    throw Error("NOT_IMPLEMENT");
                case GLConstants.STENCIL_CLEAR_VALUE:
                    throw Error("NOT_IMPLEMENT");
                case GLConstants.ARRAY_BUFFER_BINDING:
                    return this.arrayBuffer;
                case GLConstants.ELEMENT_ARRAY_BUFFER_BINDING:
                    return this.elementArrayBuffer;
                default:
                    throw Error("INVALID_ENUM");
            }
        }
        /**Buffers */
        bindBuffer(target: GLConstants.ARRAY_BUFFER | GLConstants.ELEMENT_ARRAY_BUFFER, buffer: GLBuffer | null) {
            if (buffer == null) {
                if (target == GLConstants.ARRAY_BUFFER) {
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
                if (target == GLConstants.ARRAY_BUFFER) {
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
        bufferData(target: GLConstants.ARRAY_BUFFER | GLConstants.ELEMENT_ARRAY_BUFFER, srcData: number | ArrayBuffer | ArrayBufferView | null, usage: GLConstants.STATIC_DRAW | GLConstants.DYNAMIC_DRAW | GLConstants.STREAM_DRAW) {
            if (typeof srcData == 'number' && srcData < 0) {
                throw Error("INVALID_VALUE");
            }
            let targetBuffer = target == GLConstants.ARRAY_BUFFER ? this.arrayBuffer! : this.elementArrayBuffer!;
            targetBuffer.SetData(srcData, usage);
        }
        getBufferParameter(target: GLConstants.ARRAY_BUFFER | GLConstants.ELEMENT_ARRAY_BUFFER, pname: GLConstants.BUFFER_SIZE | GLConstants.BUFFER_USAGE) {
            let targetBuffer = target == GLConstants.ARRAY_BUFFER ? this.arrayBuffer! : this.elementArrayBuffer!;
            if (pname == GLConstants.BUFFER_SIZE) {
                return targetBuffer.data!.byteLength;
            }
            else {
                return targetBuffer.usage;
            }
        }
        createBuffer() {
            return new GLBuffer();
        }
        deleteBuffer(buffer: GLBuffer) {
            buffer.Dispose();
        }
        /**Renderbuffers */
        createRenderbuffer() {
            return new GLRenderBuffer();
        }
        /**Drawing buffers */
        clear(mask: GLConstants) {
            if (mask & (~(GLConstants.COLOR_BUFFER_BIT | GLConstants.DEPTH_BUFFER_BIT | GLConstants.STENCIL_BUFFER_BIT))) {
                throw Error("INVALID_ENUM");
            }
            if (mask & GLConstants.COLOR_BUFFER_BIT) {
                let buffer = this.renderFrameBuffer.buffer!;
                for (let i = 0; i < buffer.height; i++) {
                    for (let j = 0; j < buffer.width; j++) {
                        buffer.data[(i * buffer.width + j) * 4] = this.clearColorR * 255 | 0;
                        buffer.data[(i * buffer.width + j) * 4 + 1] = this.clearColorG * 255 | 0;
                        buffer.data[(i * buffer.width + j) * 4 + 2] = this.clearColorB * 255 | 0;
                        buffer.data[(i * buffer.width + j) * 4 + 3] = this.clearColorA * 255 | 0;
                    }
                }
            }
            if (mask & GLConstants.DEPTH_BUFFER_BIT) {
                throw Error("NOT_IMPLEMENT");
            }
            if (mask & GLConstants.STENCIL_BUFFER_BIT) {
                throw Error("NOT_IMPLEMENT");
            }
        }
    }

    function clampTo01(val: number) {
        return Math.max(Math.min(val, 1), 0);
    }
}