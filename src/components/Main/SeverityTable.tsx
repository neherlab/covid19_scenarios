import React, { useState } from 'react'

import {
  ChangeSet,
  Column,
  EditingState,
  Row,
  Table as TableBase,
} from '@devexpress/dx-react-grid'

import {
  Grid,
  Table,
  TableHeaderRow,
  TableInlineCellEditing,
} from '@devexpress/dx-react-grid-bootstrap4'

import { format as d3format } from 'd3-format'

import './SeverityTable.scss'

const getRowId = (row: Row) => row.id

export interface HeaderCellProps extends TableBase.DataCellProps {}

export function HeaderCell({ column, ...restProps }: HeaderCellProps) {
  const { title } = column
  const content = title?.split('\n').map((line, i) => (
    <p
      key={`line ${i}: ${line}`}
      className={`p-0 m-0 text-center text-truncate ${i !== 0 ? 'small' : ''}`}
    >
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
    return (
      <Cell
        value={value}
        column={column}
        row={row}
        tableColumn={tableColumn}
        tableRow={tableRow}
        {...restProps}
      />
    )
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

export function Cell({
  value,
  children,
  column,
  row,
  tableColumn,
  tableRow,
  onClick,
  ...restProps
}: CellProps) {
  const nonNumericColumns = ['ageGroup']
  const textRight = nonNumericColumns.includes(column.name)
    ? 'text-left'
    : 'text-right'

  // Computed values may sometimes have way too many decimal digits
  // so we format them here in order to display something more reasonable
  const computedColumns = ['totalFatal']
  let formattedValue = value
  if (computedColumns.includes(column.name)) {
    formattedValue = d3format('.2')(parseFloat(value))
  }

  return (
    <td
      className={`dx-g-bs4-table-cell text-nowrap ${textRight}`}
      {...restProps}
      onClick={onClick}
    >
      {children ?? formattedValue}
    </td>
  )
}

export interface SeverityTableRow {
  id: number
  ageGroup: string
  confirmed: number
  severe: number
  fatal: number
  totalFatal?: number
}

export type SeverityTableColumn = Column

export interface SeverityTableProps {
  columns: SeverityTableColumn[]
  rows: SeverityTableRow[]
  setRows(rows: SeverityTableRow[]): void
}

/**
 *
 * Editable table of severity
 *
 * Adopted from https://devexpress.github.io/devextreme-reactive/react/grid/docs/guides/editing#inline-cell-editing
 */
function SeverityTable({ columns, rows, setRows }: SeverityTableProps) {
  const commitChanges = ({ added, changed, deleted }: ChangeSet) => {
    let changedRows: SeverityTableRow[] = []

    if (added) {
      const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0
      changedRows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ]
    }

    if (changed) {
      changedRows = rows.map(row =>
        changed[row.id] ? { ...row, ...changed[row.id] } : row,
      )
    }

    if (deleted) {
      const deletedSet = new Set(deleted)
      changedRows = rows.filter(row => !deletedSet.has(row.id))
    }

    setRows(changedRows)
  }

  return (
    <div className="card">
      <Grid rows={rows} columns={columns} getRowId={getRowId}>
        <EditingState onCommitChanges={commitChanges} />

        <Table cellComponent={Cell} />

        <TableHeaderRow cellComponent={HeaderCell} />

        <TableInlineCellEditing
          startEditAction={'click'}
          selectTextOnEditStart
          cellComponent={EditableCell}
        />
      </Grid>
    </div>
  )
}

export default SeverityTable
