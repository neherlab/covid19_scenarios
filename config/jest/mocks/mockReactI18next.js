export function t(key) {
  return key
}

export function useTranslation() {
  return { t }
}

const i18n = {
  use: () => i18n,
  init: () => i18n,
  on: () => i18n,
}

export const initReactI18next = {
  type: '3rdParty',
  init: () => i18n,
}

export default i18n
