import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import BasePanel from 'components/BasePanel';

import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { getJobList, getResource, getHivedResourceUnit } from 'utils/api';
import { computeUserOveriewData, exportCsv, getUseData, computeTotalResourceData } from './utils';
import { computeDayRange } from '../../utils';
import { uniq, uniqBy, isEmpty, isNull } from 'lodash';
import { toast } from 'react-toastify';

import CycleBar from './CycleBar/index';
import UseRate from './UseRate';

import UserOverview from './UserOverview';
import tabStyles from './index.module.scss';

import { useCheckPrivilege } from 'utils/hooks/useCheckPrivilege';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  heightAuto: {
    height: 'auto'
  }
}))

const User = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const permission = useCheckPrivilege('ADMIN');
  const history = useHistory();

  const topNuser = 5;
  const [resourceData, setResourceData] = useState({}); // total 資源，結合自己運算的加總
  const [jobRawData, setJobRawData] = useState([]); // 運行中 job且有將作業 job.description.virtualGroup === undefined 過濾掉
  const [userOverviewData, setUserOverviewData] = useState({});

  const [allVgUserJobName, setAllVgUserJobName] = useState([]); //
  const [valuesCategorybyUser, setValuesCategorybyUser] = useState([]); // 分類 by user from gafana
  const [selectedFilterValuesBeforeAverage, setSelectedFilterValuesBeforeAverage] = useState({});
  const [dropdownForUser, setDropdownForUser] = useState([]);
  const [dropdownForVg, setDropdownForVg] = useState([]);
  const [lineChartData, setLineChartData] = useState({});
  const [firstTimeToSetLineChart, setFirstTimeToSetLineChart] = useState(true);
  const [searchInfo, setSearchInfo] = useState({
    vg: null,
    user: null,
    cycle: {
      key: '15min',
      start: null,
      end: null
    },
    isClickSearch: false
  })

  function getUserDropdownList(data) {
    const list = data.map(item => {
      return {
        text: item.metric.username,
        key: item.metric.username
      }
    })
    const filterRepeatUser = uniqBy(list, 'key')
    return filterRepeatUser
  }

  function getUserValueData(name, data) {
    const arr = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].metric.username === name) {
        arr.push({
          job_name: data[i].metric.job_name.split('~')[1],
          values: data[i].values
        })
      }
    }
    return arr;
  }

  function getValuesCategorybyUser(data, optionUsers) {
    const valuesCategorybyUser = []
    for (let i = 0; i < optionUsers.length; i++) {
      const name = optionUsers[i].text
      valuesCategorybyUser.push({
        username: name,
        cpu: getUserValueData(name, data.cpu),
        cpuMemory: getUserValueData(name, data.cpuMemory),
        gpu: getUserValueData(name, data.gpu),
        gpuMemory: getUserValueData(name, data.gpuMemory),
        diskIn: getUserValueData(name, data.diskIn),
        diskOut: getUserValueData(name, data.diskOut),
        networkIn: getUserValueData(name, data.networkIn),
        networkOut: getUserValueData(name, data.networkOut)
      })
    }
    return valuesCategorybyUser
  }

  function getUserVirtualGroup(name, cluster) {
    let userVirtualGroup = [];
    for(let j = 0; j < cluster.length; j++) {
      if (name === cluster[j].username) {
        const findSameVirtualGroup = userVirtualGroup.find(element => element === cluster[j].virtualGroup)
        if (findSameVirtualGroup === undefined) {
          userVirtualGroup.push(cluster[j].virtualGroup)
        }
      }
    }
    userVirtualGroup = userVirtualGroup.map(name => {
      return {
        text: name,
        key: name
      }
    });
    return userVirtualGroup;
  }

  function getAllUserAndvgData(dropdownForUser, allVgUserJobName) {
    const allUsers = dropdownForUser.map(item => item.text)
    const userAndvgData = [];
    for (let i = 0; i < allUsers.length; i++) {
      userAndvgData.push({
        user: allUsers[i],
        virtualGroup: getUserVirtualGroup(allUsers[i], allVgUserJobName)
      })
    }
    return userAndvgData
  }

  function getDropdownForVg(searchInfo, allUserVg) {
    const dropdownForVg = allUserVg.find(element => element.user === searchInfo.user.key)
    return dropdownForVg.virtualGroup
  }

  function findJobNameInFilterVg(jobname, alreadyFilterByUserAndVg) {
    let hasJob = false;
    for (let i = 0; i < alreadyFilterByUserAndVg.length; i++) {
      if (jobname === alreadyFilterByUserAndVg[i].jobName) {
        hasJob = true
      }
    }
    return hasJob
  }

  function getSelectedValues(data, filterSelectedVg) {
    const getSelectedValues = [];
    for (let i = 0; i < data.length; i++) {
      if (findJobNameInFilterVg(data[i].job_name, filterSelectedVg)) {
        getSelectedValues.push(data[i].values)
      }
    }
    return getSelectedValues
  }

  function averageData(data) {
    const copyData = { ...data }
    Object.keys(copyData).forEach(key => {
      const dataValue = copyData[key];
      if (dataValue.length > 0) {
        const averageValue = dataValue.reduce((acc, curr) => (
          [...acc, ...curr]
        ), [])
        const timeline = uniq(averageValue.map(item => item[0]).sort((a, b) => a - b))
        const result = timeline.map(time => {
          const avg = dataValue.reduce((acc, curr) => {
            const val = curr.find(value => value[0] === time)
            return acc += val ? val[1] : 0
          }, 0)
          return [time, avg]
        });
        copyData[key] = result;
      }
    });
    return copyData
  }

  const getPieChartData = async(topNuser) => {
    try {
      const resourceUnits = await getHivedResourceUnit()
      const systemResource = await getResource('system')
      const combineWithTotalParameter = computeTotalResourceData(systemResource, resourceUnits)
      setResourceData(combineWithTotalParameter)

      const jobData = await getJobList();
      const runningJob = jobData.filter(job => {
        if (isNull(job.description)) return false
        if (job.description.virtualGroup === undefined) return false
        if (job.state !== 'RUNNING') return false
        return true
      })

      setJobRawData(
        jobData.filter(job => {
          if (isNull(job.description)) return false
          if (job.description.virtualGroup === undefined) return false
          return true
        })
      )
      setUserOverviewData(computeUserOveriewData(combineWithTotalParameter, runningJob, t, topNuser))
    } catch (err) {
      toast.error(err.data ? err.data.message : err.message);
    }
  }

  const getLineChartData = async(query) => {
    try {
      const data = await getUseData(query)
      const optionUsers = getUserDropdownList(data.cpu)
      setDropdownForUser(optionUsers)
      const valuesCategorybyUser = getValuesCategorybyUser(data, optionUsers)
      setValuesCategorybyUser(valuesCategorybyUser)
    } catch (err) {
      toast.error(err.data ? err.data.message : err.message);
    }
  }

  useEffect(() => {
    if (searchInfo.cycle.key !== 'custom') {
      const query = computeDayRange(searchInfo.cycle)
      getLineChartData(query)
    } else if ((searchInfo.cycle.key === 'custom') && (searchInfo.cycle.end !== undefined)) {
      const query = computeDayRange(searchInfo.cycle)
      getLineChartData(query)
    }
  }, [searchInfo.cycle])

  useEffect(() => {
    if (!isEmpty(searchInfo.user) && !isEmpty(jobRawData)) {
      const clusters = jobRawData.map(item => ({
        virtualGroup: item.description.virtualGroup,
        username: item.username,
        jobName: item.name
      }))
      setAllVgUserJobName(clusters)
      const dropdownForVgAll = getAllUserAndvgData(dropdownForUser, clusters)
      const dropdownForVg = getDropdownForVg(searchInfo, dropdownForVgAll)

      if (isEmpty(searchInfo.vg)) {
        setDropdownForVg(dropdownForVg)
      }
    }
  }, [searchInfo.user, jobRawData])

  useEffect(() => {
    if (!isEmpty(searchInfo.vg) && !isEmpty(searchInfo.user)) {
      const getSelectedJobNameAndValues = valuesCategorybyUser.find(element => element.username === searchInfo.user.key)

      const filterSelectedUser = allVgUserJobName.filter(item => item.username === searchInfo.user.key)
      const filterSelectedVg = filterSelectedUser.filter(item => item.virtualGroup === searchInfo.vg.key)

      const result = {
        cpu: getSelectedValues(getSelectedJobNameAndValues.cpu, filterSelectedVg),
        cpuMemory: getSelectedValues(getSelectedJobNameAndValues.cpuMemory, filterSelectedVg),
        gpu: getSelectedValues(getSelectedJobNameAndValues.gpu, filterSelectedVg),
        gpuMemory: getSelectedValues(getSelectedJobNameAndValues.gpuMemory, filterSelectedVg),
        diskIn: getSelectedValues(getSelectedJobNameAndValues.diskIn, filterSelectedVg),
        diskOut: getSelectedValues(getSelectedJobNameAndValues.diskOut, filterSelectedVg),
        networkIn: getSelectedValues(getSelectedJobNameAndValues.networkIn, filterSelectedVg),
        networkOut: getSelectedValues(getSelectedJobNameAndValues.networkOut, filterSelectedVg)
      }

      setSelectedFilterValuesBeforeAverage(result)

      if (firstTimeToSetLineChart) {
        setLineChartData(averageData(result))
        setFirstTimeToSetLineChart(false)
      }
    }
  }, [searchInfo.vg, searchInfo.user, firstTimeToSetLineChart])

  useEffect(() => {
    if (searchInfo.isClickSearch) {
      setLineChartData(averageData(selectedFilterValuesBeforeAverage))
      setSearchInfo(param => ({ ...param, isClickSearch: false }))
    }
  }, [searchInfo.isClickSearch])

  useEffect(() => {
    getPieChartData(topNuser)
  }, [])

  useEffect(() => {
    if (permission === null) return;
    if (!permission) {
      history.push('entry')
    }
  }, [permission])

  return (
    <>
      <div>
        <PrimaryButton
          children={`${t('Export')}${t('enSpace')}Excel`}
          classes={{
            root: classes.marginRight10,
            startIcon: classes.iconClearMarginLeft
          }}
          onClick={() => exportCsv({ resourceData, jobRawData, lineChartData, t, userName: searchInfo.user.key })}
          startIcon={<Icon>file_download</Icon>}
        />
        <DefaultButton
          children={t('refresh')}
          onClick={() => {
            getPieChartData(topNuser)
            setSearchInfo(param => {
              return {
                ...param,
                isClickSearch: true
              }
            })
          }}
          startIcon={<Refresh />}
        />
      </div>
      <div className={tabStyles.pt20}>
        <BasePanel title={`${t('resource')}${t('enSpace')}${t('status')}`}>
          <UserOverview data={userOverviewData} />
        </BasePanel>
      </div>
      <div className={tabStyles.pt20}>
        <BasePanel title={t('Utilization')}>
          <CycleBar
            dropdownForUser={dropdownForUser}
            dropdownForVg={dropdownForVg}
            setSearchInfo={setSearchInfo}
          />
          <UseRate
            data={lineChartData}
          />
        </BasePanel>
      </div>
    </>
  );
};

User.propTypes = {

};

export default User;
