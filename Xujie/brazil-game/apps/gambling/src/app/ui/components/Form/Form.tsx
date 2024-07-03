import {
  FormEvent,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import FormContext, { FormContextProps, IErrors, IValues } from "./FormContext"

export interface IFormRef {
  getFormValue: (field: string) => void
  setFormValues: (values: any) => void
  validateFormValue: (field: string) => Error | undefined
}
interface IFormProps<T> {
  defaultValues?: T
  children: ReactNode
  className?: string
  onValueChange?: (name: string, value: any) => void
  onConfirm?: (values: T) => void
  onConfirmFail?: (error: Error[]) => void
}
const useSetState = <T,>(defaultValue: T) => {
  const [value, setValue] = useState<T>(defaultValue)
  return [
    value,
    (value: T) =>
      setValue((pre) => {
        if (typeof pre === "object") {
          return { ...pre, ...value }
        }
        if (typeof pre === "function") {
          return pre(value)
        }
        return value
      }),
  ] as const
}
const Form = forwardRef<IFormRef, IFormProps<any>>(
  (
    {
      defaultValues,
      children,
      className,
      onValueChange,
      onConfirm,
      onConfirmFail,
    },
    ref
  ) => {
    const form: IFormRef = {
      getFormValue: (name) => values[name],
      setFormValues: (values) => {
        setValues(values)
      },
      validateFormValue: (name: string) => {
        const validate = validateMap.current.get(name)
        const error = validate?.(values[name], values)
        error && setErrors({ [name]: error })
        return error
      },
    }
    useImperativeHandle(ref, () => form)
    const [focusName, setFocusName] = useSetState("")

    const validateMap = useRef<
      Map<
        string,
        ((value: any, values?: IValues) => Error | undefined) | undefined
      >
    >(new Map())
    const formNames = useRef<string[]>([])
    const [values, setValues] = useSetState<IValues>(defaultValues || {})
    const [errors, setErrors] = useSetState<IErrors>({})
    const handlerSubmit = (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault()
      let errors: IErrors = {}
      const itr = validateMap.current.entries()
      for (let index = 0; index < validateMap.current.size; index++) {
        const [key, validate] = itr.next().value || []
        const error = validate?.(values[key], values)
        errors[key] = error
      }

      const errorList = Object.keys(errors)
        .map((key) => errors[key])
        .filter((msg) => !!msg) as Error[]

      if (errorList.length) {
        setErrors(errors)
        onConfirmFail?.(errorList)
      } else {
        onConfirm?.(values)
      }
    }

    const validateRegister: FormContextProps["validateRegister"] = (
      name,
      cb
    ) => {
      formNames.current.push(name)
      validateMap.current.set(name, cb)
    }
    useEffect(() => {
      if (focusName === "submit") {
        handlerSubmit()
      }
    }, [focusName])
    const handlerKeyDownInput: FormContextProps["onKeyDownInput"] = (
      name,
      event
    ) => {
      if (["Enter", "ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault()
        const preIdx = formNames.current.indexOf(focusName)
        switch (event.key) {
          case "Enter":
            setFocusName(formNames.current[preIdx + 1] || "submit")
            break
          case "ArrowUp":
            setFocusName(formNames.current[preIdx - 1] || focusName)
            break
          case "ArrowDown":
            setFocusName(formNames.current[preIdx + 1] || focusName)
            break
          default:
            break
        }
      }
    }

    return (
      <FormContext.Provider
        value={{
          values,
          setValues,
          validateRegister,
          errors,
          setErrors,
          focusName,
          setFocusName,
          onValueChange,
          onKeyDownInput: handlerKeyDownInput,
        }}
      >
        <form
          className={`mode-form ${className}`}
          onSubmit={handlerSubmit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              event.stopPropagation()
            }
          }}
        >
          {children}
        </form>
      </FormContext.Provider>
    )
  }
)

export default Form
