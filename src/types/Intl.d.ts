// merge missing fields for Intl.NumberFormatOptions
// https://github.com/microsoft/TypeScript/issues/36533
namespace Intl {
  interface NumberFormatOptions {
    notation?: string
    compactDisplay?: string
  }
}
