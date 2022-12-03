import { useState } from "react";

export const useToggle = (defaultValue) => {
  const [value, setValue] = useState(defaultValue);

  const toggleValue = (v) => {
    setValue(p => typeof v === 'boolean' ? v : !p);
  }

  return [value, toggleValue];
};

export default useToggle;