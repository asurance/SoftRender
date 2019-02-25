import { GLBuffer } from "./GLBuffer";

/**XGL库绘制上下文 */
export class XGLRenderingContext {
    readonly canvas: HTMLCanvasElement;
    readonly drawingBufferHeight: number;
    readonly drawingBufferWidth: number;
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
        this.screenBuffer = context.getImageData(0, 0, canvas.width, canvas.height);
        this.drawingBufferWidth = canvas.width;
        this.drawingBufferHeight = canvas.height;
        let settingBuffer = new ArrayBuffer(XGLSettings.SettingLength);
        this.settings = new DataView(settingBuffer);
        requestAnimationFrame(this.refreshScreen.bind(this));
    }
    createBuffer(): XGLBuffer {
        return { data: undefined, layouts: undefined };
    }
    clearColor(red: number, green: number, blue: number, alpha: number) {
        this.settings.setUint8(XGLSettings.ClearColorRed, Math.round(clampTo01(red) * 255));
        this.settings.setUint8(XGLSettings.ClearColorGreen, Math.round(clampTo01(green) * 255));
        this.settings.setUint8(XGLSettings.ClearColorBlue, Math.round(clampTo01(blue) * 255));
        this.settings.setUint8(XGLSettings.ClearColorAlpha, Math.round(clampTo01(alpha) * 255));
    }
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
    clear(mask: number) {
        let rgba = new Uint8ClampedArray(this.settings.buffer, XGLSettings.ClearColorRed, 4);
        for (let row = 0; row < this.drawingBufferHeight; row++) {
            for (let col = 0; col < this.drawingBufferWidth; col++) {
                this.screenBuffer.data.set(rgba, (row * this.drawingBufferWidth + col) << 2);
                // this.screenBuffer.data[(row * this.drawingBufferWidth + col) << 2] = this.settings.getUint8(XGLSettings.ClearColorRed);
                // this.screenBuffer.data[((row * this.drawingBufferWidth + col) << 2) + 1] = this.settings.getUint8(XGLSettings.ClearColorGreen);
                // this.screenBuffer.data[((row * this.drawingBufferWidth + col) << 2) + 2] = this.settings.getUint8(XGLSettings.ClearColorBlue);
                // this.screenBuffer.data[((row * this.drawingBufferWidth + col) << 2) + 3] = this.settings.getUint8(XGLSettings.ClearColorAlpha);
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
    /**刷新屏幕 */
    private refreshScreen() {
        this.context.putImageData(this.screenBuffer, 0, 0);
        requestAnimationFrame(this.refreshScreen.bind(this));
    }
}
type XGLBuffer = {
    data: ArrayBuffer | undefined,
    layouts: XGLBufferAttribLayout | XGLBufferAttribLayout[] | undefined,
}
type XGLBufferAttribLayout = {
    size: number,
    type: number,
    stride: number,
    offset: number
    normalized: boolean,
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