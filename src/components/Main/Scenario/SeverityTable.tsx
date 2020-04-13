import React, { useState } from 'react'
import _ from 'lodash'
import i18next from 'i18next'
import { AnyAction } from 'typescript-fsa'
import { Col, Row } from 'reactstrap'
import {
  ChangeSet,
  Column,
  EditingState,
  EditingColumnExtension,
  Row as TableRow,
  Table as TableBase,
  DataTypeProvider,
  DataTypeProviderProps,
} from '@devexpress/dx-react-grid'
import { Grid, Table, TableHeaderRow, TableInlineCellEditing } from '@devexpress/dx-react-grid-bootstrap4'
import { format as d3format } from 'd3-format'

import { AgeDistribution } from '../../../algorithms/types/Param.types'
import { SeverityTableRow } from './ScenarioTypes'
import { validatePositiveInteger } from './validateInteger'
import { updateSeverityTable } from './severityTableUpdate'
import { setAgeDistributionData } from '../state/actions'
import type { State } from '../state/state'

import './SeverityTable.scss'

const columns: SeverityTableColumn[] = [
  { name: 'ageGroup', title: i18next.t('Age group') },
  { name: 'population', title: i18next.t('Age distribution') },
  { name: 'confirmed', title: `${i18next.t('Confirmed')}\n% ${i18next.t('total')}` },
  { name: 'severe', title: `${i18next.t('Severe')}\n% ${i18next.t('of confirmed')}` },
  { name: 'critical', title: `${i18next.t('Critical')}\n% ${i18next.t('of severe')}` },
  { name: 'fatal', title: `${i18next.t('Fatal')}\n% ${i18next.t('of critical')}` },
  { name: 'totalFatal', title: `${i18next.t('Fatal')}\n% ${i18next.t('of all infections')}` },
  { name: 'isolated', title: `${i18next.t('Isolated')}\n% ${i18next.t('total')}` },
]

const columnExtensions: Table.ColumnExtension[] = [
  { columnName: 'ageGroup', align: 'center' },
  { columnName: 'population', align: 'center' },
  { columnName: 'confirmed', align: 'center' },
  { columnName: 'severe', align: 'center' },
  { columnName: 'critical', align: 'center' },
  { columnName: 'fatal', align: 'center' },
  { columnName: 'totalFatal', align: 'center' },
  { columnName: 'isolated', align: 'center' },
]

const editingColumnExtensions: EditingColumnExtension[] = [
  { columnName: 'ageGroup', editingEnabled: false },
  { columnName: 'totalFatal', editingEnabled: false },
]
const getRowId = (row: TableRow) => row.id

export type HeaderCellProps = Partial<TableBase.DataCellProps> & TableHeaderRow.CellProps

export function HeaderCell({ column }: HeaderCellProps) {
  const { title } = column
  const content = title?.split('\n').map((line, i) => (
    <p key={`line ${i}: ${line}`} className={`text-center text-bold ${i !== 0 ? 'small' : ''}`}>
      {line}
    </p>
  ))

  return <td title={title}>{content}</td>
}

const DecimalFormatter: React.FC<DataTypeProvider.ValueFormatterProps> = ({ value }) => (
  <span>{d3format('.2')(parseFloat(value))}</span>
)

const DecimalTypeProvider: React.FC<DataTypeProviderProps> = (props) => (
  <DataTypeProvider formatterComponent={DecimalFormatter} {...props} />
)

export type SeverityTableColumn = Column

export interface SeverityTableProps {
  severity: SeverityTableRow[]
  setSeverity(severity: SeverityTableRow[]): void
  scenarioState: State
  scenarioDispatch(action: AnyAction): void
}

interface AgeDistributionErrors {
  id: number
  ageGroup: string
  error: string
}

/**
 *
 * Editable table of severity
 *
 * Adopted from https://devexpress.github.io/devextreme-reactive/react/grid/docs/guides/editing#inline-cell-editing
 */

function SeverityTable({ severity, setSeverity, scenarioState, scenarioDispatch }: SeverityTableProps) {
  const [ageDistributionErrors, setAgeDistributionErrors] = useState<AgeDistributionErrors[]>([])

  const commitChanges = ({ added, changed, deleted }: ChangeSet) => {
    let changedRows: SeverityTableRow[] = []

    if (added) {
      const startingAddedId = severity.length > 0 ? severity[severity.length - 1].id + 1 : 0
      changedRows = [
        ...severity,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ]
    }

    if (changed) {
      changedRows = severity.map((row) => (changed[row.id] ? { ...row, ...changed[row.id] } : row))
    }

    if (deleted) {
      const deletedSet = new Set(deleted)
      changedRows = severity.filter((row) => !deletedSet.has(row.id))
    }

    const ageDistribution: AgeDistribution = { ...scenarioState.ageDistribution }
    const thisAgeDistributionErrors: AgeDistributionErrors[] = []
    changedRows = changedRows.map((row) => {
      if (row.population) {
        const { value, error } = validatePositiveInteger(row.population)
        if (error) {
          thisAgeDistributionErrors.push({ id: row.id, ageGroup: row.ageGroup, error })
          return row
        }
        ageDistribution[row.ageGroup as keyof AgeDistribution] = value
        return { ...row, population: value }
      }
      return row
    })

    setAgeDistributionErrors(thisAgeDistributionErrors)
    scenarioDispatch(setAgeDistributionData({ data: ageDistribution }))
    setSeverity(updateSeverityTable(changedRows))
  }

  const severityWithAgeDistribution = severity.map((ageRow) => {
    return { ...ageRow, population: scenarioState.ageDistribution[ageRow.ageGroup as keyof AgeDistribution] }
  })

  return (
    <>
      <Row noGutters className="severity-table">
        <Col>
          <Grid rows={severityWithAgeDistribution} columns={columns} getRowId={getRowId}>
            <EditingState onCommitChanges={commitChanges} columnExtensions={editingColumnExtensions} />

            <DecimalTypeProvider for={['totalFatal']} />

            <Table columnExtensions={columnExtensions} />

            <TableInlineCellEditing startEditAction={'click'} selectTextOnEditStart />

            <TableHeaderRow cellComponent={HeaderCell} />
          </Grid>
        </Col>
      </Row>

      <Row noGutters>
        <Col>
          {severity.map(({ id, ageGroup, errors }) => {
            if (!errors || _.isEmpty(errors)) {
              return null
            }

            const editableColumns = ['confirmed', 'severe', 'critical', 'fatal']
            return editableColumns.map((column: string) => {
              const message = _.get(errors, column)
              if (!message) {
                return null
              }

              return (
                <ValidationError key={`row-${id}-${column}`} column={column} ageGroup={ageGroup} message={message} />
              )
            })
          })}
          {ageDistributionErrors.map(
            ({ id, ageGroup, error }) =>
              error && (
                <ValidationError
                  key={`row-${id}-age-distribution`}
                  column="age distribution"
                  ageGroup={ageGroup}
                  message={error}
                />
              ),
          )}
        </Col>
      </Row>
    </>
  )
}

interface ValidationErrorProps {
  column: string
  ageGroup: string
  message: string
}

function ValidationError({ column, ageGroup, message }: ValidationErrorProps) {
  return <div className="text-danger">{`Error in row "${ageGroup}", column "${column}": ${message}`}</div>
}

export { SeverityTable }
