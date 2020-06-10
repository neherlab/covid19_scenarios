declare module 'jsurl' {
  function stringify(o: Record<string, any>): string
  function parse(s: string): any
}
