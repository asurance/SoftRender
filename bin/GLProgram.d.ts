declare namespace GL {
    class GLProgram {
        uniform: any;
        private varying;
        private VertexShader;
        private FragmentShader;
        constructor(vertexShader: (input: any, uniform: any, varying: any) => number[], fragmentShader: (uniform: any, varying: any) => number[]);
        GetPositonByVertexShader(vertex: any): number[];
    }
}
