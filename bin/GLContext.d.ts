declare namespace GL {
    class GLContext {
        private context;
        private viewportX;
        private viewportY;
        private viewportWidth;
        private viewportHeight;
        private clearColorR;
        private clearColorG;
        private clearColorB;
        private clearColorA;
        private arrayBuffer;
        private elementArrayBuffer;
        private renderFrameBuffer;
        constructor(context: CanvasRenderingContext2D);
        /**Viewing and clipping */
        viewport(x: number, y: number, width: number, height: number): void;
        /**State information */
        clearColor(red: number, green: number, blue: number, alpha: number): void;
        getParameter(pname: GLConstants): Int32Array | Float32Array | GLBuffer | null;
        /**Buffers */
        bindBuffer(target: GLConstants.ARRAY_BUFFER | GLConstants.ELEMENT_ARRAY_BUFFER, buffer: GLBuffer | null): void;
        bufferData(target: GLConstants.ARRAY_BUFFER | GLConstants.ELEMENT_ARRAY_BUFFER, srcData: number | ArrayBuffer | ArrayBufferView | null, usage: GLConstants.STATIC_DRAW | GLConstants.DYNAMIC_DRAW | GLConstants.STREAM_DRAW): void;
        getBufferParameter(target: GLConstants.ARRAY_BUFFER | GLConstants.ELEMENT_ARRAY_BUFFER, pname: GLConstants.BUFFER_SIZE | GLConstants.BUFFER_USAGE): number;
        createBuffer(): GLBuffer;
        deleteBuffer(buffer: GLBuffer): void;
        /**Renderbuffers */
        createRenderbuffer(): GLRenderBuffer;
        /**Drawing buffers */
        clear(mask: GLConstants): void;
    }
}
//# sourceMappingURL=GLContext.d.ts.map