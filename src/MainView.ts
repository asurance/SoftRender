import { GLContext } from "./GLContext";
import { GLBuffer } from "./GLBuffer";
import { GLBufferType, GLTypeType, GLClearType, GLPrimitiveType, GLTextureType, GLTexturePixelType } from "./GLConstants";
import { GLTexture } from "./GLTexture";

export class MainView {
    private renderID: number = 0;
    private gl: GLContext;
    private buffer: GLBuffer;
    constructor(ctx: CanvasRenderingContext2D) {
        this.gl = new GLContext(ctx);
        let texture = this.gl.createTexture();
        this.gl.bindTexture(GLTextureType.TEXTURE_2D, texture);
        this.loadImg();
        this.gl.clearColor(0, 0, 0, 1);
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(GLBufferType.ARRAY_BUFFER, this.buffer);
        // let vertice = new Float32Array([0, 0, 0, 0, 0, 0]);
        // let vertice = new Float32Array([0, -1, -1, 0, -0.5, -0.5]);
        let vertice = new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]);
        this.gl.bufferData(GLBufferType.ARRAY_BUFFER, vertice);
        this.gl.vertexAttribPointer("pos", 2, GLTypeType.FLOAT, false, 8, 0);
        let program = this.gl.createProgram(defaultVertexShader, defaultFragmentShader);
        this.gl.useProgram(program);
        setTimeout(() => {
            this.renderID = requestAnimationFrame(this.render.bind(this));
        }, 1000);
    }
    private async loadImg() {
        let img = await LoadImage('Smile.png');
        this.gl.texImage2D(GLTextureType.TEXTURE_2D, 0, GLTexturePixelType.RGBA8, GLTexturePixelType.RGBA8, GLTypeType.UNSIGNED_BYTE, img);
    }
    render() {
        this.gl.clear(GLClearType.COLOR_BUFFER_BIT);
        // this.gl.uniformnv("rotation", [0]);
        this.gl.uniformnv("rotation", [this.renderID / 100]);
        // this.gl.uniformnv("offset", [Math.sin(this.renderID / 100) / 2 + 0.5, 0])
        this.gl.drawArrays(GLPrimitiveType.TRIANGLES, 0, 6);
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
}

function defaultVertexShader(input: { pos: number[] }, uniform: { rotation: number[] }) {
    let ratio = Math.sin(uniform.rotation[0]);
    let x = (input.pos[0] + ratio + 1) / 2;
    let y = (input.pos[1] + 1) / 2;
    return { position: [input.pos[0] + ratio, input.pos[1], input.pos[2], input.pos[3]], varying: { pos: [x, y] } };
}

function defaultFragmentShader(uniform: any, varying: { pos: number[] }, sampler?: GLTexture[]) {
    return sampler![0].texture2D(varying.pos);
}

function LoadImage(path: string) {
    return new Promise<HTMLImageElement>((resolve) => {
        let img = new Image();
        img.onload = () => {
            resolve(img);
        }
        img.src = path;
    })
}