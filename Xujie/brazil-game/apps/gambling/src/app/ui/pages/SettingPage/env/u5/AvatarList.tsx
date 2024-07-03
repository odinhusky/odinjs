import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint"
import { environment } from "../../../../../../environments/environment"
const AvatarList = ({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) => {
  const { isDesktop } = useBreakpoint()
  return isDesktop ? (
    <div className="gap-4 flex flex-wrap px-3 py-5 rounded-2xl bg-[var(--grayscale-30)]">
      {Array.from({ length: 36 }, (_, i) => i + 1).map((index) => (
        <div
          className="w-20 h-20 lg:w-20 lg:h-20"
          onClick={() => onChange(index)}
        >
          <AvatarItem index={index} activeIndex={value} />
        </div>
      ))}
    </div>
  ) : (
    <div className="px-3 py-5 rounded-2xl bg-[var(--grayscale-30)] flex flex-col items-center gap-2 md:gap-4">
      {[
        [1, 5],
        [6, 11],
        [12, 16],
        [17, 20],
        [21, 25],
        [26, 31],
        [32, 36],
      ].map(([start, end]) => (
        <div className="gap-2 md:gap-4 flex justify-center">
          {Array.from({ length: end - start + 1 }, (_, i) => i + start).map(
            (index) => (
              <div
                className="w-[14%] h-[14%] lg:w-20 lg:h-20"
                onClick={() => onChange(index)}
              >
                <AvatarItem index={index} activeIndex={value} />
              </div>
            )
          )}
        </div>
      ))}
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
  return (
    <div className={`relative w-full h-full`}>
      <img
        className="w-full h-full lg:w-20 lg:h-20 rounded-full shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)]"
        src={`assets/${environment.uVersion}/${environment.mVersion}/avatar_${index}.png`}
        alt={`avatar${index}`}
      />
      {index === activeIndex && (
        <div className="w-full h-full absolute left-0 top-0 rounded-full bg-black/50 flex justify-center items-center max-sm:border-[3px] border-4 border-white box-border">
          <img
            src={`assets/${environment.uVersion}/${environment.mVersion}/icon_selected.png`}
            className="w-6 h-6 sm:w-1/2 sm:h-1/2 lg:w-8 lg:h-8"
          />
        </div>
      )}
    </div>
  )
}
export default AvatarList
