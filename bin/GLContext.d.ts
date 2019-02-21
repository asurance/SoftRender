import { GLBuffer } from "./GLBuffer";
import { GLRenderBuffer } from "./GLRenderBuffer";
import { GLProgram, vertex } from "./GLProgram";
import { GLBufferType, GLTypeType, GLPrimitiveType, GLTextureType, GLTexturePixelType } from "./GLConstants";
import { GLTexture } from "./GLTexture";
export declare class GLContext {
    private _Viewport;
    private _ClearColor;
    private arrayBuffer;
    private elementArrayBuffer;
    private renderFrameBuffer;
    private program;
    private curABC;
    private curSABC;
    private activeTextures;
    private curActiveID;
    constructor(context: CanvasRenderingContext2D);
    /**Viewing and clipping */
    viewport(x: number, y: number, width: number, height: number): void;
    /**State information */
    activeTexture(texture: number): void;
    clearColor(red: number, green: number, blue: number, alpha: number): void;
    /**Buffers */
    bindBuffer(target: GLBufferType, buffer: GLBuffer | null): void;
    bufferData(target: GLBufferType, srcData: number | ArrayBuffer | ArrayBufferView): void;
    createBuffer(): GLBuffer;
    deleteBuffer(buffer: GLBuffer): void;
    /**Renderbuffers */
    createRenderbuffer(): GLRenderBuffer;
    /**Textures */
    createTexture(): GLTexture;
    bindTexture(target: GLTextureType, texture: GLTexture): void;
    texImage2D(target: GLTextureType, level: number, internalformat: GLTexturePixelType, format: GLTexturePixelType, type: GLTypeType, pixels: HTMLImageElement): void;
    /**Programs and shaders */
    createProgram(vertexShader: (input: any, uniform: any) => vertex, fragmentShader: (uniform: any, varying: any, sampler?: GLTexture[]) => number[]): GLProgram;
    useProgram(program: GLProgram): void;
    /**Uniforms and attributes */
    uniformnv(key: string, value: number[]): void;
    vertexAttribPointer(key: string, size: number, type: GLTypeType, normalized: boolean, stride: number, offset: number): void;
    /**Drawing buffers */
    clear(mask: number): void;
    drawArrays(mode: GLPrimitiveType, first: number, count: number): void;
    private transformToScreen;
    private drawTriangle;
    private drawHorizenTriangle;
    private drawHorizenLine;
    private drawPointWithCheck;
    private drawPoint;
}
