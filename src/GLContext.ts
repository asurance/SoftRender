import { GLBuffer } from "./GLBuffer";
import { GLRenderBuffer } from "./GLRenderBuffer";
import { GLProgram } from "./GLProgram";
import { GLBufferType, GLTypeType, GLClearType, GLPrimitiveType } from "./GLConstants";

export class GLContext {
    private _Viewport: Int32Array;
    private _ClearColor: Uint8ClampedArray;
    private arrayBuffer: GLBuffer | null;
    private elementArrayBuffer: GLBuffer | null;
    private renderFrameBuffer: GLRenderBuffer;
    private program: GLProgram | null;
    constructor(context: CanvasRenderingContext2D) {
        this._Viewport = new Int32Array([0, 0, context.canvas.width, context.canvas.height]);
        this._ClearColor = new Uint8ClampedArray([0, 0, 0, 0]);
        this.arrayBuffer = null;
        this.elementArrayBuffer = null;
        this.program = null;
        this.renderFrameBuffer = new GLRenderBuffer(context);
    }
    /**Viewing and clipping */
    viewport(x: number, y: number, width: number, height: number) {
        if (width < 0) {
            throw Error("viewport的宽不能为负值");
        }
        if (height < 0) {
            throw Error("viewport的高不能为负值");
        }
        this._Viewport[0] = x;
        this._Viewport[1] = y;
        this._Viewport[2] = width;
        this._Viewport[3] = height;
    }
    /**State information */
    clearColor(red: number, green: number, blue: number, alpha: number) {
        this._ClearColor[0] = red * 255;
        this._ClearColor[1] = green * 255;
        this._ClearColor[2] = blue * 255;
        this._ClearColor[3] = alpha * 255;
    }
    /**Buffers */
    bindBuffer(target: GLBufferType, buffer: GLBuffer | null) {
        if (target == GLBufferType.ARRAY_BUFFER) {
            this.arrayBuffer = buffer;
        }
        else {
            this.elementArrayBuffer = buffer;
        }
    }
    bufferData(target: GLBufferType, srcData: number | ArrayBuffer | ArrayBufferView) {
        if (typeof srcData == 'number' && srcData < 0) {
            throw Error("srcData为number类型时不能取负值");
        }
        let targetBuffer = target == GLBufferType.ARRAY_BUFFER ? this.arrayBuffer! : this.elementArrayBuffer!;
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
    /**Programs and shaders */
    createProgram(vertexShader: (input: any, uniform: any, varying: any) => number[], fragmentShader: (uniform: any, varying: any) => number[]) {
        return new GLProgram(vertexShader, fragmentShader);
    }
    useProgram(program: GLProgram) {
        this.program = program;
    }
    /**Uniforms and attributes */
    uniformnv(key: string, value: number[]) {
        if (this.program!.uniform[key]) {
            let list = this.program!.uniform[key] as number[];
            if (list.length > value.length) {
                list.splice(value.length);
            }
            value.forEach((val, i) => {
                list[i] = val;
            });
        }
        else {
            this.program!.uniform[key] = value.concat();
        }
    }
    vertexAttribPointer(key: string, size: 1 | 2 | 3 | 4, type: GLTypeType, normalized: boolean, stride: number, offset: number) {
        if (normalized) {
            throw Error("NOT_IMPLEMENT");
        }
        else {
            if (this.arrayBuffer) {
                this.arrayBuffer.SetAttribPointer(key, size, type, normalized, stride, offset);
            }
            else {
                throw Error("未绑定VAO时不能设置Attrib")
            }
        }
    }
    /**Drawing buffers */
    clear(mask: number) {
        if (mask & (~(GLClearType.COLOR_BUFFER_BIT | GLClearType.DEPTH_BUFFER_BIT | GLClearType.STENCIL_BUFFER_BIT))) {
            throw Error("mask的中存在非法位");
        }
        if (mask & GLClearType.COLOR_BUFFER_BIT) {
            let buffer = this.renderFrameBuffer.buffer!;
            for (let i = 0; i < buffer.height; i++) {
                for (let j = 0; j < buffer.width; j++) {
                    buffer.data.set(this._ClearColor, (i * buffer.width + j) * 4);
                }
            }
        }
        if (mask & GLClearType.DEPTH_BUFFER_BIT) {
            throw Error("NOT_IMPLEMENT");
        }
        if (mask & GLClearType.STENCIL_BUFFER_BIT) {
            throw Error("NOT_IMPLEMENT");
        }
    }
    drawArrays(mode: GLPrimitiveType, first: number, count: number) {
        if (mode == GLPrimitiveType.TRIANGLES) {
            while (count > 2) {
                let vertice = this.arrayBuffer!.GetData(first, 3);
                first += 3;
                count -= 3;
                let traingle = vertice.map((vertex) => {
                    return this.program!.GetPositonByVertexShader(vertex);
                })
                traingle.forEach(this.transformToScreen.bind(this));
                drawTriangle(this.renderFrameBuffer.buffer!, traingle);
            }
        }
        else {
            throw Error("NOT_IMPLEMENT");
        }
    }

    private transformToScreen(position: number[]) {
        position[0] = (position[0] + 1) / 2 * this._Viewport[2] + this._Viewport[0];
        position[1] = (position[1] + 1) / 2 * this._Viewport[3] + this._Viewport[1];
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
        drawHorizenTriangle(buffer, vertex[mini], vertex[midi], mid);
        drawHorizenTriangle(buffer, vertex[maxi], vertex[midi], mid);
    }
}

function drawHorizenTriangle(buffer: ImageData, point: number[], edgeA: number[], edgeB: number[]) {
    let pointy = Math.round(point[1]);
    let liney = Math.round(edgeA[1]);
    drawPointWithCheck(buffer, pointy, Math.round(point[0]), 255, 255, 255, 255);
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
            drawHorizenLine(buffer, interpolationByIndex(point, edgeA, 1, i), interpolationByIndex(point, edgeB, 1, i));
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
    let left = Math.round(start);
    let right = Math.round(end);
    for (let i = Math.max(left, 0); i < right + 1; i++) {
        if (i >= buffer.width) {
            break;
        }
        else {
            drawPoint(buffer, lineA[1], i, 255, 255, 255, 255);
        }
    }
}

function drawPointWithCheck(buffer: ImageData, row: number, col: number, r: number, g: number, b: number, a: number) {
    if (row >= 0 && row < buffer.height && col >= 0 && col < buffer.width) {
        drawPoint(buffer, row, col, r, g, b, a)
    }
}

function drawPoint(buffer: ImageData, row: number, col: number, r: number, g: number, b: number, a: number) {
    buffer.data[(row * buffer.width + col) * 4] = r;
    buffer.data[(row * buffer.width + col) * 4 + 1] = g;
    buffer.data[(row * buffer.width + col) * 4 + 2] = b;
    buffer.data[(row * buffer.width + col) * 4 + 3] = a;
}