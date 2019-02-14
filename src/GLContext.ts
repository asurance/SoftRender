namespace GL {
    export class GLContext {
        private viewport: Int32Array;
        private clearColor: number[];
        private arrayBuffer: GLBuffer | null;
        private elementArrayBuffer: GLBuffer | null;
        private renderFrameBuffer: GLRenderBuffer;
        constructor(context: CanvasRenderingContext2D) {
            this.viewport = new Int32Array([0, 0, context.canvas.width, context.canvas.height]);
            this.clearColor = [0, 0, 0, 0];
            this.arrayBuffer = null;
            this.elementArrayBuffer = null;
            this.renderFrameBuffer = new GLRenderBuffer(context);
        }
        /**Viewing and clipping */
        setviewport(x: number, y: number, width: number, height: number) {
            if (width < 0) {
                throw Error("viewport的宽不能为负值");
            }
            if (height < 0) {
                throw Error("viewport的高不能为负值");
            }
            this.viewport[0] = x;
            this.viewport[1] = y;
            this.viewport[2] = width;
            this.viewport[3] = height;
        }
        /**State information */
        setclearColor(red: number, green: number, blue: number, alpha: number) {
            this.clearColor[0] = clampTo01(red);
            this.clearColor[1] = clampTo01(green);
            this.clearColor[2] = clampTo01(blue);
            this.clearColor[3] = clampTo01(alpha);
        }
        /**Buffers */
        bindBuffer(target: BufferType, buffer: GLBuffer | null) {
            if (target == BufferType.ARRAY_BUFFER) {
                this.arrayBuffer = buffer;
            }
            else {
                this.elementArrayBuffer = buffer;
            }
        }
        bufferData(target: BufferType, srcData: number | ArrayBuffer | ArrayBufferView) {
            if (typeof srcData == 'number' && srcData < 0) {
                throw Error("srcData为number类型时不能取负值");
            }
            let targetBuffer = target == BufferType.ARRAY_BUFFER ? this.arrayBuffer! : this.elementArrayBuffer!;
            targetBuffer.SetData(srcData);
        }
        createBuffer() {
            return new GLBuffer();
        }
        deleteBuffer(buffer: GLBuffer) {
            buffer.Dispose();
        }
        /**Renderbuffers */
        createRenderbuffer() {
            return new GLRenderBuffer();
        }
        /**Uniforms and attributes */
        vertexAttribPointer(index: number, size: 1 | 2 | 3 | 4, type: TypeType, normalized: boolean, stride: number, offset: number) {
            if (normalized) {
                throw Error("NOT_IMPLEMENT");
            }
            else {
                if (this.arrayBuffer) {
                    this.arrayBuffer.SetAttribPointer(index, size, type, normalized, stride, offset);
                }
                else {
                    throw Error("未绑定VAO时不能设置Attrib")
                }
            }
        }
        /**Drawing buffers */
        clear(mask: number) {
            if (mask & (~(ClearType.COLOR_BUFFER_BIT | ClearType.DEPTH_BUFFER_BIT | ClearType.STENCIL_BUFFER_BIT))) {
                throw Error("mask的中存在非法位");
            }
            if (mask & ClearType.COLOR_BUFFER_BIT) {
                let buffer = this.renderFrameBuffer.buffer!;
                for (let i = 0; i < buffer.height; i++) {
                    for (let j = 0; j < buffer.width; j++) {
                        buffer.data[(i * buffer.width + j) * 4] = this.clearColor[0] * 255 | 0;
                        buffer.data[(i * buffer.width + j) * 4 + 1] = this.clearColor[1] * 255 | 0;
                        buffer.data[(i * buffer.width + j) * 4 + 2] = this.clearColor[2] * 255 | 0;
                        buffer.data[(i * buffer.width + j) * 4 + 3] = this.clearColor[3] * 255 | 0;
                    }
                }
            }
            if (mask & ClearType.DEPTH_BUFFER_BIT) {
                throw Error("NOT_IMPLEMENT");
            }
            if (mask & ClearType.STENCIL_BUFFER_BIT) {
                throw Error("NOT_IMPLEMENT");
            }
        }
        drawArrays(mode: PrimitiveType, first: number, count: number) {
            if (mode == PrimitiveType.TRIANGLES) {
                while (count > 2) {
                    let traingle = this.arrayBuffer!.GetData(first, 3);
                    first += 3;
                    count -= 3;
                    traingle.forEach(this.transformToScreen.bind(this));
                    drawTriangle(this.renderFrameBuffer.buffer!, traingle);
                }
            }
            else {
                throw Error("NOT_IMPLEMENT");
            }
        }

        private transformToScreen(position: number[]) {
            position[0] = Math.round((position[0] + 1) / 2 * this.viewport[2] + this.viewport[0]);
            position[1] = Math.round((position[1] + 1) / 2 * this.viewport[3] + this.viewport[1]);
        }
    }

    function clampTo01(val: number) {
        return Math.max(Math.min(val, 1), 0);
    }

    function interpolation(a: number, b: number, ratio: number) {
        return a + (b - a) * ratio;
    }

    function interpolationArr(a: number[], b: number[], ratio: number) {
        let length = a.length;
        let res = new Array<number>(length);
        for (let i = 0; i < length; i++) {
            res[i] = a[i] + (b[i] - a[i]) * ratio;
        }
        return res;
    }

    function interpolationByIndex(a: number[], b: number[], index: number, target: number) {
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

    function interpolationRoundedByIndex(a: number[], b: number[], index: number, target: number) {
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

    function drawTriangle(buffer: ImageData, vertex: number[][]) {
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

    function drawHorizenTriangle(buffer: ImageData, point: number[], edgeA: number[], edgeB: number[]) {
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

    function drawHorizenLine(buffer: ImageData, lineA: number[], lineB: number[]) {
        let start;
        let end;
        if (lineA[0] < lineB[0]) {
            start = lineA[0];
            end = lineB[0]
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

    function drawPointWithCheck(buffer: ImageData, row: number, col: number, r: number, g: number, b: number, a: number) {
        if (row >= 0 && row < buffer.height && col >= 0 && col < buffer.width) {
            drawPoint(buffer, row, col, 0, 0, 0, 255)
        }
    }

    function drawPoint(buffer: ImageData, row: number, col: number, r: number, g: number, b: number, a: number) {
        buffer.data[(row * buffer.width + col) * 4] = r;
        buffer.data[(row * buffer.width + col) * 4 + 1] = g;
        buffer.data[(row * buffer.width + col) * 4 + 2] = b;
        buffer.data[(row * buffer.width + col) * 4 + 3] = a;
    }
}