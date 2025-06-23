import debounce from 'lodash/debounce';
import has from 'lodash/has';
import { ActionClickObjType } from './actionClickObjetType';
import { useCallback } from 'react';

export const handleAction = <
  K extends keyof PayLoadMap,
  PayLoadMap extends Record<K, PayLoadMap[K]>
>({
  actionName,
  payload,
  actionClickObj,
}: {
  actionName: K;
  payload?: PayLoadMap[K];
  actionClickObj: ActionClickObjType<PayLoadMap>;
}) => {
  if (!has(actionClickObj, actionName)) return;

  const action = actionClickObj[actionName];

  // 如果該 function 沒有參數的話就不給予 payload
  if (action.length > 0) {
    if (payload !== undefined) {
      action(payload as PayLoadMap[K]);
    } else {
      console.error(`Payload is required for action: ${String(actionName)}`);
    }
  } else {
    (action as () => void)();
  }
};

export const useDebounceAction = <
  T extends (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
) => {
  return delay === 0
    ? callback
    : useCallback(debounce(callback, delay), [callback, delay, ...deps]);
};

export default handleAction;
