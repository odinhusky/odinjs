import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo
} from 'react';

// # API
import { getGroupData } from 'utils/api';

// ? context
import GroupManageContext from './GroupManageContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Componets(Functions)
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// ? Self-packed Components || Functions
import BreadCrumb from 'components/BreadCrumbs';
import BaseMenu from 'components/BaseMenu';
import Leader from './components/Leader';
import Member from './components/Member';
import Resource from './components/Resource';
import SubGroup from './components/SubGroup';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles';
import groupManageStyles from './groupManageStyles';

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  ...groupManageStyles(theme)
}));

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useLocation, useHistory } from 'react-router-dom';
import { isEmpty, first } from 'lodash';

/**
 * @author odin
 * @level views/GroupManage Route
 * @component GroupManage Route
 * @description GroupManage Route page
*/
const GroupManage = () => {

  // $ init data
  const history = useHistory();
  const { t } = useTranslation();
  const { search } = useLocation();
  const query = new URLSearchParams(window.location.search);

  // ? context
  const { useSelector } = useContext(GlobalContext);

  // ^ Redux
  const userInfoFromRedux = useSelector(state => state.userinfo.data);
  const userInfo = useMemo(() => (userInfoFromRedux), [userInfoFromRedux]);

  // = styles
  const classes = useStyles();

  // # states
  const [menuData, setMenuData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentGroup, setCurrentGroup] = useState({});
  const [activeTab, setActiveTab] = useState(false);
  const [isMenuLoading, setIsMenuLoading] = useState(false);

  // - methods
  const getMenuData = useCallback(() => {
    let leaderGroups = userInfo.leaderGroups;
    if (userInfo.admin === 'true') {
      leaderGroups = ['system']
    }
    if (leaderGroups) {
      setIsMenuLoading(true);
      !isEmpty(leaderGroups)
        ?
        Promise.all(
          leaderGroups.map(group => getGroupData(group))
        )
          .then(data => {
            function checkHasName(arr, name) {
              return arr.some(item => {
                if (item.name === name) return true;
                if (!isEmpty(item.children)) return checkHasName(item.children, name)

                return false
              })
            }

            const filterdData = data.filter(item => {
              const name = item.name;
              return !data.some(item2 => {
                if (item2.name === name) return false;
                return checkHasName(item2.children, name)
              })
            })

            setMenuData(filterdData)
            setIsMenuLoading(false)
          })
        :
        history.push('entry')
    }
  }, [userInfo]);

  // & handled data
  const context = {
    getMenuData,
    isMenuLoading,
    setIsMenuLoading,
    setSelectedItem,
    classes,
    userInfo
  }

  // * hooks
  useEffect(() => {
    if (query.get('group')) {
      setSelectedItem(query.get('groupMsg'))
    }
    const tabs = ['leader', 'member', 'resource', 'sub']
    const tab = query.get('tab');
    if (!tabs.includes(tab)) setActiveTab('leader');
    else setActiveTab(tab)
  }, [search])

  useEffect(() => {
    if (!selectedItem) {
      if (query.get('group')) {
        setSelectedItem(query.get('group'))
      } else {
        !isEmpty(first(menuData)) && setSelectedItem(first(menuData).name);
      }
      return;
    }

    function findGroup(arr, name) {
      let result = {};
      if (!name) return {}
      for (const item of arr) {
        if (item.name === name) {
          result = { ...item };
          break;
        }
        if (isEmpty(item.children) || isEmpty(findGroup(item.children, name))) continue;
        else return findGroup(item.children, name)
      }
      return result
    }

    let findData = {}
    for (const menu of menuData) {
      if (menu.name === selectedItem) {
        findData = { ...menu }
        break;
      }
      if (isEmpty(menu.children)) {
        findData = {};
      } else {
        findData = findGroup(menu.children, selectedItem)
        if (!isEmpty(findData)) break
        continue
      }
    }
    setCurrentGroup(findData);
    if (isEmpty(findData) && !isEmpty(menuData)) {
      !isEmpty(first(menuData)) && setSelectedItem(first(menuData).name);
      toast.error(t('groupNotFound'))
    }

  }, [selectedItem, menuData])

  useEffect(() => {
    getMenuData();
  }, [userInfo])

  return (
    <GroupManageContext.Provider value={context}>
      <div className={classes.groupManageContainer}>
        <BreadCrumb />
        <div className={classes.groupManageContent}>
          <div className={classes.groupManageLeft}>
            <BaseMenu
              data={menuData}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </div>
          <div className={classes.groupManageRight}>
            <Toolbar
              className={classes.toolbar}
              disableGutters
            >
              <Tabs
                aria-label="tabs"
                className={classes.tabs}
                indicatorColor="primary"
                onChange={(e, value) => {
                  history.push({ search: `?tab=${value}` })
                  setActiveTab(value)
                }}
                scrollButtons="on"
                value={activeTab}
                variant="scrollable"
              >
                <Tab
                  label={`${t('TeamLeader')}`}
                  value={'leader'}
                />
                <Tab
                  label={`${t('TeamMember')}`}
                  value={'member'}
                />
                <Tab
                  label={`${t('resourceList')}`}
                  value={'resource'}
                />
                <Tab
                  label={`${t('SubTeamList')}`}
                  value={'sub'}
                />
              </Tabs>
            </Toolbar>

            {/* Tab 對應的內容 */}
            {
              activeTab === 'leader' &&
              <Leader
                disabledDeleteBtnList={menuData.map(group => group.name)}
                group={selectedItem}
                selectedItem={selectedItem}
              />
            }
            {
              activeTab === 'member' &&
              <Member
                group={currentGroup}
                queryParamName={query.get('applyMember')}
              />
            }
            {
              activeTab === 'resource' &&
              <Resource
                group={currentGroup}
              />
            }
            {
              activeTab === 'sub' &&
              <SubGroup
                group={currentGroup}
              />
            }
          </div>
        </div>
      </div>
    </GroupManageContext.Provider>
  );
};

export default GroupManage;