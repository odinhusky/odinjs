import { getHardwareInfoRange } from 'utils/api';
import { parseNormalFormat, parseMBFormat, createCsvFile } from '../../utils';
import { isEmpty } from 'lodash';
import moment from 'moment';

export const computeJobOverviewData = (resource, jobs, t) => {
  const { cpuTotal, memoryTotal, gpuTotal } = resource

  let cpuData = [];
  let gpuData = [];
  let ramData = [];
  let cpuUsed = 0;
  let gpuUsed = 0;
  let ramUsed = 0;

  jobs.forEach(job => {
    cpuData = [...cpuData, { name: job.name, y: job.description.totalCPU / cpuTotal, text: `${job.description.totalCPU}/${cpuTotal}` }]
    gpuData = [...gpuData, { name: job.name, y: job.totalGpuNumber / gpuTotal, text: `${job.totalGpuNumber}/${gpuTotal}` }]
    ramData = [...ramData, { name: job.name, y: job.description.totalMemory / memoryTotal, text: `${job.description.totalMemory}/${memoryTotal} MB` }]

    cpuUsed += job.description.totalCPU
    gpuUsed += job.totalGpuNumber
    ramUsed += job.description.totalMemory
  })

  if (cpuTotal !== cpuUsed) cpuData = [...cpuData, { name: t('pool'), y: (cpuTotal - cpuUsed) / cpuTotal, text: `${(cpuTotal - cpuUsed)}/${cpuTotal}` }]
  if (gpuTotal !== gpuUsed) gpuData = [...gpuData, { name: t('pool'), y: (gpuTotal - gpuUsed) / gpuTotal, text: `${gpuTotal - gpuUsed}/${gpuTotal}` }]
  if (memoryTotal !== ramUsed) ramData = [...ramData, { name: t('pool'), y: (memoryTotal - ramUsed) / memoryTotal, text: `${memoryTotal - ramUsed}/${memoryTotal} MB` }]

  return { cpuData, gpuData, ramData }
}

export const getJobLayerData = async({ username, job = 'job', type, ...params }) => {
  const avg = `job_name${type === 'taskRole' || type === 'task' ? ', role_name' : ''}${type === 'task' ? ', task_index' : ''}`
  let [cpu, memory, networkIn, networkOut, diskIn, diskOut, gpu, gpuMemory] = await Promise.all([
    getHardwareInfoRange({
      query: `avg by (${avg}) (task_cpu_percent{job_name=~"${username}~${job}"})`,
      ...params
    }),
    getHardwareInfoRange({
      query: `avg by (${avg}) (task_mem_usage_byte{ job_name=~"${username}~${job}"})`,
      ...params
    }),
    getHardwareInfoRange({
      query: `avg by (${avg}) (task_net_in_byte{ job_name=~"${username}~${job}"})`,
      ...params
    }),
    getHardwareInfoRange({
      query: `avg by (${avg}) (task_net_out_byte{ job_name=~"${username}~${job}"})`,
      ...params
    }),
    getHardwareInfoRange({
      query: `avg by (${avg}) (irate(task_block_in_byte{ job_name=~"${username}~${job}"}[300s]))`,
      ...params
    }),
    getHardwareInfoRange({
      query: `avg by (${avg}) (irate(task_block_out_byte{ job_name=~"${username}~${job}"}[300s]))`,
      ...params
    }),
    getHardwareInfoRange({
      query: `avg by (${avg})(task_gpu_percent{ job_name=~"${username}~${job}"})`,
      ...params
    }),
    getHardwareInfoRange({
      query: `avg by (${avg})(task_gpu_mem_percent{ job_name=~"${username}~${job}"})`,
      ...params
    })
  ])

  let taskGPU = null;
  let taskGPUMemory = null;

  if (type === 'task') {
    const [taskGPURes, taskGPUMemRes] = await Promise.all([
      getHardwareInfoRange({
        query: `avg by (job_name, role_name,task_index, minor_number)(task_gpu_percent{job_name=~"${username}~${job}"})`,
        ...params
      }),
      getHardwareInfoRange({
        query: `avg by (job_name, role_name,task_index, minor_number)(task_gpu_mem_percent{job_name=~"${username}~${job}"})`,
        ...params
      })
    ])

    taskGPU = taskGPURes.data.result.map(item => ({
      jobName: item.metric.job_name,
      minorNumber: item.metric.minor_number,
      roleName: item.metric.role_name,
      taskIndex: item.metric.task_index,
      value: item.values.map(value => value.map(parseNormalFormat))
    }))
    taskGPUMemory = taskGPUMemRes.data.result.map(item => ({
      jobName: item.metric.job_name,
      minorNumber: item.metric.minor_number,
      roleName: item.metric.role_name,
      taskIndex: item.metric.task_index,
      value: item.values.map(value => value.map(parseNormalFormat))
    }))
  }

  cpu = !isEmpty(cpu.data.result[0]) ? cpu.data.result[0].values.map(value => value.map(parseNormalFormat)) : []
  memory = !isEmpty(memory.data.result[0]) ? memory.data.result[0].values.map(value => value.map(parseMBFormat)) : []
  networkIn = !isEmpty(networkIn.data.result[0]) ? networkIn.data.result[0].values.map(value => value.map(parseMBFormat)) : []
  networkOut = !isEmpty(networkOut.data.result[0]) ? networkOut.data.result[0].values.map(value => value.map(parseMBFormat)) : []
  diskIn = !isEmpty(diskIn.data.result[0]) ? diskIn.data.result[0].values.map(value => value.map(parseMBFormat)) : []
  diskOut = !isEmpty(diskOut.data.result[0]) ? diskOut.data.result[0].values.map(value => value.map(parseMBFormat)) : []
  gpu = !isEmpty(gpu.data.result[0]) ? gpu.data.result[0].values.map(value => value.map(parseNormalFormat)) : []
  gpuMemory = !isEmpty(gpuMemory.data.result[0]) ? gpuMemory.data.result[0].values.map(value => value.map(parseNormalFormat)) : []

  return {
    cpu,
    memory,
    networkIn,
    networkOut,
    diskIn,
    diskOut,
    gpu,
    gpuMemory,
    taskGPU,
    taskGPUMemory
  }
}

