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

const getRowId = (row: Row) => row.id

export interface FocusableCellProps extends TableBase.DataCellProps {
  onClick?(): void
}

const FocusableCell = ({ onClick, ...restProps }: FocusableCellProps) => (
  <Table.Cell {...restProps} tabIndex={0} onFocus={onClick} />
)

export interface SeverityTableRow {
  id: number
  ageGroup: string
  mild: number
  hospitalized: number
  fatal: number
  confirmed: number
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

        <Table cellComponent={FocusableCell} />

        <TableHeaderRow />

        <TableInlineCellEditing
          startEditAction={'click'}
          selectTextOnEditStart
        />
      </Grid>
    </div>
  )
}

export default SeverityTable
