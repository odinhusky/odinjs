import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocationStore } from '@mode2/zustand/locationStore';

/**
 * 全局使用 {Location} 觀察者模式
 *
 */
export const useObserverLocation = () => {
  const location = useLocation();

  useEffect(() => {
    useLocationStore.getState().setLocation(location);
  }, [location]);
};
