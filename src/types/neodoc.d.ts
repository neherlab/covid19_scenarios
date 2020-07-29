declare module 'neodoc' {
  import { Required } from 'utility-types'

  export declare type NeodocSpec = Record<string, unknown>

  export declare interface NeodocOptions {
    // Do not exit upon error or when parsing --help or --version. Instead throw and error / return the value.
    dontExit?: boolean

    // Override process.env
    env?: Record<string, string>

    // Override process.argv
    argv?: Record<string, string>

    // Parse until the first command or <positional> argument, then collect the rest into an array, given the help
    // indicates another, repeatable, positional argument, e.g. : [options] <ommand> [<args>...]
    optionsFirst?: boolean

    // Enable parsing groups that "look like" options as options. For example: [-f ARG...] means [-f=ARG...]
    smartOptions?: boolean

    // Stop parsing at the given options, i.e. [ -n ]. It's value will be the rest of argv.
    stopAt?: string

    // Require flags be present in the input. In neodoc, flags are optional by default and can be omitted. This option
    // forces the user to pass flags explicitly, failing the parse otherwise.
    requireFlags?: boolean

    // Relax placement rules. Positionals and commands are no longer solid anchors. The order amongs them, however,
    // remains fixed. This implies that options can appear anywhere.
    laxPlacement?: boolean

    // An array of flags that trigger the special version behavior: Print the program version and exit with code 0.
    versionFlags?: string[]

    // The version to print for the special version behavior. Defaults to finding the version of the nearest
    // package.json file, relative to the executing main module. Note that disk IO is only performed if
    // opts.versionFlags is non-empty and opts.version is not set.
    version?: string

    // An array of flags that trigger the special help behavior: Print the full program help text and exit with code 0.
    helpFlags?: string[]

    // Allow options to be repeated even if the spec does not explicitly allow this. This "loosens" up the parser to
    // accept more input and makes for a more intuitive command line. Please note: repeatability is still subject to
    // chunking (use laxPlacement to relax this further).
    repeatableOptions?: boolean

    transforms?: {
      // an array of functions to be called prior to "solving" the input. This function takes the spec as it's only
      // parameter. At this point, the spec is mostly untouched by neodoc with the exception of smart-options which
      // runs as a fixed transform prior to user-provided callbacks if smart-options is true. Transforms that need to
      // be aware of option stacks and [...-options] references should run here as this information is lost
      // during the solving transforms.
      presolve?(spec: NeodocSpec): NeodocSpec

      // an array of functions to be called after "solving" the input, just prior to passing the spec to the arg-parser.
      // This function takes the spec as it's only parameter. At this point, the spec has been fully solved, expanded
      // and canonicalised.
      postsolve?(spec: NeodocSpec): NeodocSpec
    }

    // Collect unknown options under a special key ? instead of failing. Useful to send an unknown subset of
    // options to another program.
    allowUnknown: string
  }

  declare function run(doc: string, NeodocOptions): Record<string, string | undefined>

  export default { run }
}
