import { GLTypeType } from "./GLConstants";

export class GLBuffer {
    data: ArrayBuffer | undefined;
    layout: { [key: string]: GLBufferLayout };
    constructor() {
        this.layout = {};
    }
    SetData(srcData: number | ArrayBuffer | ArrayBufferView) {
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
    SetAttribPointer(key: string, size: number, type: GLTypeType, normalized: boolean, stride: number, offset: number) {
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
    GetData(first: number, count: number) {
        let res = new Array<any>(count);
        for (let i = 0; i < res.length; i++) {
            res[i] = {};
        }
        for (let i = 0; i < count; i++) {
            for (let key in this.layout) {
                let offset = (first + i) * this.layout[key].stride + this.layout[key].offset;
                res[i][key] = GetValueFromBuffer(this.layout[key].type, this.data!, this.layout[key].size, offset);
            }
        }
        return res;
    }
    Dispose() {
        this.data = undefined
    }
}

class GLBufferLayout {
    size: number;
    type: GLTypeType;
    normalized: boolean;
    stride: number;
    offset: number
    constructor(size: number, type: GLTypeType, normalized: boolean, stride: number, offset: number) {
        this.size = size;
        this.type = type;
        this.normalized = normalized;
        this.stride = stride;
        this.offset = offset;
    }
}

function GetValueFromBuffer(type: GLTypeType, buffer: ArrayBuffer, size: number, offset: number) {
    let res: number[] = [];
    let view;
    if (type == GLTypeType.BYTE) {
        view = new Int8Array(buffer, offset, size);
    }
    else if (type == GLTypeType.UNSIGNED_BYTE) {
        view = new Uint8ClampedArray(buffer, offset, size);
    }
    else if (type == GLTypeType.SHORT) {
        view = new Int16Array(buffer, offset, size);
    }
    else if (type == GLTypeType.UNSIGNED_SHORT) {
        view = new Uint16Array(buffer, offset, size);
    }
    else if (type == GLTypeType.INT) {
        view = new Int32Array(buffer, offset, size);
    }
    else if (type == GLTypeType.UNSIGNED_INT) {
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