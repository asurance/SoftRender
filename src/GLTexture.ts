export class GLTexture {
    data: ImageData | undefined;
    texture2D(uv: number[]) {
        for (let i = 0; i < 2; i++) {
            uv[i] = uv[i] - Math.floor(uv[i]);
        }
        let col = Math.round(uv[0] * this.data!.width);
        let row = Math.round(uv[1] * this.data!.height);
        let res: number[] = [];
        for (let i = 0; i < 4; i++) {
            res.push(this.data!.data[(row * this.data!.width + col) * 4 + i] / 255);
        }
        return res;
    }
}