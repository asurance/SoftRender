class MainView {
    private ctx: CanvasRenderingContext2D;
    private renderID: number | undefined;
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
    render() {
        console.log(this.renderID);
    }
}
