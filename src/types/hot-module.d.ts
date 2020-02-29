// Workaround for hot module replacement
interface NodeHotModule extends NodeModule {
  hot: {
    accept(dependency: string, callback: () => void | Promise<void>): void
    accept(errHandler?: (err: Error) => void | Promise<void>): void
    accept(path?: () => void, callback?: () => void | Promise<void>): void
    decline(): void
    dispose(callback: <T>(data: T) => void | Promise<void>): void
  }
}
