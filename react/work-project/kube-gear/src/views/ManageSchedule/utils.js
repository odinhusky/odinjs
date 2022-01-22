/**
 * Summary
 * Calculate available resources at selected time
 *
 * # Description
 * 1. 準備開始以及結束的 index，
 * 2. 使用時間逆向的方式先找到選擇的時間區段指向的最後一個 timestamep，做法就是將取得可用資源做 reverse()，透過 find() 方法找到結束的 timestamp
 * 2. 如果後台時間軸最初時間比我們選擇的結束時間來得早，也就是選擇的時間段中沒有使用任何資源，就是回傳全部
 * 3. 如果不是全部，透過 index 尋找可用時間軸的資源取最小值，因為預約最小值的資源才不會造成該時間段中某一個時間點資源超載
 *
 * @param { Number } selectedStartDate -- timestamp
 * @param { Number } selectedEndDate -- timestamp
 * @param { Object } data -- API 回傳的 data，在該時間段之內，某些時間點運用的資源以及資源的數量
 * data: {
 *  1631721600000: {
 *    cells: {
 *      default.pinned.NODE-103: 1
 *    }
 *  },
 * 1631721600000: {
 *    cells: null
 *  }
 * }
 * @param { Object } totalData -- API 回傳的 virtualGroup，在該時間段的所有資源的內容
 * virtualGroup: {
 *  name: "test",
 *  resource: "system",
 *  schedulable: true,
 *  usedCells: null,
 *  users: [...],
 *  cells: {
 *    default.pinned.NODE-103: {
 *      name: "default.pinned.NODE-103",
 *      number: 1,
 *      resourceUnit: "A6000"
 *    }
 *  }
 * }
 * @return { Object } 各個資源的可用數量
 * @example {
 *  default.pinned.NODE-103: 1
 * }
 */

export const checkCanUseResource = ( selectedStartDate, selectedEndDate, data, totalData ) => {

  // $ 準備初始資料
  const timeArea = [];
  let reverseStartIndex = 0;
  let reverseEndIndex = 0;

  // # 將 API 回傳回來的這段時間，所有可用的總資源以及數量、單位等抽出來變成一個物件，內容是 資源名稱: 總資源數量
  const totalResources = Object.entries(totalData.cells).reduce((acc, [typeName, { number }])=> {

    // console.log('totalResources acc', acc)
    // console.log('totalResources typeName', typeName)
    // console.log('totalResources number', number)

    return { ...acc, [typeName]: number }
  }, {})

  // console.log('totalResources', totalResources)

  // # 反轉時間資料
  const reverseData = Object.entries(data).reverse();

  // console.log('reverseData', reverseData)

  // # 先試著找出結束的 timestamp
  const isFindReverseEndData = reverseData.find(([key], index) => {
    reverseEndIndex = index
    return selectedEndDate > Number(key)
  })

  // console.log('isFindReverseEndData', isFindReverseEndData)
  // console.log('reverseEndIndex', reverseEndIndex)

  // - 如果沒有找到，代表選擇的時間區段不在API來的資料中，該時段的所有資源都可以使用，並且結束此 function 的運行
  if (isFindReverseEndData === undefined) {
    return totalResources
  }

  // # 找到開始的 timestamp，有可能與結束的 timestamp 是同一個
  reverseData.find(([key], index) => {
    reverseStartIndex = index
    return selectedStartDate >= Number(key)
  })

  // console.log('reverseStartIndex', reverseStartIndex)

  // # 跑回圈將找到的這些 timestamp push 進 timeArea 裏面
  for (let i = reverseEndIndex; i <= reverseStartIndex; i++) {
    timeArea.push(reverseData[i])
  }

  // console.log('timeArea', timeArea)

  // # timeArea 的 cells 裡面的資源代表已經使用的數量，總資源減去已經使用的量之後，取出最小值，就是我們可以在這段時間內，該資源可以預約的數量
  const ans = timeArea.reduce((acc, [, { cells }]) => {

    // console.log('ans acc', acc)
    // console.log('ans cell', cells)

    Object.entries(cells).forEach(([type, number]) => {
      acc[type] = Math.min(acc[type],  totalResources[type] - number)
    })

    return acc
  }, totalResources)

  // console.log('ans', ans)


  return ans;
}