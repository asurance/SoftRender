declare class MainView {
    private renderID;
    private gl;
    private buffer;
    constructor(ctx: CanvasRenderingContext2D);
    render(): void;
}
declare function defaultVertexShader(input: {
    pos: number[];
}, uniform: {
    offset: number[];
}, varying: any): number[];
declare function defaultFragmentShader(): number[];