const handleOverviewData = (resourceData, jobRawData, t) => {
  const { cpuTotal, memoryTotal, gpuTotal } = resourceData
  const header = 'Name,CPU,GPU,RAM(MB)\n'
  let body = ''
  jobRawData.filter(job => job.state === 'RUNNING').forEach(el => {
    body += `${el.name},${el.description.totalCPU},${el.totalGpuNumber},${el.description.totalMemory}\n`
  });

  body += `${t('pool')},${cpuTotal},${memoryTotal},${gpuTotal}\n`

  return header + body + '\n'
}

const handleChartData = (jobName, data) => {
  const header = `${jobName}\nTime,CPU,Memory Total,GPU Used,GPU Memory,Network Receive,Network Transmit,Disk Read,Disk Written,${data.taskGPU ? data.taskGPU.reduce((acc, curr) => acc += `GPU ${curr.minorNumber} by ${curr.roleName},`, '') : ''}${data.taskGPU ? data.taskGPU.reduce((acc, curr) => acc += `GPU Memory ${curr.minorNumber} by ${curr.roleName},`, '') : ''}\n`;
  let body = ''

  data.cpu && data.cpu.forEach((el, idx) => {
    const [time, val] = el;
    const [, memoryTotal] = data['memory'][idx]
    const [, gpuUsed] = !isEmpty(data['gpu']) ? data['gpu'][idx] : ['', '']
    const [, gpuMemory] = !isEmpty(data['gpuMemory']) ? data['gpuMemory'][idx] : ['', '']
    const [, networkReceive] = data['networkIn'][idx]
    const [, networkTransmit] = data['networkOut'][idx]
    const [, diskRead] = data['diskIn'] && data['diskIn'][idx] ? data['diskIn'][idx] : [0, 0]
    const [, diskWritten] = data['diskOut'] && data['diskOut'][idx] ? data['diskOut'][idx] : [0, 0]
    const taskGPU = data['taskGPU'] ? data['taskGPU'].reduce((acc, curr) => acc += `${curr.value[idx][1]}%,`, '') : ''
    const taskGPUMemory = data['taskGPUMemory'] ? data['taskGPUMemory'].reduce((acc, curr) => acc += `${curr.value[idx][1]}%,`, '') : ''
    body += `${moment(time).format('YYYY/MM/DD HH:mm:ss')},${val}%,${memoryTotal.toFixed(2)}MB,${gpuUsed}%,${gpuMemory}%,${networkReceive.toFixed(2)}MB/s,${networkTransmit.toFixed(2)}MB/s,${diskRead.toFixed(2)}MB/s,${diskWritten.toFixed(2)}MB/s,${taskGPU}${taskGPUMemory}\n`
  })

  return header + body
}

export const exportCsv = ({ resourceData, jobRawData, chartData, t, jobName }) => {
  if (resourceData === undefined) {
    createCsvFile(`${jobName ? jobName : 'job'}.csv`, handleChartData(jobName, chartData))
  } else {
    createCsvFile(`${jobName ? jobName : 'job'}.csv`, handleOverviewData(resourceData, jobRawData, t) + handleChartData(jobName, chartData))
  }
}

export const computeTotalResourceData = (data, resourceUnits) => {
  const { cpuTotal, memoryTotal, gpuTotal } = data.reduce((acc, { cells }) => {
    const { cpu, memory, gpu } = Object.entries(cells).reduce((acc, [, details]) => {
      const { resourceUnit: unit, number } = details
      const { cpu, memory, gpu } = resourceUnits[unit];
      return {
        cpu: acc.cpu + cpu * number,
        memory: acc.memory + memory * number,
        gpu: acc.gpu + gpu * number
      }
    }, { cpu: 0, memory: 0, gpu: 0 })

    return {
      cpuTotal: acc.cpuTotal + cpu,
      memoryTotal: acc.memoryTotal + memory,
      gpuTotal: acc.gpuTotal + gpu
    }
  }, { cpuTotal: 0, memoryTotal: 0, gpuTotal: 0 })

  return { ...data, cpuTotal, memoryTotal, gpuTotal }
}
