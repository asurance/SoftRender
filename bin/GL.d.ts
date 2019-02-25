/**XGL库绘制上下文 */
export declare class XGLRenderingContext {
    readonly canvas: HTMLCanvasElement;
    readonly drawingBufferHeight: number;
    readonly drawingBufferWidth: number;
    constructor(canvas: HTMLCanvasElement);
    createBuffer(): XGLBuffer;
    clearColor(red: number, green: number, blue: number, alpha: number): void;
    viewport(x: number, y: number, width: number, height: number): void;
    clear(mask: number): void;
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
    /**刷新屏幕 */
    private refreshScreen;
}
declare type XGLBuffer = {
    data: ArrayBuffer | undefined;
    layouts: XGLBufferAttribLayout | XGLBufferAttribLayout[] | undefined;
};
declare type XGLBufferAttribLayout = {
    size: number;
    type: number;
    stride: number;
    offset: number;
    normalized: boolean;
};
export {};
