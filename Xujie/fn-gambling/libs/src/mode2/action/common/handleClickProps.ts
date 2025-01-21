export interface HandleClickProps<T extends keyof PayLoadMap, PayLoadMap> {
  actionName: T;
  payload?: PayLoadMap[T];
}
