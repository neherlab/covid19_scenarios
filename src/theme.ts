import { rgba } from 'polished'

export const white = '#ffffff'
export const gray100 = '#f8f9fa'
export const gray150 = '#eff1f3'
export const gray200 = '#e9ecef'
export const gray250 = '#e5e8ea'
export const gray300 = '#dee2e6'
export const gray400 = '#ced4da'
export const gray500 = '#adb5bd'
export const gray600 = '#7b838a'
export const gray700 = '#495057'
export const gray800 = '#343a40'
export const gray900 = '#212529'
export const black = '#000'

export const blue = '#2196f3'
export const indigo = '#6610f2'
export const purple = '#6f42c1'
export const pink = '#e83e8c'
export const red = '#e51c23'
export const orange = '#fd7e14'
export const yellow = '#ff9800'
export const green = '#4caf50'
export const teal = '#20c997'
export const cyan = '#9c27b0'

export const primary = blue
export const secondary = gray100
export const success = green
export const info = cyan
export const warning = yellow
export const danger = red
export const light = white
export const dark = gray700

export const basicColors = {
  white,
  gray100,
  gray150,
  gray200,
  gray250,
  gray300,
  gray400,
  gray500,
  gray600,
  gray700,
  gray800,
  gray900,
  black,
  blue,
  indigo,
  purple,
  pink,
  red,
  orange,
  yellow,
  green,
  teal,
  cyan,
}

export const themeColors = {
  primary,
  secondary,
  success,
  info,
  warning,
  danger,
  light,
  dark,
}

export const shadows = {
  medium: `2px 2px 3px 3px ${rgba(gray900, 0.25)}`,
}

export const theme = {
  ...basicColors,
  ...themeColors,
  shadows,
}

export type Theme = typeof theme
