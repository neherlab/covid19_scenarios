declare module 'formik' {
  import type { FieldHookConfig } from 'formik/dist/Field'
  import type { FormikErrors, FieldHelperProps, FieldInputProps } from 'formik/dist/types'

  export * from 'formik/dist/index'

  export interface FieldMetaProps<Value> {
    /** Value of the field */
    value: Value
    /** Error message of the field */
    error?: FormikErrors<Value>
    /** Has the field been visited? */
    touched: boolean
    /** Initial value of the field */
    initialValue?: Value
    /** Initial touched state of the field */
    initialTouched: boolean
    /** Initial error message of the field */
    initialError?: string
  }

  export declare function useField<Val = any>(
    propsOrFieldName: string | FieldHookConfig<Val>,
  ): [FieldInputProps<Val>, FieldMetaProps<Val>, FieldHelperProps<Val>]
}
