import * as d3 from 'd3'

export function numberFormatter(humanize: boolean, round: boolean) {
  let formatString = ',.2f'
  if (humanize && round) {
    throw new Error('not implemented')
  } else if (humanize) {
    formatString = ',.3~s'
  } else if (round) {
    formatString = ',.0f'
  }

  return d3.format(formatString)
}
