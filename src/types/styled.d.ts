/* eslint-disable @typescript-eslint/no-empty-interface */
import { Theme } from 'src/theme'

declare module 'styled-components' {
  export declare interface DefaultTheme extends Theme {}
}
