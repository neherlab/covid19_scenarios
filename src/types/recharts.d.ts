// Temporary fixes for recharts v2.x.x-beta, until the typings are updated
declare module 'recharts' {
  export * from '@types/recharts'

  import { Point } from '@types/recharts'

  // How do you call payload inside a payload?
  export interface LegendPayloadPayload {
    activeDot?: boolean
    animateNewValues?: boolean
    animationBegin?: number
    animationDuration?: number
    animationEasing?: string
    connectNulls?: false
    dataKey?: string
    dot?: false
    fill?: string
    hide?: false
    isAnimationActive?: false
    legendType?: string
    name?: string
    points?: Point[]
    length?: number
    stroke?: string
    strokeWidth?: number
    type?: string
    xAxisId?: number
    yAxisId?: number
  }

  export interface LegendPayload {
    color?: string
    dataKey?: string
    inactive?: boolean
    payload?: LegendPayloadPayload
    type: string
    value: string
  }
}
