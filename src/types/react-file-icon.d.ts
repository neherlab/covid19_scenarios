import React from 'react'

export interface FileIconProps {
  /** Color of icon background */
  color: string

  /** Text to display in label */
  extension: string

  /** Displays the corner fold */
  fold: boolean

  /** Color of the corner fold */
  foldColor: string

  /** Color of file type icon */
  glyphColor: string

  /** Color of page gradient */
  gradientColor: string

  /** Opacity of page gradient */
  gradientOpacity: number

  /** Color of label */
  labelColor: string

  /** Color of label text */
  labelTextColor: string

  /** Style of label text */
  labelTextStyle: object

  /** Displays the label in all caps */
  labelUppercase: boolean

  /** Corner radius of the file icon */
  radius: number

  /** Width and height of the file icon */
  size: number

  /** Type of glyph icon to display */
  type:
    | '3d'
    | 'acrobat'
    | 'audio'
    | 'binary'
    | 'code'
    | 'code2'
    | 'compressed'
    | 'document'
    | 'drive'
    | 'font'
    | 'image'
    | 'presentation'
    | 'settings'
    | 'spreadsheet'
    | 'vector'
    | 'video'
}

declare const FileIcon = React.Component<FileIconProps | React.HTMLProps<HTMLDivElement>>()

declare const defaultStyles: Reacord<string, FileIconProps>

export { defaultStyles }

export default FileIcon
