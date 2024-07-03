import { notification } from "antd"
import { IHowToInviteTabSection } from "../.."
import { useBreakpoint } from "../../../../../pageTemplate/hooks/useBreakpoint"
import { useInviteConfig } from "./../../../../../hooks/useInviteConfig"
import { PageContainer } from "../../../../../components-bs/PageContainer"
import { environment } from "../../../../../../../environments/environment"
import { QuestionSection1 } from "../common/QuestionSection1"
import { QuestionSection2 } from "../common/QuestionSection2"
import { QuestionSection3 } from "../common/QuestionSection3"
import {appCopy} from "../../../../../utils/appCopy";

export const HowToInviteTabSection = (props: IHowToInviteTabSection) => {
  const { isMobile, isTablet } = useBreakpoint()
  const [notefy, contextHolder] = notification.useNotification()
  const { currentConfig } = useInviteConfig()
  const isInvitationOpen = currentConfig
    ? currentConfig.isInvitationOpen
    : false
  const onClickToCopy = () => {
    appCopy(props.inviteUrl)
    navigator.clipboard.writeText(props.inviteUrl)
    notefy.success({
      message: "Copiado!",
    })
  }
  return (
    <div className="text-white text-sm leading-5 -mb-20">
      {contextHolder}

      <div className="w-full flex justify-end items-center bg-[var(--grayscale-30)] relative rounded-2xl overflow-hidden">
        <img
          src={`assets/${environment.uVersion}/${
            environment.mvVersion
          }/internal_banner_recommend${
            isMobile ? "_m" : isTablet ? "_t" : ""
          }.png`}
          alt="banner"
          id="banner"
          className="w-2/3"
        />

        <div
          className="tablet:text-5xl mobile:text-3xl text-base text-start shadow-te font-extrabold text-white absolute left-3 mobile:left-6 tablet:left-12 top-1/2 -translate-y-1/2 w-1/2"
          style={{
            textShadow: `${
              isMobile ? "2px 2px" : "6px 6px"
            } 2px var(--grayscale-20)`,
          }}
        >
          Exclusivo plano de promoção
        </div>
      </div>
      <div className="tablet:mt-12 mobile:mt-5 mt-3 bg-[var(--grayscale-20)] rounded-lg p-8 max-sm:p-4">
        {isInvitationOpen && (
          <div className="tablet:flex tablet:gap-8 tablet:mb-12 mobile:mb-5 mb-3 ">
            <div className="tablet:w-1/2 w-full bg-[var(--grayscale-10)] rounded-lg py-3 px-5">
              Programa de recomendação exclusivo da plataforma $
              {environment.platformGroup}-${environment.platformName}, recomende
              aos amigos e ganhe comissões sem limite máximo! Esperamos
              sinceramente que mais jogadores se juntem a nós!
            </div>
            <div className="tablet:w-1/2 w-full tablet:mt-0 mobile:mt-5 mt-3 max-tablet:mt-5 max-mobile:mt-3">
              <div className="flex max-mobile:flex-col justify-between items-center p-3 bg-linear-6-main rounded-lg">
                <div className="max-mobile:text-center">
                  <div className="text-base sm:text-lg  font-extrabold">
                    Copie o link para seus amigos!
                  </div>
                  <div className="mt-4 max-mobile:mt-2 text-sm font-bold">
                    {props?.inviteUrl}
                  </div>
                </div>
                <button
                  className="state-other-button font-extrabold max-mobile:mt-3 w-[200px] h-10"
                  onClick={onClickToCopy}
                >
                  Convide Amigos
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-[var(--grayscale-10)] rounded-lg p-4">
          <div className="font-extrabold">Programa de referência</div>
          <div className="flex flex-wrap justify-center">
            <div className="tablet:flex-1 w-full mt-3 text-[var(--grayscale-80)]">
              <QuestionSection1 />
            </div>
            <img
              className="max-tablet:mt-5 mobile:w-[375px] w-full"
              src={`assets/${environment.uVersion}/${environment.mVersion}/invite_level.png`}
              alt=""
            />
          </div>

          <div className="mt-5 font-extrabold">Estudos de caso</div>
          <div className="mt-2 text-[var(--grayscale-80)]">
            <QuestionSection2 />
          </div>
        </div>

        <button
          onClick={() => props.setPanelMode("daily")}
          className="linear-6-button font-extrabold tablet:my-12 mobile:my-5 my-3 mx-auto tablet:w-[480px] mobile:w-[312px] w-[200px] h-10"
        >
          Convidar conta
        </button>
        <div className="bg-[var(--grayscale-10)] rounded-lg p-4">
          {isInvitationOpen && (
            <div className="mb-5">
              <QuestionSection3 />
            </div>
          )}
          <div className="text-[var(--grayscale-80)]">
            Nota:
            <br />
            Para garantir a justiça, os usuários trapaceiros serão banidos
            permanentemente, os fundos obtidos ilegalmente serão congelados e as
            responsabilidades legais relevantes serão assumidas.
          </div>
        </div>
      </div>
    </div>
  )
}
