import { noop } from 'lodash'

const useMock = [(k) => k, {}]
useMock.t = (k) => k
useMock.i18n = {}

export const useTranslation = () => useMock

export const initReactI18next = {
  type: '3rdParty',
  init: noop,
}
