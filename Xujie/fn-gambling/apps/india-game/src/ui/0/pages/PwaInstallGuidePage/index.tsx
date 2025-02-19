import { Dispatch, MutableRefObject, SetStateAction } from 'react';

export type IPwa = {
  tiem?: number;
  timeDown?: boolean;
  setTimeDown?: Dispatch<SetStateAction<boolean>>;
  success?: boolean;
  deferredPromptRef?: MutableRefObject<Event | null>;
  pwaInit?: boolean;
};

const NUMBER_TIME = 3;

const PwaInstallGuidePage = () => {
  return null;
};

export default PwaInstallGuidePage;
