define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**XGL库绘制上下文 */
    class XGLRenderingContext {
        constructor(canvas) {
            /**传递给Clear函数来清空当前颜色缓冲 */
            this.COLOR_BUFFER_BIT = 0x00004000;
            this.ARRAY_BUFFER = 0x8892;
            this.ELEMENT_ARRAY_BUFFER = 0x8893;
            this.BYTE = 0x1400;
            this.UNSIGNED_BYTE = 0x1401;
            this.SHORT = 0x1402;
            this.UNSIGNED_SHORT = 0x1403;
            this.INT = 0x1404;
            this.UNSIGNED_INT = 0x1405;
            this.FLOAT = 0x1406;
            this.TRIANGLES = 0x0004;
            this.TEXTURE_2D = 0x0DE1;
            this.RGBA8 = 0x8058;
            let context = canvas.getContext('2d');
            if (context == null) {
                throw "浏览器不支持Canvas2d";
            }
            else if (canvas.width <= 0) {
                throw "canvas的宽度须为正数";
            }
            else if (canvas.height <= 0) {
                throw "canvas的高度须为正数";
            }
            else {
                this.context = context;
            }
            this.canvas = canvas;
            this.drawingBufferWidth = canvas.width;
            this.drawingBufferHeight = canvas.height;
            let settingBuffer = new ArrayBuffer(20 /* SettingLength */);
            this.settings = new DataView(settingBuffer);
            this.screenBuffer = context.getImageData(0, 0, canvas.width, canvas.height);
            this.activeTextures = [];
            this.curActiveID = 0;
            this.curABC = [];
            this.curSABC = 0;
            requestAnimationFrame(this.refreshScreen.bind(this));
        }
        viewport(x, y, width, height) {
            if (width <= 0) {
                throw "viewport的宽度须为正数";
            }
            if (height <= 0) {
                throw "viewport的高度须为整数";
            }
            this.settings.setFloat32(4 /* ViewPortX */, x);
            this.settings.setFloat32(8 /* ViewPortY */, y);
            this.settings.setFloat32(12 /* ViewPortWidth */, width);
            this.settings.setFloat32(16 /* ViewPortHeight */, height);
        }
        activeTexture(texture) {
            this.curActiveID = texture;
        }
        clearColor(red, green, blue, alpha) {
            this.settings.setUint8(0 /* ClearColorRed */, Math.round(clampTo01(red) * 255));
            this.settings.setUint8(1 /* ClearColorGreen */, Math.round(clampTo01(green) * 255));
            this.settings.setUint8(2 /* ClearColorBlue */, Math.round(clampTo01(blue) * 255));
            this.settings.setUint8(3 /* ClearColorAlpha */, Math.round(clampTo01(alpha) * 255));
        }
        bindBuffer(target, buffer) {
            this.arrayBuffer = buffer;
        }
        bufferData(target, srcData) {
            if (typeof srcData == 'number') {
                if (srcData < 0) {
                    throw Error("srcData为number类型时不能取负值");
                }
                else {
                    this.arrayBuffer.data = new ArrayBuffer(srcData);
                }
            }
            else if (srcData instanceof ArrayBuffer) {
                this.arrayBuffer.data = srcData;
            }
            else {
                this.arrayBuffer.data = srcData.buffer;
            }
        }
        createBuffer() {
            return { data: undefined, layouts: {} };
        }
        deleteBuffer(buffer) {
            buffer.data = undefined;
            for (let key in buffer.layouts) {
                delete buffer.layouts[key];
            }
        }
        createTexture() {
            return { data: undefined, texture2D: texture2D };
        }
        bindTexture(target, texture) {
            this.activeTextures[this.curActiveID] = texture;
        }
        texImage2D(target, level, internalformat, format, type, pixels) {
            let cav = document.createElement('canvas');
            cav.width = pixels.width;
            cav.height = pixels.height;
            let ctx = cav.getContext('2d');
            ctx.drawImage(pixels, 0, 0);
            this.activeTextures[this.curActiveID].data = ctx.getImageData(0, 0, pixels.width, pixels.height);
        }
        createProgram(vertexShader, fragmentShader) {
            return { uniform: {}, vertexShader: vertexShader, fragmentShader: fragmentShader };
        }
        useProgram(program) {
            this.program = program;
        }
        uniformnv(key, value) {
            if (this.program.uniform[key]) {
                let list = this.program.uniform[key];
                if (list.length > value.length) {
                    list.splice(value.length);
                }
                value.forEach((val, i) => {
                    list[i] = val;
                });
            }
            else {
                this.program.uniform[key] = value.concat();
            }
        }
        vertexAttribPointer(key, size, type, normalized, stride, offset) {
            if (this.arrayBuffer) {
                if (this.arrayBuffer.layouts[key]) {
                    this.arrayBuffer.layouts[key].size = size;
                    this.arrayBuffer.layouts[key].type = type;
                    this.arrayBuffer.layouts[key].stride = stride;
                    this.arrayBuffer.layouts[key].offset = offset;
                }
                else {
                    this.arrayBuffer.layouts[key] = {
                        size: size,
                        type: type,
                        stride: stride,
                        offset: offset,
                        normalized: normalized
                    };
                }
            }
            else {
                throw Error("未绑定VAO时不能设置Attrib");
            }
        }
        clear(mask) {
            let rgba = new Uint8ClampedArray(this.settings.buffer, 0 /* ClearColorRed */, 4);
            for (let row = 0; row < this.drawingBufferHeight; row++) {
                for (let col = 0; col < this.drawingBufferWidth; col++) {
                    this.screenBuffer.data.set(rgba, (row * this.drawingBufferWidth + col) << 2);
                }
            }
        }
        drawArrays(mode, first, count) {
            while (count > 2) {
                let vertice = getDataFromArrayBuffer(this.arrayBuffer, first, 3);
                first += 3;
                count -= 3;
                let vert = vertice.map((vertex, i) => {
                    let info = this.program.vertexShader(vertex, this.program.uniform);
                    this.curABC[i] = info;
                    return info;
                });
                let traingle = vert.map((vertex) => {
                    return vertex.position;
                });
                traingle.forEach(this.transformToScreen.bind(this));
                this.curSABC = SFunction(this.curABC[0].position, this.curABC[1].position, this.curABC[2].position);
                if (this.curSABC < 0) {
                    this.drawTriangle(this.screenBuffer, traingle);
                }
            }
        }
        /**刷新屏幕 */
        refreshScreen() {
            this.context.putImageData(this.screenBuffer, 0, 0);
            requestAnimationFrame(this.refreshScreen.bind(this));
        }
        transformToScreen(position) {
            position[0] = (position[0] + 1) / 2 * this.settings.getFloat32(12 /* ViewPortWidth */) + this.settings.getFloat32(4 /* ViewPortX */);
            position[1] = (position[1] + 1) / 2 * this.settings.getFloat32(16 /* ViewPortHeight */) + this.settings.getFloat32(8 /* ViewPortY */);
        }
        drawTriangle(buffer, vertex) {
            let flag = true;
            for (let i = 0; i < 3; i++) {
                if (vertex[i][1] == vertex[(i + 1) % 3][1]) {
                    this.drawHorizenTriangle(buffer, vertex[(i + 2) % 3], vertex[i], vertex[(i + 1) % 3]);
                    flag = false;
                    break;
                }
            }
            if (flag) {
                let max = vertex[0][1];
                let maxi = 0;
                let min = vertex[0][1];
                let mini = 0;
                for (let i = 1; i < 3; i++) {
                    if (max < vertex[i][1]) {
                        max = vertex[i][1];
                        maxi = i;
                    }
                    if (min > vertex[i][1]) {
                        min = vertex[i][1];
                        mini = i;
                    }
                }
                let midi = 3 - maxi - mini;
                let mid = interpolationByIndex(vertex[mini], vertex[maxi], 1, vertex[midi][1]);
                this.drawHorizenTriangle(buffer, vertex[mini], vertex[midi], mid);
                this.drawHorizenTriangle(buffer, vertex[maxi], vertex[midi], mid);
            }
        }
        drawHorizenTriangle(buffer, point, edgeA, edgeB) {
            let pointy = Math.round(point[1]);
            let liney = Math.round(edgeA[1]);
            this.drawPointWithCheck(buffer, pointy, Math.round(point[0]), 255, 255, 255, 255);
            let start;
            let end;
            if (pointy < liney) {
                start = pointy + 1;
                end = liney;
            }
            else {
                start = liney;
                end = pointy - 1;
            }
            for (let i = Math.max(start, 0); i < end; i++) {
                if (i >= buffer.height) {
                    break;
                }
                else {
                    this.drawHorizenLine(buffer, interpolationByIndex(point, edgeA, 1, i), interpolationByIndex(point, edgeB, 1, i));
                }
            }
        }
        drawHorizenLine(buffer, lineA, lineB) {
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
            let left = Math.round(start);
            let right = Math.round(end);
            for (let i = Math.max(left, 0); i < right + 1; i++) {
                if (i >= buffer.width) {
                    break;
                }
                else {
                    this.drawPoint(buffer, lineA[1], i, 255, 255, 255, 255);
                }
            }
        }
        drawPointWithCheck(buffer, row, col, r, g, b, a) {
            if (row >= 0 && row < buffer.height && col >= 0 && col < buffer.width) {
                this.drawPoint(buffer, row, col, r, g, b, a);
            }
        }
        drawPoint(buffer, row, col, r, g, b, a) {
            let varying = {};
            let ratio0 = SFunction([col + 0.5, row + 0.5], this.curABC[1].position, this.curABC[2].position) / this.curSABC;
            let ratio1 = SFunction(this.curABC[0].position, [col + 0.5, row + 0.5], this.curABC[2].position) / this.curSABC;
            let ratio2 = SFunction(this.curABC[0].position, this.curABC[1].position, [col + 0.5, row + 0.5]) / this.curSABC;
            for (let key in this.curABC[0].varying) {
                let val = this.curABC[0].varying[key];
                if (typeof val == 'number') {
                    varying[key] = ratio0 * val + ratio1 * this.curABC[1].varying[key] + ratio2 * this.curABC[2].varying[key];
                }
                else if (val instanceof Array) {
                    let length = val.length;
                    varying[key] = new Array(length);
                    for (let i = 0; i < length; i++) {
                        varying[key][i] = ratio0 * val[i] + ratio1 * this.curABC[1].varying[key][i] + ratio2 * this.curABC[2].varying[key][i];
                    }
                }
                else {
                    throw Error("varing中存在错误参数");
                }
            }
            let data = this.program.fragmentShader(this.program.uniform, varying, this.activeTextures);
            buffer.data[(row * buffer.width + col) * 4] = data[0] * 255 | 0;
            buffer.data[(row * buffer.width + col) * 4 + 1] = data[1] * 255 | 0;
            buffer.data[(row * buffer.width + col) * 4 + 2] = data[2] * 255 | 0;
            buffer.data[(row * buffer.width + col) * 4 + 3] = data[3] * 255 | 0;
        }
    }
    exports.XGLRenderingContext = XGLRenderingContext;
    function getDataFromArrayBuffer(buffer, start, length) {
        let res = new Array(length);
        for (let i = 0; i < res.length; i++) {
            res[i] = {};
        }
        for (let i = 0; i < length; i++) {
            for (let key in buffer.layouts) {
                let offset = (start + i) * buffer.layouts[key].stride + buffer.layouts[key].offset;
                res[i][key] = GetValueFromBuffer(buffer.layouts[key].type, buffer.data, buffer.layouts[key].size, offset);
            }
        }
        return res;
    }
    function GetValueFromBuffer(type, buffer, size, offset) {
        let res = [];
        let view;
        if (type == 5120 /* BYTE */) {
            view = new Int8Array(buffer, offset, size);
        }
        else if (type == 5121 /* UNSIGNED_BYTE */) {
            view = new Uint8ClampedArray(buffer, offset, size);
        }
        else if (type == 5122 /* SHORT */) {
            view = new Int16Array(buffer, offset, size);
        }
        else if (type == 5123 /* UNSIGNED_SHORT */) {
            view = new Uint16Array(buffer, offset, size);
        }
        else if (type == 5124 /* INT */) {
            view = new Int32Array(buffer, offset, size);
        }
        else if (type == 5125 /* UNSIGNED_INT */) {
            view = new Uint32Array(buffer, offset, size);
        }
        else {
            view = new Float32Array(buffer, offset, size);
        }
        for (let i = 0; i < size; i++) {
            res.push(view[i]);
        }
        return res;
    }
    function texture2D(uv) {
        for (let i = 0; i < 2; i++) {
            uv[i] = uv[i] - Math.floor(uv[i]);
        }
        let col = Math.floor(uv[0] * this.data.width);
        let row = Math.floor(uv[1] * this.data.height);
        let res = [];
        for (let i = 0; i < 4; i++) {
            res.push(this.data.data[(row * this.data.width + col) * 4 + i] / 255);
        }
        return res;
    }
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
    function SFunction(A, B, C) {
        return A[0] * B[1] + B[0] * C[1] + C[0] * A[1] - A[0] * C[1] - B[0] * A[1] - C[0] * B[1];
    }
});
//# sourceMappingURL=GL.js.map