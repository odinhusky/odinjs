/* eslint-disable react/no-multi-comp */

import React, {
  useEffect,
  useContext,
  useMemo,
  useState
} from 'react';

// % context
import Context from './Context';
import JobDetailContext from '../../JobDetailContext';

// ^ Material-ui Components(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';

// ? Self-packed Components || Functions
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import MuiDropdown from 'components/BaseMuiDropdown';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import Filter from './Filter';
import { getStatusText } from './utils';

// ^ plugins
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { uniqBy } from 'lodash';

/**
 * @author odin
 * @level views/JobDetail/IndexPage/TopBar
 * @component TopBar
 * @description 上方的控制列
*/
function TopBar() {

  // $ init data
  const { t } = useTranslation();
  const history = useHistory();
  // const mapName
  // const text = {
  //       Waiting: t('waiting'),
  //       Running: t('running'),
  //       Stopping: t('stopping'),
  //       Succeeded: t('success'),
  //       Failed: t('fail'),
  //       Stopped: t('Stop')
  //     }[key] || key;

  // = styles
  const { classes } = useContext(JobDetailContext);

  // ? context
  const {
    allJobs,
    refreshJobs,
    selectedJobs,
    stopJob,
    username,
    filter,
    setFilter
  } = useContext(Context);

  // # states
  const [selectedUsers, setSelectedUsers] = useState(filter.users);
  const [selectedGroups, setSelectedGroups] = useState(filter.virtualGroups);
  const [selectedStatus, setSelectedStatus] = useState(filter.statuses);
  const [selectedKeys, setSelectedKeys] = useState([]);
  // console.log('selectedKeys 111222333', selectedKeys)
  const { users, virtualGroups, statuses } = useMemo(() => {
    const users = Object.create(null);
    const virtualGroups = Object.create(null);
    const statuses = Object.create(null);

    if (allJobs) {
      allJobs.forEach(function(job) {
        // console.log('jjob', job)
        users[job.username] = true;
        virtualGroups[job.virtualGroup] = true;
        statuses[getStatusText(job)] = true;
      });
    }
    // const query = querystring.parse(window.location.search.replace(/^\?+/, ''));
    // if (query.vgName && virtualGroups[query.vgName]) {
    //   setSelectedGroups(new Set([query.vgName]));

    // # 過濾從外面傳進來的 status
    // # id 為了避免重複的 key 值，造成叢集、用戶名稱兩個選項同時被勾選
    // ! 狀態不加 type_${name} 是因為會有其他頁面來的設定，所以如果要加的話其他頁面導頁的時候也要加
    const mapStatusName = name => {
      const mapedName = {
        Waiting: t('waiting'),
        Running: t('running'),
        Stopping: t('stopping'),
        Succeeded: t('success'),
        Failed: t('fail'),
        Stopped: t('Stop')
      }[name] || name;

      return {
        key: name,
        name: mapedName,
        id: name
      };
    };

    const keys = [
      ...selectedKeys,
      ...[...filter.users].map(name => ({ key: name, name, id: `user_${name}` })),
      ...[...filter.virtualGroups].map(name => ({ key: name, name, id: `group_${name}` })),
      ...[...filter.statuses].map(mapStatusName)
    ]

    // 過濾重複的資料
    setSelectedKeys(uniqBy(keys, 'key'));
    // }
    return { users, virtualGroups, statuses };
  }, [allJobs]);

  // - methods
  const filterOption = () => {
    const userList = [];
    if (username !== undefined) {
      userList.push({
        key: 'user-' + username,
        text: `@${t('self')}`,
        type: 'user',
        optionkey: username,
        id: `user_${username}`
      });
    }
    userList.push(...Object.keys(users)
      .filter(user => {
        return user !== username;
      }).map(user => ({
        key: 'user-' + user,
        text: user,
        type: 'user',
        optionkey: user,
        id: `user_${user}`
      })));

    const virtualGroupList = Object.keys(virtualGroups).map(item => ({
      key: item,
      text: item === 'total' ? `${t('default')}${t('group')}` : `${item}${t('group')}`,
      type: 'group',
      optionkey: item,
      id: `group_${item}`
    }));

    const mapStatus = key => {
      const text = {
        Waiting: t('waiting'),
        Running: t('running'),
        Stopping: t('stopping'),
        Succeeded: t('success'),
        Failed: t('fail'),
        Stopped: t('Stop')
      }[key] || key;

      return {
        key,
        text: text,
        type: 'status',
        optionkey: key,
        id: key
      };
    };

    const statusList = Object.keys(statuses).map(mapStatus);

    return [
      { key: 'user', text: t('user'), itemType: 2 },
      { key: 'divider_0', text: '-', itemType: 0 },
      ...userList,
      { key: 'divider_1', text: '-', itemType: 0 },
      { key: 'group', text: t('group'), itemType: 2 },
      ...virtualGroupList,
      { key: 'divider_2', text: '-', itemType: 0 },
      { key: 'status', text: t('status'), itemType: 2 },
      ...statusList,
      { key: 'divider_3', text: '-', itemType: 0 },
      { key: 'clear', text: t('clearOption'), type: 'clear', itemType: 1, onClick: clearFilter }
    ];
  };

  const handleDropdownChange = (event, item) => {
    if (item.type === 'user') {
      const user = new Set(selectedUsers);
      if (selectedUsers.has(item.id))
        user.delete(item.id)
      else
        user.add(item.id)

      setSelectedUsers(user);
    }
    if (item.type === 'group') {
      const groups = new Set(selectedGroups);
      if (groups.has(item.id))
        groups.delete(item.id);
      else
        groups.add(item.id);

      setSelectedGroups(groups);
    }
    if (item.type === 'status') {
      const status = new Set(selectedStatus);
      if (status.has(item.id))
        status.delete(item.id);
      else
        status.add(item.id);

      setSelectedStatus(status);
    }
  };

  const clearFilter = () => {
    setSelectedUsers(new Set());
    setSelectedGroups(new Set());
    setSelectedStatus(new Set());
    setSelectedKeys([]);
  };

  // useEffect(() => {
  //   const query = querystring.parse(window.location.search.replace(/^\?+/, ''));
  //   const { keyword, users, virtualGroups } = filter;
  //   let FILTER_STATES = new Set([
  //     'Stopped',
  //     'Watting',
  //     'Failed',
  //     'Succeeded',
  //     'Running'
  //   ]);

  //   const statuses = new Set(filter.statuses);

  //   if (query.status && FILTER_STATES.has(query.status)) {
  //     statuses.add(query.status);
  //     setSelectedStatus(statuses);
  //     setSelectedKeys([query.status]);
  //   }
  //   let newFilter = new Filter(keyword, users, virtualGroups, statuses);
  //   newFilter.clear();
  //   setFilter(newFilter);
  // }, []);

  // * hooks
  useEffect(() => {
    const { keyword } = filter;

    setFilter(new Filter(keyword, selectedUsers, selectedGroups, selectedStatus));
  }, [selectedUsers, selectedGroups, selectedStatus]);

  const onKeywordChange = keyword => {
    const { users, virtualGroups, statuses } = filter;
    setFilter(new Filter(keyword, users, virtualGroups, statuses));
  };

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px' }}>
        <div>
          <PrimaryButton
            children={
              !selectedJobs.length
                ? t('create')
                : selectedJobs.some(item => item.state === 'RUNNING' || item.state === 'WAITING') ? t('Stop') : t('create')
            }
            classes={{ root: classes.mr_10 }}
            onClick={() => {
              if (!selectedJobs.length) {
                history.push('/job-submit');
              } else {
                const selectedJobsHasRunning = selectedJobs.filter(item => item.state === 'RUNNING' || item.state === 'WAITING');
                selectedJobsHasRunning.length > 0 ? stopJob(...selectedJobsHasRunning) : history.push('/job-submit');
              }
            }}
            startIcon={<Icon>{
              !selectedJobs.length
                ? 'add'
                : selectedJobs.some(item => item.state === 'RUNNING' || item.state === 'WAITING') ? 'stop' : 'add'
            }</Icon>}
          />
          <DefaultButton
            children={t('refresh')}
            onClick={() => {
              refreshJobs();
            }}
            startIcon={<Refresh />}
          />
        </div>
        <div style={{ display: 'flex' }}>
          <MuiAutocomplete
            classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
            onInputChange={(e, value) => onKeywordChange(value)}
            placeholder={`${t('search')}`}
            value={filter.keyword}
          />
          <MuiDropdown
            list={filterOption()}
            maxWidth={200}
            multiple
            onChange={(e, child) => {
              if (child.props.type === 'clear') {
                child.props.onClick()
                return
              }
              handleDropdownChange(e, child.props)
              setSelectedKeys(
                selectedKeys.find(item => item.id === child.props.id) === undefined
                  ?
                  [
                    ...selectedKeys,
                    {
                      key: child.props.optionkey,
                      name: child.props.text,
                      id: child.props.id
                    }
                  ]
                  :
                  selectedKeys.filter(selected => selected.id !== child.props.id),
              );
            }}
            onChangeChecked={(valueOrigin, item) => {
              return valueOrigin.find(data => data.id === item.id) !== undefined ? true : false
            }}
            text={t('filter')}
            value={selectedKeys.map(item => item.name)}
            valueOrigin={selectedKeys}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default TopBar;
