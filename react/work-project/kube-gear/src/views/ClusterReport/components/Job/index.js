import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import JobOverview from './components/JobOverview';
import BasePanel from 'components/BasePanel';
import Tab from './components/Tab';
import CycleBar from './components/CycleBar';
import JobLayer from './components/layer'

import { computeJobOverviewData, getJobLayerData, exportCsv, computeTotalResourceData } from './utils'
import { computeDayRange } from '../../utils';
import { getJobList, getHivedResourceUnit, getCanUseVirtualGroups } from 'utils/api';

import GlobalContext from 'layouts/Main/GlobalContext';
import { isEmpty, isNull } from 'lodash';

import { useCheckPrivilege } from 'utils/hooks/useCheckPrivilege';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  heightAuto: {
    height: 'auto'
  }
}))

const Job = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { userInfo } = useContext(GlobalContext);
  const permission = useCheckPrivilege('JOB');
  const history = useHistory();
  const [jobRawData, setJobRawData] = useState([]); // 未處理過的運行中job
  const [jobOverviewData, setJobOverviewData] = useState({}); // 圓餅圖的資料
  const [resourceData, setResourceData] = useState({}); // total 資源
  const [searchState, setSearchState] = useState(false);
  const [chartData, setChartData] = useState({});
  const [selectedTab, setSelectTab] = useState('job');
  const [searchInfo, setSearchInfo] = useState({
    vg: null,
    job: null,
    cycle: {
      key: '15min',
      start: null,
      end: null
    }
  });

  const getOverviewData = async(username) => {
    try {
      const canUserVgResource = await getCanUseVirtualGroups(username, true)
      const resourceUnits = await getHivedResourceUnit()
      const combineWithTotalParameter = computeTotalResourceData(canUserVgResource, resourceUnits)
      setResourceData(combineWithTotalParameter)

      const jobData = await getJobList();
      setJobRawData(
        jobData.filter(job => {
          if (isNull(job.description)) return false
          if (job.description.virtualGroup === undefined) return false
          return true
        })
      );

      const runningJob = jobData.filter(job => {
        if (isNull(job.description)) return false
        if (job.description.virtualGroup === undefined) return false
        if (job.state !== 'RUNNING') return false
        return true
      })

      setJobOverviewData(computeJobOverviewData(combineWithTotalParameter, runningJob, t))
    } catch (err) {
      setResourceData(undefined)
      setJobOverviewData({})
      toast.error(err.data ? err.data.message : err.toString())
    }
  }

  const getChartData = async() => {
    const { job, cycle, username } = searchInfo;
    if (username && job) {
      const data = await getJobLayerData({ username, job, type: selectedTab, ...computeDayRange(cycle) })

      setChartData(data);
    }
    setSearchState(false);
  }

  useEffect(() => {
    if (!isEmpty(userInfo)) {
      const username = userInfo.username;
      getOverviewData(username);
    }
  }, [userInfo])

  useEffect(() => {
    if (searchState) {
      getChartData();
    }
  }, [searchState])

  useEffect(() => {
    setSearchState(true);
  }, [searchInfo, selectedTab])

  const searchOnChange = ({ ...data }) => {
    setSearchInfo({
      ...data
    })
  }

  useEffect(() => {
    if (permission === null) return;
    if (!permission) {
      history.push('entry')
    }
  }, [permission])

  return (
    <div>
      <div>
        <PrimaryButton
          children={`${t('Export')}${t('enSpace')}Excel`}
          classes={{
            root: classes.marginRight10,
            startIcon: classes.iconClearMarginLeft
          }}
          onClick={() => exportCsv({ resourceData, jobRawData, chartData, t, jobName: searchInfo.job })}
          startIcon={<Icon>file_download</Icon>}
        />
        <DefaultButton
          children={t('refresh')}
          onClick={() => {
            if (resourceData !== undefined) {
              getOverviewData(userInfo.username);
            }
            getChartData();
          }}
          startIcon={<Refresh />}
        />
      </div>
      {
        !isEmpty(jobOverviewData) &&
        <BasePanel
          style={{ marginTop: 20 }}
          title={`${t('resource')}${t('enSpace')}${t('status')}`}
        >
          <JobOverview data={jobOverviewData} />
        </BasePanel>
      }
      <BasePanel
        style={{ marginTop: 20 }}
        title={
          <Tab onChange={setSelectTab}/>
        }
      >
        <div style={{ marginTop: 20 }}>
          <CycleBar
            jobs={jobRawData}
            onChange={searchOnChange}
            searchInfo={searchInfo}
          />
        </div>
        <JobLayer data={chartData} />
      </BasePanel>
    </div>
  );
};

export default Job;
