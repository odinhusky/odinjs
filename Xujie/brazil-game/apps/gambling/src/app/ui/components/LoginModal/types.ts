import { ButtonHTMLAttributes, ReactNode } from "react"

export type IValidateFn = (value: any, values?: any) => Error | undefined

export type InputValue<T> = {
  data: T
  isValidation?: boolean
  errorMessage?: string
}
export interface ILoginFormValues {
  phone: string
  password: string
}
export interface IRegisterFormValues {
  phone: string
  password: string
  captcha: string
}
export interface IForgetPwdFormValues {
  phone: string
  password: string
  verifyCode: string
}
export type IStatusType = "login" | "register" | "forget"
export interface ILoginModeProps {
  service: {
    login: (values: ILoginFormValues) => Promise<void>
    register: (values: {
      phone: string
      password: string
      captcha: {
        key: string
        code: string
      }
    }) => Promise<void>
    forgetPassword: (values: IForgetPwdFormValues) => Promise<void>
  }
  validator: {
    password: IValidateFn
    confirmPhone: IValidateFn
    captcha: IValidateFn
    phone: IValidateFn
    verifyCode: IValidateFn
  }
  onClose: () => void
  className?: string
  defaultStatusType?: IStatusType
}

export type IConfirmFail = (errors: Error[]) => void

export type IButtonRender = (
  props: ButtonHTMLAttributes<HTMLButtonElement> & { key?: string }
) => JSX.Element

export type IAnimateName = 'showLogin' | 'showRegister' | 'showForget' | 'clickAgreement' | 'clickForget'
export type IAnimateRecord = {
  [key in IAnimateName]?: string;
};
export type IRunAnimateFn = (name: IAnimateName, callback?: () => void) => void
