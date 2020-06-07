import React, { useState, useEffect } from 'react'

import { pick, isEqual } from 'lodash'

import i18next from 'i18next'

import * as yup from 'yup'
import { format as d3format } from 'd3-format'

import {
  Column,
  ChangeSet,
  EditingState,
  EditingColumnExtension,
  Row as TableRow,
  DataTypeProvider,
  DataTypeProviderProps,
} from '@devexpress/dx-react-grid'

import { Grid, Table, TableHeaderRow, TableInlineCellEditing } from '@devexpress/dx-react-grid-bootstrap4'

import type { AgeDistributionDatum, AgeGroup, SeverityDistributionDatum } from '../../../algorithms/types/Param.types'

const AgeGroupParameters = (props: Omit<DataMarshalProps, 'view'>) => <DataMarshal view={View} {...props} />
export default AgeGroupParameters

export interface DataMarshalProps {
  severity: SeverityDistributionDatum[]
  setSeverity: (severity: SeverityDistributionDatum[]) => void
  ageDistribution: AgeDistributionDatum[]
  setAgeDistribution: (ageDistribution: AgeDistributionDatum[]) => void
  view: React.ComponentType<ViewProps>
}

/**
 *
 * Map data from provided types to an internal form suitable for the grid.
 */

export const DataMarshal = ({
  severity,
  setSeverity,
  ageDistribution,
  setAgeDistribution,
  view: View,
}: DataMarshalProps) => {
  function propagateChange(ageGroupParameters: AgeGroupRow[]) {
    const updatedSeverity: SeverityDistributionDatum[] = ageGroupParameters.map((row) => {
      return pick(row, ['ageGroup', 'confirmed', 'critical', 'fatal', 'isolated', 'severe'])
    })

    if (!isEqual(updatedSeverity, severity)) {
      setSeverity(updatedSeverity)
    }

    const updatedAgeDistribution: AgeDistributionDatum[] = ageGroupParameters.map(
      (row): AgeDistributionDatum => {
        return pick(row, ['ageGroup', 'population'])
      },
    )

    if (!isEqual(updatedAgeDistribution, ageDistribution)) {
      setAgeDistribution(updatedAgeDistribution)
    }
  }

  const ageGroupParameters = marshalData(severity, ageDistribution)

  return <View ageGroupParameters={ageGroupParameters} onChange={propagateChange} />
}

function marshalData(severity: SeverityDistributionDatum[], ageDistribution: AgeDistributionDatum[]) {
  return severity.map(
    (severityRow, i) =>
      ({ id: severityRow.ageGroup, ...severityRow, population: ageDistribution[i].population } as AgeGroupRow),
  )
}

export interface AgeGroupRow {
  id: string
  ageGroup: AgeGroup
  population: number
  confirmed: number
  severe: number
  critical: number
  fatal: number
  isolated: number
}

const columns: Column[] = [
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

export interface ViewProps {
  ageGroupParameters: AgeGroupRow[]
  onChange: (ageGroupParameters: AgeGroupRow[]) => void
}

export const View = ({ ageGroupParameters, onChange }: ViewProps) => {
  const [errors, setErrors] = useState<AgeGroupParameterError[]>([])

  useEffect(() => {
    const result = validateAndTransform(ageGroupParameters)
    setErrors(result.errors || [])
  }, [ageGroupParameters])

  const commitChanges = ({ added, changed, deleted }: ChangeSet) => {
    if (added || deleted) {
      console.warn('Adds or deletes are not supported')
    }
    if (!changed) {
      return
    }

    const changedParameters = ageGroupParameters.map((row) => (changed[row.id] ? { ...row, ...changed[row.id] } : row))
    const result = validateAndTransform(changedParameters)
    if (result.errors) {
      setErrors(result.errors)
    }
    if (result.values && !isEqual(result.values, ageGroupParameters)) {
      onChange(result.values)
    }
  }

  const parametersWithTotals = ageGroupParameters.map((row) => ({
    ...row,
    totalFatal: row.confirmed * row.severe * row.critical * row.fatal * 1e-6,
  }))

  return (
    <div className="age-group-parameters">
      <Grid rows={parametersWithTotals} columns={columns} getRowId={getRowId}>
        <EditingState onCommitChanges={commitChanges} columnExtensions={editingColumnExtensions} />
        <DecimalTypeProvider for={['totalFatal']} />
        <Table columnExtensions={columnExtensions} cellComponent={ValueCell} />
        <TableInlineCellEditing startEditAction={'click'} selectTextOnEditStart />
        <TableHeaderRow cellComponent={HeaderCell} />
      </Grid>
      {errors.map(({ ageGroup, columnName, message }) => (
        <div
          key={`${ageGroup}_${columnName}`}
          className="text-danger"
        >{`Error in row "${ageGroup}", column "${columnName}": ${message}`}</div>
      ))}
    </div>
  )
}

export interface AgeGroupParameterError {
  ageGroup: AgeGroup
  columnName: string
  message: string
}

export function validateAndTransform(
  ageGroupParameters: AgeGroupRow[],
): { values?: AgeGroupRow[]; errors?: AgeGroupParameterError[] } {
  const percentageSchema = yup
    .number()
    .required(i18next.t('Required'))
    .min(0, i18next.t('Percentage should be non-negative'))
    .max(100, i18next.t('Percentage cannot be greater than 100'))
    .typeError(i18next.t('Percentage should be a number'))

  const positiveIntegerSchema = yup
    .number()
    .required(i18next.t('Required'))
    .integer(i18next.t('This value should be an integer'))
    .min(0, i18next.t('This value should be non-negative'))
    .typeError(i18next.t('This value should be an integer'))

  const schema = yup.array().of(
    yup.object().shape({
      id: yup.string(),
      ageGroup: yup.string(),
      population: positiveIntegerSchema,
      confirmed: percentageSchema,
      severe: percentageSchema,
      critical: percentageSchema,
      fatal: percentageSchema,
      totalFatal: yup.number(),
      isolated: percentageSchema,
    }),
  )

  try {
    const result = schema.validateSync(ageGroupParameters, { abortEarly: false })
    return { values: result as AgeGroupRow[] }
  } catch (error) {
    const allErrors = error.inner && error.inner.length > 0 ? error.inner : [error]
    const errors = allErrors
      .map((error: yup.ValidationError) => {
        const match = /\[(\d+)]\.(\w+)/.exec(error.path)
        if (match) {
          return {
            ageGroup: ageGroupParameters[Number.parseInt(match[1], 10)].ageGroup,
            columnName: match[2],
            message: error.message,
          }
        }
        return false
      })
      .filter((error: AgeGroupParameterError) => !!error)
    return { errors, values: error.value }
  }
}

export function areAgeGroupParametersValid(
  severity: SeverityDistributionDatum[],
  ageDistribution: AgeDistributionDatum[],
): boolean {
  return !validateAndTransform(marshalData(severity, ageDistribution)).errors
}
