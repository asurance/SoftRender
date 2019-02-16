namespace GL {
    export class GLProgram {
        uniform: any;
        private varying: any;
        private VertexShader: (input: any, uniform: any, varying: any) => number[];
        private FragmentShader: (uniform: any, varying: any) => number[];
        constructor(vertexShader: (input: any, uniform: any, varying: any) => number[], fragmentShader: (uniform: any, varying: any) => number[]) {
            this.VertexShader = vertexShader;
            this.FragmentShader = fragmentShader;
            this.uniform = {};
            this.varying = {};
        }

        GetPositonByVertexShader(vertex: any) {
            return this.VertexShader(vertex, this.uniform, this.varying);
        }
    }
}