export interface GlobAllOptions {
  nodir?: boolean
}

export declare class GlobAll {
  public static sync(paths: string, options?: GlobAllOptions): string[]
}

export default GlobAll
