import { useEffect } from "react";
import useTimeout from "../2-useTimeout/useTimeout";

export const useDebounce = (callback, delay, dependencies) => {
  const { reset, clear } = useTimeout(callback, delay)
  useEffect(reset, [...dependencies, reset])
  useEffect(clear, [])
};

export default useDebounce;
