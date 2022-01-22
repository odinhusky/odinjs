import { useState } from 'react';

/**
 * @author odin
 * @param {any} initValue -- 一個 state 的初始值
 * @description 讓 useState 的 setter function 改為 Promise，可以配合 async/await 撰寫成同步的形式
 * @return {array}
*/
function useAsyncState(initValue) {
  const [value, setValue] = useState(initValue);

  const setter = setParam => (
    new Promise(resolve => {
      setValue(setParam);
      resolve(setParam);
    })
  )

  return [value, setter]
}

export {
  useAsyncState
}