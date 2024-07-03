import styled from "styled-components";
import {useAllowLoginRouterRules} from "../../../../router/hooks/useAllowLoginRouterRules";
import {environment} from "../../../../../../environments/environment";
import {BackNavigation} from "../../../../components-bs/BackNavigation/BackNavigation";
import {usePageNavigate} from "../../../../router/hooks/usePageNavigate";
import {VIPBorderStyleContainer} from "../../../../components/VIPBorderStyleContainer";
import cx from 'classnames';
import {Banner} from "../../../../components/Banner";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import {ITelegramPage} from "../..";
import {TelegrmaNotice} from "../components/TelegramNotice";
import {PageContainer} from "../../../../components-bs/PageContainer";

const GoToTelegram = styled.div`
  cursor: pointer;
  background: linear-gradient(180deg, var(--btn-gradient2-from) 0%, var(--btn-gradient2-to) 100%);
  border-radius: 8px;
  /* width: 300px; */
  /* height: 60px; */
  padding: 14px 96px;
  border-radius: 49px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 32px auto 64px;
`


export const TelegramPage = (props: ITelegramPage) => {
  useAllowLoginRouterRules();
  const {isMobile, isTablet, isDesktop} = useBreakpoint();
  const internalBannerRes = `internal_banner_telegram${isMobile ? '_m' : isTablet ? '_t' : ''}.png`
  const {onClickToIndex} = usePageNavigate();

  return (
    <PageContainer>
      <BackNavigation
        onClick={() => onClickToIndex()}
        title={isMobile && <div className={"w-full text-center font-bold"}>Canal De Telegram</div>}
      />

      <Banner
        imgClassName={cx(
          'rounded-lg',
          `mb-4 ${isMobile || isTablet ? 'mt-0' : 'mt-3'}`,
        )}
        src={`assets/${environment.uVersion}/${environment.mvVersion}/${internalBannerRes}`}
        bannerText={
          <div className={"absolute left-[5%] top-1/2 transform -translate-y-1/2"}>
            <div className={cx('mb-2 text-[var(--text-telegram)] sm:text-xl md:text-2xl font-bold')}>
              Junte-se ao telegram
            </div>
            <div
              className={"text-[var(--text-telegram)] text-base sm:text-2xl md:text-4xl  lg:text-5xl font-bold lg:mb-2"}>
              Revela oficialmente mais
            </div>
            <div
              className={"text-[var(--text-telegram)] text-base sm:text-2xl md:text-4xl lg:text-5xl font-bold"}>
              atividades de recompensa
            </div>
          </div>
        }/>

      <VIPBorderStyleContainer
        style={{
          backgroundColor: '#013E42CC',
          borderWidth: '1px',
          borderColor: 'var(--primary-assistant)',
          padding: isMobile ? '12px 24px' : '32px 54px',
        }}
        className={
          cx("flex flex-col text-left text-white items-start text-sm sm:text-xl")}
      >
        <div className={"text-left w-full mb-4 sm:mb-3"}>
          {environment.platformGroup} ({environment.platformName}) sinceramente convida você a se juntar ao nosso canal
          de telegrama e vamos nos comunicar mais profundamente!
        </div>

        <section className={"flex justify-center items-center visible sm:hidden"}>
          <GoToTelegram
            style={{
              margin: '4px auto 8px',
              padding: '8px 12px'
            }}
            onClick={props.handleClickToTelegram}
            className={"text-white text-sm"}>
            JUNTE-SE</GoToTelegram>
        </section>

        <div className="text-[var(--white)] w-full">
          <TelegrmaNotice/>
        </div>
      </VIPBorderStyleContainer>
      <section className={"flex justify-center items-center invisible sm:visible"}>
        <GoToTelegram onClick={props.handleClickToTelegram} className={"text-white text-lg "}>
          JUNTE-SE</GoToTelegram>
      </section>
    </PageContainer>
  )
}
