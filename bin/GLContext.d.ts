declare namespace GL {
    class GLContext {
        private _Viewport;
        private _ClearColor;
        private arrayBuffer;
        private elementArrayBuffer;
        private renderFrameBuffer;
        private program;
        constructor(context: CanvasRenderingContext2D);
        /**Viewing and clipping */
        viewport(x: number, y: number, width: number, height: number): void;
        /**State information */
        clearColor(red: number, green: number, blue: number, alpha: number): void;
        /**Buffers */
        bindBuffer(target: BufferType, buffer: GLBuffer | null): void;
        bufferData(target: BufferType, srcData: number | ArrayBuffer | ArrayBufferView): void;
        createBuffer(): GLBuffer;
        deleteBuffer(buffer: GLBuffer): void;
        /**Renderbuffers */
        createRenderbuffer(): GLRenderBuffer;
        /**Uniforms and attributes */
        vertexAttribPointer(index: number, size: 1 | 2 | 3 | 4, type: TypeType, normalized: boolean, stride: number, offset: number): void;
        /**Drawing buffers */
        clear(mask: number): void;
        drawArrays(mode: PrimitiveType, first: number, count: number): void;
        private transformToScreen;
    }
}
//# sourceMappingURL=GLContext.d.ts.map