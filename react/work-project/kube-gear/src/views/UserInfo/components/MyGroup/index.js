import React, { useState, useEffect, useContext } from 'react'

// # API
import { getGroupMembers, getGroupLeaders } from 'utils/api'

// ? context
import UserInfoContext from '../../UserInfoContext';

// ^ Material-ui Componets
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components
import BaseVerticalTabPanel from 'components/BaseVerticalTabAndPanel/BaseVerticalTabPanel';
import GroupList from '../GroupList';
import GroupModal from '../GroupModal';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';

// ^ Plugins
import { uniq } from 'lodash';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

/**
 * @author odin
 * @level views/UserInfo/BaseVerticalTabPanelContainer/MyGroup
 * @component MyGroup
 * @description Contains group table and organization modal
*/
export default function MyGroup({ currentTabIndex, userInfo, getUserInfo }) {
  // $ init data
  const { t } = useTranslation();
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  // # states
  const [groupData, setGroupData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queryParamName, setQueryParamName] = useState();

  // = style
  const { classes } = useContext(UserInfoContext);

  // - methods
  const getGroupData = () => {
    const { leaderGroups, userGroups } = userInfo;

    const allGroups = uniq(leaderGroups.concat(userGroups));
    const getData = name => {
      return Promise.all([
        getGroupMembers(name),
        getGroupLeaders(name)
      ])
    }

    setIsLoading(true)
    Promise.all(allGroups.map(name => getData(name)))
      .then(res => {
        const data = res.map(([members, leaders], idx) => {
          return { name: allGroups[idx], leaders, members }
        })

        setGroupData(data)
      })
      .catch(err => {
      // .catch(({ message: msg }) => {
        const msg = err.data.message
        toast.error(msg)
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  // * hooks
  useEffect(() => {
    if (!userInfo.leaderGroups) return;
    getGroupData();
  }, [userInfo])

  useEffect(() => {
    if (query.get('groupMsg')) {
      setQueryParamName(query.get('groupMsg'))
    }
  }, [search])

  return (
    <BaseVerticalTabPanel
      index={3}
      value={currentTabIndex}
    >
      {/* 上方的按鈕列 */}
      <Grid
        className={classes.mb_20}
        container
      >
        <Grid
          className={classes.mr_10}
          item
        >
          <PrimaryButton
            children={t('groupData')}
            onClick={() => setIsModalOpen(true)}
            startIcon={<Icon>group_add</Icon>}
          />
        </Grid>
        <Grid item>
          <DefaultButton
            children={t('refresh')}
            onClick={() => {getUserInfo()}}
            startIcon={<Icon>refresh</Icon>}
          />
        </Grid>
      </Grid>

      {/* 下方的表格列表 */}
      <GroupList
        data={groupData}
        isLoading={isLoading}
      />

      {
        isModalOpen &&
          <GroupModal
            getUserInfo={getUserInfo}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setQueryParamName()
            }}
            queryParamName={queryParamName}
            userInfo={userInfo}
          />
      }
    </BaseVerticalTabPanel>
  )
}

MyGroup.propTypes = {
  currentTabIndex: PropTypes.number,
  userInfo: PropTypes.object,
  getUserInfo: PropTypes.func
};
