define(["require", "exports", "./GL"], function (require, exports, GL_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function main() {
        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        try {
            let gl = new GL_1.XGLRenderingContext(canvas);
            gl.clearColor(0, 0, 1, 1);
            gl.clear(1);
        }
        catch (error) {
            alert(error);
        }
    }
    main();
});
//# sourceMappingURL=index.js.map