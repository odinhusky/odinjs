import React, {
  useState,
  useEffect,
  useCallback
} from 'react';

// # API
import { getUserNfs, getUsersGlusterfs } from 'utils/api'

// ? context
// import GlobalContext from 'layouts/Main/GlobalContext';
import FsItemListContext from './FsItemListContext';

// ? Self-packed Components || Functions
import BreadCrumbs from 'components/BreadCrumbs';
import ErrorMessageBar from 'components/ErrorMessageBar';
import IndexPage from './Pages/IndexPage';
import DetailPage from './Pages/DetailPage';
import Ordering from './Ordering';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import fsItemListStyles from './fsItemListStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    ...fsItemListStyles(theme)
  }});


// ^ Plugins
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import cookies from 'js-cookie';

/**
 * @author odin
 * @level views/FsItemList Route
 * @component FsItemList Route
 * @description FsItemList Route page
*/
const FsItemList = ({ location }) => {

  // = styles
  const classes = useStyles();

  // # states
  const [error, setError] = useState(null);
  const [ordering, setOrdering] = useState(new Ordering());
  const [isNFS, setIsNFS] = useState();
  const [fsList, setFsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pathTemp, setPathTemp] = useState(null); // 存目錄名稱 返回時跳到該檔案的頁數

  // - methods
  const getFsList = useCallback(async() => {
    setIsLoading(true);
    setFsList([]);
    try {
      const getData = isNFS ? getUserNfs : getUsersGlusterfs
      const nfsData = await getData(cookies.get('user'));
      setIsLoading(false);
      setFsList(nfsData);
    } catch (err) {
      toast.error(err?.data ? `${err.data?.message}` : `${err?.data.toString()}`)
    }
  }, [isNFS]);

  // & handled data
  const context = {
    setError,
    ordering,
    setOrdering,
    isNFS,
    fsList,
    setFsList,
    isLoading,
    setIsLoading,
    getFsList,
    pathTemp,
    setPathTemp,
    classes
  };

  // * hooks
  useEffect(() => {
    if (isNFS !== undefined) {
      getFsList()
    }
  }, [isNFS])

  useEffect(() => {
    setIsNFS(location.pathname.split('/')[1] === 'fs-item-list')
  }, [location])

  return (
    <FsItemListContext.Provider value={context}>
      <div className={`${classes.routeContainer}`}>
        <BreadCrumbs />
        { error ? <ErrorMessageBar /> : null }
        <Route
          exact
          path={
            isNFS ? '/fs-item-list' : '/glusterfs-item-list'
          }
          render={matchProps => (
            <IndexPage {...matchProps} />
          )}
        />
        <Route
          path={
            isNFS ? '/fs-item-list/:path' : '/glusterfs-item-list/:path'
          }
          render={matchProps => (
            <DetailPage {...matchProps}/>
          )}
        />
      </div>
    </FsItemListContext.Provider>
  );
};

FsItemList.propTypes = {
  location: PropTypes.object
}

export default FsItemList;
