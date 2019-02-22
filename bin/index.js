define(["require", "exports", "./GL"], function (require, exports, GL_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function main() {
        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        try {
            let gl = new GL_1.GL(canvas);
        }
        catch (error) {
            console.log(error);
        }
    }
    main();
});
//# sourceMappingURL=index.js.map