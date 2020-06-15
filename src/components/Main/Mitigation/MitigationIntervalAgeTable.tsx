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

import './MitigationIntervalAgeTable.scss'

export interface AgeSpecificMitigationDatum {
  ageGroup: AgeGroup
  enabled: boolean
  transmissionReduction: { begin: number; end: number }
}

export interface AgeSpecificMitigationRow extends AgeSpecificMitigationDatum {
  id: string
}

const columns: Column[] = [
  { name: 'ageGroup', title: i18n.t('Age group') },
  { name: 'enabled', title: i18n.t('Enabled') },
  {
    name: 'transmissionReductionBegin',
    title: i18n.t('Strength from'),
    getCellValue: (row: AgeSpecificMitigationRow) => row.transmissionReduction.begin,
  },
  {
    name: 'transmissionReductionEnd',
    title: i18n.t('Strength to'),
    getCellValue: (row: AgeSpecificMitigationRow) => row.transmissionReduction.end,
  },
]

const columnExtensions: Table.ColumnExtension[] = [
  { columnName: 'ageGroup', align: 'center' },
  { columnName: 'enabled', align: 'center' },
  { columnName: 'strengthFrom', align: 'center' },
  { columnName: 'strengthTo', align: 'center' },
]

const editingColumnExtensions: EditingColumnExtension[] = [
  { columnName: 'ageGroup', editingEnabled: false }, // prettier-ignore
]

const getRowId = (row: AgeSpecificMitigationRow) => row.id

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

export function getErrorMessages(t: TFunction, errors?: FormikErrors<AgeSpecificMitigationRow[]>): string[] {
  if (!errors) {
    return []
  }

  return Object.entries(errors).reduce((result, [i, err]) => {
    const rowNum = Number.parseInt(i, 10)
    const ageGroup = Object.values(AgeGroup)[rowNum]

    if (err) {
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

export const MitigationIntervalAgeTable = connect(mapStateToProps, mapDispatchToProps)(SeverityTableDisconnected)

function SeverityTableDisconnected({
  scenarioData,
  ageDistributionData,
  severityDistributionData,
}: SeverityTableProps) {
  const { t } = useTranslation()
  const [{ value }, { error }, { setValue }] = useField<AgeSpecificMitigationRow[]>('severity')
  const errorMessages = getErrorMessages(t, error)

  if (!value) {
    return null
  }

  const commitChanges = ({ changed }: ChangeSet) => {
    if (!changed) {
      return
    }

    const newValue = value.map((row) => {
      const changedRow = changed[row.id] as AgeSpecificMitigationRow
      return changedRow ? { ...row, ...changedRow } : row
    })

    setValue(newValue)
  }

  return (
    <div className="age-group-parameters">
      <Grid rows={value} columns={columns} getRowId={getRowId}>
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
