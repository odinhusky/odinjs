import React, {
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react';

// # API
import {
  getNfsDiskHostList,
  getNfsList as fetchNfsList, // name conflict
  getNfsDiskList as fetchNfsDiskList, // name conflict
  getNfsInfo,
  getNfsDiskInfo
} from 'utils/api';

// ? context
import NFSDiskListContext from './NFSDiskListContext';

// ? Self-packed Components || Functions
import { IndexPage, DetailPage } from './Pages';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import nfsDiskListStyles from './nfsDiskListStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    ...nfsDiskListStyles(theme)
  }});

// ^ Plugins
import { Route } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/NFSDiskList Route
 * @component NFSDiskList Route
 * @description NFSDiskList Route page
*/
const NFSDiskList = () => {

  // $ init data
  const nfsListTaskQueueRef = useRef([]);
  const isLoadingNfsDiskInfoRef = useRef(false);
  const isLoadingNfsInfoRef = useRef(false);

  // = styles
  const classes = useStyles();

  // # states
  const [hostList, setHostList] = useState([]);
  const [nfsDiskList, setNfsDiskList] = useState([]);
  const [nfsList, setNfsList] = useState([]);
  const [nfsDisk, setNfsDisk] = useState({});
  const [nfs, setNfs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);

  // - methods
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

  // * hooks
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

  // & handled data
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
    isLoadingInfo,
    classes
  };

  return (
    <NFSDiskListContext.Provider value={context}>
      <div
        className={`
        ${classes.d_flex}
        ${classes.directionColumn}
        ${classes.pos_rel}
        ${classes.p_20}
        ${classes.pt_0}
        ${classes.h_full}
        ${classes.overflowHidden}
      `}
      >
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
    </NFSDiskListContext.Provider>
  );
};

export default NFSDiskList;
