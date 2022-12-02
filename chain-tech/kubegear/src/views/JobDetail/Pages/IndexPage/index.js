/* eslint-disable react/no-multi-comp */
import * as querystring from 'querystring';

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BreadCrumbs from 'components/BreadCrumbs';
import BasePaper from 'components/BaseMuiPaper';
import BaseLink from 'components/BaseLink';
import StatusBadge from 'components/StatusBadge';
import { SplitButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';
import Icon from '@material-ui/core/Icon';
import BaseMuiIcon from 'components/BaseMuiIcon';
import TimeModal from './TimeModal';

import GlobalContext from 'layouts/Main/GlobalContext';

import { getDateDiff } from 'common/commonMethods'
import { formatBytes } from 'utils';
import { MB } from 'constant';

import moment from 'utils/moment';
import Context from './Context';
import Filter from './Filter';
import Ordering from './Ordering';
import cookies from 'js-cookie';
import { toast } from 'react-toastify';
import TopBar from './TopBar';
import JobDetailContext from '../../JobDetailContext';

import {
  getJobList,
  stopJob as stopJobReq,
  // deleteJob as deleteJobReq,
  deleteJobHide as deleteJobReq,
  getCanUseVirtualGroups,
  getJobLifeHour
} from 'utils/api';

export default function JobList() {

  // $ init data
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(window.location.search);
  const admin = cookies.get('admin');
  const username = cookies.get('user');

  const { userInfo } = useContext(GlobalContext);

  // ? context
  const { classes } = useContext(JobDetailContext)

  // # states
  const [allJobs, setAllJobs] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [clickedJob, setClickedJob] = useState({});

  // Use a memoized value from nothing (since no deps -- 2nd arg)
  // - first arg: a “create” function
  // - if no array (our case) is provided, a new value will be computed on every render.
  // Ref: https://reactjs.org/docs/hooks-reference.html#usememo
  const initialFilter = () => {
    const users = params.get('users');
    const vg = params.get('vgName');
    const status = params.get('status');
    const keyword = params.get('keyword') ? params.get('keyword') : '';
    const filterUser = users ? new Set(users.split(',')) : new Set()
    const filterVg = vg ? new Set(vg.split(',')) : new Set()
    const filterStatus = status ? new Set(status.split(',')) : new Set()
    const initialFilterUsers = (username && !admin) ? new Set([username]) : filterUser;
    const filter = new Filter(keyword, initialFilterUsers, filterVg, filterStatus);

    filter.clear();
    return filter;
  };
  const [filter, setFilter] = useState(initialFilter);
  const [ordering, setOrdering] = useState(new Ordering());
  const [filteredJobs, setFilteredJobs] = useState(null);

  const applySortProps = column => {
    column.isSorted = ordering.field === column.id;
    column.isSortedDescending = ordering.descending;
    column.onColumnClick = (event, column) => {
      const { field, descending } = ordering;
      if (field === column) {
        if (descending) {
          setOrdering(new Ordering());
        } else {
          setOrdering(new Ordering(field, true));
        }
      } else {
        setOrdering(new Ordering(column));
      }
    }
    return column;
  }

  useEffect(() => filter.save(), [filter]);

  useEffect(() => {
    const { keyword, users, virtualGroups, statuses } = filter;


    const query = {
      keyword,
      users: [...users].join(','),
      vgName: [...virtualGroups].join(','),
      status: [...statuses].join(',')
    }

    history.push({ search: `?${querystring.stringify(query)}` })
  }, [filter])

  useEffect(() => {
    setFilteredJobs(filter.apply(allJobs || []));
  }, [allJobs, filter]);

  // Use memoized callback for stoping a job
  // - therefore, returned callback changes only on changed dependencies
  // - useCallback(fn, deps) is equivalent to useMemo(() => fn, deps)
  // - Ref: https://reactjs.org/docs/hooks-reference.html#usecallback
  const stopJob = useCallback((...jobs) => {
    jobs.forEach(job => {
      const { name, username } = job;
      stopJobReq(username, name)
        .then(() => {
          job.executionType = 'STOP';
          delete job._statusText;
          delete job._statusIndex;
          setAllJobs(allJobs.slice());
        })
    });
  }, [allJobs]);

  const deleteJob = useCallback((...jobs) => {
    jobs.forEach(job => {
      const { name, username } = job;
      deleteJobReq(username, name)
        .then(() => {
          const remainedJobs = allJobs.filter(job => {
            if (job.name !== name || job.username !== username) {
              return true;
            } else {
              job.executionType = 'DELETED';
              return false;
            }
          });
          setAllJobs(remainedJobs.slice());
        })
    });
  }, [allJobs]);

  const refreshJobs = useCallback(() => {
    setAllJobs(null);

    const getAuthenticatedJobsPromise = getJobList()
      .then(data => {
        return data.map(job => {
          job.virtualGroup = job.virtualGroup || (job.description || {}).virtualGroup;
          return job;
        });
      })

    const getAuthorizedVGsPromise = new Promise((resolve) => {
      const query = querystring.parse(location.search.replace(/^\?/, ''));
      if (query['vgName']) {
        resolve(new Set([query.vgName]));
      } else {
        // 'Fetch' this usr's authorized VGs
        // - get VGs set
        const fetchVGsPromise = getCanUseVirtualGroups(username);

        resolve(fetchVGsPromise);
      }
    });

    // Handles e.g. /job-list.html?vgName=soso
    Promise.all([getAuthenticatedJobsPromise, getAuthorizedVGsPromise, getJobLifeHour()]).then(vals => {
      const [authenticatedJobs, vgSet, jobsLifeHourList] = vals;

      const allJobs = authenticatedJobs.map(job => {
        const findHasLifeHour = jobsLifeHourList.find(item => item.name === job.name)
        return { ...job, lifeHour: findHasLifeHour ? findHasLifeHour?.lifeHour : '-' }
      })

      // Filter by vg
      if (vgSet.size === 0 || admin) {
        // Case: admin has no vgSet
        setAllJobs(allJobs);
      } else {
        setAllJobs(filter.apply(allJobs || []));
      }
    }).catch(err => {
      toast.error(err.message);
    });
  }, []);

  useEffect(refreshJobs, []);

  const context = {
    allJobs,
    refreshJobs,
    filteredJobs,
    selectedJobs,
    setSelectedJobs,
    stopJob,
    deleteJob,
    username,
    filter,
    setFilter,
    ordering,
    setOrdering
  };

  return (
    <Context.Provider value={context}>
      <BreadCrumbs />

      {/* 上方的控制bar */}
      <TopBar/>

      <div
        className={`
        ${classes.d_flex}
        ${classes.directionColumn}
        ${classes.pos_rel}
        ${classes.h_full}
        ${classes.overflowHidden}
        `}
      >
        <BasePaper
          columns={[
            applySortProps({
              id: 'name',
              key: 'name',
              label: t('name'),
              onTableCellRender: (job) => {
                const { name, namespace, username } = job;
                return <BaseLink to={`/job-detail/${name}?username=${namespace || username}&jobName=${name}`}>{name}</BaseLink>;
              }
            }),
            applySortProps({
              id: 'modified',
              key: 'modified',
              label: `${t('Submission')}${t('enSpace')}${t('time')}`,
              onTableCellRender: (job) => {
                // getModified(job) from utils
                return <span>{moment(job.createdTime).format('YYYY/MM/DD HH:mm:ss')}</span>
              }
            }),
            applySortProps({
              id: 'user',
              key: 'user',
              label: t('User'),
              onTableCellRender: (job) => job.username
            }),
            applySortProps({
              id: 'remain',
              key: 'remain',
              label: t('remainTime'),
              onTableCellRender: (job) => {
                if (job.lifeHour === '-') {
                  return '-';
                } else {
                  const createTime = job.createdTime;
                  const lifeHourTimeStamp = job.lifeHour === null ? 0 : (job.lifeHour * (3600 * 1000));
                  const reserveTimeToCloseJob = lifeHourTimeStamp + createTime;

                  const condition = ['WAITING', 'RUNNING']
                  const isJobClosing = condition.includes(job.state)
                  const isJobStopped = job.state === 'STOPPED';

                  if ((reserveTimeToCloseJob <= +new Date() && isJobClosing) || isJobStopped) {
                    return (
                      <div>-</div>
                    )
                  }

                  const durations = getDateDiff(reserveTimeToCloseJob);
                  const text = `${durations.days !== 0 ? `${durations.days}d ` : ''}${durations.hours !== 0 ? `${durations.hours}h ` : ''}${durations.minutes !== 0 ? `${durations.minutes}m ` : ''}${durations.seconds !== 0 ? `${durations.seconds}s ` : ''}`
                  const color = durations.days === 0 ? 'red' : ''
                  return (
                    <div style={{ color }}>
                      {text}
                    </div>
                  );
                }
              }
            }),
            applySortProps({
              id: 'lifeHour',
              key: 'lifeHour',
              label: `${t('lifeHour')}(${t('hour')})`,
              onTableCellRender: (job) => job.lifeHour
            }),
            applySortProps({
              id: 'virtualGroup',
              key: 'virtualGroup',
              label: t('group'),
              onTableCellRender: (job) => job?.description?.virtualGroup
            }),
            applySortProps({
              id: 'totalCPU',
              key: 'totalCPU',
              label: 'CPU',
              onTableCellRender: (job) => job?.description?.totalCPU
            }),
            applySortProps({
              id: 'totalMemory',
              key: 'totalMemory',
              label: `${t('memory')}`,
              onTableCellRender: (job) => job?.description?.totalMemory ? formatBytes(job?.description?.totalMemory * MB) : ''
            }),
            applySortProps({
              id: 'gpuCount',
              key: 'gpuCount',
              label: t('GPU'),
              onTableCellRender: (job) => job.totalGpuNumber
            }),
            applySortProps({
              id: 'status',
              key: 'status',
              label: t('status'),
              onTableCellRender: (job) => {
                const condition = ['WAITING', 'RUNNING']
                const status = condition.includes(job.state) && job.executionType === 'STOP' ? 'Stopping'
                  : job.state[0] + job.state.toLowerCase().substring(1, job.state.length)
                return (
                  <StatusBadge
                    containerStyle={{ display: 'flex', padding: '5px', justifyContent: 'center', alignItems: 'center', position: 'relative', width: '100%' }}
                    status={status}
                    trans={t}
                  />
                );
              }
            }),
            {
              id: 'actions',
              key: 'actions',
              label: t('Operations'),
              onTableCellRender: (job) => {
                const isDelete = ['FAILED', 'STOPPED', 'SUCCEEDED'].includes(job.state);
                const isAdmin = userInfo.admin === 'true';

                const options = [{
                  id: 'setLifeHour',
                  key: 'setLifeHour',
                  label: t('setLifeHour'),
                  handleItemclick: () => {
                    setClickedJob(job);
                    setIsOpen(true);
                  },
                  icon: <Icon style={{ marginRight: '10px' }}>schedule</Icon>
                }]

                return (
                  <SplitButton
                    disabled={isDelete && !isAdmin}
                    onClick={() => {
                      setClickedJob(job);
                      isDelete ? setIsDeleteModalOpen(true) : setIsStopModalOpen(true);
                    }}
                    options={
                      isAdmin && job.state === 'RUNNING' && job.executionType === 'START'
                        ? options
                        : []
                    }
                    startIcon={
                      isDelete
                        ? <BaseMuiIcon>delete</BaseMuiIcon>
                        : <Icon>stop</Icon>
                    }
                    text={isDelete ? t('delete') : t('Stop')}
                  />
                );
              }
            }
          ]}
          labelRowsPerPage={t('labelRowsPerPage')}
          ordering={ordering}
          page={page}
          rows={ordering.apply(filteredJobs || [])}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
      {
        isOpen &&
        <TimeModal
          isOpen={isOpen}
          job={clickedJob}
          onClose={() => setIsOpen(false)}
        />
      }
      {
        isDeleteModalOpen &&
        <ConfirmModal
          confrimText={t('delete')}
          content={t('sureDelete', { name: clickedJob.name })}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => deleteJob(clickedJob)}
          title={`${t('delete')}${t('enSpace')}${t('job')}`}
        />
      }
      {
        isStopModalOpen &&
        <ConfirmModal
          confrimText={t('Stop')}
          content={t('stopJobMsg')}
          isOpen={isStopModalOpen}
          onClose={() => setIsStopModalOpen(false)}
          onConfirm={() => stopJob(clickedJob)}
          title={`${t('Stop')}${t('enSpace')}${t('job')}`}
        />
      }
    </Context.Provider>
  );
}
