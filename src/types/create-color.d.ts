declare module 'create-color' {
  export interface CreateColorOptions {
    format: string
  }

  export default function createColor(data: string | object | Array, options?: CreateColorOptions): string
}
