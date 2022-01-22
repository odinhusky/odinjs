import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Route } from 'react-router-dom';
import IndexPage from './Pages/IndexPage';
import Form from './Pages/TemplateForm';
import BreadCrumbs from 'components/BreadCrumbs';

import { getJobTemplate, getUserList, getCanReadJobTemplate, getCanUseVirtualGroups } from 'utils/api';
import GlobalContext from 'layouts/Main/GlobalContext';

import Context from './Context';
import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles';
import { SelectSkuResource, KeyValueListMui, PortList } from './Pages/styles';

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  ...SelectSkuResource(),
  ...KeyValueListMui(),
  ...PortList()
}))

const ManageTemplate = () => {
  const classes = useStyles();
  const { userInfo, isXdfsEnabled } = useContext(GlobalContext)
  const currentUserName = userInfo.username
  const [templateList, setTemplateList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userPrivileges, setUserPrivileges] = useState([]);
  const [vgInfos, setVgInfos] = useState({});

  const getData = useCallback(() => {
    const hasAdminPrivileges = userInfo.admin === 'true' ? true : false;
    setIsLoading(true);
    const getTemList = hasAdminPrivileges ? getJobTemplate() : getCanReadJobTemplate(userInfo.username);
    getTemList
      .then((template) => setTemplateList(template))
      .catch(err => toast.error(err.message ? err.data.message : err.message))
      .finally(() => setIsLoading(false))
  }, [userInfo])

  const getUser = useCallback(() => {
    getUserList()
      .then(jsonData => setUserList(jsonData.map(item => item.username)))
      .catch(err => toast.error(err.data ? err.data.message : err.toString()));
  });

  useEffect(() => {
    if (userInfo.privileges) {
      getData()
      setUserPrivileges(userInfo.privileges)
      const hasUserOrAdminPrivileges = userInfo.privileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER')
      if (hasUserOrAdminPrivileges) {
        getUser()
      }
    }
  }, [userInfo])

  useEffect(() => {
    getCanUseVirtualGroups(currentUserName)
      .then(vg => {
        setVgInfos(vg.reduce((res, info) => {
          res[info.name] = info;
          return res;
        }, {}))
      })
  }, [])

  const context = {
    classes,
    templateList,
    userList,
    userInfo,
    getData,
    isLoading,
    setIsLoading,
    userPrivileges,
    vgInfos,
    isXdfsEnabled
  }

  return (
    <Context.Provider value={context}>
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', padding: '0 20px 20px', height: '100%', overflow: 'hidden' }}>
        <BreadCrumbs />
        <Route
          exact
          path="/template-manage"
          render={matchProps => (
            <IndexPage {...matchProps} />
          )}
        />
        <Route
          path="/template-manage/form"
          render={matchProps => (
            <Form {...matchProps}/>
          )}
        />
      </div>
    </Context.Provider>
  );
};

export default ManageTemplate;
