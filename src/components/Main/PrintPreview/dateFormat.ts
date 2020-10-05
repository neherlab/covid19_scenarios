import moment from 'moment'

export function dateFormat(date: Date) {
  return moment(date).format('MMM DD YYYY') // eslint-disable-line i18next/no-literal-string
}

export function dateTimeFormat(date: Date) {
  return moment(date).format('MMM DD YYYY, hh:mm A') // eslint-disable-line i18next/no-literal-string
}
