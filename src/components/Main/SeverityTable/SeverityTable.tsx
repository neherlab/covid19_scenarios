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
import { FormikErrors, useField } from 'formik'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Grid, Table, TableHeaderRow, TableInlineCellEditing } from '@devexpress/dx-react-grid-bootstrap4'

import { numberFormatter } from 'src/helpers/numberFormat'

import { AgeGroup } from '../../../algorithms/types/Param.types'
import type {
  AgeDistributionDatum,
  SeverityDistributionDatum,
  ScenarioDatum,
} from '../../../algorithms/types/Param.types'

import {
  selectAgeDistributionData,
  selectScenarioData,
  selectSeverityDistributionData,
} from '../../../state/scenario/scenario.selectors'
import { State } from '../../../state/reducer'

export interface AgeGroupRow extends SeverityDistributionDatum, AgeDistributionDatum {
  id: string
}

export interface AgeGroupRowWithTotals extends AgeGroupRow {
  totalFatal: number
}

export function getColumns(t: TFunction): Column[] {
  return [
    /* eslint-disable i18next/no-literal-string */
    { name: 'ageGroup', title: t('Age group') },
    { name: 'population', title: t('Age distribution') },
    { name: 'confirmed', title: `${t('Confirmed')}\n% ${t('total')}` },
    { name: 'severe', title: `${t('Severe')}\n% ${t('of confirmed')}` },
    { name: 'palliative', title: `${t('Palliative')}\n% ${t('of severe')}` },
    { name: 'critical', title: `${t('Critical')}\n% ${t('of severe')}` },
    { name: 'fatal', title: `${t('Fatal')}\n% ${t('of critical')}` },
    { name: 'totalFatal', title: `${t('Fatal')}\n% ${t('of all infections')}` },
    { name: 'isolated', title: `${t('Isolated')}\n% ${t('total')}` },
    /* eslint-enable i18next/no-literal-string */
  ]
}

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
    // eslint-disable-next-line react/no-array-index-key
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
  <span>{numberFormatter(true, false)(Number.parseFloat(value))}</span>
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
  const [{ value }, { error }, { setValue }] = useField<AgeGroupRow[]>('severity') // eslint-disable-line i18next/no-literal-string
  const errorMessages = getErrorMessages(t, error as FormikErrors<(AgeGroupRow | string)[]>)

  const columns = getColumns(t)

  if (!value) {
    return null
  }

  const parametersWithTotals: AgeGroupRowWithTotals[] = value.map((row) => ({
    ...row,
    totalFatal: row.confirmed * row.severe * (row.palliative + row.critical * row.fatal * 1e-2) * 1e-4,
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
