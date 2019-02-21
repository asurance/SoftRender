import { GLTexture } from "./GLTexture";

export type vertex = { position: number[], varying?: any };
export class GLProgram {
    uniform: any;
    private VertexShader: (input: any, uniform: any) => vertex;
    private FragmentShader: (uniform: any, varying: any, sampler?: GLTexture[]) => number[];
    constructor(vertexShader: (input: any, uniform: any) => vertex, fragmentShader: (uniform: any, varying: any, sampler?: GLTexture[]) => number[]) {
        this.VertexShader = vertexShader;
        this.FragmentShader = fragmentShader;
        this.uniform = {};
    }

    GetVertexByVertexShader(vertex: any) {
        return this.VertexShader(vertex, this.uniform);
    }

    GetColorByFragmentShader(varying?: any, sampler?: GLTexture[]) {
        return this.FragmentShader(this.uniform, varying, sampler);
    }
}