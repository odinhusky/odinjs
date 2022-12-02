import { createCsvFile } from '../../../../utils';

import moment from 'moment';

const handleChartData = (jobName, data) => {
  const header = `${jobName}\nTime,CPU,Memory Total,GPU Used,GPU Memory,Network Receive,Network Transmit,Disk Read,Disk Written\n`;

  let body = '';
  data.forEach((element) => {
    body += `${element.cpu[0].name}\n`
    element.cpu[0].data.forEach((el, idx) => {
      const [time, val] = el;
      const [, gpu] = element.gpu.length > 0 ? element.gpu[0].data[idx] : ['', '']
      const [, gpuMemory] = element.gpuMemory > 0 ? element.gpu[0].data[idx] : ['', '']
      const [, taskMemoryTotal] = element.taskMemoryTotal[0].data[idx]
      const [, taskBlockIn] = element.taskBlockIn[0].data[idx]
      const [, taskBlockOut] = element.taskBlockOut[0].data[idx]
      const [, taskNetIn] = element.taskNetIn[0].data[idx]
      const [, taskNetOut] = element.taskNetOut[0].data[idx]
      body += `${moment(time).format('YYYY/MM/DD HH:mm:ss')},${val.toFixed(2)}%,${taskMemoryTotal.toFixed(2)}MB,${gpu}%,${gpuMemory}%,${taskNetIn.toFixed(2)}MB/s,${taskNetOut.toFixed(2)}MB/s,${taskBlockOut.toFixed(2)}MB/s,${taskBlockIn.toFixed(2)}MB/s\n`
    })
  })
  return header + body + '\n'
}

export const exportCsv = ({ rawTotalUseRate, jobName }) => {
  createCsvFile(`${jobName ? jobName : 'jobName'}.csv`, handleChartData(jobName, rawTotalUseRate))
}
