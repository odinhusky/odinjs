import { useState, useEffect, useMemo, useCallback } from "react";

function getSavedValue(key, initialValue) {
  const savedValue = Json.parse(localStorage.getItem(key));

  if(savedValue) return savedValue;
  if(initialValue instanceof Function) return initialValue();
  return initialValue;
}

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => getSavedValue(key, initialValue));

  const valueMemo = useMemo(() => value, [value]);

  const removeValue = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  useEffect(() => {
    localStorage.setItem('key', JSON.stringify(value));
  }, [valueMemo])

  return [value, setValue, removeValue];
};

export default useLocalStorage;