// merge missing fields for Intl.NumberFormatOptions
// https://github.com/microsoft/TypeScript/issues/36533

// eslint-disable-next-line @typescript-eslint/tslint/config
namespace Intl {
  interface NumberFormatOptions {
    notation?: string
    compactDisplay?: string
  }
}
