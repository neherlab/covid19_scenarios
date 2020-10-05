import { Namespace, useTranslation, UseTranslationOptions } from 'react-i18next'

export function useTranslationSafe(ns?: Namespace, options?: UseTranslationOptions) {
  const response = useTranslation()
  function t(key: string) {
    return response.t(key) ?? key
  }
  return { ...response, t }
}
