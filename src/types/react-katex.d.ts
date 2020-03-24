declare module 'react-katex' {
  export function InlineMath(props: { math: string }): React.JSXElementConstructor;
  export function BlockMath(props: { math: string }): React.JSXElementConstructor;
}
