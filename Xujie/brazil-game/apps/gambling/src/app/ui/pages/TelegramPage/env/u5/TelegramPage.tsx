import { environment } from "../../../../../../environments/environment"
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint"
import { ITelegramPage } from "../.."
import { TelegrmaNotice } from "../components/TelegramNotice"
import { PageContainer } from "../../../../components-bs/PageContainer"

export const TelegramPage = (props: ITelegramPage) => {
  const { isMobile, isTablet } = useBreakpoint()
  return (
    <PageContainer>
      {/*Banner*/}
      <div className="w-full flex justify-end items-center bg-[var(--grayscale-30)] relative rounded-2xl overflow-hidden">
        <img
          src={`assets/${environment.uVersion}/${
            environment.mvVersion
          }/internal_banner_telegram${
            isMobile ? "_m" : isTablet ? "_t" : ""
          }.png`}
          alt="banner"
          id="banner"
          className="w-2/3"
        />

        <div
          className="tablet:text-5xl mobile:text-3xl text-base tablet:leading-[48px] mobile:leading-8 leading-5 text-start shadow-te font-extrabold text-white absolute left-3 mobile:left-6 tablet:left-12 top-1/2 -translate-y-1/2"
          style={{ textShadow: `${isMobile ? '2px 2px' : '6px 6px'} 2px var(--grayscale-20)` }}
        >
          <div>Junte-se ao telegram</div>
          <div className="w-2/3 max-mobile:w-3/4">
            Revela oficialmente maisatividades de recompensa
          </div>
        </div>
      </div>

      {/*  */}
      <div className="bg-[var(--grayscale-20)] rounded-lg mt-3 mobile:mt-5 tablet:mt-8 p-8 max-mobile:p-4">
        <div className="text-white bg-[var(--grayscale-10)] rounded-lg px-5 py-3 text-sm leading-5 tablet:text-base tablet:leading-6 ">
          {environment.platformGroup} ({environment.platformName}) sinceramente
          convida você a se juntar ao nosso canal de telegrama e vamos nos
          comunicar mais profundamente!
        </div>
        <div className="mt-3 mobile:mt-5 tablet:mt-8 bg-[var(--grayscale-10)] rounded-lg px-5 py-3 text-sm leading-5 tablet:text-base tablet:leading-6">
          <div className="text-sm mobile:tex-base tablet:text-lg font-extrabold text-white">
            Nota especial:
          </div>
          <div className="mt-3 text-[var(--grayscale-80)]">
            <TelegrmaNotice />
          </div>
        </div>
      </div>
      <button
        className={`linear-6-button font-extrabold  mt-3 mobile:mt-5 tablet:mt-8 w-full sm:w-80 lg:w-[480px] h-10 lg:h-12 mx-auto text-sm`}
        onClick={props.handleClickToTelegram}
      >
        Convidar conta
      </button>
    </PageContainer>
  )
}

