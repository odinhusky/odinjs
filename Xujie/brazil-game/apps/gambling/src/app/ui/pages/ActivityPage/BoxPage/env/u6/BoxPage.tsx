import { PageContainer } from "../../../../../components-bs/PageContainer"
import { IBoxPageProps } from "../../index"
import { CacheImage } from "../../../../../components/image/CacheImage"
import { ActivityTextContainer } from "../../../ActivityTextContainer"
import useBoxPage from "../../hooks/useBoxPage"
import { formatLocaleMoney } from "../../../../../utils/format"
import { usePageNavigate } from "../../../../../router/hooks/usePageNavigate"
import cx from "../../../../../utils/cx"
import { ActivityPageRouter } from "../../../index"
import { environment } from "../../../../../../../environments/environment"
import { CopyOutlined } from "@ant-design/icons"
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint"
import { StepsContainer } from "./StepsContainer"
import { RecordPage } from "./RecordPage"
import { uiSlice } from "apps/gambling/src/app/reduxStore/uiSlice"
import { useDispatch } from "react-redux"

export const BoxPage = ({ internalBannerRes, fontConfig }: IBoxPageProps) => {
  const { onClickToActivity } = usePageNavigate()
  const { isMobile } = useBreakpoint()

  const {
    isInvitationOpen,
    bannerContent,
    inviteLink,
    inviteNum,
    recharge,
    betFlow,
    steps,
    contentHtml,
    onClickToClaim,
    onClickToCopy,
    contextHolder,
    recordOpen,
    setRecordOpen,
  } = useBoxPage();

  const dispatch = useDispatch();

  const handleRecordOpen = (isOpen: boolean) => {
    setRecordOpen(isOpen);
    dispatch(uiSlice.actions.setIsBackToBoxPage(!isOpen));
  };

  if (recordOpen) return <RecordPage onClickToBack={() => { handleRecordOpen(false) }} />

  return (
    <PageContainer className="text-[var(--grayscale-100)] pb-20 flex flex-col gap-3 mobile:gap-4 tablet:gap-6">
      {contextHolder}
      <div className="relative">
        <CacheImage alt="banner" src={internalBannerRes} />
        <div
          className="absolute top-1/2 -translate-y-1/2 flex flex-wrap 
            left-4 w-2/3
            mobile:left-8 mobile:w-1/2
            tablet:left-16
            "
        >
          {bannerContent.split(/\s+/).map((item) => (
            <ActivityTextContainer
              children={item}
              fontConfig={fontConfig}
              className="text-xl mobile:text-3xl tablet:text-5xl font-bold mobile:font-extrabold tablet:font-black"
            />
          ))}
        </div>
      </div>
      <div className="text-base mobile:text-lg tablet:text-xl font-medium text-center">
        Recomende aos seus amigos e ganhe bônus! Estamos sinceramente esperando
        que mais jogadores se juntem a nós!
      </div>

      <div className="py-4 px-5 rounded-xl bg-[var(--grayscale-30)] text-center flex flex-col tablet:gap-6 mobile:gap-5 gap-4">
        {isInvitationOpen && (
          <div className="rounded-xl flex max-mobile:flex-col items-center bg-[var(--grayscale-50)] tablet:pr-6 mobile:pr-4">
            <img
              className="w-[90px] h-[90px] mobile:w-28 mobile:h-28 mobile:-m-3 tablet:-m-4 -m-4"
              src={`assets/${environment.uVersion}/${environment.mVersion}/internal_event_treasures_gift.png`}
              alt=""
            />
            <div className="tablet:ml-2 mobile:ml-4 mobile:text-start w-full">
              <div className="text-sm font-bold max-mobile:mt-2">
                Copie o link para seus amigos!
              </div>
              <div className="flex gap-2 max-mobile:flex-col items-center mt-2">
                <div className="text-xs py-2 px-5  box-border rounded-lg bg-[var(--grayscale-30)] mobile:flex-1">
                  {inviteLink}
                </div>
                <button
                  className="w-[140px] h-8  flex justify-center items-center rounded-lg text-sm linear-3-button max-mobile:mb-3"
                  onClick={onClickToCopy}
                >
                  <CopyOutlined className="mr-1" />
                  Convide Amigos
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className={cx(
            "text-sm  text-left text-[var(--grayscale-70)]",
            !isInvitationOpen && "mt-0 tablet:mt-0"
          )}
        >
          Regras de liquidação da plataforma: O evento é atualizado a cada 10 a
          30 minutos. Depois que as condições do convite forem atendidas,
          aguarde alguns minutos para reivindicar o bônus. Clique em "Reg de
          Coletas" para ver os detalhes do bônus.
        </div>

        <div className="py-3 px-4 rounded-xl bg-[var(--grayscale-40)]">
          <div
            className={cx("flex items-center", {
              "flex-col": isMobile,
            })}
          >
            <img
              className="w-6 h-6 tablet:w-9 tablet:h-9 mb-3 mobile:mb-0 mr-2 tablet:mr-3 rounded-full bg-linear-1-main"
              src={`assets/${environment.uVersion}/icon=notice.png`}
              alt="notice"
            />
            <div className="max-mobile:text-sm text-base mobile:ml-4 text-center mobile:text-start text-[var(--grayscale-80)]">
              Nota: Para garantir a justiça, os usuários trapaceiros serão
              banidos permanentemente, os fundos obtidos ilegalmente serão
              congelados e as responsabilidades legais relevantes serão
              assumidas.
            </div>
          </div>

          <div className="my-3 rounded-xl text-center bg-linear-4-main p-2 mobile:px-4 tablet:py-5 tablet:px-[136px] flex max-mobile:flex-col">
            <div className="flex-1 text-center">
              <div className="font-bold text-base mobile:text-lg tablet:text-xl">
                R$ {formatLocaleMoney(recharge)} <br />
                ou o acima mencionado
              </div>
              <div className="mt-1 text-sm">
                O subordinado acumulou recargas
              </div>
            </div>
            <div className="flex-1 text-center mobile:border-l max-mobile:border-t max-mobile:pt-1 max-mobile:mt-1 border-[var(--grayscale-100)]">
              <div className="font-bold text-base mobile:text-lg tablet:text-xl">
                R$ {formatLocaleMoney(betFlow)} <br />
                ou o acima mencionado
              </div>
              <div className="mt-1 text-sm">O subordinado acumulou apostas</div>
            </div>
          </div>

          <div className="rounded-lg bg-[var(--grayscale-30)] flex max-mobile:flex-col mobile:justify-between items-center max-mobile:px-2 max-mobile:py-3 px-5 py-3 ">
            <div className="text-[var(--grayscale-100)] ">
              Pessoas de nível inferior eficazes {inviteNum} pessoas
            </div>
            <div className="flex gap-2 max-mobile:w-full max-mobile:mt-1 tablet:text-base text-sm font-bold">
              <button
                className="linear-1-button tablet:w-[120px] tablet:h-12 mobile:w-[100px] max-mobile:flex-1 h-9"
                onClick={() => { handleRecordOpen(true) }}
              >
                Detalhes
              </button>
              <button
                className="linear-2-button tablet:w-[132px] tablet:h-12 mobile:w-[135px] max-mobile:flex-1 h-9"
                onClick={() =>
                  onClickToActivity({ category: ActivityPageRouter.RECORD })
                }
              >
                Reg de Coletas
              </button>
            </div>
          </div>
        </div>
        <StepsContainer
            steps={steps}
            onClickToClaim={onClickToClaim}
          />
     
          

 
     
        <div className="text-start rounded-lg bg-transparente-10 tablet:px-10 tablet:py-6 mobile:p-6 px-4 py-3 text-[var(--grayscale-100)]">
          <p className="font-medium mobile:text-base text-sm">
            Instruções Do Evento:
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: contentHtml }}
            className="mt-3 font-normal text-sm"
          />
        </div>
      </div>
    </PageContainer>
  )
}
