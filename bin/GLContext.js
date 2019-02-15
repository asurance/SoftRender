"use strict";
var GL;
(function (GL) {
    class GLContext {
        constructor(context) {
            this._Viewport = new Int32Array([0, 0, context.canvas.width, context.canvas.height]);
            this._ClearColor = new Uint8ClampedArray([0, 0, 0, 0]);
            this.arrayBuffer = null;
            this.elementArrayBuffer = null;
            this.program = null;
            this.renderFrameBuffer = new GL.GLRenderBuffer(context);
        }
        /**Viewing and clipping */
        viewport(x, y, width, height) {
            if (width < 0) {
                throw Error("viewport的宽不能为负值");
            }
            if (height < 0) {
                throw Error("viewport的高不能为负值");
            }
            this._Viewport[0] = x;
            this._Viewport[1] = y;
            this._Viewport[2] = width;
            this._Viewport[3] = height;
        }
        /**State information */
        clearColor(red, green, blue, alpha) {
            this._ClearColor[0] = red * 255;
            this._ClearColor[1] = green * 255;
            this._ClearColor[2] = blue * 255;
            this._ClearColor[3] = alpha * 255;
        }
        /**Buffers */
        bindBuffer(target, buffer) {
            if (target == 34962 /* ARRAY_BUFFER */) {
                this.arrayBuffer = buffer;
            }
            else {
                this.elementArrayBuffer = buffer;
            }
        }
        bufferData(target, srcData) {
            if (typeof srcData == 'number' && srcData < 0) {
                throw Error("srcData为number类型时不能取负值");
            }
            let targetBuffer = target == 34962 /* ARRAY_BUFFER */ ? this.arrayBuffer : this.elementArrayBuffer;
            targetBuffer.SetData(srcData);
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
        /**Uniforms and attributes */
        vertexAttribPointer(index, size, type, normalized, stride, offset) {
            if (normalized) {
                throw Error("NOT_IMPLEMENT");
            }
            else {
                if (this.arrayBuffer) {
                    this.arrayBuffer.SetAttribPointer(index, size, type, normalized, stride, offset);
                }
                else {
                    throw Error("未绑定VAO时不能设置Attrib");
                }
            }
        }
        /**Drawing buffers */
        clear(mask) {
            if (mask & (~(16384 /* COLOR_BUFFER_BIT */ | 256 /* DEPTH_BUFFER_BIT */ | 1024 /* STENCIL_BUFFER_BIT */))) {
                throw Error("mask的中存在非法位");
            }
            if (mask & 16384 /* COLOR_BUFFER_BIT */) {
                let buffer = this.renderFrameBuffer.buffer;
                for (let i = 0; i < buffer.height; i++) {
                    for (let j = 0; j < buffer.width; j++) {
                        buffer.data.set(this._ClearColor, (i * buffer.width + j) * 4);
                    }
                }
            }
            if (mask & 256 /* DEPTH_BUFFER_BIT */) {
                throw Error("NOT_IMPLEMENT");
            }
            if (mask & 1024 /* STENCIL_BUFFER_BIT */) {
                throw Error("NOT_IMPLEMENT");
            }
        }
        drawArrays(mode, first, count) {
            if (mode == 4 /* TRIANGLES */) {
                while (count > 2) {
                    let traingle = this.arrayBuffer.GetData(first, 3);
                    first += 3;
                    count -= 3;
                    traingle.forEach(this.transformToScreen.bind(this));
                    drawTriangle(this.renderFrameBuffer.buffer, traingle);
                }
            }
            else {
                throw Error("NOT_IMPLEMENT");
            }
        }
        transformToScreen(position) {
            position[0] = Math.round((position[0] + 1) / 2 * this._Viewport[2] + this._Viewport[0]);
            position[1] = Math.round((position[1] + 1) / 2 * this._Viewport[3] + this._Viewport[1]);
        }
    }
    GL.GLContext = GLContext;
    function clampTo01(val) {
        return Math.max(Math.min(val, 1), 0);
    }
    function interpolation(a, b, ratio) {
        return a + (b - a) * ratio;
    }
    function interpolationArr(a, b, ratio) {
        let length = a.length;
        let res = new Array(length);
        for (let i = 0; i < length; i++) {
            res[i] = a[i] + (b[i] - a[i]) * ratio;
        }
        return res;
    }
    function interpolationByIndex(a, b, index, target) {
        let ratio = (target - a[index]) / (b[index] - a[index]);
        let length = a.length;
        let res = new Array(length);
        for (let i = 0; i < length; i++) {
            if (i == index) {
                res[i] = target;
            }
            else {
                res[i] = a[i] + (b[i] - a[i]) * ratio;
            }
        }
        return res;
    }
    function interpolationRoundedByIndex(a, b, index, target) {
        let ratio = (target - a[index]) / (b[index] - a[index]);
        let length = a.length;
        let res = new Array(length);
        for (let i = 0; i < length; i++) {
            if (i == index) {
                res[i] = target;
            }
            else {
                res[i] = Math.round(a[i] + (b[i] - a[i]) * ratio);
            }
        }
        return res;
    }
    function drawTriangle(buffer, vertex) {
        let flag = true;
        for (let i = 0; i < 3; i++) {
            if (vertex[i][1] == vertex[(i + 1) % 3][1]) {
                drawHorizenTriangle(buffer, vertex[(i + 2) % 3], vertex[i], vertex[(i + 1) % 3]);
                flag = false;
                break;
            }
        }
        if (flag) {
            console.log('need draw not horizen triangle');
        }
    }
    function drawHorizenTriangle(buffer, point, edgeA, edgeB) {
        drawPointWithCheck(buffer, point[1], point[0], 0, 0, 0, 255);
        let start;
        let end;
        if (point[1] < edgeA[1]) {
            start = point[1] + 1;
            end = edgeA[1];
        }
        else {
            start = edgeA[1];
            end = point[1] - 1;
        }
        for (let i = Math.max(start, 0); i < end; i++) {
            if (i >= buffer.height) {
                break;
            }
            else {
                drawHorizenLine(buffer, interpolationRoundedByIndex(point, edgeA, 1, i), interpolationRoundedByIndex(point, edgeB, 1, i));
            }
        }
    }
    function drawHorizenLine(buffer, lineA, lineB) {
        let start;
        let end;
        if (lineA[0] < lineB[0]) {
            start = lineA[0];
            end = lineB[0];
        }
        else {
            start = lineB[0];
            end = lineA[0];
        }
        for (let i = Math.max(start, 0); i < end; i++) {
            if (i >= buffer.width) {
                break;
            }
            else {
                drawPoint(buffer, lineA[1], i, 0, 0, 0, 255);
            }
        }
    }
    function drawPointWithCheck(buffer, row, col, r, g, b, a) {
        if (row >= 0 && row < buffer.height && col >= 0 && col < buffer.width) {
            drawPoint(buffer, row, col, 0, 0, 0, 255);
        }
    }
    function drawPoint(buffer, row, col, r, g, b, a) {
        buffer.data[(row * buffer.width + col) * 4] = r;
        buffer.data[(row * buffer.width + col) * 4 + 1] = g;
        buffer.data[(row * buffer.width + col) * 4 + 2] = b;
        buffer.data[(row * buffer.width + col) * 4 + 3] = a;
    }
})(GL || (GL = {}));
//# sourceMappingURL=GLContext.js.map