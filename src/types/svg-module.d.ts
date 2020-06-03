declare module '*.svg' {
  import type { PureComponent, HTMLProps, SVGProps } from 'react'

  declare class SVG extends PureComponent<SVGProps<SVGElement>> {}
  export default SVG
}
