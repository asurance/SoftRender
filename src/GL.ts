import { GLTypeType } from "./GLConstants";

/**XGL库绘制上下文 */
export class XGLRenderingContext {
    /**当前canvas */
    readonly canvas: HTMLCanvasElement;
    /**当前绘制Buffer高 */
    readonly drawingBufferHeight: number;
    /**当前绘制Buffer宽 */
    readonly drawingBufferWidth: number;
    /**XGL库绘制上下文 */
    constructor(canvas: HTMLCanvasElement) {
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
        let settingBuffer = new ArrayBuffer(XGLSettings.SettingLength);
        this.settings = new DataView(settingBuffer);
        this.screenBuffer = context.getImageData(0, 0, canvas.width, canvas.height);
        this.activeTextures = [];
        this.curActiveID = 0;
        this.curABC = [];
        this.curSABC = 0;
        requestAnimationFrame(this.refreshScreen.bind(this));
    }
    /**
     * 设置视口区域
     * @param x 视口区域x
     * @param y 视口区域y
     * @param width 视口区域宽
     * @param height 视口区域高
     */
    viewport(x: number, y: number, width: number, height: number) {
        if (width <= 0) {
            throw "viewport的宽度须为正数";
        }
        if (height <= 0) {
            throw "viewport的高度须为整数";
        }
        this.settings.setFloat32(XGLSettings.ViewPortX, x);
        this.settings.setFloat32(XGLSettings.ViewPortY, y);
        this.settings.setFloat32(XGLSettings.ViewPortWidth, width);
        this.settings.setFloat32(XGLSettings.ViewPortHeight, height);
    }
    /**
     * 使纹理生效
     * @param texture 生效纹理下标
     */
    activeTexture(texture: number) {
        if (texture < 0 || texture >= this.activeTextures.length) {
            throw "生效的纹理下标为非法值"
        }
        this.curActiveID = texture;
    }
    /**
     * 设置背景清空颜色
     * @param red 红色通道(0-1)
     * @param green 绿色通道(0-1)
     * @param blue 蓝色通道(0-1)
     * @param alpha 透明度通道(0-1)
     */
    clearColor(red: number, green: number, blue: number, alpha: number) {
        this.settings.setUint8(XGLSettings.ClearColorRed, Math.round(clampTo01(red) * 255));
        this.settings.setUint8(XGLSettings.ClearColorGreen, Math.round(clampTo01(green) * 255));
        this.settings.setUint8(XGLSettings.ClearColorBlue, Math.round(clampTo01(blue) * 255));
        this.settings.setUint8(XGLSettings.ClearColorAlpha, Math.round(clampTo01(alpha) * 255));
    }
    bindBuffer(target: number, buffer: XGLBuffer) {
        this.arrayBuffer = buffer;
    }
    bufferData(target: number, srcData: number | ArrayBuffer | ArrayBufferView) {
        if (this.arrayBuffer == undefined) {
            throw "arrayBuffer未绑定前不能设置数据";
        }
        else {
            if (typeof srcData == 'number') {
                if (srcData < 0) {
                    throw "srcData为number类型时不能取负值";
                }
                else {
                    this.arrayBuffer.data = new ArrayBuffer(srcData);
                }
            }
            else if (srcData instanceof ArrayBuffer) {
                this.arrayBuffer.data = srcData;
            }
            else {
                this.arrayBuffer.data = srcData.buffer;
            }
        }
    }
    /**创建Buffer */
    createBuffer(): XGLBuffer {
        return { data: undefined, layouts: undefined };
    }
    /**清空Buffer内存 */
    deleteBuffer(buffer: XGLBuffer) {
        buffer.data = undefined;
        for (let key in buffer.layouts) {
            delete buffer.layouts[key];
        }
        buffer.layouts = undefined;
    }
    createTexture(): XGLTexture {
        return { data: undefined, texture2D: texture2D };
    }
    bindTexture(target: number, texture: XGLTexture) {
        if (target < 0 || target >= this.activeTextures.length) {
            throw "绑定的纹理下标为非法值";
        }
        this.activeTextures[this.curActiveID] = texture;
    }
    texImage2D(target: number, level: number, internalformat: number, format: number, type: number, pixels: HTMLImageElement) {
        let cav = document.createElement('canvas');
        cav.width = pixels.width;
        cav.height = pixels.height;
        let ctx = cav.getContext('2d')!;
        ctx.drawImage(pixels, 0, 0);
        this.activeTextures[this.curActiveID].data = ctx.getImageData(0, 0, pixels.width, pixels.height);
    }
    createProgram(vertexShader: XGLVertexShader, fragmentShader: XGLFragmentShader): XGLProgram {
        return { uniform: {}, vertexShader: vertexShader, fragmentShader: fragmentShader };
    }
    useProgram(program: XGLProgram) {
        this.program = program;
    }
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
    vertexAttribPointer(key: string, size: number, type: number, normalized: boolean, stride: number, offset: number) {
        if (this.arrayBuffer) {
            if (this.arrayBuffer.layouts == undefined) {
                this.arrayBuffer.layouts = {
                    key: {
                        size: size,
                        type: type,
                        stride: stride,
                        offset: offset,
                        normalized: normalized
                    }
                }
            }
            else if (this.arrayBuffer.layouts[key]) {
                this.arrayBuffer.layouts[key].size = size;
                this.arrayBuffer.layouts[key].type = type;
                this.arrayBuffer.layouts[key].stride = stride;
                this.arrayBuffer.layouts[key].offset = offset;
                this.arrayBuffer.layouts[key].normalized = normalized;
            }
            else {
                this.arrayBuffer.layouts[key] = {
                    size: size,
                    type: type,
                    stride: stride,
                    offset: offset,
                    normalized: normalized
                };
            }
        }
        else {
            throw "未绑定arrayBuffer时不能设置Attrib";
        }
    }
    clear(mask: number) {
        let rgba = new Uint8ClampedArray(this.settings.buffer, XGLSettings.ClearColorRed, 4);
        for (let row = 0; row < this.drawingBufferHeight; row++) {
            for (let col = 0; col < this.drawingBufferWidth; col++) {
                this.screenBuffer.data.set(rgba, (row * this.drawingBufferWidth + col) << 2);
            }
        }
    }
    drawArrays(mode: number, first: number, count: number) {
        while (count > 2) {
            let vertice = getDataFromArrayBuffer(this.arrayBuffer!, first, 3);
            first += 3;
            count -= 3;
            let vert = vertice.map((vertex, i) => {
                let info = this.program!.vertexShader!(vertex, this.program!.uniform);
                this.curABC[i] = info;
                return info;
            })
            let traingle = vert.map((vertex) => {
                return vertex.position;
            })
            traingle.forEach(this.transformToScreen.bind(this));
            this.curSABC = SFunction(this.curABC[0].position, this.curABC[1].position, this.curABC[2].position);
            if (this.curSABC < 0) {
                this.drawTriangle(this.screenBuffer, traingle);
            }
        }
    }
    /**传递给Clear函数来清空当前颜色缓冲 */
    readonly COLOR_BUFFER_BIT = 0x00004000;
    readonly ARRAY_BUFFER = 0x8892;
    readonly ELEMENT_ARRAY_BUFFER = 0x8893;
    readonly BYTE = 0x1400;
    readonly UNSIGNED_BYTE = 0x1401;
    readonly SHORT = 0x1402;
    readonly UNSIGNED_SHORT = 0x1403;
    readonly INT = 0x1404;
    readonly UNSIGNED_INT = 0x1405;
    readonly FLOAT = 0x1406;
    readonly TRIANGLES = 0x0004;
    readonly TEXTURE_2D = 0x0DE1;
    readonly RGBA8 = 0x8058;
    /**绘制上下文 */
    private context: CanvasRenderingContext2D;
    /**上下文设置信息 */
    private settings: DataView;
    /**屏幕像素Buffer */
    private screenBuffer: ImageData;
    /**当前arrayBuffer */
    private arrayBuffer: XGLBuffer | undefined;
    /**当前program */
    private program: XGLProgram | undefined;
    private curABC: XGLVertex[];
    private curSABC: number;
    private activeTextures: XGLTexture[];
    private curActiveID: number;
    /**刷新屏幕 */
    private refreshScreen() {
        this.context.putImageData(this.screenBuffer, 0, 0);
        requestAnimationFrame(this.refreshScreen.bind(this));
    }
    private transformToScreen(position: number[]) {
        position[0] = (position[0] + 1) / 2 * this.settings.getFloat32(XGLSettings.ViewPortWidth) + this.settings.getFloat32(XGLSettings.ViewPortX);
        position[1] = (position[1] + 1) / 2 * this.settings.getFloat32(XGLSettings.ViewPortHeight) + this.settings.getFloat32(XGLSettings.ViewPortY);
    }
    private drawTriangle(buffer: ImageData, vertex: number[][]) {
        let flag = true;
        for (let i = 0; i < 3; i++) {
            if (vertex[i][1] == vertex[(i + 1) % 3][1]) {
                this.drawHorizenTriangle(buffer, vertex[(i + 2) % 3], vertex[i], vertex[(i + 1) % 3]);
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
            this.drawHorizenTriangle(buffer, vertex[mini], vertex[midi], mid);
            this.drawHorizenTriangle(buffer, vertex[maxi], vertex[midi], mid);
        }
    }

    private drawHorizenTriangle(buffer: ImageData, point: number[], edgeA: number[], edgeB: number[]) {
        let pointy = Math.round(point[1]);
        let liney = Math.round(edgeA[1]);
        this.drawPointWithCheck(buffer, pointy, Math.round(point[0]), 255, 255, 255, 255);
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
                this.drawHorizenLine(buffer, interpolationByIndex(point, edgeA, 1, i), interpolationByIndex(point, edgeB, 1, i));
            }
        }
    }

    private drawHorizenLine(buffer: ImageData, lineA: number[], lineB: number[]) {
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
                this.drawPoint(buffer, lineA[1], i, 255, 255, 255, 255);
            }
        }
    }

    private drawPointWithCheck(buffer: ImageData, row: number, col: number, r: number, g: number, b: number, a: number) {
        if (row >= 0 && row < buffer.height && col >= 0 && col < buffer.width) {
            this.drawPoint(buffer, row, col, r, g, b, a)
        }
    }

    private drawPoint(buffer: ImageData, row: number, col: number, r: number, g: number, b: number, a: number) {
        let varying: any = {};
        let ratio0 = SFunction([col + 0.5, row + 0.5], this.curABC[1].position, this.curABC[2].position) / this.curSABC;
        let ratio1 = SFunction(this.curABC[0].position, [col + 0.5, row + 0.5], this.curABC[2].position) / this.curSABC;
        let ratio2 = SFunction(this.curABC[0].position, this.curABC[1].position, [col + 0.5, row + 0.5]) / this.curSABC;
        for (let key in this.curABC[0].varying) {
            let val = this.curABC[0].varying[key];
            if (typeof val == 'number') {
                varying[key] = ratio0 * val + ratio1 * this.curABC[1].varying[key] + ratio2 * this.curABC[2].varying[key];
            }
            else if (val instanceof Array) {
                let length = val.length;
                varying[key] = new Array<number>(length);
                for (let i = 0; i < length; i++) {
                    varying[key][i] = ratio0 * val[i] + ratio1 * this.curABC[1].varying[key][i] + ratio2 * this.curABC[2].varying[key][i];
                }
            }
            else {
                throw "varing中存在错误参数";
            }
        }
        let data = this.program!.fragmentShader!(this.program!.uniform, varying, this.activeTextures);
        buffer.data[(row * buffer.width + col) * 4] = data[0] * 255 | 0;
        buffer.data[(row * buffer.width + col) * 4 + 1] = data[1] * 255 | 0;
        buffer.data[(row * buffer.width + col) * 4 + 2] = data[2] * 255 | 0;
        buffer.data[(row * buffer.width + col) * 4 + 3] = data[3] * 255 | 0;
    }
}
type XGLBuffer = {
    data: ArrayBuffer | undefined,
    layouts: { [key: string]: XGLBufferAttribLayout } | undefined
}
function getDataFromArrayBuffer(buffer: XGLBuffer, start: number, length: number) {
    let res = new Array<any>(length);
    for (let i = 0; i < res.length; i++) {
        res[i] = {};
    }
    for (let i = 0; i < length; i++) {
        for (let key in buffer.layouts) {
            let offset = (start + i) * buffer.layouts[key].stride + buffer.layouts[key].offset;
            res[i][key] = GetValueFromBuffer(buffer.layouts[key].type, buffer.data!, buffer.layouts[key].size, offset);
        }
    }
    return res;
}
function GetValueFromBuffer(type: number, buffer: ArrayBuffer, size: number, offset: number) {
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
type XGLBufferAttribLayout = {
    size: number,
    type: number,
    stride: number,
    offset: number,
    normalized: boolean,
}
type XGLVertex = {
    position: number[],
    varying?: any
};
type XGLVertexShader = (input: any, uniform: any) => XGLVertex
type XGLFragmentShader = (uniform: any, varying: any, sampler?: XGLTexture[]) => number[];
export type XGLTexture = {
    data: ImageData | undefined,
    texture2D: (uv: number[]) => number[]
}
type XGLProgram = {
    uniform: any,
    vertexShader: XGLVertexShader | undefined,
    fragmentShader: XGLFragmentShader | undefined
}
function texture2D(this: XGLTexture, uv: number[]) {
    for (let i = 0; i < 2; i++) {
        uv[i] = uv[i] - Math.floor(uv[i]);
    }
    let col = Math.floor(uv[0] * this.data!.width);
    let row = Math.floor(uv[1] * this.data!.height);
    let res: number[] = [];
    for (let i = 0; i < 4; i++) {
        res.push(this.data!.data[(row * this.data!.width + col) * 4 + i] / 255);
    }
    return res;
}
/**设置预定义 */
const enum XGLSettings {
    ClearColorRed = 0,
    ClearColorGreen = 1,
    ClearColorBlue = 2,
    ClearColorAlpha = 3,
    ViewPortX = 4,
    ViewPortY = 8,
    ViewPortWidth = 12,
    ViewPortHeight = 16,
    SettingLength = 20,
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

function SFunction(A: number[], B: number[], C: number[]) {
    return A[0] * B[1] + B[0] * C[1] + C[0] * A[1] - A[0] * C[1] - B[0] * A[1] - C[0] * B[1];
}