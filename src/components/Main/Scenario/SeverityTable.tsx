import React from 'react'
import _ from 'lodash'
import i18next from 'i18next'
import { AnyAction } from 'typescript-fsa'
import { Col, Row } from 'reactstrap'
import { ChangeSet, Column, EditingState, Row as TableRow, Table as TableBase } from '@devexpress/dx-react-grid'
import { Grid, Table, TableHeaderRow, TableInlineCellEditing } from '@devexpress/dx-react-grid-bootstrap4'
import { format as d3format } from 'd3-format'

import { updateSeverityTable } from './severityTableUpdate'
import { OneCountryAgeDistribution } from '../../../assets/data/CountryAgeDistribution.types'
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

const readOnlyColumns = ['ageGroup', 'totalFatal']

const columnColors = {
  confirmed: '#fdbf6f55',
  severe: '#fb9a9955',
  critical: '#e31a1c55',
  fatal: '#cab2d655',
  isolated: '#a6cee355',
}

const getRowId = (row: TableRow) => row.id

export type HeaderCellProps = Partial<TableBase.DataCellProps> & TableHeaderRow.CellProps

export function HeaderCell({ column, ...restProps }: HeaderCellProps) {
  const { title } = column
  const content = title?.split('\n').map((line, i) => (
    <p key={`line ${i}: ${line}`} className={`p-0 m-0 text-center text-truncate ${i !== 0 ? 'small' : ''}`}>
      {line}
    </p>
  ))

  return (
    <td className="py-1 text-bold" colSpan={1} title={title}>
      {content}
    </td>
  )
}

export interface EditableCellProps extends TableInlineCellEditing.CellProps {
  onClick?(): void
}

export function EditableCell({
  column,
  value,
  tableRow,
  tableColumn,
  editingEnabled,
  onValueChange,
  row,
  autoFocus,
  onBlur,
  onFocus,
  onKeyDown,
  ...restProps
}: EditableCellProps) {
  const isReadOnly = readOnlyColumns.includes(column.name)
  const color = _.get(columnColors, column.name)

  return (
    <td className="dx-g-bs4-table-cell text-nowrap" {...restProps}>
      <div style={{ backgroundColor: color }} className="w-100 h-100">
        <input
          type="number"
          className="table-cell-editable-input text-center"
          // readOnly={!editingEnabled}
          value={value}
          onChange={(e) => onValueChange && onValueChange(e.target.value)}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          readOnly={isReadOnly}
          role="spinbutton"
          aria-valuemin={0}
          aria-valuemax={100000000000}
          aria-valuenow={value}
        />
      </div>
    </td>
  )
}

export interface CellProps extends TableBase.DataCellProps {
  onClick?(): void
}

export function Cell({ value, children, column, row, tableColumn, tableRow, onClick, ...restProps }: CellProps) {
  const isReadOnly = readOnlyColumns.includes(column.name)
  const color = _.get(columnColors, column.name)

  // Computed values may sometimes have way too many decimal digits
  // so we format them here in order to display something more reasonable
  const computedColumns = ['totalFatal']
  let formattedValue = value
  if (computedColumns.includes(column.name)) {
    formattedValue = d3format('.2')(parseFloat(value))
  }

  const editableClass = isReadOnly ? '' : 'table-cell-editable'
  return (
    <td className="dx-g-bs4-table-cell text-nowrap text-center" {...restProps} onClick={onClick}>
      <div style={{ backgroundColor: color }} className="w-100 h-100">
        <div className={`mx-auto align-center ${editableClass}`}>{children ?? formattedValue}</div>
      </div>
    </td>
  )
}

export interface SeverityTableRow {
  id: number
  ageGroup: string
  population?: number
  confirmed: number
  severe: number
  critical: number
  fatal: number
  totalFatal?: number
  isolated?: number
  errors?: {
    confirmed?: string
    severe?: string
    critical?: string
    fatal?: string
    isolated?: string
  }
}

export type SeverityTableColumn = Column

export interface SeverityTableProps {
  severity: SeverityTableRow[]
  setSeverity(severity: SeverityTableRow[]): void
  scenarioState: State
  scenarioDispatch(action: AnyAction): void
}

/**
 *
 * Editable table of severity
 *
 * Adopted from https://devexpress.github.io/devextreme-reactive/react/grid/docs/guides/editing#inline-cell-editing
 */
function SeverityTable({ severity, setSeverity, scenarioState, scenarioDispatch }: SeverityTableProps) {
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

    const ageDistribution: OneCountryAgeDistribution = { ...scenarioState.ageDistribution }
    changedRows.forEach((row) => {
      if (row.population) {
        ageDistribution[row.ageGroup] = parseInt(`${row.population}`, 10)
      }
    })

    scenarioDispatch(setAgeDistributionData({ data: ageDistribution }))
    setSeverity(updateSeverityTable(changedRows))
  }

  const severityWithAgeDistribution = severity.map((ageRow) => {
    return { ...ageRow, population: scenarioState.ageDistribution[ageRow.ageGroup] }
  })

  return (
    <>
      <Row noGutters>
        <Col>
          <Grid rows={severityWithAgeDistribution} columns={columns} getRowId={getRowId}>
            <EditingState onCommitChanges={commitChanges} />

            <Table cellComponent={Cell} />

            <TableInlineCellEditing startEditAction={'click'} selectTextOnEditStart cellComponent={EditableCell} />

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
                <div key={`row-${id}-${column}`} className="text-danger">
                  {`Error in row "${ageGroup}", column "${column}": ${message}`}
                </div>
              )
            })
          })}
        </Col>
      </Row>
    </>
  )
}

export { SeverityTable }
