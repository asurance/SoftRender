declare namespace GL {
    class GLBuffer {
        data: ArrayBuffer | undefined;
        layout: GLLayout[];
        constructor();
        SetData(srcData: number | ArrayBuffer | ArrayBufferView): void;
        SetAttribPointer(index: number, size: 1 | 2 | 3 | 4, type: TypeType, normalized: boolean, stride: number, offset: number): void;
        GetData(first: number, count: number): number[][];
        Dispose(): void;
    }
    class GLLayout {
        size: 1 | 2 | 3 | 4;
        type: TypeType;
        normalized: boolean;
        stride: number;
        offset: number;
        constructor(size: 1 | 2 | 3 | 4, type: TypeType, normalized: boolean, stride: number, offset: number);
    }
}
//# sourceMappingURL=GLBuffer.d.ts.map