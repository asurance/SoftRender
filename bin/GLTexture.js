define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GLTexture {
        texture2D(uv) {
            for (let i = 0; i < 2; i++) {
                uv[i] = uv[i] - Math.floor(uv[i]);
                if (uv[i] == 1) {
                    uv[i] = 0;
                }
                if (uv[i] < 0 || uv[i] >= 1) {
                    console.log("ERROR");
                }
            }
            let col = Math.round(uv[0] * this.data.width);
            let row = Math.round(uv[1] * this.data.height);
            let res = [];
            for (let i = 0; i < 4; i++) {
                res.push(this.data.data[(row * this.data.width + col) * 4 + i] / 255);
            }
            return res;
        }
    }
    exports.GLTexture = GLTexture;
});
//# sourceMappingURL=GLTexture.js.map