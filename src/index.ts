import { XGLRenderingContext, XGLTexture } from "./GL";
import { GLTypeType } from "./GLConstants";

function main1() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    document.body.appendChild(canvas);
    try {
        let gl = new XGLRenderingContext(canvas);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(1);
        gl.viewport(0, 0, 400, 300);
        let buffer = gl.createBuffer();
        gl.bindBuffer(1, buffer);
        gl.bufferData(1, new Float32Array([0, -1, 1, 0, 0, -1, 1, 0, 1, 0, 1, 1, 0, 0, 1]));
        gl.vertexAttribPointer("pos", 2, GLTypeType.FLOAT, false, 20, 0);
        gl.vertexAttribPointer("color", 3, GLTypeType.FLOAT, false, 20, 8);
        let program = gl.createProgram(vertexShader1, fragmentShader1);
        gl.useProgram(program);
        gl.drawArrays(1, 0, 3);
    }
    catch (error) {
        alert(error);
    }
}
main1();

function vertexShader1(input: { pos: number[], color: number[] }, uniform: any) {
    return { position: [input.pos[0], input.pos[1], 0, 1], varying: { color: [input.color[0], input.color[1], input.color[2], 1] } };
}

function fragmentShader1(uniform: any, varying: { color: number[] }, sampler?: XGLTexture[]) {
    return varying.color;
}
function main2() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.body.appendChild(canvas);
    try {
        let gl = new XGLRenderingContext(canvas);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(1);
        gl.viewport(0, 0, 400, 400);
        let buffer = gl.createBuffer();
        gl.bindBuffer(1, buffer);
        gl.bufferData(1, new Float32Array([-1, -1, 0, 1, 1, -1]));
        gl.vertexAttribPointer("pos", 2, GLTypeType.FLOAT, false, 8, 0);
        let program = gl.createProgram(vertexShader2, fragmentShader2);
        gl.useProgram(program);
        let tex = gl.createTexture();
        gl.bindTexture(1, tex);
        let img = new Image();
        let id = 0;
        img.onload = () => {
            gl.texImage2D(1, 1, 1, 1, 1, img);
            render();
        }
        img.src = 'Smile.png';
        function render() {
            gl.clear(1);
            gl.drawArrays(1, 0, 3);
            id = requestAnimationFrame(render);
            gl.uniformnv('time', [id / 60]);
        }
    }
    catch (error) {
        alert(error);
    }
}
main2();
function vertexShader2(input: { pos: number[] }, uniform: { time: number }) {
    let offset = Math.sin(uniform.time);
    let y = input.pos[1];
    let x = input.pos[0] + offset * (y + 1) / 2;
    return { position: [x, y, 0, 1], varying: { uv: [(x + 1) / 2, (y + 1) / 2] } };
}

function fragmentShader2(uniform: any, varying: { uv: number[] }, sampler?: XGLTexture[]) {
    return sampler![0].texture2D(varying.uv);
}