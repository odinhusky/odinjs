import { environment } from "../../../../../../environments/environment";
import { AppLocalStorageKey } from "../../../../../persistant/AppLocalStorageKey";
import { useLocalStorage } from "usehooks-ts";
import { AppEnvironment } from "../../../../../device/appEnvironment";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import { appSlice } from "../../../../../reduxStore/appSlice";
import { useDispatch } from "react-redux";

type IAddToMobileShortcut = {
  isShowTabbar: boolean;
  className?: string
}

export const AddToMobileShortcut = (props: IAddToMobileShortcut) => {
  const dispatch = useDispatch();
  const [_, setHideAddToMobileShortcut] = useLocalStorage(AppLocalStorageKey.hideAddToMobileShortcut, false)
  const onClose = () => {
    setHideAddToMobileShortcut(true);
  }

  const { onClickToOpenDownload } = usePageNavigate();

  const onDownload = () => {
    if (AppEnvironment.isAndroid()) {
      onClickToOpenDownload();
    } else {
      dispatch(appSlice.actions.setShowiOSDownloadPopover(true));
    }
  }

  return (
    <div className="relative p-5 md:p-8 rounded-[20px] mx-7 w-[320px] md:w-[360px] text-white bg-linear-5-main">
      <button
        className="absolute -right-2.5 -top-2.5 w-10 h-10 rounded-full flex justify-center items-center bg-linear-5-main shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] "
        onClick={onClose}
      >
        <img
          className="w-[24px] h-[24px] hover:opacity-80"
          src={`assets/${environment.uVersion}/icon_close.png`}
          alt="close"
        />
      </button>
      <div className="w-full flex flex-col items-center">
        <img
          alt="bg"
          className="w-[132px] h-[100px] md:w-[190px] md:h-[142px]"
          src={`assets/${environment.uVersion}/add_download.png`}
        />
        <div className="w-full" onClick={onDownload}>
          <div className="font-extrabold text-base md:text-base mb-4 w-full text-center">
            Adicione primeiro ao ecrã principal
          </div>
          <div className="flex justify-between items-center w-full">
            <button
              className="state-other-button font-extrabold flex-1 h-10 tablet:h-12"
            >
             adicionar à área de trabalho
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
