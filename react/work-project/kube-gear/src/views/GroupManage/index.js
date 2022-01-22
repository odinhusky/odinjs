import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import BreadCrumb from 'components/BreadCrumbs';
import BaseMenu from 'components/BaseMenu';
import Leader from './components/Leader';
import Member from './components/Member';
import Resource from './components/Resource';
import SubGroup from './components/SubGroup';

import Contect from './Context';
import GlobalContext from 'layouts/Main/GlobalContext';

import { getGroupData } from 'utils/api';

import styles from './index.module.scss';
import commonStyle from 'common/commonStyles';

import { useTranslation } from 'react-i18next';
import { isEmpty, first } from 'lodash';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  toolbar: {
    backgroundColor: theme.palette.background.paper
  }
}));

const GroupManage = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const classes = useStyles();
  const { userInfo } = useContext(GlobalContext);
  const { search } = useLocation();
  const [menuData, setMenuData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentGroup, setCurrentGroup] = useState({});
  const [activeTab, setActiveTab] = useState(false);
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const query = new URLSearchParams(window.location.search);

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
      if (isEmpty(menu.children)) findData = {};
      else findData = findGroup(menu.children, selectedItem)
    }
    setCurrentGroup(findData);
    if (isEmpty(findData) && !isEmpty(menuData)) {
      !isEmpty(first(menuData)) && setSelectedItem(first(menuData).name);
      toast.error(t('groupNotFound'))
    }

  }, [selectedItem, menuData])

  const getMenuData = () => {
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
  }

  useEffect(() => {
    getMenuData();
  }, [userInfo])

  const context = {
    getMenuData,
    isMenuLoading,
    setIsMenuLoading,
    setSelectedItem
  }

  return (
    <Contect.Provider value={context}>
      <div className={styles.container}>
        <BreadCrumb />
        <div className={styles.content}>
          <div className={styles.left}>
            <BaseMenu
              data={menuData}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </div>
          <div className={styles.right}>
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
    </Contect.Provider>
  );
};

export default GroupManage;