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
            this.screenBuffer = context.getImageData(0, 0, canvas.width, canvas.height);
            this.drawingBufferWidth = canvas.width;
            this.drawingBufferHeight = canvas.height;
            let settingBuffer = new ArrayBuffer(20 /* SettingLength */);
            this.settings = new DataView(settingBuffer);
            requestAnimationFrame(this.refreshScreen.bind(this));
        }
        createBuffer() {
            return { data: undefined, layouts: undefined };
        }
        clearColor(red, green, blue, alpha) {
            this.settings.setUint8(0 /* ClearColorRed */, Math.round(clampTo01(red) * 255));
            this.settings.setUint8(1 /* ClearColorGreen */, Math.round(clampTo01(green) * 255));
            this.settings.setUint8(2 /* ClearColorBlue */, Math.round(clampTo01(blue) * 255));
            this.settings.setUint8(3 /* ClearColorAlpha */, Math.round(clampTo01(alpha) * 255));
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
        clear(mask) {
            let rgba = new Uint8ClampedArray(this.settings.buffer, 0 /* ClearColorRed */, 4);
            for (let row = 0; row < this.drawingBufferHeight; row++) {
                for (let col = 0; col < this.drawingBufferWidth; col++) {
                    this.screenBuffer.data.set(rgba, (row * this.drawingBufferWidth + col) << 2);
                    // this.screenBuffer.data[(row * this.drawingBufferWidth + col) << 2] = this.settings.getUint8(XGLSettings.ClearColorRed);
                    // this.screenBuffer.data[((row * this.drawingBufferWidth + col) << 2) + 1] = this.settings.getUint8(XGLSettings.ClearColorGreen);
                    // this.screenBuffer.data[((row * this.drawingBufferWidth + col) << 2) + 2] = this.settings.getUint8(XGLSettings.ClearColorBlue);
                    // this.screenBuffer.data[((row * this.drawingBufferWidth + col) << 2) + 3] = this.settings.getUint8(XGLSettings.ClearColorAlpha);
                }
            }
        }
        /**刷新屏幕 */
        refreshScreen() {
            this.context.putImageData(this.screenBuffer, 0, 0);
            requestAnimationFrame(this.refreshScreen.bind(this));
        }
    }
    exports.XGLRenderingContext = XGLRenderingContext;
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