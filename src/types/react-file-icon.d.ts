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

export type FileExtension =
  | '3dm'
  | '3ds'
  | '3g2'
  | '3gp'
  | '7zip'
  | 'aac'
  | 'aep'
  | 'ai'
  | 'aif'
  | 'aiff'
  | 'asf'
  | 'asp'
  | 'aspx'
  | 'avi'
  | 'bin'
  | 'bmp'
  | 'c'
  | 'cpp'
  | 'cs'
  | 'css'
  | 'csv'
  | 'cue'
  | 'dll'
  | 'dmg'
  | 'doc'
  | 'docx'
  | 'dwg'
  | 'dxf'
  | 'eot'
  | 'eps'
  | 'exe'
  | 'flac'
  | 'flv'
  | 'fnt'
  | 'fodp'
  | 'fods'
  | 'fodt'
  | 'fon'
  | 'gif'
  | 'gz'
  | 'htm'
  | 'html'
  | 'indd'
  | 'ini'
  | 'java'
  | 'jpeg'
  | 'jpg'
  | 'js'
  | 'json'
  | 'jsx'
  | 'm4a'
  | 'm4v'
  | 'max'
  | 'md'
  | 'mid'
  | 'mkv'
  | 'mov'
  | 'mp3'
  | 'mp4'
  | 'mpeg'
  | 'mpg'
  | 'obj'
  | 'odp'
  | 'ods'
  | 'odt'
  | 'ogg'
  | 'ogv'
  | 'otf'
  | 'pdf'
  | 'php'
  | 'pkg'
  | 'plist'
  | 'png'
  | 'ppt'
  | 'pptx'
  | 'pr'
  | 'ps'
  | 'psd'
  | 'py'
  | 'rar'
  | 'rb'
  | 'rm'
  | 'rtf'
  | 'scss'
  | 'sitx'
  | 'svg'
  | 'swf'
  | 'sys'
  | 'tar'
  | 'tex'
  | 'tif'
  | 'tiff'
  | 'ts'
  | 'ttf'
  | 'txt'
  | 'wav'
  | 'webm'
  | 'wmv'
  | 'woff'
  | 'wpd'
  | 'wps'
  | 'xlr'
  | 'xls'
  | 'xlsx'
  | 'yml'
  | 'zip'
  | 'zipx'

export type FileIconComponent = React.FunctionComponent<FileIconProps | React.HTMLProps<HTMLDivElement>>

export declare const FileIcon: FileIconComponent

export declare const defaultStyles: Record<FileExtension, FileIconProps>
