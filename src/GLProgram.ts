export type vertex = { position: number[], varying?: any };
export class GLProgram {
    uniform: any;
    private VertexShader: (input: any, uniform: any) => vertex;
    private FragmentShader: (uniform: any, varying: any) => number[];
    constructor(vertexShader: (input: any, uniform: any) => vertex, fragmentShader: (uniform: any, varying: any) => number[]) {
        this.VertexShader = vertexShader;
        this.FragmentShader = fragmentShader;
        this.uniform = {};
    }

    GetVertexByVertexShader(vertex: any) {
        return this.VertexShader(vertex, this.uniform);
    }

    GetColorByFragmentShader(varying?: any) {
        return this.FragmentShader(this.uniform, varying);
    }
}