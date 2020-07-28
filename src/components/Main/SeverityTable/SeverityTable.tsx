import React from 'react'

import { omit } from 'lodash'

import {
  ChangeSet,
  Column,
  DataTypeProvider,
  DataTypeProviderProps,
  EditingColumnExtension,
  EditingState,
} from '@devexpress/dx-react-grid'

import type { TFunction } from 'i18next'
import { format as d3format } from 'd3-format'
import { FormikErrors, useField } from 'formik'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Grid, Table, TableHeaderRow, TableInlineCellEditing } from '@devexpress/dx-react-grid-bootstrap4'

import { AgeGroup } from '../../../algorithms/types/Param.types'
import type {
  AgeDistributionDatum,
  SeverityDistributionDatum,
  ScenarioDatum,
} from '../../../algorithms/types/Param.types'

import i18n from '../../../i18n/i18n'

import {
  selectAgeDistributionData,
  selectScenarioData,
  selectSeverityDistributionData,
} from '../../../state/scenario/scenario.selectors'
import { State } from '../../../state/reducer'

import './SeverityTable.scss'

export interface AgeGroupRow extends SeverityDistributionDatum, AgeDistributionDatum {
  id: string
}

export interface AgeGroupRowWithTotals extends AgeGroupRow {
  totalFatal: number
}

const columns: Column[] = [
  { name: 'ageGroup', title: i18n.t('Age group') },
  { name: 'population', title: i18n.t('Age distribution') },
  { name: 'confirmed', title: `${i18n.t('Confirmed')}\n% ${i18n.t('total')}` },
  { name: 'severe', title: `${i18n.t('Severe')}\n% ${i18n.t('of confirmed')}` },
  { name: 'palliative', title: `${i18n.t('Palliative')}\n% ${i18n.t('of severe')}` },
  { name: 'critical', title: `${i18n.t('Critical')}\n% ${i18n.t('of severe')}` },
  { name: 'fatal', title: `${i18n.t('Fatal')}\n% ${i18n.t('of critical')}` },
  { name: 'totalFatal', title: `${i18n.t('Fatal')}\n% ${i18n.t('of all infections')}` },
  { name: 'isolated', title: `${i18n.t('Isolated')}\n% ${i18n.t('total')}` },
]

const columnExtensions: Table.ColumnExtension[] = [
  { columnName: 'ageGroup', align: 'center' },
  { columnName: 'population', align: 'center' },
  { columnName: 'confirmed', align: 'center' },
  { columnName: 'severe', align: 'center' },
  { columnName: 'palliative', align: 'center' },
  { columnName: 'critical', align: 'center' },
  { columnName: 'fatal', align: 'center' },
  { columnName: 'totalFatal', align: 'center' },
  { columnName: 'isolated', align: 'center' },
]

const editingColumnExtensions: EditingColumnExtension[] = [
  { columnName: 'ageGroup', editingEnabled: false },
  { columnName: 'totalFatal', editingEnabled: false },
]

const getRowId = (row: AgeGroupRow) => row.id

type HeaderCellProps = Partial<Table.DataCellProps> & TableHeaderRow.CellProps

function HeaderCell({ column }: HeaderCellProps) {
  const { title } = column
  const content = title?.split('\n').map((line, i) => (
    <p key={`line ${i}: ${line}`} className={`text-center text-bold ${i !== 0 ? 'small' : ''}`}>
      {line}
    </p>
  ))

  return <td title={title}>{content}</td>
}
interface ValueCellProps extends Table.DataCellProps {
  onClick?: (e: MouseEvent) => void
}

const ValueCell = ({ onClick, column, ...props }: ValueCellProps) => {
  const editingColumnExtension = editingColumnExtensions.find(
    (editingExtension) => column.name === editingExtension.columnName,
  )
  const editable = !editingColumnExtension || editingColumnExtension.editingEnabled
  return <Table.Cell {...props} tabIndex={editable ? 0 : -1} onFocus={editable ? onClick : undefined} column={column} />
}

const DecimalFormatter = ({ value }: DataTypeProvider.ValueFormatterProps) => (
  <span>{d3format('.2')(Number.parseFloat(value))}</span>
)

const DecimalTypeProvider = (props: DataTypeProviderProps) => (
  <DataTypeProvider formatterComponent={DecimalFormatter} {...props} />
)

export function getErrorMessages(t: TFunction, errors?: FormikErrors<(AgeGroupRow | string)[]>): string[] {
  if (!errors) {
    return []
  }

  return Object.entries(errors).reduce((result, [i, err]) => {
    const rowNum = Number.parseInt(i, 10)
    const ageGroup = Object.values(AgeGroup)[rowNum]

    if (typeof err === 'string') {
      return [...result, t(`Error in row "{{ageGroup}}": {{message}}`, { ageGroup, message: err })]
    }
    if (typeof err === 'object') {
      const messages = Object.entries(err).map(([column, message]) =>
        t('Error in column "{{column}}", row "{{ageGroup}}": {{message}}', { column, ageGroup, message }),
      )
      return [...result, ...messages]
    }

    return result
  }, new Array<string>())
}

export interface SeverityTableProps {
  scenarioData: ScenarioDatum
  ageDistributionData: AgeDistributionDatum[]
  severityDistributionData: SeverityDistributionDatum[]
}

const mapStateToProps = (state: State) => ({
  scenarioData: selectScenarioData(state),
  ageDistributionData: selectAgeDistributionData(state),
  severityDistributionData: selectSeverityDistributionData(state),
})

const mapDispatchToProps = {}

export const SeverityTable = connect(mapStateToProps, mapDispatchToProps)(SeverityTableDisconnected)

function SeverityTableDisconnected({
  scenarioData,
  ageDistributionData,
  severityDistributionData,
}: SeverityTableProps) {
  const { t } = useTranslation()
  const [{ value }, { error }, { setValue }] = useField<AgeGroupRow[]>('severity')
  const errorMessages = getErrorMessages(t, error as FormikErrors<(AgeGroupRow | string)[]>)

  if (!value) {
    return null
  }

  const parametersWithTotals: AgeGroupRowWithTotals[] = value.map((row) => ({
    ...row,
    totalFatal: row.confirmed * row.severe * row.critical * row.fatal * 1e-6,
  }))

  const commitChanges = ({ changed }: ChangeSet) => {
    if (!changed) {
      return
    }

    const newValueWithTotals: AgeGroupRowWithTotals[] = parametersWithTotals.map((row) => {
      const changedRow = changed[row.id] as AgeGroupRowWithTotals
      return changedRow ? { ...row, ...changedRow } : row
    })
    const newValue = newValueWithTotals.map((row) => omit(row, ['totalFatal']))
    setValue(newValue)
  }

  return (
    <div className="age-group-parameters">
      <Grid rows={parametersWithTotals} columns={columns} getRowId={getRowId}>
        <EditingState onCommitChanges={commitChanges} columnExtensions={editingColumnExtensions} />
        <DecimalTypeProvider for={['totalFatal']} />
        <Table columnExtensions={columnExtensions} cellComponent={ValueCell} />
        <TableInlineCellEditing startEditAction={'click'} selectTextOnEditStart />
        <TableHeaderRow cellComponent={HeaderCell} />
      </Grid>
      {errorMessages.map((message) => (
        <div key={message} className="text-danger">
          {message}
        </div>
      ))}
    </div>
  )
}
