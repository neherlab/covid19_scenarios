import React from 'react'

import _ from 'lodash'

import { Col, Row } from 'reactstrap'

import { ChangeSet, Column, EditingState, Row as TableRow, Table as TableBase } from '@devexpress/dx-react-grid'

import { Grid, Table, TableHeaderRow, TableInlineCellEditing } from '@devexpress/dx-react-grid-bootstrap4'

import { format as d3format } from 'd3-format'

import { updateSeverityTable } from './severityTableUpdate'

import './SeverityTable.scss'

const columns: SeverityTableColumn[] = [
  { name: 'ageGroup', title: 'Age group' },
  { name: 'confirmed', title: 'Confirmed\n% total' },
  { name: 'severe', title: 'Severe\n% of confirmed' },
  { name: 'critical', title: 'Critical\n% of severe' },
  { name: 'fatal', title: 'Fatal\n% of critical' },
  { name: 'totalFatal', title: 'Fatal\n% of all infections' },
  { name: 'isolated', title: 'Isolated \n% total' },
]

const getRowId = (row: TableRow) => row.id

export type HeaderCellProps = TableBase.DataCellProps

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
  const readOnlyColumns = ['ageGroup', 'totalFatal']

  if (readOnlyColumns.includes(column.name)) {
    return <Cell value={value} column={column} row={row} tableColumn={tableColumn} tableRow={tableRow} {...restProps} />
  }

  return (
    <td className="dx-g-bs4-table-cell text-nowrap text-right" {...restProps}>
      <input
        type="text"
        className="dx-g-bs4-table-cell w-100 align-right table-cell-input"
        // readOnly={!editingEnabled}
        value={value}
        onChange={e => onValueChange(e.target.value)}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
      />
    </td>
  )
}

export interface CellProps extends TableBase.DataCellProps {
  onClick?(): void
}

export function Cell({ value, children, column, row, tableColumn, tableRow, onClick, ...restProps }: CellProps) {
  const nonNumericColumns = ['ageGroup']
  const textRight = nonNumericColumns.includes(column.name) ? 'text-left' : 'text-right'

  // Computed values may sometimes have way too many decimal digits
  // so we format them here in order to display something more reasonable
  const computedColumns = ['totalFatal']
  let formattedValue = value
  if (computedColumns.includes(column.name)) {
    formattedValue = d3format('.2')(parseFloat(value))
  }

  return (
    <td className={`dx-g-bs4-table-cell text-nowrap ${textRight}`} {...restProps} onClick={onClick}>
      {children ?? formattedValue}
    </td>
  )
}

export interface SeverityTableRow {
  id: number
  ageGroup: string
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
}

/**
 *
 * Editable table of severity
 *
 * Adopted from https://devexpress.github.io/devextreme-reactive/react/grid/docs/guides/editing#inline-cell-editing
 */
function SeverityTable({ severity, setSeverity }: SeverityTableProps) {
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
      changedRows = severity.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row))
    }

    if (deleted) {
      const deletedSet = new Set(deleted)
      changedRows = severity.filter(row => !deletedSet.has(row.id))
    }

    setSeverity(updateSeverityTable(changedRows))
  }

  return (
    <>
      <Row noGutters>
        <Col>
          <Grid rows={severity} columns={columns} getRowId={getRowId}>
            <EditingState onCommitChanges={commitChanges} />

            <Table cellComponent={Cell} />

            <TableHeaderRow cellComponent={HeaderCell} />

            <TableInlineCellEditing startEditAction={'click'} selectTextOnEditStart cellComponent={EditableCell} />
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
