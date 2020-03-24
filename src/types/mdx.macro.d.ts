declare module 'mdx.macro' {
  export function importMDX(
    path: string,
  ): Promise<{ default: React.LazyExoticComponent<any> }>;
}
