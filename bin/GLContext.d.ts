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
        /**Programs and shaders */
        createProgram(vertexShader: (input: any, uniform: any, varying: any) => number[], fragmentShader: (uniform: any, varying: any) => number[]): GLProgram;
        useProgram(program: GLProgram): void;
        /**Uniforms and attributes */
        uniformnv(key: string, value: number[]): void;
        vertexAttribPointer(key: string, size: 1 | 2 | 3 | 4, type: TypeType, normalized: boolean, stride: number, offset: number): void;
        /**Drawing buffers */
        clear(mask: number): void;
        drawArrays(mode: PrimitiveType, first: number, count: number): void;
        private transformToScreen;
    }
}
