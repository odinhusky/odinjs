/* eslint-disable no-unused-vars */
import React, {
  useContext,
  useState,
  useEffect,
  useMemo
} from 'react';

// ^ Redux
import { getUserInfo } from 'layouts/Main/features/userinfo/userinfoSlice';

// # API
import { getUserAllLimitedVgResource } from 'utils/api'

// ? context
import GlobalContext from 'layouts/Main/GlobalContext';
import UserInfoContext from './UserInfoContext';

// ? Self-packed Components || Functions
import BreadCrumbs from 'components/BreadCrumbs';
import BaseVerticalTabs from 'components/BaseVerticalTabAndPanel/BaseVerticalTabs'
import BaseVerticalTabPanelContainer from 'components/BaseVerticalTabAndPanel/BaseVerticalTabPanelContainer'
import PersonalSettings from './components/PersonalSettings'
import PasswordSettings from './components/PasswordSettings'
import AvailableSource from './components/AvailableSource'
import MyGroup from './components/MyGroup'
import { proxyGetCanUseVgList } from 'common/commonMethods'

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import userInfoStyle from './userInfoStyle'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    ...userInfoStyle(theme)
  }});

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import cookies from 'js-cookie';

/**
 * @author odin
 * @level views/UserInfo
 * @component UserInfo
 * @description Contains account setting, group table, and organization modal
*/
const UserInfo = () => {

  // $ init data
  const { t } = useTranslation();
  const defaultUser = cookies.get('user');

  // % context
  const {
    dispatch,
    useSelector
  } = useContext(GlobalContext)

  // ^ Redux
  const userInfoRedux = useSelector(state => state.userinfo.data);
  const userInfo = useMemo(() => (userInfoRedux), [userInfoRedux]);

  // = styles
  const classes = useStyles();

  // # states
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [selfCanUseVgList, setSelfCanUseVgList] = useState([])

  // AvailableSource
  const [limitedVg, setLimitedVg] = useState({})

  const userInfoContext = {
    classes,
    selfCanUseVgList
  };

  // - methods
  /**
   * @author odin
   * @description Handle Change currentTabIndex
  */
  const handleTabsChange = (event, newValue) => {
    setCurrentTabIndex(newValue);
  };

  const getLimitedVg = async (username) => {
    try {
      const list = await getUserAllLimitedVgResource(username)

      if(list && !isEmpty(list)){
        // console.log('UserInfo getLimitedVg list', list);
        setLimitedVg(list);
      }

    } catch (err) {
      const msg = err?.data ? err?.data?.message : err?.toString();
      toast.error(msg);
    }
  }

  // & handled data
  const tabsArray = useMemo(() => {
    const defaultTabs = [
    // 個人設置
      {
        label: `${t('personal')}${t('enSpace')}${t('setting')}`
      },
      // 密碼設置
      {
        label: `${t('password')}${t('enSpace')}${t('setting')}`
      },
      // 可用資源
      {
        label: `${t('allocatable')}${t('enSpace')}${t('topBar.resource-configuration')}`
      },
      // 我的組
      {
        label: `${t('myGroup')}`
      }
    ];

    if (userInfo.state !== 1) defaultTabs.pop();

    return defaultTabs;
  }, [t, userInfo.state]);

  // * hooks
  /**
   * @author odin
   * @description 一開始先取得這個登入的使用者的 可以使用的叢集列表
  */
  useEffect(() => {
    const { username } = userInfo
    if(username) {
      getLimitedVg(username)
      proxyGetCanUseVgList(username, setSelfCanUseVgList)
    }
  }, [userInfo])

  return (
    <UserInfoContext.Provider value={userInfoContext}>
      {/* Materail UI layout */}
      <div className={classes.pageContainer}>
        <BreadCrumbs />
        <div className={`${classes.root} ${classes.borderRadius_4}`}>
          {/* tabs */}
          <BaseVerticalTabs
            currentTabIndex={currentTabIndex}
            handleTabsChange={handleTabsChange}
            tabsArray={tabsArray}
          />

          <BaseVerticalTabPanelContainer>
            {/* 個人設置 */}
            <PersonalSettings
              currentTabIndex={currentTabIndex}
              userInfo={userInfo}
            />

            {/* 密碼設置 */}
            <PasswordSettings
              currentTabIndex={currentTabIndex}
              userInfo={userInfo}
            />

            {/* 可用資源 */}
            <AvailableSource
              currentTabIndex={currentTabIndex}
              limitedVg={limitedVg}
              userInfo={userInfo}
            />

            {/* 我的組 */}
            {
              userInfo.state === 1 && (
                <MyGroup
                  classes={classes}
                  currentTabIndex={currentTabIndex}
                  getUserInfo={() => {
                    dispatch(getUserInfo(defaultUser))
                  }}
                  userInfo={userInfo}
                />
              )
            }
          </BaseVerticalTabPanelContainer>
        </div>
      </div>
    </UserInfoContext.Provider>
  );
};

export default UserInfo;
