import { createContext, useContext } from "react";

/**
 * @author odin
 * @description 產生 Context
 * @returns {[useContext, ContextProvider]}
*/
export function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  function useCtx() {
    const c = useContext(ctx);
    if (c === undefined)
      throw new Error("useCtx must be inside a Provider with a value");
    return c;
  }
  return [useCtx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
};

/**
 * @author odin
 * @param {string} value - API 接到的最新價格，包含小數點的字串
 * @description 處理最新價格的規則
 * @returns {string}
*/
export function handleLastPrice (value: string | any) {
  let result : string | number = 0;
  const valueNum : number = parseFloat(value);

  if(valueNum < 10 && valueNum > 1) {
    result = value.slice(0, -3);
  } else if(valueNum < 10) {
    result = value.slice(0, -2);
  } else {
    result = value.slice(0, -4);
  }
  return result;
}