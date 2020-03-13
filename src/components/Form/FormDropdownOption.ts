export interface FormDropdownOption<ValueType extends string | number> {
  value: ValueType
  label: string
}

export function stringToOption(value: string): FormDropdownOption<string> {
  return { value, label: value }
}

export function stringsToOptions(values: string[]): FormDropdownOption<string>[] {
  return values.map(stringToOption)
}
