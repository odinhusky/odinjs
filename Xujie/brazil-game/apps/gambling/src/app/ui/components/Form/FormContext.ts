import { createContext } from 'react';

export interface colType {
    span?: number;
}
export type IValues = Record<string, any>
export type IErrors = Record<string, Error | undefined>
export type IValidateFun = (value: any, values?: IValues) => Error | undefined
export interface FormContextProps {
    onValueChange?: (key: string, value: any) => void;
    values?: IValues
    setValues?: (values: Record<string, any>) => void;
    errors?: IErrors,
    setErrors?: (errors: IErrors) => void
    validateRegister?: (name: string, cb?: IValidateFun) => void;
    focusName?: string,
    setFocusName?: (name: string) => void,
    onKeyDownInput?: (name: string, event: any) => void
}

export default createContext<FormContextProps>({

})