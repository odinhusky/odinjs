// # API
import { getCanUseVirtualGroups } from 'utils/api';

import moment from 'moment';
import {
  isEmpty,
  isUndefined,
  isNil,
  isObject,
  isArrayLike,
  isNumber,
  isInteger,
  get
} from 'lodash';
import { ja, zhCN, zhTW, enUS } from 'date-fns/locale';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

/**
   * @author odin
   * @description Check whether an object has the property.
   * @param {object} obj Target Object
   * @param {string} keyName The property name
   * @returns {boolean} true or false
   */
const hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn(obj, keyName) {
  return hasOwnProperty.call(obj, keyName);
}

/**
 * @author odin
 * @param {Object} column -- 要排序的欄位物件
 * @param {Function} Ordering -- 排序相關表單的建構函式
 * @param {Object} ordering -- 透過建構函式建構的排序建構實例
 * @param {Function} setOrdering -- 修改建構實例的函式
 * @description 依照需要排序的欄位做處理
*/
const applySortProps = ({ column, Ordering, ordering, setOrdering }) => {
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

/**
 * @author odin
 * @param {Array} arr -- 要轉換的陣列
 * @param {boolean} bool - ture 為 模式1 | false 為模式 2
 * @example1
 *  [{key: "helper", value: "123"},
    =>
    { helper: "123" }
 * @example2
 *  [{name: 'aa' , value: "123},]
    =>
    {
      aa: {
        name: aa
        value: "123"
      }
    }
 * @description 將具有物件屬性的陣列轉換成單一個物件
 * @returns {Object}
*/
const arrToObj = (arr, bool = true) => (
  arr.reduce((acc, cur)=> {
    return bool
      ? { ...acc, [cur.key]: cur.value }
      : { ...acc, [cur.name]: { ...cur } }
  }, {})
)

/**
 * @author odin
 * @param {ObjectChain} obj -- 要轉換的物件
 * @example
    {
      canMultipleLogin: "true",
      helper: "http://192.168.0.161:18080",
      isJobNeedVerify: "false"
    }

    =>
    [{key: "helper", value: "http://192.168.0.161:18080"},
    {key: "isJobNeedVerify", value: "false"},
    {key: "canMultipleLogin", value: "true"}]
 * @prop {boolean} isStringify -- 是否要將 value 轉為物件
 * @description 將物件轉換成具有物件屬性的陣列
 * @returns {Array}
*/
const objToArr = (obj, isStringify = false) => {
  const keyArr = Object.keys(obj);

  return keyArr.reduce((acc, cur)=> {
    return [ ...acc, {
      key: cur,
      value: isStringify ? JSON.stringify(obj[cur]) : obj[cur]
    }]
  }, [])
}

/**
 * @author odin
 * @param {Any} v -- 要轉換的值
 * @example
 *  transferBollean('true') => true || transferBollean({}) => {}
 * @description 將字串的 'true' || 'false' 轉換成 布林值，其他的值就直接回傳
 * @return {Boolean || Any} 回傳布林值或原本傳入的值
*/
const transferBoolean = (v) => {
  if(v === 'true' && typeof v === 'string') {
    return true;
  } else if (v === 'false' && typeof v === 'string') {
    return false;
  } else {
    return v;
  }
}

/**
 * @author odin
 * @param {Object} obj -- 要過濾的物件
 * @param {Array} keyArr -- 要留下的 key 值
 * @description 回傳過濾完成的物件並將將字串的 'true' || 'false' 轉換成 布林值
 * @return {Object} 回傳過濾完成的物件
*/
const filterObjPropertyByKey = (obj, keyArr) => {
  const newObj = {};

  keyArr.forEach((keyName) => {
    if(obj[keyName] !== undefined) {
      newObj[keyName] = transferBoolean(obj[keyName]);
    }
  })

  return  newObj;
}

/**
 * @author odin
 * @param {Object} obj -- 要過濾的物件
 * @param {string} typeString -- API 回傳的型號字串，包含其他資源的內容分配
 * => cpu.virtual.cpu (0 GPU, 1 CPU, 1024 memory)
 * @description 通過 API 回傳的型號字串來取得只包含資源型號的字串
 * @return {string}} 回傳過濾完成的物件
 * -> cpu.virtual.cp
*/
const getAPISrcType = (typeString) => (typeString.substring(0, typeString.indexOf(' (')))

/**
 * @author odin
 * @param {string} typeString -- API 回傳的型號字串
 * @param {string} selectedVgName -- 當前選擇的叢集名稱
 * @param {array} vgInfos -- 可用的子資源詳細內容
 * @description 透過型號名稱以及可用資源列表，取出特定型號的可用資源數量
 * @return {number} 剩餘的資源數量
*/
const getCanUseResourceNumber = (typeString, selectedVgName, vgInfos) => {

  if(isUndefined(selectedVgName)) {
    return 0
  }

  const { cells, usedCells } = vgInfos[selectedVgName]
  const distributedNumber = !isEmpty(cells) ? cells[typeString].number : 0
  const usedNumber = !isEmpty(usedCells)
    ? (isUndefined(usedCells[typeString]) ? 0 : usedCells[typeString])
    : 0
  const remainingNumber = distributedNumber - usedNumber

  return remainingNumber
}

/**
 * @author odin
 * @param {string} selectedVgName -- 當前選擇的叢集名稱
 * @param {array} vgInfos -- 可用的子資源詳細內容
 * @param {object} selectedVgLimitResourceObj -- 目前選擇的集群中，該使用者被限制的資源物件
 * @description 透過型號名稱以及可用資源列表，取出特定型號的可用資源數量
 * @return {number} 剩餘的資源數量
*/
const getRemainObj = (selectedVgName, vgInfos, selectedVgLimitResourceObj) => {

  if(isEmpty(selectedVgLimitResourceObj) || !isObject(selectedVgLimitResourceObj)) return;

  const maxSafeNumber = 9007199254740991;
  const { cells, usedCells } = vgInfos[selectedVgName];
  const {
    cpu: limitedCPU,
    gpu: limitedGPU,
    memory: limitedMemory,
    gpuMemoryPercentage: limitGPUMemoryPercentage
  } = selectedVgLimitResourceObj;

  // 被分配到的數量
  const cpuDistributedNum = get(cells, 'cpu.number', 0);
  const gpuDistributedNum = get(cells, 'gpu.number', 0);
  const memoryDistributedNum = get(cells, 'memory.number', 0);
  const gpuMemoryPercentageDistributedNum = get(cells, 'gpuMemoryPercentage.number', 0);

  // 使用的數量
  const cpuUsedNum = get(usedCells, 'cpu', 0);
  const gpuUsedNum = get(usedCells, 'gpu', 0);
  const memoryUsedNum = get(usedCells, 'memory', 0);
  const gpuMemoryPercentageUsedNum = get(usedCells, 'gpuMemoryPercentage', 0);

  // 個別剩餘的數量
  const cpuRemainNum = cpuDistributedNum - cpuUsedNum;
  const gpuRemainNum = gpuDistributedNum - gpuUsedNum;
  const memoryRemainNum = memoryDistributedNum - memoryUsedNum;
  const gpuMemoryPercentageRemainNum = gpuMemoryPercentageDistributedNum - gpuMemoryPercentageUsedNum;


  // 跟被限制的數量取小值就是最大可以使用的數量
  const maxCPUNum = Math.min(cpuRemainNum, (limitedCPU === -1 ? maxSafeNumber : limitedCPU));
  const maxGPUNum = Math.min(gpuRemainNum, (limitedGPU === -1 ? maxSafeNumber : limitedGPU));
  const maxMemoryNum = Math.min(memoryRemainNum, (limitedMemory === -1 ? maxSafeNumber : limitedMemory));
  const maxGPUMemoryPercentageNum = Math.min(gpuMemoryPercentageRemainNum, (limitGPUMemoryPercentage === -1 ? maxSafeNumber : limitGPUMemoryPercentage));

  // console.log('gpuMemoryPercentageDistributedNum', gpuMemoryPercentageDistributedNum);
  // console.log('gpuMemoryPercentageUsedNum', gpuMemoryPercentageUsedNum);

  // console.log('gpuMemoryPercentageRemainNum', gpuMemoryPercentageRemainNum);
  // console.log('limitGPUMemoryPercentage', limitGPUMemoryPercentage);

  // console.log('maxGPUMemoryPercentageNum', maxGPUMemoryPercentageNum);

  // console.log('common vgInfos', vgInfos[selectedVgName], vgInfos);
  // console.log('common selectedVgLimitResourceObj', selectedVgLimitResourceObj);
  // console.log('common Distributed cpu gpu memory', cpuDistributedNum, gpuDistributedNum, memoryDistributedNum);
  // console.log('common Remain cpu gpu memory', cpuRemainNum, gpuRemainNum, memoryRemainNum);
  // console.log('common max cpu gpu memory', maxCPUNum, maxGPUNum, maxMemoryNum);

  return {
    cpu: maxCPUNum,
    gpu: maxGPUNum,
    memoryMB: maxMemoryNum,
    gpuMemoryPercentage: maxGPUMemoryPercentageNum
  }
}

/**
 * @author odin
 * @param {string} typeString -- API 回傳的型號字串
 * @param {string} selectedVgName -- 當前選擇的叢集名稱
 * @param {object} vgObj -- 特定的叢集物件
 * @description 透過型號名稱以及可用資源列表，取出特定型號的可用資源數量
 * @return {number} 剩餘的資源數量
*/
const getCanUseResourceNumberBySelectedVgObj = (typeString, vgObj) => {

  const { cells, usedCells } = vgObj
  const distributedNumber = !isEmpty(cells) ? cells[typeString].number : 0
  const usedNumber = !isEmpty(usedCells)
    ? (isUndefined(usedCells[typeString]) ? 0 : usedCells[typeString])
    : 0
  const remainingNumber = distributedNumber - usedNumber

  return remainingNumber
}

/**
 * @author odin
 * @param {string} type -- 是要加總那一種類型的資料，目前有
 * 'distributed' => 分配到該子資源的內容，也就是用 cells[name].number
 * 'used' => 已經使用的量，也就是 usedCells[name] 的值，傳used的時候也一定要傳 usedCells
 * @param {Array} targetArr -- 要以誰為對象的 keyName Array
 * @param {Object} cells -- 該子資源的 cells 屬性中的物件
 * @param {Object} resourceUnit -- 對照的單位物件
 * @param {Object} usedCells -- type === 'used' 的時候才要傳，協助計算使用的資源
 * @description 依據不同的類別，計算該子資源分配到的資源數值或是已使用的資源數值
 * @return {Object}
 * {
    cpu: result,
    gpu: result,
    memory: result
  }
*/
const handleResourceTimesByType = ({
  type,
  targetArr,
  cells,
  resourceUnit,
  usedCells
}) => {
  const resultObj = targetArr.reduce((acc, cur) => {

    // 該型號的物件
    const thisType = cells[cur];

    // 倍數
    const timesNum = type === 'used' ? usedCells[cur] : thisType['number'];

    // 該型號的查表種類名稱
    const unitName = thisType['resourceUnit'];

    // 查表取得的型號內容
    const unitObj = resourceUnit[unitName];

    return {
      cpu: acc.cpu + (unitObj.cpu * timesNum),
      gpu: acc.gpu + (unitObj.gpu * timesNum),
      memory: acc.memory + (unitObj.memory * timesNum)
    }
  }, {
    cpu: 0,
    gpu: 0,
    memory: 0
  })

  return resultObj;
};

/**
 * @author odin
 * @param {string} keySting -- 該資源的型號
 * @param {object} cells -- 該資源型號的規格對照物件
 * @param {object} resourceUnit -- 對照表
 * @description 依據傳來的 keyString 來查表顯示該規格的資源具含有多少的 GPU | CPU | RAM
 * @return {string} X GPU, X CPU, XG RAM
*/
const handleResourceString = (keySting, cells, resourceUnit) => {
  const unitName = cells[keySting].resourceUnit
  const unitNumber = cells[keySting].number
  const gpu = resourceUnit[unitName].gpu * unitNumber
  const cpu = resourceUnit[unitName].cpu * unitNumber
  const memory = ((resourceUnit[unitName].memory * unitNumber) / 1024).toFixed(0)

  // console.log('handleResourceString keySting', keySting)
  // console.log('handleResourceString cells', cells)
  // console.log('handleResourceString resourceUnit', resourceUnit)
  // console.log('handleResourceString gpu', gpu)
  // console.log('handleResourceString cpu', cpu)
  // console.log('handleResourceString memory', memory)

  return `${gpu} GPU, ${cpu} CPU, ${memory}G RAM`

}

/**
 * @author odin
 * @param {number} value -- 分子
 * @param {number} total -- 分母
 * @description 判斷兩者相除的數值，以及皆為 0 的時候的意外狀況
 * @return {number} 返回 percentage 的數值 0~100
*/
const handlePercentage = (value, total) => {
  if(value === 0 && total === 0) {
    return 0
  } else {
    return (value / total) * 100
  }
}

/**
 * @author Ben
 * @param {object} data -- 包含起始日期、終止日期、key('today' | 'week' | 'year' | 'custom')
 * @description 根據傳入的data來決定 起始以及終止日期，取樣間隔時間(step)
 * @return {object} 返回 {
      start: startDate,
      end: endDate,
      step: divideBy11000Ratio
    }
*/
const computeDayRange = data => {
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
    case 'week':
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

/**
 * @author odin
 * @param {number} miliseconds -- miliseconds
 * @description 將 miliseconds 轉換成 XXd XXh XXm XXs 的字串
 * @return {string}} XXd XXh XXm XXs
*/
const getTimeString = (miliseconds) => {
  const time = moment.duration(miliseconds, 'seconds')

  const days = time.days()
  const hours = time.hours()
  const minutes = time.minutes()
  const seconds = time.seconds()

  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

/**
 * @author odin
 * @param {array} optionItems -- 預設或是從 API 來的 option 列表
 * @description 處理要顯示的 option 資料處理成適合的資料型態
 * @return {array}
*/
const addDropDownOptionKeys = optionItems => {
  return optionItems.map((item) => ({
    key: item.name,
    text: item.name,
    ...item
  }));
};

/**
   * @author odin
   * @param {number} min - 低標數值
   * @param {numbers} max - 高標數值
   * @param {number} num - 傳入要檢查的數值
   * @description 如果數字小於低標回傳低標，大於高標則回傳高標，在區間內則直接回傳傳入的數字
   * @returns {number || string} 在指定範圍內的數字
   */
function countRestrictRange(min, max, num) {
  const regex = /^[0-9]+\.?[0-9]{0,2}$/;

  if (regex.test(num)) {
    return Math.min(Math.max(num, min), isNumber(max) ? max : 9007199254740991)
  } else {
    return ''
  }
}

/**
 * @author elvis
 * @param {number} min - 最小值，預設值為 0
 * @param {number} num - 傳入要檢查的數值
 * @description 限制數字不能低於最小值
 * @returns {number} 數字大於等於最小值
 */
function countRestrictMinimum (num, min = 0) {
  var regex = /^[0-9]+\.?[0-9]{0,2}$/;
  if (regex.test(num)) {
    return Math.max(+num, min)
  } else {
    return ''
  }
}

/**
 * @author elvis
 * @param {number} locale - 最小值，預設值為 0
 * @description 依據傳來的字串決定要輸出哪一種語系
 * @returns {object} 語系
 */
function mapLoacle (locale) {
  switch (locale) {
    case 'zh-CN':
      return zhCN
    case 'zh-TW':
      return zhTW
    case 'jp':
      return ja
    case 'en':
    default:
      return enUS
  }
}

/**
 * @author odin
 * @param {string} str - 要下載的文字字串
 * @param {string} filename - 檔案名稱
 * @description 利用 FileSaver 下載文字成指定的檔名
 */
function downloadStringWithFileSaver(str, filename = 'default.txt') {
  const blob = new Blob([str], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, filename);
}

/**
 * @author odin
 * @param {array} orderIdArr - 紀錄目前 taskRoles 的 id 陣列，內容為流水序號的數字
 * @param {string} prefix - 前綴詞，預設為 taskrole
 * @description 產生一個taskrole時的預設名稱 以及該 orderingId
 * @return {object}
 */
function generateDefaultTaskName(orderIdArr, prefix = 'taskrole') {
  const lastId  = orderIdArr[orderIdArr.length - 1]
  const newLastId = lastId + 1

  return {
    id: newLastId,
    taskRoleName: `${prefix}${newLastId}`
  }
}

/**
 * @author odin
 * @param {array} tabsNameArr - 紀錄目前所有 taskRoles 的 name 陣列
 * @description 產生一個taskrole時的預設名稱 以及該 orderingId
 * @return {string}
 */
function generateTaskName (tabsNameArr) {
  let max = 0
  const regex = /taskrole(?<number>\d+$)/
  tabsNameArr.forEach(item => {
    const result = item.match(regex)

    if(!isNil(result)) {
      const { number } = result.groups
      max = Math.max(+number, max)
    }
  })

  return `taskrole${max + 1}`
}

/**
 * @author elvis
 * @param {object} obj - 要檢測的物件
 * @description 移除裡面屬性為空的 key: value
 * @return {object}
 */
function removeEmptyProperties(obj) {
  if (!isObject(obj)) {
    return;
  }

  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => {
    const onCheckingElement = newObj[key];
    if (!isEmpty(onCheckingElement)) {
      return;
    }

    // ignore non-array-like primitive type
    if (
      !isObject(onCheckingElement) &&
      !isArrayLike(onCheckingElement) &&
      !isNil(onCheckingElement)
    ) {
      return;
    }

    delete newObj[key];
  });
  return newObj;
}

/**
 * @author odin
 * @param {string} username - 使用者名稱
 * @param {function} callbackFn - setState function
 * @description 代理取得該使用者可以取得的集群列表
 */
async function proxyGetCanUseVgList(username, callbackFn) {
  try {
    // 取得資源對照表(withInfo = true cells.usedCell 的計算)
    const result = await getCanUseVirtualGroups(username, true);

    callbackFn(result)
  } catch (err) {
    // } catch ({ message: msg }) {
    const msg = err.data.message
    toast.error(msg);
  }
}

/**
 * @author odin
 * @param {number} bytes - byte 數
 * @description 回傳該 byte 數最大整數的數值以及單位
 * @returns {object}
 */
function formatIntegerBytes (bytes) {
  if (bytes < 0) return;
  if (bytes === 0) return { value: 0, unit: 'Byte', bytes: 0 };

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  let i = Math.floor(Math.log(bytes) / Math.log(k));
  let value = (bytes / Math.pow(k, i))
  while (isInteger(value) === false) {
    i -= 1
    value = (bytes / Math.pow(k, i))
  }

  return {
    value,
    unit: sizes[i],
    bytes: bytes
  };
}

/**
 * @author odin
 * @param {number} timeStamp - 13 位數的 timestamp (毫秒級)
 * @description 回傳該 timestamp 對應的文字格式
 * @returns {string}
 */
function formatDateTimeStr(timeStamp) {
  return `${moment(timeStamp).format('YYYY/MM/DD HH:mm:ss')}`;
}

/**
 * @author odin
 * @description 清除 localStorage 的 scheduleResourceItem
 */
function clearScheduleResourceItem() {
  if(localStorage.getItem !== null) {
    localStorage.removeItem('scheduleResourceItem');
  }
}

/**
 * @author odin
 * @param {number} startTimeStamp - 開始的 timestamp
 * @param {number} endTimeStamp - 結束的 timestamp，沒有的話會去 localStorage 取得 apiTimeStamp，在沒有的話則用本地瀏覽器的時間當作結束時間
 * @description 計算出兩個 timestamp 的 duration，並且輸出成字串
 * @return {string}
 */
function getDateDiff (startTimeStamp, endTimeStamp) {
  const apiTimeStamp = localStorage.getItem('apiTimeStamp');
  const finalEndTimeStamp = endTimeStamp
    ? endTimeStamp
    : apiTimeStamp ? apiTimeStamp : new Date().getTime();
  const timestampDiff = Math.abs(finalEndTimeStamp - startTimeStamp);
  const remainHours = timestampDiff % ( 24 * 3600 * 1000);
  const hours = Math.floor(remainHours / (3600 * 1000));
  const remainMinutes = timestampDiff % ( 3600 * 1000);
  const minutes = Math.floor(remainMinutes / (60 * 1000));
  const remainSeconds = timestampDiff % ( 60 * 1000);
  const seconds = Math.floor(remainSeconds / 1000);
  return {
    timestampDiff,
    days: Math.floor(timestampDiff / ( 24 * 3600 * 1000)),
    hours,
    minutes,
    seconds
  }
}

/**
 * @author odin
 * @param {string} lang - 由 url 傳來的 i18n 字串
 * @description 轉換為含有 . 的字串
 * @returns {string}}
 */
function handleI18NRoutePath(lang) {
  return lang.split('_').join('.');
}

/**
 * @author odin
 * @param {number} number - 單位數值
 * @param {string} unit - 時間單位
 * Y: 年 | M: 月 | D: 日 | h: 小時 | m: 分鐘 | s: 秒
 * @param {boolean} isMiliSecs - 是否要轉換成毫秒
 * @description 計算出對應的 秒數 或 毫秒數
 * @return {string}
 */
function getTimeSec (
  number,
  unit = 's',
  isMiliSecs = true
) {
  let baseSeconds = 0;
  const base = isMiliSecs ? 1000 : 1;

  switch (unit) {
    case 'Y':
      baseSeconds = 31536000
      break;
    case 'M':
      baseSeconds = 259200
      break;
    case 'D':
      baseSeconds = 86400
      break;
    case 'h':
      baseSeconds = 3600
      break;
    case 'm':
      baseSeconds = 60
      break;
    case 's':
      baseSeconds = 1
      break;
  }

  return number * baseSeconds * base;
}

/**
 * @author odin
 * @param {string} keyName - 資源的 key 值
 * cpu => CPU
 * gpu => GPU
 * memoryMB => Memory
 * gpuMemoryPercentage => GPU Percentage
 * @description 根據對應的 keyName 轉換成顯示的資源名稱
 * @return {string}
 */
const handleK8sResourceName = (keyName) => {
  // 決定顯示名稱
  let resourceName = '';

  switch (keyName) {
    case 'memoryMB':
    case 'memory':
      resourceName = 'Memory';
      break;
    case 'gpuMemoryPercentage':
      resourceName = 'GPU Percentage';
      break;
    default:
      resourceName = keyName.toUpperCase();
      break;
  }

  return resourceName;
}

export {
  hasOwn,
  applySortProps,
  arrToObj,
  objToArr,
  transferBoolean,
  filterObjPropertyByKey,
  getAPISrcType,
  getCanUseResourceNumber,
  getRemainObj,
  getCanUseResourceNumberBySelectedVgObj,
  handleResourceTimesByType,
  handleResourceString,
  handlePercentage,
  computeDayRange,
  getTimeString,
  addDropDownOptionKeys,
  countRestrictRange,
  countRestrictMinimum,
  mapLoacle,
  downloadStringWithFileSaver,
  generateDefaultTaskName,
  generateTaskName,
  removeEmptyProperties,
  proxyGetCanUseVgList,
  formatIntegerBytes,
  formatDateTimeStr,
  clearScheduleResourceItem,
  handleI18NRoutePath,
  getDateDiff,
  getTimeSec,
  handleK8sResourceName
}