/* eslint-disable @typescript-eslint/no-explicit-any */
// Type definitions for the jsurl module

declare module 'jsurl' {
  function stringify(o: Record<string, any>): string
  function parse(s: string): any
}
