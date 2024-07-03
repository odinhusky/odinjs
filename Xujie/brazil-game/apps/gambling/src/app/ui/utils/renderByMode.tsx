import { environment } from "../../../environments/environment"
import React, { useMemo, useState } from "react"
interface IRenderByModeOptions {
  componentName: string
  props: any
  defaultComponent: React.ReactNode
  modalRender?: (props: any) => React.ReactNode
}

export const renderByMode = (
  name: string,
  {
    componentName,
    props,
    defaultComponent,
    modalRender = (props) => <>{props.children}</>,
  }: IRenderByModeOptions
) => {
  const [mode, setMode] = useState(environment.componentConfig?.[name as "loginModal"] || 0)
  const Select = useMemo(
    () => (
      <div className="bg-green-700 text-white rounded-lg px-2 py-1 text-xs">
        {componentName} Mode:{" "}
        <select
          className="bg-transparent cursor-pointer"
          value={mode}
          onChange={(event) => {
            setMode(Number(event.target.value))
          }}
        >
          {Array.from({ length: 7 }, (_, index) => index).map((item) => (
            <option key={item} value={item} className="text-black">
              {item}
            </option>
          ))}
        </select>
      </div>
    ),
    [mode]
  )
  const ModeComponent = useMemo(() => {
    try {
      const modeComponent = require(`../components/${componentName}/${mode}`)
      const ModeComponent = modeComponent.default
      return <ModeComponent {...props} />
    } catch {
      return mode === 0 ? defaultComponent : <></>
    }
  }, [mode])

  const children = environment.componentConfig?.debugger ?  (
    <div className="flex flex-col items-end">
      {ModeComponent}
      <div className='fixed top-[1%] left-1/2 -translate-x-1/2 z-[9999]'> {Select}</div>
    </div> 
  ) : ModeComponent
  if (mode === 0) {
    return children
  }
  return modalRender({
    children,
  })
}
