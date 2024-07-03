import { environment } from "../../../../../../environments/environment"
import { AppLocalStorageKey } from "../../../../../persistant/AppLocalStorageKey"
import { useLocalStorage } from "usehooks-ts"
import { AppEnvironment } from "../../../../../device/appEnvironment"
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate"
import { appSlice } from "../../../../../reduxStore/appSlice"
import { useDispatch } from "react-redux"
import useAnimation from "../../../../hooks/useAnimation"
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint"
import { CacheImage } from "../../../../components/image/CacheImage"
import { tcx } from "../../../../utils/tcx"
import { U7WidthContainer } from "../../../../components-bs/PageContainer/env/u7/PageContainer"
import { HTMLAttributes } from "react"

type IAddToMobileShortcut = {
  className?: string
}

export const AddToMobileShortcut = (props: IAddToMobileShortcut) => {
  const dispatch = useDispatch()
  const [_, setHideAddToMobileShortcut] = useLocalStorage(
    AppLocalStorageKey.hideAddToMobileShortcut,
    false
  )
  const onClose = () => {
    setHideAddToMobileShortcut(true)
  }

  const { onClickToOpenDownload } = usePageNavigate()
  const { isDesktop } = useBreakpoint()

  const onDownload = () => {
    if (isDesktop) {
      dispatch(appSlice.actions.setShowDownloadModal(true))
    } else if (AppEnvironment.isAndroid()) {
      onClickToOpenDownload()
    } else {
      dispatch(appSlice.actions.setShowiOSDownloadPopover(true))
    }
  }

  const [isCloseAnimation, setIsCloseAnimation] = useAnimation(onClose)

  return (
    <div
      className={tcx(
        "flex items-center justify-between bg-[var(--background-download)] text-[var(--grayscale-100)] w-full",
        "tablet:px-4 mobile:px-8 px-1 py-2",
        isCloseAnimation ? "animate__slideOutUp" : "",
        props.className
      )}
    >
      <div className="flex items-center mobile:gap-2 gap-1">
        <img
          className="w-4 h-4 cursor-pointer"
          alt={"close"}
          src={`assets/${environment.uVersion}/icon_x.png`}
          onClick={() => setIsCloseAnimation(true)}
        />

        <CacheImage
          className="tablet:w-10 tablet:h-10 w-6 h-6"
          alt={"logo"}
          src={`assets/${environment.uVersion}/${environment.mvVersion}/icon_logo.png`}
        />
        <div className="">
          <div className="mobile:text-sm text-xs font-normal">
            Link-{environment.platformName}
          </div>
          <div className="downloadTxt moblie:text-xs text-[10px] font-normal text-[var(--grayscale-70)] truncate">
            {`${isDesktop
                ? "Baixe para iniciar sua jornada de exploração ilimitada"
                : "Desfrute de recursos mais interessantes"
              }`}
          </div>
        </div>
      </div>
      <button
        className="flex bg-state-warn-main mobile:px-2 px-1 py-1 rounded gap-1 font-medium items-center justify-center"
        onClick={onDownload}
      >
        <CacheImage
          id={"DownloadSimple"}
          alt={"DownloadSimple"}
          src={`assets/${environment.uVersion}/icon_download_app.png`}
          className={"w-3 h-3"}
        />
        <div className="text-[var(--transparent-black-80)] text-xs font-medium whitespace-nowrap">
          Baixar APP
        </div>
      </button>
    </div>
  )
}
