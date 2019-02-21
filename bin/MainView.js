var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./GLContext"], function (require, exports, GLContext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MainView {
        constructor(ctx) {
            this.renderID = 0;
            this.gl = new GLContext_1.GLContext(ctx);
            let texture = this.gl.createTexture();
            this.gl.bindTexture(3553 /* TEXTURE_2D */, texture);
            this.loadImg();
            this.gl.clearColor(0, 0, 0, 1);
            this.buffer = this.gl.createBuffer();
            this.gl.bindBuffer(34962 /* ARRAY_BUFFER */, this.buffer);
            // let vertice = new Float32Array([0, 0, 0, 0, 0, 0]);
            // let vertice = new Float32Array([0, -1, -1, 0, -0.5, -0.5]);
            let vertice = new Float32Array([0, -1, -1, 0, 1, 0]);
            this.gl.bufferData(34962 /* ARRAY_BUFFER */, vertice);
            this.gl.vertexAttribPointer("pos", 2, 5126 /* FLOAT */, false, 8, 0);
            let program = this.gl.createProgram(defaultVertexShader, defaultFragmentShader);
            this.gl.useProgram(program);
            setTimeout(() => {
                this.renderID = requestAnimationFrame(this.render.bind(this));
            }, 1000);
        }
        loadImg() {
            return __awaiter(this, void 0, void 0, function* () {
                let img = yield LoadImage('Smile.png');
                this.gl.texImage2D(3553 /* TEXTURE_2D */, 0, 32856 /* RGBA8 */, 32856 /* RGBA8 */, 5121 /* UNSIGNED_BYTE */, img);
            });
        }
        render() {
            this.gl.clear(16384 /* COLOR_BUFFER_BIT */);
            this.gl.uniformnv("rotation", [this.renderID / 100]);
            // this.gl.uniformnv("offset", [Math.sin(this.renderID / 100) / 2 + 0.5, 0])
            this.gl.drawArrays(4 /* TRIANGLES */, 0, 3);
            this.renderID = requestAnimationFrame(this.render.bind(this));
        }
    }
    exports.MainView = MainView;
    function defaultVertexShader(input, uniform) {
        let ratio = Math.sin(uniform.rotation[0]);
        let x = input.pos[0] + ratio;
        let y = input.pos[1];
        return { position: [input.pos[0] + ratio, input.pos[1], input.pos[2], input.pos[3]], varying: { pos: [x, y] } };
    }
    function defaultFragmentShader(uniform, varying, sampler) {
        return sampler[0].texture2D(varying.pos);
    }
    function LoadImage(path) {
        return new Promise((resolve) => {
            let img = new Image();
            img.onload = () => {
                resolve(img);
            };
            img.src = path;
        });
    }
});
//# sourceMappingURL=MainView.js.map