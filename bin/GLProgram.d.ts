declare namespace GL {
    class GLProgram<A2V, V2P, P2B> {
        VertexShader: (v: A2V) => V2P;
        PixelShader: (i: V2P) => P2B;
        constructor(vertexShader: (v: A2V) => V2P, pixelShader: (i: V2P) => P2B);
    }
}
//# sourceMappingURL=GLProgram.d.ts.map