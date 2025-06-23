import './index.scss';
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { PwaBanners } from './components/PwaBanners';
import { PwaButtons } from './components/PwaButtons';
import { PwaInfo } from './components/PwaInfo';
import { PwaTitle } from './components/PwaTitle';
import sdkUtils from '@libs/mode2/utils/sdk';
import { useToastStore } from '@libs/mode2/zustand/components/toastStore';

export type IPwa = {
  tiem?: number;
  timeDown?: boolean;
  setTimeDown?: Dispatch<SetStateAction<boolean>>;
  success?: boolean;
  deferredPromptRef?: MutableRefObject<Event | null>;
  pwaInit?: boolean;
};

const NUMBER_TIME = 3;

export const PwaInstallGuidePage = () => {
  const [tiem, setTime] = useState(NUMBER_TIME);
  const [timeDown, setTimeDown] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pwaInit, setPwaInit] = useState(false);
  const deferredPromptRef = useRef<Event | null>(null);
  const isInstalledRef = useRef<boolean>(false);
  const showToast = useToastStore((state) => state.showToast);
  useEffect(() => {
    if (timeDown) {
      const timer = setInterval(() => {
        if (tiem > 0) {
          setTime(tiem - 1);
        } else if (tiem <= 0) {
          setTimeDown(false);
          setTime(NUMBER_TIME);
          setSuccess(isInstalledRef.current);
          if (isInstalledRef.current) {
            showToast(
              'Thank you for installing our app! Please open it from the desktop or from the application menu.'
            );
          }
          clearInterval(timer);
        }
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [tiem, timeDown]);

  const installPWA = (e: Event) => {
    e.preventDefault();
    deferredPromptRef.current = e;
  };
  const appInstall = (e: Event) => {
    isInstalledRef.current = true;
  };

  useEffect(() => {
    setPwaInit(sdkUtils.isPwaInstalled());
    window.addEventListener('beforeinstallprompt', installPWA);
    window.addEventListener('appinstalled', appInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', installPWA);
      window.removeEventListener('appinstalled', appInstall);
    };
  }, []);

  return (
    <div
      className={
        'h-[100vh] gap-[22px] bg-[#FFF] text-[#FFFFFF] pt-[45px] pb-[31px] px-5'
      }
    >
      <PwaTitle timeDown={timeDown} success={success} />
      <PwaInfo />
      <PwaButtons
        tiem={tiem}
        timeDown={timeDown}
        setTimeDown={setTimeDown}
        success={success}
        deferredPromptRef={deferredPromptRef}
        pwaInit={pwaInit}
      />
      <PwaBanners />
    </div>
  );
};

export default PwaInstallGuidePage;
