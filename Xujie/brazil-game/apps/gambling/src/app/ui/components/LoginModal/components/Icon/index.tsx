import { environment } from "apps/gambling/src/environments/environment"
const mode = environment.componentConfig?.loginModal || 0
const modeConfig: Record<number, string> = {
  0: "tmp1",
  1: "tmp1",
  6: "tmp1",
}
const Icon = ({
  className,
  name,
  onClick,
}: {
  className?: string
  name: string
  onClick?: () => void
}) => {
  try {
    const component = require(`./svg/${modeConfig[mode] || "tmp1"
      }/icon_${name}`)
    const Svg = component.default
    return (
      <div className={`mode-icon icon-${name} ${className} `} onClick={onClick}>
        <Svg />
      </div>
    )
  } catch {
    return <></>
  }
}
export default Icon
