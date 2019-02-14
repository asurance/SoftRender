namespace GL {
    export class GLBuffer {
        data: ArrayBuffer | undefined;
        layout: GLLayout[];
        constructor() {
            this.layout = [];
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
        SetAttribPointer(index: number, size: 1 | 2 | 3 | 4, type: TypeType, normalized: boolean, stride: number, offset: number) {
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
        GetData(first: number, count: number) {
            let res = new Array<number[]>(count);
            for (let i = 0; i < this.layout.length; i++) {
                for (let j = 0; j < count; j++) {
                    let offset = (first + j) * this.layout[i].stride + this.layout[i].offset;
                    res[j] = GetValueFromBuffer(this.layout[i].type, this.data!, this.layout[i].size, offset);
                }
            }
            return res;
        }
        Dispose() {
            this.data = undefined
        }
    }

    class GLLayout {
        size: 1 | 2 | 3 | 4;
        type: TypeType;
        normalized: boolean;
        stride: number;
        offset: number
        constructor(size: 1 | 2 | 3 | 4, type: TypeType, normalized: boolean, stride: number, offset: number) {
            this.size = size;
            this.type = type;
            this.normalized = normalized;
            this.stride = stride;
            this.offset = offset;
        }
    }

    function GetValueFromBuffer(type: TypeType, buffer: ArrayBuffer, size: number, offset: number) {
        let res: number[] = [];
        let view;
        if (type == TypeType.BYTE) {
            view = new Int8Array(buffer, offset, size);
        }
        else if (type == TypeType.UNSIGNED_BYTE) {
            view = new Uint8ClampedArray(buffer, offset, size);
        }
        else if (type == TypeType.SHORT) {
            view = new Int16Array(buffer, offset, size);
        }
        else if (type == TypeType.UNSIGNED_SHORT) {
            view = new Uint16Array(buffer, offset, size);
        }
        else if (type == TypeType.INT) {
            view = new Int32Array(buffer, offset, size);
        }
        else if (type == TypeType.UNSIGNED_INT) {
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
}