define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GL {
        constructor(canvas) {
            this.DEPTH_BUFFER_BIT = 0x00000100;
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
        }
    }
    exports.GL = GL;
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