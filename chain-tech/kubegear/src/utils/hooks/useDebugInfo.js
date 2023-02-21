import { useEffect, useRef } from 'react'
import useRenderCount from './useRenderCount'

// import isEqual from 'lodash'
import { isEqual, getType } from './odinLodash.js'

export const useDebugInfo = (componentName, props) => {
  const renderCount = useRenderCount()
  const changeProps = useRef({})
  const prevProps = useRef(props)
  const lastRenderTimestamp = useRef(Date.now())
  const propsKeys = Object.keys({ ...props,  ...prevProps.current })
  
  changeProps.current = propsKeys.reduce((obj, keyName) => {
    if(props[keyName] === prevProps.current[keyName]) return obj

    const isSame = isEqual(props[keyName], prevProps.current[keyName])

    return {
      ...obj,
      [keyName]: {
        prev: getType(prevProps.current[keyName]),
        current: getType(props[keyName]),
        isSame
      }
    }
  }, {})

  const info = {
    renderCount,
    changedProps: changeProps.current,
    timeSinceLastRender: Date.now() - lastRenderTimestamp.current,
    lastRenderTimestamp: lastRenderTimestamp.current
  }

  useEffect(() => {
    prevProps.current = props
    lastRenderTimestamp.current = Date.now()
    console.log('[debug-info]', componentName, info)
  })
}

export default useDebugInfo

