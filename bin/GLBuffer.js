"use strict";
var GL;
(function (GL) {
    class GLBuffer {
        constructor() {
            this.usage = 35044 /* STATIC_DRAW */;
            this.Disposed = false;
        }
        SetData(srcData, usage) {
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
            this.data = undefined;
        }
    }
    GL.GLBuffer = GLBuffer;
})(GL || (GL = {}));
//# sourceMappingURL=GLBuffer.js.map