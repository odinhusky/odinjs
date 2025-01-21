import {
  EHeaderType,
  IConfig,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';

export const useHeaderBase = (props: Partial<IConfig>) => {
  const configStoreState = useHeaderStore((state) => state.config);

  const config =
    Object.keys(props).length > 0
      ? { type: EHeaderType.Main, ...props }
      : configStoreState;

  return {
    config,
  };
};
