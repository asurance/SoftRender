import { XGLRenderingContext } from "./GL";

function main() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas)
    try {
        let gl = new XGLRenderingContext(canvas);
        gl.clearColor(0, 0, 1, 1);
        gl.clear(1);
    }
    catch (error) {
        alert(error);
    }
}
main();