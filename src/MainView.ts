import { GLContext } from "./GLContext";
import { GLBuffer } from "./GLBuffer";
import { GLBufferType, GLTypeType, GLClearType, GLPrimitiveType } from "./GLConstants";

export class MainView {
    private renderID: number;
    private gl: GLContext;
    private buffer: GLBuffer;
    constructor(ctx: CanvasRenderingContext2D) {
        this.gl = new GLContext(ctx);
        this.gl.clearColor(0, 0, 0, 1);
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(GLBufferType.ARRAY_BUFFER, this.buffer);
        // let vertice = new Float32Array([0, 0, 0, 0, 0, 0]);
        // let vertice = new Float32Array([0, -1, -1, 0, -0.5, -0.5]);
        let vertice = new Float32Array([0, -1, 1, 0, 0, -1, 0, 0, 1, 0, 1, 0, 0, 0, 1]);
        this.gl.bufferData(GLBufferType.ARRAY_BUFFER, vertice);
        this.gl.vertexAttribPointer("pos", 2, GLTypeType.FLOAT, false, 20, 0);
        this.gl.vertexAttribPointer("color", 3, GLTypeType.FLOAT, false, 20, 8);
        let program = this.gl.createProgram(defaultVertexShader, defaultFragmentShader);
        this.gl.useProgram(program);
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
    render() {
        this.gl.clear(GLClearType.COLOR_BUFFER_BIT);
        this.gl.uniformnv("rotation", [this.renderID / 100]);
        // this.gl.uniformnv("offset", [Math.sin(this.renderID / 100) / 2 + 0.5, 0])
        this.gl.drawArrays(GLPrimitiveType.TRIANGLES, 0, 3);
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
}

function defaultVertexShader(input: { pos: number[], color: number[] }, uniform: { rotation: number[] }) {
    let ratio = Math.sin(uniform.rotation[0]);
    let ratioC = (ratio + 1) / 2;
    let color = [input.color[0] * ratioC, input.color[1] * ratioC, input.color[2] * ratioC];
    return { position: [input.pos[0] * ratio, input.pos[1], input.pos[2], input.pos[3]], varying: { color: color } };
}

function defaultFragmentShader(uniform: any, varying: { color: number[] }) {
    return [varying.color[0], varying.color[1], varying.color[2], 1];
}