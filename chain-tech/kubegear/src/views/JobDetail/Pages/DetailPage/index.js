import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import {
  getJobInfo,
  getJobConfig,
  stopJob
} from 'utils/api';

// ? context
import JobDetailContext from '../../JobDetailContext'

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import { getHumanizedJobStateString, isClonable, getTaskConfig } from './utils';
import BaseLink from 'components/BaseLink';
import { PrimaryButton, DefaultButton, SplitButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';
import Summary from './components/Summary';
import TaskRole from './components/TaskRole';
// import qs from 'querystring';

// ^ Plugins
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify'

const StoppableStatus = [
  'Running',
  'Waiting'
];

/**
 * @author elvis
 * @level views/JobDetail/Page/DetailPage
 * @component DetailPage
 * @description Detail Page content
*/
const DetailPage = () => {

  // $ init data
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search)

  // = style
  const { classes } = useContext(JobDetailContext)

  // # states
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [jobInfo, setJobInfo] = useState({
    name: '',
    jobStatus: {},
    taskRoles: {}
  });
  const [jobConfig, setJobConfig] = useState({
    extras: {}
  });
  const [refreshTime, setRefreshTime] = useState(10000);
  const { name: jobName } = useParams();

  // - methods
  const getData = () => {
    const username = query.get('username');
    Promise.all([
      getJobInfo(username, jobName).catch(() => toast.error('Error')),
      getJobConfig(username, jobName).catch(() => toast.error('Error'))
    ])
      .then(([infoData, configData]) => {
        setJobInfo(infoData);
        setJobConfig(configData);
      })
  };

  // * hooks
  useEffect(() => {
    getData();
  }, [location.search])

  useEffect(() => {
    if (refreshTime === 0)
      return clearInterval(window.setInterval)

    const timer = setInterval(() => {
      getData()
    }, refreshTime);

    return () => clearInterval(timer)
  }, [refreshTime, location.search])

  const handleStopJob = async() => {
    const username = query.get('username');
    await stopJob(username, jobName);

    getData();
  }

  return (
    <>
      <div className={`${classes.pt_20} ${classes.mb_10} ${classes.flex_justify_between}`}>
        <div className={`${classes.d_flex}`}>
          <BaseLink
            className={`${classes.p_0}`}
            to={`/job-submit?op=resubmit&type=job&user=${query.get('username')}&jobname=${jobName}`}
          >
            <PrimaryButton
              children={t('clone')}
              classes={{ root: classes.mr_10 }}
              disabled={!isClonable(jobConfig)}
              startIcon={<Icon>content_copy</Icon>}
            />
          </BaseLink>
          <DefaultButton
            children={t('Stop')}
            classes={{ root: classes.mr_10 }}
            disabled={!StoppableStatus.includes(getHumanizedJobStateString(jobInfo))}
            onClick={() => setIsStopModalOpen(true)}
            startIcon={<Icon>stop</Icon>}
          />
          <SplitButton
            onClick={getData}
            options={[
              {
                id: 0,
                key: 0,
                label: t('stopAutoRefresh'),
                icon: <Icon className={`${classes.mr_10}`}>stop</Icon>,
                handleItemclick: () => setRefreshTime(0)
              },
              {
                id: 10000,
                key: 10000,
                label: t('autoRefreshSecond', { second: '10' }),
                icon: <Icon className={`${classes.mr_10}`}>refresh</Icon>,
                handleItemclick: () => setRefreshTime(10000)
              },
              {
                id: 30000,
                key: 30000,
                label: t('autoRefreshSecond', { second: '30' }),
                icon: <Icon className={`${classes.mr_10}`}>refresh</Icon>,
                handleItemclick: () => setRefreshTime(30000)
              },
              {
                id: 60000,
                key: 60000,
                label: t('autoRefreshSecond', { second: '60' }),
                icon: <Icon className={`${classes.mr_10}`}>refresh</Icon>,
                handleItemclick: () => setRefreshTime(60000)
              }
            ]}
            startIcon={<Icon>refresh</Icon>}
            text={t('refresh')}
          />
          <div
            className={`
            ${classes.ml_16}
            ${classes.flex_align_center}
            ${classes.d_flex}
          `}
          >
            {
              refreshTime !== 0 ?
                t('autoRefreshSecond', { second: refreshTime / 1000 }) :
                t('stopAutoRefresh')
            }
          </div>
        </div>
        <DefaultButton
          children={t('back')}
          onClick={() => history.goBack()}
          startIcon={<Icon>arrow_back</Icon>}
        />
      </div>
      <Summary
        jobConfig={jobConfig}
        jobInfo={jobInfo}
        username={query.get('username')}
      />
      <div className={`${classes.flexGrow1} ${classes.overflowHidden}`}>
        {
          Object.keys(jobInfo.taskRoles).map(key => {
            return (
              <React.Fragment
                key={key}
              >
                <TaskRole
                  data={jobInfo.taskRoles[key]}
                  jobInfo={jobInfo}
                  taskConfig={getTaskConfig(jobConfig, key)}
                />
              </React.Fragment>
            )})
        }
      </div>
      {
        isStopModalOpen &&
        <ConfirmModal
          confrimText={t('Stop')}
          content={t('stopJobMsg')}
          isOpen={isStopModalOpen}
          onClose={() => setIsStopModalOpen(false)}
          onConfirm={() => handleStopJob()}
          title={`${t('Stop')}${t('enSpace')}${t('job')}`}
        />
      }
    </>
  );
};

export default DetailPage;