namespace GL {
    export class GLBuffer {
        data: ArrayBuffer | undefined;
        usage: GLConstants.STATIC_DRAW | GLConstants.DYNAMIC_DRAW | GLConstants.STREAM_DRAW;
        Disposed: boolean;
        constructor() {
            this.usage = GLConstants.STATIC_DRAW;
            this.Disposed = false;
        }
        SetData(srcData: number | ArrayBuffer | ArrayBufferView | null, usage: GLConstants.STATIC_DRAW | GLConstants.DYNAMIC_DRAW | GLConstants.STREAM_DRAW) {
            this.usage = usage;
            if (typeof srcData == 'number') {
                this.data = new ArrayBuffer(srcData);
            }
            else if (srcData instanceof ArrayBuffer) {
                this.data = srcData;
            }
            else if (srcData == null) {
                this.data = new ArrayBuffer(0);
            }
            else {
                this.data = srcData.buffer;
            }
        }
        Dispose() {
            this.Disposed = true;
            this.data = undefined
        }
    }
}