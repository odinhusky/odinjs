import { environment } from "../../../../../../environments/environment";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import { ITelegramPage } from "../..";
import { TelegrmaNotice } from "../components/TelegramNotice";
import { PageContainer } from "../../../../components-bs/PageContainer";

export const TelegramPage = (props: ITelegramPage) => {
  const { isMobile, isTablet } = useBreakpoint();
  return (
    <PageContainer className="text-[var(--grayscale-100)]">
      {/*Banner*/}
      <div className="relative">
        <img
          src={`assets/${environment.uVersion}/${
            environment.mvVersion
          }/internal_banner_telegram${
            isMobile ? "_m" : isTablet ? "_t" : ""
          }.png`}
          alt="banner"
          id="banner"
          className="w-full"
        />
        <div
          className="absolute tablet:text-[56px] tablet:leading-[64px] mobile:text-4xl text-xl tablet:font-black font-bold left-[5%] top-1/2 -translate-y-1/2 
          mobile:drop-shadow-[0px_4px_4px_#00000040] drop-shadow-[0px_2px_4px_#00000040]"
        >
          <div className="tablet:mb-[10px] mb-1">Junte-se ao telegram</div>
          <div className="tablet:w-[85%] w-[75%]">
            Revela oficialmente maisatividades de recompensa
          </div>
        </div>
      </div>
      {/*  */}
      <div
        className="tablet:text-base text-sm bg-[var(--grayscale-30)] rounded-xl
        tablet:mt-6 mobile:mt-4 mt-3 tablet:py-10 tablet:px-12 mobile:py-8 mobile:px-9 py-4 px-5"
      >
        <div className="text-center bg-[var(--grayscale-50)] rounded-xl py-4 px-3 mobile:p-4 mobile:font-medium font-normal">
          {environment.platformGroup} ({environment.platformName}) sinceramente
          convida você a se juntar ao nosso canal de telegrama e vamos nos
          comunicar mais profundamente!
        </div>
        <div className="flex font-medium tablet:justify-start justify-center items-center mobile:mt-3 mt-2">
          <img
            className="tablet:w-8 tablet:h-8 w-6 h-6 mr-4"
            src={`assets/${environment.uVersion}/icon_warning.png`}
            alt="warn"
          />
          Nota especial
        </div>
        <div className="text-[var(--grayscale-80)] font-normal tablet:mt-1 mt-3">
          <TelegrmaNotice className="tablet:text-base text-sm" />
        </div>
        <button
          className="relative linear-2-button tablet:text-base mobile:text-sm text-base tablet:w-[400px] tablet:h-12 mobile:w-80 mobile:h-10 w-full h-9 
            tablet:mt-7 mobile:mt-5 mt-4 left-1/2 -translate-x-1/2 font-medium"
          onClick={props.handleClickToTelegram}
        >
          Junte-se
        </button>
      </div>
    </PageContainer>
  );
};
