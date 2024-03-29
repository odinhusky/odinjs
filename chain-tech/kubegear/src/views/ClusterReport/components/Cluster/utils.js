import { createCsvFile } from '../../utils';
import moment from 'moment';

export const computeVgOverviewData = (data, resource, t) => {
  let cpuData = [];
  let gpuData = [];
  let ramData = [];
  let sumCpuUsed = 0;
  let sumGpuUsed = 0;
  let sumRamUsed = 0;

  const {
    cpu: cpuTotal,
    memory: memoryTotal,
    gpu: gpuTotal
  } = Object.entries(resource.cells).reduce((acc, [key, { number }]) => {
    return {
      ...acc,
      [key]: number
    }
  }, { cpu: 0, gpu: 0, memory: 0 });

  data.forEach(vg => {
    const {
      cpu: cpuUsed,
      memory: ramUsed,
      gpu:gpuUsed
    } = Object.entries(vg.usedCells).reduce((acc, [key, number]) => {
      return {
        ...acc,
        [key]: number
      }
    }, { cpu: 0, gpu: 0, memory: 0 })

    cpuData = [...cpuData, { name: vg.name, y: cpuUsed / cpuTotal, text: `${(cpuTotal - cpuUsed)}/${cpuTotal}` }]
    ramData = [...ramData, { name: vg.name, y: ramUsed / memoryTotal, text: `${memoryTotal - ramUsed}/${memoryTotal}` }]
    gpuData = [...gpuData, { name: vg.name, y: gpuUsed / gpuTotal, text: `${gpuTotal - gpuUsed}/${gpuTotal}` }]

    sumCpuUsed += cpuUsed
    sumGpuUsed += gpuUsed
    sumRamUsed += ramUsed
  })

  if (cpuTotal !== sumCpuUsed) {
    cpuData = [...cpuData, { name: t('pool'), y: (cpuTotal - sumCpuUsed) / cpuTotal, text: `${(cpuTotal - sumCpuUsed)}/${cpuTotal}` }]
    gpuData = [...gpuData, { name: t('pool'), y: (gpuTotal - sumGpuUsed) / gpuTotal, text: `${gpuTotal - sumGpuUsed}/${gpuTotal}` }]
    ramData = [...ramData, { name: t('pool'), y: (memoryTotal - sumRamUsed) / memoryTotal, text: `${memoryTotal - sumRamUsed}/${memoryTotal}` }]
  }

  return { cpuData, gpuData, ramData }
}

export const computeVgOverviewDataForExportCsv = (data) => {
  return data.map(item => {
    const {
      cpu: cpuTotal,
      memory: memoryTotal,
      gpu: gpuTotal
    } = Object.entries(item.cells).reduce((acc, [key, { number }]) => {
      return {
        ...acc,
        [key]: number
      }
    }, { cpu: 0, gpu: 0, memory: 0 })

    return { ...item, cpuTotal, memoryTotal, gpuTotal }
  })
}

const handleOverviewData = overviewData => {
  const overViewHeader = 'Name,CPU,RAM(MB),GPU\n'
  let overViewBody = ''
  overviewData.forEach(el => {
    overViewBody += `${el.name},${el.cpuTotal},${el.memoryTotal},${el.gpuTotal}\n`
  });

  return overViewHeader + overViewBody + '\n'
}

const handleUseRateData = useRateData => {
  const header = 'UseRate\nTime,CPU,Memory Total,Memory Used, Memory Buffer,GPU Used,GPU Memory,Network Receive,Network Transmit,Disk Read,Disk Written\n';
  let body = ''
  useRateData['cpu'].map((cpu, idx) => {
    const [time, val] = cpu;
    const [, memoryTotal] = useRateData['memoryTotal'][idx]
    const [, memoryUsed] = useRateData['memoryUsed'][idx]
    const [, memoryBuffer] = useRateData['memoryBuffer'][idx]
    const [, gpuUsed] = useRateData['gpu'][idx]
    const [, gpuMemory] = useRateData['gpuMemory'][idx]
    const [, networkReceive] = useRateData['networkReceive'][idx]
    const [, networkTransmit] = useRateData['networkTransmit'][idx]
    const [, diskRead] = useRateData['diskRead'][idx]
    const [, diskWritten] = useRateData['diskWritten'][idx]
    body += `${moment(time).format('YYYY/MM/DD HH:mm:ss')},${val}%,${memoryTotal.toFixed(2)}GB,${memoryUsed.toFixed(2)}GB,${memoryBuffer.toFixed(2)}GB,${gpuUsed}%,${gpuMemory}%,${networkReceive.toFixed(2)}MB/s,${networkTransmit.toFixed(2)}MB/s,${diskRead.toFixed(2)}MB/s,${diskWritten.toFixed(2)}MB/s\n`
  })

  return header + body
}

export const exportCsv = (overviewData, useRateData) => {
  const csvOverviewData = handleOverviewData(overviewData)
  const csvUseRateData = handleUseRateData(useRateData);

  createCsvFile('cluster.csv', csvOverviewData + csvUseRateData)
}
