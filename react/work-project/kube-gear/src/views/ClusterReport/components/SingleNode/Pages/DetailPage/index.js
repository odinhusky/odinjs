import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// import moment from 'moment';

import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import BasePanel from 'components/BasePanel';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import BaseScrollPane from 'components/BaseScrollPane';
import CycleBar from './CycleBar';
import UseRate from './UseRate';
import HostTaskInfo from './HostTaskInfo';

import { computeDayRange, parseMBFormat, parseKBFormat, parseNormalFormat } from '../../../../utils';
import { getHardwareInfoRange } from 'utils/api';
import { exportCsv } from './utils';

import tabStyles from './index.module.scss';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  heightAuto: {
    height: 'auto'
  }
}))

const SingleNodeDetail = (props) => {
  const { setIsIndexPage, isIndexPage } = props
  const { t } = useTranslation();
  const classes = useStyles();
  const [cycle, setCycle] = useState({ key: '15min' });
  const [rawTotalUseRate, setRawTotalUseRate] = useState();
  const [totalUseRate, setTotalUseRate] = useState();

  const [totalOptionTask, setTotalOptionTask] = useState([]);
  const [totalOptionJobandRole, setTotalOptionJobandRole] = useState([]);
  // const [selectedKeys, setSelectedKeys] = useState([]);

  const [totalTask, setTotalTask] = useState([]); // for HostTaskInfo Table

  const [selectedJobandRole, setSelectedJobandRole] = useState([]);
  // const [selectedNameOfJobandRole, setSelectedNameOfJobandRole] = useState([]);

  const getTotalTask = (hostInstance, cycle) => {
    const query = computeDayRange(cycle)
    getHardwareInfoRange({
      query: `task_cpu_percent{instance=~"${hostInstance}(:[0-9]*)?$"}`,
      ...query
    }).then(host => {
      const allOptionName = host.data.result.map(item => item.metric.job_name)
      const filterRepeatOptionTask = allOptionName.filter((element, index, arr) => arr.indexOf(element) === index)
      const allOptionTask = filterRepeatOptionTask.map((item, index) => (
        {
          key: index,
          text: item,
          name: item,
          selected: false
        }
      ))
      const allTask = host.data.result.map(item => {
        return (
          {
            job_name: item.metric.job_name,
            jobAndRole_name: `${item.metric.job_name} - ${item.metric.role_name}`,
            role_name: item.metric.role_name,
            task_index: item.metric.task_index,
            username: item.metric.username
          }
        )
      })
      setTotalOptionTask(allOptionTask)
      setTotalTask(allTask)
    })
  }

  const getSelectedJob = (host, jobName) => {
    const query = computeDayRange(cycle);
    getHardwareInfoRange({
      query: `task_cpu_percent{instance=~"${host}(:[0-9]*)?$",job_name=~"^(${jobName})$"}`,
      ...query
    }).then(job => {
      const allOptionJobAndRole = job.data.result.map((item, index) => (
        {
          key: index,
          text: `${item.metric.role_name} - ${item.metric.task_index}`,
          task_index: item.metric.task_index,
          role_name: item.metric.role_name,
          job_name: item.metric.job_name
        }
      ))
      setTotalOptionJobandRole(allOptionJobAndRole)
    })
  }

  const getSelectedUseRate = (selectedJobandRole) => {
    const query = computeDayRange(cycle);
    Promise.all(selectedJobandRole.map(item => {
      return new Promise((reslove) => {
        const job_name = item.job_name;
        const role_name = item.role_name;
        const index = item.task_index;
        Promise.all([
          getHardwareInfoRange({
            query: `task_cpu_percent{instance=~"${isIndexPage.host}(:[0-9]*)?$",job_name=~"^(${job_name})$",role_name=~"^(${role_name})$",task_index=~"^(${index})$"}`,
            ...query
          }),
          getHardwareInfoRange({
            query: `task_mem_usage_byte{instance=~"${isIndexPage.host}(:[0-9]*)?$",job_name=~"^(${job_name})$",role_name=~"^(${role_name})$",task_index=~"^(${index})$"}`,
            ...query
          }),
          getHardwareInfoRange({
            query: `task_gpu_percent{instance=~"${isIndexPage.host}(:[0-9]*)?$",job_name=~"^(${job_name})$",role_name=~"^(${role_name})$",task_index=~"^(${index})$"}`,
            ...query
          }),
          getHardwareInfoRange({
            query: `task_gpu_mem_percent{instance=~"${isIndexPage.host}(:[0-9]*)?$",job_name=~"^(${job_name})$",role_name=~"^(${role_name})$",task_index=~"^(${index})$"}`,
            ...query
          }),
          getHardwareInfoRange({
            query: `irate(task_block_in_byte{instance=~"${isIndexPage.host}(:[0-9]*)?$",job_name=~"^(${job_name})$",role_name=~"^(${role_name})$",task_index=~"^(${index})$"}[300s])`,
            ...query
          }),
          getHardwareInfoRange({
            query: `irate(task_block_out_byte{instance=~"${isIndexPage.host}(:[0-9]*)?$",job_name=~"^(${job_name})$",role_name=~"^(${role_name})$",task_index=~"^(${index})$"}[300s])`,
            ...query
          }),
          getHardwareInfoRange({
            query: `task_net_in_byte{instance=~"${isIndexPage.host}(:[0-9]*)?$",job_name=~"^(${job_name})$",role_name=~"^(${role_name})$",task_index=~"^(${index})$"}`,
            ...query
          }),
          getHardwareInfoRange({
            query: `task_net_out_byte{instance=~"${isIndexPage.host}(:[0-9]*)?$",job_name=~"^(${job_name})$",role_name=~"^(${role_name})$",task_index=~"^(${index})$"}`,
            ...query
          })
        ]).then(([cpu, taskMemoryTotal, gpu, gpuMemory, taskBlockIn, taskBlockOut, taskNetIn, taskNetOut]) => {
          cpu = cpu.data.result.map(item => {
            const name = `${item.metric.job_name} - ${item.metric.role_name} - ${item.metric.task_index}`
            const data = item.values.map(item => item.map(parseNormalFormat))
            return (
              { name, data }
            )
          })
          taskMemoryTotal = taskMemoryTotal.data.result.map(item => {
            const name = `${item.metric.job_name} - ${item.metric.role_name} - ${item.metric.task_index}`
            const data = item.values.map(item => item.map(parseMBFormat))
            return (
              { name, data }
            )
          })
          gpu = gpu.data.result.map(item => {
            const name = `${item.metric.job_name} - ${item.metric.role_name} - ${item.metric.task_index}`
            const data = item.values.map(item => item.map(parseNormalFormat))
            return (
              { name, data }
            )
          })
          gpuMemory = gpuMemory.data.result.map(item => {
            const name = `${item.metric.job_name} - ${item.metric.role_name} - ${item.metric.task_index}`
            const data = item.values.map(item => item.map(parseNormalFormat))
            return (
              { name, data }
            )
          })
          taskBlockIn = taskBlockIn.data.result.map(item => {
            const name = `${item.metric.job_name} - ${item.metric.role_name} - ${item.metric.task_index}`
            const role_name = item.metric.role_name
            const data = item.values.map(item => item.map(parseMBFormat))
            return (
              { name, role_name, data }
            )
          })
          taskBlockOut = taskBlockOut.data.result.map(item => {
            const name = `${item.metric.job_name} - ${item.metric.role_name} - ${item.metric.task_index}`
            const role_name = item.metric.role_name
            const data = item.values.map(item => item.map(parseMBFormat))
            return (
              { name, role_name, data }
            )
          })
          taskNetIn = taskNetIn.data.result.map(item => {
            const name = `${item.metric.job_name} - ${item.metric.role_name} - ${item.metric.task_index}`
            const data = item.values.map(item => item.map(parseKBFormat))
            return (
              { name, data }
            )
          })
          taskNetOut = taskNetOut.data.result.map(item => {
            const name = `${item.metric.job_name} - ${item.metric.role_name} - ${item.metric.task_index}`
            const data = item.values.map(item => item.map(parseKBFormat))
            return (
              { name, data }
            )
          })
          reslove({ cpu, taskMemoryTotal, gpu, gpuMemory, taskBlockIn, taskBlockOut, taskNetIn, taskNetOut })
        })
      })
    }))
      .then(
        result => {
          setRawTotalUseRate(result)
          return result.reduce((accumulator, current) => {
            Object.keys(accumulator).forEach(key => {
              accumulator[key] = accumulator[key].concat(current[key]);
            });
            return accumulator;
          }, {
            cpu: [],
            gpu: [],
            gpuMemory: [],
            taskBlockIn: [],
            taskBlockOut: [],
            taskMemoryTotal: [],
            taskNetIn: [],
            taskNetOut: []
          })
        })
      .then(
        (result) => setTotalUseRate(result)
      );
  }

  useEffect(() => {
    if (isIndexPage.host === undefined) return;

    setTotalOptionTask([])
    setTotalTask([])

    if (cycle.key !== 'custom') {
      getTotalTask(isIndexPage.host, cycle)
    } else if (cycle.key === 'custom' && (cycle.end !== undefined)) {
      getTotalTask(isIndexPage.host, cycle)
    }
  }, [isIndexPage.host, cycle])

  return (
    <div>
      <div>
        <div className={tabStyles.title}>
          {isIndexPage.host} {t('Jobs')}{t('enSpace')}{t('status')}
          <DefaultButton
            children={t('back')}
            onClick={() => {
              setIsIndexPage({
                index: true,
                host: ''
              })
            }}
            startIcon={<Icon>arrow_back</Icon>}
          />
        </div>
      </div>
      <div>
        <CycleBar
          getSelectedJob={getSelectedJob}
          getSelectedUseRate={getSelectedUseRate}
          isIndexPage={isIndexPage}
          selectedJobandRole={selectedJobandRole}
          // selectedKeys={selectedKeys}
          // selectedNameOfJobandRole={selectedNameOfJobandRole}
          setCycle={setCycle}
          setSelectedJobandRole={setSelectedJobandRole}
          // setSelectedKeys={setSelectedKeys}
          // setSelectedNameOfJobandRole={setSelectedNameOfJobandRole}
          totalOptionJobandRole={totalOptionJobandRole}
          totalOptionTask={totalOptionTask}
        />
      </div>
      <div>
        <PrimaryButton
          children={`${t('Export')}${t('enSpace')}Excel`}
          classes={{
            root: classes.marginRight10,
            startIcon: classes.iconClearMarginLeft
          }}
          disabled={rawTotalUseRate === undefined}
          onClick={() => exportCsv({ rawTotalUseRate, jobName: selectedJobandRole[0].job_name })}
          startIcon={<Icon>file_download</Icon>}
        />
        <DefaultButton
          children={t('refresh')}
          onClick={() => {
            getSelectedUseRate(selectedJobandRole)
          }}
          startIcon={<Refresh />}
        />
      </div>
      <div>
        <BasePanel
          contentStyle={{ height: '260px' }}
          style={{ paddingTop: 20 }}
          title={`${t('GPU')}${t('enSpace')}${t('info')}`}
        >
          <BaseScrollPane>
            <HostTaskInfo
              data={totalTask !== undefined ? totalTask : []}
            />
          </BaseScrollPane>
        </BasePanel>
      </div>
      <div className={tabStyles.pt20}>
        <BasePanel
          style={{ paddingTop: 20 }}
          title={t('Utilization')}
        >
          <UseRate
            data={totalUseRate !== undefined ? totalUseRate : {}}
          />
        </BasePanel>
      </div>
    </div>
  );
};

SingleNodeDetail.propTypes = {
  setIsIndexPage: PropTypes.func,
  isIndexPage: PropTypes.object
}


export default SingleNodeDetail;
