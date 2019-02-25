/**XGL库绘制上下文 */
export declare class XGLRenderingContext {
    readonly canvas: HTMLCanvasElement;
    readonly drawingBufferHeight: number;
    readonly drawingBufferWidth: number;
    constructor(canvas: HTMLCanvasElement);
    viewport(x: number, y: number, width: number, height: number): void;
    activeTexture(texture: number): void;
    clearColor(red: number, green: number, blue: number, alpha: number): void;
    bindBuffer(target: number, buffer: XGLBuffer): void;
    bufferData(target: number, srcData: number | ArrayBuffer | ArrayBufferView): void;
    createBuffer(): XGLBuffer;
    deleteBuffer(buffer: XGLBuffer): void;
    createTexture(): XGLTexture;
    bindTexture(target: number, texture: XGLTexture): void;
    texImage2D(target: number, level: number, internalformat: number, format: number, type: number, pixels: HTMLImageElement): void;
    createProgram(vertexShader: XGLVertexShader, fragmentShader: XGLFragmentShader): XGLProgram;
    useProgram(program: XGLProgram): void;
    uniformnv(key: string, value: number[]): void;
    vertexAttribPointer(key: string, size: number, type: number, normalized: boolean, stride: number, offset: number): void;
    clear(mask: number): void;
    drawArrays(mode: number, first: number, count: number): void;
    /**传递给Clear函数来清空当前颜色缓冲 */
    readonly COLOR_BUFFER_BIT = 16384;
    readonly ARRAY_BUFFER = 34962;
    readonly ELEMENT_ARRAY_BUFFER = 34963;
    readonly BYTE = 5120;
    readonly UNSIGNED_BYTE = 5121;
    readonly SHORT = 5122;
    readonly UNSIGNED_SHORT = 5123;
    readonly INT = 5124;
    readonly UNSIGNED_INT = 5125;
    readonly FLOAT = 5126;
    readonly TRIANGLES = 4;
    readonly TEXTURE_2D = 3553;
    readonly RGBA8 = 32856;
    /**绘制上下文 */
    private context;
    /**上下文设置信息 */
    private settings;
    /**屏幕像素Buffer */
    private screenBuffer;
    private arrayBuffer;
    private program;
    private curABC;
    private curSABC;
    private activeTextures;
    private curActiveID;
    /**刷新屏幕 */
    private refreshScreen;
    private transformToScreen;
    private drawTriangle;
    private drawHorizenTriangle;
    private drawHorizenLine;
    private drawPointWithCheck;
    private drawPoint;
}
declare type XGLBuffer = {
    data: ArrayBuffer | undefined;
    layouts: {
        [key: string]: XGLBufferAttribLayout;
    };
};
declare type XGLBufferAttribLayout = {
    size: number;
    type: number;
    stride: number;
    offset: number;
    normalized: boolean;
};
declare type XGLVertex = {
    position: number[];
    varying?: any;
};
declare type XGLVertexShader = (input: any, uniform: any) => XGLVertex;
declare type XGLFragmentShader = (uniform: any, varying: any, sampler?: XGLTexture[]) => number[];
export declare type XGLTexture = {
    data: ImageData | undefined;
    texture2D: (uv: number[]) => number[];
};
declare type XGLProgram = {
    uniform: any;
    vertexShader: XGLVertexShader | undefined;
    fragmentShader: XGLFragmentShader | undefined;
};
export {};
