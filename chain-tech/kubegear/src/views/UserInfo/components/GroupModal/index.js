/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from 'react';

// # API
import { getGroupApplyList, getGroupNameList } from 'utils/api';

// ? context
import UserInfoContext from '../../UserInfoContext';

// ^ Material-ui Componets(Functions)
import { DefaultButton } from 'components/BaseButton';
import { Grid } from '@material-ui/core';
import Table from './Table';

// ? self-packed components || functions
import BaseModalNew from 'components/BaseModalNew';
import BaseScrollPane from 'components/BaseScrollPane';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import MuiDropdown from 'components/BaseMuiDropdown';

// ^ plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/UserInfo/MyGroup/GroupModal
 * @param {boolean} isOpen -- 是否要顯示該 Modal
 * @param {function} onClose -- 關閉這個 Modal 的 function
 * @param {string} queryParamName -- 關鍵字，過濾用
 * @param {object} userInfo -- 目前登入的使用者的相關訊息，由 Redux 的 store 中取出
 * @param {function} getUserInfo -- 包含 dispatch()的 function，username 從 cookie 取得，由 Redux 的 store 中取出
 * @component GroupModal
 * @description Contains group status and manipulation
*/
const GroupModal = ({
  isOpen,
  onClose,
  queryParamName,
  userInfo,
  getUserInfo
}) => {

  // $ init data
  const { t } = useTranslation();

  // # states
  const [isLoading, setIsLoading] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [filterOption, setFilterOption] = useState('all')
  const [filterOptionText, setFilterOptionText] = useState(t('allShow'))
  const [keyword, setKeyword] = useState('')
  const [filteredList, setFilteredList] = useState([]);

  // handle data
  const dropOption = [
    {
      key: 'all',
      optionkey: 'all',
      text: t('allShow'),
      data: { icon: '6PointStar' },
      style: {
        color: '#001EF5'
      }
    },
    {
      key: 'joined',
      optionkey: 'joined',
      text: t('joined'),
      data: { icon: 'UserFollowed' },
      style: {
        color: '#0070C6'
      }
    },
    {
      key: 'invited',
      optionkey: 'invited',
      text: t('invited'),
      data: { icon: 'Mail' },
      style: {
        color: '#FF5974'
      }
    },
    {
      key: 'applied',
      optionkey: 'applied',
      text: t('applied'),
      data: { icon: 'Send' },
      style: {
        color: '#FFA500'
      }
    },
    {
      key: 'canApply',
      optionkey: 'canApply',
      text: t('canApply'),
      data: { icon: 'CheckMark' },
      style: {
        color: '#008000'
      }
    }
  ]

  // = style
  const { classes } = useContext(UserInfoContext);

  // * hooks
  useEffect(() => {
    if (queryParamName) {
      setKeyword(queryParamName)
    }
  }, [])

  useEffect(() => {
    if (!userInfo.userGroups) return;
    const { userGroups, username } = userInfo;
    setIsLoading(true);
    Promise.all([
      getGroupApplyList({ user: username }),
      getGroupNameList()
    ])
      .then(([applyList, nameList]) => {
        const data = [
          ...applyList,
          ...userGroups.map(group => ({ group, applyState: 1, inviteState: 1 })),
          ...nameList.filter(group => !userGroups.includes(group) && !applyList.some(item => item.group === group)).map(group => ({ group, applyState: 0, inviteState: 0 }))
        ]
        setGroupList(data)
      })
      .catch(err => {
      // .catch(({ message: msg }) => {
        const msg = err.data.message
        toast.error(msg)
      })
      .finally(() => setIsLoading(false))
  }, [userInfo])


  useEffect(() => {
    const res = groupList.filter(group => {
      const { inviteState, applyState } = group;
      let state = true;
      switch (filterOption) {
        case 'all':
        default:
          state = true
          break;
        case 'joined':
          state = inviteState && applyState;
          break;
        case 'invited':
          state = inviteState === 1 && applyState === 0
          break;
        case 'applied':
          state = inviteState === 0 && applyState === 1
          break;
        case 'canApply':
          state = inviteState === 0 && applyState === 0
          break;
      }
      return state && group.group.includes(keyword)
    })
    setFilteredList(res)
  }, [groupList, filterOption, keyword])


  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            onClick={onClose}
          />
        </>
      }
      onClose={onClose}
      size="md"
      title={`${t('group2')}${t('enSpace')}${t('info')}`}
    >
      <div className={classes.container}>

        <Grid container>
          {/* 搜尋框 */}
          <Grid item>
            <MuiAutocomplete
              classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
              onInputChange={(e, text) => {
                setKeyword(text);
              }}
              placeholder={`${t('search')}${t('name')}`}
              value={keyword}
            />
          </Grid>

          {/* 下單選單 */}
          <Grid item>
            <MuiDropdown
              list={dropOption}
              onChange={(e, child) => {
                const result = e.target.value;
                const optionKey = child.props.optionkey;

                // 處理對應的key值
                setFilterOption(optionKey);
                // 處理顯示的中文
                setFilterOptionText(result);
              }}
              text={`${t('select')}${t('enSpace')}${t('status')}`}
              value={filterOptionText}
            />
          </Grid>
        </Grid>

        <div className={classes.content}>
          <BaseScrollPane>
            <Table
              data={filteredList}
              getUserInfo={getUserInfo}
              isLoading={isLoading}
              userInfo={userInfo}
            />
          </BaseScrollPane>
        </div>
      </div>
    </BaseModalNew>
  );
};

GroupModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  queryParamName: PropTypes.string,
  userInfo: PropTypes.object,
  getUserInfo: PropTypes.func
};

export default GroupModal;