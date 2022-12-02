

import { isNil } from 'lodash';
import moment from 'moment';
import { getDateDiff } from 'common/commonMethods'

export function getHumanizedJobStateString(jobInfo) {
  const status = jobInfo?.jobStatus;
  let hjss = '';
  if (status === undefined) {
    hjss = 'Unknown';
  }
  if (status?.state === 'JOB_NOT_FOUND') {
    hjss = 'N/A';
  } else if (status?.state === 'WAITING') {
    if (status.executionType === 'STOP') {
      hjss = 'Stopping';
    } else {
      hjss = 'Waiting';
    }
  } else if (status?.state === 'RUNNING') {
    if (status.executionType === 'STOP') {
      hjss = 'Stopping';
    } else {
      hjss = 'Running';
    }
  } else if (status?.state === 'SUCCEEDED') {
    hjss = 'Succeeded';
  } else if (status?.state === 'FAILED') {
    hjss = 'Failed';
  } else if (status?.state === 'STOPPED') {
    hjss = 'Stopped';
  } else if (status?.state === 'STOPPING') {
    hjss = 'Stopping';
  } else {
    hjss = 'Unknown';
  }
  return hjss;
}

export function getHumanizedJobStateStringZH(jobInfo) {
  const status = jobInfo.jobStatus;
  let hjss = '';
  if (status.state === 'JOB_NOT_FOUND') {
    hjss = 'N/A';
  } else if (status.state === 'WAITING') {
    if (status.executionType === 'STOP') {
      hjss = '停止中';
    } else {
      hjss = '等待中';
    }
  } else if (status.state === 'RUNNING') {
    if (status.executionType === 'STOP') {
      hjss = '停止中';
    } else {
      hjss = '运行';
    }
  } else if (status.state === 'SUCCEEDED') {
    hjss = '成功';
  } else if (status.state === 'FAILED') {
    hjss = '失败';
  } else if (status.state === 'STOPPED') {
    hjss = '停止';
  } else if (status.state === 'STOPPING') {
    hjss = '停止中';
  } else {
    hjss = '未知';
  }
  return hjss;
}

export function getDurationString(jobInfo) {
  const start = moment(jobInfo.jobStatus.createdTime);
  const end = moment(jobInfo.jobStatus.completedTime || moment());
  const duration = moment.duration(end.diff(start));
  const day = duration.days();
  const hour = duration.hours();
  const minute = duration.minutes();
  const second = duration.seconds();

  return `${day > 0 ? `${day}d ` : ''}${hour > 0 ? `${hour}h ` : ''}${minute > 0 ? `${minute}m ` : ''}${second > 0 ? `${second}s ` : ''}`
}

export function getGPUUseTime(jobInfo, jobConfig) {
  if (!jobConfig || !jobConfig.taskRoles) return '-';
  const gpuNumber =  Object.values(jobConfig.taskRoles).reduce((acc, curr) => {
    const { resourcePerInstance, instances } = curr
    const { gpu } = resourcePerInstance
    if (gpu === null || gpu === undefined) {
      return acc
    }
    const calculateGpu = instances * gpu
    return acc += Number(calculateGpu)
  }, 0)
  if (gpuNumber === 0) return '-';

  const start = jobInfo.jobStatus.createdTime;
  const end = jobInfo.jobStatus.completedTime;

  const durations = jobInfo.jobStatus.completedTime === null ? getDateDiff(start) : getDateDiff(start, end);

  let calculateTotleSecond = 0
  let calculateTotleMinute = 0
  let calculateTotleHour = 0
  let calculateTotleDay = 0

  for (let i = 0; i < gpuNumber; i++) {
    calculateTotleSecond += durations.seconds
    calculateTotleMinute += durations.minutes
    calculateTotleHour += durations.hours
    calculateTotleDay += durations.days
  }

  const remainSeconds = calculateTotleSecond % 60;
  const getMinuteBySeconds = Math.floor(calculateTotleSecond / 60);
  const remainMinutes = (calculateTotleMinute + getMinuteBySeconds) % 60;
  const getHourByMinutes = Math.floor((calculateTotleMinute + getMinuteBySeconds) / 60);
  const remainHours = (calculateTotleHour + getHourByMinutes) % 24;
  const getDayByHours = Math.floor((calculateTotleHour + getHourByMinutes) / 24);
  const remainDays = calculateTotleDay + getDayByHours

  const day = remainDays;
  const hour = remainHours;
  const minute = remainMinutes;
  const second = remainSeconds;

  return `${day > 0 ? `${day}d ` : ''}${hour > 0 ? `${hour}h ` : ''}${minute > 0 ? `${minute}m ` : ''}${second > 0 ? `${second}s ` : ''}`
}

