import { AppLocalStorageKey, AppLocalStorage } from '@/persistant/localStorage';
import { useEffect, useState } from 'react';

import { useLocation } from 'react-router';
import { fetchBatchCurrentH5Version } from '@commonUtils/fetchBatchCurrentH5Version';

/**
 * @description 路由守卫组件
 * */
export const AuthRouter = (props: { children: JSX.Element }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get(AppLocalStorageKey.TOKEN);
    token && AppLocalStorage.setStorage(AppLocalStorageKey.TOKEN, token);
    setLoading(false);
  }, []);

  useEffect(() => {
    const saveCurrentH5Version = async () => {
      const result = await fetchBatchCurrentH5Version();
      if (result.currentEtag) {
        AppLocalStorage.setStorage(
          AppLocalStorageKey.H5_LAST_ETAG,
          result.currentEtag
        );
      }
      if (result.lastModified) {
        AppLocalStorage.setStorage(
          AppLocalStorageKey.H5_LAST_MODIFIED,
          result.lastModified
        );
      }
    };
    saveCurrentH5Version();
  }, []);

  return loading ? <></> : props.children;
};
