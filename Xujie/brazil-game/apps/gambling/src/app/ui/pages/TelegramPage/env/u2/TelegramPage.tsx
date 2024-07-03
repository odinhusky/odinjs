import styled from "styled-components";
import { AppLocalStorage } from "../../../../../persistant/localstorage";
import { useAllowLoginRouterRules } from "../../../../router/hooks/useAllowLoginRouterRules";
import { environment } from "../../../../../../environments/environment";
import { BackNavigation } from "../../../../components-bs/BackNavigation/BackNavigation";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import { VIPBorderStyleContainer } from "../../../../components/VIPBorderStyleContainer";
import { AppLocalStorageKey } from "../../../../../persistant/AppLocalStorageKey";
import { renderByUVersion } from "../../../../utils/renderByUVersion";
import { FragmentContainer } from "../../../../components/FragmentContainer";
import cx from 'classnames';
import { Banner } from "../../../../components/Banner";
import { TelegramButton } from "../../../../components-bs/Buttons/TelegramButton";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { appSlice } from "../../../../../reduxStore/appSlice";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import { ITelegramPage } from "../..";
import { TelegrmaNotice } from "../components/TelegramNotice";
import { PageContainer } from "../../../../components-bs/PageContainer";
import { Button } from "../../../../components-bs/Buttons/env/u2/Button";


export const TelegramPage = (props: ITelegramPage) => {
  useAllowLoginRouterRules();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const bannerImg = `internal_banner_telegram${isMobile ? '_m' : isTablet ? '_t' : ''}.png`
  const bannerSrc = `assets/${environment.uVersion}/${environment.mvVersion}/${bannerImg}`

  return (

    <PageContainer className={'relative pb-0'}>

      <Banner imgClassName={`rounded-lg mb-5 md:mb-8 lg:mb-10 `} src={bannerSrc} bannerText={
        <div className={"absolute left-[5%] top-1/2 transform -translate-y-1/2 w-[75%] md:w-[80%]"}>
          <div className={"text-white text-base md:text-2xl lg:text-4xl font-bold leading-6 md:leading-8 lg:leading-10"}>Junte-se ao telegram</div>
          <div className={"text-white text-base md:text-2xl lg:text-4xl font-bold leading-6 md:leading-8 lg:leading-10"}>Revela oficialmente maisatividades de recompensa</div>
        </div>
      } />

      <div className={cx("flex flex-col text-left pb-5 md:pb-0")}>
        <div className="text-white text-base md:text-lg lg:text-xl leading-6 md:leading-7 mb-5">
          {environment.platformGroup} ({environment.platformName}) sinceramente convida você a se juntar ao nosso canal de telegrama e vamos nos comunicar mais profundamente!
        </div>
        <div className="text-[var(--grayscale-70)]">
          <div className="text-sm md:text-base mb-5">Nota especial:</div>
          <TelegrmaNotice />
        </div>
      </div>

      <div className={cx({"w-full sticky pb-10 bottom-0 left-0 bg-[var(--grayscale-10)]":isMobile})}>
        <Button
          onClick={props.handleClickToTelegram}
          className={cx("m-0 md:my-8 md:my-10 text-white text-sm md:text-base lg:text-xl bg-[var(--primary-main)] py-3 w-full rounded-lg", {
            '': isMobile
          })}
          text={'Junte-se'}
        />
      </div>

    </PageContainer>
  )
}
