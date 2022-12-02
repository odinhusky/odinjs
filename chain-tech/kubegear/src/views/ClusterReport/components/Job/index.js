import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import {
  getJobList,
  getCanUseVirtualGroups
} from 'utils/api';

// ? context
import ClusterReportContext from 'views/ClusterReport/ClusterReportContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Components(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';

// ? Self-packed Components || Functions
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import JobOverview from './components/JobOverview';
import BasePanel from 'components/BasePanel';
import Tab from './components/Tab';
import CycleBar from './components/CycleBar';
import JobLayer from './components/layer'
import {
  computeJobOverviewData,
  getJobLayerData,
  exportCsv,
  computeTotalResourceData
} from './utils'
import { computeDayRange } from '../../utils';
import { useCheckPrivilege } from 'utils/hooks/useCheckPrivilege';

// ^ Plugins
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty, isNull } from 'lodash';

/**
 * @author odin
 * @level views/ClusterReport/Job
 * @component Job
 * @description Job
*/
const Job = () => {

  // $ init data
  const { t } = useTranslation();
  const permission = useCheckPrivilege('JOB');
  const history = useHistory();

  // ? context
  const { userInfo } = useContext(GlobalContext);
  const { classes } = useContext(ClusterReportContext);

  // # states
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

  // - methods
  const getOverviewData = async(username) => {
    try {
      const canUserVgResource = await getCanUseVirtualGroups(username, true)
      const combineWithTotalParameter = computeTotalResourceData(canUserVgResource)
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

  const searchOnChange = ({ ...data }) => {
    setSearchInfo({
      ...data
    })
  }

  // * hooks
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
            root: classes.mr_10,
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
          className={`${classes.mt_20}`}
          title={`${t('resource')}${t('enSpace')}${t('status')}`}
        >
          <JobOverview data={jobOverviewData} />
        </BasePanel>
      }
      <BasePanel
        className={`${classes.mt_20}`}
        title={
          <Tab onChange={setSelectTab}/>
        }
      >
        <div className={`${classes.mt_20}`}>
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
