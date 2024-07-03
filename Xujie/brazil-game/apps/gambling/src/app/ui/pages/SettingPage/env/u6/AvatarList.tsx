import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint"
import { environment } from "../../../../../../environments/environment"
import { useMemo } from "react"
import { tcx } from "../../../../utils/tcx"
const AvatarList = ({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) => {
  console.log("value", value)

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="h-full w-auto max-w-[600px] gap-2 mobile:gap-3 tablet:gap-4 flex flex-wrap">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((index) => (
          <div
            className="w-10 h-10 mobile:w-14 mobile:h-14 tablet:w-[68px] tablet:h-[68px]"
            onClick={() => onChange(index)}
          >
            <AvatarItem index={index} activeIndex={value} />
          </div>
        ))}
      </div>
    </div>
  )
}
const AvatarItem = ({
  index,
  activeIndex,
}: {
  index: number
  activeIndex: number
}) => {
  const AvatarItem =  useMemo(()=><img
  src={`assets/${environment.uVersion}/${environment.mVersion}/avatar_${index}.png`}
  alt={`avatar${index}`}
/>,[index])
const {isTablet} = useBreakpoint()
const padding = isTablet ? 8:4
  return index === activeIndex ? (
    <div className="relative">
      <div
        className={` w-full h-full flex justify-center items-center bg-linear-4-main rounded-full p-0.5 box-content`}
        style={{
          width: `calc(100% + ${padding}px)`,
          margin:`-${padding}px`
        }}
      >
        <div className={tcx("bg-[var(--grayscale-30)] rounded-full p-0.5",['p-1',isTablet])}>
          <div className="relative rounded-full overflow-hidden ">
            {AvatarItem}
            <div className="bg-black/60 absolute left-0 top-0 w-full h-full rounded-full"/>
          </div>
        </div>
      </div>
    </div>
  ) : (
    AvatarItem
  )
}
export default AvatarList
