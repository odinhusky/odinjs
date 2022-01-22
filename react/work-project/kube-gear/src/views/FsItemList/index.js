import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import cookies from 'js-cookie';

import BreadCrumbs from 'components/BreadCrumbs';
import ErrorMessageBar from 'components/ErrorMessageBar';

import IndexPage from './Pages/IndexPage';
import DetailPage from './Pages/DetailPage';

import GlobalContext from 'layouts/Main/GlobalContext';
import Context from './Context';
import Ordering from './Ordering';

import { getUserNfs, getUsersGlusterfs, getUsersXdfs } from 'utils/api'

const FsItemList = ({ location }) => {
  const { isXdfsEnabled } = useContext(GlobalContext);
  const [error, setError] = useState(null);
  const [ordering, setOrdering] = useState(new Ordering());
  const [isNFS, setIsNFS] = useState();
  const [fsList, setFsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pathTemp, setPathTemp] = useState(null); // 存目錄名稱 返回時跳到該檔案的頁數

  const getFsList = useCallback(async() => {
    setIsLoading(true);
    setFsList([]);
    try {
      const getData = isXdfsEnabled
        ? getUsersXdfs
        : isNFS ? getUserNfs : getUsersGlusterfs
      const nfsData = await getData(cookies.get('user'));
      setIsLoading(false);
      setFsList(nfsData);
    } catch (err) {
      toast.error(err?.data ? `${err.data?.message}` : `${err?.data.toString()}`)
    }
  }, [isNFS, isXdfsEnabled])

  useEffect(() => {
    if (isNFS !== undefined && isXdfsEnabled !== undefined) {
      getFsList()
    }
  }, [isNFS, isXdfsEnabled])

  useEffect(() => {
    setIsNFS(location.pathname.split('/')[1] === 'fs-item-list')
  }, [location])

  const context = { setError, ordering, setOrdering, isNFS, fsList, setFsList, isLoading, setIsLoading, getFsList, pathTemp, setPathTemp, isXdfsEnabled }
  return (
    <Context.Provider value={context}>
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', padding: '0 20px 20px', height: '100%', overflow: 'hidden' }}>
        <BreadCrumbs />
        { error ? <ErrorMessageBar /> : null }
        <Route
          exact
          path={
            isXdfsEnabled
              ? '/xdfs-item-list'
              : isNFS ? '/fs-item-list' : '/glusterfs-item-list'
          }
          render={matchProps => (
            <IndexPage {...matchProps} />
          )}
        />
        <Route
          path={
            isXdfsEnabled
              ? '/xdfs-item-list/:path'
              : isNFS ? '/fs-item-list/:path' : '/glusterfs-item-list/:path'
          }
          render={matchProps => (
            <DetailPage {...matchProps}/>
          )}
        />
      </div>
    </Context.Provider>
  );
};

FsItemList.propTypes = {
  location: PropTypes.object
}

export default FsItemList;
