import { createCsvFile } from '../../../../utils';
import moment from 'moment';
import { isEmpty } from 'lodash'

const handleGpuData = (gpuInfo) => {
  let body = ''

  gpuInfo && gpuInfo.forEach(el => {
    body += `Name,${el.gpuName},${el.memoryName},\n`
    el.gpu && el.gpu.forEach((ele, idx) => {
      const [time] = ele;
      const [, gpu] = el['gpu'][idx];
      const [, gpuMemory] = el['memory'][idx];
      body += `${moment(time).format('YYYY/MM/DD HH:mm:ss')},${gpu},${gpuMemory}\n`;
    })
  })

  return body + '\n'
}

const handleChartData = (hostName, data) => {
  const header = `${hostName}\nTime,CPU,Memory Total,Memory Used, Memory Buffer,GPU Used,GPU Memory,Network Receive,Network Transmit,Disk Read,Disk Written\n`;
  let body = ''

  data.cpu && data.cpu.forEach((el, idx) => {
    const [time, val] = el;
    const [, memoryTotal] = data['memoryTotal'][idx]
    const [, memoryUsed] = data['memoryUsed'][idx]
    const [, memoryBuffer] = data['memoryBuffer'][idx]
    const [, gpuUsed] = !isEmpty(data['gpu']) ? data['gpu'][idx] : [0, 0]
    const [, gpuMemory] = !isEmpty(data['gpuMemory']) ? data['gpuMemory'][idx] : [0, 0]
    const [, networkReceive] = data['networkReceive'][idx]
    const [, networkTransmit] = data['networkTransmit'][idx]
    const [, diskRead] = data['diskRead'][idx]
    const [, diskWritten] = data['diskWritten'][idx]
    body += `${moment(time).format('YYYY/MM/DD HH:mm:ss')},${val.toFixed(2)}%,${memoryTotal.toFixed(2)}GB,${memoryUsed.toFixed(2)}GB,${memoryBuffer.toFixed(2)}GB,${gpuUsed.toFixed(2)}%,${gpuMemory.toFixed(2)}%,${networkReceive.toFixed(2)}MB/s,${networkTransmit.toFixed(2)}MB/s,${diskRead.toFixed(2)}MB/s,${diskWritten.toFixed(2)}MB/s\n`
  })

  return header + body
}

export const exportCsv = ({ gpuInfo, useRate, hostName }) => {
  createCsvFile(`${hostName ? hostName : 'host'}.csv`, handleGpuData(gpuInfo) + handleChartData(hostName, useRate))
}
