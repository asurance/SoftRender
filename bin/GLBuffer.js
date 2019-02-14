"use strict";
var GL;
(function (GL) {
    class GLBuffer {
        constructor() {
            this.layout = [];
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
        SetAttribPointer(index, size, type, normalized, stride, offset) {
            if (this.layout[index]) {
                this.layout[index].size = size;
                this.layout[index].type = type;
                this.layout[index].stride = stride;
                this.layout[index].offset = offset;
            }
            else {
                this.layout[index] = new GLLayout(size, type, normalized, stride, offset);
            }
        }
        GetData(first, count) {
            let res = new Array(count);
            for (let i = 0; i < this.layout.length; i++) {
                for (let j = 0; j < count; j++) {
                    let offset = (first + j) * this.layout[i].stride + this.layout[i].offset;
                    res[j] = GetValueFromBuffer(this.layout[i].type, this.data, this.layout[i].size, offset);
                }
            }
            return res;
        }
        Dispose() {
            this.data = undefined;
        }
    }
    GL.GLBuffer = GLBuffer;
    class GLLayout {
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
})(GL || (GL = {}));
//# sourceMappingURL=GLBuffer.js.map