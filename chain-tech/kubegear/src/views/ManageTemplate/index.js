import React, {
  useState,
  useEffect,
  useCallback,
  useContext
} from 'react';

// # API
import {
  getJobTemplate,
  getUserList,
  getCanReadJobTemplate,
  getCanUseVirtualGroups
} from 'utils/api';

// ? context
import Context from './Context';
import GlobalContext from 'layouts/Main/GlobalContext';

// ? Self-packed Components || Functions
import IndexPage from './Pages/IndexPage';
import Form from './Pages/TemplateForm';
import BreadCrumbs from 'components/BreadCrumbs';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles';
import {
  SelectSkuResource,
  KeyValueListMui,
  PortList,
  manageTemplateStyles
} from './Pages/styles';

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  ...SelectSkuResource(theme),
  ...KeyValueListMui(theme),
  ...PortList(theme),
  ...manageTemplateStyles(theme)
}))

// ^ Plugin
import { toast } from 'react-toastify';
import { Route } from 'react-router-dom';

/**
 * @author odin
 * @level views/ManageTemplate
 * @component ManageTemplate
 * @description ManageTemplate component
*/
const ManageTemplate = () => {

  // $ init data

  // ? context
  const { userInfo, selfLimitResourceObj } = useContext(GlobalContext)
  const currentUserName = userInfo.username;

  // = styles
  const classes = useStyles();

  // # states
  const [templateList, setTemplateList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userPrivileges, setUserPrivileges] = useState([]);
  const [vgInfos, setVgInfos] = useState({});

  // - methods
  /**
   * @author odin
   * @description 根據是否為 admin 的 privileges 來選擇要打什麼樣的 API，取得模板資訊
   * admin可以看到所有的模板資訊，而非 admin 則只能看到自己的
  */
  const getData = useCallback(() => {
    const hasAdminPrivileges = userInfo.admin === 'true' ? true : false;
    setIsLoading(true);
    const getTemList = hasAdminPrivileges ? getJobTemplate() : getCanReadJobTemplate(userInfo.username);
    getTemList
      .then((template) => setTemplateList(template))
      .catch(err => toast.error(err.message ? err.data.message : err.message))
      .finally(() => setIsLoading(false))
  }, [userInfo])

  /**
   * @author odin
   * @description 取得使用者列表
  */
  const getUser = useCallback(() => {
    getUserList()
      .then(jsonData => setUserList(jsonData.map(item => item.username)))
      .catch(err => toast.error(err.data ? err.data.message : err.toString()));
  });

  // * hooks
  /**
   * @author odin
   * @description 根據是否有 userInfo.privileges 進行資料的設定
  */
  useEffect(() => {
    if (userInfo.privileges) {
      // 取得模板資訊
      getData();

      // 取得使用者列表
      const hasUserOrAdminPrivileges = userInfo.privileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER');
      if (hasUserOrAdminPrivileges) getUser();

      // 設定 Privileges
      setUserPrivileges(userInfo.privileges);
    }
  }, [userInfo]);

  /**
   * @author odin
   * @description 取得集群資訊(vgInfo)
  */
  useEffect(() => {
    getCanUseVirtualGroups(currentUserName)
      .then(vg => {
        setVgInfos(vg.reduce((res, info) => {
          res[info.name] = info;
          return res;
        }, {}))
      })
  }, [])

  // & handled data
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
    selfLimitResourceObj
  }

  return (
    <Context.Provider value={context}>
      <div
        className={`
          ${classes.d_flex}
          ${classes.directionColumn}
          ${classes.p_20}
          ${classes.pt_0}
          ${classes.pos_rel}
          ${classes.h_full}
          ${classes.overflowHidden}
        `}
      >
        <BreadCrumbs />

        <Route
          exact
          path="/template-manage"
          render={matchProps => (
            <IndexPage {...matchProps} />
          )}
        />

        <Route
          path="/template-manage/template-add"
          render={matchProps => (
            <Form {...matchProps}/>
          )}
        />

        <Route
          path="/template-manage/template-edit"
          render={matchProps => (
            <Form {...matchProps}/>
          )}
        />
      </div>
    </Context.Provider>
  );
};

export default ManageTemplate;
