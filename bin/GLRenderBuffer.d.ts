export declare class GLRenderBuffer {
    buffer: ImageData | undefined;
    context: CanvasRenderingContext2D | undefined;
    constructor(context?: CanvasRenderingContext2D);
    private render;
}
