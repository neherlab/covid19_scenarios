import moment from 'moment'

export function dateFormat(date: Date) {
  return moment(date).format('MMM DD YYYY')
}

export function dateTimeFormat(date: Date) {
  return moment(date).format('MMM DD YYYY, hh:mm A')
}
