import { GLContext } from "./GL";

function main() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas)
    try {
        let gl = new GLContext(canvas);
        let t = gl.createBuffer();
    }
    catch (error) {
        alert(error);
    }
}
main();