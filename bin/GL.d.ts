export declare class GL {
    readonly canvas: HTMLCanvasElement;
    readonly drawingBufferHeight: number;
    readonly drawingBufferWidth: number;
    constructor(canvas: HTMLCanvasElement);
    readonly DEPTH_BUFFER_BIT = 256;
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
    private context;
}
