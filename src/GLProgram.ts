namespace GL {
    type uniforms = { [key: string]: any };
    export class GLProgram<A2V = any, V2P extends { position: number[] } = any, P2B extends { color: number[] } = any> {
        VertexShader: (v: A2V, u: uniforms) => V2P;
        PixelShader: (i: V2P, u: uniforms) => P2B;
        constructor(vertexShader: (v: A2V, u: uniforms) => V2P, pixelShader: (i: V2P, u: uniforms) => P2B) {
            this.VertexShader = vertexShader;
            this.PixelShader = pixelShader;
        }
    }
}