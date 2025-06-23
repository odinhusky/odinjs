import sdkUtils from '@libs/mode2/utils/sdk';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import dayjs from '@commonUtils/localizedDayjs';
import { useEffect, useRef } from 'react';
import { useDeepEffect } from '../hooks';
import { StayTrackerStore } from './stayTrackerStore';

export type StayType = 'page' | 'tab' | 'modal';

export interface PropsValue {
  // page需要
  path?: string | null | undefined;
  query?: string | null | undefined;
  state?: string | null | undefined;

  // tab需要
  page?: string;
  tab?: string;
}

interface TrackerInfo {
  id: string; // 唯一識別，如 route、tab
  props: PropsValue; // 上報的屬性
  eventName: StayType;
}

const msToTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
};

const padZero = (num: number) => {
  return num.toString().padStart(2, '0');
};

const getUserInfo = () => {
  const isLoggedIn = !!sdkUtils.getStorage(AppLocalStorageKey.TOKEN);
  const userId = useUserProfileStore.getState().id;
  return { isLoggedIn, userId };
};

export const usePageTracker = ({ id, props, eventName }: TrackerInfo) => {
  const enterTimeRef = useRef(Date.now());
  const lastInfoRef = useRef<{ id: string; props: PropsValue }>({
    id,
    props,
  });

  const report = (
    from: typeof lastInfoRef.current,
    to: typeof lastInfoRef.current | 'page_closed',
    duration: number
  ) => {
    const { isLoggedIn, userId } = getUserInfo();

    const eventProps = {
      from_id: from.id,
      from_props: from.props,
      to_id: to === 'page_closed' ? 'page_closed' : to.id,
      to_props: to === 'page_closed' ? {} : to.props,
      duration_ms: msToTime(duration),
      is_logged_in: isLoggedIn,
      user_id: userId,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      stay_type: eventName, // props.stay_type, // page | tab | modal
    };

    console.log(`[stayTracker] 📊 停留時間 ${eventName}:`, eventProps);

    // duration大於1s才做緩存與上報
    if (duration < 1000) {
      return;
    }

    StayTrackerStore.append({
      // eventName,
      record: eventProps,
    });

    // if ((window as any).sensors) {
    //   (window as any).sensors.track(eventName, eventProps);
    // }
  };

  useDeepEffect(() => {
    // console.log('[stayTracker] ⏱️ 上次', lastInfoRef.current);
    const now = Date.now();
    const last = lastInfoRef.current;

    if (last.id !== id) {
      report(last, { id, props }, now - enterTimeRef.current);
      enterTimeRef.current = now;
      lastInfoRef.current = { id, props };
    }
  }, [id, props, eventName]);

  useEffect(() => {
    const handleUnload = () => {
      const now = Date.now();
      report(lastInfoRef.current, 'page_closed', now - enterTimeRef.current);
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);
};
