import { VNode } from "vue"

export interface TableColumn {
  name: string
  required?: boolean
  label: string
  align?: "left" | "right" | "center"
  field: string
  width?: string
  sortable?: boolean
  searchLabel?: string
  searchable?: boolean
  inputType?: "text" | "number" | "date" | "select"
  options?: string[]
  dataType?: "string" | "decimal" | "date" | "switch" | "custom"
  renderData?: (row: any) => VNode
}

export interface SearchColumn {
  name: string
  required?: boolean
  label: string
  align?: "left" | "right" | "center"
  field: string
  searchable?: boolean
  inputType?: "text" | "number" | "date" | "select" | "range"
  options?: string[]
}

export interface SearchFormData {
  [key: string]: any
}

export interface DialogForm {
  key: string
  inputType?: "input" | "select" | "number" | "date" | "checkbox" | "custom"
  type:
    | "text"
    | "number"
    | "password"
    | "textarea"
    | "email"
    | "search"
    | "tel"
    | "file"
    | "url"
    | "time"
    | "date"
    | undefined
  value: any
  label: string
  options?: Array<any>
}

// types.d.ts or a similar type definitions file

export interface RouteMeta {
  breadcrumb?: Array<{
    i18nKey: any
    [x: string]: any
    name: string
    path?: string
  }>
}
