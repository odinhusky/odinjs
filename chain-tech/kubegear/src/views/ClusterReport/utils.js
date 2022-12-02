import moment from 'moment';
import { KB, MB, GB } from 'constant';
export const parseNormalFormatGreaterthan0 = (val, idx) => {
  if (idx === 0)
    return val * 1000
  return parseFloat(val) < 1 ? 0 : parseFloat(val)
}

export const parseNormalFormat = (val, idx) => {
  if (idx === 0)
    return val * 1000
  return parseFloat(val)
}

export const parseGBFormat = (val, idx) => {
  if (idx === 0)
    return val * 1000

  return parseFloat(val) / GB
}

export const parseMBFormat = (val, idx) => {

  if (idx === 0)
    return val * 1000
    
  return parseFloat(val) / MB
}

export const parseKBFormat = (val, idx) => {
  if (idx === 0)
    return val * 1000
    
  return parseFloat(val) / KB
}


/**
 * @author odin
 * @param {object} data
 * {
 *  key: '下面的key',
 *  start: timestamp,
 *  end: timestamp
 * }
 * @description 回傳秒級的 Timestamp
 * @return {object} 
 * {
 *    start: startDate,
      end: endDate,
      step: divideBy11000Ratio
 * }
*/
export const computeDayRange = data => {
  const { key, start, end } = data
  const computeRange = (startDate, endDate) => {
    const countEndStartSecond = moment(endDate).diff(moment(startDate))
    const divideBy11000Ratio = Math.ceil(countEndStartSecond / 11000)
    return {
      start: startDate,
      end: endDate,
      step: divideBy11000Ratio
    }
  }
  switch (key) {
    case 'today':
    default:
      return {
        start: moment().startOf('day').unix(),
        end: moment().unix(),
        step: 30
      }
    case '15min':
      return computeRange(moment().unix() - 900, moment().unix())
    case '4hr':
      return computeRange(moment().unix() - 14400, moment().unix())
    case 'week':
      return computeRange(moment().startOf('week').unix(), moment().unix())
    case 'thisWeek':
      return computeRange(moment().startOf('week').unix(), moment().endOf('week').unix())
    case 'month':
      return computeRange(moment().startOf('month').unix(), moment().unix())
    case 'custom':
      return computeRange(
        moment(new Date(start)).startOf('day').unix(),
        Math.min(moment(new Date(end)).endOf('day').unix(), moment().unix())
      )
  }
}

export const createCsvFile = (fileName, data) =>  {
  const blob = new Blob([data], {
    type : 'application/octet-stream'
  });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  document.body.appendChild(link);
  link.href = href;
  link.download = fileName;
  link.click();
  document.body.removeChild(link);
}
