namespace GL {
    export class GLRenderBuffer {
        buffer: ImageData | undefined;
        context: CanvasRenderingContext2D | undefined;
        constructor(context?: CanvasRenderingContext2D) {
            if (context != undefined) {
                this.context = context;
                this.buffer = new ImageData(context.canvas.width, context.canvas.height);
                requestAnimationFrame(this.render.bind(this));
            }
        }
        private render() {
            this.context!.putImageData(this.buffer!, 0, 0);
            requestAnimationFrame(this.render.bind(this));
        }
    }
}