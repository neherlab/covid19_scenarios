import React from 'react'

import { useField } from 'formik'
import { useTranslation } from 'react-i18next'
import { FaPlus } from 'react-icons/fa'
import { connect } from 'react-redux'
import { Button, Col, Row } from 'reactstrap'
import { ActionCreator } from 'typescript-fsa'

import type { MitigationInterval } from '../../../algorithms/types/Param.types'
import { UUIDv4 } from '../../../helpers/uuid'
import type { State } from '../../../state/reducer'
import { addMitigationInterval, removeMitigationInterval } from '../../../state/scenario/scenario.actions'
import { MitigationIntervalComponent } from './MitigationIntervalComponent'

export interface MitigationTableProps {
  addMitigationInterval: ActionCreator<void>
  removeMitigationInterval: ActionCreator<UUIDv4>
}

const mapStateToProps = (state: State) => ({})

const mapDispatchToProps = {
  addMitigationInterval,
  removeMitigationInterval,
}

export const MitigationTable = connect(mapStateToProps, mapDispatchToProps)(MitigationTableDisconnected)

export function MitigationTableDisconnected({ addMitigationInterval, removeMitigationInterval }: MitigationTableProps) {
  const { t } = useTranslation()
  const [{ value: mitigationIntervals }] = useField<MitigationInterval[]>('mitigation.mitigationIntervals') // prettier-ignore

  return (
    <>
      <Row>
        <Col>
          <div className="mitigation-table-wrapper">
            {mitigationIntervals.map((interval, index) => {
              return (
                <MitigationIntervalComponent
                  key={interval.id}
                  interval={interval}
                  index={index}
                  onRemove={() => removeMitigationInterval(interval.id)}
                />
              )
            })}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="table-controls text-right align-middle">
            <Button type="button" onClick={() => addMitigationInterval()}>
              <FaPlus size={20} />
              <span className="ml-2 d-inline align-middle">{t(`Add`)}</span>
            </Button>
          </div>
        </Col>
      </Row>
    </>
  )
}
