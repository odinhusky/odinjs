import { getHardwareInfoRange } from 'utils/api';
import { parseNormalFormat, parseMBFormat, parseKBFormat, createCsvFile } from '../../utils';
import moment from 'moment';
import { isEmpty } from 'lodash';

export const computeUserOveriewData = (resource, jobs, t, topNuser) => {
  const { cpuTotal, memoryTotal, gpuTotal } = resource

  let cpuData = [];
  let gpuData = [];
  let ramData = [];
  let cpuUsed = 0;
  let gpuUsed = 0;
  let ramUsed = 0;

  function getTopNArray(sortdata, Pool, topNuser) {
    if (sortdata.length <= topNuser) {
      return [...sortdata, Pool]
    } else {
      const pool = Pool
      const result = sortdata.slice(0, topNuser)
      const otherdata = sortdata.slice(topNuser)
      otherdata.forEach(job => {
        pool.y += job.y
        pool.text += job.text
      })
      return [...result, pool]
    }
  }

  function mixSameNameData(data) {
    const ans = []
    for (let i = 0; i < data.length; i++) {
      const findSameName = ans.find(element => element.name === data[i].name)
      if (findSameName === undefined) {
        ans.push(data[i])
      } else {
        findSameName.y += data[i].y
        findSameName.text += data[i].text
      }
    }
    return ans.map(data => {
      const fixedText = `${(data.text * 100).toFixed(1)} %`
      return { ...data, text: fixedText }
    })
  }

  jobs.forEach(job => {
    cpuData = [...cpuData, { name: job.username, y: job.description.totalCPU / cpuTotal, text: job.description.totalCPU / cpuTotal }]
    gpuData = [...gpuData, { name: job.username, y: job.totalGpuNumber / gpuTotal, text: job.totalGpuNumber / gpuTotal }]
    ramData = [...ramData, { name: job.username, y: job.description.totalMemory / memoryTotal, text: job.description.totalMemory / memoryTotal }]

    cpuUsed += job.description.totalCPU
    gpuUsed += job.totalGpuNumber
    ramUsed += job.description.totalMemory
  })


  cpuData = mixSameNameData(cpuData)
  gpuData = mixSameNameData(gpuData)
  ramData = mixSameNameData(ramData)

  const sortCpuData = cpuData.sort((a, b) => (a.y > b.y) ? -1 : ((b.y > a.y) ? 1 : 0));
  const sortGpuData = gpuData.sort((a, b) => (a.y > b.y) ? -1 : ((b.y > a.y) ? 1 : 0));
  const sortramData = ramData.sort((a, b) => (a.y > b.y) ? -1 : ((b.y > a.y) ? 1 : 0));

  const cpuPool = { name: t('pool'), y: (cpuTotal - cpuUsed) / cpuTotal, text: `${(((cpuTotal - cpuUsed) / cpuTotal) * 100).toFixed(1)} %` }
  const gpuPool = { name: t('pool'), y: (gpuTotal - gpuUsed) / gpuTotal, text: `${(((gpuTotal - gpuUsed) / gpuTotal) * 100).toFixed(1)} %` }
  const ramPool = { name: t('pool'), y: (memoryTotal - ramUsed) / memoryTotal, text: `${(((memoryTotal - ramUsed) / memoryTotal) * 100).toFixed(1)} %` }

  return {
    cpuData: getTopNArray(sortCpuData, cpuPool, topNuser),
    gpuData: getTopNArray(sortGpuData, gpuPool, topNuser),
    ramData: getTopNArray(sortramData, ramPool, topNuser)
  }
}

