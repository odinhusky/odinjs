import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Route } from 'react-router-dom';
import { IndexPage, DetailPage } from './Pages'
import Context from './Context';

import {
  getNfsDiskHostList,
  getNfsList as fetchNfsList, // name conflict
  getNfsDiskList as fetchNfsDiskList, // name conflict
  getNfsInfo,
  getNfsDiskInfo
} from 'utils/api';
import { toast } from 'react-toastify';

const NFSDiskList = () => {
  const [hostList, setHostList] = useState([]);
  const [nfsDiskList, setNfsDiskList] = useState([]);
  const [nfsList, setNfsList] = useState([]);
  const [nfsDisk, setNfsDisk] = useState({});
  const [nfs, setNfs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);

  const nfsListTaskQueueRef = useRef([]);
  const isLoadingNfsDiskInfoRef = useRef(false);
  const isLoadingNfsInfoRef = useRef(false);

  const getHostList = useCallback(() => {
    getNfsDiskHostList()
      .then(data => {
        setHostList(data);
      })
      .catch(err => {
        const msg = err.data ? err.data.message : err.message;
        toast.error(msg);
      });
  }, []);

  const getNfsDiskList = useCallback(() => {
    fetchNfsDiskList()
      .then(jsonData => {
        setNfsDiskList(jsonData);
      })
      .catch(err => {
        const msg = err.data ? err.data.message : err.message;
        toast.error(msg);
      });
  }, []);

  const getAndSetNfsDiskInfo = useCallback(
    (nfsDiskName, index) => {
      getNfsDiskInfo(nfsDiskName)
        .then(jsonData => {
          isLoadingNfsDiskInfoRef.current = false;
          nfsDiskList[
            index >= 0
              ? index
              : nfsDiskList.findIndex(
                nfsDisk => nfsDisk.name === nfsDiskName
              )
          ] = jsonData;
          setNfsDiskList([...nfsDiskList]);
          if (nfsDisk && nfsDisk.name === jsonData.name) {
            setNfsDisk(jsonData);
          }
        })
        .catch(err => {
          const msg = err.data ? err.data.message : err.message;
          toast.error(msg);
          isLoadingNfsDiskInfoRef.current = false;
        });
    },
    [nfsDiskList, nfsDisk]
  );

  const getAndSetNfsInfo = useCallback(
    (nfsName, index) => {
      setIsLoadingInfo(true);
      getNfsInfo(nfsName)
        .then(jsonData => {
          if (!jsonData.used) jsonData.used = 0
          isLoadingNfsInfoRef.current = false;
          index = index >= 0
            ? index
            : nfsList.findIndex(nfs => nfs.name === nfsName);

          if (index === -1) {
            nfsList.push(jsonData);
          } else {
            nfsList[index] = jsonData;
          }
          setNfsList([...nfsList]);
          setIsLoadingInfo(false);
        })
        .catch(err => {
          isLoadingNfsInfoRef.current = false;
          const msg = err.data ? err.data.message : err.message;
          toast.error(msg);
          nfsList[index] = { ...nfsList[index], used: 0  };
          setIsLoadingInfo(false);
        });
    },
    [nfsList]
  );

  const getIndexPageData = async() => {
    setIsLoading(true)
    await Promise.all([
      getHostList(),
      getNfsDiskList()
    ])
    setIsLoading(false)
  }

  useEffect(() => {
    getIndexPageData()
  }, []);

  // 執行nfsList相關function
  useEffect(() => {
    if (isLoadingNfsInfoRef.current) {
      return;
    }
    if (nfsListTaskQueueRef.current.length !== 0) {
      isLoadingNfsInfoRef.current = true;
      const task = nfsListTaskQueueRef.current.shift();
      task.func(...task.args);
    }
  }, );

  const getNfsList = useCallback(
    () => {
      if (!nfsDisk.name) {
        isLoadingNfsInfoRef.current = false;
        setNfsList([]);
        return;
      }
      setIsLoading(true)
      fetchNfsList()
        .then(jsonData => {
          isLoadingNfsInfoRef.current = false;
          setNfsList(
            jsonData.filter(nfs => nfs.nfsDisk === nfsDisk.name)
          );
          setIsLoading(false);
        })
        .catch(err => {
          isLoadingNfsInfoRef.current = false;
          const msg = err.data.message ? err.data.message : err.toString();
          toast.error(msg);
          setIsLoading(false);
        });
    },
    [nfsDisk.name]
  );

  useEffect(getNfsList, [nfsDisk.name]);

  const context = {
    hostList,
    nfsDiskList,
    setNfsDisk,
    nfsList,
    nfsDisk,
    getHostList,
    getNfsList,
    getAndSetNfsDiskInfo,
    getNfsDiskList,
    nfs,
    setNfs,
    getIndexPageData,
    getAndSetNfsInfo,
    setNfsList,
    nfsListTaskQueueRef,
    isLoadingNfsInfoRef,
    isLoading,
    isLoadingInfo
  };
  return (
    <Context.Provider value={context}>
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', padding: '0 20px 20px', height: '100%', overflow: 'hidden' }}>
        <Route
          exact
          path="/nfs-disk-list"
          render={matchProps => (
            <IndexPage {...matchProps} />
          )}
        />
        <Route
          path="/nfs-disk-list/:path"
          render={matchProps => (
            <DetailPage {...matchProps}/>
          )}
        />
      </div>
    </Context.Provider>
  );
};

export default NFSDiskList;
