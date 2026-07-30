export type NestedStyle =
  | string
  | undefined
  | {
      [key: string]: string | NestedStyle
    }
