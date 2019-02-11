declare namespace GL {
    class GLBuffer {
        data: ArrayBuffer | undefined;
        usage: GLConstants.STATIC_DRAW | GLConstants.DYNAMIC_DRAW | GLConstants.STREAM_DRAW;
        Disposed: boolean;
        constructor();
        SetData(srcData: number | ArrayBuffer | ArrayBufferView | null, usage: GLConstants.STATIC_DRAW | GLConstants.DYNAMIC_DRAW | GLConstants.STREAM_DRAW): void;
        Dispose(): void;
    }
}
//# sourceMappingURL=GLBuffer.d.ts.map