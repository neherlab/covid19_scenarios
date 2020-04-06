import React, { useState } from 'react'
import NewWindow from 'react-new-window'
import { Subtract } from 'utility-types'
import { MdOpenInNew, MdClose } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

// A HOC to give a component open in a separate window functionality via window.open.

export interface NewWindowProps {
  isWindowOpen: boolean
  toggleWindowOpen: () => void
}

interface MakeWindowableProps {
  name: string
  title: string
}

export function makeWindowable<P extends NewWindowProps>(
  Component: React.ComponentType<P>,
  makeWindowableProps: MakeWindowableProps,
) {
  function WithNewWindow(props: Subtract<P, NewWindowProps>) {
    const [open, setOpen] = useState(false)

    const toWrap = <Component isWindowOpen={open} toggleWindowOpen={() => setOpen(!open)} {...(props as P)} />

    return open ? (
      <NewWindow {...makeWindowableProps} onUnload={() => setOpen(false)} onBlock={() => setOpen(false)}>
        {toWrap}
      </NewWindow>
    ) : (
      toWrap
    )
  }

  return WithNewWindow
}

export function NewWindowButton({ isWindowOpen, toggleWindowOpen }: NewWindowProps) {
  const { t } = useTranslation()

  return (
    <button type="button" className="btn btn-secondary" onClick={toggleWindowOpen}>
      {isWindowOpen ? t('Close') : t('Open')} {isWindowOpen ? <MdClose /> : <MdOpenInNew />}
    </button>
  )
}