export function parseGpuAttr(attr) {
  const res = [];
  for (let i = 0; attr !== 0; i++, (attr >>= 1)) {
    if ((attr & 1) === 1) {
      res.push(i);
    }
  }

  return res;
}

export function isJobV2(jobConfig) {
  return !isNil(jobConfig.protocolVersion);
}

export function isClonable(jobConfig) {
  // disable clone for old yaml job
  // do not support protocol job at present
  return (
    !isNil(jobConfig) &&
    isNil(jobConfig.protocol_version)
  );
}

export function getTaskConfig(jobConfig, name) {
  if (jobConfig && jobConfig.taskRoles) {
    if (isJobV2(jobConfig)) {
      return jobConfig.taskRoles[name];
    } else {
      return jobConfig.taskRoles.find(x => x.name === name);
    }
  } else {
    return null;
  }
}

export function getTemplates() {
  return {
    jobConfig: {
      jobName: 'lenet_test_16b77c66r_16b78c42sss_16b79231aaa_16bdeec_16be0030r',
      image: 'sitonholy/tensorflow:16.04-9.0-3.5-1.8.0',
      authFile: '',
      dataDir: '',
      outputDir: '',
      codeDir: '',
      retryCount: 0,
      taskRoles: [
        {
          name: 'default',
          taskNumber: 1,
          cpuNumber: 1,
          memoryMB: 8192,
          shmMB: 64,
          gpuNumber: 1,
          storageGB: 3,
          minFailedTaskCount: null,
          minSucceededTaskCount: null,
          command: 'cd /root/data/LeNet/code && python mnist_lenet_tf.py',
          portList: []
        }
      ],
      jobEnvs: {},
      extras: {
        virtualGroup: 'total'
      }
    },
    jobInfo: {
      name: 'lenet_test_16b77c66r_16b78c42sss_16b79231aaa_16bdeec_16be0030r',
      jobStatus: {
        description: {
          virtualGroup: 'total'
        },
        username: 'admin',
        state: 'WAITING',
        subState: 'APPLICATION_WAITING',
        executionType: 'START',
        retries: 2,
        retryDetails: {
          user: 0,
          platform: 0,
          resource: 2
        },
        createdTime: 1562831326042,
        completedTime: null,
        appId: 'application_1561711290193_0082',
        appProgress: 0,
        appTrackingUrl: 'http://192.168.0.247:8088/proxy/application_1561711290193_0082/',
        appLaunchedTime: 1562835105895,
        appCompletedTime: null,
        appExitCode: null,
        appExitDiagnostics: null,
        appExitType: null,
        virtualCluster: 'default'
      },
      taskRoles: {
        default: {
          taskRoleStatus: {
            name: 'default'
          },
          taskStatuses: [
            {
              taskIndex: 0,
              taskState: 'WAITING',
              containerId: null,
              containerIp: null,
              containerPorts: {},
              containerGpus: null,
              containerLog: null,
              containerExitCode: null
            }
          ]
        }
      }
    }
  };
}

export const statusColorMapping = {
  waiting: '#F4C700',
  running: '#2959E8',
  succeeded: '#7FBA00',
  unknown: '#B1B5B8',
  failed: '#DD4B39'
};
