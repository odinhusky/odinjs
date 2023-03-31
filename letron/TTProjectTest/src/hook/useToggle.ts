import { useState } from "react";

type ToggleState = boolean;
type ToggleAction = (v?: boolean) => void;
type UseToggle = (defaultValue: ToggleState) => [ToggleState, ToggleAction];

export const useToggle: UseToggle = (defaultValue) => {
  const [value, setValue] = useState<boolean>(defaultValue);

  const setOrToggle = (v) => {
    setValue(p => typeof v === 'boolean' ? v : !p);
  }

  return [value, setOrToggle];
};

export default useToggle;