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
        let vertice = new Float32Array([0, -1, -1, 0, 1, 1]);
        this.gl.bufferData(GLBufferType.ARRAY_BUFFER, vertice);
        this.gl.vertexAttribPointer("pos", 2, GLTypeType.FLOAT, false, 8, 0);
        let program = this.gl.createProgram(defaultVertexShader, defaultFragmentShader);
        this.gl.useProgram(program);
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
    render() {
        this.gl.clear(GLClearType.COLOR_BUFFER_BIT);
        this.gl.uniformnv("offset", [0, 0])
        // this.gl.uniformnv("offset", [Math.sin(this.renderID / 100) / 2 + 0.5, 0])
        this.gl.drawArrays(GLPrimitiveType.TRIANGLES, 0, 3);
        this.renderID = requestAnimationFrame(this.render.bind(this));
    }
}

function defaultVertexShader(input: { pos: number[] }, uniform: { offset: number[] }, varying: { pos: number[] }) {
    let x = input.pos[0] + uniform.offset[0];
    let y = input.pos[1] + uniform.offset[1];
    varying.pos = [x, y];
    return [x, y, input.pos[2], input.pos[3]];
}

function defaultFragmentShader(uniform: any, varying: { pos: number[] }) {
    return [(varying.pos[0] + 1) / 2, (varying.pos[1] + 1) / 2, 0, 1]
}