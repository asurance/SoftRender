define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GLBuffer {
        constructor() {
            this.layout = {};
        }
        SetData(srcData) {
            if (typeof srcData == 'number') {
                this.data = new ArrayBuffer(srcData);
            }
            else if (srcData instanceof ArrayBuffer) {
                this.data = srcData;
            }
            else {
                this.data = srcData.buffer;
            }
        }
        SetAttribPointer(key, size, type, normalized, stride, offset) {
            if (this.layout[key]) {
                this.layout[key].size = size;
                this.layout[key].type = type;
                this.layout[key].stride = stride;
                this.layout[key].offset = offset;
            }
            else {
                this.layout[key] = new GLBufferLayout(size, type, normalized, stride, offset);
            }
        }
        GetData(first, count) {
            let res = new Array(count);
            for (let i = 0; i < res.length; i++) {
                res[i] = {};
            }
            for (let i = 0; i < count; i++) {
                for (let key in this.layout) {
                    let offset = (first + i) * this.layout[key].stride + this.layout[key].offset;
                    res[i][key] = GetValueFromBuffer(this.layout[key].type, this.data, this.layout[key].size, offset);
                }
            }
            return res;
        }
        Dispose() {
            this.data = undefined;
        }
    }
    exports.GLBuffer = GLBuffer;
    class GLBufferLayout {
        constructor(size, type, normalized, stride, offset) {
            this.size = size;
            this.type = type;
            this.normalized = normalized;
            this.stride = stride;
            this.offset = offset;
        }
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
});
//# sourceMappingURL=GLBuffer.js.map