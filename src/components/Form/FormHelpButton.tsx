import React from 'react'
import { Card, CardBody } from 'reactstrap'

import { useTranslationSafe } from 'src/helpers/useTranslationSafe'
import Popover from '../Wrappers/Popover'

export interface FormHelpButtonProps {
  help?: string | React.ReactNode
}

export default function FormHelpButton({ help }: FormHelpButtonProps) {
  const { t } = useTranslationSafe()

  return (
    <Popover preventDefault stopPropagation style={{ border: 'none' }}>
      <button className="btn btn-secondary help-button ml-2" type="button" title={t('Click to get help')}>
        <span className="help-button-icon">{'?'}</span>
      </button>
      <Card className="card-help">
        <CardBody className="card-body-help">
          <p>{help}</p>
        </CardBody>
      </Card>
    </Popover>
  )
}
