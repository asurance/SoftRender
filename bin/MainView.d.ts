declare class MainView {
    private renderID;
    private gl;
    private buffer;
    constructor(ctx: CanvasRenderingContext2D);
    render(): void;
}