export const getUseData = async (parma) => {
  let [cpu, cpuMemory, gpu, gpuMemory, diskIn, diskOut, networkIn, networkOut] = await Promise.all([
    getHardwareInfoRange({
      query: 'task_cpu_percent',
      ...parma
    }),
    getHardwareInfoRange({
      query: 'task_mem_usage_byte',
      ...parma
    }),
    getHardwareInfoRange({
      query: 'task_gpu_percent',
      ...parma
    }),
    getHardwareInfoRange({
      query: 'task_gpu_mem_percent',
      ...parma
    }),
    getHardwareInfoRange({
      query: 'irate(task_block_in_byte[300s])',
      ...parma
    }),
    getHardwareInfoRange({
      query: 'irate(task_block_out_byte[300s])',
      ...parma
    }),
    getHardwareInfoRange({
      query: 'task_net_in_byte',
      ...parma
    }),
    getHardwareInfoRange({
      query: 'task_net_out_byte',
      ...parma
    })
  ])

  cpu = cpu.data.result.map(item => ({
    ...item,
    values: item.values.map(value => value.map(parseNormalFormat))
  }))

  cpuMemory = cpuMemory.data.result.map(item => {
    const data = item.values.map(value => value.map(parseMBFormat))
    return {
      ...item,
      values: data
    }
  })
  gpu = gpu.data.result.map(item => {
    const data = item.values.map(value => value.map(parseNormalFormat))
    return {
      ...item,
      values: data
    }
  })
  gpuMemory = gpuMemory.data.result.map(item => {
    const data = item.values.map(value => value.map(parseNormalFormat))
    return {
      ...item,
      values: data
    }
  })
  diskIn = diskIn.data.result.map(item => {
    const data = item.values.map(value => value.map(parseMBFormat))
    return {
      ...item,
      values: data
    }
  })
  diskOut = diskOut.data.result.map(item => {
    const data = item.values.map(value => value.map(parseMBFormat))
    return {
      ...item,
      values: data
    }
  })
  networkIn = networkIn.data.result.map(item => {
    const data = item.values.map(value => value.map(parseKBFormat))
    return {
      ...item,
      values: data
    }
  })
  networkOut = networkOut.data.result.map(item => {
    const data = item.values.map(value => value.map(parseKBFormat))
    return {
      ...item,
      values: data
    }
  })

  return { cpu, cpuMemory, gpu, gpuMemory, diskIn, diskOut, networkIn, networkOut }
}

const handleOverviewData = (resourceData, jobRawData, t) => {
  const header = 'Name,CPU,GPU,RAM(MB)\n'
  let body = ''
  jobRawData.filter(job => job.state === 'RUNNING').forEach(el => {
    body += `${el.name},${el.description.totalCPU},${el.totalGpuNumber},${el.description.totalMemory}\n`
  });

  body += `${t('pool')},${resourceData.cpuTotal},${resourceData.gpuTotal},${resourceData.memoryTotal}\n`

  return header + body + '\n'
}

const handleChartData = (jobName, data) => {
  const header = `${jobName}\nTime,CPU,Memory Total,GPU Used,GPU Memory,Network Receive,Network Transmit,Disk Read,Disk Written\n`;
  let body = ''
  data.cpu && data.cpu.forEach((el, idx) => {
    const [time, val] = el;
    const [, memoryTotal] = data['cpuMemory'][idx]
    const [, gpuUsed] = !isEmpty(data['gpu']) ? data['gpu'][idx] : ['', '']
    const [, gpuMemory] = !isEmpty(data['gpuMemory']) ? data['gpuMemory'][idx] : ['', '']
    const [, networkReceive] = data['networkIn'][idx]
    const [, networkTransmit] = data['networkOut'][idx]
    const [, diskRead] = data['diskIn'][idx]
    const [, diskWritten] = data['diskOut'][idx]
    body += `${moment(time).format('YYYY/MM/DD HH:mm:ss')},${val}%,${memoryTotal.toFixed(2)}MB,${gpuUsed}%,${gpuMemory}%,${networkReceive.toFixed(2)}MB/s,${networkTransmit.toFixed(2)}MB/s,${diskRead.toFixed(2)}MB/s,${diskWritten.toFixed(2)}MB/s\n`
  })

  return header + body
}

export const exportCsv = ({ resourceData, jobRawData, lineChartData, t, userName }) => {
  createCsvFile(`${userName ? userName : 'user'}.csv`, handleOverviewData(resourceData, jobRawData, t) + handleChartData(userName, lineChartData))
}

export const computeTotalResourceData = (data, resourceUnits) => {
  const { cpuTotal, memoryTotal, gpuTotal } = Object.entries(data.cells).reduce((acc, [, details]) => {
    const { resourceUnit: unit, number } = details
    const { cpu, memory, gpu } = resourceUnits[unit]

    return {
      cpuTotal: acc.cpuTotal + cpu * number,
      memoryTotal: acc.memoryTotal + memory * number,
      gpuTotal: acc.gpuTotal + gpu * number
    }
  }, { cpuTotal: 0, memoryTotal: 0, gpuTotal: 0 })

  return { ...data, cpuTotal, memoryTotal, gpuTotal }
}
