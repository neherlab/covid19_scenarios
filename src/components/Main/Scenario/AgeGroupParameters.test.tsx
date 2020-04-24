import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import '../../../i18n'

import {
  DataMarshal,
  DataMarshalProps,
  ViewProps,
  View,
  AgeGroupRow,
  validateAndTransform,
  AgeGroupParameterError,
  areAgeGroupParametersValid,
} from './AgeGroupParameters'
import { Convert } from '../../../.generated/types'
import { Severity, AgeDistribution } from '../../../algorithms/types/Param.types'
import rawSeverityData from '../../../assets/data/severityDistributions.json'
import rawCountryAgeDistribution from '../../../assets/data/ageDistribution.json'

const severityData = Convert.toSeverity(JSON.stringify(rawSeverityData))
const { ageDistribution } = Convert.toCountryAgeDistribution(JSON.stringify(rawCountryAgeDistribution))[0]

const ThisTest = (props: Pick<DataMarshalProps, 'view'> & Partial<DataMarshalProps>) => (
  <DataMarshal
    severity={severityData}
    setSeverity={jest.fn()}
    ageDistribution={ageDistribution}
    setAgeDistribution={jest.fn()}
    {...props}
  />
)

interface InnerButtonTestProps extends ViewProps {
  testChange: (ageGroupParameters: AgeGroupRow[]) => AgeGroupRow[]
}

const InnerButtonTest = ({ testChange, ageGroupParameters, onChange }: InnerButtonTestProps) => (
  <button
    onClick={() => {
      onChange(testChange(ageGroupParameters))
    }}
    type="button"
  >
    Click to test
  </button>
)

type TestChangeFn = (ageGroupParameters: AgeGroupRow[]) => AgeGroupRow[]

function doChangePropagationTest(
  testChange: TestChangeFn,
): { setSeverity: (severity: Severity[]) => void; setAgeDistribution: (ageDistribution: AgeDistribution) => void } {
  const WrappedTest = (props: ViewProps) => <InnerButtonTest testChange={testChange} {...props} />

  const setSeverity = jest.fn()
  const setAgeDistribution = jest.fn()
  const { getByText } = render(
    <ThisTest setSeverity={setSeverity} setAgeDistribution={setAgeDistribution} view={WrappedTest} />,
  )
  fireEvent.click(getByText('Click to test'))

  return { setSeverity, setAgeDistribution }
}

describe('AgeGroupParameters.DataMarshal', () => {
  it('wraps the severity table', () => {
    const WrappedTest = ({ ageGroupParameters }: ViewProps) => <span>{ageGroupParameters[0].ageGroup}</span>

    const { getByText } = render(<ThisTest view={WrappedTest} />)

    expect(getByText(severityData[0].ageGroup)).not.toBeNull()
  })

  it('wraps the age distribution', () => {
    const WrappedTest = ({ ageGroupParameters }: ViewProps) => <span>{ageGroupParameters[0].population}</span>

    const { getByText } = render(<ThisTest view={WrappedTest} />)

    expect(getByText(`${ageDistribution[severityData[0].ageGroup]}`)).not.toBeNull()
  })

  it('propagates severity update', () => {
    const { setSeverity, setAgeDistribution } = doChangePropagationTest((ageGroupParameters) => {
      const thisChange = [...ageGroupParameters]
      thisChange[0] = { ...thisChange[0], severe: 99 }
      return thisChange
    })

    const expectedChange = [...severityData]
    expectedChange[0] = { ...expectedChange[0], severe: 99 }

    expect(setSeverity).toHaveBeenCalledWith(expectedChange)
    expect(setAgeDistribution).not.toHaveBeenCalled()
  })

  it('propagates ageDistribution update', () => {
    const { setSeverity, setAgeDistribution } = doChangePropagationTest((ageGroupParameters) => {
      const thisChange = [...ageGroupParameters]
      thisChange[0] = { ...thisChange[0], population: 99 }
      return thisChange
    })

    const expectedChange = { ...ageDistribution }
    expectedChange[severityData[0].ageGroup] = 99

    expect(setAgeDistribution).toHaveBeenCalledWith(expectedChange)
    expect(setSeverity).not.toHaveBeenCalled()
  })

  it('propagates both', () => {
    const { setSeverity, setAgeDistribution } = doChangePropagationTest((ageGroupParameters) => {
      const thisChange = [...ageGroupParameters]
      thisChange[0] = { ...thisChange[0], population: 99 }
      thisChange[1] = { ...thisChange[1], confirmed: 88 }
      return thisChange
    })

    const expectedChange1 = { ...ageDistribution }
    expectedChange1[severityData[0].ageGroup] = 99
    const expectedChange2 = [...severityData]
    expectedChange2[1] = { ...expectedChange2[1], confirmed: 88 }

    expect(setAgeDistribution).toHaveBeenCalledWith(expectedChange1)
    expect(setSeverity).toHaveBeenCalledWith(expectedChange2)
  })
})

