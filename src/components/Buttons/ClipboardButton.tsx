import React, { useState } from 'react'

import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Button, ButtonProps } from 'reactstrap'
import { MdContentCopy } from 'react-icons/md'

import { copyToClipboard } from '../../helpers/copyToClipboard'

interface ClipboardButtonProps extends ButtonProps {
  textToCopy?: string
}

/**
 * When clicked, copies textToCopy to clipboard
 */
export function ClipboardButton({ textToCopy, className, ...restProps }: ClipboardButtonProps) {
  const { t } = useTranslation()
  const [isCopied, setIsCopied] = useState(false)
  const onClick = () => {
    if (textToCopy) {
      copyToClipboard(String(textToCopy))
      setIsCopied(true)
    }
  }

  return (
    <Button className={classNames(className, 'clipboard-button')} onClick={onClick} {...restProps}>
      <MdContentCopy />
      <span className="ml-1">{isCopied ? t('Copied!') : t('Copy link')}</span>
    </Button>
  )
}
