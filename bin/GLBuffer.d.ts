import { GLTypeType } from "./GLConstants";
export declare class GLBuffer {
    data: ArrayBuffer | undefined;
    layout: {
        [key: string]: GLBufferLayout;
    };
    constructor();
    SetData(srcData: number | ArrayBuffer | ArrayBufferView): void;
    SetAttribPointer(key: string, size: 1 | 2 | 3 | 4, type: GLTypeType, normalized: boolean, stride: number, offset: number): void;
    GetData(first: number, count: number): any[];
    Dispose(): void;
}
declare class GLBufferLayout {
    size: 1 | 2 | 3 | 4;
    type: GLTypeType;
    normalized: boolean;
    stride: number;
    offset: number;
    constructor(size: 1 | 2 | 3 | 4, type: GLTypeType, normalized: boolean, stride: number, offset: number);
}
export {};