const ErrorTest = ({ ageGroupParameters }: ViewProps) => {
  const result = validateAndTransform(ageGroupParameters)
  return (
    <>
      {result.errors &&
        result.errors.map((error: AgeGroupParameterError) => (
          <span key={error.ageGroup + error.columnName}>
            {error.ageGroup}/{error.columnName}/{error.message}
          </span>
        ))}
    </>
  )
}

describe('AgeGroupParameters.Schema', () => {
  it('can be error free', () => {
    expect(areAgeGroupParametersValid(severityData, ageDistribution)).toBeTrue()
  })

  describe('Severity errors', () => {
    const testPlans = [
      // Each severity field and schema failure type
      ['confirmed', -1, 'Percentage should be non-negative'],
      ['severe', 101, 'Percentage cannot be greater than 100'],
      ['critical', undefined, 'Required'],
      ['fatal', 'not a number', 'Percentage should be a number'],
      ['isolated', undefined, 'Required'],
    ]

    testPlans.forEach((testPlan) => {
      const [columnName, value, errorMessage] = [...testPlan]

      it(`finds and flags errors - ${columnName} - ${value}`, () => {
        const thisChange = [...severityData]
        thisChange[0] = { ...thisChange[0] }
        thisChange[0][columnName as keyof Severity] = value as never

        const { getByText } = render(<ThisTest severity={thisChange} view={ErrorTest} />)

        expect(getByText(`${severityData[0].ageGroup}/${columnName}/${errorMessage}`)).not.toBeNull()
        expect(areAgeGroupParametersValid(thisChange, ageDistribution)).toBeFalse()
      })
    })

    it(`finds and flags all errors`, () => {
      const thisChange = [...severityData]
      thisChange[0] = { ...thisChange[0] }
      testPlans.forEach((testPlan) => {
        const [columnName, value] = [...testPlan]
        thisChange[0][columnName as keyof Severity] = value as never
      })

      const { getByText } = render(<ThisTest severity={thisChange} view={ErrorTest} />)

      testPlans.forEach((testPlan) => {
        const [columnName, , errorMessage] = [...testPlan]
        expect(getByText(`${severityData[0].ageGroup}/${columnName}/${errorMessage}`)).not.toBeNull()
      })
      expect(areAgeGroupParametersValid(thisChange, ageDistribution)).toBeFalse()
    })
  })

  describe('Age distribution errors', () => {
    const testPlans = [
      [-1, 'This value should be non-negative'],
      [undefined, 'Required'],
      ['not a number', 'This value should be an integer'],
    ]

    testPlans.forEach((testPlan) => {
      const [value, errorMessage] = [...testPlan]

      it(`finds and flags an error - ${value}`, () => {
        const thisChange = { ...ageDistribution }
        thisChange[severityData[0].ageGroup] = value as never

        const { getByText } = render(<ThisTest ageDistribution={thisChange} view={ErrorTest} />)

        expect(getByText(`${severityData[0].ageGroup}/population/${errorMessage}`)).not.toBeNull()
        expect(areAgeGroupParametersValid(severityData, thisChange)).toBeFalse()
      })
    })
  })
})

describe('AgeGroupParameters.View', () => {
  it('displays the severity table', () => {
    const { getByText } = render(<ThisTest view={View} />)

    expect(getByText(`${severityData[0].severe}`)).not.toBeNull()
    expect(getByText(`${ageDistribution[severityData[0].ageGroup]}`)).not.toBeNull()
  })

  it('displays an error for an invalid value', () => {
    const severityWithError = [...severityData]
    severityWithError[0] = { ...severityWithError[0], confirmed: -1 }
    const { getByText } = render(<ThisTest severity={severityWithError} view={View} />)

    expect(
      getByText(`Error in row "${severityData[0].ageGroup}", column "confirmed": Percentage should be non-negative`),
    ).not.toBeNull()
  })
})
