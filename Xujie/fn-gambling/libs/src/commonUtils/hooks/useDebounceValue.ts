import { useState } from 'react';
import useDeepEffect from './useDeepEffect';
import { DEFAULT_DEBOUNCE_DELAY } from '@libs/constant/functionParams';

export const useDebounceValue = <T>(
  value: T,
  delay: number = DEFAULT_DEBOUNCE_DELAY
): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useDeepEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounceValue;
