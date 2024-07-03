import { useDispatch, useSelector } from "react-redux";
import { appSlice } from "../../../../../reduxStore/appSlice";
import { environment } from "../../../../../../environments/environment";
import { CloseICON } from "../../../../components-bs/Icons/CloseICON";
import { MenuSmallLogo } from "../../../../components-bs/Logos/env/u2/MenuSmallLogo";
import { useEffect, useState } from "react";

export const IOSDownloadModal = () => {
  const dispatch = useDispatch();
  const [isShow, setIsShow] = useState(true)

  useEffect(() => {
    if (isShow) return
    const timer = setTimeout(() => {
      dispatch(appSlice.actions.setShowiOSDownloadPopover(false));
    }, 500)
    return () => clearTimeout(timer)
  }, [isShow])

  return (
    <div
      className={"flex-col flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.65)]"}
    >
      <div
        className={
          "w-full max-h-[514px]  fixed bottom-0 md:px-4 " + `${isShow ? 'animate-[slideDown_0.5s_linear_both]' : 'animate-[slideUp_0.5s_linear_both]'}`
        }
      >
        <div className={"w-full h-full bg-linear-5-main relative bg-cover bg-50%_50% flex flex-col px-6 rounded-tl-3xl rounded-tr-3xl"}>
          <div onClick={() => setIsShow(false)}>
            <CloseICON className="w-[32px] h-[32px]" btnClassName="absolute top-3 md:top-6 right-3" />
          </div>

          <div
            className="text-white text-center text-lg md:text-2xl font-bold my-3 md:mt-8 md:mb-5"
          >
            Adicione à tela inicial
          </div>

          <div className={"overflow-y-auto"}>
            <div className="text-base md:text-xl text-white mb-3 md:mb-5">
              Toque no ícone “Mais” e, em seguida, toque em Adicionar ao ecrã principal
            </div>

            <img className="w-full" alt="guid-line" src={`assets/${environment.uVersion}/add to home screen first_1.png`} />

            <div className="text-base md:text-xl text-white my-3 md:my-5">
              Clique em Adicionar e selecione ”Adicionar”
            </div>

            <div className="flex w-full items-start">
              <div className="bg-[#f2f2f6] flex flex-col justify-center w-full items-start py-2 rounded-lg">

                <div className="flex w-full justify-between items-start px-2 md:px-8">
                  <div className="text-base md:text-lg text-[#3B82F6]">
                    Cancelar
                  </div>

                  <div className="text-base md:text-lg">
                    Adicione à tela inicial
                  </div>

                  <div className="relative flex justify-center items-start">
                    <div className="text-base md:text-lg text-[#3B82F6] relative border-solid border-[#EF4444] border-4 rounded-[4px] md:rounded-lg px-1">
                      Adicionar
                    </div>
                    <img
                      src={`assets/${environment.uVersion}/hand3.png`}
                      alt="hand icon"
                      className="w-12 h-12 absolute top-6 left-[20px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col w-full items-start">
                  <div className="bg-white flex justify-start w-full items-center p-2 md:py-3 md:my-8">

                    <MenuSmallLogo className={"w-[64px] md:w-[80px] h-[64px] md:h-[80px] mr-2 md:mr-3 rounded-lg"} />

                    <div className="w-full">
                      <div className="text-base md:text-lg text-[#4D4D4D]">
                        {environment.platformName}
                      </div>
                      <div
                        id="Line"
                        className="border-solid border-t border-[#E6E6E6] h-px my-2 md:my-3 w-full"
                      />
                      <div className="text-base md:text-lg text-[#808080]">
                        {`${window.location.protocol}//${window.location.host}`}
                      </div>
                    </div>

                  </div>

                  <div className="text-sm text-[#808080] w-full px-2 md:px-8 pt-2 md:pt-1">
                    Adicione uma imagem à imagem principal, permitindo que você se conecte rapidamente a este site a partir do navegador padrão
                  </div>
                </div>
              </div>
            </div>
            <img
              src={`assets/${environment.uVersion}/hand1.png`}
              alt="hand icon"
              className="w-12 h-12 relative left-[50%] -translate-x-2/4 bottom-2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
