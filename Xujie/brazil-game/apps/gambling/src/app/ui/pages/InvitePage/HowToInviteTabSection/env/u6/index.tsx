import { notification } from "antd";
import { IHowToInviteTabSection } from "../..";
import { useBreakpoint } from "../../../../../pageTemplate/hooks/useBreakpoint";
import { useInviteConfig } from "../../../../../hooks/useInviteConfig";
import { PageContainer } from "../../../../../components-bs/PageContainer";
import { environment } from "../../../../../../../environments/environment";
import { QuestionSection1 } from "../common/QuestionSection1";
import { QuestionSection2 } from "../common/QuestionSection2";
import { QuestionSection3 } from "../common/QuestionSection3";
import { appCopy } from "../../../../../utils/appCopy";
import { BackNavigation } from "apps/gambling/src/app/ui/components-bs/BackNavigation/BackNavigation";
import { usePageNavigate } from "apps/gambling/src/app/ui/router/hooks/usePageNavigate";

export const HowToInviteTabSection = (props: IHowToInviteTabSection) => {
  const { isMobile, isTablet } = useBreakpoint();
  const [notefy, contextHolder] = notification.useNotification();
  const { currentConfig } = useInviteConfig();
  const isInvitationOpen = currentConfig
    ? currentConfig.isInvitationOpen
    : false;
  const onClickToCopy = () => {
    appCopy(props.inviteUrl);
    navigator.clipboard.writeText(props.inviteUrl);
    notefy.success({
      message: "Copiado!",
    });
  };
  const { onClickToIndex, onClickToActivity } = usePageNavigate();
  return (
    <div className="text-[var(--grayscale-100)]">
      <div className="flex flex-col tablet:gap-6 mobile:gap-4 gap-3">
        {/*<BackNavigation*/}
        {/*    className="tablet:text-xl text-base font-medium"*/}
        {/*    onClick={() => {*/}
        {/*      onClickToIndex();*/}
        {/*    }}*/}
        {/*/>*/}
        {/* banner */}
        <section className="relative">
          <img
            className="w-full"
            src={`assets/${environment.uVersion}/${
              environment.mvVersion
            }/internal_banner_recommend${
              isMobile ? "_m" : isTablet ? "_t" : ""
            }.png`}
            alt="banner"
          />
          <div
            className="absolute w-[70%] aspect-[0/1] mobile:text-[56px] mobile:leading-[64px] text-xl tablet:font-black font-bold
            top-1/2 -translate-y-1/2 left-[5%] drop-shadow-[0px_4px_4px_#00000040]"
          >
            Exclusivo plano de promoção
          </div>
        </section>
        <section className="flex mobile:gap-3 gap-2 tablet:text-lg mobile:text-base text-sm tablet:justify-center justify-between font-medium">
          <div
            className="bg-linear-4-main text-center tablet:w-auto w-full mobile:py-2 mobile:px-24 py-1 px-4 rounded-lg
            shadow-[0px_-4px_4px_0px_#00000033_inset,0px_4px_4px_0px_#FFFFFF33_inset]"
          >
            Como convidar
          </div>
          <button
            className="tablet:w-auto w-full border-[1.5px] border-solid border-[var(--grayscale-90)] mobile:py-2 mobile:px-24 py-1 px-4 rounded-lg"
            onClick={() => {
              props.setPanelMode("daily");
            }}
          >
            Dados diários
          </button>
        </section>
        {contextHolder}
        <div className="flex flex-col bg-[var(--grayscale-30)] tablet:gap-3 mobile:gap-5 gap-4 tablet:py-10 tablet:px-12 mobile:py-8 mobile:px-9 py-4 px-5 rounded-xl">
          <div className="flex tablet:flex-row flex-col tablet:gap-3 mobile:gap-5 gap-4">
            {isInvitationOpen && (
              <div className="flex tablet:flex-col flex-col-reverse tablet:gap-3 mobile:gap-5 gap-4">
                {/*  */}
                <div className="flex flex-col h-full tablet:gap-6 mobile:gap-4 gap-3 bg-[var(--grayscale-40)] rounded-xl tablet:p-6 mobile:py-4 mobile:px-6 py-3 px-4">
                  <div className="flex mobile:flex-row flex-col mobile:gap-4 gap-3 text-[var(--grayscale-80)] justify-center items-center">
                    <img
                      className="tablet:w-9 w-6 tablet:h-9 h-6"
                      src={`assets/${environment.uVersion}/icon_warning.png`}
                      alt="warn"
                    />
                    Nota: Para garantir a justiça, os usuários trapaceiros serão
                    banidos permanentemente, os fundos obtidos ilegalmente serão
                    congelados e as responsabilidades legais relevantes serão
                    assumidas.
                  </div>
                  {/* 阶级 */}
                  <div className="flex flex-col mobile:gap-4 gap-3 items-center">
                    {/* 0 */}
                    <div className="flex flex-col justify-center items-center">
                      <div className=" flex bg-linear-3-main tablet:text-base text-sm mobile:w-[100px] w-[62px] tablet:h-10 mobile:h-9 h-8 rounded-lg justify-center items-center font-medium">
                        Você
                      </div>
                      <div className="mobile:text-sm text-xs text-[var(--grayscale-90)]">
                        Convidar
                      </div>
                      <div className="w-3 h-3 bg-[linear-gradient(to_bottom_right,#fff0_0%,#f000_49.9%,rgba(189,50,240,1)_50%,rgba(81,13,137,1)_100%)] rotate-45" />
                    </div>
                    {/* 1 */}
                    <div className="flex gap-3">
                      <div className="flex flex-col justify-center items-center">
                        <div className=" flex bg-linear-1-main tablet:text-base text-sm mobile:w-[100px] w-[62px] tablet:h-10 mobile:h-9 h-8 rounded-lg justify-center items-center font-medium">
                          Nível 1
                        </div>
                        <div className="mobile:text-sm text-xs text-[var(--grayscale-90)]">
                          Convidar
                        </div>
                        <div className="w-3 h-3 bg-[linear-gradient(to_bottom_right,#fff0_0%,#f000_49.9%,rgba(40,197,249,1)_50%,rgba(24,80,179,1)_100%)] rotate-45" />
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className=" flex bg-linear-1-main tablet:text-base text-sm mobile:w-[100px] w-[62px] tablet:h-10 mobile:h-9 h-8 rounded-lg justify-center items-center font-medium">
                          Nível 1
                        </div>
                        <div className="mobile:text-sm text-xs text-[var(--grayscale-90)]">
                          Convidar
                        </div>
                        <div className="w-3 h-3 bg-[linear-gradient(to_bottom_right,#fff0_0%,#f000_49.9%,rgba(40,197,249,1)_50%,rgba(24,80,179,1)_100%)] rotate-45" />
                      </div>
                    </div>
                    {/* 2 */}
                    <div className="flex gap-3">
                      <div className="flex flex-col justify-center items-center">
                        <div className=" flex bg-linear-2-main tablet:text-base text-sm mobile:w-[100px] w-[62px] tablet:h-10 mobile:h-9 h-8 rounded-lg justify-center items-center font-medium">
                          Nível 2
                        </div>
                        <div className="mobile:text-sm text-xs text-[var(--grayscale-90)]">
                          Convidar
                        </div>
                        <div className="w-3 h-3 bg-[linear-gradient(to_bottom_right,#fff0_0%,#f000_49.9%,rgba(131,216,16,1)_50%,rgba(23,143,39,1)_100%)] rotate-45" />
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className=" flex bg-linear-2-main tablet:text-base text-sm mobile:w-[100px] w-[62px] tablet:h-10 mobile:h-9 h-8 rounded-lg justify-center items-center font-medium">
                          Nível 2
                        </div>
                        <div className="mobile:text-sm text-xs text-[var(--grayscale-90)]">
                          Convidar
                        </div>
                        <div className="w-3 h-3 bg-[linear-gradient(to_bottom_right,#fff0_0%,#f000_49.9%,rgba(131,216,16,1)_50%,rgba(23,143,39,1)_100%)] rotate-45" />
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className=" flex bg-linear-2-main tablet:text-base text-sm mobile:w-[100px] w-[62px] tablet:h-10 mobile:h-9 h-8 rounded-lg justify-center items-center font-medium">
                          Nível 2
                        </div>
                        <div className="mobile:text-sm text-xs text-[var(--grayscale-90)]">
                          Convidar
                        </div>
                        <div className="w-3 h-3 bg-[linear-gradient(to_bottom_right,#fff0_0%,#f000_49.9%,rgba(131,216,16,1)_50%,rgba(23,143,39,1)_100%)] rotate-45" />
                      </div>
                    </div>
                    {/* 3 */}
                    <div className="flex gap-3">
                      <div className="flex flex-col justify-center items-center">
                        <div className=" flex bg-linear-4-main tablet:text-base text-sm mobile:w-[100px] w-[62px] tablet:h-10 mobile:h-9 h-8 rounded-lg justify-center items-center font-medium">
                          Nível 3
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className=" flex bg-linear-4-main tablet:text-base text-sm mobile:w-[100px] w-[62px] tablet:h-10 mobile:h-9 h-8 rounded-lg justify-center items-center font-medium">
                          Nível 3
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className=" flex bg-linear-4-main tablet:text-base text-sm mobile:w-[100px] w-[62px] tablet:h-10 mobile:h-9 h-8 rounded-lg justify-center items-center font-medium">
                          Nível 3
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className=" flex bg-linear-4-main tablet:text-base text-sm mobile:w-[100px] w-[62px] tablet:h-10 mobile:h-9 h-8 rounded-lg justify-center items-center font-medium">
                          Nível 3
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/*  */}
                <div className="flex flex-col bg-[var(--grayscale-40)] tablet:gap-6 mobile:gap-4 gap-3 rounded-xl tablet:p-6 mobile:py-4 mobile:px-6 py-3 px-4">
                  <div className="flex mobile:flex-row-reverse flex-col-reverse mobile:gap-4 gap-1 justify-center items-center">
                    <div className="mobile:text-base text-sm">
                      Programa de recomendação exclusivo da plataforma $
                      {environment.platformGroup}-${environment.platformName},
                      recomende aos amigos e ganhe comissões sem limite máximo!
                      Esperamos sinceramente que mais jogadores se juntem a nós!
                    </div>
                    <div className="flex-shrink-0 tablet:w-[150px] tablet:h-36 mobile:w-[142px] mobile:h-20 w-[122px] h-[106px]">
                      <img
                        className="relative mobile:left-[-19px] left-0 mobile:top-0 -top-4 tablet:scale-[1.8] mobile:scale-[1.7] scale-[1.25]"
                        src={`assets/${environment.uVersion}/ic_invite_role.png`}
                        alt="img"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 bg-[var(--grayscale-50)] rounded-xl tablet:py-2 tablet:px-4 mobile:py-2 mobile:px-4 p-2 items-center z-10">
                    <div className="tablet:text-xl mobile:text-lg text-sm mobile:font-medium font-bold">
                      Copie o link para seus amigos!
                    </div>
                    <div className="flex tablet:flex-col mobile:flex-row flex-col gap-2 w-full items-center">
                      <div className="tablet:text-xl mobile:text-sm text-xs text-center w-full bg-[var(--grayscale-30)] rounded-lg mobile:py-3 px-5 py-2 font-normal">
                        {props?.inviteUrl}
                      </div>
                      <button
                        className="linear-3-button flex-shrink-0 mobile:w-40 w-36 tablet:py-2 tablet:px-3 mobile:py-2 mobile:px-4 p-2"
                        onClick={onClickToCopy}
                      >
                        <img
                          className="w-6 h-6 mr-1"
                          src={`assets/${environment.uVersion}/icon_copy.png`}
                          alt="copy"
                        />
                        Copiar Código
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col tablet:gap-9 mobile:gap-4 gap-3 bg-[var(--grayscale-40)] rounded-xl tablet:p-6 mobile:py-4 mobile:px-6 py-3 px-4">
              <div className="flex flex-col gap-3">
                <div className="tablet:text-xl mobile:text-lg text-sm text-center mobile:font-medium font-bold bg-[var(--grayscale-30)] rounded-lg tablet:py-3 px-0 py-2">
                  Programa de referência
                </div>
                <div className="tablet:text-base text-sm font-normal">
                  <QuestionSection1 className="text-[var(--state-info-main)]" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="tablet:text-xl mobile:text-lg text-sm text-center mobile:font-medium font-bold bg-[var(--grayscale-30)] rounded-lg tablet:py-3 px-0 py-2">
                  Estudos de caso
                </div>
                <div className="tablet:text-base text-sm font-normal">
                  <QuestionSection2 isLineFeed={true} />
                </div>
              </div>
            </div>
          </div>
          <div className="text-[var(--grayscale-80)]">
            <QuestionSection3  className="block"/>
          </div>
        </div>
      </div>
    </div>
  );
};
